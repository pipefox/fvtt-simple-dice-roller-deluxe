import { SDRD } from "../scripts/simple-dice-const.js";

export class DiceForm extends FormApplication {
    constructor() {
        super();
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
            template: SDRD.TEMPLATE_PATH,
            title: game.i18n.localize('title'),
        });
    }

    getData() {
        this._resetDiceToggles();
        this._updateSettings();

        const indexOffset = this.enableFirstColumn ? 0 : 1;
        const diceTypes = this._getDiceTypes(this.enableCoins, this.enableD100, this.enableFudge);

        const formData = {
            diceTypes: diceTypes.map(diceType => ({
                diceType,
                diceRolls: Array.from({ length: this.maxDiceCount - indexOffset }, (_, i) => i + indexOffset + 1)
            }))
        };
        formData.activateToggles = this.enableSpecialToggles ? true : false;

        return formData;
    }

    _updateSettings() {
        this.maxDiceCount = game.settings.get(SDRD.ID, SDRD.CONFIG_MAXDICE_COUNT);
        this.enableCoins = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_COINS);
        this.enableD100 = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_D100);
        this.enableFudge = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_FUDGE);
        this.enableSpecialToggles = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_SPECIAL_DICE);
        this.enableFirstColumn = game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_1ST_COLUMN);
        this.closeOnRoll = game.settings.get(SDRD.ID, SDRD.CONFIG_CLOSE_FORM_ON_ROLL);
    }

    _resetDiceToggles() {
        SDRD.IS_GM_ROLL = false;
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

    async _rollDie(event) {
        event.preventDefault();  // TODO: test with and without
        const diceRoll = event.currentTarget.dataset.diceRoll;
        const diceType = event.currentTarget.dataset.diceType;

        let formula = diceRoll.concat(diceType);
        // configure various exploding dice
        if (diceType !== "dc" && diceType !== "df" && diceType !== "d100") {
            if ( SDRD.IS_EXPLODING ) formula = formula.concat("x");
            else if ( SDRD.IS_EXPLODING_ONCE ) formula = formula.concat("xo");
        }
       
        let r = new Roll(formula);
        r.toMessage(
          { speaker: game.user._id },
          { rollMode: SDRD.IS_GM_ROLL ? "gmroll" : "roll" }
        );

        if ( this.closeOnRoll && this.rendered && !this.closing ) this.close();
    }

    async _setGMRoll(event) {
        event.preventDefault();
        let radioButton = event.currentTarget.querySelector('input[type="radio"]');
        // TODO: add blind roll to GM ans self-roll
        radioButton.checked = !radioButton.checked;
        SDRD.IS_GM_ROLL= radioButton.checked;
    }
    
    async _toggleExplodingDice(event) {
        event.preventDefault();
        const explodingType = event.currentTarget.dataset.explodingType;
        let radioButton = event.currentTarget.querySelector('input[type="radio"]');
        radioButton.checked = !radioButton.checked;

        if ( radioButton.checked )  {
            if (explodingType === SDRD.MENU_EXPL_DICE) {
                SDRD.IS_EXPLODING = true;
                SDRD.IS_EXPLODING_ONCE = false;
            } else if (explodingType === SDRD.MENU_EXPL_DICE_ONCE) {
                SDRD.IS_EXPLODING_ONCE = true;
                SDRD.IS_EXPLODING = false;
            }
        } else {
            SDRD.IS_EXPLODING = false;
            SDRD.IS_EXPLODING_ONCE = false;
        }
    }
    
    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '.toggle-hidden-roll', this._setGMRoll.bind(this));
        html.on('click', '.toggle-exploding-dice', this._toggleExplodingDice.bind(this));
        html.on('click', '.rollable', this._rollDie.bind(this));
    }
}