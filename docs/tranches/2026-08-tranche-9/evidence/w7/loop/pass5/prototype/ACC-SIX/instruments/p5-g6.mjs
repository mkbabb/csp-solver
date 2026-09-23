// ACC-SIX pass-5 — G6 ON THE FOLD'S OWN ATTRIBUTION TAPE, ACROSS TWO PEERS (charter row 10).
// DEV mode (`?wire=local` forms no room on a dist — LAWS P4): page A deals and invites; B and C
// open A's URL in the same context; B writes cell i, C writes cell j (the solution's digits).
// On A (fine pointer) the pointer rests on i, then on j: the tape names B, then C. G6 reads the
// tape's own `clip-path` and `--washi-tilt` (SheetWashiLabel's root span) and its box at each
// rest. Prototype: byte-equal across the two names (one seed, 97). Control 74a2b5d9: the tear
// mixes the text's FIRST CHARACTER into the seed, so it differs exactly when the two slugs start
// with different letters — the row reports both first letters, and a same-letter pair is
// declared NON-DISCRIMINATING rather than counted.
// usage: ARMS=proto=http://127.0.0.1:4239,control=http://127.0.0.1:4240 node p5-g6.mjs <out.json>
import { writeFileSync } from "node:fs";
import { ENGINES } from "./p5-common.mjs";
const ARMS = Object.fromEntries((process.env.ARMS || "").split(",").map((s) => s.split("=")));
const TAPE = () => {
  const s = document.querySelector(".attribution-tape .washi-label");
  if (!s) return null;
  const cs = getComputedStyle(s); const r = s.getBoundingClientRect();
  return { text: s.textContent.trim(), clip: s.style.clipPath, tilt: s.style.getPropertyValue("--washi-tilt"), computedClip: cs.clipPath, rect: [r.x, r.y, r.width, r.height].map((v) => +v.toFixed(2)) };
};
async function writeInto(page, i, digit) {
  await page.evaluate((k) => document.querySelectorAll(".sudoku-cell input")[k].focus(), i);
  await page.keyboard.type(String(digit));
  await page.waitForTimeout(400);
  await page.evaluate(() => document.activeElement?.blur?.());
}
const out = { arms: ARMS, control: "74a2b5d9", runs: {} };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const [arm, base] of Object.entries(ARMS)) for (let attempt = 1; attempt <= Number(process.env.TRIES || 4); attempt++) {
    if (out.runs[`${eng}/${arm}`]?.discriminating) break;
    const R = (out.runs[`${eng}/${arm}`] = { attempt });
    try {
      const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
      const a = await ctx.newPage();
      await a.goto(base + "/?wire=local&size=3&difficulty=EASY");
      await a.waitForSelector(".sudoku-cell input", { timeout: 60000 });
      await a.waitForTimeout(2000);
      const verb = a.locator('button[aria-label="Play together on this board"]').first();
      await verb.waitFor({ state: "visible", timeout: 20000 });
      await verb.click();
      await a.waitForTimeout(1500);
      const url = await a.evaluate(() => location.href);
      R.room = /room=|#/.test(url) ? "formed" : url;
      const b = await ctx.newPage(); await b.goto(url); await b.waitForSelector(".sudoku-cell input", { timeout: 60000 });
      const c = await ctx.newPage(); await c.goto(url); await c.waitForSelector(".sudoku-cell input", { timeout: 60000 });
      await a.waitForTimeout(2500);
      const empties = await a.evaluate(() => Array.from(document.querySelectorAll(".sudoku-cell input")).map((x, k) => (x.value ? -1 : k)).filter((k) => k >= 9));
      const [i, j] = [empties[0], empties[Math.min(12, empties.length - 1)]];
      await writeInto(b, i, 1); await writeInto(c, j, 2);
      await a.waitForTimeout(2000);
      const center = (k) => a.evaluate((kk) => { const r = document.querySelectorAll(".sudoku-cell")[kk].getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, k);
      const rest = async (k) => { const [x, y] = await center(k); await a.mouse.move(x, y, { steps: 4 }); await a.waitForTimeout(700); return a.evaluate(TAPE); };
      R.cells = [i, j];
      R.onB = await rest(i);
      R.onC = await rest(j);
      R.onBAgain = await rest(i);
      if (R.onB && R.onC) {
        R.namesDiffer = R.onB.text !== R.onC.text;
        R.firstLetters = [R.onB.text[0], R.onC.text[0]];
        R.discriminating = R.onB.text.charCodeAt(0) !== R.onC.text.charCodeAt(0);
        R.clipEqual = R.onB.clip === R.onC.clip;
        R.tiltEqual = R.onB.tilt === R.onC.tilt;
        R.boxShift = R.onB.rect.map((v, k) => +(R.onC.rect[k] - v).toFixed(2));
      }
      await ctx.close();
    } catch (e) { R.error = String(e).slice(0, 200); }
    console.error("done", eng, arm, JSON.stringify({ names: [R.onB?.text, R.onC?.text], clipEqual: R.clipEqual, tiltEqual: R.tiltEqual, err: R.error }));
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.error("wrote");
