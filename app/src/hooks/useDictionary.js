import { useEffect, useState } from "react";

// Loads /dictionary.json once on mount. Returns { words, loading, error }.
// `words` is the raw JSON object — keys are valid words; we only check `.hasOwnProperty`.
export function useDictionary() {
  const [state, setState] = useState({ words: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    fetch("/dictionary.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Dictionary fetch failed: ${r.status}`);
        return r.json();
      })
      .then((words) => {
        if (!cancelled) setState({ words, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ words: null, loading: false, error: err });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}
