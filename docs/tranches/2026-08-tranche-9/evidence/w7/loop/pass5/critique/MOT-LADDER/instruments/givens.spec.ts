import { test } from "@playwright/test";
import { createHash } from "node:crypto";
import { encodeSudoku } from "../e2e/wire";
const SOLVED_9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const BLANKS = new Set([0, 4, 10, 22, 36, 40, 55, 61, 73, 80]);
const PAYLOAD = encodeSudoku(3, Object.fromEntries(SOLVED_9.map((v, i) => [i, BLANKS.has(i) ? 0 : v])), 81);
test("givens", async ({ browser }) => {
  for (const port of [4243, 4244, 4244, 4245]) {
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(`http://127.0.0.1:${port}/?game=sudoku&board=${PAYLOAD}`);
    await p.locator(".board-cells").first().waitFor();
    await p.waitForTimeout(2500);
    const r = await p.evaluate(() => {
      const t = Array.from(document.querySelectorAll(".board-cells [aria-label]")).map((e) => e.getAttribute("aria-label")).join("|");
      return { t, len: t.length };
    });
    console.log("GIV", port, (r.t.match(/given clue/g) || []).length, r.t.length, createHash("sha1").update(r.t).digest("hex").slice(0,12));
    await p.close();
  }
  console.log("PAYLOAD", PAYLOAD);
});
