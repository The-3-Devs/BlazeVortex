import { Client, Events, GatewayIntentBits, Interaction, Collection } from "discord.js";
import config from "./config.json";
import { loadCommands } from "./handler/commandHandler";
import { Command } from "./types";
import "./admin_commands/adminCommandHandler";



const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent, // Required for reading message content
      GatewayIntentBits.DirectMessages,
    ],
  });


client.once(Events.ClientReady, () => {
    console.log(`✅ Ready! Logged in as ${client.user?.tag}`);
});

client.commands = new Collection<string, Command>();

// Load commands
loadCommands(client).then(() => {
    console.log("✅ All commands loaded!");
});

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`❌ Command ${interaction.commandName} not found.`);
        return;
    }

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(`❌ Error executing command ${interaction.commandName}:`, error);
    }
});

client.login(config.token);
