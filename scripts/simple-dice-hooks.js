import { SDRD } from "../scripts/simple-dice-const.js"
import { DiceForm } from "../scripts/simple-dice-form.js";
import { SettingsMenu } from "../scripts/simple-dice-settings-form.js";

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
            return; // do not skip!
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
        tools: [
            {
                // hidden button needed otherwise main menu control won't render
                name: SDRD.MENU_CONTROL,
                title: game.i18n.localize("title"),
                icon: "fa-solid fa-dice-d20",
                onClick: () => ui.notifications.info("Oops! This buton should not be visible!"),
                button: true
            },
        ],
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
}

function _registerGameSettings() {
    // register Advanced Settings Menu
    game.settings.registerMenu(SDRD.ID, SDRD.CONFIG_ADVANCED, {
        // TODO P3: localization!
        name: "Advanced Settings",
        label: "Configure Dice Form",
        hint: "Fine tune the general appearance and behavior of the Dice Form.",
        icon: "fa-duotone fa-table",
        type: SettingsMenu
      });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_HIDDEN_ROLLS, {
        name: game.i18n.localize("settings.enableHiddenRolls.name"),
        hint: game.i18n.localize("settings.enableHiddenRolls.hint"),
        scope: "client",
        config: false,  // display in Advanced Settings
        default: false,
        type: Boolean,
        requiresReload: true
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_EXPL_DICE, {
        name: game.i18n.localize("settings.enableExplodingDice.name"),
        hint: game.i18n.localize("settings.enableExplodingDice.hint"),
        scope: "client",
        config: false,  // display in Advanced Settings
        default: false,
        type: Boolean,
        requiresReload: true
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_1ST_COLUMN, {
        name: game.i18n.localize("settings.enableFirstColumn.name"),
        hint: game.i18n.localize("settings.enableFirstColumn.hint"),
        scope: "client",
        config: false,  // display in Advanced Settings
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_ENABLE_1ST_COLUMN, val)
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_CLOSE_FORM_ON_ROLL, {
        name: game.i18n.localize("settings.closeFormOnRoll.name"),
        hint: game.i18n.localize("settings.closeFormOnRoll.hint"),
        scope: "client",
        config: false,  // display in Advanced Settings
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_CLOSE_FORM_ON_ROLL, val)
    });

    // register individual settings
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
    // TODO P4: update for Call of Cthulhu
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_D100, {
        name: game.i18n.localize("settings.enableD100.name"),
        hint: game.i18n.localize("settings.enableD100.hint"),
        scope: "client",
        config: false,
        default: true,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_ENABLE_D100, val)
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_COINS, {
        name: game.i18n.localize("settings.enableCoins.name"),
        hint: game.i18n.localize("settings.enableCoins.hint"),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_ENABLE_COINS, val)
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_FUDGE, {
        name: game.i18n.localize("settings.enableFudgeDice.name"),
        hint: game.i18n.localize("settings.enableFudgeDice.hint"),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: (val) => _updateDiceForm(SDRD.CONFIG_ENABLE_FUDGE, val)
    });

    function _updateDiceForm(key, val) {
        console.log("key updateDiceFrom", key);
        console.log("val updateDiceFrom", val);
        if (globalDiceForm) {
            globalDiceForm.updateSetting(key, val);
            globalDiceForm.render(false);  // re-render only if already open
        }
    }
}