#!/usr/bin/env node
/**
 * RUB OUT, the rest of the claim: the end pose, the reduced-motion cut, the timing function
 * the shorthand actually resolved to, and one crop per theme at t=100ms (the half-erased
 * word). Runs against the prototype dist only; the control has no such verb to photograph.
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { createRequire } from "node:module";

const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const { chromium, webkit } = createRequire(FE + "/package.json")("playwright");
const ROOT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-52/web/frontend/dist";
const FRAMES =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/frames";
mkdirSync(FRAMES, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".wasm": "application/wasm" };
const srv = createServer((req, rq) => {
  const u = new URL(req.url, "http://x");
  let p = join(ROOT, decodeURIComponent(u.pathname));
  if (!existsSync(p) || u.pathname === "/") p = join(ROOT, "index.html");
  const b = readFileSync(p);
  rq.writeHead(200, { "content-type": MIME[extname(p)] ?? "application/octet-stream" });
  rq.end(b);
});
await new Promise((r) => srv.listen(0, "127.0.0.1", r));
const BASE = `http://127.0.0.1:${srv.address().port}/`;

for (const engine of [chromium, webkit]) {
  const name = engine === chromium ? "chromium" : "webkit";
  for (const prm of [false, true]) {
    for (const dark of [true, false]) {
      const br = await engine.launch({ headless: true });
      const ctx = await br.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: true,
        colorScheme: dark ? "dark" : "light",
        reducedMotion: prm ? "reduce" : "no-preference",
      });
      const page = await ctx.newPage();
      await page.goto(BASE + "?size=3&difficulty=EASY");
      await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.waitForTimeout(1800);
      if (!(await page.evaluate(() => !!document.querySelector(".margin-note-ink")))) {
        await page.evaluate(() => {
          const btn = [...document.querySelectorAll("button")].find((b) => /hint|nudge|check/i.test(b.textContent ?? ""));
          btn?.click();
        });
        await page.waitForTimeout(700);
      }
      const there = await page
        .waitForSelector(".margin-note-ink", { timeout: 8000 })
        .then(() => true)
        .catch(() => false);
      if (!there) {
        console.log(JSON.stringify({ engine: name, prm, theme: dark ? "dark" : "light", missing: "no .margin-note-ink on this route" }));
        await br.close();
        continue;
      }
      const declared = await page.evaluate(() => {
        const el = document.querySelector(".margin-note-ink");
        if (!el) return { missing: true };
        const before = getComputedStyle(el);
        el.classList.add("is-rubbing-out");
        const cs = getComputedStyle(el);
        return {
          text: (el.textContent ?? "").slice(0, 40),
          writeIn: { name: before.animationName, dur: before.animationDuration, fn: before.animationTimingFunction, fill: before.animationFillMode },
          rubOut: { name: cs.animationName, dur: cs.animationDuration, fn: cs.animationTimingFunction, fill: cs.animationFillMode },
          restClip: cs.clipPath,
          restOpacity: cs.opacity,
        };
      });
      // t=100ms: the half-erased word, on the wall clock rather than a frame count.
      await page.waitForTimeout(100);
      const shot = await page.evaluate(() => {
        const el = document.querySelector(".margin-note-ink");
        const cs = getComputedStyle(el);
        const b = el.getBoundingClientRect();
        return { clip: cs.clipPath, opacity: cs.opacity, box: { x: Math.max(0, b.x - 8), y: Math.max(0, b.y - 8), width: b.width + 16, height: b.height + 16 } };
      });
      if (!prm && shot.box.width > 4)
        await page.screenshot({
          path: join(FRAMES, `rubout-t100-${dark ? "dark" : "light"}-${name}.png`),
          clip: shot.box,
        });
      await page.waitForTimeout(400);
      const end = await page.evaluate(() => {
        const el = document.querySelector(".margin-note-ink");
        const cs = getComputedStyle(el);
        return { clip: cs.clipPath, opacity: cs.opacity };
      });
      console.log(
        JSON.stringify({ engine: name, prm, theme: dark ? "dark" : "light", declared, at100: { clip: shot.clip, opacity: shot.opacity }, end }),
      );
      await br.close();
    }
  }
}
srv.close();
