/**
 * C7 — INTRINSIC width of every ageable record in line two's OWN typography, measured with a
 * Range over the text node (line two is absolute left:0/right:0, so its box width is the
 * strip's and tells you nothing about the ink). The question the family never asked: how much
 * headroom does a `white-space: nowrap` line have before it paints outside the strip?
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/NOTE-LEDGER/readings";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const RECORDS = [
  "only 4 fits here",
  "the answer is G",
  "4 goes nowhere else in this row",
  "4 goes nowhere else in this box",
  "4 goes nowhere else in this group",
  "G goes nowhere else in this column",
  "that's a given clue",
  "the board is clear",
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

test("C7 nowrap headroom", async ({ browser }, info) => {
  const rigs = [
    { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
    { name: "393x699", width: 393, height: 699, dsf: 3, mobile: true },
    { name: "390x664", width: 390, height: 664, dsf: 3, mobile: true },
    { name: "360x740", width: 360, height: 740, dsf: 3, mobile: true },
  ];
  const out: unknown[] = [];
  for (const rig of rigs) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await armHint(page);
    await armRefusal(page);
    const row = await page.evaluate((records: string[]) => {
      const round = (v: number) => Math.round(v * 100) / 100;
      const two = document.querySelector(
        ".board-margin .margin-note-previous",
      ) as HTMLElement | null;
      const strip = document.querySelector(".board-margin") as HTMLElement;
      const sw = round(strip.getBoundingClientRect().width);
      if (!two) return { mounted: false, stripWidth: sw, inks: [] };
      const original = two.textContent;
      const inks = records.map((s) => {
        two.textContent = s;
        const node = two.firstChild!;
        const r = document.createRange();
        r.selectNodeContents(node);
        const box = r.getBoundingClientRect();
        return { s, ink: round(box.width), headroom: round(sw - box.width) };
      });
      two.textContent = original;
      return { mounted: true, stripWidth: sw, inks };
    }, RECORDS);
    out.push({ rig: rig.name, engine: info.project.name, ...row });
    await ctx.close();
  }
  bank(`C7-nowrap-headroom-${info.project.name}.json`, out);
});
