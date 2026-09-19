/**
 * PLR-COUNT · PASS-2 RESEARCH PROBE, part two.
 *
 *  J · where the wordmark is, in both regimes — the y at which the register's last line stops
 *      standing on paper and starts standing on a letter
 *  K · the phone board bound (the sheet's lap over the grid at 844 and at 664)
 *  L · G4 RE-AIMED: the F1 ruling as a gate that can fail — SELF's cells bind nothing while a
 *      PEER's do. The pass-1 gate drove peers with `hi` only and counted `authorInk`, which
 *      binds on PEER cells; it was vacuous as run and RED on correct behaviour as written.
 *  M · r0 I2 / I4, re-pointed at `.pl-row .pl-row-mark path` (proposed; reported MOVED)
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(__dirname, "..", "readings");
fs.mkdirSync(OUT, { recursive: true });
const bank = (name: string, engine: string, data: unknown) => {
  fs.writeFileSync(path.join(OUT, `${name}-${engine}.json`), JSON.stringify(data, null, 1));
  console.log(`${name}|${engine}|${JSON.stringify(data)}`);
};

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
let cursor = 0;
async function peers(page: Page, room: string, k: number) {
  if (k <= 0) return;
  const from = cursor;
  cursor += k;
  await page.evaluate(
    ({ room, k, from }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `pp-${from + i}` });
    },
    { room, k, from },
  );
  await page.waitForTimeout(900);
}

const geom = () =>
  ((): unknown => {
    const r = (el: Element | null) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        x: +b.x.toFixed(2),
        y: +b.y.toFixed(2),
        w: +b.width.toFixed(2),
        h: +b.height.toFixed(2),
        bottom: +b.bottom.toFixed(2),
        right: +b.right.toFixed(2),
      };
    };
    const lobby = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement | null;
    const cells = [...document.querySelectorAll(".sudoku-cell")];
    const lb = lobby?.getBoundingClientRect();
    const lapped = lb
      ? cells.filter((c) => {
          const b = c.getBoundingClientRect();
          return b.left < lb.right && b.right > lb.left && b.top < lb.bottom && b.bottom > lb.top;
        }).length
      : 0;
    return {
      lobby: r(lobby ?? null),
      more: r(lobby?.querySelector(".pl-more") ?? null),
      wordmark: r(document.querySelector("svg.handwritten-logo")),
      cell0: r(cells[0] ?? null),
      cells: cells.length,
      lappedCells: lapped,
      grid: r(document.querySelector("svg.hand-drawn-grid") ?? document.querySelector(".board-grid")),
    };
  })();

test("J/K the wordmark and the board, both regimes", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};
  for (const [name, vp] of [
    ["desk-1280x800", { width: 1280, height: 800 }],
    ["phone-390x844", { width: 390, height: 844 }],
    ["phone-390x664", { width: 390, height: 664 }],
  ] as const) {
    const ctx = await browser.newContext({
      viewport: vp,
      hasTouch: name.startsWith("phone"),
      isMobile: name.startsWith("phone"),
    });
    const page = await ctx.newPage();
    const room = `r2j-${name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 15);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    out[name] = await page.evaluate(geom);
    await ctx.close();
  }
  bank("jk-wordmark-board", info.project.name, out);
});

/**
 * L · G4, RE-AIMED AT SELF'S CELLS.
 *
 * The law (F1, this family's own ruling): a page paints ITS OWN cells with the page's
 * `--color-user-ink` and binds nothing on them, so a solo board and a board in a room are
 * byte-identical; a PEER's cells carry an inline `--color-user-ink` rebinding. Two pages, one
 * room, one digit each — and both halves counted, so the gate cannot pass by an empty room.
 */
test("L G4 re-aimed: self writes bind nothing, a peer's write binds", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await a.waitForTimeout(800);

  const countBindings = (p: Page) =>
    p.evaluate(() => {
      const cells = [...document.querySelectorAll(".sudoku-cell")];
      const bound = cells.filter(
        (c) => (c.getAttribute("style") ?? "").includes("--color-user-ink"),
      );
      return {
        cells: cells.length,
        bound: bound.length,
        boundStyles: bound.slice(0, 3).map((c) => c.getAttribute("style")),
      };
    });

  const solo = await countBindings(a);

  // A writes one digit of its own.
  // `fill`, not `keyboard.press` — the estate's own e2e idiom (`e2e/multiplayer.spec.ts:110`).
  // A synthetic keypress does not take in webkit, which is why the pass-1 attempt at this row
  // was inconclusive there.
  const writeOne = async (p: Page, digit: string, nth: number) => {
    const empties = p.locator(".sudoku-cell input");
    const idx = await p.evaluate(() =>
      [...document.querySelectorAll(".sudoku-cell input")].findIndex(
        (i) => !(i as HTMLInputElement).value,
      ),
    );
    if (idx < 0) return false;
    const cell = empties.nth(idx + nth);
    await cell.click();
    await cell.fill(digit);
    await p.waitForTimeout(700);
    return true;
  };
  const aWrote = await writeOne(a, "5", 0);
  await a.waitForTimeout(600);
  const afterSelfWrite = await countBindings(a);

  await b.bringToFront(); // webkit throttles a background page's wire; the write must be live
  const bWrote = await writeOne(b, "6", 7);
  await b.waitForTimeout(500);
  await a.bringToFront();
  await a.waitForTimeout(1200);
  const afterPeerWrite = await countBindings(a);
  const aSeesDigits = await a.evaluate(
    () =>
      [...document.querySelectorAll(".sudoku-cell input")].filter(
        (i) => (i as HTMLInputElement).value,
      ).length,
  );
  const bSeesDigits = await b.evaluate(
    () =>
      [...document.querySelectorAll(".sudoku-cell input")].filter(
        (i) => (i as HTMLInputElement).value,
      ).length,
  );

  bank("l-g4-reaim", info.project.name, {
    aWrote,
    bWrote,
    solo,
    afterSelfWrite,
    afterPeerWrite,
    aSeesDigits,
    bSeesDigits,
    law: {
      selfBindsNothing: afterSelfWrite.bound === solo.bound,
      peerBinds: afterPeerWrite.bound > afterSelfWrite.bound,
    },
  });
  await ctx.close();
});

