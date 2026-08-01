/**
 * validate-headless.mjs — a DRIVER-ONLY smoke of probe.js. Playwright WebKit is NOT a
 * source of numbers here (the estate verdict: Playwright WebKit ≠ real Safari); it exists
 * only to prove the scenario engine's selectors/gestures fire before we spend real-Safari runs.
 *
 *   node validate-headless.mjs <runId> [scenarios]      · PORT=<n> to reach a rig elsewhere
 */
import { webkit } from "playwright";
import process from "node:process";

const runId = process.argv[2] || `hl-${Date.now()}`;
const scen =
  process.argv[3] || "idle3s,deal,undoBurst,solveCelebration,galleryGlide,themeToggle";
const port = Number(process.env.PORT || 4894);
const url = `http://localhost:${port}/?__run=${runId}&__scenarios=${scen}`;

const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => {
  if (m.type() === "error") console.log("[console.error]", m.text().slice(0, 200));
});
page.on("pageerror", (e) => console.log("[pageerror]", String(e).slice(0, 300)));
console.log("driving", url);
await page.goto(url, { waitUntil: "load" });
const t0 = Date.now();
while (Date.now() - t0 < 150000) {
  const title = await page.title().catch(() => "");
  if (title.startsWith("PROBE DONE")) break;
  await page.waitForTimeout(1500);
}
await browser.close();
console.log("headless drive finished for", runId);
