import { GAME_DURATION } from "../game/constants";
import { QuitButton } from "./QuitButton";

export function GameHeader({ timeLeft, score, wordsFound, onQuit }) {
  const pct = Math.max(0, Math.min(1, timeLeft / GAME_DURATION));
  const urgent = timeLeft <= 10;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <TimerRing seconds={timeLeft} pct={pct} urgent={urgent} />
        <QuitButton onClick={onQuit} />
      </div>
      <div className="flex gap-6">
        <Stat label="Score" value={score} />
        <Stat label="Words" value={wordsFound} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-right">
      <div className="font-display text-3xl sm:text-4xl font-extrabold text-ink-900 tabular-nums leading-none">
        {value}
      </div>
      <div className="font-label text-[11px] uppercase tracking-widest text-ink-500 mt-1">
        {label}
      </div>
    </div>
  );
}

function TimerRing({ seconds, pct, urgent }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const stroke = urgent ? "var(--color-bad)" : "var(--color-primary-800)";

  return (
    <div className={"relative " + (urgent ? "animate-pulse-fast" : "")}>
      <svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--color-border)" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={r}
          fill="none"
          stroke={stroke}
          strokeOpacity={urgent ? 1 : 0.45}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 200ms, stroke-opacity 300ms" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={
            "font-display font-bold tabular-nums text-lg " +
            (urgent ? "text-bad" : "text-ink-700")
          }
        >
          {seconds}
        </span>
      </div>
    </div>
  );
}
