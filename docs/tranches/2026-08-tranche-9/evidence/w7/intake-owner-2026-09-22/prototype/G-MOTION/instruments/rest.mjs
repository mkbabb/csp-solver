// Rest reads for GB3 (ink identity) and GC4 (π).
// node rest.mjs <engine> <port> <vw>x<vh> <scheme> <view playing|gallery> <outprefix>
// GB3: PRM (beat frozen at pose 0) screenshots of the grid and the wordmark boxes → <out>-grid.png, -logo.png
// GC4: no-PRM settled DOM walk: tag + class (beat classes stripped) + computed paint props + rect → <out>-pi.json
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [engine, port, vp, scheme, view, out] = process.argv.slice(2);
const [vw, vh] = vp.split("x").map(Number);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const url = `http://127.0.0.1:${port}/?${view === "gallery" ? "view=gallery&" : ""}board=${BOARD}`;
const touch = vw < 600;
const b = await pw[engine].launch({ args: engine === "chromium" ? ["--force-color-profile=srgb"] : [] });
async function ctxFor(prm) { return b.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, colorScheme: scheme, reducedMotion: prm ? "reduce" : "no-preference", hasTouch: touch }); }
async function settle(p) {
  await p.goto(url, { waitUntil: "load" });
  await p.waitForSelector(view === "gallery" ? ".game-card" : ".game-cell", { timeout: 30000 });
  await p.waitForFunction(() => document.querySelectorAll(".handwritten-logo .logo-pose-bmp").length >= 4, null, { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(4000);
}
// GB3 — frozen pose, painted bytes
if (view === "playing") {
  const c = await ctxFor(true); const p = await c.newPage(); await p.emulateMedia({ reducedMotion: "reduce" });
  await settle(p);
  const box = async (sel) => p.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) }; }, sel);
  await p.screenshot({ path: `${out}-grid.png`, clip: await box(".hand-drawn-grid") });
  await p.screenshot({ path: `${out}-logo.png`, clip: await box(".masthead .handwritten-logo") });
  await c.close();
}
// GC4 — settled DOM walk
{
  const c = await ctxFor(false); const p = await c.newPage();
  await settle(p);
  const walk = await p.evaluate(() => {
    const BEAT = /(^|\s)(is-active|is-pose-active)(\s|$)/g;
    const PROPS = ["display", "visibility", "position", "z-index", "color", "background-color", "fill", "stroke", "filter", "clip-path", "mask-image", "overflow", "transform", "border-top-color", "box-shadow"];
    const beatEl = (e) => /pose|boil|bitmap|frame-layer|progress-pose|rest-/.test(String(e.className?.baseVal ?? e.className));
    const out = [];
    const rec = (e, path) => {
      const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
      const props = {}; for (const k of PROPS) props[k] = cs.getPropertyValue(k);
      if (!beatEl(e)) props.opacity = cs.opacity;
      out.push({ path, tag: e.tagName.toLowerCase(), cls: String(e.className?.baseVal ?? e.className ?? "").replace(BEAT, " ").trim(), rect: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 10) / 10).join(","), props });
      const counts = {};
      // the arm's own new layer is keyed by name, so it cannot shift its siblings' indices
      for (const ch of e.children) { if (ch.classList?.contains("grid-ink")) { rec(ch, `${path}>grid-ink`); continue; } const t = ch.tagName.toLowerCase(); counts[t] = (counts[t] || 0) + 1; rec(ch, `${path}>${t}[${counts[t]}]`); }
    };
    rec(document.body, "body");
    return out;
  });
  writeFileSync(`${out}-pi.json`, JSON.stringify(walk));
  await c.close();
}
await b.close();
console.log("ok", out);
