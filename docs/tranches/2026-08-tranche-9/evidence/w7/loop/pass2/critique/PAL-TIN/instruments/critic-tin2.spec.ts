/**
 * PAL-TIN pass-2 CRITIC probe, part 2.
 *
 * C2 — THE LOWER-LEFT CORNER HAS TENANTS. The prototype banked the `.cell-because` rim and the
 * invalid/peer ring as UNARMED (its own gap 1) and asserted clearance. This measures the three
 * boxes in the cell's own units on the real surface: the tick's ink, the ghost ring's painted
 * stroke band, and the laminate's rim band (a probe node carrying `.cell-because`, so the rule
 * that paints it is the estate's own).
 * C3 — THE ROSTER ABLATION. `.player-name { flex: 0 1 auto }` is measured against `1 1 auto` on
 * the same page with a roster that carries NO tick, which is where it moves pixels for nothing.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/PAL-TIN/readings";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 1));

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
        if ((ev.data as { kind?: string })?.kind === "st") w.__st = (ev.data as any).data;
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
      const st = w.__st;
      w.__lam = (w.__lam ?? 1000) + 1;
      w.__ch.postMessage({
        kind: "op",
        data: { p: pos, v: value, s: 0, l: w.__lam, a: from, e: st.e, ea: st.ea },
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
  test(`C2 ${label} — the corner's three tenants, measured`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2 });
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
      const pctW = (v: number) => +((v / cb.width) * 100).toFixed(2);
      const pctH = (v: number) => +((v / cb.height) * 100).toFixed(2);
      // the tick's ink
      const tickPaths = [...el.querySelectorAll(".glyph-tick path")] as SVGPathElement[];
      const tr = tickPaths.map((p) => p.getBoundingClientRect());
      const tick = tr.length
        ? {
            x: pctW(Math.min(...tr.map((r) => r.x)) - cb.x),
            r: pctW(Math.max(...tr.map((r) => r.x + r.width)) - cb.x),
            y: pctH(Math.min(...tr.map((r) => r.y)) - cb.y),
            b: pctH(Math.max(...tr.map((r) => r.y + r.height)) - cb.y),
          }
        : null;
      // the ghost ring's painted stroke, and the width of its left band
      const gp = el.querySelector(".cell-ghost-path") as SVGPathElement | null;
      let ring = null as null | Record<string, number>;
      if (gp) {
        const gr = gp.getBoundingClientRect();
        const svg = gp.ownerSVGElement!;
        const vb = svg.viewBox.baseVal;
        const swUser = parseFloat(getComputedStyle(gp).strokeWidth || "0");
        const scale = svg.getBoundingClientRect().width / (vb.width || 100);
        const swPx = swUser * scale;
        ring = {
          x: pctW(gr.x - cb.x),
          r: pctW(gr.x + gr.width - cb.x),
          y: pctH(gr.y - cb.y),
          b: pctH(gr.y + gr.height - cb.y),
          strokePx: +swPx.toFixed(2),
          strokePctW: pctW(swPx),
        };
      }
      // the laminate's rim: a probe node wearing the estate's own class
      const probe = document.createElement("div");
      probe.className = "cell-because pointer-events-none absolute";
      probe.style.animation = "none";
      el.appendChild(probe);
      const pr = probe.getBoundingClientRect();
      const shadow = getComputedStyle(probe).boxShadow;
      const rimPx = parseFloat((shadow.match(/(\d+(?:\.\d+)?)px/g) ?? ["2px"]).slice(-1)[0]);
      const lam = {
        x: pctW(pr.x - cb.x),
        r: pctW(pr.x + pr.width - cb.x),
        y: pctH(pr.y - cb.y),
        b: pctH(pr.y + pr.height - cb.y),
        rimPx,
        rimPctW: pctW(rimPx),
        rimPctH: pctH(rimPx),
      };
      probe.remove();
      const overlap = (a: number, b: number, c: number, d: number) =>
        +Math.max(0, Math.min(b, d) - Math.max(a, c)).toFixed(2);
      const res: Record<string, unknown> = { cellPx: +cb.width.toFixed(2), tick, ring, lam };
      if (tick && ring) {
        // the ring's LEFT stroke band and its BOTTOM stroke band
        res.ringLeftBand = [ring.x, +(ring.x + ring.strokePctW).toFixed(2)];
        res.ringBottomBand = [+(ring.b - ring.strokePctW).toFixed(2), ring.b];
        res.tickXinRingLeftBand = overlap(tick.x, tick.r, ring.x, ring.x + ring.strokePctW);
        res.tickYcrossesRingBottom = overlap(
          tick.y,
          tick.b,
          ring.b - ring.strokePctW,
          ring.b,
        );
      }
      if (tick) {
        res.lamLeftBand = [lam.x, +(lam.x + lam.rimPctW).toFixed(2)];
        res.lamBottomBand = [+(lam.b - lam.rimPctH).toFixed(2), lam.b];
        res.tickXinLamLeftBand = overlap(tick.x, tick.r, lam.x, lam.x + lam.rimPctW);
        res.tickYcrossesLamBottom = overlap(tick.y, tick.b, lam.b - lam.rimPctH, lam.b);
      }
      return res;
    }, cell);
    bank(`c2-${label}-${info.project.name}.json`, out);
    console.log(`CRITIC-C2|${label}|${info.project.name}|${JSON.stringify(out)}`);
    await ctx.close();
  });
}

test("C3 — the roster ablation with no tick on any row", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(SOLO9);
  await settled(page);
  const room = await openRoom(page);
  const { st } = await fillRoom(page, room, 2); // three in the room, nobody on a lap
  expect(st).toBeTruthy();
  await page.waitForTimeout(500);
  const read = () =>
    page.evaluate(() => {
      const rows = [...document.querySelectorAll(".player-row-cells")];
      return rows.map((r) => {
        const name = r.querySelector(".player-name")?.getBoundingClientRect();
        const self = r.querySelector(".player-self")?.getBoundingClientRect();
        const ticks = r.querySelectorAll(".roster-tick").length;
        return {
          nameW: name ? +name.width.toFixed(2) : null,
          selfX: self ? +self.x.toFixed(2) : null,
          ticks,
        };
      });
    });
  const proto = await read();
  await page.addStyleTag({ content: ".player-name { flex: 1 1 auto !important }" });
  await page.waitForTimeout(200);
  const head = await read();
  const out = { proto, head };
  bank(`c3-roster-${info.project.name}.json`, out);
  console.log(`CRITIC-C3|${info.project.name}|${JSON.stringify(out)}`);
  await ctx.close();
});
