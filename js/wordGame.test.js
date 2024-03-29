import { getGameState, getGameStatistics, initWordsPlayed } from "./wordGame";
import { NUMBER_OF_LETTERS_PER_GAME, STORAGE_KEY_GAME_STATE, STORAGE_KEY_GAME_STATS } from "./constants";

describe("Tests functions related to persisting game state", () => {
    it("verifies default game state", () => {
        const defaultGameState = getGameState();

        expect(defaultGameState).not.toBe(undefined);
        expect(defaultGameState.letterSetsUsed).toEqual({});
    });

    it("verifies game state from local storage", () => {
        localStorage.setItem(STORAGE_KEY_GAME_STATE, JSON.stringify({
            letterSetsUsed: { "wizardly": true, "shoplift": true }
        }));

        const retrievedGameState = getGameState();
        expect(Object.keys(retrievedGameState.letterSetsUsed).length).toEqual(2);
    });

    it("verifies default game statistics", () => {
        const defaultGameStatistics = getGameStatistics();

        expect(defaultGameStatistics.highScore).toEqual(0);
        expect(defaultGameStatistics.mostWordsFound).toEqual(0);
        expect(defaultGameStatistics.gamesPlayed).toEqual(0);
    });

    it("verifies game statistics from local storage", () => {
        const testGameStats = getGameStatistics();
        testGameStats.gamesPlayed = 7;
        testGameStats.highScore = 300;
        testGameStats.mostWordsFound = 15;

        localStorage.setItem(STORAGE_KEY_GAME_STATS, JSON.stringify(testGameStats));

        const actualGameStats = getGameStatistics();

        expect(actualGameStats.gamesPlayed).toEqual(7);
        expect(actualGameStats.highScore).toEqual(300);
        expect(actualGameStats.mostWordsFound).toEqual(15);
    });

    it("verifies wordsPlayed array's initializer function", () => {
        const wordsPlayed = initWordsPlayed();
        expect(wordsPlayed.length).toEqual(NUMBER_OF_LETTERS_PER_GAME);

        // Should be initialized to empty arrays
        for (const value of wordsPlayed) {
            expect(value).toEqual([]);
        }
    });
});