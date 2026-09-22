import { test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { PINNED_URL } from "./board";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(`${OUT}/${n}.json`, JSON.stringify(d, null, 1) + "\n");

const AFTER = process.env.PW_AFTER ?? "http://127.0.0.1:4246";
const CONTROL = process.env.PW_CONTROL ?? "http://127.0.0.1:4249";

/**
 * π · the PINNED census (critique §2.8). Two cures over pass 3: the same board on both arms
 * (`?board=`), and a STRUCTURAL key — the nth-of-type path from `body` — which cannot
 * collide the way `TAG.class#id` did (102/91 distinct keys out of 774-880 rects). Read at
 * rest, 1.6s past the 520ms settle. Paint properties travel with the rect, because a rect
 * alone cannot see a font or a colour move.
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
  const out: Record<string, unknown> = {};
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
      f: cs.fontFamily + " " + cs.fontSize + " " + cs.fontWeight,
      lh: cs.lineHeight,
    };
  }
  return out;
};

const POSES: Array<[string, number, number, boolean]> = [
  ["1440x900", 1440, 900, false],
  ["390x844", 390, 844, true],
  ["768x1024", 768, 1024, true],
  ["844x390", 844, 390, true],
];

test("pi · pinned rect + paint census, after vs control 74a2b5d9", async ({
  browser,
  browserName,
}) => {
  test.setTimeout(600000);
  const rows: unknown[] = [];
  for (const [name, w, h, touch] of POSES) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      hasTouch: touch,
      isMobile: false,
    });
    const [a, b] = [await ctx.newPage(), await ctx.newPage()];
    // the regime is WITNESSED on both pages of the one context, never assumed
    const regime = async (p: typeof a) =>
      p.evaluate(() => ({
        coarse: matchMedia("(pointer: coarse)").matches,
        touchPoints: navigator.maxTouchPoints,
      }));
    for (const [p, base] of [
      [a, AFTER],
      [b, CONTROL],
    ] as const) {
      await p.goto(base + PINNED_URL);
      await p.waitForLoadState("networkidle");
      await p.waitForTimeout(1600);
    }
    const [ca, cb] = [await a.evaluate(CENSUS), await b.evaluate(CENSUS)];
    const keys = new Set([...Object.keys(ca), ...Object.keys(cb)]);
    let onlyA = 0,
      onlyB = 0,
      maxDelta = 0,
      moved = 0,
      paintMoved = 0,
      shared = 0;
    const movers: unknown[] = [];
    for (const k of keys) {
      const x = (ca as Record<string, any>)[k];
      const y = (cb as Record<string, any>)[k];
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
        Math.abs(x.x - y.x),
        Math.abs(x.y - y.y),
        Math.abs(x.w - y.w),
        Math.abs(x.h - y.h),
      );
      if (d > maxDelta) maxDelta = d;
      if (d > 0.5) {
        moved++;
        if (movers.length < 12) movers.push({ k, after: x, control: y, d: +d.toFixed(2) });
      }
      if (x.t !== y.t || x.c !== y.c || x.bg !== y.bg || x.f !== y.f || x.lh !== y.lh) {
        paintMoved++;
        if (movers.length < 24) movers.push({ k, paint: { after: x, control: y } });
      }
    }
    rows.push({
      pose: name,
      browserName,
      hasTouch: touch,
      regimeAfter: await regime(a),
      regimeControl: await regime(b),
      keys: keys.size,
      shared,
      onlyAfter: onlyA,
      onlyControl: onlyB,
      maxDeltaPx: +maxDelta.toFixed(3),
      movedRects: moved,
      paintMoved,
      movers,
    });
    await ctx.close();
  }
  bank(`pi-pinned-${browserName}`, rows);
  for (const r of rows)
    console.log(
      `pi ${browserName} ${(r as any).pose}: shared ${(r as any).shared} · onlyAfter ${(r as any).onlyAfter} · onlyControl ${(r as any).onlyControl} · maxDelta ${(r as any).maxDeltaPx}px · moved ${(r as any).movedRects} · paintMoved ${(r as any).paintMoved}`,
    );
});
