import { useEffect, useState } from "react";
import { useTrackEvent } from "./analytics/trackEvent";
import { Countdown } from "./components/Countdown";
import { GameOverScreen } from "./components/GameOverScreen";
import { Leaderboard } from "./components/Leaderboard";
import { PlayScreen } from "./components/PlayScreen";
import { TitleScreen } from "./components/TitleScreen";
import { useDictionary } from "./hooks/useDictionary";
import { useGame } from "./hooks/useGame";
import { useLeaderboard } from "./hooks/useLeaderboard";

export default function App() {
  const track = useTrackEvent();
  const { words, racks, loading: dictLoading, error: dictError } = useDictionary();
  const game = useGame(words, racks, track);
  const leaderboard = useLeaderboard();
  const [view, setView] = useState("game"); // "game" | "leaderboard"

  useEffect(() => {
    track("app_opened");
  }, [track]);

  useEffect(() => {
    if (game.phase !== "idle") setView("game");
  }, [game.phase]);

  const showLeaderboard = () => {
    track("view_leaderboard");
    setView("leaderboard");
  };

  const handlePlayAgain = () => {
    track("play_again");
    game.start();
  };

  const handlePlayAgainFromLeaderboard = () => {
    track("play_again");
    setView("game");
    game.start();
  };

  const handleSubmitScore = (name, bestWord) => {
    track("submit_to_leaderboard", { name, score: game.score });
    leaderboard.submit({
      name,
      score: game.score,
      wordsFound: game.foundWords.length,
      bestWord,
    });
  };

  return (
    <div className="min-h-dvh flex items-start sm:items-center justify-center px-4 py-3 sm:py-10">
      <main className="w-full max-w-2xl">
        {dictError && (
          <div className="rounded-lg bg-bad/10 border border-bad/30 text-bad p-3 mb-4 text-sm">
            Couldn't load the dictionary. Refresh the page to try again.
          </div>
        )}

        <Card>
          {view === "leaderboard" ? (
            <Leaderboard
              entries={leaderboard.entries}
              loading={leaderboard.loading}
              error={leaderboard.error}
              onRefresh={leaderboard.refresh}
              onBack={handlePlayAgainFromLeaderboard}
            />
          ) : game.phase === "idle" ? (
            <TitleScreen onStart={game.start} dictionaryLoading={dictLoading} />
          ) : game.phase === "countdown" ? (
            <Countdown value={game.countdown} />
          ) : game.phase === "playing" ? (
            <PlayScreen
              letters={game.letters}
              shuffleNonce={game.shuffleNonce}
              input={game.input}
              timeLeft={game.timeLeft}
              score={game.score}
              foundWords={game.foundWords}
              feedback={game.feedback}
              onChangeInput={game.updateInput}
              onSubmit={game.submitWord}
              onShuffle={game.shuffleLetters}
              onPause={game.pause}
              onResume={game.resume}
              onQuit={game.quit}
            />
          ) : (
            <GameOverScreen
              score={game.score}
              foundWords={game.foundWords}
              targetWord={game.targetWord}
              isHighScore={leaderboard.isHighScore(game.score)}
              leaderboardRank={
                leaderboard.entries.filter((e) => e.score > game.score).length + 1
              }
              onSubmitScore={handleSubmitScore}
              onPlayAgain={handlePlayAgain}
              onShowLeaderboard={showLeaderboard}
            />
          )}
        </Card>
      </main>
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-3xl bg-paper/90 backdrop-blur-sm border border-border shadow-[0_10px_40px_-15px_rgba(15,23,42,0.18)] px-5 sm:px-10 py-6 sm:py-10">
      {children}
    </div>
  );
}
