import { test, expect, type Page } from "@playwright/test";

/**
 * T9-W7 §1 · THE HEADING VOICE — a BORN-RED instrument, written before the cure and red at
 * HEAD (`born-red-head.txt` beside it banks the run).
 *
 * The census's claim is that this card names its control groups in THREE typographic voices and
 * two document ranks. The instrument states the LAW the design must satisfy and nothing about
 * how to satisfy it, so any of the portfolio's answers can green it:
 *
 *   ROW 1 · ONE VOICE. Every node that NAMES a control group speaks in one voice — one family,
 *           one computed size, one weight, one text-transform. The set is closed and first-party:
 *           `.section-heading` (the staged eyebrows), a `.tray-well`'s `.washi-tag` (the
 *           compartment tapes), `.zone-row-label` (the row captions). Ink is read as a separate
 *           row because a crayon tier is DATA (the selected difficulty writes its own tone).
 *   ROW 2 · ONE RANK. A group name is a document heading or it is not a group name. At HEAD two
 *           of the names are `<h2>` and the other six are `<span>`s reachable only through
 *           `aria-labelledby`, so a reader walking by heading finds two of eight compartments.
 *   ROW 3 · THE NAME OUTRANKS WHAT IT NAMES. The group name's computed size must clear the
 *           option chip's by the ratio the DESK already ships (25.89/20 = 1.294, less 5% of
 *           slack = 1.23). The phone ships 20.35/20.00 = 1.018 — heading and option are one
 *           size, which is M03's "the section titles need to be larger" as a number.
 *
 * Read-only; no gesture but the sheet's own open on a dock.
 */

const CELLS = [
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
  // T9-W7 CTRL-FACE pass 1 — THE THIRD CELL. The instrument ran desk and dock only, so the
  // 768–1023 band (the stacked card at short landscape) was never read: `--type-option` is
  // 22px there against a 25.888px name, i.e. 1.1768, below this file's own floor. Born-RED at
  // HEAD on ROW 3 and unseen by every prior run.
  { name: "land-900x500", w: 900, h: 500, mobile: true },
];

/** The desk's own shipped ratio, less 5% of slack — the law is the product's, not a new taste. */
const RANK_RATIO_FLOOR = 1.23;

async function loadBoard(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
  await page.waitForTimeout(1200);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(900); // the sheet SLIDES — settle before a box is read
  }
}

function readNames() {
  const card = document.querySelector(".controls-card") ?? document;
  const pick = (sel: string, kind: string) =>
    Array.from(card.querySelectorAll(sel)).map((el) => {
      const cs = getComputedStyle(el);
      const host = el.closest("h1,h2,h3,h4,h5,h6");
      return {
        kind,
        text: (el as HTMLElement).innerText.replace(/\s+/g, " ").trim(),
        voice: [
          cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
          (+parseFloat(cs.fontSize)).toFixed(2),
          cs.fontWeight,
          cs.textTransform,
        ].join(" · "),
        rank: host ? host.tagName : (el.getAttribute("role") === "heading" ? "role=heading" : "—"),
      };
    });
  const names = [
    ...pick(".section-heading", "staged eyebrow"),
    ...pick(".tray-well > .washi-tag", "compartment tape"),
    ...pick(".zone-row-label", "row caption"),
  ];
  const chip = card.querySelector(".ctrl-btn");
  return {
    names,
    voices: Array.from(new Set(names.map((n) => n.voice))),
    ranks: Array.from(new Set(names.map((n) => n.rank))),
    docHeadings: names.filter((n) => n.rank !== "—").length,
    optionPx: chip ? +parseFloat(getComputedStyle(chip).fontSize).toFixed(2) : null,
    namePx: names.length
      ? Math.max(...names.map((n) => +n.voice.split(" · ")[1]))
      : null,
  };
}

for (const cell of CELLS) {
  test(`§1 the heading voice — ${cell.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && info.project.name === "chromium",
      deviceScaleFactor: cell.mobile ? 3 : 1,
      baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4231",
    });
    const page = await ctx.newPage();
    await loadBoard(page);
    const r = await page.evaluate(readNames);
    console.log(`[W7-R1 ${cell.name} ${info.project.name}]`, JSON.stringify(r, null, 1));

    // ROW 1 — ONE VOICE.
    expect.soft(
      r.voices,
      `the card names ${r.names.length} control groups in ${r.voices.length} voices`,
    ).toHaveLength(1);

    // ROW 2 — ONE RANK: every group name is a document heading.
    expect.soft(
      r.docHeadings,
      `only ${r.docHeadings} of ${r.names.length} group names are document headings`,
    ).toBe(r.names.length);

    // ROW 3 — THE NAME OUTRANKS WHAT IT NAMES.
    expect(r.namePx).not.toBeNull();
    expect(r.optionPx).not.toBeNull();
    expect.soft(
      r.namePx! / r.optionPx!,
      `group name ${r.namePx}px against the option chip's ${r.optionPx}px`,
    ).toBeGreaterThanOrEqual(RANK_RATIO_FLOOR);

    await ctx.close();
  });
}
