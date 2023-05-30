// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { 
    ActivityHandler, 
    MessageFactory, 
    ActionTypes,
    BotState, 
    StatePropertyAccessor,
    ConversationState,
    UserState,
} from 'botbuilder';
import { Dialog, DialogState } from 'botbuilder-dialogs';
import CarSeatDialog from './dialog';




export class EchoBot extends ActivityHandler {
    private conversationState: BotState;
    private userState: BotState;
    private dialog: Dialog;
    private dialogState: StatePropertyAccessor<DialogState>;
    constructor(conversationState: BotState, userState: BotState, dialog: Dialog) {
        super();
        this.conversationState = conversationState as ConversationState;
        this.userState = userState as UserState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty<DialogState>('DialogState');
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            // const replyText = `Echo: ${ context.activity.text }`;
            console.log('Running dialog with Message Activity.');
            console.log(`Echo: ${ context.activity.text }`);
            // await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.
            await (this.dialog as CarSeatDialog).run(context, this.dialogState);
            await next();
        });

        this.onDialog(async (context, next) => {
            // Save any state changes. The load happened during the execution of the Dialog.
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
            await next();
        });

        this.onMembersAdded(async (context, next) => {

            // Run the Dialog with the new message Activity.

            const welcomeText = 'Hey there, I\'m your car seat shopping assistant. I\'ll try to help you find the absolute best car seat for your use-case.';
            // await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));

            await (this.dialog as CarSeatDialog).run(context, this.dialogState);
            // for (const member of membersAdded) {
            //     if (member.id !== context.activity.recipient.id) {
            //         await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
            //     }
            // }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    public async run(context): Promise<void> {
        await super.run(context);

        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}
