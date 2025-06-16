# Simple Dice Roller Deluxe - FoundryVTT Module

Simple Dice Roller Deluxe is a system agnostic module for Foundry VTT that allows for quick rolls of common RPG dice from the main app controls.
Once the "Dice Roller" button is pressed, a clickable dice table renders in a separate window that can be repositioned freely in Foundry.


![Screenshot_SimleDiceRollerDeluxe_v2 0 0](https://github.com/pipefox/fvtt-simple-dice-roller-deluxe/assets/15308352/5562e183-fe01-470d-b234-f26f7e785938)

* The number of rollable dice can be adjusted from 1 to 25.
* Advanced global settings (settable **only** by the Game Master) for more roll options:
  * Hidden Rolls:
    * Private Roll to GM
    * Blind Roll to GM
    * Roll to Self
  * Call of Cthulhu:
    * Penalty 'tens' Roll for d100
    * Bonus 'tens' Roll for d100
  * Exploding Dice:
    * Standard Exploding Dice
    * Single Exploding Dice (explode only once)
  * Fate/Fudge dice
  * Coin flips  

Note that if any "Hidden Rolls" toggles are selected in the Dice Roller table, they supersede/override the default chat window hidden toggles!<br>
If they are NOT enabled, then the default chat window hidden toggles work as normal. :)

## Installation Instructions
1. Click "Install Module" in the "Add-on Modules" tab in the Foundry "Configuration and Setup" screen
2. **Default Installation:** <br/>Search for "Simple Dice Roller Deluxe"<br/>
   **Manual Installation:** <br/> Paste the following URL in the "Manifest URL" field:<br/>`[https://github.com/pipefox/fvtt-simple-dice-roller-deluxe/releases/latest/download/module.json]`
4. Click on "Install" and wait for installation to complete
5. Enable the module in your game once it's started ("Settings" -> "Manage Module")
6. Check various settings in "Configure Settings" -> "Simple Dice Roller Deluxe"

## Known Issues
**Click [HERE](https://github.com/pipefox/fvtt-simple-dice-roller-deluxe/issues/new/choose) to submit an issue!**
* Note that the Spanish and French localizations were done with machine translation.<br>
Feel free to make pull requests with corrected json texts!
* 'Call of Cthulhu' Bonus/Penalty rolls work correctly, but the detailed chat output does not look nice.<br>
For better integration, use the Cthulhu 7th Edition System for Foundry.

<hr/>

## Potential new Features
This module is complete, but I might add some options down the line if there's interest and I have time. :)
* Add DCC Style Dice - d3, d5, d7, d14, d24, d30 (in a secondary table).
* Add compounding and penetrating dice to the Exploding Dice toggles.
* Make dice-table CSS fancier: better tooltips, optional toggle button labels, transparency effects, no outer border.

## Why "Simple Dice Roller Deluxe"?
* This module is for GMs who use the Foundry app for battle maps and tracking while the players have physical character sheets (or digital ones on their phones/tablets). Having a simple roll table with no character-sheet modifiers can be handy in such cases.
* The module should also help users who want to make a quick roll in a click or two without having to type commands in the chat window.

## Acknowledgements
Inspired by the Dice Roller of Roll20. Used JoPeek's [module](https://github.com/jopeek/fvtt-simple-dice-roller/) as a starting point (though this module is a complete rewrite using Foundry components / design patterns).
