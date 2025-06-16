/* ************************************************************************************
 * 1] 'hook' to the event framework used by FoundryVTT
 * https://foundryvtt.com/api/classes/foundry.helpers.Hooks.html
 *    -> 1. init to register module settings (see also 3]) + Handlebars helper functions
 *    -> 2. getSceneControlButtons to hook new menu button
 *    -> 3. renderSceneControls to prevent default behavior & load the Dice Table
 * 
 * 2] build a ApplicationV2 for main Dice Table pop-up
 * https://foundryvtt.com/api/classes/foundry.applications.api.ApplicationV2.html
 *    -> call super(options) in constructor
 *    -> set static DEFAULT_OPTIONS + PARTS (for Handlebar templates)
 *    -> _prepareContext(options)) to map to Handlebars template :3
 *    -> _onRende(context, options)r to bind new html elements to diceRolling, etc.
 * 
 * 3] registering a separate (Advanced) settings menu
 * https://foundryvtt.com/api/classes/foundry.helpers.ClientSettings.html#registermenu
 *    -> needs own ApplicationV2 + Handlebars template
 *    // TODO: update after switchig to AppV2
 *    -> override _updateObject() to save updated game settings 
 *    -> the full key to access a settings object is "<module-id>.<setting-id>"
 ************************************************************************************ */

export const SDRD = {
    ID: "simple-dice-roller-deluxe",
    MENU_CONTROL: "sdrd-menu",  // simple-dice-roller-deluxe

    CONFIG_ADVANCED: "advancedSettings",
    CONFIG_HIDDEN_ROLLS: "enableHiddenRolls",
    CONFIG_CTHULHU_D100: "enableCthulhuD100",  // Call of Cthulhu style Bonus / Penalty 
    CONFIG_EXPLODING_DICE: "enableExplodingDice",
    CONFIG_1ST_COLUMN: "enableFirstColumn",
    CONFIG_CLOSE_ROLLER: "closeRollerAfterRoll",
    CONFIG_MAXDICE_COUNT: "maxDiceCount",
    CONFIG_COINS: "enableCoins",
    CONFIG_FUDGE_DICE: "enableFudgeDice",  // a.k.a. Fate dice
    
    DICE_TABLE_PATH: "./modules/simple-dice-roller-deluxe/templates/dice-table.hbs",
    ADVANCED_SETTINGS_PATH: "./modules/simple-dice-roller-deluxe/templates/advanced-settings.hbs",
}