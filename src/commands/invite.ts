import { Command } from "../types";
import { EmbedBuilder } from 'discord.js'; // Use EmbedBuilder instead of MessageEmbed

const command: Command = {
  name: "invite",
  description: "Provides an invite link to add the bot to your server!",
  execute: async (interaction) => {
    const clientId = interaction.client.user?.id;
    if (!clientId) {
      return await interaction.reply("Sorry, I couldn't retrieve my ID.");
    }
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot&permissions=8`;
    
    const embed = new EmbedBuilder() 
      .setColor("#0099ff")
      .setTitle("Invite the Bot")
      .setDescription(`Click the button below to invite me to your server:`)
      .addFields(
        { name: "Invite Link", value: `[Click me](${inviteLink})`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
};

export default command;
