import path from "path";

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
