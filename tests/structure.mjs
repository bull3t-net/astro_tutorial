import assert from "node:assert/strict";
import { access, readFile, readdir, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { createHash } from "node:crypto";
import { check } from "prettier";

const required = [
  "src/layouts/BaseLayout.astro",
  "src/layouts/ArticleLayout.astro",
  "src/components/Header.astro",
  "src/components/Footer.astro",
  "src/components/CardPreview.astro",
  "src/components/QuoteForm.astro",
  ...[
    "index",
    "pvc-business-cards",
    "nfc-business-cards",
    "design-support",
    "about",
    "faq",
    "contact",
  ].map((name) => `src/pages/${name}.astro`),
  "src/pages/articles/index.astro",
  "src/pages/articles/[slug].astro",
  "src/data/site.ts",
  "src/data/faqs.ts",
  "src/content.config.ts",
  "src/scripts/quote-form.ts",
  "src/styles/tokens.css",
  "scripts/format-deployment.mjs",
  ".prettierrc.json",
  ".editorconfig",
];
for (const path of required) await access(path);
await assert.rejects(access("src/pages/[...slug].astro"), { code: "ENOENT" });
const articleFiles = (await readdir("src/content/articles")).filter((name) =>
  name.endsWith(".md"),
);
assert.equal(articleFiles.length, 3);
const packageJson = JSON.parse(await readFile("package.json", "utf8"));
assert.match(packageJson.scripts.build, /format-deployment\.mjs/);

async function filesIn(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesIn(path)));
    else files.push(path);
  }
  return files.sort();
}
const assets = await filesIn("dist");
const html = assets.filter((path) => path.endsWith(".html"));
assert.equal(html.length, 11);
const fileReports = [];
const parsers = { ".html": "html", ".css": "css", ".js": "babel" };
for (const path of assets) {
  const parser = parsers[extname(path)];
  if (!parser) continue;
  const contents = await readFile(path, "utf8");
  const lines = contents.trimEnd().split("\n");
  assert.ok(lines.length > 1, `${path} must be multiline`);
  assert.ok(
    await check(contents, {
      parser,
      tabWidth: 2,
      printWidth: 100,
      endOfLine: "lf",
      htmlWhitespaceSensitivity: "css",
    }),
    `${path} formatting`,
  );
  if (parser === "html") {
    assert.ok(
      lines.length > 100,
      `${path} must contain readable indented HTML`,
    );
    assert.match(contents, /\n {2}<head>/, `${path} head indentation`);
  }
  fileReports.push({
    path,
    lines: lines.length,
    sha256: createHash("sha256").update(contents).digest("hex"),
  });
}
const astroFiles = (await filesIn("src")).filter((path) =>
  path.endsWith(".astro"),
);
for (const path of astroFiles) {
  const lines = (await readFile(path, "utf8")).split("\n").length;
  assert.ok(
    lines < 250,
    `${path} should remain a focused module, found ${lines} lines`,
  );
}
const report = {
  status: "passed",
  htmlPages: html.length,
  astroFiles: astroFiles.length,
  markdownArticles: articleFiles.length,
  requiredFiles: required.length,
  deploymentFiles: fileReports,
};
await writeFile(
  "qa/structure-report.json",
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
