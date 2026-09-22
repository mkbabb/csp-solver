/**
 * PLR-SELF pass 4 — the lap census re-cut (gap 1), the row budget (gap 4), the furniture law,
 * AA from the sheet's own ground, and the two frames. Prototype tree only.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

const SOLO = "/?size=3&difficulty=EASY&wire=local";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/PLR-SELF/frames";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page
    .locator(".sudoku-cell .glyph-svg")
    .first()
    .waitFor({ state: "attached", timeout: 60000 });
  await page.waitForTimeout(400);
}

async function room(page: Page, peers: number) {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  if (!(await verb.isVisible())) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700); // the dock SLIDES
  }
  await verb.click();
  await page.waitForTimeout(600);
  await page.evaluate((n) => {
    const r = new URL(location.href).searchParams.get("s");
    if (!r) return;
    const ch = new BroadcastChannel(`board:${r}`);
    for (let i = 0; i < n; i++)
      ch.postMessage({ kind: "hi", data: {}, from: `p4-${i}` });
    setTimeout(() => ch.close(), 0);
  }, peers);
  await expect
    .poll(() => page.locator(".players-roster .player-row").count(), { timeout: 15000 })
    .toBe(peers + 1);
}

const mark = (p: Page) => p.locator("[data-player-mark]:visible");
const lobby = (p: Page) => p.locator("[data-lobby]:visible");

/** G4c RE-CUT: geometry re-read PER CELL, at the intersection's own centre, sheet re-opened
 *  before each read and nothing clicked in between. Pass 3 measured once and clicked between. */
test("G4c the lap census, re-read per cell", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 664 },
    hasTouch: true,
    isMobile: info.project.name === "chromium" ? true : undefined,
  });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  const witness = await page.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    hover: matchMedia("(hover: hover)").matches,
  }));
  console.log(`[${info.project.name}] G4C-REGIME ${JSON.stringify(witness)}`);
  await room(page, 4);

  const rows: unknown[] = [];
  for (let i = 0; i < 9; i++) {
    if ((await mark(page).getAttribute("aria-expanded")) !== "true") {
      await mark(page).click();
      await page.waitForTimeout(320);
    }
    const r = await page.evaluate((idx) => {
      const sheet = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => (e as HTMLElement).getBoundingClientRect().height > 0,
      ) as HTMLElement;
      const cells = [...document.querySelectorAll(".sudoku-cell")] as HTMLElement[];
      const c = cells[idx];
      if (!c) return null;
      const s = sheet.getBoundingClientRect();
      const b = c.getBoundingClientRect();
      const w = Math.min(s.right, b.right) - Math.max(s.left, b.left);
      const h = Math.min(s.bottom, b.bottom) - Math.max(s.top, b.top);
      if (w <= 0 || h <= 0) return { idx, lap: null };
      const x = (Math.max(s.left, b.left) + Math.min(s.right, b.right)) / 2;
      const y = (Math.max(s.top, b.top) + Math.min(s.bottom, b.bottom)) / 2;
      const top = document.elementFromPoint(x, y) as HTMLElement | null;
      return {
        idx,
        lap: [+w.toFixed(1), +h.toFixed(1)],
        at: [+x.toFixed(1), +y.toFixed(1)],
        top: top
          ? `${top.tagName.toLowerCase()}.${[...top.classList].join(".")}`
          : null,
      };
    }, i);
    if (!r || !r.lap) continue;
    // Does the tap also REACH what is under it?
    await page.mouse.click((r.at as number[])[0], (r.at as number[])[1]);
    await page.waitForTimeout(260);
    const after = await page.evaluate(() => ({
      open:
        [...document.querySelectorAll("[data-lobby]")]
          .find((e) => e.classList.contains("is-open"))
          ?.classList.contains("is-open") ?? null,
      selected: document.querySelectorAll(".sudoku-cell.is-selected").length,
      inCell: !!(document.activeElement as HTMLElement | null)?.closest(".sudoku-cell"),
    }));
    rows.push({ ...r, ...after });
  }
  console.log(`[${info.project.name}] G4C ${JSON.stringify(rows)}`);
  await ctx.close();
});

