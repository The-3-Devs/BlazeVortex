import { Command } from "../types";
import config from "../config.json";
import {
  getMemoryFilePath,
  retrieveJSONData,
  setJSONData,
} from "../lib/base-memory-functions";
import path from "path";

const command: Command = {
  name: "unban",
  description: "Unbans a user from using BlazeVortex",
  options: [
    {
      name: "user",
      description: "The user to unban",
      type: 6,
      required: true,
    },
  ],
  execute: async (interaction) => {
    const userToBan = interaction.options.getUser("user");

    try {
      if (!config.admins.includes(interaction.user.id)) {
        return await interaction.reply(
          "You do not have permission to use this command. Only T3D admins can unban users."
        );
      }

      if (config.admins.includes(userToBan.id)) {
        return await interaction.reply(
          "Admins cannot have been banned in the first place."
        );
      }

      const userData = await retrieveJSONData(
        path.join(getMemoryFilePath(), "users", userToBan.id),
        "userData.json"
      );

      if (!userData?.banned) {
        return await interaction.reply("User is already unbanned.");
      }

      userData.banned = false;
      await setJSONData(
        path.join(getMemoryFilePath(), "users", userToBan.id),
        "userData.json",
        userData
      );

      return await interaction.reply(
        `Successfully unbanned <@${userToBan.id}>.`
      );
    } catch (error) {
      console.error("Error executing unban command:", error);
      if (!interaction.replied) {
        return await interaction.reply(
          "An error occurred while trying to execute the unban command."
        );
      } else {
        return await interaction.followUp(
          "An error occurred while trying to execute the unban command."
        );
      }
    }
  },
};

export default command;
