import { test, expect, type Page } from "@playwright/test";

// T4-WM §1/§5 — the iOS platform-discipline + landscape/iPad geometry probes (lane C). Three
// gate rows live here, all born-RED at HEAD (zero visualViewport references; no overscroll /
// touch-callout / user-select / viewport-fit in src — crit-mobile grep-confirmed):
//   · ios-discipline  — overscroll-behavior, the game-surface callout/user-select/touch-action
//                       suppression, the (preflight-delivered) tap-highlight + text-size-adjust,
//                       viewport-fit=cover, and the toggle's env() safe-area padding.
//   · keyboard-avoid  — with an EMULATED visualViewport (a real keyboard is un-raisable headless),
//                       a focused board cell is scrolled clear of the keyboard band, never eclipsed.
//   · landscape-ipad  — landscape phone + iPad portrait carry no horizontal overflow and take
//                       entry; the large-iPad desktop-drawer layout keeps a ≥44px drawer tap target.
//
// Touch emulation: hasTouch + isMobile makes Chromium match `(pointer: coarse)` — the media the
// coarse branch keys on. The iPhone/iPad descriptors default to webkit, which the chromium-only CI
// lane does not install; every block pins chromium and drives the coarse media by hasTouch/isMobile.

// browserName is pinned once at file scope (setting it inside a describe forces a new worker,
// which Playwright rejects). Each describe overrides only viewport/hasTouch/isMobile — the
// per-device geometry — which are free to vary within a worker.
test.use({ browserName: "chromium", defaultBrowserType: "chromium" });

async function hideDevChrome(page: Page) {
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
}

