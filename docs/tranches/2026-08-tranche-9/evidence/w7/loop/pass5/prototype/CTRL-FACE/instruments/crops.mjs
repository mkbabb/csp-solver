// CTRL-FACE pass 5 — the four ballot crops. Every panel in one PNG shares engine · theme · viewport ·
// pointer · board (the sudoku payload below); panels differ ONLY by the tree (or LINE_SCOPE).
// usage: node crops.mjs <outDir>
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const sharp = require("sharp");
const OUT = process.argv[2];
const ONLY = process.env.ONLY; // e.g. c4 — re-shoot one crop
const want = (k) => !ONLY || ONLY === k;
const PAYLOAD = "?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const A = { head: "http://127.0.0.1:4235", armA: "http://127.0.0.1:4236", armB: "http://127.0.0.1:4241" };

async function shoot(eng, base, { w, h, touch, prm = true }, pose, clipOf) {
  const b = await pw[eng].launch();
  const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch && w < 1024, deviceScaleFactor: 2, colorScheme: "light", reducedMotion: prm ? "reduce" : "no-preference" });
  const p = await ctx.newPage();
  await p.goto(base + "/" + PAYLOAD);
  await p.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(800);
  if (touch && w < 1024) { await p.locator(".drawer-tab").tap(); }
  let last = "", same = 0; const t0 = Date.now();
  while (Date.now() - t0 < 5000) { const s = await p.evaluate(() => JSON.stringify(document.querySelector(".controls-card")?.getBoundingClientRect())); if (s === last) { if (++same >= 3) break; } else same = 0; last = s; await p.waitForTimeout(120); }
  if (pose) await pose(p);
  const clip = await p.evaluate(clipOf);
  const buf = await p.screenshot({ clip, scale: "device" });
  await b.close();
  return buf;
}
async function row(panels, labels, file) {
  const metas = await Promise.all(panels.map((b) => sharp(b).metadata()));
  const H = Math.max(...metas.map((m) => m.height)) + 36, gap = 16;
  const W = metas.reduce((s, m) => s + m.width, 0) + gap * (panels.length - 1);
  let x = 0; const comp = [];
  panels.forEach((b, i) => {
    comp.push({ input: b, left: x, top: 36 });
    comp.push({ input: Buffer.from(`<svg width="${metas[i].width}" height="36"><text x="4" y="26" font-family="Helvetica" font-size="22" fill="#333">${labels[i]}</text></svg>`), left: x, top: 0 });
    x += metas[i].width + gap;
  });
  await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } }).composite(comp).png({ palette: true, colours: 96, compressionLevel: 9 }).toFile(file);
  const s = (await sharp(file).metadata()).size;
  console.log(file.split("/").pop(), W + "x" + H, s, "B");
}
const cardClip = () => { const c = document.querySelector(".controls-card").getBoundingClientRect(); return { x: c.x, y: c.y, width: c.width, height: c.height }; };

// c1 · T9-M17 — the m17 pose: HEAD | ARM A (one grammar) | ARM B (staged-only line). chromium · light · 1280×800 · fine · scrollTop 0.
if (want("c1"))
{
  const cell = { w: 1280, h: 800, touch: false };
  const pose = async (p) => { await p.evaluate(() => { document.querySelector(".controls-card").scrollTop = 0; }); await p.waitForTimeout(300); };
  const bufs = [];
  for (const k of ["head", "armA", "armB"]) bufs.push(await shoot("chromium", A[k], cell, pose, cardClip));
  await row(bufs, ["HEAD 74a2b5d9", "ARM A · one grammar", "ARM B · staged line only"], `${OUT}/c1-m17-head-armA-armB-chromium-light-1280x800-fine.png`);
}
// c2 · T9-M17 — the dock deal row: HEAD | proto. webkit · light · 390×844 · coarse (hasTouch), sheet settled.
if (want("c2"))
{
  const cell = { w: 390, h: 844, touch: true };
  const clip = () => { const z = document.querySelector(".controls-card .new-game-zone").getBoundingClientRect(); return { x: z.x, y: z.y - 8, width: z.width, height: z.height + 16 }; };
  const bufs = [];
  for (const k of ["head", "armA"]) bufs.push(await shoot("webkit", A[k], cell, null, clip));
  await row(bufs, ["HEAD 74a2b5d9", "proto (ARM A)"], `${OUT}/c2-m17-dock-deal-row-head-proto-webkit-light-390x844-coarse.png`);
}
// c3 · T9-M16 — the crib opened from the top, full motion, read 700 ms after the press: HEAD | proto. chromium · light · 1280×800 · fine.
if (want("c3"))
{
  const cell = { w: 1280, h: 800, touch: false, prm: false };
  const pose = async (p) => {
    await p.evaluate(() => { document.querySelector(".controls-card").scrollTop = 0; });
    await p.waitForTimeout(300);
    const r = await p.evaluate(() => { const b = document.querySelector(".controls-card .action-bar .info-btn").getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; });
    await p.mouse.click(r.x, r.y); await p.mouse.move(2, 2); await p.waitForTimeout(700);
  };
  const clip = () => { const c = document.querySelector(".controls-card").getBoundingClientRect(); const y = c.bottom - 330; return { x: c.x, y, width: c.width, height: 330 }; };
  const bufs = [];
  for (const k of ["head", "armA"]) bufs.push(await shoot("chromium", A[k], cell, pose, clip));
  await row(bufs, ["HEAD 74a2b5d9 · open", "proto · open"], `${OUT}/c3-m16-crib-open-from-top-head-proto-chromium-light-1280x800-fine.png`);
}
// c4 · U-10 caption column — the live well with both captions: proto | HEAD. chromium · light · 320×568 · coarse.
if (want("c4"))
{
  const cell = { w: 320, h: 568, touch: true };
  const clip = () => { const l = [...document.querySelectorAll(".controls-card .zone-row-label")]; const w = l[0].closest(".tray-well").getBoundingClientRect(); return { x: w.x, y: w.y - 34, width: w.width, height: w.height + 40 }; };
  const pose = async (p) => { await p.evaluate(() => { const l = document.querySelector(".controls-card .zone-row-label"); const c = document.querySelector(".controls-card"); c.scrollTop += l.closest(".tray-well").getBoundingClientRect().top - c.getBoundingClientRect().top - 60; }); await p.waitForTimeout(300); };
  const bufs = [];
  for (const k of ["armA", "head"]) bufs.push(await shoot("chromium", A[k], cell, pose, clip));
  await row(bufs, ["proto · each caption its word", "HEAD · the 60px column"], `${OUT}/c4-caption-column-proto-head-chromium-light-320x568-coarse.png`);
}
