#!/usr/bin/env node
// T9-W8 §8.3 — CAPTURE THE PROBE'S OWN ROW, so the fold can be proven before the phone runs.
//
// THIS IS NOT A DEVICE READING AND IT NEVER WILL BE. It drives Playwright WebKit (and
// chromium) at 390x844 dpr 3 against the cured preview, makes the gestures the owner will
// make, taps the readout's Copy button and banks the JSON line the readout produced. What it
// proves is the INSTRUMENT: every mark reaches the row, the row parses, and
// `A6/summarize-readiness.mjs` folds it beside the proxy rows with no second reader. The
// `cell` is rewritten to say which rig took it, because the probe stamps `device-<cache>` and
// a rig is not a device. M19 holds: no real Safari, no simulator, no screen taken over.
//
// RUN (from web/frontend, the cured preview already serving):
//   node <this file> --url http://127.0.0.1:4260 --engine webkit --out probe-rows.jsonl

import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { appendFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const _req = createRequire(pathToFileURL(process.cwd() + "/"));
const _pw = _req("playwright");
const { chromium, webkit } = _pw.default || _pw;

const arg = (k, d) => {
  const i = process.argv.indexOf(k);
  return i > 0 ? process.argv[i + 1] : d;
};
const URL_ = arg("--url", "http://127.0.0.1:4260");
const ENGINE = arg("--engine", "webkit");
const OUT = arg("--out", "probe-rows.jsonl");
const CACHE = arg("--cache", "cold");

const MOB = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
};

const browser = await (ENGINE === "chromium" ? chromium : webkit).launch();
const ctx = await browser.newContext(MOB);
const page = await ctx.newPage();
try {
  await page.goto(`${URL_}/?size=3&difficulty=EASY&__probe=1`, { waitUntil: "commit" });
  // The readout appears when the 8 s observation window closes. Nothing is tapped before it.
  await page.waitForSelector("[data-device-probe]", { timeout: 30000 });
  await page.getByText(CACHE === "warm" ? "Reload" : "First load", { exact: true }).click();

  // FOUR TAPS on the app's own toggle, three seconds apart, exactly as the run sheet asks.
  const toggle = page.locator(".sun-moon-toggle").first();
  for (let i = 0; i < 4; i++) {
    await toggle.click({ timeout: 10000 });
    await page.waitForTimeout(3000);
  }
  // THREE DRAWER GESTURES, if this regime has a tongue at all.
  const tab = page.locator(".drawer-tab").first();
  if ((await tab.count()) > 0 && (await tab.isVisible())) {
    for (let i = 0; i < 3; i++) {
      await tab.click({ timeout: 10000 });
      await page.waitForTimeout(1500);
    }
  }
  // ONE FOLD OUT AND ONE BACK IN, through the app's own affordances.
  const toGallery = page.locator(".logo-trigger").first();
  if ((await toGallery.count()) > 0 && (await toGallery.isVisible())) {
    await toGallery.click({ timeout: 10000 });
    await page.waitForTimeout(1800);
    const card = page.locator(".sketch-card, .game-card, .staging-band button").first();
    if ((await card.count()) > 0) {
      await card.click({ timeout: 10000 });
      await page.waitForTimeout(1800);
    }
  }

  await page.locator("[data-device-probe-handle]").click().catch(() => {});
  await page.getByText("Copy", { exact: true }).click();
  const text = await page.locator("[data-device-probe] pre").textContent();
  const row = JSON.parse(text);
  row.capturedBy = `playwright ${ENGINE} at 390x844 dpr 3, NOT a device and NOT Safari`;
  row.cell = `probe-${ENGINE === "chromium" ? "cr" : "wk"}-mob-${CACHE}`;
  row.load = execSync("sysctl -n vm.loadavg").toString().trim();
  writeFileSync(OUT, "");
  appendFileSync(OUT, JSON.stringify(row) + "\n");
  process.stderr.write(`[8.3] captured ${Object.keys(row).length} keys into ${OUT}\n`);
} finally {
  await ctx.close();
  await browser.close();
}
