import { Command } from "../types";
import { EmbedBuilder } from "discord.js";

const command: Command = {
  name: "help",
  description: "Displays a list of all commands and what they do!",
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Help - Command List")
      .setDescription("Here are all the commands you can use:")

      // Add your commands here
      .addFields(
        // { name: "/ban", value: "Bans a user from the server." },
        { name: "/coinFlip", value: "Flips a coin and shows either a red or green emoji!" },
        { name: "/help", value: "Displays this list of commands and their descriptions." },
        { name: "/invite", value: "Sends an invite link for the bot." },
        { name: "/joke", value: "Tells a random joke." },
        // { name: "/kick", value: "Kicks a user from the server." },
        { name: "/me", value: "Shows the bot's about me and avatar!" },
        { name: "/setup", value: "Allows server admins to set up the bot in their server" },
        { name: "/ping", value: "Replies with 'Pong!'" },
       // { name: "/xp", value: "Displays the user's current XP or level." }
      )

    // Send the embed
    await interaction.reply({ embeds: [embed] });
  },
};

export default command;