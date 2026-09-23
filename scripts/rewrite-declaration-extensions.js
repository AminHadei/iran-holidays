import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const lib = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "lib");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }
    if (!entry.name.endsWith(".d.ts")) continue;
    const source = await readFile(fullPath, "utf8");
    const rewritten = source.replaceAll(".ts\"", ".js\"").replaceAll(".ts'", ".js'");
    if (rewritten !== source) await writeFile(fullPath, rewritten);
  }
}

await walk(lib);
