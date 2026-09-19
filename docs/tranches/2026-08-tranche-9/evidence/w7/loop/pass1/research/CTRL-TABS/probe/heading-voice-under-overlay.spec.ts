import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

/**
 * R1's §1 instrument, ROW 1/2/3 VERBATIM (same reader, same thresholds, same closed set of
 * name selectors), run AFTER the CTRL-TABS overlay instead of at HEAD. The r0 file itself is
 * re-run unchanged against this lane's server for the born-RED control; this file exists only
 * because the overlay has to be applied before the read and the r0 spec loads its own page.
 *
 * ONE ADDITION, declared: `.proto-tab-word` joins the closed set, because under this family the
 * tab word IS the group name. Removing a name selector would weaken ROW 1; adding the new
 * carrier cannot — it can only make the voice count larger.
 */
const OVERLAY_PATH =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/" +
  "2026-08-tranche-9/evidence/w7/loop/pass1/research/CTRL-TABS/proto/overlay.mjs";
const SRC = readFileSync(OVERLAY_PATH, "utf8");
const CSS = /export const CSS = `([\s\S]*?)`;/.exec(SRC)![1];
const BUILD = SRC.slice(SRC.indexOf("export function build"))
  .replace("export function build", "function build")
  .trim();

const CELLS = [
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
];
const RANK_RATIO_FLOOR = 1.23; // r0's number, untouched

async function loadBoard(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page
    .waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 30000 })
    .catch(() => {});
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
      .filter((el) => el.getClientRects().length > 0) // RENDERED, not merely present
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
          rank: host
            ? host.tagName
            : el.getAttribute("role") === "heading" || el.getAttribute("role") === "tab"
              ? el.getAttribute("role")!
              : "—",
        };
      })
      .filter((n) => n.text);
  const names = [
    ...pick(".section-heading", "staged eyebrow"),
    ...pick(".tray-well > .washi-tag", "compartment tape"),
    ...pick(".zone-row-label", "row caption"),
    ...pick(".proto-tab-word", "tab word"),
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
  test(`§1 the heading voice UNDER THE CTRL-TABS OVERLAY — ${cell.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && info.project.name === "chromium",
      deviceScaleFactor: cell.mobile ? 3 : 1,
      baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4232",
    });
    const page = await ctx.newPage();
    await loadBoard(page);
    await page.addStyleTag({ content: CSS });
    await page.evaluate(`(() => { ${BUILD}; return build({arm:"tongue",trim:true}); })()`);
    await page.waitForTimeout(300);

    const r = await page.evaluate(readNames);
    console.log(`[CTRL-TABS ${cell.name} ${info.project.name}]`, JSON.stringify(r, null, 1));

    expect.soft(r.voices, `${r.names.length} group names in ${r.voices.length} voices`).toHaveLength(1);
    expect.soft(
      r.docHeadings,
      `only ${r.docHeadings} of ${r.names.length} group names carry a name-bearing role`,
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
