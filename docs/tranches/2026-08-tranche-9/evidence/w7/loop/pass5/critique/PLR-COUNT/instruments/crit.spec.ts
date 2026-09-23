/** PLR-COUNT pass-5 CRITIC instruments (independent of the prototype's). Reads, banks JSON to OUT. */
import { test, expect, type Browser, type Page, type BrowserContextOptions } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const OUT = process.env.OUT!;
mkdirSync(OUT, { recursive: true });
const CD = "http://127.0.0.1:4237"; // control dist 74a2b5d9 index-CubiZsMVSwTc.js
const PD = "http://127.0.0.1:4239"; // critic's own build of the work tree, index-CJR4iuiZgxXR.js
const PV = "http://127.0.0.1:4236"; // work tree dev
const CV = "http://127.0.0.1:4238"; // control dev
const bank = (n: string, d: unknown) => writeFileSync(`${OUT}/${n}`, JSON.stringify(d, null, 1));
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
const givens = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => /given clue (\d)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? "0").join(""));
async function mint(browser: Browser): Promise<{ payload: string; cells: string }> {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${CD}/?size=3&difficulty=EASY`);
  await settled(page);
  const cells = await givens(page);
  await ctx.close();
  const b64 = Buffer.from("\x01" + "3." + cells, "binary").toString("base64");
  return { payload: b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), cells };
}
async function waitStill(page: Page) {
  let last = "";
  for (let i = 0; i < 40; i++) {
    const v = await page.evaluate(() => JSON.stringify([...document.querySelectorAll("body *")].slice(0, 400).map((e) => { const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y), Math.round(b.width)]; })));
    if (v === last) return;
    last = v;
    await page.waitForTimeout(250);
  }
}
const PROPS = ["display","visibility","opacity","color","backgroundColor","borderTopWidth","borderTopStyle","borderTopColor","borderLeftWidth","borderBottomWidth","outlineStyle","fontFamily","fontSize","fontWeight","lineHeight","letterSpacing","filter","boxShadow","paddingTop","paddingLeft","transform","fill","stroke","strokeWidth"];
const census = (page: Page) =>
  page.evaluate((props) => {
    const skip = (e: Element) => !!e.closest("[data-player-mark],[data-lobby],.head-sheet-edge");
    const out: Record<string, Record<string, unknown>> = {};
    const seen = new Map<string, number>();
    for (const el of document.querySelectorAll("body *")) {
      if (skip(el)) continue;
      const chain: string[] = [];
      let n: Element | null = el;
      while (n && n !== document.body) {
        const cls = (n.getAttribute("class") ?? "").split(/\s+/).filter((c) => c && !/^is-|^data-v|active|pose/.test(c)).slice(0, 3).join(".");
        chain.unshift(n.tagName.toLowerCase() + (cls ? "." + cls : ""));
        n = n.parentElement;
      }
      const base = chain.join(">");
      const k = seen.get(base) ?? 0;
      seen.set(base, k + 1);
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el) as unknown as Record<string, string>;
      const rec: Record<string, unknown> = { tag: el.tagName, rect: [b.x, b.y, b.width, b.height].map((v) => Math.round(v * 2) / 2) };
      for (const p of props) rec[p] = cs[p];
      out[`${base}#${k}`] = rec;
    }
    return out;
  }, PROPS);
