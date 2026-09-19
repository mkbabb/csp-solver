#!/usr/bin/env node
/**
 * MOT-LADDER · the CrayonHeart pose the PRM roster could not read.
 *
 * `prm-arms.mjs` reports `.crayon-heart .face` as "(not in DOM at this pose)" — the heart
 * only mounts once the attribution card is open. This opens it (the trigger carries
 * aria-label "Show attribution card"), settles, and reads the engine's own computed
 * transition for the face under both media states, in both engines.
 *
 * Run: BASE=http://127.0.0.1:4244/ node heart-pose.mjs out.json
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4244/";
const OUT = process.argv[2] ?? "/tmp/heart-pose.json";

const read = () => {
  const els = [...document.querySelectorAll(".crayon-heart .face")];
  return els.slice(0, 2).map((e) => {
    const cs = getComputedStyle(e);
    return {
      prop: cs.transitionProperty,
      dur: cs.transitionDuration,
      ease: cs.transitionTimingFunction,
    };
  });
};

const out = {};
for (const [name, engine] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  out[name] = {};
  for (const reduced of [false, true]) {
    const browser = await engine.launch({ headless: true });
    const ctx = await browser.newContext({
      viewport: { width: 900, height: 900 },
      reducedMotion: reduced ? "reduce" : "no-preference",
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    const trigger = page.locator('[aria-label="Show attribution card"]').first();
    await trigger.click();
    await page.waitForTimeout(900); // the card settles
    const faces = await page.evaluate(read);
    out[name][reduced ? "reduce" : "no-preference"] = {
      faces,
      mounted: faces.length,
    };
    await browser.close();
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
for (const [engine, arms] of Object.entries(out))
  for (const [state, r] of Object.entries(arms))
    console.log(
      `${engine.padEnd(9)} ${state.padEnd(14)} faces=${r.mounted}  ` +
        r.faces.map((f) => `${f.prop} ${f.dur} ${f.ease}`).join(" | "),
    );
