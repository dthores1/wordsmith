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
      }}
      className="w-full"
    >
      <input
        ref={ref}
        type="text"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        inputMode="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Shift") onShuffle();
        }}
        placeholder="Type a word…"
        className={[
          "w-full text-center font-display font-bold uppercase tracking-widest",
          "text-2xl sm:text-3xl py-3 sm:py-3.5 rounded-xl",
          "bg-surface-soft text-ink-900",
          "placeholder:text-ink-500 placeholder:normal-case placeholder:font-medium placeholder:tracking-normal",
          "outline-none border-2 border-border focus:border-secondary-500 focus:bg-paper transition",
          shake ? "animate-shake !border-bad" : "",
        ].join(" ")}
      />
    </form>
  );
}
