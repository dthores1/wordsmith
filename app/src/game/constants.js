export const GAME_DURATION = 60;
export const COUNTDOWN_DURATION = 3;
export const INCORRECT_WORD_PENALTY = -15;
export const MIN_WORD_LENGTH = 3;
export const NUMBER_OF_LETTERS_PER_GAME = 8;

export const STORAGE_KEY_LEADERBOARD = "wordsmith.leaderboard.v1";
export const STORAGE_KEY_LETTERSET_HISTORY = "wordsmith.letterSetHistory.v1";

export const ERROR_MSGS = {
  noWord: "Type a word before pressing Enter!",
  tooShort: `Words must be at least ${MIN_WORD_LENGTH} letters.`,
  alreadyPlayed: "Already used — nice try!",
  notAWord: "Not in our dictionary.",
  invalidLetters: "Letters must come from the tiles above.",
};
