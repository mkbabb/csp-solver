import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
const PROTO = process.env.CRIT_PROTO ?? "http://127.0.0.1:4243";
const HEAD = "http://127.0.0.1:4244";
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
const dotAt = (p: Page) =>
  p.evaluate(() => Object.fromEntries([...document.querySelectorAll("[data-lobby].is-open .chart-dot")].map((d) => [d.getAttribute("data-peer"), `${(+d.getAttribute("cx")!).toFixed(1)},${(+d.getAttribute("cy")!).toFixed(1)}`])));
const selfId = (p: Page) => p.evaluate(() => sessionStorage.getItem("peer-id") ?? null);

// K1 · HOSTAGE: does one peer's walking hold another peer's settled dot back?
for (const walking of [false, true]) {
  test(`K1 hostage · B ${walking ? "walks" : "still"}`, async ({ browser }, info) => {
    test.slow();
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const [a, b, c] = await table(ctx, 3);
    await b.bringToFront(); await cell(b, 0).click();
    await c.bringToFront(); await cell(c, 20).click();
    await a.bringToFront(); await a.waitForTimeout(1500);
    await mark(a).click(); await a.waitForTimeout(400);
    const at0 = await dotAt(a);
    // C moves ONCE to cell 60 and then sits still
    await c.bringToFront(); await cell(c, 60).click();
    const tMove = Date.now();
    // B walks (a keyboard step every 250 ms) or sits
    const samples: { t: number; dots: Record<string, string> }[] = [];
    await b.bringToFront();
    for (let i = 0; i < 14; i++) {
      if (walking) await b.keyboard.press(i % 16 < 8 ? "ArrowRight" : "ArrowDown");
      await b.waitForTimeout(250);
      if (i % 2 === 1) samples.push({ t: Date.now() - tMove, dots: await dotAt(a) });
    }
    await b.waitForTimeout(1200);
    const after = await dotAt(a);
    const cMoved = samples.map((s) => ({ t: s.t, changedFromOpen: JSON.stringify(Object.values(s.dots).sort()) !== JSON.stringify(Object.values(at0).sort()) }));
    // which dot is C's: the one at (20) at open -> col 2 row 2 -> (277.8,277.8)
    const cAt20 = "277.8,277.8", cAt60 = "722.2,722.2";
    const cSeries = samples.map((s) => ({ t: s.t, c: Object.values(s.dots).includes(cAt60) ? "60" : Object.values(s.dots).includes(cAt20) ? "20" : "?" }));
    log("K1", info.project.name, { walking, at0, cSeries, after: Object.values(after), cMoved: cMoved.length });
    await ctx.close();
  });
}

// K2 · the TAPPED open on a phone: your own chart vs the room's chart
test("K2 tapped open: your ring vs the room's dot for you", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const [a, b] = await table(ctx, 2);
  for (const p of [a, b]) expect(await p.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
  await b.bringToFront(); await cell(b, 10).tap(); await b.waitForTimeout(300);
  await a.bringToFront(); await cell(a, 40).tap(); await a.waitForTimeout(1200);
  // B opens first (tap) and sees A
  await b.bringToFront(); await mark(b).tap(); await b.waitForTimeout(500);
  const bSeesBefore = Object.keys(await dotAt(b)).length;
  await b.touchscreen.tap(380, 830); await b.waitForTimeout(400);
  // A taps its own mark
  await a.bringToFront(); await mark(a).tap(); await a.waitForTimeout(1200);
  const aView = await a.evaluate(() => ({
    expanded: document.querySelector("[data-player-mark]:not([aria-expanded='false'])") !== null,
    ring: document.querySelectorAll("[data-lobby].is-open .chart-self").length,
    active: document.activeElement?.tagName + "." + (document.activeElement as HTMLElement)?.className,
  }));
  await b.bringToFront(); await mark(b).tap(); await b.waitForTimeout(500);
  const bSeesAfter = Object.keys(await dotAt(b)).length;
  log("K2", info.project.name, { bSeesAFirst: bSeesBefore, aOwnView: aView, bSeesAAfterATappedOpen: bSeesAfter });
  await ctx.close();
});

