// *********************************************************************
// 1] https://foundryvtt.com/api/classes/client.Hooks.html
// ->'hook' to the event framework used by FoundryVTT
// 
// 2] https://foundryvtt.com/api/classes/client.FormApplication.html
// -> build a Formapplication for the main dice popup
//    -> call super() in constructor
//    -> extend defaultOptions using foundry.utils.mergeObject
//    -> write getData() to link to Handlebar template :3
// *********************************************************************

export const SDRD = {
    ID: "simple-dice-roller-deluxe",
    MENU_CONTROL: "simpledice",
    MENU_EXPL_DICE: "explodingDice",
    MENU_EXPL_DICE_ONCE: "explodingDiceOnce",
    MENU_GM_ROLL: "makeGMRoll",

    CONFIG_MAXDICE_COUNT: "maxDiceCount",
    CONFIG_ENABLE_1ST_COLUMN: "enableFirstColumn",
    CONFIG_CLOSE_FORM_ON_ROLL: "closeFormOnRoll",
    CONFIG_ENABLE_COINS: "enableCoins",
    CONFIG_ENABLE_D100: "enableD100",
    CONFIG_ENABLE_FUDGE: "enableFudgeDice",
    CONFIG_ENABLE_SPECIAL_DICE: "enableSpecialDiceToggles",
    
    TEMPLATE_PATH: "modules/simple-dice-roller-deluxe/templates/dice-table.hbs",
    STANDARD_DICE_TYPES: ["d4", "d6", "d8", "d10", "d12", "d20"],

    IS_EXPLODING: false,
    IS_EXPLODING_ONCE: false,
    IS_GM_ROLL: false
}