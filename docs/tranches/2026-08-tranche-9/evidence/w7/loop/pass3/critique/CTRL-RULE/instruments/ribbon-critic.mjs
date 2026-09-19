// T9-W7 pass 3 · CTRL-RULE — THE CRITIC'S CONFIRM ROW. The prototype returned every §15 number
// UNRUN because its dirty route left `isDirty` false. This one takes the ESTATE'S OWN route
// (e2e/gallery-deal.spec.ts `dirtySudoku`: click a blank `.sudoku-cell`, drive the native input
// setter, dispatch `input`), then measures what the gate asks for.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
mkdirSync(OUT, { recursive: true });
const ENGINE = process.argv[2] || "chromium";
const BASE = process.argv[3] || "http://127.0.0.1:4233/";
const THEME = process.argv[4] || "light";

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  hasTouch: true,
  isMobile: ENGINE === "chromium",
  colorScheme: THEME,
});
await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, THEME);
const page = await ctx.newPage();
const out = { engine: ENGINE, theme: THEME, base: BASE };
await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
await page.waitForSelector(".sudoku-cell", { timeout: 40000 });
await page.waitForTimeout(2500);
out.coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);

// THE ESTATE'S DIRTY ROUTE
const blank = await page.evaluate(() => {
  const cells = document.querySelectorAll(".sudoku-cell");
  for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector(".glyph-svg")) return i;
  return -1;
});
out.blankIdx = blank;
if (blank >= 0) {
  await page.locator(".sudoku-cell").nth(blank).click({ force: true });
  await page.evaluate((idx) => {
    const input = document.querySelectorAll(".sudoku-cell input")[idx];
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, blank);
  await page.waitForTimeout(600);
}
out.glyphs = await page.evaluate(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length);
out.dirtyCellPainted = await page.evaluate((i) => !!document.querySelectorAll(".sudoku-cell")[i]?.querySelector(".glyph-svg"), blank);

// the sheet SLIDES
if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
  await page.locator(".drawer-tab").first().click({ force: true });
  await page.waitForTimeout(950);
}
await page.waitForTimeout(400);

const GEOM = () => {
  const foot = document.getElementById("card-foot");
  const bar = document.querySelector(".action-bar");
  const rib = document.querySelector(".confirm-ribbon");
  const scene = document.querySelector(".scene-controls") || document.body;
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
                          Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const rr = rib?.getBoundingClientRect();
  const controls = [...scene.querySelectorAll('button,[role="button"],input,a[href]')]
    .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !e.closest(".confirm-ribbon"); })
    .map((e) => ({ el: e, label: (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 24), r: e.getBoundingClientRect() }));
  // CLIPPED to the card's scrollport, the discipline the family's own name-truth instrument
  // insisted on: an unclipped rect reports ink that never paints.
  const card = document.querySelector(".controls-card");
  const clip = card.getBoundingClientRect();
  const clipped = (r) => {
    const inCard = card.contains(document.elementFromPoint(-1, -1)) ? null : null;
    return r;
  };
  const all = rr ? controls.map((c) => {
    const inScroll = card.contains(c.el);
    const cr = inScroll ? {
      top: Math.max(c.r.top, clip.top), bottom: Math.min(c.r.bottom, clip.bottom),
      left: Math.max(c.r.left, clip.left), right: Math.min(c.r.right, clip.right),
    } : { top: c.r.top, bottom: c.r.bottom, left: c.r.left, right: c.r.right };
    cr.width = Math.max(0, cr.right - cr.left); cr.height = Math.max(0, cr.bottom - cr.top);
    const cs = getComputedStyle(c.el);
    return {
      label: c.label, tag: c.el.tagName, cls: String(c.el.className).slice(0, 28),
      vis: cs.visibility, op: cs.opacity, inScroll,
      rect: [+c.r.left.toFixed(1), +c.r.top.toFixed(1), +c.r.width.toFixed(1), +c.r.height.toFixed(1)],
      paintedArea: +(cr.width * cr.height).toFixed(1),
      covRaw: +(inter(rr, c.r) / (c.r.width * c.r.height || 1)).toFixed(4),
      covPainted: cr.width * cr.height > 0.01 ? +(inter(rr, cr) / (cr.width * cr.height)).toFixed(4) : 0,
    };
  }).sort((a, b) => b.covPainted - a.covPainted || b.covRaw - a.covRaw) : [];
  const worst = all[0] || null;
  const faces = rib ? [...rib.querySelectorAll(".confirm-face")].map((f) => {
    const p = f.querySelector("path");
    const r = f.getBoundingClientRect();
    const cs = getComputedStyle(f);
    return { text: f.textContent.trim(), w: +r.width.toFixed(2), h: +r.height.toFixed(2),
             stroke: p ? getComputedStyle(p).strokeWidth : null, attr: p ? p.getAttribute("stroke-width") : null,
             color: cs.color, minInline: cs.minInlineSize, minH: cs.minHeight };
  }) : [];
  return {
    footW: foot ? +foot.getBoundingClientRect().width.toFixed(2) : null,
    barW: bar ? +bar.getBoundingClientRect().width.toFixed(2) : null,
    ribbon: rr ? { w: +rr.width.toFixed(2), h: +rr.height.toFixed(2), top: +rr.top.toFixed(2), left: +rr.left.toFixed(2) } : null,
    worstControlCov: worst, allControls: all.slice(0, 12), faces,
    tapFloorOnRibbon: rib ? getComputedStyle(rib).getPropertyValue("--tap-floor") : null,
    tapFloorOnBar: bar ? getComputedStyle(bar).getPropertyValue("--tap-floor") : null,
    tapFloor: getComputedStyle(document.documentElement).getPropertyValue("--tap-floor"),
    cardScrollH: (() => { const c = document.querySelector(".controls-card"); return c ? [c.scrollHeight, c.clientHeight] : null; })(),
  };
};

const clearBtn = page.locator('.action-bar button[aria-label="Clear the board"]').first();
out.barLabels = await page.locator(".action-bar button").evaluateAll((b) => b.map((x) => x.getAttribute("aria-label")));
await clearBtn.click({ force: true });
await page.waitForTimeout(500);
out.press1 = { ribbon: await page.locator(".confirm-ribbon").count(),
               glyphsAfter: await page.evaluate(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length) };
out.armed = await page.evaluate(GEOM);
if (out.press1.ribbon) {
  await page.screenshot({ path: join(OUT, `ribbon-armed-${ENGINE}-${THEME}.png`), clip: { x: 0, y: 844 - 220, width: 390, height: 220 } });
  const verb = page.locator(".confirm-ribbon button").nth(1);
  out.press2Label = (await verb.textContent())?.trim();
  await verb.click({ force: true });
  await page.waitForTimeout(800);
  out.press2 = { ribbon: await page.locator(".confirm-ribbon").count(),
                 glyphsAfter: await page.evaluate(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length) };
}
console.log(JSON.stringify(out, null, 1));
writeFileSync(join(OUT, `ribbon-critic-${ENGINE}-${THEME}.json`), JSON.stringify(out, null, 2));
await browser.close();
console.log("EXIT OK");
