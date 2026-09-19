#!/usr/bin/env node
/**
 * MOT-LADDER · PRM ARMS — every gesture this family touches collapses to a same-frame swap.
 *
 * Three files ship a user-visible transition with no reduced-motion arm at all (R4 §5):
 * `DrawerTab.vue:144` (the tab tongue's tilt), `CrayonHeart.vue:329` (the wink crossfade),
 * `SheetWashiLabel.vue:109` (the washi tape). The prototype arms all three. This probe
 * reads the COMPUTED `transition-duration` for each of them under
 * `emulateMedia({ reducedMotion: 'reduce' })` — not the source, the engine's own answer —
 * and repeats the dock gesture and a theme flip under PRM so the collapse is observed, not
 * declared. `test.use({ reducedMotion })` is void at this Playwright (CH-65); this uses
 * `context.newContext({ reducedMotion })`, the route that lands.
 *
 * Run: BASE=http://127.0.0.1:4246/ node prm-arms.mjs out.json
 */
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4246/";
const OUT = process.argv[2] ?? "/tmp/prm-arms.json";

const TARGETS = [
  [".drawer-tab-text", "DrawerTab.vue:144 — the tongue's tilt"],
  [".washi-label", "SheetWashiLabel.vue:109 — the washi tape"],
  [".crayon-heart .face", "CrayonHeart.vue:329 — the wink crossfade"],
  [".sparkle-icon", "GameControlPanel.vue:2082 — the narrowed sparkle (was `all`)"],
  [".action-bar::before", "GameControlPanel.vue:2132 — the fold hint"],
];

const readAll = (sel) =>
  `(() => {
     const [base, pseudo] = ${JSON.stringify(sel)}.split("::");
     const els = [...document.querySelectorAll(base)];
     return els.slice(0, 3).map((e) => {
       const cs = getComputedStyle(e, pseudo ? "::" + pseudo : undefined);
       return { dur: cs.transitionDuration, prop: cs.transitionProperty, ease: cs.transitionTimingFunction };
     });
   })()`;

async function run(reduced) {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: true,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500));

  const rows = [];
  for (const [sel, what] of TARGETS)
    rows.push({ sel, what, found: await page.evaluate(readAll(sel)) });

  // the dusk, read off the element the theme turn actually paints
  const dusk = await page.evaluate(() => {
    document.documentElement.classList.add("theme-turning");
    const el = document.querySelector(".bg-background, .page-root") ?? document.body;
    const cs = getComputedStyle(el);
    const out = { dur: cs.transitionDuration, ease: cs.transitionTimingFunction, prop: cs.transitionProperty };
    document.documentElement.classList.remove("theme-turning");
    return out;
  });

  // the dock: how many animations does the gesture actually run?
  const tab = page.locator(".drawer-tab");
  await tab.first().click({ force: true });
  await new Promise((r) => setTimeout(r, 60));
  const dockRoster = await page.evaluate(() =>
    document.getAnimations().map((a) => {
      const tm = a.effect?.getTiming?.() ?? {};
      let cls = null;
      try {
        const t = a.effect?.target;
        cls = t ? (typeof t.className === "string" ? t.className : t.getAttribute?.("class")) : null;
      } catch {}
      return {
        name: a.animationName ?? a.transitionProperty ?? null,
        dur: tm.duration,
        ease: tm.easing,
        cls: String(cls ?? "").slice(0, 44),
      };
    }),
  );
  await new Promise((r) => setTimeout(r, 900));

  // the published ladder, read off the document root
  const published = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return Object.fromEntries(
      ["whisper", "leave", "note", "dusk", "step", "throw"].map((k) => [
        k,
        cs.getPropertyValue(`--motion-${k}`).trim(),
      ]),
    );
  });

  await browser.close();
  return { reduced, rows, dusk, dockRoster, published };
}

const out = { base: BASE, when: new Date().toISOString(), runs: [await run(false), await run(true)] };
writeFileSync(OUT, JSON.stringify(out, null, 1));

for (const r of out.runs) {
  console.log(`\n── PRM ${r.reduced ? "REDUCE" : "no-preference"} ──`);
  console.log(`   published ladder: ${JSON.stringify(r.published)}`);
  for (const t of r.rows)
    console.log(
      `   ${t.what}\n       ${t.found.length ? t.found.map((f) => `${f.prop} ${f.dur} ${f.ease}`).join(" | ") : "(not in DOM at this pose)"}`,
    );
  console.log(`   the dusk (theme-turning): ${r.dusk.prop} ${r.dusk.dur} ${r.dusk.ease}`);
  console.log(`   dock gesture roster: ${r.dockRoster.length} animation(s)`);
  for (const a of r.dockRoster) console.log(`       ${a.name} ${a.dur}ms ${a.ease} · ${a.cls}`);
}
