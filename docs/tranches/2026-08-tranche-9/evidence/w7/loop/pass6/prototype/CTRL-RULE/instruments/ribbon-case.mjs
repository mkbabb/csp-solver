// T9-W7 pass 5 · CTRL-RULE — copied from pass4/prototype/CTRL-RULE/instruments/ribbon-case.mjs, OUT
// re-pointed (../readings under pass5), and taught a second VERB (charter row 4): VERB=deal arms
// `deal` and reads where its question lands relative to the verb that asked (the DISTANCE, the
// critic's 1.3), the deal row's height rest vs armed (the price) and the ∩ over the whole case.
// Its born-RED re-homes the ribbon into the foot (the pass-4 berth) by a DOM move in the same run.
// T9-W7 pass 4 · CTRL-RULE — THE CONFIRM OVER THE WHOLE CASE (charter rows 1, 2, 15, 16).
// Successor of pass3/critique/CTRL-RULE/instruments/ribbon-critic.mjs (copied, OUT re-pointed,
// predicate widened). What changed and why:
//  · ROOT = `.drawer-case` (card + #card-foot), never the card alone: pass 3's predicate could
//    not see the foot, which is where the bar and its question live.
//  · LIVE = rendered (checkVisibility / display chain), not under [inert], area > 0 — a control
//    the question takes the place of is not live (T9-D1's rule). Each control is CLIPPED to its
//    scrollport before the intersection (the critic's discipline).
//  · the ribbon's surface is its PAINTED EXTENT: the union of its own box and every descendant's.
//  · three scroll states of the card; the pass-3 placement re-injected as the born-RED in the
//    same run (the note hung `bottom: 100%` over the card, verbs displayed under it).
//  · the board is PINNED by an encoded `?board=` payload (pass-4 chair addendum), stated below.
// node ribbon-case.mjs <chromium|webkit> <BASE> <light|dark> [W H]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });
const ENGINE = process.argv[2] || "chromium";
const BASE = process.argv[3] || "http://127.0.0.1:4231/";
const THEME = process.argv[4] || "light";
const VW = +(process.argv[5] || 390), VH = +(process.argv[6] || 844);
const VERB = process.env.VERB || "clear";
// "\x01" + "3." + 81 cells (30 givens), base64url — persistence.ts encodeBoard's shape.
export const BOARD =
  "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: VW, height: VH }, deviceScaleFactor: 1, hasTouch: true,
  isMobile: ENGINE === "chromium", colorScheme: THEME,
});
await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, THEME);
const page = await ctx.newPage();
const out = { engine: ENGINE, theme: THEME, base: BASE, viewport: [VW, VH], board: BOARD };
await page.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
await page.waitForSelector(".sudoku-cell", { timeout: 40000 });
// the DEV-only filter tuner (absent from a built dist) sits over the foot; hidden, as pass 3 did
await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
await page.waitForTimeout(2500);
out.coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
out.boardParamKept = await page.evaluate(() => new URLSearchParams(location.search).has("board"));
const glyphs = () => page.evaluate(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length);
out.givens = await glyphs();

