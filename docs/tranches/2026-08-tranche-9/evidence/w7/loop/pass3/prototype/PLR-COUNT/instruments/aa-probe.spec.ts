/**
 * PLR-COUNT G2 / G14 — the strokes and the sheet's words on the four grounds, computed from
 * the PAINTED values the page reports (not from the token table), at `stroke-opacity 0.95`.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-COUNT/readings";
mkdirSync(OUT, { recursive: true });

const mark = (page: Page) => page.locator("[data-player-mark]:visible").first();

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

async function peers(page: Page, room: string, k: number) {
  await page.evaluate(
    ({ room, k }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `aa-${i}-${Math.random()}` });
    },
    { room, k },
  );
  await page.waitForTimeout(800);
}

const READ = () => {
  // every colour resolved to sRGB bytes through a throwaway canvas, so oklch() and
  // color(srgb …) land in the same space as the ratio formula
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const cx = cv.getContext("2d")!;
  const bytes = (css: string, over: [number, number, number]) => {
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = `rgb(${over[0]},${over[1]},${over[2]})`;
    cx.fillRect(0, 0, 1, 1);
    cx.fillStyle = css;
    cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]] as [number, number, number];
  };
  const lum = ([r, g, b]: [number, number, number]) => {
    const f = [r, g, b].map((c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
  };
  const ratio = (a: [number, number, number], b: [number, number, number]) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
  };
  const page = bytes(getComputedStyle(document.body).backgroundColor, [255, 255, 255]);
  const sheetEl = document.querySelector("[data-lobby]") as HTMLElement;
  const sheet = bytes(getComputedStyle(sheetEl).backgroundColor, page);
  const strokes = [
    ...document.querySelectorAll("[data-player-mark] .pt-pose.is-active .pt-stroke"),
  ].map((p) => getComputedStyle(p).stroke);
  const at95 = (css: string, ground: [number, number, number]) => {
    const solid = bytes(css, ground);
    // stroke-opacity 0.95 composites the painted stroke over its own ground
    const mixed = solid.map((c, i) => Math.round(c * 0.95 + ground[i] * 0.05)) as [
      number,
      number,
      number,
    ];
    return { css, rgb: mixed, ratio: ratio(mixed, ground) };
  };
  const words = (sel: string) => {
    const el = sheetEl.querySelector(sel);
    if (!el) return null;
    const c = bytes(getComputedStyle(el).color, sheet);
    return { css: getComputedStyle(el).color, rgb: c, ratio: ratio(c, sheet) };
  };
  return {
    dark: document.documentElement.classList.contains("dark"),
    grounds: { page, sheet },
    strokesOnPage: strokes.map((s) => at95(s, page)),
    strokesOnSheet: strokes.map((s) => at95(s, sheet)),
    graphiteOnPage: at95(
      getComputedStyle(document.documentElement).getPropertyValue("--color-pencil-graphite") ||
        "#262626",
      page,
    ),
    sheetWords: {
      state: words(".pl-state"),
      name: words(".pl-name"),
      more: words(".pl-more"),
      qualifier: words(".pl-qualifier"),
    },
  };
};

for (const theme of ["light", "dark"] as const) {
  test(`grounds and ratios, ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ colorScheme: theme });
    const room = `aa-${theme}-${Date.now()}`;
    await page.goto(`/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    // FOUR peers first, so the STROKES are on the mark when their ratios are read: past the
    // threshold the mark writes a number and the stroke array is empty, which is how the first
    // run of this probe reported `Infinity` for its own worst case.
    await peers(page, room, 4);
    await mark(page).click();
    await page.waitForTimeout(300);
    const read = await page.evaluate(READ);
    // then eleven more, for the foot the tall sheet only grows past five
    await peers(page, room, 11);
    await page.waitForTimeout(300);
    const at16 = await page.evaluate(READ);
    read.sheetWords.more = at16.sheetWords.more;
    read.sheetWords.state = at16.sheetWords.state;
    writeFileSync(`${OUT}/aa-${theme}.json`, JSON.stringify(read, null, 1));
    const worstStroke = Math.min(
      ...read.strokesOnPage.map((s) => s.ratio),
      ...read.strokesOnSheet.map((s) => s.ratio),
    );
    const worstWord = Math.min(
      ...Object.values(read.sheetWords)
        .filter(Boolean)
        .map((w) => w!.ratio),
    );
    console.log(
      `AA ${theme}: worst stroke ${worstStroke} · worst sheet word ${worstWord} · ` +
        `page ${JSON.stringify(read.grounds.page)} sheet ${JSON.stringify(read.grounds.sheet)}`,
    );
  });
}
