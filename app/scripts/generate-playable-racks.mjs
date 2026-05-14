// Build-time helper: produces public/playable-racks.txt — the pool of 8-letter
// source words the game picks from. Filters ENABLE in two passes:
//
//   1. PLAYABILITY: must spell at least PLAYABILITY_THRESHOLD distinct
//      dictionary subwords (>=3 letters) from its tiles, so the round always
//      has a reasonable scoring ceiling.
//   2. FAMILIARITY: the source word itself must be common enough that a
//      typical adult recognizes it on the game-over reveal — anything below
//      FREQUENCY_RANK_CUTOFF in Google's unigram frequency list is dropped.
//      This is what removes the Scrabble-trivia plurals (ALUMINAS, ZYZZYVAS)
//      that ENABLE is full of.
//
// Run from app/:
//   node scripts/generate-playable-racks.mjs                  # writes the file
//   node scripts/generate-playable-racks.mjs --preview        # prints threshold sweep, no write
//   node scripts/generate-playable-racks.mjs --cutoff=100000  # override frequency cutoff

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");
const CACHE_DIR = join(__dirname, ".cache");
const DICT_PATH = join(PUBLIC_DIR, "enable-word-list.txt");
const FREQ_PATH = join(CACHE_DIR, "count_1w.txt");
const FREQ_URL = "https://norvig.com/ngrams/count_1w.txt";
const OUT_PATH = join(PUBLIC_DIR, "playable-racks.txt");

const MIN_LEN = 3;
const RACK_LEN = 8;
const PLAYABILITY_THRESHOLD = 50;
const PREVIEW = process.argv.includes("--preview");
const cutoffArg = process.argv.find((a) => a.startsWith("--cutoff="));
// Frequency rank cutoff: keep words ranked in the top N most common per Norvig.
// 75k is the empirical sweet spot — drops Scrabble-trivia plurals (ALUMINAS,
// QUINCUNX) while keeping most words a typical adult would recognize.
const FREQUENCY_RANK_CUTOFF = cutoffArg ? parseInt(cutoffArg.split("=")[1], 10) : 75000;

// ---- load dictionary -------------------------------------------------------

const words = readFileSync(DICT_PATH, "utf8")
  .split("\n")
  .map((w) => w.trim())
  .filter(Boolean);

// ---- load (or fetch) frequency list ---------------------------------------

if (!existsSync(FREQ_PATH)) {
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });
  console.log(`Fetching ${FREQ_URL}…`);
  const res = await fetch(FREQ_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch frequency list: ${res.status}`);
  }
  writeFileSync(FREQ_PATH, await res.text());
  console.log(`  cached → ${FREQ_PATH}`);
}

// rank[word] = 1-indexed rank in the frequency list (1 = most common)
const rank = new Map();
{
  let i = 0;
  for (const line of readFileSync(FREQ_PATH, "utf8").split("\n")) {
    const word = line.split("\t")[0]?.trim().toLowerCase();
    if (!word) continue;
    i++;
    if (!rank.has(word)) rank.set(word, i);
  }
}

// ---- pass 1: playability ---------------------------------------------------

const anagrams = new Map();
for (const w of words) {
  if (w.length < MIN_LEN || w.length > RACK_LEN) continue;
  if (!/^[a-z]+$/.test(w)) continue;
  const key = [...w].sort().join("");
  anagrams.set(key, (anagrams.get(key) || 0) + 1);
}

function* multisetCombinations(sorted, size) {
  const n = sorted.length;
  const idx = Array.from({ length: size }, (_, i) => i);
  while (true) {
    yield idx.map((i) => sorted[i]).join("");
    let i = size - 1;
    while (i >= 0 && idx[i] === n - size + i) i--;
    if (i < 0) return;
    idx[i]++;
    for (let j = i + 1; j < size; j++) idx[j] = idx[j - 1] + 1;
  }
}

function scoreRack(rack) {
  const sorted = [...rack].sort();
  const seen = new Set();
  let total = 0;
  for (let size = MIN_LEN; size <= RACK_LEN; size++) {
    for (const key of multisetCombinations(sorted, size)) {
      if (seen.has(key)) continue;
      seen.add(key);
      total += anagrams.get(key) || 0;
    }
  }
  return total;
}

const eight = words.filter((w) => w.length === RACK_LEN && /^[a-z]+$/.test(w));
console.log(`Total 8-letter ENABLE words: ${eight.length}`);

const playable = [];
let scanned = 0;
for (const rack of eight) {
  if (scoreRack(rack) >= PLAYABILITY_THRESHOLD) playable.push(rack);
  if (++scanned % 5000 === 0) process.stderr.write(`  scored ${scanned}/${eight.length}\n`);
}
console.log(`After playability filter (>= ${PLAYABILITY_THRESHOLD} subwords): ${playable.length}`);

// ---- pass 2: familiarity (frequency rank) ---------------------------------

function rankOf(w) {
  return rank.get(w) ?? Infinity;
}

const playableRanked = playable
  .map((w) => ({ w, r: rankOf(w) }))
  .sort((a, b) => a.r - b.r);

const inFreqList = playableRanked.filter((x) => Number.isFinite(x.r)).length;
const missingFromFreqList = playable.length - inFreqList;
console.log(`  in Norvig frequency list:    ${inFreqList}`);
console.log(`  absent from frequency list:  ${missingFromFreqList} (treated as Infinity, dropped)`);
console.log();

// Threshold sweep: shows what would be kept/dropped at several cutoffs so the
// human running this can sanity-check the chosen FREQUENCY_RANK_CUTOFF.
const thresholds = [10000, 20000, 30000, 50000, 75000, 100000, 150000];
console.log("Threshold sweep:");
console.log("  cutoff      kept    sample of last 8 kept (rarest still in)            sample of first 8 dropped (most common excluded)");
for (const cutoff of thresholds) {
  const kept = playableRanked.filter((x) => x.r <= cutoff);
  const dropped = playableRanked.filter((x) => x.r > cutoff);
  const lastKept = kept.slice(-8).map((x) => `${x.w}(${Number.isFinite(x.r) ? x.r : "∞"})`).join(" ");
  const firstDropped = dropped.slice(0, 8).map((x) => `${x.w}(${Number.isFinite(x.r) ? x.r : "∞"})`).join(" ");
  console.log(
    `  ${String(cutoff).padStart(7)}  ${String(kept.length).padStart(6)}    ${lastKept.padEnd(60)}  ${firstDropped}`
  );
}
console.log();

// ---- write output ----------------------------------------------------------

const finalKept = playableRanked
  .filter((x) => x.r <= FREQUENCY_RANK_CUTOFF)
  .map((x) => x.w);

console.log(`Chosen cutoff: top ${FREQUENCY_RANK_CUTOFF} most common`);
console.log(`Final pool: ${finalKept.length} racks`);

if (PREVIEW) {
  console.log("(--preview specified; not writing output)");
} else {
  // Sort alphabetically for stable diffs / easier inspection.
  finalKept.sort();
  writeFileSync(OUT_PATH, finalKept.join("\n") + "\n");
  console.log(`Wrote ${OUT_PATH}`);
}
