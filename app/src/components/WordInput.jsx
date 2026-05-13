import { useEffect } from "react";

// Renders the current word as a styled display rather than a real <input>.
// Why: a real <input> on mobile invites the OS keyboard, IME composition
// (Pixel/Gboard cursor jumps), and iOS autofill heuristics (QuickType bar,
// keyboard-pushes-page). A display div sidesteps all three. Physical and
// Bluetooth keyboards still work via a window-level keydown listener.
export function WordInput({ value, onChange, onSubmit, onShuffle, shake, disabled }) {
  useEffect(() => {
    if (disabled) return;
    const handleKeyDown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        onChange(value.slice(0, -1));
      } else if (e.key === "Shift") {
        onShuffle();
      } else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        onChange(value + e.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [value, onChange, onSubmit, onShuffle, disabled]);

  const handleBackspace = () => onChange(value.slice(0, -1));

  return (
    <div className="flex gap-2 w-full items-stretch">
      <button
        type="button"
        tabIndex={-1}
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleBackspace}
        disabled={value.length === 0}
        aria-label="Delete last letter"
        className="shrink-0 rounded-xl bg-surface-soft hover:bg-secondary-50 active:bg-secondary-100 text-ink-700 border-2 border-border hover:border-secondary-400 disabled:opacity-40 disabled:hover:bg-surface-soft disabled:hover:border-border font-display font-bold text-2xl px-4 sm:px-5 transition"
      >
        ⌫
      </button>
      <div
        role="textbox"
        aria-label="Current word"
        aria-live="polite"
        className={[
          "flex-1 min-w-0 text-center font-display font-bold uppercase tracking-widest",
          "text-2xl sm:text-3xl py-3 sm:py-3.5 rounded-xl",
          "bg-surface-soft text-ink-900",
          "outline-none border-2 border-border transition",
          "flex items-center justify-center select-none",
          shake ? "animate-shake !border-bad" : "",
        ].join(" ")}
      >
        {value || (
          <span className="text-ink-500 normal-case font-medium tracking-normal">
            Tap letters or type
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onSubmit}
        aria-label="Submit word"
        className="shrink-0 rounded-xl bg-primary-800 hover:bg-primary-900 active:bg-primary-900 text-paper font-display font-extrabold text-lg sm:text-xl px-5 sm:px-6 shadow-lg shadow-primary-800/25 transition"
      >
        Enter
      </button>
    </div>
  );
}
