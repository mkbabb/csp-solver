// NOTE-LEDGER pass-5 CRITIC probe (mine; not the prototype's). Usage: node critic.mjs <chromium|webkit>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
const ENG = process.argv[2]; const B = ENG === "webkit" ? webkit : chromium;
const ONLY = process.argv[3] ?? "all";
const S = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger-critic";
const SRV = { control: ["http://127.0.0.1:4230", "index-CubiZsMVSwTc.js"], hold: ["http://127.0.0.1:4231", "index-Cder9HygqQ5l.js"], tint: ["http://127.0.0.1:4232", "index-BXE037scA9iq.js"] };
const G = {0:5,1:3,4:7,9:6,12:1,13:9,14:5,19:9,20:8,25:6,27:8,31:6,35:3,36:4,39:8,41:3,44:1,45:7,49:2,53:6,55:6,60:2,61:8,66:4,67:1,68:9,71:5,76:8,79:7,80:9};
let cells = ""; for (let i = 0; i < 81; i++) cells += (G[i] ?? 0).toString(36);
const PAYLOAD = Buffer.from(String.fromCharCode(1) + "3." + cells, "latin1").toString("base64url");
const EXPECTED = Array.from({ length: 81 }, (_, i) => (G[i] ? String(G[i]) : ".")).join("");
const SOL = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const out = { engine: ENG, payload: PAYLOAD, rows: [] }; const row = (r) => { out.rows.push(r); console.log("ROW", JSON.stringify(r).slice(0, 600)); };
const RIGS = { desk: { w: 1280, h: 800, coarse: false, dpr: 2 }, phone: { w: 390, h: 844, coarse: true, dpr: 3 }, land: { w: 844, h: 390, coarse: true, dpr: 3 } };
const browser = await B.launch();
async function open(arm, rig, scheme) {
  const r = RIGS[rig];
  const ctx = await browser.newContext({ viewport: { width: r.w, height: r.h }, deviceScaleFactor: r.dpr, hasTouch: r.coarse, isMobile: r.coarse && ENG === "chromium" });
  await ctx.addInitScript(() => {
    window.__push = []; const real = Element.prototype.animate;
    Element.prototype.animate = function (kf, o) { try { if (String(this.className).includes("margin-note-previous")) { const k = JSON.parse(JSON.stringify(kf)); window.__push.push({ kf0color: k?.[0]?.color ?? null, kf1color: k?.[1]?.color ?? null, kf0t: k?.[0]?.transform ?? null, text: this.textContent.trim() }); } } catch {} return real.call(this, kf, o); };
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
  await page.goto(`${SRV[arm][0]}/?board=${PAYLOAD}`);
  await page.waitForSelector(".game-cell input", { timeout: 60000 });
  let got = ""; for (let i = 0; i < 100; i++) { got = await bs(page); if (got === EXPECTED) break; await page.waitForTimeout(100); }
  if (got !== EXPECTED) throw new Error(`${arm}: payload not dealt ${got}`);
  const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).join(" "));
  if (!id.includes(SRV[arm][1])) throw new Error(`${arm} serves ${id}`);
  const regime = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, dark: matchMedia("(prefers-color-scheme: dark)").matches }));
  await page.waitForTimeout(1200);
  return { ctx, page, regime };
}
const bs = (p) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => i.value || ".").join(""));
const lines = (p) => p.evaluate(() => { const a = document.querySelector(".board-margin .margin-note"); const b = document.querySelector(".board-margin .margin-note-previous");
  return { one: a?.textContent.trim() ?? "", two: b?.textContent.trim() ?? "", spent: !!a?.classList.contains("is-spent"), oneColor: a ? getComputedStyle(a).color : null, twoDisplay: b ? getComputedStyle(b).display : null }; });
