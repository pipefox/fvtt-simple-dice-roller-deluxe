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

export class SDR {
    static ID = "simple-dice-roller-deluxe";
    static MENU_CONTROL = "simpledice";
    static MENU_EXPL_DICE = "expldice";
    static MENU_EXPL_DICE_ONCE = "exploncedice";
    static MENU_GM_ROLL = "gmroll";

    static CONFIG_MAXDICE_COUNT = "maxDiceCount";
    static CONFIG_ENABLE_1ST_COLUMN = "enableColumnOne";
    static CONFIG_ENABLE_D100 = "enableD100";
    static CONFIG_ENABLE_COINS = "enableCoins";
    static CONFIG_ENABLE_FUDGE = "enableFudgeDice";
    static CONFIG_ENABLE_SPECIAL_DICE = "enableSpecialDice";
    
    static TEMPLATE_PATH = `modules/${this.ID}/templates/dice-table.hbs`;

    static IS_EXPLODING = false;
    static IS_EXPLODING_ONCE = false;
    static IS_GM_ROLL = false;

    static resetSpecialToggles() {
        this.IS_EXPLODING = false;
        this.IS_EXPLODING_ONCE = false;
        this.IS_GM_ROLL = false;
    }
}