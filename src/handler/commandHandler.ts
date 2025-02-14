import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "../types";

export const loadCommands = async (client: Client) => {
  const commands = new Collection<string, Command>();
  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(filePath);
    const command: Command = commandModule.default;

    if (command?.name) {
      commands.set(command.name, command);
      console.log(`✅ Loaded command: ${command.name}`);
    } else {
      console.warn(`⚠️ Command ${file} is missing a name.`);
    }
  }

  client.commands = commands;
};
