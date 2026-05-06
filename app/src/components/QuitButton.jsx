import stopIcon from "../assets/stop-button.svg";

// Square icon button that triggers a quit. Hover scales the icon and
// reveals a styled tooltip below the button (no native `title` so it's
// snappy and matches the design).
export function QuitButton({ onClick }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault() /* keep input focus */}
      onClick={onClick}
      aria-label="Quit game"
      className={
        "group relative inline-flex items-center justify-center " +
        "w-10 h-10 rounded-full " +
        "transition hover:bg-bad/10"
      }
    >
      <img
        src={stopIcon}
        alt=""
        className="w-7 h-7 transition-transform duration-150 group-hover:scale-110 group-hover:brightness-90 group-active:scale-95"
        draggable={false}
      />
      <Tooltip>Quit game</Tooltip>
    </button>
  );
}

function Tooltip({ children }) {
  return (
    <span
      role="tooltip"
      className={
        "pointer-events-none select-none " +
        "absolute top-full left-1/2 -translate-x-1/2 mt-2 " +
        "px-2 py-1 rounded-md whitespace-nowrap " +
        "font-label text-[11px] font-semibold tracking-wide " +
        "bg-ink-900 text-paper shadow-md " +
        "opacity-0 translate-y-[-2px] " +
        "group-hover:opacity-100 group-hover:translate-y-0 " +
        "group-focus-visible:opacity-100 group-focus-visible:translate-y-0 " +
        "transition duration-120 ease-out z-20"
      }
    >
      {children}
      <span
        aria-hidden="true"
        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-ink-900 rotate-45"
      />
    </span>
  );
}
