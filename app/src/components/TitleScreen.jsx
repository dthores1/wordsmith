export function TitleScreen({ onStart, dictionaryLoading }) {
  return (
    <div className="flex flex-col items-center text-center gap-8 py-2 sm:py-6">
      <header className="space-y-3">
        <h1 className="font-display text-5xl sm:text-7xl font-extrabold tracking-tight text-ink-900">
          Word<span className="text-secondary-500">smith</span>
        </h1>
        <p className="text-ink-700 text-base sm:text-lg max-w-md mx-auto">
          Make as many words as you can from{" "}
          <span className="font-semibold text-ink-900">8 random letters</span> in <span className="font-semibold text-ink-900">60 seconds</span>. Longer words score more.
        </p>
        <p className="text-ink-700 text-base sm:text-md max-w-md mx-auto">
          Invalid words lose points.
        </p>        
      </header>

      <div className="grid grid-cols-2 gap-3 max-w-xs w-full">
        <Stat label="Time" value="60s" />
        <Stat label="Letters" value="8" />
      </div>

      <button
        type="button"
        onClick={onStart}
        disabled={dictionaryLoading}
        className="rounded-full bg-primary-800 hover:bg-primary-900 active:bg-primary-950 disabled:opacity-50 disabled:cursor-not-allowed text-paper font-label font-bold text-lg px-10 py-3.5 shadow-lg shadow-primary-800/25 transition"
      >
        {dictionaryLoading ? "Loading dictionary…" : "Play"}
      </button>

      <ul className="text-sm text-ink-500 space-y-1.5 max-w-sm">
        <li>· Type a word, hit <kbd className="rounded bg-surface-soft border border-border px-1.5 py-0.5 text-xs text-ink-900 font-mono">Enter</kbd> to submit</li>
        <li>· Tap <span className="text-ink-900 font-semibold">Shuffle</span> (or press <kbd className="rounded bg-surface-soft border border-border px-1.5 py-0.5 text-xs text-ink-900 font-mono">Shift</kbd>) to rearrange tiles</li>
        <li>· Each set has at least one 8-letter word — find it for 132 pts</li>
      </ul>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-surface-soft border border-border px-3 py-3">
      <div className="font-display text-xl sm:text-2xl font-extrabold text-ink-900 leading-tight">{value}</div>
      <div className="font-label text-[11px] text-ink-500 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}
