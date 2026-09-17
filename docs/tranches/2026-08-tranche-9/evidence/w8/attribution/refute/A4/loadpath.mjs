// run: cd web/frontend && node <thisdir>/loadpath.mjs --cpu 4 --port 4257 --out raw/x.jsonl
//
// REFUTER A4 · LENS 3. Lane A4 marks every drawer finding `onCriticalPath: true`. The wave's
// critical path is defined against BOARD-READY. This traces the navigation and asks, of the
// window navigationStart → board-ready:
//   - is the drawer estate even present before board-ready (`.drawer-tab`, `html.drawer-closed`,
//     the mobile sheet's nodes, `inert` on `.board-cells`)?
//   - how much main-thread RecalcStyle / Layout / Paint / Raster lands BEFORE board-ready, and
//     how much of it is attributable to the drawer sheet's own subtree?
//   - are there longtasks before board-ready, and does the drawer's own work appear in them?
// A suspect that happens after board-ready cannot delay board-ready.
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createRequire } from "node:module";
const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/";
const pw = createRequire(FE + "package.json")("playwright");
const argv = process.argv.slice(2);
const arg = (k, d) => (argv.indexOf("--" + k) === -1 ? d : argv[argv.indexOf("--" + k) + 1]);
const CPU = Number(arg("cpu", "4"));
const PORT = arg("port", "4257");
const OUT = arg("out", null);

const isVisible = `(el) => { if (!el) return false; const r = el.getClientRects(); if (!r.length) return false; const cs = getComputedStyle(el); return cs.visibility !== "hidden" && cs.display !== "none" && Number(cs.opacity) > 0.01; }`;
const BOARD_READY = `async () => {
  const vis = ${isVisible};
  const t0 = performance.now();
  while (performance.now() - t0 < 30000) {
    const bg = document.querySelector(".board-group");
    const c = document.querySelector(".board-cells .game-cell");
    if (vis(bg) && c && c.getBoundingClientRect().width > 0 && vis(c)) {
      await new Promise((r) => requestAnimationFrame(r));
      performance.mark("boardReady");
      return performance.now();
    }
    await new Promise((r) => setTimeout(r, 40));
  }
  throw new Error("board-ready timeout");
}`;

const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
await page.addInitScript(`window.__lt = []; try { new PerformanceObserver((l)=>{for(const e of l.getEntries()) window.__lt.push([+e.startTime.toFixed(1), +e.duration.toFixed(1)]);}).observe({entryTypes:["longtask"]}); } catch(e) {}`);

await cdp.send("Tracing.start", {
  traceConfig: { includedCategories: ["devtools.timeline", "blink.user_timing", "disabled-by-default-devtools.timeline"] },
  transferMode: "ReturnAsStream",
});
await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`, { waitUntil: "load" });
const readyMs = await page.evaluate(`(${BOARD_READY})()`);

const census = await page.evaluate(`(() => {
  const q = (s) => document.querySelector(s);
  const grid = q(".board-cells");
  const sheet = q(".mobile-control-panel") || q(".control-panel-wrap");
  return {
    boardReadyMs: ${readyMs},
    drawerTabPresent: !!q(".drawer-tab"),
    htmlClass: document.documentElement.className,
    gridInert: grid ? grid.hasAttribute("inert") : null,
    docNodes: document.querySelectorAll("*").length,
    sheetNodes: sheet ? sheet.querySelectorAll("*").length : null,
    sheetVisibility: sheet ? getComputedStyle(sheet).visibility : null,
    navStartToReady: ${readyMs},
    longtasksBeforeReady: (window.__lt || []).filter((x) => x[0] < ${readyMs}),
    longtasksAll: window.__lt || [],
  };
})()`);

const done = new Promise((res) => cdp.once("Tracing.tracingComplete", res));
await cdp.send("Tracing.end");
const stream = (await done).stream;
let buf = "";
for (;;) {
  const c = await cdp.send("IO.read", { handle: stream, size: 5 * 1024 * 1024 });
  buf += c.data;
  if (c.eof) break;
}
await cdp.send("IO.close", { handle: stream });
const parsed = JSON.parse(buf);
const evs = Array.isArray(parsed) ? parsed : parsed.traceEvents;

// navigationStart in trace time: the first navigationStart / ResourceSendRequest anchor.
const nav = evs.find((e) => e.name === "navigationStart") || evs.find((e) => e.name === "ResourceSendRequest");
const t0 = nav ? nav.ts : Math.min(...evs.filter((e) => e.ts).map((e) => e.ts));
const mark = evs.find((e) => e.name === "boardReady" && e.ph === "R") || evs.find((e) => e.name === "boardReady");
const readyTs = mark ? mark.ts : t0 + readyMs * 1000;

const NAMES = { UpdateLayoutTree: "recalcStyle", Layout: "layout", Paint: "paint", RasterTask: "raster", CompositeLayers: "composite" };
const before = {}, after = {};
let elBefore = 0, elAfter = 0, dirtyBefore = 0;
for (const e of evs) {
  if (!e.ts || !e.dur || !NAMES[e.name]) continue;
  const bucket = e.ts < readyTs ? before : after;
  bucket[NAMES[e.name]] = +((bucket[NAMES[e.name]] || 0) + e.dur / 1000).toFixed(3);
  bucket["n_" + e.name] = (bucket["n_" + e.name] || 0) + 1;
  const d = e.args && e.args.elementCount;
  const dj = e.args && e.args.beginData && e.args.beginData.dirtyObjects;
  if (e.name === "UpdateLayoutTree" && d) e.ts < readyTs ? (elBefore += d) : (elAfter += d);
  if (e.name === "Layout" && dj && e.ts < readyTs) dirtyBefore += dj;
}
const row = {
  lane: "A4-REFUTE", probe: "loadpath", engine: "chromium", regime: "mobile", cpu: CPU + "x",
  network: "unthrottled", cache: "cold(first nav of this context)", tainted: false,
  ...census,
  preReadyMs: +((readyTs - t0) / 1000).toFixed(1),
  beforeBoardReady: { ...before, restyledElements: elBefore, layoutDirty: dirtyBefore },
  afterBoardReady: { ...after, restyledElements: elAfter },
};
console.log(JSON.stringify(row));
if (OUT) { mkdirSync(dirname(OUT), { recursive: true }); appendFileSync(OUT, JSON.stringify(row) + "\n"); }
await browser.close();
