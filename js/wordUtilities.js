// Retrieves our local dictionary - we'll check this first
const initDictionary = () => {
    return fetch("js/dictionary.json")
        .then(response => {
            showInitialState();
            return response.json();
        })
        .then(data => {
            words = data;
        })
}

initDictionary();

// Function to shuffle letters on string 
// Used for jumbling up the letter options for display
String.prototype.shuffle = function() {
    var strArray = this.split(""),
        n = strArray.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = strArray[i];
        strArray[i] = strArray[j];
        strArray[j] = tmp;
    }
    return strArray.join("");
}

const displayWordScore = wordScore => {
    let scoreIndicator = document.createElement("p");  
    scoreIndicator.id = "score-fly-in";
    scoreIndicator.classList = "word-fly-in";
    
    if(wordScore < 0) {
        scoreIndicator.classList.add("negative");
        scoreIndicator.textContent = `${wordScore}`;
    } else {
        scoreIndicator.textContent = `+${wordScore}`;
    }

    document.querySelector(".game-container").appendChild(scoreIndicator); // TODO - Clear this out after a few seconds
}

const removeScoreElement = () => {
    let existingElement = document.querySelector("#score-fly-in");
    if(existingElement) {
        existingElement.remove();
    }    
}

// Clear out field text and selected letters
const clearValues = () => {
    gameInput.value = "";
    setLettersAsPlayed();
}

const getWordScore = n => {
    // Bonuses for the big words
    const bonus = (n < 5) ? 0 : (n-5) * 20;

    return (n * (n+1)) + bonus;
}

// Creates an error element if the user did something stupid
const addError = msg => {
    const errorElement = document.createElement("p");
    errorElement.textContent = msg;
    errors.appendChild(errorElement);
    show(errors);    
}