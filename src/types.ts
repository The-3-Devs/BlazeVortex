import { Client, ApplicationCommandOptionData, Collection } from "discord.js";

export interface Command {
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[]; // <- This lets you add /command options (like /ban @user)
  execute: (interaction: any, client: Client) => Promise<void>;
}

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}
