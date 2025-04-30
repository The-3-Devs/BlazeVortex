"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.loadCommands = void 0;
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_json_1 = __importDefault(require("../config.json"));
const loadCommands = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const commands = new discord_js_1.Collection();
    const commandsPath = path_1.default.join(__dirname, "../commands");
    const commandFiles = fs_1.default.readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));
    const slashCommands = [];
    for (const file of commandFiles) {
        const filePath = path_1.default.join(commandsPath, file);
        const commandModule = yield Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
        const command = commandModule.default;
        if (command === null || command === void 0 ? void 0 : command.name) {
            commands.set(command.name, command);
            console.log(`✅ Loaded command: ${command.name}`);
            slashCommands.push({
                name: command.name,
                description: command.description,
                options: command.options || [],
            });
        }
        else {
            console.warn(`⚠️ Command ${file} is missing a name.`);
        }
    }
    client.commands = commands;
    // 🚀 Deploy to Discord API
    const rest = new discord_js_1.REST({ version: "10" }).setToken(config_json_1.default.token);
    try {
        console.log("🌐 Deploying commands to Discord...");
        yield rest.put(discord_js_1.Routes.applicationCommands(config_json_1.default.clientId), // ⚡ clientId from config.json
        { body: slashCommands });
        console.log("✅ Commands deployed successfully!");
    }
    catch (error) {
        console.error("❌ Failed to deploy commands:", error);
    }
});
exports.loadCommands = loadCommands;
