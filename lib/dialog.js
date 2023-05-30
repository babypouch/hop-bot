"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const botbuilder_dialogs_1 = require("botbuilder-dialogs");
/*
Where do you plan on using the car seat?
Uber / Lyft)
Public transit
Air travel
Do you have space limitations we should consider?
Cars with tight back space
Need to fit more than 2 children in a row in the future
Extra space
Do you have a stroller selected, or do you have a hand-me-down stroller?
Are there any specific features that are important to you?
Eco-friendly & non-toxic
Compact & lightweight
Extra safety features
Quality & Comfort
*/
const WATERFALL_DIALOG = 'WATERFALL_DIALOG';
const TRANSPORT_CHOICE_PROMPT = 'TRANSPORT_CHOICE_PROMPT';
const SPACE_CHOICE_PROMPT = 'SPACE_CHOICE_PROMPT';
const STROLLER_TEXT_PROMPT = 'STROLLER_TEXT_PROMPT';
class CarSeatDialog extends botbuilder_dialogs_1.ComponentDialog {
    constructor(userState) {
        super('carSeatDialog');
        this.addDialog(new botbuilder_dialogs_1.ChoicePrompt(TRANSPORT_CHOICE_PROMPT));
        this.addDialog(new botbuilder_dialogs_1.ChoicePrompt(SPACE_CHOICE_PROMPT));
        this.addDialog(new botbuilder_dialogs_1.TextPrompt(STROLLER_TEXT_PROMPT));
        this.addDialog(new botbuilder_dialogs_1.WaterfallDialog(WATERFALL_DIALOG, [
            this.transportStep.bind(this),
            this.spaceStep.bind(this),
            this.strollerStep.bind(this),
            this.featuresStep.bind(this),
            this.finalStep.bind(this),
        ]));
        this.initialDialogId = WATERFALL_DIALOG;
    }
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    run(turnContext, accessor) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialogSet = new botbuilder_dialogs_1.DialogSet(accessor);
            dialogSet.add(this);
            const dialogContext = yield dialogSet.createContext(turnContext);
            const results = yield dialogContext.continueDialog();
            if (results.status === botbuilder_dialogs_1.DialogTurnStatus.empty) {
                yield dialogContext.beginDialog(this.id);
            }
        });
    }
    transportStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('CarSeatDialog.transportStep');
            return yield stepContext.prompt(TRANSPORT_CHOICE_PROMPT, {
                prompt: 'Firstly, where do you plan on using the car seat?',
                choices: botbuilder_dialogs_1.ChoiceFactory.toChoices(['Uber / Lyft', 'Public transit', 'Air travel'])
            });
        });
    }
    spaceStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = stepContext.options;
            console.log("getting to space step");
            details.transport = stepContext.result;
            return yield stepContext.prompt(SPACE_CHOICE_PROMPT, {
                prompt: 'Do you have space limitations we should consider?',
                choices: botbuilder_dialogs_1.ChoiceFactory.toChoices([
                    'Cars with tight back space',
                    'Need to fit more than 2 children in a row in the future',
                    'Extra space'
                ])
            });
        });
    }
    strollerStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = stepContext.options;
            details.space = stepContext.result;
            const messageText = 'Do you have a stroller selected, or do you have a hand-me-down stroller?';
            const msg = botbuilder_1.MessageFactory.text(messageText, messageText, botbuilder_1.InputHints.ExpectingInput);
            return yield stepContext.prompt(STROLLER_TEXT_PROMPT, { prompt: msg });
        });
    }
    featuresStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const details = stepContext.options;
            details.stroller = stepContext.result;
            return yield stepContext.prompt(SPACE_CHOICE_PROMPT, {
                prompt: 'Are there any specific features that are important to you?',
                choices: botbuilder_dialogs_1.ChoiceFactory.toChoices([
                    'Eco-friendly & non-toxic',
                    'Compact & lightweight',
                    'Extra safety features',
                    'Quality & Comfort',
                ])
            });
        });
    }
    finalStep(stepContext) {
        return __awaiter(this, void 0, void 0, function* () {
            if (stepContext.result === true) {
                const details = stepContext.options;
                details.features = stepContext.result;
                return yield stepContext.endDialog(details);
            }
            return yield stepContext.endDialog();
        });
    }
}
exports.default = CarSeatDialog;
//# sourceMappingURL=dialog.js.map