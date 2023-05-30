"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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
exports.EchoBot = void 0;
const botbuilder_1 = require("botbuilder");
class EchoBot extends botbuilder_1.ActivityHandler {
    constructor(conversationState, userState, dialog) {
        super();
        this.conversationState = conversationState;
        this.userState = userState;
        this.dialog = dialog;
        this.dialogState = this.conversationState.createProperty('DialogState');
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage((context, next) => __awaiter(this, void 0, void 0, function* () {
            // const replyText = `Echo: ${ context.activity.text }`;
            console.log('Running dialog with Message Activity.');
            console.log(`Echo: ${context.activity.text}`);
            // await context.sendActivity(MessageFactory.text(replyText, replyText));
            // By calling next() you ensure that the next BotHandler is run.
            yield this.dialog.run(context, this.dialogState);
            yield next();
        }));
        this.onDialog((context, next) => __awaiter(this, void 0, void 0, function* () {
            // Save any state changes. The load happened during the execution of the Dialog.
            yield this.conversationState.saveChanges(context, false);
            yield this.userState.saveChanges(context, false);
            yield next();
        }));
        this.onMembersAdded((context, next) => __awaiter(this, void 0, void 0, function* () {
            // Run the Dialog with the new message Activity.
            const welcomeText = 'Hey there, I\'m your car seat shopping assistant. I\'ll try to help you find the absolute best car seat for your use-case.';
            // await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
            yield this.dialog.run(context, this.dialogState);
            // for (const member of membersAdded) {
            //     if (member.id !== context.activity.recipient.id) {
            //         await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
            //     }
            // }
            // By calling next() you ensure that the next BotHandler is run.
            yield next();
        }));
    }
    /**
     * Override the ActivityHandler.run() method to save state changes after the bot logic completes.
     */
    run(context) {
        const _super = Object.create(null, {
            run: { get: () => super.run }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.run.call(this, context);
            // Save any state changes. The load happened during the execution of the Dialog.
            yield this.conversationState.saveChanges(context, false);
            yield this.userState.saveChanges(context, false);
        });
    }
}
exports.EchoBot = EchoBot;
//# sourceMappingURL=bot.js.map