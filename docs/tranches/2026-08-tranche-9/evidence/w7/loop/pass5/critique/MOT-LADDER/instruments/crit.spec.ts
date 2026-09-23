import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { encodeSudoku } from "../e2e/wire";

const OUT = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-out";
const T5 = "http://127.0.0.1:4243", CTL = "http://127.0.0.1:4244", T4 = "http://127.0.0.1:4245";
// prettier-ignore
const SOLVED_9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const BLANKS = new Set([0, 4, 10, 22, 36, 40, 55, 61, 73, 80]);
const PAYLOAD = encodeSudoku(3, Object.fromEntries(SOLVED_9.map((v, i) => [i, BLANKS.has(i) ? 0 : v])), 81);
const URL = `/?game=sudoku&board=${PAYLOAD}`;

type Pose = { name: string; w: number; h: number; touch: boolean; dark: boolean; gallery: boolean };
const POSES: Pose[] = [
  { name: "play-1440x900-light-fine", w: 1440, h: 900, touch: false, dark: false, gallery: false },
  { name: "play-390x844-light-coarse", w: 390, h: 844, touch: true, dark: false, gallery: false },
  { name: "play-1440x900-dark-fine", w: 1440, h: 900, touch: false, dark: true, gallery: false },
  { name: "gallery-1440x900-light-fine", w: 1440, h: 900, touch: false, dark: false, gallery: true },
  { name: "gallery-390x844-dark-coarse", w: 390, h: 844, touch: true, dark: true, gallery: true },
];

const CENSUS = () => {
  const path = (el: Element): string => {
    const parts: string[] = [];
    let n: Element | null = el;
    while (n && n !== document.body) {
      const p: Element | null = n.parentElement;
      if (!p) break;
      const sibs = Array.from(p.children).filter((c) => c.tagName === n!.tagName);
      parts.unshift(`${n.tagName}[${sibs.indexOf(n) + 1}]`);
      n = p;
    }
    return parts.join("/");
  };
  const out: Record<string, Record<string, string | number>> = {};
  for (const el of Array.from(document.querySelectorAll("body *"))) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const cs = getComputedStyle(el);
    out[path(el)] = {
      t: el.tagName, x: +r.left.toFixed(2), y: +r.top.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2),
      c: cs.color, bg: cs.backgroundColor,
      bc: [cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor].join("|"),
      bw: [cs.borderTopWidth, cs.borderRightWidth, cs.borderBottomWidth, cs.borderLeftWidth].join("|"),
      bs: cs.boxShadow, ol: cs.outlineStyle + " " + cs.outlineColor,
      fill: cs.fill, stroke: cs.stroke, sw: cs.strokeWidth, fo: cs.fillOpacity, so: cs.strokeOpacity,
      f: cs.fontFamily + " " + cs.fontSize + " " + cs.fontWeight, lh: cs.lineHeight,
      o: cs.opacity, tf: cs.transform, fi: cs.filter, vis: cs.visibility, clip: cs.clipPath,
      // timing, reported apart from paint
      td: cs.transitionDuration, ttf: cs.transitionTimingFunction, tp: cs.transitionProperty,
      ad: cs.animationDuration, an: cs.animationName, atf: cs.animationTimingFunction,
    };
  }
  return out;
};
const PAINT = ["t", "c", "bg", "bc", "bw", "bs", "ol", "fill", "stroke", "sw", "fo", "so", "f", "lh", "o", "tf", "fi", "vis", "clip"];
const TIMING = ["td", "ttf", "tp", "ad", "an", "atf"];
type Census = Record<string, Record<string, string | number>>;
function compare(a: Census, b: Census) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let onlyA = 0, onlyB = 0, shared = 0, maxDelta = 0, moved = 0;
  const byProp: Record<string, number> = {};
  const samples: unknown[] = [];
  const onlySamples: string[] = [];
  for (const k of keys) {
    const x = a[k], y = b[k];
    if (!x) { onlyB++; if (onlySamples.length < 6) onlySamples.push("B:" + k.slice(-70)); continue; }
    if (!y) { onlyA++; if (onlySamples.length < 6) onlySamples.push("A:" + k.slice(-70)); continue; }
    shared++;
    const d = Math.max(...(["x", "y", "w", "h"] as const).map((p) => Math.abs(+x[p] - +y[p])));
    maxDelta = Math.max(maxDelta, d);
    if (d > 0.5) moved++;
    for (const p of [...PAINT, ...TIMING])
      if (x[p] !== y[p]) {
        byProp[p] = (byProp[p] ?? 0) + 1;
        if (samples.length < 14 && p !== "o") samples.push({ k: k.slice(-60), p, a: x[p], b: y[p] });
      }
  }
  return { keys: keys.size, shared, onlyA, onlyB, maxDeltaPx: +maxDelta.toFixed(3), moved, byProp, samples, onlySamples };
}
async function settle(p: Page) {
  await p.waitForTimeout(1600);
  let prev = "";
  for (let i = 0; i < 30; i++) {
    const sig = await p.evaluate(() => {
      let o = 0, n = 0;
      for (const el of Array.from(document.querySelectorAll("body *"))) { o += +getComputedStyle(el).opacity; n++; }
      return `${n}:${o.toFixed(3)}`;
    });
    if (sig === prev) return i;
    prev = sig;
    await p.waitForTimeout(250);
  }
  return -1;
}
const givens = (p: Page) => p.evaluate(() => (document.querySelector(".board-cells") as HTMLElement | null)?.innerText.replace(/\s+/g, "") ?? "");
async function open(browser: Browser, pose: Pose, base: string, reduce = false) {
  const ctx = await browser.newContext({ viewport: { width: pose.w, height: pose.h }, hasTouch: pose.touch, colorScheme: pose.dark ? "dark" : "light", reducedMotion: reduce ? "reduce" : "no-preference" });
  const p = await ctx.newPage();
  await p.goto(base + URL);
  await p.locator(".board-cells").first().waitFor();
  if (pose.gallery) {
    await settle(p);
    await p.locator("button.logo-trigger").first().click();
    await p.locator(".gallery-viewport").first().waitFor();
  }
  const s = await settle(p);
  return { ctx, p, s };
}
const REGIME = (p: Page) => p.evaluate(() => ({
  coarse: matchMedia("(pointer: coarse)").matches, dark: document.documentElement.classList.contains("dark"),
  reduce: matchMedia("(prefers-reduced-motion: reduce)").matches, gallery: !!document.querySelector(".gallery-viewport"),
  faceTf: (() => { const f = document.querySelector(".live-face-fit"); return f ? getComputedStyle(f).transform : null; })(),
  liveFitInline: (document.querySelector(".live-face-fit") as HTMLElement | null)?.style.getPropertyValue("--live-fit") ?? null,
}));

