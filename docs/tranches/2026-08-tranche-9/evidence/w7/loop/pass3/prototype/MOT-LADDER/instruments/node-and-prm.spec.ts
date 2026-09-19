import { test, expect } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });
const bank = (name: string, data: unknown) =>
  writeFileSync(`${OUT}/${name}.json`, JSON.stringify(data, null, 1) + "\n");

const RUNGS = ["whisper", "leave", "note", "dusk", "step", "throw", "rise"];

// (a) THE NODE — one <style data-motion-rungs>, seven @property registrations, and under
//     reduce every --motion-* reads 0s at :root and at four named consumers.
test("a · the node, live and under reduce", async ({ page, browserName }) => {
  const rows: Record<string, unknown> = { browserName };

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  rows.live = await page.evaluate((rungs) => {
    const nodes = document.querySelectorAll("style[data-motion-rungs]");
    const text = nodes[0]?.textContent ?? "";
    const cs = getComputedStyle(document.documentElement);
    const at = (sel: string) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = getComputedStyle(el);
      return Object.fromEntries(rungs.map((r) => [r, s.getPropertyValue(`--motion-${r}`).trim()]));
    };
    return {
      nodeCount: nodes.length,
      registrations: (text.match(/@property --motion-[a-z]+\{/g) ?? []).length,
      initialStill: (text.match(/initial-value:0ms\}/g) ?? []).length,
      root: Object.fromEntries(rungs.map((r) => [r, cs.getPropertyValue(`--motion-${r}`).trim()])),
      iconBtn: at(".icon-btn"),
      washi: at(".washi-label"),
      drawerTab: at(".drawer-tab-text"),
      transitionColors: at(".transition-colors"),
      iconBtnDur: (() => {
        const el = document.querySelector(".icon-btn");
        return el ? getComputedStyle(el).transitionDuration : null;
      })(),
      iconBtnProp: (() => {
        const el = document.querySelector(".icon-btn");
        return el ? getComputedStyle(el).transitionProperty : null;
      })(),
    };
  }, RUNGS);

  const ctx = await page.context().browser()!.newContext({ reducedMotion: "reduce" });
  const p2 = await ctx.newPage();
  await p2.goto(page.url());
  await p2.waitForLoadState("networkidle");
  rows.reduce = await p2.evaluate((rungs) => {
    const cs = getComputedStyle(document.documentElement);
    const at = (sel: string) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = getComputedStyle(el);
      return {
        vars: Object.fromEntries(rungs.map((r) => [r, s.getPropertyValue(`--motion-${r}`).trim()])),
        duration: s.transitionDuration,
        property: s.transitionProperty,
      };
    };
    return {
      root: Object.fromEntries(rungs.map((r) => [r, cs.getPropertyValue(`--motion-${r}`).trim()])),
      iconBtn: at(".icon-btn"),
      washi: at(".washi-label"),
      drawerTab: at(".drawer-tab-text"),
      transitionColors: at(".transition-colors"),
    };
  }, RUNGS);
  await ctx.close();

  bank(`a-node-${browserName}`, rows);
  const live = rows.live as any;
  expect(live.nodeCount).toBe(1);
  expect(live.registrations).toBe(7);
});

// (d) B5 ROSTER — walk the live CSSOM under reduce: 0 rules reading a rung resolve nonzero,
//     and every other nonzero live transition rule is a PRM-FALLBACK row.
test("d · B5 roster over the live CSSOM under reduce", async ({ page, browserName }) => {
  const ctx = await page.context().browser()!.newContext({ reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto("http://127.0.0.1:4240/");
  await p.waitForLoadState("networkidle");
  const roster = await p.evaluate(() => {
    const out: Array<{ sheet: string; sel: string; dur: string; text: string; inReduce: boolean }> = [];
    const walk = (rules: CSSRuleList, inReduce: boolean, sheet: string) => {
      for (const r of Array.from(rules)) {
        if (r instanceof CSSMediaRule) {
          walk(r.cssRules, inReduce || /prefers-reduced-motion/.test(r.conditionText), sheet);
        } else if (r instanceof CSSStyleRule) {
          const d = r.style.transitionDuration || r.style.getPropertyValue("transition-duration");
          const short = r.style.transition;
          if (!d && !short) continue;
          out.push({ sheet, sel: r.selectorText.slice(0, 90), dur: d, text: (short || d).slice(0, 110), inReduce });
        } else if ("cssRules" in r) {
          try { walk((r as any).cssRules, inReduce, sheet); } catch { /* cross-origin */ }
        }
      }
    };
    for (const s of Array.from(document.styleSheets)) {
      try { walk(s.cssRules, false, s.href ?? "<inline>"); } catch { /* opaque */ }
    }
    return out;
  });
  const readsRung = roster.filter((r) => /var\(--motion-/.test(r.text));
  // resolve each rung-reading rule against a real element where one matches
  const resolved = await p.evaluate((sels: string[]) =>
    sels.map((sel) => {
      let el: Element | null = null;
      try { el = document.querySelector(sel); } catch { /* :is() etc */ }
      return { sel, duration: el ? getComputedStyle(el).transitionDuration : null };
    }),
  readsRung.map((r) => r.sel));
  await ctx.close();
  const nonzero = resolved.filter(
    (r) => r.duration && !/^(0s|0s(, 0s)*)$/.test(r.duration.replace(/\s/g, "") .split(",").every((x) => x === "0s") ? "0s" : r.duration),
  );
  const strictNonzero = resolved.filter(
    (r) => r.duration !== null && !r.duration.split(",").every((x) => x.trim() === "0s"),
  );
  bank(`d-b5-roster-${browserName}`, {
    browserName,
    totalTransitionRules: roster.length,
    rungReadingRules: readsRung.length,
    rungRulesMatchedAnElement: resolved.filter((r) => r.duration !== null).length,
    rungRulesNonzeroUnderReduce: strictNonzero,
    otherNonzeroLiveRules: roster
      .filter((r) => !/var\(--motion-/.test(r.text) && !r.inReduce)
      .filter((r) => /\d+(\.\d+)?m?s/.test(r.text) && !/(^|[^\d.])0s/.test(r.text))
      .map((r) => ({ sel: r.sel, text: r.text })),
    reduceBlockRules: roster.filter((r) => r.inReduce).map((r) => ({ sel: r.sel, text: r.text })),
    _unusedShape: nonzero.length,
  });
});