async function ask(p) { await p.evaluate(() => { const e = [...document.querySelectorAll(".game-cell input")].filter((i) => !i.value); e[0]?.focus(); }); await p.keyboard.press("h"); await p.waitForTimeout(900); return (await lines(p)).one; }
async function answer(p) {
  const s = (await lines(p)).one; const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1];
  if (!d) throw new Error(`no digit in "${s}"`);
  const t = await p.evaluate(([d, sol]) => [...document.querySelectorAll(".game-cell")].map((c, i) => ({ c, i })).filter(({ c, i }) => c.querySelector(".cell-because") && !c.querySelector("input").value && sol[i] === d).map(({ i }) => i), [d, SOL]);
  if (t.length !== 1) throw new Error(`"${s}": ${t.length} targets`);
  await p.locator(".game-cell input").nth(t[0]).focus(); await p.keyboard.type(d); await p.waitForTimeout(900);
  const v = await p.evaluate((i) => document.querySelectorAll(".game-cell input")[i].value, t[0]); if (v !== d) throw new Error("did not land");
}
async function drive(p, pose) { await ask(p); await answer(p); if (pose !== "P1") await ask(p); if (pose === "P4") await answer(p); await p.waitForTimeout(900); }
// π: every element outside .board-margin: tag, class, rect, 8 paint props
const census = (p) => p.evaluate(() => { const PR = ["display","visibility","color","backgroundColor","opacity","filter","transform","fontSize"]; const res = [];
  for (const el of document.body.querySelectorAll("*")) { if (el.closest(".board-margin")) continue; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    res.push({ k: el.tagName + "." + (typeof el.className === "string" ? el.className : el.getAttribute("class") ?? "").trim().replace(/\s+/g, "."), x: r.x, y: r.y, w: r.width, h: r.height, p: PR.map((q) => cs[q]).join("|") }); }
  return { els: res, sh: document.documentElement.scrollHeight, filters: [...document.querySelectorAll("*")].filter((e) => { const f = getComputedStyle(e).filter; return f && f !== "none"; }).length }; });
function pidiff(a, b) { const d = { lenA: a.els.length, lenB: b.els.length, rect: 0, paint: 0, keys: 0, ex: [] }; const n = Math.min(a.els.length, b.els.length);
  for (let i = 0; i < n; i++) { const x = a.els[i], y = b.els[i]; if (x.k !== y.k) { d.keys++; if (d.ex.length < 6) d.ex.push(["key", x.k, y.k]); continue; }
    const rd = Math.max(...["x","y","w","h"].map((q) => Math.abs(x[q] - y[q]))); if (rd > 0.01) { d.rect++; if (d.ex.length < 6) d.ex.push(["rect", x.k, +rd.toFixed(2)]); }
    if (x.p !== y.p) { d.paint++; if (d.ex.length < 6) d.ex.push(["paint", x.k, x.p, y.p]); } }
  return { ...d, sh: [a.sh, b.sh], filters: [a.filters, b.filters] }; }
