import { useEffect, useRef } from "react";

export function WordInput({ value, onChange, onSubmit, onShuffle, shake, focusToken }) {
  const ref = useRef(null);

  // Refocus on mount AND whenever focusToken changes (e.g. after the quit
  // dialog is cancelled, so the player can keep typing).
  useEffect(() => {
    ref.current?.focus();
  }, [focusToken]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
        ref.current?.focus();
      }}
      autoComplete="off"
      className="w-full"
    >
      <div className="flex gap-2 w-full">
        <input
          ref={ref}
          type="text"
          name="wordsmith-input"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          inputMode="text"
          enterKeyHint="go"
          data-1p-ignore
          data-lpignore="true"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Shift") onShuffle();
          }}
          placeholder="Type a word…"
          className={[
            "flex-1 min-w-0 text-center font-display font-bold uppercase tracking-widest",
            "text-2xl sm:text-3xl py-3 sm:py-3.5 rounded-xl",
            "bg-surface-soft text-ink-900",
            "placeholder:text-ink-500 placeholder:normal-case placeholder:font-medium placeholder:tracking-normal",
            "outline-none border-2 border-border focus:border-secondary-500 focus:bg-paper transition",
            shake ? "animate-shake !border-bad" : "",
          ].join(" ")}
        />
        <button
          type="submit"
          aria-label="Submit word"
          className="shrink-0 rounded-xl bg-primary-800 hover:bg-primary-900 active:bg-primary-900 text-paper font-display font-extrabold text-lg sm:text-xl px-5 sm:px-6 shadow-lg shadow-primary-800/25 transition"
        >
          Enter
        </button>
      </div>
    </form>
  );
}
