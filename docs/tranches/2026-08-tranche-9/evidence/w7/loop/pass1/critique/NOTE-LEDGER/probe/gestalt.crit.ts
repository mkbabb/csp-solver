/**
 * C8 — THE POSE THE PROTOTYPE'S DESK FRAME DOES NOT SHOW: two GRAPHITE records in the
 * trailing berth. Its one desk frame is red-over-graphite, where the hue does the separating.
 * Pencil over pencil, on one line, with a 7.2px gap and no punctuation, is the common case.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/NOTE-LEDGER/frames";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/NOTE-LEDGER/readings";
mkdirSync(FRAMES, { recursive: true });
mkdirSync(OUT, { recursive: true });

async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
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

/** Paint two GRAPHITE records into the live element and its aged twin, as the model would. */
async function forceGraphitePair(page: Page) {
  // Arm a hint (graphite record), then a second hint on another cell (graphite record) —
  // a genuine two-record graphite column, pushed by the component's own watch.
  for (const n of [0, 5]) {
    await page.evaluate((i) => {
      const inputs = Array.from(
        document.querySelectorAll(".board-cells input"),
      ) as HTMLInputElement[];
      const empty = inputs.filter((x) => !x.value && !x.readOnly && !x.disabled);
      (empty[i] ?? empty[0])?.focus();
    }, n);
    await page.keyboard.press("h");
    await page.waitForTimeout(800);
  }
}

test("C8 pencil over pencil", async ({ browser }, info) => {
  const rigs = [
    { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
    { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
  ];
  const rows: unknown[] = [];
  for (const rig of rigs) {
    const { ctx, page } = await ctxFor(browser, info.project.name, rig);
    await boardReady(page);
    await forceGraphitePair(page);
    const read = await page.evaluate(() => {
      const round = (v: number) => Math.round(v * 100) / 100;
      const one = document.querySelector(".board-margin .margin-note") as HTMLElement;
      const two = document.querySelector(
        ".board-margin .margin-note-previous",
      ) as HTMLElement | null;
      const r1 = one.getBoundingClientRect();
      const r2 = two?.getBoundingClientRect();
      return {
        one: (one.textContent || "").trim(),
        two: (two?.textContent || "").trim(),
        oneTone: one.className,
        oneColor: getComputedStyle(one).color,
        twoColor: two ? getComputedStyle(two).color : null,
        // On the trailing berth the two sentences share a baseline: the only separator is air.
        gapPx: r2 ? round(r2.left - r1.right) : null,
        sameBaseline: r2 ? Math.abs(r2.top - r1.top) < 0.5 : null,
      };
    });
    rows.push({ rig: rig.name, engine: info.project.name, ...read });
    if (info.project.name === "chromium") {
      const el = await page.$(".board-margin");
      const box = await el!.boundingBox();
      if (box)
        await page.screenshot({
          path: join(FRAMES, `${rig.name}-graphite-over-graphite.png`),
          clip: {
            x: Math.max(0, box.x - 8),
            y: Math.max(0, box.y - 10),
            width: Math.min(rig.width, box.width + 16),
            height: box.height + 26,
          },
        });
    }
    await ctx.close();
  }
  writeFileSync(
    join(OUT, `C8-graphite-pair-${info.project.name}.json`),
    JSON.stringify(rows, null, 2),
  );
});
