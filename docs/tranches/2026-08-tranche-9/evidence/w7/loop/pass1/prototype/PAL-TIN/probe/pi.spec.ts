/**
 * PAL-TIN pass-1 — THE π ROW. The same census run twice against the same port: once with the
 * prototype served, once with HEAD served, and diffed. Solo only, which is the claim: a board
 * with nobody else at it must be the board that shipped.
 *
 * PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto (geometry must not be read
 * mid-boil).
 *
 * `TIN_PI_LABEL=head|proto` names the output file.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PAL-TIN/readings";
mkdirSync(OUT, { recursive: true });
const LABEL = process.env.TIN_PI_LABEL ?? "proto";
const SOLO = "./?size=3&difficulty=EASY&wire=local&seed=pi";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.waitForSelector(".game-cell", { timeout: 60000 });
  await page.waitForTimeout(1400);
}

test("π — the solo surfaces, rect by rect", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.goto(SOLO);
  await settled(page);
  const census = await page.evaluate(() => {
    const r = (s: string) => {
      const e = document.querySelector(s);
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return [b.x, b.y, b.width, b.height].map((n) => +n.toFixed(2));
    };
    const cs = getComputedStyle(document.documentElement);
    const cells = [...document.querySelectorAll(".game-cell")];
    return {
      surfaces: {
        board: r(".board-wrapper"),
        card: r(".controls-card"),
        head: r("header") ?? r(".app-head"),
        roster: r(".players-roster"),
        actionBar: r(".action-bar"),
        logo: r("svg.handwritten-logo"),
        tally: r(".difficulty-tally"),
        firstCell: r(".game-cell"),
        lastCell: (() => {
          const e = cells[cells.length - 1];
          const b = e.getBoundingClientRect();
          return [b.x, b.y, b.width, b.height].map((n) => +n.toFixed(2));
        })(),
      },
      cellRects: cells
        .map((c) => {
          const b = c.getBoundingClientRect();
          return `${b.x.toFixed(2)},${b.y.toFixed(2)},${b.width.toFixed(2)},${b.height.toFixed(2)}`;
        })
        .join("|"),
      tokens: {
        userInk: cs.getPropertyValue("--color-user-ink").trim(),
        background: cs.getPropertyValue("--color-background").trim(),
        card: cs.getPropertyValue("--color-card").trim(),
      },
      counts: {
        cells: cells.length,
        glyphPaths: document.querySelectorAll(".glyph-svg path").length,
        ticks: document.querySelectorAll(".glyph-tick").length,
        rosterTicks: document.querySelectorAll(".roster-tick").length,
        liveFilters: [...document.querySelectorAll("*")].filter((e) => {
          const c = getComputedStyle(e);
          return c.filter !== "none" && c.display !== "none";
        }).length,
        domNodes: document.querySelectorAll("*").length,
      },
      glyphStroke: [
        ...new Set(
          [...document.querySelectorAll(".game-cell .glyph-svg path")].map(
            (p) => getComputedStyle(p).stroke,
          ),
        ),
      ],
      ghost: (() => {
        const g = document.querySelector(".game-cell .cell-ghost-path");
        if (!g) return null;
        const c = getComputedStyle(g);
        return { fillOpacity: c.fillOpacity, strokeOpacity: c.strokeOpacity, stroke: c.stroke };
      })(),
    };
  });
  writeFileSync(
    join(OUT, `pi-${LABEL}-${info.project.name}.json`),
    JSON.stringify(census, null, 1),
  );
  console.log(`TIN-PI|${LABEL}|${info.project.name}|${JSON.stringify(census.counts)}`);
  console.log(`TIN-PI|${LABEL}|${info.project.name}|surfaces=${JSON.stringify(census.surfaces)}`);
});
