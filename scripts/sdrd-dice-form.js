import { SDRD } from "./sdrd-constants.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class DiceForm extends HandlebarsApplicationMixin(ApplicationV2) {
    static GM_ROLL = "makeGMRoll";
    static BLIND_ROLL = "makeBlindRoll";
    static SELF_ROLL = "makeSelfRoll";
    static BONUS_ROLL = "makeBonusRoll";
    static PENALTY_ROLL = "makePenaltyRoll";
    static EXPLODING_DICE = "explodingDice";
    static EXPLODING_DICE_ONCE = "explodingDiceOnce";
    static STANDARD_DICE = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];

    static DEFAULT_OPTIONS = {
        id: "dice-table",
        tag: "aside",
        classes: ["simple-dice-roller"],
        window: { title: "title" },
        position: { width: "auto", height: "auto", left: 120, top: 70 }
    }

    get title() {
        return game.i18n.localize(this.options.window.title);
    }

    static PARTS = {
        diceTable: {
            template: SDRD.DICE_FORM_PATH
        }
    }

    constructor(options = {}) {
        super(options);
        this._instantiateFormSettings();
        this._resetFormToggles();
        // delay render by 50ms (only on open form) to better handle mutliple settings changed at once
        this.scheduleRender = foundry.utils.debounce(this.render.bind(this, {}), 50);
    }

    _instantiateFormSettings() {
        this.enableHiddenRolls = game.settings.get(SDRD.ID, SDRD.CONFIG_HIDDEN_ROLLS);
        this.enableCthulhuD100 = game.settings.get(SDRD.ID, SDRD.CONFIG_CTHULHU_D100);
        this.enableExplodingDice = game.settings.get(SDRD.ID, SDRD.CONFIG_EXPLODING_DICE);
        this.enableFudgeDice = game.settings.get(SDRD.ID, SDRD.CONFIG_FUDGE_DICE);
        this.enableCoins = game.settings.get(SDRD.ID, SDRD.CONFIG_COINS);
        this.maxDiceCount = game.settings.get(SDRD.ID, SDRD.CONFIG_MAXDICE_COUNT);
        this.enableFirstColumn = game.settings.get(SDRD.ID, SDRD.CONFIG_1ST_COLUMN);
        this.closeFormOnRoll = game.settings.get(SDRD.ID, SDRD.CONFIG_CLOSE_FORM);
    }

    _resetFormToggles() {
        // hidden rolls
        this.isGmRoll = false;
        this.isBlindRoll = false;
        this.isSelfRoll = false;
        // Cthulhu rolls
        this.isBonusRoll = false;
        this.isPenaltyRoll = false;
        // Exploding Dice rolls
        this.isExploding = false;
        this.isExplodingOnce = false;
    }

    updateSetting(key, val) {
        this[key] = val;
        this.scheduleRender();
    }

    _prepareContext(options) {
        this._resetFormToggles();  // reset on each render
        const indexOffset = this.enableFirstColumn ? 0 : 1;
        const diceTypes = this._getDiceTypes(this.enableCoins, this.enableFudgeDice);

        return {
            displaySpecialToggles: (this.enableHiddenRolls || this.enableCthulhuD100 || this.enableExplodingDice),
            enableHiddenRolls: this.enableHiddenRolls,
            enableCthulhuD100: this.enableCthulhuD100,
            enableExplodingDice: this.enableExplodingDice,
            diceTypes: diceTypes.map(dt => ({
                diceType: dt,
                diceRolls: Array.from({ length: this.maxDiceCount - indexOffset }, (_, i) => i + indexOffset + 1)
            }))
        };
    }

    _getDiceTypes(enableCoins, enableFudgeDice) {
        const diceTypes = [];
        if (enableCoins) diceTypes.push("dc");
        diceTypes.push(...DiceForm.STANDARD_DICE);
        if (enableFudgeDice) diceTypes.push("df");
        return diceTypes;
    }

    async _setHiddenRoll(event) {
        event.preventDefault();
        const hiddenType = event.currentTarget.dataset.hiddenType;
        const radioButton = event.currentTarget.querySelector('input[type="radio"]');

        radioButton.checked = !radioButton.checked;

        this.isGmRoll = false;
        this.isBlindRoll = false;
        this.isSelfRoll = false;
        if (radioButton.checked) {
            this.isGmRoll = hiddenType === DiceForm.GM_ROLL;
            this.isBlindRoll = hiddenType === DiceForm.BLIND_ROLL;
            this.isSelfRoll = hiddenType === DiceForm.SELF_ROLL;
        }
    }

    async _setCthulhuDiceRoll(event) {
        event.preventDefault();
        const tensType = event.currentTarget.dataset.tensType;
        const radioButton = event.currentTarget.querySelector('input[type="radio"]');

        radioButton.checked = !radioButton.checked;

        this.isBonusRoll = false;
        this.isPenaltyRoll = false;
        if (radioButton.checked) {
            this.isBonusRoll = tensType === DiceForm.BONUS_ROLL;
            this.isPenaltyRoll = tensType === DiceForm.PENALTY_ROLL;
        }
    }

    async _setExplodingDiceRoll(event) {
        event.preventDefault();
        const explodingType = event.currentTarget.dataset.explodingType;
        const radioButton = event.currentTarget.querySelector('input[type="radio"]');

        radioButton.checked = !radioButton.checked;

        this.isExploding = false;
        this.isExplodingOnce = false;
        if (radioButton.checked) {
            this.isExploding = explodingType === DiceForm.EXPLODING_DICE;
            this.isExplodingOnce = explodingType === DiceForm.EXPLODING_DICE_ONCE;
        }
    }

    async _rollDie(event) {
        event.preventDefault();
        const diceRoll = event.currentTarget.dataset.diceRoll;
        const diceType = event.currentTarget.dataset.diceType;

        let formula = diceRoll.concat(diceType);

        // configure'Call of Cthulhu' toggles, here lower is better (kl > kh)
        if (diceType === "d100" && diceRoll !== "1" && this.enableCthulhuD100) {
            // generating tens die is ugly, but works: ex: '/r (3d10kl-1)*10 + 1d10'
            // the crit. failure roll 100 (00 + 0) is emulated by (10-1)*10 + 10.. 
            if (this.isPenaltyRoll) formula = "(" + diceRoll + "d10kh-1)*10+1d10";
            else if (this.isBonusRoll) formula = "(" + diceRoll + "d10kl-1)*10+1d10";
        }

        // configure 'Exploding Dice' toggles, no overlap with 'Call of Cthulhu' toggles
        if (diceType !== "dc" && diceType !== "df" && diceType !== "d100") {
            if (this.isExploding) formula = formula.concat("x");
            else if (this.isExplodingOnce) formula = formula.concat("xo");
        }

        let r = new Roll(formula);
        r.toMessage({ speaker: game.user._id }, { rollMode: this._getRollMode() });

        if (this.closeFormOnRoll && this.rendered && !this.closing) this.close();
    }

    _getRollMode() {
        if (this.isGmRoll) return "gmroll";
        if (this.isBlindRoll) return "blindroll";
        if (this.isSelfRoll) return "selfroll";
        return "roll";
    }

    // TODO P2: use AppV2 DEFAULT_OPTION actions instead
    // https://foundryvtt.wiki/en/development/guides/converting-to-appv2
    async _onRender(context, options) {
        await super._onRender?.(context, options);
        const html = $(this.element);

        const eventBindings = [
            ['.toggle-hidden-roll', this._setHiddenRoll],
            ['.toggle-cthulhu-dice', this._setCthulhuDiceRoll],
            ['.toggle-exploding-dice', this._setExplodingDiceRoll],
            ['.rollable', this._rollDie]
        ];

        for (const [cssSelector, handler] of eventBindings) {
            html
                .off('click', cssSelector)  // clean up listener bloat
                .on('click', cssSelector, handler.bind(this));
        }
    }
}