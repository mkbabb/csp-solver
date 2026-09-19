#!/usr/bin/env node
/**
 * I1 (the exit fold must PLAY) and the drawer/dock pixel identity, both dists, both engines.
 * I1's watcher is r0's own instrument verbatim; the drawer arm shoots the t=260ms frame of a
 * desk open and a dock open on each dist and compares the two images byte for byte.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { createRequire } from "node:module";
import process from "node:process";

const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const req = createRequire(FE + "/package.json");
const { chromium, webkit } = req("playwright");
const sharp = req("sharp");

const DIST = {
  proto:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-52/web/frontend/dist",
  control:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/control/web/frontend/dist",
};
const FRAMES =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/frames";
mkdirSync(FRAMES, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".wasm": "application/wasm" };
function serve(root) {
  return new Promise((res) => {
    const srv = createServer((rq, rs) => {
      const u = new URL(rq.url, "http://x");
      let p = join(root, decodeURIComponent(u.pathname));
      if (!existsSync(p) || u.pathname === "/") p = join(root, "index.html");
      const b = readFileSync(p);
      rs.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream" });
      rs.end(b);
    });
    srv.listen(0, "127.0.0.1", () => res({ srv, base: `http://127.0.0.1:${srv.address().port}/` }));
  });
}

const WATCH = `
window.__A = [];
const orig = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  const a = orig.call(this, kf, opts);
  let cls = null;
  try { cls = typeof this.className === 'string' ? this.className : (this.getAttribute && this.getAttribute('class')); } catch {}
  window.__A.push({ a, el: this, cls: String(cls || '') });
  return a;
};
window.__Aclear = () => { window.__A = []; };
window.__Awatch = (ms) => new Promise((res) => {
  const t0 = performance.now(); const rec = new Map();
  const step = () => {
    for (const r of window.__A) {
      const row = rec.get(r) ?? { cls: r.cls, running: 0, states: [], transforms: new Set() };
      row.states.push(r.a.playState);
      if (r.a.playState === 'running') { row.running++; try { row.transforms.add(getComputedStyle(r.el).transform); } catch {} }
      rec.set(r, row);
    }
    if (performance.now() - t0 < ms) requestAnimationFrame(step);
    else res([...rec.values()].map((v) => ({ cls: v.cls, running: v.running, first: v.states[0], transforms: [...v.transforms].slice(0, 3) })));
  };
  requestAnimationFrame(step);
});
`;

const servers = { proto: await serve(DIST.proto), control: await serve(DIST.control) };

async function i1(which, engineName, w, h) {
  const engine = engineName === "webkit" ? webkit : chromium;
  const browser = await engine.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: w < 1024 ? 3 : 2,
    hasTouch: w < 1024,
    isMobile: w < 1024,
  });
  const page = await ctx.newPage();
  await page.addInitScript(WATCH);
  await page.goto(servers[which].base + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.activeElement?.blur?.());

  await page.evaluate("window.__Aclear()");
  let wch = page.evaluate("window.__Awatch(800)");
  await page.keyboard.press("g");
  const enter = await wch;
  await page.waitForTimeout(2200);

  await page.evaluate("window.__Aclear()");
  wch = page.evaluate("window.__Awatch(800)");
  await page.keyboard.press("Escape");
  const exit = await wch;
  await browser.close();
  const pick = (rows) => rows.find((r) => /board-peek-host/.test(r.cls));
  const e = pick(enter);
  const x = pick(exit);
  return {
    dist: which,
    engine: engineName,
    viewport: `${w}x${h}`,
    enterRunning: e?.running ?? 0,
    exitRunning: x?.running ?? 0,
    exitFirstState: x?.first ?? "no mover",
    exitTransforms: x?.transforms ?? [],
    verdict: x && x.running >= 3 && x.transforms.some((t) => t !== "none") ? "GREEN" : "RED",
  };
}

if (!process.env.ONLY || process.env.ONLY === "i1") {
  for (const which of ["control", "proto"])
    for (const engine of ["chromium", "webkit"])
      for (const [w, h] of [
        [390, 844],
        [1280, 800],
      ])
        console.log("I1", JSON.stringify(await i1(which, engine, w, h)));
}

// ── The drawer and the dock, at t=260ms of an open ──────────────────────────────────────
async function drawerFrame(which, engineName, w, h, tag) {
  const engine = engineName === "webkit" ? webkit : chromium;
  const browser = await engine.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    hasTouch: w < 1024,
    isMobile: w < 1024,
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  await page.goto(servers[which].base + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(2200);
  // Freeze the boil so the only thing moving in the frame is the drawer.
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      const n = a.animationName ?? "";
      if (!n) continue;
      a.pause();
    }
  });
  const tab = await page.$(".drawer-tab");
  if (!tab) {
    await browser.close();
    return { skip: "no drawer tab at this width" };
  }
  await page.evaluate(() => {
    window.__t0 = performance.now();
    document.querySelector(".drawer-tab")?.click();
  });
  // The frame at t=260ms of the open, pinned by pausing every mover at that time.
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      if (a.animationName) continue; // a script mover carries no name
      a.currentTime = 260;
      a.pause();
    }
  });
  const path = join(FRAMES, `drawer-${tag}-${which}-${engineName}.png`);
  await page.screenshot({ path });
  await browser.close();
  return { path };
}

if (!process.env.ONLY || process.env.ONLY === "drawer") {
  for (const [tag, w, h] of [
    ["desk", 1280, 800],
    ["dock", 390, 844],
  ]) {
    for (const engine of ["chromium", "webkit"]) {
      const a = await drawerFrame("control", engine, w, h, tag);
      const b = await drawerFrame("proto", engine, w, h, tag);
      if (a.skip || b.skip) {
        console.log("DRAWER", JSON.stringify({ tag, engine, skip: a.skip ?? b.skip }));
        continue;
      }
      const ra = await sharp(a.path).raw().toBuffer({ resolveWithObject: true });
      const rb = await sharp(b.path).raw().toBuffer({ resolveWithObject: true });
      let diff = 0;
      const n = Math.min(ra.data.length, rb.data.length);
      const ch = ra.info.channels;
      for (let i = 0; i < n; i += ch) {
        for (let c = 0; c < ch; c++)
          if (ra.data[i + c] !== rb.data[i + c]) {
            diff++;
            break;
          }
      }
      console.log(
        "DRAWER",
        JSON.stringify({
          tag,
          engine,
          size: `${ra.info.width}x${ra.info.height}`,
          differingPixels: diff,
          totalPixels: n / ch,
        }),
      );
    }
  }
}

for (const s of Object.values(servers)) s.srv.close();
