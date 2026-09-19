import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

/**
 * The living mark's swap rules are DESCENDANT selectors hung off `[data-mark-pose]`, and that
 * attribute is written on the GRID (GameBoard.vue :1045), not on the cell that is living. This
 * asks the only question that follows: at poses 1..3, what happens to the ONE ghost path every
 * OTHER cell has — the conflict ring, the peer cursor, the hovered ring — all three of which
 * §5's tier table declares STILL?
 *
 * The page quotes the prototype's rules verbatim and reproduces DigitCell's DOM shape. No
 * product file is touched.
 */
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/MRK-LIVE/logs";
mkdirSync(OUT, { recursive: true });

test("the cascade's reach at poses 0..3", async ({ page, browserName }) => {
  await page.goto(
    pathToFileURL(
      "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/critique/MRK-LIVE/probe/cascade.spec.html",
    ).href,
  );
  const rows = await page.evaluate(() => {
    const grid = document.getElementById("grid")!;
    const eff = (id: string) => {
      const el = document.getElementById(id)!;
      // What the reader actually sees: the path's own opacity times its wrapper's.
      const own = parseFloat(getComputedStyle(el).opacity);
      const wrap = parseFloat(
        getComputedStyle(el.closest(".cell-ghost") as HTMLElement).opacity,
      );
      return { own, effective: +(own * wrap).toFixed(3) };
    };
    const out: Record<string, unknown>[] = [];
    for (const pose of ["0", "1", "2", "3"]) {
      grid.setAttribute("data-mark-pose", pose);
      out.push({
        pose,
        focusedPaths: ["f0", "f1", "f2", "f3"].map((i) => eff(i).own),
        conflictRing: eff("c0"),
        peerCursor: eff("p0"),
        hoverRing: eff("h0"),
      });
    }
    return out;
  });
  writeFileSync(
    `${OUT}/cascade-reach-${browserName}.json`,
    JSON.stringify(rows, null, 2),
  );
  console.log(browserName, JSON.stringify(rows));
});
