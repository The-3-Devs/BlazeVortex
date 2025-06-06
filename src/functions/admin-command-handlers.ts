import { Message, ActivityType, PresenceUpdateStatus, TextBasedChannelFields, Client } from "discord.js";
import fs from "fs/promises";
import path from "path";
import config from "../config.json";
import chalk from "chalk";
import { deleteMemory, recallMemory } from "./memory-functions";
import splitMessage from "./splitmessage";

export const handleAdminCommands = async (message: Message, prefix: string, client: Client) => {
  if (!message.content.startsWith(prefix)) return;
  if (!config.admins.includes(message.author.id))
    return message.reply("Only admins can use this command.");

  const [command, ...args] = message.content
    .slice(prefix.length)
    .trim()
    .split(/\s+/);

  switch (command.toLowerCase()) {
    case "setgame": {
      const game = args.join(" ");
      return game
        ? (await message.reply(`🎮 Game status set to **${game}**`)) &&
            client.user?.setActivity(game, { type: ActivityType.Playing }) &&
            client.user.setStatus(PresenceUpdateStatus.DoNotDisturb)
        : message.reply("❌ Provide a game name.");
    }
    case "setstatus": {
      const status = args.join(" ");
      return status
        ? client.user?.setPresence({
            activities: [{ name: status, type: ActivityType.Playing }],
            status: "dnd",
          }) &&
            client.user.setStatus(PresenceUpdateStatus.DoNotDisturb) &&
            message.reply(`✅ Bot status set to **${status}**`)
        : message.reply("❌ Provide a status.");
    }
    case "clearmem": {
      const level = args.join(" ");
      if (level) {
        message.reply(
          (await deleteMemory(level, message)) || "❌ Failed to clear memory."
        );
      } else {
        message.reply(
          "❌ Provide an acceptable level to clear the memory of (channel, server, or global)."
        );
      }
      return;
    }
    case "disablechannel": {
      const { guild, channel } = message;
      if (!guild) {
        message.reply("❌ This command can only be used in a server.");
        return;
      }

      const serverId = guild.id;
      const channelId = channel.id;
      const dir = path.join(__dirname, "..", "memory", "servers", serverId, channelId);
      const flagFile = path.join(dir, "disabled.json");

      try {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(
          flagFile,
          JSON.stringify({ disabled: true }),
          "utf-8"
        );
        message.reply("🔕 This channel is now disabled for responses.");
      } catch (err) {
        console.error("Failed to disable channel:", err);
        message.reply("❌ Failed to disable this channel.");
      }
      return;
    }
    case "enablechannel": {
      const { guild, channel } = message;
      if (!guild) {
        message.reply("❌ This command can only be used in a server.");
        return;
      }

      const serverId = guild.id;
      const channelId = channel.id;
      const flagFile = path.join(
        __dirname,
        "..",
        "memory",
        "servers",
        serverId,
        channelId,
        "disabled.json"
      );

      try {
        await fs.rm(flagFile, { force: true });
        message.reply("✅ This channel is now enabled for responses.");
      } catch (err) {
        console.error("Failed to enable channel:", err);
        message.reply("❌ Failed to enable this channel.");
      }
      return;
    }
    case "defaultstatus": {
      const status = "a set of moves to destroy the world";
      return status
        ? client.user?.setPresence({
            activities: [{ name: status, type: ActivityType.Playing }],
            status: "dnd",
          }) &&
            client.user.setStatus(PresenceUpdateStatus.DoNotDisturb) &&
            message.reply(`✅ Bot status set to **${status}**`)
        : message.reply("❌ Provide a status.");
    }
    case "eval": {
      try {
        const code = args.join(" ");
        const result = await eval(code);
        return message.reply(`🖥️ Eval result:\n\`\`\`${result}\`\`\``);
      } catch (e: any) {
        return message.reply(`⚠️ Error: ${e?.message ?? "unknown"}`);
      }
    }
    case "blvrestart": {
      console.log(chalk.bgYellow("🔁 Restarting bot from command..."));
      if (process.env.NODENAME === "nodemon") {
        console.log("Restarting with nodemon...");
        if (process.platform === "win32") {
          console.log("Windows detected. Exiting for nodemon to restart.");
          await message.reply(
            `Windows detected. Exiting for nodemon to restart. (May require a file change to trigger nodemon)`
          );
          process.exit(1);
        } else {
          console.log("Non-Windows detected. Sending SIGUSR2 to self.");
          process.kill(process.pid, "SIGUSR2");
          await message.reply(
            `Bot restarted (may take a second to come back online)`
          );
        }
      } else {
        await message.reply(
          `Bot restarted (may take a second to come back online)`
        );
        console.log("Bot restarted (may take a second to come back online)");
        process.exit(1);
      }
    }
    case "guilds": {
      const guilds =
        client.guilds.cache.map((g) => g.name).join(", ") || "No guilds";
      return message.reply(`🏛️ Currently in: **${guilds}**`);
    }
    case "addadmin": {
      const user = message.mentions.users.first();
      if (!user) return message.reply("❌ Mention a user.");
      if (config.admins.includes(user.id))
        return message.reply(`❌ **${user.tag}** is already admin.`);
      config.admins.push(user.id);
      return message.reply(`✅ **${user.tag}** added as admin.`);
    }
    case "removeadmin": {
      const user = message.mentions.users.first();
      if (!user) return message.reply("❌ Mention a user.");
      const idx = config.admins.indexOf(user.id);
      if (idx === -1)
        return message.reply(`❌ **${user.tag}** is not an admin.`);
      config.admins.splice(idx, 1);
      return message.reply(`✅ **${user.tag}** removed from admins.`);
    }
    case "debug": {
      const info = `⏳ Uptime: ${client.uptime}ms\n🏛️ Guilds: ${client.guilds.cache.size}\n👥 Users: ${client.users.cache.size}\n `;
      return message.reply(`🔍 Debug Info:\n${info}`);
    }
    case "uptime": {
      const startedDate = new Date(Date.now() - (client.uptime || 0));
      const utcString = startedDate.toUTCString();
      const info = `⏳ Uptime: ${client.uptime}ms \n 🕒 Started time: ${utcString}`;
      return message.reply(`🔍 Uptime Info:\n${info}`);
    }
    case "fuckryan":
      return message.reply("Fuck You Ryan For Banning Arti From Bloom.");

    case "mem": {
      let memoryOutput = recallMemory(message.guild!.id, message.channel.id);

      const chunks = splitMessage((await memoryOutput).formattedOutput);
      if (chunks.length > 0) {
        await message.reply(chunks[0]);
        if ("send" in message.channel) {
          for (let i = 1; i < chunks.length; i++) {
            await (message.channel as TextBasedChannelFields).send({
              content: chunks[i],
              allowedMentions: { users: [] },
            });
          }
        }
      }

      return;
    }
    default:
      return;
  }
};

