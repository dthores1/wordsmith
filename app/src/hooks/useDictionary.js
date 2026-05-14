import { useEffect, useState } from "react";

// Loads the dictionary and the precomputed list of "playable" 8-letter racks
// (words with enough sub-anagrams to make for a fun game — see
// scripts/generate-playable-racks.mjs).
//
// Returns { words, racks, loading, error }:
//   - words: Set<string> of every dictionary entry, for O(1) submission lookup
//   - racks: string[] of acceptable 8-letter source words for the tile picker
export function useDictionary() {
  const [state, setState] = useState({
    words: null,
    racks: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/enable-word-list.txt").then((r) => {
        if (!r.ok) throw new Error(`Dictionary fetch failed: ${r.status}`);
        return r.text();
      }),
      fetch("/playable-racks.txt").then((r) => {
        if (!r.ok) throw new Error(`Racks fetch failed: ${r.status}`);
        return r.text();
      }),
    ])
      .then(([dictText, racksText]) => {
        if (cancelled) return;
        const words = new Set();
        for (const line of dictText.split("\n")) {
          const w = line.trim();
          if (w) words.add(w);
        }
        const racks = [];
        for (const line of racksText.split("\n")) {
          const w = line.trim();
          if (w) racks.push(w);
        }
        setState({ words, racks, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ words: null, racks: null, loading: false, error: err });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}
