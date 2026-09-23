/** ACC-FIVE pass 6 · which HARD-bank board inks the most tally strokes: every 9×9 hard template minted
 *  as a `?board=` payload (the four-line codec), read back, and the tally's inked stroke count read
 *  off ONE pose (`.dt-pose .dt-stroke.inked`; every pose repeats the strokes) once the tally leaves
 *  `is-ungraded` (the grade lands off the solver worker). The first cut polled only 10 s and read the
 *  dashed placeholder as "no strokes" (null on every template). */
import { readFileSync, readdirSync } from "node:fs";
import { chromium, mint, READ_GIVENS } from "./p6-lib.mjs";
const [BASE] = process.argv.slice(2);
const DIR = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/csp-solver/data/sudoku_puzzles/3/hard";
const b = await chromium.launch();
const p = await (await b.newContext({ reducedMotion: "reduce", viewport: { width: 1280, height: 800 } })).newPage();
for (const f of readdirSync(DIR).sort((a, c) => parseInt(a.slice(9)) - parseInt(c.slice(9)))) {
  const t = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8")).puzzle;
  const cells = Array.from({ length: 81 }, (_, i) => t[i] ?? 0);
  const payload = mint(3, cells);
  await p.goto(`${BASE}/?wire=local&size=3&board=${payload}`);
  await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
  let r = null;
  const t0 = Date.now();
  for (let k = 0; k < 120; k++) {
    r = await p.evaluate(() => {
      const t = document.querySelector(".difficulty-tally");
      const pose = document.querySelector(".dt-pose");
      return t ? { graded: !t.classList.contains("is-ungraded"), label: t.getAttribute("aria-label"), inked: pose ? pose.querySelectorAll(".dt-stroke.inked").length : null } : null;
    });
    if (r?.graded) break;
    await p.waitForTimeout(250);
  }
  const got = await p.evaluate(READ_GIVENS);
  const same = got.every((v, i) => v === cells[i]);
  console.log(`${f} givens ${cells.filter(Boolean).length} readback ${same} graded ${r?.graded} in ${Date.now() - t0} ms inked ${r?.inked} label "${r?.label}" payload ${payload}`);
}
await b.close();
console.log("ALLDONE");
