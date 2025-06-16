import { SDRD } from "./sdrd-constants.js";

// TODO: update to use AppV2
export class AdvancedSettings extends FormApplication {
    constructor() {
        super();
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "advanced-settings",
            title: game.i18n.localize(`settings.${SDRD.CONFIG_ADVANCED}.title`),
            template: SDRD.ADVANCED_SETTINGS_PATH,
            width: 520
        });
    }

    getData() {
        return {
            enableHiddenRolls: game.settings.get(SDRD.ID, SDRD.CONFIG_HIDDEN_ROLLS),
            enableCthulhuD100: game.settings.get(SDRD.ID, SDRD.CONFIG_CTHULHU_D100),
            enableExplodingDice: game.settings.get(SDRD.ID, SDRD.CONFIG_EXPLODING_DICE),
            enableFudgeDice: game.settings.get(SDRD.ID, SDRD.CONFIG_FUDGE_DICE),
            enableCoins: game.settings.get(SDRD.ID, SDRD.CONFIG_COINS)
          };
    }

    async _updateObject(event, formData) {
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