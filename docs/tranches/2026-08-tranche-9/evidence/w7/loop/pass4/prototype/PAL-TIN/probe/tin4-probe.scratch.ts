// PAL-TIN pass-4 SCRATCH probe — the rows the charter asks for that are not gates.
// Deleted before the lane returns. PRM: frozen — emulateMedia in `boot`.
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY";
const LOCAL = SOLO + "&wire=local";

async function boot(page: Page, url: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
const roster = (page: Page) => page.locator(".controls-card .players-roster .player-row");
async function room(
  browser: import("@playwright/test").Browser,
  n: number,
  opts: { url?: string; touch?: boolean; w?: number; h?: number } = {},
) {
  const ctx = await browser.newContext(
    opts.touch
      ? { hasTouch: true, isMobile: false, viewport: { width: opts.w ?? 390, height: opts.h ?? 844 } }
      : {},
  );
  const a = await ctx.newPage();
  await boot(a, opts.url ?? LOCAL);
  const openDrawer = async (p: Page) => {
    const tab = p.locator(".drawer-tab");
    if ((await tab.count()) && (await tab.isVisible())) {
      const card = p.locator(".controls-card");
      if (!(await card.isVisible())) {
        await tab.click();
        await p.waitForTimeout(900); // the sheet SLIDES (~700 ms) — poll the settled pose
      }
    }
  };
  await openDrawer(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    await boot(p, link);
    await openDrawer(p);
    pages.push(p);
  }
  for (const p of pages) await expect(roster(p)).toHaveCount(n, { timeout: 90000 });
  return { ctx, pages };
}

// ── A · W2 §2.5 — WHAT THE TAPE COVERS, WITH AND WITHOUT THE TALLY ────────────────────────
test("A · the tape's painted box, with the tally and without", async ({ browser }) => {
  test.slow();
  const { ctx, pages } = await room(browser, 7);
  const a = pages[0];
  const empties = await a.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i, k) => ((i as HTMLInputElement).value ? -1 : k))
      .filter((k) => k >= 0),
  );
  const write = async (p: Page, at: number, d: string) => {
    const c = p.locator(".sudoku-cell input").nth(at);
    await c.click();
    await c.fill(d);
    await expect.poll(() => a.locator(".sudoku-cell input").nth(at).inputValue()).toBe(d);
  };
  await write(pages[6], empties[0], "5"); // a lap round the tin — the tape carries a tally
  await write(pages[1], empties[1], "5"); // first pass — no tally
  const read = async (at: number, label: string) => {
    await a.locator(".sudoku-cell").nth(at).hover();
    await expect(a.locator(".attribution-tape")).toHaveCount(1, { timeout: 15000 });
    await a.waitForTimeout(500);
    const r = await a.evaluate(() => {
      const tapeEl = document.querySelector(".attribution-tape")!;
      const label2 = tapeEl.querySelector(".washi-label") ?? tapeEl.firstElementChild!;
      // the PAINTED box: the label's own border box, which is the tinted paper
      const b = label2.getBoundingClientRect();
      const cells = [...document.querySelectorAll(".sudoku-cell")].filter((c) => {
        const q = c.getBoundingClientRect();
        return !(q.right <= b.left || q.left >= b.right || q.bottom <= b.top || q.top >= b.bottom);
      });
      const inputs = cells.filter((c) => c.querySelector("input:not([disabled])"));
      return {
        w: +b.width.toFixed(2),
        h: +b.height.toFixed(2),
        covered: cells.length,
        interactiveCovered: inputs.length,
        tick: tapeEl.querySelectorAll(".roster-tick").length,
        text: (tapeEl.textContent ?? "").trim(),
      };
    });
    console.log(`TAPE ${label}: ${JSON.stringify(r)}`);
    await a.mouse.move(0, 0);
    await expect(a.locator(".attribution-tape")).toHaveCount(0);
    return r;
  };
  const withTally = await read(empties[0], "WITH the tally");
  const other = await read(empties[1], "another author, no tally (slug length differs — NOT the control)");
  // THE CONTROL IS THE SAME TAPE WITH ITS TICK REMOVED: same slug, same font, same anchor, so
  // the delta is the mark's own cost and not the difference between two names.
  await a.locator(".sudoku-cell").nth(empties[0]).hover();
  await expect(a.locator(".attribution-tape")).toHaveCount(1, { timeout: 15000 });
  await a.waitForTimeout(500);
  const ablate = await a.evaluate(() => {
    const tapeEl = document.querySelector(".attribution-tape")!;
    const label = (tapeEl.querySelector(".washi-label") ?? tapeEl.firstElementChild!) as HTMLElement;
    const before = label.getBoundingClientRect();
    const tick = tapeEl.querySelector(".roster-tick") as SVGSVGElement;
    const tb = tick.getBoundingClientRect();
    const cs = getComputedStyle(tick);
    const count = (b: DOMRect) =>
      [...document.querySelectorAll(".sudoku-cell")].filter((c) => {
        const q = c.getBoundingClientRect();
        return !(q.right <= b.left || q.left >= b.right || q.bottom <= b.top || q.top >= b.bottom);
      }).length;
    const coveredBefore = count(before);
    tick.style.display = "none";
    const after = label.getBoundingClientRect();
    const coveredAfter = count(after);
    tick.style.display = "";
    return {
      slug: (tapeEl.textContent ?? "").trim(),
      widthWith: +before.width.toFixed(2),
      widthWithout: +after.width.toFixed(2),
      tickW: +tb.width.toFixed(2),
      tickH: +tb.height.toFixed(2),
      marginInlineStart: cs.marginInlineStart,
      em: +parseFloat(getComputedStyle(label).fontSize).toFixed(3),
      coveredBefore,
      coveredAfter,
    };
  });
  await a.mouse.move(0, 0);
  console.log(
    `TAPE ABLATION (one tape, its own tick hidden): ${JSON.stringify(ablate)} · ` +
      `Δwidth ${(ablate.widthWith - ablate.widthWithout).toFixed(2)} px · ` +
      `cells crossed ${ablate.coveredAfter} → ${ablate.coveredBefore}`,
  );
  console.log(
    `TAPE two-author reading (CONFOUNDED by slug length, reported not claimed): ` +
      `${withTally.w} vs ${other.w} · covered ${other.covered} → ${withTally.covered} · ` +
      `INTERACTIVE covered ${other.interactiveCovered} → ${withTally.interactiveCovered}`,
  );
  await ctx.close();
});

