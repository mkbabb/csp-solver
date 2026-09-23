/** CRITIC k1 — the band regime's cliffs and what the sheet covers, 7 at the table, dev. */
import { test, expect, type Page } from "@playwright/test";
const BASE = "http://127.0.0.1:4246/?size=3&difficulty=EASY&wire=local";
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol();
  await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true);
}
async function room(page: Page, peers: number) {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  let docked = false;
  if (!(await verb.isVisible())) { docked = true; await page.locator(".drawer-tab").first().click(); await stable(() => verb.evaluate((e) => e.getBoundingClientRect().top)); }
  await verb.click();
  await expect.poll(() => page.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) { await page.locator(".drawer-tab").first().click(); await expect(page.locator("#controls-drawer .drawer-case")).toBeHidden(); }
  await page.evaluate((n) => { const r = new URL(location.href).searchParams.get("s")!; const ch = new BroadcastChannel(`board:${r}`); for (let i = 0; i < n; i++) ch.postMessage({ kind: "hi", data: {}, from: `crit-${i}` }); setTimeout(() => ch.close(), 0); }, peers);
  await expect.poll(() => page.locator(".players-roster .player-row").count(), { timeout: 15000 }).toBe(peers + 1);
}
const CELLS: [number, number, boolean][] = [
  [390, 664, true], [390, 740, true], [390, 799, true], [390, 800, true], [390, 820, true], [390, 844, true],
  [360, 800, true], [430, 800, true], [430, 932, true], [844, 390, true], [812, 375, true], [700, 780, false], [1280, 800, false],
];
for (const [w, h, coarse] of CELLS)
  test(`k1 ${w}x${h} ${coarse ? "coarse" : "fine"}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse });
    const page = await ctx.newPage();
    await page.goto(BASE);
    await settled(page);
    expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(coarse);
    await room(page, 6);
    const m = page.locator("[data-player-mark]:visible");
    if (coarse) await m.tap(); else await m.click();
    const sheet = page.locator("[data-lobby].is-open:visible");
    await expect(sheet).toBeVisible();
    await stable(() => sheet.evaluate((e) => { const r = e.getBoundingClientRect(); return [r.top, r.height, getComputedStyle(e).opacity]; }));
    const r = await sheet.evaluate((el) => {
      const s = el.getBoundingClientRect();
      const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
      const gTop = Math.min(...cells.map((c) => c.top));
      const lapped = cells.filter((c) => c.left < s.right && c.right > s.left && c.top < s.bottom && c.bottom > s.top).length;
      const lapH = (h: number) => cells.filter((c) => c.left < s.right && c.right > s.left && c.top < s.top + h && c.bottom > s.top).length;
      // OCCLUDERS: hide the sheet, walk an 8px grid over its box, name every interactive thing under it.
      const prev = el.style.visibility; el.style.visibility = "hidden";
      const hits = new Map<string, number>();
      for (let y = s.top + 2; y < s.bottom - 1; y += 8) for (let x = s.left + 2; x < s.right - 1; x += 8) {
        if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue;
        const t = document.elementFromPoint(x, y) as HTMLElement | null;
        const i = t?.closest("button, input, a[href], select, textarea, [role=button], [tabindex]:not([tabindex='-1'])") as HTMLElement | null;
        if (!i) continue;
        const k = `${i.tagName.toLowerCase()}.${[...i.classList].slice(0, 2).join(".")}${i.getAttribute("aria-label") ? "[" + i.getAttribute("aria-label")!.slice(0, 24) + "]" : ""}`;
        hits.set(k, (hits.get(k) ?? 0) + 1);
      }
      el.style.visibility = prev;
      const occ: Record<string, number> = {};
      const byKind: Record<string, number> = {};
      for (const [k, n] of hits) { const kind = k.startsWith("input.cell") ? "cell-input" : k; byKind[kind] = (byKind[kind] ?? 0) + n; }
      return { regime: matchMedia("(orientation: portrait) and (max-height: 799px)").matches, pass4: matchMedia("(pointer: coarse) and (max-height: 799px)").matches,
        rows: el.querySelectorAll(".pl-row").length, more: el.querySelector(".pl-more")?.textContent?.trim() ?? "",
        sTop: +s.top.toFixed(1), sBot: +s.bottom.toFixed(1), sRight: +s.right.toFixed(1), gTop: +gTop.toFixed(1), clear: +(gTop - s.bottom).toFixed(1), lapped, lapIf1row: lapH(103.36), lapIf4rows: lapH(170.66), occluded: byKind };
    });
    console.log(`K1 ${info.project.name} ${w}x${h} ${coarse ? "coarse" : "fine"} ${JSON.stringify(r)}`);
    await ctx.close();
  });
