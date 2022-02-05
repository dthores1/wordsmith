import { words, initDictionary, addError, getWordScore, clearValues, removeScoreElement, displayWordScore, isRunningTest } from "./wordUtilities.js";
import { STORAGE_KEY_GAME_STATE, STORAGE_KEY_GAME_STATS, COUNTDOWN_DURATION, INCORRECT_WORD_PENALTY, INITIAL_TIMER_DISPLAY, LETTER_SETS, GAME_DURATION, ERROR_MSGS } from "./constants.js";

export const errors = document.querySelector(".errors");
const countdown = document.querySelector("#countdown");
const timer = document.querySelector("#timer");
const results = document.querySelector("#results-container");
const finalScore = document.querySelector("#final-score");
const highScore = document.querySelector("#high-score");
export const gameInput = document.querySelector("#game-input");
const startButton = document.querySelector("#start-button");
const title = document.querySelector("#title");
const letterContainer = document.querySelector("#letters-container");

let letters = [];
let lettersMap = {};
let letterSetsUsed = [];
let newWordsFromApi = []; // Insert these to database later
let gameStarted = false;
let interval;
let isHighScore = false;
let score = 0;
let wordsFound = 0;
let gameStatistics;
let gameState;

// TODO - Add words to redis

if (!isRunningTest()) {
    initDictionary();
}

const addGlobalEventListener = (type, selector, callback) => {
    document.addEventListener(type, e => {
        if (e.target.matches(selector)) callback(e);
    });
};

const startGame = () => {
    gameStarted = true;
    isHighScore = false;
    score = 0;
    wordsFound = 0;
    letterSetsUsed = [];
    newWordsFromApi = [];

    gameStatistics = getGameStatistics();
    gameState = getGameState();

    handleCountdownTimer();
};

const setupGame = () => {
    showGameState();
    setLetters();
    handleTimer();
};

const endGame = () => {
    clearInterval(interval);
    gameStarted = false;
    isHighScore = score > gameStatistics.highScore && gameStatistics.gamesPlayed > 0;

    showGameOverState();
    saveWordsFromApi();
    setGameStatistics();
    setGameState();
};

const handleCountdownTimer = () => {
    showCountDownState();

    interval = setInterval(() => {
        let timerVal = parseInt(countdown.textContent) - 1;
        countdown.textContent = timerVal;

        if (timerVal === 0) {
            setupGame();
        }
    }, 1000);
};

const handleTimer = () => {
    interval = setInterval(() => {
        const countdownValue = (timer.textContent !== INITIAL_TIMER_DISPLAY) ? parseInt(timer.textContent) - 1 : GAME_DURATION;
        timer.textContent = countdownValue;

        if (countdownValue === 0) {
            endGame();
        }
    }, 1000);
};

export const showInitialState = () => {
    hide(timer);
    finalScore.textContent = "";
    hide(results);

    show(title);
    startButton.textContent = "Get Started";
    show(startButton);
};

const showCountDownState = () => {
    hide(letterContainer);
    show(title);
    countdown.textContent = COUNTDOWN_DURATION;
    show(countdown);
};

const showGameState = () => {
    hide(title);
    hide(countdown);
    timer.textContent = INITIAL_TIMER_DISPLAY;
    show(letterContainer);
    show(timer);
    show(gameInput);
    gameInput.focus();
};

const showGameOverState = () => {
    letters = [];
    hide(timer);
    hide(letterContainer);
    removeScoreElement();

    let errors = Array.from(document.querySelectorAll(".errors p"));
    errors.forEach((error) => {
        hide(error);
    });

    if (isHighScore) {
        highScore.textContent = `Congratulations! You have a new high score of ${score}.`;
        finalScore.textContent = `You found ${wordsFound} words.`;
    } else {
        highScore.textContent = "";
        finalScore.textContent = `Your final score was ${score}. You found ${wordsFound} words.`;
    }

    show(results);

    gameInput.value = "";
    hide(gameInput);

    hide(title);

    startButton.textContent = "Play again?";
    show(startButton);

    let allLetters = Array.from(document.querySelectorAll(".letter-option"));
    allLetters.forEach((letter) => {
        letter.classList = "invisible";
    });
};

