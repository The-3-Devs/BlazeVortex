import { Command } from "../types";

const command: Command = {
  name: "me",
  description: "Replies with My About Me!",
  execute: async (interaction) => {
    const msg: string = "I am a helpful bot here to assist you, I love helping people with code and more, but don't ask my ai something, he's rude asf."
    await interaction.reply(msg);
  },
};

export default command;
