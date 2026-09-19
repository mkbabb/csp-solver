/**
 * T9-W7 pass 2 · RESEARCH · CTRL-TAPE — the measurement pass.
 *
 * Read-only on the product. Two servers, two engines, three cells.
 *   :4230  HEAD (main tree, read-only)
 *   :4232  the pass-1 build (worktree wf_e58b4764-0fc-37, uncommitted)
 *
 * What it reads, and why each row exists:
 *   A · THE GALLERY (charter row 3 — the shared-class census). `.section-heading` is
 *       StagingBand's class too, and `SheetWashiLabel` is StagingBand's COMPONENT: whatever
 *       moves in either reaches `?view=gallery`, a surface this family does not claim.
 *   B · THE PIN BAND (charter rows 1 + 7 — the §2.5 RED's own arithmetic). §2.5's exemption is
 *       the card's computed `padding-top` while `data-fold-above` is set; everything a pinned
 *       tape hangs below that line is coverage the gate counts.
 *   C · THE OCCLUSION PREDICATE (charter row 2, grafted from CTRL-RULE's critic): coverage
 *       AND `elementFromPoint` at five scroll states, desk and dock.
 *
 * usage: node r2-tape.mjs <outdir>
 */
// A probe banked in the docs tree cannot resolve `playwright` by name (the pass-1 trap): the
// absolute specifier is the fix, and it names the estate's own install so the engines match CI's.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const SERVERS = { head: "http://127.0.0.1:4230", proto: "http://127.0.0.1:4232" };
const INTERACTIVE =
  'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])';

async function loadBoard(page) {
  await page.goto("/?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
}

async function loadDeck(page) {
  await page.goto("/?view=gallery&size=3&difficulty=EASY");
  await page.waitForSelector(".game-gallery", { timeout: 30000 });
  await page.waitForSelector(".staging-band", { timeout: 30000 });
  await page.waitForTimeout(700); // the deck settles
}

/** A · the gallery, read where the two shared classes actually land. */
const GALLERY = () => {
  const r = (el) => {
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return {
      x: +b.x.toFixed(2),
      y: +b.y.toFixed(2),
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
    };
  };
  /** the INK's own x, not the box's — a padding change moves the glyph, not the block. */
  const glyphX = (el) => {
    if (!el || !el.firstChild) return null;
    const rg = document.createRange();
    rg.selectNodeContents(el);
    return +rg.getBoundingClientRect().x.toFixed(2);
  };
  const cs = (el, ...props) => {
    if (!el) return null;
    const s = getComputedStyle(el);
    return Object.fromEntries(props.map((p) => [p, s.getPropertyValue(p)]));
  };
  const labels = [...document.querySelectorAll(".staging-axis-label")];
  const tag = document.querySelector(".staging-band .washi-tag");
  const band = document.querySelector(".staging-band");
  const card0 = document.querySelector("#gallery-card-0") || document.querySelector(".game-card");
  return {
    axisLabels: labels.map((el) => ({
      text: (el.textContent || "").trim(),
      tagName: el.tagName,
      glyphX: glyphX(el),
      box: r(el),
      ...cs(el, "font-family", "font-size", "line-height", "padding-left", "text-align", "font-weight"),
    })),
    stagingTag: tag
      ? {
          text: (tag.textContent || "").trim(),
          tagName: tag.tagName,
          box: r(tag),
          ...cs(tag, "font-family", "font-size", "line-height", "margin-top", "margin-bottom", "padding-top", "position"),
        }
      : null,
    /** the covenant the tape claims: net flow height zero. */
    tagNetFlow: tag
      ? +(
          tag.getBoundingClientRect().height +
          parseFloat(getComputedStyle(tag).marginTop) +
          parseFloat(getComputedStyle(tag).marginBottom)
        ).toFixed(2)
      : null,
    bandBox: r(band),
    firstCardY: card0 ? +card0.getBoundingClientRect().y.toFixed(2) : null,
    /** the a11y half: does the deck grow a heading it did not have? */
    headingsInBand: band
      ? [...band.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
          tag: h.tagName,
          text: (h.textContent || "").trim().slice(0, 24),
        }))
      : [],
  };
};

