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
exports.xpHandler = xpHandler;
// Store user XP in memory (can be expanded to a database later)
const userXP = new Map();
function xpHandler(client) {
    // Event listener for messageCreate
    client.on('messageCreate', (message) => __awaiter(this, void 0, void 0, function* () {
        // Ignore messages from the bot itself
        if (message.author.bot)
            return;
        // Check if the message is a command (e.g., starts with ! or /)
        if (message.content.startsWith('!') || message.content.startsWith('/')) {
            return; // Ignore commands, only proceed if it's not a command
        }
        // Calculate random XP between 1 and 3
        const xp = Math.floor(Math.random() * 3) + 1;
        // Get the user's current XP (if any), then add the new XP
        const currentXP = userXP.get(message.author.id) || 0;
        userXP.set(message.author.id, currentXP + xp);
        // Log the XP earned
        console.log(`${message.author.username} earned ${xp} XP! Total XP: ${currentXP + xp}`);
        // Respond to the user with the earned XP and total XP
        message.reply(`You earned ${xp} XP! Total XP: ${currentXP + xp}`);
    }));
}
