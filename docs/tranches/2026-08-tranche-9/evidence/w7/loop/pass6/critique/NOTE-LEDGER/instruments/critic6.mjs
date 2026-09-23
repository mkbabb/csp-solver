// NOTE-LEDGER pass-6 probe. Usage: node ledger6.mjs <chromium|webkit> <arm> <modes,…> [OUT tag]
// The arm's BUILT dist is on :4249 (checked by hash), the control's pre-built dist on :4248
// (`index-CubiZsMVSwTc.js`). ONE payload: the classic easy 9×9, 30 givens, minted with the app's
// codec form (NOTE-ERASE's and the pass-5 critic's), the given-set read back through the input
// corpus before every read. Modes:
//   push  — Element.prototype.animate hooked before any script; keyframe 0/1 of every mover
//   pi    — whole-body census outside `.board-margin` (tag + class + rect + 8 paint props), the
//           arm vs the control and the control vs itself, at P3/P4, desk + phone
//   land  — the landscape cells: line two's sighted depth, its AT reach (aria snapshot), the
//           strip's bytes with line two present vs removed, scrollHeight vs the control
//   rest  — the EMPTY strip at five cells, whole-body π vs the control
//   aa    — the GLYPH-TEXT statistic (registry-v5 §2.11) on line one at P1 (TINT: spent)
//   frames— rest panels for the ballot composite
//   desk  — the run-on gap at P4, 1280 fine
//   watch — the instrumented build's per-write cost at 16×16 (arm = timed)
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync, mkdirSync } from "node:fs";

const [ENG, ARM, MODES = "push", TAG = ""] = process.argv.slice(2);
const B = ENG === "webkit" ? webkit : chromium;
const S = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/nlcrit6-probe";
const OUT = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/nlcrit6-probe";
const PANELS = `${S}/panels`;
mkdirSync(PANELS, { recursive: true });
const PROTO = [process.env.PROTO_URL, process.env.PROTO_ID];
const CONTROL = ["http://127.0.0.1:4231", "index-CubiZsMVSwTc.js"];
const G = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
let cells = "";
for (let i = 0; i < 81; i++) cells += (G[i] ?? 0).toString(36);
const PAYLOAD = Buffer.from(String.fromCharCode(1) + "3." + cells, "latin1").toString("base64url");
const EXPECTED = Array.from({ length: 81 }, (_, i) => (G[i] ? String(G[i]) : ".")).join("");
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const RIGS = {
  desk: { w: 1280, h: 800, coarse: false, dpr: 2 },
  desk1: { w: 1280, h: 800, coarse: false, dpr: 1 },
  phone: { w: 390, h: 844, coarse: true, dpr: 3 },
  phone2: { w: 390, h: 844, coarse: true, dpr: 2 },
  p699: { w: 393, h: 699, coarse: true, dpr: 3 },
  l844: { w: 844, h: 390, coarse: true, dpr: 3 },
  l812: { w: 812, h: 375, coarse: true, dpr: 3 },
};
const out = { engine: ENG, arm: ARM, protoId: PROTO[1], payload: PAYLOAD, rows: [] };
const row = (r) => {
  out.rows.push(r);
  console.log("ROW", JSON.stringify(r).slice(0, 900));
};
const browser = await B.launch();

