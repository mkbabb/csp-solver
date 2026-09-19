/**
 * PLR-PLACE pass-1 CRITIQUE probe — the rows the prototype's own instruments did not ask.
 *
 * K · the KEYBOARD path onto the sign (the prototype's I3 pressed with a MOUSE only)
 * E · Escape, and focus leaving the head, with the sheet open
 * S · the RING: `self` is `selfCursor`, which is null until you have focused a cell — and null
 *     again the moment `your cell` is `hidden`, so your own sheet loses you too
 * C · filterBudget with the sheet open (re-run independently)
 * L · the well's live regions
 * P · painted-byte contrast of the ring and a dot, dpr 1, this lane's own decode
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const OUT = join(__dirname, "..", "logs");
const MARK = "[data-player-mark]";
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  console.log(`CRIT|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);
};

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
async function visibleMark(page: Page) {
  const marks = page.locator(MARK);
  const n = await marks.count();
  for (let i = 0; i < n; i++) {
    if (await marks.nth(i).isVisible()) return marks.nth(i);
  }
  throw new Error("no visible mark");
}
const lum = (r: number, g: number, b: number) => {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 2.4 / 2.4 + 0, 1);
  };
  void f;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a: number[], b: number[]) => {
  const l1 = lum(a[0], a[1], a[2]);
  const l2 = lum(b[0], b[1], b[2]);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return +((hi + 0.05) / (lo + 0.05)).toFixed(2);
};

test("CRITIC — keyboard, escape, the ring, the budget, the bytes", async ({
  browser,
}, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);

  // ── K · the keyboard onto the sign ────────────────────────────────────────────────────
  const mark = await visibleMark(a);
  // K0 — is it on the tab route at all, and after how many stops?
  await a.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  let stops = -1;
  for (let i = 1; i <= 20; i++) {
    await a.keyboard.press("Tab");
    const isMark = await a.evaluate(() => !!document.activeElement?.closest("[data-player-mark]"));
    if (isMark) {
      stops = i;
      break;
    }
  }
  rec("k0.tabStopsToMark", stops);

  await mark.focus();
  await a.keyboard.press("Enter");
  await a.waitForTimeout(900);
  rec("k1.enter.lobbyCount", await a.locator("[data-lobby]").count());
  rec("k1.enter.ariaExpanded", await mark.getAttribute("aria-expanded"));

  // K2 — Space (the button's other activation)
  await mark.focus();
  await a.keyboard.press("Space");
  await a.waitForTimeout(900);
  rec("k2.space.lobbyCount", await a.locator("[data-lobby]").count());
  const openedBySpace = (await a.locator("[data-lobby]").count()) > 0;
  if (openedBySpace) {
    await a.keyboard.press("Space");
    await a.waitForTimeout(500);
    rec("k2.space.closesAgain", (await a.locator("[data-lobby]").count()) === 0);
  }

  // K3 — the mouse control: the press this prototype measured
  await mark.click();
  await a.waitForTimeout(900);
  rec("k3.click.lobbyCount", await a.locator("[data-lobby]").count());

  // ── E · Escape and focus flight, sheet open ──────────────────────────────────────────
  await a.keyboard.press("Escape");
  await a.waitForTimeout(400);
  rec("e1.escape.lobbyStillOpen", (await a.locator("[data-lobby]").count()) > 0);
  await a.keyboard.press("Tab");
  await a.keyboard.press("Tab");
  await a.waitForTimeout(300);
  rec("e2.tabbedAway.lobbyStillOpen", (await a.locator("[data-lobby]").count()) > 0);
  rec(
    "e3.focusAfterTwoTabs",
    await a.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el ? `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}|${el.getAttribute("aria-label") || el.textContent?.trim().slice(0, 24) || ""}` : "none";
    }),
  );
  // is anything INSIDE the open sheet focusable? (a disclosure a keyboard reader can enter)
  rec(
    "e4.focusablesInsideSheet",
    await a.evaluate(
      () =>
        document.querySelectorAll(
          '[data-lobby] a,[data-lobby] button,[data-lobby] [tabindex]:not([tabindex="-1"])',
        ).length,
    ),
  );

  // ── C · the budget with the sheet open (solo) ────────────────────────────────────────
  await expect.poll(() => census(a), { timeout: 30000 }).toBe(9);
  rec("c1.budget.sheetOpen.solo", await census(a));

  // ── S · the ring ─────────────────────────────────────────────────────────────────────
  // S1 — the sheet opened before the reader has touched the board
  rec("s1.selfRing.beforeAnyFocus", await a.locator("[data-lobby] .chart-self").count());
  rec("s1.chartExists", await a.locator("[data-lobby] .place-chart").count());
  // S2 — focus a cell, reopen
  await a.locator(".sudoku-cell").nth(40).click();
  await a.waitForTimeout(300);
  rec("s2.selfRing.afterFocus", await a.locator("[data-lobby] .chart-self").count());

  // ── L · live regions in the well ─────────────────────────────────────────────────────
  rec(
    "l1.liveRegionsInWell",
    await a.evaluate(() => {
      const card = document.querySelector(".controls-card");
      if (!card) return null;
      return [...card.querySelectorAll("[aria-live],[role=log],[role=status],[role=alert]")].map(
        (e) =>
          `${(e.className || "").toString().split(" ")[0]}|${e.getAttribute("role") || ""}|${e.getAttribute("aria-live") || ""}`,
      );
    }),
  );

  // ── the `your cell` control, and what `hidden` does to YOUR OWN sheet ────────────────
  const hidden = a.locator(".controls-card").getByText("hidden", { exact: true });
  rec("h0.hiddenOptionVisibleSolo", await hidden.count());
  if (await hidden.count()) {
    await hidden.first().click();
    await a.waitForTimeout(400);
    await a.locator(".sudoku-cell").nth(30).click();
    await a.waitForTimeout(400);
    const openNow = (await a.locator("[data-lobby]").count()) > 0;
    if (!openNow) {
      await (await visibleMark(a)).click();
      await a.waitForTimeout(800);
    }
    rec("h1.selfRing.afterHidden", await a.locator("[data-lobby] .chart-self").count());
    rec("h2.signLabel.afterHidden", await (await visibleMark(a)).getAttribute("aria-label"));
    // back to shown
    const shown = a.locator(".controls-card").getByText("shown", { exact: true });
    await shown.first().click();
    await a.waitForTimeout(300);
    await a.locator(".sudoku-cell").nth(31).click();
    await a.waitForTimeout(400);
    rec("h3.selfRing.afterShownAgain", await a.locator("[data-lobby] .chart-self").count());
  }

  // ── P · painted bytes: a room of two, the chart at 96px, dpr 1 ──────────────────────
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  if (await verb.count()) {
    await verb.first().click();
    await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
    const link = a.url();
    const b = await ctx.newPage();
    await b.goto(link);
    await settled(b);
    await b.locator(".sudoku-cell").nth(20).click();
    await a.bringToFront();
    await a.waitForTimeout(1600); // placeSettleMs 700 + the wire
    if ((await a.locator("[data-lobby]").count()) === 0) {
      await (await visibleMark(a)).click();
      await a.waitForTimeout(900);
    }
    rec("p0.dots", await a.locator("[data-lobby] .chart-dot").count());
    rec("p0.ring", await a.locator("[data-lobby] .chart-self").count());
    rec("p0.signLabel", await (await visibleMark(a)).getAttribute("aria-label"));
    rec("p0.budget.room.sheetOpen", await census(a));

    const chart = a.locator("[data-lobby] .place-chart");
    const buf = await chart.screenshot();
    writeFileSync(join(OUT, `chart-${eng}.png`), buf);
    const { data, info: meta } = await sharp(buf)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    // best painted byte of each ink family against the sheet's own ground
    const px = (x: number, y: number) => {
      const i = (y * meta.width + x) * meta.channels;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const counts = new Map<string, number>();
    for (let y = 0; y < meta.height; y++) {
      for (let x = 0; x < meta.width; x++) {
        const [r, g, bl] = px(x, y);
        const k = `${r},${g},${bl}`;
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
    }
    const sorted = [...counts.entries()].sort((u, v) => v[1] - u[1]);
    const ground = sorted[0][0].split(",").map(Number);
    // the bluest pixel (the ring / your ink) and the most saturated non-ground ink
    let bluest: number[] = ground;
    let bluestScore = -1;
    for (const [k] of sorted.slice(0, 400)) {
      const [r, g, bl] = k.split(",").map(Number);
      const score = bl - (r + g) / 2;
      if (score > bluestScore) {
        bluestScore = score;
        bluest = [r, g, bl];
      }
    }
    rec("p1.chartPx", { w: meta.width, h: meta.height, distinct: counts.size });
    rec("p1.ground", ground);
    rec("p1.bluestPainted", bluest);
    rec("p1.ratio.bluestVsGround", ratio(bluest, ground));
    rec(
      "p1.top8",
      sorted.slice(0, 8).map(([k, n]) => `${k}×${n}`),
    );
  }

  writeFileSync(join(OUT, `critic-${eng}.json`), JSON.stringify(bank, null, 2));
});
