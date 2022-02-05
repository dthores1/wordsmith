import { getWordScore } from "./wordUtilities";

describe("Word Score Algorithm", () => {
    it("verifies words without bonuses (small words)", () => {
        expect(getWordScore(1)).toBe(2);
        expect(getWordScore(2)).toBe(6);
        expect(getWordScore(3)).toBe(12);
        expect(getWordScore(4)).toBe(20);
    });

    it("verifies large words with bonuses", () => {
        expect(getWordScore(5)).toBe(30); // Bonus = 0
        expect(getWordScore(6)).toBe(62); // Bonus = 20
        expect(getWordScore(7)).toBe(96); // Bonus = 40
        expect(getWordScore(8)).toBe(132); // Bonus = 60
    });
});

describe("Test shuffle", () => {
    it("verifies the shuffle algorithm changes letters", () => {
        const testString1 = "abcdefghijklmnopqrstuvwxyz";
        const stringLength = testString1.length;

        expect(testString1.shuffle()).toHaveLength(stringLength);

        const testStringShuffled = testString1.shuffle();
        let lettersAreMixed = false;

        for (let i = 0; i < stringLength; i++) {
            if (testStringShuffled[i] !== testString1[i]) {
                lettersAreMixed = true;
            }
        }

        expect(lettersAreMixed).toBe(true);
    });
});