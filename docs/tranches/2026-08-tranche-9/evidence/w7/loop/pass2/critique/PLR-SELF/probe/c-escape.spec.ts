/**
 * THE SEAM, READ PAST THE GATE THAT GUARDS IT.
 *
 * G11 proves a mouse press on the mark leaves focus in the cell. G8 proves the key contract
 * AFTER `el.focus()`. Neither covers the composition: open with the MOUSE (focus stays in the
 * cell, by design) and then press Escape, whose handler ends `el.value?.focus()`.
 */
import { test, expect, type Page } from "@playwright/test";

const PROTO = "http://127.0.0.1:4245";
const SOLO = "/?size=3&difficulty=EASY&wire=local";
const say = (o: unknown) => console.log(`CRIT|${JSON.stringify(o)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

test("escape after a mouse open", async ({ page }, info) => {
  await page.goto(`${PROTO}${SOLO}`);
  await settled(page);
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  if (!(await verb.isVisible())) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700);
  }
  await verb.click();
  await expect.poll(() => page.locator(".players-roster .player-row").count()).toBe(1);

  // Tap the wire so every frame this page emits is visible.
  await page.evaluate(() => {
    const room = new URL(location.href).searchParams.get("s")!;
    const w = window as unknown as Record<string, unknown>;
    const seen: unknown[] = [];
    w.__frames = seen;
    const ch = new BroadcastChannel(`board:${room}`);
    ch.onmessage = (e: MessageEvent) => seen.push(e.data);
  });

  await page.locator(".sudoku-cell input").first().click();
  await page.waitForTimeout(400);
  await page.evaluate(() => ((window as any).__frames as unknown[]).splice(0));
  const before = await page.evaluate(() => ({
    active: document.activeElement?.tagName + "." + (document.activeElement as HTMLElement).className,
    inCell: !!(document.activeElement as HTMLElement | null)?.closest(".sudoku-cell"),
  }));

  const mark = page.locator("[data-player-mark]:visible");
  await mark.click();
  await page.waitForTimeout(350);
  const opened = await page.evaluate(() => ({
    expanded: document.querySelector("[data-player-mark]")?.getAttribute("aria-expanded"),
    inCell: !!(document.activeElement as HTMLElement | null)?.closest(".sudoku-cell"),
    frames: ((window as any).__frames as { kind?: string }[]).map((f) => f?.kind),
  }));

  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => ({
    expanded: document.querySelector("[data-player-mark]")?.getAttribute("aria-expanded"),
    active:
      document.activeElement?.tagName +
      "." +
      ((document.activeElement as HTMLElement).className || ""),
    onMark: !!(document.activeElement as HTMLElement | null)?.closest("[data-player-mark]"),
    inCell: !!(document.activeElement as HTMLElement | null)?.closest(".sudoku-cell"),
    frames: ((window as any).__frames as { kind?: string }[]).map((f) => f?.kind),
  }));
  say({ t: "escape-seam", engine: info.project.name, before, opened, after });
});
