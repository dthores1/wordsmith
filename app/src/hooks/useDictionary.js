import { useEffect, useState } from "react";

// Loads /enable-word-list.txt once on mount and parses it into a Set for
// O(1) lookups. Returns { words, loading, error }, where `words` is a
// Set<string> of lowercase entries.
export function useDictionary() {
  const [state, setState] = useState({ words: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    fetch("/enable-word-list.txt")
      .then((r) => {
        if (!r.ok) throw new Error(`Dictionary fetch failed: ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (cancelled) return;
        const words = new Set();
        for (const line of text.split("\n")) {
          const w = line.trim();
          if (w) words.add(w);
        }
        setState({ words, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ words: null, loading: false, error: err });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}
