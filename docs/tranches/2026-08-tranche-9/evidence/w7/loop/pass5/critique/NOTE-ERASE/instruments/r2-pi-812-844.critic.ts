/**
 * CRITIC · π over EVERY element under #app (not four selectors), tree dist vs control 74a2b5d9,
 * with control-vs-control as the in-run noise floor. Computed PAINT: tag, rect, color, bg, opacity,
 * transform, filter, visibility, clip-path, font-size, line-height, min-height. Cells: 1280x800
^ * 812x375 coarse (never run by the first critic pass) and 844x390 coarse (hasTouch, witnessed). States: empty, fresh (hint armed).
 */
import { test, type Browser } from "@playwright/test";
import { bank, say, boardReady, armHint, PROTO, CONTROL, PAYLOAD } from "./lib";

const CELLS = [
  { label: "812x375-coarse", w: 812, h: 375, touch: true },
  { label: "844x390-coarse", w: 844, h: 390, touch: true },
];
const snap = () => {
  const r2 = (x: number) => Math.round(x * 100) / 100;
  const out: Record<string, Record<string, string>> = {};
  const all = [...document.querySelectorAll("#app *")];
  const seen: Record<string, number> = {};
  for (const el of all) {
    const cls = [...el.classList].filter((c) => !/^data-v/.test(c)).sort().join(".");
    const base = `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
    const n = (seen[base] = (seen[base] ?? 0) + 1);
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    out[`${base}#${n}`] = {
      rect: `${r2(r.x)},${r2(r.y)},${r2(r.width)},${r2(r.height)}`,
      color: cs.color, bg: cs.backgroundColor, opacity: cs.opacity, transform: cs.transform,
      filter: cs.filter, visibility: cs.visibility, clip: cs.clipPath, font: `${cs.fontSize}/${cs.lineHeight}`,
      minH: cs.minHeight,
    };
  }
  return {
    coarse: matchMedia("(pointer: coarse)").matches,
    docH: document.documentElement.scrollHeight,
    text: (document.querySelector(".margin-note")?.textContent || "").trim(),
    stripH: r2(document.querySelector(".margin-note-block")?.getBoundingClientRect().height ?? -1),
    els: out,
  };
};
type S = ReturnType<typeof snap>;
async function arm(browser: Browser, base: string, c: (typeof CELLS)[number]) {
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: c.touch, colorScheme: "light" });
  const page = await ctx.newPage();
  await boardReady(page, base);
  const empty = (await page.evaluate(snap)) as S;
  await armHint(page, 0);
  await page.waitForTimeout(400);
  const fresh = (await page.evaluate(snap)) as S;
  await page.waitForTimeout(9000);
  const settled = (await page.evaluate(snap)) as S;
  const age = await page.evaluate(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age") ?? null);
  await ctx.close();
  return { empty, fresh, settled, age };
}
function diff(a: S, b: S) {
  const keys = new Set([...Object.keys(a.els), ...Object.keys(b.els)]);
  const rows: string[] = [];
  const classes: Record<string, number> = {};
  for (const k of keys) {
    const x = a.els[k], y = b.els[k];
    if (!x || !y) { rows.push(`${k}: ${x ? "tree only" : "control only"}`); classes.presence = (classes.presence ?? 0) + 1; continue; }
    for (const f of Object.keys(x)) if (x[f] !== y[f]) { rows.push(`${k}.${f}: ${x[f]} | ${y[f]}`); classes[f] = (classes[f] ?? 0) + 1; }
  }
  return { n: rows.length, classes, rows: rows.slice(0, 60), docH: a.docH - b.docH, strip: [a.stripH, b.stripH], sameText: a.text === b.text, coarse: [a.coarse, b.coarse] };
}
test("critic π whole-DOM", async ({ browser }, info) => {
  test.setTimeout(400000);
  const out: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD, tree: "index-B5bclKNTuHnj.js", control: "74a2b5d9 index-CubiZsMVSwTc.js" };
  for (const c of CELLS) {
    const t = await arm(browser, PROTO, c);
    const q = await arm(browser, CONTROL, c);
    const q2 = await arm(browser, CONTROL, c);
    out[c.label] = {
      treeVsControl: { empty: diff(t.empty, q.empty), fresh: diff(t.fresh, q.fresh), settled: diff(t.settled, q.settled) },
      controlVsControl: { empty: diff(q2.empty, q.empty), fresh: diff(q2.fresh, q.fresh), settled: diff(q2.settled, q.settled) },
      ages: { tree: t.age, control: q.age },
      tab: Object.fromEntries((["empty", "fresh", "settled"] as const).map((st) => [st, {
        tree: Object.entries(t[st].els).filter(([k]) => /^button\.drawer-tab|^p\.board-voice|margin-note-block/.test(k)).map(([k, v]) => `${k} ${v.rect}`),
        control: Object.entries(q[st].els).filter(([k]) => /^button\.drawer-tab|^p\.board-voice|margin-note-block/.test(k)).map(([k, v]) => `${k} ${v.rect}`),
        docH: [t[st].docH, q[st].docH], strip: [t[st].stripH, q[st].stripH], coarse: [t[st].coarse, q[st].coarse],
      }])),
      elCount: { tree: Object.keys(t.empty.els).length, control: Object.keys(q.empty.els).length },
    };
  }
  bank(`critic5r2-pi-${info.project.name}.json`, out);
  for (const c of CELLS) { const o = out[c.label] as any; say(`pi.${c.label}`, { tab: o.tab, ages: o.ages, n: { empty: [o.treeVsControl.empty.n, o.controlVsControl.empty.n], fresh: [o.treeVsControl.fresh.n, o.controlVsControl.fresh.n], settled: [o.treeVsControl.settled.n, o.controlVsControl.settled.n] }, elCount: o.elCount }); }
});
