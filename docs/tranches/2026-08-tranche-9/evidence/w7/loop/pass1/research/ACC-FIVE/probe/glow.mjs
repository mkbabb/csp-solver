/**
 * glow.mjs — the sparkle's glow, taken apart. The overlay's first run returned
 * `drop-shadow(rgba(12, 10, 14, 0.3) …)` in chromium and
 * `drop-shadow(color(srgb 0.788 0.604 0.180 / 0.3) …)` in webkit for what should be ONE
 * declaration, so the two engines disagree about a colour the cure depends on. This
 * asks each engine, on the real element, what it did with each of four spellings.
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";

const SPELLINGS = {
  incumbent: "drop-shadow(0 0 2px rgba(196, 181, 253, 0.3))",
  colorMix: "drop-shadow(0 0 2px color-mix(in srgb, var(--color-crayon-gold) 30%, transparent))",
  colorMixOpaqueMix:
    "drop-shadow(0 0 2px color-mix(in srgb, var(--color-crayon-gold) 30%, var(--color-card)))",
  bareVar: "drop-shadow(0 0 2px var(--color-crayon-gold))",
  relativeAlpha: "drop-shadow(0 0 2px rgb(from var(--color-crayon-gold) r g b / 0.3))",
};

const out = {};
for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await type.launch();
  out[name] = {};
  for (const scheme of ["light", "dark"]) {
    const ctx = await b.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/?size=3&difficulty=EASY`);
    await p.waitForSelector(".sparkle-icon", { timeout: 30000 });
    out[name][scheme] = await p.evaluate(async (sp) => {
      const el = document.querySelector(".sparkle-icon");
      // `.sparkle-icon` carries `transition: all 200ms` (GameControlPanel.vue:2082), so a
      // same-frame getComputedStyle returns the tween's START value. Kill the transition
      // first and let a frame pass, or every spelling below reports the incumbent.
      el.style.setProperty("transition", "none", "important");
      const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await frame();
      const res = {
        tokenOnElement: getComputedStyle(el).getPropertyValue("--color-crayon-gold").trim(),
        sourceFilter: getComputedStyle(el).filter,
        atHead: {},
      };
      for (const [k, v] of Object.entries(sp)) {
        el.style.setProperty("filter", v, "important");
        await frame();
        res.atHead[k] = { declared: v, computed: getComputedStyle(el).filter };
      }
      el.style.removeProperty("filter");
      el.style.removeProperty("transition");
      return res;
    }, SPELLINGS);
    await ctx.close();
  }
  await b.close();
}
writeFileSync(`${HERE}/readings/glow.json`, JSON.stringify(out, null, 2));
for (const e of Object.keys(out))
  for (const s of Object.keys(out[e])) {
    console.log(`-- ${e} ${s} · gold="${out[e][s].tokenOnElement}" source=${out[e][s].sourceFilter}`);
    for (const [k, v] of Object.entries(out[e][s].atHead)) console.log("   ", k.padEnd(18), v.computed);
  }