// ── B · THE `you` PILL AT PHONE WIDTH, COARSE ─────────────────────────────────────────────
test("B · the pill at 390x844 hasTouch, five players then seven", async ({ browser }) => {
  test.slow();
  const five = await room(browser, 5, { touch: true });
  const witness = await five.pages[0].evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    hover: matchMedia("(hover: hover)").matches,
    w: innerWidth,
    h: innerHeight,
  }));
  const wit2 = await five.pages[1].evaluate(() => matchMedia("(pointer: coarse)").matches);
  console.log(`REGIME ${JSON.stringify(witness)} · page2 coarse ${wit2}`);
  await five.pages[0].locator(".controls-card").scrollIntoViewIfNeeded();
  const pill5 = await five.pages[0].locator(".player-self").first().boundingBox();
  const rows5 = await five.pages[0].evaluate(() =>
    [...document.querySelectorAll(".players-roster .player-row .player-row-cells > *")].map(
      (e) => `${e.className}:${e.getBoundingClientRect().x.toFixed(2)}`,
    ),
  );
  await five.ctx.close();
  const seven = await room(browser, 7, { touch: true });
  await seven.pages[0].locator(".controls-card").scrollIntoViewIfNeeded();
  const pill7 = await seven.pages[0].locator(".player-self").first().boundingBox();
  const rows7 = await seven.pages[0].evaluate(() =>
    [...document.querySelectorAll(".players-roster .player-row .player-row-cells > *")].map(
      (e) => `${e.className}:${e.getBoundingClientRect().x.toFixed(2)}`,
    ),
  );
  const ticks = await seven.pages[0].locator(".roster-tick").count();
  console.log(
    `PHONE pill x five ${pill5!.x} → seven ${pill7!.x} (Δ ${(pill7!.x - pill5!.x).toFixed(3)}) · ` +
      `ticks ${ticks} · rows5 ${rows5.join("|")} · rows7[0..${rows5.length - 1}] ${rows7
        .slice(0, rows5.length)
        .join("|")}`,
  );
  await seven.ctx.close();
});

