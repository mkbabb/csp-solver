/**
 * PLR-SELF pass 4 — the π census and the control-estate row (gaps 3, 4, 1).
 *
 * Run twice: PLR_BASE=proto and PLR_BASE=control. Everything printed, nothing asserted here
 * except the shape — the numbers are the record and the README compares the two runs.
 */
import { test, type Page } from "@playwright/test";

const SOLO = "/?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page
    .locator(".sudoku-cell .glyph-svg")
    .first()
    .waitFor({ state: "attached", timeout: 60000 });
  await page.waitForTimeout(400);
}

/** Computed PAINT properties + the tag name, never rects alone (LAWS). */
const KEYS = [
  ".corner-left",
  ".corner-right",
  ".controls-card",
  ".board-wrapper",
  ".drawer-tab",
  ".masthead",
  ".mobile-attribution",
];

async function census(page: Page) {
  return page.evaluate((keys) => {
    const out: Record<string, unknown> = {};
    for (const k of keys) {
      const el = document.querySelector(k) as HTMLElement | null;
      if (!el) {
        out[k] = null;
        continue;
      }
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      out[k] = {
        tag: el.tagName.toLowerCase(),
        box: [r.x, r.y, r.width, r.height].map((n) => +n.toFixed(2)),
        color: s.color,
        bg: s.backgroundColor,
        font: `${s.fontFamily.split(",")[0]} ${s.fontSize}/${s.lineHeight} ${s.fontWeight}`,
      };
    }
    const cell = document.querySelector(".sudoku-cell") as HTMLElement | null;
    if (cell) {
      const r = cell.getBoundingClientRect();
      out["cell0"] = { box: [r.x, r.y, r.width, r.height].map((n) => +n.toFixed(2)) };
    }
    return out;
  }, KEYS);
}

/** The control estate the '64px' stands in for (gap 3). */
async function estate(page: Page) {
  return page.evaluate(() => {
    const pick = (sel: string) => {
      const el = document.querySelector(sel) as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { y: +r.y.toFixed(2), h: +r.height.toFixed(2), w: +r.width.toFixed(2) };
    };
    const card = document.querySelector(".controls-card") as HTMLElement | null;
    const well = document.querySelector(
      ".tray-well:has(.players-roster)",
    ) as HTMLElement | null;
    const wr = well?.getBoundingClientRect();
    return {
      well: wr ? { w: +wr.width.toFixed(1), h: +wr.height.toFixed(1) } : null,
      cardScrollHeight: card?.scrollHeight ?? null,
      cardClientHeight: card?.clientHeight ?? null,
      cardBox: pick(".controls-card"),
      panelWrap: pick(".control-panel-wrap"),
      peekHold: pick(".peek-hold-surface"),
      copyStatus: pick(".copy-status"),
      firstWell: pick(".tray-well"),
    };
  });
}

test("desk π + the control estate", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(SOLO);
  await settled(page);
  console.log(
    `[${info.project.name}] DESK-SOLO ` + JSON.stringify(await census(page)),
  );
  console.log(
    `[${info.project.name}] DESK-ESTATE-SOLO ` + JSON.stringify(await estate(page)),
  );

  // A room of five, through the estate's own invite.
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  if (await verb.count()) {
    await verb.click();
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const room = new URL(location.href).searchParams.get("s");
      if (!room) return;
      const ch = new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < 4; i++)
        ch.postMessage({ kind: "hi", data: {}, from: `census-${i}` });
      setTimeout(() => ch.close(), 0);
    });
    await page.waitForTimeout(900);
    console.log(
      `[${info.project.name}] DESK-ROOM5 ` + JSON.stringify(await census(page)),
    );
    console.log(
      `[${info.project.name}] DESK-ESTATE-ROOM5 ` + JSON.stringify(await estate(page)),
    );
  }
});

test("phone π", async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(SOLO);
  await settled(page);
  console.log(
    `[${info.project.name}] PHONE-SOLO ` + JSON.stringify(await census(page)),
  );
});
