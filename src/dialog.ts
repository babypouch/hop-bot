import {
    CardFactory,
    MessageFactory,
    InputHints,
} from 'botbuilder';

import {
    ComponentDialog,
    ChoiceFactory,
    DialogTurnResult,
    ChoicePrompt,
    ListStyle,
    DialogSet,
    DialogTurnStatus,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext,
    WaterfallStep,
} from 'botbuilder-dialogs';
import { CarSeatDetails } from './carseatDetails';

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


export default class CarSeatDialog extends ComponentDialog {
    constructor(userState) {
        super('carSeatDialog')
        this.addDialog(new ChoicePrompt(TRANSPORT_CHOICE_PROMPT))
        this.addDialog(new ChoicePrompt(SPACE_CHOICE_PROMPT))
        this.addDialog(new TextPrompt(STROLLER_TEXT_PROMPT))
        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.transportStep.bind(this),
            this.spaceStep.bind(this),
            this.strollerStep.bind(this),
            this.featuresStep.bind(this),
            this.finalStep.bind(this),
        ]))

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async transportStep(stepContext: WaterfallStepContext) {
        console.log('CarSeatDialog.transportStep');

        return await stepContext.prompt(TRANSPORT_CHOICE_PROMPT, {
            prompt: 'Firstly, where do you plan on using the car seat?',
            choices: ChoiceFactory.toChoices(['Uber / Lyft', 'Public transit', 'Air travel'])
        });
    }

    async spaceStep(stepContext: WaterfallStepContext) {
        const details = stepContext.options as CarSeatDetails;
        console.log("getting to space step")
        details.transport = stepContext.result;

        return await stepContext.prompt(SPACE_CHOICE_PROMPT, {
            prompt: 'Do you have space limitations we should consider?',
            choices: ChoiceFactory.toChoices([
                'Cars with tight back space', 
                'Need to fit more than 2 children in a row in the future', 
                'Extra space'
            ]),
            style: ListStyle.suggestedAction
        });
    }

    async strollerStep(stepContext: WaterfallStepContext) {
        const details = stepContext.options as CarSeatDetails;
        details.space = stepContext.result;

            const messageText = 'Do you have a stroller selected, or do you have a hand-me-down stroller?'
            const msg = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);

            return await stepContext.prompt(STROLLER_TEXT_PROMPT, { prompt: msg });
    }

    async featuresStep(stepContext: WaterfallStepContext) {
        const details = stepContext.options as CarSeatDetails;
        details.stroller = stepContext.result;
        return await stepContext.prompt(SPACE_CHOICE_PROMPT, {
            prompt: 'Are there any specific features that are important to you?',
            choices: ChoiceFactory.toChoices([
                'Eco-friendly & non-toxic',
                'Compact & lightweight',
                'Extra safety features',
                'Quality & Comfort',
            ]),
            style: ListStyle.suggestedAction
        });


    }

    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (stepContext.result === true) {
            const details = stepContext.options as CarSeatDetails;
            details.features = stepContext.result;

            return await stepContext.endDialog(details);
        }
        return await stepContext.endDialog();
    }


}