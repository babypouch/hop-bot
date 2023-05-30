import { ComponentDialog, DialogTurnResult, WaterfallStepContext } from 'botbuilder-dialogs';
export default class CarSeatDialog extends ComponentDialog {
    constructor(userState: any);
    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    run(turnContext: any, accessor: any): Promise<void>;
    transportStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult<any>>;
    spaceStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult<any>>;
    strollerStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult<any>>;
    featuresStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult<any>>;
    private finalStep;
}