export async function handleServerAdminCommands(message: Message, prefix: string) {
  const [command] = message.content.slice(prefix.length).trim().split(/\s+/);

  switch (command.toLowerCase()) {
        case "disablechannel": {
          const { guild, channel } = message;
          if (!guild) {
            message.reply("❌ This command can only be used in a server.");
            return;
          }
  
          const serverId = guild.id;
          const channelId = channel.id;
          const dir = path.join(__dirname, "..", "memory", "servers", serverId, channelId);
          const flagFile = path.join(dir, "disabled.json");
  
          try {
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(
              flagFile,
              JSON.stringify({ disabled: true }),
              "utf-8"
            );
            message.reply("🔕 This channel is now disabled for responses.");
          } catch (err) {
            console.error("Failed to disable channel:", err);
            message.reply("❌ Failed to disable this channel.");
          }
          return;
        }
        case "enablechannel": {
          const { guild, channel } = message;
          if (!guild) {
            message.reply("❌ This command can only be used in a server.");
            return;
          }
  
          const serverId = guild.id;
          const channelId = channel.id;
          const flagFile = path.join(
            __dirname,
            "..",
            "memory",
            "servers",
            serverId,
            channelId,
            "disabled.json"
          );
  
          try {
            await fs.rm(flagFile, { force: true });
            message.reply("✅ This channel is now enabled for responses.");
          } catch (err) {
            console.error("Failed to enable channel:", err);
            message.reply("❌ Failed to enable this channel.");
          }
          return;
        }
      }
}