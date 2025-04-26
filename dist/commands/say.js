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
const command = {
    name: "say",
    description: "Replies with whatever you want me to say!",
    // it says the message in the argument, but it doesen't add it to the command list right..?
    // like it adds a /say command with no arguments, but this would expect one.
    // this is a problemo with discord not our problem
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        // Get the content from the user's input
        const userMessage = interaction.options.getString("message"); // here these are the args
        if (!userMessage) {
            return yield interaction.reply("You must provide something for me to say!");
        }
        yield interaction.reply(userMessage);
    }),
};
exports.default = command;