async function open(srv, rigName, scheme, opts = {}) {
  const r = RIGS[rigName];
  const ctx = await browser.newContext({ viewport: { width: r.w, height: r.h }, deviceScaleFactor: r.dpr, hasTouch: r.coarse, isMobile: r.coarse && ENG === "chromium" });
  await ctx.addInitScript(() => {
    window.__movers = [];
    const real = Element.prototype.animate;
    Element.prototype.animate = function (kf, o) {
      try {
        const k = JSON.parse(JSON.stringify(kf));
        const one = document.querySelector(".board-margin .margin-note");
        const r = one?.getBoundingClientRect();
        window.__movers.push({
          cls: String(this.getAttribute?.("class") ?? ""),
          text: (this.textContent || "").trim().slice(0, 40),
          kf0: k?.[0] ?? null,
          kf1: k?.[k.length - 1] ?? null,
          lineOne: r ? { w: +r.width.toFixed(2), h: +r.height.toFixed(3) } : null,
          lineOneColor: one ? getComputedStyle(one).color : null,
          duration: o?.duration ?? null,
        });
      } catch {}
      return real.call(this, kf, o);
    };
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
  await page.goto(`${srv[0]}/?board=${opts.payload ?? PAYLOAD}`);
  await page.waitForSelector(".game-cell input", { timeout: 60000 });
  if (!opts.payload) {
    let got = "";
    for (let i = 0; i < 100; i++) {
      got = await bs(page);
      if (got === EXPECTED) break;
      await page.waitForTimeout(100);
    }
    if (got !== EXPECTED) throw new Error(`${srv[0]}: payload not dealt ${got}`);
  }
  const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).join(" "));
  if (!id.includes(srv[1])) throw new Error(`${srv[0]} serves ${id}, want ${srv[1]}`);
  const regime = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, dark: matchMedia("(prefers-color-scheme: dark)").matches, landscape: matchMedia("(orientation: landscape)").matches, under1024: matchMedia("(max-width: 1023.98px)").matches }));
  await page.waitForTimeout(1200);
  return { ctx, page, regime };
}
const bs = (p) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => i.value || ".").join(""));
const lines = (p) =>
  p.evaluate(() => {
    const a = document.querySelector(".board-margin .margin-note");
    const b = document.querySelector(".board-margin .margin-note-previous");
    const box = (el) => (el ? (({ width, height }) => ({ w: +width.toFixed(2), h: +height.toFixed(2) }))(el.getBoundingClientRect()) : null);
    return { one: a?.textContent.trim() ?? "", two: b?.textContent.trim() ?? "", spent: !!a?.classList.contains("is-spent"), oneColor: a ? getComputedStyle(a).color : null, twoDisplay: b ? getComputedStyle(b).display : null, oneBox: box(a), twoBox: box(b) };
  });
async function ask(p) {
  await p.evaluate(() => [...document.querySelectorAll(".game-cell input")].find((i) => !i.value)?.focus());
  await p.keyboard.press("h");
  await p.waitForTimeout(900);
  return (await lines(p)).one;
}
async function answer(p) {
  const s = (await lines(p)).one;
  const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1];
  if (!d) throw new Error(`no digit in "${s}"`);
  const t = await p.evaluate(([d, sol]) => [...document.querySelectorAll(".game-cell")].map((c, i) => ({ c, i })).filter(({ c, i }) => c.querySelector(".cell-because") && !c.querySelector("input").value && sol[i] === d).map(({ i }) => i), [d, SOL]);
  if (t.length !== 1) throw new Error(`"${s}": ${t.length} targets`);
  await p.locator(".game-cell input").nth(t[0]).focus();
  await p.keyboard.type(d);
  await p.waitForTimeout(900);
  const v = await p.evaluate((i) => document.querySelectorAll(".game-cell input")[i].value, t[0]);
  if (v !== d) throw new Error("did not land");
}
async function nextWrite(p) {
  const i = await p.evaluate(() => {
    const all = [...document.querySelectorAll(".game-cell input")];
    const el = all.find((x) => !x.value);
    el?.focus();
    return el ? all.indexOf(el) : -1;
  });
  await p.keyboard.type(SOL[i]);
  await p.waitForTimeout(900);
}
/** P1 ask·answer · P2 +next write · P3 ask·answer·ask · P4 ask·answer·ask·answer */
async function drive(p, pose) {
  await ask(p);
  await answer(p);
  if (pose === "P2") await nextWrite(p);
  if (pose === "P3" || pose === "P4") await ask(p);
  if (pose === "P4") await answer(p);
  await p.waitForTimeout(900);
}
const census = (p) =>
  p.evaluate(() => {
    const PR = ["display", "visibility", "color", "backgroundColor", "opacity", "filter", "transform", "fontSize"];
    const res = [];
    for (const el of document.body.querySelectorAll("*")) {
      if (el.closest(".board-margin")) continue;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      res.push({ k: el.tagName + "." + (el.getAttribute("class") ?? "").trim().replace(/\s+/g, "."), x: r.x, y: r.y, w: r.width, h: r.height, p: PR.map((q) => cs[q]).join("|") });
    }
    return { els: res, sh: document.documentElement.scrollHeight, filters: [...document.querySelectorAll("*")].filter((e) => { const f = getComputedStyle(e).filter; return f && f !== "none"; }).length };
  });