function diff(a: Record<string, any>, b: Record<string, any>) {
  const rows: string[] = [];
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[k], y = b[k];
    if (!x || !y) { rows.push(`${x ? "ONLY-A" : "ONLY-B"} ${k.slice(-140)}`); continue; }
    for (const p of Object.keys(x)) {
      const vx = JSON.stringify(x[p]), vy = JSON.stringify(y[p]);
      if (vx !== vy) rows.push(`${k.slice(-140)} :: ${p} ${vx} -> ${vy}`);
    }
  }
  return rows;
}
type Cell = { name: string; opts: BrowserContextOptions };
const CELLS: Cell[] = [
  { name: "desk", opts: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 } },
  { name: "phone", opts: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true } },
];
for (const cell of CELLS)
  for (const scheme of ["light", "dark"] as const)
    test(`pi-wide ${cell.name} ${scheme}`, async ({ browser, browserName }) => {
      test.setTimeout(240000);
      const { payload, cells } = await mint(browser);
      const read = async (base: string, open: boolean) => {
        const ctx = await browser.newContext({ ...cell.opts, colorScheme: scheme, reducedMotion: "reduce" });
        const page = await ctx.newPage();
        await page.goto(`${base}/?size=3&difficulty=EASY&board=${payload}`);
        await settled(page);
        const g = await givens(page);
        const reg = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, dark: document.documentElement.classList.contains("dark") }));
        await page.mouse.move(5, 790);
        if (open) {
          const t = page.locator(".attribution-trigger:visible").first();
          if (cell.name === "phone") await t.tap(); else await t.click();
          await page.mouse.move(640, 790);
          await page.waitForTimeout(400);
        }
        await waitStill(page);
        const c = await census(page);
        await ctx.close();
        return { g, reg, c };
      };
      const res: Record<string, unknown> = { payload, cellsMatch: {} as Record<string, boolean> };
      for (const open of [false, true]) {
        const c1 = await read(CD, open), c2 = await read(CD, open), p = await read(PD, open);
        (res.cellsMatch as any)[String(open)] = [c1.g === cells, c2.g === cells, p.g === cells];
        res[`regime-${open}`] = [c1.reg, p.reg];
        res[`noise-${open}`] = diff(c1.c, c2.c);
        res[`proto-${open}`] = diff(c1.c, p.c);
        res[`count-${open}`] = [Object.keys(c1.c).length, Object.keys(p.c).length];
      }
      bank(`pi-${cell.name}-${scheme}-${browserName}.json`, res);
      expect((res.cellsMatch as any)["false"]).toEqual([true, true, true]);
    });

