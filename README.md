# Simple Dice Roller Deluxe - FoundryVTT Module

Simple Dice Roller Deluxe is a system agnostic module for Foundry VTT that allows for quick rolls of common RPG dice from the main app controls.
Once the "Dice Roller" button is clicked, a clickable dice table renders in a separate window that can be repositioned freely in Foundry.

The module provides options for coin flips and Fate/Fudge dice, including settings for adding additional button toggles for hidden rolls and exploding dice.

![Screenshot_SimleDiceRoller_v1 4 1](https://github.com/pipefox/fvtt-simple-dice-roller-deluxe/assets/15308352/4303d7c9-f787-49c7-905f-1df3511a662a)

## Installation Instructions
1. Click "Install Module" in the "Add-on Modules" tab in the Foundry "Configuration and Setup" screen
2. **Default Installation:** <br/>Search for "Simple Dice Roller Deluxe"<br/>
   **Manual Installation:** <br/> Paste the following URL in the "Manifest URL" field:<br/>`[https://github.com/pipefox/fvtt-simple-dice-roller-deluxe/releases/latest/download/module.json]`
4. Click on "Install" and wait for installation to complete
5. Enable the module in your game once it's started ("Settings" -> "Manage Module")
6. Check various settings in "Configure Settings" -> "Simple Dice Roller Deluxe"

## Planned Features
Roughly in order of priority:
* Move less used settings (additional row column, close on click) in a separate Settings Form.
* Add option for Penalty / Bonus Dice (10s dice) for Call of Cthulhu games.
* Add DCC Style Dice - d3, d5, d7, d14, d24, d30 (in a secondary table).
* Add compounding and penetrating dice (if there's interest).
* Make dice-form CSS fancier (transparency effects, no outer border).

## Known Issues
**Click [HERE](https://github.com/pipefox/fvtt-simple-dice-roller-deluxe/issues/new/choose) to submit an issue!**

## Why "Simple Dice Roller Deluxe"?
* This module covers a different use case where the Foudnry app is used for battle maps tracking while the players have physical character sheets (or digital ones on their phones/tablets). Having a simple roll table with no modifiers can be handy in such cases.
* The module also helps users who want to make a roll in a click or two without having to type commands in the chat window.
* Simple Dice Roller Deluxe a complete rewrite of an existing module using the latest Foundry components / design patterns which should increase maintainability while keeping backwards compatibility (no ApplicationV2 as it's Foundry V12+ only).

## Acknowledgements
Inspired by the Dice Roller of Roll20. Used JoPeek's [module](https://github.com/jopeek/fvtt-simple-dice-roller/) as a starting point.