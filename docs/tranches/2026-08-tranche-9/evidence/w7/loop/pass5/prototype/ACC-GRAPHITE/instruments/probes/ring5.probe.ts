/** ACC-GRAPHITE pass 5 — the pass-4 CRITIC's ring.crit.ts, COPIED (OUT re-pointed, ports re-pointed)
 *  and extended: a control-vs-control pi arm (the noise floor, same run), the pi census read AFTER
 *  the focus interaction as well as at load, CSS-injected TREE ARMS (one variable each) read for
 *  G2 only, the frame's unfocused board saved for the perimeter statistic, and G2's rank with
 *  the JUNCTION class (two grid lines crossing) named and excluded. Payload: mintBoard(3, 30). */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { encodeSudoku } from "../e2e/wire";

const S = process.env.OUTDIR!;
mkdirSync(S, { recursive: true });
const TREE = process.env.TREE_URL ?? "http://127.0.0.1:4237", CTRL = process.env.CTRL_URL ?? "http://127.0.0.1:4236";
const CSS_ARMS: [string, string][] = JSON.parse(process.env.TREE_ARMS ?? "[]");
const ARMS: Record<string, string> = { tree: TREE, control: CTRL, control2: CTRL, ...Object.fromEntries(CSS_ARMS.map(([n]) => [n, TREE])) };
const CSS_OF: Record<string, string> = Object.fromEntries(CSS_ARMS);
const REGIMES = (process.env.REGIMES ?? "desk-light,desk-dark,phone-light,phone-dark,desk-light-more").split(",");

function solution(size: number, i: number) {
  const n = size * size, r = Math.floor(i / n), c = i % n;
  return ((r * size + Math.floor(r / size) + c) % n) + 1;
}
function mint(size: number, givens: number) {
  const n = size * size, total = n * n, cells: Record<number, number> = {};
  for (let i = 0; i < total; i++) if ((i * 37) % total < givens) cells[i] = solution(size, i);
  return encodeSudoku(size, cells, total);
}
const ENC = mint(3, 30); // mintBoard(3, 30), the pass-4 payload

