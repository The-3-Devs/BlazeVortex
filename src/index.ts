import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  Collection,
  Message,
  ActivityType,
  TextBasedChannelFields,
  PresenceUpdateStatus,
  MessageFlags
} from "discord.js";
import config from "./config.json";
import { loadCommands } from "./handlers/commandHandler";
import { Command } from "./types";
import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs/promises";
import path from "path";
import splitMessage from "./lib/splitmessage";
import { v4 as uuidv4 } from "uuid";
import { memorize, recallMemory } from "./lib/memory-functions";
import {
  handleAdminCommands,
  handleServerAdminCommands,
} from "./lib/admin-command-handlers";
import { getMemoryFilePath } from "./lib/base-memory-functions";
import { generateAdminAIPrompt, generateMainAIPrompt } from "./lib/generate-ai-prompt";

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
  client.user?.setPresence({
    activities: [{ name: "a set of moves to destroy the world" }],
    status: PresenceUpdateStatus.DoNotDisturb,
  });
  console.log("✅ Status set to 'a set of moves to destroy the world'");
}

client.commands = new Collection<string, Command>();

client.once(Events.ClientReady, () => {
  console.log(`✅ Ready! Logged in as ${client.user?.tag} at ${new Date()}`);
  client.user?.setPresence({ status: "dnd" });
  setStatus();
});

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

const prefix = "!";

client.on("messageCreate", async (message: Message) => {
  const { guild, channel } = message;

  if (!guild || !channel) return;

  if (message.flags?.has(MessageFlags.Ephemeral)) return

  await memorize(message);

  if (message.author.bot) return;

  const { content } = message;

  if (message.content.startsWith("!ignore") || message.content.startsWith("!i") || message.content.startsWith("!bv-i")) return;

  const adminCmds = [
    "setgame",
    "setstatus",
    "eval",
    "guilds",
    "blvrestart",
    "addadmin",
    "defaultstatus",
    "removeadmin",
    "debug",
    "uptime",
    "fuckryan",
    "mem",
    "dmadmins",
    "ignore",
    "regText",
    "clearmem",
    "enablechannel",
    "disablechannel",
  ];

  const serverAdminCmds = ["enablechannel", "disablechannel"];

  const isDev = config.admins.includes(message.author.id);

  if (
    content.startsWith(prefix) &&
    adminCmds.some((c) => content.toLowerCase().startsWith(`${prefix}${c}`)) &&
    isDev
  ) {
    await handleAdminCommands(message, prefix, client);
    return;
  }

  const isServerAdmin = message.member?.permissions.has("Administrator");

  const isServerAdminCmd = serverAdminCmds.some((c) =>
    content.toLowerCase().startsWith(`${prefix}${c}`)
  );

  if (isServerAdminCmd) {
    if (!isServerAdmin) {
      message.reply(
        "❌ You do not have permission to use this command. Only server admins can use this command."
      );
    }
    await handleServerAdminCommands(message, prefix);
  }
  const serverId = guild.id;
  const channelId = channel.id;
  const isDisabled = await fs
    .readFile(
      path.join(
        getMemoryFilePath(),
        "servers",
        serverId,
        channelId,
        "memory.json"
      ),
      "utf-8"
    )
    .then((data) => JSON.parse(data)?.disabled)
    .catch(() => false);

  if (isDisabled) return;

  const isServerDisabled = await fs
    .readFile(
      path.join(getMemoryFilePath(), "servers", serverId, "serverData.json"),
      "utf-8"
    )
    .then((data) => JSON.parse(data)?.disabledByDefault)
    .catch(() => false);

  if (isServerDisabled && isDisabled !== false) return;

  // default harsh AI response

  if (isDev && content.toLowerCase().startsWith("~ai")) {

    const prompt = await generateAdminAIPrompt(message, client);

    let res;

    try {
      res = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
    } catch (error) {
      console.error("AI request failed:", error);
      res = { text: "**⚠️ AI failed to respond due to model overload. **" };
    }

    const chunks = splitMessage(res.text ?? "No response");
    if (chunks.length > 0) {
      await message.reply(chunks[0]);
      for (let i = 1; i < chunks.length; i++) {
        await (message.channel as TextBasedChannelFields).send(chunks[i]);
      }
    }
    return;
  }

  const prompt = await generateMainAIPrompt(message, client);

  let res;

  try {
    res = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sendResponse: {
              type: Type.BOOLEAN,
            },
            response: {
              type: Type.STRING,
            },
          },
          required: ["sendResponse"],
        },
      },
    });
  } catch (error) {
    console.error("AI request failed:", error);
    res = { text: "**⚠️ AI failed to respond due to model overload. **" };
  }

  if (JSON.parse(res.text || "{}").sendResponse === true) {
    // @ts-ignore
    const chunks = splitMessage((JSON.parse(res.text).response) || "⚠️ No response");

    if (chunks.length > 0) {
      await message.reply(chunks[0]);
      for (let i = 1; i < chunks.length; i++) {
        await (message.channel as TextBasedChannelFields).send(chunks[i]);
      }
    }
  }
});

client.login(config.token);
