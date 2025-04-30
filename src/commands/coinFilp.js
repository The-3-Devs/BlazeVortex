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
    name: "coinflip",
    description: "Flips a coin and replies with either Heads or Tails!",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        // Generate a random result (0 for Heads, 1 for Tails)
        const result = Math.random() < 0.5 ? "Heads" : "Tails";
        // Reply with the coinflip result
        yield interaction.reply(`🪙 It's ${result}!`);
        yield interaction.reply("we're totally not biased!");
    }),
};
exports.default = command;
