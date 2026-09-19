#!/usr/bin/env node
// T9-W7 pass-3 research · MOT-LADDER · A FIXED-TIME SAMPLER FOR THE DUSK (gap 11)
//
// Pass 2 compared the theme flip's painted colours frame by frame and the critic called it
// what it is: a race, not an identity proof. A CSS transition is an Animation object; if the
// engine lets the probe PAUSE it and set `currentTime`, the sampler stops being a race — the
// same t on both trees, read from `getComputedStyle`, is an identity proof by construction.
//
// This measures the method, not the estate: can both engines scrub a running CSS transition
// on `background-color`, and does `ease` (the dusk's UA curve) sample identically to a named
// `cubic-bezier(0.25, 0.1, 0.25, 1)` (the proposed `--ease-dusk`)?
//
// usage: node scrub-sampler-feasibility.mjs

import { createRequire } from "node:module";
const require = createRequire(
  (process.env.PW_ROOT ??
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend") +
    "/package.json"
);
const { chromium, webkit } = require("playwright");

const page_html = (curve) => `<!doctype html><html><head><style>
  #a { width:50px; height:50px; background-color: rgb(250, 248, 240);
       transition: background-color 350ms ${curve}; }
  #a.dark { background-color: rgb(24, 26, 30); }
</style></head><body><div id="a"></div></body></html>`;

const SAMPLE = async (page, curve) => {
  await page.setContent(page_html(curve));
  return page.evaluate(async () => {
    const el = document.getElementById("a");
    getComputedStyle(el).backgroundColor; // force a first style resolution
    el.classList.add("dark");
    const anims = el.getAnimations();
    if (!anims.length) return { ok: false, reason: "no Animation object for the transition" };
    const a = anims[0];
    a.pause();
    const out = [];
    for (let t = 0; t <= 350; t += 35) {
      a.currentTime = t;
      // a paused animation's effect is applied at the next style resolution
      out.push([t, getComputedStyle(el).backgroundColor]);
    }
    return { ok: true, type: a.constructor.name, samples: out };
  });
};

const out = {};
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  const page = await (await browser.newContext()).newPage();
  const bare = await SAMPLE(page, "ease");
  const named = await SAMPLE(page, "cubic-bezier(0.25, 0.1, 0.25, 1)");
  out[engine] = { bare, named };
  console.log(`\n== ${engine} ==`);
  console.log(`  scrubbable: ${bare.ok} (${bare.type ?? bare.reason})`);
  if (bare.ok && named.ok) {
    let same = 0;
    for (let i = 0; i < bare.samples.length; i++)
      if (bare.samples[i][1] === named.samples[i][1]) same++;
    console.log(`  ease vs cubic-bezier(.25,.1,.25,1): ${same}/${bare.samples.length} samples identical`);
    for (let i = 0; i < bare.samples.length; i++)
      console.log(
        `   t=${String(bare.samples[i][0]).padStart(3)}ms  ease=${bare.samples[i][1].padEnd(20)} named=${named.samples[i][1]}`
      );
  }
  await browser.close();
}
if (process.env.OUT) {
  const { writeFileSync } = await import("node:fs");
  writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
}
