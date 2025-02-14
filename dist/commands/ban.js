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
const discord_js_1 = require("discord.js"); // Import PermissionsBitField
const command = {
    name: "ban",
    description: "Bans a member from the server!",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        // Check if the user has permission to ban members using PermissionsBitField
        if (!((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions.has(discord_js_1.PermissionsBitField.Flags.BanMembers))) {
            return yield interaction.reply("You don't have permission to ban members!");
        }
        // Get the user to ban (get the member from the options)
        const member = interaction.options.getMember("user");
        // If no user is mentioned, send a reply
        if (!member) {
            return yield interaction.reply("Please mention a user to ban.");
        }
        // Check if the mentioned member is a bot
        if ((_b = member.user) === null || _b === void 0 ? void 0 : _b.bot) {
            return yield interaction.reply("You can't ban bots!");
        }
        // Check if the bot has permission to ban members using PermissionsBitField
        if (!((_d = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.me) === null || _d === void 0 ? void 0 : _d.permissions.has(discord_js_1.PermissionsBitField.Flags.BanMembers))) {
            return yield interaction.reply("I don't have permission to ban members!");
        }
        try {
            // Attempt to ban the user
            yield member.ban({ reason: "Banned by command" });
            yield interaction.reply(`Successfully banned ${member.user.username}!`);
        }
        catch (error) {
            console.error(error);
            yield interaction.reply("There was an error trying to ban that user.");
        }
    }),
};
exports.default = command;
