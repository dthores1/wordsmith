import { countLetters } from "../game/letters";

// For each input character, find which tile consumes it (left-to-right,
// no tile reused). Returns a map: tileIndex -> inputIndex.
function buildTileToInputMap(letters, input) {
  const map = new Map();
  const usedTiles = new Set();
  for (let inputIdx = 0; inputIdx < input.length; inputIdx++) {
    const ch = input[inputIdx].toLowerCase();
    for (let tileIdx = 0; tileIdx < letters.length; tileIdx++) {
      if (!usedTiles.has(tileIdx) && letters[tileIdx] === ch) {
        usedTiles.add(tileIdx);
        map.set(tileIdx, inputIdx);
        break;
      }
    }
  }
  return map;
}

export function LetterTiles({ letters, input, shuffleNonce, onAddLetter, onRemoveAt, onShuffle }) {
  const tileToInput = buildTileToInputMap(letters, input);
  const counts = countLetters(letters);

  const handleTap = (tileIdx, letter) => {
    if (tileToInput.has(tileIdx)) {
      onRemoveAt(tileToInput.get(tileIdx));        // toggle off
      return;
    }
    const inInput = (input.match(new RegExp(letter, "g")) || []).length;
    if (inInput >= (counts[letter] || 0)) return;  // exhausted
    onAddLetter(letter);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-8 gap-1.5 sm:gap-2.5">
        {letters.map((letter, i) => {
          const isConsumed = tileToInput.has(i);
          const inInput = (input.match(new RegExp(letter, "g")) || []).length;
          const exhausted = !isConsumed && inInput >= (counts[letter] || 0);
          return (
            <button
              key={`${shuffleNonce}-${i}`}
              type="button"
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault() /* keep focus on the input */}
              onClick={() => handleTap(i, letter)}
              disabled={exhausted}
              style={{ animationDelay: `${i * 35}ms` }}
              className={[
                "animate-tile-pop",
                "aspect-square rounded-xl font-display font-extrabold uppercase",
                "text-2xl sm:text-4xl select-none",
                "flex items-center justify-center",
                "shadow-[0_2px_0_rgba(15,23,42,0.10),0_4px_12px_-4px_rgba(15,23,42,0.18)]",
                "border transition-all duration-150",
                isConsumed
                  ? "bg-primary-800 text-paper border-primary-900"
                  : "bg-paper text-ink-900 border-border hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(15,23,42,0.10),0_10px_20px_-6px_rgba(30,58,138,0.25)] hover:bg-secondary-50",
                exhausted ? "opacity-40 cursor-not-allowed hover:translate-y-0 hover:shadow-[0_2px_0_rgba(15,23,42,0.10),0_4px_12px_-4px_rgba(15,23,42,0.18)] hover:bg-paper" : "active:translate-y-0 active:scale-95",
              ].join(" ")}
              aria-label={`Letter ${letter}${isConsumed ? ", in current word — click to remove" : ""}`}
            >
              {letter}
            </button>
          );
        })}
      </div>
      <div className="flex justify-center">
        <ShuffleButton onClick={onShuffle} />
      </div>
    </div>
  );
}

function ShuffleButton({ onClick }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 font-label font-semibold text-sm " +
        "px-4 py-2 rounded-full bg-paper text-ink-700 " +
        "border border-border-strong " +
        "hover:bg-secondary-50 hover:text-primary-800 hover:border-secondary-400 " +
        "active:scale-95 transition shadow-sm"
      }
      aria-label="Shuffle letters"
    >
      <ShuffleIcon /> Shuffle
    </button>
  );
}

function ShuffleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 3h5v5" />
      <path d="M4 20l16.2-16.2" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l5.2 5.2" />
      <path d="M4 4l5 5" />
    </svg>
  );
}
