/* ************************************************************************************
 * 1] 'hook' to the event framework used by FoundryVTT
 * https://foundryvtt.com/api/classes/client.Hooks.html
 *    -> init to register module settings (see also 3]) + Handlebars helper functions,
 *       loading Handlebars templates seems optional
 *    -> getSceneControls to hook new menu button
 *    -> renderSceneControls to prevent default behavior & load the Dice Form
 * 
 * 2] build a FormApplication for main Dice Form popup
 * https://foundryvtt.com/api/classes/client.FormApplication.html 
 *    -> call super() in constructor
 *    -> extend defaultOptions using foundry.utils.mergeObject
 *    -> write getData() to link to Handlebars template :3
 *    -> extend activateListeners to bind new html elements to diceRolling, etc.
 * 
 * 3] registering a separate settings menu
 * https://foundryvtt.com/api/classes/client.ClientSettings.html#registerMenu
 *    -> needs own FormApplication + Handlebars template
 *    -> override _updateObject() to save updated game settings
 *    -> the full key to access a settings object is "<module-id>.<setting-id>"
 ************************************************************************************ */

export const SDRD = {
    ID: "simple-dice-roller-deluxe",
    MENU_CONTROL: "simpledice",

    CONFIG_ADVANCED: "advancedSettings",
    CONFIG_HIDDEN_ROLLS: "enableHiddenRolls",
    CONFIG_CTHULHU_D100: "enableCthulhuD100",  // Call of Cthulhu style Bonus / Penalty 
    CONFIG_EXPLODING_DICE: "enableExplodingDice",
    CONFIG_1ST_COLUMN: "enableFirstColumn",
    CONFIG_CLOSE_FORM: "closeFormOnRoll",
    CONFIG_MAXDICE_COUNT: "maxDiceCount",
    CONFIG_COINS: "enableCoins",
    CONFIG_FUDGE_DICE: "enableFudgeDice",  // a.k.a. Fate dice
    
    DICE_FORM_PATH: "./modules/simple-dice-roller-deluxe/templates/dice-form.hbs",
    ADVANCED_SETTINGS_PATH: "./modules/simple-dice-roller-deluxe/templates/advanced-settings.hbs",
}