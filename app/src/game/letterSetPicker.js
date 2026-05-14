import { STORAGE_KEY_LETTERSET_HISTORY } from "./constants";

function readUsed() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY_LETTERSET_HISTORY) || "[]"));
  } catch {
    return new Set();
  }
}

function writeUsed(set) {
  localStorage.setItem(STORAGE_KEY_LETTERSET_HISTORY, JSON.stringify([...set]));
}

// `racks` comes from useDictionary — a precomputed list of playable 8-letter
// words (see scripts/generate-playable-racks.mjs). Picks one the player hasn't
// seen yet; once they've cycled through all of them, the history resets.
export function pickLetterSet(racks) {
  let used = readUsed();
  if (used.size >= racks.length) used = new Set();

  const remaining = racks.filter((s) => !used.has(s));
  const choice = remaining[Math.floor(Math.random() * remaining.length)];

  used.add(choice);
  writeUsed(used);
  return choice;
}
