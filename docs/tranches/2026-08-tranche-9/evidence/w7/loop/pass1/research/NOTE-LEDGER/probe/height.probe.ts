/**
 * NOTE-LEDGER pass 1 — THE DECIDING MEASUREMENT: height.
 *
 * Mounts a two-then-three-line note stack over the LIVE margin by cloning `MarginNote`'s own
 * rendered block (`.margin-note-block`, scoped attributes and all) and re-inking the clones on
 * the `--ink-press` ramp. Nothing in `src/` is touched; the overlay is `page.evaluate` only.
 *
 * Read per viewport / theme / sheet state, before and after each stack depth:
 *   · `.board-wrapper`   — THE BOARD. It may not move.
 *   · `.play-controls`   — the fold's ribbon (the board-adjacent chrome below the strip).
 *   · `.board-margin`    — the strip itself.
 *   · document scroll height, and whether the stack's own foot is above the fold.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const OUT = process.env.NL_OUT || join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (name: string, data: unknown) =>
  writeFileSync(join(OUT, name), JSON.stringify(data, null, 2));

const r2 = (v: number) => Math.round(v * 100) / 100;

/** The five voices of the ledger, in temporal order, as the product says them today. */
const VOICES = [
  "only 8 fits here", // the hint (techniqueVoice)
  "that's a given clue", // the refusal (W1 §1.1)
  "check row 4", // the conflict verdict (W1 §1.2, formatConflictNote)
  "the board is clear", // the wipe receipt
  "solved it!", // the grade
];

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
}

/** Put ONE real note on the strip through the product's own path (a hint press). */
async function armHintNote(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(700);
}

const READ = () => {
  const box = (sel: string) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const round = (v: number) => Math.round(v * 100) / 100;
    return {
      x: round(r.x),
      y: round(r.y),
      w: round(r.width),
      h: round(r.height),
      bottom: round(r.bottom),
    };
  };
  const notes = Array.from(document.querySelectorAll(".board-margin .margin-note")).map(
    (n) => {
      const r = n.getBoundingClientRect();
      const cs = getComputedStyle(n);
      return {
        text: (n.textContent || "").trim().slice(0, 40),
        y: Math.round(r.y * 100) / 100,
        h: Math.round(r.height * 100) / 100,
        w: Math.round(r.width * 100) / 100,
        font: `${cs.fontSize} ${cs.fontFamily.split(",")[0]}`,
        lineHeight: cs.lineHeight,
        color: cs.color,
        opacity: cs.opacity,
        filter: cs.filter,
        transform: cs.transform,
      };
    },
  );
  const marginEl = document.querySelector(".board-margin");
  return {
    board: box(".board-wrapper"),
    shell: box(".board-shell"),
    margin: box(".board-margin"),
    ribbon: box(".play-controls"),
    controlsCard: box(".controls-card"),
    marginPosition: marginEl ? getComputedStyle(marginEl).position : null,
    notes,
    scrollH: document.documentElement.scrollHeight,
    viewportH: window.innerHeight,
    docOverflow: document.documentElement.scrollHeight - window.innerHeight,
  };
};

/**
 * Mount `n` lines by CLONING the live note block — the product's own markup, its own scoped
 * styles, its own font. Older lines step down the ramp: full ink, then `--ink-press-quiet`,
 * then `--ink-press-rule` (the third rung, drawn here only so the family can be measured
 * against its own kill).
 */
const MOUNT = (lines: string[]) => {
  const RAMP = ["", "var(--ink-press-quiet)", "var(--ink-press-rule)"];
  const strip = document.querySelector(".board-margin") as HTMLElement | null;
  const live = document.querySelector(".board-margin .margin-note-block") as HTMLElement | null;
  if (!strip || !live) return false;
  document.querySelectorAll("[data-ledger-clone]").forEach((n) => n.remove());
  // newest FIRST in the column (the live note keeps its own berth as line 1)
  const older = lines.slice(1);
  const liveInk = live.querySelector(".margin-note-ink") as HTMLElement | null;
  if (liveInk) liveInk.textContent = lines[0];
  older.forEach((text, i) => {
    const clone = live.cloneNode(true) as HTMLElement;
    clone.setAttribute("data-ledger-clone", String(i + 1));
    const p = clone.querySelector(".margin-note") as HTMLElement | null;
    const ink = clone.querySelector(".margin-note-ink") as HTMLElement | null;
    if (ink) ink.textContent = text;
    if (p) {
      p.removeAttribute("role");
      p.removeAttribute("aria-live");
      const rung = RAMP[Math.min(i + 1, RAMP.length - 1)];
      if (rung) p.style.color = rung;
    }
    // a clone must not re-announce, and must not re-run the 250ms write-in on measure
    if (ink) ink.style.animation = "none";
    strip.appendChild(clone);
  });
  return true;
};

