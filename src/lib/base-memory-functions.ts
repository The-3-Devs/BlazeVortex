import path from "path";
import fs from "fs/promises";

export function getMemoryFilePath() {
  let currentDir = __dirname;

  while (path.basename(currentDir) !== "BlazeVortex") {
    const parent = path.dirname(currentDir);
    if (parent === currentDir) {
      throw new Error("Could not find BlazeVortex root directory.");
    }
    currentDir = parent;
  }

  const targetPath = path.join(currentDir, "src", "memory");

  return targetPath;
}

export async function retrieveJSONData(dir: string, filename: string) {
  await fs.mkdir(dir, { recursive: true });

  const filePath = path.join(dir, filename);

  let memoryData: any = {};

  try {
    const existing = await fs.readFile(filePath, "utf-8");
    memoryData = JSON.parse(existing);
  } catch {}

  return memoryData;
}

export async function setJSONData(dir: string, filename: string, data: any) {
  await fs.writeFile(path.join(dir, filename), JSON.stringify(data, null, 2), "utf-8");
}
