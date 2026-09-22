import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
// PLR-PLACE pass-4 CRITIC probe (scratch; deleted before return; banked under pass4/critique/PLR-PLACE/instruments).
const PROTO = process.env.CRIT_PROTO ?? "http://127.0.0.1:4246";
const HEAD = process.env.CRIT_HEAD ?? "http://127.0.0.1:4247";
const Q = "difficulty=EASY&wire=local";
const log = (tag: string, name: string, o: unknown) => console.log(`CRIT|${name}|${tag}|${JSON.stringify(o)}`);
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) { await page.locator(".drawer-tab").first().click(); await expect(verb).toBeVisible(); await page.waitForTimeout(750); }
  await verb.click();
  await expect.poll(() => page.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await page.locator(".drawer-tab").first().click(); await expect(page.locator("#controls-drawer .drawer-case")).toBeHidden(); await page.waitForTimeout(750); }
  return page.url();
}
async function table(ctx: BrowserContext, n: number, base = PROTO): Promise<Page[]> {
  const a = await ctx.newPage();
  await a.goto(`${base}/?size=3&${Q}`);
  await settled(a);
  const link = await invite(a);
  const pages = [a];
  for (let i = 1; i < n; i++) { const p = await ctx.newPage(); await p.goto(link); await settled(p); pages.push(p); }
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(n);
  return pages;
}
const cell = (p: Page, i: number) => p.locator(".sudoku-cell input").nth(i);
const mark = (p: Page) => p.locator("[data-player-mark]:visible");
const dots = (p: Page) => p.evaluate(() => [...document.querySelectorAll("[data-lobby].is-open .chart-dot")].map((d) => `${(+d.getAttribute("cx")!).toFixed(1)},${(+d.getAttribute("cy")!).toFixed(1)}`));
const C20 = "277.8,277.8", C60 = "722.2,722.2";

// H · THE HOSTAGE: one peer's settle timer restarted by ANOTHER party's move.
for (const walker of ["none", "peerB", "selfA"] as const) {
  test(`H hostage walker=${walker}`, async ({ browser }, info) => {
    test.slow();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const [a, b, c] = await table(ctx, 3);
    await b.bringToFront(); await cell(b, 0).click();
    await c.bringToFront(); await cell(c, 20).click();
    await a.bringToFront(); await cell(a, 40).click(); await a.waitForTimeout(1500);
    await mark(a).click(); await a.waitForTimeout(400);
    const expanded = await mark(a).getAttribute("aria-expanded");
    const at0 = await dots(a);
    await c.bringToFront(); await cell(c, 60).click();
    const t0 = Date.now();
    const walkPage = walker === "peerB" ? b : a;
    await walkPage.bringToFront();
    const series: string[] = [];
    for (let i = 0; i < 16; i++) {
      if (walker !== "none") await walkPage.keyboard.press(i % 8 < 4 ? "ArrowRight" : "ArrowLeft");
      await walkPage.waitForTimeout(250);
      if (i % 2 === 1) { const d = await dots(a); series.push(`${Date.now() - t0}:${d.includes(C60) ? "60" : d.includes(C20) ? "20" : "?"}`); }
    }
    const walkEnd = Date.now() - t0;
    await a.waitForTimeout(1100);
    const after = await dots(a);
    const stillOpen = await mark(a).getAttribute("aria-expanded");
    log("H", info.project.name, { walker, expanded, at0, series, walkEnd, cAfter: after.includes(C60) ? "60" : "not60", stillOpen });
    await ctx.close();
  });
}

// CL · the CLOSE: does the chart leave before the sheet's fade?
for (const how of ["escape", "markClick"] as const) {
  test(`CL close ${how}`, async ({ browser }, info) => {
    test.slow();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const [a, b] = await table(ctx, 2);
    await b.bringToFront(); await cell(b, 30).click();
    await a.bringToFront(); await a.waitForTimeout(1200);
    await mark(a).click(); await a.waitForTimeout(500);
    await a.evaluate(() => {
      const w = window as any; w.__fr = [];
      const s = document.querySelector("[data-lobby].is-open") as HTMLElement;
      const t0 = performance.now();
      const tick = () => {
        const cs = getComputedStyle(s);
        w.__fr.push({ t: +(performance.now() - t0).toFixed(0), open: s.classList.contains("is-open"), h: +s.getBoundingClientRect().height.toFixed(2), op: +(+cs.opacity).toFixed(3), vis: cs.visibility[0], chart: !!s.querySelector(".place-chart") });
        if (performance.now() - t0 < 300) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await a.waitForTimeout(40);
    if (how === "escape") await a.keyboard.press("Escape"); else await mark(a).click();
    await a.waitForTimeout(500);
    const fr = await a.evaluate(() => (window as any).__fr as any[]);
    const firstShut = fr.findIndex((f) => !f.open);
    log("CL", info.project.name, { how, lastOpen: fr[firstShut - 1], firstShut: fr[firstShut], visibleShutFramesWithoutChart: fr.filter((f) => !f.open && f.op > 0 && !f.chart).length, visibleShutFramesWithChart: fr.filter((f) => !f.open && f.op > 0 && f.chart).length });
    await ctx.close();
  });
}

// K4 · the kill condition, 390x664 coarse, two at the table, regime witnessed.
test("K4 lap 390x664", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const [a, b] = await table(ctx, 2);
  const coarse = await Promise.all([a, b].map((p) => p.evaluate(() => matchMedia("(pointer: coarse)").matches)));
  await b.bringToFront(); await cell(b, 30).tap(); await b.waitForTimeout(300);
  await a.bringToFront(); await a.waitForTimeout(1200);
  await mark(a).tap(); await a.waitForTimeout(600);
  const g = await a.evaluate(() => {
    const sh = document.querySelector("[data-lobby].is-open")!.getBoundingClientRect();
    const top = Math.min(...[...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect().top));
    const ch = document.querySelector("[data-lobby].is-open .place-chart")?.getBoundingClientRect();
    return { sheetTop: +sh.top.toFixed(2), H: +sh.height.toFixed(2), gridTop: +top.toFixed(2), lap: +Math.max(0, sh.bottom - top).toFixed(2), chartH: ch ? +ch.height.toFixed(2) : null };
  });
  // the dismissing tap at the lap's centre
  const x = 100, y = Math.round((g.gridTop + g.sheetTop + g.H) / 2);
  const owner = await a.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e?.closest("[data-lobby]") ? "sheet" : e?.tagName + "." + (e as HTMLElement)?.className; }, [x, y]);
  const before = await a.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value).join(""));
  await a.touchscreen.tap(x, y); await a.waitForTimeout(400);
  const afterTap = await a.evaluate(() => ({ exp: document.querySelector("[data-player-mark]:not([aria-expanded='false'])") !== null, active: document.activeElement?.tagName + "." + (document.activeElement as HTMLElement)?.className?.toString().slice(0, 40) }));
  const valuesSame = before === (await a.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value).join("")));
  log("K4", info.project.name, { coarse, ...g, owner, afterTap, valuesSame });
  await ctx.close();
});

