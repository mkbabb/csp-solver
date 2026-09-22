// T9-W7 pass 4 · CTRL-FACE — DID THE REGISTRATION BLOCK MOVE ANY SURFACE OUTSIDE THE CARD?
// Registering a measured token makes every `var(--x, fallback)` on it unreachable: an unset
// REGISTERED property computes to its initial instead of being invalid, so a consumer outside
// the publisher's scope silently swaps its fallback for the initial. `--head-rule` has two such
// consumers (App.vue:1007 `.corner-right`, AttributionCard:132 `.corner-left`/`.mobile-attribution`,
// both `var(--head-rule, 0.75rem)`) and `--sheet-chrome` two more. This reads them on both trees.
import { chromium, webkit } from "playwright";
const TREES = [["proto", "http://127.0.0.1:4234"], ["head", "http://127.0.0.1:4235"]];
const CELLS = [["1280×800 fine", { width: 1280, height: 800 }, false], ["390×844 coarse", { width: 390, height: 844 }, true], ["844×390 coarse", { width: 844, height: 390 }, true]];
const read = () => {
  const px = (n) => Math.round(parseFloat(n) * 100) / 100;
  const g = (sel, prop) => { const e = document.querySelector(sel); return e ? getComputedStyle(e)[prop] : null; };
  const tok = (sel, name) => { const e = document.querySelector(sel); return e ? getComputedStyle(e).getPropertyValue(name).trim() : null; };
  const sheet = document.querySelector("#controls-drawer .drawer-case, .drawer-case");
  return {
    cornerRightTop: g(".corner-right", "top"),
    cornerLeftTop: g(".corner-left", "top"),
    mobileAttribTop: g(".mobile-attribution", "top"),
    rootHeadRule: tok(":root", "--head-rule"),
    pageHeadRule: tok(".page-root", "--head-rule"),
    cornerRightHeadRule: tok(".corner-right", "--head-rule"),
    sheetMaxH: sheet ? getComputedStyle(sheet).maxHeight : null,
    sheetChrome: sheet ? getComputedStyle(sheet).getPropertyValue("--sheet-chrome").trim() : null,
    cornerRightBox: (() => { const e = document.querySelector(".corner-right"); if (!e) return null; const r = e.getBoundingClientRect(); return [px(r.left), px(r.top), px(r.width), px(r.height)]; })(),
    cornerLeftBox: (() => { const e = document.querySelector(".corner-left") || document.querySelector(".mobile-attribution"); if (!e) return null; const r = e.getBoundingClientRect(); return [px(r.left), px(r.top), px(r.width), px(r.height)]; })(),
  };
};
for (const [engine, launcher] of [["chromium", chromium], ["webkit", webkit]])
  for (const [label, viewport, coarse] of CELLS) {
    const out = {};
    for (const [tree, base] of TREES) {
      const b = await launcher.launch();
      const ctx = await b.newContext({ viewport, baseURL: base, hasTouch: coarse, isMobile: coarse && engine === "chromium" });
      const p = await ctx.newPage();
      await p.emulateMedia({ reducedMotion: "reduce" });
      await p.goto("/?size=3&difficulty=EASY", { waitUntil: "networkidle" });
      await p.waitForTimeout(800);
      out[tree] = await p.evaluate(read);
      await b.close();
    }
    console.log(`\n== ${engine} · ${label} ==`);
    for (const k of Object.keys(out.proto)) {
      const a = JSON.stringify(out.proto[k]), c = JSON.stringify(out.head[k]);
      console.log(`  ${a === c ? "π  " : "Δ !!"} ${k.padEnd(20)} proto ${a}  head ${c}`);
    }
  }
