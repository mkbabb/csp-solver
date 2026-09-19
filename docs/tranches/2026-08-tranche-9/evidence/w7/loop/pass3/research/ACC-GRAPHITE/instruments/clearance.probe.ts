/**
 * G3's PER-COLUMN CLEARANCE — the briefed instrument, built.
 *
 * Pass 2 shipped "over-rule pixels = 0 at k3" and carried 6 px at desk k20, 168/146 at phone
 * k20, because the instrument it ran answers a different question: "does ANY tick ink touch the
 * rule". The gate asks for a per-column clearance MEDIAN over >= 200 columns with a tick-LENGTH
 * floor, and those are not the same number — a single fat column can red the first and leave the
 * second untouched, and 168 stray pixels can hide inside "the median is fine".
 *
 * WHAT IT MEASURES. For each sampled column x of the board raster: the y of the LAST tick pixel
 * walking inward, and the y of the FIRST rule pixel; clearance = the paper between them. A column
 * only counts if the ink it found is a TICK and not a crumb — the run must be at least
 * TICK_LENGTH_FLOOR px long, derived from the tick's own geometry (45 units x 0.636 = 28.62 px
 * desk, x 0.365 = 16.43 px phone), never a 6-px component floor.
 *
 * WHY IT DISCRIMINATES. The tick and the rule are both graphite, so colour cannot separate them.
 * Geometry can: the rule is continuous along the board's edge and the ticks are not. The probe
 * classifies a run by its LENGTH ALONG THE EDGE, which is what `.progress-pose`'s scale was
 * moved to buy.
 *
 * STATUS: DESIGNED AND UNRUN. Its subject (the tally) does not exist at HEAD `74a2b5d9`, so
 * there is nothing for it to read on the main tree; this file is the prototyper's to run inside
 * the worktree that has the tally. Every constant below is measured, not guessed — see
 * `../readings/segments-head.json` and `../readings/denominators-*.json`.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT = "REPOINT_ME/readings";

/** px per BOARD viewBox unit, measured at HEAD both engines: 1280x800 -> 0.636, 393x699 dpr3 -> 0.365. */
const PX_PER_UNIT = { desk: 0.636, phone: 0.365 };
/** LAW A's tick: 45 units of ink. The floor is the tick's own length, not a component size. */
const TICK_INK_UNITS = 45;
/** The gate's clearance floor, in px of paper between the tick's inward end and the rule. */
const CLEARANCE_FLOOR_PX = 1.5;
/** >= 200 columns, the brief's word. */
const MIN_COLUMNS = 200;

const RIGS = [
  { name: "desk" as const, width: 1280, height: 800, dpr: 1 },
  { name: "phone" as const, width: 393, height: 699, dpr: 3 },
];

async function settle(page: Page) {
  await page.waitForSelector(".hand-drawn-grid", { timeout: 30_000 });
  await page.waitForTimeout(1500);
}

/** Write `k` digits so the tally has something to count. The caller owns the board's deal. */
async function writeDigits(page: Page, k: number) {
  const cells = page.locator(".game-cell input:not([readonly])");
  const n = Math.min(k, await cells.count());
  for (let i = 0; i < n; i++) {
    await cells.nth(i).focus();
    await page.keyboard.type("1");
  }
  await page.waitForTimeout(400);
}

