// Fisher–Yates, returns a new array — never mutates input.
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Builds a letter -> count map for fast availability checks.
export function countLetters(letters) {
  const map = {};
  for (const l of letters) map[l] = (map[l] || 0) + 1;
  return map;
}

// Returns true if `word` can be spelled from `letters` (respecting duplicates).
export function canSpell(word, letterCounts) {
  const used = {};
  for (const ch of word) {
    used[ch] = (used[ch] || 0) + 1;
    if (used[ch] > (letterCounts[ch] || 0)) return false;
  }
  return true;
}
