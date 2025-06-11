import { Command } from "../types";
import config from "../config.json";
import { getMemoryFilePath, retrieveJSONData, setJSONData } from "../lib/base-memory-functions";
import path from "path"

const command: Command = {
  name: "ban",
  description: "Bans a user from using BlazeVortex",
  options: [
    {
      name: "user",
      description: "The user to ban",
      type: 6,
      required: true,
    },
  ],
  execute: async (interaction) => {
    const userToBan = interaction.options.getUser("user");
    try {
      if (config.admins.includes(interaction.user.id)) {
        if (config.admins.includes(userToBan.id)) {
          return await interaction.reply(
            "You cannot ban another admin. Please choose a different user."
          );
        } else {
          await interaction.reply(`Banning <@${userToBan.id}>...`);
          let userData = await retrieveJSONData(path.join(getMemoryFilePath(), "users", userToBan.id), "userData.json")
          if (userData.banned) {
            return await interaction.reply("User is already banned")
          } else {
            userData.banned = true
            setJSONData(path.join(getMemoryFilePath(), "users", userToBan.id), "userData.json", userData)
            return await interaction.reply("Succesfully banned user")
          }
        }
      } else {
        return await interaction.reply(
          "You do not have permission to use this command. Only T3D admins can ban users."
        );
      }
    } catch (error) {
      console.error("Error executing ban command:", error);
      return await interaction.reply(
        "An error occurred while trying to execute the ban command."
      );
    }
  },
};

export default command;
