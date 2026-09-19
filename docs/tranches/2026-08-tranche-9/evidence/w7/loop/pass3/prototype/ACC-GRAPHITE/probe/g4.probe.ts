/** G4 — the authorship seam, measured AFTER a hand has written, so both kinds exist. */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

async function settle(page: Page) {
  await page.waitForSelector(".hand-drawn-grid", { timeout: 40_000 });
  await page.waitForTimeout(1600);
}

for (const rig of [
  { name: "desk", width: 1280, height: 800, dpr: 1, touch: false },
  { name: "phone", width: 393, height: 699, dpr: 3, touch: true },
])
  test(`${rig.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: rig.width, height: rig.height },
      deviceScaleFactor: rig.dpr,
      hasTouch: rig.touch,
      colorScheme: "light",
    });
    const page = await ctx.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await settle(page);

    const empties = page.locator('.game-cell input[aria-label*="empty"]');
    for (let i = 0; i < 8; i++) {
      if ((await empties.count()) === 0) break;
      await empties.first().focus();
      await page.keyboard.type(String((i % 9) + 1));
      await page.waitForTimeout(80);
    }
    await page.locator("body").click({ position: { x: 2, y: 2 } });
    await page.waitForTimeout(500);

    const rows = await page.evaluate(() => {
      const out: { kind: string; units: number; px: number }[] = [];
      for (const cell of Array.from(document.querySelectorAll(".game-cell"))) {
        const label = cell.querySelector("input")?.getAttribute("aria-label") ?? "";
        const p = cell.querySelector(".glyph-svg path") as SVGPathElement | null;
        if (!p) continue;
        const svg = p.ownerSVGElement!;
        const perUnit = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
        const units = parseFloat(getComputedStyle(p).strokeWidth);
        const kind = /given clue/.test(label)
          ? "given"
          : /revealed answer/.test(label)
            ? "solved"
            : /entry/.test(label)
              ? "entry"
              : "other";
        out.push({ kind, units, px: units * perUnit });
      }
      return out;
    });
    writeFileSync(
      `${OUT}/g4-${rig.name}-${info.project.name}.json`,
      JSON.stringify({ rig: rig.name, engine: info.project.name, rows }, null, 2),
    );
    await ctx.close();
  });
