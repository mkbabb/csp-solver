#!/usr/bin/env node
/** The half-erased word, photographed at EXACTLY t=100ms: arm the verb, then pause its own
 *  animation at 100ms so the frame is the curve's answer and not the scheduler's. */
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

for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  for (const dark of [true, false]) {
    const br = await eng.launch({ headless: true });
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true, colorScheme: dark ? "dark" : "light" });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY");
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.waitForTimeout(1800);
    if (!(await page.evaluate(() => !!document.querySelector(".margin-note-ink")))) {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll("button")].find((b) => /hint|nudge|check/i.test(b.textContent ?? ""));
        btn?.click();
      });
      await page.waitForTimeout(900);
    }
    const box = await page.evaluate(() => {
      const el = document.querySelector(".margin-note-ink");
      if (!el) return null;
      el.classList.add("is-rubbing-out");
      for (const a of el.getAnimations()) {
        a.currentTime = 100;
        a.pause();
      }
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { x: Math.max(0, b.x - 10), y: Math.max(0, b.y - 10), width: Math.min(390, b.width + 20), height: b.height + 20, clip: cs.clipPath, opacity: cs.opacity, text: el.textContent };
    });
    if (box) {
      await page.screenshot({ path: join(FRAMES, `rubout-t100-${dark ? "dark" : "light"}-${name}.png`), clip: { x: box.x, y: box.y, width: box.width, height: box.height } });
      console.log(name, dark ? "dark" : "light", JSON.stringify({ clip: box.clip, opacity: box.opacity, text: box.text }));
    } else console.log(name, dark ? "dark" : "light", "no note");
    await br.close();
  }
}
srv.close();
