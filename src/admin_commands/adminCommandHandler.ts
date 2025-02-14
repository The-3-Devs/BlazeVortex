import { Client, GatewayIntentBits, ActivityType, Message } from "discord.js";
import config from "../config.json";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

const handleAdminCommands = async (message: Message) => {
  if (message.author.bot) return; // Ignore bot messages

  const prefix = "!";
  if (!message.content.startsWith(prefix)) return; // Ignore non-prefixed messages
  if (!config.admins.includes(message.author.id)) return; // Allow only admins

  const [command, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);

  if (command === "setgame") {
    const game = args.join(" ");
    if (game) {
      client.user?.setActivity(game, { type: ActivityType.Playing });
      message.reply(`🎮 Game status set to: **${game}**`);
    } else {
      message.reply("❌ Please provide a game name.");
    }
  }

  if (command === "setstatus") {
    const status = args.join(" ");
    if (status) {
      client.user?.setPresence({ activities: [{ name: status, type: ActivityType.Playing }], status: "online" });
      message.reply(`✅ Bot status set to: **${status}**`);
    } else {
      message.reply("❌ Please provide a status.");
    }
  }

  if (command === "eval") {
    try {
      const code = args.join(" ");
      const result = await eval(code);
      message.reply(`🖥️ Eval result:\n\`\`\`${result}\`\`\``);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.reply(`⚠️ Error: ${error.message}`);
      } else {
        message.reply("⚠️ An unknown error occurred during eval.");
      }
    }
  }

  if (command === "guilds") {
    const guildNames = client.guilds.cache.map((guild) => guild.name).join(", ") || "No guilds found";
    message.reply(`🏛️ The bot is currently in: **${guildNames}**`);
  }

  if (command === "addadmin") {
    const user = message.mentions.users.first();
    if (user) {
      if (!config.admins.includes(user.id)) {
        config.admins.push(user.id);
        message.reply(`✅ **${user.tag}** has been added as an admin.`);
      } else {
        message.reply(`❌ **${user.tag}** is already an admin.`);
      }
    } else {
      message.reply("❌ Please mention a user to add as an admin.");
    }
  }

  if (command === "removeadmin") {
    const user = message.mentions.users.first();
    if (user) {
      const index = config.admins.indexOf(user.id);
      if (index !== -1) {
        config.admins.splice(index, 1);
        message.reply(`✅ **${user.tag}** has been removed from admins.`);
      } else {
        message.reply(`❌ **${user.tag}** is not an admin.`);
      }
    } else {
      message.reply("❌ Please mention a user to remove from admins.");
    }
  }

  if (command === "debug") {
    const debugInfo = `⏳ Bot Uptime: ${client.uptime}ms\n🏛️ Guilds: ${client.guilds.cache.size}\n👥 Users: ${client.users.cache.size}`;
    message.reply(`🔍 Debug Info:\n${debugInfo}`);
  }
};

// Listen for admin messages (both in DMs and Guilds)
client.on("messageCreate", handleAdminCommands);

client.login();

export default client;
