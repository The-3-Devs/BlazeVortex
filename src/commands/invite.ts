import { Command } from "../types";
import { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js'; // Use EmbedBuilder instead of MessageEmbed

const command: Command = {
  name: "invite",
  description: "Provides an invite link to add the bot to your server!",
  execute: async (interaction) => {
    const clientId = interaction.client.user?.id;
    if (!clientId) {
      return await interaction.reply("Sorry, I couldn't retrieve my ID.");
    }
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=1334211480492572775`;

    const inviteButton = new ButtonBuilder()
	  .setLabel('Invite')
	  .setURL(inviteLink)
	  .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder()
			.addComponents(inviteButton);
    
    const embed = new EmbedBuilder() 
      .setColor("#0099ff")
      .setTitle("Invite the Bot")
      .setDescription(`Click the button below to invite me to your server:`)
    await interaction.reply({ embeds: [embed], components: [row] });
  }
};

export default command;