/** The row budget across the old query's cliff, plus the furniture law at each point. */
test("the row budget and the furniture law", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(SOLO);
  await settled(page);
  await room(page, 6);

  const read = async (w: number, h: number) => {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(150);
    if ((await mark(page).getAttribute("aria-expanded")) !== "true") {
      await mark(page).click();
      await page.waitForTimeout(340);
    }
    return lobby(page).evaluate(() => {
      const el = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => (e as HTMLElement).getBoundingClientRect().height > 0,
      ) as HTMLElement;
      const r = el.getBoundingClientRect();
      const rowEls = el.querySelectorAll(".pl-row");
      const state = el.querySelector(".pl-state") as HTMLElement;
      const S = parseFloat(getComputedStyle(state).height);
      const rowsN = rowEls.length;
      const m = el.querySelector(".pl-more") ? 1 : 0;
      const law = 36 + S + 5.6 + 22.4 * rowsN + (1.6 + S) * m;
      const board = document.querySelector(".board-wrapper")?.getBoundingClientRect();
      return {
        rows: rowsN,
        more: el.querySelector(".pl-more")?.textContent?.trim() ?? "",
        state: state.textContent?.trim() ?? "",
        S: +S.toFixed(3),
        h: +r.height.toFixed(2),
        law: +law.toFixed(2),
        delta: +(r.height - law).toFixed(3),
        bottom: +r.bottom.toFixed(1),
        boardTop: board ? +board.top.toFixed(1) : null,
        scrolls: el.scrollHeight !== el.clientHeight,
        oldQuery: matchMedia("(min-height: 800px)").matches,
        regime: matchMedia("(pointer: coarse) and (max-height: 799px)").matches,
      };
    });
  };
  for (const [w, h] of [
    [1280, 800],
    [1280, 799],
    [1280, 780],
  ] as const) {
    console.log(
      `[${info.project.name}] ROWS ${w}x${h} ${JSON.stringify(await read(w, h))}`,
    );
  }
});

/** The sheet's AA, from the composited ground it actually ships, both themes. */
test("AA on the sheet's own ground", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(SOLO);
  await settled(page);
  await room(page, 3);
  await mark(page).click();
  await page.waitForTimeout(340);

  for (const theme of ["light", "dark"] as const) {
    if (theme === "dark")
      await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.waitForTimeout(500);
    const aa = await page.evaluate(() => {
      const srgb = (c: number) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      };
      const lum = (rgb: number[]) =>
        0.2126 * srgb(rgb[0]) + 0.7152 * srgb(rgb[1]) + 0.0722 * srgb(rgb[2]);
      const parse = (s: string) => s.match(/[\d.]+/g)!.map(Number);
      const ratio = (a: number[], b: number[]) => {
        const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
        return +((x + 0.05) / (y + 0.05)).toFixed(2);
      };
      const sheet = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => (e as HTMLElement).getBoundingClientRect().height > 0,
      ) as HTMLElement;
      const ground = parse(getComputedStyle(sheet).backgroundColor);
      const grab = (sel: string) =>
        [...sheet.querySelectorAll(sel)].map((e) =>
          ratio(parse(getComputedStyle(e as HTMLElement).color), ground),
        );
      return {
        ground: getComputedStyle(sheet).backgroundColor,
        opaque: !/rgba\(.*,\s*0?\.\d+\)/.test(getComputedStyle(sheet).backgroundColor),
        state: grab(".pl-state"),
        names: grab(".pl-name"),
        qual: grab(".pl-qual"),
        more: grab(".pl-more"),
      };
    });
    console.log(`[${info.project.name}] AA-${theme} ${JSON.stringify(aa)}`);
  }
});

/** Two frames: the desk sheet in light with the row budget at 1280×799 (the pixel that used to
 *  collapse it), and the phone dark compressed pose. Both in chromium only — one engine per
 *  frame, the numbers carry both. */
test("frames", async ({ browser }, info) => {
  test.skip(info.project.name !== "chromium", "frames are minted on one engine");
  mkdirSync(OUT, { recursive: true });

  const desk = await browser.newContext({ viewport: { width: 1280, height: 799 } });
  const a = await desk.newPage();
  await a.goto(SOLO);
  await settled(a);
  await room(a, 6);
  await mark(a).click();
  await a.waitForTimeout(360);
  await a.screenshot({
    path: `${OUT}/1-desk-799-four-names.png`,
    clip: { x: 0, y: 0, width: 470, height: 300 },
  });
  await desk.close();

  const ph = await browser.newContext({
    viewport: { width: 390, height: 664 },
    hasTouch: true,
    isMobile: true,
    colorScheme: "dark",
  });
  const b = await ph.newPage();
  await b.goto(SOLO);
  await settled(b);
  await b.evaluate(() => document.documentElement.classList.add("dark"));
  await room(b, 6);
  await mark(b).click();
  await b.waitForTimeout(360);
  await b.screenshot({
    path: `${OUT}/2-phone-dark-compressed.png`,
    clip: { x: 0, y: 0, width: 300, height: 220 },
  });
  await ph.close();
});
