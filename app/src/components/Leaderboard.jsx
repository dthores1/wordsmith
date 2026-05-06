import medalIcon from "../assets/leaderboard-medal.svg";

export function Leaderboard({ entries, loading, error, onRefresh, onBack }) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-2 w-full">
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-ink-900 inline-flex items-center gap-3">
        <img src={medalIcon} alt="" className="w-10 h-10 sm:w-12 sm:h-12" />
        Leaderboard
      </h1>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-8 h-8 rounded-full border-2 border-border border-t-primary-800 animate-spin" />
          <p className="text-ink-500">Loading leaderboard…</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-bad font-semibold">Couldn't load leaderboard.</p>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-full bg-surface-soft hover:bg-secondary-50 text-ink-900 border border-border-strong hover:border-secondary-400 font-label font-bold text-sm px-5 py-2 transition"
          >
            Try again
          </button>
        </div>
      ) : entries.length === 0 ? (
        <p className="text-ink-500">No scores yet. Be the first to play!</p>
      ) : (
        <ol className="w-full max-w-md divide-y divide-border rounded-xl overflow-hidden bg-surface-soft border border-border">
          {entries.map((entry, i) => (
            <li
              key={i}
              className={
                "flex items-center gap-4 px-4 py-3 " +
                (i === 0 ? "bg-secondary-50" : "")
              }
            >
              <span className="font-display font-extrabold text-2xl text-ink-400 w-8 tabular-nums">
                {i + 1}
              </span>
              <div className="flex-1 text-left">
                <div className="font-display font-bold text-ink-900 uppercase tracking-wide">
                  {entry.name}
                </div>
                <div className="text-xs text-ink-500">
                  {new Date(entry.date).toLocaleDateString()} ·{" "}
                  {entry.wordsFound} words
                </div>
              </div>
              <div className="font-display font-extrabold text-ink-900 text-xl tabular-nums">
                {entry.score}
              </div>
            </li>
          ))}
        </ol>
      )}

      <button
        type="button"
        onClick={onBack}
        className="rounded-full bg-primary-800 hover:bg-primary-900 text-paper font-label font-bold text-base px-8 py-3 shadow-lg shadow-primary-800/25 transition"
      >
        Play again
      </button>
    </div>
  );
}