// K3 · cold open + self-row query, re-measured at four
test("K3 cold open and own-row query at four", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const [a, ...peers] = await table(ctx, 4);
  for (const [i, p] of peers.entries()) { await p.bringToFront(); await cell(p, 12 + 20 * i).click(); }
  await a.bringToFront(); await cell(a, 40).click(); await a.waitForTimeout(2000);
  await a.evaluate(() => {
    const w = window as any; w.__press = 0; w.__first = 0; w.__n = 0;
    const m = [...document.querySelectorAll("[data-player-mark]")].find((e) => (e as HTMLElement).getBoundingClientRect().width > 0)!;
    m.addEventListener("click", () => (w.__press = performance.now()), { capture: true });
    const probe = () => { const n = document.querySelectorAll("[data-lobby].is-open .chart-dot").length; if (w.__press && n) { w.__first = performance.now(); w.__n = n; return; } requestAnimationFrame(probe); };
    requestAnimationFrame(probe);
  });
  await mark(a).click();
  await expect.poll(() => a.evaluate(() => (window as any).__first)).toBeGreaterThan(0);
  const cold = await a.evaluate(() => ({ ms: +((window as any).__first - (window as any).__press).toFixed(1), n: (window as any).__n }));
  await a.waitForTimeout(400);
  const rows = a.locator("[data-lobby]:visible .pl-row");
  const op = () => a.evaluate(() => [...document.querySelectorAll("[data-lobby].is-open .chart-dot")].map((d) => getComputedStyle(d).opacity));
  const before = await op();
  await rows.nth(2).hover(); const onPeer = await op();
  await rows.nth(0).hover(); const onSelf = await op();
  const ring = await a.evaluate(() => { const r = document.querySelector("[data-lobby].is-open .chart-self"); return r ? getComputedStyle(r).opacity : null; });
  const firstLine = await a.evaluate(() => { const s = document.querySelector("[data-lobby].is-open")!; return { first: s.firstElementChild?.tagName + "." + s.firstElementChild?.getAttribute("class"), stateLines: s.querySelectorAll(".pl-state").length }; });
  log("K3", info.project.name, { cold, before, onPeer, onSelf, ring, firstLine, label: await mark(a).getAttribute("aria-label") });
  await ctx.close();
});

// K4 · the kill condition: lap at 390x664 coarse, two at the table (witnessed regime)
test("K4 lap 390x664 coarse two", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const [a, b] = await table(ctx, 2);
  const coarse = await Promise.all([a, b].map((p) => p.evaluate(() => matchMedia("(pointer: coarse)").matches)));
  await b.bringToFront(); await cell(b, 30).tap(); await b.waitForTimeout(300);
  await a.bringToFront(); await a.waitForTimeout(1200);
  await mark(a).tap(); await a.waitForTimeout(500);
  const g = await a.evaluate(() => {
    const sh = document.querySelector("[data-lobby].is-open")!.getBoundingClientRect();
    const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect());
    const top = Math.min(...cells.map((c) => c.top));
    const ch = document.querySelector("[data-lobby].is-open .place-chart")?.getBoundingClientRect();
    return { sheetTop: +sh.top.toFixed(2), H: +sh.height.toFixed(2), gridTop: +top.toFixed(2), lap: +Math.max(0, sh.bottom - top).toFixed(2), chartH: ch ? +ch.height.toFixed(2) : null };
  });
  log("K4", info.project.name, { coarse, ...g });
  await ctx.close();
});

