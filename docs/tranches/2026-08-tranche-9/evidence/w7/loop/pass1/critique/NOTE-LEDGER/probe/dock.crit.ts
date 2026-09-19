/**
 * C9 — THE DOCK SHEET OVER A TWO-LINE COLUMN (the prototype's own open gap #2).
 * W2's mechanics are LANDED: the tongue opens the sheet, the sheet slides (~700ms settle).
 * The ledger's line two lives out of flow at top:100% of the block, 4.80px above the ribbon.
 * Does the open sheet cover it, and does the board move?
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/NOTE-LEDGER/readings";
const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/NOTE-LEDGER/frames";
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}
async function armHint(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    inputs.filter((i) => !i.value && !i.readOnly && !i.disabled)[0]?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(700);
}
async function armRefusal(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".board-cells input"),
    ) as HTMLInputElement[];
    const given = inputs.find((i) => i.value);
    if (!given) return;
    given.focus();
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )!.set!;
    setter.call(given, "7");
    given.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await page.waitForTimeout(700);
}

const geom = (page: Page) =>
  page.evaluate(() => {
    const round = (v: number) => Math.round(v * 100) / 100;
    const rect = (sel: string) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        x: round(r.x),
        y: round(r.y),
        w: round(r.width),
        h: round(r.height),
        bottom: round(r.bottom),
        display: cs.display,
        visibility: cs.visibility,
      };
    };
    return {
      board: rect(".board-wrapper"),
      lineOne: rect(".board-margin .margin-note"),
      lineTwo: rect(".board-margin .margin-note-previous"),
      sheet: rect("#fold-tools"),
      controls: rect(".play-controls"),
      scrollHeight: document.scrollingElement?.scrollHeight ?? null,
      // What paints on top of line two's midpoint?
      topAtLineTwo: (() => {
        const el = document.querySelector(
          ".board-margin .margin-note-previous",
        ) as HTMLElement | null;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const hit = document.elementFromPoint(r.left + 10, r.top + r.height / 2);
        return hit ? hit.className || hit.tagName : null;
      })(),
    };
  });

async function ctxFor(browser: Browser, browserName: string) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: browserName === "chromium",
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  return { ctx, page };
}

test("C9 the dock sheet over the column", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name);
  await boardReady(page);
  await armHint(page);
  await armRefusal(page);
  const shut = await geom(page);
  const tab = await page.$(".drawer-tab");
  let opened = null;
  if (tab) {
    await tab.click({ force: true });
    await page.waitForTimeout(1100); // the sheet SLIDES: settle well past 700ms
    opened = await geom(page);
    if (info.project.name === "chromium")
      await page.screenshot({
        path: join(FRAMES, "390x844-dock-open-over-two-lines.png"),
        clip: { x: 0, y: 380, width: 390, height: 464 },
      });
  }
  writeFileSync(
    join(OUT, `C9-dock-${info.project.name}.json`),
    JSON.stringify(
      {
        engine: info.project.name,
        tabFound: !!tab,
        shut,
        opened,
        boardMoved:
          opened && shut.board && opened.board
            ? Math.round((opened.board.y - shut.board.y) * 100) / 100
            : null,
      },
      null,
      2,
    ),
  );
  await ctx.close();
});
