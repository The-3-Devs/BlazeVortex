import { Command } from "../types";

const command: Command = {
  name: "me",
  description: "Replies with information about me",
  execute: async (interaction) => {
    const msg: string = "Hey, I'm BlazeVortex, a Discord bot designed to spice up your server! 🚀 To learn more about me, use /help."
    await interaction.reply(msg);
  },
};

export default command;
