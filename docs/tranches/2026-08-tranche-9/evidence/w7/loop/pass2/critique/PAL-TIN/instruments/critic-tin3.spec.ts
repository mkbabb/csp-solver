/**
 * PAL-TIN pass-2 CRITIC probe, part 3 — the laminate rim, armed for real, and the ring shown.
 *
 * C4: a probe node wearing `.cell-because` with the estate's own rule (the class supplies
 * `inset: 9%` and the 2px inset rim; `position: absolute` is set inline because the product
 * node gets it from a utility class that does not survive a runtime `className` write).
 * C5: the ring turned ON over a ticked cell (`is-peer-cursor` is a paint state, not a layout
 * one) and cropped, so the collision is visible and not only arithmetic.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PAL-TIN";
mkdirSync(join(BASE, "readings"), { recursive: true });
mkdirSync(join(BASE, "frames"), { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(BASE, "readings", n), JSON.stringify(d, null, 1));

const SOLO9 = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".game-cell .glyph-svg, .game-cell input").count(), {
      timeout: 60000,
    })
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
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(300);
  return page.evaluate(
    async ({ room, n }) => {
      const w = window as unknown as Record<string, any>;
      const ch = new BroadcastChannel(`board:${room}`);
      w.__ch = ch;
      w.__st = null;
      ch.onmessage = (ev: MessageEvent) => {
        if ((ev.data as any)?.kind === "st") w.__st = (ev.data as any).data;
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
async function peerWrites(page: Page, from: string, pos: number, value: number) {
  await page.evaluate(
    ({ from, pos, value }) => {
      const w = window as unknown as Record<string, any>;
      w.__lam = (w.__lam ?? 1000) + 1;
      w.__ch.postMessage({
        kind: "op",
        data: { p: pos, v: value, s: 0, l: w.__lam, a: from, e: w.__st.e, ea: w.__st.ea },
        from,
      });
    },
    { from, pos, value },
  );
  await page.waitForTimeout(250);
}

for (const [label, vp] of [
  ["desk", { width: 1280, height: 800 }],
  ["phone", { width: 390, height: 844 }],
] as const) {
  test(`C4 ${label} — the laminate rim against the tick`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 3 });
    const page = await ctx.newPage();
    await page.goto(SOLO9);
    await settled(page);
    const room = await openRoom(page);
    const { ids, st } = await fillRoom(page, room, 6);
    expect(st).toBeTruthy();
    const ticker = ids[ids.length - 1];
    const cell = await page.evaluate(() => {
      const inputs = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
      return inputs.findIndex((el) => !el.value && !el.disabled);
    });
    await peerWrites(page, ticker, cell, 1);
    await page.waitForTimeout(700);
    const out = await page.evaluate((pos) => {
      const el = document.querySelectorAll(".game-cell")[pos] as HTMLElement;
      const cb = el.getBoundingClientRect();
      const pw = (v: number) => +((v / cb.width) * 100).toFixed(2);
      const ph = (v: number) => +((v / cb.height) * 100).toFixed(2);
      const tp = [...el.querySelectorAll(".glyph-tick path")] as SVGPathElement[];
      const tr = tp.map((p) => p.getBoundingClientRect());
      const tick = {
        x: pw(Math.min(...tr.map((r) => r.x)) - cb.x),
        r: pw(Math.max(...tr.map((r) => r.x + r.width)) - cb.x),
        y: ph(Math.min(...tr.map((r) => r.y)) - cb.y),
        b: ph(Math.max(...tr.map((r) => r.y + r.height)) - cb.y),
      };
      const probe = document.createElement("div");
      probe.className = "cell-because";
      probe.style.position = "absolute";
      probe.style.animation = "none";
      el.appendChild(probe);
      const pr = probe.getBoundingClientRect();
      const cs = getComputedStyle(probe);
      const rimPx = parseFloat((cs.boxShadow.match(/(\d+(?:\.\d+)?)px/g) ?? ["2px"]).slice(-1)[0]);
      const lam = {
        x: pw(pr.x - cb.x),
        r: pw(pr.x + pr.width - cb.x),
        y: ph(pr.y - cb.y),
        b: ph(pr.y + pr.height - cb.y),
        rimPx,
        rimPctW: pw(rimPx),
        rimPctH: ph(rimPx),
        shadow: cs.boxShadow,
        inset: cs.inset,
      };
      probe.remove();
      const ov = (a: number, b: number, c: number, d: number) =>
        +Math.max(0, Math.min(b, d) - Math.max(a, c)).toFixed(2);
      return {
        cellPx: +cb.width.toFixed(2),
        tick,
        lam,
        lamLeftBand: [lam.x, +(lam.x + lam.rimPctW).toFixed(2)],
        lamBottomBand: [+(lam.b - lam.rimPctH).toFixed(2), lam.b],
        tickXinLamLeftBand: ov(tick.x, tick.r, lam.x, lam.x + lam.rimPctW),
        tickYcrossesLamBottom: ov(tick.y, tick.b, lam.b - lam.rimPctH, lam.b),
        tickInsideLamBody: ov(tick.y, tick.b, lam.y, lam.b),
      };
    }, cell);
    bank(`c4-${label}-${info.project.name}.json`, out);
    console.log(`CRITIC-C4|${label}|${info.project.name}|${JSON.stringify(out)}`);

    if (label === "desk" && info.project.name === "chromium") {
      // the ring ON over the same cell — a paint state, no layout move
      await page.evaluate((pos) => {
        const el = document.querySelectorAll(".game-cell")[pos] as HTMLElement;
        el.classList.add("is-peer-cursor");
      }, cell);
      await page.waitForTimeout(400);
      const b = await page.locator(".game-cell").nth(cell).boundingBox();
      if (b)
        await page.screenshot({
          path: join(BASE, "frames", "tick-inside-the-ring-light.png"),
          clip: {
            x: b.x - b.width * 0.1,
            y: b.y - b.height * 0.1,
            width: b.width * 1.2,
            height: b.height * 1.2,
          },
        });
    }
    await ctx.close();
  });
}
