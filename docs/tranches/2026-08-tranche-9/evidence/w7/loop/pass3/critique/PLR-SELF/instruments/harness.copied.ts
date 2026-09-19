/**
 * PLR-SELF pass-2 PROTOTYPE probe — the shared harness.
 *
 * Runs against this lane's own dev server (127.0.0.1:4241, private vite cacheDir) serving the
 * pass-2 prototype worktree `wf_8630d340-e56-52`. Both engines. Every reading printed with a
 * `P3SELF|` prefix so the bank is one grep.
 */
import { expect, type Page, type Browser, type BrowserContext } from "@playwright/test";

export const SOLO = "./?size=3&difficulty=EASY&wire=local";
export const DESK = { width: 1280, height: 800 };
export const PHONE_TALL = { width: 390, height: 844 };
export const PHONE_SHORT = { width: 390, height: 664 };
export const say = (o: unknown) => console.log(`P3SELF|${JSON.stringify(o)}`);

export async function settled(page: Page): Promise<void> {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  // `.game-cell` is the four other families' cell; `.sudoku-cell` is sudoku's. Both, so the AA
  // arm can load futoshiki without waiting 60s for a selector that game never mounts.
  await expect
    .poll(() => page.locator(".game-cell .glyph-svg, .sudoku-cell .glyph-svg").count(), {
      timeout: 60000,
    })
    .toBeGreaterThan(0);
}

/** The invite verb, through the drawer if the dock has it. The dock SLIDES — settle its pose. */
export async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  if (!(await verb.isVisible())) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700);
  }
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  // THE URL IS STAMPED BEFORE THE WIRE IS LISTENING, and a `hi` posted into that gap reaches
  // nobody — the flake that ate three gate runs. Self's own row appearing in the roster is the
  // proof the session has minted and the channel is up.
  await expect
    .poll(() => page.locator(".players-roster .player-row").count(), { timeout: 20000 })
    .toBe(1);
  return page.url();
}

/** Synthetic `hi` frames — a room of N without N browser pages. */
export async function addPeers(page: Page, n: number, from = 1): Promise<void> {
  const room = new URL(page.url()).searchParams.get("s")!;
  await page.evaluate(
    ({ room, n, from }) => {
      const ch = new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < n; i++)
        ch.postMessage({ kind: "hi", data: {}, from: `synth-${from + i}` });
      // Closing in the same task can drop a queued post; let the event loop turn first.
      setTimeout(() => ch.close(), 0);
    },
    { room, n, from },
  );
  await expect
    .poll(() => page.locator(".players-roster .player-row").count(), { timeout: 20000 })
    .toBe(n + from);
}

/** The painted mark (the head mounts two instances; one is `md:hidden`). */
export const mark = (page: Page) => page.locator("[data-player-mark]:visible");
export const lobby = (page: Page) => page.locator("[data-lobby]:visible");

/** The sheet SLIDES (150ms) — settle before measuring it open. */
export async function openSheet(page: Page): Promise<void> {
  await mark(page).click();
  await page.waitForTimeout(320);
}

/** The filter census, polled to a settled value. R6 law 9 / L1: EXACTLY 9. */
export async function settleFilters(page: Page): Promise<number> {
  const count = () =>
    page.evaluate(
      () =>
        [...document.querySelectorAll("*")].filter((e) => {
          const cs = getComputedStyle(e);
          return cs.filter && cs.filter !== "none" && cs.display !== "none";
        }).length,
    );
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const n = await count();
    if (n === last) return n;
    last = n;
    await page.waitForTimeout(250);
  }
  return last;
}

export async function coarseCtx(
  browser: Browser,
  viewport: { width: number; height: number },
  isMobile: boolean,
): Promise<BrowserContext> {
  return browser.newContext({
    viewport,
    deviceScaleFactor: 3,
    hasTouch: true,
    isMobile,
  });
}