test("crit pi: T5 vs CTL, CTL vs CTL, T5 vs T4 (the pass-5 advance alone)", async ({ browser, browserName }) => {
  const rows: any[] = [];
  for (const pose of POSES) {
    const arms = [await open(browser, pose, T5), await open(browser, pose, CTL), await open(browser, pose, CTL), await open(browser, pose, T4)];
    const g = await Promise.all(arms.map((a) => givens(a.p)));
    const reg = await Promise.all(arms.map((a) => REGIME(a.p)));
    const [c5, c0, c0b, c4] = await Promise.all(arms.map((a) => a.p.evaluate(CENSUS)));
    const row = { pose: pose.name, browserName, payload: PAYLOAD, givensEqual: g.every((x) => x === g[0]) && g[0].length > 0, settled: arms.map((a) => a.s), regime: reg,
      t5VsCtl: compare(c5, c0), ctlVsCtl: compare(c0b, c0), t5VsT4: compare(c5, c4) };
    rows.push(row);
    console.log(`PI ${browserName} ${pose.name} givens=${row.givensEqual} | T5-C onlyA ${row.t5VsCtl.onlyA} onlyC ${row.t5VsCtl.onlyB} maxΔ ${row.t5VsCtl.maxDeltaPx} moved ${row.t5VsCtl.moved} ${JSON.stringify(row.t5VsCtl.byProp)} | C-C maxΔ ${row.ctlVsCtl.maxDeltaPx} ${JSON.stringify(row.ctlVsCtl.byProp)} | T5-T4 onlyA ${row.t5VsT4.onlyA} onlyB ${row.t5VsT4.onlyB} maxΔ ${row.t5VsT4.maxDeltaPx} moved ${row.t5VsT4.moved} ${JSON.stringify(row.t5VsT4.byProp)} | face ${reg[0].faceTf} / ${reg[1].faceTf} / ${reg[3].faceTf}`);
    for (const a of arms) await a.ctx.close();
  }
  writeFileSync(`${OUT}/pi-${browserName}.json`, JSON.stringify(rows, null, 1));
});

