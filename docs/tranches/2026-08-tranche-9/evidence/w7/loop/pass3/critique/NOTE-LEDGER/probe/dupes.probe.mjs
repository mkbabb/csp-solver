/** Critic: how many role=status / .margin-note-previous does the page actually carry, and
 *  what does the desk pair LOOK like (the crop C4 did not show). */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/critique/NOTE-LEDGER";
const U = "http://127.0.0.1:4231/?size=3&difficulty=EASY";
const digitOf = (s) =>
  (/^only (\S+) fits here$/.exec(s) ?? [])[1] ??
  (/^(\S+) goes nowhere else/.exec(s) ?? [])[1] ??
  null;

const engine = process.argv[2];
const b = await pw[engine].launch();
const out = {};
for (const [w, h, scheme] of [
  [390, 844, "light"],
  [1280, 800, "light"],
]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
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
  const s1 = await p.evaluate(
    () => document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
  );
  const d = digitOf(s1);
  if (d) {
    await p.keyboard.type(d);
    await p.waitForTimeout(700);
  }
  await focus(0);
  await p.keyboard.press("h");
  await p.waitForTimeout(800);
  out[`${w}x${h}`] = await p.evaluate(() => {
    const st = [...document.querySelectorAll('[role="status"]')].map((n) => ({
      cls: n.className,
      parent: n.parentElement?.className,
      text: n.textContent.trim().slice(0, 40),
      rect: n.getBoundingClientRect().toJSON(),
      visible: getComputedStyle(n).display !== "none" && n.getBoundingClientRect().width > 0,
    }));
    const prev = [...document.querySelectorAll(".margin-note-previous")].map((n) => ({
      text: n.textContent.trim(),
      display: getComputedStyle(n).display,
      rect: n.getBoundingClientRect().toJSON(),
    }));
    const notes = [...document.querySelectorAll(".margin-note")].length;
    return { status: st, previous: prev, marginNotes: notes };
  });
  // crop the strip
  const box = await p.evaluate(() => {
    const blk = document.querySelector(".board-margin");
    const r = blk.getBoundingClientRect();
    return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: Math.min(r.width + 16, innerWidth), height: r.height + 44 };
  });
  await p.screenshot({
    path: `${OUT}/frames/CR-${w}x${h}-${engine}-deskpair.png`,
    clip: box,
  });
  await ctx.close();
}
await b.close();
writeFileSync(`${OUT}/probe/dupes-${engine}.json`, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1));
