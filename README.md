# Introduction
Contains the source code for the Wordsmith game, in which players must make as many words as possible out of the eight supplied letters in a given amount of time. 

## Rules
Players are given 60 seconds to make as many words as possible from a combination of 8 radomly-supplied letters. Points will be awarded for correct words, and higher points will be added for word length. Incorrect words will cause the player to lose points, so be careful!

Words with eight letters -- the most valuable in the game -- are possible in all given letter combinations. 

## Design
The game uses a JSON English dictionary to efficiently verify correct words. If the word is not present in the dictionary, we will call the [JSpell Checker API](https://rapidapi.com/jspell/api/jspell-checker/endpoints) to determine if the word exists. This is necessary for situations where a user might use a plural or past tense of a word, which would not be readily available as a key in the dictionary. Using the approach to first lookup in the dictionary, then revert to the API allows us to minimize return time and API calls. 

## Gameplay
Players have one minute to enter as many valid words as possible from the letters supplied. Entering characters apart from the supplied letters is not permitted. 

![Screenshot 1](https://github.com/dthores1/wordsmith/blob/master/img/screenshots/wordsmith-1.png "Screenshot 1")

When a player types a word and presses Enter, the game will determine if the word is valid. If the word is invalid, the player will lose 15 points. Points for valid words will be awarded based on length of the word. 

![Screenshot 2](https://github.com/dthores1/wordsmith/blob/master/img/screenshots/wordsmith-2.png "Screenshot 2")

![Screenshot 3](https://github.com/dthores1/wordsmith/blob/master/img/screenshots/wordsmith-3.png "Screenshot 3")

