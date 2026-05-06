export function FoundWordsList({ words }) {
  if (words.length === 0) {
    return (
      <p className="text-sm text-ink-400 italic text-center py-4">
        No words yet — start typing!
      </p>
    );
  }

  return (
    <div>
      <h2 className="font-label text-[11px] uppercase tracking-widest text-ink-500 mb-2">
        Found ({words.length})
      </h2>
      <ul className="flex flex-wrap gap-1.5">
        {words.map(({ word, points }) => (
          <li
            key={word}
            className="bg-surface-soft border border-border rounded-full pl-3 pr-2 py-1 text-sm font-medium text-ink-900 inline-flex items-center gap-2"
          >
            <span className="uppercase tracking-wide">{word}</span>
            <span className="bg-primary-800 text-paper text-[10px] font-bold tabular-nums rounded-full px-1.5 py-0.5">
              +{points}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
