/** NOTE-LEDGER pass-1 PROTOTYPE — the crops. Six, each cited, each ≤150 KB. */
import { test } from "@playwright/test";
import { join } from "node:path";
import { boardReady, armHint, armRefusal, ledger, geometry, FRAMES, bank } from "./lib";

test("FRAME 1/2 — the phone's two-line column against the board's foot and the ribbon", async ({
  browser,
  browserName,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: browserName === "chromium",
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await armHint(page);
  await armRefusal(page);
  await page.waitForTimeout(500);
  const g = await geometry(page);
  bank(`frame-390-light-${browserName}.json`, { lines: await ledger(page), geometry: g });
  await page.screenshot({
    path: join(FRAMES, `390x844-light-two-lines-${browserName}.png`),
    clip: { x: 0, y: 555, width: 390, height: 155 },
  });
  await ctx.close();
});

test("FRAME 3 — the tightest rig, dark", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium");
  const ctx = await browser.newContext({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await boardReady(page);
  await armHint(page);
  await armRefusal(page);
  await page.waitForTimeout(500);
  bank(`frame-360-dark-${browserName}.json`, {
    lines: await ledger(page),
    geometry: await geometry(page),
  });
  await page.screenshot({
    path: join(FRAMES, "360x740-dark-two-lines.png"),
    clip: { x: 0, y: 510, width: 360, height: 150 },
  });
  await ctx.close();
});

test("FRAME 4 — the desk's trailing berth", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium");
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await armHint(page);
  await armRefusal(page);
  await page.waitForTimeout(500);
  const g = await geometry(page);
  bank(`frame-1280-light-${browserName}.json`, { lines: await ledger(page), geometry: g });
  const y = Math.max(0, (g.strip?.y ?? 700) - 26);
  await page.screenshot({
    path: join(FRAMES, "1280x800-light-trailing-berth.png"),
    clip: { x: (g.strip?.x ?? 300) - 8, y, width: 660, height: 76 },
  });
  await ctx.close();
});

// t=125 is the beat the brief names; t=42 is where the gesture is actually legible, because
// `--ease-noteWrite` is a fast ease-out (at half the duration the mover is already ~93% home).
for (const t of [125, 42]) {
test(`FRAME 5 — the push at t=${t}ms`, async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium");
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  await armHint(page);
  await page.waitForTimeout(500);
  // FREEZE BEFORE THE PUSH, not after it: a `fill: backwards` animation is not retained once
  // it finishes, so `getAnimations()` after the act returns nothing and a "frozen" shot is
  // really the settled column (it was — `frozen: []`). The mover is caught at birth by
  // patching `Element.animate`, and the ink's own CSS write-in by a negative delay.
  await page.evaluate((t) => {
    const style = document.createElement("style");
    style.textContent = `.margin-note-ink { animation-play-state: paused !important; animation-delay: -${t}ms !important; }`;
    document.head.appendChild(style);
    const w = window as unknown as { __nlFrozen: Array<{ el: string; t: number | null }> };
    w.__nlFrozen = [];
    const native = Element.prototype.animate;
    Element.prototype.animate = function (...args: Parameters<Element["animate"]>) {
      const a = native.apply(this, args);
      a.pause();
      a.currentTime = t;
      w.__nlFrozen.push({ el: (this as HTMLElement).className, t: a.currentTime as number });
      return a;
    };
  }, t);
  await armRefusal(page);
  const frozen = await page.evaluate(
    () => (window as unknown as { __nlFrozen: unknown[] }).__nlFrozen,
  );
  bank(`frame-push-t${t}ms.json`, { frozen, lines: await ledger(page) });
  await page.screenshot({
    path: join(FRAMES, `390x844-push-t${t}.png`),
    clip: { x: 0, y: 580, width: 300, height: 70 },
  });
  await ctx.close();
});
}
