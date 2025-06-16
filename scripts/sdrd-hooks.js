import { SDRD } from "./sdrd-constants.js"
import { DiceForm } from "./sdrd-dice-form.js";
import { AdvancedSettings } from "./sdrd-adv-settings.js";

let globalDiceForm;

Hooks.once('init', async () => {
    await _loadHandlebarTemplates();
    _registerGameSettings();
    console.log("'Simple Dice Roller Deluxe' module has loaded");
});

Hooks.on("getSceneControlButtons", controls => {
    const controlKey = SDRD.MENU_CONTROL;
    const toolName = "buttonTool";

    controls[controlKey] = {
        name: controlKey,
        title: game.i18n.localize("title"),
        icon: "fas fa-dice-d20",
        order: 99,  // place last
        // we must have a SceneControlTool, otherwise won't render:
        tools: {
            toolName: {
                name: toolName,
                title: "XXXX",
                icon: "fas fa-dice-d20",
                // TODO P3: fix to work, but also change icon to be an X :) !
                button: true,
                onChange(event, active) {
                    // TODO: typo in legacy branch !
                    ui.notifications.info("Oops! This button should not be visible!")
                }
            }
        },
        activeTool: toolName
    };
});

Hooks.on("renderSceneControls", (app, html) => {
    const btn = html.querySelector('button[data-control="simpledice"]');
    if (!btn) return;

    btn.addEventListener("click", event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        globalDiceForm = globalDiceForm || new DiceForm();
        globalDiceForm.render(true);
    });
});

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
    return foundry.applications.handlebars.loadTemplates([
        SDRD.DICE_FORM_PATH,
        SDRD.ADVANCED_SETTINGS_PATH
    ]);
}

function _registerGameSettings() {
    function updateDiceForm(key, val) {
        if (globalDiceForm) {
            globalDiceForm.updateSetting(key, val);
        }
    }
    function registerToggle(key, scope = "world", config = false) {
        game.settings.register(SDRD.ID, key, {
            name: game.i18n.localize(`settings.${key}.name`),
            hint: game.i18n.localize(`settings.${key}.hint`),
            scope,
            config,
            default: false,
            type: Boolean,
            onChange: val => updateDiceForm(key, val)
        });
    }

    // register Advanced Settings Menu
    game.settings.registerMenu(SDRD.ID, SDRD.CONFIG_ADVANCED, {
        name: game.i18n.localize("settings.advanced.name"),
        label: game.i18n.localize("settings.advanced.label"),
        hint: game.i18n.localize("settings.advanced.hint"),
        icon: "fa-duotone fa-table",
        type: AdvancedSettings,
        restricted: true  // only settable by GM
    });
    registerToggle(SDRD.CONFIG_HIDDEN_ROLLS);
    registerToggle(SDRD.CONFIG_CTHULHU_D100);
    registerToggle(SDRD.CONFIG_EXPLODING_DICE);
    registerToggle(SDRD.CONFIG_FUDGE_DICE);
    registerToggle(SDRD.CONFIG_COINS);

    // register Main Settings options
    game.settings.register(SDRD.ID, SDRD.CONFIG_MAXDICE_COUNT, {
        name: game.i18n.localize("settings.maxDiceCount.name"),
        hint: game.i18n.localize("settings.maxDiceCount.hint"),
        scope: "client",
        config: true,
        default: 8,
        range: { min: 1, step: 1, max: 25 },
        type: Number,
        onChange: val => updateDiceForm(SDRD.CONFIG_MAXDICE_COUNT, val)
    });
    registerToggle(SDRD.CONFIG_1ST_COLUMN, "client", true);
    registerToggle(SDRD.CONFIG_CLOSE_FORM, "client", true);
}