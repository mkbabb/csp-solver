import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/MRK-LIVE/logs";
mkdirSync(OUT, { recursive: true });
test("B2 · does a pure TRANSLATION of the target re-bake the four poses", async ({ page, browserName }) => {
  await page.goto("/?game=sudoku&size=9");
  await page.waitForSelector(".logo-trigger", { timeout: 60000 });
  await page.waitForTimeout(1500);
  const res = await page.evaluate(async () => {
    const btn = document.querySelector<HTMLElement>(".logo-trigger")!;
    btn.focus();
    await new Promise((r) => setTimeout(r, 900));
    const ring = document.querySelector<SVGElement>(".focus-ring")!;
    const dOf = () => Array.from(ring.querySelectorAll("path")).map((p) => p.getAttribute("d") ?? "");
    const before = dOf();
    const boxBefore = ring.getBoundingClientRect();
    let dWrites = 0;
    const mo = new MutationObserver((recs) => { for (const r of recs) if (r.attributeName === "d") dWrites++; });
    mo.observe(ring, { attributes: true, subtree: true });
    // A pure move: same width and height, new left/top. Then poke the listener the component owns.
    btn.style.position = "relative";
    btn.style.left = "40px";
    window.dispatchEvent(new Event("resize"));
    await new Promise((r) => setTimeout(r, 400));
    mo.disconnect();
    const after = dOf();
    const boxAfter = ring.getBoundingClientRect();
    return {
      moved: Math.round(boxAfter.left - boxBefore.left),
      sameSize: boxAfter.width === boxBefore.width && boxAfter.height === boxBefore.height,
      dWrites,
      geometryRebaked: JSON.stringify(before) !== JSON.stringify(after),
      poses: before.length,
    };
  });
  writeFileSync(`${OUT}/B2-rebake-${browserName}.json`, JSON.stringify(res, null, 2));
  console.log("B2", browserName, JSON.stringify(res));
});
