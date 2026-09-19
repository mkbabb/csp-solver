// MOT-LADDER pass-3 CRITIC's own re-measurement. Read-only on product files.
// after = 127.0.0.1:4232 (worktree wf_f72f3b5a-83a-59) · control = 127.0.0.1:4233 (74a2b5d9).
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const AFTER = "http://127.0.0.1:4232";
const CTRL = "http://127.0.0.1:4233";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/critique/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, v: unknown) =>
  writeFileSync(`${OUT}/${n}.json`, JSON.stringify(v, null, 1));

const SCENE = "/?size=3&difficulty=EASY";
const RUNGS = ["whisper", "leave", "note", "dusk", "step", "throw", "rise"];

test("A · node, rungs, PRM — both regimes", async ({ page, browserName }) => {
  await page.goto(AFTER + SCENE);
  await page.waitForTimeout(1600);
  const live = await page.evaluate((rungs) => {
    const cs = getComputedStyle(document.documentElement);
    const el = (s: string) => document.querySelector(s);
    const read = (s: string) => {
      const e = el(s);
      if (!e) return null;
      const c = getComputedStyle(e);
      return { dur: c.transitionDuration, prop: c.transitionProperty };
    };
    return {
      publisherNodes: document.querySelectorAll("style[data-motion-rungs]").length,
      publisherText: (document.querySelector("style[data-motion-rungs]") as HTMLStyleElement | null)
        ?.textContent,
      rootVars: Object.fromEntries(rungs.map((r) => [r, cs.getPropertyValue(`--motion-${r}`).trim()])),
      tabText: read(".drawer-tab-text"),
      washi: read(".washi-label"),
      iconBtn: read(".icon-btn"),
      // every --motion-* declaration source in the live CSSOM, and every fallback
      fallbacks: (() => {
        let n = 0;
        for (const sh of Array.from(document.styleSheets)) {
          let rules: CSSRuleList;
          try {
            rules = sh.cssRules;
          } catch {
            continue;
          }
          const walk = (rs: CSSRuleList) => {
            for (const r of Array.from(rs)) {
              if ((r as CSSGroupingRule).cssRules) walk((r as CSSGroupingRule).cssRules);
              const t = r.cssText;
              const m = t.match(/var\(--motion-[a-z]+\s*,/g);
              if (m) n += m.length;
            }
          };
          walk(rules);
        }
        return n;
      })(),
    };
  }, RUNGS);

  // PRM arm
  const ctx2 = await page.context().browser()!.newContext({ reducedMotion: "reduce" });
  const p2 = await ctx2.newPage();
  await p2.goto(AFTER + SCENE);
  await p2.waitForTimeout(1600);
  const prm = await p2.evaluate((rungs) => {
    const cs = getComputedStyle(document.documentElement);
    const sample = (s: string) => {
      const e = document.querySelector(s);
      if (!e) return null;
      const c = getComputedStyle(e);
      return { dur: c.transitionDuration, prop: c.transitionProperty, anim: c.animationDuration };
    };
    // full roster: every rendered element whose transition-duration resolves nonzero
    const nonzero: { path: string; dur: string; prop: string }[] = [];
    for (const e of Array.from(document.querySelectorAll("*"))) {
      const c = getComputedStyle(e);
      if (c.display === "none") continue;
      const ds = c.transitionDuration.split(",").map((x) => parseFloat(x));
      if (ds.some((d) => d > 0)) {
        nonzero.push({
          path: `${e.tagName.toLowerCase()}.${(e.className || "").toString().slice(0, 40)}`,
          dur: c.transitionDuration,
          prop: c.transitionProperty,
        });
      }
    }
    return {
      rootVars: Object.fromEntries(rungs.map((r) => [r, cs.getPropertyValue(`--motion-${r}`).trim()])),
      tabText: sample(".drawer-tab-text"),
      washi: sample(".washi-label"),
      iconBtn: sample(".icon-btn"),
      nonzeroCount: nonzero.length,
      nonzero: nonzero.slice(0, 40),
    };
  }, RUNGS);
  await ctx2.close();

  bank(`A-node-${browserName}`, { live, prm });
  expect(live.publisherNodes).toBe(1);
});

test("B · ABSENCE on a SHORTHAND consumer — the `all` claim, discriminating", async ({
  page,
  browserName,
}) => {
  await page.goto(AFTER + SCENE);
  await page.waitForTimeout(1600);
  const r = await page.evaluate(() => {
    const read = (s: string) => {
      const e = document.querySelector(s);
      if (!e) return null;
      const c = getComputedStyle(e);
      return { dur: c.transitionDuration, prop: c.transitionProperty };
    };
    const before = { tabText: read(".drawer-tab-text"), iconBtn: read(".icon-btn") };
    // DELETE the publisher node — the exact cascade state of a build with no publishMotionRungs()
    document.querySelectorAll("style[data-motion-rungs]").forEach((n) => n.remove());
    const after = { tabText: read(".drawer-tab-text"), iconBtn: read(".icon-btn") };
    const rootThrow = getComputedStyle(document.documentElement)
      .getPropertyValue("--motion-throw")
      .trim();
    return { before, after, rootThrow };
  });
  bank(`B-absence-${browserName}`, r);
});

test("C · pi rect census, STABLE keys, after vs control", async ({ page, browserName }) => {
  const census = async (base: string, w: number, h: number) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(base + SCENE);
    await page.waitForTimeout(1800);
    return page.evaluate(() => {
      // stable key: the element's structural path (tag + nth-of-parent chain), never class text
      const key = (e: Element) => {
        const parts: string[] = [];
        let n: Element | null = e;
        while (n && n !== document.documentElement) {
          const p: Element | null = n.parentElement;
          const i = p ? Array.prototype.indexOf.call(p.children, n) : 0;
          parts.unshift(`${n.tagName.toLowerCase()}[${i}]`);
          n = p;
        }
        return parts.join(">");
      };
      const out: Record<string, number[]> = {};
      for (const e of Array.from(document.querySelectorAll("*"))) {
        const r = e.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        out[key(e)] = [
          Math.round(r.x * 100) / 100,
          Math.round(r.y * 100) / 100,
          Math.round(r.width * 100) / 100,
          Math.round(r.height * 100) / 100,
        ];
      }
      return out;
    });
  };
  const poses: [number, number][] = [
    [1440, 900],
    [390, 844],
    [768, 1024],
  ];
  const report: Record<string, unknown> = {};
  for (const [w, h] of poses) {
    const a = await census(AFTER, w, h);
    const c = await census(CTRL, w, h);
    const ka = Object.keys(a),
      kc = Object.keys(c);
    const shared = ka.filter((k) => k in c);
    let maxD = 0,
      moved = 0;
    const worst: { k: string; d: number; a: number[]; c: number[] }[] = [];
    for (const k of shared) {
      const d = Math.max(...a[k].map((v, i) => Math.abs(v - c[k][i])));
      if (d > maxD) maxD = d;
      if (d > 0.5) {
        moved++;
        worst.push({ k, d, a: a[k], c: c[k] });
      }
    }
    worst.sort((x, y) => y.d - x.d);
    report[`${w}x${h}`] = {
      rectsAfter: ka.length,
      rectsCtrl: kc.length,
      sharedKeys: shared.length,
      onlyAfter: ka.filter((k) => !(k in c)).slice(0, 10),
      onlyCtrl: kc.filter((k) => !(k in a)).slice(0, 10),
      maxDelta: Math.round(maxD * 1000) / 1000,
      moved,
      worst: worst.slice(0, 8),
    };
  }
  bank(`C-pi-rects-${browserName}`, report);
});

