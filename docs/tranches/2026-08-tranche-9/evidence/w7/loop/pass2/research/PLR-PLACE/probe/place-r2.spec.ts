/**
 * PLR-PLACE · pass-2 RESEARCH probe. Everything here reads HEAD (the main tree, served by this
 * lane's own :4243) — no product file is touched and nothing is injected into the product's own
 * state. The listeners the probe installs are CAPTURE-phase observers; the one place it calls
 * `preventDefault` it does so from its own listener, to measure what a one-line cure would buy.
 *
 * Five arms, both engines:
 *   A  the focus seam — what `GameBoard.vue:471-477`'s predicate sees when a head button is
 *      pressed for real, by mouse and by Tab, with and without a pointerdown preventDefault.
 *   B  board top as a function of viewport height at 390 coarse (the G8 re-cut's first variable).
 *   C  THE CELLS-STOLEN PROBE — elementFromPoint over every cell under an open head disclosure,
 *      plus "does a tap there dismiss it". Banked for the wave; run here against HEAD's own
 *      incumbent overlay (the mobile attribution card).
 *   D  `.controls-card` / `.action-bar` with the drawer SHUT and OPEN at 390x844 (which condition
 *      can carry a +32.83 delta at all).
 *   E  the popover-80% ground: the composited bytes inside the open card where it laps the board.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(__dirname, "..", "logs");
mkdirSync(OUT, { recursive: true });

const out: Record<string, unknown> = {};

async function boot(page: Page, url = "/?game=sudoku") {
  await page.goto(url);
  await page.waitForSelector('[role="grid"]', { timeout: 30000 });
  await page.waitForTimeout(1200); // the boot wash + the boil settle
}

test.describe.configure({ mode: "serial" });

// ── A · THE FOCUS SEAM ────────────────────────────────────────────────────────────────────────
test("A · what the focusout predicate sees when a head button is pressed", async ({
  page,
  browserName,
}) => {
  await boot(page);

  // The predicate, verbatim from GameBoard.vue:471-477, as an observer. It records rather than
  // acts, so the product's own handler runs untouched.
  await page.evaluate(() => {
    const w = window as unknown as { __seam: unknown[] };
    w.__seam = [];
    const grid = document.querySelector('[role="grid"]')!;
    grid.addEventListener(
      "focusout",
      (e) => {
        const ev = e as FocusEvent;
        const next = ev.relatedTarget as Node | null;
        w.__seam.push({
          relatedTarget: next
            ? ((next as HTMLElement).className || (next as HTMLElement).tagName)
            : null,
          nullWouldGoOut: !next || !grid.contains(next),
        });
      },
      true,
    );
  });

  const cell = page.locator('[role="grid"] input').first();
  await cell.click();
  await page.waitForTimeout(150);
  const focusedBefore = await page.evaluate(
    () => document.activeElement?.tagName + "." + (document.activeElement?.className || ""),
  );

  // A1 — a REAL mouse press on the head's own button (the incumbent @mbabb trigger; the
  // family's sign is the same class of surface in the same corner).
  const trigger = page.locator(".mobile-attribution .attribution-trigger, .corner-left .attribution-trigger").first();
  await trigger.click();
  await page.waitForTimeout(200);
  const a1 = await page.evaluate(() => {
    const w = window as unknown as { __seam: unknown[] };
    const seam = w.__seam.slice();
    w.__seam.length = 0;
    return {
      seam,
      active: document.activeElement?.tagName + "." + (document.activeElement?.className || ""),
      cardOpen: !!document.querySelector(".hover-card.is-open"),
    };
  });

  // A2 — the same press with a pointerdown preventDefault installed by THIS probe, in capture,
  // on the trigger only. This is the one-line cure auditioned, not applied.
  await page.keyboard.press("Escape");
  await page.evaluate(() => {
    document.querySelectorAll(".attribution-trigger").forEach((el) =>
      el.addEventListener("pointerdown", (e) => e.preventDefault(), true),
    );
  });
  await cell.click();
  await page.waitForTimeout(150);
  await trigger.click();
  await page.waitForTimeout(200);
  const a2 = await page.evaluate(() => {
    const w = window as unknown as { __seam: unknown[] };
    const seam = w.__seam.slice();
    w.__seam.length = 0;
    return {
      seam,
      active: document.activeElement?.tagName + "." + (document.activeElement?.className || ""),
      cardOpen: !!document.querySelector(".hover-card.is-open"),
    };
  });

  // A3 — Tab from the cell. A keyboard reader genuinely leaves the grid; what does the
  // predicate see then?
  await cell.click();
  await page.waitForTimeout(150);
  await page.keyboard.press("Tab");
  await page.waitForTimeout(200);
  const a3 = await page.evaluate(() => {
    const w = window as unknown as { __seam: unknown[] };
    const seam = w.__seam.slice();
    w.__seam.length = 0;
    return {
      seam,
      active: document.activeElement?.tagName + "." + (document.activeElement?.className || ""),
    };
  });

  // A4 — does Enter on a button that carries BOTH @click and @keydown.enter toggle twice?
  // The incumbent AttributionCard is the exact idiom PlayerSign copied.
  await page.locator(".attribution-trigger").first().focus();
  const beforeEnter = await page.evaluate(
    () => !!document.querySelector(".hover-card.is-open"),
  );
  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);
  const afterEnter = await page.evaluate(() => ({
    open: !!document.querySelector(".hover-card.is-open"),
    ariaExpanded: document
      .querySelector(".attribution-trigger")
      ?.getAttribute("aria-expanded"),
  }));
  await page.keyboard.press("Space");
  await page.waitForTimeout(250);
  const afterSpace = await page.evaluate(() => ({
    open: !!document.querySelector(".hover-card.is-open"),
  }));

  out.A = { browserName, focusedBefore, a1, a2, a3, enter: { beforeEnter, afterEnter, afterSpace } };
  expect(true).toBe(true);
});

// ── B · BOARD TOP × VIEWPORT HEIGHT ───────────────────────────────────────────────────────────
test("B · board top as a function of viewport height at 390 coarse", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await boot(page);
  const rows: unknown[] = [];
  for (const h of [568, 600, 664, 700, 740, 800, 844, 932]) {
    await page.setViewportSize({ width: 390, height: h });
    await page.waitForTimeout(700); // the dock sheet SLIDES — settle before measuring
    rows.push(
      await page.evaluate((vh) => {
        const r = (s: string) => {
          const el = document.querySelector(s);
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
        };
        return {
          vh,
          grid: r('[role="grid"]'),
          boardGroup: r(".board-group"),
          masthead: r("h1"),
          scrollHeight: document.documentElement.scrollHeight,
          scrollY: window.scrollY,
          cellPitch: (() => {
            const c = document.querySelectorAll('[role="grid"] .game-cell');
            if (c.length < 2) return null;
            const a = c[0].getBoundingClientRect();
            return +a.width.toFixed(2);
          })(),
        };
      }, h),
    );
  }
  out.B = rows;
  await ctx.close();
});

// ── C · THE CELLS-STOLEN PROBE (banked for the wave) ─────────────────────────────────────────
test("C · cells stolen by an open head disclosure, and whether a tap there dismisses it", async ({
  browser,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 664 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await boot(page);

  // Open HEAD's own head disclosure with a REAL press (never el.click() in page.evaluate — a
  // programmatic click moves no focus and measures a state no reader can reach).
  await page.locator(".mobile-attribution .attribution-trigger").click();
  await page.waitForTimeout(700);

  const stolen = await page.evaluate(() => {
    const overlay = document.querySelector(".mobile-attribution .hover-card");
    const cells = [...document.querySelectorAll('[role="grid"] .game-cell')];
    const ob = overlay?.getBoundingClientRect() ?? null;
    let taken = 0;
    const takenIdx: number[] = [];
    cells.forEach((c, i) => {
      const b = c.getBoundingClientRect();
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      // "stolen" = the point over the cell's own centre resolves to something that is NOT the
      // cell and IS inside the overlay. `pointer-events: none` therefore reads as not-stolen,
      // which is the honest answer; `inert` would blind this and is asserted against below.
      if (hit && !c.contains(hit) && overlay?.contains(hit)) {
        taken++;
        takenIdx.push(i);
      }
    });
    return {
      cells: cells.length,
      overlay: ob
        ? { x: +ob.x.toFixed(2), y: +ob.y.toFixed(2), w: +ob.width.toFixed(2), h: +ob.height.toFixed(2) }
        : null,
      overlayPointerEvents: overlay ? getComputedStyle(overlay).pointerEvents : null,
      overlayInert: overlay ? (overlay as HTMLElement).inert ?? null : null,
      grid: (() => {
        const g = document.querySelector('[role="grid"]')!.getBoundingClientRect();
        return { y: +g.y.toFixed(2), h: +g.height.toFixed(2) };
      })(),
      taken,
      takenIdx,
    };
  });

  // Does a tap on a stolen cell dismiss the overlay, or is it swallowed?
  let tapResult: unknown = { skipped: true };
  if (stolen.takenIdx.length) {
    const idx = stolen.takenIdx[0];
    const box = await page.locator('[role="grid"] .game-cell').nth(idx).boundingBox();
    if (box) {
      const before = await page.evaluate(() => !!document.querySelector(".mobile-attribution .hover-card.is-open"));
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(400);
      const after = await page.evaluate(() => ({
        open: !!document.querySelector(".mobile-attribution .hover-card.is-open"),
        active: document.activeElement?.tagName,
      }));
      tapResult = { idx, before, after, dismissed: before && !after.open };
    }
  }

  out.C = { ...stolen, tap: tapResult };
  await ctx.close();
});

// ── D · THE CONTROLS CARD, DRAWER SHUT vs OPEN ────────────────────────────────────────────────
test("D · .controls-card and .action-bar in both drawer states at 390x844", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await boot(page);
  const read = () =>
    page.evaluate(() => {
      const r = (s: string) => {
        const el = document.querySelector(s);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          y: +b.y.toFixed(2),
          h: +b.height.toFixed(2),
          w: +b.width.toFixed(2),
          display: cs.display,
          visibility: cs.visibility,
          inert: (el as HTMLElement).inert ?? null,
        };
      };
      return {
        controlsCard: r(".controls-card"),
        actionBar: r(".action-bar"),
        drawer: r("#controls-drawer"),
        tab: r(".drawer-tab"),
        playControls: r(".play-controls"),
      };
    });

  const shut = await read();
  // Open the drawer with a REAL press on its tab, then settle ~700ms (the sheet SLIDES).
  const tab = page.locator(".drawer-tab").first();
  let opened: unknown = { note: "no .drawer-tab found" };
  if (await tab.count()) {
    await tab.click();
    await page.waitForTimeout(900);
    opened = await read();
  }
  out.D = { shut, opened };
  await ctx.close();
});

// ── E · THE POPOVER-80% GROUND ────────────────────────────────────────────────────────────────
test("E · tokens, and the composited ground the phone gives a head disclosure", async ({
  browser,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 664 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await boot(page);

  const tokens = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const names = [
      "--color-popover",
      "--color-card",
      "--color-background",
      "--color-user-ink",
      "--color-pencil-graphite",
      "--ink-press-quiet",
      "--ink-press-rule",
      "--color-peer-cursor-ink",
      "--tap-floor",
      "--color-border",
    ];
    const o: Record<string, string> = {};
    for (const n of names) o[n] = cs.getPropertyValue(n).trim();
    return o;
  });

  await page.locator(".mobile-attribution .attribution-trigger").click();
  await page.waitForTimeout(700);
  const cardBox = await page.locator(".mobile-attribution .hover-card").boundingBox();
  let png: Buffer | null = null;
  if (cardBox) {
    png = await page.screenshot({
      clip: {
        x: Math.max(0, cardBox.x),
        y: Math.max(0, cardBox.y),
        width: Math.min(cardBox.width, 390 - Math.max(0, cardBox.x)),
        height: Math.min(cardBox.height, 664 - Math.max(0, cardBox.y)),
      },
    });
    writeFileSync(join(OUT, `ground-${test.info().project.name}.png`), png);
  }
  out.E = { tokens, cardBox };
  await ctx.close();
});

test.afterAll(async ({}, testInfo) => {
  writeFileSync(
    join(OUT, `r2-${testInfo.project.name}.json`),
    JSON.stringify(out, null, 2),
  );
});
