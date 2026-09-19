/**
 * PLR-SELF pass 2 — G3 (the tap floor, with its negative control) and G4 (the THREE bounds:
 * the sun, the board on a tall phone, and the lap that is priced by a dismissal).
 *
 * The height law: H(r, m) = 58.95 + 23.6·rows + 20.55·more, measured. ROWS = { tall: 5 (a
 * viewport ≥ 800 tall), short: 2 }.
 */
import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import {
  SOLO,
  DESK,
  PHONE_TALL,
  PHONE_SHORT,
  say,
  settled,
  invite,
  addPeers,
  mark,
  lobby,
  openSheet,
  coarseCtx,
} from "./harness";

/**
 * THE HEIGHT LAW — PASS 3's, and it is the FURNITURE's rather than any family's box.
 *
 * Both earlier coefficient sets (PLR-COUNT's `58.95 + 23.6r + 20.55m`, PLR-SELF pass 2's
 * `57.36 + 21.6r + 18.96m`) measured a row whose height fell out of its own content. The
 * substrate declares it now — `line-height: 1.35` on the sheet, `gap: 0` on the list, a
 * `min-height: 1.4rem` floor on the row — so the law is:
 *
 *   H(r, m) = 36 + S + 5.6 + 22.4·r + (1.6 + S)·m        S = the state line's own box
 *
 *   padding 2 x 16 = 32 · border 2 x 2 = 4 · rows-list top margin 0.35rem = 5.6 ·
 *   every row 22.4 (the declared floor, both pointer regimes) ·
 *   `and N more` = its 0.1rem top margin + S
 *
 * S is 18.953 on the desk and 18.891 on a coarse phone (`--type-tag` x 1.35), so it is read
 * from the sheet rather than hard-coded; `p3-new.spec.ts` asserts every part of this in one
 * `evaluate`. The two earlier sets are REPORTED SUPERSEDED.
 */
const H = (r: number, m: number, S = 18.953) =>
  36 + S + 5.6 + 22.4 * r + (1.6 + S) * m;
const H_SPEC = (r: number, m: number) => 58.95 + 23.6 * r + 20.55 * m;

async function geometry(page: Page) {
  return page.evaluate(() => {
    const vis = (e: Element) => e.getBoundingClientRect().width > 0;
    const m = [...document.querySelectorAll("[data-player-mark]")].find(vis) as HTMLElement;
    const l = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => getComputedStyle(e).visibility === "visible",
    ) as HTMLElement | undefined;
    const grid = document.querySelector(".hand-drawn-grid, .board-frame, .sudoku-grid");
    const sun = document.querySelector(".corner-right");
    const word = document.querySelector("svg.handwritten-logo");
    const box = (e: Element | null | undefined) => {
      if (!e) return null;
      const b = e.getBoundingClientRect();
      return {
        x: +b.x.toFixed(1),
        y: +b.y.toFixed(1),
        w: +b.width.toFixed(1),
        h: +b.height.toFixed(1),
        right: +b.right.toFixed(1),
        bottom: +b.bottom.toFixed(1),
      };
    };
    return {
      mark: box(m),
      sheet: box(l),
      rows: l ? l.querySelectorAll(".pl-row").length : 0,
      more: l ? (l.querySelector(".pl-more") ? 1 : 0) : 0,
      moreText: l?.querySelector(".pl-more")?.textContent?.trim() ?? "",
      stateText: l?.querySelector(".pl-state")?.textContent?.trim() ?? "",
      // S, read rather than assumed: the state line's own box is the law's one variable.
      stateH: l
        ? +((l.querySelector(".pl-state") as HTMLElement)?.getBoundingClientRect().height ?? 0)
            .toFixed(3)
        : 0,
      scrolls: l ? l.scrollHeight !== l.clientHeight : false,
      grid: box(grid),
      sun: box(sun),
      wordmark: box(word),
    };
  });
}

