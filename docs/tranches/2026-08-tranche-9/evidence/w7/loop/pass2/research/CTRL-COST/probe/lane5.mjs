// T9-W7 pass 2 · CTRL-COST probe 5 — the two small censuses the spec needs:
//   the card's focusable controls (the `--ring-ink` spend list, §3.5 graft), and the `no`
//   answer's own hit box inside the armed face (the tap floor asks about CONTROLS; `no` is a
//   region of one, and a thumb still has to land on it).
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4235/";
const out = {};
for (const engine of ["chromium", "webkit"]) {
  const BT = engine === "webkit" ? webkit : chromium;
  const b = await BT.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: engine === "chromium" ? true : undefined, colorScheme: "light", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForTimeout(1200);
  await page.locator(".drawer-tab").first().click({ force: true });
  await page.waitForTimeout(1300);
  const rec = {};
  rec.controls = await page.evaluate(() => {
    const card = document.querySelector(".controls-card");
    const sel = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const all = [...card.querySelectorAll(sel)].filter((e) => !e.hasAttribute("disabled"));
    const byRing = { authored: [], ua: [] };
    for (const e of all) {
      const face = e.querySelector(":scope > .act-face");
      (face ? byRing.authored : byRing.ua).push((e.getAttribute("aria-label") || e.textContent.trim() || e.className).toString().slice(0, 26));
    }
    return { total: all.length, authoredRing: byRing.authored.length, uaRing: byRing.ua.length, uaList: byRing.ua };
  });
  // arm and read the `no` box
  const fill = page.locator(".controls-card button", { hasText: /^fill$/ }).first();
  await page.evaluate(() => [...document.querySelectorAll(".controls-card button")].find((x) => x.textContent.trim() === "fill")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(250);
  try { await fill.click({ force: true, timeout: 5000 }); } catch {}
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.querySelector(".deal-btn")?.scrollIntoView({ block: "center" }));
  await page.waitForTimeout(250);
  try { await page.locator(".deal-btn").first().click({ force: true, timeout: 5000 }); } catch {}
  await page.waitForTimeout(500);
  rec.answer = await page.evaluate(() => {
    const b = document.querySelector(".deal-btn");
    const no = b.querySelector(".act-answer");
    const r = no.getBoundingClientRect(), br = b.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const hit = document.elementFromPoint(cx, cy);
    return {
      armed: !!b.querySelector(".act-word.is-armed.is-shown"),
      noBox: [+r.width.toFixed(2), +r.height.toFixed(2)],
      buttonBox: [+br.width.toFixed(2), +br.height.toFixed(2)],
      noCentreHits: hit ? (hit.className || hit.tagName).toString().slice(0, 30) : null,
      noFraction: +((r.width * r.height) / (br.width * br.height)).toFixed(3),
      wordBox: (() => { const w = b.querySelector(".act-word.is-armed"); const wr = w.getBoundingClientRect(); return [+wr.width.toFixed(2), +wr.height.toFixed(2)]; })(),
    };
  });
  out[engine] = rec;
  await b.close();
}
writeFileSync(new URL("../readings/lane5.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1));
