// run: cd web/frontend && node ../../docs/tranches/.../refute/A4/tongue-visible.mjs --engine chromium --port 4257 --out raw/x.jsonl
//
// REFUTER A4 · Lane A4's headline is a 459.16px single-frame jump of `.drawer-tab` on the mobile
// close. The lane's own instrument samples only getBoundingClientRect + computed `visibility`.
// A jump is a DEFECT only if the eye can see it. This samples, once per rAF across the gesture:
//   - the tongue's rect, computed opacity / visibility / z-index
//   - HIT-TESTING at the tongue's own centre (document.elementFromPoint): is the tongue (or a
//     descendant of it) the TOPMOST painted thing there, or is something else over it?
//   - the same at the four points 12px inside each of the tongue's corners, to catch partial
//     occlusion (the shut pose is documented as "tucked 6px under the paper", z-index -1).
// So: occludedFrames / visibleFrames across the window, and the first frame at which the tongue
// becomes topmost after the berth swap.
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createRequire } from "node:module";
const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/";
const pw = createRequire(FE + "package.json")("playwright");
const argv = process.argv.slice(2);
const arg = (k, d) => (argv.indexOf("--" + k) === -1 ? d : argv[argv.indexOf("--" + k) + 1]);
const ENGINE = arg("engine", "chromium");
const PORT = arg("port", "4257");
const OUT = arg("out", null);
const CYCLES = Number(arg("cycles", "2"));
const V = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };

const isVisible = `(el) => { if (!el) return false; const r = el.getClientRects(); if (!r.length) return false; const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.01; }`;
const BOARD_READY = `async () => {
  const vis = ${isVisible};
  const t0 = performance.now();
  while (performance.now() - t0 < 30000) {
    const bg = document.querySelector(".board-group");
    const c = document.querySelector(".board-cells .game-cell");
    if (vis(bg) && c && c.getBoundingClientRect().width > 0 && vis(c)) {
      await new Promise((r) => requestAnimationFrame(r));
      return performance.now();
    }
    await new Promise((r) => setTimeout(r, 40));
  }
  throw new Error("board-ready timeout");
}`;

const SAMPLE = `async (ms) => {
  const vis = ${isVisible};
  const out = [];
  const t0 = performance.now();
  const el = Array.from(document.querySelectorAll(".drawer-tab")).filter(vis)[0];
  let clicked = false;
  const hit = (tab, x, y) => {
    if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return "offscreen";
    const top = document.elementFromPoint(x, y);
    if (!top) return "none";
    return tab.contains(top) || top === tab ? "tongue" : (top.className && String(top.className).slice(0, 40)) || top.tagName;
  };
  await new Promise((done) => {
    (function tick(t) {
      const tab = document.querySelector(".drawer-tab");
      const row = { t: +(t - t0).toFixed(2) };
      if (tab) {
        const r = tab.getBoundingClientRect();
        const cs = getComputedStyle(tab);
        row.rect = [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)];
        row.op = cs.opacity; row.visi = cs.visibility; row.z = cs.zIndex;
        row.parent = tab.parentElement?.id ?? null;
        row.hits = [
          hit(tab, r.x + r.width / 2, r.y + r.height / 2),
          hit(tab, r.x + 12, r.y + 12),
          hit(tab, r.x + r.width - 12, r.y + 12),
          hit(tab, r.x + 12, r.y + r.height - 12),
          hit(tab, r.x + r.width - 12, r.y + r.height - 12),
        ];
        row.nTongue = row.hits.filter((h) => h === "tongue").length;
      }
      out.push(row);
      if (!clicked) { clicked = true; el.click(); }
      if (t - t0 < ms) requestAnimationFrame(tick); else done();
    })(performance.now());
  });
  return out;
}`;

const browser = await pw[ENGINE].launch();
const ctx = await browser.newContext(V);
const page = await ctx.newPage();
await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`, { waitUntil: "load" });
await page.evaluate(`(${BOARD_READY})()`);
await page.waitForTimeout(400);

for (let c = 0; c < CYCLES; c++) {
  for (const phase of ["open", "close"]) {
    const rows = await page.evaluate(`(${SAMPLE})(760)`);
    let berthAt = null;
    for (let i = 1; i < rows.length; i++) if (rows[i - 1].parent !== rows[i].parent) berthAt = i;
    const post = berthAt == null ? rows : rows.slice(berthAt);
    const firstTopmost = post.findIndex((r) => r.nTongue === 5);
    const row = {
      lane: "A4-REFUTE", probe: "tongue-visible", engine: ENGINE, regime: "mobile", cpu: "1x",
      network: "unthrottled, cache as-loaded", cycle: c, phase, frames: rows.length,
      berthFrame: berthAt,
      rectBefore: berthAt ? rows[berthAt - 1].rect : null,
      rectAfter: berthAt ? rows[berthAt].rect : null,
      opBefore: berthAt ? rows[berthAt - 1].op : null,
      opAfter: berthAt ? rows[berthAt].op : null,
      zBefore: berthAt ? rows[berthAt - 1].z : null,
      zAfter: berthAt ? rows[berthAt].z : null,
      hitsBefore: berthAt ? rows[berthAt - 1].hits : null,
      hitsAfter: berthAt ? rows[berthAt].hits : null,
      // across the whole post-swap window: how many frames was the tongue fully topmost?
      postFrames: post.length,
      fullyVisibleFrames: post.filter((r) => r.nTongue === 5).length,
      whollyOccludedFrames: post.filter((r) => r.nTongue === 0).length,
      framesToFullyTopmost: firstTopmost,
      occluderCensus: Object.entries(post.flatMap((r) => r.hits).reduce((a, h) => ((a[h] = (a[h] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]).slice(0, 5),
      tainted: false,
    };
    console.log(JSON.stringify(row));
    if (OUT) { mkdirSync(dirname(OUT), { recursive: true }); appendFileSync(OUT, JSON.stringify(row) + "\n"); }
    await page.waitForTimeout(500);
  }
}
await browser.close();
