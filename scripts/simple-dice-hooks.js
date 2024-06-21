import { SDRD } from "../scripts/simple-dice-const.js"
import { DiceForm } from "../scripts/simple-dice-form.js";

Hooks.once('init', () => {
    _loadHandlebarTemplates();
    _registerGameSettings();
    SDRD.resetSpecialToggles();
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
    // overwrite menu control default behaviour and add our dice form
    html.find(`li[data-control=${SDRD.MENU_CONTROL}]`).click(event => {
        event.preventDefault();
        new DiceForm().render(true);
    });
    // check if special buttons need rendering
    if (Boolean(!game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_SPECIAL_DICE))) {
        SDRD.resetSpecialToggles();
        html.find(`li[data-tool=${SDRD.MENU_GM_ROLL}]`).hide();
        html.find(`li[data-tool=${SDRD.MENU_EXPL_DICE}]`).hide();
        html.find(`li[data-tool=${SDRD.MENU_EXPL_DICE_ONCE}]`).hide();
    // manage special buttons exclusive render state (only modify html after loading correct state)
    } else {
        let explodeButton = html.find(`li[data-tool=${SDRD.MENU_EXPL_DICE}]`);
        let explodeOnceButton = html.find(`li[data-tool=${SDRD.MENU_EXPL_DICE_ONCE}]`);
        if (SDRD.IS_EXPLODING) {
            explodeButton.addClass('active');
            explodeOnceButton.removeClass('active');
        } else if (SDRD.IS_EXPLODING_ONCE) {
            explodeButton.removeClass('active');
            explodeOnceButton.addClass('active');
        } else {
            explodeButton.removeClass('active');
            explodeOnceButton.removeClass('active');
        }
    }
});

function _loadCustomDiceControl() {
    return {
        name: SDRD.MENU_CONTROL,
        title: game.i18n.localize("title"),
        icon: "fa-solid fa-dice-d20",
        layer: "dice",
        tools: [
            {
            name: SDRD.MENU_GM_ROLL,
            title: game.i18n.localize("navigation.makeGMRoll"),
            icon: "fa-duotone fa-user-secret",
            toggle: true,
            onClick: () => {
                SDRD.IS_GM_ROLL = !SDRD.IS_GM_ROLL;
            }
            },
            {
            name: SDRD.MENU_EXPL_DICE,
            title: game.i18n.localize("navigation.explodingDice"),
            icon: "fa-solid fa-bomb",
            toggle: true,
            onClick: () => {
                SDRD.IS_EXPLODING = !SDRD.IS_EXPLODING;
                if (SDRD.IS_EXPLODING) SDRD.IS_EXPLODING_ONCE = false;
            }
            },
            {
            name: SDRD.MENU_EXPL_DICE_ONCE,
            title: game.i18n.localize("navigation.explodingDiceOnce"),
            icon: "fa-solid fa-land-mine-on",
            toggle: true,
            onClick: () => {
                SDRD.IS_EXPLODING_ONCE = !SDRD.IS_EXPLODING_ONCE;
                if (SDRD.IS_EXPLODING_ONCE) SDRD.IS_EXPLODING = false;
            }
            }
        ],
        activeTool: "",
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
        name: game.i18n.localize("settings.maxDiceCount.name"),
        hint: game.i18n.localize("settings.maxDiceCount.hint"),
        scope: "world",
        config: true,
        default: 8,
        range: { min: 1, step: 1, max: 25 },
        type: Number,
        requiresReload: true
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_1ST_COLUMN, {
        name: game.i18n.localize("settings.enableFirstColumn.name"),
        hint: game.i18n.localize("settings.enableFirstColumn.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_D100, {
        name: game.i18n.localize("settings.enableD100.name"),
        hint: game.i18n.localize("settings.enableD100.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
        requiresReload: true
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_COINS, {
        name: game.i18n.localize("settings.enableCoins.name"),
        hint: game.i18n.localize("settings.enableCoins.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,

    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_FUDGE, {
        name: game.i18n.localize("settings.enableFudgeDice.name"),
        hint: game.i18n.localize("settings.enableFudgeDice.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true
    });
    game.settings.register(SDRD.ID, SDRD.CONFIG_ENABLE_SPECIAL_DICE, {
        name: game.i18n.localize("settings.enableSpecialDiceToggles.name"),
        hint: game.i18n.localize("settings.enableSpecialDiceToggles.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true
    });
}