import { useEffect, useRef } from "react";

// Overlays the gameplay surface with a confirm dialog. Esc cancels.
// Cancel button gets autofocus so a quick Enter doesn't accidentally quit.
export function QuitConfirmModal({ showWarning, onCancel, onConfirm }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-paper/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quit-title"
    >
      <div className="bg-paper border border-border rounded-2xl shadow-xl px-6 py-6 w-[min(20rem,calc(100%-2rem))] text-center space-y-4">
        <h2
          id="quit-title"
          className="font-display font-extrabold text-2xl text-ink-900"
        >
          Quit game?
        </h2>
        {showWarning && (
          <p className="text-sm text-ink-700">
            Your current score will be lost.
          </p>
        )}
        <div className="flex gap-2 pt-1">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full bg-surface-soft hover:bg-secondary-50 text-ink-900 border border-border-strong hover:border-secondary-400 font-label font-bold text-sm py-2.5 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-bad hover:bg-bad/90 text-paper font-label font-bold text-sm py-2.5 transition shadow-md"
          >
            Quit game
          </button>
        </div>
      </div>
    </div>
  );
}
