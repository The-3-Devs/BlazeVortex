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
const discord_js_1 = require("discord.js"); // Use EmbedBuilder instead of MessageEmbed
const command = {
    name: "invite",
    description: "Provides an invite link to add the bot to your server!",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const clientId = (_a = interaction.client.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!clientId) {
            return yield interaction.reply("Sorry, I couldn't retrieve my ID.");
        }
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=8`;
        const embed = new discord_js_1.EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Invite the Bot")
            .setDescription(`Click the button below to invite me to your server:`)
            .addFields({ name: "Invite Link", value: `[Click me](${inviteLink})`, inline: true });
        yield interaction.reply({ embeds: [embed] });
    })
};
exports.default = command;