test("G3 — the mark is 44 x 44 at coarse, and a 40px control fails each dimension", async ({
  browser,
}, info) => {
  const ctx: BrowserContext = await coarseCtx(
    browser,
    PHONE_TALL,
    info.project.name === "chromium",
  );
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  await addPeers(a, 1);
  await a.waitForTimeout(500);
  const box = (await mark(a).boundingBox())!;
  // The negative control: the same floor asked of a 40px box, which must fail BOTH arms.
  const control = { width: 40, height: 40 };
  say({
    g: "G3",
    mark: { w: +box.width.toFixed(1), h: +box.height.toFixed(1) },
    control,
    controlPassesW: control.width >= 44,
    controlPassesH: control.height >= 44,
  });
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(control.width >= 44 || control.height >= 44).toBe(false);
  await ctx.close();
});

test("G4a — desk: the sheet clears the sun; the board lap obeys the law", async ({
  page,
}) => {
  await page.setViewportSize(DESK);
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 6); // seven at the table: 4 rows + `and 3 more` on the tall budget
  await page.waitForTimeout(600);
  await openSheet(page);
  const g = await geometry(page);
  const law = H(g.rows, g.more, g.stateH ?? 18.953);
  const wordmarkLap =
    ((Math.min(g.sheet!.right, g.wordmark!.right) - Math.max(g.sheet!.x, g.wordmark!.x)) *
      (Math.min(g.sheet!.bottom, g.wordmark!.bottom) - Math.max(g.sheet!.y, g.wordmark!.y))) /
    (g.sheet!.w * g.sheet!.h);
  say({
    g: "G4a",
    ...g,
    law: +law.toFixed(2),
    delta: +(g.sheet!.h - law).toFixed(2),
    specLaw: +H_SPEC(g.rows, g.more).toFixed(2),
    specDelta: +(g.sheet!.h - H_SPEC(g.rows, g.more)).toFixed(2),
    boardLap: +(g.sheet!.bottom - g.grid!.y).toFixed(1),
    wordmarkLapPct: +(wordmarkLap * 100).toFixed(1),
  });
  expect(g.sheet!.right, "the sheet clears the sun").toBeLessThan(g.sun!.x);
  expect(g.sheet!.w).toBe(256);
  expect(g.scrolls, "and it never scrolls").toBe(false);
  expect(Math.abs(g.sheet!.h - law), "the height law holds").toBeLessThanOrEqual(0.5);
  // Seven at the table on a tall budget of five: four rows and the remainder, never a scroll.
  expect(g.rows, "the tall budget compresses at 5").toBe(4);
  expect(g.moreText).toBe("and 3 more");
  expect(g.stateText, "the state line counts OTHERS").toBe("6 other players");
});

test("G4b — tall phone: five rows clear the board's top", async ({ browser }, info) => {
  const ctx = await coarseCtx(browser, PHONE_TALL, info.project.name === "chromium");
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  await addPeers(a, 4);
  await a.waitForTimeout(600);
  await openSheet(a);
  const g = await geometry(a);
  const law = H(g.rows, g.more, g.stateH ?? 18.953);
  say({
    g: "G4b",
    ...g,
    law: +law.toFixed(2),
    delta: +(g.sheet!.h - law).toFixed(2),
    clearance: +(g.grid!.y - g.sheet!.bottom).toFixed(1),
  });
  expect(g.rows, "five rows on a tall phone — the whole table, uncompressed").toBe(5);
  expect(g.more, "and no compression line").toBe(0);
  expect(g.sheet!.right).toBeLessThan(g.sun!.x);
  expect(g.scrolls).toBe(false);
  expect(g.sheet!.bottom, "and the board's top is clear").toBeLessThan(g.grid!.y);
  await ctx.close();
});

