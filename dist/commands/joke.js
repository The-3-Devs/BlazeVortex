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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_1 = __importDefault(require("../functions/fetch"));
const command = {
    name: "random_joke",
    description: "Replies with A Joke!",
    execute: (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        // working on improving this
        // let joke: string = await fetchUrl('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist&format=txt')
        // joke = joke.replace("\n\n", " ||") + "||"
        // joke = joke.replace("|| ||", "")
        // make this save the joke, and if it is a 2 liner than one line add || before and after the last line. ignore empty blank lines.
        let joke = yield (0, fetch_1.default)('https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw&format=txt');
        const jokeLines = joke.split('\n').filter(line => line.trim() !== '');
        if (jokeLines.length === 2) {
            jokeLines[jokeLines.length - 1] = `||${jokeLines[jokeLines.length - 1]}||`;
        }
        let processedJoke = jokeLines.join('\n');
        yield interaction.reply(processedJoke);
    }),
};
exports.default = command;
