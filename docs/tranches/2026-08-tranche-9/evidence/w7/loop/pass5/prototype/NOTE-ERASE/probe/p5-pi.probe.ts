/**
 * NOTE-ERASE pass 5 · π against 74a2b5d9 at FOUR cells (F-ERASE-1's table), both arms on ONE
 * payload, both BUILT dists (prod-vs-prod). Coarse cells run hasTouch with the regime witnessed.
 * Every key reports tag, box and computed paint; the strip's min-height and height at empty,
 * fresh (the hint armed) and settled.
 */
import { test, expect, type Browser } from "@playwright/test";
import { bank, say, boardReady, armHint, PROTO, CONTROL, PAYLOAD } from "./lib";

const CELLS = [
  { label: "390x844-coarse", w: 390, h: 844, touch: true },
  { label: "1280x800-fine", w: 1280, h: 800, touch: false },
  { label: "844x390-coarse", w: 844, h: 390, touch: true },
  { label: "812x375-coarse", w: 812, h: 375, touch: true },
];

const readAll = () => {
  const r2 = (x: number) => Math.round(x * 100) / 100;
  const key = (sel: string) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      box: { x: r2(r.x), y: r2(r.y), w: r2(r.width), h: r2(r.height) },
      display: cs.display,
      font: `${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`,
      color: cs.color,
      background: cs.backgroundColor,
      minHeight: cs.minHeight,
    };
  };
  return {
    coarse: matchMedia("(pointer: coarse)").matches,
    board: key('[role="grid"]'),
    controls: key(".controls-card"),
    strip: key(".margin-note-block"),
    note: key(".margin-note"),
    docH: r2(document.documentElement.scrollHeight),
    text: (document.querySelector(".margin-note")?.textContent || "").trim(),
  };
};
type R = ReturnType<typeof readAll>;

async function arm(browser: Browser, base: string, c: (typeof CELLS)[number]) {
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: c.touch, colorScheme: "light", reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  await boardReady(page, base);
  const empty = (await page.evaluate(readAll)) as R;
  await armHint(page, 0);
  const fresh = (await page.evaluate(readAll)) as R;
  await page.waitForTimeout(1500);
  const settled = (await page.evaluate(readAll)) as R;
  await ctx.close();
  return { empty, fresh, settled };
}

const d = (a: number | undefined, b: number | undefined) => Math.round(((a ?? 0) - (b ?? 0)) * 100) / 100;
function compare(p: R, q: R) {
  const out: Record<string, unknown> = {};
  const paint: string[] = [];
  for (const k of ["board", "controls", "strip", "note"] as const) {
    const x = p[k], y = q[k];
    if (!x || !y) { if (x || y) paint.push(`${k}: one arm only`); continue; }
    out[k] = { dx: d(x.box.x, y.box.x), dy: d(x.box.y, y.box.y), dw: d(x.box.w, y.box.w), dh: d(x.box.h, y.box.h) };
    for (const f of ["tag", "display", "font", "color", "background"] as const) if (x[f] !== y[f]) paint.push(`${k}.${f}: ${x[f]} | ${y[f]}`);
    if (k === "strip" && x.minHeight !== y.minHeight) paint.push(`strip.minHeight: ${x.minHeight} | ${y.minHeight} (CLAIMED)`);
  }
  out.docH = d(p.docH, q.docH);
  out.paint = paint;
  out.sameText = p.text === q.text;
  return out;
}

test("π four cells vs 74a2b5d9, one payload, both dists", async ({ browser }, info) => {
  test.setTimeout(400000);
  const out: Record<string, unknown> = { engine: info.project.name, control: "74a2b5d9 (w7-control dist index-CubiZsMVSwTc.js)", proto: "index-aW5mmGzDOl_l.js", payload: PAYLOAD };
  for (const c of CELLS) {
    const p = await arm(browser, PROTO, c);
    const q = await arm(browser, CONTROL, c);
    out[c.label] = {
      coarseWitnessed: { proto: p.empty.coarse, control: q.empty.coarse },
      strip: {
        proto: { minHeight: p.empty.strip?.minHeight, empty: p.empty.strip?.box.h, fresh: p.fresh.strip?.box.h, settled: p.settled.strip?.box.h, display: p.empty.strip?.display },
        control: { minHeight: q.empty.strip?.minHeight, empty: q.empty.strip?.box.h, fresh: q.fresh.strip?.box.h, settled: q.settled.strip?.box.h },
      },
      docH: { proto: [p.empty.docH, p.fresh.docH, p.settled.docH], control: [q.empty.docH, q.fresh.docH, q.settled.docH] },
      pi: { empty: compare(p.empty, q.empty), fresh: compare(p.fresh, q.fresh), settled: compare(p.settled, q.settled) },
      text: { proto: p.fresh.text, control: q.fresh.text },
    };
  }
  bank(`pi-${info.project.name}.json`, out);
  say("pi", out);
  for (const c of CELLS) {
    const r = out[c.label] as { strip: { proto: { empty: number; fresh: number } }; pi: Record<string, { board: { dy: number; dh: number } }> };
    expect(r.strip.proto.fresh, `${c.label} the strip holds`).toBe(r.strip.proto.empty);
    for (const s of ["empty", "fresh", "settled"]) expect(r.pi[s].board, `${c.label} ${s} board`).toEqual({ dx: 0, dy: 0, dw: 0, dh: 0 });
  }
});
