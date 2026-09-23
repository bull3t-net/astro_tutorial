import { chromium } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const paths = [
  "/",
  "/pvc-business-cards/",
  "/nfc-business-cards/",
  "/design-support/",
  "/about/",
  "/faq/",
  "/contact/",
  "/articles/",
  "/articles/offline-nfc-explained/",
  "/articles/nfc-or-qr/",
  "/articles/artwork-checklist/",
];
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const current = {};
  for (const path of paths) {
    await page.goto((process.env.BASE_URL || "http://127.0.0.1:8080") + path);
    current[path] = await page.locator("body").innerText();
  }
  if (process.argv.includes("--record"))
    await writeFile(
      "qa/refactor-baseline.json",
      JSON.stringify(current, null, 2),
    );
  else {
    const baseline = JSON.parse(
      await readFile("qa/refactor-baseline.json", "utf8"),
    );
    for (const path of paths)
      assert.equal(
        current[path].replace(/\s/g, ""),
        baseline[path].replace(/\s/g, ""),
        `Visible content regression at ${path}`,
      );
    await writeFile(
      "qa/content-report.json",
      JSON.stringify({ status: "passed", routes: paths.length }, null, 2) +
        "\n",
    );
    console.log(`Visible content preserved across ${paths.length} routes.`);
  }
} finally {
  await browser.close();
}
