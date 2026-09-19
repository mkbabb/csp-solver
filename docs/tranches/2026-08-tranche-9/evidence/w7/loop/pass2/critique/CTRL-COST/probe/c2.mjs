#!/usr/bin/env node
/**
 * CTRL-COST pass-2 CRITIC — c2, the ARMED state.
 * c1 could not arm (typing into a cell behind the risen sheet never dirtied the board), so the
 * dirty gesture here is the prototype's own: press `fill`. Rows:
 *   A  Δ rects on arm (G6'), scrollTop held fixed so the read is reflow, not scroll
 *   B  the `no` box + `--tap-floor` AS COMPUTED ON THAT ELEMENT (is the token consumed, or is
 *      the `2.75rem` fallback carrying it?)
 *   C  the asked word's composited ratio on BARE card (G9'), both themes
 *   D  the `starting over` berth while the band is armed and hovered
 */
import fs from "node:fs";
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4241";
const OUT = process.argv[2] || "./c2.json";

const lum = (r, g, b) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return +((hi + 0.05) / (lo + 0.05)).toFixed(3);
};
const parse = (s) => {
  const m = String(s).match(/[\d.]+/g);
  return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
};

const RECTS = () => {
  const r = (sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const b = e.getBoundingClientRect();
    return [
      +b.x.toFixed(2),
      +b.y.toFixed(2),
      +b.width.toFixed(2),
      +b.height.toFixed(2),
    ];
  };
  const card = document.querySelector(".controls-card");
  return {
    dealFace: r(".deal-face"),
    clearFace: r(".clear-face"),
    band3: r(".cost-band:nth-of-type(3)"),
    answer: r(".deal-face .act-answer"),
    scrollTop: card ? card.scrollTop : null,
    scrollHeight: card ? card.scrollHeight : null,
  };
};

async function openDock(page) {
  if (
    await page.evaluate(() =>
      document.documentElement.classList.contains("drawer-closed"),
    )
  ) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  await page.waitForTimeout(300);
}

async function run(engine, name) {
  const browser = await engine.launch();
  const out = { engine: name };

  // ── A/B/D at 390x844 coarse
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(1000);
    await openDock(page);
    await page.locator('button[aria-label^="Fill in every cell"]').click();
    await page.waitForTimeout(900);
    // park the scrollport so arm/disarm is the only thing that can move a box
    await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      if (c) c.scrollTop = 0;
    });
    await page.waitForTimeout(200);
    out.before = await page.evaluate(RECTS);
    await page.locator(".deal-btn").focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);
    out.after = await page.evaluate(RECTS);
    out.armed = await page.evaluate(() => {
      const a = document.querySelector(".deal-face .act-answer");
      const v = document.querySelector(".deal-btn");
      const cs = a ? getComputedStyle(a) : null;
      const b = a?.getBoundingClientRect();
      return {
        ariaLabel: v?.getAttribute("aria-label"),
        visibility: cs?.visibility,
        minHeight: cs?.minHeight,
        tapFloorOnAnswer: cs?.getPropertyValue("--tap-floor").trim(),
        tabindex: a?.getAttribute("tabindex"),
        w: b ? +b.width.toFixed(2) : null,
        h: b ? +b.height.toFixed(2) : null,
        focusIsNo: document.activeElement === a,
        focusCls: document.activeElement?.className || document.activeElement?.tagName,
      };
    });
    // D — the starting-over berth, armed AND with the pointer on the armed verb
    await page.locator(".deal-btn").hover({ force: true }).catch(() => {});
    await page.waitForTimeout(300);
    out.berthWhileArmed = await page.evaluate(() =>
      [...document.querySelectorAll(".cost-band-head")].map((h) => ({
        name: h.querySelector(".section-heading")?.textContent?.trim(),
        note: h.querySelector(".band-note")?.textContent?.trim() ?? "",
        shown: !!h.querySelector(".band-note.is-shown"),
      })),
    );
    await ctx.close();
  }

  // ── C · the asked word on bare card, both themes, desk
  for (const dark of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
    if (dark)
      await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.waitForTimeout(800);
    await page.locator('button[aria-label^="Fill in every cell"]').click();
    await page.waitForTimeout(900);
    await page.locator(".deal-btn").focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);
    const read = await page.evaluate(() => {
      const paperOf = (el) => {
        let n = el;
        while (n && n !== document.documentElement) {
          const bg = getComputedStyle(n).backgroundColor;
          if (bg && !/rgba?\(0, 0, 0, 0\)|transparent/.test(bg)) return bg;
          n = n.parentElement;
        }
        return getComputedStyle(document.body).backgroundColor;
      };
      const pick = (sel) => {
        const e = document.querySelector(sel);
        if (!e) return null;
        const cs = getComputedStyle(e);
        return {
          ink: cs.color,
          paper: paperOf(e),
          text: e.textContent.trim(),
          vis: cs.visibility,
        };
      };
      return {
        asked: pick(".deal-face .act-word.is-armed"),
        no: pick(".deal-face .act-answer"),
        faceBg: getComputedStyle(document.querySelector(".deal-face")).backgroundColor,
        cardBg: getComputedStyle(document.querySelector(".controls-card"))
          .backgroundColor,
        armedLabel: document
          .querySelector(".deal-btn")
          ?.getAttribute("aria-label"),
      };
    });
    const withR = {};
    for (const [k, v] of Object.entries(read)) {
      withR[k] =
        v && typeof v === "object"
          ? { ...v, ratio: ratio(lum(...parse(v.ink)), lum(...parse(v.paper))) }
          : v;
    }
    out[dark ? "dark" : "light"] = withR;
    await ctx.close();
  }

  await browser.close();
  return out;
}

const results = [];
for (const [eng, nm] of [
  [chromium, "chromium"],
  [webkit, "webkit"],
]) {
  try {
    results.push(await run(eng, nm));
  } catch (e) {
    results.push({ engine: nm, error: String(e).slice(0, 700) });
  }
}
fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log("DONE", OUT);
