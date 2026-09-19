/**
 * PLR-PLACE · PASS-2 G8 + G19 + G7-coarse — THE PHONE.
 *
 * G8 is the LAP LAW, and it is the family's most exposed claim: the sheet laps the board, the
 * amount is arithmetic, and every lapped cell must dismiss rather than write. The law is
 *
 *     lap(vh, L) = 417.07 + 24.0·L − 0.5·vh        (≥ 592 board width pinned)
 *
 * measured here at 664 and 844 tall × L ∈ {0, 2, 5}, and asserted ±4px. THEN every lapped
 * cell's CENTRE is tapped, and the tap must dismiss the sheet and reach no control — the
 * incumbent @mbabb card steals 12 cells on chromium (the tap lands on its GitHub link), which
 * is the HEAD row this family books and the defect it refuses to inherit.
 */
import { test, expect, type Page, devices } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const HOME =
  process.env.PLC_HOME ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/PLR-PLACE";
const OUT = join(HOME, "logs");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  say(k, v);
};

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const MARK = "[data-player-mark]";
function mark(page: Page) {
  return page.locator(MARK).locator("visible=true").first();
}
function sheet(page: Page) {
  return page.locator("[data-lobby]:visible");
}
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
const census = (p: Page) =>
  p.evaluate(() => {
    let total = 0;
    for (const el of document.querySelectorAll("*")) {
      const cs = getComputedStyle(el);
      if (cs.filter === "none" || cs.display === "none") continue;
      total++;
    }
    return total;
  });

/** Drive L peers onto the channel so the sheet carries L + 1 rows. */
async function drivePeers(a: Page, b: Page, room: string, n: number) {
  if (n === 0) return "none";
  await a.evaluate((r) => {
    const w = window as unknown as { __st: unknown; __ch: BroadcastChannel };
    w.__st = null;
    const ch = new BroadcastChannel(`board:${r}`);
    w.__ch = ch;
    ch.onmessage = (ev: MessageEvent) => {
      if (ev.data?.kind === "st") w.__st = ev.data.data;
    };
  }, room);
  await b.evaluate(() => {
    const ch = new BroadcastChannel(
      `board:${new URL(location.href).searchParams.get("s")}`,
    );
    ch.postMessage({ kind: "hi", data: {}, from: "p-probe000000" });
    ch.close();
  });
  await a.waitForTimeout(600);
  const drove = await a.evaluate((count) => {
    const w = window as unknown as {
      __st: { e: number; ea: string } | null;
      __ch: BroadcastChannel;
    };
    if (!w.__st) return "no st";
    const { e, ea } = w.__st;
    for (let i = 0; i < count; i++) {
      const id = `p-fake${String(i).padStart(8, "0")}`;
      w.__ch.postMessage({ kind: "hi", data: { ack: true }, from: id });
      w.__ch.postMessage({ kind: "cur", data: { p: i * 7 + 1, e, ea }, from: id });
    }
    return `drove ${count}`;
  }, n);
  await a.waitForTimeout(1200);
  return drove;
}

const LAW = (vh: number, L: number) => 417.07 + 24.0 * L - 0.5 * vh;

