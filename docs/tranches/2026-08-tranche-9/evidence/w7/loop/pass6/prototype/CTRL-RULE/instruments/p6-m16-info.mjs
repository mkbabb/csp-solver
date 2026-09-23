// T9-W7 pass 6 · CTRL-RULE — charter row 11: T9-M16's foot arm on THIS foot (the `i` in the case's
// foot opens the keys fold) read with CTRL-FACE's crib metrics G1/G2/G3/G5 in their pass-5 sense,
// and the `.info-btn` focus RING against the foot's new drawn edge (MRK-ABS's 2.608 / 2.418 row).
//   G1  every `#keys-fold kbd, dd` is topmost at its own centre and inside the card's scrollport
//   G2  the card's scrollTop change on open, and scrollIntoView calls counted (patched prototype)
//   G3  the foot's four verbs' drift, open vs closed (max |Δx|,|Δy|)
//   G5  live controls in the case whose centre is covered by something else, after open
//   RING keyboard focus (a key press first, so :focus-visible), DPR 2: ring-ON vs `outline: none`
//        — every moved pixel's contrast vs its OFF ground; core = moved ≥ X × p98 move for
//        X = 0.5/0.7/0.9/1.0 → median + fraction < 3; TWO bare photographs, the minimum taken;
//        and the ring's outer box against the foot rule's painted box (overlap in css px).
// node p6-m16-info.mjs <chromium|webkit> <BASE> <arm>
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
const [ENGINE, BASE, ARM = "proto"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Lum = (d, i) => 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const rows = [];
async function ringStat(p, clip) {
  const shot = async () => sharp(await p.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true });
  const on = await shot();
  const tag = await p.addStyleTag({ content: ".info-btn, .info-btn * { outline: none !important; }" });
  const off = await shot();
  await tag.evaluate((n) => n.remove());
  const moved = [];
  for (let i = 0; i < on.data.length; i += on.info.channels) {
    const d = Math.max(Math.abs(on.data[i] - off.data[i]), Math.abs(on.data[i + 1] - off.data[i + 1]), Math.abs(on.data[i + 2] - off.data[i + 2]));
    if (d <= 8) continue;
    const la = Lum(on.data, i), lb = Lum(off.data, i);
    moved.push({ m: Math.abs(la - lb), r: (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05) });
  }
  const ms = moved.map((x) => x.m).sort((a, b) => a - b);
  const ref = ms.length ? ms[Math.floor(0.98 * (ms.length - 1))] : 0;
  const o = { n: moved.length };
  for (const X of [0.5, 0.7, 0.9, 1.0]) {
    const core = moved.filter((x) => x.m >= X * ref - 1e-12).map((x) => x.r).sort((a, b) => a - b);
    o[`c${X * 100}`] = core.length ? { median: +core[core.length >> 1].toFixed(3), under3: +(core.filter((r) => r < 3).length / core.length).toFixed(3) } : null;
  }
  return o;
}
for (const theme of ["light", "dark"]) for (const [w, h] of [[1024, 768], [1280, 800], [1440, 900]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, colorScheme: theme });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, theme);
  await ctx.addInitScript(() => { window.__siv = 0; const f = Element.prototype.scrollIntoView; Element.prototype.scrollIntoView = function (...a) { window.__siv++; return f.apply(this, a); }; });
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1800);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
  let last = -1; for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case").getBoundingClientRect().left); if (Math.abs(t - last) < 0.01) break; last = t; }
  const verbs = () => p.evaluate(() => [...document.querySelectorAll(".action-verbs > .icon-btn")].map((b) => { const r = b.getBoundingClientRect(); return [r.left, r.top]; }));
  const before = { st: await p.evaluate(() => document.querySelector(".controls-card").scrollTop), v: await verbs() };
  const btn = p.locator(".info-btn");
  if (!(await btn.count())) { rows.push({ theme, cell: `${w}x${h}`, err: "no .info-btn" }); await ctx.close(); continue; }
  const bb = await btn.boundingBox();
  await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  last = -1; for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".controls-card").scrollTop); if (Math.abs(t - last) < 0.01 && i > 5) break; last = t; }
  const after = await p.evaluate(() => {
    const card = document.querySelector(".controls-card"); const cb = card.getBoundingClientRect();
    const clipT = cb.top + card.clientTop, clipB = clipT + card.clientHeight;
    const legend = [...document.querySelectorAll("#keys-fold kbd, #keys-fold dd")].filter((e) => e.getBoundingClientRect().width > 0);
    let top = 0, inPort = 0;
    for (const e of legend) { const r = e.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2; const hit = document.elementFromPoint(x, y); if (hit && (hit === e || e.contains(hit))) top++; if (y >= clipT && y <= clipB) inPort++; }
    let covered = 0, live = 0;
    for (const c of document.querySelectorAll(".drawer-case :is(button, input, [tabindex='0'])")) { if (c.closest("[inert]") || !c.checkVisibility?.({ visibilityProperty: true })) continue; const r = c.getBoundingClientRect(); const y = r.top + r.height / 2; if (card.contains(c) && (y < clipT || y > clipB)) continue; if (r.width < 1) continue; live++; const hit = document.elementFromPoint(r.left + r.width / 2, y); if (!hit || !(hit === c || c.contains(hit) || hit.contains(c))) covered++; }
    return { st: card.scrollTop, siv: window.__siv, legend: legend.length, topmost: top, inPort, live, covered, open: document.getElementById("keys-fold")?.classList.contains("is-open") };
  });
  const v2 = await verbs();
  const drift = +Math.max(0, ...before.v.map((a, i) => Math.max(Math.abs(a[0] - v2[i][0]), Math.abs(a[1] - v2[i][1])))).toFixed(2);
  // close it again, then the RING (keyboard route)
  await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
  await p.waitForTimeout(400);
  // the KEYBOARD route in both engines: focus the verb before it, then Tab (a programmatic focus
  // after a key press is :focus-visible in chromium but not in webkit — measured, first run)
  await p.locator(".action-verbs > .icon-btn").last().focus();
  for (let i = 0; i < 12; i++) {
    await p.keyboard.press(ENGINE === "webkit" ? "Alt+Tab" : "Tab"); // WebKit tabs to buttons on Option+Tab (measured)
    if (await btn.evaluate((e) => document.activeElement === e)) break;
  }
  const fv = await btn.evaluate((e) => document.activeElement === e && e.matches(":focus-visible"));
  const geo = await p.evaluate(() => {
    const b = document.querySelector(".info-btn"); const r = b.getBoundingClientRect(); const cs = getComputedStyle(b);
    const ow = parseFloat(cs.outlineWidth) || 0, oo = parseFloat(cs.outlineOffset) || 0, e = ow + oo;
    const ring = { l: r.left - e, t: r.top - e, r: r.right + e, b: r.bottom + e };
    const path = document.querySelector("#card-foot svg.ruled-line path"); let rule = null, overlap = null;
    if (path) { const m = path.getScreenCTM(), bb = path.getBBox(); const a = new DOMPoint(bb.x, bb.y).matrixTransform(m), c = new DOMPoint(bb.x + bb.width, bb.y + bb.height).matrixTransform(m); rule = { t: Math.min(a.y, c.y), b: Math.max(a.y, c.y) }; overlap = +(Math.min(ring.b, rule.b + 1.5) - Math.max(ring.t, rule.t - 1.5)).toFixed(2); }
    return { outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, offset: cs.outlineOffset, ring: Object.fromEntries(Object.entries(ring).map(([k, v]) => [k, +v.toFixed(2)])), ruleVsRingOverlapPx: overlap };
  });
  const clip = { x: geo.ring.l - 4, y: geo.ring.t - 4, width: geo.ring.r - geo.ring.l + 8, height: geo.ring.b - geo.ring.t + 8 };
  const s1 = await ringStat(p, clip), s2 = await ringStat(p, clip);
  const ring = {}; for (const k of ["c50", "c70", "c90", "c100"]) ring[k] = s1[k] && s2[k] ? { median: Math.min(s1[k].median, s2[k].median), under3: Math.max(s1[k].under3, s2[k].under3) } : null;
  rows.push({ theme, cell: `${w}x${h} fine`, G2: { dScroll: +(after.st - before.st).toFixed(2), scrollIntoView: after.siv }, G1: { legend: after.legend, topmost: after.topmost, inScrollport: after.inPort }, G3drift: drift, G5: { live: after.live, covered: after.covered }, open: after.open, focusVisible: fv, ...geo, ringN: [s1.n, s2.n], ring });
  console.log(ENGINE, ARM, JSON.stringify(rows.at(-1)));
  await ctx.close();
}
writeFileSync(join(OUT, `p6-m16-info-${ARM}-${ENGINE}.json`), JSON.stringify({ engine: ENGINE, arm: ARM, base: BASE, board: BOARD, rows }, null, 1));
await browser.close();
console.log("EXIT OK");
