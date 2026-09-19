/**
 * NOTE-LEDGER pass 1 — THE PEER ROW, on the wire.
 *
 * R3's round-zero census left this one un-measured ("joining multiplayer is un-measured on the
 * wire here") and settled it from the source path: a peer's value routes
 * `useGameState.ts:375 sessionSource.applyValue` → `applyCellValue` → `:487 hintReasoning = null`.
 * This probe runs it on two live pages (the estate's own `?wire=local` harness, R5's rig) and
 * reads YOUR margin after SOMEONE ELSE writes.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
const OUT = process.env.NL_OUT || join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });

const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator('[role="grid"] [role="gridcell"]').count(), { timeout: 40000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(1200);
}

const note = (p: Page) =>
  p.evaluate(() => {
    const n = document.querySelector(".margin-note");
    return n ? { text: (n.textContent || "").trim(), cls: n.className } : null;
  });

test("NL-7 PEER — a peer's digit against your standing note", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await a.goto(SOLO);
  await settled(a);

  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled({ timeout: 20000 });
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const room = a.url();

  const b = await ctx.newPage();
  await b.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await b.goto(room);
  await settled(b);

  const rows: unknown[] = [];

  // 1 — A JOIN alone (B has arrived; nobody has written).
  await a.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await a.keyboard.press("h");
  await a.waitForTimeout(900);
  rows.push({ act: "your hint, armed (B already joined)", aNote: await note(a) });

  // 2 — the PEER writes a digit somewhere else on the board.
  const wrote = await b.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
    const empty = inputs.filter((i) => !i.value);
    const target = empty[empty.length - 1];
    target?.focus();
    return !!target;
  });
  await b.keyboard.press("5");
  await b.waitForTimeout(1500);
  rows.push({ act: "PEER types a digit elsewhere", wrote, aNote: await note(a), bNote: await note(b) });

  // 3 — re-arm, then the peer writes on the very cell your note names.
  await a.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await a.keyboard.press("h");
  await a.waitForTimeout(900);
  const armed = await note(a);
  await b.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await b.keyboard.press("7");
  await b.waitForTimeout(1500);
  rows.push({ act: "PEER types on the cell your note names", armed, aNote: await note(a) });

  writeFileSync(join(OUT, `peer-${browserName}.json`), JSON.stringify(rows, null, 2));
  // eslint-disable-next-line no-console
  console.log(rows.map((r) => JSON.stringify(r)).join("\n"));
  await ctx.close();
});
