import { Client, Collection } from "discord.js";

export interface Command {
  name: string;
  description: string;
  execute: (interaction: any, client: Client) => Promise<void>;
}

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
  }
}
