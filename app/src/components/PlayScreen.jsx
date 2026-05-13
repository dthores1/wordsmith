import { useState } from "react";
import { FoundWordsList } from "./FoundWordsList";
import { GameHeader } from "./GameHeader";
import { LetterTiles } from "./LetterTiles";
import { QuitConfirmModal } from "./QuitConfirmModal";
import { ScoreToast } from "./ScoreToast";
import { WordInput } from "./WordInput";

export function PlayScreen({
  letters,
  shuffleNonce,
  input,
  timeLeft,
  score,
  foundWords,
  feedback,
  onChangeInput,
  onSubmit,
  onShuffle,
  onPause,
  onResume,
  onQuit,
}) {
  const [confirmingQuit, setConfirmingQuit] = useState(false);
  const [focusToken, setFocusToken] = useState(0);

  const handleQuitClick = () => {
    if (score === 0) {
      onQuit();
      return;
    }
    onPause();
    setConfirmingQuit(true);
  };

  const handleCancelQuit = () => {
    setConfirmingQuit(false);
    onResume();
    setFocusToken((n) => n + 1); // re-focus the word input
  };

  return (
    <div className="relative flex flex-col gap-6 sm:gap-7">
      <GameHeader
        timeLeft={timeLeft}
        score={score}
        wordsFound={foundWords.length}
        onQuit={handleQuitClick}
      />

      <LetterTiles
        letters={letters}
        input={input}
        shuffleNonce={shuffleNonce}
        onAddLetter={(l) => onChangeInput(input + l)}
        onRemoveAt={(idx) => onChangeInput(input.slice(0, idx) + input.slice(idx + 1))}
        onShuffle={onShuffle}
      />

      <div className="relative">
        <ScoreToast feedback={feedback} />
        <WordInput
          value={input}
          onChange={onChangeInput}
          onSubmit={onSubmit}
          onShuffle={onShuffle}
          shake={feedback?.kind === "bad" && (feedback.shake || feedback.message)}
          focusToken={focusToken}
        />
        <div className="h-5 mt-1.5 text-center text-sm">
          {feedback?.message ? (
            <span className="text-bad font-medium">{feedback.message}</span>
          ) : null}
        </div>
      </div>

      <FoundWordsList words={foundWords} />

      {confirmingQuit && (
        <QuitConfirmModal
          showWarning={score > 0}
          onCancel={handleCancelQuit}
          onConfirm={onQuit}
        />
      )}
    </div>
  );
}
