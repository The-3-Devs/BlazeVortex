import { Client, ApplicationCommandOptionData, Collection } from "discord.js";

export interface Command {
  name: string;
  description: string;
  options?: ApplicationCommandOptionData[];
  execute: (interaction: any, client: Client) => Promise<void>;
}

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}