// ── Painted AA of the sheet's lines, BOTH themes, core MEDIAN + best pixel + columns ─────────
async function paintedRead(page: Page, png: Buffer, floor: number) {
  return page.evaluate(async ({ b64, floor }) => {
    const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
    const W = bmp.width, H = bmp.height;
    const g = new OffscreenCanvas(W, H).getContext("2d")!;
    g.drawImage(bmp, 0, 0);
    const px = g.getImageData(0, 0, W, H).data;
    const at = (x: number, y: number) => { const i = (y * W + x) * 4; return [px[i], px[i + 1], px[i + 2]]; };
    // ground: modal colour of the outermost 2px RING (not the corners)
    const tally = new Map<string, number>();
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (x > 1 && y > 1 && x < W - 2 && y < H - 2) continue;
      const k = at(x, y).join(","); tally.set(k, (tally.get(k) ?? 0) + 1);
    }
    const ground = [...tally].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
    const lin = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    const lum = (q: number[]) => 0.2126 * lin(q[0]) + 0.7152 * lin(q[1]) + 0.0722 * lin(q[2]);
    const LG = lum(ground);
    const cr = (q: number[]) => { const L = lum(q); const [a, b] = L > LG ? [L, LG] : [LG, L]; return (a + 0.05) / (b + 0.05); };
    const move = (q: number[]) => Math.abs(lum(q) - LG);
    let maxMove = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) maxMove = Math.max(maxMove, move(at(x, y)));
    const core: number[] = [];
    const colPeak: number[] = [], colMass: number[] = [];
    for (let x = 0; x < W; x++) {
      let pk = 1, m = 0;
      for (let y = 0; y < H; y++) { const q = at(x, y); const c = cr(q); if (move(q) >= 0.5 * maxMove) { core.push(c); m++; } pk = Math.max(pk, c); }
      if (m) { colPeak.push(pk); colMass.push(m); }
    }
    core.sort((a, b) => a - b);
    const q = (p: number) => +core[Math.floor(p * (core.length - 1))].toFixed(3);
    const med = [...colMass].sort((a, b) => a - b)[Math.floor(colMass.length / 2)];
    const worst: Record<string, number> = {};
    for (const pct of [50, 70, 90, 100]) {
      const held = colPeak.filter((_, i) => colMass[i] >= (pct / 100) * med);
      worst[pct] = +Math.min(...held).toFixed(3);
    }
    const body = colPeak.filter((_, i) => colMass[i] >= 0.5 * med);
    return { ground, n: core.length, max: q(1), p30: q(0.3), median: q(0.5), fracCoreUnder: +(core.filter((c) => c < floor).length / core.length).toFixed(3), worstCol: worst, fracColsUnder: +(body.filter((c) => c < floor).length / body.length).toFixed(3) };
  }, { b64: png.toString("base64"), floor });
}
for (const scheme of ["light", "dark"] as const)
  test(`sheet-AA ${scheme}`, async ({ browser, browserName }) => {
    test.setTimeout(180000);
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2, colorScheme: scheme, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const room = `crit-aa-${scheme}-${Date.now()}`;
    await page.goto(`${PV}/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await page.evaluate(({ room }) => { const ch = new BroadcastChannel(`board:${room}`); for (let i = 0; i < 15; i++) ch.postMessage({ kind: "hi", data: {}, from: `crit-${i}` }); setTimeout(() => ch.close(), 0); }, { room });
    const mark = page.locator("[data-player-mark]:visible").first();
    await expect.poll(async () => await mark.getAttribute("aria-label")).toBe("16 players");
    await mark.click();
    await page.mouse.move(1270, 710);
    const sheet = page.locator("[data-lobby]:visible").first();
    await expect.poll(() => sheet.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
    await page.waitForTimeout(300);
    const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
    const ground = await sheet.evaluate((e) => getComputedStyle(e).backgroundColor);
    const out: Record<string, unknown> = { dark, ground };
    for (const sel of [".pl-state", ".pl-qual", ".pl-more", ".pl-name"]) {
      const loc = sheet.locator(sel).first();
      out[sel] = { text: await loc.textContent(), ...(await paintedRead(page, await loc.screenshot(), 4.5)) };
    }
    bank(`sheetAA-${scheme}-${browserName}.json`, out);
    await ctx.close();
    expect(dark).toBe(scheme === "dark");
  });

// ── Filters on BUILT dists, both themes, the mark's sheet open vs the control's card state ───
for (const scheme of ["light", "dark"] as const)
  test(`filters ${scheme}`, async ({ browser, browserName }) => {
    const res: Record<string, unknown> = {};
    for (const [arm, base] of [["control", CD], ["proto", PD]] as const) {
      for (const open of [false, true]) {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme });
        const page = await ctx.newPage();
        await page.goto(`${base}/?size=3&difficulty=EASY`);
        await settled(page);
        if (open) {
          const m = page.locator("[data-player-mark]:visible");
          if (await m.count()) { await m.first().click(); await page.mouse.move(640, 790); await page.waitForTimeout(400); }
        }
        await page.waitForTimeout(600);
        res[`${arm}-${open ? "open" : "shut"}`] = await page.evaluate(() => {
          const hits: string[] = [];
          let inMark = 0;
          for (const el of document.querySelectorAll("*")) {
            const cs = getComputedStyle(el);
            if (cs.filter && cs.filter !== "none" && cs.display !== "none") {
              hits.push(`${el.tagName.toLowerCase()}.${(el.getAttribute("class") ?? "").split(/\s+/).slice(0, 2).join(".")} ${cs.filter.slice(0, 40)}`);
              if (el.closest("[data-player-mark],[data-lobby]")) inMark++;
            }
          }
          return { n: hits.length, inMark, hits };
        });
        await ctx.close();
      }
    }
    bank(`filters-${scheme}-${browserName}.json`, res);
  });
