// Lists the current playable-racks pool sorted by Norvig rank descending
// (least common first), with each word's rank. Intended for manual curation:
// scan from the top, mark obscure ones, then add the rejects to
// scripts/excluded-racks.txt and re-run generate-playable-racks.mjs.
//
// Run from app/:
//   node scripts/dump-racks-for-review.mjs              # writes review file
//   node scripts/dump-racks-for-review.mjs --bottom=N   # only the N rarest

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");
const RACKS_PATH = join(PUBLIC_DIR, "playable-racks.txt");
const FREQ_PATH = join(__dirname, ".cache", "count_1w.txt");
const OUT_PATH = join(__dirname, "racks-for-review.txt");

const bottomArg = process.argv.find((a) => a.startsWith("--bottom="));
const bottomN = bottomArg ? parseInt(bottomArg.split("=")[1], 10) : null;

const racks = readFileSync(RACKS_PATH, "utf8")
  .split("\n").map((w) => w.trim()).filter(Boolean);

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

const ranked = racks
  .map((w) => ({ w, r: rank.get(w) ?? Infinity }))
  .sort((a, b) => b.r - a.r); // rarest first

const slice = bottomN ? ranked.slice(0, bottomN) : ranked;

const lines = [
  `# Current pool: ${racks.length} racks. Listed rarest-first (Norvig rank desc).`,
  `# To remove a rack from the game, add its word (no rank) to scripts/excluded-racks.txt`,
  `# then run: node scripts/generate-playable-racks.mjs`,
  `#`,
  `# rank      word`,
  ...slice.map((x) => `${String(x.r).padStart(7)}    ${x.w}`),
];

writeFileSync(OUT_PATH, lines.join("\n") + "\n");
console.log(`Wrote ${slice.length} entries to ${OUT_PATH}`);
console.log(`Rank range: ${slice[0].r} (rarest) → ${slice[slice.length - 1].r}`);
