/**
 * PLR-COUNT pass-3 — the frames and the censuses. An INSTRUMENT, not a gate: every row here
 * writes a number or a crop into the family's evidence dir and asserts nothing it has not
 * measured. Run against this lane's own server (4242) with the HEAD control (4230) beside it.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-COUNT";
mkdirSync(`${OUT}/frames`, { recursive: true });
mkdirSync(`${OUT}/readings`, { recursive: true });
const bank = (name: string, data: unknown) =>
  writeFileSync(`${OUT}/readings/${name}`, JSON.stringify(data, null, 1));

const mark = (page: Page) => page.locator("[data-player-mark]:visible").first();
const settle = (page: Page) => page.waitForTimeout(260);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

let cursor = 0;
async function peers(page: Page, room: string, k: number) {
  if (k <= 0) return;
  const from = cursor;
  cursor += k;
  await page.evaluate(
    ({ room, k, from }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `cen-${from + i}` });
    },
    { room, k, from },
  );
  await page.waitForTimeout(700);
}

/** Every live filter on the page, by url — the census the budget of 9 is read from. */
const filterCensus = (page: Page) =>
  page.evaluate(() => {
    const live = new Set<string>();
    for (const el of document.querySelectorAll<HTMLElement>("*")) {
      const f = getComputedStyle(el).filter;
      if (f && f !== "none") for (const m of f.matchAll(/url\(["']?#([^)"']+)/g)) live.add(m[1]);
      const sf = el.getAttribute?.("filter");
      if (sf) for (const m of sf.matchAll(/#([^)"']+)/g)) live.add(m[1]);
    }
    return {
      live: [...live].sort(),
      liveCount: live.size,
      defs: document.querySelectorAll("filter").length,
    };
  });

// ── the head strip: one crop per N at 390 coarse, dpr 3, for pixels.mjs and ink-weight.mjs ──
test.describe("the strip", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 3,
  });
  test("N = 1, 3, 5, 6 at 390 coarse light", async ({ page }) => {
    const room = `cen-strip-${Date.now()}`;
    await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    const regime = await page.evaluate(() => ({
      coarse: matchMedia("(pointer: coarse)").matches,
      dpr: devicePixelRatio,
      dark: document.documentElement.classList.contains("dark"),
    }));
    const rows: Record<string, unknown> = { regime };
    let at = 1;
    for (const N of [1, 3, 5, 6]) {
      await peers(page, room, N - at);
      at = N;
      await page.waitForTimeout(400);
      const el = mark(page);
      await el.screenshot({ path: `${OUT}/frames/strip-N${N}.png` });
      const b = await el.boundingBox();
      rows[`N${N}`] = { box: b, label: await el.getAttribute("aria-label") };
    }
    bank("strip-390-coarse-light.json", rows);
    console.log("STRIP", JSON.stringify(rows));
  });
});

// ── the filter census, both regimes, with the tally boiling and the sheet open ──────────────
test("filters: the head boiling, the sheet open", async ({ page }) => {
  const room = `cen-filters-${Date.now()}`;
  await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await peers(page, room, 2);
  await page.waitForTimeout(1200); // let the boil beat run
  const shut = await filterCensus(page);
  await mark(page).click();
  await settle(page);
  const open = await filterCensus(page);
  bank("filter-census-desk.json", { shut, open });
  console.log("FILTERS desk shut", shut.liveCount, "open", open.liveCount);
});

test.describe("filters, coarse", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("the head boiling, the sheet open, coarse", async ({ page }) => {
    const room = `cen-filters-c-${Date.now()}`;
    await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 2);
    await page.waitForTimeout(1200);
    const shut = await filterCensus(page);
    await mark(page).click();
    await settle(page);
    const open = await filterCensus(page);
    bank("filter-census-phone.json", { shut, open });
    console.log("FILTERS phone shut", shut.liveCount, "open", open.liveCount);
  });
});

// ── G13 · the shared tally's geometry against the HEAD control ─────────────────────────────
test("G13: the difficulty tally's d values, proto vs HEAD control", async ({ page }) => {
  const read = async (base: string) => {
    await page.goto(`${base}/?size=3&difficulty=EASY`);
    await settled(page);
    await page.waitForTimeout(600);
    return page.evaluate(() =>
      [...document.querySelectorAll(".dt-pose .dt-stroke")].map((p) => p.getAttribute("d")),
    );
  };
  const proto = await read("http://127.0.0.1:4242");
  const head = await read("http://127.0.0.1:4230");
  const same = proto.length === head.length && proto.every((d, i) => d === head[i]);
  bank("g13-tally-d.json", {
    control: "74a2b5d9 @ http://127.0.0.1:4230",
    protoCount: proto.length,
    headCount: head.length,
    byteIdentical: same,
    firstDiff: proto.findIndex((d, i) => d !== head[i]),
    proto,
    head,
  });
  console.log(`G13 proto ${proto.length} / head ${head.length} identical=${same}`);
  expect(head.length).toBe(20);
  expect(same).toBe(true);
});

// ── the four cited frames ──────────────────────────────────────────────────────────────────
test("frame 2: the desk register open over the board, the card not painting", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  const room = `cen-desk-${Date.now()}`;
  await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await peers(page, room, 3);
  await mark(page).click();
  await settle(page);
  const card = await page.evaluate(() => {
    const c = document.querySelector(".hover-card") as HTMLElement | null;
    return c ? { opacity: getComputedStyle(c).opacity, vis: getComputedStyle(c).visibility } : null;
  });
  bank("frame2-card-state.json", card);
  console.log("CARD WHILE REGISTER OPEN", JSON.stringify(card));
  await page.screenshot({
    path: `${OUT}/frames/frame2-desk-register.png`,
    clip: { x: 0, y: 0, width: 640, height: 460 },
  });
});

test.describe("frame 3", () => {
  test.use({ viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true });
  test("phone 664 coarse, three people: two named rows, no foot", async ({ page }) => {
    const room = `cen-664-${Date.now()}`;
    await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 2);
    await mark(page).click();
    await settle(page);
    const box = await page.locator("[data-lobby]:visible").first().boundingBox();
    bank("frame3-short-sheet.json", {
      box,
      rows: await page.locator("[data-lobby]:visible .pl-row").count(),
      more: await page.locator("[data-lobby]:visible .pl-more").count(),
    });
    await page.screenshot({
      path: `${OUT}/frames/frame3-phone664-N3.png`,
      clip: { x: 0, y: 0, width: 390, height: 300 },
    });
  });
});

test("frame 4: three people, dark, 1280", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ colorScheme: "dark" });
  const room = `cen-dark-${Date.now()}`;
  await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await peers(page, room, 2);
  await mark(page).click();
  await settle(page);
  const colours = await page.evaluate(() => {
    const sheet = document.querySelector("[data-lobby]") as HTMLElement;
    const strokes = [...document.querySelectorAll("[data-player-mark] .pt-pose.is-active path")]
      .map((p) => getComputedStyle(p).stroke);
    return {
      dark: document.documentElement.classList.contains("dark"),
      ground: getComputedStyle(sheet).backgroundColor,
      state: getComputedStyle(sheet.querySelector(".pl-state")!).color,
      name: getComputedStyle(sheet.querySelector(".pl-name")!).color,
      strokes,
    };
  });
  bank("frame4-dark.json", colours);
  console.log("DARK", JSON.stringify(colours));
  await page.screenshot({
    path: `${OUT}/frames/frame4-dark-N3.png`,
    clip: { x: 0, y: 0, width: 560, height: 360 },
  });
});
