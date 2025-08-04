import { ChatInputCommandInteraction, Client } from "discord.js";
import { Command } from "../types";

const command: Command = {
  name: "say",
  description: "Replies with whatever you want me to say!",
  options: [
    {
      name: "message",
      description: "The message to say",
      type: 3, // STRING
      required: true,
    },
  ],
  execute: async (interaction: ChatInputCommandInteraction, _client: Client) => {
    const message = interaction.options.getString("message");

    if (!message) {
      await interaction.reply("You must provide a message.");
      return;
    }

    await interaction.reply(message + " **(This message was sent by a user!)**");
  },
};

export default command;
