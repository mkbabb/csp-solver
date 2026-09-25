// m12-pair.mjs — CTRL-FACE pass 7, charter row 10 / INTAKE-22 §7 row 12: the declared trades as ONE pair on
// ONE payload (control 74a2b5d9 | tree), chromium · light · DPR 1. Row a: Deal's hit box at 1280×800 fine
// (the box outlined in magenta, its height printed); row b: the 430×932 coarse dock sheet open (top of the
// sheet). Prints the numbers; writes one composite PNG (quantized by the caller).
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright"); const sharp = require("sharp");
const [ctlBase, treeBase, out] = process.argv.slice(2);
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await pw.chromium.launch();
const shoot = async (base, label) => {
  const r = {};
  { // row a: Deal's fine hit box
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
    const p = await ctx.newPage(); await p.goto(`${base}/?${Q}`); await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await p.waitForTimeout(1500);
    const box = await p.evaluate(() => { const c = [...document.querySelectorAll(".controls-card")].find((x) => x.getClientRects().length); c.scrollTop = 0; const d = c.querySelector(".deal-btn"); d.scrollIntoView({ block: "center" }); const q = d.getBoundingClientRect(); const o = document.createElement("div"); o.style.cssText = `position:fixed;left:${q.left}px;top:${q.top}px;width:${q.width}px;height:${q.height}px;outline:2px solid #e0f;pointer-events:none;z-index:99999`; document.body.appendChild(o); return { x: q.left, y: q.top, w: q.width, h: q.height }; });
    const givens = await p.evaluate(() => [...document.querySelectorAll('[role="gridcell"] input')].map((i) => i.value || "0").join("").slice(0, 18));
    r.deal = { ...box, givens };
    r.a = await p.screenshot({ clip: { x: Math.max(0, box.x - 40), y: Math.max(0, box.y - 50), width: 300, height: 170 } });
    await ctx.close();
  }
  { // row b: the 430×932 dock sheet open
    const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
    const p = await ctx.newPage(); await p.goto(`${base}/?${Q}`); await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await p.waitForTimeout(1200);
    await p.locator(".drawer-tab").first().tap(); await p.waitForTimeout(900);
    r.sheet = await p.evaluate(() => { const c = [...document.querySelectorAll(".drawer-case")].find((x) => x.getClientRects().length); const t = document.querySelector(".drawer-tab").getBoundingClientRect(); const q = c.getBoundingClientRect(); return { caseTop: +q.top.toFixed(2), caseH: +q.height.toFixed(2), tabTop: +t.top.toFixed(2) }; });
    r.b = await p.screenshot({ clip: { x: 0, y: Math.max(0, r.sheet.tabTop - 20), width: 430, height: 260 } });
    await ctx.close();
  }
  console.log(JSON.stringify({ label, deal: r.deal, sheet: r.sheet }));
  return r;
};
const c = await shoot(ctlBase, "control 74a2b5d9"); const t = await shoot(treeBase, "tree");
const W = 430 * 2 + 12, H = 170 + 260 + 12;
const tile = (buf, left, top) => ({ input: buf, left, top });
await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } })
  .composite([tile(c.a, 0, 0), tile(t.a, 442, 0), tile(c.b, 0, 182), tile(t.b, 442, 182)]).png().toFile(out);
await b.close();
