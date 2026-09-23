import { test, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { PINNED_URL, PAYLOAD } from "./board";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });
const AFTER = process.env.PW_AFTER ?? "http://127.0.0.1:4246";
const CONTROL = process.env.PW_CONTROL ?? "http://127.0.0.1:4237";

/**
 * π, pass 5. Three pages per pose: AFTER, CONTROL and CONTROL again (the negative arm: the
 * instrument's own noise on one build). Pinned `?board=` payload, STATED, with the given-set
 * read back from both arms. Structural `TAG[n]` key. Paint = tag, color, background, border
 * colour, font, line-height, OPACITY, TRANSFORM, FILTER — the transform is what `--live-fit`
 * moves if its registration changed a face. Gallery poses are DRIVEN (the wordmark pressed),
 * because a page read at load cannot see what the deck paints. Read after the estate settles:
 * polled until two consecutive reads agree, never a fixed sleep alone.
 */
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
      t: el.tagName,
      x: +r.left.toFixed(2),
      y: +r.top.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      c: cs.color,
      bg: cs.backgroundColor,
      bc: cs.borderTopColor,
      f: cs.fontFamily + " " + cs.fontSize + " " + cs.fontWeight,
      lh: cs.lineHeight,
      o: cs.opacity,
      tf: cs.transform,
      fi: cs.filter,
    };
  }
  return out;
};
const PAINT = ["t", "c", "bg", "bc", "f", "lh", "o", "tf", "fi"] as const;

type Census = Record<string, Record<string, string | number>>;
function compare(a: Census, b: Census) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let onlyA = 0,
    onlyB = 0,
    shared = 0,
    maxDelta = 0,
    moved = 0;
  const byProp: Record<string, number> = {};
  const samples: unknown[] = [];
  for (const k of keys) {
    const x = a[k];
    const y = b[k];
    if (!x) {
      onlyB++;
      continue;
    }
    if (!y) {
      onlyA++;
      continue;
    }
    shared++;
    const d = Math.max(
      ...(["x", "y", "w", "h"] as const).map((p) => Math.abs(+x[p] - +y[p])),
    );
    maxDelta = Math.max(maxDelta, d);
    if (d > 0.5) moved++;
    for (const p of PAINT)
      if (x[p] !== y[p]) {
        byProp[p] = (byProp[p] ?? 0) + 1;
        if (samples.length < 8) samples.push({ k: k.slice(-80), p, a: x[p], b: y[p] });
      }
  }
  return { keys: keys.size, shared, onlyA, onlyB, maxDeltaPx: +maxDelta.toFixed(3), moved, byProp, samples };
}

async function settle(p: Page) {
  await p.waitForTimeout(1600);
  let prev = "";
  for (let i = 0; i < 24; i++) {
    const sig = await p.evaluate(() => {
      let o = 0,
        n = 0;
      for (const el of Array.from(document.querySelectorAll("body *"))) {
        o += +getComputedStyle(el).opacity;
        n++;
      }
      return `${n}:${o.toFixed(3)}`;
    });
    if (sig === prev) return i;
    prev = sig;
    await p.waitForTimeout(250);
  }
  return -1;
}

const givens = (p: Page) =>
  p.evaluate(() => (document.querySelector(".board-cells") as HTMLElement | null)?.innerText.replace(/\s+/g, "") ?? "");

const POSES: Array<{ name: string; w: number; h: number; touch: boolean; dark: boolean; gallery: boolean }> = [
  { name: "play-1440x900-light-fine", w: 1440, h: 900, touch: false, dark: false, gallery: false },
  { name: "play-390x844-light-coarse", w: 390, h: 844, touch: true, dark: false, gallery: false },
  { name: "play-768x1024-light-coarse", w: 768, h: 1024, touch: true, dark: false, gallery: false },
  { name: "play-844x390-light-coarse", w: 844, h: 390, touch: true, dark: false, gallery: false },
  { name: "play-1440x900-dark-fine", w: 1440, h: 900, touch: false, dark: true, gallery: false },
  { name: "gallery-1440x900-light-fine", w: 1440, h: 900, touch: false, dark: false, gallery: true },
  { name: "gallery-390x844-light-coarse", w: 390, h: 844, touch: true, dark: false, gallery: true },
  { name: "gallery-1440x900-dark-fine", w: 1440, h: 900, touch: false, dark: true, gallery: true },
];

test("pi5 · pinned rest census incl. the gallery face, with the control-vs-control arm", async ({
  browser,
  browserName,
}) => {
  test.setTimeout(900000);
  const rows: unknown[] = [];
  for (const pose of POSES) {
    const ctx = await browser.newContext({
      viewport: { width: pose.w, height: pose.h },
      hasTouch: pose.touch,
      colorScheme: pose.dark ? "dark" : "light",
    });
    const pages = [await ctx.newPage(), await ctx.newPage(), await ctx.newPage()];
    const bases = [AFTER, CONTROL, CONTROL];
    const settled: number[] = [];
    for (let i = 0; i < 3; i++) {
      const p = pages[i];
      await p.goto(bases[i] + PINNED_URL);
      await p.locator(".board-cells").first().waitFor();
      if (pose.gallery) {
        await settle(p);
        await p.locator("button.logo-trigger").first().click();
        await p.locator(".gallery-viewport").first().waitFor();
      }
      settled.push(await settle(p));
    }
    const regime = await Promise.all(
      pages.map((p) =>
        p.evaluate(() => ({
          coarse: matchMedia("(pointer: coarse)").matches,
          dark: document.documentElement.classList.contains("dark"),
          gallery: !!document.querySelector(".gallery-viewport"),
          liveFit: (document.querySelector(".live-face-fit") as HTMLElement | null)?.style.getPropertyValue("--live-fit") ?? null,
          faceTf: (() => {
            const f = document.querySelector(".live-face-fit");
            return f ? getComputedStyle(f).transform : null;
          })(),
        })),
      ),
    );
    const g = await Promise.all(pages.map(givens));
    const [ca, cb, cb2] = await Promise.all(pages.map((p) => p.evaluate(CENSUS)));
    rows.push({
      pose: pose.name,
      browserName,
      payload: PAYLOAD,
      givensEqual: g[0] === g[1] && g[1] === g[2],
      givensLen: g.map((x) => x.length),
      settledAfterPolls: settled,
      regime,
      afterVsControl: compare(ca, cb),
      controlVsControl: compare(cb2, cb),
    });
    await ctx.close();
  }
  writeFileSync(`${OUT}/pi5-${browserName}.json`, JSON.stringify(rows, null, 1) + "\n");
  for (const r of rows as any[])
    console.log(
      `pi5 ${browserName} ${r.pose}: givensEqual ${r.givensEqual} | A-vs-C shared ${r.afterVsControl.shared} onlyA ${r.afterVsControl.onlyA} onlyC ${r.afterVsControl.onlyB} maxΔ ${r.afterVsControl.maxDeltaPx} moved ${r.afterVsControl.moved} paint ${JSON.stringify(r.afterVsControl.byProp)} | C-vs-C paint ${JSON.stringify(r.controlVsControl.byProp)} maxΔ ${r.controlVsControl.maxDeltaPx} | faceTf ${r.regime[0].faceTf} vs ${r.regime[1].faceTf}`,
    );
});
