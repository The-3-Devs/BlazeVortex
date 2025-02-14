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
    name: "kick",
    description: "Kicks a member from the server!",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        // Check if the user has permission to kick
        if (!((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.permissions.has("KICK_MEMBERS"))) {
            return yield interaction.reply("You don't have permission to kick members!");
        }
        // Get the user to kick
        const member = interaction.options.getMember("user");
        if (!member) {
            return yield interaction.reply("Please mention a user to kick.");
        }
        // Check if the bot has permission to kick the user
        if (!((_c = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.me) === null || _c === void 0 ? void 0 : _c.permissions.has("KICK_MEMBERS"))) {
            return yield interaction.reply("I don't have permission to kick members!");
        }
        try {
            yield member.kick("Kicked by command");
            yield interaction.reply(`Successfully kicked ${member.user.username}!`);
        }
        catch (error) {
            console.error(error);
            yield interaction.reply("There was an error trying to kick that user.");
        }
    }),
};
exports.default = command;
