import { SDR } from "../scripts/simple-dice-const.js"
import { DiceForm } from "../scripts/simple-dice-form.js";

// TODO P4: check v10, v11 compatibility; test with other modules :)
Hooks.once('init', () => {
    _loadHandlebarTemplates();
    _registerGameSettings();
    SDR.resetSpecialToggles();
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
    // overwrite menu control default behaviour and add our form
    html.find(`li[data-control=${SDR.MENU_CONTROL}]`).click(event => {
        event.preventDefault();
        new DiceForm().render(true);
    });
    // check if special buttons need rendering
    if (Boolean(!game.settings.get(SDR.ID, SDR.CONFIG_ENABLE_SPECIAL_DICE))) {
        SDR.resetSpecialToggles();
        html.find(`li[data-tool=${SDR.MENU_GM_ROLL}]`).hide();
        html.find(`li[data-tool=${SDR.MENU_EXPL_DICE}]`).hide();
        html.find(`li[data-tool=${SDR.MENU_EXPL_DICE_ONCE}]`).hide();
    // manage special buttons exclusive render state (only modify html after loading correct state)
    } else {
        let explodeButton = html.find(`li[data-tool=${SDR.MENU_EXPL_DICE}]`);
        let explodeOnceButton = html.find(`li[data-tool=${SDR.MENU_EXPL_DICE_ONCE}]`);
        if (SDR.IS_EXPLODING) {
            explodeButton.addClass('active');
            explodeOnceButton.removeClass('active');
        } else if (SDR.IS_EXPLODING_ONCE) {
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
      name: SDR.MENU_CONTROL,
      title: game.i18n.localize("title"),
      icon: "fa-solid fa-dice-d20",
      layer: "dice",
      tools: [
        {
          name: SDR.MENU_GM_ROLL,
          title: game.i18n.localize("navigation.makeGMRoll"),
          icon: "fa-duotone fa-user-secret",
          toggle: true,
          onClick: () => {
            SDR.IS_GM_ROLL = !SDR.IS_GM_ROLL;
          }
        },
        {
          name: SDR.MENU_EXPL_DICE,
          title: game.i18n.localize("navigation.explodingDice"),
          icon: "fa-solid fa-bomb",
          toggle: true,
          onClick: () => {
            SDR.IS_EXPLODING = !SDR.IS_EXPLODING;
            if (SDR.IS_EXPLODING) {
                SDR.IS_EXPLODING_ONCE = false;
            }
          }
        },
        {
            name: SDR.MENU_EXPL_DICE_ONCE,
            title: game.i18n.localize("navigation.explodingDiceOnce"),
            icon: "fa-light fa-bomb",
            toggle: true,
            onClick: () => {
                SDR.IS_EXPLODING_ONCE = !SDR.IS_EXPLODING_ONCE;
                if (SDR.IS_EXPLODING_ONCE) {
                    SDR.IS_EXPLODING = false;
                }
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
    loadTemplates([SDR.TEMPLATE_PATH]);
}

function _registerGameSettings() {
    // TODO P2: update localizations && look into localization best practices
    game.settings.register(SDR.ID, SDR.CONFIG_MAXDICE_COUNT, {
        name: game.i18n.localize("settings.maxDiceCount.name"),
        hint: game.i18n.localize("settings.maxDiceCount.hint"),
        scope: "world",
        config: true,
        default: 8,
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
        name: game.i18n.localize("settings.enableSpecialDiceToggles.name"),
        hint: game.i18n.localize("settings.enableSpecialDiceToggles.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
        requiresReload: true
    });
}