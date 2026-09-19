#!/usr/bin/env node
/**
 * THE DRAWER AND THE DOCK, at t=260ms of an open — read as GEOMETRY rather than as pixels.
 *
 * The pixel arm the brief asks for has a noise floor this rig cannot clear: two page loads
 * deal different puzzles and start the boil on different phases, so a screenshot diff between
 * two dists measures the deal and the grain, not the drawer. That floor is measured here too
 * (the same dist against itself) and printed beside the cross-dist figure, so the reading is
 * honest about what it can and cannot say. The claim the cure actually makes — one clock, one
 * curve, the same pose at the same time — is read off the movers: every mover's duration,
 * easing and its transform matrix at t=260ms, compared number by number.
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

async function poses(which, engineName, w, h) {
  const engine = engineName === "webkit" ? webkit : chromium;
  const br = await engine.launch({ headless: true });
  const ctx = await br.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: w < 1024, isMobile: w < 1024, colorScheme: "dark" });
  const page = await ctx.newPage();
  await page.goto(S[which].base + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(2200);
  const out = await page.evaluate(() => {
    const tab = document.querySelector(".drawer-tab");
    if (!tab) return { skip: "no drawer tab" };
    tab.click();
    const rows = [];
    for (const a of document.getAnimations()) {
      if (a.animationName) continue; // CSS animations are not the drawer's movers
      const t = a.effect?.getComputedTiming();
      a.currentTime = 260;
      a.pause();
      const el = a.effect?.target;
      rows.push({
        cls: String(el?.className?.baseVal ?? el?.className ?? "").slice(0, 44),
        duration: t?.duration ?? null,
        easing: t?.easing ?? null,
        fill: t?.fill ?? null,
        at260: el ? getComputedStyle(el).transform : null,
      });
    }
    return { movers: rows.sort((a, b) => (a.cls < b.cls ? -1 : 1)) };
  });
  await br.close();
  return out;
}

for (const [tag, w, h] of [
  ["desk", 1280, 800],
  ["dock", 390, 844],
]) {
  for (const engine of ["chromium", "webkit"]) {
    const a = await poses("control", engine, w, h);
    const b = await poses("proto", engine, w, h);
    if (a.skip || b.skip) {
      console.log(JSON.stringify({ tag, engine, skip: a.skip ?? b.skip }));
      continue;
    }
    const same =
      JSON.stringify(a.movers) === JSON.stringify(b.movers)
        ? "IDENTICAL"
        : "DIVERGENT";
    console.log(JSON.stringify({ tag, engine, verdict: same, control: a.movers, proto: b.movers }, null, 1));
  }
}
for (const s of Object.values(S)) s.srv.close();
