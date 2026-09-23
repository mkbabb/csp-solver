// PLANT K's PAINT READING — the ONE copy (T9-W7 pass 6, the chair's instruments lane; MOT-VERB's
// pass-5 critic, critique/MOT-VERB.md §2.2). Serve the tree's clean dist at TREE_URL and the
// `plant-k.sh` dist at PLANT_URL; the board must paint ≈ the tree's dark fraction on the clean arm
// and near-solid ink on the planted arm. A re-cut that reads computed style must RED on PLANT_URL
// where this reading does; if it stays green, it cannot see paint (LAWS P5).
//   TREE_URL=http://127.0.0.1:<p1> PLANT_URL=http://127.0.0.1:<p2> [PAYLOAD=<?board= codec>] npx playwright test …
import { test, expect } from "@playwright/test";
import sharp from "sharp";
// The golden spec's PINNED_GIVENS {0:5, 2:8, 11:3, 18:6, 20:9}, encoded (CTRL-TAPE's p5-lib, LAWS P4).
const PAYLOAD =
  process.env.PAYLOAD ??
  "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
const ARMS = [
  ["tree", process.env.TREE_URL!],
  ["plantK", process.env.PLANT_URL!],
] as const;
test("plant K paint", async ({ browser }, info) => {
  const dark: Record<string, number> = {};
  for (const [n, url] of ARMS) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${url}/?game=sudoku&board=${PAYLOAD}`, { waitUntil: "networkidle" });
    const index = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
    await page.waitForTimeout(4000); // the boil's settle; PRM is reduce, the read is of the resting bake
    const buf = await page.locator(".board-peek-host .hand-drawn-grid").first().screenshot();
    const { data } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let d = 0;
    for (let i = 0; i < data.length; i += 3) if ((data[i] + data[i + 1] + data[i + 2]) / 3 < 100) d++;
    dark[n] = (100 * d) / (data.length / 3);
    const inline = await page.evaluate(() => document.querySelector<HTMLElement>(".grid-ink .boil-frame-bitmap")?.style.getPropertyValue("mask-image").slice(0, 12));
    console.log(`PLANTK[${info.project.name}·${n}] ${index} darkPx% ${dark[n].toFixed(1)} inlineMask ${inline}`);
    await ctx.close();
  }
  // the plant must be VISIBLE in paint, or the negative control proves nothing
  expect(dark.plantK - dark.tree, "Plant K must paint the board dark").toBeGreaterThan(50);
});
