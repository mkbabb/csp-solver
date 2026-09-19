// MOT-LADDER pass-3 CRITIC, probe 2: the PRM roster over RENDERED ELEMENTS, after vs control,
// and a pi rect census on a deterministic surface (the gallery, no dealt puzzle, no glyph luck).
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const AFTER = "http://127.0.0.1:4232";
const CTRL = "http://127.0.0.1:4233";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/critique/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, v: unknown) =>
  writeFileSync(`${OUT}/${n}.json`, JSON.stringify(v, null, 1));

const SCENE = "/?size=3&difficulty=EASY";
const GALLERY = "/?view=gallery";

const ROSTER = `(() => {
  const nonzero = [];
  for (const e of Array.from(document.querySelectorAll("*"))) {
    const c = getComputedStyle(e);
    if (c.display === "none") continue;
    const ds = c.transitionDuration.split(",").map((x) => parseFloat(x));
    if (ds.some((d) => d > 0)) {
      let host = e, path = [];
      while (host && host !== document.documentElement) {
        path.unshift(host.tagName.toLowerCase() + (host.id ? "#" + host.id : ""));
        host = host.parentElement;
      }
      nonzero.push({ tag: e.tagName.toLowerCase(), path: path.slice(-5).join(">"),
        dur: c.transitionDuration, prop: c.transitionProperty });
    }
  }
  const anim = [];
  for (const e of Array.from(document.querySelectorAll("*"))) {
    const c = getComputedStyle(e);
    if (c.display === "none") continue;
    const ds = c.animationDuration.split(",").map((x) => parseFloat(x));
    if (ds.some((d) => d > 0.001)) anim.push({ tag: e.tagName.toLowerCase(), dur: c.animationDuration, name: c.animationName });
  }
  return { transitionNonzero: nonzero.length, transitions: nonzero, animNonzero: anim.length, anims: anim.slice(0, 10) };
})()`;

test("E · the PRM roster over RENDERED elements — after vs control", async ({
  browser,
  browserName,
}) => {
  const read = async (base: string) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.setViewportSize({ width: 1440, height: 900 });
    await p.goto(base + SCENE);
    await p.waitForTimeout(2000);
    const r = await p.evaluate(ROSTER);
    await ctx.close();
    return r;
  };
  const after = await read(AFTER);
  const ctrl = await read(CTRL);
  bank(`E-prm-roster-${browserName}`, {
    after: { transitionNonzero: after.transitionNonzero, animNonzero: after.animNonzero, transitions: after.transitions },
    control74a2b5d9: { transitionNonzero: ctrl.transitionNonzero, animNonzero: ctrl.animNonzero, transitions: ctrl.transitions },
  });
});

test("F · pi rect census on the GALLERY (deterministic, no dealt puzzle)", async ({
  page,
  browserName,
}) => {
  const census = async (base: string, w: number, h: number) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(base + GALLERY);
    await page.waitForTimeout(2200);
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
  const report: Record<string, unknown> = {};
  for (const [w, h] of [
    [1440, 900],
    [390, 844],
    [768, 1024],
  ] as [number, number][]) {
    const a = await census(AFTER, w, h);
    const c = await census(CTRL, w, h);
    const shared = Object.keys(a).filter((k) => k in c);
    let maxD = 0,
      moved = 0;
    const worst: unknown[] = [];
    for (const k of shared) {
      const d = Math.max(...a[k].map((v, i) => Math.abs(v - c[k][i])));
      if (d > maxD) maxD = d;
      if (d > 0.5) {
        moved++;
        worst.push({ k, d, a: a[k], c: c[k] });
      }
    }
    report[`${w}x${h}`] = {
      rectsAfter: Object.keys(a).length,
      rectsCtrl: Object.keys(c).length,
      sharedKeys: shared.length,
      keysOnlyAfter: Object.keys(a).filter((k) => !(k in c)).length,
      keysOnlyCtrl: Object.keys(c).filter((k) => !(k in a)).length,
      maxDelta: Math.round(maxD * 1000) / 1000,
      moved,
      worst: (worst as { d: number }[]).sort((x, y) => y.d - x.d).slice(0, 6),
    };
  }
  bank(`F-pi-gallery-${browserName}`, report);
});
