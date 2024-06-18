export class SimpleDiceRoller {
    static ID = "simple-dice-roller-deluxe";
    static CONFIG_MAXDICE_COUNT = "maxDiceCount";
    static CONFIG_ENABLE_1ST_COLUMN = "enableColumnOne";
    static CONFIG_ENABLE_FUDGE = "enableFudgeDice";
    static CONFIG_ENABLE_D2 = "enableD2";
    static CONFIG_ENABLE_D100 = "enableD100";
    
    static TEMPLATE_PATH = `modules/${this.ID}/templates/dice-table.hbs`;

    static async Init(controls, html) {
        // TODO P0: add to main Handlebars template if possible
        const diceRollbtn = $(
            `
            <li class="scene-control sdr-scene-control" data-control="simple-dice-roller" title="Simple Dice Roller">
                <i class="fas fa-dice-d20"></i>
            </li>
            `
        );
        const diceRollControls = `
            <ol class="sub-controls app control-tools sdr-sub-controls">
                <li id="SDRpopup" class="simple-dice-roller-popup control-tool">
                </li>
            </ol>
        `;

        html.find(".main-controls").append(diceRollbtn);
        html.append(diceRollControls);

        diceRollbtn[0].addEventListener('click', ev => this.PopupSheet(ev, html));

        this._createDiceTable(html);
    }

    // TODO P1: add secret rolls, exploding [!], compounding [!!] and penetrating [!p] dice 
    static async _createDiceTable(html) {
        // grab values from settings
        let maxDiceCount = parseInt(game.settings.get(this.ID, this.CONFIG_MAXDICE_COUNT), 10);
        const enableFirstColumn = Boolean(game.settings.get(this.ID, this.CONFIG_ENABLE_1ST_COLUMN));
        const enableD2 = Boolean(game.settings.get(this.ID, this.CONFIG_ENABLE_D2));
        const enableD100 = Boolean(game.settings.get(this.ID, this.CONFIG_ENABLE_D100));
        const enableFudge = Boolean(game.settings.get(this.ID, this.CONFIG_ENABLE_FUDGE));

        // do some sanitising & additional parsing
        maxDiceCount = this._sanitizeMaxDiceCount(maxDiceCount);
        const indexOffset = enableFirstColumn ? 0 : 1;
        const diceTypes = this._getDiceTypes(enableD2, enableD100, enableFudge);

        // prep diceData for Handlebars template rendering
        const diceData = {
            diceTypes: diceTypes.map(diceType => ({
                diceType,
                diceRolls: Array.from({ length: maxDiceCount - indexOffset }, (_, i) => i + indexOffset + 1)
            }))
        };
        const tableContentsHtml = await renderTemplate(this.TEMPLATE_PATH, diceData);

        // convert to a JQuery object
        const tableContents = $(tableContentsHtml);

        // manipulate the DOM
        html.find('.simple-dice-roller-popup ul').remove();
        html.find('.simple-dice-roller-popup').append(tableContents);
        html.find('.simple-dice-roller-popup li').click(ev => this._rollDice(ev, html));
    }

    static _sanitizeMaxDiceCount(maxDiceCount) {
        // TODO P3: reflect number back in the settings if overflow, etc.; defaults as constants?
        if (isNaN(maxDiceCount)) {
            maxDiceCount = 7;
        } else if (maxDiceCount < 1) {
            maxDiceCount = 1;
        } else if (maxDiceCount > 30) {
            maxDiceCount = 30;
        }
        return maxDiceCount;
    }

    static _getDiceTypes(enableD2, enableD100, enableFudge) {
        const diceTypes = [];
        if (enableD2) diceTypes.push(2);
        diceTypes.push(4, 6, 8, 10, 12, 20);
        if (enableD100) diceTypes.push(100);
        if (enableFudge) diceTypes.push("f");
        return diceTypes;
    }

    static async _rollDice(event, html) {
        // TODO P3: check if rolling is using latest V12 parser
        var diceType = event.target.dataset.diceType;
        var diceRoll = event.target.dataset.diceRoll;

        var formula = diceRoll + "d" + diceType;

        let r = new Roll(formula);

        r.toMessage({
            user: game.user._id,
        })

        this._close(event, html);

    }

    static async PopupSheet(event, html) {
        if (html.find('.sdr-scene-control').hasClass('active')) {
            this._close(event, html);
        } else {
            this._open(event, html);
        }
    }

    // TODO P3: review handling of opening and closing
    static async _close(event, html) {
        html.find('.sdr-scene-control').removeClass('active');
        html.find('.sdr-sub-controls').removeClass('active');
        html.find('.scene-control').first().addClass('active');
        event.stopPropagation();
    }

    static async _open(event, html) {
        this._createDiceTable(html);
        html.find('.scene-control').removeClass('active');
        html.find('.sub-controls').removeClass('active');

        html.find('.sdr-scene-control').addClass('active');
        html.find('.sdr-sub-controls').addClass('active');
        event.stopPropagation();
    }
}