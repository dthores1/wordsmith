import { STORAGE_KEY_LETTERSET_HISTORY } from "./constants";

// Derive every 8-letter word from the loaded dictionary once, then cache by
// reference. Filtering ~170k entries down to ~28k 8-letter words takes a few
// ms; running it once per page-load is well under one frame.
let cachedFromWords = null;
let cachedSets = null;

function getLetterSets(words) {
  if (cachedFromWords === words && cachedSets) return cachedSets;
  cachedFromWords = words;
  cachedSets = [];
  for (const w of words) {
    if (w.length === 8 && /^[a-z]{8}$/.test(w)) cachedSets.push(w);
  }
  return cachedSets;
}

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
export function pickLetterSet(words) {
  const sets = getLetterSets(words);
  let used = readUsed();
  if (used.size >= sets.length) used = new Set();

  const remaining = sets.filter((s) => !used.has(s));
  const choice = remaining[Math.floor(Math.random() * remaining.length)];

  used.add(choice);
  writeUsed(used);
  return choice;
}
