/**
 * PLR-PLACE pass 4 · the geometry probe: the lap law at twelve arms (regime witnessed first,
 * dismissal at every lapped arm), the desk gridTop law, π against the HEAD control on a pinned
 * board, the well (G19) and the caption (G9). Summaries only — raw JSON is not banked whole.
 */
import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/PLR-PLACE/logs";
const PROTO = `http://127.0.0.1:${process.env.PLC_PORT ?? "4243"}`;
const HEAD = `http://127.0.0.1:${process.env.PLC_HEAD ?? "4244"}`;
const Q = "difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700);
  }
  await verb.click();
  await expect.poll(() => page.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) {
    await page.locator(".drawer-tab").first().click();
    await expect(page.locator("#controls-drawer .drawer-case")).toBeHidden();
    await page.waitForTimeout(700);
  }
  return page.url();
}
async function table(ctx: BrowserContext, n: number, size: number, base = PROTO) {
  const a = await ctx.newPage();
  await a.goto(`${base}/?size=${size}&${Q}`);
  await settled(a);
  const link = await invite(a);
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    await p.goto(link);
    await settled(p);
    pages.push(p);
  }
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(n);
  return pages;
}
const r2 = (x: number) => +x.toFixed(2);

type Arm = { tag: string; w: number; h: number; coarse: boolean; n: number; size: number };
const ARMS: Arm[] = [
  { tag: "390x844 coarse n2 9x9", w: 390, h: 844, coarse: true, n: 2, size: 3 },
  { tag: "390x844 coarse n5 9x9", w: 390, h: 844, coarse: true, n: 5, size: 3 },
  { tag: "390x844 coarse n6 9x9", w: 390, h: 844, coarse: true, n: 6, size: 3 },
  { tag: "390x664 coarse n2 9x9", w: 390, h: 664, coarse: true, n: 2, size: 3 },
  { tag: "390x664 coarse n6 9x9", w: 390, h: 664, coarse: true, n: 6, size: 3 },
  { tag: "390x844 coarse n5 16x16", w: 390, h: 844, coarse: true, n: 5, size: 4 },
  { tag: "390x844 coarse n2 16x16", w: 390, h: 844, coarse: true, n: 2, size: 4 },
  { tag: "1280x800 fine n2 9x9", w: 1280, h: 800, coarse: false, n: 2, size: 3 },
  { tag: "1280x800 fine n5 9x9", w: 1280, h: 800, coarse: false, n: 5, size: 3 },
  { tag: "1280x800 fine n6 9x9", w: 1280, h: 800, coarse: false, n: 6, size: 3 },
  { tag: "1280x720 fine n2 9x9", w: 1280, h: 720, coarse: false, n: 2, size: 3 },
  { tag: "1280x900 fine n2 9x9", w: 1280, h: 900, coarse: false, n: 2, size: 3 },
  { tag: "1280x1000 fine n2 9x9", w: 1280, h: 1000, coarse: false, n: 2, size: 3 },
  { tag: "1024x800 fine n2 9x9", w: 1024, h: 800, coarse: false, n: 2, size: 3 },
];

