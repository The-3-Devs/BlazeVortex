import { Command } from "../types";

const command: Command = {
  name: "ping",
  description: "Replies with ping information",
  execute: async (interaction) => {
    await interaction.reply(`🏓 Latency is ${Date.now() - interaction.createdTimestamp}ms.`);
  },
};

export default command;
