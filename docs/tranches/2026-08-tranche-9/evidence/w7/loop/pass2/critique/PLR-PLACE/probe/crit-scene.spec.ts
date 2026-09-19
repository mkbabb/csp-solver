/**
 * PLR-PLACE · CRITIC · the four re-measurements.
 *
 * A — π's author: what grew the phone card by 32.83 (the number pass 2 called an emulation
 *     artefact, reproduced here in ONE regime, both engines).
 * B — PRM: the computed transition on the sheet under `reducedMotion: reduce`, OPEN and SHUT.
 * C — the lap law's +4.7 residual, named: every drawn `.pl-row`'s own height at 844.
 * D — the retire trigger, re-run: a real mouse press, `.chart-self`, the cell's focus.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PLR-PLACE/logs";
const MARK = "[data-player-mark]";
const LOBBY = "[data-lobby]";
const bank: Record<string, unknown> = {};
const rec = (k: string, v: unknown) => {
  bank[k] = v;
  console.log(`CRIT|${k}|${JSON.stringify(v)}`);
};

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
const mark = (p: Page) => p.locator(MARK).locator("visible=true").first();
const sheet = (p: Page) => p.locator(`${LOBBY}:visible`);
async function press(p: Page) {
  await mark(p).click();
  await p.waitForTimeout(800);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}

test("A · the phone card's 32.83", async ({ browser }, info) => {
  mkdirSync(OUT, { recursive: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: false,
    isMobile: false,
    deviceScaleFactor: 1,
  });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await a.waitForTimeout(1200);
  rec(
    "A.zoneRows",
    await a.evaluate(() =>
      [...document.querySelectorAll(".controls-card .zone-row")].map((e) => {
        const r = e.getBoundingClientRect();
        return {
          label: (e.querySelector(".zone-row-label")?.textContent || "").trim(),
          h: +r.height.toFixed(2),
          w: +r.width.toFixed(2),
        };
      }),
    ),
  );
  rec(
    "A.rosterBox",
    await a.evaluate(() => {
      const el = document.querySelector(".players-roster") as HTMLElement | null;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { h: +r.height.toFixed(2), w: +r.width.toFixed(2) };
    }),
  );
  await ctx.close();
  writeFileSync(join(OUT, `crit-A-${info.project.name}.json`), JSON.stringify(bank, null, 1));
});

test("B · PRM on the sheet", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
    hasTouch: false,
    isMobile: false,
  });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const shut = await a.evaluate(() => {
    const el = document.querySelector("[data-lobby]") as HTMLElement;
    const cs = getComputedStyle(el);
    return { cls: el.className, dur: cs.transitionDuration, prop: cs.transitionProperty };
  });
  rec("B.shut", shut);
  await press(a);
  const open = await a.evaluate(() => {
    const el = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
    ) as HTMLElement;
    const cs = getComputedStyle(el);
    return {
      cls: el.className,
      dur: cs.transitionDuration,
      prop: cs.transitionProperty,
      opacity: cs.opacity,
    };
  });
  rec("B.open", open);
  // the paint model, on the opaque ground: the state line against the sheet's own background
  rec(
    "B.aa",
    await a.evaluate(() => {
      const el = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement;
      const st = el.querySelector(".lobby-state") as HTMLElement;
      const rgb = (s: string) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const lum = (c: number[]) =>
        c
          .map((v) => v / 255)
          .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
          .reduce((a2, v, i) => a2 + v * [0.2126, 0.7152, 0.0722][i], 0);
      const bg = lum(rgb(getComputedStyle(el).backgroundColor));
      const fg = lum(rgb(getComputedStyle(st).color));
      const [hi, lo] = fg > bg ? [fg, bg] : [bg, fg];
      return {
        bg: getComputedStyle(el).backgroundColor,
        fg: getComputedStyle(st).color,
        ratio: +((hi + 0.05) / (lo + 0.05)).toFixed(2),
      };
    }),
  );
  await ctx.close();
  writeFileSync(join(OUT, `crit-B-${info.project.name}.json`), JSON.stringify(bank, null, 1));
});

test("C+D · the rows' own heights, and the seam", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: false,
    isMobile: false,
  });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  // the invite verb is behind the drawer tab at phone width (the lane's banked trap)
  const tab = a.locator(".drawer-tab");
  if (await tab.isVisible()) await tab.click();
  await a.waitForTimeout(500);
  const room = await invite(a);
  const s = new URL(room).searchParams.get("s")!;
  await a.waitForTimeout(400);
  // drive six fake peers onto the wire, each on its own cell
  const drove = await a.evaluate(
    ([r, n]) => {
      const ch = new BroadcastChannel(`board:${r}`);
      let st: { e: number; ea: string } | null = null;
      ch.onmessage = (ev: MessageEvent) => {
        if (ev.data?.kind === "st") st = ev.data.data;
      };
      ch.postMessage({ kind: "hi", data: {}, from: "p-probe000000" });
      return new Promise<string>((res) => {
        setTimeout(() => {
          const e = (st as { e: number; ea: string } | null) ?? { e: 0, ea: "" };
          for (let i = 0; i < (n as number); i++) {
            const id = `p-fake${String(i).padStart(8, "0")}`;
            ch.postMessage({ kind: "hi", data: { ack: true }, from: id });
            ch.postMessage({ kind: "cur", data: { p: i * 5 + 1, ...e }, from: id });
          }
          res(`drove ${n}`);
        }, 700);
      });
    },
    [s, 6] as [string, number],
  );
  rec("C.drove", drove);
  await a.waitForTimeout(1500);
  if (await tab.isVisible()) await tab.click();
  await a.waitForTimeout(400);
  await press(a);
  rec(
    "C.rows",
    await a.evaluate(() => {
      const el = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement;
      const rows = [...el.querySelectorAll(".pl-row")].map((r) => ({
        cls: r.className,
        h: +r.getBoundingClientRect().height.toFixed(2),
        text: (r.textContent || "").trim().slice(0, 40),
      }));
      return { sheetH: +el.getBoundingClientRect().height.toFixed(2), rows };
    }),
  );
  rec("D.selfRings", await a.locator(".chart-self").count());
  rec("D.dots", await a.locator(".chart-dot").count());
  await ctx.close();
  writeFileSync(join(OUT, `crit-CD-${info.project.name}.json`), JSON.stringify(bank, null, 1));
});
