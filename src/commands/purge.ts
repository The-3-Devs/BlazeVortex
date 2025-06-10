import { ChatInputCommandInteraction, Client, MessageFlags} from "discord.js";
import { Command } from "../types";
import {
  retrieveJSONData,
  setJSONData,
  getMemoryFilePath,
} from "../lib/base-memory-functions";
import path from "path";

const command: Command = {
  name: "purge",
  description: "Deletes the given amount of messages.",
  options: [
    {
      name: "amount",
      description: "The amount of messages to delete.",
      type: 4, // Integer
      required: true,
    },
  ],
  execute: async (
    interaction: ChatInputCommandInteraction,
    _client: Client
  ) => {
    const amount = interaction.options.getInteger("amount", true);

    const serverId = interaction.guild?.id;

    if (!amount || amount < 1 || amount > 100) {
      await interaction.reply({
        content: "You must provide a valid number between 1 and 100.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const channel = interaction.channel;
    if (!channel || !channel.isTextBased() || !("bulkDelete" in channel)) {
      await interaction.reply({
        content: "This command can only be used in text channels.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const channelId = channel.id;

    try {
      if (serverId) {
        const dir = path.join(
          getMemoryFilePath(),
          "servers",
          serverId,
          channelId
        );

        const existingData = await retrieveJSONData(dir, "memory.json");

        if (!Array.isArray(existingData.messages)) {
          existingData.messages = [];
        }

        for (let i = amount; i > 0; i--) {
          existingData.messages.pop()
        } 
        
        setJSONData(dir, "memory.json", existingData)
      }      

      if (!channelId || !serverId) {
        await interaction.reply(`Failed to purge ${amount} message(s)`);
      }

      const deleted = await channel.bulkDelete(amount, true);
      await interaction.reply({
        content: `Deleted ${deleted.size} messages 🧹`,
        flags: MessageFlags.Ephemeral
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content:
          "Couldn’t delete the messages. Maybe they’re too old? (14 day limit) 🕰️",
        flags: MessageFlags.Ephemeral
      });
    }
  },
};

export default command;
