import { SDRD } from "../scripts/simple-dice-const.js"
import { DiceForm } from "../scripts/simple-dice-form.js";

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
    loadTemplates([SDRD.TEMPLATE_PATH]);
}

function _registerGameSettings() {
    game.settings.register(SDRD.ID, SDRD.CONFIG_MAXDICE_COUNT, {
        name: game.i18n.localize(`settings.${SDRD.CONFIG_MAXDICE_COUNT}.name`),
        hint: game.i18n.localize(`settings.${SDRD.CONFIG_MAXDICE_COUNT}.hint`),
        scope: "client",
        config: true,
        default: 8,
        range: { min: 1, step: 1, max: 25 },
        type: Number,
        requiresReload: true
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_D100, {
        name: game.i18n.localize(`settings.${SDRD.CONFIG_ENABLE_D100}.name`),
        hint: game.i18n.localize(`settings.${SDRD.CONFIG_ENABLE_D100}.hint`),
        scope: "client",
        config: true,
        default: true,
        type: Boolean,
        onChange: () => _updateForm()
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_COINS, {
        name: game.i18n.localize(`settings.${SDRD.CONFIG_ENABLE_COINS}.name`),
        hint: game.i18n.localize(`settings.${SDRD.CONFIG_ENABLE_COINS}.hint`),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => _updateForm()
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_FUDGE, {
        name: game.i18n.localize(`settings.${SDRD.CONFIG_ENABLE_FUDGE}.name`),
        hint: game.i18n.localize(`settings.${SDRD.CONFIG_ENABLE_FUDGE}.hint`),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => _updateForm()
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_SPECIAL_DICE, {
        name: game.i18n.localize(`settings.${SDRD.CONFIG_ENABLE_SPECIAL_DICE}.name`),
        hint: game.i18n.localize(`settings.${SDRD.CONFIG_ENABLE_SPECIAL_DICE}.hint`),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => _updateForm()
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_1ST_COLUMN, {
        name: game.i18n.localize(`settings.${SDRD.CONFIG_ENABLE_1ST_COLUMN}.name`),
        hint: game.i18n.localize(`settings.${SDRD.CONFIG_ENABLE_1ST_COLUMN}.hint`),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => _updateForm()
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_CLOSE_FORM_ON_ROLL, {
        name: game.i18n.localize(`settings.${SDRD.CONFIG_CLOSE_FORM_ON_ROLL}.name`),
        hint: game.i18n.localize(`settings.${SDRD.CONFIG_CLOSE_FORM_ON_ROLL}.hint`),
        scope: "client",
        config: true,
        default: false,
        type: Boolean,
        onChange: () => _updateForm()
    });
    // TODO: test behavior with getData change
    function _updateForm() {
        if (globalDiceForm) {
            globalDiceForm._updateSettings();
            globalDiceForm._resetDiceToggles();
            globalDiceForm.render(false);
        }
    }
}