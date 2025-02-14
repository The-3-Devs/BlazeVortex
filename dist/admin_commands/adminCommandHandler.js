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
const config_json_1 = __importDefault(require("../config.json"));
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.DirectMessages,
    ],
});
const handleAdminCommands = (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (message.author.bot)
        return; // Ignore bot messages
    const prefix = "!";
    if (!message.content.startsWith(prefix))
        return; // Ignore non-prefixed messages
    if (!config_json_1.default.admins.includes(message.author.id))
        return; // Allow only admins
    const [command, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);
    if (command === "setgame") {
        const game = args.join(" ");
        if (game) {
            (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity(game, { type: discord_js_1.ActivityType.Playing });
            message.reply(`🎮 Game status set to: **${game}**`);
        }
        else {
            message.reply("❌ Please provide a game name.");
        }
    }
    if (command === "setstatus") {
        const status = args.join(" ");
        if (status) {
            (_b = client.user) === null || _b === void 0 ? void 0 : _b.setPresence({ activities: [{ name: status, type: discord_js_1.ActivityType.Playing }], status: "online" });
            message.reply(`✅ Bot status set to: **${status}**`);
        }
        else {
            message.reply("❌ Please provide a status.");
        }
    }
    if (command === "eval") {
        try {
            const code = args.join(" ");
            const result = yield eval(code);
            message.reply(`🖥️ Eval result:\n\`\`\`${result}\`\`\``);
        }
        catch (error) {
            if (error instanceof Error) {
                message.reply(`⚠️ Error: ${error.message}`);
            }
            else {
                message.reply("⚠️ An unknown error occurred during eval.");
            }
        }
    }
    if (command === "guilds") {
        const guildNames = client.guilds.cache.map((guild) => guild.name).join(", ") || "No guilds found";
        message.reply(`🏛️ The bot is currently in: **${guildNames}**`);
    }
    if (command === "addadmin") {
        const user = message.mentions.users.first();
        if (user) {
            if (!config_json_1.default.admins.includes(user.id)) {
                config_json_1.default.admins.push(user.id);
                message.reply(`✅ **${user.tag}** has been added as an admin.`);
            }
            else {
                message.reply(`❌ **${user.tag}** is already an admin.`);
            }
        }
        else {
            message.reply("❌ Please mention a user to add as an admin.");
        }
    }
    if (command === "removeadmin") {
        const user = message.mentions.users.first();
        if (user) {
            const index = config_json_1.default.admins.indexOf(user.id);
            if (index !== -1) {
                config_json_1.default.admins.splice(index, 1);
                message.reply(`✅ **${user.tag}** has been removed from admins.`);
            }
            else {
                message.reply(`❌ **${user.tag}** is not an admin.`);
            }
        }
        else {
            message.reply("❌ Please mention a user to remove from admins.");
        }
    }
    if (command === "debug") {
        const debugInfo = `⏳ Bot Uptime: ${client.uptime}ms\n🏛️ Guilds: ${client.guilds.cache.size}\n👥 Users: ${client.users.cache.size}`;
        message.reply(`🔍 Debug Info:\n${debugInfo}`);
    }
});
// Listen for admin messages (both in DMs and Guilds)
client.on("messageCreate", handleAdminCommands);
client.login();
exports.default = client;
