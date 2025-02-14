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
const discord_js_1 = require("discord.js");
const command = {
    name: "help",
    description: "Displays a list of all commands and what they do!",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Help - Command List")
            .setDescription("Here are all the commands you can use:")
            // Add your commands here
            .addFields(
        // { name: "/ban", value: "Bans a user from the server." },
        { name: "/coinFlip", value: "Flips a coin and shows either a red or green emoji!" }, { name: "/help", value: "Displays this list of commands and their descriptions." }, { name: "/invite", value: "Sends an invite link for the bot." }, { name: "/joke", value: "Tells a random joke." }, 
        // { name: "/kick", value: "Kicks a user from the server." },
        { name: "/me", value: "Shows the bot's about me and avatar!" }, { name: "/ping", value: "Replies with 'Pong!'" }, { name: "/xp", value: "Displays the user's current XP or level." });
        // Send the embed
        yield interaction.reply({ embeds: [embed] });
    }),
};
exports.default = command;
