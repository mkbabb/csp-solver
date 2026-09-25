// ACC-SIX pass-7 CRITIC: the landed spec's press-3 pose, replayed. count-yield.spec.ts injects the widest voice as a
// hand-made `.margin-note-ink` span, then presses the product's hint twice. Does the product's own line REPLACE the
// injected span, or sit beside it? Read the ink-span count, the voice text and the strip at each pose. 393x699 coarse, P16.
import { chromium, webkit, BOARD16 } from "./p7-common.mjs";
const base = process.env.BASE;
for (const [e, L] of [["chromium", chromium], ["webkit", webkit]]) {
  const br = await L.launch(); const ctx = await br.newContext({ viewport: { width: 393, height: 699 }, hasTouch: true, reducedMotion: "reduce" });
  const page = await ctx.newPage(); await page.goto(base + "/" + BOARD16); await page.waitForSelector(".sudoku-cell", { timeout: 90000 }); await page.waitForTimeout(1500);
  const hint = () => page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click());
  const snap = (n) => page.evaluate((n) => { const p = document.querySelector(".margin-note"); return `${n}: ink spans ${p?.querySelectorAll(".margin-note-ink").length} · voice "${p?.textContent?.trim()}" · strip ${Math.round(document.querySelector(".board-margin").getBoundingClientRect().height * 100) / 100}`; }, n);
  const out = [];
  for (let k = 0; k < 2; k++) { await hint(); await page.waitForTimeout(700); }
  out.push(await snap("laid"));
  await page.evaluate((line) => { const p = document.querySelector(".margin-note"); p.querySelectorAll(".margin-note-ink").forEach((x) => x.remove()); const ink = document.createElement("span"); ink.className = "margin-note-ink"; for (const a of p.getAttributeNames()) if (a.startsWith("data-v-")) ink.setAttribute(a, ""); ink.textContent = line; p.appendChild(ink); }, "G goes nowhere else in this column");
  await page.waitForTimeout(700); out.push(await snap("widest(injected)"));
  for (let k = 3; k <= 4; k++) { await hint(); await page.waitForTimeout(700); out.push(await snap("press" + k)); }
  console.log(e, "·", out.join(" | ")); await br.close();
}
