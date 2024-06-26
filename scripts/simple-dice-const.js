// ************************************************************************************
// 1] https://foundryvtt.com/api/classes/client.Hooks.html
// ->'hook' to the event framework used by FoundryVTT
//    -> init to register module settings + handlebar helper functions & template
//    -> getSceneControls to hook new button
//    -> renderSceneControls to prevent default focusing behavior & load the Dice Form
// 
// 2] https://foundryvtt.com/api/classes/client.FormApplication.html
// -> build a Formapplication for the main Dice Form popup
//    -> call super() in constructor
//    -> extend defaultOptions using foundry.utils.mergeObject
//    -> write getData() to link to Handlebar template :3
//    -> extend activateListeners to bind new html elements to diceRolling, etc.
// ************************************************************************************

export const SDRD = {
    ID: "simple-dice-roller-deluxe",
    MENU_CONTROL: "simpledice",

    CONFIG_ADVANCED: "advancedSettings",
    CONFIG_HIDDEN_ROLLS: "enableHiddenRolls",
    CONFIG_EXPLODING_DICE: "enableExplodingDice",
    CONFIG_1ST_COLUMN: "enableFirstColumn",
    CONFIG_CLOSE_FORM: "closeFormOnRoll",
    CONFIG_MAXDICE_COUNT: "maxDiceCount",
    CONFIG_COC_D100: "enableCoCD100",  // Call of Cthulhu style Bonus / Penalty 
    CONFIG_COINS: "enableCoins",
    CONFIG_FUDGE_DICE: "enableFudgeDice",  // a.k.a. Fate dice
    
    DICE_FORM_PATH: "./modules/simple-dice-roller-deluxe/templates/dice-form.hbs",
    ADVANCED_SETTINGS_PATH: "./modules/simple-dice-roller-deluxe/templates/advanced-settings.hbs",
}