// THE ESTATE'S DIRTY ROUTE (e2e/gallery-deal.spec.ts dirtySudoku)
async function dirty() {
  const blank = await page.evaluate(() => {
    const c = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < c.length; i++) if (!c[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
  if (blank < 0) return false;
  await page.locator(".sudoku-cell").nth(blank).click({ force: true });
  await page.evaluate((idx) => {
    const input = document.querySelectorAll(".sudoku-cell input")[idx];
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, blank);
  await page.waitForTimeout(500);
  return true;
}
await dirty();
out.dirtyGlyphs = await glyphs();
if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
  await page.locator(".drawer-tab").first().click({ force: true });
}
await page.waitForTimeout(1000); // the sheet SLIDES (~700 ms)

const GEOM = () => {
  const cas = document.querySelector(".drawer-case");
  const card = document.querySelector(".controls-card");
  const rib = document.querySelector(".confirm-ribbon");
  const bar = document.querySelector(".action-bar");
  const foot = document.getElementById("card-foot");
  const R = (r) => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
  const area = (r) => Math.max(0, r.right - r.left) * Math.max(0, r.bottom - r.top);
  const inter = (a, b) => area({ left: Math.max(a.left, b.left), right: Math.min(a.right, b.right),
                                 top: Math.max(a.top, b.top), bottom: Math.min(a.bottom, b.bottom) });
  const live = (e) => {
    if (e.closest("[inert]")) return false;
    if (e.checkVisibility) { if (!e.checkVisibility({ visibilityProperty: true })) return false; }
    else for (let n = e; n; n = n.parentElement) { const cs = getComputedStyle(n); if (cs.display === "none" || cs.visibility === "hidden") return false; }
    const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0;
  };
  let ext = null;
  if (rib) {
    ext = R(rib.getBoundingClientRect());
    for (const d of rib.querySelectorAll("*")) {
      const r = d.getBoundingClientRect(); if (!r.width || !r.height) continue;
      ext.left = Math.min(ext.left, r.left); ext.top = Math.min(ext.top, r.top);
      ext.right = Math.max(ext.right, r.right); ext.bottom = Math.max(ext.bottom, r.bottom);
    }
  }
  const clip = R(card.getBoundingClientRect());
  clip.top += card.clientTop; clip.bottom = clip.top + card.clientHeight;
  const all = [...cas.querySelectorAll('button,[role="button"],input,a[href],[tabindex="0"]')]
    .filter((e) => !(rib && rib.contains(e)));
  const liveC = all.filter(live);
  const rows = ext ? liveC.map((e) => {
    let r = R(e.getBoundingClientRect());
    if (card.contains(e)) r = { left: Math.max(r.left, clip.left), right: Math.min(r.right, clip.right),
                                top: Math.max(r.top, clip.top), bottom: Math.min(r.bottom, clip.bottom) };
    const a = area(r);
    return { label: (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 28),
             inFoot: foot?.contains(e) ?? false, cov: a > 0.01 ? +(inter(ext, r) / a).toFixed(4) : 0 };
  }).sort((a, b) => b.cov - a.cov) : [];
  const ink = (css) => { const m = css.match(/[\d.]+/g).map(Number); return m; };
  const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const cr = (a, b) => { const [h, l] = a > b ? [a, b] : [b, a]; return (h + 0.05) / (l + 0.05); };
  const cardBg = ink(getComputedStyle(card).backgroundColor);
  const faces = rib ? [...rib.querySelectorAll(".confirm-answer")].map((b) => {
    const r = b.getBoundingClientRect(); const p = b.querySelector("path"); const w = b.querySelector("span");
    const col = ink(getComputedStyle(w).color);
    return { text: w.textContent.trim(), w: +r.width.toFixed(2), h: +r.height.toFixed(2),
             stroke: p ? getComputedStyle(p).strokeWidth : null, word: getComputedStyle(w).color,
             wordOnCard: +cr(lum(col), lum(cardBg)).toFixed(3) };
  }) : [];
  return {
    liveInCase: liveC.length, allInCase: all.length,
    hiddenVerbs: bar ? [...bar.querySelectorAll(".action-verbs button")].filter((e) => !live(e)).length : null,
    ribbon: ext ? { w: +(ext.right - ext.left).toFixed(2), h: +(ext.bottom - ext.top).toFixed(2), top: +ext.top.toFixed(2) } : null,
    barContentW: bar ? +(bar.clientWidth - parseFloat(getComputedStyle(bar).paddingLeft) - parseFloat(getComputedStyle(bar).paddingRight)).toFixed(2) : null,
    barH: bar ? +bar.getBoundingClientRect().height.toFixed(2) : null,
    footH: foot ? +foot.getBoundingClientRect().height.toFixed(2) : null,
    footPadB: foot ? getComputedStyle(foot).paddingBottom : null,
    cardClientH: card.clientHeight, cardScrollTop: Math.round(card.scrollTop),
    worst: rows[0] || null, over0: rows.filter((r) => r.cov > 0).length, top3: rows.slice(0, 3), faces,
  };
};
const clearBtn = VERB === "deal"
  ? page.locator('.controls-card button[aria-label="Deal a new board"]').first()
  : page.locator('.action-bar button[aria-label="Clear the board"]').first();
const VERB_SEL = VERB === "deal" ? '.controls-card button[aria-label="Deal a new board"]' : '.action-bar button[aria-label="Clear the board"]';
const DIST = (sel) => {
  const v = document.querySelector(sel); const rb = document.querySelector(".confirm-ribbon");
  if (!v || !rb) return null; const a = v.getBoundingClientRect(), b = rb.getBoundingClientRect();
  const row = v.closest(".deal-row, .action-bar").getBoundingClientRect();
  return { verb: [+a.top.toFixed(1), +a.bottom.toFixed(1)], ribbon: [+b.top.toFixed(1), +b.bottom.toFixed(1)],
    gap: +Math.max(0, b.top - a.bottom, a.top - b.bottom).toFixed(1), inVerbRow: b.top >= row.top - 0.5 && b.bottom <= row.bottom + 0.5,
    rowH: +row.height.toFixed(2), barVerbsHidden: [...document.querySelectorAll(".action-verbs button")].filter((e) => getComputedStyle(e).visibility === "hidden").length };
};
const keep = page.locator(".confirm-ribbon .confirm-keep");
const go = page.locator(".confirm-ribbon .confirm-go");
out.rest = await page.evaluate(GEOM);

// ∩ over the case at three scroll states
out.states = [];
for (const frac of [0, 0.5, 1]) {
  await page.evaluate((f) => { const c = document.querySelector(".controls-card"); c.scrollTop = (c.scrollHeight - c.clientHeight) * f; }, frac);
  await page.waitForTimeout(250);
  await clearBtn.click();
  await page.waitForTimeout(350);
  const g = await page.evaluate(GEOM);
  g.frac = frac; g.armed = (await page.locator(".confirm-ribbon").count()) === 1;
  g.activeInRibbon = await page.evaluate(() => !!document.activeElement?.closest(".confirm-ribbon"));
  g.dist = await page.evaluate(DIST, VERB_SEL);
  out.states.push(g);
  if (g.armed) { await keep.click(); await page.waitForTimeout(300); }
}
out.afterKeepDirty = (await glyphs()) === out.dirtyGlyphs;
out.afterKeepVerbsBack = await page.evaluate(() => !document.querySelector(".confirm-ribbon") &&
  [...document.querySelectorAll(".action-verbs button")].every((b) => b.getBoundingClientRect().width > 0));
const rowH = () => page.evaluate((sel) => { const v = document.querySelector(sel); const row = v.closest(".deal-row, .action-bar");
  return { row: +row.getBoundingClientRect().height.toFixed(2), scrollH: document.querySelector(".controls-card").scrollHeight }; }, VERB_SEL);

// the swap's price: the foot/card at rest vs armed, same scroll state (0)
await page.evaluate(() => { document.querySelector(".controls-card").scrollTop = 0; });
await page.waitForTimeout(200);
const restGeom = await page.evaluate(GEOM); const restRow = await rowH();
await clearBtn.click(); await page.waitForTimeout(350);
const armGeom = await page.evaluate(GEOM); const armRow = await rowH();
out.price = { footRest: restGeom.footH, footArmed: armGeom.footH, dFoot: +(armGeom.footH - restGeom.footH).toFixed(2),
              cardRest: restGeom.cardClientH, cardArmed: armGeom.cardClientH, dCard: armGeom.cardClientH - restGeom.cardClientH,
              verbRowRest: restRow.row, verbRowArmed: armRow.row, dVerbRow: +(armRow.row - restRow.row).toFixed(2), dScrollH: armRow.scrollH - restRow.scrollH };
// the lapse: nothing destructive, the ask ends
await page.waitForTimeout(2500 + 400);
out.lapse = { ribbonGone: (await page.locator(".confirm-ribbon").count()) === 0, stillDirty: (await glyphs()) === out.dirtyGlyphs };
// keyboard arm → focus on keep; Escape at the document → keep, the sheet stays open
await clearBtn.focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(300);
out.keyArm = { armed: (await page.locator(".confirm-ribbon").count()) === 1,
               focus: await page.evaluate(() => document.activeElement?.textContent?.trim() ?? null) };
await page.keyboard.press("Escape");
await page.waitForTimeout(300);
out.escape = { ribbonGone: (await page.locator(".confirm-ribbon").count()) === 0,
               drawerStillOpen: await page.evaluate(() => !document.documentElement.classList.contains("drawer-closed")),
               focusBackOnClear: await page.evaluate(() => document.activeElement?.getAttribute("aria-label")) };
// press 2 must fire: for deal, the board's givens change (a new deal on the same size)
const sig = () => page.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].map((c) => c.querySelector(".glyph-svg") ? 1 : 0).join(""));
const sigBefore = await sig();
// pointer arm moves no focus into the ribbon (already read per state: activeInRibbon)
// press 2 fires
await clearBtn.click(); await page.waitForTimeout(300);
await go.click(); await page.waitForTimeout(800);
out.press2 = { ribbonGone: (await page.locator(".confirm-ribbon").count()) === 0, glyphsAt800: await glyphs() };
// the wipe is a wave: the glyph count is read again once it has settled
await page.waitForTimeout(3200);
out.press2.glyphsSettled = await glyphs();
out.press2.backToGivens = out.press2.glyphsSettled === out.givens;
out.press2.boardChanged = (await sig()) !== sigBefore;

// BORN-RED in the same run: the pass-3 placement re-injected
await dirty();
await page.addStyleTag({ content: `.action-verbs{display:flex!important}
  .confirm-ribbon{position:absolute!important;bottom:100%!important;left:0;right:0;width:auto!important;
  flex-direction:column;background:var(--color-card);padding:0.5rem 0.75rem 0.6rem!important;z-index:70}` });
await page.evaluate(() => { document.querySelector(".controls-card").scrollTop = 0; });
await clearBtn.click(); await page.waitForTimeout(350);
// deal's born-RED for the DISTANCE: the ribbon re-homed into the foot (the pass-4 berth)
if (VERB === "deal") await page.evaluate(() => { const rb = document.querySelector(".confirm-ribbon"); const bar = document.querySelector(".action-bar"); if (rb && bar) bar.appendChild(rb); });
out.bornRed = await page.evaluate(GEOM);
out.bornRed.dist = await page.evaluate(DIST, VERB_SEL);
out.bornRed.armed = (await page.locator(".confirm-ribbon").count()) === 1;

out.verdict = {
  caseWorstArmed: Math.max(...out.states.map((s) => s.worst?.cov ?? 0)),
  bornRedWorst: out.bornRed.worst?.cov ?? null,
  gateGreen: out.states.every((s) => s.armed && (s.worst?.cov ?? 0) === 0),
  controlFires: (out.bornRed.worst?.cov ?? 0) > 0,
  verb: VERB, maxGap: Math.max(...out.states.map((s) => s.dist?.gap ?? 999)), allInVerbRow: out.states.every((s) => s.dist?.inVerbRow),
  bornRedGap: out.bornRed.dist?.gap ?? null, bornRedInVerbRow: out.bornRed.dist?.inVerbRow ?? null,
};
console.log(JSON.stringify(out.verdict), JSON.stringify(out.price), JSON.stringify(out.lapse), JSON.stringify(out.keyArm), JSON.stringify(out.escape), JSON.stringify(out.press2));
writeFileSync(join(OUT, `ribbon-case-${VERB}-${ENGINE}-${THEME}-${VW}x${VH}.json`), JSON.stringify(out, null, 2));
await browser.close();
console.log("EXIT OK");
