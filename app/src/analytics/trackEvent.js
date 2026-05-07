import { useCallback } from "react";
import { usePostHog } from "posthog-js/react";

// Wordsmith analytics events. Keep this list in sync with the call sites:
//   - app_opened              — App.jsx mount
//   - game_started            — useGame.start()
//   - game_paused             — useGame.pause()
//   - quit_game               — useGame.quit() — { valid_words, invalid_words, score, seconds_remaining }
//   - game_finished           — useGame, when timer expires — { valid_words, invalid_words, score }
//   - submit_to_leaderboard   — App.jsx, when player submits a high score — { name, score }
//   - view_leaderboard        — App.jsx, when player navigates to leaderboard
//   - play_again              — App.jsx, when player clicks "Play again"
//
// PostHog automatically attaches a server-resolved timestamp to every
// captured event, so callers don't need to pass one through.
export function useTrackEvent() {
  const posthog = usePostHog();

  return useCallback(
    (event, properties) => {
      if (!posthog) return;
      posthog.capture(event, { app: "wordsmith", ...properties });
    },
    [posthog]
  );
}
