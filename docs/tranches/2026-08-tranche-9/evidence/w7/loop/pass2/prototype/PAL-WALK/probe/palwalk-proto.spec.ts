/**
 * PAL-WALK pass-2 PROTOTYPE PROBE — not a landed instrument, and re-banked here after the run
 * (it was removed from `web/frontend/e2e/` so the lane's diff carries only the landed tier-3
 * spec). Copy it back beside `peer-walk.spec.ts` to re-run it. The rows are the ones the brief
 * asks for on the real surface that the landed spec does not carry: the one-person room, the
 * solo fingerprint, the join snap, and the ring's crops.
 *
 * Readings: `readings/p1-room-{chromium,webkit}.txt`, `readings/p2-ring-{chromium,webkit}.txt`.
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "fs";

const OUT = "<lane scratch>/readings";
const FRAMES = "<lane scratch>/frames";
const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page): Promise<void> {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
}
const roster = (p: Page) => p.locator(".controls-card .players-roster .player-row");

// The house idiom (`multiplayer.spec.ts:103,110`): the FIRST EMPTY cell, click, then `fill`.
// Typing through the keyboard lands in chromium and silently does not in WebKit, and a fixed
// `nth()` rewrites the cell the previous call filled — both cost this probe a run.
async function write(p: Page, _idx: number, digit: string): Promise<void> {
  const at = await p.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !(i as HTMLInputElement).value && !(i as HTMLInputElement).readOnly,
    ),
  );
  if (at < 0) return;
  const cell = p.locator(".sudoku-cell input").nth(at);
  await cell.click();
  await cell.fill(digit);
  await p.waitForTimeout(250);
}

const fingerprint = (p: Page) =>
  p.evaluate(() => {
    const bound = [...document.querySelectorAll<HTMLElement>("[style]")]
      .filter((e) => e.getAttribute("style")!.includes("--color-user-ink"))
      .map((e) => `${e.tagName}.${e.className}|${e.getAttribute("style")}`);
    const cell = document.querySelector<HTMLElement>(".sudoku-cell");
    const glyph = document.querySelector<HTMLElement>(".sudoku-cell .glyph-svg path");
    return {
      boundCount: bound.length,
      rootInk: getComputedStyle(document.documentElement)
        .getPropertyValue("--color-user-ink")
        .trim(),
      cellInk: cell
        ? getComputedStyle(cell).getPropertyValue("--color-user-ink").trim()
        : "(none)",
      glyphStroke: glyph ? getComputedStyle(glyph).stroke : "(none)",
      leave: !!document.querySelector(".players-leave"),
    };
  });

/** every painted glyph stroke on the board, as a histogram. */
const strokes = (p: Page) =>
  p.evaluate(() => {
    const hist: Record<string, number> = {};
    for (const c of document.querySelectorAll<HTMLElement>(".sudoku-cell")) {
      const path = c.querySelector<SVGPathElement>(".glyph-svg path");
      if (!path) continue;
      const st = getComputedStyle(path).stroke;
      hist[st] = (hist[st] ?? 0) + 1;
    }
    return hist;
  });

