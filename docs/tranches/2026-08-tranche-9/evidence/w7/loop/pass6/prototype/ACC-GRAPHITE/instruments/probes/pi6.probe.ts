/** ACC-GRAPHITE pass 6 — π: every `body *` node's computed PAINT properties + tag path, tree vs control
 *  and control vs control (the in-run noise floor), at LOAD and after the focus interaction (your 5
 *  typed, ArrowRight onto the next cell), per regime. Payload mintBoard(3, 30); the given set is read
 *  back from the aria-label corpus per arm and must match. Differences are CLASSIFIED by the node's
 *  first class (or tag) and property; the summary is printed, never the raw census. */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { mintBoard } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const ARMS: [string, string][] = [["tree", process.env.TREE_URL!], ["control", process.env.CONTROL_URL!], ["control2", process.env.CONTROL_URL!]];
const REGIMES = [
  { n: "desk-light", vp: { width: 1280, height: 800 }, theme: "light", touch: false },
  { n: "desk-dark", vp: { width: 1280, height: 800 }, theme: "dark", touch: false },
  { n: "phone393-light", vp: { width: 393, height: 699 }, theme: "light", touch: true },
  { n: "phone393-dark", vp: { width: 393, height: 699 }, theme: "dark", touch: true },
];
const census = (page: any) => page.evaluate(() => {
  const P = ["color", "backgroundColor", "stroke", "strokeWidth", "strokeOpacity", "fill", "fillOpacity", "opacity", "filter", "borderTopColor", "borderTopWidth", "boxShadow", "outlineStyle", "display", "visibility", "fontWeight", "transform"];
  const path = (el: Element) => { const p: string[] = []; let e: Element | null = el; while (e && e !== document.documentElement) { const par: Element | null = e.parentElement; const i = par ? Array.from(par.children).filter((c) => c.tagName === e!.tagName).indexOf(e) : 0; p.unshift(`${e.tagName.toLowerCase()}${i ? `[${i}]` : ""}`); e = par; } return p.join(">"); };
  const out: Record<string, { k: string; v: Record<string, string> }> = {};
  for (const el of Array.from(document.querySelectorAll("body *"))) { const cs = getComputedStyle(el) as any; const cls = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean)[0]; out[path(el)] = { k: cls ? `.${cls}` : el.tagName.toLowerCase(), v: Object.fromEntries(P.map((p) => [p, String(cs[p])])) }; }
  return out;
});
const diff = (a: any, b: any) => { const cls: Record<string, number> = {}; let changed = 0, added = 0, removed = 0; for (const k of Object.keys(a)) { if (!(k in b)) { added++; cls[`+${a[k].k}`] = (cls[`+${a[k].k}`] ?? 0) + 1; continue; } const props = Object.keys(a[k].v).filter((p) => a[k].v[p] !== b[k].v[p]); if (props.length) { changed++; for (const p of props) { const key = `${a[k].k} ${p}: ${b[k].v[p]} → ${a[k].v[p]}`.slice(0, 160); cls[key] = (cls[key] ?? 0) + 1; } } } for (const k of Object.keys(b)) if (!(k in a)) { removed++; cls[`-${b[k].k}`] = (cls[`-${b[k].k}`] ?? 0) + 1; } return { changed, added, removed, classes: cls }; };
for (const R of REGIMES) test(`pi-${R.n}`, async ({ browser }, info) => {
  const got: any = {}; const givens: Record<string, string> = {};
  for (const [arm, base] of ARMS) {
    const ctx = await browser.newContext({ viewport: R.vp, deviceScaleFactor: 1, colorScheme: R.theme as any, hasTouch: R.touch, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${base}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(3000);
    givens[arm] = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i, n) => /given/i.test(i.getAttribute("aria-label") ?? "") ? `${n}:${i.getAttribute("aria-label")}` : "").filter(Boolean).join("|"));
    got[arm] = await census(page);
    await page.locator(".game-cell input").nth(30).focus(); await page.keyboard.type("5"); await page.keyboard.press("ArrowRight"); await page.waitForTimeout(1200);
    got[arm + "@focus"] = await census(page);
    await ctx.close();
  }
  expect(givens.tree).toBe(givens.control);
  const res = { engine: info.project.name, regime: R.n, givens: givens.tree.split("|").length, load: diff(got.tree, got.control), focus: diff(got["tree@focus"], got["control@focus"]), noiseLoad: diff(got.control2, got.control), noiseFocus: diff(got["control2@focus"], got["control@focus"]) };
  console.log(`PI ${info.project.name} ${R.n} givens ${res.givens}: load ${res.load.changed}/+${res.load.added}/-${res.load.removed} focus ${res.focus.changed}/+${res.focus.added}/-${res.focus.removed} · noise ${res.noiseLoad.changed}/${res.noiseFocus.changed}`);
  writeFileSync(`${S}/pi-${info.project.name}-${R.n}.json`, JSON.stringify(res, null, 1));
});
