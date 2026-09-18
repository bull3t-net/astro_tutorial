import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.BASE_URL || "http://127.0.0.1:8080";
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
await mkdir("qa", { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
const results = [];
const links = new Set();
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
for (const width of [1440, 768, 390, 320]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const path of paths) {
    const response = await page.goto(base + path);
    assert.equal(response.status(), 200, path);
    await page.waitForLoadState("networkidle");
    assert.equal(await page.locator("h1").count(), 1, `${path} one h1`);
    const measurements = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      width: innerWidth,
      height: document.documentElement.scrollHeight,
      windowHeight: innerHeight,
    }));
    assert.ok(
      measurements.scroll <= width,
      `overflow ${width} ${path}: ${measurements.scroll}`,
    );
    assert.ok(measurements.height > measurements.windowHeight, `scrollable ${path}`);
    const anchors = await page
      .locator("a[href]")
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")));
    for (const href of anchors) {
      if (href.startsWith("/") && !href.startsWith("//")) links.add(href.split("?")[0]);
      if (href.startsWith("#"))
        assert.equal(await page.locator(href).count(), 1, `anchor ${path} ${href}`);
    }
    if (width === 1440) {
      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      results.push({
        path,
        width,
        accessibility: axe.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      });
    } else results.push({ path, width, layout: "pass" });
    if (path === "/" && [1440, 390].includes(width)) {
      await page.screenshot({ path: `qa/home-${width}.png`, fullPage: true });
      if (width === 1440) await page.screenshot({ path: "qa/home-desktop.png" });
    }
  }
}
for (const path of links) {
  const response = await page.request.get(base + path);
  assert.equal(response.status(), 200, `link ${path}`);
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/");
assert.match(await page.locator("h1").innerText(), /No connection required\./);
await page.locator(".menu-toggle").click();
assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "true");
await page.keyboard.press("Escape");
assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"), "false");
await page.locator("#connection").click();
assert.equal(await page.locator("#connection").getAttribute("aria-checked"), "false");
await page.locator("#tap-demo").click();
assert.match(await page.locator("#demo-status").textContent(), /internet simulation off/);
assert.equal(await page.locator("#save-contact").isVisible(), true);
await page.locator("#qr-demo").click();
assert.match(await page.locator("#demo-status").textContent(), /the QR/);
const vcard = await page.request.get(base + "/sample-contact.vcf");
assert.match(await vcard.text(), /BEGIN:VCARD/);
await page.goto(base + "/nfc-business-cards/");
await page.locator("#card-name").fill("BULL3T");
await page.locator("#card-brand").fill("CARDISTRY");
assert.equal(await page.locator("#preview-name").textContent(), "BULL3T");
await page.locator('[data-theme="cream"]').click();
assert.equal(await page.locator("#preview-card").getAttribute("data-colour"), "cream");
await page.locator("#card-name").fill("<img src=x onerror=alert(1)>");
assert.equal(await page.locator("#preview-name img").count(), 0);
await page.goto(base + "/faq/");
await page.locator("#faq-search").fill("subscription");
assert.ok((await page.locator("[data-faq]:visible").count()) > 0);
await page.locator("[data-faq]:visible summary").first().click();
assert.equal(await page.locator("[data-faq]:visible").first().getAttribute("open"), "");
await page.locator("#faq-search").fill("nothing-matches-this-123");
assert.equal(await page.locator("#faq-empty").isVisible(), true);
await page.goto(base + "/contact/?item=non-nfc-card&design=support");
assert.equal(await page.locator("[name=type]").inputValue(), "Non-NFC PVC");
assert.equal(
  await page.locator("[name=design]").inputValue(),
  "Design support (quoted separately)",
);
await page.locator("button[type=submit]").click();
assert.equal(await page.locator("#email-preview").isVisible(), false);
await page.locator("[name=name]").fill("QA Test");
await page.locator("[name=email]").fill("qa@example.com");
await page.locator("[name=company]").fill("Test & Company");
await page.locator("[name=quantity]").fill("25");
await page.locator("[name=qr]").selectOption("Add a direct-data contact QR");
await page.locator("[name=brief]").fill("Double-sided team cards & artwork review");
await page.locator("input[type=checkbox]").check();
await page.locator("button[type=submit]").click();
const mail = decodeURIComponent(await page.locator("#email-link").getAttribute("href"));
for (const expected of [
  "mailto:sales@cardistry.co.za",
  "Non-NFC PVC",
  "Design support (quoted separately)",
  "Test & Company",
  "Quantity: 25",
  "Add a direct-data contact QR",
])
  assert.ok(mail.includes(expected), expected);
assert.match(await page.locator("#form-status").textContent(), /not sent/);
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(base + "/nfc-business-cards/");
await page.screenshot({ path: "qa/nfc-desktop.png", fullPage: true });
await page.emulateMedia({ reducedMotion: "reduce" });
assert.equal(
  await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
  "auto",
);
assert.equal(errors.length, 0, JSON.stringify(errors));
const violations = results.filter((r) => r.accessibility?.length);
const report = {
  routes: paths.length,
  responsiveChecks: results.length,
  internalTargets: links.size,
  jsErrors: errors,
  violations,
  interactions: "passed",
  results,
};
await writeFile("qa/report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify({ ...report, results: undefined }, null, 2));
await browser.close();
if (violations.length) process.exitCode = 1;
