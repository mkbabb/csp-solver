// PASS-6 COPY (ACC-SIX charter row 10): r0/r6-idiom-history/r6-idiom.probe.ts, unchanged (it writes nothing; run -g "heading census").
import { test, expect, type Page } from "@playwright/test";

/**
 * R6 (THE HOUSE IDIOM AND ITS DECIDED HISTORY) — round-zero census probe.
 * READ-ONLY. Measures; asserts nothing it wants to cure.
 */

async function load(page: Page, game = "sudoku") {
  await page.goto(`./?game=${game}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.waitForSelector(".board-wrapper", { timeout: 20000 });
  let last = "";
  await expect
    .poll(
      async () => {
        const now = await page.evaluate(() => {
          const h = document.querySelector(".board-peek-host")?.getBoundingClientRect();
          const c = document.querySelector(".controls-card")?.getBoundingClientRect();
          return `${h?.top}|${h?.height}|${c?.height}`;
        });
        const stable = now === last;
        last = now;
        return stable;
      },
      { timeout: 20000 },
    )
    .toBe(true);
}

const BOX = (sel: string) => {
  const el = document.querySelector(sel);
  if (!el || !el.getClientRects().length) return null;
  const b = el.getBoundingClientRect();
  return {
    top: +b.top.toFixed(2),
    left: +b.left.toFixed(2),
    right: +b.right.toFixed(2),
    bottom: +b.bottom.toFixed(2),
    w: +b.width.toFixed(2),
    h: +b.height.toFixed(2),
  };
};

test("M20 re-measure — the wordmark against the grid, dark, ~900px", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("sudoku-color-scheme", "dark"));
  const out: Record<string, unknown> = {};
  for (const vp of [
    { width: 900, height: 676 },
    { width: 900, height: 500 },
    { width: 900, height: 450 },
  ]) {
    await page.setViewportSize(vp);
    await load(page);
    const r = await page.evaluate(
      ([boxSrc]) => {
        const box = new Function("sel", `return (${boxSrc})(sel)`) as (
          s: string,
        ) => Record<string, number> | null;
        const wm = box(".masthead") ?? box("svg.handwritten-logo");
        const grid = box(".board-cells") ?? box(".board-wrapper");
        let overlapX = 0;
        let overlapY = 0;
        if (wm && grid) {
          overlapX = Math.max(
            0,
            Math.min(wm.right, grid.right) - Math.max(wm.left, grid.left),
          );
          overlapY = Math.max(
            0,
            Math.min(wm.bottom, grid.bottom) - Math.max(wm.top, grid.top),
          );
        }
        const cs = getComputedStyle(document.documentElement);
        return {
          wm,
          grid,
          overlapX: +overlapX.toFixed(2),
          overlapY: +overlapY.toFixed(2),
          mastheadPos: document.querySelector(".masthead")
            ? getComputedStyle(document.querySelector(".masthead")!).position
            : null,
          logoScale: cs.getPropertyValue("--logo-scale").trim(),
          dark: document.documentElement.classList.contains("dark"),
        };
      },
      [BOX.toString()],
    );
    out[`${vp.width}x${vp.height}`] = r;
  }
  console.log("M20-DARK " + JSON.stringify(out, null, 1));
});

test("the heading census — the controls card's group voices", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await load(page);
  // Open the drawer so the card's content is measurable on the desk.
  const tab = page.locator("button.drawer-tab");
  if (await tab.isVisible().catch(() => false)) {
    await tab.click();
    await page.waitForTimeout(900);
  }
  const census = await page.evaluate(() => {
    const read = (el: Element) => {
      const c = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      return {
        text: (el.textContent ?? "").trim().slice(0, 40),
        family: c.fontFamily.split(",")[0].replace(/["']/g, ""),
        size: c.fontSize,
        weight: c.fontWeight,
        transform: c.textTransform,
        tracking: c.letterSpacing,
        color: c.color,
        opacity: c.opacity,
        w: +b.width.toFixed(1),
        h: +b.height.toFixed(1),
      };
    };
    const pick = (sel: string) =>
      [...document.querySelectorAll(sel)].map(read);
    return {
      washiTag: pick(".washi-tag"),
      zoneRowLabel: pick(".zone-row-label"),
      sectionHeading: pick(".section-heading"),
      h2: pick("h2"),
      groupTitleToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--type-group-title")
        .trim(),
      tagToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--type-tag")
        .trim(),
    };
  });
  console.log("HEADING-CENSUS " + JSON.stringify(census, null, 1));
});

test("the focus ring's ink, both themes", async ({ page }) => {
  for (const theme of ["light", "dark"] as const) {
    await page.addInitScript(
      ([t]) => localStorage.setItem("sudoku-color-scheme", t),
      [theme],
    );
    await page.setViewportSize({ width: 1280, height: 800 });
    await load(page);
    const r = await page.evaluate(() => {
      const cs = getComputedStyle(document.documentElement);
      return {
        dark: document.documentElement.classList.contains("dark"),
        focusSketch: cs.getPropertyValue("--color-focus-sketch").trim(),
        crayonBlue: cs.getPropertyValue("--color-crayon-blue").trim(),
        userInk: cs.getPropertyValue("--color-user-ink").trim(),
        progressInk: cs.getPropertyValue("--color-progress-ink").trim(),
        peerInkL: cs.getPropertyValue("--peer-ink-l").trim(),
        washiNeutral: cs.getPropertyValue("--sheet-washi-neutral").trim(),
        drawerGlide: cs.getPropertyValue("--ease-glassGlide").trim(),
        tapFloor: cs.getPropertyValue("--tap-floor").trim(),
      };
    });
    console.log(`TOKENS-${theme} ` + JSON.stringify(r, null, 1));
  }
});

test("the live-filter population on the dev tree", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await load(page);
  await page.waitForTimeout(2500);
  const n = await page.evaluate(() => {
    const rows: Record<string, number> = {};
    let total = 0;
    for (const el of document.querySelectorAll("*")) {
      const c = getComputedStyle(el);
      if (c.filter && c.filter !== "none" && c.display !== "none") {
        total++;
        const key = `${el.tagName.toLowerCase()}.${(el.className && typeof el.className === "string" ? el.className : (el as SVGElement).getAttribute?.("class")) ?? ""} => ${c.filter}`;
        rows[key] = (rows[key] ?? 0) + 1;
      }
    }
    return { total, rows };
  });
  console.log("FILTER-CENSUS-DEV " + JSON.stringify(n, null, 1));
});
