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
// TODO XP
// FIREBASE OR APPWRITE??? Seems like appwrite is more of a normal database?
// /xp command, username, picture (if any), xp and level
const command = {
    name: "xp",
    description: "Shows you your XP info",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const user = interaction.user;
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Your XP Info")
            .setDescription(`Here is your XP and level information:`)
            .setThumbnail(user.avatarURL() || '')
            .addFields({ name: "Username", value: user.username, inline: true }, { name: "XP", value: "0", inline: true }, { name: "Level", value: "0", inline: true });
        yield interaction.reply({ embeds: [embed] });
    }),
};
exports.default = command;