async function lapArm(browser: Browser, arm: Arm) {
  const ctx = await browser.newContext({
    viewport: { width: arm.w, height: arm.h },
    hasTouch: arm.coarse,
    isMobile: arm.coarse,
    deviceScaleFactor: 1,
  });
  const pages = await table(ctx, arm.n, arm.size);
  const a = pages[0];
  const witness = await a.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    shortPhone: matchMedia("(pointer: coarse) and (max-height: 799px)").matches,
  }));
  // every peer on a cell, so the chart has its dots
  for (const [i, p] of pages.slice(1).entries()) {
    await p.bringToFront();
    const c = p.locator(".sudoku-cell input").nth(arm.size ** 2 * 2 + 3 * i);
    if (arm.coarse) await c.tap();
    else await c.click();
  }
  await a.bringToFront();
  await a.waitForTimeout(900);
  const m = a.locator("[data-player-mark]:visible");
  if (arm.coarse) await m.tap();
  else await m.click();
  await a.waitForTimeout(500);
  const parts = await a.evaluate(() => {
    const box = document.querySelector("[data-lobby].is-open") as HTMLElement;
    const r = (el: Element | null) => (el ? el.getBoundingClientRect() : null);
    const cells = [...document.querySelectorAll(".sudoku-cell")].map((c) => c.getBoundingClientRect());
    const more = r(box.querySelector(".pl-more"));
    return {
      sheetTop: r(box)!.top,
      sheetH: r(box)!.height,
      sheetRight: r(box)!.right,
      chart: r(box.querySelector(".place-chart"))?.height ?? null,
      state: !!box.querySelector(".pl-state"),
      rows: [...box.querySelectorAll(".pl-row")].map((e) => e.getBoundingClientRect().height),
      moreH: more?.height ?? null,
      gridTop: Math.min(...cells.map((c) => c.top)),
      gridRight: Math.max(...cells.map((c) => c.right)),
      dots: box.querySelectorAll(".chart-dot").length,
    };
  });
  const r = parts.rows.length;
  const mCount = parts.moreH === null ? 0 : 1;
  const predicted = 36 + (parts.chart ?? 0) + 5.6 + 22.4 * r + (mCount ? 1.6 + parts.moreH! : 0);
  const lap = Math.max(0, parts.sheetTop + parts.sheetH - parts.gridTop);
  // THE DISMISSAL at every lapped arm: one press inside the lap shuts the sheet, reaches no cell.
  let dismissal: Record<string, unknown> | null = null;
  if (lap > 0) {
    const x = (0 + Math.min(parts.sheetRight, parts.gridRight)) / 2;
    const y = parts.gridTop + lap / 2;
    const vals = () =>
      a.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value).join("|"));
    const before = await vals();
    const owner = await a.evaluate(
      ([px, py]) => (document.elementFromPoint(px, py)?.closest("[data-lobby]") ? "sheet" : "other"),
      [x, y],
    );
    if (arm.coarse) await a.touchscreen.tap(x, y);
    else await a.mouse.click(x, y);
    await a.waitForTimeout(300);
    dismissal = {
      owner,
      shut: (await m.getAttribute("aria-expanded")) === "false",
      cellFocused: await a.evaluate(() => /^Row \d/.test(document.activeElement?.getAttribute("aria-label") ?? "")),
      valuesUnchanged: (await vals()) === before,
    };
  }
  await ctx.close();
  return {
    witness,
    rows: r,
    more: mCount,
    state: parts.state,
    dots: parts.dots,
    chart: parts.chart === null ? null : r2(parts.chart),
    rowH: [...new Set(parts.rows.map(r2))],
    S: parts.moreH === null ? null : r2(parts.moreH),
    sheetTop: r2(parts.sheetTop),
    H: r2(parts.sheetH),
    Hlaw: r2(predicted),
    delta: r2(parts.sheetH - predicted),
    gridTop: r2(parts.gridTop),
    lap: r2(lap),
    dismissal,
  };
}

test("lap law, twelve arms, dismissal at every lapped arm", async ({ browser }, info) => {
  test.setTimeout(900000);
  const out: Record<string, unknown> = {};
  for (const arm of ARMS.slice(Number(process.env.PLC_FROM ?? 0))) {
    out[arm.tag] = await lapArm(browser, arm);
    console.log(`PLC|${info.project.name}|${arm.tag}|${JSON.stringify(out[arm.tag])}`);
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/lap-${info.project.name}${process.env.PLC_FROM ? '-from' + process.env.PLC_FROM : ''}.json`, JSON.stringify(out, null, 1));
});

// ── π against the HEAD control, SOLO, on ONE encoded board ────────────────────────────────
const KEYS = [
  ".page-root",
  ".board-wrapper",
  ".controls-card",
  ".action-bar",
  ".corner-left",
  ".corner-right",
  ".mobile-attribution",
  ".masthead",
  ".drawer-tab",
  ".tray-well",
  ".sudoku-cell",
];
async function census(browser: Browser, base: string, board: string, regime: { w: number; h: number; coarse: boolean }) {
  const ctx = await browser.newContext({
    viewport: { width: regime.w, height: regime.h },
    hasTouch: regime.coarse,
    isMobile: regime.coarse,
    deviceScaleFactor: 1,
  });
  const p = await ctx.newPage();
  await p.goto(`${base}/?board=${board}&wire=local`);
  await settled(p);
  await p.waitForTimeout(1500);
  const read = await p.evaluate((keys) => {
    const o: Record<string, unknown> = {
      coarse: matchMedia("(pointer: coarse)").matches,
      asset: [...document.scripts].map((s) => s.src).find((s) => /index-|main\.ts/.test(s)) ?? "",
      cells: [...document.querySelectorAll(".sudoku-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""),
    };
    for (const k of keys) {
      const el = [...document.querySelectorAll(k)].find((e) => e.getBoundingClientRect().width > 0) as HTMLElement | undefined;
      if (!el) {
        o[k] = null;
        continue;
      }
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      o[k] = {
        tag: el.tagName,
        box: [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)),
        paint: [cs.color, cs.backgroundColor, cs.fontFamily.slice(0, 24), cs.fontSize, cs.lineHeight, cs.fontWeight].join(" / "),
      };
    }
    return o;
  }, KEYS);
  await ctx.close();
  return read;
}

test("pi vs HEAD 74a2b5d9, solo, pinned board, two regimes", async ({ browser }, info) => {
  test.setTimeout(300000);
  // Mint the pin with the product's own encoder: A's invite writes `?board=` (the share link).
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(`${PROTO}/?size=3&${Q}`);
  await settled(a);
  const board = new URL(await invite(a)).searchParams.get("board")!;
  await ctx.close();
  const out: Record<string, unknown> = { board };
  for (const regime of [
    { w: 390, h: 844, coarse: true },
    { w: 1280, h: 800, coarse: false },
  ]) {
    const proto = await census(browser, PROTO, board, regime);
    const head = await census(browser, HEAD, board, regime);
    const diffs: string[] = [];
    for (const k of Object.keys(proto)) {
      if (k === "asset") continue;
      if (JSON.stringify(proto[k]) !== JSON.stringify(head[k]))
        diffs.push(`${k}: ${JSON.stringify(head[k])} -> ${JSON.stringify(proto[k])}`);
    }
    const tag = `${regime.w}x${regime.h} ${regime.coarse ? "coarse" : "fine"}`;
    out[tag] = { sameBoard: proto.cells === head.cells, coarse: [proto.coarse, head.coarse], headAsset: head.asset, diffs };
    console.log(`PLC|${info.project.name}|pi|${tag}|${JSON.stringify(out[tag])}`);
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/pi-${info.project.name}.json`, JSON.stringify(out, null, 1));
});

