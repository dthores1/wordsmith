export function Countdown({ value }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <p className="font-label uppercase tracking-widest text-ink-500 text-sm">
        Get ready…
      </p>
      <div
        key={value}
        className="font-display font-extrabold text-primary-800 text-[8rem] sm:text-[12rem] leading-none animate-pulse-fast"
      >
        {value > 0 ? value : "Go!"}
      </div>
    </div>
  );
}
