import { SDRD } from "../scripts/simple-dice-const.js";

export class SettingsMenu extends FormApplication {
    constructor() {
        super();
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "advanced-settings",
            title: game.i18n.localize("settings.advanced.title"),
            template: SDRD.ADVANCED_SETTINGS_PATH,
            width: 520
        });
    }

    getData() {
        return {
            enableHiddenRolls: game.settings.get(SDRD.ID, SDRD.CONFIG_HIDDEN_ROLLS),
            enableExplodingDice: game.settings.get(SDRD.ID, SDRD.CONFIG_EXPLODING_DICE),
            enableFirstColumn: game.settings.get(SDRD.ID, SDRD.CONFIG_1ST_COLUMN),
            closeFormOnRoll: game.settings.get(SDRD.ID, SDRD.CONFIG_CLOSE_FORM)
          };
    }

    async _updateObject(event, formData) {
        // TODO P2: A. figure out DOM rendering issue for:
        // await Promise.all(
        //     Object.entries(formData).map(([key, value]) => game.settings.set(SDRD.ID, key, value))
        // );
        // B. or find a native way to say "pls reload on changes" without this overkill
        // on a first glance -> there's no native Foundry solution
        let requiresClientReload = false;
        for ( let [key, val] of Object.entries(foundry.utils.flattenObject(formData)) ) {
            const fullKey = SDRD.ID + "." + key;
            let s = game.settings.settings.get(fullKey);  // 'raw' settings object
            let current = game.settings.get(s.namespace, s.key);
            if ( val === current ) continue;
            requiresClientReload ||= s.requiresReload;
            await game.settings.set(s.namespace, s.key, val);
          }
          if ( requiresClientReload ) SettingsConfig.reloadConfirm({world: true});
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}