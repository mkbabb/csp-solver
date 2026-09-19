/**
 * NOTE-LEDGER pass 1 — THE ONE SURVIVING SHAPE, measured.
 *
 * In flow the column moves the board (13.59px per line, measured). The only shape left at 390
 * is an OUT-OF-FLOW column that spends the unclaimed air between the note's foot and the fold's
 * ribbon. This probe mounts exactly that: the strip keeps its one reserved line and the OLDER
 * notes hang below it, absolutely, gapless. It reads the board (must not move), the ribbon's
 * top (must not be covered), and the column's own foot, at two and three notes.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
const OUT = process.env.NL_OUT || join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });

async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
}

const RIGS = [
  { name: "390x844", width: 390, height: 844 },
  { name: "393x699", width: 393, height: 699 },
  { name: "390x664", width: 390, height: 664 },
  { name: "360x740", width: 360, height: 740 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "900x500", width: 900, height: 500 },
];

for (const rig of RIGS)
test(`NL-8 OVERLAY — an out-of-flow column in the air under the note (${rig.name})`, async ({
  browser,
  browserName,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: rig.width, height: rig.height },
    deviceScaleFactor: 3,
    isMobile: browserName === "chromium",
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input")) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(700);

  const read = () =>
    page.evaluate(() => {
      const b = (s: string) => {
        const el = document.querySelector(s);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const n = (v: number) => Math.round(v * 100) / 100;
        return { y: n(r.y), h: n(r.height), bottom: n(r.bottom) };
      };
      const olds = Array.from(document.querySelectorAll("[data-ledger-old]")).map((n) => {
        const r = n.getBoundingClientRect();
        return { y: Math.round(r.y * 100) / 100, bottom: Math.round(r.bottom * 100) / 100 };
      });
      return {
        board: b(".board-wrapper"),
        note: b(".board-margin .margin-note"),
        ribbon: b(".play-controls"),
        olds,
        scrollH: document.documentElement.scrollHeight,
      };
    });

  const base = await read();
  const rows: unknown[] = [{ depth: 1, ...base }];

  for (const depth of [2, 3]) {
    await page.evaluate((n) => {
      document.querySelectorAll("[data-ledger-old]").forEach((e) => e.remove());
      const strip = document.querySelector(".board-margin") as HTMLElement;
      const live = strip.querySelector(".margin-note-block") as HTMLElement;
      const host = document.createElement("div");
      host.setAttribute("data-ledger-old", "host");
      // out of flow, hung off the strip's own box, gapless: the older notes take the air
      host.style.cssText =
        "position:absolute;top:100%;left:0;right:0;pointer-events:none;display:flex;flex-direction:column;gap:0";
      // ≥1024 the strip is ALREADY `position: absolute` (GameBoard.vue's row regime); forcing
      // `relative` there would drop it back into flow and move the board — a prototype
      // artifact, not a product truth. Only the stacked regime needs the containing block.
      if (getComputedStyle(strip).position === "static") {
        (strip as HTMLElement).style.position = "relative";
      }
      const texts = ["that's a given clue", "check row 4"];
      for (let i = 0; i < n - 1; i++) {
        const clone = live.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-ledger-old", String(i));
        const p = clone.querySelector(".margin-note") as HTMLElement;
        const ink = clone.querySelector(".margin-note-ink") as HTMLElement;
        ink.textContent = texts[i];
        ink.style.animation = "none";
        p.removeAttribute("role");
        p.removeAttribute("aria-live");
        p.style.color = i === 0 ? "var(--ink-press-quiet)" : "var(--ink-press-rule)";
        host.appendChild(clone);
      }
      strip.appendChild(host);
    }, depth);
    await page.waitForTimeout(250);
    rows.push({ depth, ...(await read()) });
  }

  const window_h = rig.height;
  const summarize = (r: {
    depth: number;
    board: { y: number } | null;
    ribbon: { y: number } | null;
    olds: Array<{ bottom: number }>;
    scrollH: number;
  }) => {
    const foot = r.olds.length ? Math.max(...r.olds.map((o) => o.bottom)) : null;
    return `n=${r.depth} board.y=${r.board?.y} ribbon.y=${r.ribbon?.y} columnFoot=${foot} coversRibbonBy=${
      foot && r.ribbon ? Math.round((foot - r.ribbon.y) * 100) / 100 : 0
    }px pastFoldBy=${foot ? Math.round((foot - window_h) * 100) / 100 : 0}px scrollH=${r.scrollH}`;
  };
  writeFileSync(join(OUT, `overlay-${rig.name}-${browserName}.json`), JSON.stringify(rows, null, 2));
  // eslint-disable-next-line no-console
  console.log(rig.name + " " + browserName + "\n" + rows.map((r) => summarize(r as never)).join("\n"));
  await ctx.close();
});
