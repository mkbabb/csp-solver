#!/usr/bin/env node
/**
 * CTRL-COST pass-2 CRITIC — the independent re-run.
 *
 * Re-measures, from the critic's own lane, four of the prototype's load-bearing rows plus two
 * the prototype did not measure:
 *   R1  the STARTING OVER berth — is `noteOf('starting')` ever non-empty? (a berth with no
 *       subject is a consumer-less substrate)
 *   R2  G6' zero reflow on arm/disarm, both faces + band + card scrollHeight
 *   R3  G15 the `no` box per dimension against --tap-floor
 *   R4  G9' composited contrast of the asked word / `no` / band name, light AND dark
 *   R5  the PIN BAND at FIRST PAINT — padding-top before the publisher runs
 *   R6  --sheet-chrome as computed on the card (the prototype's gap 2 says it "reads empty")
 */
import fs from "node:fs";
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4241";
const OUT = process.argv[2] || "./c1.json";

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

async function run(engine, name) {
  const browser = await engine.launch();
  const out = { engine: name };

  // ── R5 · FIRST PAINT. Load with the card present but before the ResizeObserver publishes.
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const firstPaint = [];
    await page.addInitScript(() => {
      window.__pins = [];
      const tick = () => {
        const c = document.querySelector(".controls-card");
        if (c) {
          const cs = getComputedStyle(c);
          window.__pins.push({
            t: performance.now(),
            padTop: cs.paddingTop,
            headH: cs.getPropertyValue("--cost-head-h").trim(),
          });
        }
        if (window.__pins.length < 40) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(1500);
    out.firstPaint = await page.evaluate(() => window.__pins.slice(0, 12));
    await ctx.close();
  }

  // ── The dock, opened. 390x844 coarse.
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: name === "chromium" ? true : undefined,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(1200);
    // open the dock sheet
    if (
      await page.evaluate(() =>
        document.documentElement.classList.contains("drawer-closed"),
      )
    ) {
      await page.locator(".drawer-tab").click({ force: true });
      await page.waitForTimeout(950); // the sheet SLIDES
    }
    await page.waitForTimeout(300);
    out.dockOpen = await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      return c ? c.getBoundingClientRect().top : null;
    });

    // R6 — --sheet-chrome computed at three places
    out.sheetChrome = await page.evaluate(() => {
      const g = (sel) => {
        const el = document.querySelector(sel);
        return el
          ? getComputedStyle(el).getPropertyValue("--sheet-chrome").trim()
          : "NO-ELEMENT";
      };
      return {
        root: getComputedStyle(document.documentElement)
          .getPropertyValue("--sheet-chrome")
          .trim(),
        sceneControls: g(".scene-controls"),
        controlsCard: g(".controls-card"),
      };
    });

    // R1 — the berths
    out.berths = await page.evaluate(() => {
      const heads = [...document.querySelectorAll(".cost-band .cost-band-head")];
      return heads.map((h) => ({
        name: h.querySelector(".section-heading")?.textContent?.trim() ?? "?",
        hasBerth: !!h.querySelector(".note-berth"),
        berthText: h.querySelector(".note-berth")?.textContent?.trim() ?? "",
        berthShown: !!h.querySelector(".band-note.is-shown"),
      }));
    });
    // and the subject census: every [data-note] key and which band it resolves to
    out.noteSubjects = await page.evaluate(() =>
      [...document.querySelectorAll("[data-note]")].map((e) => e.dataset.note),
    );

    // R3 — the `no` box (arm the deal face first: the board must be dirty)
    // dirty the board by typing into a cell
    await page.evaluate(() => {
      document.querySelector(".cell-native-input")?.focus();
    });
    await page.keyboard.type("1");
    await page.waitForTimeout(400);
    out.isDirty = await page.evaluate(() => {
      const b = document.querySelector(".deal-face .act-verb");
      return b ? b.getAttribute("aria-label") : null;
    });

    // R2 — zero reflow: read before, arm, read after
    const rects = () =>
      page.evaluate(() => {
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
          dealAnswer: r(".deal-face .act-answer"),
          scrollHeight: card ? card.scrollHeight : null,
        };
      });
    out.beforeArm = await rects();
    await page.locator(".deal-face .act-verb").click({ force: true });
    await page.waitForTimeout(500);
    out.afterArm = await rects();
    out.armedState = await page.evaluate(() => {
      const a = document.querySelector(".deal-face .act-answer");
      const cs = a ? getComputedStyle(a) : null;
      const b = a?.getBoundingClientRect();
      return {
        cls: a?.className,
        visibility: cs?.visibility,
        tabindex: a?.getAttribute("tabindex"),
        w: b ? +b.width.toFixed(2) : null,
        h: b ? +b.height.toFixed(2) : null,
        activeEl:
          document.activeElement?.className || document.activeElement?.tagName,
        tapFloor: getComputedStyle(document.documentElement)
          .getPropertyValue("--tap-floor")
          .trim(),
      };
    });
    // disarm cleanly
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    out.afterEscape = await page.evaluate(() => ({
      armed: !!document.querySelector(".deal-face .act-answer.is-shown"),
      activeEl: document.activeElement?.className || document.activeElement?.tagName,
      sheetTop:
        document.querySelector(".scene-controls")?.getBoundingClientRect().top ?? null,
    }));
    await ctx.close();
  }

  // ── R4 · composited contrast on the desk, both themes
  for (const dark of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
    if (dark)
      await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.waitForTimeout(900);
    // dirty + arm so `sure?` is painted
    await page.evaluate(() => document.querySelector(".cell-native-input")?.focus());
    await page.keyboard.type("1");
    await page.waitForTimeout(300);
    await page.locator(".deal-face .act-verb").click({ force: true });
    await page.waitForTimeout(400);
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
        return { ink: cs.color, paper: paperOf(e), text: e.textContent.trim() };
      };
      return {
        asked: pick(".deal-face .act-word.is-armed.is-shown"),
        no: pick(".deal-face .act-answer"),
        bandName: pick(".cost-band .section-heading"),
        caption: pick(".band-row-caption"),
        cardBg: getComputedStyle(document.querySelector(".controls-card"))
          .backgroundColor,
      };
    });
    const withRatio = {};
    for (const [k, v] of Object.entries(read)) {
      if (!v || typeof v === "string") {
        withRatio[k] = v;
        continue;
      }
      withRatio[k] = {
        ...v,
        ratio: ratio(lum(...parse(v.ink)), lum(...parse(v.paper))),
      };
    }
    out[dark ? "contrastDark" : "contrastLight"] = withRatio;
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
    results.push({ engine: nm, error: String(e).slice(0, 600) });
  }
}
fs.writeFileSync(OUT, JSON.stringify(results, null, 2));
console.log("DONE", OUT);