// Gets the letters for the game
const setLetters = () => {
    const numberOfWordChoicesInGame = LETTER_SETS.length;
    const numberOfletterSetsUsed = Object.keys(gameState.letterSetsUsed).length;
    let selectedWord;

    // Reset once the user has played all the words
    if (numberOfWordChoicesInGame === numberOfletterSetsUsed) {
        gameState.letterSetsUsed = {};
    }

    // If we have used over half of the words in all our game choices, go through the list
    // until we find one that hasn't been used. At this point, randomly picking is going to get
    // too slow. 
    if (numberOfletterSetsUsed >= (Math.ceil(numberOfWordChoicesInGame / 2))) {
        for (const word of LETTER_SETS) {
            if (!word in gameState.letterSetsUsed) {
                selectedWord = word;
                break;
            }
        }
        // If we haven't used half the words in the game, keep randomly selecting them. 
        // This will give an element of randomness to the game's word selections. 
    } else {
        let wordPlayed = true;

        // Randomly select the word, but still make sure it has not been played
        while (wordPlayed) {
            selectedWord = LETTER_SETS[Math.floor(Math.random() * LETTER_SETS.length)];

            wordPlayed = selectedWord in gameState.letterSetsUsed;
        }
    }

    buildLetters(selectedWord);
    gameState.letterSetsUsed[selectedWord] = true;
};

const buildLetters = lettersStr => {
    const letterParent = document.querySelector("#letters-box");

    letters = [];

    let allLetters = Array.from(document.querySelectorAll("#letters-box span"));
    allLetters.forEach(l => l.remove());

    lettersStr = lettersStr.shuffle();

    lettersStr.split("").forEach(l => {
        letters.push(l);

        let count = lettersMap[l];
        lettersMap[l] = count ? count + 1 : 1;
    });

    letters.forEach(letter => {
        let letterSpan = document.createElement("span");
        letterSpan.classList = "letter-option";
        letterSpan.textContent = letter;
        letterParent.append(letterSpan);
    });
};

const handleShuffle = e => {
    if (e.keyCode === 16) {
        shuffleLetters();
    }
};

const shuffleLetters = () => {
    // Feed the letters back into the buildLetters function to shuffle and put in the UI
    buildLetters(letters.join(",").replace(/,/g, ""));
};

const determineStart = (e) => {
    if (gameStarted) return;

    hide(results);
    hide(startButton);
    startGame();
};

const show = (elem) => {
    elem.classList.remove("invisible");
    elem.classList.add("visible");
};

const hide = (elem) => {
    elem.classList.remove("visible");
    elem.classList.add("invisible");
};

const validateInput = e => {
    const word = e.target.value?.toLowerCase();

    console.log(e.keyCode);

    if (!gameStarted) {
        return;
    }

    handleShuffle(e);

    gameInput.classList.remove("input-error"); // Reset errors

    // keyCode of 13 is "Enter"
    if (e.keyCode === 13) {
        gameInput.value = "";

        removeScoreElement();

        if (hasErrors(word)) return;

        // Check for the presence of the word in our local dictionary first
        if (words.hasOwnProperty(word)) {
            console.log("%c The word exists in our local dictionary!", "font-weight: bold; color: green;");
            logValidWord(word, false);
            return;
        }

        makeApiAttempt(word);

        // Keycode of 8 is backspace
    } else if (e.keyCode !== 8) {
        // Errors should only show on enter - when user types again remove them
        let allErrors = Array.from(document.querySelectorAll(".errors p"));
        allErrors.forEach(e => e.remove());

        // Remove the last letter if it's not in our list....
        if (gameInput.value) {
            const lastCharacter = gameInput.value.charAt(gameInput.value.length - 1).toLowerCase();

            if (!letters.includes(lastCharacter) || hasUsedAllInstancesOfLetter(lastCharacter)) {
                gameInput.classList.add("input-error");
                gameInput.value = gameInput.value.substr(0, gameInput.value.length - 1);
            }

            setLettersAsPlayed();
        }
        // Backspace - user erases input
    } else {
        setLettersAsPlayed();
    }
};

