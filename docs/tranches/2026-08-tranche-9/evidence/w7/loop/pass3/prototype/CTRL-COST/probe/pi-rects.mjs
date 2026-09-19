#!/usr/bin/env node
// T9-W7 pass 3 · CTRL-COST — THE π ROW. Every element's rect on a surface this wave does NOT
// claim, read on the prototype and on the 74a2b5d9 control, and differenced. The gallery is
// the surface: the ladder lives in the controls card and must move nothing there.
// Usage: node pi-rects.mjs <base> <engine> <route> <out.json>
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const base = process.argv[2];
const engine = process.argv[3] ?? "chromium";
const route = process.argv[4] ?? "/";
const out = process.argv[5] ?? "/tmp/pi.json";

const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}${route}`);
await page.waitForSelector("svg.handwritten-logo", { timeout: 25000 }).catch(() => {});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);

const rects = await page.evaluate(() => {
  const r2 = (n) => +n.toFixed(2);
  // THE SUBJECT IS THE SURFACE THIS WAVE DOES NOT CLAIM. The ladder rewrites the controls
  // card's DOM by design, so a whole-document walk keyed by document order compares the
  // masthead of one tree against the board of the other and reports a walk that is the probe's
  // own. Everything inside `.controls-card` and its drawer is OUT; everything else — the
  // masthead, the board, the wordmark, the celestial toggle, the page chrome — is IN, and is
  // keyed by its own ancestry path so the two trees align on identity rather than on index.
  const path = (el) => {
    const parts = [];
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const cls =
        typeof n.className === "string"
          ? n.className.trim().split(/\s+/).filter((c) => !/^data-v-/.test(c)).slice(0, 2).join(".")
          : "";
      const sibs = [...(n.parentElement?.children ?? [])].filter(
        (s) => s.tagName === n.tagName,
      );
      parts.unshift(`${n.tagName.toLowerCase()}${cls ? "." + cls : ""}#${sibs.indexOf(n)}`);
    }
    return parts.join(">");
  };
  return [...document.querySelectorAll("body *")]
    .filter((el) => !el.closest(".controls-card, #controls-drawer, .drawer-case"))
    .map((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) return null;
      return { k: path(el), x: r2(r.x), y: r2(r.y), w: r2(r.width), h: r2(r.height) };
    })
    .filter(Boolean);
});
writeFileSync(out, JSON.stringify({ engine, route, base, n: rects.length, rects }, null, 0));
console.log(`${engine} ${route} ${base} → ${rects.length} rects`);
await browser.close();
