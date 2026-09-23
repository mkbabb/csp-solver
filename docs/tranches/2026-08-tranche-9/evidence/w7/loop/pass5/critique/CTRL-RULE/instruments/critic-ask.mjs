// T9-W7 pass 5 · CRITIC · CTRL-RULE — the standing question, re-driven by the critic at 390×844 coarse
// (hasTouch, witnessed), one payload, lane dist. Rows: deal ∩/in-row at rest · BREAK-1 (the asked
// verb un-hidden, CSS only, no DOM move: does the ∩ clause red ALONE for deal?) · keep/answer
// semantics (givens before/after) · keyboard arm → focus on keep; Escape → focus home · the CROSS
// tap: with one question standing, the OTHER guarded verb tapped (is it live or silently dead?) ·
// chromium only: the CDP safe-area inset arm on BOTH dists.
// node critic-ask.mjs <chromium|webkit> <LANE> <CTRL> [light|dark]
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
const [ENGINE, LANE, CTRL, THEME = "light"] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const DEAL = '.controls-card button[aria-label="Deal a new board"]', CLEAR = '.action-bar button[aria-label="Clear the board"]';
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const CENSUS = (verbSel) => {
  const cas = document.querySelector(".drawer-case"), card = document.querySelector(".controls-card");
  const rib = document.querySelector(".confirm-ribbon"), verb = document.querySelector(verbSel);
  if (!rib || !verb) return { rib: !!rib };
  let ext = null;
  for (const d of [rib, ...rib.querySelectorAll("*")]) { const e = d.getBoundingClientRect(); if (!e.width || !e.height) continue;
    ext = ext ? { l: Math.min(ext.l, e.left), t: Math.min(ext.t, e.top), r: Math.max(ext.r, e.right), b: Math.max(ext.b, e.bottom) } : { l: e.left, t: e.top, r: e.right, b: e.bottom }; }
  const cb = card.getBoundingClientRect(), clipT = cb.top + card.clientTop, clipB = clipT + card.clientHeight;
  let worst = 0, who = "";
  for (const c of cas.querySelectorAll('button,[role="button"],input,a[href],[tabindex="0"]')) {
    if (rib.contains(c) || c.closest("[inert]")) continue;
    if (getComputedStyle(c).visibility === "hidden") continue;
    const r = c.getBoundingClientRect(); let t = r.top, b = r.bottom;
    if (card.contains(c)) { t = Math.max(t, clipT); b = Math.min(b, clipB); }
    const a = Math.max(0, r.width) * Math.max(0, b - t); if (a < 0.01) continue;
    const ix = Math.max(0, Math.min(ext.r, r.right) - Math.max(ext.l, r.left)), iy = Math.max(0, Math.min(ext.b, b) - Math.max(ext.t, t));
    if (ix * iy / a > worst) { worst = ix * iy / a; who = c.getAttribute("aria-label") || c.textContent.trim().slice(0, 20); }
  }
  const vr = verb.getBoundingClientRect();
  return { worst: +worst.toFixed(4), who, qTop: +ext.t.toFixed(2), verbTop: +vr.top.toFixed(2), dist: +Math.abs(ext.t - vr.top).toFixed(2), text: rib.textContent.replace(/\s+/g, " ").trim() };
};
const givens = (p) => p.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].map((c) => (c.querySelector(".glyph-svg") ? 1 : 0)).join(""));
async function open(base, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, colorScheme: THEME, hasTouch: true, isMobile: ENGINE === "chromium", ...extra });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, THEME);
  const p = await ctx.newPage();
  await p.goto(`${base}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.waitForTimeout(1500);
  return { ctx, p };
}
async function dirtyAndOpen(p) {
  const blank = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].findIndex((c) => !c.querySelector(".glyph-svg")));
  await p.locator(".sudoku-cell").nth(blank).click({ force: true });
  await p.evaluate((idx) => { const i = document.querySelectorAll(".sudoku-cell input")[idx]; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(i, "1"); i.dispatchEvent(new Event("input", { bubbles: true })); }, blank);
  await p.waitForTimeout(300);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().tap({ force: true });
  let last = -1; for (let i = 0; i < 40; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case").getBoundingClientRect().top); if (Math.abs(t - last) < 0.01) break; last = t; }
}
const out = { engine: ENGINE, theme: THEME, board: BOARD, coarse: null, rows: {} };
{
  const { ctx, p } = await open(LANE);
  out.coarse = await p.evaluate(() => matchMedia("(pointer: coarse)").matches);
  await dirtyAndOpen(p);
  const g0 = await givens(p);
  await p.locator(DEAL).tap();
  await p.waitForTimeout(250);
  out.rows.dealArmed = await p.evaluate(CENSUS, DEAL);
  out.rows.dealArmedActive = await p.evaluate(() => document.activeElement?.tagName + "." + (document.activeElement?.className || ""));
  // THE CROSS TAP: with deal's question standing, tap CLEAR (visible, enabled, in the foot)
  const clearVis = await p.evaluate((s) => { const e = document.querySelector(s); const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { vis: cs.visibility, disabled: e.disabled, hitIsClear: e.contains(hit) }; }, CLEAR);
  const gBeforeCross = await givens(p);
  await p.locator(CLEAR).tap();
  await p.waitForTimeout(400);
  out.rows.crossTapClearWhileDealAsks = { clearVis, ribbons: await p.locator(".confirm-ribbon").count(), ribbonText: (await p.locator(".confirm-ribbon").allTextContents()).map((t) => t.replace(/\s+/g, " ").trim()), boardChanged: (await givens(p)) !== gBeforeCross };
  // BREAK-1: the asked verb un-hidden, CSS only (no DOM move) — the ∩ clause must red on its own
  await p.addStyleTag({ content: ".deal-acts{visibility:visible!important}" });
  await p.waitForTimeout(100);
  out.rows.break1_dealUnhidden = await p.evaluate(CENSUS, DEAL);
  await p.locator(".confirm-ribbon .confirm-keep").tap();
  await p.waitForTimeout(300);
  out.rows.keepKeepsBoard = (await givens(p)) === g0;
  await ctx.close();
}
{
  // keyboard arm + Escape + the answer
  const { ctx, p } = await open(LANE);
  await dirtyAndOpen(p);
  const g0 = await givens(p);
  await p.locator(DEAL).focus();
  await p.keyboard.press("Enter");
  await p.waitForTimeout(300);
  out.rows.kbdArmFocus = await p.evaluate(() => (document.activeElement?.className || "") + " «" + (document.activeElement?.textContent || "").trim() + "»");
  await p.keyboard.press("Escape");
  await p.waitForTimeout(300);
  out.rows.escapeFocusHome = await p.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  out.rows.escapeRibbons = await p.locator(".confirm-ribbon").count();
  await p.locator(DEAL).tap();
  await p.waitForTimeout(200);
  await p.locator(".confirm-ribbon button").last().tap();
  await p.waitForTimeout(2500);
  out.rows.answerDealtNewBoard = (await givens(p)) !== g0;
  await ctx.close();
}
{
  // clear asks in the foot; tap DEAL while it stands
  const { ctx, p } = await open(LANE);
  await dirtyAndOpen(p);
  await p.locator(CLEAR).tap();
  await p.waitForTimeout(250);
  out.rows.clearArmed = await p.evaluate(CENSUS, CLEAR);
  const dealVis = await p.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { vis: getComputedStyle(e).visibility, inView: r.bottom > 0 && r.top < innerHeight, hitIsDeal: e.contains(hit) }; }, DEAL);
  const g = await givens(p);
  if (dealVis.inView && dealVis.hitIsDeal) await p.locator(DEAL).tap();
  await p.waitForTimeout(400);
  out.rows.crossTapDealWhileClearAsks = { dealVis, ribbons: await p.locator(".confirm-ribbon").count(), ribbonText: (await p.locator(".confirm-ribbon").allTextContents()).map((t) => t.replace(/\s+/g, " ").trim()), boardChanged: (await givens(p)) !== g };
  await ctx.close();
}
if (ENGINE === "chromium") {
  for (const [arm, base] of [["lane", LANE], ["control", CTRL]]) {
    const { ctx, p } = await open(base);
    const cdp = await ctx.newCDPSession(p);
    const pads = {};
    for (const bottom of [34, 0]) {
      try { await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: { top: 0, left: 0, right: 0, bottom } }); } catch (e) { pads.err = String(e).slice(0, 120); break; }
      await p.reload({ waitUntil: "domcontentloaded" }); await p.waitForSelector(".sudoku-cell"); await p.waitForTimeout(1200);
      pads[bottom] = await p.evaluate(() => { const f = document.getElementById("card-foot") || document.querySelector(".action-bar"); return f ? getComputedStyle(f).paddingBottom : null; });
    }
    out.rows[`inset_${arm}`] = pads;
    await ctx.close();
  }
}
writeFileSync(join(OUT, `critic-ask-${ENGINE}-${THEME}.json`), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
await browser.close();
console.log("EXIT OK");
