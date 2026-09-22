/**
 * T9-W7 pass 4 · CTRL-TAPE — THE CONFIRM'S FACE AT THREE CELLS, the ring's painted band on
 * four grounds, and the QUICK SET's price on the landscape flank.
 *
 * THE ARM IS PROBE-CALLABLE HERE (charter row 13) by borrowing `e2e/gallery-deal.spec.ts`'s
 * `dirtySudoku` recipe verbatim — find a blank cell, click it, drive the native value setter
 * and dispatch `input` — so a second lane can reproduce the confirm face without this file.
 * The board is pinned (`?board=`) so both arms deal the same board.
 *
 *   node p4-face.mjs <out.json> <baseURL>
 */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";

/** The recipe, exported as a function of `page` so another lane can lift it whole. */
export async function dirtyBoard(page) {
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
    null,
    { timeout: 30000 },
  );
  const blank = await page.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++)
      if (!cells[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
  if (blank < 0) return false;
  await page.locator(".sudoku-cell").nth(blank).click({ force: true });
  await page.evaluate((idx) => {
    const input = document.querySelectorAll(".sudoku-cell input")[idx];
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, blank);
  await page.waitForTimeout(250);
  return true;
}

/** The face, measured: box, stroke, path length, painted ink, colours, ∩ live controls. */
const FACE = () => {
  const rib = document.querySelector(".confirm-ribbon");
  if (!rib) return null;
  const rb = rib.getBoundingClientRect();
  const row = rib.parentElement ? rib.parentElement.getBoundingClientRect() : null;
  const read = (sel) => {
    const el = rib.querySelector(sel);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    const path = el.querySelector("svg path");
    const word = el.querySelector("span");
    const sw = path ? parseFloat(getComputedStyle(path).strokeWidth) : null;
    let len = null;
    try {
      len = path ? +path.getTotalLength().toFixed(1) : null;
    } catch {
      len = null;
    }
    return {
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
      strokeWidth: sw,
      pathLen: len,
      ink: sw && len ? +(sw * len).toFixed(1) : null,
      frameStroke: path ? getComputedStyle(path).stroke : null,
      wordColor: word ? getComputedStyle(word).color : null,
      buttonColor: getComputedStyle(el).color,
    };
  };
  // The discriminating occlusion read (pass-3 critique §3.6): the live controls OUTSIDE the
  // ribbon's own row that a thumb can reach while the question stands.
  const card = document.querySelector(".controls-card");
  const foot = document.querySelector("#card-foot");
  const live = [
    ...(card ? card.querySelectorAll('button,[role="tab"],[tabindex="0"]') : []),
    ...(foot ? foot.querySelectorAll('button,[role="tab"],[tabindex="0"]') : []),
  ].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0 && !rib.contains(e);
  });
  let worst = 0;
  let worstName = null;
  const port = card ? card.getBoundingClientRect() : null;
  for (const el of live) {
    const b = el.getBoundingClientRect();
    const w = Math.max(0, Math.min(b.right, rb.right) - Math.max(b.left, rb.left));
    let h = Math.max(0, Math.min(b.bottom, rb.bottom) - Math.max(b.top, rb.top));
    if (port) {
      // clip to the scrollport: a box scrolled out of the card cannot be covered
      const vh =
        Math.max(0, Math.min(b.bottom, port.bottom) - Math.max(b.top, port.top)) / (b.height || 1);
      h *= vh > 1 ? 1 : vh;
    }
    if (w * h > worst) {
      worst = w * h;
      worstName = (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 24);
    }
  }
  return {
    ribbon: { w: +rb.width.toFixed(2), h: +rb.height.toFixed(2) },
    rowW: row ? +row.width.toFixed(2) : null,
    keep: read(".confirm-keep"),
    go: read(".confirm-go"),
    ask: (rib.querySelector(".confirm-ask")?.textContent || "").trim(),
    liveIntersectWorst: +worst.toFixed(2),
    liveIntersectWho: worstName,
    liveCount: live.length,
    cardBg: card ? getComputedStyle(card).backgroundColor : null,
  };
};

/** THE RING, read where it paints: focus a chip, read the outline, band it on four grounds. */
const RING = () => {
  const card = document.querySelector(".controls-card");
  const el = document.activeElement;
  if (!card || !el) return null;
  const cs = getComputedStyle(el);
  const root = getComputedStyle(document.documentElement);
  const grounds = {};
  for (const [name, sel] of [
    ["card", ".controls-card"],
    ["well", ".controls-card .tray-well"],
    ["tape", ".controls-card .washi-tag"],
    ["foot", "#card-foot"],
  ]) {
    const g = document.querySelector(sel);
    grounds[name] = g ? getComputedStyle(g).backgroundColor : null;
  }
  return {
    focused: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 24),
    outlineColor: cs.outlineColor,
    outlineStyle: cs.outlineStyle,
    outlineWidth: cs.outlineWidth,
    outlineOffset: cs.outlineOffset,
    elColor: cs.color,
    ringInk: root.getPropertyValue("--ring-ink").trim(),
    focusSketch: root.getPropertyValue("--color-focus-sketch").trim(),
    grounds,
    pageBg: getComputedStyle(document.body).backgroundColor,
  };
};