test("P1 — solo is byte-identical, the one-person room recolours nothing, the arrival snaps", async ({
  browser,
}, info) => {
  const out: string[] = [];
  const s = (x: string): void => {
    out.push(x);
    console.log(`[${info.project.name}] ${x}`);
  };
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);

  const HEAD_R0 = {
    boundCount: 0,
    rootInk: "#2563eb",
    cellInk: "#2563eb",
    glyphStroke: "rgb(10, 10, 10)",
    leave: false,
  };
  const soloBefore = await fingerprint(a);
  s(`SOLO untouched: ${JSON.stringify(soloBefore)}`);
  s(
    `SOLO vs HEAD r0 fingerprint: ${
      JSON.stringify(soloBefore) === JSON.stringify(HEAD_R0) ? "IDENTICAL" : "DIFFERS"
    }`,
  );
  await write(a, 0, "5");
  await write(a, 1, "6");
  s(`SOLO after two digits: ${JSON.stringify(await fingerprint(a))}`);
  s(`SOLO strokes: ${JSON.stringify(await strokes(a))}`);

  // THE ONE-PERSON ROOM. Pressing invite is not the arrival of a second person, so nothing on
  // this page may change colour.
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  await a.waitForTimeout(600);
  await write(a, 2, "7");
  const alone = await fingerprint(a);
  const aloneRows = await a.evaluate(() =>
    [
      ...document.querySelectorAll<HTMLElement>(".controls-card .players-roster .player-row"),
    ].map((li) => ({
      self: !!li.querySelector(".player-self"),
      inline: li.getAttribute("style") ?? "",
      swatch: li.querySelector(".player-swatch")
        ? getComputedStyle(li.querySelector(".player-swatch")!).backgroundColor
        : "(none)",
    })),
  );
  s(`ROOM OF ONE fingerprint: ${JSON.stringify(alone)}`);
  s(`ROOM OF ONE roster: ${JSON.stringify(aloneRows)}`);
  s(`ROOM OF ONE strokes: ${JSON.stringify(await strokes(a))}`);
  s(`ROOM OF ONE bound cells: ${alone.boundCount}`);

  // THE SECOND ID ARRIVES.
  const b = await ctx.newPage();
  await b.goto(a.url());
  await settled(b);
  await expect(roster(a)).toHaveCount(2);
  await a.waitForTimeout(1400); // the join wash is 1180ms at 0.95
  s(`AFTER ARRIVAL fingerprint: ${JSON.stringify(await fingerprint(a))}`);
  s(`AFTER ARRIVAL strokes (A): ${JSON.stringify(await strokes(a))}`);
  s(`AFTER ARRIVAL strokes (B): ${JSON.stringify(await strokes(b))}`);
  const rows = (p: Page) =>
    p.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>(".controls-card .players-roster .player-row"),
      ].map((li) => ({
        slug: li.querySelector(".player-name")?.textContent?.trim() ?? "",
        self: !!li.querySelector(".player-self"),
        swatch: li.querySelector(".player-swatch")
          ? getComputedStyle(li.querySelector(".player-swatch")!).backgroundColor
          : "(none)",
      })),
    );
  const ra = await rows(a);
  const rb = await rows(b);
  s(`A rows: ${JSON.stringify(ra)}`);
  s(`B rows: ${JSON.stringify(rb)}`);
  const aSelf = ra.find((r) => r.self)!;
  const aOnB = rb.find((r) => r.slug === aSelf.slug)!;
  s(
    `I2 A self ${aSelf.swatch} vs B paints ${aOnB.swatch} → ${
      aSelf.swatch === aOnB.swatch ? "GREEN" : "RED"
    }`,
  );

  // THE LEAVE PATH BACK TO SOLO.
  const leave = a.locator(".players-leave");
  if (await leave.count()) {
    await leave.first().click();
    await a.waitForTimeout(600);
    s(`AFTER LEAVE fingerprint: ${JSON.stringify(await fingerprint(a))}`);
    s(`AFTER LEAVE strokes: ${JSON.stringify(await strokes(a))}`);
  }

  fs.writeFileSync(`${OUT}/p1-room-${info.project.name}.txt`, out.join("\n"));
  await ctx.close();
});

test("P2 — the peer cursor ring, painted, one crop per theme", async ({ browser }, info) => {
  const out: string[] = [];
  const s = (x: string): void => {
    out.push(x);
    console.log(`[${info.project.name}] ${x}`);
  };
  const ctx = await browser.newContext({ deviceScaleFactor: 3 });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const b = await ctx.newPage();
  await b.goto(a.url());
  await settled(b);
  await expect(roster(a)).toHaveCount(2);

  for (const theme of ["light", "dark"] as const) {
    for (const p of [a, b]) {
      await p.evaluate((t) => {
        document.documentElement.classList.toggle("dark", t === "dark");
      }, theme);
      await p.evaluate(
        () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
      );
    }
    const cells = b.locator(".sudoku-cell input:not([readonly]):not([disabled])");
    await cells.nth(4).click();
    await a.waitForTimeout(600);
    const ghost = a.locator(".game-cell.is-peer-cursor").first();
    const n = await a.locator(".game-cell.is-peer-cursor").count();
    s(`${theme}: cells wearing a peer cursor on A: ${n}`);
    if (n) {
      const box = await ghost.boundingBox();
      const shot = await a.screenshot({
        clip: {
          x: Math.max(0, box!.x - 6),
          y: Math.max(0, box!.y - 6),
          width: box!.width + 12,
          height: box!.height + 12,
        },
      });
      fs.writeFileSync(`${FRAMES}/ring-${theme}-${info.project.name}.png`, shot);
      s(`${theme}: ring crop ${shot.length} B at dpr3`);
      s(
        `${theme}: ring computed ${JSON.stringify(
          await a.evaluate(() => {
            const path = document.querySelector<SVGPathElement>(
              ".game-cell.is-peer-cursor .cell-ghost-path",
            );
            if (!path) return null;
            const st = getComputedStyle(path);
            return {
              stroke: st.stroke,
              strokeOpacity: st.strokeOpacity,
              strokeWidth: st.strokeWidth,
              fillOpacity: st.fillOpacity,
              focusInk: getComputedStyle(document.documentElement)
                .getPropertyValue("--color-focus-sketch")
                .trim(),
            };
          }),
        )}`,
      );
    }
  }
  fs.writeFileSync(`${OUT}/p2-ring-${info.project.name}.txt`, out.join("\n"));
  await ctx.close();
});
