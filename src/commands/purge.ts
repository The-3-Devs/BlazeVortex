import { ChatInputCommandInteraction, Client, TextChannel } from "discord.js";
import { Command } from "../types";

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
  execute: async (interaction: ChatInputCommandInteraction, _client: Client) => {
    const amount = interaction.options.getInteger("amount", true);

    if (!amount || amount < 1 || amount > 100) {
      await interaction.reply({
        content: "You must provide a valid number between 1 and 100.",
        ephemeral: true
      });
      return;
    }

    const channel = interaction.channel;
    if (!channel || !channel.isTextBased() || !("bulkDelete" in channel)) {
      await interaction.reply({
        content: "This command can only be used in text channels.",
        ephemeral: true
      });
      return;
    }

    try {
      const deleted = await channel.bulkDelete(amount, true);
      await interaction.reply({
        content: `Deleted ${deleted.size} messages 🧹`,
        ephemeral: true
      });
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: "Couldn’t delete the messages. Maybe they’re too old? (14 day limit) 🕰️",
        ephemeral: true
      });
    }
  },
};

export default command;
