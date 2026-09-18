import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { format } from "prettier";

/** Format generated assets on every build, without reordering HTML attributes. */
async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? filesIn(path) : [path];
    }),
  );
  return nested.flat().sort();
}

const parsers = { ".html": "html", ".css": "css", ".js": "babel" };
const counts = { html: 0, css: 0, js: 0 };
for (const path of await filesIn("dist")) {
  const extension = extname(path);
  const parser = parsers[extension];
  if (!parser) continue;
  const original = await readFile(path, "utf8");
  const readable = await format(original, {
    parser,
    tabWidth: 2,
    printWidth: 100,
    endOfLine: "lf",
    // Standard HTML formatting: block elements are indented; inline spacing is retained.
    htmlWhitespaceSensitivity: "css",
  });
  await writeFile(path, readable);
  counts[extension.slice(1)]++;
}
console.log("Readable deployment files:", counts);
