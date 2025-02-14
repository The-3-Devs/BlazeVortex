import { Command } from "../types";

const command: Command = {
  name: "say",
  description: "Replies with whatever you want me to say!",
  // it says the message in the argument, but it doesen't add it to the command list right..?
  // like it adds a /say command with no arguments, but this would expect one.
  execute: async (interaction) => {
    // Get the content from the user's input
    const userMessage = interaction.options.getString("message"); // here these are the args
    

    if (!userMessage) {
      return await interaction.reply("You must provide something for me to say!");
    }

    await interaction.reply(userMessage);
  },
};

export default command;
