#!/usr/bin/env node
/**
 * RULE-LEVEL REDUCE ROSTER (T9-W7 pass 2 · MOT-LADDER research)
 *
 * Pass 1's B5 greens a FILE if the string `prefers-reduced-motion` appears anywhere in it.
 * The critique measured 24 rules still tweening under reduce on the branch dist. This
 * instrument is the shape B5 has to take: it walks the live CSSOM under `reduce`, and for
 * every style rule that (a) declares a non-zero transition/animation duration and (b)
 * MATCHES at least one element in the live DOM, it reports the rule, whether the rule sits
 * inside a `prefers-reduced-motion` media block, and whether its duration reads a `var()`.
 *
 * It also runs THE CASCADE TEST that decides whether MOT-VERB's "PRM as a value at :root"
 * graft can compose with MOT-LADDER's inline publisher: `publishMotionRungs` writes the
 * rungs as INLINE custom properties on <html>, and an inline declaration outranks every
 * author rule. If that is so, a `@media (prefers-reduced-motion: reduce) { :root { --motion-*:
 * 0ms } }` block is dead on arrival and the graft needs a different landing.
 *
 * Read-only: it runs against a served dist and writes only its own JSON.
 * Usage: node reduce-rule-roster.mjs <out.json> [--engine=chromium|webkit]
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4246/";
const OUT = process.argv[2] ?? "/tmp/reduce-rule-roster.json";
const ENGINE = process.argv.find((a) => a.startsWith("--engine="))?.split("=")[1] ?? "chromium";

const ROSTER = `() => {
  const out = [];
  const ms = (v) => {
    if (!v) return 0;
    return v.split(',').map(s => s.trim()).reduce((m, s) => {
      const n = s.endsWith('ms') ? parseFloat(s) : s.endsWith('s') ? parseFloat(s) * 1000 : 0;
      return Math.max(m, isFinite(n) ? n : 0);
    }, 0);
  };
  const walk = (rules, inPrm, sheetHref) => {
    for (const r of rules) {
      if (r.type === CSSRule.MEDIA_RULE || r.media) {
        const prm = inPrm || /prefers-reduced-motion/.test(r.conditionText || r.media?.mediaText || '');
        if (r.cssRules) walk(r.cssRules, prm, sheetHref);
        continue;
      }
      // NOTE: a modern CSSStyleRule ALSO carries a (usually empty) .cssRules for nested CSS,
      // so the style-rule test must come FIRST or every rule is recursed into and none counted.
      if (!r.selectorText || !r.style) { if (r.cssRules) walk(r.cssRules, inPrm, sheetHref); continue; }
      if (r.cssRules && r.cssRules.length) walk(r.cssRules, inPrm, sheetHref);
      const td = r.style.getPropertyValue('transition-duration') || '';
      const ad = r.style.getPropertyValue('animation-duration') || '';
      const tShort = r.style.getPropertyValue('transition') || '';
      const aShort = r.style.getPropertyValue('animation') || '';
      const declared = (td || ad || tShort || aShort);
      if (!declared) continue;
      let matches = 0;
      try { matches = document.querySelectorAll(r.selectorText).length; } catch { matches = -1; }
      if (matches <= 0) continue;
      // the LIVE reading: what the engine resolves on the first matching element, under reduce
      let live = { td: '', ad: '' };
      try {
        const el = document.querySelector(r.selectorText);
        const cs = getComputedStyle(el);
        live = { td: cs.transitionDuration, ad: cs.animationDuration };
      } catch {}
      const liveMs = Math.max(ms(live.td), ms(live.ad));
      if (liveMs <= 0) continue;
      out.push({
        selector: r.selectorText.slice(0, 120),
        inPrmBlock: inPrm,
        declaredText: (tShort || aShort || td || ad).slice(0, 140),
        readsVar: /var\\(/.test(tShort + aShort + td + ad),
        matches,
        liveMaxMs: liveMs,
      });
    }
  };
  for (const s of document.styleSheets) {
    let rules = null;
    try { rules = s.cssRules; } catch { continue; }
    if (rules) walk(rules, false, s.href || 'inline');
  }
  return out;
}`;

/** THE CASCADE TEST — does an inline custom property on <html> outrank a :root rule
 *  inside a reduce media block? This is the whole question for the PRM-at-:root graft. */
const CASCADE = `() => {
  const style = document.createElement('style');
  style.textContent =
    '@media (prefers-reduced-motion: reduce) { :root { --lane-probe: 0ms; } }' +
    '@media (prefers-reduced-motion: reduce) { :root { --lane-probe-bang: 0ms !important; } }';
  document.head.appendChild(style);
  const html = document.documentElement;
  // 1. the rule alone, no inline publisher
  const ruleOnly = getComputedStyle(html).getPropertyValue('--lane-probe').trim();
  // 2. the publisher's exact idiom: an INLINE custom property on <html>
  html.style.setProperty('--lane-probe', '150ms');
  html.style.setProperty('--lane-probe-bang', '150ms');
  const withInline = getComputedStyle(html).getPropertyValue('--lane-probe').trim();
  const withInlineBang = getComputedStyle(html).getPropertyValue('--lane-probe-bang').trim();
  // 3. what a consumer resolves
  const probe = document.createElement('div');
  probe.style.transitionDuration = 'var(--lane-probe, 150ms)';
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).transitionDuration;
  probe.style.transitionDuration = 'var(--lane-probe-bang, 150ms)';
  const resolvedBang = getComputedStyle(probe).transitionDuration;
  probe.remove();
  html.style.removeProperty('--lane-probe');
  html.style.removeProperty('--lane-probe-bang');
  style.remove();
  return { ruleOnly, withInline, withInlineBang, resolved, resolvedBang };
}`;

const browser = await (ENGINE === "webkit" ? webkit : chromium).launch({ headless: true });
const out = { meta: { engine: ENGINE, base: BASE, when: new Date().toISOString() }, runs: [] };

for (const motion of ["reduce", "no-preference"]) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile: ENGINE === "chromium",
    reducedMotion: motion,
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(1200);
  // open the dock so its rules have live subjects
  await page.locator(".drawer-tab").first().click({ force: true });
  await page.waitForTimeout(900);
  const roster = await page.evaluate(`(${ROSTER})()`);
  const cascade = motion === "reduce" ? await page.evaluate(`(${CASCADE})()`) : null;
  out.runs.push({ motion, ruleCount: roster.length, cascade, roster });
  await ctx.close();
}
await browser.close();

writeFileSync(OUT, JSON.stringify(out, null, 2));
for (const r of out.runs) {
  console.log(`\n## ${ENGINE} · ${r.motion} — ${r.ruleCount} matched rules still declare a live duration`);
  if (r.cascade) console.log(`   CASCADE: ${JSON.stringify(r.cascade)}`);
  if (r.motion !== "reduce") continue;
  for (const row of r.roster.sort((a, b) => b.liveMaxMs - a.liveMaxMs))
    console.log(
      `   ${String(row.liveMaxMs).padStart(6)}ms  prm=${row.inPrmBlock ? "Y" : "n"} var=${row.readsVar ? "Y" : "n"} x${row.matches}  ${row.selector}  <<${row.declaredText}>>`,
    );
}
