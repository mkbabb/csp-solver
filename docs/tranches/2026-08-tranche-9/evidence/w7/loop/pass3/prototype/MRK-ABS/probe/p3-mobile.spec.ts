/**
 * T9-W7 pass 3 · MRK-ABS PROTOTYPE — G-ABS-11 (the dock sheet, OPENED) and the phone arm.
 *
 * The sheet SLIDES: it is measured only after it has settled (>= 700 ms past the click), and
 * the clipper it is measured against is `.controls-card`, which is the scrolling box. Every
 * Tab-reachable stop inside it must be WHOLE — its ring's reach inside the card's own edges —
 * except the full-width sticky `.icon-btn`, W2's one declared clip, which is named rather than
 * hidden.
 *
 * Also here: the toggle's ring painted at 393 (it is a RANGE — the ornament keeps its own
 * offset, and the token supplies colour only), and the ring's thickness on the phone board
 * (the 2.4.11 thickness arm the spec concedes is NOT met there).
 */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MRK-ABS/logs";
mkdirSync(OUT, { recursive: true });

test.use({ viewport: { width: 393, height: 699 } });

test("G-ABS-11 · the dock sheet, opened and settled", async ({ page }, info) => {
  const engine = info.project.name;
  await page.goto("/");
  await page.waitForSelector(".board-shell .game-cell", { timeout: 60000 });
  await page.waitForTimeout(900);

  await expect(page.locator(".drawer-tab")).toHaveCount(1);
  await page.locator(".drawer-tab").first().click();
  await expect(page.locator("#controls-drawer .controls-card")).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(900); // the sheet SLIDES — settle past it before measuring

  const dock = await page.evaluate(() => {
    const card = document.querySelector("#controls-drawer .controls-card") as HTMLElement;
    const cr = card.getBoundingClientRect();
    const sel = 'a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])';
    const stops: Record<string, unknown>[] = [];
    for (const n of Array.from(card.querySelectorAll(sel)) as HTMLElement[]) {
      const r = n.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const cs = getComputedStyle(n);
      const reach = (parseFloat(cs.outlineOffset) || 0) + (parseFloat(cs.outlineWidth) || 0);
      const cls = (n.className || "").toString().trim().split(/\s+/).slice(0, 2).join(".");
      const clear = Math.min(r.left - reach - cr.left, cr.right - (r.right + reach), r.top - reach - cr.top, cr.bottom - (r.bottom + reach));
      stops.push({
        stop: `${n.tagName.toLowerCase()}.${cls}`,
        reach,
        clearPx: +clear.toFixed(2),
        whole: clear >= 0,
        sticky: getComputedStyle(n).position === "sticky" || !!n.closest("[style*='sticky']"),
      });
    }
    return {
      cardRect: [cr.x, cr.y, cr.width, cr.height].map((v) => +v.toFixed(2)),
      cardOverflow: getComputedStyle(card).overflow,
      stops,
    };
  });
  const notWhole = (dock.stops as any[]).filter((s) => !s.whole);
  writeFileSync(`${OUT}/dock-${engine}.json`, JSON.stringify({ engine, ...dock, notWhole }, null, 2));
  console.log(
    `[dock ${engine}] ${dock.stops.length} stops · not WHOLE ${notWhole.length}: ${notWhole
      .map((s: any) => `${s.stop} ${s.clearPx}px`)
      .join(" | ")}`,
  );
  expect(dock.stops.length).toBeGreaterThan(0);
});

test("the toggle's ring at 393, and the phone board's ring thickness", async ({ page }, info) => {
  const engine = info.project.name;
  await page.goto("/?size=4"); // 16x16 — the widest board, the thinnest ring
  await page.waitForSelector(".board-shell .game-cell", { timeout: 120000 });
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
  await page.waitForTimeout(900);
  const board = await page.evaluate(() => {
    const inp = document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")[0];
    inp?.focus();
    const grid = document.querySelector(".board-shell svg.hand-drawn-grid") as SVGSVGElement;
    return { boardPx: +grid.getBoundingClientRect().width.toFixed(2) };
  });
  await page.keyboard.press("Shift");
  await page.waitForTimeout(400);
  const ring = await page.evaluate(() => {
    const p = document.querySelector(".board-shell .game-cell .cell-ghost-path") as SVGPathElement;
    const m = p.getScreenCTM()!;
    return {
      strokePx: +(parseFloat(getComputedStyle(p).strokeWidth) * m.a).toFixed(3),
      strokeOpacity: getComputedStyle(p).strokeOpacity,
    };
  });
  await page.goto("/");
  await page.waitForSelector("button.sun-moon-toggle", { timeout: 40000 });
  await page.waitForTimeout(700);
  await page.locator("button.sun-moon-toggle").first().evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Shift");
  await page.waitForTimeout(400);
  const toggle = await page.locator("button.sun-moon-toggle").first().evaluate((n: HTMLElement) => {
    const cs = getComputedStyle(n);
    return {
      outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
      offset: cs.outlineOffset,
      widthPx: parseFloat(cs.outlineWidth) || 0,
      focusVisible: n.matches(":focus-visible"),
    };
  });
  writeFileSync(`${OUT}/phone-${engine}.json`, JSON.stringify({ engine, board, ring, toggle }, null, 2));
  console.log(`[phone ${engine}] boardPx ${board.boardPx} · ring stroke ${ring.strokePx}px @ ${ring.strokeOpacity} · toggle ${JSON.stringify(toggle)}`);
  expect(toggle.widthPx).toBeGreaterThan(0);
});