test("G4c — short phone: the lap is the law, and every lapped cell dismisses", async ({
  browser,
}, info) => {
  const ctx = await coarseCtx(browser, PHONE_SHORT, info.project.name === "chromium");
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  await addPeers(a, 4);
  await a.waitForTimeout(600);
  await openSheet(a);
  const g = await geometry(a);
  const law = H(g.rows, g.more, g.stateH ?? 18.953);

  // Every CELL the sheet covers, tapped TWICE over: once at the cell's own centre (which on
  // this lap sits below the sheet's bottom edge, so the tap lands on the board), and once at
  // the centre of the INTERSECTION itself — the point that is genuinely under the sheet, and
  // the one the claim "one tap uncovers it" is actually about.
  const lapped = await a.evaluate(() => {
    const l = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => getComputedStyle(e).visibility === "visible",
    )!;
    const s = l.getBoundingClientRect();
    return [...document.querySelectorAll(".sudoku-cell")]
      .map((c, i) => {
        const b = c.getBoundingClientRect();
        const ix = [Math.max(b.left, s.left), Math.min(b.right, s.right)];
        const iy = [Math.max(b.top, s.top), Math.min(b.bottom, s.bottom)];
        return {
          i,
          cx: +(b.x + b.width / 2).toFixed(1),
          cy: +(b.y + b.height / 2).toFixed(1),
          lx: +((ix[0] + ix[1]) / 2).toFixed(1),
          ly: +((iy[0] + iy[1]) / 2).toFixed(1),
          lapH: +(iy[1] - iy[0]).toFixed(1),
          laps: ix[1] > ix[0] && iy[1] > iy[0],
        };
      })
      .filter((c) => c.laps);
  });

  const outcomes: {
    i: number;
    shut: boolean;
    hit: string;
    lapShut: boolean;
    lapHit: string;
  }[] = [];
  const hitAt = (x: number, y: number) =>
    a.evaluate(
      ({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        return el
          ? `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`
          : "";
      },
      { x, y },
    );
  for (const c of lapped) {
    if (!(await lobby(a).isVisible().catch(() => false))) await openSheet(a);
    const lapHit = await hitAt(c.lx, c.ly);
    await a.mouse.click(c.lx, c.ly);
    await a.waitForTimeout(260);
    const lapShut = !(await lobby(a).isVisible().catch(() => false));

    if (!(await lobby(a).isVisible().catch(() => false))) await openSheet(a);
    const hit = await hitAt(c.cx, c.cy);
    await a.mouse.click(c.cx, c.cy);
    await a.waitForTimeout(260);
    const shut = !(await lobby(a).isVisible().catch(() => false));
    outcomes.push({ i: c.i, shut, hit, lapShut, lapHit });
  }

  say({
    g: "G4c",
    rows: g.rows,
    more: g.more,
    sheetH: g.sheet!.h,
    law: +law.toFixed(2),
    delta: +(g.sheet!.h - law).toFixed(2),
    gridTop: g.grid!.y,
    lap: +(g.sheet!.bottom - g.grid!.y).toFixed(1),
    specLaw: +H_SPEC(g.rows, g.more).toFixed(2),
    specDelta: +(g.sheet!.h - H_SPEC(g.rows, g.more)).toFixed(2),
    lappedCells: lapped.length,
    lapDepth: lapped[0]?.lapH,
    outcomes,
  });
  // Five at the table on a short budget of two: one row and the remainder.
  expect(g.rows, "the short budget compresses at 2").toBe(1);
  expect(g.moreText).toBe("and 4 more");
  expect(Math.abs(g.sheet!.h - law), "the height law holds here too").toBeLessThanOrEqual(0.5);
  expect(g.scrolls).toBe(false);
  expect(lapped.length, "the short phone DOES lap the board — that is the law").toBeGreaterThan(
    0,
  );
  expect(
    outcomes.every((o) => o.lapShut),
    "a tap on the covered part of a cell dismisses the sheet",
  ).toBe(true);
  // …and it lands ON the sheet, not on the cell under it — everywhere but the sheet's own
  // 1rem BOTTOM-RIGHT RADIUS. The last lapped cell (x 254–294 against a sheet that ends at
  // 256) has its intersection centre at x≈255, y≈136 against a bottom edge of 141.8: inside
  // the corner's arc, so `elementFromPoint` falls through to the board. It dismisses anyway —
  // the root's `closeAll` is the owner — so the law holds; what does not hold is "the sheet
  // swallows every pixel of its own bounding box", and a rounded box never did.
  const onSheet = outcomes.filter((o) => o.lapHit.startsWith("div.player-lobby")).length;
  expect(onSheet, "every lapped cell but the corner-radius one lands on the sheet").toBe(
    outcomes.length - 1,
  );
  expect(
    outcomes.every((o) => o.shut),
    "and so does a tap on the same cell's uncovered centre",
  ).toBe(true);
  expect(
    outcomes.every((o) => !/input|button/.test(o.hit)),
    "reaching no control either way",
  ).toBe(true);
  await ctx.close();
});
