import { SDRD } from "../scripts/simple-dice-const.js";

export class SettingsMenu extends FormApplication {
    constructor() {
        super();
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "advanced-settings",
            title: "Dice Form Options", // game.i18n.localize("COMBAT.Settings"),
            classes: ["sheet"],
            template: "./modules/simple-dice-roller-deluxe/templates/advanced-settings.hbs",
            width: 520
        });
    }

    getData() {
        console.log("do we get get data?");
        console.log( game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_1ST_COLUMN));
        return {
            enableHiddenRolls: game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_HIDDEN_ROLLS),
            enableExplodingDice: game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_EXPL_DICE),
            enableFirstColumn: game.settings.get(SDRD.ID, SDRD.CONFIG_ENABLE_1ST_COLUMN),
            closeFormOnRoll: game.settings.get(SDRD.ID, SDRD.CONFIG_CLOSE_FORM_ON_ROLL)
          };
    }

    async _updateObject(event, formData) {
        // TODO P1: figure out DOM rendering or triggering requiresReload or updating Dice From, etc.
        await Promise.all(
            Object.entries(formData).map(([key, value]) => game.settings.set(SDRD.ID, key, value))
        );
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}