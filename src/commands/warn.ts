import { Command } from "../types";

const command: Command = {
  name: "warn",
  description:
    "Warns a user and sends a warning message to the victim and the channel.",
  options: [
    {
      name: "user",
      description: "The user to warn",
      type: 6,
      required: true,
    },
    {
      name: "reason",
      description: "The reson to ban the user",
      type: 3,
      required: true,
    },
  ],
  execute: async (interaction) => {
    const targetUser = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");

    // Ensure both the target user and reason are provided
    if (!targetUser || !reason) {
      return await interaction.reply(
        "Please mention a user and/or provide a reason for the warning."
      );
    }

    // Send the warning to the victim (via DM)
    try {
      await targetUser.send(
        `You have been warned for the following reason: ${reason}. You have been warned!`
      );
    } catch (error) {
      await interaction.reply(
        `I couldn't DM ${targetUser.tag}. They might have DMs disabled.`
      );
      return;
    }

    // Send the warning to the channel
    await interaction.reply(`${targetUser.tag} has been warned for: ${reason}`);
  },
};

export default command;
