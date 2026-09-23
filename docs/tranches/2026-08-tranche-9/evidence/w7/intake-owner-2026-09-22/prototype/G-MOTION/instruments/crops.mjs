// node crops.mjs <c1|c2|c3|c4> <outdir>  — HEAD (4254) row above the prototype (4253) row, times labelled
import { createRequire } from "node:module";
import { mkdirSync, readFileSync } from "node:fs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const sharp = require("sharp");
const [which, outDir] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const label = (w, txt) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="22"><rect width="100%" height="100%" fill="#222"/><text x="6" y="16" font-family="Helvetica" font-size="13" fill="#fff">${txt}</text></svg>`);

async function sheet(rows, file, title) { // rows: [{name, tiles:[{buf, t}]}]
  const tw = (await sharp(rows[0].tiles[0].buf).metadata()).width, th = (await sharp(rows[0].tiles[0].buf).metadata()).height;
  const cols = rows[0].tiles.length; const W = tw * cols + 4 * (cols - 1), H = 22 + rows.length * (th + 22);
  const comp = [{ input: label(W, title), left: 0, top: 0 }];
  rows.forEach((r, ri) => r.tiles.forEach((t, ci) => { const y = 22 + ri * (th + 22); comp.push({ input: label(tw, `${r.name} · ${t.t}`), left: ci * (tw + 4), top: y }); comp.push({ input: t.buf, left: ci * (tw + 4), top: y + 22 }); }));
  await sharp({ create: { width: W, height: H, channels: 3, background: "#888" } }).composite(comp).png({ palette: true, colors: 128, effort: 10 }).toFile(`${outDir}/${file}`);
  console.log(file, readFileSync(`${outDir}/${file}`).length, "B");
}
async function screencastRun(port, opts, act, times, crop, scale = 1) {
  const b = await pw.chromium.launch({ args: ["--force-color-profile=srgb"] });
  const ctx = await b.newContext({ viewport: { width: opts.vw, height: opts.vh }, deviceScaleFactor: 2, colorScheme: opts.scheme, hasTouch: !!opts.touch });
  const p = await ctx.newPage();
  await p.goto(`http://127.0.0.1:${port}/?board=${BOARD}`); await p.waitForSelector(".game-cell"); await p.waitForTimeout(4000);
  const cdp = await ctx.newCDPSession(p); const shots = [];
  cdp.on("Page.screencastFrame", async (f) => { shots.push({ ts: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }); } catch {} });
  await cdp.send("Page.startScreencast", { format: "png", everyNthFrame: 1, maxWidth: opts.vw, maxHeight: opts.vh });
  await p.waitForTimeout(300);
  const t0 = await p.evaluate(() => performance.timeOrigin + performance.now());
  await act(p);
  await p.waitForTimeout(1200);
  await cdp.send("Page.stopScreencast");
  await b.close();
  const tiles = [];
  for (const t of times) {
    const target = t0 + t; const before = shots.filter((s) => s.ts <= target + 4); const s = before[before.length - 1] || shots[0];
    let img = sharp(Buffer.from(s.data, "base64")).extract(crop); if (scale !== 1) img = img.resize(Math.round(crop.width * scale));
    tiles.push({ buf: await img.png().toBuffer(), t: `${t < 0 ? "rest" : "+" + t} (painted +${Math.round(s.ts - t0)})` });
  }
  return tiles;
}
if (which === "c1") {
  const rows = [];
  for (const [name, port] of [["HEAD 1e6cfbbf", 4254], ["prototype", 4253]]) rows.push({ name, tiles: await screencastRun(port, { vw: 1280, vh: 800, scheme: "light" }, (p) => p.click(".sun-moon-toggle", { force: true }), [-50, 270, 530], { left: 560, top: 0, width: 720, height: 420 }, 0.5) });
  await sheet(rows, "c1-m15-toggle-cold-flip-chromium-light-to-dark-1280x800-fine.png", "c1 · chromium · light→dark (cold, first flip) · 1280×800 · fine — screencast frames (the recorder inflates stalls)");
} else if (which === "c2") {
  const rows = [];
  for (const [name, port] of [["HEAD 1e6cfbbf", 4254], ["prototype", 4253]]) rows.push({ name, tiles: await screencastRun(port, { vw: 1280, vh: 800, scheme: "light" }, (p) => p.keyboard.press("g"), [282, 520], { left: 60, top: 60, width: 820, height: 740 }, 0.5) });
  await sheet(rows, "c2-m19-enter-fold-chromium-light-1280x800-fine.png", "c2 · chromium · light · 1280×800 · fine — enter fold, painted frames at +282 / +520 from the press");
} else if (which === "c3") {
  const rows = [];
  for (const [name, port] of [["HEAD 1e6cfbbf", 4254], ["prototype", 4253]]) {
    const tiles = [];
    for (const t of [60, 205]) {
      const b = await pw.webkit.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: "dark", hasTouch: true }); const p = await ctx.newPage();
      await p.goto(`http://127.0.0.1:${port}/?board=${BOARD}`); await p.waitForSelector(".game-cell"); await p.waitForTimeout(4000);
      await p.keyboard.press("g"); await p.waitForTimeout(2000); await p.focus('[role="listbox"]');
      // Freeze the exit at +t into the glide: once the flip-glide movers exist, every animation (the movers
      // and the deck's CSS leave, which start on the same frame) is paused and seeked to t on its own clock.
      await p.keyboard.press("Enter");
      await p.waitForFunction(() => document.getAnimations().some((a) => a.id === "flip-glide"), null, { polling: "raf" });
      const info = await p.evaluate((tt) => { const out = []; for (const a of document.getAnimations()) { a.pause(); if (a.id === "flip-glide" || a.transitionProperty) { a.currentTime = tt; out.push(a.id || a.transitionProperty); } } const c = document.querySelector(".game-card.is-center"); return { seeked: out, card: c ? Math.round(c.getBoundingClientRect().height) : null }; }, t);
      await p.waitForTimeout(150);
      const buf = await p.screenshot({ scale: "css" });
      console.log(name, t, JSON.stringify(info));
      tiles.push({ buf: await sharp(buf).resize(280).png().toBuffer(), t: `+${t} paused · card ${info.card ?? "-"} px` });
      await b.close();
    }
    rows.push({ name, tiles });
  }
  await sheet(rows, "c3-m19-exit-webkit-dark-390x844-coarse.png", "c3 · webkit · dark · 390×844 · coarse (hasTouch) — exit paused at +60 / +205 into the glide");
} else if (which === "c4") {
  const R = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion/rest";
  const rows = [];
  for (const sc of ["light", "dark"]) {
    const tiles = [];
    for (const e of ["chromium", "webkit"]) {
      const f = `${R}/diff-${e}-1280x800-${sc}-playing-grid.png`;
      const m = JSON.parse(process.env[`M_${e}_${sc}`] || "{}");
      tiles.push({ buf: await sharp(f).resize(420).png().toBuffer(), t: `${e} maxΔ ${m.maxChannelDelta ?? "?"} · px>1 ${m.pxOver1 ?? "?"}` });
    }
    rows.push({ name: `grid ${sc}`, tiles });
  }
  await sheet(rows, "c4-m15-grid-rest-diff-armA-vs-head-1280x800-fine.png", "c4 · grid at rest (PRM pose 0), arm A vs HEAD — |Δ|×8 difference image · 1280×800 · fine");
}
