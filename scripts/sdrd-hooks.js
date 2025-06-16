import { SDRD } from "./sdrd-constants.js"
import { DiceForm } from "./sdrd-dice-form.js";
import { AdvancedSettings } from "./sdrd-adv-settings.js";

let globalDiceForm;

Hooks.once('init', () => {
    _loadHandlebarTemplates();
    _registerGameSettings();
    console.log("'Simple Dice Roller Deluxe' module has loaded");
});

Hooks.on("getSceneControlButtons", controls => {
    if (!controls.find(c => c.name === SDRD.MENU_CONTROL)) {
        CONFIG.Canvas.layers.simpledice = { layerClass: InteractionLayer, group: 'interface' }
        controls.push(_loadCustomDiceControl());
    }
});

Hooks.on('renderSceneControls', (controls, html) => {
    // very hacky: cache private Foundry _onClickLayer method to execute after our custom control injection
    const cachedOnClickLayer = ui.controls._onClickLayer.bind(ui.controls);
    ui.controls._onClickLayer = function (event, ...rest) {
        if (event.currentTarget.dataset.control === SDRD.MENU_CONTROL) {
            if ( !globalDiceForm ) globalDiceForm = new DiceForm(); 
            globalDiceForm.render(true);
            return;
        }
        cachedOnClickLayer(event, ...rest);
    };
});

function _loadCustomDiceControl() {
    return {
        name: SDRD.MENU_CONTROL,
        title: game.i18n.localize("title"),
        icon: "fa-solid fa-dice-d20",
        layer: SDRD.MENU_CONTROL,
        tools: [{
                // hidden button needed otherwise main menu control won't render
                name: SDRD.MENU_CONTROL,
                title: game.i18n.localize("title"),
                icon: "fa-solid fa-dice-d20",
                onClick: () => ui.notifications.info("Oops! This button should not be visible!"),
                button: true
            }],
        activeTool: ""
    };
}

function _loadHandlebarTemplates() {
    Handlebars.registerHelper("isCoin", function (value) {
        return value === "dc";
    });
    Handlebars.registerHelper("isD100", function (value) {
        return value === "d100";
    });
    Handlebars.registerHelper("isFate", function (value) {
        return value === "df";
    });
    loadTemplates([SDRD.DICE_FORM_PATH]);
    loadTemplates([SDRD.ADVANCED_SETTINGS_PATH]);
}

function _registerGameSettings() {
    // register Advanced Settings Menu
    game.settings.registerMenu(SDRD.ID, SDRD.CONFIG_ADVANCED, {
        name: game.i18n.localize("settings.advanced.name"),
        label: game.i18n.localize("settings.advanced.label"),
        hint: game.i18n.localize("settings.advanced.hint"),
        icon: "fa-duotone fa-table",
        type: AdvancedSettings,
        restricted: true // only settable by GM
      });
    game.settings.register(SDRD.ID, SDRD.CONFIG_HIDDEN_ROLLS, {
        name: game.i18n.localize("settings.enableHiddenRolls.name"),
        hint: game.i18n.localize("settings.enableHiddenRolls.hint"),
        scope: "world",
        config: false,  // display in Advanced Settings
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_HIDDEN_ROLLS, val)
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_CTHULHU_D100, {
        name: game.i18n.localize("settings.enableCthulhuD100.name"),
        hint: game.i18n.localize("settings.enableCthulhuD100.hint"),
        scope: "world",
        config: false,  // display in Advanced Settings
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_CTHULHU_D100, val)
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_EXPLODING_DICE, {
        name: game.i18n.localize("settings.enableExplodingDice.name"),
        hint: game.i18n.localize("settings.enableExplodingDice.hint"),
        scope: "world",
        config: false,  // display in Advanced Settings
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_EXPLODING_DICE, val)
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_FUDGE_DICE, {
        name: game.i18n.localize("settings.enableFudgeDice.name"),
        hint: game.i18n.localize("settings.enableFudgeDice.hint"),
        scope: "world",
        config: false,  // display in Advanced Settings
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_FUDGE_DICE, val)
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_COINS, {
        name: game.i18n.localize("settings.enableCoins.name"),
        hint: game.i18n.localize("settings.enableCoins.hint"),
        scope: "world",
        config: false,  // display in Advanced Settings
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_COINS, val)
    });

    // register main config settings
    game.settings.register(SDRD.ID, SDRD.CONFIG_MAXDICE_COUNT, {
        name: game.i18n.localize("settings.maxDiceCount.name"),
        hint: game.i18n.localize("settings.maxDiceCount.hint"),
        scope: "client",
        config: true,
        default: 8,
        range: { min: 1, step: 1, max: 25 },
        type: Number,
        requiresReload: true
    });
        game.settings.register(SDRD.ID, SDRD.CONFIG_1ST_COLUMN, {
        name: game.i18n.localize("settings.enableFirstColumn.name"),
        hint: game.i18n.localize("settings.enableFirstColumn.hint"),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_1ST_COLUMN, val)
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_CLOSE_FORM, {
        name: game.i18n.localize("settings.closeFormOnRoll.name"),
        hint: game.i18n.localize("settings.closeFormOnRoll.hint"),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_CLOSE_FORM, val)
    });

    function _updateDiceForm(key, val) {
        if (globalDiceForm) {
            globalDiceForm.updateSetting(key, val);
        }
    }
}