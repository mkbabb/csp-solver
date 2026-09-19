/**
 * PAL-TIN pass-2 RESEARCH probe — three rows the paper cannot answer.
 *
 * R1  THE THREE-PAGE ROOM (charter row 1). A real author, a real joiner, and one relaying
 *     page that is NOT the epoch's author. Drives the divergence the pass-1 critique found
 *     by measurement rather than by reading the code.
 * R2  THE RING, OFF PAINTED PIXELS (charter row 13). Screenshot the peer-cursor cell at
 *     dpr 3 and read the ring's own bytes, instead of compositing stroke-opacity on paper.
 * R3  THE UPRIGHT UNDER 1 / 4 / 7 (charter row 6), as a NUMBER: the painted gap between a
 *     digit's ink and the tick's top edge, in cell units, per numeral.
 *
 * Read-only on every product file. Served from the pass-1 prototype worktree on :4245.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/PAL-TIN/out";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 1));

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".game-cell .glyph-svg, .game-cell input").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(600);
}
async function openDock(page: Page) {
  const tab = page.locator(".drawer-tab");
  if ((await tab.count()) && (await tab.getAttribute("aria-expanded")) !== "true") {
    await tab.click();
    await page.waitForTimeout(900); // the sheet SLIDES
  }
}

test.describe("PAL-TIN pass 2", () => {
  test("R1 · the three-page room", async ({ browser }, info) => {
    // TWO CONTEXTS. One context shares `session-identity-v1`, so a second page in it inherits
    // the first's released peer id and believes it IS the epoch's author — the rig would then
    // measure nothing. Separate contexts mint separate players, which is the room this row is about.
    const ctxA = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctxA.newPage();
    await page.goto("./?size=3&difficulty=EASY&wire=local");
    await settled(page);
    await openDock(page);
    const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
    await expect(verb).toBeEnabled();
    await verb.click();
    await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
    const room = new URL(page.url()).searchParams.get("s")!;

    // A's own `st`, captured off the room's channel, plus A's id.
    const a = await page.evaluate(async (room) => {
      const w = window as unknown as Record<string, unknown>;
      const ch = new BroadcastChannel(`board:${room}`);
      let st: Record<string, unknown> | null = null;
      let author = "";
      ch.onmessage = (ev: MessageEvent) => {
        if (ev.data?.kind === "st") { st = ev.data.data; author = ev.data.from; }
        if (ev.data?.kind === "hi" && !author) author = ev.data.from;
      };
      await new Promise((r) => setTimeout(r, 500));
      for (let t = 0; t < 12 && !st; t++) {
        ch.postMessage({ kind: "hi", data: {}, from: "zzprobe-a" });
        await new Promise((r) => setTimeout(r, 350));
      }
      w.__ch = ch;
      return { st, author };
    }, room);
    expect(a.st, "page A published a snapshot").toBeTruthy();
    const st = a.st as Record<string, unknown>;
    const author = (st.ea as string) || a.author;
    await ctxA.close();

    // B joins by link, in its OWN context. It is not the author and holds epoch [0, ""].
    const ctxB = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const b = await ctxB.newPage();
    await b.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(b);
    await openDock(b);

    const self = await b.evaluate(async (room) => {
      const w = window as unknown as Record<string, unknown>;
      const ch = new BroadcastChannel(`board:${room}`);
      w.__ch = ch;
      let id = "";
      const said: string[] = [];
      w.__said = said;
      ch.onmessage = (ev: MessageEvent) => {
        if (!id && ev.data?.from) id = ev.data.from;
        if (ev.data?.from && ev.data.from !== "mm-relay")
          said.push(`${ev.data.from}:${ev.data.kind}:e${ev.data.data?.e ?? "-"}:ea${ev.data.data?.ea ?? "-"}`);
      };
      for (let t = 0; t < 20 && !id; t++) {
        ch.postMessage({ kind: "hi", data: {}, from: "mm-relay" });
        await new Promise((r) => setTimeout(r, 250));
      }
      return id;
    }, room);
    expect(self, "B's own peer id, read off its own ack").toBeTruthy();
    expect(self, "B is NOT the epoch's author — the whole point of the row").not.toBe(author);

    const read = () =>
      b.evaluate(() => {
        const row = document.querySelector(".players-roster .player-row");
        const sw = row?.querySelector(".player-swatch") as HTMLElement | null;
        return {
          rows: document.querySelectorAll(".players-roster .player-row").length,
          selfSwatch: sw ? getComputedStyle(sw).backgroundColor : null,
          selfTicks: row?.querySelectorAll(".roster-tick path").length ?? 0,
          allSwatches: [...document.querySelectorAll(".players-roster .player-swatch")].map(
            (e) => getComputedStyle(e as HTMLElement).backgroundColor,
          ),
          allTicks: [...document.querySelectorAll(".players-roster .player-row")].map(
            (r) => r.querySelectorAll(".roster-tick path").length,
          ),
          said: [...((window as unknown as Record<string, unknown>).__said as string[])],
        };
      });

    const send = (from: string, e: number, k: Record<string, number>) =>
      b.evaluate(
        async ({ room, from, e, k, st, author }) => {
          const ch = (window as unknown as Record<string, unknown>).__ch as BroadcastChannel;
          ch.postMessage({
            kind: "st",
            data: { ...st, e, ea: author, k },
            from,
          });
          await new Promise((r) => setTimeout(r, 900));
        },
        { room, from, e, k, st, author },
      );

    const e0 = (st.e as number) ?? 1;
    const before = await read();
    // 1 · a page that is NOT the author relays the author's board, and names B index 7.
    await send("mm-relay", e0 + 1, { [self]: 7, [author]: 0, "mm-relay": 1 });
    const afterRelay = await read();
    // 2 · the TRUE author deals a newer board and names B index 3.
    await send(author, e0 + 2, { [self]: 3, [author]: 0, "mm-relay": 1 });
    const afterAuthor = await read();

    const row = { engine: info.project.name, room, author, self, e0, before, afterRelay, afterAuthor,
      diverged: afterRelay.selfSwatch === afterAuthor.selfSwatch,
      refusedTheAuthor: before.selfSwatch === afterAuthor.selfSwatch,
      duplicateInks:
        afterAuthor.allSwatches.length - new Set(afterAuthor.allSwatches.map((c, i) => `${c}|${afterAuthor.allTicks[i]}`)).size };
    bank(`r1-three-page-${info.project.name}.json`, row);
    console.log("R1", JSON.stringify(row));
    await ctxB.close();
  });

  test("R2 · the ring, off painted pixels", async ({ browser }, info) => {
    for (const theme of ["light", "dark"] as const) {
      const ctx = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        deviceScaleFactor: 3,
        colorScheme: theme,
      });
      // The estate's theme is a CLASS on <html> driven by vueuse off `sudoku-color-scheme`
      // (`useTheme.ts:9`). `colorScheme` emulation alone leaves the page in light — measured:
      // the first cut of this probe read a light ground under `colorScheme: "dark"`.
      await ctx.addInitScript((t) => {
        try { localStorage.setItem("sudoku-color-scheme", t); } catch { /* private mode */ }
      }, theme);
      const page = await ctx.newPage();
      await page.goto("./?size=3&difficulty=EASY&wire=local");
      await settled(page);
      await openDock(page);
      const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
      await expect(verb).toBeEnabled();
      await verb.click();
      await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
      const room = new URL(page.url()).searchParams.get("s")!;

      // one fake peer, then its cursor on a known cell — the product's own `cur` path
      const ep = await page.evaluate(async (room) => {
        const w = window as unknown as Record<string, unknown>;
        const ch = new BroadcastChannel(`board:${room}`);
        w.__ch = ch;
        let st: Record<string, unknown> | null = null;
        ch.onmessage = (ev: MessageEvent) => { if (ev.data?.kind === "st") st = ev.data.data; };
        for (let t = 0; t < 14 && !st; t++) {
          ch.postMessage({ kind: "hi", data: {}, from: "zz01-peer" });
          await new Promise((r) => setTimeout(r, 300));
        }
        return st as unknown as { e: number; ea: string } | null;
      }, room);
      expect(ep, "the page published its epoch").toBeTruthy();
      // AN EMPTY, NON-GIVEN CELL. The first cut pointed the cursor at position 40 and read the
      // cell's CENTRE as the ground — on a board where 40 holds a given, that "ground" is the
      // digit's graphite and every ratio below it is nonsense (measured: rgb(14,15,10) called
      // paper in a light-mode run).
      const pos = await page.evaluate(() => {
        const cells = [...document.querySelectorAll(".game-cell")];
        const i = cells.findIndex(
          (c) =>
            (c.querySelector("input") as HTMLInputElement | null)?.disabled === false &&
            !c.querySelector("svg.glyph-svg"),
        );
        return i;
      });
      expect(pos, "an empty writable cell exists").toBeGreaterThan(-1);
      await page.evaluate(
        async ({ ep, pos }) => {
          const ch = (window as unknown as Record<string, unknown>).__ch as BroadcastChannel;
          ch.postMessage({ kind: "cur", data: { p: pos, e: ep!.e, ea: ep!.ea }, from: "zz01-peer" });
          await new Promise((r) => setTimeout(r, 700));
        },
        { ep, pos },
      );
      const cell = page.locator(".game-cell.is-peer-cursor").first();
      await expect(cell).toHaveCount(1);
      const drawn = await cell.evaluate((el) => {
        const p = el.querySelector(".cell-ghost-path") as SVGPathElement;
        const cs = getComputedStyle(p);
        return { strokeOpacity: cs.strokeOpacity, stroke: cs.stroke, width: cs.strokeWidth };
      });
      const shot = await cell.screenshot();
      const { data: raw, info: meta } = await sharp(shot)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const png = { width: meta.width, height: meta.height, data: raw };
      // the ground: the cell's own paper, read at the very centre (no ink there on an empty cell)
      const px = (x: number, y: number) => {
        const i = (png.width * y + x) << 2;
        return [png.data[i], png.data[i + 1], png.data[i + 2]] as [number, number, number];
      };
      const lin = (c: number) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4);
      const L = ([r, g, bb]: [number, number, number]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bb);
      const ratio = (a: [number, number, number], b: [number, number, number]) => {
        const x = L(a), y = L(b);
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      };
      const ground = px(png.width >> 1, png.height >> 1);
      // THE MASK, and it is the row's whole method problem. The cell's own rect contains the
      // board's GRID RULE (graphite) and can contain a digit (graphite too), and both sit in
      // the outer band where the ring is — the first cut of this probe read rgb(58,58,58),
      // the grid, and called it the ring. The ring is the only CHROMATIC ink in the box, so
      // the discriminant is chroma, not position: keep the pixels whose sRGB spread clears 10.
      const chroma = (p: [number, number, number]) => Math.max(...p) - Math.min(...p);
      let best: [number, number, number] = ground, bestR = 1, n = 0;
      const hits: number[] = [];
      for (let y = 0; y < png.height; y++)
        for (let x = 0; x < png.width; x++) {
          const p = px(x, y);
          if (chroma(p) <= Math.max(10, chroma(ground) + 6)) continue;
          const r = ratio(p, ground);
          n++; hits.push(r);
          if (r > bestR) { bestR = r; best = p; }
        }
      hits.sort((a, b) => b - a);
      const htmlDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
      const row = {
        engine: info.project.name, theme, htmlDark, drawn,
        pos,
        cellPx: { w: png.width, h: png.height },
        groundByte: ground, ringExtremeByte: best,
        ringRatioExtreme: +bestR.toFixed(3),
        ringRatioP90: +(hits[Math.floor(hits.length * 0.1)] ?? 0).toFixed(3),
        ringRatioMedian: +(hits[Math.floor(hits.length * 0.5)] ?? 0).toFixed(3),
        ringRatioFloor: +(hits[hits.length - 1] ?? 0).toFixed(3),
        chromaticPixels: n,
      };
      bank(`r2-ring-${info.project.name}-${theme}.json`, row);
      console.log("R2", JSON.stringify(row));
      await ctx.close();
    }
  });

  test("R3 · the upright under 1 / 4 / 7", async ({ page }, info) => {
    await page.goto("./?size=3&difficulty=EASY&wire=local");
    await settled(page);
    const rows: unknown[] = [];
    const empties = await page.evaluate(() =>
      [...document.querySelectorAll(".game-cell")]
        .map((c, i) => ({ i, free: (c.querySelector("input") as HTMLInputElement | null)?.disabled === false }))
        .filter((r) => r.free)
        .map((r) => r.i),
    );
    const digits = ["1", "4", "7", "9", "3"];
    for (let n = 0; n < digits.length; n++) {
      const d = digits[n];
      const idx = empties[n];
      const cell = page.locator(".game-cell").nth(idx);
      await cell.locator("input").click();
      await page.keyboard.press(d);
      await page.waitForTimeout(800);
      const got = await cell.evaluate((el, d) => {
        const svg = el.querySelector("svg.glyph-svg") as SVGSVGElement | null;
        if (!svg) return null;
        const vb = svg.viewBox.baseVal;
        let bot = -Infinity, top = Infinity, l = Infinity, r = -Infinity;
        for (const p of svg.querySelectorAll("path")) {
          const bb = (p as SVGPathElement).getBBox();
          bot = Math.max(bot, bb.y + bb.height);
          top = Math.min(top, bb.y);
          l = Math.min(l, bb.x);
          r = Math.max(r, bb.x + bb.width);
        }
        if (!Number.isFinite(bot)) return null;
        const cellBox = el.getBoundingClientRect();
        const svgBox = svg.getBoundingClientRect();
        const sy = svgBox.height / vb.height, sx = svgBox.width / vb.width;
        const inkBottomPx = svgBox.top - cellBox.top + bot * sy;
        const inkTopPx = svgBox.top - cellBox.top + top * sy;
        const inkLeftPx = svgBox.left - cellBox.left + l * sx;
        const inkRightPx = svgBox.left - cellBox.left + r * sx;
        return {
          digit: d,
          drawn: (el.querySelector("input") as HTMLInputElement).value,
          cellPx: +cellBox.height.toFixed(2),
          svgPctOfCell: +((svgBox.height / cellBox.height) * 100).toFixed(2),
          inkBottomPctOfCell: +((inkBottomPx / cellBox.height) * 100).toFixed(2),
          inkTopPctOfCell: +((inkTopPx / cellBox.height) * 100).toFixed(2),
          inkLeftPctOfCell: +((inkLeftPx / cellBox.width) * 100).toFixed(2),
          inkRightPctOfCell: +((inkRightPx / cellBox.width) * 100).toFixed(2),
          inkWidthPctOfCell: +(((inkRightPx - inkLeftPx) / cellBox.width) * 100).toFixed(2),
        };
      }, d);
      if (got) rows.push(got);
    }
    // the tick's own geometry, from PlayerTick.vue: uprights run y 85 → 97 in a 100-box,
    // centred at x 50 at 7-unit spacing.
    const TICK_TOP = 85;
    const out = rows.map((r) => {
      const g = r as { digit: string; inkBottomPctOfCell: number; inkLeftPctOfCell: number; inkRightPctOfCell: number; cellPx: number };
      return {
        ...g,
        gapToTickPctOfCell: +(TICK_TOP - g.inkBottomPctOfCell).toFixed(2),
        gapPx: +(((TICK_TOP - g.inkBottomPctOfCell) / 100) * g.cellPx).toFixed(2),
        tickUnderInk: g.inkLeftPctOfCell <= 50 && g.inkRightPctOfCell >= 50,
      };
    });
    bank(`r3-digit-gap-${info.project.name}.json`, out);
    console.log("R3", JSON.stringify(out));
  });
});
