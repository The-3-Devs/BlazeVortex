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
    name: "warn",
    description: "Warns a user and sends a warning message to the victim and the channel.",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const targetUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");
        // Ensure both the target user and reason are provided
        if (!targetUser || !reason) {
            return yield interaction.reply("Please mention a user and provide a reason for the warning.");
        }
        // Send the warning to the victim (via DM)
        try {
            yield targetUser.send(`You have been warned for the following reason: ${reason}`);
        }
        catch (error) {
            console.error(`Couldn't send DM to ${targetUser.tag}. They may have DMs disabled.`);
            yield interaction.reply(`I couldn't DM ${targetUser.tag}. They might have DMs disabled.`);
            return;
        }
        // Send the warning to the channel
        yield interaction.reply(`${targetUser.tag} has been warned for: ${reason}`);
        // Log the warning in the channel (Optional)
        console.log(`${targetUser.tag} has been warned for: ${reason}`);
    }),
};
exports.default = command;
