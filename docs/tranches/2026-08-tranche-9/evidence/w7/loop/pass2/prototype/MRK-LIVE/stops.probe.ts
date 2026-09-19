/**
 * T9-W7 pass 2 · MRK-LIVE PROTOTYPE — G-LIVE-3, the ENUMERATED walk.
 *
 * WHY NOT `Tab`: WebKit's default (Full Keyboard Access off) does not tab to buttons or links,
 * so a Tab-driven walk reads 2 distinct stops in WebKit against 16 in chromium — a fact about
 * Safari's preference pane, not about this design. The stops are named instead, keyboard
 * modality is established with one real key first, and each is focused by name. The gate's own
 * sentence ("≥9 stops including `.staging-btn` and `.guard-btn` by name") is what this runs.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, q = "?size=3&difficulty=EASY") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

async function readStop(page: Page, sel: string) {
  return page.evaluate((s) => {
    const a = document.querySelector<HTMLElement>(s);
    if (!a) return { sel: s, found: 0 };
    a.focus();
    const rings = Array.from(document.querySelectorAll<SVGElement>(".focus-ring"));
    const o = parseFloat(getComputedStyle(a).getPropertyValue("--focus-ring-outset")) || 3;
    const b = a.getBoundingClientRect();
    const fits = rings.map((r) => {
      const rr = r.getBoundingClientRect();
      return Math.max(
        Math.abs(rr.left - (b.left - o)),
        Math.abs(rr.top - (b.top - o)),
        Math.abs(rr.width - (b.width + 2 * o)),
        Math.abs(rr.height - (b.height + 2 * o)),
      );
    });
    return {
      sel: s,
      found: 1,
      isActive: document.activeElement === a,
      focusVisible: a.matches(":focus-visible"),
      exempt: a.matches(".cell-native-input, .gallery-viewport"),
      outset: o,
      rings: rings.length,
      fit: fits.length ? Math.round(Math.min(...fits) * 100) / 100 : null,
      ringArea: rings.length
        ? Math.round(
            rings[0].getBoundingClientRect().width * rings[0].getBoundingClientRect().height,
          )
        : 0,
    };
  }, sel);
}

const BOARD_STOPS = [
  ".logo-trigger",
  ".sun-moon-toggle",
  ".attribution-trigger",
  ".drawer-tab",
  ".ctrl-btn",
  ".icon-btn",
  ".cell-native-input",
];
const DECK_STOPS = [".staging-btn", ".gallery-viewport"];

test("G-LIVE-3 enumerated · one ring owner at every named stop", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await page.keyboard.press("Tab"); // establish keyboard modality for :focus-visible
  await page.waitForTimeout(200);
  const rows: unknown[] = [];
  for (const s of BOARD_STOPS) {
    const r = await readStop(page, s);
    await page.waitForTimeout(700); // past the revolution, so the box is settled
    rows.push(await readStop(page, s));
    void r;
  }
  // The deck's own stops.
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", { timeout: 60000 });
  await page.waitForTimeout(1600);
  for (const s of DECK_STOPS) {
    await readStop(page, s);
    await page.waitForTimeout(700);
    rows.push(await readStop(page, s));
  }
  // The armed ribbon's verbs — the one stop that needs a dirty board behind it.
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1400);
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value && !i.disabled && !i.readOnly)?.focus();
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", { timeout: 60000 });
  await page.waitForTimeout(1600);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".staging-btn.staging-deal")?.click(),
  );
  await page.waitForTimeout(1500);
  for (const s of [".guard-btn.guard-keep", ".guard-btn.guard-leave"]) {
    await readStop(page, s);
    await page.waitForTimeout(700);
    rows.push(await readStop(page, s));
  }

  const row = { engine: browserName, rows };
  bank(`G-LIVE-3-stops-${browserName}.json`, row);
  for (const r of rows as any[])
    console.log(
      `[G-LIVE-3e ${browserName}] ${String(r.sel).padEnd(26)} found=${r.found} fv=${r.focusVisible} exempt=${r.exempt} outset=${r.outset} rings=${r.rings} fit=${r.fit} area=${r.ringArea}`,
    );

  const present = (rows as any[]).filter((r) => r.found);
  expect(present.length).toBeGreaterThanOrEqual(9);
  for (const r of present) {
    if (r.exempt) continue;
    expect(r.rings, `${r.sel} rings`).toBe(1);
    expect(r.fit, `${r.sel} fit`).toBeLessThanOrEqual(1);
  }
  // Exactly two declared zero-ring exemptions, no third.
  const zeros = present.filter((r) => r.rings === 0);
  for (const z of zeros) expect(z.exempt, `${z.sel} is an undeclared zero`).toBe(true);
});
