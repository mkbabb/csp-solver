/**
 * verify.probe.ts — the CRITIC's own instrument for ACC-GRAPHITE pass 1.
 *
 * Re-runs, independently of the lane's `proto-board.probe.ts`:
 *   A  G3 mechanism — the tally's SUBPATH count against the number of cells actually written
 *      (k from the DOM, not from a screenshot), at k = 1 and k = 3, both engines.
 *   B  G2/AA — the focus ring's painted band and its contrast over the card, measured from a
 *      screenshot at 1280 light and dark, plus the retrace <path>'s computed paint.
 *   C  pi — every element whose computed `filter` is not `none`, counted live (the census the
 *      budget row claims went 9 -> 8), and the given-glyph stroke width on the GALLERY's own
 *      surface (a surface this family does not claim).
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

async function boot(page: Page) {
  await page.goto("./?size=3&difficulty=HARD");
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(900);
}

/** write `n` empty cells with a digit; returns how many cells now hold a player value. */
async function write(page: Page, n: number): Promise<number> {
  const idx: number[] = await page.evaluate((count: number) => {
    const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
    const out: number[] = [];
    for (let i = 0; i < cells.length && out.length < count; i++) {
      const input = cells[i].querySelector<HTMLInputElement>("input");
      if (input && !input.value) out.push(i);
    }
    return out;
  }, n);
  for (const i of idx) {
    await page.evaluate((j: number) => {
      document
        .querySelectorAll<HTMLElement>(".sudoku-cell")
        [j].querySelector<HTMLInputElement>("input")
        ?.focus();
    }, i);
    await page.keyboard.type("5");
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(500);
  return page.evaluate(
    () =>
      [...document.querySelectorAll<HTMLElement>(".sudoku-cell")].filter((c) => {
        const input = c.querySelector<HTMLInputElement>("input");
        return (
          !!input?.value && !/given clue/i.test(c.getAttribute("aria-label") ?? "")
        );
      }).length,
  );
}

async function tallyRead(page: Page) {
  return page.evaluate(() => {
    const paths = [...document.querySelectorAll<SVGPathElement>(".progress-trace")];
    const active =
      document.querySelector<SVGPathElement>(".progress-pose.is-active .progress-trace") ??
      paths[0];
    const d = active?.getAttribute("d") ?? "";
    const cs = active ? getComputedStyle(active) : null;
    return {
      poses: paths.length,
      subpaths: (d.match(/M/g) ?? []).length,
      dLen: d.length,
      stroke: cs?.stroke ?? "",
      strokeWidth: cs?.strokeWidth ?? "",
      dasharray: cs?.strokeDasharray ?? "",
      poseTransform: active?.parentElement
        ? getComputedStyle(active.parentElement).transform
        : "",
    };
  });
}

for (const scheme of ["light", "dark"] as const) {
  test(`A/B — tally subpaths, ring band, AA — desk ${scheme}`, async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    await boot(page);

    const rec: Record<string, unknown> = { scheme, browserName };

    // ── A. the tally, at k = 1 and k = 3, counted from the DOM ────────────────
    const k1 = await write(page, 1);
    rec.k1 = { written: k1, tally: await tallyRead(page) };
    const k3 = await write(page, 2);
    rec.k3 = { written: k3, tally: await tallyRead(page) };

    // the denominator the tally is actually pitched on
    rec.writable = await page.evaluate(() => {
      const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
      const givens = cells.filter((c) =>
        /given clue/i.test(c.getAttribute("aria-label") ?? ""),
      ).length;
      return { total: cells.length, givens, writable: cells.length - givens };
    });

    // ── B. the ring: focus a blank cell, read both paths, measure the band ────
    const target = await page.evaluate(() => {
      const cells = [...document.querySelectorAll<HTMLElement>(".sudoku-cell")];
      for (let i = 20; i < cells.length; i++) {
        const input = cells[i].querySelector<HTMLInputElement>("input");
        if (input && !input.value) {
          input.focus();
          const r = cells[i].getBoundingClientRect();
          return { i, x: r.x, y: r.y, w: r.width, h: r.height };
        }
      }
      return null;
    });
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(400);

    rec.ring = await page.evaluate(() => {
      const cell = document.querySelector(".game-cell:has(input:focus-visible)");
      const main = cell?.querySelector<SVGPathElement>(".cell-ghost-path");
      const re = cell?.querySelector<SVGPathElement>(".cell-ghost-retrace");
      const g = (el: Element | null | undefined) => {
        if (!el) return null;
        const cs = getComputedStyle(el);
        return {
          display: cs.display,
          stroke: cs.stroke,
          strokeWidth: cs.strokeWidth,
          strokeOpacity: cs.strokeOpacity,
          fill: cs.fill,
          fillOpacity: cs.fillOpacity,
        };
      };
      return {
        focused: !!cell,
        main: g(main),
        retrace: g(re),
        card: getComputedStyle(document.documentElement).getPropertyValue("--color-card"),
        graphite: getComputedStyle(document.documentElement).getPropertyValue(
          "--grid-line-color",
        ),
        userInk: getComputedStyle(document.documentElement).getPropertyValue(
          "--color-user-ink",
        ),
        crayonBlue: getComputedStyle(document.documentElement).getPropertyValue(
          "--color-crayon-blue",
        ),
        focusSketch: getComputedStyle(document.documentElement).getPropertyValue(
          "--color-focus-sketch",
        ),
        progressInk: getComputedStyle(document.documentElement).getPropertyValue(
          "--color-progress-ink",
        ),
      };
    });

    if (target) {
      const buf = await page.screenshot({
        clip: {
          x: Math.max(0, target.x - 4),
          y: Math.max(0, target.y - 4),
          width: target.w + 8,
          height: target.h + 8,
        },
        type: "png",
      });
      const { data, info } = await sharp(buf)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const { width: w, height: h, channels: ch } = info;
      const L = (i: number) => {
        const s = (v: number) => {
          const c = v / 255;
          return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * s(data[i]) + 0.7152 * s(data[i + 1]) + 0.0722 * s(data[i + 2]);
      };
      // scan the cell's mid row; report every ink run and the darkest/lightest luminance
      const y = Math.floor(h / 2);
      const runs: { a: number; b: number; L: number }[] = [];
      let cur: { a: number; b: number; L: number } | null = null;
      const paperL = L((2 * w + Math.floor(w / 2)) * ch);
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * ch;
        const l = L(i);
        const ink = scheme === "dark" ? l > paperL + 0.08 : l < paperL - 0.08;
        if (ink) {
          if (!cur) cur = { a: x, b: x, L: l };
          else {
            cur.b = x;
            cur.L = scheme === "dark" ? Math.max(cur.L, l) : Math.min(cur.L, l);
          }
        } else if (cur) {
          runs.push(cur);
          cur = null;
        }
      }
      if (cur) runs.push(cur);
      const ratio = (a: number, b: number) =>
        +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2);
      rec.band = {
        cellCssPx: { w: target.w, h: target.h },
        cropPx: { w, h },
        paperL: +paperL.toFixed(4),
        runs: runs.map((r) => ({
          from: r.a,
          to: r.b,
          px: r.b - r.a + 1,
          L: +r.L.toFixed(4),
          ratioOverPaper: ratio(r.L, paperL),
        })),
      };
    }

    writeFileSync(
      join(OUT, `verify-${scheme}-${browserName}.json`),
      JSON.stringify(rec, null, 2),
    );
    console.log(JSON.stringify(rec, null, 2));
  });
}

