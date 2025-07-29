import { User } from "discord.js";
import config from "../config.json";
import { MongoClient, ServerApiVersion } from "mongodb";

export async function addUserToSite(user: User, selectedName: string) {
  const client = new MongoClient(config.mongoUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  let returnVal: string | null | undefined;

  try {
    await client.connect();
    const collection = client
      .db(config.mongoDbName)
      .collection("SiteDisplayNames");

    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    const existing = await collection.findOne({ id: user.id });

    returnVal = existing?.mostRecent < fiveMinutesAgo ? null : "recentlyUsed";

    if (!existing || existing.mostRecent < fiveMinutesAgo) {
      await collection.updateOne(
        { id: user.id },
        {
          $set: {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            selectedName: selectedName,
            mostRecent: Date.now(),
          },
          $inc: {
            usageCount: 1,
          },
        },
        { upsert: true }
      );
    } else {
      await collection.updateOne(
        { id: user.id },
        {
          $set: {
            username: user.username,
            displayName: user.displayName,
            selectedName: selectedName,
          },
        }
      );
    }
  } catch (err) {
    console.error("Error adding user to site:", err);
  } finally {
    await client.close();
    return returnVal;
  }
}
