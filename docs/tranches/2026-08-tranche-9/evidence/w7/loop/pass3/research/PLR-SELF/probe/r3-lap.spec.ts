import { test, expect, type Page } from "@playwright/test";
import { appendFileSync } from "node:fs";

// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto.
// CH-71 priced at HEAD 74a2b5d9: the head's ONE existing disclosure, opened the way a fine
// pointer opens it (hover, not click — the click toggles the hover-opened card SHUT, which is
// why the first cut of this probe read `aria-expanded=false` after clicking).

const OUT = `${__dirname}/readings.txt`;
const say = (k: string, v: unknown) => {
  const line = `${test.info().project.name}\t${k}\t${typeof v === "string" ? v : JSON.stringify(v)}`;
  appendFileSync(OUT, line + "\n");
  console.log(line);
};

async function boot(page: Page, url: string) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 20000 })
    .toBeGreaterThan(0);
}

const lapOf = (page: Page, sel: string) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const c = el.getBoundingClientRect();
    const out: { i: number; owner: string; inter: number }[] = [];
    [...document.querySelectorAll(".sudoku-cell")].forEach((cell, i) => {
      const r = cell.getBoundingClientRect();
      const w = Math.min(c.right, r.right) - Math.max(c.left, r.left);
      const h = Math.min(c.bottom, r.bottom) - Math.max(c.top, r.top);
      if (w <= 0 || h <= 0) return;
      const cx = (Math.max(c.left, r.left) + Math.min(c.right, r.right)) / 2;
      const cy = (Math.max(c.top, r.top) + Math.min(c.bottom, r.bottom)) / 2;
      const top = document.elementFromPoint(cx, cy);
      out.push({
        i,
        owner: top ? `${top.tagName.toLowerCase()}.${String(top.className).split(" ")[0]}` : "null",
        inter: +(w * h).toFixed(1),
      });
    });
    return out;
  }, sel);

test("R5 · the head disclosure OPEN — what it covers, what it costs, how it dismisses", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boot(page, "./?size=3&difficulty=EASY");
  await page.waitForTimeout(2500);

  const census = () =>
    page.evaluate(
      () =>
        [...document.querySelectorAll("*")].filter((el) => {
          const cs = getComputedStyle(el);
          return cs.filter && cs.filter !== "none" && cs.display !== "none";
        }).length,
    );

  // Park the pointer on a live cell first, so focus/hover start where a player's does.
  await page.locator(".sudoku-cell input").nth(40).click();
  const before = await page.evaluate(() => document.activeElement?.className ?? "");
  say("R5.activeElement.before", before);

  // HOVER opens it on a fine pointer (useHoverCard.onHoverEnter); the click would toggle it shut.
  await page.locator(".corner-left").hover();
  await page.waitForTimeout(400);
  say(
    "R5.expanded.after-hover",
    await page.locator(".corner-left .attribution-trigger").getAttribute("aria-expanded"),
  );
  say(
    "R5.card.open-box",
    await page.evaluate(() => {
      const r = document.querySelector(".corner-left .hover-card")!.getBoundingClientRect();
      const cs = getComputedStyle(document.querySelector(".corner-left .hover-card")!);
      return {
        x: +r.x.toFixed(2),
        y: +r.y.toFixed(2),
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
        opacity: cs.opacity,
        visibility: cs.visibility,
        pointerEvents: cs.pointerEvents,
        background: cs.backgroundColor,
        border: cs.borderColor,
      };
    }),
  );
  say("R5.census.open", await census());
  const lap = await lapOf(page, ".corner-left .hover-card");
  say("R5.cells-lapped.open", lap!.length);
  say("R5.lap-owners.open", lap);
  say(
    "R5.activeElement.while-open",
    await page.evaluate(() => document.activeElement?.className ?? ""),
  );

  // Does Escape dismiss the incumbent head disclosure?
  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  say(
    "R5.expanded.after-escape",
    await page.locator(".corner-left .attribution-trigger").getAttribute("aria-expanded"),
  );

  // Does a click on a lapped cell reach the cell while the card is open?
  const target = lap!.find((h) => h.inter > 1000) ?? lap![0];
  await page.locator(".corner-left").hover();
  await page.waitForTimeout(300);
  const cellBox = await page
    .locator(".sudoku-cell")
    .nth(target.i)
    .evaluate((el) => {
      const r = el.getBoundingClientRect();
      const c = document
        .querySelector(".corner-left .hover-card")!
        .getBoundingClientRect();
      return {
        x: (Math.max(c.left, r.left) + Math.min(c.right, r.right)) / 2,
        y: (Math.max(c.top, r.top) + Math.min(c.bottom, r.bottom)) / 2,
      };
    });
  await page.mouse.click(cellBox.x, cellBox.y);
  await page.waitForTimeout(250);
  say("R5.click-through-target-cell", target.i);
  say(
    "R5.activeElement.after-click-on-lapped-cell",
    await page.evaluate(() => document.activeElement?.className ?? ""),
  );
  say(
    "R5.expanded.after-click-on-lapped-cell",
    await page.locator(".corner-left .attribution-trigger").getAttribute("aria-expanded"),
  );
});

test("R6 · the mobile head, portrait phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await boot(page, "./?size=3&difficulty=EASY");
  await page.waitForTimeout(2000);
  say(
    "R6.mobile-attribution",
    await page.evaluate(() => {
      const el = document.querySelector(".mobile-attribution");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const t = el.querySelector(".attribution-trigger")!.getBoundingClientRect();
      return {
        host: { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) },
        trigger: { x: +t.x.toFixed(2), y: +t.y.toFixed(2), w: +t.width.toFixed(2), h: +t.height.toFixed(2) },
      };
    }),
  );
  say("R6.logo", await page.evaluate(() => {
    const r = document.querySelector("svg.handwritten-logo")!.getBoundingClientRect();
    return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  }));
  say("R6.board-cells", await page.evaluate(() => {
    const r = document.querySelector(".board-cells")!.getBoundingClientRect();
    return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  }));
  say("R6.drawer-tab", await page.evaluate(() => {
    const r = document.querySelector(".drawer-tab")!.getBoundingClientRect();
    return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  }));
  // The head's free width on a phone: from the mark's corner to the wordmark's left edge.
  say(
    "R6.head-berth",
    await page.evaluate(() => {
      const a = document.querySelector(".mobile-attribution")!.getBoundingClientRect();
      const l = document.querySelector("svg.handwritten-logo")!.getBoundingClientRect();
      return { attributionRight: +a.right.toFixed(2), logoLeft: +l.left.toFixed(2), gap: +(l.left - a.right).toFixed(2) };
    }),
  );
});
