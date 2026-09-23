/** PLR-COUNT pass-5 CRITIC — the head subtree π, keyed by SEMANTIC ancestry (wrappers the leader added are transparent). */
import { test, expect, type Browser, type Page, type BrowserContextOptions } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
const OUT = process.env.OUT!;
mkdirSync(OUT, { recursive: true });
const CD = "http://127.0.0.1:4237", PD = "http://127.0.0.1:4239";
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
const givens = (page: Page) => page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => /given clue (\d)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? "0").join(""));
async function mint(browser: Browser) {
  const ctx = await browser.newContext(); const page = await ctx.newPage();
  await page.goto(`${CD}/?size=3&difficulty=EASY`); await settled(page);
  const cells = await givens(page); await ctx.close();
  return { cells, payload: Buffer.from("\x01" + "3." + cells, "binary").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") };
}
const SEM = ["corner-left", "mobile-attribution", "attribution-trigger", "hover-card", "crayon-heart", "eyes", "blush-mark", "corner-right", "handwritten-logo", "masthead"];
const PROPS = ["display","visibility","opacity","color","backgroundColor","borderTopWidth","borderTopStyle","borderTopColor","borderLeftWidth","borderRadius","outlineStyle","fontFamily","fontSize","fontWeight","lineHeight","filter","boxShadow","paddingTop","paddingLeft","paddingBottom","transform","fill","stroke","strokeWidth","textDecorationLine"];
const census = (page: Page) => page.evaluate(({ SEM, PROPS }) => {
  const roots = [...document.querySelectorAll(".corner-left, .mobile-attribution")];
  const out: Record<string, any> = {}; const seen = new Map<string, number>();
  const semOf = (e: Element) => SEM.find((c) => e.classList.contains(c));
  for (const root of roots) for (const el of [root, ...root.querySelectorAll("*")]) {
    if (el.closest("[data-player-mark],[data-lobby],.head-sheet-edge")) continue;
    const s = semOf(el);
    if (!s && el.tagName === "DIV" && el.children.length && !el.textContent?.trim()) continue; // bare wrapper
    const chain: string[] = []; let n: Element | null = el.parentElement;
    while (n && n !== document.body) { const t = semOf(n); if (t) chain.unshift(t); n = n.parentElement; }
    const base = chain.join(">") + ">" + el.tagName.toLowerCase() + (s ? "." + s : "");
    const k = seen.get(base) ?? 0; seen.set(base, k + 1);
    const b = el.getBoundingClientRect(); const cs = getComputedStyle(el) as any;
    const rec: any = { tag: el.tagName, rect: [b.x, b.y, b.width, b.height].map((v) => Math.round(v * 2) / 2) };
    for (const p of PROPS) rec[p] = cs[p];
    out[`${base}#${k}`] = rec;
  }
  return out;
}, { SEM, PROPS });
function diff(a: any, b: any) {
  const rows: string[] = [];
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[k], y = b[k];
    if (!x || !y) { rows.push(`${x ? "ONLY-CONTROL" : "ONLY-PROTO"} ${k}`); continue; }
    for (const p of Object.keys(x)) { const vx = JSON.stringify(x[p]), vy = JSON.stringify(y[p]); if (vx !== vy) rows.push(`${k} :: ${p} ${vx} -> ${vy}`); }
  }
  return rows;
}
const CELLS: { name: string; opts: BrowserContextOptions }[] = [
  { name: "desk", opts: { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 } },
  { name: "phone", opts: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true } },
];
for (const cell of CELLS) for (const scheme of ["light", "dark"] as const)
  test(`head-pi ${cell.name} ${scheme}`, async ({ browser, browserName }) => {
    test.setTimeout(240000);
    const { payload, cells } = await mint(browser);
    const read = async (base: string, open: boolean) => {
      const ctx = await browser.newContext({ ...cell.opts, colorScheme: scheme, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      await page.goto(`${base}/?size=3&difficulty=EASY&board=${payload}`); await settled(page);
      const g = await givens(page);
      await page.mouse.move(5, 790).catch(() => {});
      let cardOpacity = null as null | string;
      if (open) {
        const t = page.locator(".attribution-trigger:visible").first();
        if (cell.name === "phone") await t.dispatchEvent("click"); else await t.hover();
        const card = page.locator(".hover-card:visible").first();
        await expect.poll(() => card.evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
        cardOpacity = await card.evaluate((e) => getComputedStyle(e).opacity);
      }
      await page.waitForTimeout(500);
      const c = await census(page); await ctx.close();
      return { g, c, cardOpacity };
    };
    const res: any = { payload };
    for (const open of [false, true]) {
      const c1 = await read(CD, open), c2 = await read(CD, open), p = await read(PD, open);
      res[`givens-${open}`] = [c1.g === cells, c2.g === cells, p.g === cells];
      res[`card-${open}`] = [c1.cardOpacity, p.cardOpacity];
      res[`n-${open}`] = [Object.keys(c1.c).length, Object.keys(p.c).length];
      res[`noise-${open}`] = diff(c1.c, c2.c);
      res[`proto-${open}`] = diff(c1.c, p.c);
    }
    writeFileSync(`${OUT}/headpi-${cell.name}-${scheme}-${browserName}.json`, JSON.stringify(res, null, 1));
  });
