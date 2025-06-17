import {
  Client,
  Events,
  GatewayIntentBits,
  Collection,
  ActivityType,
  PresenceUpdateStatus,
  MessageFlags,
  TextBasedChannelFields,
  Message,
} from "discord.js";

import config from "./config.json";
import { loadCommands } from "./handlers/commandHandler";
import { Command } from "./types";
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import fs from "fs/promises";
import path from "path";
import splitMessage from "./lib/splitmessage";
import { memorize, getUserData } from "./lib/memory-functions";
import {
  handleAdminCommands,
  handleServerAdminCommands,
} from "./lib/admin-command-handlers";
import { getMemoryFilePath } from "./lib/base-memory-functions";
import {
  generateAdminAIPrompt,
  generateMainAIPrompt,
} from "./lib/generate-ai-prompt";

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

client.on(Events.InteractionCreate, async (interaction) => {
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
  const { guild, channel, author, content, member } = message;

  if (!guild || !channel || author.bot || message.flags?.has(MessageFlags.Ephemeral)) return;

  await memorize(message);

  const userData = await getUserData(author.id);
  if (userData.banned) return;

  const adminCmds = [
    "setgame", "setstatus", "eval", "guilds", "blvrestart", "addadmin", 
    "defaultstatus", "removeadmin", "debug", "uptime", "fuckryan", 
    "mem", "dmadmins", "ignore", "regText", "clearmem", 
    "enablechannel", "disablechannel"
  ];

  const serverAdminCmds = ["enablechannel", "disablechannel"];
  const isDev = config.admins.includes(author.id);
  const isServerAdmin = member?.permissions.has("Administrator");

  if (content.startsWith(prefix)) {
    const cmdName = content.slice(prefix.length).split(" ")[0].toLowerCase();

    if (adminCmds.includes(cmdName) && isDev) {
      await handleAdminCommands(message, prefix, client);
      return;
    }

    if (serverAdminCmds.includes(cmdName)) {
      if (!isServerAdmin) {
        await message.reply("❌ You do not have permission to use this command.");
        return;
      }
      await handleServerAdminCommands(message, prefix);
      return;
    }
  }

  const serverId = guild.id;
  const channelId = channel.id;

  const isDisabled = await fs.readFile(
    path.join(getMemoryFilePath(), "servers", serverId, channelId, "memory.json"), "utf-8"
  ).then(data => JSON.parse(data)?.disabled).catch(() => false);

  const isServerDisabled = await fs.readFile(
    path.join(getMemoryFilePath(), "servers", serverId, "serverData.json"), "utf-8"
  ).then(data => JSON.parse(data)?.disabledByDefault).catch(() => false);

  if (isDisabled || (isServerDisabled && isDisabled !== false)) return;

  if (isDev && content.toLowerCase().startsWith("~ai")) {
    const prompt = await generateAdminAIPrompt(message, client);
    const responseText = await generateGeminiResponse(prompt);
    await sendResponseChunks(message, responseText);
    return;
  }

  const prompt = await generateMainAIPrompt(message, client);
  const responseText = await generateGeminiResponseWithSchema(prompt);
  
  try {
    const parsed = JSON.parse(responseText);
    if (parsed.sendResponse) {
      await sendResponseChunks(message, parsed.response || "⚠️ No response");
    }
  } catch (err) {
    console.error("Failed to parse AI response:", err);
    await message.reply("⚠️ AI returned invalid response.");
  }
});

client.login(config.token);

async function generateGeminiResponse(prompt: string): Promise<string> {
  try {
    const rawRes: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = rawRes.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "⚠️ No response from AI.";
  } catch (error) {
    console.error("AI request failed:", error);
    return "**⚠️ AI failed to respond due to model overload.**";
  }
}

async function generateGeminiResponseWithSchema(prompt: any): Promise<string> {
  try {
    const rawRes: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sendResponse: { type: Type.BOOLEAN },
            response: { type: Type.STRING },
          },
          required: ["sendResponse"],
        },
      },
    });

    const text = rawRes.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "{}";
  } catch (error) {
    console.error("AI request failed:", error);
    return "{}";
  }
}

async function sendResponseChunks(message: Message, text: string) {
  const chunks = splitMessage(text);
  if (chunks.length === 0) return;

  await message.reply(chunks[0]);
  for (let i = 1; i < chunks.length; i++) {
    await (message.channel as TextBasedChannelFields).send(chunks[i]);
  }
}
