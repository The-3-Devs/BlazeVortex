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
    name: "reminder",
    description: "Set a reminder for yourself for any time or thing.",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        const timeInput = interaction.options.getString("time");
        const reason = interaction.options.getString("reason");
        // Ensure both the time and reason are provided
        if (!timeInput || !reason) {
            return yield interaction.reply("Please provide both a time and reason.");
        }
        // Get time such as "1h 1m 1s"
        const timeRegex = /(\d+)([hms])/g;
        let totalSeconds = 0;
        let match;
        while ((match = timeRegex.exec(timeInput)) !== null) {
            const value = parseInt(match[1], 10);
            const unit = match[2];
            if (unit === 'h') {
                totalSeconds += value * 3600;
            }
            if (unit === 'm') {
                totalSeconds += value * 60;
            }
            if (unit === 's') {
                totalSeconds += value;
            }
        }
        if (totalSeconds === 0) {
            return yield interaction.reply("Please provide a valid time format (e.g., 1h 1m 1s).");
        }
        // Send the reminder message
        yield interaction.reply(`You will be reminded of \`\`${reason}\`\` in \`\`${timeRegex}\`\` (${totalSeconds} seconds).`);
    }),
};
exports.default = command;
