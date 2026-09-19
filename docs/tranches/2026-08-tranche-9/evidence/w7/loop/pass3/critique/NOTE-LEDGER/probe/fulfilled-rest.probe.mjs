/** Critic: the state the family's own canonical loop LEAVES the reader in — the record has
 *  been fulfilled, line one is empty, and the column is ONE quiet caption line. Never shot. */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/critique/NOTE-LEDGER";
const U = "http://127.0.0.1:4231/?size=3&difficulty=EASY";
const digitOf = (s) =>
  (/^only (\S+) fits here$/.exec(s) ?? [])[1] ?? (/^(\S+) goes nowhere else/.exec(s) ?? [])[1] ?? null;
const engine = process.argv[2];
const b = await pw[engine].launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
// hook the push so we can see whether it fires from an EMPTY line one
await p.addInitScript(() => {
  window.__pushes = [];
  const orig = Element.prototype.animate;
  Element.prototype.animate = function (kf, o) {
    if (this.classList?.contains("margin-note-previous"))
      window.__pushes.push({ kf: JSON.parse(JSON.stringify(kf)), o: JSON.parse(JSON.stringify(o)) });
    return orig.call(this, kf, o);
  };
});
await p.goto(U);
await p.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
await p.waitForTimeout(1500);
const focus = (k) =>
  p.evaluate((n) => {
    const all = [...document.querySelectorAll(".board-cells input")];
    all.filter((i) => !i.value && !i.readOnly && !i.disabled)[n]?.focus();
  }, k);
await focus(0);
await p.keyboard.press("h");
await p.waitForTimeout(700);
const s1 = await p.evaluate(() => document.querySelector(".margin-note")?.textContent?.trim() ?? "");
const d = digitOf(s1);
await p.keyboard.type(d ?? "1");
await p.waitForTimeout(900);
const state = await p.evaluate(() => {
  const one = document.querySelector(".margin-note");
  const two = document.querySelector(".margin-note-previous");
  return {
    lineOne: one?.textContent.trim() ?? "",
    lineTwo: two?.textContent.trim() ?? "",
    lineOneRect: one?.getBoundingClientRect().toJSON(),
    lineTwoRect: two?.getBoundingClientRect().toJSON(),
    pushes: window.__pushes,
    blockRect: document.querySelector(".margin-note-block")?.getBoundingClientRect().toJSON(),
  };
});
const box = await p.evaluate(() => {
  const r = document.querySelector(".board-margin").getBoundingClientRect();
  return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 10), width: Math.min(r.width + 16, innerWidth), height: r.height + 46 };
});
await p.screenshot({ path: `${OUT}/frames/CR-390x844-${engine}-fulfilled-at-rest.png`, clip: box });
writeFileSync(`${OUT}/probe/fulfilled-${engine}.json`, JSON.stringify(state, null, 2));
console.log(JSON.stringify({ lineOne: state.lineOne, lineTwo: state.lineTwo, pushes: state.pushes }, null, 1));
await ctx.close();
await b.close();
