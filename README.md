# Simple Dice Roller Deluxe - FoundryVTT Module

Simple Dice Roller Deluxe is a system agnostic module for Foundry VTT that allows for quick rolls of common RPG dice including coin flips and Fudge dice.
The module provides options for secret rolls to the GM and exploding dice (enabled in the settings menu). The dice table renders in a separate window that can be repositioned freely in Foundry. 

![Screenshot_SimleDiceRoller_v1 4 1](https://github.com/pipefox/fvtt-simple-dice-roller-deluxe/assets/15308352/4303d7c9-f787-49c7-905f-1df3511a662a)


### Installation Instructions
Manual installations:
1. Click "Install Module" in the "Add-on Modules" tab in the Foundry "Configuration and Setup" screen
3. Paste the following URL in the "Manifest URL" field:

   `[https://github.com/pipefox/fvtt-simple-dice-roller-deluxe/releases/latest/download/module.json]`
5. Click on "Install" and wait for installation to complete
6. Enable the module in your game once it's started ("Settings" -> "Manage Module")
7. Check various settings in "Configure Settings" -> "Simple Dice Roller Deluxe"


### Planned Features
Roughly in order of priority:
* Add option for Penalty / Bonus Dice (10s dice) for Call of Cthulhu games.
* Add setting to close the dice-form on clicking a roll.
* Add DCC Style Dice - d3, d5, d7, d14, d24, d30 (in a secondary table).
* Add compounding and penetrating dice (if there's interest).
* Integrate toggle buttons (exploding dice, etc) into dice-form for UI consistency.
* Make dice-form CSS fancier (transparency effects, no outer border).

### Known Issues
None currently -> click [HERE](https://github.com/pipefox/fvtt-simple-dice-roller-deluxe/issues/new/choose) to submit an issue!


### Acknowledgements
Inspired by the Dice Roller of Roll20. Originally a fork of JoPeek's repo [here](https://github.com/jopeek/fvtt-simple-dice-roller/), 
though only some of the original css remains as this module is a complete rewrite using the latest FoundryVTT components and design patterns.
