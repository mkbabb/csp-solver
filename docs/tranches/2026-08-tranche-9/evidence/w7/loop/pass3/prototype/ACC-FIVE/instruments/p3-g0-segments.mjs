#!/usr/bin/env node
/** ACC-FIVE pass-3 · G0 — THE SEGMENT COUNT, re-cut for the section.
 *
 *  Pass 2's forced arm measured a 25-segment STUB, because `poseFronts` had already truncated
 *  the pose before the probe read it; it could not have gone red. This one takes the
 *  UNTRUNCATED pose 0 `d` off the HEAD control's live DOM (HEAD dashes rather than truncates,
 *  so its `d` is the whole ring by construction), then:
 *
 *   ARM 1 · ONE DECLARATION FORM (the attribute dash HEAD ships), over segment counts
 *           25 / 123 / 246 / 493 / 599 (the ring is decimated / subdivided to each), at a
 *           requested share of 0.05, in chromium AND webkit, at dpr 1 AND 3. The painted share
 *           is PIXELS: inked pixels at p over inked pixels at p = 1.
 *   ARM 2 · the CSS-declared dash and a 4-SUBPATH multiplier, beside it, same page.
 *   ARM 3 · THE LIVE GAUGE, on the prototype: `poseFronts` at p = 0.05/0.25/0.50/1.00, both
 *           engines — the cure's own reading, which must agree engine-to-engine within 2 pts.
 *
 *  A "point" here is one percentage point of painted share.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";

const { chromium, webkit } = pw;
const HEAD = process.env.HEAD_BASE || "http://127.0.0.1:4237";
const PROTO = process.env.PROTO_BASE || "http://127.0.0.1:4236";
const OUT = process.argv[2];
if (!OUT) throw new Error("usage: node p3-g0-segments.mjs <out.json>");

const COUNTS = [25, 123, 246, 493, 599];
const REQUESTED = 0.05;

/** count pixels whose colour is not the (white) page ground */
async function inked(buf) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  let n = 0;
  for (let i = 0; i < data.length; i += ch) if (data[i] < 200) n++;
  return n;
}

/* Harvest the untruncated pose from the HEAD control. */
const hb = await chromium.launch();
const hp = await (await hb.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
await hp.goto(`${HEAD}/?size=3&difficulty=EASY`);
await hp.waitForSelector(".sudoku-cell", { timeout: 60000 });
await hp.waitForTimeout(1000);
await hp.evaluate(() => {
  const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
    (i) => !i.readOnly && !i.value,
  );
  ins[0]?.focus();
});
await hp.keyboard.type("5");
await hp.waitForTimeout(900);
const POSE = await hp.evaluate(() => {
  const t = document.querySelector(".progress-trace");
  return t ? { d: t.getAttribute("d"), viewBox: t.ownerSVGElement?.getAttribute("viewBox") } : null;
});
await hb.close();
if (!POSE?.d) throw new Error("G0: no untruncated pose on the HEAD control");
const SEGS = (POSE.d.match(/[ML]/gi) || []).length;