/**
 * M · r0 I2 / I4 RE-POINTED (PROPOSED — the r0 rows stay as they came out).
 *
 * r0's I2 and I4 read `getComputedStyle(li.querySelector(".player-swatch")).backgroundColor`
 * inside `.controls-card .players-roster .player-row`. Under this family's diff the roster is
 * `sr-only` and the swatch is gone, so both instruments throw rather than read. The colour they
 * were asking about now lives on the register's row mark, as a STROKE — so the re-point is the
 * same question at the surface that carries the answer:
 *
 *     .controls-card .players-roster .player-row .player-swatch  ->  [data-lobby] .pl-row .pl-row-mark path
 *     backgroundColor                                            ->  stroke
 *     (the roster is always mounted)                             ->  (the sheet must be OPENED first)
 */
const openSheet = async (p: Page) => {
  await p.locator("[data-player-mark]:visible").first().click();
  await p.waitForTimeout(700);
};
const rowInk = (p: Page, slug: string) =>
  p.evaluate((s) => {
    const lobby = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    );
    if (!lobby) return "(no sheet)";
    const li = [...lobby.querySelectorAll(".pl-row")].find(
      (e) => e.querySelector(".pl-name")?.textContent?.trim() === s,
    );
    const path = li?.querySelector(".pl-row-mark path");
    return path ? getComputedStyle(path).stroke : "(no row)";
  }, slug);
const selfSlugIn = (p: Page) =>
  p.evaluate(() => {
    const lobby = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    );
    const li = [...(lobby?.querySelectorAll(".pl-row") ?? [])].find(
      (e) => e.querySelector(".pl-qualifier")?.textContent?.trim() === "you",
    );
    return li?.querySelector(".pl-name")?.textContent?.trim() ?? "";
  });

test("M I2'/I4' at the register's row mark", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const room = new URL(link).searchParams.get("s")!;
  await a.evaluate((r) => {
    const w = window as unknown as { __st?: unknown; __ch?: BroadcastChannel };
    w.__st = null;
    const ch = new BroadcastChannel(`board:${r}`);
    w.__ch = ch;
    ch.onmessage = (ev: MessageEvent) => {
      if ((ev.data as { kind?: string })?.kind === "st")
        w.__st = (ev.data as { data?: unknown }).data;
    };
  }, room);
  const b = await a.context().newPage();
  await b.goto(link);
  await settled(b);
  await a.waitForTimeout(900);

  await openSheet(a);
  await openSheet(b);
  const aSlug = await selfSlugIn(a);
  const bSlug = await selfSlugIn(b);
  const i2 = {
    slug: aSlug,
    onMyPage: await rowInk(a, aSlug),
    onTheirPage: await rowInk(b, aSlug),
  };

  // I4': a rival `st` shifts every id by 5 — an index neither page has ever held.
  const beforeB = await rowInk(a, bSlug);
  const sent = await a.evaluate(() => {
    const w = window as unknown as {
      __st?: { k?: Record<string, number> };
      __ch?: BroadcastChannel;
    };
    const st = w.__st;
    if (!st) return "no st captured";
    const ids = Object.keys(st.k ?? {});
    if (ids.length < 2) return "k held fewer than two ids";
    const swapped: Record<string, number> = {};
    ids.forEach((id) => (swapped[id] = (st.k as Record<string, number>)[id] + 5));
    w.__ch!.postMessage({
      kind: "st",
      from: "zzzz-rival",
      data: { ...st, e: 1_000_000, ea: "zzzz-rival", k: swapped },
    });
    return JSON.stringify({ was: st.k, now: swapped });
  });
  await a.waitForTimeout(700);
  const afterB = await rowInk(a, bSlug);

  bank("m-i2-i4-repoint", info.project.name, {
    i2,
    i2Agrees: i2.onMyPage === i2.onTheirPage,
    i4: { slug: bSlug, before: beforeB, after: afterB, sent },
    i4Survives: beforeB === afterB,
  });
  await ctx.close();
});