test("crit prm: tweening rendered elements under reduce, four poses, T5 vs CTL", async ({ browser, browserName }) => {
  const rows: any[] = [];
  const ROSTER = () => {
    const secs = (v: string) => v.split(",").map((s) => (s.trim().endsWith("ms") ? parseFloat(s) / 1000 : parseFloat(s)));
    const out: any[] = [];
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const cs = getComputedStyle(el);
      const tw = cs.transitionProperty !== "none" && secs(cs.transitionDuration).some((n) => n > 0);
      const an = cs.animationName !== "none" && secs(cs.animationDuration).some((n) => n > 0);
      if (!tw && !an) continue;
      out.push({ tag: el.tagName, cls: (el.getAttribute("class") ?? "").slice(0, 50), inToggle: !!el.closest(".sun-moon-toggle"), td: cs.transitionDuration, an: cs.animationName, ad: cs.animationDuration });
    }
    return out;
  };
  for (const pose of [POSES[0], POSES[1], POSES[3], POSES[4]]) {
    for (const [arm, base] of [["T5", T5], ["CTL", CTL]] as const) {
      const a = await open(browser, pose, base, true);
      const r: any[] = await a.p.evaluate(ROSTER);
      const reg = await REGIME(a.p);
      const rungs = await a.p.evaluate(() => ["whisper", "leave", "note", "dusk", "step", "throw", "rise"].map((n) => getComputedStyle(document.documentElement).getPropertyValue(`--motion-${n}`).trim()));
      const outside = r.filter((x) => !x.inToggle);
      rows.push({ pose: pose.name, arm, browserName, reduce: reg.reduce, total: r.length, inToggle: r.length - outside.length, outside: outside.length, outsideSample: outside.slice(0, 8), rungs });
      console.log(`PRM ${browserName} ${pose.name} ${arm} reduce=${reg.reduce} total ${r.length} inToggle ${r.length - outside.length} outside ${outside.length} rungs ${rungs.join(",")} ${arm === "T5" ? JSON.stringify(outside.slice(0, 4)) : ""}`);
      await a.ctx.close();
    }
  }
  writeFileSync(`${OUT}/prm-${browserName}.json`, JSON.stringify(rows, null, 1));
});

test("crit cssom: registrations, rung values, absence = reduce, inherits:false consequence", async ({ browser, browserName }) => {
  const out: any = { browserName };
  for (const [arm, base] of [["T5", T5], ["T4", T4], ["CTL", CTL]] as const) {
    const a = await open(browser, POSES[0], base);
    out[arm] = await a.p.evaluate(() => {
      const regs: any[] = [];
      const walk = (rules: CSSRuleList, depth: number) => {
        for (const r of Array.from(rules)) {
          if (typeof CSSPropertyRule !== "undefined" && r instanceof CSSPropertyRule && /motion|live-fit/.test(r.name)) regs.push({ name: r.name, depth, inherits: r.inherits, init: r.initialValue, syntax: r.syntax });
          const inner = (r as any).cssRules as CSSRuleList | undefined;
          if (inner) walk(inner, depth + 1);
        }
      };
      for (const s of Array.from(document.styleSheets)) { try { walk(s.cssRules, 0); } catch { /* cross-origin */ } }
      const root = getComputedStyle(document.documentElement);
      const rungs = Object.fromEntries(["whisper", "leave", "note", "dusk", "step", "throw", "rise"].map((n) => [n, root.getPropertyValue(`--motion-${n}`).trim()]));
      // absence = reduce: remove the publisher, read a rung consumer
      const probe = document.createElement("div");
      probe.style.transition = "opacity var(--motion-throw) linear";
      document.body.append(probe);
      const before = getComputedStyle(probe).transitionDuration;
      const pub = document.querySelector("style[data-motion-rungs]");
      pub?.remove();
      const after = getComputedStyle(probe).transitionDuration;
      const tp = getComputedStyle(probe).transitionProperty;
      if (pub) document.head.append(pub);
      // the @property law, clause 2, demonstrated: a NON-inherited <time> set on :root is not seen by a child
      let nonInherit: string | null = null;
      try {
        (CSS as any).registerProperty({ name: "--crit-ni", syntax: "<time>", inherits: false, initialValue: "0s" });
        document.documentElement.style.setProperty("--crit-ni", "520ms");
        const c = document.createElement("div");
        c.style.transition = "opacity var(--crit-ni) linear";
        document.body.append(c);
        nonInherit = getComputedStyle(c).transitionDuration;
      } catch (e) { nonInherit = "ERR " + e; }
      return { regs, rungs, publisherFound: !!pub, consumerBefore: before, consumerAfterPublisherRemoved: after, transitionPropertyAfter: tp, nonInheritChildReads: nonInherit };
    });
    await a.ctx.close();
  }
  // live-fit at the gallery on T5: inline value and face transform
  console.log(`CSSOM ${browserName} ${JSON.stringify(out)}`);
  writeFileSync(`${OUT}/cssom-${browserName}.json`, JSON.stringify(out, null, 1));
});