// ── G19 (the well, live and solo, both trees) and G9 (`your cell` at 390 and 1023) ────────
async function well(page: Page) {
  return page.evaluate(() => {
    const w = [...document.querySelectorAll(".tray-well")].find((e) => e.querySelector(".players-leave, .players-status, .players-roster"));
    return w ? +w.getBoundingClientRect().height.toFixed(2) : null;
  });
}
test("G19 well heights and G9 caption", async ({ browser }, info) => {
  test.setTimeout(300000);
  const out: Record<string, unknown> = {};
  for (const [name, base] of [["proto", PROTO], ["head", HEAD]] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const s = await ctx.newPage();
    await s.goto(`${base}/?size=3&${Q}`);
    await settled(s);
    const solo = await well(s);
    const pages = await table(ctx, 2, 3, base);
    await pages[0].waitForTimeout(600);
    out[`${name} solo / live2`] = [solo, await well(pages[0])];
    await ctx.close();
  }
  for (const v of [
    { w: 390, h: 844, coarse: true },
    { w: 1023, h: 800, coarse: false },
  ]) {
    const ctx = await browser.newContext({ viewport: { width: v.w, height: v.h }, hasTouch: v.coarse, isMobile: v.coarse });
    const [a] = await table(ctx, 2, 3);
    if (!(await a.locator(".controls-card").isVisible())) {
      await a.locator(".drawer-tab").first().click();
      await a.waitForTimeout(800);
    }
    const row = a.locator(".zone-row", { has: a.locator(".zone-row-label", { hasText: "your cell" }) });
    await row.scrollIntoViewIfNeeded();
    await a.waitForTimeout(300);
    out[`G9 ${v.w}`] = await row.evaluate((el) => {
      const lab = el.querySelector(".zone-row-label") as HTMLElement;
      const lh = parseFloat(getComputedStyle(lab).lineHeight);
      const wl = el.closest(".tray-well")!.getBoundingClientRect();
      const btns = [...el.querySelectorAll("button")].map((b) => b.getBoundingClientRect());
      return {
        labelLines: +(lab.getBoundingClientRect().height / lh).toFixed(2),
        rowOverflow: el.scrollWidth - el.clientWidth,
        chipsInsideWell: btns.every((b) => b.left >= wl.left - 0.5 && b.right <= wl.right + 0.5),
        chipH: btns.map((b) => +b.height.toFixed(2)),
        chipW: btns.map((b) => +b.width.toFixed(2)),
      };
    });
    await ctx.close();
  }
  console.log(`PLC|${info.project.name}|well|${JSON.stringify(out)}`);
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/well-${info.project.name}.json`, JSON.stringify(out, null, 1));
});
