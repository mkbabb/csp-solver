#!/usr/bin/env node
/**
 * THE DUSK at 4x, the fifteen-gesture frame trace at 1x, and the live filter count — both
 * dists, both engines. The dusk's guard is a FLOOR the prototype may not fall below; the
 * curve under it is CSS `ease`'s own control points under a name, so parity is the claim.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { createRequire } from "node:module";

const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const { chromium, webkit } = createRequire(FE + "/package.json")("playwright");
const DIST = {
  proto:
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-52/web/frontend/dist",
  control:
    "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/control/web/frontend/dist",
};
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
const S = { proto: await serve(DIST.proto), control: await serve(DIST.control) };

const TRACE = `
window.__frames = [];
window.__trace = (ms) => new Promise((res) => {
  const t0 = performance.now(); let last = t0; const out = [];
  const step = (t) => { out.push(t - last); last = t; if (t - t0 < ms) requestAnimationFrame(step); else res(out.slice(1)); };
  requestAnimationFrame(step);
});
window.__colours = (ms) => new Promise((res) => {
  const t0 = performance.now(); const seen = [];
  const step = () => {
    const c = getComputedStyle(document.body).backgroundColor;
    if (seen[seen.length - 1] !== c) seen.push(c);
    if (performance.now() - t0 < ms) requestAnimationFrame(step); else res(seen);
  };
  requestAnimationFrame(step);
});
`;

async function run(which, engineName) {
  const engine = engineName === "webkit" ? webkit : chromium;
  const br = await engine.launch({ headless: true });
  const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: "dark" });
  const page = await ctx.newPage();
  await page.addInitScript(TRACE);
  await page.goto(S[which].base + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(2500);

  const filters = await page.evaluate(() => {
    const used = new Set();
    let n = 0;
    for (const el of document.querySelectorAll("*")) {
      const f = getComputedStyle(el).filter;
      if (f && f !== "none") {
        n++;
        used.add(f);
      }
    }
    return { elementsWithAFilter: n, distinct: used.size, svgFilterEls: document.querySelectorAll("filter").length };
  });

  // THE DUSK — six alternating flips. Chromium runs them at 4x; WebKit has no CPU throttle
  // in this harness and runs at 1x, which is said rather than implied.
  let cdp = null;
  if (engineName === "chromium") {
    cdp = await ctx.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  }
  const toggle = await page.$(".dark-mode-toggle, [aria-label*='theme' i], [aria-label*='dark' i], [aria-label*='light' i]");
  const flips = [];
  let colourSteps = null;
  if (toggle) {
    for (let i = 0; i < 6; i++) {
      const tr = page.evaluate("window.__trace(700)");
      const co = i === 3 ? page.evaluate("window.__colours(700)") : null;
      await toggle.click();
      flips.push(await tr);
      if (co) colourSteps = (await co).length;
      await page.waitForTimeout(250);
    }
  }
  if (cdp) await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });

  // THE FIFTEEN GESTURES at 1x — arrow steps, pencil marks, undo, redo, the drawer.
  const gesture = page.evaluate("window.__trace(4200)");
  const keys = ["ArrowRight", "5", "ArrowDown", "3", "p", "7", "ArrowLeft", "u", "ArrowUp", "1", "r", "ArrowRight", "9", "u", "d"];
  for (const k of keys) {
    await page.keyboard.press(k);
    await page.waitForTimeout(220);
  }
  const gFrames = await gesture;
  await br.close();

  const warm = flips.slice(1).flat().filter((d) => d > 0);
  const sorted = [...warm].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? null;
  return {
    dist: which,
    engine: engineName,
    throttle: engineName === "chromium" ? "4x" : "1x (no throttle in this harness)",
    flips: flips.length,
    warmFrames: warm.length,
    warmMedianMs: median?.toFixed(2),
    warmMedianFps: median ? (1000 / median).toFixed(1) : null,
    worstWarmFrameMs: warm.length ? Math.max(...warm).toFixed(1) : null,
    colourSteps,
    gestureFramesOver33ms: gFrames.filter((d) => d > 33).length,
    gestureWorstMs: gFrames.length ? Math.max(...gFrames).toFixed(1) : null,
    filters,
  };
}

for (const which of ["control", "proto"])
  for (const engine of ["chromium", "webkit"]) console.log(JSON.stringify(await run(which, engine)));

for (const s of Object.values(S)) s.srv.close();