function pidiff(a, b) {
  const d = { lenA: a.els.length, lenB: b.els.length, rect: 0, paint: 0, keys: 0, ex: [] };
  const n = Math.min(a.els.length, b.els.length);
  for (let i = 0; i < n; i++) {
    const x = a.els[i], y = b.els[i];
    if (x.k !== y.k) { d.keys++; if (d.ex.length < 6) d.ex.push(["key", x.k, y.k]); continue; }
    const rd = Math.max(...["x", "y", "w", "h"].map((q) => Math.abs(x[q] - y[q])));
    if (rd > 0.01) { d.rect++; if (d.ex.length < 6) d.ex.push(["rect", x.k, +rd.toFixed(2)]); }
    if (x.p !== y.p) { d.paint++; if (d.ex.length < 6) d.ex.push(["paint", x.k, x.p, y.p]); }
  }
  return { ...d, sh: [a.sh, b.sh], filters: [a.filters, b.filters] };
}
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (r, g, b) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const raw = async (buf) => { const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true }); return { data, w: info.width, h: info.height, ch: info.channels }; };
/** NOTE-ERASE's pass-6 glyph-text instrument (PAL-WALK's painted-text method), ported: the ink
 *  twice, the same box with the ink transparent twice; coverage = change over a full-ink change on
 *  the same ground; gate = core median over coverage ≥ 0.5, the fraction under 4.5 stated. */