// ONE TEST PER CONFIGURATION. Six arms in one test is six chances to lose all six to a single
// timeout — and a kill that loses minutes is the pass's own law.
for (const vh of [664, 844]) {
  for (const L of [0, 2, 5]) {
    test(`THE PHONE — lap law at ${vh} × L${L}`, async ({ browser }, info) => {
      const eng = info.project.name;
      mkdirSync(OUT, { recursive: true });
      const laps: Record<string, unknown>[] = [];
      const ctx = await browser.newContext({
        ...devices["iPhone 13"],
        viewport: { width: 390, height: vh },
      });
      const a = await ctx.newPage();
      await a.goto(SOLO);
      await settled(a);

      // G19 tap floor, once per context (the mark is the same object at every L).
      if (L === 0) {
        const floor = await a.evaluate(() => {
          const el = [...document.querySelectorAll("[data-player-mark]")].find(
            (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
          ) as HTMLElement;
          const r = el.getBoundingClientRect();
          const root = document.querySelector(".page-root") as HTMLElement | null;
          const cs = getComputedStyle(el);
          // THE NEGATIVE CONTROL, in the same breath: shrink the declared floor to 40px and the
          // same element must fail its own gate. A floor that cannot be shown failing is not a
          // floor — and the sign's natural box already clears 44, so without this the row
          // proves nothing about the DECLARATION.
          const before = { w: r.width, h: r.height };
          el.style.setProperty("--tap-floor", "40px");
          el.style.padding = "0";
          const ctrl = el.getBoundingClientRect();
          el.style.removeProperty("--tap-floor");
          el.style.removeProperty("padding");
          return {
            w: +before.w.toFixed(2),
            h: +before.h.toFixed(2),
            minWidth: cs.minWidth,
            minHeight: cs.minHeight,
            tokenOnPageRoot: root
              ? getComputedStyle(root).getPropertyValue("--tap-floor").trim()
              : null,
            tokenOnDocumentElement: getComputedStyle(document.documentElement)
              .getPropertyValue("--tap-floor")
              .trim(),
            negativeControl: {
              w: +ctrl.width.toFixed(2),
              h: +ctrl.height.toFixed(2),
              fails: ctrl.width < 44 || ctrl.height < 44,
            },
          };
        });
        rec(`g19.tapFloor.${vh}`, floor);
        await expect.poll(async () => await census(a), { timeout: 30000 }).toBe(9);
        rec(`g7.phone.shut.${vh}`, await census(a));
      }

      let b: Page | null = null;
      if (L > 0) {
        // THE DRAWER. At phone width the well lives behind the drawer tab, so the invite verb
        // is not reachable until it is opened — and it is shut again before anything is
        // measured, because the lap is a reading of the SHEET, not of the drawer.
        const tab = a.locator(".drawer-tab");
        if ((await tab.count()) && (await tab.getAttribute("aria-expanded")) !== "true") {
          await tab.click();
          await a.waitForTimeout(700);
        }
        const verb = a.locator(
          '.controls-card button[aria-label="Play together on this board"]',
        );
        await verb.click();
        await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
        const link = a.url();
        const room = new URL(link).searchParams.get("s")!;
        b = await ctx.newPage();
        await b.goto(link);
        await settled(b);
        await a.waitForTimeout(600);
        // L rows in total means L-1 driven peers beside B and you
        await drivePeers(a, b, room, Math.max(0, L - 1));
        await a.bringToFront();
        const tab2 = a.locator(".drawer-tab");
        if ((await tab2.count()) && (await tab2.getAttribute("aria-expanded")) === "true") {
          await tab2.click();
          await a.waitForTimeout(700);
        }
        await a.evaluate(() => window.scrollTo(0, 0));
        await a.waitForTimeout(400);
      }

      await a.locator(".sudoku-cell").nth(4).click();
      await a.waitForTimeout(200);
      await mark(a).click();
      await a.waitForTimeout(800);
      await expect(sheet(a)).toBeVisible();

      const geo = await a.evaluate(() => {
        // THE VISIBLE ONE. The head mounts two `AttributionCard`s — desktop and mobile — and
        // one of them is `display: none`. At phone width the hidden one comes FIRST in the DOM,
        // so a bare `querySelector` reads a zero box and every number after it is a fiction.
        const s = [...document.querySelectorAll("[data-lobby]")].find(
          (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
        ) as HTMLElement;
        const sr = s.getBoundingClientRect();
        // The GRID is the union of its cells — no class guess, and it is exactly the surface
        // the lap is measured against.
        const rects = [...document.querySelectorAll(".sudoku-cell")].map((c) =>
          c.getBoundingClientRect(),
        );
        const gr = {
          left: Math.min(...rects.map((r) => r.left)),
          top: Math.min(...rects.map((r) => r.top)),
          right: Math.max(...rects.map((r) => r.right)),
        };
        const cells = rects.map((r) => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 }));
        const lapped = cells.filter(
          (c) => c.x >= sr.left && c.x <= sr.right && c.y >= sr.top && c.y <= sr.bottom,
        );
        return {
          rows: s.querySelectorAll(".pl-row").length,
          sheet: {
            x: +sr.x.toFixed(2),
            y: +sr.y.toFixed(2),
            w: +sr.width.toFixed(2),
            h: +sr.height.toFixed(2),
            bottom: +sr.bottom.toFixed(2),
          },
          grid: {
            x: +gr.left.toFixed(2),
            y: +gr.top.toFixed(2),
            w: +(gr.right - gr.left).toFixed(2),
          },
          lapPx: +Math.max(0, sr.bottom - gr.top).toFixed(2),
          lappedCells: lapped.length,
          lappedCentres: lapped.map((c) => ({ x: +c.x.toFixed(1), y: +c.y.toFixed(1) })),
          chartPx: +(
            (document.querySelector("[data-lobby] .place-chart") as SVGElement)?.getBoundingClientRect()
              .width ?? 0
          ).toFixed(2),
        };
      });

      // WHAT A LAPPED TAP HITS. Every lapped cell's centre, one at a time: the sheet must
      // dismiss and the element under the point must not be a control.
      const hits: { x: number; y: number; tag: string; ctl: boolean; dismissed: boolean }[] = [];
      for (const c of geo.lappedCentres.slice(0, 24)) {
        if ((await sheet(a).count()) === 0) {
          await mark(a).click();
          await a.waitForTimeout(700);
        }
        const under = await a.evaluate(
          ([x, y]) => {
            const el = document.elementFromPoint(x, y);
            const ctl = !!el?.closest("a,button,input,select,textarea,[tabindex]");
            return { tag: el?.tagName.toLowerCase() ?? "(none)", ctl };
          },
          [c.x, c.y],
        );
        await a.mouse.click(c.x, c.y);
        await a.waitForTimeout(400);
        hits.push({
          x: c.x,
          y: c.y,
          tag: under.tag,
          ctl: under.ctl,
          dismissed: (await sheet(a).count()) === 0,
        });
      }

      const row = {
        engine: eng,
        vh,
        L,
        rows: geo.rows,
        sheet: geo.sheet,
        chartPx: geo.chartPx,
        lapMeasured: geo.lapPx,
        lapLaw: +LAW(vh, L).toFixed(2),
        delta: +(geo.lapPx - LAW(vh, L)).toFixed(2),
        lappedCells: geo.lappedCells,
        tapsProbed: hits.length,
        tapsDismissed: hits.filter((h) => h.dismissed).length,
        tapsOnControl: hits.filter((h) => h.ctl).length,
        controlTags: [...new Set(hits.filter((h) => h.ctl).map((h) => h.tag))],
      };
      laps.push(row);
      say(`g8.lap.${vh}.L${L}`, row);
      if (b) await b.close();
      await ctx.close();
      writeFileSync(
        join(OUT, `phone2-${eng}-${vh}-L${L}.json`),
        JSON.stringify({ engine: eng, laps, ...bank }, null, 1),
      );
      expect(Math.abs(row.delta), `G8 lap law ${vh} L${L}`).toBeLessThanOrEqual(4);
      expect(row.tapsOnControl, `G8 no lapped tap reaches a control`).toBe(0);
      expect(row.tapsDismissed, `G8 every lapped tap dismisses`).toBe(row.tapsProbed);
    });
  }
}
