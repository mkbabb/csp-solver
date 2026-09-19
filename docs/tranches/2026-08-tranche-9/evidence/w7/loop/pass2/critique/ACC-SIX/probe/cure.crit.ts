/**
 * THE ONE INSTRUMENT PASS 3 SHOULD KEEP (T9-W7 ACC-SIX critique, pass 2).
 *
 * The prototype's G0 stays RED after the `pathLength` deletion and it PROPOSES, without
 * building it, a next cure: slice the pose polyline to the wanted arc length at bake time
 * and render a partial `d`, no dash at all. This probe drives both forms on the live board
 * without touching the product — the shipped dash declaration first, then the same pose
 * truncated by hand — and counts the painted violet in each. Readings (desk, light, reduce,
 * one write of twenty already on the board, then the pose driven to p directly):
 *
 *   p      dash chromium / webkit      slice chromium / webkit
 *   0.05   691 / 2719  (3.94x)         689 / 693   (1.006x)
 *   0.25   (polluted)  / 6074          2908 / 2934 (1.009x)
 *   0.50   (polluted)  / 6764          6222 / 6312 (1.014x)
 *
 * The dash arm's p=0.25/0.50 cells are unreliable: Vue re-renders on the boil beat 8/s and
 * restores its own `:style` binding, so only the first reading of each arm is clean. The
 * SLICE arm survived (it overwrites `d`, which the beat only rewrites on a pose swap) and
 * is the row that matters: the two engines agree to 1.4% at every p, and at p=0.05 the
 * slice in BOTH engines equals chromium's correct dash reading (689/693 vs 691).
 *
 * Ran against a private dev server on 127.0.0.1:4238 out of the prototype worktree
 * `.claude/worktrees/wf_8630d340-e56-42`, through a scratch playwright config with no
 * webServer. Both were removed when the lane returned; the file is banked here so pass 3
 * does not re-derive it.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT = "<this dir>/../readings";
mkdirSync(OUT, { recursive: true });
const isViolet = (r: number, g: number, b: number) => b - g >= 60 && r > g && b > r;

async function violet(
  page: Page,
  clip: { x: number; y: number; width: number; height: number },
) {
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  let n = 0;
  for (let i = 0; i < data.length; i += info.channels)
    if (isViolet(data[i]!, data[i + 1]!, data[i + 2]!)) n++;
  return n;
}

test("the slice cure, both engines", async ({ page, browserName }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector(".sudoku-cell", { timeout: 25000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 25000 })
    .toBeGreaterThan(0);
  // one write, so the pose stack exists at all (`v-for` yields nothing at progress 0)
  const inputs = page.locator(".sudoku-cell input:not([readonly]):not([disabled])");
  const total = await inputs.count();
  for (let i = 0; i < total; i++) {
    const el = inputs.nth(i);
    if ((await el.inputValue()) !== "") continue;
    await el.click();
    await page.keyboard.press("1");
    break;
  }
  await page.waitForTimeout(400);
  const bb = await page.evaluate(() => {
    const b = document.querySelector(".board-wrapper") as HTMLElement | null;
    if (!b) return null;
    const r = b.getBoundingClientRect();
    return {
      x: r.x + b.clientLeft,
      y: r.y + b.clientTop,
      w: b.clientWidth,
      h: b.clientHeight,
    };
  });
  const clip = {
    x: Math.max(0, Math.floor(bb!.x) - 8),
    y: Math.max(0, Math.floor(bb!.y) - 8),
    width: Math.ceil(bb!.w) + 16,
    height: Math.ceil(bb!.h) + 16,
  };
  const out: Record<string, unknown> = { engine: browserName };
  for (const p of [0.05, 0.25, 0.5]) {
    // A · the shipped declaration, driven straight to p
    await page.evaluate((frac) => {
      const poses = [...document.querySelectorAll(".progress-pose")] as HTMLElement[];
      for (const g of poses) g.style.opacity = "0";
      const g0 = poses[0]!;
      g0.style.opacity = "1";
      const path = g0.querySelector(".progress-trace") as SVGPathElement;
      const L = path.getTotalLength();
      path.style.strokeDasharray = `${L}px ${L}px`;
      path.style.strokeDashoffset = `${L * (1 - frac)}px`;
      (window as any).__origD = (window as any).__origD || path.getAttribute("d");
      path.setAttribute("d", (window as any).__origD);
    }, p);
    await page.waitForTimeout(250);
    const dash = await violet(page, clip);

    // B · the SLICE: the same pose truncated to p of its arc length, no dash at all
    await page.evaluate((frac) => {
      const g0 = document.querySelector(".progress-pose") as HTMLElement;
      const path = g0.querySelector(".progress-trace") as SVGPathElement;
      const d = (window as any).__origD as string;
      const nums = d.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
      const pts: [number, number][] = [];
      for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i]!, nums[i + 1]!]);
      if (/z\s*$/i.test(d)) pts.push(pts[0]!);
      let totalLen = 0;
      for (let i = 1; i < pts.length; i++)
        totalLen += Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
      const want = totalLen * frac;
      let acc = 0;
      const outPts: string[] = [`M${pts[0]![0]},${pts[0]![1]}`];
      for (let i = 1; i < pts.length; i++) {
        const seg = Math.hypot(pts[i]![0] - pts[i - 1]![0], pts[i]![1] - pts[i - 1]![1]);
        if (acc + seg >= want) {
          const t = (want - acc) / seg;
          outPts.push(
            `L${pts[i - 1]![0] + (pts[i]![0] - pts[i - 1]![0]) * t},${
              pts[i - 1]![1] + (pts[i]![1] - pts[i - 1]![1]) * t
            }`,
          );
          break;
        }
        acc += seg;
        outPts.push(`L${pts[i]![0]},${pts[i]![1]}`);
      }
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      path.setAttribute("d", outPts.join(""));
    }, p);
    await page.waitForTimeout(250);
    const slice = await violet(page, clip);
    out[`p${p}`] = { dashPx: dash, slicePx: slice };
  }
  writeFileSync(join(OUT, `cure-${browserName}.json`), JSON.stringify(out, null, 2));
});
