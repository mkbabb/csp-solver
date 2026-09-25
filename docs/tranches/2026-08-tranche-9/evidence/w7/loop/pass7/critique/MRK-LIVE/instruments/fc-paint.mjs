// Forced colours: does the deck's active card / a staging face PAINT an outline? Photograph the host's
// box +10px focused vs blurred and count pixels that moved (> 40 in RGB L1). Prints the computed outline
// properties beside, so a property-only green can be compared with its paint.
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("@playwright/test");
const url = process.argv[2];
const moved = async (page, a, b) => page.evaluate(async ({ a, b }) => {
  const load = async (s) => { const i = new Image(); i.src = "data:image/png;base64," + s; await i.decode(); const c = document.createElement("canvas"); c.width = i.width; c.height = i.height; const g = c.getContext("2d"); g.drawImage(i, 0, 0); return g.getImageData(0, 0, i.width, i.height).data; };
  const A = await load(a), B = await load(b); let n = 0;
  for (let k = 0; k < A.length; k += 4) if (Math.abs(A[k] - B[k]) + Math.abs(A[k + 1] - B[k + 1]) + Math.abs(A[k + 2] - B[k + 2]) > 40) n++;
  return n;
}, { a: a.toString("base64"), b: b.toString("base64") });
for (const e of ["chromium", "webkit"]) {
  const br = await pw[e].launch(); const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } }); const p = await ctx.newPage();
  await p.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await p.goto(url + "/?game=sudoku"); await p.waitForSelector(".board-shell .game-cell", { timeout: 60000 }); await p.waitForTimeout(1200);
  await p.evaluate(() => document.querySelector("button.logo-trigger")?.click());
  await p.waitForSelector(".gallery-viewport", { timeout: 20000 }); await p.waitForTimeout(1500);
  const out = {};
  for (const [label, sel] of [["deck card", ".gallery-viewport"], ["staging face", ".staging-btn:not([disabled])"]]) {
    await p.keyboard.press("Tab");
    await p.evaluate((s) => document.querySelector(s)?.focus(), sel); await p.waitForTimeout(700);
    const info = await p.evaluate((s) => {
      const el = document.querySelector(s); const id = el.getAttribute("aria-activedescendant"); const t = (id && document.getElementById(id)) || el;
      const r = t.getBoundingClientRect(); const cs = getComputedStyle(t);
      return { fv: el.matches(":focus-visible"), style: cs.outlineStyle, width: cs.outlineWidth, color: cs.outlineColor, clip: cs.clipPath, box: { x: Math.max(0, Math.floor(r.x - 10)), y: Math.max(0, Math.floor(r.y - 10)), width: Math.ceil(r.width + 20), height: Math.ceil(r.height + 20) } };
    }, sel);
    const on = await p.screenshot({ clip: info.box });
    await p.evaluate(() => document.activeElement?.blur()); await p.waitForTimeout(500);
    const off = await p.screenshot({ clip: info.box });
    out[label] = { ...info, box: undefined, paintedPx: await moved(p, on, off) };
  }
  console.log(e, JSON.stringify(out));
  await br.close();
}
