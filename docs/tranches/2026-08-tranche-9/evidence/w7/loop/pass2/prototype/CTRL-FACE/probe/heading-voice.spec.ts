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
      baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4234",
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

// ── THE π CELL (T9-W7 CTRL-FACE pass 2) ─────────────────────────────────────────────────────
// The instrument above reads the CONTROLS CARD, and the two components it reads through —
// `SheetWashiLabel` and `OptionSelector` — also ship to the picker's staging band. A law that
// re-faced the card by editing those components would green every row above and silently
// re-voice a surface this wave does not claim. So the same reader runs on `?view=gallery` and
// asserts the deck is UNMOVED: HEAD's voices, byte-exact, are the pass condition here.
// A FENCE (green at HEAD, green after the cure), not a born-RED row.
// The RUNG is fluid on the tape (`--type-tag` is a clamp: 14.00 at 390, 14.05 at 1280), so it
// is asserted as a band and the FACE, WEIGHT and CASE — the three things a face law can move —
// are asserted exactly. A band that wide cannot hide a re-face; it can only hide a viewport.
const DECK_PI = {
  tape: { face: "Patrick Hand", weight: "500", transform: "lowercase", px: [13.5, 14.5] },
  label: { face: "Patrick Hand", weight: "800", transform: "lowercase", px: [15.5, 16.5] },
  chip: { face: "Fira Code", transform: "none", px: [15.5, 16.5] },
};
const split = (v: string) => {
  const [face, px, weight, transform] = v.split(" · ");
  return { face, px: +px, weight, transform };
};

for (const cell of [
  { name: "deck-390x844", w: 390, h: 844, mobile: true },
  { name: "deck-1280x800", w: 1280, h: 800, mobile: false },
]) {
  test(`§1 the deck is π — ${cell.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && info.project.name === "chromium",
      deviceScaleFactor: cell.mobile ? 3 : 1,
      baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4234",
    });
    const page = await ctx.newPage();
    await page.goto("./?view=gallery");
    await page.waitForSelector(".staging-band", { timeout: 30000 });
    await page.waitForTimeout(1200);
    const deck = await page.evaluate(() => {
      const voice = (el: Element) => {
        const cs = getComputedStyle(el);
        return [
          cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
          (+parseFloat(cs.fontSize)).toFixed(2),
          cs.fontWeight,
          cs.textTransform,
        ].join(" · ");
      };
      const band = document.querySelector(".staging-band")!;
      return {
        tape: voice(band.querySelector(".washi-tag")!),
        labels: Array.from(document.querySelectorAll(".staging-axis-label")).map(voice),
        // WEIGHT IS STATE on a chip — the selected one wears `font-bold`, and Fira Code carries
        // a true 300–700 — so the chip row asserts the family and the rung and leaves the
        // weight to the deck's own selection.
        chips: Array.from(document.querySelectorAll(".staging-axis .ctrl-btn")).map((b) =>
          voice(b).split(" · ").slice(0, 2).join(" · "),
        ),
        transforms: Array.from(document.querySelectorAll(".staging-axis .ctrl-btn")).map(
          (b) => getComputedStyle(b).textTransform,
        ),
      };
    });
    console.log(`[W7-R1 π ${cell.name} ${info.project.name}]`, JSON.stringify(deck));

    const tape = split(deck.tape);
    expect.soft([tape.face, tape.weight, tape.transform], "the deck's tape stays in the hand").toEqual([
      DECK_PI.tape.face,
      DECK_PI.tape.weight,
      DECK_PI.tape.transform,
    ]);
    expect.soft(tape.px, `the deck's tape rung (${tape.px}px)`).toBeGreaterThanOrEqual(
      DECK_PI.tape.px[0],
    );
    expect.soft(tape.px, `the deck's tape rung (${tape.px}px)`).toBeLessThanOrEqual(
      DECK_PI.tape.px[1],
    );

    expect.soft(new Set(deck.labels).size, "one voice for the deck's axis captions").toBe(1);
    const label = split(deck.labels[0]);
    expect.soft(
      [label.face, label.weight, label.transform],
      "the deck's axis captions stay in the hand",
    ).toEqual([DECK_PI.label.face, DECK_PI.label.weight, DECK_PI.label.transform]);

    const chips = deck.chips.map(split);
    expect.soft(
      [...new Set(chips.map((c) => c.face))],
      "the deck's chips stay in the mono default",
    ).toEqual([DECK_PI.chip.face]);
    expect.soft(
      [...new Set(deck.transforms)],
      "the deck's chips keep their AUTHORED case",
    ).toEqual([DECK_PI.chip.transform]);

    await ctx.close();
  });
}
