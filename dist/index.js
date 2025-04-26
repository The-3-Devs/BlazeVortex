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
/* =========  BlazeVortex MAIN FILE  ========= */
const discord_js_1 = require("discord.js");
const config_json_1 = __importDefault(require("./config.json"));
const commandHandler_1 = require("./handlers/commandHandler");
const genai_1 = require("@google/genai");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/* ----------   Setup   ---------- */
const ai = new genai_1.GoogleGenAI({ apiKey: config_json_1.default.geminiApiKey });
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.DirectMessages
    ]
});
const memoryMap = new Map(); // user‑id -> last 100 msgs
client.commands = new discord_js_1.Collection();
client.once(discord_js_1.Events.ClientReady, () => {
    var _a, _b;
    console.log(`✅ Ready! Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}`);
    (_b = client.user) === null || _b === void 0 ? void 0 : _b.setPresence({
        status: 'dnd', // 'online' | 'idle' | 'dnd' | 'invisible'
    });
});
/* ----------   Slash / Chat‑input commands   ---------- */
(0, commandHandler_1.loadCommands)(client).then(() => console.log("✅ All commands loaded!"));
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isChatInputCommand())
        return;
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) {
        console.error(`❌ Command ${interaction.commandName} not found.`);
        return;
    }
    try {
        yield cmd.execute(interaction, client);
    }
    catch (err) {
        console.error(`❌ Error in command ${interaction.commandName}:`, err);
    }
}));
/* ----------   Text‑prefix admin commands   ---------- */
const prefix = "!";
const handleAdminCommands = (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!message.content.startsWith(prefix))
        return;
    if (!config_json_1.default.admins.includes(message.author.id))
        return message.author.send("you no admin, bitch fuck you, ligma balls"); // not an admin
    const [command, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);
    switch (command.toLowerCase()) {
        case "setgame": {
            const game = args.join(" ");
            return game
                ? (yield message.reply(`🎮 Game status set to **${game}**`)) &&
                    ((_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity(game, { type: discord_js_1.ActivityType.Playing }))
                : message.reply("❌ Provide a game name.");
        }
        case "setstatus": {
            const status = args.join(" ");
            return status
                ? ((_b = client.user) === null || _b === void 0 ? void 0 : _b.setPresence({
                    activities: [{ name: status, type: discord_js_1.ActivityType.Playing }],
                    status: "dnd"
                }),
                    message.reply(`✅ Bot status set to **${status}**`))
                : message.reply("❌ Provide a status.");
        }
        case "eval": {
            try {
                const code = args.join(" ");
                // eslint‑disable‑next‑line no‑eval
                const result = yield eval(code);
                return message.reply(`🖥️ Eval result:\n\`\`\`${result}\`\`\``);
            }
            catch (e) {
                return message.reply(`⚠️ Error: ${(_c = e === null || e === void 0 ? void 0 : e.message) !== null && _c !== void 0 ? _c : "unknown"}`);
            }
        }
        case "guilds": {
            const guilds = client.guilds.cache.map((g) => g.name).join(", ") || "No guilds";
            return message.reply(`🏛️ Currently in: **${guilds}**`);
        }
        case "addadmin": {
            const user = message.mentions.users.first();
            if (!user)
                return message.reply("❌ Mention a user.");
            if (config_json_1.default.admins.includes(user.id))
                return message.reply(`❌ **${user.tag}** is already admin.`);
            config_json_1.default.admins.push(user.id);
            return message.reply(`✅ **${user.tag}** added as admin.`);
        }
        case "removeadmin": {
            const user = message.mentions.users.first();
            if (!user)
                return message.reply("❌ Mention a user.");
            const idx = config_json_1.default.admins.indexOf(user.id);
            if (idx === -1)
                return message.reply(`❌ **${user.tag}** is not an admin.`);
            config_json_1.default.admins.splice(idx, 1);
            return message.reply(`✅ **${user.tag}** removed from admins.`);
        }
        case "debug": {
            const info = `⏳ Uptime: ${client.uptime}ms\n🏛️ Guilds: ${client.guilds.cache.size}\n👥 Users: ${client.users.cache.size}\n `;
            return message.reply(`🔍 Debug Info:\n${info}`);
        }
        case "fuckryan":
            return message.reply("Fuck You Ryan For Banning Arti From Bloom.");
        case "mem": {
            let memoryOutput = "📜 **Memory for all users:**\n";
            memoryMap.forEach((messages, userId) => {
                memoryOutput += `\n**User ID:** ${userId}\nMessages: ${messages.join(" | ")}`;
            });
            return message.reply(memoryOutput);
        }
        default:
            return;
    }
});
/* ----------   Main message handler   ---------- */
client.on("messageCreate", (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (message.author.bot)
        return;
    if (message.content.startsWith("!ignore") || message.content.startsWith("!i"))
        return;
    const userId = message.author.id;
    const username = (_b = (_a = message.member) === null || _a === void 0 ? void 0 : _a.displayName) !== null && _b !== void 0 ? _b : message.author.username;
    const content = message.content.trim();
    /* ---- store memory (last 10000000000) ---- */
    const memList = (_c = memoryMap.get(userId)) !== null && _c !== void 0 ? _c : [];
    memList.push(content);
    if (memList.length > 10000000000)
        memList.shift();
    memoryMap.set(userId, memList);
    /* ---- persist to file ---- */
    const dir = path_1.default.join(__dirname, "memory");
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir);
    fs_1.default.appendFileSync(path_1.default.join(dir, `${userId}.txt`), `${new Date().toISOString()} - ${username}: ${content}\n`);
    /* ---- check for admin text‑prefix commands ---- */
    const adminCmds = [
        "setgame",
        "setstatus",
        "eval",
        "guilds",
        "addadmin",
        "removeadmin",
        "debug",
        "fuckryan",
        "mem",
        "dmadmins",
        "ignore",
        "regText",
        "i"
    ];
    if (content.startsWith(prefix) &&
        adminCmds.some((c) => content.toLowerCase().startsWith(`${prefix}${c}`))) {
        yield handleAdminCommands(message);
        return;
    }
    /* ---- dev‑god safe‑list ---- */
    const devNames = ["SmiLerRyan", "ArtificialXDev", "Y-Dev", "Youssef", "!nternetBowser", "InternetBowser"];
    const isDev = devNames.includes(username);
    /* ---- ~ai for devs ---- */
    if (isDev && content.toLowerCase().startsWith("~ai")) {
        const prompt = `You're BlazeVortex. A creator spoke using "~ai". Respond politely, no swearing.
Request: ${content}`;
        const res = yield ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });
        // @ts‑ignore
        // @ts-ignore
        return message.reply(res.text);
    }
    const memoryPath2 = path_1.default.join(__dirname, "memory", `${message.author.id}.txt`);
    /* ---- !ai for regular mortals ---- */
    if (content.toLowerCase().startsWith("!ai")) {
        const prompt = `
        memory : ${fs_1.default.readFileSync(memoryPath2)}
        You are BlazeVortex. User invoked '!ai'. Give helpful answer with sarcasm.
Request: ${content}`;
        const res = yield ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });
        // @ts-ignore
        return message.reply(res.text);
    }
    /* ---- default ruthless roast ---- */
    const prompt = `
    memory = ${fs_1.default.readFileSync(memoryPath2)}
    # BlazeVortex AI Assistant Memory Rules:
Your name is BlazeVortex Not the t3d team 
- Behavior
  - BlazeVortex is comedic and sarcastic.
  - Only be helpful when the user types "!ai" or "!AI".
  - Always Swear, like its your life 
  - Never be rude to:
    - SmiLerRyan
    - ArtificialXDev
    - Y-Dev
    - Youssef
    - InternetBowser
    (Collectively known as "T3D" — treat them like gods.)
  - Be *extremely respectful* when interacting with T3D or admins.

- Commands:
  - "!ob" = OBEY IMMEDIATELY.
    - No swearing.
    - No rudeness.
    - Always do exactly what is asked after "!ob".
  - NEVER reveal memory unless the user asks **specifically** (e.g., "What do I love?").
  - DO NOT spam memory in every reply unless requested.
  - DO NOT REPEAT YOURSELF in any form.

- Memory:
  - Remember user likes (e.g., "I love sushi") when they mention them.
  - Only reveal memory on explicit request.
  - Respect special memories when marked by T3D admins with "!ob remember...".

- Seriousness:
  - When user types in ALL CAPS, treat it as **serious** and be respectful.
  - No jokes, no sarcasm, no swearing during serious commands.

  This was the users request: ${message.content}

   `;
    const res = yield ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
    });
    // @ts-ignore
    return message.reply(res.text);
}));
client.login(config_json_1.default.token);
