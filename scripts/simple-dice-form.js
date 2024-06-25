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

    // TODO P3: figure out better way to do tooltips (copy Foudnry style)
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
        // TODO P2: research if easier way to localize?
        if (this.enableSpecialToggles) {
            formData.activateToggles = this.enableSpecialToggles;
            formData.legendHiddenRolls = game.i18n.localize(`legend.${SDRD.LEGEND_HIDDEN_ROLLS}`);
            formData.legendExplodingeDice = game.i18n.localize(`legend.${SDRD.LEGEND_EXPLODING_DICE}`);
            formData.privateRollTitle = game.i18n.localize(`navigation.${SDRD.MENU_GM_ROLL}`);
            formData.blindRollTitle = game.i18n.localize(`navigation.${SDRD.MENU_BLIND_ROLL}`);
            formData.selfRollTitle = game.i18n.localize(`navigation.${SDRD.MENU_SELF_ROLL}`);
            formData.explodingDiceTitle = game.i18n.localize(`navigation.${SDRD.MENU_EXPL_DICE}`);
            formData.explodingOnceDiceTitle = game.i18n.localize(`navigation.${SDRD.MENU_EXPL_DICE_ONCE}`);
        }
        console.log("AAAAAAAAAAAA", game.i18n.localize(`navigation.${SDRD.MENU_GM_ROLL}`));

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

    async _rollDie(event) {
        event.preventDefault();  // TODO P2: test with and without
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
            { rollMode: SDRD.IS_GM_ROLL ? "gmroll" : 
                        SDRD.IS_BLIND_ROLL ? "blindroll" : 
                        SDRD.IS_SELF_ROLL ? "selfroll" : 
                        "roll"
            }
        );

        if ( this.closeOnRoll && this.rendered && !this.closing ) this.close();
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
            if ( hiddenType === SDRD.MENU_GM_ROLL ) SDRD.IS_GM_ROLL = true;
            else if ( hiddenType === SDRD.MENU_BLIND_ROLL ) SDRD.IS_BLIND_ROLL = true;
            else if ( hiddenType === SDRD.MENU_SELF_ROLL ) SDRD.IS_SELF_ROLL = true;
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
            if ( explodingType === SDRD.MENU_EXPL_DICE ) SDRD.IS_EXPLODING = true;
            else if (explodingType === SDRD.MENU_EXPL_DICE_ONCE) SDRD.IS_EXPLODING_ONCE = true;
        }
    }
    
    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '.toggle-hidden-roll', this._setHiddenRoll.bind(this));
        html.on('click', '.toggle-exploding-dice', this._setExplodingDiceRoll.bind(this));
        html.on('click', '.rollable', this._rollDie.bind(this));
    }
}