// K2 · tapped open (phone): your ring on YOUR chart vs the room's dot for you.
test("K2 tapped open", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const [a, b] = await table(ctx, 2);
  const coarse = await Promise.all([a, b].map((p) => p.evaluate(() => matchMedia("(pointer: coarse)").matches)));
  await b.bringToFront(); await cell(b, 10).tap(); await b.waitForTimeout(300);
  await a.bringToFront(); await cell(a, 40).tap(); await a.waitForTimeout(1200);
  await b.bringToFront(); await mark(b).tap(); await b.waitForTimeout(500);
  const bBefore = (await dots(b)).length;
  await b.touchscreen.tap(380, 830); await b.waitForTimeout(400);
  await a.bringToFront(); await mark(a).tap(); await a.waitForTimeout(1200);
  const aView = await a.evaluate(() => ({ expanded: document.querySelector("[data-player-mark]:not([aria-expanded='false'])") !== null, ring: document.querySelectorAll("[data-lobby].is-open .chart-self").length }));
  await b.bringToFront(); await mark(b).tap(); await b.waitForTimeout(500);
  const bAfter = (await dots(b)).length;
  log("K2", info.project.name, { coarse, bSeesABefore: bBefore, aOwnView: aView, bSeesAAfterATappedOpen: bAfter });
  await ctx.close();
});

// PI · paint+tag census, SOLO, one product-minted encoded board. Pairs: dist-vs-HEAD, dev-vs-HEAD, HEAD-vs-HEAD.
const KEYS = [".page-root", ".board-wrapper", ".controls-card", ".action-bar", ".corner-left", ".corner-right", ".mobile-attribution", ".masthead", ".drawer-tab", ".tray-well", ".sudoku-cell", ".attribution-trigger", ".zone-row-label", ".players-well", ".players-roster", ".handwritten-logo"];
async function census(browser: Browser, base: string, board: string, r: { w: number; h: number; coarse: boolean }) {
  const ctx = await browser.newContext({ viewport: { width: r.w, height: r.h }, hasTouch: r.coarse, isMobile: r.coarse, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`${base}/?board=${board}&wire=local`);
  await settled(p); await p.waitForTimeout(1500);
  const o = await p.evaluate((keys) => {
    const o: Record<string, unknown> = { coarse: matchMedia("(pointer: coarse)").matches, cells: [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""), asset: [...document.scripts].map((s) => s.src).find((s) => /index-|main\.ts/.test(s)) ?? "" };
    for (const k of keys) {
      const all = [...document.querySelectorAll(k)].filter((e) => e.getBoundingClientRect().width > 0) as HTMLElement[];
      o[k] = all.map((el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return [el.tagName, [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)).join(","), cs.color, cs.backgroundColor, cs.fontFamily.slice(0, 20), cs.fontSize, cs.lineHeight, cs.fontWeight, cs.display, cs.opacity].join(" / "); }).join(" ## ");
    }
    return o;
  }, KEYS);
  await ctx.close();
  return o;
}
test("PI census", async ({ browser }, info) => {
  test.setTimeout(420000);
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(`${PROTO}/?size=3&${Q}`); await settled(a);
  const board = new URL(await invite(a)).searchParams.get("board")!;
  await ctx.close();
  const DIST = process.env.CRIT_DIST ?? "http://127.0.0.1:4248";
  for (const r of [{ w: 390, h: 844, coarse: true }, { w: 1280, h: 800, coarse: false }]) {
    const hd = await census(browser, HEAD, board, r);
    for (const [arm, base] of [["dist", DIST], ["dev", PROTO], ["headhead", HEAD]] as const) {
      const pr = await census(browser, base, board, r);
      const diffs: string[] = [];
      for (const k of Object.keys(pr)) { if (k === "asset") continue; if (JSON.stringify(pr[k]) !== JSON.stringify(hd[k])) diffs.push(`${k}: ${String(hd[k]).slice(0, 220)} -> ${String(pr[k]).slice(0, 220)}`); }
      log("PI", info.project.name, { arm, regime: `${r.w}x${r.h}${r.coarse ? "c" : "f"}`, board, sameBoard: pr.cells === hd.cells, coarse: [pr.coarse, hd.coarse], assets: [String(pr.asset).split("/").pop(), String(hd.asset).split("/").pop()], nDiff: diffs.length, diffs });
    }
  }
});
