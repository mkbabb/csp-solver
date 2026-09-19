/**
 * PLR-COUNT pass 2 — the four rows the first battery could not read as a pass/fail:
 * the Tab route (which is a ROUTE, not a boolean), the lap at cell grain, the tap floor's
 * negative control, the hover lift, and the PRM arm of the draw-in.
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(__dirname, "..", "readings");
fs.mkdirSync(OUT, { recursive: true });
const bank = (name: string, engine: string, data: unknown) =>
  fs.writeFileSync(
    path.join(OUT, `${name}-${engine}.json`),
    JSON.stringify(data, null, 1),
  );

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
        w.__ch.postMessage({ kind: "hi", data: {}, from: `rp-${from + i}` });
    },
    { room, k, from },
  );
  await page.waitForTimeout(700);
}
const where = () =>
  ((): string => {
    const a = document.activeElement;
    if (!a) return "none";
    if (a.hasAttribute("data-player-mark")) return "THE MARK";
    return (
      a.tagName +
      "." +
      (a.className?.toString().split(" ").slice(0, 2).join(".") || "") +
      (a.getAttribute("aria-label") ? `[${a.getAttribute("aria-label")}]` : "") +
      (a.textContent && a.textContent.length < 24 ? `{${a.textContent.trim()}}` : "")
    );
  })();

test("T1 the Tab route out of @mbabb", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const room = `t1-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await peers(page, room, 2);
  await page.evaluate(() =>
    (document.querySelector(".corner-left .attribution-trigger") as HTMLElement).focus(),
  );
  const route: string[] = [await page.evaluate(where)];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(120);
    route.push(await page.evaluate(where));
  }
  const reached = route.indexOf("THE MARK");
  bank("t1-tab-route", info.project.name, { route, reached });
});

test("T2 the lap, at cell grain", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};
  for (const [vp, box] of [
    ["desk", { width: 1280, height: 800 }],
    ["short", { width: 390, height: 664 }],
  ] as const) {
    const ctx = await browser.newContext({
      viewport: box,
      hasTouch: vp !== "desk",
      isMobile: vp !== "desk",
    });
    const page = await ctx.newPage();
    const room = `t2-${vp}-${info.project.name}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 15);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(750);
    const cells = await page.evaluate(() => {
      const l = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement;
      const lb = l.getBoundingClientRect();
      return [...document.querySelectorAll(".sudoku-cell")]
        .map((c, i) => ({ i, b: c.getBoundingClientRect() }))
        .filter(
          (x) =>
            x.b.left < lb.right &&
            x.b.right > lb.left &&
            x.b.top < lb.bottom &&
            x.b.bottom > lb.top,
        )
        .map((x) => {
          const cx = x.b.left + x.b.width / 2;
          const cy = x.b.top + x.b.height / 2;
          const el = document.elementFromPoint(cx, cy);
          return {
            i: x.i,
            centreUnderSheet:
              cx > lb.left && cx < lb.right && cy > lb.top && cy < lb.bottom,
            hit: el
              ? el.tagName + "." + (el.className?.toString().split(" ")[0] ?? "")
              : null,
            cx: +cx.toFixed(1),
            cy: +cy.toFixed(1),
          };
        });
    });
    // every lapped cell's centre, tapped in turn: does the sheet go?
    const taps: { i: number; dismissed: boolean }[] = [];
    for (const c of cells as { i: number; cx: number; cy: number }[]) {
      await page.locator("[data-player-mark]:visible").first().click();
      await page.waitForTimeout(600);
      await page.mouse.click(c.cx, c.cy);
      await page.waitForTimeout(350);
      taps.push({
        i: c.i,
        dismissed: await page.evaluate(() =>
          [...document.querySelectorAll("[data-lobby]")].every(
            (e) => getComputedStyle(e).visibility === "hidden",
          ),
        ),
      });
    }
    out[vp] = { lapped: (cells as unknown[]).length, cells, taps };
    await ctx.close();
  }
  bank("t2-lap", info.project.name, out);
  for (const vp of ["desk", "short"] as const) {
    const g = out[vp] as { taps: { dismissed: boolean }[] };
    expect(g.taps.every((t) => t.dismissed), `${vp}: every lapped tap dismisses`).toBe(true);
  }
});

test("T3 the tap floor, with its negative control", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  const room = `t3-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  const read = () =>
    page.evaluate(() => {
      const m = [...document.querySelectorAll("[data-player-mark]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      )!;
      const b = m.getBoundingClientRect();
      return { w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
    });
  const shipped = await read();
  // THE NEGATIVE CONTROL: a floor of 40 must READ as 40. An instrument that reports 44
  // whatever the surface does is not measuring the surface.
  await page.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement;
    m.style.minWidth = "40px";
    m.style.minHeight = "40px";
  });
  await page.waitForTimeout(200);
  const control = await read();
  bank("t3-tap-floor", info.project.name, { shipped, control });
  expect(shipped.w).toBeGreaterThanOrEqual(44);
  expect(shipped.h).toBeGreaterThanOrEqual(44);
  expect(control.h).toBeLessThan(44); // the gate can fail
  await ctx.close();
});

test("T4 the hover lift, and the coloured stroke that does not move", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const room = `t4-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  const opacities = () =>
    page.evaluate(() =>
      [
        ...document.querySelectorAll("[data-player-mark] .pt-pose:first-child .pt-stroke"),
      ].map((p) => ({
        op: getComputedStyle(p).strokeOpacity,
        stroke: getComputedStyle(p).stroke,
      })),
    );
  const soloRest = await opacities();
  await page.locator("[data-player-mark]:visible").first().hover();
  await page.waitForTimeout(250);
  const soloHover = await opacities();
  await page.mouse.move(640, 600);
  await peers(page, room, 2);
  const liveRest = await opacities();
  await page.locator("[data-player-mark]:visible").first().hover();
  await page.waitForTimeout(250);
  const liveHover = await opacities();
  bank("t4-hover", info.project.name, { soloRest, soloHover, liveRest, liveHover });
  expect(soloRest[0].op).toBe("0.95");
  expect(soloHover[0].op).toBe("1");
  expect(liveHover.map((x) => x.op)).toEqual(liveRest.map((x) => x.op));
  await ctx.close();
});

test("T5 PRM: the arrival snaps", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const room = `t5-${info.project.name}`;
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await page.evaluate(
    ({ room }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      w.__ch.postMessage({ kind: "hi", data: {}, from: "prm-1" });
      w.__ch.postMessage({ kind: "hi", data: {}, from: "prm-2" });
    },
    { room },
  );
  const samples: string[][] = [];
  for (let i = 0; i < 5; i++) {
    await page.waitForTimeout(60);
    samples.push(
      await page.evaluate(() => {
        const pose = document.querySelector("[data-player-mark] .pt-pose");
        return pose
          ? [...pose.querySelectorAll("path")].map(
              (p) => p.getAttribute("stroke-dashoffset") ?? "",
            )
          : [];
      }),
    );
  }
  bank("t5-prm", info.project.name, { samples });
  for (const s of samples) expect(s.every((v) => v === "0")).toBe(true);
  await ctx.close();
});
