import { SimpleDiceRoller } from "../scripts/simple-dice-roller-main.js";

// here is where we 'hook' to the event framework used by FoundryVTT
// https://foundryvtt.com/api/classes/client.Hooks.html
Hooks.once("init", () => {
    _loadHandlebarTemplates();
    _registerGameSettings();
    console.log("SDR | Simple Dice Roller Deluxe is loaded");
});

// TODO P2: split static init from rendering table
// Hooks.on("getSceneControlButtons", controls => {
Hooks.on('renderSceneControls', (controls, html) => {
    SimpleDiceRoller.Init(controls, html);
});

function _loadHandlebarTemplates() {
   Handlebars.registerHelper('isD100', function (value) {
       return value === 100;
   });
   Handlebars.registerHelper('isFate', function (value) {
       return value === "f";
   });
   loadTemplates([SimpleDiceRoller.TEMPLATE_PATH]);
}

function _registerGameSettings() {
    // TODO P3: look into localization options; best practices?
    // TODO P4: update localization
    game.settings.register(SimpleDiceRoller.ID, SimpleDiceRoller.CONFIG_MAXDICE_COUNT, {
        name: game.i18n.localize("simpleDiceRoller.maxDiceCount.name"),
        hint: game.i18n.localize("simpleDiceRoller.maxDiceCount.hint"),
        scope: "world",
        config: true,
        default: 7,
        type: Number
    });
    game.settings.register(SimpleDiceRoller.ID, SimpleDiceRoller.CONFIG_ENABLE_1ST_COLUMN, {
        name: game.i18n.localize("simpleDiceRoller.enableFirstColumn.name"),
        hint: game.i18n.localize("simpleDiceRoller.enableFirstColumn.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register(SimpleDiceRoller.ID, SimpleDiceRoller.CONFIG_ENABLE_D2, {
        name: game.i18n.localize("simpleDiceRoller.enableD2.name"),
        hint: game.i18n.localize("simpleDiceRoller.enableD2.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
    game.settings.register(SimpleDiceRoller.ID, SimpleDiceRoller.CONFIG_ENABLE_D100, {
        name: game.i18n.localize("simpleDiceRoller.enableD100.name"),
        hint: game.i18n.localize("simpleDiceRoller.enableD100.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });
    game.settings.register(SimpleDiceRoller.ID, SimpleDiceRoller.CONFIG_ENABLE_FUDGE, {
        name: game.i18n.localize("simpleDiceRoller.enableFudgeDice.name"),
        hint: game.i18n.localize("simpleDiceRoller.enableFudgeDice.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });
}