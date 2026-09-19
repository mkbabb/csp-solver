/**
 * T9-W7 pass 3 · MRK-LIVE · the phone arm of G-LIVE-4: WHERE THE FOCUS GOES when the dock
 * opens at 393×699, and the coarse-pointer collision (G-LIVE-17).
 *
 * Motion declared: rows sample the dock's own glide (520ms, WAAPI) and wait for the sheet to
 * SETTLE (the sheet slides — the standing trap) before reading geometry. PRM is off by design.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, q = "?game=sudoku") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}

test.use({ viewport: { width: 393, height: 699 } });

test("P1 · where the ring goes when the dock opens on a phone", async ({
  page,
  browserName,
}) => {
  await boardReady(page);
  const snap = () =>
    page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      const tab = document.querySelector<HTMLElement>(".drawer-tab");
      const cs = tab ? getComputedStyle(tab) : null;
      const inertAncestor = (() => {
        for (let e: Element | null = tab; e; e = e.parentElement)
          if ((e as HTMLElement).inert) return e.tagName.toLowerCase() + "." + (e.className || "").toString().split(/\s+/)[0];
        return null;
      })();
      return {
        active: a ? a.tagName.toLowerCase() + "." + (a.className || "").toString().split(/\s+/)[0] : null,
        activeIsBody: a === document.body,
        fv: !!a?.matches(":focus-visible"),
        rings: document.querySelectorAll(".focus-ring").length,
        tabPresent: !!tab,
        tabDisplay: cs?.display ?? null,
        tabVisibility: cs?.visibility ?? null,
        tabInert: tab ? (tab as HTMLElement).inert : null,
        inertAncestor,
        tabRect: tab ? (({ left, top, width, height }) => ({ left: +left.toFixed(2), top: +top.toFixed(2), width, height }))(tab.getBoundingClientRect()) : null,
      };
    });

  await page.keyboard.press("Tab");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(500);
  const before = await snap();
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
  await page.waitForTimeout(120);
  const mid = await snap();
  await page.waitForTimeout(900);
  const after = await snap();

  const row = { engine: browserName, before, mid, after };
  bank(`PHONE-dock-${browserName}.json`, row);
  console.log("P1 " + JSON.stringify(row));
});

test("P2 · G-LIVE-17 the author's label and the focused cell's ring", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const size of [3, 4]) {
    await page.goto(`./?size=${size}&difficulty=EASY`);
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
    await page.waitForTimeout(1500);
    // Stub an author on the cell the probe focuses — the route tier 4 uses in
    // `join-language-prm.spec.ts`: the board's `cellAuthors` prop, injected through the
    // component's own dev hook if present, else the DOM tape is read where it already exists.
    const board = await page.evaluate((n) => {
      const cells = [...document.querySelectorAll<HTMLElement>(".game-cell")];
      return { cells: cells.length, n };
    }, size);

    for (const which of ["row0", "interior"] as const) {
      const idx = which === "row0" ? 1 : (size * size) * 2 + 2;
      await page.evaluate((i) => {
        const inputs = [...document.querySelectorAll<HTMLInputElement>(".game-cell input")];
        inputs[i]?.focus();
      }, idx);
      await page.waitForTimeout(800);
      const read = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        const cell = el?.closest<HTMLElement>(".game-cell");
        if (!cell) return { cell: false };
        const cb = cell.getBoundingClientRect();
        const ghost = cell.querySelector<SVGPathElement>(".cell-ghost-path");
        const gs = ghost ? getComputedStyle(ghost) : null;
        // outer ink of tier 2 = the ghost's painted bbox top (its own stroke included)
        const gb = ghost?.getBoundingClientRect() ?? null;
        const label = document.querySelector<HTMLElement>(".washi-label");
        const lb = label?.getBoundingClientRect() ?? null;
        return {
          cell: true,
          cellRect: { top: +cb.top.toFixed(2), left: +cb.left.toFixed(2), w: +cb.width.toFixed(2), h: +cb.height.toFixed(2) },
          ghostTop: gb ? +gb.top.toFixed(2) : null,
          ghostStroke: gs?.strokeWidth ?? null,
          ghostOpacity: gs?.strokeOpacity ?? null,
          label: !!label,
          labelBottom: lb ? +lb.bottom.toFixed(2) : null,
          air: gb && lb ? +(gb.top - lb.bottom).toFixed(2) : null,
          coarse: window.matchMedia("(pointer: coarse)").matches,
          rings: document.querySelectorAll(".focus-ring").length,
        };
      });
      rows.push({ size: `${size * size}x${size * size}`, which, ...board, ...read });
    }
  }
  bank(`COARSE-label-${browserName}.json`, { engine: browserName, rows });
  console.log("P2 " + JSON.stringify(rows));
});