/** Sudoku is the eager/default game (no lazy-chunk waterfall, no futoshiki §4 bake dependency). */
async function loadSudoku(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  await hideDevChrome(page);
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
  // The board's settle: `.is-active` on the boil frame layer exists once the grid drew in.
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 15000,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ios-discipline — the deliberate platform CSS, on a real coarse (iPhone-ish) device.
// ─────────────────────────────────────────────────────────────────────────────
test.describe("ios-discipline (iPhone-geometry coarse)", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });

  test("the board scene contains overscroll (no rubber-band / scroll-chain)", async ({
    page,
  }) => {
    await loadSudoku(page);
    // The app is an h-screen scene with no inner scroll container → <html> is the scroller.
    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).overscrollBehaviorY,
    );
    expect(behavior).toBe("contain"); // born-RED: 'auto'
  });

  test("game surfaces suppress selection + the double-tap-zoom delay (long-press-clean)", async ({
    page,
  }) => {
    await loadSudoku(page);
    const surface = await page.evaluate(() => {
      const cells = document.querySelector(".board-cells")!;
      const cell = document.querySelector(".sudoku-cell")!; // inherits user-select from .board-cells
      return {
        touchAction: getComputedStyle(cells).touchAction,
        userSelectContainer: getComputedStyle(cells).userSelect,
        userSelectCell: getComputedStyle(cell).userSelect,
      };
    });
    expect(surface.touchAction).toBe("manipulation"); // born-RED: 'auto'
    expect(surface.userSelectContainer).toBe("none"); // born-RED: webkit computed 'text'
    expect(surface.userSelectCell).toBe("none"); // inherited onto the cell

    // -webkit-touch-callout is WebKit-only: Chromium DROPS the unknown property from the parsed
    // CSSOM, so prove it is AUTHORED on the game surface by reading the RAW loaded CSS — the
    // <style> tags vite dev injects + any linked stylesheets (prod). The callout suppression is
    // what keeps the iOS long-press loupe away from lane E's peek hold (device-verified in the
    // owner smoke; user-select:none above is the load-bearing, computable half).
    const calloutAuthored = await page.evaluate(async () => {
      const texts: string[] = [];
      for (const s of Array.from(document.querySelectorAll("style")))
        texts.push(s.textContent ?? "");
      for (const l of Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
      )) {
        try {
          texts.push(await (await fetch(l.href)).text());
        } catch {
          /* cross-origin — skip */
        }
      }
      const css = texts.join("\n");
      // The .board-cells rule authoring `-webkit-touch-callout: none` (dev-expanded or minified).
      return /\.board-cells\b[^{}]*\{[^}]*-webkit-touch-callout\s*:\s*none/.test(css);
    });
    expect(calloutAuthored).toBe(true); // born-RED: no -webkit-touch-callout anywhere in src
  });

  test("tap-highlight + text-size-adjust are delivered (preflight) app-wide", async ({
    page,
  }) => {
    await loadSudoku(page);
    const probe = await page.evaluate(() => {
      const btn = document.querySelector(".sun-moon-toggle")!; // a real interactive
      return {
        tapHighlight: getComputedStyle(btn).getPropertyValue(
          "-webkit-tap-highlight-color",
        ),
        textSizeAdjust: getComputedStyle(document.documentElement).getPropertyValue(
          "-webkit-text-size-adjust",
        ),
      };
    });
    // Transparent = 'rgba(0, 0, 0, 0)' (inherited from the html preflight rule).
    expect(probe.tapHighlight.replace(/\s+/g, "")).toBe("rgba(0,0,0,0)");
    expect(probe.textSizeAdjust).toBe("100%");
  });

  test("viewport opts into the notch + the fixed toggle pads clear of the safe area", async ({
    page,
  }) => {
    await loadSudoku(page);
    const meta = await page.getAttribute('meta[name="viewport"]', "content");
    expect(meta).toContain("viewport-fit=cover"); // born-RED: absent
    expect(meta).not.toContain("maximum-scale"); // pinch-zoom preserved (WCAG 1.4.4)

    // env() resolves to 0 on non-notched Chromium, so prove the safe-area padding is AUTHORED on
    // the fixed toggle chrome (its real clearance is an owner-device smoke row).
    const safeAreaAuthored = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of Array.from(rules)) {
          if (
            rule instanceof CSSStyleRule &&
            rule.selectorText.includes(".corner-right") &&
            rule.style.paddingTop.includes("safe-area-inset")
          )
            return true;
        }
      }
      return false;
    });
    expect(safeAreaAuthored).toBe(true); // born-RED: zero env()/safe-area in src
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// keyboard-avoid — an EMULATED visualViewport (installed before app scripts) lets us shrink the
// visual viewport the way the OS keyboard does. The focused cell must ride clear of the band.
// ─────────────────────────────────────────────────────────────────────────────
test.describe("keyboard-avoid (emulated visualViewport)", () => {
  test.use({
    viewport: { width: 390, height: 640 },
    hasTouch: true,
    isMobile: true,
  });

  test("a focused below-fold cell scrolls clear of the emulated keyboard band", async ({
    page,
  }) => {
    // Replace visualViewport with a controllable fake BEFORE any app script reads it. Nothing else
    // in the app (or pencil-boil) consumes visualViewport — grep-verified — so this is inert
    // elsewhere. window.__setVV(height, offsetTop) shrinks the band + dispatches the resize the
    // composable listens for, exactly as the OS keyboard would.
    await page.addInitScript(() => {
      const fake = new EventTarget();
      let h = window.innerHeight;
      let ot = 0;
      Object.defineProperties(fake, {
        height: { get: () => h, configurable: true },
        width: { get: () => window.innerWidth, configurable: true },
        offsetTop: { get: () => ot, configurable: true },
        offsetLeft: { get: () => 0, configurable: true },
        pageTop: { get: () => ot, configurable: true },
        pageLeft: { get: () => 0, configurable: true },
        scale: { get: () => 1, configurable: true },
      });
      Object.defineProperty(window, "visualViewport", {
        get: () => fake,
        configurable: true,
      });
      (window as unknown as { __setVV: (h: number, ot?: number) => void }).__setVV = (
        nh,
        no,
      ) => {
        h = nh;
        ot = no ?? 0;
        fake.dispatchEvent(new Event("resize"));
      };
    });

    await loadSudoku(page); // 9×9

    const inputs = page.locator(".board-cells input");
    const last = inputs.nth((await inputs.count()) - 1); // bottom-right cell

    // Focus it while the band is still full (no keyboard) — the composable is a no-op here, so the
    // cell stays at its natural spot: the RED state. The band edge is derived FROM the measured
    // cell (mid-cell, clamped to the viewport) rather than a layout-dependent constant — a fixed
    // 360 rode the incidental page height and broke when W7's margin content lifted the board
    // ~20px on the linux runner. Deriving it guarantees the eclipse precondition on any layout.
    await last.tap();
    const beforeBox = (await last.boundingBox())!;
    const KEYBOARD_TOP = Math.min(
      Math.round(beforeBox.y + beforeBox.height / 2), // band edge eclipses the cell's lower half
      620, // never taller than the 640 viewport minus a sane band
    );
    expect(beforeBox.y + beforeBox.height).toBeGreaterThan(KEYBOARD_TOP);

    // Raise the keyboard: shrink the visual viewport + fire resize. The composable must scroll the
    // focused cell up so its bottom clears the band edge.
    await page.evaluate((top) => {
      (window as unknown as { __setVV: (h: number, ot?: number) => void }).__setVV(
        top,
        0,
      );
    }, KEYBOARD_TOP);

    await expect
      .poll(
        async () => {
          const b = (await last.boundingBox())!;
          return b.y + b.height;
        },
        { timeout: 5000 },
      )
      .toBeLessThanOrEqual(KEYBOARD_TOP + 2); // never eclipsed
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// landscape-ipad — §5 geometry probes: no horizontal overflow, entry works, drawer tap target.
// ─────────────────────────────────────────────────────────────────────────────
async function assertNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const el = document.documentElement;
    return { scrollW: el.scrollWidth, clientW: el.clientWidth };
  });
  expect(overflow.scrollW).toBeLessThanOrEqual(overflow.clientW + 2); // 2px sub-pixel tolerance
}

async function assertEntryWorks(page: Page) {
  const inputs = page.locator(".board-cells input");
  const blankIdx = await page.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++)
      if (!cells[i].querySelector(".glyph-svg")) return i;
    return 0;
  });
  const cell = inputs.nth(blankIdx);
  await cell.tap();
  await page.keyboard.type("5");
  await expect(cell).toHaveValue("5");
}

