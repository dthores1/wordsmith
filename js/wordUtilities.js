import { showInitialState, gameInput, setLettersAsPlayed, errors, show } from "./wordGame.js";

export let words;

// Retrieves our local dictionary - we'll check this first
export function initDictionary() {
    return fetch("js/dictionary.json")
        .then(response => {
            showInitialState();
            return response.json();
        })
        .then(data => {
            words = data;
        });
};


// Function to shuffle letters on string 
// Used for jumbling up the letter options for display
String.prototype.shuffle = function () {
    var strArray = this.split(""),
        n = strArray.length;

    for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = strArray[i];
        strArray[i] = strArray[j];
        strArray[j] = tmp;
    }
    return strArray.join("");
};

export const displayWordScore = wordScore => {
    let scoreIndicator = document.createElement("p");
    scoreIndicator.id = "score-fly-in";
    scoreIndicator.classList = "word-fly-in";

    if (wordScore < 0) {
        scoreIndicator.classList.add("negative");
        scoreIndicator.textContent = `${wordScore}`;
    } else {
        scoreIndicator.textContent = `+${wordScore}`;
    }

    document.querySelector(".game-container").appendChild(scoreIndicator); // TODO - Clear this out after a few seconds
};

export const removeScoreElement = () => {
    let existingElement = document.querySelector("#score-fly-in");
    if (existingElement) {
        existingElement.remove();
    }
};

// Clear out field text and selected letters
export const clearValues = () => {
    gameInput.value = "";
    setLettersAsPlayed();
};

export const getWordScore = n => {
    // Bonuses for the big words
    const bonus = (n < 5) ? 0 : (n - 5) * 20;

    return (n * (n + 1)) + bonus;
};

// Creates an error element if the user did something stupid
export const addError = msg => {
    const errorElement = document.createElement("p");
    errorElement.textContent = msg;
    errors.appendChild(errorElement);
    show(errors);
};

export function isRunningTest() {
    if (typeof process === "undefined") {
        return false;
    }

    return process && process.env && process.env.JEST_WORKER_ID !== undefined;
};