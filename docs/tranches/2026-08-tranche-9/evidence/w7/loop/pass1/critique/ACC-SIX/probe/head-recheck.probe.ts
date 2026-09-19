/**
 * ACC-SIX pass-1 CRITIQUE — the adversary's own reading of HEAD, both engines.
 *
 * The prototype's numbers are all proto-side. This re-measures the HEAD side of the four
 * claims that carry the family's argument, so the deltas it quotes have a second witness:
 *   1  `--color-focus-sketch` exists at HEAD and is UNTHEMED (the deletion's whole case).
 *   2  the ground tokens every ratio in the spec is computed against (card, background,
 *      grid-line, foreground) — resolved, both themes, both engines.
 *   3  the fill trace's overhang past the board box at HEAD (the spec's "+3.22 outside top",
 *      the number the FRAME_PAD move is sold on).
 *   4  the armed-confirm verb's colour at HEAD (the spec's "achromatic 18.99").
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/ACC-SIX/logs";
mkdirSync(OUT, { recursive: true });

const SOLO = "./?size=3&difficulty=EASY";

const TOKENS = [
  "--color-focus-sketch",
  "--color-user-ink",
  "--color-crayon-blue",
  "--color-progress-ink",
  "--color-card",
  "--color-background",
  "--grid-line-color",
  "--color-foreground",
  "--color-red-ink",
  "--color-solver-ink-2",
];

async function boot(page: Page) {
  await page.goto(SOLO);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1200);
}

async function raw(page: Page, names: string[]) {
  return page.evaluate((ns: string[]) => {
    const cs = getComputedStyle(document.documentElement);
    const out: Record<string, string> = {};
    for (const n of ns) out[n] = cs.getPropertyValue(n).trim();
    return out;
  }, names);
}

async function resolved(page: Page, names: string[]) {
  return page.evaluate((ns: string[]) => {
    const probe = document.createElement("div");
    probe.style.position = "fixed";
    probe.style.left = "-9999px";
    document.body.appendChild(probe);
    const out: Record<string, string> = {};
    for (const n of ns) {
      probe.style.setProperty("color", "");
      probe.style.setProperty("color", `var(${n})`);
      out[n] = getComputedStyle(probe).color;
    }
    probe.remove();
    return out;
  }, names);
}

for (const theme of ["light", "dark"] as const) {
  test(`HEAD tokens + trace overhang (${theme})`, async ({ page }, info) => {
    await page.emulateMedia({ colorScheme: theme });
    await boot(page);

    const rawTok = await raw(page, TOKENS);
    const resTok = await resolved(page, TOKENS);

    // Write a few digits so the trace actually renders, then read its box against the board's.
    await page.evaluate(() => {
      for (let k = 0; k < 4; k++) {
        const el = Array.from(
          document.querySelectorAll<HTMLInputElement>(".sudoku-cell input"),
        ).find((i) => !i.value);
        if (!el) break;
        const setter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        )!.set!;
        setter.call(el, "1");
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    });
    await page.waitForTimeout(900);

    const geom = await page.evaluate(() => {
      const trace = document.querySelector(".progress-trace") as SVGGraphicsElement | null;
      const wrap = document.querySelector(".board-wrapper") as HTMLElement | null;
      const svg = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement | null;
      const r = (e: Element | null) => {
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return { x: b.x, y: b.y, w: b.width, h: b.height };
      };
      return {
        trace: r(trace),
        wrapper: r(wrap),
        svg: r(svg),
        traceStroke: trace ? getComputedStyle(trace).stroke : null,
        traceOpacity: trace ? getComputedStyle(trace).strokeOpacity : null,
        traceTransition: trace ? getComputedStyle(trace).transition : null,
        a11yText: document
          .querySelector(".progress-trace-a11y")
          ?.getAttribute("aria-valuetext"),
        tapeNodes: document.querySelectorAll(".count-tape").length,
      };
    });

    const row = { engine: info.project.name, theme, rawTok, resTok, geom };
    writeFileSync(
      join(OUT, `head-${info.project.name}-${theme}.json`),
      JSON.stringify(row, null, 2),
    );
    console.log(JSON.stringify(row));
  });
}