async function glyphText(p, sel) {
  const ink = p.locator(sel).first();
  const box = await ink.evaluate((el) => { const r = document.createRange(); r.selectNodeContents(el); const b = r.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height }; });
  const clip = { x: Math.floor(box.x) - 1, y: Math.floor(box.y) - 1, width: Math.ceil(box.width) + 3, height: Math.ceil(box.height) + 3 };
  const spec = await ink.evaluate((el) => getComputedStyle(el).color);
  const A = await raw(await p.screenshot({ clip }));
  const A2 = await raw(await p.screenshot({ clip }));
  await ink.evaluate((el) => { el.style.setProperty("transition", "none", "important"); el.style.setProperty("color", "transparent", "important"); });
  for (let i = 0; i < 20 && (await ink.evaluate((el) => getComputedStyle(el).color)) !== "rgba(0, 0, 0, 0)"; i++) await p.waitForTimeout(50);
  const B1 = await raw(await p.screenshot({ clip }));
  const B2 = await raw(await p.screenshot({ clip }));
  await ink.evaluate((el) => { el.style.removeProperty("color"); el.style.removeProperty("transition"); });
  const rgba = await p.evaluate((css) => { const c = document.createElement("canvas"); c.width = c.height = 1; const g = c.getContext("2d", { willReadFrequently: true }); g.fillStyle = css; g.fillRect(0, 0, 1, 1); return Array.from(g.getImageData(0, 0, 1, 1).data); }, spec);
  const a = rgba[3] / 255;
  let noise = 0;
  const pop = [];
  for (let k = 0; k < A.data.length; k += A.ch) {
    const n1 = Math.abs(A.data[k] - A2.data[k]) + Math.abs(A.data[k + 1] - A2.data[k + 1]) + Math.abs(A.data[k + 2] - A2.data[k + 2]);
    const n2 = Math.abs(B1.data[k] - B2.data[k]) + Math.abs(B1.data[k + 1] - B2.data[k + 1]) + Math.abs(B1.data[k + 2] - B2.data[k + 2]);
    if (n1 > 8 || n2 > 8) { noise++; continue; }
    const g = [B1.data[k], B1.data[k + 1], B1.data[k + 2]];
    const full = [0, 1, 2].map((i) => a * rgba[i] + (1 - a) * g[i]);
    const dFull = Math.abs(full[0] - g[0]) + Math.abs(full[1] - g[1]) + Math.abs(full[2] - g[2]);
    const d = Math.abs(A.data[k] - g[0]) + Math.abs(A.data[k + 1] - g[1]) + Math.abs(A.data[k + 2] - g[2]);
    if (dFull < 12 || d < 6) continue;
    pop.push({ cov: Math.min(1, d / dFull), r: ratio(lum(A.data[k], A.data[k + 1], A.data[k + 2]), lum(g[0], g[1], g[2])) });
  }
  const at = (f) => { const r = pop.filter((q) => q.cov >= f).map((q) => q.r).sort((u, v) => u - v); return { n: r.length, median: r.length ? +r[r.length >> 1].toFixed(3) : null, fraction: r.length ? +(r.filter((v) => v < 4.5).length / r.length).toFixed(3) : null, min: r.length ? +r[0].toFixed(3) : null }; };
  return { spec, glyphPx: pop.length, noise, gate: at(0.5), sens: { "0.7": at(0.7), "0.9": at(0.9) } };
}
const aria = (p) => p.locator(".board-margin").ariaSnapshot().catch((e) => `ERR ${e.message}`);
// ─── CRITIC's modes (pass 6) ─────────────────────────────────────────────────────────────
const HOLD = ["http://127.0.0.1:4232", "index-KMC3d3TWjLH2.js"];
const TINT = ["http://127.0.0.1:4233", "index-DxPFe6yRCpJz.js"];
const alphaOf = (c) => { const m = /\/\s*([\d.]+)\s*\)$/.exec(c) || /rgba\([^)]*,\s*([\d.]+)\)$/.exec(c); return m ? +m[1] : 1; };
const PHASE = /\b(is-active|is-pose-active|baked-hidden)\b/g;
function pidiffN(a, b) {
  const d = { lenA: a.els.length, lenB: b.els.length, rect: 0, paint: 0, keyHard: 0, phaseEls: 0, phasePaint: 0, ex: [] };
  const n = Math.min(a.els.length, b.els.length);
  for (let i = 0; i < n; i++) {
    const x = a.els[i], y = b.els[i];
    const nx = x.k.replace(PHASE, "").replace(/\.+/g, ".").replace(/\.$/, ""), ny = y.k.replace(PHASE, "").replace(/\.+/g, ".").replace(/\.$/, "");
    if (nx !== ny) { d.keyHard++; if (d.ex.length < 6) d.ex.push(["key", x.k, y.k]); continue; }
    const phase = x.k !== y.k;
    if (phase) d.phaseEls++;
    const rd = Math.max(...["x", "y", "w", "h"].map((q) => Math.abs(x[q] - y[q])));
    if (rd > 0.01) { d.rect++; if (d.ex.length < 6) d.ex.push(["rect", x.k, +rd.toFixed(2)]); }
    if (x.p !== y.p) { if (phase) d.phasePaint++; else { d.paint++; if (d.ex.length < 6) d.ex.push(["paint", x.k, x.p, y.p]); } }
  }
  return { ...d, sh: [a.sh, b.sh], filters: [a.filters, b.filters] };
}
try {
  for (const mode of MODES.split(",")) {
    if (mode === "push")
      for (const [armName, srv] of [["tint", TINT], ["hold", HOLD]])
        for (const rig of ["phone2", "desk"])
          for (const scheme of ["light", "dark"]) {
            const { ctx, page, regime } = await open(srv, rig, scheme);
            await ask(page); await answer(page); await page.waitForTimeout(600);
            const before = await lines(page);
            await page.evaluate(() => {
              window.__movers = []; window.__samples = [];
              const t0 = performance.now();
              const tick = () => { const m = document.querySelector(".board-margin .margin-note-previous"); if (m) window.__samples.push({ t: +(performance.now() - t0).toFixed(1), c: getComputedStyle(m).color, anim: m.getAnimations().length }); if (performance.now() - t0 < 700) requestAnimationFrame(tick); };
              requestAnimationFrame(tick);
            });
            await ask(page);
            const movers = await page.evaluate(() => window.__movers);
            const samples = await page.evaluate(() => window.__samples);
            const animated = samples.filter((s) => s.anim > 0);
            row({ m: "push", arm: armName, rig, scheme, regime, before: { one: before.one, spent: before.spent, oneColor: before.oneColor, alpha: alphaOf(before.oneColor || "") }, after: await lines(page),
              movers: movers.map((m) => ({ cls: m.cls, text: m.text, kf0c: m.kf0?.color ?? null, kf1c: m.kf1?.color ?? null, kf0t: m.kf0?.transform ?? null })),
              sampled: { frames: samples.length, animatedFrames: animated.length, maxAlphaWhileAnimated: animated.length ? Math.max(...animated.map((s) => alphaOf(s.c))) : null, firstAnimated: animated[0]?.c ?? null } });
            await ctx.close();
          }
    if (mode === "land")
      for (const rig of ["l844", "l812"]) {
        const { ctx, page, regime } = await open(HOLD, rig, "light");
        await drive(page, "P3");
        const l = await lines(page);
        const two = await page.evaluate(() => { const t = document.querySelector(".board-margin .margin-note-previous"); if (!t) return null; const cs = getComputedStyle(t); const r = t.getBoundingClientRect(); return { clip: cs.clipPath, pos: cs.position, disp: cs.display, vis: cs.visibility, rect: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(2)), sh: document.documentElement.scrollHeight, hit: (() => { const e = document.elementFromPoint(r.x + 0.5, r.y + 0.5); return e ? e.className?.baseVal ?? e.className : null; })() }; });
        const a1 = await aria(page);
        const strip = await page.evaluate(() => { const b = document.querySelector(".board-margin").getBoundingClientRect(); return { x: Math.max(0, Math.floor(b.x) - 4), y: Math.max(0, Math.floor(b.y) - 4), width: Math.ceil(b.width) + 8, height: Math.ceil(b.height) + 30 }; });
        const x = await raw(await page.screenshot({ clip: strip }));
        const y = await raw(await page.screenshot({ clip: strip }));
        await page.addStyleTag({ content: ".board-margin .margin-note-previous{display:none !important}" });
        await page.waitForTimeout(250);
        const z = await raw(await page.screenshot({ clip: strip }));
        const shNone = await page.evaluate(() => document.documentElement.scrollHeight);
        const diff = (u, v) => { let n = 0; for (let k = 0; k < u.data.length; k += u.ch) if (u.data[k] !== v.data[k] || u.data[k + 1] !== v.data[k + 1] || u.data[k + 2] !== v.data[k + 2]) n++; return n; };
        await ctx.close();
        const c = await open(CONTROL, rig, "light");
        await drive(c.page, "P3");
        const cl = await lines(c.page); const csh = await c.page.evaluate(() => document.documentElement.scrollHeight); const ca = await aria(c.page);
        await c.ctx.close();
        row({ m: "land", rig, regime, lines: l, two, ariaTwoNamed: !!l.two && a1.includes(l.two), aria: a1, bytes: { clippedVsNone: diff(x, z), selfNoise: diff(x, y), px: x.w * x.h }, shNone, control: { lines: cl, sh: csh, aria: ca } });
      }
    if (mode === "aa")
      for (const [rig, scheme] of [["desk1", "light"], ["desk1", "dark"], ["phone2", "light"]])
        for (const [name, srv] of [["tint", TINT], ["hold", HOLD], ["control", CONTROL]]) {
          const { ctx, page, regime } = await open(srv, rig, scheme);
          await ask(page);
          if (name !== "control") await answer(page);
          await page.waitForTimeout(700);
          const l = await lines(page);
          row({ m: "aa", rig, scheme, arm: name, regime, lines: { one: l.one, spent: l.spent, color: l.oneColor }, glyph: l.one ? await glyphText(page, ".board-margin .margin-note-ink") : "EMPTY" });
          await ctx.close();
        }
    if (mode === "pi")
      for (const rig of ["phone2", "desk"]) {
        const reads = {};
        for (const [name, srv] of [["control", CONTROL], ["hold", HOLD], ["control2", CONTROL]]) {
          const { ctx, page } = await open(srv, rig, "light");
          await drive(page, "P4");
          reads[name] = { l: await lines(page), c: await census(page) };
          await ctx.close();
        }
        row({ m: "pi", rig, pose: "P4", lines: { hold: reads.hold.l, control: reads.control.l }, holdVsControl: pidiffN(reads.hold.c, reads.control.c), controlVsControl: pidiffN(reads.control2.c, reads.control.c) });
      }
  }
} catch (e) { console.log("ERR", e.stack); out.err = e.message; }
writeFileSync(`${OUT}/crit-${ENG}-${MODES.replace(/,/g, "+")}.json`, JSON.stringify(out, null, 1));
await browser.close();
console.log("DONE");
