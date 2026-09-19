/**
 * ACC-GRAPHITE pass-3, probe 2 — G3 tied to a KNOWN written count, G4 tied to an INDEPENDENT
 * signal, and the crops.
 *
 * Probe 1's tally arm typed digits and counted subpaths without knowing how many of the
 * keystrokes the board accepted, so its counts were not a gate. Here the board tells us: the
 * progressbar's `aria-valuenow` is `round(written/writable · 100)` and the tally's subpath
 * count must be `round(written · slots / writable)` = `round(valuenow/100 · slots)` to within
 * the percent's own rounding.
 *
 * G4's givens are found by the aria-label the estate already writes ("given clue N"), never by
 * the stroke width the gate is measuring — a gate that identifies its subject by its verdict
 * cannot fail.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/ACC-GRAPHITE/readings";
const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/ACC-GRAPHITE/frames";
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });

async function settle(page: Page) {
  await page.waitForSelector(".hand-drawn-grid", { timeout: 40_000 });
  await page.waitForTimeout(1800);
}

/** Write into EMPTY cells only, one at a time, confirming each landed. Returns what stuck. */
async function writeInto(page: Page, want: number): Promise<number> {
  const empties = page.locator('.game-cell input[aria-label*="empty"]');
  let done = 0;
  for (let attempt = 0; attempt < want * 3 && done < want; attempt++) {
    const n = await empties.count();
    if (n === 0) break;
    const el = empties.first();
    await el.focus();
    await page.keyboard.type(String((done % 9) + 1));
    await page.waitForTimeout(60);
    const after = await empties.count();
    if (after < n) done++;
    else break;
  }
  await page.waitForTimeout(500);
  return done;
}

const readTally = (page: Page) =>
  page.evaluate(() => {
    const bar = document.querySelector('[role="progressbar"]');
    const now = bar ? Number(bar.getAttribute("aria-valuenow")) : null;
    const text = bar ? bar.getAttribute("aria-valuetext") : null;
    const p = document.querySelector(".progress-trace") as SVGPathElement | null;
    const d = p?.getAttribute("d") ?? "";
    const svg = p?.ownerSVGElement ?? null;
    const perUnit = svg ? svg.getBoundingClientRect().width / svg.viewBox.baseVal.width : null;
    const cs = p ? getComputedStyle(p) : null;
    return {
      valuenow: now,
      valuetext: text,
      subpaths: (d.match(/M/g) ?? []).length,
      dash: cs?.strokeDasharray ?? null,
      pathLength: p?.getAttribute("pathLength") ?? null,
      strokeUnits: cs ? parseFloat(cs.strokeWidth) : null,
      pxPerUnit: perUnit,
    };
  });

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

    // ── G4: an INDEPENDENT signal for given-ness ────────────────────────
    const authorship = await page.evaluate(() => {
      const rows: { kind: string; units: number; px: number; stroke: string }[] = [];
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
        rows.push({ kind, units, px: units * perUnit, stroke: getComputedStyle(p).stroke });
      }
      return rows;
    });

    // ── G3: three known fills ───────────────────────────────────────────
    const tally: Record<string, unknown> = { atZero: await readTally(page) };
    for (const want of [3, 20]) {
      const landed = await writeInto(page, want - (want === 20 ? 3 : 0));
      const r = await readTally(page);
      tally[`k${want}`] = { landed, ...r };
      if (rig.name === "desk" && want === 3) {
        // CROP 1 — the top strip: paper between a tick and the painted rule
        const box = await page.locator("svg.hand-drawn-grid").boundingBox();
        if (box)
          await page.screenshot({
            path: `${FRAMES}/crop1-desk-light-k3-${info.project.name}.png`,
            clip: { x: box.x + box.width / 2 - 150, y: box.y - 6, width: 300, height: 44 },
          });
      }
    }

    // CROP 3 — the focused cell and its eight neighbours at the phone rig
    if (rig.name === "phone") {
      const cells = page.locator(".game-cell");
      const n = await cells.count();
      const side = Math.round(Math.sqrt(n));
      const idx = side * 4 + 4;
      await cells.nth(idx).locator("input").focus();
      await page.waitForTimeout(500);
      const b = await cells.nth(idx).boundingBox();
      if (b)
        await page.screenshot({
          path: `${FRAMES}/crop3-phone-light-focus-${info.project.name}.png`,
          clip: {
            x: Math.max(0, b.x - b.width),
            y: Math.max(0, b.y - b.height),
            width: b.width * 3,
            height: b.height * 3,
          },
        });
    }

    writeFileSync(
      `${OUT}/g3g4-${rig.name}-${info.project.name}.json`,
      JSON.stringify({ rig: rig.name, engine: info.project.name, authorship, tally }, null, 2),
    );
    await ctx.close();
  });
