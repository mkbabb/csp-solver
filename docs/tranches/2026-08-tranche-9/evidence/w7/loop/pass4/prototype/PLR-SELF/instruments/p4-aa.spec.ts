/**
 * PLR-SELF pass 4 — AA COMPOSITED (the rungs are translucent tokens), the desk lap census
 * re-read per cell, and the furniture law after the row floor landed.
 *
 * The theme is flipped by the estate's OWN control, not by a class the probe invents.
 */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "/?size=3&difficulty=EASY&wire=local";

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
    await page.waitForTimeout(700);
  }
  await verb.click();
  await page.waitForTimeout(600);
  await page.evaluate((n) => {
    const r = new URL(location.href).searchParams.get("s");
    if (!r) return;
    const ch = new BroadcastChannel(`board:${r}`);
    for (let i = 0; i < n; i++)
      ch.postMessage({ kind: "hi", data: {}, from: `p4aa-${i}` });
    setTimeout(() => ch.close(), 0);
  }, peers);
  await expect
    .poll(() => page.locator(".players-roster .player-row").count(), { timeout: 15000 })
    .toBe(peers + 1);
}
const mark = (p: Page) => p.locator("[data-player-mark]:visible");

const AA = () =>
  ((): unknown => {
    /** EVERY COLOUR THROUGH THE ENGINE'S OWN PARSER, THEN COMPOSITED ON A CANVAS.
     *  `getComputedStyle().color` returns `color(srgb 0.15 0.15 0.15 / 0.68)` on both engines
     *  for a `color-mix()` rung — 0-to-1 floats with an alpha — so a regex over the digits
     *  read 0.15 as a byte and over-reported light by 4x and dark by 8x in this probe's own
     *  first run. The canvas paints the ground opaque, paints the ink over it, and reads the
     *  byte that results: the compositor's arithmetic, not the probe's. */
    const cv = document.createElement("canvas");
    cv.width = cv.height = 1;
    const cx = cv.getContext("2d", { willReadFrequently: true })!;
    const paint = (...colors: string[]) => {
      cx.clearRect(0, 0, 1, 1);
      for (const c of colors) {
        cx.fillStyle = c;
        cx.fillRect(0, 0, 1, 1);
      }
      const d = cx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3]];
    };
    const srgb = (c: number) => {
      const v = c / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    const lum = (r: number[]) =>
      0.2126 * srgb(r[0]) + 0.7152 * srgb(r[1]) + 0.0722 * srgb(r[2]);
    const ratio = (fg: string, bg: string) => {
      const [x, y] = [lum(paint(bg, fg)), lum(paint(bg))].sort((p, q) => q - p);
      return +((x + 0.05) / (y + 0.05)).toFixed(2);
    };
    const sheet = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => (e as HTMLElement).getBoundingClientRect().height > 0,
    ) as HTMLElement;
    const groundStr = getComputedStyle(sheet).backgroundColor;
    const grab = (sel: string) =>
      [...sheet.querySelectorAll(sel)].map((e) =>
        ratio(getComputedStyle(e as HTMLElement).color, groundStr),
      );
    return {
      ground: groundStr,
      groundBytes: paint(groundStr),
      opaque: paint(groundStr)[3] === 255,
      state: grab(".pl-state"),
      names: grab(".pl-name"),
      qual: grab(".pl-qual"),
      more: grab(".pl-more"),
      stateColor: getComputedStyle(sheet.querySelector(".pl-state")!).color,
    };
  })();

test("AA composited, both themes, through the estate's own toggle", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(SOLO);
  await settled(page);
  await room(page, 3);
  await mark(page).click();
  await page.waitForTimeout(340);
  console.log(
    `[${info.project.name}] AAC-light ${JSON.stringify(await page.evaluate(AA))}`,
  );

  const toggle = page.locator(".corner-right button").first();
  await toggle.click({ force: true });
  await page.waitForTimeout(1200);
  const isDark = await page.evaluate(
    () =>
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark"),
  );
  if ((await mark(page).getAttribute("aria-expanded")) !== "true") {
    await mark(page).click();
    await page.waitForTimeout(340);
  }
  console.log(
    `[${info.project.name}] AAC-dark isDark=${isDark} ${JSON.stringify(await page.evaluate(AA))}`,
  );
});

/** The DESK lap — CH-71's pose, where the sheet really does cover the board. Geometry re-read
 *  per cell at the intersection's own centre; the sheet re-opened before each read; and the
 *  question pass 3 did not ask, answered: does the tap also reach what is under it. */
test("the desk lap census, re-read per cell", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(SOLO);
  await settled(page);
  await room(page, 6);

  const rows: unknown[] = [];
  for (let i = 0; i < 9; i++) {
    if ((await mark(page).getAttribute("aria-expanded")) !== "true") {
      await mark(page).click();
      await page.waitForTimeout(340);
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
      const t = document.elementFromPoint(x, y) as HTMLElement | null;
      return {
        idx,
        lap: [+w.toFixed(1), +h.toFixed(1)],
        at: [+x.toFixed(1), +y.toFixed(1)],
        top: t ? `${t.tagName.toLowerCase()}.${[...t.classList].join(".")}` : null,
      };
    }, i);
    if (!r || !r.lap) continue;
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
  console.log(`[${info.project.name}] LAP-DESK ${JSON.stringify(rows)}`);
});

/** The phone at 390×664, coarse, witnessed: how much of the board the sheet reaches at all. */
test("the short phone, witnessed", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 664 },
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto(SOLO);
  await settled(page);
  console.log(
    `[${info.project.name}] PHONE-REGIME ` +
      JSON.stringify(
        await page.evaluate(() => ({
          coarse: matchMedia("(pointer: coarse)").matches,
          regime: matchMedia("(pointer: coarse) and (max-height: 799px)").matches,
        })),
      ),
  );
  await room(page, 4);
  await mark(page).click();
  await page.waitForTimeout(340);
  console.log(
    `[${info.project.name}] PHONE-SHEET ` +
      JSON.stringify(
        await page.evaluate(() => {
          const el = [...document.querySelectorAll("[data-lobby]")].find(
            (e) => (e as HTMLElement).getBoundingClientRect().height > 0,
          ) as HTMLElement;
          const r = el.getBoundingClientRect();
          const state = el.querySelector(".pl-state") as HTMLElement;
          const S = parseFloat(getComputedStyle(state).height);
          const rowsN = el.querySelectorAll(".pl-row").length;
          const m = el.querySelector(".pl-more") ? 1 : 0;
          const grid = document.querySelector(".sudoku-cell")?.getBoundingClientRect();
          const law = 36 + S + 5.6 + 22.4 * rowsN + (1.6 + S) * m;
          return {
            rows: rowsN,
            more: el.querySelector(".pl-more")?.textContent?.trim() ?? "",
            S: +S.toFixed(3),
            h: +r.height.toFixed(2),
            law: +law.toFixed(2),
            delta: +(r.height - law).toFixed(3),
            bottom: +r.bottom.toFixed(1),
            gridTop: grid ? +grid.top.toFixed(1) : null,
            clear: grid ? +(grid.top - r.bottom).toFixed(1) : null,
            rowH: +(
              document.querySelector(".pl-row")?.getBoundingClientRect().height ?? 0
            ).toFixed(3),
          };
        }),
      ),
  );
  await ctx.close();
});
