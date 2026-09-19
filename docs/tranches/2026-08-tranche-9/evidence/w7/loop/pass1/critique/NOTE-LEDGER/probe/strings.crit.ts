/**
 * C6 — THE LONGEST SENTENCE THE LEDGER CAN AGE, measured in line two's own box.
 * `.margin-note-previous` is `white-space: nowrap` inside a 258px strip at 390 portrait;
 * the enumerable record vocabulary is techniqueVoice's hint copy plus the two receipts.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/NOTE-LEDGER/readings";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

// Every string the ledger may AGE (kind 'record'), from techniqueVoice.ts + GameBoard's receipts.
const RECORDS = [
  "only 4 fits here",
  "only G fits here",
  "the answer is 4",
  "the answer is G",
  "4 goes nowhere else in this row",
  "4 goes nowhere else in this box",
  "4 goes nowhere else in this group",
  "G goes nowhere else in this column",
  "that's a given clue",
  "the board is clear",
];
// Line one may also carry a GRADE while line two carries a record.
const GRADES = [
  "check the greater than signs",
  "check the thermometer",
  "no solution from here",
  "check column 12",
];

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
    const empty = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
    empty[0]?.focus();
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

async function ctxFor(
  browser: Browser,
  browserName: string,
  rig: { width: number; height: number; dsf: number; mobile: boolean },
) {
  const ctx = await browser.newContext({
    viewport: { width: rig.width, height: rig.height },
    deviceScaleFactor: rig.dsf,
    isMobile: rig.mobile && browserName === "chromium",
    hasTouch: rig.mobile,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  return { ctx, page };
}

test("C6 the longest record in line two's box", async ({ browser }, info) => {
  const rigs = [
    { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
    { name: "360x740", width: 360, height: 740, dsf: 3, mobile: true },
    { name: "1024x640", width: 1024, height: 640, dsf: 2, mobile: false },
    { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
  ];
  const out: unknown[] = [];
  for (const rig of rigs) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await armHint(page);
    await armRefusal(page); // depth 2: line two is mounted
    const rows = await page.evaluate(
      ([records, grades]) => {
        const round = (v: number) => Math.round(v * 100) / 100;
        const two = document.querySelector(
          ".board-margin .margin-note-previous",
        ) as HTMLElement | null;
        const one = document.querySelector(
          ".board-margin .margin-note",
        ) as HTMLElement | null;
        const strip = document.querySelector(".board-margin") as HTMLElement;
        const stripR = strip.getBoundingClientRect();
        if (!two || !one)
          return { mounted: false, stripWidth: round(stripR.width), rows: [], pairs: [] };
        const originalTwo = two.textContent;
        const originalOne = one.textContent;
        const measure = (el: HTMLElement, s: string) => {
          el.textContent = s;
          const r = el.getBoundingClientRect();
          return {
            w: round(r.width),
            right: round(r.right),
            scrollW: el.scrollWidth,
            clientW: el.clientWidth,
          };
        };
        const rows = (records as string[]).map((s) => {
          const m = measure(two, s);
          return {
            s,
            width: m.w,
            rightEdge: m.right,
            stripRight: round(stripR.right),
            pastStrip: round(m.right - stripR.right),
            overflowInBox: m.scrollW - m.clientW,
          };
        });
        // The worst pair on one line (>=1024 trailing berth only).
        const pairs: unknown[] = [];
        for (const g of grades as string[]) {
          const mOne = measure(one, g);
          for (const s of [
            "G goes nowhere else in this column",
            "4 goes nowhere else in this group",
          ]) {
            const mTwo = measure(two, s);
            pairs.push({
              one: g,
              two: s,
              total: round(mTwo.right - mOne.right + mOne.w + (mTwo.right - mOne.right - mOne.w)),
              lineOneW: mOne.w,
              lineTwoW: mTwo.w,
              lineTwoRight: mTwo.right,
              stripRight: round(stripR.right),
              pastStrip: round(mTwo.right - stripR.right),
            });
          }
        }
        two.textContent = originalTwo;
        one.textContent = originalOne;
        return { mounted: true, stripWidth: round(stripR.width), rows, pairs };
      },
      [RECORDS, GRADES],
    );
    out.push({ rig: rig.name, engine: info.project.name, ...rows });
    await ctx.close();
  }
  bank(`C6-strings-${info.project.name}.json`, out);
});
