import { useCallback, useEffect, useState } from "react";
import { getLeaderboard, submitScore } from "../api";

const MAX_ENTRIES = 10;

function normalize(row) {
  return {
    name: row.player_name,
    score: row.score,
    wordsFound: row.words_found,
    bestWord: row.best_word,
    date: row.created_at,
  };
}

export function useLeaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await getLeaderboard();
      setEntries(rows.map(normalize));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = useCallback(
    async ({ name, score, wordsFound, bestWord }) => {
      const playerName = (name || "Anonymous").trim().slice(0, 16);
      try {
        await submitScore({ playerName, score, wordsFound, bestWord });
      } catch (e) {
        setError(e);
        throw e;
      }
      await refresh();
    },
    [refresh]
  );

  const isHighScore = (score) => {
    if (score <= 0) return false;
    if (entries.length < MAX_ENTRIES) return true;
    return score > entries[entries.length - 1].score;
  };

  return { entries, loading, error, submit, isHighScore, refresh };
}
