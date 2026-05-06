import { LETTER_SETS } from "./letterSets";
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

// Pick a set the player hasn't seen yet (until they've cycled through all of them).
export function pickLetterSet() {
  let used = readUsed();
  if (used.size >= LETTER_SETS.length) used = new Set();

  const remaining = LETTER_SETS.filter((s) => !used.has(s));
  const choice = remaining[Math.floor(Math.random() * remaining.length)];

  used.add(choice);
  writeUsed(used);
  return choice;
}
