# Introduction
Contains the source code for the Wordsmith game, in which players must make as many words as possible out of the eight supplied letters in a given amount of time. 

## Rules
Players are given 60 seconds to make as many words as possible from a combination of 8 radomly-supplied letters. Points will be awarded for correct words, and higher points will be added for word length. Incorrect words will cause the player to lose points, so be careful!

Words with eight letters -- the most valuable in the game -- are possible in all given letter combinations. 

## Design
The game uses a JSON English dictionary to efficiently verify correct words. If the word is not present in the dictionary, we will call the [JSpell Checker API](https://rapidapi.com/jspell/api/jspell-checker/endpoints) to determine if the word exists. This is necessary for situations where a user might use a plural or past tense of a word, which would not be readily available as a key in the dictionary. Using the approach to first lookup in the dictionary, then revert to the API allows us to minimize return time and API calls. 