/** B + C · the card, at one scroll state. */
const CARD = () => {
  const card = document.querySelector(".controls-card");
  if (!card) return null;
  const s = getComputedStyle(card);
  const cb = card.getBoundingClientRect();
  const padTop = parseFloat(s.paddingTop) || 0;
  const liveTop = cb.top + card.clientTop + padTop;
  const inter = [...card.querySelectorAll('button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])')].filter(
    (e) => {
      const b = e.getBoundingClientRect();
      return b.width > 0 && b.height > 0;
    },
  );
  const tapes = [];
  for (const tape of card.querySelectorAll(".washi-tag, .zone-row-label")) {
    const ts = getComputedStyle(tape);
    if (ts.display === "none" || ts.visibility === "hidden" || +ts.opacity < 0.05) continue;
    const t = tape.getBoundingClientRect();
    if (t.width === 0 || t.height === 0) continue;
    const pinned = ts.position === "sticky" && !tape.hasAttribute("data-released");
    const hits = [];
    for (const el of inter) {
      const b = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(b.right, t.right) - Math.max(b.left, t.left));
      // BOTH readings: the gate's (exempt band subtracted) and the honest one (no exemption).
      const hGate = Math.max(
        0,
        Math.min(b.bottom, t.bottom) -
          Math.max(b.top, t.top, card.hasAttribute("data-fold-above") ? liveTop : -Infinity),
      );
      const hRaw = Math.max(0, Math.min(b.bottom, t.bottom) - Math.max(b.top, t.top));
      if (w * hRaw <= 0.5) continue;
      // the hit test CTRL-RULE's critic added: is the covered point still the control's?
      const px = (Math.max(b.left, t.left) + Math.min(b.right, t.right)) / 2;
      const py = (Math.max(b.top, t.top) + Math.min(b.bottom, t.bottom)) / 2;
      const hit = document.elementFromPoint(px, py);
      hits.push({
        target: el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 24),
        gatePx: +(w * hGate).toFixed(1),
        gateFrac: +((w * hGate) / (b.width * b.height)).toFixed(3),
        rawPx: +(w * hRaw).toFixed(1),
        rawFrac: +((w * hRaw) / (b.width * b.height)).toFixed(3),
        hitIsTarget: hit === el || (hit ? el.contains(hit) : false),
        hitWas: hit ? (hit.className && String(hit.className).slice(0, 28)) || hit.tagName : null,
      });
    }
    tapes.push({
      text: (tape.textContent || "").trim().slice(0, 20),
      cls: String(tape.className).slice(0, 30),
      tagName: tape.tagName,
      pinned,
      released: tape.hasAttribute("data-released"),
      position: ts.position,
      fontPx: +parseFloat(ts.fontSize).toFixed(2),
      lineHeight: ts.lineHeight,
      box: {
        top: +(t.top - cb.top).toFixed(2),
        h: +t.height.toFixed(2),
        w: +t.width.toFixed(2),
      },
      /** the ONE number the §2.5 arithmetic turns on. */
      belowExemptBand: +(t.bottom - liveTop).toFixed(2),
      hits,
    });
  }
  return {
    padTop,
    padBottom: parseFloat(s.paddingBottom) || 0,
    clientH: card.clientHeight,
    scrollH: card.scrollHeight,
    scrollTop: +card.scrollTop.toFixed(1),
    foldAbove: card.hasAttribute("data-fold-above"),
    cardTop: +cb.top.toFixed(2),
    exemptBandPx: padTop,
    tapes,
  };
};

const CELLS_CARD = [
  { name: "rail-1440x900", w: 1440, h: 900 },
  { name: "rail-1280x800", w: 1280, h: 800 },
  { name: "dock-390x844", w: 390, h: 844 },
];
const CELLS_DECK = [
  { name: "deck-390x844", w: 390, h: 844 },
  { name: "deck-1280x800", w: 1280, h: 800 },
];

const out = {};
for (const [engName, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  for (const [srv, base] of Object.entries(SERVERS)) {
    const browser = await eng.launch();
    for (const cell of CELLS_DECK) {
      const ctx = await browser.newContext({
        baseURL: base,
        viewport: { width: cell.w, height: cell.h },
      });
      const page = await ctx.newPage();
      try {
        await loadDeck(page);
        out[`${engName}|${srv}|${cell.name}`] = await page.evaluate(GALLERY);
      } catch (e) {
        out[`${engName}|${srv}|${cell.name}`] = { error: String(e).slice(0, 160) };
      }
      await ctx.close();
    }
    for (const cell of CELLS_CARD) {
      const ctx = await browser.newContext({
        baseURL: base,
        viewport: { width: cell.w, height: cell.h },
        hasTouch: cell.w < 1024,
        isMobile: false,
      });
      const page = await ctx.newPage();
      try {
        await loadBoard(page);
        if (cell.w < 1024) {
          await page.locator(".drawer-tab").click();
          await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
          await page.waitForTimeout(900); // the sheet SLIDES
        }
        const states = [];
        const range = await page.evaluate(() => {
          const c = document.querySelector(".controls-card");
          return c ? c.scrollHeight - c.clientHeight : 0;
        });
        for (const f of [0, 0.25, 0.5, 0.75, 1]) {
          await page.evaluate((y) => {
            const c = document.querySelector(".controls-card");
            if (c) c.scrollTop = y;
          }, Math.round(range * f));
          await page.waitForTimeout(260); // the fold pass is rAF-coalesced + the tape's 150ms
          states.push({ frac: f, ...(await page.evaluate(CARD)) });
        }
        out[`${engName}|${srv}|${cell.name}`] = { range, states };
      } catch (e) {
        out[`${engName}|${srv}|${cell.name}`] = { error: String(e).slice(0, 200) };
      }
      await ctx.close();
    }
    await browser.close();
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("banked", OUT);
