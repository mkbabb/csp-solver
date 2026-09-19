/**
 * T9-W7 pass 3 · CTRL-TAPE — THE REGISTRATION, THE PUBLISHER, THE FOOT'S INSET, THE SEAM.
 *
 * Four rows the pass-2 prototype did not have, each born-RED against the HEAD control on :4235.
 *   node p3-registration.mjs <out.json> <base-url> [chromium|webkit]
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";
const ONLY = process.argv[4];

const NAMES = [
  "--masthead-foot",
  "--case-offset",
  "--sheet-chrome",
  "--card-foot-h",
  "--card-pad-t",
  "--card-pad-b",
  "--card-pad-x",
  "--pin-band",
];

async function loadBoard(page) {
  await page.goto("/?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
}

/** Every registered name as the CARD sees it (the card is the inner reader of four of them). */
const READ = () =>
  Object.fromEntries(
    [
      "--masthead-foot",
      "--case-offset",
      "--sheet-chrome",
      "--card-foot-h",
      "--card-pad-t",
      "--card-pad-b",
      "--card-pad-x",
      "--pin-band",
    ].map((n) => {
      const card = document.querySelector(".controls-card");
      const el = card ?? document.documentElement;
      return [n, getComputedStyle(el).getPropertyValue(n).trim()];
    }),
  );

/** THE PUBLISHER DELETED. Not a source edit: the published values are removed from the two
 *  elements that carry them, which is exactly the state a missing publisher leaves behind. */
const STRIP = () => {
  const card = document.querySelector(".controls-card");
  for (const n of ["--masthead-foot", "--case-offset"]) {
    document.documentElement.style.removeProperty(n);
  }
  for (const n of ["--card-foot-h", "--card-pad-t", "--card-pad-b", "--card-pad-x"]) {
    card?.style.removeProperty(n);
  }
};

/** What the paint DOES when the publisher is gone — the pose, not the token text. */
const POSE = () => {
  const card = document.querySelector(".controls-card");
  const sheet = document.querySelector("#controls-drawer");
  const foot = document.querySelector("#card-foot");
  const cs = card ? getComputedStyle(card) : null;
  return {
    cardMaxH: cs ? cs.maxHeight : null,
    cardClientH: card ? card.clientHeight : null,
    cardPadTop: cs ? +parseFloat(cs.paddingTop).toFixed(2) : null,
    sheetTop: sheet ? +sheet.getBoundingClientRect().top.toFixed(2) : null,
    footPadBottom: foot ? getComputedStyle(foot).paddingBottom : null,
  };
};

/** THE FOOT ON THE INSET — the mirror's arithmetic, read three ways. */
const FOOT = () => {
  const foot = document.querySelector("#card-foot");
  const bar = document.querySelector(".action-bar");
  const verbs = document.querySelector(".action-verbs");
  if (!foot) return null;
  const f = foot.getBoundingClientRect();
  return {
    footH: +f.height.toFixed(2),
    footBottom: +f.bottom.toFixed(2),
    innerH: window.innerHeight,
    flushToViewport: +(f.bottom - window.innerHeight).toFixed(2),
    verbsBottom: verbs ? +verbs.getBoundingClientRect().bottom.toFixed(2) : null,
    barBottom: bar ? +bar.getBoundingClientRect().bottom.toFixed(2) : null,
    padBottom: getComputedStyle(foot).paddingBottom,
    safeB: getComputedStyle(document.documentElement).getPropertyValue("--safe-b").trim(),
    // The republish is the thing under test: `--card-foot-h` must FOLLOW the foot's height or
    // the card's cap never gives the inset back and the case overflows its own bottom.
    cardFootH: (() => {
      const c = document.querySelector(".controls-card");
      return c ? getComputedStyle(c).getPropertyValue("--card-foot-h").trim() : null;
    })(),
    cardClientH: document.querySelector(".controls-card")?.clientHeight ?? null,
  };
};

/** THE SEAM — the case's drawn stroke against the wordmark's own foot. */
const SEAM = () => {
  const logo = document.querySelector("svg.handwritten-logo");
  const casePath = document.querySelector(
    "#controls-drawer .drawer-case > .outline-svg .boil-pose.is-active path",
  );
  const logoBox = logo ? logo.getBoundingClientRect() : null;
  const strokeTop = casePath ? casePath.getBoundingClientRect().top : null;
  return {
    seam: strokeTop !== null && logoBox ? +(strokeTop - logoBox.bottom).toFixed(2) : null,
    strokeTop: strokeTop === null ? null : +strokeTop.toFixed(2),
    logoFoot: logoBox ? +logoBox.bottom.toFixed(2) : null,
  };
};

