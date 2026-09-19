/**
 * G-WASH — the unit wash as a GROUND TOKEN (ACC-GRAPHITE pass 2), plus G9's two regressions.
 *
 *  1. On a 9x9 with a cell selected: how many elements on the board carry 0 < opacity < 1,
 *     and how many of those are `.cell-peer`. Pass 1's `opacity: 0.06` minted one stacking
 *     context per washed cell; the token mints none.
 *  2. The painted wash, byte for byte, against graphite@6% composited over the card by the
 *     browser's own parser — the value must not move when the mechanism does.
 *  3. G9: the focused cell's `outline-color` under forced-colors, and whether the retrace
 *     paints an outline of its own; the print arm's ink.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

async function boot(page: Page) {
  await page.goto("./?size=3&difficulty=HARD");
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForTimeout(800);
}

for (const scheme of ["light", "dark"] as const) {
  test(`G-WASH + G9 — ${scheme}`, async ({ page, browserName }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);

    // select a cell so the unit wash lights across its row / column / box
    const input = page.locator(".sudoku-cell input:not([readonly])").first();
    await input.focus();
    await page.waitForTimeout(350);

    const wash = await page.evaluate(() => {
      const board = document.querySelector(".hand-drawn-grid")?.closest("div") ?? document.body;
      const scope = document.querySelector(".game-board") ?? board;
      const all = Array.from(scope.querySelectorAll<HTMLElement>("*"));
      const subUnit = all.filter((el) => {
        const o = parseFloat(getComputedStyle(el).opacity);
        return o > 0 && o < 1;
      });
      const peers = Array.from(document.querySelectorAll<HTMLElement>(".cell-peer"));
      const peerSub = peers.filter((el) => {
        const o = parseFloat(getComputedStyle(el).opacity);
        return o > 0 && o < 1;
      });
      // the painted wash and the control value, resolved by the browser itself
      const probe = document.createElement("div");
      probe.style.position = "fixed";
      probe.style.left = "-9999px";
      document.body.appendChild(probe);
      probe.style.backgroundColor =
        "color-mix(in srgb, var(--color-pencil-graphite, var(--grid-line-color)) 6%, transparent)";
      const control = getComputedStyle(probe).backgroundColor;
      probe.style.backgroundColor = "var(--ground-wash-unit)";
      const token = getComputedStyle(probe).backgroundColor;
      probe.remove();
      const first = peers[0];
      return {
        peerNodes: peers.length,
        peerSubUnitOpacityNodes: peerSub.length,
        boardSubUnitOpacityNodes: subUnit.length,
        boardSubUnitSample: subUnit
          .slice(0, 8)
          .map((el) => el.className.toString().slice(0, 40)),
        paintedWash: first ? getComputedStyle(first).backgroundColor : null,
        paintedOpacity: first ? getComputedStyle(first).opacity : null,
        tokenValue: token,
        controlValue: control,
        tokenEqualsControl: token === control,
        groundWashDeclared: getComputedStyle(document.documentElement)
          .getPropertyValue("--ground-wash-unit")
          .trim(),
      };
    });

    // G9 — forced colours
    await page.emulateMedia({ forcedColors: "active", colorScheme: scheme });
    await input.focus();
    await page.waitForTimeout(250);
    const forced = await page.evaluate(() => {
      const cell = document
        .querySelector<HTMLInputElement>(".sudoku-cell input:not([readonly])")
        ?.closest(".game-cell");
      const retrace = document.querySelector(".cell-ghost-retrace");
      return {
        cellOutlineColor: cell ? getComputedStyle(cell).outlineColor : null,
        cellOutlineStyle: cell ? getComputedStyle(cell).outlineStyle : null,
        retraceOutline: retrace ? getComputedStyle(retrace).outlineStyle : null,
        retraceDisplay: retrace ? getComputedStyle(retrace).display : null,
      };
    });
    await page.emulateMedia({ forcedColors: "none", media: "print", colorScheme: scheme });
    await page.waitForTimeout(250);
    const print = await page.evaluate(() => {
      const pick = (s: string, prop: "stroke" | "color") => {
        const el = document.querySelector(s);
        return el ? getComputedStyle(el)[prop] : null;
      };
      return {
        gridLine: pick("path.grid-line", "stroke"),
        glyph: pick(".sudoku-cell .glyph-svg path", "stroke"),
        ring: pick(".cell-ghost-path", "stroke"),
        tally: pick(".progress-trace", "stroke"),
      };
    });
    await page.emulateMedia({ media: "screen" });

    const out = { engine: browserName, scheme, wash, forced, print };
    writeFileSync(
      `${OUT}/wash-${scheme}-${browserName}.json`,
      JSON.stringify(out, null, 2),
    );
    console.log(JSON.stringify(out));
    expect(wash.peerNodes).toBeGreaterThan(0);
  });
}
