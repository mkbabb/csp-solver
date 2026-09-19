// run: cd web/frontend && node ../../docs/tranches/2026-08-tranche-9/evidence/w8/attribution/A4/onset-ablate.mjs --regime mobile --cpu 4 --port 4253 --out <file.jsonl>
//
// A4 · THE ONSET FRAME, DECOMPOSED. The drawer's whole main-thread bill lands in ONE frame at
// gesture onset (and, on mobile, a second one at the close's settle). This instrument splits
// that frame into its three co-located causes by provoking each ALONE in the live page and
// tracing it — no source is edited, nothing is rebuilt; the page is driven, which is the
// estate's own ablation discipline.
//
//   inert      — `boardCovered` flips `inert` on `.board-cells` (GameBoard.vue, T9-W3 §3.1)
//   drawerClass— `applyLayout()` toggles `html.drawer-closed` (the ONE layout step)
//   teleport   — the tongue moves berth (#board-edge ⇄ #drawer-handle, GameScene.vue)
//   all        — the real gesture, for the sum check
//
// Reports per arm: UpdateLayoutTree ms + elementCount (THE NODES RESTYLED), Layout ms +
// dirtyObjects, Paint/Raster/Composite ms, and the forced-layout (`Layout` with
// `beginData.stackTrace`) count.
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { createRequire } from "node:module";
const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/";
const { chromium } = createRequire(FE + "package.json")("playwright");

const argv = process.argv.slice(2);
const arg = (k, d) => (argv.indexOf("--" + k) === -1 ? d : argv[argv.indexOf("--" + k) + 1]);
const REGIME = arg("regime", "mobile");
const CPU = Number(arg("cpu", "4"));
const PORT = arg("port", "4253");
const OUT = arg("out", null);
const REPS = Number(arg("reps", "3"));

// C08 DECLARED CHANGE — deviceScaleFactor, which A4 never set (ATTRIBUTION gap 15).
const DPR = Number(arg("dpr", "3"));
const V = {
  desk: { viewport: { width: 1280, height: 800 }, hasTouch: false, isMobile: false, deviceScaleFactor: DPR },
  mobile: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: DPR },
}[REGIME];

const ARMS = {
  // Each arm: flip the state, then force a style+layout flush in the same task so the trace
  // attributes the recalc to this arm rather than to the next frame's other work.
  inert: `() => {
    const g = document.querySelector(".board-cells");
    if (!g) return "no .board-cells";
    const on = g.hasAttribute("inert");
    if (on) g.removeAttribute("inert"); else g.setAttribute("inert", "");
    void document.body.offsetHeight;
    return on ? "inert removed" : "inert added";
  }`,
  drawerClass: `() => {
    const h = document.documentElement;
    h.classList.toggle("drawer-closed");
    void document.body.offsetHeight;
    return "drawer-closed=" + h.classList.contains("drawer-closed");
  }`,
  teleport: `() => {
    const tab = document.querySelector(".drawer-tab");
    const edge = document.querySelector("#board-edge");
    const handle = document.querySelector("#drawer-handle");
    if (!tab || !edge || !handle) return "berths missing";
    const to = tab.parentElement === edge ? handle : edge;
    to.appendChild(tab);
    void document.body.offsetHeight;
    return "tongue -> " + to.id;
  }`,
  none: `() => { void document.body.offsetHeight; return "control: a forced layout and nothing else"; }`,
};

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

const b = await chromium.launch();
const ctx = await b.newContext(V);
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });
await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku&size=3&difficulty=EASY`, { waitUntil: "load" });
const boardReadyMs = await page.evaluate(`(${BOARD_READY})()`);

const census = await page.evaluate(`(() => ({
  gridNodes: document.querySelectorAll(".board-cells *").length,
  cells: document.querySelectorAll(".board-cells .game-cell").length,
  docNodes: document.querySelectorAll("*").length,
  sheetNodes: document.querySelectorAll("#controls-drawer *").length,
  hasInert: document.querySelector(".board-cells")?.hasAttribute("inert") ?? null,
  htmlClass: document.documentElement.className,
}))()`);
console.log(JSON.stringify({ lane: "C08", probe: "census", dpr: DPR, build: arg("build","base"), regime: REGIME, cpu: CPU + "x", boardReadyMs: +boardReadyMs.toFixed(2), ...census }));

const CATS = {
  UpdateLayoutTree: "recalcStyle",
  Layout: "layout",
  Paint: "paint",
  PaintImage: "paint",
  RasterTask: "raster",
  Commit: "composite",
  UpdateLayerTree: "composite",
  Layerize: "composite",
};

async function traceArm(name, fn, rep) {
  const done0 = new Promise((res) => cdp.once("Tracing.tracingComplete", res));
  await cdp.send("Tracing.start", {
    traceConfig: { includedCategories: ["disabled-by-default-devtools.timeline", "blink.user_timing", "devtools.timeline"] },
    transferMode: "ReturnAsStream",
  });
  await page.evaluate(`performance.mark('arm-start')`);
  const note = await page.evaluate(`(${fn})()`);
  await page.evaluate(`performance.mark('arm-end')`);
  await page.waitForTimeout(400);
  await cdp.send("Tracing.end");
  const { stream } = await done0;
  let data = "";
  for (;;) {
    const r = await cdp.send("IO.read", { handle: stream, size: 5 * 1024 * 1024 });
    data += r.data;
    if (r.eof) break;
  }
  await cdp.send("IO.close", { handle: stream });
  const parsed = JSON.parse(data);
  const evs = parsed.traceEvents || parsed;
  let a = null,
    z = null;
  for (const e of evs) {
    if ((e.cat || "").includes("blink.user_timing")) {
      if (e.name === "arm-start" && a == null) a = e.ts;
      if (e.name === "arm-end" && z == null) z = e.ts;
    }
  }
  const out = { recalcStyle: 0, layout: 0, paint: 0, raster: 0, composite: 0, restyledElements: 0, layoutDirty: 0, forcedLayouts: 0, n: {} };
  // the arm's own task = [arm-start, arm-end]; the frame it provokes lands after, so take
  // arm-start .. arm-end+120ms and say so.
  for (const e of evs) {
    const k = CATS[e.name];
    if (!k || a == null) continue;
    if (e.ts < a || e.ts > (z ?? a) + 120000) continue;
    out[k] = +(out[k] + (e.dur || 0) / 1000).toFixed(3);
    out.n[e.name] = (out.n[e.name] || 0) + 1;
    if (e.name === "UpdateLayoutTree" && e.args?.elementCount) out.restyledElements += e.args.elementCount;
    if (e.name === "Layout") {
      if (e.args?.beginData?.dirtyObjects) out.layoutDirty += e.args.beginData.dirtyObjects;
      if (e.args?.beginData?.stackTrace) out.forcedLayouts++;
    }
  }
  const row = { lane: "C08", probe: "onset-ablate", regime: REGIME, dpr: DPR, build: arg("build","base"), cpu: CPU + "x", network: "unthrottled", arm: name, rep, note, windowMs: z != null ? +((z - a) / 1000).toFixed(2) : null, ...out };
  console.log(JSON.stringify(row));
  if (OUT) {
    mkdirSync(dirname(OUT), { recursive: true });
    appendFileSync(OUT, JSON.stringify(row) + "\n");
  }
}

for (let rep = 0; rep < REPS; rep++)
  for (const [name, fn] of Object.entries(ARMS)) {
    await traceArm(name, fn, rep);
    await page.waitForTimeout(250);
  }
await b.close();