test("D · colour + filter census, after vs control (motion must be theme-blind)", async ({
  page,
  browserName,
}) => {
  const grab = async (base: string, dark: boolean) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ colorScheme: dark ? "dark" : "light" });
    await page.goto(base + SCENE);
    await page.waitForTimeout(1800);
    return page.evaluate(() => {
      const key = (e: Element) => {
        const parts: string[] = [];
        let n: Element | null = e;
        while (n && n !== document.documentElement) {
          const p: Element | null = n.parentElement;
          const i = p ? Array.prototype.indexOf.call(p.children, n) : 0;
          parts.unshift(`${n.tagName.toLowerCase()}[${i}]`);
          n = p;
        }
        return parts.join(">");
      };
      const colours: Record<string, string> = {};
      let filters = 0;
      const filterList: string[] = [];
      for (const e of Array.from(document.querySelectorAll("*"))) {
        const c = getComputedStyle(e);
        if (c.display === "none") continue;
        colours[key(e)] = `${c.color}|${c.backgroundColor}|${c.borderColor}|${c.opacity}`;
        if (c.filter && c.filter !== "none") {
          filters++;
          filterList.push(`${key(e)} :: ${c.filter}`);
        }
      }
      return { colours, filters, filterList };
    });
  };
  const out: Record<string, unknown> = {};
  for (const dark of [false, true]) {
    const a = await grab(AFTER, dark);
    const c = await grab(CTRL, dark);
    const shared = Object.keys(a.colours).filter((k) => k in c.colours);
    const diff = shared.filter((k) => a.colours[k] !== c.colours[k]);
    out[dark ? "dark" : "light"] = {
      sharedKeys: shared.length,
      colourDiffs: diff.length,
      sample: diff.slice(0, 12).map((k) => ({ k, after: a.colours[k], ctrl: c.colours[k] })),
      filtersAfter: a.filters,
      filtersCtrl: c.filters,
      filterListAfter: a.filterList,
    };
  }
  bank(`D-colour-filter-${browserName}`, out);
});
