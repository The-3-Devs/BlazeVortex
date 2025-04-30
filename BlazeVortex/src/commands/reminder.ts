import { Command } from "../types";

const command: Command = {
  name: "reminder",
  description: "Set a reminder for yourself for any time or thing.",
  execute: async (interaction) => {
    const timeInput = interaction.options.getString("time");
    const reason = interaction.options.getString("reason");

    // Ensure both the time and reason are provided
    if (!timeInput || !reason) {
      return await interaction.reply("Please provide both a time and reason.");
    }

    // Get time such as "1h 1m 1s"
    const timeRegex = /(\d+)([hms])/g;
    let totalSeconds = 0;
    let match;
    while ((match = timeRegex.exec(timeInput)) !== null) {
      const value = parseInt(match[1], 10);
      const unit = match[2];
      if (unit === 'h') {totalSeconds += value * 3600;}
      if (unit === 'm') {totalSeconds += value * 60;}
      if (unit === 's') {totalSeconds += value;}
    }
    if (totalSeconds === 0) {
      return await interaction.reply("Please provide a valid time format (e.g., 1h 1m 1s).");
    }

    // Send the reminder message
    await interaction.reply(`You will be reminded of \`\`${reason}\`\` in \`\`${timeRegex}\`\` (${totalSeconds} seconds).`);
  },
};

export default command;
