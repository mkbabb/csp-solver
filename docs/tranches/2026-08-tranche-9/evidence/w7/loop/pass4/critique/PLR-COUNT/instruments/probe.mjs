// PLR-COUNT pass-4 CRITIC probe — independent of the prototype's instruments.
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import fs from "node:fs";
const OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
const PROTO = "http://127.0.0.1:4240", CTRL = "http://127.0.0.1:4239", PDEV = "http://127.0.0.1:4238", CDEV = "http://127.0.0.1:4241";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const engines = (process.env.ENG ?? "chromium,webkit").split(",");
const only = (process.env.ONLY ?? "pi,ink,g9,keys,filter").split(",");
const res = {};
const settled = async (page) => {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  for (let i = 0; i < 120; i++) { if (await page.locator(".sudoku-cell .glyph-svg").count()) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(800);
};
const hi = (page, room, ids, kind = "hi") => page.evaluate(({ room, ids, kind }) => {
  const w = window; w.__cc ??= new BroadcastChannel(`board:${room}`);
  for (const from of ids) w.__cc.postMessage({ kind, data: {}, from });
}, { room, ids, kind });
const head = (page) => page.evaluate(() => {
  const m = [...document.querySelectorAll("[data-player-mark]")].find((e) => e.getBoundingClientRect().width > 0);
  if (!m) return null;
  const b = m.getBoundingClientRect(); const pose = m.querySelector(".pt-pose"); const c = m.querySelector(".pt-count");
  return { label: m.getAttribute("aria-label"), x: b.x, y: b.y, w: +b.width.toFixed(2), h: +b.height.toFixed(2),
    strokes: pose ? pose.querySelectorAll("path").length : 0, written: c?.textContent ?? null,
    px: c ? getComputedStyle(c).fontSize : null, color: c ? getComputedStyle(c).color : null,
    expanded: m.getAttribute("aria-expanded"),
    offs: pose ? [...pose.querySelectorAll("path")].map((p) => p.getAttribute("stroke-dashoffset")) : [] };
});
const toDark = async (page) => {
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  for (let i = 0; i < 20 && !(await page.evaluate(() => document.documentElement.classList.contains("dark"))); i++) await page.waitForTimeout(200);
  await page.evaluate(() => document.activeElement?.blur()); await page.mouse.move(5, 700).catch(() => {}); await page.waitForTimeout(600);
};
const SEL = [".page-root", ".corner-left", ".corner-right", ".mobile-attribution", ".handwritten-logo", ".board-wrapper", ".controls-card", ".sudoku-cell", ".action-bar", ".attribution-card"];
const census = (page) => page.evaluate((SEL) => {
  const o = {};
  for (const s of SEL) { const e = [...document.querySelectorAll(s)].find((x) => x.getBoundingClientRect().width > 0); if (!e) { o[s] = null; continue; }
    const b = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    o[s] = { tag: e.tagName, x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2), color: cs.color, bg: cs.backgroundColor, ff: cs.fontFamily, fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight, filter: cs.filter }; }
  o.cell0 = document.querySelector(".sudoku-cell input")?.value ?? document.querySelector(".sudoku-cell")?.textContent?.trim()?.slice(0, 2);
  o.coarse = matchMedia("(pointer: coarse)").matches; return o;
}, SEL);
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const Y = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const wc = (a, b) => { const [x, y] = [Y(a), Y(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
async function raw(file) { const img = sharp(file); const { width, height } = await img.metadata(); const buf = await img.removeAlpha().raw().toBuffer(); return { width, height, buf }; }

for (const name of engines) {
  const E = name === "chromium" ? chromium : webkit; const br = await E.launch(); res[name] = {};
  // ── π: dist vs control, desk fine and phone coarse, solo, same board
  if (only.includes("pi")) for (const [scene, opt] of [["desk", { viewport: { width: 1280, height: 800 } }], ["phone", { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: name === "chromium", deviceScaleFactor: 3 }]]) {
    const ctx = await br.newContext(opt); const a = await ctx.newPage(); const b = await ctx.newPage();
    await a.goto(`${PROTO}/?size=3&board=${BOARD}`); await b.goto(`${CTRL}/?size=3&board=${BOARD}`);
    await settled(a); await settled(b);
    const ca = await census(a), cb = await census(b); const diffs = [];
    for (const s of Object.keys(ca)) { if (JSON.stringify(ca[s]) === JSON.stringify(cb[s])) continue;
      if (ca[s] && cb[s] && typeof ca[s] === "object") for (const k of Object.keys(ca[s])) { if (ca[s][k] !== cb[s][k]) diffs.push(`${s}.${k}: ${cb[s][k]} -> ${ca[s][k]}`); } else diffs.push(`${s}: ${JSON.stringify(cb[s])} -> ${JSON.stringify(ca[s])}`); }
    res[name]["pi_" + scene] = { diffs, coarse: [ca.coarse, cb.coarse], cell0: [ca.cell0, cb.cell0] };
    console.log(name, "pi", scene, JSON.stringify(res[name]["pi_" + scene])); await ctx.close();
  }
  // ── ink: N=1,5,6 light/dark, 390 coarse dpr3, crop around the mark
  if (only.includes("ink")) for (const theme of ["light", "dark"]) {
    const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 3, reducedMotion: "reduce" });
    const page = await ctx.newPage(); const room = `crit-ink-${name}-${theme}-${Date.now()}`;
    await page.goto(`${PDEV}/?size=3&board=${BOARD}&wire=local&s=${room}`); await settled(page);
    if (theme === "dark") await toDark(page);
    const shots = {}; let at = 1;
    for (const N of [1, 2, 5, 6]) {
      const ids = []; for (let i = at; i < N; i++) ids.push(`ink-${i}`); if (ids.length) await hi(page, room, ids); at = N;
      await page.waitForTimeout(1200); const h = await head(page);
      const clip = { x: h.x - 2, y: h.y - 2, width: 80, height: h.h + 4 };
      const f = `${OUT}/${name}-${theme}-N${N}.png`; await page.screenshot({ path: f, clip });
      shots[N] = { f, h };
    }
    const crops = {}; let D = 0;
    for (const N of Object.keys(shots)) { const r = await raw(shots[N].f); const ground = [r.buf[0], r.buf[1], r.buf[2]]; let core = 0, corePx = ground;
      for (let i = 0; i < r.buf.length; i += 3) { const p = [r.buf[i], r.buf[i + 1], r.buf[i + 2]]; const d = Math.abs(Y(p) - Y(ground)); if (d > core) { core = d; corePx = p; } }
      crops[N] = { r, ground, core, corePx }; D = Math.max(D, core); }
    const row = {};
    for (const N of Object.keys(crops)) { const { r, ground, corePx } = crops[N]; let mass = 0;
      for (let i = 0; i < r.buf.length; i += 3) { const d = Math.abs(Y([r.buf[i], r.buf[i + 1], r.buf[i + 2]]) - Y(ground)); if (d > 0.01) mass += Math.min(1, d / D); }
      row["N" + N] = { mass: +(mass / 9).toFixed(2), coreContrast: +wc(corePx, ground).toFixed(3), label: shots[N].h.label, h: shots[N].h.h, w: shots[N].h.w, written: shots[N].h.written, px: shots[N].h.px, ground };
    }
    row.ratio6to5 = +(row.N6.mass / row.N5.mass).toFixed(3); row.ratio6to1 = +(row.N6.mass / row.N1.mass).toFixed(3); row.ratio6to2 = +(row.N6.mass / row.N2.mass).toFixed(3);
    res[name]["ink_" + theme] = row; console.log(name, "ink", theme, JSON.stringify(row)); await ctx.close();
  }
  // ── G9 inner leaver, first frames by rAF
  if (only.includes("g9")) { const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage(); const room = `crit-g9-${Date.now()}`;
    await page.goto(`${PDEV}/?size=3&board=${BOARD}&wire=local&s=${room}`); await settled(page);
    await hi(page, room, ["a0", "a1", "a2", "a3", "a4"]); await page.waitForTimeout(1200);
    const before = await head(page);
    const trace = await page.evaluate(({ room }) => new Promise((done) => { const ch = new BroadcastChannel(`board:${room}`); const out = []; const t0 = performance.now();
      ch.postMessage({ kind: "bye", data: {}, from: "a1" });
      const tick = () => { const m = [...document.querySelectorAll("[data-player-mark]")].find((e) => e.getBoundingClientRect().width > 0); const g = m?.querySelector(".pt-pose");
        out.push(g ? [...g.querySelectorAll("path")].map((p) => p.getAttribute("stroke-dashoffset")) : (m?.querySelector(".pt-count")?.textContent ?? "?"));
        if (performance.now() - t0 < 600) requestAnimationFrame(tick); else { ch.close(); done(out); } }; requestAnimationFrame(tick); }), { room });
    const firstDrawn = trace.find((x) => Array.isArray(x));
    res[name].g9 = { before: before.written, firstDrawn, frames: trace.length, last: trace[trace.length - 1] };
    console.log(name, "g9", JSON.stringify(res[name].g9)); await ctx.close(); }
  // ── keys: mouse open keeps caret, Escape keeps caret, focus elsewhere shuts
  if (only.includes("keys")) { const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } }); const page = await ctx.newPage(); const room = `crit-keys-${Date.now()}`;
    await page.goto(`${PDEV}/?size=3&board=${BOARD}&wire=local&s=${room}`); await settled(page); await hi(page, room, ["k0", "k1"]); await page.waitForTimeout(900);
    const act = () => page.evaluate(() => document.activeElement?.tagName + "." + (document.activeElement?.className?.toString?.().slice(0, 30) ?? ""));
    const cells = page.locator(".sudoku-cell input"); const n = await cells.count();
    // an empty cell's input
    await cells.nth(2).click(); const a0 = await act();
    const mk = page.locator("[data-player-mark]:visible").first(); await mk.click(); await page.waitForTimeout(300);
    const r1 = { exp: (await head(page)).expanded, act: await act() };
    await page.keyboard.press("Escape"); await page.waitForTimeout(300);
    const r2 = { exp: (await head(page)).expanded, act: await act() };
    await mk.click(); await page.waitForTimeout(300); const r3 = (await head(page)).expanded;
    await page.evaluate(() => document.querySelectorAll(".sudoku-cell input")[5]?.focus()); await page.waitForTimeout(300);
    const r4 = { exp: (await head(page)).expanded, act: await act() };
    // keyboard open, then focus stays on the mark: sheet stays open
    await mk.focus(); await page.keyboard.press("Space"); await page.waitForTimeout(300); const r5 = (await head(page)).expanded;
    await page.keyboard.press("Escape"); await page.waitForTimeout(300); const r6 = { exp: (await head(page)).expanded, act: await act() };
    res[name].keys = { inputs: n, a0, mouseOpen: r1, afterEscape: r2, reopen: r3, afterFocusElsewhere: r4, kbdOpen: r5, kbdEscape: r6 };
    console.log(name, "keys", JSON.stringify(res[name].keys)); await ctx.close(); }
  // ── filter census on the BUILT dist, room of 5 sheet open vs control same URL
  if (only.includes("filter")) for (const prm of ["no-preference", "reduce"]) { const out = {};
    for (const [arm, base, room5] of [["protoDevRoom5", PDEV, true], ["ctrlDevRoom5", CDEV, true], ["protoDistSolo", PROTO, false], ["ctrlDistSolo", CTRL, false]]) { const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: prm }); const page = await ctx.newPage(); const room = `crit-f-${arm}-${Date.now()}`;
      await page.goto(`${base}/?size=3&board=${BOARD}&wire=local&s=${room}`); await settled(page); await hi(page, room, ["f0", "f1", "f2", "f3"]); await page.waitForTimeout(1200);
      const mk = page.locator("[data-player-mark]:visible").first(); if (await mk.count()) { await mk.click(); await page.waitForTimeout(400); }
      out[arm] = await page.evaluate(() => { let n = 0, inMark = 0; const ids = new Set();
        for (const e of document.querySelectorAll("*")) { const cs = getComputedStyle(e); if (cs.filter === "none" || cs.display === "none") continue; n++; for (const m of cs.filter.matchAll(/url\(["']?#([^)"']+)/g)) ids.add(m[1]); if (e.closest("[data-player-mark],[data-lobby]")) inMark++; }
        const m = [...document.querySelectorAll("[data-player-mark]")].find((x) => x.getBoundingClientRect().width > 0);
        return { n, inMark, ids: [...ids].sort(), open: m?.getAttribute("aria-expanded") ?? null, label: m?.getAttribute("aria-label") ?? null, strokes: m?.querySelectorAll(".pt-pose.is-active path").length ?? null }; });
      await ctx.close(); }
    res[name]["filter_" + prm] = out; console.log(name, "filter", prm, JSON.stringify(out)); }
  // ── like-for-like room π and live regions: DEV proto vs DEV control, room of 3, desk
  if (only.includes("room")) { const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } }); const r = {};
    for (const [arm, base] of [["ctrl", CDEV], ["proto", PDEV]]) { const page = await ctx.newPage(); const room = `crit-r-${arm}-${Date.now()}`;
      await page.goto(`${base}/?size=3&board=${BOARD}&wire=local&s=${room}`); await settled(page);
      const live0 = await page.evaluate(() => [...document.querySelectorAll("[aria-live],[role=log],[role=status],[role=alert]")].length);
      await hi(page, room, ["r0", "r1"]); await page.waitForTimeout(1500);
      r[arm] = { c: await census(page), live0, live: await page.evaluate(() => [...document.querySelectorAll("[aria-live],[role=log],[role=status],[role=alert]")].map((e) => e.tagName.toLowerCase() + "." + [...e.classList].slice(0, 2).join("."))),
        roomSaid: await page.evaluate(() => document.body.innerText.match(/\d+ (other )?players?/g)?.slice(0, 4) ?? null) }; }
    const diffs = []; for (const s of Object.keys(r.ctrl.c)) { const a = r.proto.c[s], b = r.ctrl.c[s]; if (JSON.stringify(a) === JSON.stringify(b)) continue; if (a && b && typeof a === "object") { for (const k of Object.keys(a)) if (a[k] !== b[k]) diffs.push(`${s}.${k}: ${b[k]} -> ${a[k]}`); } else diffs.push(`${s}: ${JSON.stringify(b)} -> ${JSON.stringify(a)}`); }
    res[name].room3 = { diffs, live: { ctrl: [r.ctrl.live0, r.ctrl.live.length], proto: [r.proto.live0, r.proto.live.length] }, liveCtrl: r.ctrl.live, liveProto: r.proto.live, said: { ctrl: r.ctrl.roomSaid, proto: r.proto.roomSaid } };
    console.log(name, "room3", JSON.stringify(res[name].room3)); await ctx.close(); }
  await br.close();
}
fs.writeFileSync(`${OUT}/probe-${engines.join("-")}-${only.join("-")}.json`, JSON.stringify(res, null, 1));
console.log("DONE");
