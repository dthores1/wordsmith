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
export function useGame(words) {
  const [phase, setPhase] = useState("idle");
  const [letters, setLetters] = useState([]);
  const [shuffleNonce, setShuffleNonce] = useState(0); // bumps on every deal/shuffle to retrigger tile animations
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]); // [{ word, points }]
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);   // { kind: 'good'|'bad', message?, points }
  const [paused, setPaused] = useState(false);      // halts the timer (e.g. quit confirm modal)
  const feedbackId = useRef(0);

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
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, timeLeft, paused]);

  // ---- actions --------------------------------------------------------------

  const start = useCallback(() => {
    setLetters(shuffle(pickLetterSet().split("")));
    setShuffleNonce((n) => n + 1);
    setCountdown(COUNTDOWN_DURATION);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setFoundWords([]);
    setInput("");
    setFeedback(null);
    setPaused(false);
    setPhase("countdown");
  }, []);

  const reset = useCallback(() => setPhase("idle"), []);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  // Abandon current game and return to title.
  const quit = useCallback(() => {
    setPaused(false);
    setPhase("idle");
  }, []);

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

  // Restrict typing to letters that exist (and respecting duplicate counts).
  const updateInput = useCallback(
    (raw) => {
      if (phase !== "playing") return;
      const cleaned = raw.toLowerCase().replace(/[^a-z]/g, "");
      // Trim from the right while the running prefix can't be spelled
      let trimmed = cleaned;
      while (trimmed.length > 0 && !canSpell(trimmed, letterCounts)) {
        trimmed = trimmed.slice(0, -1);
      }
      setInput(trimmed);
      // If we had to drop a character, signal it visually
      if (trimmed.length < cleaned.length) {
        flashFeedback({ kind: "bad", shake: true });
      }
    },
    [phase, letterCounts, flashFeedback]
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

    const isWord = !!(words && Object.prototype.hasOwnProperty.call(words, word));
    if (isWord) {
      const points = scoreForWord(word.length);
      setScore((s) => s + points);
      setFoundWords((prev) => [{ word, points }, ...prev]);
      flashFeedback({ kind: "good", points });
    } else {
      setScore((s) => s + INCORRECT_WORD_PENALTY);
      flashFeedback({ kind: "bad", points: INCORRECT_WORD_PENALTY, message: ERROR_MSGS.notAWord });
    }
  }, [phase, paused, input, foundSet, letterCounts, words, flashFeedback]);

  return {
    phase,
    letters,
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
