  import { ChatInputCommandInteraction, Client } from "discord.js";
  import { Command } from "../types";

  // @ts-ignore
  const command: Command = {
    name: "purge",
    description: "Delets the given amount of Messages",
    options: [
      {
        name: "amount",
        description: "The message to say",
        type: 4, // Integer
        required: true,
      },
    ],
    execute: async (interaction: ChatInputCommandInteraction, _client: Client) => {
      const amount = interaction.options.getString("amount", true);

      if (!amount) {
        await interaction.reply("You must provide a amount of messages to delete.");
        return;
      }
      if (amount < 1 || amount > 1000) {
          await interaction.reply({
              content: "Please provide a number between 1 and 100.",
              ephemeral: true
          });
          return;
      }
      const channel = interaction.channel;
      if (!channel || !channel.isTextBased()) {
        await interaction.reply({
          content: "This command can only be used in text channels.",
          ephemeral: true
        });
        return;
      }
      try {
          const messages = await channel.bulkDelete(amount, true);
          await interaction.reply({
            content: `Deleted ${messages.size} messages 🧹`,
            ephemeral: true
          });
        } catch (err) {
          console.error(err);
          await interaction.reply({
            content: "Couldn’t delete the messages. Maybe messages are too old?",
            ephemeral: true
          });
        }


    },
  };
  //@ts-ignore
  export default command;
