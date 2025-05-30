/* =========  BlazeVortex MAIN FILE  ========= */
import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  Collection,
  Message,
  ActivityType,
  TextBasedChannelFields,
} from "discord.js";
import config from "./config.json";
import { loadCommands } from "./handlers/commandHandler";
import { Command } from "./types";
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";
import splitMessage from "./functions/splitmessage";
import chalk from "chalk";

/* ----------   Setup   ---------- */
const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function setStatus() {
  await sleep(2000);
  client.user?.setActivity("a set of moves to destroy the world", {
    type: ActivityType.Playing,
  });
  console.log("✅ Status set to 'a set of moves to destroy the world'");
}

const memoryMap = new Map<string, string[]>(); // key: serverId-channelId-userId
client.commands = new Collection<string, Command>();

client.once(Events.ClientReady, () => {
  console.log(`✅ Ready! Logged in as ${client.user?.tag} at ${new Date()}`);
  client.user?.setPresence({
    status: "dnd",
  });
  setStatus();
});

/* ----------   Slash / Chat-input commands   ---------- */
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

/* ----------   Text-prefix admin commands   ---------- */
const prefix = "!";
const handleAdminCommands = async (message: Message) => {
  if (!message.content.startsWith(prefix)) return;
  if (!config.admins.includes(message.author.id))
    return message.author.send("you no admin, bitch fuck you, ligma balls");

  const [command, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(/\s+/);

  switch (command.toLowerCase()) {
    case "setgame": {
      const game = args.join(" ");
      return game
        ? (await message.reply(`🎮 Game status set to **${game}**`)) &&
            client.user?.setActivity(game, { type: ActivityType.Playing })
        : message.reply("❌ Provide a game name.");
    }
    case "setstatus": {
      const status = args.join(" ");
      return status
        ? client.user?.setPresence({
            activities: [{ name: status, type: ActivityType.Playing }],
            status: "dnd",
          }) && message.reply(`✅ Bot status set to **${status}**`)
        : message.reply("❌ Provide a status.");
    }
    case "eval": {
      try {
        const code = args.join(" ");
        const result = await eval(code);
        return message.reply(`🖥️ Eval result:\n\`\`\`${result}\`\`\``);
      } catch (e: any) {
        return message.reply(`⚠️ Error: ${e?.message ?? "unknown"}`);
      }
    }
    case "blvrestart": {
      await message.reply(`Bot restarted (may take a second to come back online)`);
      await console.log(chalk.bgRed.yellow("🔁 Restarting bot from command..."));
      throw new Error("Restarting bot...");
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
      const info = `⏳ Uptime: ${client.uptime}ms\n🏛️ Guilds: ${client.guilds.cache.size}\n👥 Users: ${client.users.cache.size}\n `;
      return message.reply(`🔍 Debug Info:\n${info}`);
    }
    case "fuckryan":
      return message.reply("Fuck You Ryan For Banning Arti From Bloom.");
    case "mem": {
      let memoryOutput = "📜 **Memory for all users:**\n";
      memoryMap.forEach((messages, userId) => {
        memoryOutput += `\n**User ID:** ${userId}\nMessages: ${messages.join(
          " | "
        )}`;
      });

      const chunks = splitMessage(memoryOutput);

      if (chunks.length > 0) {
        await message.reply(chunks[0]);

        if ("send" in message.channel) {
          for (let i = 1; i < chunks.length; i++) {
            await (message.channel as TextBasedChannelFields).send(chunks[i]);
          }
        }
      }

      return;
    }

    default:
      return;
  }
};

async function memorize(message: Message) {
  const { guild, channel, author, content } = message;
  if (!guild) return;

  const serverId = guild.id;
  const channelId = channel.id;
  const userId = author.id;
  const username = author.username;

  const dir = path.join(__dirname, "memory", serverId, channelId);
  const filePath = path.join(dir, `${userId}.json`);
  const memoryKey = `${serverId}-${channelId}-${userId}`;

  try {
    await fs.mkdir(dir, { recursive: true });

    let memoryList: string[] = [];
    try {
      const existing = await fs.readFile(filePath, "utf-8");
      memoryList = JSON.parse(existing);
    } catch {
      memoryList = [];
    }

    const memList = memoryMap.get(memoryKey) ?? [];
    memList.push(content);
    if (memList.length > 10000) memList.shift();
    memoryMap.set(memoryKey, memList);

    memoryList.push(`${new Date().toISOString()} - ${username}: ${content}`);
    if (memoryList.length > 10000) memoryList.shift();
    await fs.writeFile(filePath, JSON.stringify(memoryList, null, 2), "utf-8");
  } catch (err) {
    console.error("Memory write failed:", err);
  }
}

/* ----------   Main message handler   ---------- */
client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  await memorize(message);

  const { content, author } = message;
  const userId = author.id;
  const username = author.username;

  if (message.content.startsWith("!ignore") || message.content.startsWith("!i"))
    return;

  const adminCmds = [
    "setgame",
    "setstatus",
    "eval",
    "guilds",
    "blvrestart",
    "addadmin",
    "removeadmin",
    "debug",
    "fuckryan",
    "mem",
    "dmadmins",
    "ignore",
    "regText",
    "i",
  ];
  if (
    content.startsWith(prefix) &&
    adminCmds.some((c) => content.toLowerCase().startsWith(`${prefix}${c}`))
  ) {
    await handleAdminCommands(message);
    return;
  }

  const devNames = [
    "SmiLerRyan",
    "ArtificialXDev",
    "Y-Dev",
    "Youssef",
    "!nternetBowser",
    "InternetBowser",
  ];
  const isDev = devNames.includes(username);

  if (isDev && content.toLowerCase().startsWith("~ai")) {
    const prompt = `You're BlazeVortex. A creator spoke using "~ai". Respond politely, no swearing.
  Request: ${content}`;
    const res = await ai.models.generateContent({
      model: "2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = res.text
    const chunks = splitMessage(res.text ?? "No response");

  if (chunks.length > 0) {
    await message.reply(chunks[0]);

    if ("send" in message.channel) {
      for (let i = 1; i < chunks.length; i++) {
        await (message.channel as TextBasedChannelFields).send(chunks[i]);
      }
    }
  }
  }
});

client.login(config.token);