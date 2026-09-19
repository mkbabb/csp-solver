#!/usr/bin/env node
// T9-W7 pass 3 · CTRL-COST — THE THREE CITED CROPS. Numbers first; these are the three
// places a number cannot say it.
//   1  390×844 light — `starting over` at rest and ARMED, the same box, side by side.
//   2  the same pair in dark (#FF5C7C on bare card).
//   3  1280×800 light — the `writing` band's two rungs, the card at HEAD's width.
// Usage: node frames.mjs <base> <engine> <outdir>
import { chromium, webkit } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://127.0.0.1:4233";
const engine = process.argv[3] ?? "chromium";
const dir = process.argv[4] ?? "/tmp/frames";
mkdirSync(dir, { recursive: true });
const E = engine === "webkit" ? webkit : chromium;

async function shot(vp, theme, which) {
  const browser = await E.launch();
  const touch = vp[0] < 1024;
  const ctx = await browser.newContext({
    viewport: { width: vp[0], height: vp[1] },
    hasTouch: touch,
    deviceScaleFactor: 2,
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
  await page.goto(`${base}/`);
  await page.waitForSelector(".controls-card", { timeout: 25000, state: "attached" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  if (theme === "dark")
    await page.evaluate(() => document.documentElement.classList.add("dark"));
  // dirty with the sheet down, then raise it
  await page.evaluate(() => {
    const free = [...document.querySelectorAll("input.cell-native-input")].find(
      (i) => !i.readOnly && !i.disabled && !i.value,
    );
    free?.focus();
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(350);
  if (touch) {
    const tab = await page.$(
      ".drawer-tab, .drawer-handle, [aria-controls='controls-drawer']",
    );
    if (tab) await tab.click({ force: true }).catch(() => {});
    await page.waitForTimeout(900);
  }
  const target = which === "writing" ? "section.cost-band:nth-of-type(2)" : ".band-acts";
  await page.$eval(target, (el) => el.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(350);

  if (which === "writing") {
    const el = await page.$("section.cost-band:nth-of-type(2)");
    await el.screenshot({ path: `${dir}/ruler-rungs-1280-${engine}.png` });
  } else {
    const band = await page.$("section.cost-band:nth-of-type(3)");
    await band.screenshot({ path: `${dir}/ask-${vp[0]}-${theme}-rest-${engine}.png` });
    await page.click(".deal-face .act-verb");
    await page.waitForTimeout(450);
    await band.screenshot({ path: `${dir}/ask-${vp[0]}-${theme}-armed-${engine}.png` });
  }
  await browser.close();
}

await shot([390, 844], "light", "ask");
await shot([390, 844], "dark", "ask");
await shot([1280, 800], "light", "writing");
console.log(`frames → ${dir}`);
