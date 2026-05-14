import { useEffect, useState } from "react";

export function GameOverScreen({
  score,
  foundWords,
  targetWord,
  isHighScore,
  leaderboardRank,
  onSubmitScore,
  onPlayAgain,
  onShowLeaderboard,
}) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  // Two-step gate so a stray tap on Play Again doesn't lose a not-yet-saved
  // name. Only triggers when there's actually unsaved text in the field.
  const [confirmingPlayAgain, setConfirmingPlayAgain] = useState(false);

  // Unmount the "Score saved" toast a tick after its fade-out finishes.
  useEffect(() => {
    if (savedAt == null) return;
    const id = setTimeout(() => setSavedAt(null), 1500);
    return () => clearTimeout(id);
  }, [savedAt]);

  const longestWord = foundWords.reduce(
    (best, w) => (w.word.length > best.length ? w.word : best),
    ""
  );

  const foundTarget = !!targetWord && foundWords.some((w) => w.word === targetWord);
  const canSave = score > 0 && !submitted;
  const hasUnsavedName = canSave && name.trim().length > 0;
  const targetFlavor = getTargetFlavor({
    foundTarget,
    foundWords,
    score,
    targetLength: targetWord.length,
  });

  const handlePlayAgain = () => {
    if (hasUnsavedName) {
      setConfirmingPlayAgain(true);
      return;
    }
    onPlayAgain();
  };

  return (
    <div className="flex flex-col items-center text-center gap-6 py-2">
      <div className="space-y-1">
        <p className="font-label text-ink-500 uppercase tracking-widest text-sm">
          Game over
        </p>
        <h1 className="font-display text-5xl sm:text-6xl font-extrabold text-ink-900">
          {score}{" "}
          <span className="text-ink-500 text-3xl font-bold">pts</span>
        </h1>
      </div>

      <div
        className={
          "grid gap-3 w-full max-w-md " +
          (isHighScore ? "grid-cols-3" : "grid-cols-2")
        }
      >
        <Stat label="Words" value={foundWords.length} />
        <Stat
          label="Best word"
          value={longestWord ? longestWord.toUpperCase() : "—"}
          small={!!longestWord}
        />
        {isHighScore && (
          <div className="rounded-xl border bg-secondary-50 border-secondary-300 px-3 py-3 text-center">
            <div className="font-display font-extrabold text-primary-800 text-2xl leading-tight">
              #{leaderboardRank}
            </div>
            <div className="font-label text-[11px] text-primary-800/70 uppercase tracking-widest mt-1">
              Rank
            </div>
          </div>
        )}
      </div>

      {targetWord && (
        <div
          className={
            "w-full max-w-md rounded-2xl border px-5 py-4 text-center " +
            (foundTarget
              ? "bg-secondary-50 border-secondary-300"
              : "bg-surface-soft border-border")
          }
        >
          <p className="font-label text-[11px] uppercase tracking-widest text-ink-500">
            Target word
          </p>
          <p className="font-display font-extrabold text-3xl sm:text-4xl text-ink-900 uppercase tracking-wider mt-1">
            {targetWord}
          </p>
          <p className={"text-sm mt-2 " + (foundTarget ? "text-good font-semibold" : "text-ink-700")}>
            {targetFlavor}
          </p>
        </div>
      )}

      {/* ---- save section ------------------------------------------------ */}
      {canSave && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitScore(name || "Anonymous", longestWord || null);
            setSubmitted(true);
            setSavedAt(Date.now());
            setConfirmingPlayAgain(false);
          }}
          className="w-full max-w-sm space-y-3"
        >
          <p className="text-ink-900 font-semibold">
            {isHighScore ? "New high score! Enter your name" : "Save your score"}
          </p>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 16))}
              placeholder="Your name"
              className="flex-1 rounded-lg bg-surface-soft text-ink-900 px-4 py-2.5 outline-none border-2 border-border focus:border-secondary-500 focus:bg-paper placeholder:text-ink-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary-800 hover:bg-primary-900 text-paper font-label font-bold px-5 shadow-lg shadow-primary-800/25 transition"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {/* Post-save confirmation. Animates in/out so it feels like a moment of
          celebration rather than a permanent stat tile. Once it fades, the
          replay section below naturally takes the visual lead. */}
      {savedAt != null && (
        <div
          key={savedAt}
          className="w-full max-w-sm rounded-xl bg-good/10 border border-good/30 px-5 py-3 text-good font-semibold flex items-center justify-center gap-2 animate-toast-fade"
        >
          <span aria-hidden="true">✓</span>
          <span>{isHighScore ? "High score saved" : "Score saved"}</span>
        </div>
      )}

      {/* ---- replay section --------------------------------------------- */}
      {/* Extra top spacing separates this from the save controls so a quick
          rapid-tap after the form doesn't land on Play Again by mistake. */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3 mt-4 sm:mt-6">
        {confirmingPlayAgain ? (
          <div className="w-full rounded-lg bg-surface-soft border border-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
            <span className="text-ink-700">
              "{name.trim()}" hasn't been saved.
            </span>
            <span className="flex gap-4 shrink-0">
              <button
                type="button"
                onClick={() => setConfirmingPlayAgain(false)}
                className="text-ink-700 hover:text-ink-900 font-label font-semibold underline-offset-4 hover:underline transition"
              >
                Keep editing
              </button>
              <button
                type="button"
                onClick={onPlayAgain}
                className="text-ink-500 hover:text-bad font-label font-semibold underline-offset-4 hover:underline transition"
              >
                Discard
              </button>
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePlayAgain}
            aria-disabled={hasUnsavedName ? "true" : undefined}
            className={
              "w-full rounded-full font-label font-bold text-base py-3 transition " +
              (submitted
                ? "bg-primary-800 hover:bg-primary-900 text-paper shadow-lg shadow-primary-800/25"
                : hasUnsavedName
                  ? "bg-surface-soft text-ink-500 border border-border"
                  : canSave
                    ? "bg-paper text-ink-900 border border-border-strong hover:bg-secondary-50 hover:border-secondary-400"
                    : "bg-primary-800 hover:bg-primary-900 text-paper shadow-lg shadow-primary-800/25")
            }
          >
            Play again
          </button>
        )}

        <button
          type="button"
          onClick={onShowLeaderboard}
          className="text-ink-500 hover:text-ink-900 font-label font-semibold text-sm underline-offset-4 hover:underline transition"
        >
          View leaderboard
        </button>
      </div>

      {foundWords.length > 0 && (
        <div className="w-full max-w-md mt-4 text-left">
          <h2 className="font-label text-[11px] uppercase tracking-widest text-ink-500 mb-2">
            All words found
          </h2>
          <ul className="flex flex-wrap gap-1.5">
            {foundWords.map(({ word, points }) => (
              <li
                key={word}
                className="bg-surface-soft border border-border rounded-full pl-3 pr-2 py-1 text-sm text-ink-900 inline-flex items-center gap-2"
              >
                <span className="uppercase tracking-wide">{word}</span>
                <span className="bg-primary-800 text-paper text-[10px] font-bold tabular-nums rounded-full px-1.5 py-0.5">
                  +{points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Picks a one-liner under the target-word reveal. Order matters: more specific
// signals (found the word, came one letter short) come before generic
// fallbacks. Tuned for an 8-letter target but works for any length.
function getTargetFlavor({ foundTarget, foundWords, score, targetLength }) {
  if (foundTarget) return "Outstanding find.";
  const longest = foundWords.reduce((m, w) => Math.max(m, w.word.length), 0);
  if (longest >= targetLength - 1) return "So close — one letter short.";
  if (foundWords.length >= 10) return "You were close on this one.";
  if (foundWords.length === 0) return "Tough rack — happens to everyone.";
  if (score < 30) return "That one was tricky.";
  return "Missed this one? Try spotting it next round.";
}

function Stat({ label, value, small, highlight }) {
  return (
    <div
      className={
        "rounded-xl border px-3 py-3 " +
        (highlight
          ? "bg-secondary-50 border-secondary-300"
          : "bg-surface-soft border-border")
      }
    >
      <div
        className={
          "font-display font-extrabold text-ink-900 leading-tight " +
          (small ? "text-base" : "text-2xl")
        }
      >
        {value}
      </div>
      <div className="font-label text-[11px] text-ink-500 uppercase tracking-widest mt-1">
        {label}
      </div>
    </div>
  );
}
