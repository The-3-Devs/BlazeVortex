import { Message } from "discord.js";
import fs from "fs/promises";
import path from "path";
import config from "../config.json";
import { getMemoryFilePath } from "./base-memory-functions";

export async function memorize(message: Message) {
  const { guild, channel, author, content } = message;

  if (!guild) return;

  const serverId = guild.id;
  const serverName = guild.name;
  const channelId = channel.id;
  const username = author.username;
  const userId = author.id;
  const isDev = config.admins.includes(userId);

  const dir = path.join(getMemoryFilePath(), "servers", serverId, channelId);
  const filePath = path.join(dir, `memory.json`);

  try {
    await fs.mkdir(dir, { recursive: true });

    let memoryData: any = {
      messages: [],
      server: { id: serverId, name: serverName },
    };

    try {
      const existing = await fs.readFile(filePath, "utf-8");
      memoryData = JSON.parse(existing);

      if (!Array.isArray(memoryData.messages)) {
        memoryData.messages = [];
      }
    } catch {}

    if (!memoryData.disabled && !(memoryData.disabled == true)) {
      memoryData.disabled = false;
    }

    memoryData.messages?.push({
      timestamp: new Date().toISOString(),
      user: username,
      message: content,
      userId,
      isDev,
      isBanned: false,
      flags: message.flags
    });

    if (memoryData.messages.length > 10000) memoryData.messages.shift();

    await fs.writeFile(filePath, JSON.stringify(memoryData, null, 2), "utf-8");
  } catch (err) {
    console.error(`Memory write failed at ${filePath}:`, err);
  }
}

export async function recallMemory(
  guildId: string,
  channelId: string
): Promise<any> {
  const filePath = path.join(
    getMemoryFilePath(),
    "servers",
    guildId,
    channelId,
    `memory.json`
  );

  let data: string;
  try {
    data = await fs.readFile(filePath, "utf-8");
  } catch {
    return "⚠️ No memory found for this channel.";
  }

  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch {
    return "⚠️ Error parsing memory.";
  }

  const messages = parsed.messages as {
    user: string;
    message: string;
    timestamp: string;
  }[];

  if (!messages?.length) return "📜 Memory is empty.";

  const serverInfo = parsed.server;
  const formatted = messages.map((m) => `${m.user}: ${m.message}`).join("\n");

  return {
    formattedOutput: `📜 **Memory for ${
      serverInfo?.name || "this channel"
    }:**\n\`\`\`\n${formatted}\n\`\`\``,
    unformattedOutput: parsed,
  };
}

export async function deleteMemory(level: string, message: Message) {
  const { guild, channel } = message;
  if (!guild) return "❌ Not in a guild, cannot clear memory";

  const serverId = guild.id;
  const channelId = channel.id;

  const baseDir = path.join(getMemoryFilePath(), "servers");
  const serverDir = path.join(baseDir, serverId);
  const channelDir = path.join(serverDir, channelId);
  const memoryFile = path.join(channelDir, "memory.json");

  async function clearFile(filePath: string) {
    try {
      const data = JSON.parse(await fs.readFile(filePath, "utf-8"));
      if (Array.isArray(data.messages)) {
        data.messages = [];
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
      }
    } catch (err) {
      console.error(`Failed to clear ${filePath}:`, err);
    }
  }

  async function walkAndClear(dir: string) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walkAndClear(fullPath);
      } else if (entry.name === "memory.json") {
        await clearFile(fullPath);
      }
    }
  }

  try {
    if (level === "channel") {
      await clearFile(memoryFile);
      return `✅ Cleared memory: ./${serverId}/${channelId}/memory.json`;
    } else if (level === "server") {
      await walkAndClear(serverDir);
      return `✅ Cleared all memory in server: ./${serverId}`;
    } else if (level === "global") {
      await walkAndClear(baseDir);
      return `✅ Cleared all global memory in ./memory/servers`;
    } else {
      throw new Error(`Invalid level: ${level}`);
    }
  } catch (err) {
    return `❌ Error clearing memory (${level}): ${
      err instanceof Error ? err.message : "unknown error"
    }`;
  }
}
