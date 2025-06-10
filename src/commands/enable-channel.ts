import { Command } from "../types";
import fs from "fs/promises";
import { getMemoryFilePath } from "../lib/base-memory-functions";
import path from "path";

const command: Command = {
  name: "enable-channel",
  description: "Enables a channel for automated resopnses",
  execute: async (interaction) => {
    const { guild, channel } = interaction;

    if (!guild) {
      interaction.reply("❌ This command can only be used in a server.");
      return;
    }

    const serverId = guild.id;
    const channelId = channel.id;
    const memoryFile = path.join(
      getMemoryFilePath(),
      "servers",
      serverId,
      channelId,
      "memory.json"
    );

    try {
      let data: any = {};
      try {
        const existing = await fs.readFile(memoryFile, "utf-8");
        data = JSON.parse(existing);
      } catch {
        //just use empty object idc
      }

      data.disabled = false;
      await fs.writeFile(memoryFile, JSON.stringify(data, null, 2), "utf-8");

      interaction.reply("✅ This channel is now enabled for responses.");
    } catch (err) {
      console.error("Failed to enable channel:", err);
      interaction.reply("❌ Failed to enable this channel.");
    }
    return;
  },
};

export default command;
