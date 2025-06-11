import { Command } from "../types";
import fs from "fs/promises";
import { getMemoryFilePath } from "../lib/base-memory-functions";
import path from "path";
import config from "../config.json";
import { PermissionsBitField } from "discord.js";

const command: Command = {
  name: "disable-channel",
  description: "Disables a channel for automated resopnses",
  execute: async (interaction) => {
    const { guild, channel } = interaction;

    if (
      !interaction.member?.permissions.has(
        PermissionsBitField.Flags.Administrator
      ) &&
      !config.admins.includes(interaction.user.id)
    )
      return await interaction.reply(
        "You must be a server administrator to use this command"
      );

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

      data.disabled = true;
      await fs.writeFile(memoryFile, JSON.stringify(data, null, 2), "utf-8");

      interaction.reply("✅ This channel is now disabled for responses.");
    } catch (err) {
      console.error("Failed to disable channel:", err);
      interaction.reply("❌ Failed to disable this channel.");
    }
    return;
  },
};

export default command;
