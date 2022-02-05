import { logValidWord, logInvalidWord } from "./wordGame.js";

const dictApiKey = "5681eaea13msh040b4e972f8cd62p17faa8jsn2fdcd6ca844a";
const dictApiUrl = "https://jspell-checker.p.rapidapi.com/check";

export const makeApiAttempt = word => {
    const data = JSON.stringify({
        "language": "enUS",
        "fieldvalues": word,
        "config": {
            "forceUpperCase": false,
            "ignoreIrregularCaps": false,
            "ignoreFirstCaps": true,
            "ignoreNumbers": true,
            "ignoreUpper": false,
            "ignoreDouble": false,
            "ignoreWordsWithNumbers": true
        }
    });

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            const responseObj = JSON.parse(this.responseText);

            if (responseObj.spellingErrorCount) {
                logInvalidWord();
            } else {
                console.log("%c The word was found in the API!", "font-style: italic; color: orange;");
                logValidWord(word, true);
            }
        }
    });

    xhr.open("POST", dictApiUrl);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("x-rapidapi-key", dictApiKey);
    xhr.setRequestHeader("x-rapidapi-host", "jspell-checker.p.rapidapi.com");

    xhr.send(data);
};