// ── C · THE DRAWABLE BAND, READ ON A LIVE CELL ────────────────────────────────────────────
test("C · what is left to draw in, on a live 9x9 desk cell and a 16x16 phone cell", async ({
  browser,
}) => {
  test.slow();
  for (const [label, size, touch] of [
    ["9x9 desk", 3, false],
    ["16x16 phone", 4, true],
  ] as const) {
    const ctx = await browser.newContext(
      touch ? { hasTouch: true, viewport: { width: 390, height: 844 } } : {},
    );
    const p = await ctx.newPage();
    await boot(p, `./?size=${size}&difficulty=EASY`);
    const r = await p.evaluate(() => {
      const cell = [...document.querySelectorAll(".sudoku-cell")].find((c) =>
        c.querySelector(".glyph-svg path"),
      )!;
      const box = cell.getBoundingClientRect();
      const glyph = cell.querySelector(".glyph-svg") as SVGSVGElement;
      const path = glyph.querySelector("path")!;
      const ink = path.getBoundingClientRect(); // the PAINTED box, stroke included
      const ghost = cell.querySelector(".cell-ghost-path") as SVGPathElement | null;
      const gs = ghost ? getComputedStyle(ghost) : null;
      const ghostBox = ghost ? ghost.getBoundingClientRect() : null;
      const line = document.querySelector(".grid-line") as SVGElement | null;
      const lineW = line ? parseFloat(getComputedStyle(line).strokeWidth) : 0;
      return {
        cell: +box.height.toFixed(2),
        inkTop: +(ink.top - box.top).toFixed(2),
        inkBottom: +(box.bottom - ink.bottom).toFixed(2),
        inkH: +ink.height.toFixed(2),
        ghostStroke: gs ? parseFloat(gs.strokeWidth) : null,
        ghostInset: ghostBox ? +(ghostBox.top - box.top).toFixed(2) : null,
        gridStroke: +lineW.toFixed(2),
      };
    });
    // the free band below the digit, after the ring's outer edge and the grid line's half
    const band =
      r.inkBottom - (r.ghostInset ?? 0) - (r.ghostStroke ?? 0) / 2 - r.gridStroke / 2;
    console.log(`BAND ${label}: ${JSON.stringify(r)} → free band under the digit ${band.toFixed(2)} px`);
    await ctx.close();
  }
});

// ── D · THE FILTER CENSUS AT SIXTEEN ──────────────────────────────────────────────────────
test("D · filterBudget at a nine-player room", async ({ browser }) => {
  test.setTimeout(600000);
  const { ctx, pages } = await room(browser, 9);
  const a = pages[0];
  const census = await a.evaluate(() =>
    [...document.querySelectorAll("*")]
      .filter((e) => {
        const f = getComputedStyle(e).filter;
        return f && f !== "none";
      })
      .map((e) => `${e.tagName.toLowerCase()}${e.getAttribute("class") ? "." + e.getAttribute("class")!.split(" ").join(".") : ""}`),
  );
  console.log(
    `FILTER CENSUS at 9: ${census.length} — ${census.join(" · ")} · roster ticks ${await a
      .locator(".roster-tick")
      .count()}`,
  );
  expect(census.length).toBeLessThanOrEqual(9);
  await ctx.close();
});