test("C — pi: the live filter population and the gallery's own clue weight", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await boot(page);
  const board = await page.evaluate(() => {
    const out: { sel: string; filter: string }[] = [];
    for (const el of document.querySelectorAll<HTMLElement | SVGElement>("*")) {
      const f = getComputedStyle(el).filter;
      if (f && f !== "none")
        out.push({
          sel: `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(/\s+/).slice(0, 2).join(".") : ""}`,
          filter: f,
        });
    }
    const glyph = document.querySelector<SVGPathElement>(
      ".sudoku-cell .glyph-svg path",
    );
    return {
      filters: out,
      filterCount: out.length,
      sparkle: !!document.querySelector(".sparkle-icon"),
      sparkleFilter: document.querySelector(".sparkle-icon")
        ? getComputedStyle(document.querySelector(".sparkle-icon")!).filter
        : null,
      sampleGlyphStrokeWidth: glyph?.getAttribute("stroke-width") ?? null,
    };
  });

  // the gallery: a surface this family does not claim
  await page.goto("./");
  await page.waitForTimeout(1800);
  const gallery = await page.evaluate(() => {
    const strokes: Record<string, number> = {};
    for (const p of document.querySelectorAll<SVGPathElement>("path[stroke-width]")) {
      const w = p.getAttribute("stroke-width")!;
      strokes[w] = (strokes[w] ?? 0) + 1;
    }
    const s = getComputedStyle(document.documentElement);
    return {
      strokeWidthHistogram: strokes,
      crayonBlue: s.getPropertyValue("--color-crayon-blue"),
      userInk: s.getPropertyValue("--color-user-ink"),
      blueClassNodes: document.querySelectorAll(".crayon-blue").length,
      cards: document.querySelectorAll(".game-card, [class*='game-card']").length,
    };
  });

  writeFileSync(
    join(OUT, `pi-${browserName}.json`),
    JSON.stringify({ board, gallery }, null, 2),
  );
  console.log(JSON.stringify({ board, gallery }, null, 2));
});
