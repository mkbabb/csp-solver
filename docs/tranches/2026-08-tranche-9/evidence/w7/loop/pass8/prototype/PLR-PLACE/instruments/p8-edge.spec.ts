import { test, expect, type Page } from "@playwright/test";
// PLR-PLACE pass 8 · the outside band, traced: which element each event of a tap lands on.
const Q = "difficulty=EASY&wire=local";
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true); }
async function settled(p: Page) { await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0); }
const mark = (p: Page) => p.locator("[data-player-mark]:visible");
const sheet = (p: Page) => p.locator("[data-lobby]:visible");
test("edge trace 390x844 n2", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 390, height: Number(process.env.P8_H ?? 844) }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const a = await ctx.newPage();
  await a.goto(`./?size=3&${Q}`); await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  const docked = !(await verb.isVisible());
  if (docked) { await a.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await verb.click();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); }
  const b = await ctx.newPage(); await b.goto(a.url()); await settled(b);
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(2);
  await a.evaluate(() => {
    const d = (t: EventTarget | null) => { const e = t as Element | null; if (!e || !e.tagName) return String(t); return `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}${e.getAttribute("aria-label") ? "[" + e.getAttribute("aria-label")!.slice(0, 12) + "]" : ""}.${[...e.classList].slice(0, 2).join(".")}`; };
    (window as any).__ev = [];
    for (const k of ["touchstart", "touchend", "pointerdown", "pointerup", "mousedown", "mouseup", "click", "focusin"]) window.addEventListener(k, (e) => (window as any).__ev.push(`${k}@${d(e.target)}${(e as any).defaultPrevented ? "!" : ""}${"clientY" in e ? "y" + Math.round((e as any).clientY * 10) / 10 : (e as any).changedTouches ? "ty" + Math.round((e as any).changedTouches[0].clientY * 10) / 10 : ""}`), true);
  });
  const out: Record<string, unknown> = {};
  for (const dd of (process.env.P8_D ?? "-3,-1,1,2,3,4,6").split(",").map(Number)) {
    await a.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await mark(a).tap();
    await expect(sheet(a)).toBeVisible();
    await expect.poll(() => sheet(a).evaluate((e) => getComputedStyle(e).opacity)).toBe("1");
    await stable(() => sheet(a).evaluate((e) => Math.round(e.getBoundingClientRect().bottom * 10)));
    const bottom = await sheet(a).evaluate((e) => e.getBoundingClientRect().bottom);
    const y = bottom + dd;
    const hit = await a.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join(".")}` : null; }, [60, y]);
    await a.evaluate(() => ((window as any).__ev = []));
    await a.touchscreen.tap(60, y);
    await a.waitForTimeout(500);
    const ev = await a.evaluate(() => (window as any).__ev);
    const exp = await mark(a).getAttribute("aria-expanded");
    const active = await a.evaluate(() => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName);
    out[`d${dd}`] = { bottom: +bottom.toFixed(2), hit, exp, active, ev };
    if (exp === "true") { await mark(a).tap(); await expect(mark(a)).toHaveAttribute("aria-expanded", "false"); }
  }
  console.log(`EDGE|${info.project.name}|${process.env.P8_TAG ?? ""}|${JSON.stringify(out)}`);
  await ctx.close();
});
