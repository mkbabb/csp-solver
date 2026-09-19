#!/usr/bin/env node
// T9-W7 pass-3 research · MOT-LADDER · WHAT 10.0px IS (gap 9, G-EXIT-MIRROR)
//
// The exit's wordmark mover declares 10.0px of travel at 390x844 against 145.5px on entry,
// in BOTH engines and on BOTH arms of pass 2 (`pass2/.../readings/exit-*.{json,txt}`) — a
// figure round enough to be a layout constant rather than a measurement. The mover's number
// is a DELTA between two rects the gesture reads at two moments. This probe reads the two
// REST poses instead, with no gesture in flight, so the two directions can be judged against
// the geometry they both claim to mirror:
//
//   playing rest  — boot `/`, settle
//   gallery rest  — boot `/?view=gallery`, settle  (and the interactive `g` fold, settled)
//
// If |playing − gallery| ≈ 10px the EXIT is truthful and the entry's 145.5 is the transient;
// if ≈ 145px the exit's `headFirst` is stale. Read-only: it serves a dist nobody rebuilt.
//
// usage: BASE=http://127.0.0.1:4246/ node wordmark-rest-geometry.mjs

import { createRequire } from "node:module";
const require = createRequire(
  (process.env.PW_ROOT ??
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend") +
    "/package.json"
);
const { chromium, webkit } = require("playwright");

const BASE = process.env.BASE ?? "http://127.0.0.1:4246/";
const SEL = ".logo-menu";

const rectOf = (sel) => {
  const el = document.querySelector(sel);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    x: +r.x.toFixed(2),
    y: +r.y.toFixed(2),
    w: +r.width.toFixed(2),
    h: +r.height.toFixed(2),
  };
};

const dist = (a, b) =>
  a && b ? +Math.hypot(a.x + a.w / 2 - (b.x + b.w / 2), a.y + a.h / 2 - (b.y + b.h / 2)).toFixed(2) : null;

const out = { base: BASE, when: new Date().toISOString(), rows: [] };

for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  for (const vp of [
    { width: 390, height: 844, deviceScaleFactor: 3, hasTouch: true, isMobile: true },
    { width: 1440, height: 900, deviceScaleFactor: 2 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.deviceScaleFactor,
      hasTouch: !!vp.hasTouch,
      isMobile: !!vp.isMobile && engine === "chromium",
    });
    const page = await ctx.newPage();

    await page.goto(BASE, { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const playing = await page.evaluate(rectOf, SEL);

    // interactive fold: the wordmark button opens the gallery (App: `g` or the wordmark)
    await page.keyboard.press("g");
    await page.waitForTimeout(1600);
    const galleryInteractive = await page.evaluate(rectOf, SEL);

    // boot straight into the gallery — the same rest pose, no gesture
    await page.goto(BASE + "?view=gallery", { waitUntil: "load" });
    await page.waitForTimeout(1500);
    const galleryBoot = await page.evaluate(rectOf, SEL);

    out.rows.push({
      engine,
      viewport: `${vp.width}x${vp.height}`,
      playing,
      galleryInteractive,
      galleryBoot,
      restTravelInteractive: dist(playing, galleryInteractive),
      restTravelBoot: dist(playing, galleryBoot),
    });
    await ctx.close();
  }
  await browser.close();
}

for (const r of out.rows) {
  console.log(
    `${r.engine.padEnd(8)} ${r.viewport.padEnd(9)} playing=${JSON.stringify(r.playing)} galleryBoot=${JSON.stringify(
      r.galleryBoot
    )} galleryFold=${JSON.stringify(r.galleryInteractive)} |Δ|boot=${r.restTravelBoot} |Δ|fold=${r.restTravelInteractive}`
  );
}
if (process.env.OUT) {
  const { writeFileSync } = await import("node:fs");
  writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
}
