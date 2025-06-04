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
  description: "Configure whether all channels should be enabled or disabled for responses.",
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
      filter: (i: { user: { id: any; }; }) => i.user.id === interaction.user.id,
      time: 60_000,
    });

    collector?.on("collect", async (i: { guild: any; customId: string; update: (arg0: { content: string; embeds: never[]; components: never[]; }) => any; }) => {
      const serverId = i.guild!.id;
      const channels = i.guild!.channels.cache.filter(
        (c: { isTextBased: () => any; type: number; }) => c.isTextBased() && c.type !== 4
      ) as Map<string, GuildTextBasedChannel>;

      let affected = 0;

      for (const channel of channels.values()) {
        const dir = path.join(__dirname, "..", "memory", serverId, channel.id);
        const flagFile = path.join(dir, "disabled.json");
        await fs.mkdir(dir, { recursive: true });

        if (i.customId === "setup-disable-all") {
          await fs.writeFile(flagFile, JSON.stringify({ disabled: true }), "utf-8");
          affected++;
        } else if (i.customId === "setup-enable-all") {
          try {
            await fs.unlink(flagFile);
            affected++;
          } catch {} // Ignore if doesn't exist
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
    });
  },
};

export default command;
