import { Command } from "../types";

const command: Command = {
  name: "ping",
  description: "Replies with Pong!",
  execute: async (interaction) => {
    await interaction.reply("🏓 Pong!");
    await interaction.reply("bro who gave me this idea? this is bs!")
  },
};

export default command;
