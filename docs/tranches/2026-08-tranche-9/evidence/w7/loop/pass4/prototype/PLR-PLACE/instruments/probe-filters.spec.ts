import { test, expect, type Page } from "@playwright/test";
// PLR-PLACE pass 4 · the live-filter population on the BUILT dist through three poses (shut ·
// open solo · open live with a dot drawn), two regimes, reduce and not. The estate's counting
// rule (filter-census.spec.ts): an element counts when its own computed `filter` is not `none`
// and its own `display` is not `none`. The `<filter>` element count is read beside it.
const count = (p: Page) => p.evaluate(() => ({
  live: [...document.querySelectorAll("*")].filter((e) => { const cs = getComputedStyle(e); return cs.filter !== "none" && cs.display !== "none"; }).length,
  filterEls: document.querySelectorAll("filter").length,
}));
async function settled(p: Page) { await p.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 }); await p.waitForTimeout(1500); }
for (const reduce of [false, true]) for (const coarse of [false, true]) {
  test(`poses ${coarse ? "coarse 390x844" : "fine 1280x800"}${reduce ? " reduce" : ""}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: coarse ? { width: 390, height: 844 } : { width: 1280, height: 800 }, hasTouch: coarse, isMobile: coarse });
    const a = await ctx.newPage();
    if (reduce) await a.emulateMedia({ reducedMotion: "reduce" });
    await a.goto("./?size=3&difficulty=EASY&wire=local"); await settled(a);
    const asset = await a.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s)) ?? "");
    const shut = await count(a);
    const m = a.locator("[data-player-mark]:visible");
    if (coarse) await m.tap(); else await m.click();
    await a.waitForTimeout(500);
    const openSolo = await count(a);
    if (coarse) await a.touchscreen.tap(380, 830); else await a.keyboard.press("Escape");
    await a.waitForTimeout(400);
    const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
    const docked = !(await verb.isVisible());
    if (docked) { await a.locator(".drawer-tab").first().click(); await a.waitForTimeout(700); }
    await verb.click();
    if (docked) { await a.locator(".drawer-tab").first().click(); await expect(a.locator("#controls-drawer .drawer-case")).toBeHidden(); await a.waitForTimeout(700); }
    const b = await ctx.newPage(); if (reduce) await b.emulateMedia({ reducedMotion: "reduce" });
    await b.goto(a.url()); await settled(b);
    const c = b.locator(".sudoku-cell input").nth(30); if (coarse) await c.tap(); else await c.click();
    await a.bringToFront(); await a.waitForTimeout(900);
    if (coarse) await m.tap(); else await m.click();
    await a.waitForTimeout(500);
    const dots = await a.locator("[data-lobby].is-open .chart-dot").count();
    const openLive = await count(a);
    console.log(`PLC|${info.project.name}|${coarse ? "coarse" : "fine"}${reduce ? "|reduce" : ""}|${asset.split("/").pop()}|${JSON.stringify({ shut, openSolo, openLive, dots })}`);
    expect(dots).toBe(1);
    expect(openLive.live).toBe(shut.live);
    await ctx.close();
  });
}