// painted AA of an element's text range
async function aa(p, sel) {
  const clip = await p.evaluate((sel) => { const el = document.querySelector(sel); if (!el || !el.textContent.trim()) return null; const rg = document.createRange(); rg.selectNodeContents(el); const r = rg.getBoundingClientRect(); return { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width) + 1, height: Math.ceil(r.height) + 1 }; }, sel);
  if (!clip) return null;
  const { data, info } = await sharp(await p.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels; const px = (x, y) => { const i = (y * info.width + x) * ch; return [data[i], data[i + 1], data[i + 2]]; };
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const Y = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const cr = (a, b) => { const [h, l] = [Y(a), Y(b)].sort((m, n) => n - m); return (h + 0.05) / (l + 0.05); };
  const cnt = new Map(); for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) { const k = px(x, y).join(); cnt.set(k, (cnt.get(k) ?? 0) + 1); }
  const ground = [...cnt].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const cols = []; for (let x = 0; x < info.width; x++) { let best = 1, mass = 0; for (let y = 0; y < info.height; y++) { const c = cr(px(x, y), ground); if (c > 1.2) mass += c - 1; if (c > best) best = c; } if (mass > 0) cols.push({ best, mass }); }
  const bests = cols.map((c) => c.best).sort((a, b) => a - b); const med = cols.map((c) => c.mass).sort((a, b) => a - b)[Math.floor(cols.length / 2)];
  const worstAt = (f) => Math.min(...cols.filter((c) => c.mass >= f * med).map((c) => c.best));
  return { ground, cols: cols.length, max: +bests.at(-1).toFixed(2), median: +bests[Math.floor(bests.length / 2)].toFixed(2), p30: +bests[Math.floor(bests.length * 0.3)].toFixed(2), under45: +(bests.filter((b) => b < 4.5).length / bests.length).toFixed(2), worst: [0.5, 0.7, 0.9, 1].map((f) => +worstAt(f).toFixed(2)) };
}
try {
  // M1 · π populated (P3 two lines; P4 two answers) HOLD vs control + control vs control, desk & phone, light
  if (ONLY === "all" || ONLY === "pi") for (const rig of ["desk", "phone"]) for (const pose of ["P3", "P4"]) {
    const reads = {};
    for (const arm of ["control", "hold", "control2"]) { const { ctx, page, regime } = await open(arm === "control2" ? "control" : arm, rig, "light"); await drive(page, pose); reads[arm] = { l: await lines(page), c: await census(page), regime }; await ctx.close(); }
    row({ m: "pi", rig, pose, regime: reads.hold.regime, lines: { hold: reads.hold.l, control: reads.control.l }, holdVsControl: pidiff(reads.hold.c, reads.control.c), controlVsControl: pidiff(reads.control2.c, reads.control.c) });
  }
  // M2 · painted AA line one at P1 (the fulfilled record), HOLD vs TINT, phone coarse, both themes; + line two at P3
  if (ONLY === "all" || ONLY === "aa") for (const scheme of ["light", "dark"]) for (const arm of ["hold", "tint"]) {
    const { ctx, page, regime } = await open(arm, "phone", scheme); await drive(page, "P1"); const l1 = await lines(page); const a1 = await aa(page, ".board-margin .margin-note");
    await ask(page); await page.waitForTimeout(900); const push = await page.evaluate(() => window.__push); const l3 = await lines(page); const a2 = await aa(page, ".board-margin .margin-note-previous");
    const filters = await page.evaluate(() => [...document.querySelectorAll("*")].filter((e) => { const f = getComputedStyle(e).filter; return f && f !== "none"; }).length);
    row({ m: "aa+push", arm, scheme, regime, P1: l1, aaLineOneP1: a1, P3: l3, aaLineTwoP3: a2, push, filtersP3: filters }); await ctx.close();
  }
  // M3 · filters dark at desk, control vs hold, P3
  if (ONLY === "all" || ONLY === "filt") for (const arm of ["control", "hold", "tint"]) { const { ctx, page } = await open(arm, "desk", "dark"); await drive(page, "P3"); const f = await page.evaluate(() => [...document.querySelectorAll("*")].filter((e) => { const f = getComputedStyle(e).filter; return f && f !== "none"; }).map((e) => e.tagName + "." + (e.getAttribute("class") ?? "").split(" ")[0])); row({ m: "filters-dark-desk-P3", arm, n: f.length, sample: [...new Set(f)].slice(0, 12) }); await ctx.close(); }
  // M4 · landscape 844x390 coarse P3: line two display
  if (ONLY === "all" || ONLY === "land") for (const arm of ["hold", "control"]) { const { ctx, page, regime } = await open(arm, "land", "light"); await drive(page, "P3"); row({ m: "land", arm, regime, l: await lines(page), sh: await page.evaluate(() => document.documentElement.scrollHeight) }); await ctx.close(); }
} catch (e) { console.log("ERR", e.message); out.err = e.message; }
writeFileSync(`${S}/critic-${ENG}-${ONLY}.json`, JSON.stringify(out, null, 1)); await browser.close(); console.log("DONE");