// K5 · pi vs HEAD 74a2b5d9, solo, one encoded board, paint + tag
const KEYS = [".page-root", ".board-wrapper", ".controls-card", ".action-bar", ".corner-left", ".corner-right", ".mobile-attribution", ".masthead", ".drawer-tab", ".tray-well", ".sudoku-cell", ".attribution-trigger", ".zone-row-label", ".players-leave"];
async function census(browser: Browser, base: string, board: string, r: { w: number; h: number; coarse: boolean }) {
  const ctx = await browser.newContext({ viewport: { width: r.w, height: r.h }, hasTouch: r.coarse, isMobile: r.coarse, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto(`${base}/?board=${board}&wire=local`);
  await settled(p); await p.waitForTimeout(1500);
  const o = await p.evaluate((keys) => {
    const o: Record<string, unknown> = { coarse: matchMedia("(pointer: coarse)").matches, cells: [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""), asset: [...document.scripts].map((s) => s.src).find((s) => /index-|main\.ts/.test(s)) ?? "", captions: [...document.querySelectorAll(".zone-row-label")].map((e) => e.textContent?.trim()).join("|") };
    for (const k of keys) {
      const all = [...document.querySelectorAll(k)].filter((e) => e.getBoundingClientRect().width > 0) as HTMLElement[];
      o[k] = all.map((el) => { const b = el.getBoundingClientRect(); const cs = getComputedStyle(el); return [el.tagName, [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)).join(","), cs.color, cs.backgroundColor, cs.fontFamily.slice(0, 20), cs.fontSize, cs.lineHeight, cs.fontWeight, cs.display].join(" / "); }).join(" ## ");
    }
    return o;
  }, KEYS);
  await ctx.close();
  return o;
}
test("K5 pi vs 74a2b5d9", async ({ browser }, info) => {
  test.setTimeout(300000);
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(`${PROTO}/?size=3&${Q}`); await settled(a);
  const board = new URL(await invite(a)).searchParams.get("board")!;
  await ctx.close();
  for (const r of [{ w: 390, h: 844, coarse: true }, { w: 1280, h: 800, coarse: false }]) {
    const pr = await census(browser, PROTO, board, r);
    const hd = await census(browser, HEAD, board, r);
    const diffs: string[] = [];
    for (const k of Object.keys(pr)) { if (k === "asset") continue; if (JSON.stringify(pr[k]) !== JSON.stringify(hd[k])) diffs.push(`${k}: ${hd[k]} -> ${pr[k]}`); }
    log("K5", info.project.name, { regime: `${r.w}x${r.h}${r.coarse ? "c" : "f"}`, boardLen: board.length, sameBoard: pr.cells === hd.cells, coarse: [pr.coarse, hd.coarse], headAsset: hd.asset, nDiff: diffs.length, diffs });
  }
});

// K2k · the KEYBOARD open (focus moves cell -> mark, Enter): your ring vs the room's dot for you
test("K2k keyboard open: your ring vs the room's dot for you", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const [a, b] = await table(ctx, 2);
  await a.bringToFront(); await cell(a, 40).click(); await a.waitForTimeout(1200);
  await b.bringToFront(); await mark(b).click(); await b.waitForTimeout(500);
  const bFirst = Object.keys(await dotAt(b)).length;
  await b.keyboard.press("Escape"); await b.waitForTimeout(300);
  await a.bringToFront();
  await mark(a).focus(); await a.keyboard.press("Enter"); await a.waitForTimeout(1200);
  const aView = await a.evaluate(() => ({ expanded: document.querySelector("[data-player-mark]:not([aria-expanded='false'])") !== null, ring: document.querySelectorAll("[data-lobby].is-open .chart-self").length }));
  await b.bringToFront(); await mark(b).click(); await b.waitForTimeout(500);
  const bAfter = Object.keys(await dotAt(b)).length;
  log("K2k", info.project.name, { bSeesAFirst: bFirst, aOwnView: aView, bSeesAAfterKeyboardOpen: bAfter });
  await ctx.close();
});
