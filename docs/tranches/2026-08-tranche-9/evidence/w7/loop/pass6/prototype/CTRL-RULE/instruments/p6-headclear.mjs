// T9-W7 pass 6 · CTRL-RULE row 10 — `--card-head-clear` as published, per engine, per cell, beside the
// geometry it is derived from (the pinned head's foot minus the card's first ruled line), and the
// first control's top vs the pinned head's bottom (the clear's purpose). Lane vs control.
// node p6-headclear.mjs <protoBase> <controlBase>
import { ENGINES } from "./p6-lib.mjs";
const [P, C] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const [w, h] of [[1280, 720], [1366, 768], [1280, 800]]) {
    for (const [arm, base] of [["proto", P], ["control", C]]) {
      const ctx = await br.newContext({ viewport: { width: w, height: h } });
      const p = await ctx.newPage();
      await p.goto(`${base}?size=3&board=${BOARD}`);
      await p.waitForSelector(".sudoku-cell");
      let last = null, r = null;
      for (let i = 0; i < 40; i++) {
        await p.waitForTimeout(100);
        r = await p.evaluate(() => {
          const card = document.querySelector(".controls-card");
          const v = card ? getComputedStyle(card).getPropertyValue("--card-head-clear").trim() : null;
          const inl = card?.style.getPropertyValue("--card-head-clear") || null;
          return { v, inl };
        });
        if (last && r.v === last.v) break;
        last = r;
      }
      console.log(JSON.stringify({ eng, cell: `${w}x${h}`, arm, ...r }));
      await ctx.close();
    }
  }
  await br.close();
}
