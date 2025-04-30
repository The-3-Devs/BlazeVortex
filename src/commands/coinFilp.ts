import { Command } from "../types";

const command: Command = {
  name: "coinflip",
  description: "Flips a coin and replies with either Heads or Tails!",
  execute: async (interaction) => {
    // Generate a random result (0 for Heads, 1 for Tails)
    const result = Math.random() < 0.5 ? "Heads" : "Tails";

    // Reply with the coinflip result
    await interaction.reply(`🪙 It's ${result}!`);
    await interaction.reply("we're totally not biased!")
  },
};

export default command;
