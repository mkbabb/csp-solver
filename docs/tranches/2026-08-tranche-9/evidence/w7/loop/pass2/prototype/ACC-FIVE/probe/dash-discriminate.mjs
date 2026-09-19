/**
 * dash-discriminate.mjs — the section finding, re-bounded on the CURED gauge.
 *
 * The pass-2 synthesis named `pathLength` as the cause and dropping it as the cure. On the
 * built prototype that is FALSE: with no `pathLength` at all and the dash in real user units,
 * WebKit still paints four runs. This probe separates the three candidate triggers on the
 * SAME live element, so the ruling rests on a measurement rather than on which of them moved
 * first:
 *
 *   A  attr dasharray `L L`   + style offset      — what the prototype currently ships
 *   B  CSS  dasharray `L L`   + style offset      — ACC-GRAPHITE's E arm (spelling)
 *   C  attr dasharray `pL (1-p)L` + offset 0      — period EXACTLY the path length
 *   D  CSS  dasharray `pL (1-p)L` + offset 0      — both changes at once
 *
 *   ACC_FIVE_OUT=<dir> node dash-discriminate.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";
import { OUT, GOLD, board, writeOne, ringSamples, runsAndShare, raw } from "./lib.mjs";

const N = 1440;
const FRACS = [0.05, 0.25, 0.5];
const SEL = ".progress-pose.is-active .progress-trace";
const out = {};

const apply = (page, arm, p) =>
  page.evaluate(
    ({ arm, p }) => {
      for (const el of document.querySelectorAll(".progress-trace")) {
        const L = el.getTotalLength();
        el.removeAttribute("stroke-dasharray");
        el.style.strokeDasharray = "";
        el.style.strokeDashoffset = "";
        if (arm === "A") {
          el.setAttribute("stroke-dasharray", `${L} ${L}`);
          el.style.strokeDashoffset = String(L * (1 - p));
        } else if (arm === "B") {
          el.style.strokeDasharray = `${L}px ${L}px`;
          el.style.strokeDashoffset = String(L * (1 - p));
        } else if (arm === "C") {
          el.setAttribute("stroke-dasharray", `${p * L} ${(1 - p) * L}`);
          el.style.strokeDashoffset = "0";
        } else {
          el.style.strokeDasharray = `${p * L}px ${(1 - p) * L}px`;
          el.style.strokeDashoffset = "0";
        }
      }
    },
    { arm, p },
  );

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  const ctx = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  const grid = await board(page);
  await writeOne(page);

  for (const arm of ["A", "B", "C", "D"]) {
    for (const p of FRACS) {
      await apply(page, arm, p);
      await page.waitForTimeout(350);
      const b = await grid.boundingBox();
      const clip = {
        x: Math.max(0, Math.floor(b.x - 14)),
        y: Math.max(0, Math.floor(b.y - 14)),
        width: Math.ceil(b.width + 28),
        height: Math.ceil(b.height + 28),
      };
      const { data, info, ch } = await raw(await page.screenshot({ clip, type: "png" }));
      const pts = await ringSamples(page, SEL, N);
      const inked = pts.map(([vx, vy]) => {
        let best = 0;
        let bh = null;
        for (let dx = -2; dx <= 2; dx++)
          for (let dy = -2; dy <= 2; dy++) {
            const x = Math.round(vx - clip.x) + dx;
            const y = Math.round(vy - clip.y) + dy;
            if (x < 0 || y < 0 || x >= info.width || y >= info.height) continue;
            const o = (y * info.width + x) * ch;
            const c = rgbToOklch(data[o], data[o + 1], data[o + 2]);
            if (c.C > best) {
              best = c.C;
              bh = c.h;
            }
          }
        const d = bh == null ? 999 : Math.abs(bh - GOLD.light);
        return best >= 0.05 && Math.min(d, 360 - d) <= 25;
      });
      const r = runsAndShare(inked);
      out[`${engine}/${arm}/p${p}`] = r;
      console.log(`  ${engine} arm ${arm} p=${p} runs=${r.runs} share=${r.share}`);
    }
  }
  await ctx.close();
  await browser.close();
}

const verdict = {};
for (const arm of ["A", "B", "C", "D"])
  verdict[arm] = FRACS.map((p) => {
    const c = out[`chromium/${arm}/p${p}`];
    const w = out[`webkit/${arm}/p${p}`];
    return {
      p,
      chromium: c.share,
      webkit: w.share,
      deltaPoints: +(Math.abs(c.share - w.share) * 100).toFixed(2),
      runs: [c.runs, w.runs],
      within2: Math.abs(c.share - w.share) * 100 <= 2,
    };
  });
out.verdict = verdict;
writeFileSync(`${OUT}/dash-discriminate.json`, JSON.stringify(out, null, 2));
for (const [arm, rows] of Object.entries(verdict))
  console.log(arm, rows.every((r) => r.within2) ? "GREEN" : "RED", JSON.stringify(rows.map((r) => r.deltaPoints)));
