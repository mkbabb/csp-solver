/** Which pose puts the `pencils` tape on a foot verb? Sweep the card's scroll range at 1440x900. */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const BASE = process.argv[2] || "http://127.0.0.1:4245";
const INTERACTIVE =
  'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])';

const CENSUS = (sel) => {
  const inter = [...document.querySelectorAll(sel)].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  });
  const out = [];
  for (const tape of document.querySelectorAll(".washi-label")) {
    const cs = getComputedStyle(tape);
    if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05) continue;
    const t = tape.getBoundingClientRect();
    if (!t.width || !t.height) continue;
    for (const el of inter) {
      const b = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(b.right, t.right) - Math.max(b.left, t.left));
      const h = Math.max(0, Math.min(b.bottom, t.bottom) - Math.max(b.top, t.top));
      if (w * h <= 0.5) continue;
      if (el.contains(tape)) continue;
      out.push({
        tape: (tape.textContent || "").trim().slice(0, 20),
        target: el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 24),
        px: +(w * h).toFixed(1),
        frac: +((w * h) / (b.width * b.height)).toFixed(3),
        tapePos: getComputedStyle(tape.closest(".washi-label") || tape).position,
        inFoot: !!el.closest("#card-foot, .card-foot, .action-bar"),
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
  await p.goto("/?size=3&difficulty=EASY&board=crit25");
  await p.waitForSelector(".ctrl-btn", { timeout: 30000 });
  await p.waitForTimeout(1000);
  for (const frac of [0, 0.25, 0.5, 0.75, 0.9, 1]) {
    await p.locator(".controls-card").evaluate((el, f) => {
      el.scrollTop = (el.scrollHeight - el.clientHeight) * f;
    }, frac);
    await p.waitForTimeout(400);
    const c = await p.evaluate(CENSUS, INTERACTIVE);
    console.log(`${name} frac=${frac} ${JSON.stringify(c)}`);
  }
  await ctx.close();
  await b.close();
}
