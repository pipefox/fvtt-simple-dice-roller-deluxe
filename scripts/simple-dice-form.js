import { SDRD } from "../scripts/simple-dice-const.js";

export class DiceForm extends FormApplication {
    constructor() {
        super();
        // register class variables and get their initial state
        // TODO P2: consider using this[SDRD.CONFIG_..] =
        this.enableHiddenRolls = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_HIDDEN_ROLLS);
        this.enableExplodingDice = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_EXPL_DICE);
        this.enableFirstColumn = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_1ST_COLUMN);
        this.closeFormOnRoll = game.settings.get(SDRD.ID, SDRD.CONFIG_CLOSE_FORM_ON_ROLL);
        this.maxDiceCount = game.settings.get(SDRD.ID, SDRD.CONFIG_MAXDICE_COUNT);
        this.enableD100 = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_COINS);
        this.enableCoins = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_D100);
        this.enableFudgeDice = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_FUDGE);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            height: 'auto',
            width: 'auto',
            top: 70,
            left: 120,
            popOut: true,
            resizable: false,
            id: 'dice-form',
            template: SDRD.DICE_FORM_PATH,
            title: game.i18n.localize('title'),
        });
    }

    getData() {
        this._resetDiceToggles();  // everytime we render the form anew, reset the inner toggles

        const indexOffset = this.enableFirstColumn ? 0 : 1;
        const diceTypes = this._getDiceTypes(this.enableCoins, this.enableD100, this.enableFudgeDice);

        return {
            displaySpecialToggles: (this.enableHiddenRolls || this.enableExplodingDice),
            enableHiddenRolls: this.enableHiddenRolls,
            enableExplodingDice: this.enableExplodingDice,
            diceTypes: diceTypes.map(diceType => ({
                diceType,
                diceRolls: Array.from({ length: this.maxDiceCount - indexOffset }, (_, i) => i + indexOffset + 1)
            }))
        };
    }

    updateSetting(key, val) {
        this[key] = val;
    }

    _resetDiceToggles() {
        SDRD.IS_GM_ROLL = false;
        SDRD.IS_BLIND_ROLL = false;
        SDRD.IS_SELF_ROLL = false;
        SDRD.IS_EXPLODING = false;
        SDRD.IS_EXPLODING_ONCE = false;
    }

    _getDiceTypes(enableCoins, enableD100, enableFudge) {
        const diceTypes = [];
        if (enableCoins) diceTypes.push("dc");
        diceTypes.push(...SDRD.STANDARD_DICE_TYPES);
        if (enableD100) diceTypes.push("d100");
        if (enableFudge) diceTypes.push("df");
        return diceTypes;
    }

    async _setHiddenRoll(event) {
        event.preventDefault();
        const hiddenType = event.currentTarget.dataset.hiddenType;
        const radioButton = event.currentTarget.querySelector('input[type="radio"]');

        radioButton.checked = !radioButton.checked;

        SDRD.IS_GM_ROLL = false;
        SDRD.IS_BLIND_ROLL = false;
        SDRD.IS_SELF_ROLL = false;
        if ( radioButton.checked )  {
            if ( hiddenType === SDRD.GM_ROLL ) SDRD.IS_GM_ROLL = true;
            else if ( hiddenType === SDRD.BLIND_ROLL ) SDRD.IS_BLIND_ROLL = true;
            else if ( hiddenType === SDRD.SELF_ROLL ) SDRD.IS_SELF_ROLL = true;
        }
    }
    
    async _setExplodingDiceRoll(event) {
        event.preventDefault();
        const explodingType = event.currentTarget.dataset.explodingType;
        const radioButton = event.currentTarget.querySelector('input[type="radio"]');

        radioButton.checked = !radioButton.checked;

        SDRD.IS_EXPLODING = false;
        SDRD.IS_EXPLODING_ONCE = false;
        if ( radioButton.checked )  {
            if ( explodingType === SDRD.EXPLODING_DICE ) SDRD.IS_EXPLODING = true;
            else if (explodingType === SDRD.EXPLODING_DICE_ONCE) SDRD.IS_EXPLODING_ONCE = true;
        }
    }

    async _rollDie(event) {
        event.preventDefault();
        const diceRoll = event.currentTarget.dataset.diceRoll;
        const diceType = event.currentTarget.dataset.diceType;

        let formula = diceRoll.concat(diceType);
        // configure exploding dice
        if (diceType !== "dc" && diceType !== "df" && diceType !== "d100") {
            if ( SDRD.IS_EXPLODING ) formula = formula.concat("x");
            else if ( SDRD.IS_EXPLODING_ONCE ) formula = formula.concat("xo");
        }
       
        let r = new Roll(formula);
        r.toMessage(
            { speaker: game.user._id },
            // configure hidden rolls
            { rollMode: SDRD.IS_GM_ROLL ? "gmroll" : 
                        SDRD.IS_BLIND_ROLL ? "blindroll" : 
                        SDRD.IS_SELF_ROLL ? "selfroll" : 
                        "roll"
            }
        );

        if ( this.closeFormOnRoll && this.rendered && !this.closing ) this.close();
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '.toggle-hidden-roll', this._setHiddenRoll.bind(this));
        html.on('click', '.toggle-exploding-dice', this._setExplodingDiceRoll.bind(this));
        html.on('click', '.rollable', this._rollDie.bind(this));
    }
}