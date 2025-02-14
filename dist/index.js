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
const discord_js_1 = require("discord.js");
const config_json_1 = __importDefault(require("./config.json"));
const commandHandler_1 = require("./handler/commandHandler");
require("./admin_commands/adminCommandHandler");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent, // Required for reading message content
        discord_js_1.GatewayIntentBits.DirectMessages,
    ],
});
client.once(discord_js_1.Events.ClientReady, () => {
    var _a;
    console.log(`✅ Ready! Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
});
client.commands = new discord_js_1.Collection();
// Load commands
(0, commandHandler_1.loadCommands)(client).then(() => {
    console.log("✅ All commands loaded!");
});
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isChatInputCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`❌ Command ${interaction.commandName} not found.`);
        return;
    }
    try {
        yield command.execute(interaction, client);
    }
    catch (error) {
        console.error(`❌ Error executing command ${interaction.commandName}:`, error);
    }
}));
client.login(config_json_1.default.token);
