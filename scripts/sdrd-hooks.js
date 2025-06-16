import { SDRD } from "./sdrd-constants.js"
import { DiceTable } from "./sdrd-dice-table.js";
import { AdvancedSettings } from "./sdrd-adv-settings.js";

let globalDiceTable;

Hooks.once('init', async () => {
    await _loadHandlebarTemplates();
    _registerGameSettings();
    console.log("'Simple Dice Roller Deluxe' module has loaded");
});

Hooks.on("getSceneControlButtons", controls => {
    const controlKey = SDRD.MENU_CONTROL;
    const toolName = "xbutton";  // for stub SceneControlTool

    controls[controlKey] = {
        name: controlKey,
        title: game.i18n.localize("title"),
        icon: "fa-solid fa-dice-d20",
        order: 99,  // place last
        // must have a SceneControlTool, otherwise won't render:
        tools: {
            [toolName]: {
                icon: "fas fa-times",
                name: toolName,
                order: 1,
                title: "SHOULD NOT BE VISIBLE"
            }
        },
        activeTool: toolName
    };
});

Hooks.on("renderSceneControls", (app, html) => {
    const btn = html.querySelector('button[data-control="sdrd-menu"]');
    if (!btn) return;

    btn.addEventListener("click", event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        globalDiceTable = globalDiceTable || new DiceTable();
        globalDiceTable.render(true);
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
        SDRD.DICE_TABLE_PATH,
        SDRD.ADVANCED_SETTINGS_PATH
    ]);
}

function _registerGameSettings() {
    function updateDiceTable(key, val) {
        if (globalDiceTable) {
            globalDiceTable.updateSetting(key, val);
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
            onChange: val => updateDiceTable(key, val)
        });
    }

    // register Main Settings options
    game.settings.register(SDRD.ID, SDRD.CONFIG_MAXDICE_COUNT, {
        name: game.i18n.localize(`settings.${SDRD.CONFIG_MAXDICE_COUNT}.name`),
        hint: game.i18n.localize(`settings.${SDRD.CONFIG_MAXDICE_COUNT}.hint`),
        scope: "client",
        config: true,
        default: 8,
        range: { min: 1, step: 1, max: 25 },
        type: Number,
        onChange: val => updateDiceTable(SDRD.CONFIG_MAXDICE_COUNT, val)
    });
    registerToggle(SDRD.CONFIG_1ST_COLUMN, "client", true);
    registerToggle(SDRD.CONFIG_CLOSE_ROLLER, "client", true);

    // register Advanced Settings Menu
    game.settings.registerMenu(SDRD.ID, SDRD.CONFIG_ADVANCED, {
        name: game.i18n.localize(`settings.${SDRD.CONFIG_ADVANCED}.name`),
        label: game.i18n.localize(`settings.${SDRD.CONFIG_ADVANCED}.label`),
        hint: game.i18n.localize(`settings.${SDRD.CONFIG_ADVANCED}.hint`),
        icon: "fa-duotone fa-table",
        type: AdvancedSettings,
        restricted: true  // only settable by GM
    });
    registerToggle(SDRD.CONFIG_HIDDEN_ROLLS);
    registerToggle(SDRD.CONFIG_CTHULHU_D100);
    registerToggle(SDRD.CONFIG_EXPLODING_DICE);
    registerToggle(SDRD.CONFIG_FUDGE_DICE);
    registerToggle(SDRD.CONFIG_COINS);
}