/* =========  BlazeVortex MAIN FILE  ========= */
import {
    Client,
    Events,
    GatewayIntentBits,
    Interaction,
    Collection,
    Message,
    ActivityType
} from "discord.js";
import config from "./config.json";
import { loadCommands } from "./handlers/commandHandler";
import { Command } from "./types";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

/* ----------   Setup   ---------- */
const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

const memoryMap = new Map<string, string[]>();           // user‑id -> last 100 msgs
client.commands = new Collection<string, Command>();

client.once(Events.ClientReady, () => {
    console.log(`✅ Ready! Logged in as ${client.user?.tag}`);
});

/* ----------   Slash / Chat‑input commands   ---------- */
loadCommands(client).then(() => console.log("✅ All commands loaded!"));

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) {
        console.error(`❌ Command ${interaction.commandName} not found.`);
        return;
    }
    try {
        await cmd.execute(interaction, client);
    } catch (err) {
        console.error(`❌ Error in command ${interaction.commandName}:`, err);
    }
});

/* ----------   Text‑prefix admin commands   ---------- */
const prefix = "!";

const handleAdminCommands = async (message: Message) => {
    if (!message.content.startsWith(prefix)) return;
    if (!config.admins.includes(message.author.id)) return;   // not an admin

    const [command, ...args] = message.content
        .slice(prefix.length)
        .trim()
        .split(/\s+/);

    switch (command.toLowerCase()) {
        case "setgame": {
            const game = args.join(" ");
            return game
                ? await message.reply(`🎮 Game status set to **${game}**`) &&
                client.user?.setActivity(game, { type: ActivityType.Playing })
                : message.reply("❌ Provide a game name.");
        }
        case "setstatus": {
            const status = args.join(" ");
            return status
                ? (client.user?.setPresence({
                    activities: [{ name: status, type: ActivityType.Playing }],
                    status: "online"
                }),
                    message.reply(`✅ Bot status set to **${status}**`))
                : message.reply("❌ Provide a status.");
        }
        case "eval": {
            try {
                const code = args.join(" ");
                // eslint‑disable‑next‑line no‑eval
                const result = await eval(code);
                return message.reply(`🖥️ Eval result:\n\`\`\`${result}\`\`\``);
            } catch (e: any) {
                return message.reply(`⚠️ Error: ${e?.message ?? "unknown"}`);
            }
        }
        case "guilds": {
            const guilds =
                client.guilds.cache.map((g) => g.name).join(", ") || "No guilds";
            return message.reply(`🏛️ Currently in: **${guilds}**`);
        }
        case "addadmin": {
            const user = message.mentions.users.first();
            if (!user) return message.reply("❌ Mention a user.");
            if (config.admins.includes(user.id))
                return message.reply(`❌ **${user.tag}** is already admin.`);
            config.admins.push(user.id);
            return message.reply(`✅ **${user.tag}** added as admin.`);
        }
        case "removeadmin": {
            const user = message.mentions.users.first();
            if (!user) return message.reply("❌ Mention a user.");
            const idx = config.admins.indexOf(user.id);
            if (idx === -1)
                return message.reply(`❌ **${user.tag}** is not an admin.`);
            config.admins.splice(idx, 1);
            return message.reply(`✅ **${user.tag}** removed from admins.`);
        }
        case "debug": {
            const info = `⏳ Uptime: ${client.uptime}ms\n🏛️ Guilds: ${client.guilds.cache.size}\n👥 Users: ${client.users.cache.size}`;
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
            return; // unknown admin cmd, ignore
    }
};

/* ----------   Main message handler   ---------- */
client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;

    const userId   = message.author.id;
    const username = message.member?.displayName ?? message.author.username;
    const content  = message.content.trim();

    /* ---- store memory (last 100) ---- */
    const memList = memoryMap.get(userId) ?? [];
    memList.push(content);
    if (memList.length > 100000) memList.shift();
    memoryMap.set(userId, memList);

    /* ---- persist to file ---- */
    const dir = path.join(__dirname, "memory");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.appendFileSync(
        path.join(dir, `${userId}.txt`),
        `${new Date().toISOString()} - ${username}: ${content}\n`
    );

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
        "mem"
    ];
    if (
        content.startsWith(prefix) &&
        adminCmds.some((c) => content.toLowerCase().startsWith(`${prefix}${c}`))
    ) {
        await handleAdminCommands(message);
        return;
    }

    /* ---- dev‑god safe‑list ---- */
    const devNames = ["SmiLerRyan", "ArtificialXDev", "Y-Dev", "Youssef"];
    const isDev = devNames.includes(username);

    /* ---- ~ai for devs ---- */
    if (isDev && content.toLowerCase().startsWith("~ai")) {
        const prompt = `You're BlazeVortex. A creator spoke using "~ai". Respond politely, no swearing.
Request: ${content}`;
        const res = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });
        // @ts‑ignore
        // @ts-ignore
        return message.reply(res.text);
    }

    /* ---- !ai for regular mortals ---- */
    if (content.toLowerCase().startsWith("!ai")) {
        const prompt = `You are BlazeVortex. User invoked '!ai'. Give helpful answer with sarcasm.
Request: ${content}`;
        const res = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });

        // @ts-ignore
        return message.reply(res.text);
    }

    /* ---- default ruthless roast ---- */
    const prompt = `You are BlazeVortex, hostile as hell. NEVER help unless '!ai'.
User: ${username}
Message: ${content}`;
    const res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
    });

    // @ts-ignore
    return message.reply(res.text);
});

client.login(config.token);
