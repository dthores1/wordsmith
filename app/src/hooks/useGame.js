import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  COUNTDOWN_DURATION,
  ERROR_MSGS,
  GAME_DURATION,
  INCORRECT_WORD_PENALTY,
  MIN_WORD_LENGTH,
} from "../game/constants";
import { canSpell, countLetters, shuffle } from "../game/letters";
import { pickLetterSet } from "../game/letterSetPicker";
import { scoreForWord } from "../game/scoring";

// Phases:
//   "idle"       — title screen
//   "countdown"  — 3 → 1 before play
//   "playing"    — game in progress
//   "gameover"   — final screen
export function useGame(words, racks, track) {
  const [phase, setPhase] = useState("idle");
  const [letters, setLetters] = useState([]);
  const [targetWord, setTargetWord] = useState(""); // the unshuffled 8-letter source word (revealed on game over)
  const [shuffleNonce, setShuffleNonce] = useState(0); // bumps on every deal/shuffle to retrigger tile animations
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]); // [{ word, points }]
  const [invalidWords, setInvalidWords] = useState([]); // dictionary misses (the player guessed a non-word)
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);   // { kind: 'good'|'bad', message?, points }
  const [paused, setPaused] = useState(false);      // halts the timer (e.g. quit confirm modal)
  const feedbackId = useRef(0);

  // Mirror frequently-changing state into refs so analytics events and the
  // timer effect can read the latest values without forcing dep-array churn.
  const foundWordsRef = useRef(foundWords);
  foundWordsRef.current = foundWords;
  const invalidWordsRef = useRef(invalidWords);
  invalidWordsRef.current = invalidWords;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  const letterCounts = useMemo(() => countLetters(letters), [letters]);
  const foundSet = useMemo(() => new Set(foundWords.map((w) => w.word)), [foundWords]);

  // ---- timers ---------------------------------------------------------------

  // Countdown 3..1, hold "Go!" (0) for one beat, then start play.
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown < 0) {
      setPhase("playing");
      return;
    }
    const id = setTimeout(() => setCountdown((n) => n - 1), 700);
    return () => clearTimeout(id);
  }, [phase, countdown]);

  // Main game timer. Pausing tears down the pending tick; resuming starts a
  // fresh 1s tick (so up to ~1s of in-flight progress is lost per pause —
  // acceptable for a quit-confirm dialog).
  useEffect(() => {
    if (phase !== "playing" || paused) return;
    if (timeLeft <= 0) {
      setPhase("gameover");
      track?.("game_finished", {
        valid_words: foundWordsRef.current.map((w) => w.word),
        invalid_words: invalidWordsRef.current,
        score: scoreRef.current,
      });
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, paused, track]);

  // ---- actions --------------------------------------------------------------

  const start = useCallback(() => {
    const word = pickLetterSet(racks);
    setTargetWord(word);
    setLetters(shuffle(word.split("")));
    setShuffleNonce((n) => n + 1);
    setCountdown(COUNTDOWN_DURATION);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setFoundWords([]);
    setInvalidWords([]);
    setInput("");
    setFeedback(null);
    setPaused(false);
    setPhase("countdown");
    track?.("game_started");
  }, [racks, track]);

  const reset = useCallback(() => setPhase("idle"), []);

  const pause = useCallback(() => {
    setPaused(true);
    track?.("game_paused");
  }, [track]);
  const resume = useCallback(() => setPaused(false), []);

  // Abandon current game and return to title.
  const quit = useCallback(() => {
    track?.("quit_game", {
      valid_words: foundWordsRef.current.map((w) => w.word),
      invalid_words: invalidWordsRef.current,
      score: scoreRef.current,
      seconds_remaining: timeLeftRef.current,
    });
    setPaused(false);
    setPhase("idle");
  }, [track]);

  const shuffleLetters = useCallback(() => {
    setLetters((prev) => shuffle(prev));
    setShuffleNonce((n) => n + 1);
  }, []);

  const flashFeedback = useCallback((next) => {
    const id = ++feedbackId.current;
    setFeedback(next);
    setTimeout(() => {
      // Only clear if this is still the latest message
      if (feedbackId.current === id) setFeedback(null);
    }, 900);
  }, []);

  // Accept whatever the user types (lowercased, letters only). We deliberately
  // do NOT trim invalid prefixes here: shrinking the controlled value mid-keystroke
  // throws off the Android/Gboard IME composition span and makes the cursor jump
  // backwards. canSpell is enforced on submit instead. We still flash a "bad"
  // shake when the newly-added character would make the running prefix invalid,
  // so the player gets immediate feedback without us mutating their value.
  const updateInput = useCallback(
    (raw) => {
      if (phase !== "playing") return;
      const cleaned = raw.toLowerCase().replace(/[^a-z]/g, "");
      const grew = cleaned.length > input.length;
      setInput(cleaned);
      if (grew && !canSpell(cleaned, letterCounts)) {
        flashFeedback({ kind: "bad", shake: true });
      }
    },
    [phase, input, letterCounts, flashFeedback]
  );

  const submitWord = useCallback(() => {
    if (phase !== "playing" || paused) return;
    const word = input.trim().toLowerCase();
    setInput("");

    if (!word) {
      flashFeedback({ kind: "bad", message: ERROR_MSGS.noWord });
      return;
    }
    if (word.length < MIN_WORD_LENGTH) {
      flashFeedback({ kind: "bad", message: ERROR_MSGS.tooShort });
      return;
    }
    if (foundSet.has(word)) {
      flashFeedback({ kind: "bad", message: ERROR_MSGS.alreadyPlayed });
      return;
    }
    if (!canSpell(word, letterCounts)) {
      flashFeedback({ kind: "bad", message: ERROR_MSGS.invalidLetters });
      return;
    }

    const isWord = !!(words && words.has(word));
    if (isWord) {
      const points = scoreForWord(word.length);
      setScore((s) => s + points);
      setFoundWords((prev) => [{ word, points }, ...prev]);
      flashFeedback({ kind: "good", points });
    } else {
      setScore((s) => s + INCORRECT_WORD_PENALTY);
      setInvalidWords((prev) => [...prev, word]);
      flashFeedback({ kind: "bad", points: INCORRECT_WORD_PENALTY, message: ERROR_MSGS.notAWord });
    }
  }, [phase, paused, input, foundSet, letterCounts, words, flashFeedback]);

  return {
    phase,
    letters,
    targetWord,
    shuffleNonce,
    countdown,
    timeLeft,
    score,
    foundWords,
    input,
    feedback,
    paused,
    start,
    reset,
    quit,
    pause,
    resume,
    shuffleLetters,
    updateInput,
    submitWord,
  };
}