const UNMOUNT = () => {
  document.querySelectorAll("[data-ledger-clone]").forEach((n) => n.remove());
};

type Cell = {
  engine: string;
  viewport: string;
  theme: string;
  sheet: string;
  depth: number;
  reading: unknown;
};

const RIGS = [
  { name: "390x844", width: 390, height: 844, dsf: 3, mobile: true },
  { name: "900x500", width: 900, height: 500, dsf: 2, mobile: false },
  { name: "1280x800", width: 1280, height: 800, dsf: 2, mobile: false },
];

for (const rig of RIGS) {
  for (const theme of ["light", "dark"] as const) {
    test(`NL-1 HEIGHT — ${rig.name} ${theme}`, async ({ browser, browserName }) => {
      const ctx = await browser.newContext({
        viewport: { width: rig.width, height: rig.height },
        deviceScaleFactor: rig.dsf,
        isMobile: rig.mobile && browserName === "chromium",
        hasTouch: rig.mobile,
      });
      const page = await ctx.newPage();
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
      await boardReady(page);
      await armHintNote(page);

      const cells: Cell[] = [];
      const sheetStates: Array<"shut" | "open"> =
        rig.name === "390x844" ? ["shut", "open"] : ["shut"];

      for (const sheet of sheetStates) {
        if (sheet === "open") {
          // The dock sheet SLIDES — settle ~700ms before measuring it open.
          const tab = page.locator(".drawer-tab").first();
          if (await tab.count()) {
            await tab.click({ force: true }).catch(() => {});
            await page.waitForTimeout(900);
          }
        }
        for (const depth of [1, 2, 3, 5]) {
          if (depth === 1) await page.evaluate(UNMOUNT);
          else await page.evaluate(MOUNT, VOICES.slice(0, depth));
          await page.waitForTimeout(220);
          cells.push({
            engine: browserName,
            viewport: rig.name,
            theme,
            sheet,
            depth,
            reading: await page.evaluate(READ),
          });
        }
        await page.evaluate(UNMOUNT);
        await page.waitForTimeout(150);
      }

      bank(`height-${rig.name}-${theme}-${browserName}.json`, cells);
      // eslint-disable-next-line no-console
      console.log(
        cells
          .map((c) => {
            const r = c.reading as ReturnType<typeof READ>;
            return `${c.viewport} ${c.theme} ${c.sheet} n=${c.depth} board.y=${r.board?.y} board.h=${r.board?.h} margin.y=${r.margin?.y} margin.h=${r.margin?.h} ribbon.y=${r.ribbon?.y} scrollH=${r.scrollH} over=${r.docOverflow}`;
          })
          .join("\n"),
      );
      await ctx.close();
    });
  }
}

/** The single note's own line box, on this tree, at each rig — the unit the arithmetic uses. */
test("NL-1b THE LINE — one note's box at each rig", async ({ browser, browserName }) => {
  const rows: unknown[] = [];
  for (const rig of RIGS) {
    const ctx = await browser.newContext({
      viewport: { width: rig.width, height: rig.height },
      deviceScaleFactor: rig.dsf,
      isMobile: rig.mobile && browserName === "chromium",
      hasTouch: rig.mobile,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await boardReady(page);
    await armHintNote(page);
    const row = await page.evaluate(() => {
      const n = document.querySelector(".board-margin .margin-note") as HTMLElement | null;
      const blk = document.querySelector(
        ".board-margin .margin-note-block",
      ) as HTMLElement | null;
      if (!n || !blk) return null;
      const cs = getComputedStyle(n);
      const bcs = getComputedStyle(blk);
      const r = n.getBoundingClientRect();
      const br = blk.getBoundingClientRect();
      const round = (v: number) => Math.round(v * 100) / 100;
      return {
        text: (n.textContent || "").trim(),
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.split(",")[0],
        lineHeight: cs.lineHeight,
        noteBox: [round(r.width), round(r.height)],
        blockBox: [round(br.width), round(br.height)],
        blockMinHeight: bcs.minHeight,
        blockDisplay: bcs.display,
        marginTop: getComputedStyle(
          document.querySelector(".board-margin") as HTMLElement,
        ).marginTop,
      };
    });
    rows.push({ rig: rig.name, engine: browserName, ...(row || {}) });
    await ctx.close();
  }
  bank(`line-box-${browserName}.json`, rows);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(rows, null, 2));
});
