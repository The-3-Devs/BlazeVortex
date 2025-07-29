import { Command } from "../types";
import { addUserToSite } from "../lib/add-user-to-site";
import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ComponentType,
  StringSelectMenuInteraction,
  Collection,
  MessageComponentInteraction,
  Interaction,
  MessageFlags
} from "discord.js";

const command: Command = {
  name: "f",
  description: "Shows your name on the site.",
  execute: async (interaction) => {
    try {
      const select = new StringSelectMenuBuilder()
        .setCustomId("name-select")
        .setPlaceholder("Please select an option")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Username")
            .setDescription(interaction.user.username)
            .setValue("username"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Username + Discriminator")
            .setDescription(
              `${interaction.user.username}#${interaction.user.discriminator}`
            )
            .setValue("username_discriminator"),
          new StringSelectMenuOptionBuilder()
            .setLabel("Display Name")
            .setDescription(
              interaction.member?.displayName ?? "No display name"
            )
            .setValue("displayName")
        );

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
        select
      );

      await interaction.reply({
        content: "Which name would you like to show on the site?",
        flags: MessageFlags.Ephemeral,
        components: [row],
      });

      const collector = interaction.channel?.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 60_000,
        filter: (i: Interaction) => i.user.id === interaction.user.id,
        max: 1,
      });

      collector?.on(
        "collect",
        async (selectInteraction: StringSelectMenuInteraction) => {
          const selected =
            selectInteraction.values[0] === "username"
              ? interaction.user.username
              : selectInteraction.values[0] === "username_discriminator"
              ? `${interaction.user.username}#${interaction.user.discriminator}`
              : selectInteraction.values[0] === "displayName"
              ? interaction.member?.displayName ?? "No display name"
              : "Unknown";

          const returnedVal = await addUserToSite(interaction.user, selected);
          
          await selectInteraction.update({
            content: `✅ "${selected}" added to the site. ${returnedVal == "recentlyUsed" ? "You ran this command within the past five minutes, so the counter on the site will *not* be updated." : ""}`,
            components: [],
          });
        }
      );

      collector?.on(
        "end",
        async (collected: Collection<string, MessageComponentInteraction>) => {
          if (collected.size === 0) {
            await interaction.editReply({
              content: "No selection was made within 1 minute, cancelling.",
              components: [],
            });
          }
        }
      );
    } catch (error) {
      console.error("Error handling select interaction:", error);

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply({
            content: "An error occurred while processing your selection.",
            components: [],
          });
        } else {
          await interaction.reply({
            content: "An error occurred while processing your selection.",
            ephemeral: true,
          });
        }
      } finally {
        console.error("Failed to send error response:", error);
      }
    }
  },
};

export default command;