test.describe("G3 — per-column clearance", () => {
  for (const rig of RIGS)
    for (const k of [3, 20]) {
      test(`${rig.name} k=${k}`, async ({ browser }, info) => {
        const ctx = await browser.newContext({
          viewport: { width: rig.width, height: rig.height },
          deviceScaleFactor: rig.dpr,
          hasTouch: rig.name === "phone",
          colorScheme: "light",
        });
        const page = await ctx.newPage();
        await page.goto("/", { waitUntil: "domcontentloaded" });
        await settle(page);
        await writeDigits(page, k);

        const shot = await page.locator("svg.hand-drawn-grid").screenshot();
        const result = await page.evaluate(
          async ([b64, dprS, floorS, minColS]) => {
            const dpr = Number(dprS),
              tickFloorPx = Number(floorS),
              minCols = Number(minColS);
            const img = new Image();
            img.src = "data:image/png;base64," + b64;
            await img.decode();
            const c = document.createElement("canvas");
            c.width = img.naturalWidth;
            c.height = img.naturalHeight;
            const g = c.getContext("2d", { willReadFrequently: true })!;
            g.drawImage(img, 0, 0);
            const d = g.getImageData(0, 0, c.width, c.height).data;
            const lum = (x: number, y: number) => {
              const i = (y * c.width + x) * 4;
              return 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
            };
            const hist = new Map<number, number>();
            for (let i = 0; i < d.length; i += 4)
              hist.set(Math.round((0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 4) * 4, 0);
            // paper = the brightest well-populated bin (light theme)
            let paper = 0;
            for (let i = 0; i < d.length; i += 4) {
              const L = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
              if (L > paper) paper = L;
            }
            const ink = (x: number, y: number) => Math.abs(lum(x, y) - paper) > 28;

            // THE RULE: the board's own top frame line is the longest continuous horizontal ink
            // run in the upper fifth. Find its y by voting.
            const votes = new Map<number, number>();
            for (let y = 0; y < Math.floor(c.height / 5); y++) {
              let run = 0,
                best = 0;
              for (let x = 0; x < c.width; x++) {
                run = ink(x, y) ? run + 1 : 0;
                if (run > best) best = run;
              }
              votes.set(y, best);
            }
            const ruleY = [...votes.entries()].sort((a, b) => b[1] - a[1])[0][0];

            // Per column, walking DOWN from the top of the raster toward the rule:
            //   - the tick's run (above the rule), measured for length along x to classify it
            //   - the paper between the tick's lowest ink and the rule's first ink
            const cols: { x: number; clearancePx: number; tickRunPx: number }[] = [];
            const step = Math.max(1, Math.floor(c.width / Math.max(minCols, 1)));
            for (let x = 0; x < c.width; x += step) {
              // the rule's first ink at or below ruleY - 2
              let ruleTop = -1;
              for (let y = Math.max(0, ruleY - 3); y < Math.min(c.height, ruleY + 6); y++)
                if (ink(x, y)) {
                  ruleTop = y;
                  break;
                }
              if (ruleTop < 0) continue;
              // the last tick ink strictly above the rule, with a gap of >= 1 px of paper
              let tickBottom = -1;
              for (let y = ruleTop - 2; y >= 0; y--)
                if (ink(x, y)) {
                  tickBottom = y;
                  break;
                }
              if (tickBottom < 0) continue;
              // classify: how far does THIS run reach along x? a tick is >= tickFloorPx long.
              let x0 = x,
                x1 = x;
              while (x0 > 0 && ink(x0 - 1, tickBottom)) x0--;
              while (x1 < c.width - 1 && ink(x1 + 1, tickBottom)) x1++;
              const tickRunPx = (x1 - x0 + 1) / dpr;
              if (tickRunPx < tickFloorPx) continue; // a crumb, not a tick — the LENGTH floor
              cols.push({
                x,
                clearancePx: +((ruleTop - tickBottom - 1) / dpr).toFixed(3),
                tickRunPx: +tickRunPx.toFixed(2),
              });
            }
            const cl = cols.map((r) => r.clearancePx).sort((a, b) => a - b);
            const q = (p: number) => +(cl[Math.floor(p * (cl.length - 1))] ?? 0).toFixed(3);
            return {
              ruleY,
              columnsSampled: cols.length,
              step,
              min: cl.length ? cl[0] : null,
              p05: q(0.05),
              median: q(0.5),
              p95: q(0.95),
              max: cl.length ? cl[cl.length - 1] : null,
              negativeColumns: cl.filter((v) => v < 0).length,
              belowFloor: cl.filter((v) => v < 1.5).length,
              columns: cols,
            };
          },
          [shot.toString("base64"), String(rig.dpr), String(TICK_INK_UNITS * PX_PER_UNIT[rig.name] * 0.5), String(MIN_COLUMNS)],
        );

        mkdirSync(OUT, { recursive: true });
        writeFileSync(`${OUT}/clearance-${info.project.name}-${rig.name}-k${k}.json`, JSON.stringify({ rig, k, result }, null, 2));

        // THE GATE, born-RED against pass 1's `.progress-pose` at 0.984 (which measured -3 px):
        expect(result.columnsSampled, "at least 200 columns carry a tick").toBeGreaterThanOrEqual(MIN_COLUMNS);
        expect(result.median, "per-column clearance MEDIAN").toBeGreaterThanOrEqual(CLEARANCE_FLOOR_PX);
        expect(result.negativeColumns, "no column may have the tick ON the rule").toBe(0);
        await ctx.close();
      });
    }
});
