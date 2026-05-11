import { useEffect, useState } from "react";

export function GameOverScreen({
  score,
  foundWords,
  isHighScore,
  onSubmitScore,
  onPlayAgain,
  onShowLeaderboard,
}) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

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
          <div className="rounded-xl border bg-secondary-50 border-secondary-300 px-3 py-3 flex items-center justify-center text-center">
            <span className="font-display font-extrabold text-primary-800 text-sm sm:text-base leading-tight tracking-wide uppercase">
              New High Score
            </span>
          </div>
        )}
      </div>

      {score > 0 && !submitted && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitScore(name || "Anonymous", longestWord || null);
            setSubmitted(true);
            setSavedAt(Date.now());
          }}
          className="w-full max-w-sm space-y-3"
        >
          <p className="text-ink-900 font-semibold">
            {isHighScore ? "New high score! Add your name:" : "Save your score:"}
          </p>
          <div className="flex gap-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 16))}
              placeholder="Your name"
              className="flex-1 rounded-lg bg-surface-soft text-ink-900 px-4 py-2.5 outline-none border-2 border-border focus:border-secondary-500 focus:bg-paper placeholder:text-ink-500"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary-800 hover:bg-primary-900 text-paper font-label font-bold px-5"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {savedAt != null && (
        <p
          key={savedAt}
          className="text-good font-semibold animate-toast-fade"
        >
          Score saved ✓
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          type="button"
          onClick={onPlayAgain}
          className="flex-1 rounded-full bg-primary-800 hover:bg-primary-900 text-paper font-label font-bold text-base py-3 shadow-lg shadow-primary-800/25 transition"
        >
          Play again
        </button>
        <button
          type="button"
          onClick={onShowLeaderboard}
          className="flex-1 rounded-full bg-surface-soft hover:bg-secondary-50 text-ink-900 border border-border-strong hover:border-secondary-400 font-label font-bold text-base py-3 transition"
        >
          Leaderboard
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
