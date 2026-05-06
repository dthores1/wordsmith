export async function submitScore({ playerName, score, wordsFound, bestWord }) {
  const res = await fetch("/submit-score", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player_name: playerName,
      score,
      words_found: wordsFound,
      best_word: bestWord,
    }),
  });
  if (!res.ok) {
    throw new Error(`submitScore failed: ${res.status}`);
  }
  return res.json();
}

export async function getLeaderboard() {
  const res = await fetch("/leaderboard");
  if (!res.ok) {
    throw new Error(`getLeaderboard failed: ${res.status}`);
  }
  return res.json();
}
