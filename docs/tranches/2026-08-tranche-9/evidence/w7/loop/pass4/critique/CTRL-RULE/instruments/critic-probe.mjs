// T9-W7 pass 4 · CTRL-RULE · CRITIC's own probe (not the lane's). Independent re-reads:
//  desk  — π + paint on unclaimed surfaces vs the 74a2b5d9 control, the card's content length,
//          rule-to-rule and rule-to-BoilDivider gaps (the doubled-band class), the rules' painted
//          1.4.11 worst column (own decoder), and the keyboard ring's PAINTED contrast.
//  phone — 390×844 hasTouch (witnessed): the ask's type, where DEAL's question lands, and the
//          focus a pointer arm leaves behind when the verb it pressed is hidden under it.
// node critic-probe.mjs <chromium|webkit> <PROTO> <CTRL> <light|dark>
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const sharp = (await import(NM + "sharp/dist/index.mjs")).default;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
mkdirSync(OUT, { recursive: true });
const [ENGINE = "chromium", PROTO = "http://127.0.0.1:4238/", CTRL = "http://127.0.0.1:4239/", THEME = "light"] = process.argv.slice(2);
// "\x01" + "3." + 81 cells, base64url — the lane's payload, decoded by both arms (asserted below).
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => { const [h, l] = a > b ? [a, b] : [b, a]; return (h + 0.05) / (l + 0.05); };

