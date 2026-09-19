/**
 * G2's RANK clause and G9's forced-colours / print rows.
 *
 * RANK: every stroked mark on the board, by its PAINTED width in px (a stroke's declared
 * number is in its own svg's user units, so the rank has to convert each one through its own
 * `ownerSVGElement` before comparing — that conversion is the whole point of the family's
 * principle 2). The focused cell's fused band is 22 ghost units; nothing else is asked to be
 * heavier. The runner-up is NAMED.
 */
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

    const cells = page.locator(".game-cell");
    const n = await cells.count();
    const side = Math.round(Math.sqrt(n));
    const idx = side * 4 + 4;
    await cells.nth(idx).locator("input").focus();
    await page.waitForTimeout(500);

    const rank = await page.evaluate(() => {
      const rows: { sel: string; px: number; focused: boolean }[] = [];
      const name = (el: Element) => {
        const c = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).join(".");
        return `${el.tagName.toLowerCase()}${c ? "." + c : ""}`;
      };
      const board =
        document.querySelector(".game-grid") ??
        document.querySelector(".sudoku-board") ??
        document.querySelector(".board-host") ??
        document.body;
      for (const el of Array.from(board.querySelectorAll("path, line, rect, circle"))) {
        const svg = (el as SVGGraphicsElement).ownerSVGElement;
        if (!svg) continue;
        const cs = getComputedStyle(el);
        if (cs.stroke === "none" || cs.visibility === "hidden") continue;
        const parentG = el.parentElement;
        if (parentG && getComputedStyle(parentG).display === "none") continue;
        if (getComputedStyle(el).display === "none") continue;
        const vb = svg.viewBox.baseVal;
        const box = svg.getBoundingClientRect();
        if (!vb || !vb.width || !box.width) continue;
        const px = parseFloat(cs.strokeWidth) * (box.width / vb.width);
        if (!(px > 0) || Number(cs.strokeOpacity) === 0) continue;
        const focusedCell = el.closest(".game-cell")?.matches(":has(input:focus-visible)");
        rows.push({ sel: name(el), px: Math.round(px * 1000) / 1000, focused: !!focusedCell });
      }
      rows.sort((a, b) => b.px - a.px);
      return rows;
    });

    // G9 — forced colours and print
    await page.emulateMedia({ forcedColors: "active" });
    await page.waitForTimeout(300);
    const forced = await page.evaluate(() => {
      const cell = document.querySelector(".game-cell:has(input:focus-visible)");
      const input = cell?.querySelector("input") as HTMLElement | null;
      const retrace = cell?.querySelector(".cell-ghost-retrace") as Element | null;
      return {
        outlineColor: input ? getComputedStyle(input).outlineColor : null,
        outlineStyle: input ? getComputedStyle(input).outlineStyle : null,
        retraceOutline: retrace ? getComputedStyle(retrace).outlineStyle : null,
      };
    });
    await page.emulateMedia({ forcedColors: "none", media: "print" });
    await page.waitForTimeout(300);
    const print = await page.evaluate(() => {
      const g = (s: string) => {
        const e = document.querySelector(s);
        return e ? getComputedStyle(e).stroke : null;
      };
      const tape = document.querySelector(".attribution-tape");
      return {
        glyph: g(".game-cell .glyph-svg path"),
        grid: g("svg.hand-drawn-grid path"),
        ring: g(".cell-ghost-retrace"),
        tally: g(".progress-trace"),
        tapePresent: !!tape,
        tapeDisplay: tape ? getComputedStyle(tape).display : null,
      };
    });
    await page.emulateMedia({ media: "screen" });

    writeFileSync(
      `${OUT}/rank-${rig.name}-${info.project.name}.json`,
      JSON.stringify(
        { rig: rig.name, engine: info.project.name, rank: rank.slice(0, 14), forced, print },
        null,
        2,
      ),
    );
    await ctx.close();
  });
