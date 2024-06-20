import { SDR } from "../scripts/simple-dice-const.js";

export class DiceForm extends FormApplication {
    constructor() {
        super();
        // TODO P4: refactor?
        this.maxDiceCount = parseInt(game.settings.get(SDR.ID, SDR.CONFIG_MAXDICE_COUNT), 10);
        this.enableFirstColumn = Boolean(game.settings.get(SDR.ID, SDR.CONFIG_ENABLE_1ST_COLUMN));
        this.enableCoins = Boolean(game.settings.get(SDR.ID, SDR.CONFIG_ENABLE_COINS));
        this.enableD100 = Boolean(game.settings.get(SDR.ID, SDR.CONFIG_ENABLE_D100));
        this.enableFudge = Boolean(game.settings.get(SDR.ID, SDR.CONFIG_ENABLE_FUDGE));
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            height: 'auto',
            width: 'auto',
            popOut: true,
            minimizable: true,
            resizable: false,
            id: 'dice-form',
            template: SDR.TEMPLATE_PATH,
            title: game.i18n.localize('title'),
        });
    }

    getData() {
        const indexOffset = this.enableFirstColumn ? 0 : 1;
        const diceTypes = this._getDiceTypes(this.enableCoins, this.enableD100, this.enableFudge);

        // TODO P1 fix: update CSS&li/ul; 
        // when maxCount == 1, we should not render a second row :) or change min to 2 :)
        const diceData = {
            diceTypes: diceTypes.map(diceType => ({
                diceType,
                diceRolls: Array.from({ length: this.maxDiceCount - indexOffset }, (_, i) => i + indexOffset + 1)
            }))
        };
        return diceData;
    }

    _getDiceTypes(enableCoins, enableD100, enableFudge) {
        const diceTypes = [];
        if (enableCoins) diceTypes.push("dc");
        diceTypes.push("d4", "d6", "d8", "d10", "d12", "d20");
        if (enableD100) diceTypes.push("d100");
        if (enableFudge) diceTypes.push("df");
        return diceTypes;
    }

    async _rollDie(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const diceRoll = element.dataset.diceRoll;
        const diceType = element.dataset.diceType;

        let formula = diceRoll.concat(diceType);
        // configure exploding dice
        if (SDR.IS_EXPLODING && diceType !== "dc" && diceType !== "df" && diceType !== "d100") {
            formula = formula.contat("x", diceType);
        }
       
        let r = new Roll(formula);
        r.toMessage({
            user: game.user._id,
        })
        // TODO P5: closeOnSubmit option :)
    }
    
    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '.rollable', this._rollDie.bind(this));
    }
}