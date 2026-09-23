// CTRL-FACE pass 5 — the card's content height and scroll range per cell, three arms, both engines,
// ONE encoded board (the sudoku payload below; givens read back and compared across arms).
// usage: node card-deltas.mjs <out.json>   (ARMS env: name=url,...)
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const PAYLOAD = "?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const ARMS = Object.fromEntries((process.env.ARMS || "proto=http://127.0.0.1:4236,control=http://127.0.0.1:4235,mainhead=http://127.0.0.1:4240").split(",").map((a) => a.split("=")));
const CELLS = [
  { n: "320x568-coarse", w: 320, h: 568, t: true },
  { n: "390x844-coarse", w: 390, h: 844, t: true },
  { n: "768x1024-coarse", w: 768, h: 1024, t: true },
  { n: "1280x800-fine", w: 1280, h: 800, t: false },
  { n: "1280x800-coarse", w: 1280, h: 800, t: true },
];
const out = [];
for (const eng of ["chromium", "webkit"]) {
  const b = await pw[eng].launch();
  for (const c of CELLS) for (const [arm, base] of Object.entries(ARMS)) {
    const ctx = await b.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: c.t, isMobile: c.t && c.w < 1024, deviceScaleFactor: 2, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    const rec = { eng, cell: c.n, arm };
    try {
      await p.goto(base + "/" + PAYLOAD);
      await p.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
      await p.waitForTimeout(500);
      const tab = p.locator(".drawer-tab");
      if ((await tab.count()) && !(await p.locator(".controls-card").first().isVisible())) { await (c.t ? tab.tap() : tab.click()); }
      let last = "", same = 0; const t0 = Date.now();
      while (Date.now() - t0 < 5000) { const s = await p.evaluate(() => JSON.stringify(document.querySelector(".controls-card")?.getBoundingClientRect())); if (s === last) { if (++same >= 3) break; } else same = 0; last = s; await p.waitForTimeout(120); }
      Object.assign(rec, await p.evaluate(() => {
        const card = [...document.querySelectorAll(".controls-card")].find((x) => x.getClientRects().length);
        const wrap = card?.querySelector(".control-panel-wrap");
        const zone = card?.querySelector(".new-game-zone");
        return {
          boardKept: new URLSearchParams(location.search).has("board"),
          givens: [...document.querySelectorAll('[role="gridcell"] input')].map((i) => i.value || "0").join(""),
          wrapClientH: wrap?.clientHeight ?? null,
          wrapScrollH: wrap?.scrollHeight ?? null,
          cardClientH: card?.clientHeight ?? null,
          cardScrollH: card?.scrollHeight ?? null,
          cardW: card ? Math.round(card.getBoundingClientRect().width * 100) / 100 : null,
          zoneH: zone ? Math.round(zone.getBoundingClientRect().height * 100) / 100 : null,
          dealRowH: zone?.querySelector(".deal-row") ? Math.round(zone.querySelector(".deal-row").getBoundingClientRect().height * 100) / 100 : null,
          boardX: Math.round((document.querySelector(".board-group")?.getBoundingClientRect().x ?? NaN) * 100) / 100,
        };
      }));
    } catch (e) { rec.error = String(e).slice(0, 300); }
    out.push(rec);
    await ctx.close();
  }
  await b.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
const by = (e, c, a) => out.find((r) => r.eng === e && r.cell === c && r.arm === a) ?? {};
for (const e of ["chromium", "webkit"]) for (const c of CELLS) {
  const P = by(e, c.n, "proto"), C = by(e, c.n, "control"), M = by(e, c.n, "mainhead");
  const d = (k) => (P[k] != null && C[k] != null ? +(P[k] - C[k]).toFixed(2) : "—");
  console.log(`${e} ${c.n}: wrapClientH ${P.wrapClientH}/${C.wrapClientH}/${M.wrapClientH} (Δ ${d("wrapClientH")}) · cardScrollH ${P.cardScrollH}/${C.cardScrollH}/${M.cardScrollH} (Δ ${d("cardScrollH")}) · zone ${P.zoneH}/${C.zoneH}/${M.zoneH} · dealRow ${P.dealRowH}/${C.dealRowH} · cardW ${P.cardW}/${C.cardW} · boardX ${P.boardX}/${C.boardX} · givens same ${P.givens === C.givens && C.givens === M.givens} kept ${P.boardKept}/${C.boardKept}/${M.boardKept}${P.error || C.error || M.error ? " ERR " + (P.error || C.error || M.error) : ""}`);
}
