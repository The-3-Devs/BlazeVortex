import { Command } from "../types";
import {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  GuildTextBasedChannel,
} from "discord.js";
import path from "path";
import fs from "fs/promises";

const command: Command = {
  name: "setup",
  description:
    "Configure whether all channels should be enabled or disabled for responses.",
  execute: async (interaction) => {
    if (
      !interaction.guild ||
      !interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)
    ) {
      return interaction.reply({
        content: "❌ Only server admins can use this command.",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("BlazeVortex Setup")
      .setDescription("Should the bot respond in all channels by default?");

    const enableButton = new ButtonBuilder()
      .setCustomId("setup-enable-all")
      .setLabel("Enable All Channels")
      .setStyle(ButtonStyle.Success);

    const disableButton = new ButtonBuilder()
      .setCustomId("setup-disable-all")
      .setLabel("Disable All Channels")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      enableButton,
      disableButton
    );

    await interaction.reply({ embeds: [embed], components: [row] });

    const collector = interaction.channel?.createMessageComponentCollector({
      filter: (i: { user: { id: any } }) => i.user.id === interaction.user.id,
      time: 60_000,
    });

    collector?.on(
      "collect",
      async (i: {
        guild: any;
        customId: string;
        update: (arg0: {
          content: string;
          embeds: never[];
          components: never[];
        }) => any;
      }) => {
        const serverId = i.guild!.id;
        const channels = i.guild!.channels.cache.filter(
          (c: { isTextBased: () => any; type: number }) =>
            c.isTextBased() && c.type !== 4
        ) as Map<string, GuildTextBasedChannel>;

        let affected = 0;

        const serverMemFileDir = path.join(
          __dirname,
          "..",
          "memory",
          "servers",
          serverId
        );

        const memFile = path.join(serverMemFileDir, "serverData.json");

        for (const channel of channels.values()) {
          const dir = path.join(
            __dirname,
            "..",
            "memory",
            "servers",
            serverId,
            channel.id
          );

          const memFile = path.join(dir, "memory.json");
          await fs.mkdir(dir, { recursive: true });

          let data: Record<string, any> = {};
          try {
            const existing = await fs.readFile(memFile, "utf-8");
            data = JSON.parse(existing);
          } catch {}

          if (i.customId === "setup-disable-all") {
            try {
              data.disabled = true;

              await fs.writeFile(
                memFile,
                JSON.stringify(data, null, 2),
                "utf-8"
              );
            } catch (err) {
              console.error("Failed to update memory.json:", err);
            }

            affected++;
          } else if (i.customId === "setup-enable-all") {
            try {
              data.disabled = false;

              await fs.writeFile(
                memFile,
                JSON.stringify(data, null, 2),
                "utf-8"
              );
              affected++;
            } catch {}
          }
        }

        let serverData: Record<string, any> = {};
        try {
          const existing = await fs.readFile(memFile, "utf-8");
          serverData = JSON.parse(existing);
        } catch {}

        if (i.customId === "setup-disable-all") {
          try {
            const existing = await fs.readFile(memFile, "utf-8");
            serverData = JSON.parse(existing);
          } catch {}

          if (i.customId === "setup-disable-all") {
            try {
              serverData.disabledByDefault = true;

              await fs.writeFile(
                memFile,
                JSON.stringify(serverData, null, 2),
                "utf-8"
              );

            } catch (err) {
              console.error("Failed to update serverData.json:", err);
            }
          } else if (i.customId === "setup-enable-all") {
            try {
              serverData.disabledByDefault = false;

              await fs.writeFile(
                memFile,
                JSON.stringify(serverData, null, 2),
                "utf-8"
              );

            } catch (err) {
              console.error("Failed to update serverData.json:", err);
            }
          }
        }

        await i.update({
          content:
            i.customId === "setup-disable-all"
              ? `🔕 Disabled bot responses in ${affected} channels.`
              : `🔔 Enabled bot responses in ${affected} channels.`,
          embeds: [],
          components: [],
        });
      }
    );
  },
};

export default command;
