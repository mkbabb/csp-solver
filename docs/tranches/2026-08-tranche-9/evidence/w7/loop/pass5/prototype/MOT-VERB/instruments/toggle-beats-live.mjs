// MOT-VERB pass 5 — the toggle's beat table, LIVE, per beat: every beat's selector resolved on the
// served page, the computed transition (property · duration · timing · delay) read off the element
// that beat names, after vs control, both engines. Payload-pinned (the toggle is page chrome).
import { chromium, webkit } from "playwright";
const BEATS = {
  wring: ".toggle-icon:not(.is-active) .warp", bloom: ".toggle-icon.is-active .warp", rise: ".toggle-icon.is-active",
  out: ".toggle-icon:not(.is-active)", tuck: ".toggle-icon:not(.is-active) .twinkle-star",
  star1: ".toggle-icon.is-active .twinkle-star", star2: ".toggle-icon.is-active .twinkle-star-2", star3: ".toggle-icon.is-active .twinkle-star-3",
};
const P = process.argv[2];
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch();
  const read = async (url) => { const p = await b.newPage({ viewport: { width: 1280, height: 800 } }); await p.goto(`${url}/?game=sudoku&board=${P}`, { waitUntil: "networkidle" }); await p.waitForTimeout(1500);
    const r = await p.evaluate((B) => Object.fromEntries(Object.entries(B).map(([k, s]) => { const el = document.querySelector(s); if (!el) return [k, "absent"]; const c = getComputedStyle(el); return [k, `${c.transitionProperty} | ${c.transitionDuration} | ${c.transitionTimingFunction} | ${c.transitionDelay}`]; })), BEATS); await p.close(); return r; };
  const A = await read("http://127.0.0.1:4247"), C = await read("http://127.0.0.1:4248");
  for (const k of Object.keys(BEATS)) console.log(`${name} ${k.padEnd(6)} ${A[k] === C[k] ? "SAME " : "MOVED"}  after: ${A[k]}${A[k] === C[k] ? "" : `\n${" ".repeat(22)}control: ${C[k]}`}`);
  await b.close();
}
