/** Is the §2.5 red PAINT or an unclipped rect? elementFromPoint at each overlap's centre,
 *  plus the tape's clip against the scrollport. */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const BASE = process.argv[2] || "http://127.0.0.1:4245";
const PROBE = () => {
  const card = document.querySelector(".controls-card");
  const cr = card.getBoundingClientRect();
  const clipTop = cr.top + card.clientTop;
  const clipBottom = clipTop + card.clientHeight;
  const out = [];
  const inter = [...document.querySelectorAll('button, [role="button"]')].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  });
  for (const tape of document.querySelectorAll(".washi-label")) {
    const t = tape.getBoundingClientRect();
    if (!t.width || !t.height) continue;
    for (const el of inter) {
      if (el.contains(tape)) continue;
      const b = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(b.right, t.right) - Math.max(b.left, t.left));
      const h = Math.max(0, Math.min(b.bottom, t.bottom) - Math.max(b.top, t.top));
      if (w * h <= 0.5) continue;
      const cx = (Math.max(b.left, t.left) + Math.min(b.right, t.right)) / 2;
      const cy = (Math.max(b.top, t.top) + Math.min(b.bottom, t.bottom)) / 2;
      const hit = document.elementFromPoint(cx, cy);
      // how much of the tape survives the card's own scrollport clip?
      const vt = Math.max(t.top, clipTop),
        vb = Math.min(t.bottom, clipBottom);
      out.push({
        tape: (tape.textContent || "").trim().slice(0, 12),
        target: el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 20),
        px: +(w * h).toFixed(1),
        tapeVisibleH: +Math.max(0, vb - vt).toFixed(2),
        tapeH: +t.height.toFixed(2),
        hit: hit ? `${hit.tagName}.${String(hit.className).slice(0, 26)}` : "none",
        hitIsTape: !!(hit && (hit === tape || tape.contains(hit))),
      });
    }
  }
  return out;
};
for (const [name, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await eng.launch();
  const ctx = await b.newContext({ baseURL: BASE, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto("/?size=3&difficulty=EASY&board=crit25p");
  await p.waitForSelector(".ctrl-btn", { timeout: 30000 });
  await p.waitForTimeout(1000);
  for (const frac of [0, 0.25, 1]) {
    await p.locator(".controls-card").evaluate((el, f) => {
      el.scrollTop = (el.scrollHeight - el.clientHeight) * f;
    }, frac);
    await p.waitForTimeout(400);
    console.log(`${name} frac=${frac} ${JSON.stringify(await p.evaluate(PROBE))}`);
  }
  await ctx.close();
  await b.close();
}
