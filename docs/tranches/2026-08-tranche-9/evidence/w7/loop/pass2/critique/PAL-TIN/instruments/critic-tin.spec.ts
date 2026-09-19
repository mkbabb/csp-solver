/**
 * PAL-TIN pass-2 CRITIC probe. Re-runs one of the prototype's rows (the corner tick's geometry)
 * and closes the gap the prototype banked as UNPROVEN: the tick's box against the things that
 * already own the cell's lower band — the peer/invalid GHOST ring and the `.cell-because` rim.
 *
 * Helpers are the prototype's (probe/tin2-proto.spec.ts), copied so the subject is the same.
 * Writes only under pass2/critique/PAL-TIN/.
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
      const w = window as unknown as Record<string, unknown>;
      const ch = new BroadcastChannel(`board:${room}`);
      w.__ch = ch;
      w.__st = null;
      ch.onmessage = (ev: MessageEvent) => {
        if ((ev.data as { kind?: string })?.kind === "st") w.__st = (ev.data as { data: unknown }).data;
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

/** Every measurement in CELL PERCENT, the design's own unit, plus the cell's px width. */
const probe = async (page: Page, pos: number) =>
  page.evaluate((pos) => {
    const cell = document.querySelectorAll(".game-cell")[pos] as HTMLElement;
    if (!cell) return null;
    const cb = cell.getBoundingClientRect();
    const pct = (v: number, base: number) => +((v / base) * 100).toFixed(2);
    const inkBox = (svg: Element | null) => {
      if (!svg) return null;
      const paths = [...svg.querySelectorAll("path")] as SVGPathElement[];
      if (!paths.length) return null;
      const rs = paths.map((p) => p.getBoundingClientRect());
      const x = Math.min(...rs.map((r) => r.x));
      const y = Math.min(...rs.map((r) => r.y));
      const x2 = Math.max(...rs.map((r) => r.x + r.width));
      const y2 = Math.max(...rs.map((r) => r.y + r.height));
      return {
        x: pct(x - cb.x, cb.width),
        y: pct(y - cb.y, cb.height),
        r: pct(x2 - cb.x, cb.width),
        b: pct(y2 - cb.y, cb.height),
      };
    };
    const tick = inkBox(cell.querySelector(".glyph-tick"));
    const ghost = inkBox(cell.querySelector(".cell-ghost"));
    const becEl = cell.querySelector(".cell-because") as HTMLElement | null;
    let because: Record<string, number> | null = null;
    if (becEl) {
      const b = becEl.getBoundingClientRect();
      const shadow = getComputedStyle(becEl).boxShadow;
      const rimPx = parseFloat((shadow.match(/(\d+(?:\.\d+)?)px\s*$/) ?? [])[1] ?? "2");
      because = {
        x: pct(b.x - cb.x, cb.width),
        y: pct(b.y - cb.y, cb.height),
        r: pct(b.x + b.width - cb.x, cb.width),
        bo: pct(b.y + b.height - cb.y, cb.height),
        rimPx,
        rimPctW: pct(rimPx, cb.width),
        rimPctH: pct(rimPx, cb.height),
      };
    }
    return {
      cellW: +cb.width.toFixed(2),
      cellH: +cb.height.toFixed(2),
      invalid: cell.classList.contains("is-invalid"),
      peerCursor: cell.classList.contains("is-peer-cursor"),
      hasBecause: !!becEl,
      tick,
      ghost,
      because,
    };
  }, pos);

for (const [label, vp] of [
  ["desk", { width: 1280, height: 800 }],
  ["phone", { width: 390, height: 844 }],
] as const) {
  test(`C1 ${label} — the tick against the ring and the laminate rim`, async ({
    browser,
  }, info) => {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(SOLO9);
    await settled(page);
    const room = await openRoom(page);
    const { ids, st } = await fillRoom(page, room, 6);
    expect(st, "the room dealt").toBeTruthy();
    const ticker = ids[ids.length - 1];
    // two EMPTY cells in one row, same digit → the conflict ring arms on a ticked cell
    const pair = await page.evaluate(() => {
      const inputs = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
      for (let row = 0; row < 9; row++) {
        const free = [];
        for (let c = 0; c < 9; c++) {
          const n = row * 9 + c;
          if (inputs[n] && !inputs[n].value && !inputs[n].disabled) free.push(n);
        }
        if (free.length >= 2) return free.slice(0, 2);
      }
      return [];
    });
    expect(pair.length, "two free cells in one row").toBe(2);
    await peerWrites(page, ticker, pair[0], 1);
    await peerWrites(page, ticker, pair[1], 1);
    await page.waitForTimeout(700);
    const armed = await probe(page, pair[0]);
    // now arm a real hint: select a free cell and press the hint verb
    await page.evaluate(() => {
      const inputs = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
      const free = inputs.find((el) => !el.value && !el.disabled);
      free?.focus();
    });
    await openDock(page);
    const hint = page.locator(
      '.controls-card button[aria-label="Reveal a hint in the selected cell"]',
    );
    let becauseCells = 0;
    let becauseOnTick = 0;
    let becauseGeom: unknown = null;
    if (await hint.count()) {
      await hint.first().click({ force: true });
      await page.waitForTimeout(900);
      const r = await page.evaluate(() => {
        const cells = [...document.querySelectorAll(".game-cell")];
        const bec = cells.filter((c) => c.querySelector(".cell-because"));
        const withTick = bec.filter((c) => c.querySelector(".glyph-tick"));
        const idx = bec.length
          ? cells.indexOf(withTick[0] ?? bec[0])
          : -1;
        return { n: bec.length, withTick: withTick.length, idx };
      });
      becauseCells = r.n;
      becauseOnTick = r.withTick;
      if (r.idx >= 0) becauseGeom = await probe(page, r.idx);
    }
    const out = { viewport: vp, armed, becauseCells, becauseOnTick, becauseGeom };
    bank(`c1-${label}-${info.project.name}.json`, out);
    console.log(`CRITIC-C1|${label}|${info.project.name}|${JSON.stringify(out)}`);
    await ctx.close();
  });
}