type Img = { data: Buffer; w: number; h: number; ch: number };
const toImg = async (b: Buffer): Promise<Img> => {
  const { data, info } = await sharp(b).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
};
const px = (im: Img, x: number, y: number) => { const i = (y * im.w + x) * im.ch; return [im.data[i], im.data[i + 1], im.data[i + 2]]; };
const Lm = (p: number[]) => 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
const lin = (v: number) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const rl = (p: number[]) => 0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]);
const cr = (a: number[], b: number[]) => { const x = rl(a), y = rl(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const med = (a: number[]) => { const b = [...a].sort((x, y) => x - y); const m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
const r3 = (x: number) => Math.round(x * 1000) / 1000;
function medRGB(im: Img, x0: number, y0: number, x1: number, y1: number) {
  const R: number[] = [], G: number[] = [], B: number[] = [];
  for (let y = Math.round(y0); y < Math.round(y1); y++) for (let x = Math.round(x0); x < Math.round(x1); x++) { const p = px(im, x, y); R.push(p[0]); G.push(p[1]); B.push(p[2]); }
  return [med(R), med(G), med(B)];
}
function hue(p: number[]) {
  const [r, g, b] = p.map((v) => v / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d < 1e-6) return { h: null, s: 0 };
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360;
  return { h: Math.round(h), s: r3(d / (1 - Math.abs(mx + mn - 1) || 1)) };
}

/** run of pixels (in a column profile) around seed where coverage >= 0.5; plus mass in a window */
function runAround(prof: number[], seed: number, reach: number) {
  let s = -1;
  for (let o = 0; o <= reach && s < 0; o++) { if (prof[seed + o] >= 0.5) s = seed + o; else if (prof[seed - o] >= 0.5) s = seed - o; }
  if (s < 0) return null;
  let a = s, b = s;
  while (a > 0 && prof[a - 1] >= 0.5) a--;
  while (b < prof.length - 1 && prof[b + 1] >= 0.5) b++;
  // sub-pixel edges at 0.5
  const L = a > 0 ? a - (prof[a] - 0.5) / (prof[a] - prof[a - 1] || 1) : a;
  const R = b < prof.length - 1 ? b + (prof[b] - 0.5) / (prof[b] - prof[b + 1] || 1) : b;
  let mass = 0; for (let k = a - 4; k <= b + 4; k++) mass += Math.max(0, Math.min(1, prof[k] ?? 0));
  return { a, b, w: R - L + 1 - 1 + 1 - 1 + 1 /* = R-L+1 */ - 1, wsub: R - L, wint: b - a + 1, mass };
}

async function paintCensus(page: import("@playwright/test").Page) {
  return page.evaluate(() => {
    const path = (el: Element): string => { const p: string[] = []; let e: Element | null = el; while (e && e !== document.documentElement) { const par: Element | null = e.parentElement; const i = par ? Array.from(par.children).filter((c) => c.tagName === e!.tagName).indexOf(e) : 0; p.unshift(`${e.tagName.toLowerCase()}${i ? `[${i}]` : ""}`); e = par; } return p.join(">"); };
    const P = ["color", "backgroundColor", "fontFamily", "fontSize", "fontWeight", "lineHeight", "stroke", "strokeWidth", "fill", "opacity", "filter", "borderTopColor", "boxShadow", "display", "visibility"] as const;
    const out: Record<string, string> = {};
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const cs = getComputedStyle(el);
      out[path(el)] = (el.getAttribute("class") ?? "").slice(0, 60) + " | " + P.map((k) => `${k}=${cs[k as any]}`).join(";");
    }
    return out;
  });
}

for (const regime of REGIMES) {
  test(`crit-${regime}`, async ({ browser }, info) => {
    const engine = info.project.name;
    const phone = regime.startsWith("phone");
    const dark = regime.includes("dark");
    const more = regime.includes("more");
    const res: Record<string, any> = { engine, regime, payload: ENC };
    const census: Record<string, Record<string, string>> = {};
    for (const [arm, base] of Object.entries(ARMS)) {
      const ctx = await browser.newContext({
        viewport: phone ? { width: 393, height: 699 } : { width: 1280, height: 800 },
        deviceScaleFactor: phone ? 3 : 1, hasTouch: phone, isMobile: false,
        colorScheme: dark ? "dark" : "light", reducedMotion: "reduce", contrast: more ? "more" : "no-preference",
      });
      const page = await ctx.newPage();
      await page.goto(`${base}/?board=${ENC}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 });
      if (CSS_OF[arm]) await page.addStyleTag({ content: CSS_OF[arm] });
      await page.waitForTimeout(3000);
      const asset = await page.evaluate(() => Array.from(document.scripts).map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
      const regimeRead = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, dark: matchMedia("(prefers-color-scheme: dark)").matches, more: matchMedia("(prefers-contrast: more)").matches, url: location.search.length }));
      if (!CSS_OF[arm]) census[arm] = await paintCensus(page);
      const cells = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell")).map((c) => { const r = c.getBoundingClientRect(); const inp = c.querySelector("input"); return { x: r.x, y: r.y, w: r.width, h: r.height, given: /given/i.test(inp?.getAttribute("aria-label") ?? ""), label: inp?.getAttribute("aria-label") ?? "" }; }));
      const writable = cells.map((c, i) => (!c.given ? i : -1)).filter((i) => i >= 0);
      const interior = writable.filter((i) => { const r = Math.floor(i / 9), c = i % 9; return r > 0 && r < 8 && c > 0 && c < 8; });
      const mid = interior.reduce((b, i) => (Math.abs(i - 40) < Math.abs(b - 40) ? i : b), interior[0]);
      const mr = Math.floor(mid / 9), mc = mid % 9;
      const box = (i: number) => Math.floor(Math.floor(i / 9) / 3) * 3 + Math.floor((i % 9) / 3);
      const peer = writable.find((i) => Math.floor(i / 9) === mr && i !== mid && Math.abs((i % 9) - mc) > 1)!;
      const nonPeer = writable.find((i) => Math.floor(i / 9) !== mr && i % 9 !== mc && box(i) !== box(mid) && Math.abs(Math.floor(i / 9) - mr) > 1)!;
      const typed = writable.find((i) => i !== peer && i !== nonPeer && Math.floor(i / 9) !== mr && i % 9 !== mc && box(i) !== box(mid))!;
      await page.locator(".game-cell input").nth(typed).focus();
      await page.keyboard.type(String(solution(3, typed)));
      await page.waitForTimeout(400);
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await page.mouse.move(1, 1);
      await page.waitForTimeout(600);
      const b = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
      const clip = { x: Math.max(0, b.x - 12), y: Math.max(0, b.y - 12), width: b.w + 24, height: b.h + 24 };
      const bufU = await page.screenshot({ clip });
      const imU = await toImg(bufU);
      if (!phone || true) await sharp(bufU).png().toFile(`${S}/unfocused-${engine}-${regime}-${arm}.png`);
      await page.locator(".game-cell input").nth(mid).focus();
      await page.keyboard.press("Shift");
      await page.waitForTimeout(500);
      const focusVisible = await page.evaluate(() => (document.activeElement as HTMLElement)?.matches(":focus-visible"));
      const bufF = await page.screenshot({ clip });
      const imF = await toImg(bufF);
      if (!CSS_OF[arm]) census[arm + "@focus"] = await paintCensus(page);
      if (regime === "desk-light" || regime === "phone-light") await sharp(bufF).png().toFile(`${S}/focused-${engine}-${regime}-${arm}.png`);
      const k = phone ? 3 : 1;
      const X = (v: number) => Math.round((v - clip.x) * k), Y = (v: number) => Math.round((v - clip.y) * k);
      const inner = (c: { x: number; y: number; w: number; h: number }) => [X(c.x + c.w * 0.3), Y(c.y + c.h * 0.3), X(c.x + c.w * 0.7), Y(c.y + c.h * 0.7)] as const;
      const paper = medRGB(imU, ...inner(cells[nonPeer]));
      const paperF = medRGB(imF, ...inner(cells[nonPeer]));
      const wash = medRGB(imF, ...inner(cells[peer]));
      const washU = medRGB(imU, ...inner(cells[peer]));
      // band full ink: extreme luminance within mid cell's edge band in the focused image
      const mcel = cells[mid];
      let inkL = dark ? -1 : 999, inkP = [0, 0, 0];
      for (let y = Y(mcel.y); y < Y(mcel.y + mcel.h); y++) for (let x = X(mcel.x + mcel.w * 0.35); x < X(mcel.x + mcel.w * 0.65); x++) { const p = px(imF, x, y); const l = Lm(p); if (dark ? l > inkL : l < inkL) { inkL = l; inkP = p; } }
      const pL = Lm(paper);
      const cov = (im: Img, x: number, y: number) => (pL - Lm(px(im, x, y))) / (pL - inkL);
      // vertical scan, columns across the middle 40% of the focused cell
      const top0 = cells[0], bot = cells[80];
      const rows: any[] = [];
      for (let x = X(mcel.x + mcel.w * 0.3); x < X(mcel.x + mcel.w * 0.7); x++) {
        const profF: number[] = [], profU: number[] = [];
        for (let y = 0; y < imF.h; y++) { profF.push(cov(imF, x, y)); profU.push(cov(imU, x, y)); }
        const diff = profF.map((v, i) => v - profU[i]);
        const fT = runAround(profU, Y(top0.y), 6 * k), fB = runAround(profU, Y(bot.y + bot.h), 6 * k);
        // band: differential run searched from the cell edge INWARD
        const bT = runAround(diff, Y(mcel.y) + 3 * k, 6 * k), bB = runAround(diff, Y(mcel.y + mcel.h) - 3 * k, 6 * k);
        const uT = runAround(profF, Y(mcel.y) + 3 * k, 6 * k), uB = runAround(profF, Y(mcel.y + mcel.h) - 3 * k, 6 * k);
        const gT = runAround(profU, Y(mcel.y), 4 * k), gB = runAround(profU, Y(mcel.y + mcel.h), 4 * k);
        rows.push({ fT, fB, bT, bB, uT, uB, gT, gB });
      }
      const pick = (f: (r: any) => number | undefined) => { const v = rows.map(f).filter((x): x is number => typeof x === "number" && isFinite(x)); return v.length ? r3(med(v) / k) : null; };
      const frameW = pick((r) => r.fT && r.fB ? (r.fT.wsub + r.fB.wsub) / 2 : undefined);
      const bandW = pick((r) => r.bT && r.bB ? (r.bT.wsub + r.bB.wsub) / 2 : undefined);
      const unionW = pick((r) => r.uT && r.uB ? (r.uT.wsub + r.uB.wsub) / 2 : undefined);
      const paperOut = pick((r) => r.bT && r.gT && r.bB && r.gB ? (Math.max(0, r.bT.a - r.gT.b - 1) + Math.max(0, r.gB.a - r.bB.b - 1)) / 2 : undefined);
      const frameM = pick((r) => r.fT && r.fB ? (r.fT.mass + r.fB.mass) / 2 : undefined);
      const bandM = pick((r) => r.bT && r.bB ? (r.bT.mass + r.bB.mass) / 2 : undefined);
      // clear window inside the band (center column), and paper between band outer edge and grid line
      // painted AA: typed digit's extreme ink vs paper; given digit likewise
      const extreme = (c: any, im: Img) => { let best = dark ? -1 : 999, bp = [0, 0, 0]; for (let y = Y(c.y + c.h * 0.15); y < Y(c.y + c.h * 0.85); y++) for (let x = X(c.x + c.w * 0.15); x < X(c.x + c.w * 0.85); x++) { const p = px(im, x, y); const l = Lm(p); if (dark ? l > best : l < best) { best = l; bp = p; } } return bp; };
      const yours = extreme(cells[typed], imU);
      const givenIdx = cells.findIndex((c, i) => c.given && Math.floor(i / 9) !== mr);
      const given = extreme(cells[givenIdx], imU);
      // G2 RANK: local thickness t = min(horizontal run, vertical run) of every ink px on the
      // focused board. Classes: band (the focused cell's ring box), JUNCTION (both runs longer
      // than 2x the grid's median line — two lines crossing, where min() reads a crossing as a
      // thick line; NAMED and excluded), and everything else. Rank = band median over the p95
      // of the rest.
      const thr = 0.5;
      const ink = (x: number, y: number) => cov(imF, x, y) >= thr;
      const hr = new Float32Array(imF.w * imF.h), vr = new Float32Array(imF.w * imF.h);
      for (let y = 0; y < imF.h; y++) { let x = 0; while (x < imF.w) { if (!ink(x, y)) { x++; continue; } let e = x; while (e < imF.w && ink(e, y)) e++; for (let i = x; i < e; i++) hr[y * imF.w + i] = e - x; x = e; } }
      for (let x = 0; x < imF.w; x++) { let y = 0; while (y < imF.h) { if (!ink(x, y)) { y++; continue; } let e = y; while (e < imF.h && ink(x, e)) e++; for (let i = y; i < e; i++) vr[i * imF.w + x] = e - y; y = e; } }
      const bx0 = X(mcel.x) - 3 * k, bx1 = X(mcel.x + mcel.w) + 3 * k, by0 = Y(mcel.y) - 3 * k, by1 = Y(mcel.y + mcel.h) + 3 * k;
      const innerF = 0.25;
      const band: number[] = [], rest: number[] = [], lines: number[] = [];
      for (let y = 0; y < imF.h; y++) for (let x = 0; x < imF.w; x++) { const i = y * imF.w + x; if (!hr[i]) continue; const t = Math.min(hr[i], vr[i]); lines.push(t); }
      const lineMed = med(lines);
      let junction = 0;
      for (let y = 0; y < imF.h; y++) for (let x = 0; x < imF.w; x++) {
        const i = y * imF.w + x; if (!hr[i]) continue; const t = Math.min(hr[i], vr[i]) / k;
        const inBand = x >= bx0 && x <= bx1 && y >= by0 && y <= by1 && !(x > X(mcel.x + mcel.w * innerF) && x < X(mcel.x + mcel.w * (1 - innerF)) && y > Y(mcel.y + mcel.h * innerF) && y < Y(mcel.y + mcel.h * (1 - innerF)));
        if (inBand) band.push(t);
        else if (hr[i] > 2 * lineMed && vr[i] > 2 * lineMed) junction++;
        else rest.push(t);
      }
      const pct = (a: number[], p: number) => { const b = [...a].sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.floor((p / 100) * b.length))]; };
      const rank = { bandMed: r3(med(band)), restMed: r3(med(rest)), restP95: r3(pct(rest, 95)), junctionPx: junction, rankMed: r3(med(band) / med(rest)), rankP95: r3(med(band) / pct(rest, 95)) };
      res[arm] = {
        rank,
        asset: asset.split("/").pop(), regimeRead, focusVisible, mid, peer, nonPeer, typed, typedLabel: cells[typed].label.slice(0, 40),
        paper, paperF, wash, washU, bandInk: inkP,
        washStep: r3(cr(wash, paper)), washHue: hue(wash), paperDrift: r3(cr(paperF, paper)),
        g2: { frameW, bandW, paperOut, unionW, ratioW: frameW && bandW ? r3(bandW / frameW) : null, ratioUnion: frameW && unionW ? r3(unionW / frameW) : null, frameM, bandM, ratioM: frameM && bandM ? r3(bandM / frameM) : null, cols: rows.length },
        aa: { yours, given, yoursOnPaper: r3(cr(yours, paper)), givenOnPaper: r3(cr(given, paper)), bandOnPaper: r3(cr(inkP, paper)), givenOverYours: r3(cr(given, yours)), yoursHue: hue(yours) },
      };
      await ctx.close();
    }
    const piOf = (t: Record<string, string>, c: Record<string, string>) => {
    const both = Object.keys(t).filter((p) => p in c);
    const diffs = both.filter((p) => t[p] !== c[p]).map((p) => {
      const a = t[p].split(";"), bb = c[p].split(";");
      return { p: p.slice(-90), cls: t[p].split(" | ")[0], d: a.map((v, i) => (v !== bb[i] ? `${bb[i]} -> ${v}` : "")).filter(Boolean).join(" ; ") };
    });
    return { treeNodes: Object.keys(t).length, controlNodes: Object.keys(c).length, onlyTree: Object.keys(t).filter((p) => !(p in c)).length, onlyControl: Object.keys(c).filter((p) => !(p in t)).length, differing: diffs.length, diffs: diffs.slice(0, 400) };
    };
    res.pi = { load: piOf(census.tree, census.control), focus: piOf(census["tree@focus"], census["control@focus"]) };
    res.piNoise = { load: piOf(census.control2, census.control), focus: piOf(census["control2@focus"], census["control@focus"]) };
    writeFileSync(`${S}/${engine}-${regime}.json`, JSON.stringify(res, null, 1));
  });
}