/** THE AUTHORED RULE — the estate's own idiom: prove the SOURCE spends the inset. */
const AUTHORED = () => {
  const hits = [];
  const walk = (rules, media) => {
    for (const rule of rules) {
      const nested = rule.cssRules;
      if (nested && nested.length) {
        const cond = rule.conditionText;
        walk(nested, cond ? (media ? `${media} AND ${cond}` : cond) : media);
        continue;
      }
      const text = rule.cssText || "";
      if (text.includes("safe-area-inset-bottom")) {
        hits.push({ selector: rule.selectorText ?? "(no selector)", media, text: text.slice(0, 200) });
      }
    }
  };
  for (const s of document.styleSheets) {
    try {
      walk(s.cssRules, "");
    } catch {
      /* cross-origin */
    }
  }
  return hits;
};

/** `transition: all` ON A TOKEN CARRIER — and "carrier" is the narrow, meaningful reading.
 *
 *  A registered <length> ANIMATES, so `transition: all` on an element whose registered token
 *  CHANGES would start interpolating layout on every publish. Every element in the document
 *  inherits these tokens (that is what `inherits: true` is for), so "carries a non-empty value"
 *  selects the whole tree and says nothing — the first cut of this probe returned 1,143 rows,
 *  which is a broken predicate, not a finding. The elements whose tokens actually change are
 *  the four that DECLARE them: the root (`--masthead-foot`, `--case-offset`, `--safe-b`), the
 *  sheet (`--sheet-chrome`), the card (the four published ones plus `--pin-band`) and the foot.
 */
const TRANSITION_ALL = () => {
  const carriers = [
    document.documentElement,
    document.querySelector("#controls-drawer"),
    document.querySelector(".controls-card"),
    document.querySelector("#card-foot"),
    document.querySelector(".control-panel-wrap"),
  ].filter(Boolean);
  // AND A DURATION, because `transition-property: all` is the property's own INITIAL value:
  // every element in the document computes it, so "property is all" alone selects everything
  // and proves nothing. A transition only exists where a duration is spent.
  return carriers
    .map((el) => {
      const cs = getComputedStyle(el);
      return {
        what: el.id || String(el.className || "").slice(0, 32) || el.tagName,
        tp: cs.transitionProperty,
        td: cs.transitionDuration,
      };
    })
    .filter(
      (r) =>
        r.tp.split(",").some((p) => p.trim() === "all") &&
        r.td.split(",").some((d) => parseFloat(d) > 0),
    );
};

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, dock: true },
  { name: "dock-375x812", w: 375, h: 812, dock: true },
  { name: "dock-430x932", w: 430, h: 932, dock: true },
  { name: "land-844x390", w: 844, h: 390, dock: true },
  { name: "land-812x375", w: 812, h: 375, dock: true },
  { name: "rail-1440x900", w: 1440, h: 900, dock: false },
];

const out = {};
for (const [engName, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  if (ONLY && ONLY !== engName) continue;
  const browser = await eng.launch();
  for (const cell of CELLS) {
    const key = `${engName}|${cell.name}`;
    const ctx = await browser.newContext({
      baseURL: BASE,
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.dock,
    });
    const page = await ctx.newPage();
    try {
      await loadBoard(page);
      if (cell.dock) {
        await page.locator(".drawer-tab").click();
        await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
        await page.waitForTimeout(900); // the sheet SLIDES — settle before reading
      }
      const published = await page.evaluate(READ);
      const posePublished = await page.evaluate(POSE);
      const seam = await page.evaluate(SEAM);
      const footFlush = await page.evaluate(FOOT);

      // THE MIRROR — 34px of inset, then back to flush.
      await page.evaluate(() =>
        document.documentElement.style.setProperty("--safe-b", "34px"),
      );
      await page.waitForTimeout(260);
      const footInset = await page.evaluate(FOOT);
      await page.evaluate(() => document.documentElement.style.removeProperty("--safe-b"));
      await page.waitForTimeout(260);
      const footReverted = await page.evaluate(FOOT);

      // THE REGISTRATION TOOK — strip the publishers and read again.
      await page.evaluate(STRIP);
      await page.waitForTimeout(120);
      const stripped = await page.evaluate(READ);
      const poseStripped = await page.evaluate(POSE);

      out[key] = {
        published,
        posePublished,
        stripped,
        poseStripped,
        seam,
        foot: { flush: footFlush, inset: footInset, reverted: footReverted },
        authoredSafeArea: await page.evaluate(AUTHORED),
        transitionAll: await page.evaluate(TRANSITION_ALL),
      };
    } catch (e) {
      out[key] = { error: String(e).slice(0, 260) };
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