async function open(base, w, h, touch) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, colorScheme: THEME,
    hasTouch: touch, isMobile: touch && ENGINE === "chromium" });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, THEME);
  const p = await ctx.newPage();
  await p.goto(`${base}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.waitForTimeout(2200);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await p.locator(".drawer-tab").first().click({ force: true });
  }
  await p.waitForTimeout(1100); // the sheet slides
  return { ctx, p };
}
async function png(p, clip) {
  const buf = await p.screenshot({ clip, animations: "disabled" });
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, px: (x, y) => { const i = (y * info.width + x) * 3; return [data[i], data[i + 1], data[i + 2]]; } };
}
// worst column over the central 80 %: per column the MAX contrast of any pixel against the card
async function worstColumn(p, clip, bg) {
  const img = await png(p, clip);
  const Lb = L(bg); const cols = [];
  for (let x = Math.floor(img.w * 0.1); x < Math.ceil(img.w * 0.9); x++) {
    let m = 1; for (let y = 0; y < img.h; y++) m = Math.max(m, CR(L(img.px(x, y)), Lb));
    cols.push(m);
  }
  cols.sort((a, b) => a - b);
  return { worst: +cols[0].toFixed(3), median: +cols[Math.floor(cols.length / 2)].toFixed(3), under3: +(cols.filter((c) => c < 3).length / cols.length).toFixed(3), n: cols.length };
}
const rgb = (s) => s.match(/[\d.]+/g).slice(0, 3).map(Number);

const out = { engine: ENGINE, theme: THEME, control: "74a2b5d9 (w7-control dist index-CubiZsMVSwTc.js)", board: BOARD };

// ── DESK 1280×800, fine ──────────────────────────────────────────────────────────────────────
const SURF = { masthead: ".masthead", logo: "svg.handwritten-logo", tab: ".drawer-tab", toggle: "button.sun-moon-toggle",
  cell: ".sudoku-cell", peek: ".board-peek-host", case: ".drawer-case", card: ".controls-card" };
const desk = {};
for (const [arm, base] of [["proto", PROTO], ["ctrl", CTRL]]) {
  const { ctx, p } = await open(base, 1280, 800, false);
  desk[arm] = await p.evaluate((S) => {
    const o = { surf: {} };
    for (const [k, sel] of Object.entries(S)) {
      const e = document.querySelector(sel); if (!e) { o.surf[k] = null; continue; }
      const b = e.getBoundingClientRect(), cs = getComputedStyle(e);
      o.surf[k] = { tag: e.tagName, x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2),
        paint: [cs.fontFamily.slice(0, 30), cs.fontSize, cs.lineHeight, cs.color, cs.backgroundColor, cs.filter].join("|") };
    }
    const card = document.querySelector(".controls-card");
    o.card = { scrollH: card.scrollHeight, clientH: card.clientHeight, clientW: card.clientWidth, bg: getComputedStyle(card).backgroundColor };
    o.givens = document.querySelectorAll(".sudoku-cell .glyph-svg").length;
    o.boardKept = new URLSearchParams(location.search).has("board");
    // every horizontal drawn line inside the card, content coordinates (scroll-independent)
    const top0 = card.getBoundingClientRect().top - card.scrollTop;
    const lines = [...card.querySelectorAll(".rp-rule, .boil-divider-wrap")].map((e) => {
      const r = e.getBoundingClientRect();
      return { kind: e.classList.contains("rp-rule") ? "rule" : "boil", y: +(r.top + r.height / 2 - top0).toFixed(2), h: +r.height.toFixed(2) };
    }).sort((a, b) => a.y - b.y);
    const gaps = []; for (let i = 1; i < lines.length; i++) gaps.push({ pair: `${lines[i - 1].kind}→${lines[i].kind}`, gap: +(lines[i].y - lines[i - 1].y).toFixed(2) });
    o.lines = lines; o.lineGaps = gaps;
    // chip layout: how many option chips sit alone on their line (the contained field's wrap)
    o.chips = [...card.querySelectorAll("[data-ruled-group] .rp-field")].map((f) => {
      const kids = [...f.querySelectorAll(".ctrl-btn")]; const tops = new Set(kids.map((k) => Math.round(k.getBoundingClientRect().top)));
      return { n: kids.length, lines: tops.size };
    });
    return o;
  }, SURF);
  if (arm === "proto") {
    // rules painted, at rest, every rule scrolled into the card's view one at a time
    const bg = rgb(desk.proto.card.bg);
    const rules = await p.locator(".controls-card .rp-rule").count();
    desk.proto.rulePaint = [];
    for (let i = 0; i < rules; i++) {
      const r = await p.locator(".controls-card .rp-rule").nth(i).evaluate((e) => {
        e.scrollIntoView({ block: "center" }); const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height };
      });
      await p.waitForTimeout(150);
      const clip = { x: Math.round(r.x), y: Math.round(r.y) - 3, width: Math.round(r.w), height: Math.round(r.h) + 6 };
      desk.proto.rulePaint.push({ i, y: +r.y.toFixed(2), ...(await worstColumn(p, clip, bg)) });
    }
    // the keyboard ring, painted: focus a chip by keyboard, read its outline's top band
    await p.evaluate(() => { document.querySelector(".controls-card").scrollTop = 0; });
    const chip = p.locator(".controls-card .ctrl-btn").first();
    await chip.focus(); await p.keyboard.press("Shift+Tab"); await p.keyboard.press("Tab");
    await p.waitForTimeout(200);
    const fr = await p.evaluate(() => { const a = document.activeElement; const b = a.getBoundingClientRect(); const cs = getComputedStyle(a);
      return { tag: a.tagName, cls: a.className, fv: a.matches(":focus-visible"), x: b.x, y: b.y, w: b.width, h: b.height, outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, off: cs.outlineOffset }; });
    const off = parseFloat(fr.off) || 0;
    const clip = { x: Math.round(fr.x + fr.w * 0.25), y: Math.round(fr.y - off - 4), width: Math.max(4, Math.round(fr.w * 0.5)), height: 6 };
    desk.proto.ring = { focused: fr, band: clip, ...(await worstColumn(p, clip, bg)), arithmetic: +CR(L(rgb(fr.outline.split(" ").slice(2).join(" "))), L(bg)).toFixed(3) };
  }
  await ctx.close();
}
out.desk = desk;
out.deskPi = Object.keys(SURF).map((k) => {
  const a = desk.proto.surf[k], b = desk.ctrl.surf[k];
  if (!a || !b) return { k, proto: !!a, ctrl: !!b };
  return { k, dx: +(a.x - b.x).toFixed(2), dy: +(a.y - b.y).toFixed(2), dw: +(a.w - b.w).toFixed(2), dh: +(a.h - b.h).toFixed(2), paintSame: a.paint === b.paint, tagSame: a.tag === b.tag };
});

// ── PHONE 390×844, hasTouch, witnessed ──────────────────────────────────────────────────────
const phone = {};
{
  const { ctx, p } = await open(PROTO, 390, 844, true);
  phone.coarse = await p.evaluate(() => matchMedia("(pointer: coarse)").matches && !matchMedia("(hover: hover)").matches);
  // dirty the board (the estate's dirtySudoku route)
  const blank = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].findIndex((c) => !c.querySelector(".glyph-svg")));
  await p.locator(".sudoku-cell").nth(blank).click({ force: true });
  await p.evaluate((idx) => { const input = document.querySelectorAll(".sudoku-cell input")[idx];
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true })); }, blank);
  await p.waitForTimeout(500);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
  await p.waitForTimeout(1100);
  // CLEAR armed by a tap: what holds focus once the verb that was pressed is hidden under the ask?
  await p.locator('.action-bar button[aria-label="Clear the board"]').first().tap();
  await p.waitForTimeout(350);
  phone.clearArm = await p.evaluate(() => {
    const a = document.activeElement; const ask = document.querySelector(".confirm-ask"); const cs = ask && getComputedStyle(ask);
    const verb = document.querySelector(".action-verbs .icon-sublabel"); const vcs = verb && getComputedStyle(verb);
    return { active: a?.tagName + (a?.getAttribute("aria-label") ? `[${a.getAttribute("aria-label")}]` : ""),
      activeHidden: a ? getComputedStyle(a).visibility : null,
      askFont: cs && `${cs.fontFamily.slice(0, 24)} ${cs.fontSize}`, askColor: cs?.color, verbSublabelFont: vcs && `${vcs.fontFamily.slice(0, 24)} ${vcs.fontSize}`,
      chipFont: (() => { const c = document.querySelector(".controls-card .ctrl-btn"); const s = c && getComputedStyle(c); return s && `${s.fontFamily.slice(0, 24)} ${s.fontSize}`; })() };
  });
  await p.locator(".confirm-ribbon .confirm-keep").tap(); await p.waitForTimeout(300);
  phone.afterKeepActive = await p.evaluate(() => document.activeElement?.tagName);
  // DEAL armed by a tap: where does its question land, relative to the verb that asked?
  await p.evaluate(() => { document.querySelector(".controls-card").scrollTop = 0; });
  await p.waitForTimeout(200);
  const deal = p.locator(".controls-card button", { hasText: /deal/i }).first();
  const dealCount = await deal.count();
  if (dealCount) {
    await deal.scrollIntoViewIfNeeded(); await deal.tap(); await p.waitForTimeout(350);
    phone.dealArm = await p.evaluate(() => {
      const d = [...document.querySelectorAll(".controls-card button")].find((b) => /deal/i.test(b.textContent || ""));
      const rb = document.querySelector(".confirm-ribbon");
      const R = (e) => { const r = e.getBoundingClientRect(); return { top: +r.top.toFixed(1), bottom: +r.bottom.toFixed(1), left: +r.left.toFixed(1) }; };
      return { armed: !!rb, ask: rb?.getAttribute("aria-label"), deal: d && R(d), ribbon: rb && R(rb),
        verticalDistance: d && rb ? +(rb.getBoundingClientRect().top - d.getBoundingClientRect().bottom).toFixed(1) : null,
        ribbonOnScreen: rb ? rb.getBoundingClientRect().bottom <= innerHeight : null };
    });
  }
  await ctx.close();
}
out.phone = phone;
console.log(JSON.stringify({ deskPi: out.deskPi }));
console.log(JSON.stringify({ card: [desk.proto.card, desk.ctrl.card], chips: desk.proto.chips, ctrlChips: desk.ctrl.chips }));
console.log(JSON.stringify({ lineGaps: desk.proto.lineGaps }));
console.log(JSON.stringify({ rulePaint: desk.proto.rulePaint, ring: desk.proto.ring }));
console.log(JSON.stringify({ phone }));
writeFileSync(join(OUT, `critic-probe-${ENGINE}-${THEME}.json`), JSON.stringify(out, null, 1));
await browser.close();
console.log("EXIT OK");
