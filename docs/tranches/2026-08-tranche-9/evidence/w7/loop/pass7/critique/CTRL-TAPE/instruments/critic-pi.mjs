// critic π: whole-DOM outside the controls case + the board, keyed by semantic ancestry (tag path + nearest id/aria), computed paint + rect.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const PAYLOAD = "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
const [A, B] = process.argv.slice(2);
const CELLS = [["rail1440", 1440, 900, false], ["dock390shut", 390, 844, true], ["coarse1280", 1280, 800, true]];
async function census(browser, base, [n, w, h, touch], theme) {
  const ctx = await browser.newContext({ baseURL: base, viewport: { width: w, height: h }, hasTouch: touch, colorScheme: theme, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage(); await page.goto("/?board=" + PAYLOAD);
  await page.waitForSelector(".sudoku-cell input", { timeout: 60000 }); await page.waitForTimeout(1200);
  const out = await page.evaluate(() => {
    const skip = (e) => e.closest(".drawer-case, #controls-drawer, .controls-card, #card-foot, .drawer-tab, .quick-frame, #quick-set, #fold-tools");
    const key = (e) => { const p = []; let x = e; while (x && x !== document.body) { let s = x.tagName.toLowerCase(); if (x.id) s += "#" + x.id; else if (x.getAttribute("aria-label")) s += `[${x.getAttribute("aria-label").slice(0, 18)}]`; p.unshift(s); x = x.parentElement; } return p.join(">"); };
    const m = new Map();
    for (const e of document.body.querySelectorAll("*")) {
      if (skip(e)) continue;
      const cs = getComputedStyle(e); if (cs.display === "none") continue;
      const r = e.getBoundingClientRect();
      let k = key(e); let i = 0; while (m.has(k + "#" + i)) i++;
      m.set(k + "#" + i, [Math.round(r.x * 10) / 10, Math.round(r.y * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10, cs.color, cs.backgroundColor, cs.fill, cs.stroke, cs.opacity, cs.filter, cs.transform, cs.visibility, e.getAttribute("d")?.length ?? ""].join("|"));
    }
    return [...m.entries()];
  });
  const idx = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
  const givens = await page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((e, i) => [i, e.getAttribute("aria-label") || "", e.value]).filter(([, l]) => /given/i.test(l)).map(([i, , v]) => `${i}:${v}`).join(","));
  await ctx.close();
  return { m: new Map(out), idx, givens };
}
function cmp(x, y) { let tag = 0, rect = 0, paint = 0; const ex = []; for (const [k, v] of x.m) { if (!y.m.has(k)) { tag++; if (ex.length < 4) ex.push("missing " + k.slice(-80)); continue; } const a = v.split("|"), b = y.m.get(k).split("|"); if (a.slice(0, 4).join() !== b.slice(0, 4).join()) { rect++; if (ex.length < 4) ex.push("rect " + k.slice(-70) + " " + a.slice(0, 4) + " vs " + b.slice(0, 4)); } if (a.slice(4).join() !== b.slice(4).join()) { paint++; if (ex.length < 4) ex.push("paint " + k.slice(-70) + " " + a.slice(4).join("|").slice(0, 80) + " vs " + b.slice(4).join("|").slice(0, 80)); } } for (const k of y.m.keys()) if (!x.m.has(k)) tag++; return { n: x.m.size, tag, rect, paint, ex }; }
for (const [en, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch();
  for (const cell of CELLS) for (const theme of ["light", "dark"]) {
    const p = await census(b, A, cell, theme), c1 = await census(b, B, cell, theme), c2 = await census(b, B, cell, theme);
    console.log(JSON.stringify({ en, cell: cell[0], theme, proto: p.idx, ctl: c1.idx, givensEq: p.givens === c1.givens, givens: p.givens, protoVsCtl: cmp(p, c1), ctlVsCtl: cmp(c1, c2) }));
  }
  await b.close();
}
