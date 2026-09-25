// T9-W7 pass 7 · CTRL-RULE — charter row 1 / INTAKE-22 row 28 ON PAINT UNDER THE REAL INSET.
// Per cell × DPR × theme × inset: the drawer opened and SETTLED (the case's bottom read until two
// reads agree), then
//  · the foot's rule, as the M18 row reads it: per-station best contrast ON vs OFF in four quarters,
//    the per-pixel core@50 median and fraction under 3:1, and the painted ALPHA (ON−OFF)/(FULL−OFF);
//  · the foot's LOWEST PAINTED INK (every foot child hidden = OFF), in css, against the inset line
//    (viewport bottom − inset): row 28's "clears the foot's edge by ≥ 2";
//  · `--vv-height` RESOLVED AT THE CONSUMER: `.scene-controls`' computed `top` against the published
//    token and `innerHeight`, then the token removed (the unpublished pose) — which arm paints.
// The inset is chromium's CDP `Emulation.setSafeAreaInsetsOverride`; WebKit has no inset emulation,
// so its rows run at inset 0 only (declared, never inferred).
// node p7-inset-rule.mjs <chromium|webkit> <BASE> <label>
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const [ENGINE = "chromium", BASE = "http://127.0.0.1:4231/", LABEL = "tree"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const Lp = (d, o) => 0.2126 * lin(d[o]) + 0.7152 * lin(d[o + 1]) + 0.0722 * lin(d[o + 2]);
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const med = (v) => (v.length ? [...v].sort((a, b) => a - b)[v.length >> 1] : 1);
const raw = async (buf) => sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const insets = ENGINE === "chromium" ? [0, 34] : [0];
for (const [w, h] of [[390, 844], [430, 932]]) for (const dpr of [1, 2]) for (const theme of ["light", "dark"]) for (const inset of insets) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: true, isMobile: ENGINE === "chromium", colorScheme: theme, reducedMotion: "reduce" });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, theme);
  const p = await ctx.newPage();
  if (inset) { const s = await ctx.newCDPSession(p); await s.send("Emulation.setSafeAreaInsetsOverride", { insets: { top: 0, left: 0, right: 0, bottom: inset } }); }
  await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(1200);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().tap();
  let last = -1; for (let i = 0; i < 60; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case").getBoundingClientRect().bottom); if (Math.abs(t - last) < 0.01) break; last = t; }
  const g = await p.evaluate(() => {
    const foot = document.getElementById("card-foot"); const fb = foot.getBoundingClientRect();
    const rule = foot.querySelector("svg.ruled-line"); const rb = rule ? rule.getBoundingClientRect() : null;
    const sc = document.querySelector(".scene-controls");
    const env = (() => { const d = document.createElement("div"); d.style.paddingBottom = "env(safe-area-inset-bottom)"; document.body.appendChild(d); const v = getComputedStyle(d).paddingBottom; d.remove(); return v; })();
    const pub = document.documentElement.style.getPropertyValue("--vv-height");
    const consumerTop = getComputedStyle(sc).top;
    document.documentElement.style.removeProperty("--vv-height");
    const unpublishedTop = getComputedStyle(sc).top;
    document.documentElement.style.setProperty("--vv-height", pub);
    return { env, padB: getComputedStyle(foot).paddingBottom, footBottom: +fb.bottom.toFixed(2), footTop: +fb.top.toFixed(2), left: fb.left, width: fb.width,
      rule: rb && { x: rb.x, y: rb.y, w: rb.width, h: rb.height }, vv: { published: pub, consumerTop, unpublishedTop, innerHeight }, caseBottom: +document.querySelector(".drawer-case").getBoundingClientRect().bottom.toFixed(2) };
  });
  const row = { arm: LABEL, engine: ENGINE, cell: `${w}x${h}c`, dpr, theme, inset, env: g.env, padB: g.padB, footBottom: g.footBottom, caseBottom: g.caseBottom, vv: g.vv };
  // the lowest painted ink in the foot, against the inset line
  const fclip = { x: Math.max(0, Math.floor(g.left)), y: Math.floor(g.footTop), width: Math.floor(Math.min(g.width, w - g.left)), height: Math.max(1, Math.floor(Math.min(g.footBottom, h) - g.footTop)) };
  const fon = await raw(await p.screenshot({ clip: fclip }));
  const hideF = await p.addStyleTag({ content: "#card-foot * { visibility: hidden !important; }" });
  const foff = await raw(await p.screenshot({ clip: fclip }));
  await hideF.evaluate((n) => n.remove());
  let lowest = -1;
  for (let y = fon.info.height - 1; y >= 0 && lowest < 0; y--) for (let x = 0; x < fon.info.width; x++) { const o = (y * fon.info.width + x) * 3; if (Math.max(Math.abs(fon.data[o] - foff.data[o]), Math.abs(fon.data[o + 1] - foff.data[o + 1]), Math.abs(fon.data[o + 2] - foff.data[o + 2])) > 24) { lowest = y; break; } }
  const inkBottom = fclip.y + (lowest + 1) / dpr;
  row.lowestInkCss = +inkBottom.toFixed(2);
  row.clearsInsetLineBy = +((h - inset) - inkBottom).toFixed(2);
  // the rule, three photographs
  if (g.rule) {
    const clip = { x: Math.floor(g.rule.x), y: Math.floor(g.rule.y - 3), width: Math.floor(g.rule.w), height: Math.ceil(g.rule.h + 6) };
    const on = await raw(await p.screenshot({ clip }));
    const t1 = await p.addStyleTag({ content: "#card-foot svg.ruled-line { visibility: hidden !important; }" });
    const off = await raw(await p.screenshot({ clip })); await t1.evaluate((n) => n.remove());
    const t2 = await p.addStyleTag({ content: "#card-foot svg.ruled-line path { stroke: var(--color-pencil-graphite, var(--grid-line-color)) !important; }" });
    const full = await raw(await p.screenshot({ clip })); await t2.evaluate((n) => n.remove());
    const W = on.info.width, H = on.info.height, x0 = Math.floor(W * 0.05), x1 = Math.ceil(W * 0.95);
    const st = [], fm = [], moved = [];
    for (let x = x0; x < x1; x++) { let best = 1; for (let y = 0; y < H; y++) { const o = (y * W + x) * 3; const r = ratio(Lp(on.data, o), Lp(off.data, o)); best = Math.max(best, r);
      let k = 0; for (let c = 1; c < 3; c++) if (Math.abs(full.data[o + c] - off.data[o + c]) > Math.abs(full.data[o + k] - off.data[o + k])) k = c;
      const d = Math.abs(full.data[o + k] - off.data[o + k]); if (d > 24) fm.push({ d, o, k, r });
      const mv = Math.abs(Lp(on.data, o) - Lp(off.data, o)); if (Math.max(...[0, 1, 2].map((c) => Math.abs(on.data[o + c] - off.data[o + c]))) > 24) moved.push({ mv, r }); }
      st.push(best); }
    const q = st.length / 4;
    const ds = fm.map((m) => m.d).sort((a, b) => a - b); const ref = ds.length ? ds[Math.floor(0.98 * (ds.length - 1))] : 0;
    const core = fm.filter((m) => m.d >= 0.5 * ref);
    const mvs = moved.map((m) => m.mv).sort((a, b) => a - b); const mref = mvs.length ? mvs[Math.floor(0.98 * (mvs.length - 1))] : 0;
    const pcore = moved.filter((m) => m.mv >= 0.5 * mref).map((m) => m.r);
    row.rule = { quarters: [0, 1, 2, 3].map((i) => +med(st.slice(Math.round(i * q), Math.round((i + 1) * q))).toFixed(3)), stationsUnder3: +(st.filter((v) => v < 3).length / st.length).toFixed(3),
      coreMedian: +med(pcore).toFixed(3), pixelCoreUnder3: +(pcore.filter((v) => v < 3).length / Math.max(1, pcore.length)).toFixed(3),
      alpha: +med(core.map((m) => (on.data[m.o + m.k] - off.data[m.o + m.k]) / (full.data[m.o + m.k] - off.data[m.o + m.k]))).toFixed(3), alphaN: core.length,
      ruleTopAboveInsetLine: +((h - inset) - g.rule.y).toFixed(2) };
  }
  console.log(JSON.stringify(row));
  await ctx.close();
}
await browser.close();
