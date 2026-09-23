/**
 * NOTE-ERASE pass 6 · π over EVERY element under #app, keyed by SEMANTIC ancestry (the nearest
 * landmark ancestor + tag + stable classes + ordinal), tree dist vs control 74a2b5d9, with the
 * control-vs-control floor in the same run (LAWS P5). Paint read: tag, rect, colour, background,
 * opacity, transform, filter, visibility, clip-path, font, min-height, fill, stroke, display.
 * Cells: 1280x800 fine, 390x844 coarse, 844x390 coarse, 812x375 coarse (W2 §2.2's two landscape
 * cells), and 812x375 coarse on a 16x16 payload (the widest board's copy). States: empty (dealt),
 * fresh (hint armed +400 ms), settled (+9 s). Pointer class witnessed per arm.
 */
import { test, type Browser } from "@playwright/test";
import { encodeSudoku } from "../e2e/wire";
import { bank, say, boardReady, armHint, PROTO, CONTROL, PAYLOAD } from "./lib";

// A valid 16x16 by the shifted-pattern construction, every other cell given (128 givens).
const G16: Record<number, number> = {};
for (let r = 0; r < 16; r++)
  for (let c = 0; c < 16; c++) if ((r * 16 + c) % 2 === 0) G16[r * 16 + c] = ((r * 4 + Math.floor(r / 4) + c) % 16) + 1;
const PAYLOAD16 = encodeSudoku(4, G16, 256);

const CELLS = [
  { label: "1280x800-fine", w: 1280, h: 800, touch: false, p16: false },
  { label: "390x844-coarse", w: 390, h: 844, touch: true, p16: false },
  { label: "844x390-coarse", w: 844, h: 390, touch: true, p16: false },
  { label: "812x375-coarse", w: 812, h: 375, touch: true, p16: false },
  { label: "812x375-coarse-16x16", w: 812, h: 375, touch: true, p16: true },
];
const snap = () => {
  const r2 = (x: number) => Math.round(x * 100) / 100;
  const SEM = ["masthead", "board-wrapper", "board-margin", "controls-card", "play-controls", "margin-note-block", "drawer-tab", "board-voice", "live-face-slot", "game-card-paper", "scene"];
  const STATE = /^(is-|has-|note-|v-|router-)/;
  const out: Record<string, Record<string, string>> = {};
  const seen: Record<string, number> = {};
  for (const el of document.querySelectorAll("#app *")) {
    let land = "";
    for (let n = el.parentElement; n; n = n.parentElement) {
      const s = SEM.find((c) => n!.classList.contains(c));
      if (s) { land = s; break; }
    }
    const cls = [...el.classList].filter((c) => !/^data-v/.test(c) && !STATE.test(c)).sort().join(".");
    const base = `${land}>${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
    const n = (seen[base] = (seen[base] ?? 0) + 1);
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    out[`${base}#${n}`] = {
      rect: `${r2(r.x)},${r2(r.y)},${r2(r.width)},${r2(r.height)}`,
      color: cs.color, bg: cs.backgroundColor, opacity: cs.opacity, transform: cs.transform,
      filter: cs.filter, visibility: cs.visibility, clip: cs.clipPath, font: `${cs.fontSize}/${cs.lineHeight}`,
      minH: cs.minHeight, fill: cs.fill, stroke: cs.stroke, display: cs.display,
    };
  }
  return {
    coarse: matchMedia("(pointer: coarse)").matches,
    docH: document.documentElement.scrollHeight,
    text: (document.querySelector(".margin-note")?.textContent || "").replace(/\s+/g, " ").trim(),
    voice: (document.querySelector(".board-voice")?.textContent || "").replace(/\s+/g, " ").trim(),
    stripH: r2(document.querySelector(".margin-note-block")?.getBoundingClientRect().height ?? -1),
    els: out,
  };
};
type S = ReturnType<typeof snap>;
async function arm(browser: Browser, base: string, c: (typeof CELLS)[number]) {
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: c.touch, colorScheme: "light" });
  const page = await ctx.newPage();
  if (c.p16) {
    await page.goto(`${base}/?board=${PAYLOAD16}`);
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
    await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
    const n = await page.evaluate(() => [...document.querySelectorAll(".game-cell input")].filter((i) => /given clue/.test(i.getAttribute("aria-label") ?? "")).length);
    if (n !== 128) throw new Error(`16x16 payload not dealt: ${n} givens`);
    await page.waitForTimeout(900);
  } else await boardReady(page, base);
  const empty = (await page.evaluate(snap)) as S;
  await armHint(page, 0);
  await page.waitForTimeout(400);
  const fresh = (await page.evaluate(snap)) as S;
  await page.waitForTimeout(9000);
  const settled = (await page.evaluate(snap)) as S;
  await ctx.close();
  return { empty, fresh, settled };
}
function diff(a: S, b: S) {
  const keys = new Set([...Object.keys(a.els), ...Object.keys(b.els)]);
  const rows: string[] = [];
  const byKey = new Set<string>();
  for (const k of keys) {
    const x = a.els[k], y = b.els[k];
    if (!x || !y) { rows.push(`${k}: ${x ? "tree only" : "control only"}`); byKey.add(k); continue; }
    for (const f of Object.keys(x)) if (x[f] !== y[f]) { rows.push(`${k}.${f}: ${x[f]} | ${y[f]}`); byKey.add(k); }
  }
  return { n: rows.length, elements: byKey.size, rows: rows.slice(0, 80), docH: a.docH - b.docH, strip: [a.stripH, b.stripH], text: [a.text, b.text], voice: [a.voice, b.voice], coarse: [a.coarse, b.coarse] };
}
const pick = (s: S, re: RegExp) => Object.entries(s.els).filter(([k]) => re.test(k)).map(([k, v]) => `${k} ${v.rect}`);
const WATCH = /drawer-tab#1$|>p\.board-voice#1$|>div\.margin-note-block#1$|>button\.drawer-tab#1$/;
for (const c of CELLS)
  test(`π whole-DOM ${c.label}`, async ({ browser }, info) => {
    test.setTimeout(400000);
    const t = await arm(browser, PROTO, c);
    const q = await arm(browser, CONTROL, c);
    const q2 = await arm(browser, CONTROL, c);
    const out = {
      engine: info.project.name, cell: c.label, payload: c.p16 ? PAYLOAD16 : PAYLOAD,
      tree: "index-B5bclKNTuHnj.js", control: "74a2b5d9 index-CubiZsMVSwTc.js",
      elCount: { tree: Object.keys(t.empty.els).length, control: Object.keys(q.empty.els).length },
      treeVsControl: { empty: diff(t.empty, q.empty), fresh: diff(t.fresh, q.fresh), settled: diff(t.settled, q.settled) },
      floor: { empty: diff(q2.empty, q.empty), fresh: diff(q2.fresh, q.fresh), settled: diff(q2.settled, q.settled) },
      watch: Object.fromEntries((["empty", "fresh", "settled"] as const).map((st) => [st, { tree: pick(t[st], WATCH), control: pick(q[st], WATCH) }])),
    };
    bank(`pi-${c.label}-${info.project.name}.json`, out);
    say(`pi.${c.label}`, {
      n: Object.fromEntries((["empty", "fresh", "settled"] as const).map((st) => [st, [out.treeVsControl[st].elements, out.floor[st].elements]])),
      strip: out.treeVsControl.empty.strip, docH: out.treeVsControl.empty.docH, coarse: out.treeVsControl.empty.coarse,
      watch: out.watch.empty,
    });
  });
