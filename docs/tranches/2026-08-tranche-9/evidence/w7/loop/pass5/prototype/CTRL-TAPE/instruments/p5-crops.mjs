/**
 * T9-W7 pass 5 · CTRL-TAPE — THE THREE REPLACEMENT CROPS, each a two-up on ONE payload.
 *
 *   node p5-crops.mjs <outDir> <protoBase> <controlBase>
 *
 * c1 M18's edge · chromium · dark · 390×844 · coarse (hasTouch) · dock risen, rest pose
 *    left = prototype, right = HEAD control (74a2b5d9). Retires pass4 c1-confirm-redword-390x844-dark-chromium-coarse.png.
 * c2 M18's edge · webkit · light · 1280×800 · fine · card at its scroll end
 *    left = prototype, right = HEAD control. Retires pass4 c3-pinband-band-and-chip-1440x900-light-chromium-fine.png.
 * c3 the quick set, STRIKE ballot (§14/M13) · chromium · light · 844×390 · coarse · drawer SHUT
 *    left = arm (a) the quick set as built, right = arm (b) STRIKE (the prototype with
 *    `.quick-frame { display: none }` — one variable). Retires pass4 c4-quickset-flank-844x390-light-chromium-coarse.png.
 * Each arm's givens are read back and must match (the payload dealt both).
 */
import { mkdirSync } from "node:fs";
import { ENGINES, CELLS, open, givens, sharp } from "./p5-lib.mjs";

const [OUT, PROTO, CTRL] = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
const eng = (n) => ENGINES.find(([e]) => e === n)[1];

async function arm(engine, base, cell, theme, pose, plant) {
  const br = await eng(engine).launch();
  const { ctx, page } = await open(br, base, cell, { theme, dpr: 2, prm: "reduce" });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  if (plant) await page.addStyleTag({ content: plant });
  if (pose === "end")
    await page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      c.scrollTop = c.scrollHeight;
    });
  await page.waitForTimeout(500);
  const g = await givens(page);
  const clip = await page.evaluate((pose) => {
    const vw = innerWidth, vh = innerHeight;
    if (pose === "shut") return { x: 0, y: 0, width: vw, height: vh };
    const f = document.getElementById("card-foot") || document.querySelector(".action-bar");
    const b = f.getBoundingClientRect();
    const k = document.querySelector(".drawer-case").getBoundingClientRect();
    const top = Math.max(0, b.top - 150);
    return { x: Math.max(0, k.left - 8), y: top, width: Math.min(vw, k.right + 8) - Math.max(0, k.left - 8), height: Math.min(vh, k.bottom + 8) - top };
  }, pose);
  const buf = await page.screenshot({ clip, animations: "allow", caret: "hide" });
  await ctx.close();
  await br.close();
  return { buf, g, clip };
}

async function twoUp(name, a, b, vertical = false) {
  const ma = await sharp(a.buf).metadata();
  const mb = await sharp(b.buf).metadata();
  const gap = 16;
  const W = vertical ? Math.max(ma.width, mb.width) : ma.width + gap + mb.width;
  const H = vertical ? ma.height + gap + mb.height : Math.max(ma.height, mb.height);
  const out = `${OUT}/${name}`;
  await sharp({ create: { width: W, height: H, channels: 3, background: "#808080" } })
    .composite([
      { input: a.buf, left: 0, top: 0 },
      { input: b.buf, left: vertical ? 0 : ma.width + gap, top: vertical ? ma.height + gap : 0 },
    ])
    .png({ palette: true, quality: 80, effort: 10, compressionLevel: 9 })
    .toFile(out);
  const { size } = await sharp(out).metadata();
  console.log(name, JSON.stringify({ givensEqual: a.g === b.g, givens: a.g, clipA: a.clip, clipB: b.clip, bytes: size }));
}

const p1 = await arm("chromium", PROTO, CELLS.dock390, "dark", "rest");
const c1 = await arm("chromium", CTRL, CELLS.dock390, "dark", "rest");
await twoUp("c1-m18-edge-chromium-dark-390x844-coarse-proto-vs-head.png", p1, c1);

const p2 = await arm("webkit", PROTO, CELLS.rail1280, "light", "end");
const c2 = await arm("webkit", CTRL, CELLS.rail1280, "light", "end");
await twoUp("c2-m18-edge-webkit-light-1280x800-fine-scrollend-proto-vs-head.png", p2, c2);

const shut = { width: 844, height: 390, touch: true };
const q1 = await arm("chromium", PROTO, shut, "light", "shut");
const q2 = await arm("chromium", PROTO, shut, "light", "shut", ".quick-frame{display:none!important}");
await twoUp("c3-quickset-ballot-chromium-light-844x390-coarse-built-vs-strike.png", q1, q2, true);