// Determines if player used up all their allowable instances of the letter, counting for duplicates
// Ex: if the letter set is TLTEMNTO, then they will have three instances of T to use
const hasUsedAllInstancesOfLetter = (l) => {
    let totalAllowed = lettersMap[l];

    let count = 0;
    for (let i = 0; i < gameInput.value.length; i++) {
        if (gameInput.value[i] === l) {
            count++;
        }

        if (count > totalAllowed) return true;
    }

    return false;
};

export const setLettersAsPlayed = () => {
    let allLetters = Array.from(document.querySelectorAll("#letters-box span"));

    let textVal = gameInput.value;
    let playedLetters = [];

    textVal.split("").forEach(t => {
        for (let i = 0; i < allLetters.length; i++) {
            if (!playedLetters.includes(i) && allLetters[i].textContent === t.toLowerCase()) {
                playedLetters.push(i);
                break;
            }
        }
    });

    for (let i = 0; i < allLetters.length; i++) {
        if (playedLetters.includes(i)) {
            allLetters[i].classList.add("played");
        } else {
            allLetters[i].classList.remove("played");
        }
    }
};

const hasErrors = word => {
    let alreadyPlayed = letterSetsUsed.includes(word);

    // Show error and exit if Enter was pressed and no word was entered
    if (!word) {
        addError(ERROR_MSGS["noWord"]);
        return true;

        // Verify the word is at least 3 letters long
    } else if (word.length < 3) {
        addError(ERROR_MSGS["lessThanThreeLetters"]);
        return true;
    } else if (alreadyPlayed) {
        addError(ERROR_MSGS["alreadyPlayed"]);
        return true;
    }

    return false;
};

const saveWordsFromApi = () => {
    if (!newWordsFromApi.length) {
        return;
    }

    // Add the words to our local set
    newWordsFromApi.forEach(word => {
        words[word] = true;
    });

    // Save to Redis...
};


const setGameStatistics = () => {
    if (isHighScore || !gameStatistics.gamesPlayed) {
        gameStatistics.highScore = score;
    }

    // Set mostWordsFound to the current wordsFound if the current is the best ever
    gameStatistics.mostWordsFound = wordsFound > gameStatistics.mostWordsFound ? wordsFound : gameStatistics.mostWordsFound;

    gameStatistics.gamesPlayed++;

    localStorage.setItem(STORAGE_KEY_GAME_STATS, JSON.stringify(gameStatistics));
};

const setGameState = () => {
    localStorage.setItem(STORAGE_KEY_GAME_STATE, JSON.stringify(gameState));
};

export const getGameStatistics = () => {
    let returnValue = localStorage.getItem(STORAGE_KEY_GAME_STATS);

    if (returnValue) {
        returnValue = JSON.parse(returnValue);
    } else {
        returnValue = {
            "highScore": 0,
            "mostWordsFound": 0,
            "gamesPlayed": 0,
        };
    }

    return returnValue;
};

export const getGameState = () => {
    let returnValue = localStorage.getItem(STORAGE_KEY_GAME_STATE);

    console.log("returnValue", returnValue);

    if (returnValue) {
        returnValue = JSON.parse(returnValue);
    } else {
        returnValue = {
            letterSetsUsed: {} // More efficient than an array
        };
    }

    return returnValue;
};

// Reset function to run after a valid word has been played
const logValidWord = (word, fromApi) => {
    clearValues();

    let wordScore = getWordScore(word.length);
    displayWordScore(wordScore);

    // Add to our main dataset
    score += wordScore;
    wordsFound++;

    if (fromApi) {
        // Add the word locally if it wasn't there already
        // This is so we minimize calls to the spell check API        
        words[word] = true;
        newWordsFromApi.push(word);
    }

    letterSetsUsed.push(word);
};

const logInvalidWord = () => {
    clearValues();

    score += INCORRECT_WORD_PENALTY;
    displayWordScore(INCORRECT_WORD_PENALTY);
};

addGlobalEventListener("keyup", "#game-input", validateInput);
addGlobalEventListener("click", "#start-button", determineStart);
