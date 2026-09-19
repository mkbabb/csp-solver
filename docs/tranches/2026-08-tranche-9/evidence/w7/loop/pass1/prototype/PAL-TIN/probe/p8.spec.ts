/**
 * PAL-TIN pass-1 — P8, the hard case the spec named: 16×16 ON A PHONE, dpr3. The cell is
 * ~22px there, so the question is whether a 12%-of-cell tally stroke reads at all.
 *
 * PRM: live, because the tick's draw-in is part of what is being looked at; the read waits
 * 900ms, well past the 90+350ms the mark takes to land.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PAL-TIN";
const READ = join(OUT, "readings");
const FRAMES = join(OUT, "frames");
mkdirSync(READ, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const SOLO16 = "./?size=4&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".game-cell input").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(600);
}

async function openDock(page: Page) {
  const tab = page.locator(".drawer-tab");
  if (await tab.count()) {
    if ((await tab.getAttribute("aria-expanded")) !== "true") {
      await tab.click();
      await page.waitForTimeout(900);
    }
  }
}

async function openRoom(page: Page): Promise<string> {
  await openDock(page);
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return new URL(page.url()).searchParams.get("s")!;
}

async function fillRoom(page: Page, room: string, n: number) {
  return page.evaluate(
    async ({ room, n }) => {
      const w = window as unknown as Record<string, any>;
      const ch = new BroadcastChannel(`board:${room}`);
      w.__ch = ch;
      w.__st = null;
      ch.onmessage = (ev: MessageEvent) => {
        if (ev.data?.kind === "st") w.__st = ev.data.data;
      };
      await new Promise((r) => setTimeout(r, 700));
      const ids: string[] = [];
      for (let i = 0; i < n; i++) {
        const id = `zz${String(i).padStart(2, "0")}-peer${i}`;
        ids.push(id);
        ch.postMessage({ kind: "hi", data: {}, from: id });
        await new Promise((r) => setTimeout(r, 60));
      }
      for (const id of ids) ch.postMessage({ kind: "hi", data: {}, from: id });
      for (let t = 0; t < 12 && !w.__st; t++) {
        ch.postMessage({ kind: "hi", data: {}, from: ids[ids.length - 1] });
        await new Promise((r) => setTimeout(r, 400));
      }
      await new Promise((r) => setTimeout(r, 400));
      return { ids, st: w.__st };
    },
    { room, n },
  );
}

test("P8 — the tick at 16x16 on a phone, dpr3", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
  });
  const page = await ctx.newPage();
  await page.goto(SOLO16);
  await settled(page);
  const room = await openRoom(page);
  const { ids, st } = await fillRoom(page, room, 8);
  expect(st, "the page published its board").toBeTruthy();
  const empty = await page.evaluate(() => {
    const ins = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
    return ins.map((i, n) => (i.value || i.disabled ? -1 : n)).filter((n) => n >= 0);
  });
  await page.evaluate(
    ({ from, pos }) => {
      const w = window as unknown as Record<string, any>;
      const st = w.__st;
      w.__ch.postMessage({
        kind: "op",
        data: { p: pos, v: 1, s: 0, l: 9001, a: from, e: st.e, ea: st.ea },
        from,
      });
    },
    { from: ids[4], pos: empty[0] },
  );
  await page.waitForTimeout(1100);
  // Close the dock — the board is what is being looked at, and the sheet SLIDES, so settle.
  const tab = page.locator(".drawer-tab");
  if ((await tab.count()) && (await tab.getAttribute("aria-expanded")) === "true") {
    await tab.click();
    await page.waitForTimeout(900);
  }
  const read = await page.evaluate(() => {
    const cells = [...document.querySelectorAll(".game-cell")];
    const i = cells.findIndex((c) => c.querySelector(".glyph-tick"));
    if (i < 0) return null;
    const cb = cells[i].getBoundingClientRect();
    const p = cells[i].querySelector(".glyph-tick path")!;
    const pb = p.getBoundingClientRect();
    const cs = getComputedStyle(p);
    return {
      index: i,
      cellPx: +cb.width.toFixed(2),
      tickHeightPx: +pb.height.toFixed(2),
      tickWidthPx: +pb.width.toFixed(2),
      strokePx: cs.strokeWidth,
      tickDevicepx: +(pb.height * 3).toFixed(1),
      strokeDevicepx: +(parseFloat(cs.strokeWidth) * 3).toFixed(1),
      stroke: cs.stroke,
      insideBand: pb.top >= cb.top + cb.height * 0.825 - 0.75,
    };
  });
  console.log(`TIN-P8|${info.project.name}|${JSON.stringify(read)}`);
  writeFileSync(join(READ, `p8-phone16-${info.project.name}.json`), JSON.stringify(read, null, 1));
  if (info.project.name === "chromium" && read) {
    const box = await page.locator(".game-cell").nth(read.index).boundingBox();
    if (box)
      await page.screenshot({
        path: join(FRAMES, "tick-16x16-phone-dpr3.png"),
        clip: {
          x: Math.max(0, box.x - 4),
          y: Math.max(0, box.y - 4),
          width: box.width * 4 + 8,
          height: box.height * 2 + 8,
        },
      });
  }
  expect(read, "a tick is mounted at 16x16 on a phone").not.toBeNull();
  await ctx.close();
});