test.describe("landscape phone (~844×390, coarse)", () => {
  test.use({
    viewport: { width: 844, height: 390 },
    hasTouch: true,
    isMobile: true,
  });

  test("no horizontal overflow; entry works (the tall board scrolls vertically)", async ({
    page,
  }) => {
    await loadSudoku(page);
    await assertNoHorizontalOverflow(page);
    await assertEntryWorks(page);
  });
});

test.describe("iPad portrait (<1024, coarse, stacked)", () => {
  test.use({
    viewport: { width: 820, height: 1180 },
    hasTouch: true,
    isMobile: true,
  });

  test("no horizontal overflow; entry works", async ({ page }) => {
    await loadSudoku(page, "?size=4&difficulty=EASY"); // 16×16 — the widest board
    await assertNoHorizontalOverflow(page);
    await assertEntryWorks(page);
  });
});

test.describe("large iPad landscape (≥1024, coarse → desktop drawer layout)", () => {
  test.use({
    viewport: { width: 1194, height: 834 },
    hasTouch: true,
    isMobile: true,
  });

  test("the drawer tab is a clean ≥44px tap target and toggles the rail", async ({
    page,
  }) => {
    await loadSudoku(page);
    const tab = page.locator(".drawer-tab");
    await expect(tab).toBeVisible(); // ≥1024 display:block, even on a coarse device
    const box = (await tab.boundingBox())!;
    expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(44);

    const before = await tab.getAttribute("aria-expanded");
    await tab.tap();
    await expect.poll(() => tab.getAttribute("aria-expanded")).not.toBe(before); // the tap actually toggles the drawer
  });
});