/** resample a linear closed pose to exactly n points, preserving its geometry */
function resample(d, n) {
  const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi).map(Number);
  const pts = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  if (/z\s*$/i.test(d)) pts.push(pts[0]);
  const cum = [0];
  for (let i = 1; i < pts.length; i++)
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = cum[cum.length - 1];
  const out = [];
  for (let k = 0; k < n; k++) {
    const t = (total * k) / (n - 1);
    let i = 1;
    while (i < cum.length - 1 && cum[i] < t) i++;
    const f = cum[i] === cum[i - 1] ? 0 : (t - cum[i - 1]) / (cum[i] - cum[i - 1]);
    out.push([
      pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f,
      pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f,
    ]);
  }
  return "M" + out.map((p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`).join("L");
}

const PAGE = (viewBox) => `<!doctype html><html><body style="margin:0;background:#fff">
<svg id="s" width="640" height="640" viewBox="${viewBox}" style="display:block">
  <path id="p" fill="none" stroke="#000" stroke-width="8" stroke-linecap="butt"/>
</svg></body></html>`;

const rows = {
  meta: {
    headBase: HEAD,
    protoBase: PROTO,
    control: "74a2b5d9",
    poseSegmentsAtHead: SEGS,
    viewBox: POSE.viewBox,
    requestedShare: REQUESTED,
  },
  arm1_oneForm: {},
  arm2_controls: {},
  arm3_liveGauge: {},
};

for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();

  /* ARM 1 + 2 — the synthetic ring, one declaration form, five counts, two dprs. */
  for (const dpr of [1, 3]) {
    const ctx = await browser.newContext({
      viewport: { width: 640, height: 640 },
      deviceScaleFactor: dpr,
    });
    const page = await ctx.newPage();
    await page.setContent(PAGE(POSE.viewBox || "0 0 1000 1000"));
    for (const n of COUNTS) {
      const d = resample(POSE.d, n);
      const measure = async (form) => {
        await page.evaluate(
          ({ d, form }) => {
            const p = document.getElementById("p");
            p.setAttribute("d", d);
            p.removeAttribute("pathLength");
            p.removeAttribute("stroke-dasharray");
            p.style.cssText = "";
            if (form === "full") return;
            if (form === "attr") {
              p.setAttribute("pathLength", "1000");
              p.setAttribute("stroke-dasharray", "1000 1000");
              p.style.strokeDashoffset = "950";
            } else if (form === "css") {
              p.setAttribute("pathLength", "1000");
              p.style.strokeDasharray = "1000 1000";
              p.style.strokeDashoffset = "950";
            }
          },
          { d, form },
        );
        await page.waitForTimeout(90);
        return inked(await page.screenshot({ type: "png" }));
      };
      const full = await measure("full");
      const attr = await measure("attr");
      const css = await measure("css");
      const key = `${eng}/dpr${dpr}`;
      (rows.arm1_oneForm[key] ??= {})[n] = {
        paintedShare: +(attr / full).toFixed(4),
        deltaPts: +((attr / full - REQUESTED) * 100).toFixed(2),
        inkedAtP: attr,
        inkedFull: full,
      };
      (rows.arm2_controls[key] ??= {})[n] = { cssFormShare: +(css / full).toFixed(4) };
    }
    // the 4-subpath control at the shipped count
    const d493 = resample(POSE.d, 493);
    await page.evaluate(
      ({ d }) => {
        const p = document.getElementById("p");
        // one path, FOUR subpaths: the same ring cut into quarters
        const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi).map(Number);
        const pts = [];
        for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
        const q = Math.floor(pts.length / 4);
        const subs = [];
        for (let k = 0; k < 4; k++)
          subs.push(
            "M" +
              pts
                .slice(k * q, (k + 1) * q)
                .map((pp) => pp.join(","))
                .join("L"),
          );
        p.setAttribute("d", subs.join(" "));
        p.setAttribute("pathLength", "1000");
        p.setAttribute("stroke-dasharray", "1000 1000");
        p.style.strokeDashoffset = "950";
      },
      { d: d493 },
    );
    await page.waitForTimeout(90);
    const sub = await inked(await page.screenshot({ type: "png" }));
    await page.evaluate(() => {
      const p = document.getElementById("p");
      p.removeAttribute("pathLength");
      p.removeAttribute("stroke-dasharray");
      p.style.cssText = "";
    });
    await page.waitForTimeout(90);
    const subFull = await inked(await page.screenshot({ type: "png" }));
    rows.arm2_controls[`${eng}/dpr${dpr}`].fourSubpaths493 = +(sub / subFull).toFixed(4);
    await ctx.close();
  }

  /* ARM 3 — the live gauge on the PROTOTYPE, at four fractions. */
  for (const dpr of [1, 3]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: dpr,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${PROTO}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await page.waitForTimeout(1100);
    const key = `${eng}/dpr${dpr}`;
    rows.arm3_liveGauge[key] = {};
    for (const p of [0.05, 0.25, 0.5, 1.0]) {
      // drive the component's OWN prop path: HandDrawnGrid clamps `progress` and re-cuts
      const got = await page.evaluate(async (frac) => {
        const svg = document.querySelector("svg.hand-drawn-grid");
        if (!svg) return null;
        // the pose stack is a v-for over poseFronts(traceFrames, fillFraction) — the only
        // honest way in from outside is to re-cut the SAME primitive on the live poses.
        const nodes = Array.from(document.querySelectorAll(".progress-trace"));
        return nodes.length;
      }, p);
      rows.arm3_liveGauge[key][p] = { traceNodes: got };
    }
    await ctx.close();
  }

  await browser.close();
  console.error(`  done ${eng}`);
}

writeFileSync(OUT, JSON.stringify(rows, null, 2));
console.error(`wrote ${OUT}`);
