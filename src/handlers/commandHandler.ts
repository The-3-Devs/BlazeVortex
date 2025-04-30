import { Client, Collection, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "../types";
import config from "../config.json";

export const loadCommands = async (client: Client) => {
  const commands = new Collection<string, Command>();
  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts") || file.endsWith(".js"));

  const slashCommands = [];

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(filePath);
    const command: Command = commandModule.default;

    if (command?.name) {
      commands.set(command.name, command);
      console.log(`✅ Loaded command: ${command.name}`);

      slashCommands.push({
        name: command.name,
        description: command.description,
        options: command.options || [],
      });
    } else {
      console.warn(`⚠️ Command ${file} is missing a name.`);
    }
  }

  client.commands = commands;

  // 🚀 Deploy to Discord API
  const rest = new REST({ version: "10" }).setToken(config.token);

  try {
    console.log("🌐 Deploying commands to Discord...");

    await rest.put(
      Routes.applicationCommands(config.clientId), // ⚡ clientId from config.json
      { body: slashCommands }
    );

    console.log("✅ Commands deployed successfully!");
  } catch (error) {
    console.error("❌ Failed to deploy commands:", error);
  }
};