/** THE QUICK SET'S PRICE on the landscape flank: reachability and what the strip occupies. */
const FLANK = () => {
  const strip = document.querySelector(".tongue-strip");
  const set = document.querySelector("#quick-set");
  const tab = document.querySelector(".drawer-tab");
  const board = document.querySelector(".board-wrapper, .sudoku-board");
  const bb = board ? board.getBoundingClientRect() : null;
  const box = (e) => {
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return {
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
      top: +b.top.toFixed(2),
      left: +b.left.toFixed(2),
      display: getComputedStyle(e).display,
    };
  };
  const inView = (e) => {
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0 && b.top >= 0 && b.bottom <= window.innerHeight;
  };
  const acts = [...(set ? set.querySelectorAll("button") : [])].map((b) => ({
    name: (b.getAttribute("aria-label") || b.textContent || "").trim().slice(0, 16),
    w: +b.getBoundingClientRect().width.toFixed(2),
    h: +b.getBoundingClientRect().height.toFixed(2),
    inView: inView(b),
  }));
  // The board's own overlap with the strip — what the flank costs the board.
  let over = 0;
  if (bb && strip) {
    const s = strip.getBoundingClientRect();
    const w = Math.max(0, Math.min(bb.right, s.right) - Math.max(bb.left, s.left));
    const h = Math.max(0, Math.min(bb.bottom, s.bottom) - Math.max(bb.top, s.top));
    over = w * h;
  }
  return {
    strip: box(strip),
    set: box(set),
    tab: box(tab),
    board: bb ? { w: +bb.width.toFixed(2), h: +bb.height.toFixed(2), right: +bb.right.toFixed(2) } : null,
    acts,
    stripOverBoardPx2: +over.toFixed(1),
    innerW: window.innerWidth,
  };
};

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, dock: true },
  { name: "rail-1440x900", w: 1440, h: 900, dock: false },
  { name: "land-844x390", w: 844, h: 390, dock: true, landscape: true },
  { name: "land-812x375", w: 812, h: 375, dock: true, landscape: true },
];

const out = {};
for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const br = await launcher.launch();
  for (const theme of ["light", "dark"]) {
    for (const cell of CELLS) {
      const key = `${eng}|${theme}|${cell.name}`;
      const ctx = await br.newContext({
        baseURL: BASE,
        viewport: { width: cell.w, height: cell.h },
        hasTouch: true,
        colorScheme: theme,
      });
      const page = await ctx.newPage();
      try {
        await page.goto("/?size=3&difficulty=EASY&board=face");
        await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
        await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
        const regime = await page.evaluate(() => ({
          coarse: matchMedia("(pointer: coarse)").matches,
          hover: matchMedia("(hover: hover)").matches,
        }));
        const dirty = await dirtyBoard(page);

        // THE FLANK, before the sheet is opened (the quick set is a SHUT-sheet pose).
        const flank = cell.landscape ? await page.evaluate(FLANK) : null;
        let flankAblated = null;
        if (cell.landscape) {
          const t = await page.addStyleTag({
            content: `#quick-set, .quick-frame { display: none !important }`,
          });
          await page.waitForTimeout(300);
          flankAblated = await page.evaluate(FLANK);
          await page.evaluate((x) => x.remove(), t);
          await page.waitForTimeout(200);
        }

        if (cell.dock) {
          await page.locator(".drawer-tab").click();
          await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
          await page.waitForTimeout(900);
        }

        // ARM THE CONFIRM — press `clear` once.
        let face = null;
        const clear = page.locator('button[aria-label*="lear"], .action-verbs button').first();
        if (await clear.count()) {
          await clear.click({ force: true });
          await page.waitForTimeout(350);
          face = await page.evaluate(FACE);
          // disarm
          const keep = page.locator(".confirm-keep");
          if (await keep.count()) await keep.click({ force: true });
          await page.waitForTimeout(250);
        }

        // THE RING — focus a chip through the keyboard so `:focus-visible` matches.
        let ring = null;
        const chip = page.locator(".controls-card .ctrl-btn").first();
        if (await chip.count()) {
          await chip.evaluate((e) => e.focus());
          await page.keyboard.press("Tab");
          await page.keyboard.press("Shift+Tab");
          await page.waitForTimeout(200);
          ring = await page.evaluate(RING);
        }

        out[key] = { regime, dirty, flank, flankAblated, face, ring };
      } catch (e) {
        out[key] = { error: String(e).slice(0, 260) };
      }
      await ctx.close();
    }
  }
  await br.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
