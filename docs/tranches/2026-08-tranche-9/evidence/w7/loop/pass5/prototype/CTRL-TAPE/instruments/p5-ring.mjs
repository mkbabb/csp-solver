/**
 * T9-W7 pass 5 · CTRL-TAPE — THE RING ON FOUR GROUNDS, PAINTED (charter row 9; registry §2.12).
 *
 *   node p5-ring.mjs <out.json> <baseURL>
 *
 * DISCOVERY: every focusable in the case is classified by the ground its ring ABUTS — `tape`
 * (the ring's box crosses a visible washi tape), `foot` (inside `#card-foot`), `well` (inside a
 * `.tray-well`), else `card` — and the first of each class is taken. A ground no control's ring
 * abuts is REPORTED absent, never substituted.
 * THE FOCUS IS A KEYBOARD FOCUS: Tab (WebKit: Alt+Tab, the key that reaches a `<button>` there)
 * until `activeElement` is the target; if 80 presses do not reach it, one press sets the modality
 * and a scripted focus lands the pose, and the row says `route: script`.
 * THE READ IS SETTLED AND DIFFERENTIAL: `outline-color` polled to rest (two equal reads 80 ms
 * apart — Tailwind's `transition-colors` lists it), then the element photographed focused and
 * blurred at DPR 2; the ring is what changed, its ground the same pixel blurred (ring-OFF
 * subtraction), statistic = the CORE MEDIAN with the sensitivity row (`coreContrast`).
 */
import { writeFileSync } from "node:fs";
import { ENGINES, CELLS, open, differential, coreContrast, givens } from "./p5-lib.mjs";

const OUT = process.argv[2];
const BASE = process.argv[3];

const DISCOVER = () => {
  const tapes = [...document.querySelectorAll(".washi-tag, .washi-label")].filter((t) => {
    const cs = getComputedStyle(t);
    const b = t.getBoundingClientRect();
    return cs.display !== "none" && cs.visibility !== "hidden" && +cs.opacity > 0.5 && b.width > 0;
  }).map((t) => t.getBoundingClientRect());
  const root = document.querySelector(".drawer-case");
  const seen = {};
  let n = 0;
  for (const el of root.querySelectorAll('button, [role="tab"], [tabindex="0"], input, a[href]')) {
    const b = el.getBoundingClientRect();
    if (b.width === 0 || el.closest("[inert]") || el.disabled) continue;
    const vis = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    if (!vis || !(el === vis || el.contains(vis))) continue;
    const ring = { l: b.left - 5, t: b.top - 5, r: b.right + 5, b: b.bottom + 5 };
    const onTape = tapes.some((t) => ring.l < t.right && ring.r > t.left && ring.t < t.bottom && ring.b > t.top);
    const ground = onTape ? "tape" : el.closest("#card-foot") ? "foot" : el.closest(".tray-well") ? "well" : "card";
    if (seen[ground]) continue;
    el.setAttribute("data-ring-probe", ground);
    seen[ground] = { label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 30), tag: el.tagName };
    n++;
  }
  return seen;
};

const out = { base: BASE, rows: [] };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const key of ["rail1440", "dock390"]) {
    for (const theme of ["light", "dark"]) {
      const { ctx, page } = await open(br, BASE, CELLS[key], { theme, dpr: 2 });
      await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
      const found = await page.evaluate(DISCOVER);
      const row = { eng, cell: key, theme, givens: await givens(page), found, grounds: {} };
      for (const ground of ["well", "card", "foot", "tape"]) {
        if (!found[ground]) { row.grounds[ground] = "ABSENT (no focusable ring abuts this ground here)"; continue; }
        const sel = `[data-ring-probe="${ground}"]`;
        await page.evaluate(() => (document.activeElement)?.blur());
        await page.locator(sel).scrollIntoViewIfNeeded();
        let presses = 0, route = null;
        const key = eng === "webkit" ? "Alt+Tab" : "Tab";
        for (let i = 1; i <= 80; i++) {
          await page.keyboard.press(key);
          if (await page.evaluate((s) => document.activeElement?.matches(s), sel)) { presses = i; route = "keyboard"; break; }
        }
        if (!route) { await page.keyboard.press(key); await page.locator(sel).focus(); route = "script"; }
        const settle = async () => {
          let last = null;
          for (let i = 0; i < 40; i++) {
            const v = await page.evaluate((s) => { const e = document.querySelector(s); const cs = getComputedStyle(e); return `${cs.outlineStyle}|${cs.outlineColor}|${e.matches(":focus-visible")}`; }, sel);
            if (v === last) return v;
            last = v;
            await page.waitForTimeout(80);
          }
          return last;
        };
        const pose = await settle();
        const b = await page.locator(sel).boundingBox();
        const clip = { x: Math.max(0, Math.floor(b.x - 8)), y: Math.max(0, Math.floor(b.y - 8)), width: Math.ceil(b.width + 16), height: Math.ceil(b.height + 16) };
        const d = await differential(page, clip, `${sel} { outline: none !important }`);
        row.grounds[ground] = { ...found[ground], route, presses, pose, contrast: coreContrast(d) };
      }
      out.rows.push(row);
      console.log(eng, key, theme, JSON.stringify(Object.fromEntries(Object.entries(row.grounds).map(([g, v]) => [g, typeof v === "string" ? v : [v.label, v.route, v.pose, v.contrast?.median, v.contrast?.p30, v.contrast?.fracUnder, v.contrast?.sens?.["90%"]?.worstCol]]))));
      await ctx.close();
    }
  }
  await br.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
