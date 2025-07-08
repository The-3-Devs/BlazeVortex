import { User } from "discord.js";
import config from "../config.json";
const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(config.mongoUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function addUserToSite(user: User, selectedName: string) {
  try {
    await client.connect();
    await client
      .db(config.mongoDbName)
      .collection("SiteDisplayNames")
      .updateOne(
        { id: user.id },
        {
          $set: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            selectedName: selectedName,
          },
        },
        { upsert: true }
      );
  } finally {
    await client.close();
  }
}
