import { chromium, webkit } from "./p7-common.mjs";
import { readFileSync } from "node:fs";
const deal = readFileSync("hard1.txt", "utf8").split("\n")[1].trim(); const E = { chromium, webkit }[process.env.E || "chromium"];
for (let run = 0; run < +(process.env.RUNS || 3); run++) {
const br = await E.launch(); const ctx = await br.newContext({ viewport: { width: 393, height: 699 }, deviceScaleFactor: 2, hasTouch: true, reducedMotion: "reduce" });
const page = await ctx.newPage(); await page.goto((process.env.BASE || "http://127.0.0.1:4237") + "/" + deal); await page.waitForSelector(".sudoku-cell input"); await page.waitForTimeout(1500);
const rows = [];
for (let k = 0; k < 8; k++) {
  const pre = await page.evaluate(() => { const i = Array.from(document.querySelectorAll(".sudoku-cell input")).findIndex((x) => !x.value); const el = document.querySelectorAll(".sudoku-cell input")[i]; el?.focus(); const b = document.querySelector('[aria-label*="Hint" i]:not([disabled])'); b?.click(); return [i, b?.getAttribute("aria-label")]; });
  await page.waitForTimeout(700);
  rows.push(await page.evaluate((pre) => ({ k: pre, vt: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuetext"), meta: document.querySelector(".margin-note-meta")?.textContent.trim() ?? null, voice: document.querySelector(".margin-note")?.textContent.trim().slice(0, 50), filled: Array.from(document.querySelectorAll(".sudoku-cell input")).filter((x) => x.value).length, url: location.search.slice(0, 20) }), pre));
}
console.log(`run ${run}`); rows.forEach((r) => console.log(JSON.stringify(r)));
await br.close(); }
