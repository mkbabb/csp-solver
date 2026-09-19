import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * T9-W7 · CTRL-COST — the r0 §1 instrument's THREE ROWS, re-asserted under the consequence
 * ladder. The rows below are `r0/r1-controls/probe/heading-voice.spec.ts`'s, copied verbatim
 * (the same selectors, the same closed set, the same 1.23 floor); the ONLY change is that the
 * overlay is applied before the read. Nothing is weakened: ROW 1 still demands ONE voice over
 * every node that names a control group, ROW 2 still demands that every one of them be a
 * document heading, ROW 3 still demands the desk's own 1.294 less 5%.
 *
 * The overlay is `proto/cost-card.css` + `proto/cost-card.js` plus ONE declaration — the φ
 * rung for `--type-group-title` on the phone, which is the single right-hand side ROW 3 turns
 * on (`typography.css:119-124` and its `@media (min-width: 768px)` arm).
 */

// `__dirname` rather than `import.meta.url`: the estate's playwright transpiles specs to CJS.
const HERE = __dirname;
const CSS = readFileSync(resolve(HERE, "../proto/cost-card.css"), "utf8");
const JS_SRC = readFileSync(resolve(HERE, "../proto/cost-card.js"), "utf8").replace(
  /^export const costCard = /m,
  "window.__costCard = ",
);
const PHI = ":root{--type-group-title:var(--type-heading)}";

const CELLS = [
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
];
const RANK_RATIO_FLOOR = 1.23;

async function loadBoard(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(900); // the sheet SLIDES
  }
}

function readNames() {
  const card = document.querySelector(".controls-card") ?? document;
  const pick = (sel: string, kind: string) =>
    Array.from(card.querySelectorAll(sel))
      .filter((el) => (el as HTMLElement).getClientRects().length > 0)
      .map((el) => {
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
          rank: host ? host.tagName : el.getAttribute("role") === "heading" ? "role=heading" : "—",
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
    namePx: names.length ? Math.max(...names.map((n) => +n.voice.split(" · ")[1])) : null,
  };
}

for (const cell of CELLS) {
  test(`§1 under the consequence ladder — ${cell.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && info.project.name === "chromium",
      deviceScaleFactor: cell.mobile ? 3 : 1,
      baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4233",
    });
    const page = await ctx.newPage();
    await loadBoard(page);
    await page.addStyleTag({ content: CSS + PHI });
    await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
    await page.waitForTimeout(400);

    const r = await page.evaluate(readNames);
    console.log(`[CTRL-COST ${cell.name} ${info.project.name}]`, JSON.stringify(r, null, 1));

    expect.soft(
      r.voices,
      `the card names ${r.names.length} control groups in ${r.voices.length} voices`,
    ).toHaveLength(1);
    expect.soft(
      r.docHeadings,
      `only ${r.docHeadings} of ${r.names.length} group names are document headings`,
    ).toBe(r.names.length);
    expect(r.namePx).not.toBeNull();
    expect(r.optionPx).not.toBeNull();
    expect.soft(
      r.namePx! / r.optionPx!,
      `group name ${r.namePx}px against the option chip's ${r.optionPx}px`,
    ).toBeGreaterThanOrEqual(RANK_RATIO_FLOOR);

    await ctx.close();
  });
}
