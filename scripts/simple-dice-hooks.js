import { SDR } from "../scripts/simple-dice-const.js"
import { DiceForm } from "../scripts/simple-dice-form.js";

// TODO P4: check v10, v11 compatibility; test with other modules :)
Hooks.once('init', () => {
    _loadHandlebarTemplates();
    _registerGameSettings();
    SDR.IS_EXPLODING = false;
    console.log("'Simple Dice Roller Deluxe' module has loaded");
});

Hooks.on("getSceneControlButtons", controls => {
    const customDiceControl = _loadCustomDiceControl();

    if (!controls.includes(customDiceControl)) {
        CONFIG.Canvas.layers.dice = { layerClass: InteractionLayer, group: 'interface' }
        controls.push(customDiceControl);
    }
});

Hooks.on('renderSceneControls', (controls, html) => {
    html.find(`li[data-control=${SDR.MENU_CONTROL}]`).click(event => {
        event.preventDefault();
        new DiceForm().render(true);
    });
    if (Boolean(!game.settings.get(SDR.ID, SDR.CONFIG_ENABLE_SPECIAL_DICE))) {
        SDR.IS_EXPLODING = false;
        html.find(`li[data-tool=${SDR.MENU_EXPL_DICE}]`).hide();
    }
});

function _loadCustomDiceControl() {
    return {
        name: SDR.MENU_CONTROL,
        title: game.i18n.localize('title'),
        icon: "fa-solid fa-dice-d20",
        layer: "dice",
        tools: [{
            name: SDR.MENU_EXPL_DICE,
            title: game.i18n.localize('navigationSettings.explodingDice'),
            icon: 'fa-solid fa-bomb',
            toggle: true,
            onClick: () => {
                SDR.IS_EXPLODING = !SDR.IS_EXPLODING;
                // TODO P2: add second button and toggle alternatives off
            }
        }
    ],
        activeTool: ''
    };
}

function _loadHandlebarTemplates() {
    Handlebars.registerHelper('isCoin', function (value) {
        return value === "dc";
    });
    Handlebars.registerHelper('isD100', function (value) {
       return value === "d100";
   });
   Handlebars.registerHelper('isFate', function (value) {
       return value === "df";
   });
   loadTemplates([SDR.TEMPLATE_PATH]);
}

function _registerGameSettings() {
    // TODO P3: update localizations && look into localization best practices
    game.settings.register(SDR.ID, SDR.CONFIG_MAXDICE_COUNT, {
        name: game.i18n.localize("settings.maxDiceCount.name"),
        hint: game.i18n.localize("settings.maxDiceCount.hint"),
        scope: "world",
        config: true,
        default: 7,
        range: {
            min: 1,
            step: 1,
            max: 30
        },
        type: Number,
        requiresReload: true
    });
    game.settings.register(SDR.ID, SDR.CONFIG_ENABLE_1ST_COLUMN, {
        name: game.i18n.localize("settings.enableFirstColumn.name"),
        hint: game.i18n.localize("settings.enableFirstColumn.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true
    });
    game.settings.register(SDR.ID, SDR.CONFIG_ENABLE_D100, {
        name: game.i18n.localize("settings.enableD100.name"),
        hint: game.i18n.localize("settings.enableD100.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: true
    });
    game.settings.register(SDR.ID, SDR.CONFIG_ENABLE_COINS, {
        name: game.i18n.localize("settings.enableCoins.name"),
        hint: game.i18n.localize("settings.enableCoins.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,

    });
    game.settings.register(SDR.ID, SDR.CONFIG_ENABLE_FUDGE, {
        name: game.i18n.localize("settings.enableFudgeDice.name"),
        hint: game.i18n.localize("settings.enableFudgeDice.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true
    });
    game.settings.register(SDR.ID, SDR.CONFIG_ENABLE_SPECIAL_DICE, {
        name: game.i18n.localize("settings.enableSpecialDiceButtons.name"),
        hint: game.i18n.localize("settings.enableSpecialDiceButtons.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true
    });
}