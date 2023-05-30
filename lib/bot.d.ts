import { ActivityHandler, BotState } from 'botbuilder';
import { Dialog } from 'botbuilder-dialogs';
export declare class EchoBot extends ActivityHandler {
    private conversationState;
    private userState;
    private dialog;
    private dialogState;
    constructor(conversationState: BotState, userState: BotState, dialog: Dialog);
    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    run(context: any): Promise<void>;
}
