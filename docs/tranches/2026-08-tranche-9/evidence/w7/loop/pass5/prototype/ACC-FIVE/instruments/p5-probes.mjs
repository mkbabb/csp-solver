/**
 * ACC-FIVE pass 5 · three small reads.
 *
 *  A. FORK A's control pane: what paints the near-black stroke in the control's top band at the
 *     win under `prefers-contrast: more` while `.progress-trace` computes violet. `elementFromPoint`
 *     down the band's centre column, every hit's tag/class/computed stroke/opacity (a rect is not
 *     paint: the hit list is the claim).
 *  B. The SCREEN-READER mirror: after each of five hints, the gauge's `aria-valuenow` beside the
 *     visually-hidden `.progress-trace-a11y` text, both arms, read after the tween settles.
 *  C. join-language's `ringFront`, old reading vs the re-cut, at the FIRST frame a `.join-trace`
 *     exists (dev server, `?wire=local`): the dash reading returns 1000 for a ring barely begun.
 *
 *   node p5-probes.mjs <proto-dist> <control-dist> <proto-dev> <out.json>
 */
import { writeFileSync } from "node:fs";
import { chromium, webkit, mintFromControl, assertSameBoard, settled } from "./p5-lib.mjs";

const [PROTO, CTRL, DEV, OUT] = process.argv.slice(2);
const board = await mintFromControl(CTRL);
const out = { payload: board.payload };

// A
{
  const b = await chromium.launch();
  out.A = {};
  for (const [arm, base] of [["proto", PROTO], ["control", CTRL]]) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: "light", contrast: "more", reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(base + board.query);
    await p.waitForSelector(".sudoku-cell");
    await p.waitForTimeout(1200);
    await assertSameBoard(p, board.cells);
    await p.evaluate(() => document.querySelector('[aria-label="Solve puzzle"]')?.click());
    await p.waitForSelector(".solve-success", { timeout: 20000 });
    await p.mouse.move(2, 2);
    await p.waitForTimeout(800);
    out.A[arm] = await p.evaluate(() => {
      const g = document.querySelector("svg.hand-drawn-grid").getBoundingClientRect();
      const x = g.x + g.width * 0.5;
      const hits = [];
      for (let y = Math.floor(g.y - 8); y <= g.y + 8; y += 2) {
        const els = document.elementsFromPoint(x, y).slice(0, 3);
        hits.push({
          y: +(y - g.y).toFixed(0),
          top: els.map((e) => {
            const cs = getComputedStyle(e);
            return `${e.tagName.toLowerCase()}.${(e.getAttribute("class") ?? "").split(" ").join(".")} stroke=${cs.stroke} op=${cs.opacity}/${cs.strokeOpacity}`;
          }),
        });
      }
      const t = document.querySelector(".progress-trace");
      return {
        hits,
        trace: t && {
          stroke: getComputedStyle(t).stroke,
          dash: getComputedStyle(t).strokeDasharray,
          offset: getComputedStyle(t).strokeDashoffset,
          poseOpacity: getComputedStyle(t.parentElement).opacity,
          visibility: getComputedStyle(t).visibility,
        },
      };
    });
    await ctx.close();
  }
  await b.close();
}

// B
{
  out.B = {};
  for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
    const b = await type.launch();
    for (const [arm, base] of [["proto", PROTO], ["control", CTRL]]) {
      const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "no-preference" });
      const p = await ctx.newPage();
      await p.goto(base + board.query);
      await p.waitForSelector(".sudoku-cell");
      await p.waitForTimeout(1200);
      const rows = [];
      for (let i = 0; i < 5; i++) {
        await p.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click());
        const r = await settled(p, () => ({
          now: document.querySelector("[aria-valuenow]")?.getAttribute("aria-valuenow"),
          text: document.querySelector(".progress-trace-a11y")?.textContent?.trim(),
          role: document.querySelector(".progress-trace-a11y")?.getAttribute("role") ?? document.querySelector("[aria-valuenow]")?.getAttribute("role"),
        }));
        rows.push(r.value);
      }
      out.B[`${name}/${arm}`] = rows;
      await ctx.close();
    }
    await b.close();
  }
}

// C
{
  out.C = {};
  for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
    const b = await type.launch();
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const a = await ctx.newPage();
    await a.goto(DEV + "/?wire=local");
    await a.waitForSelector(".sudoku-cell");
    await a.waitForTimeout(1500);
    await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
    await a.waitForFunction(() => new URL(location.href).searchParams.get("s"));
    await a.waitForTimeout(1600);
    const link = a.url();
    // arm a watcher that records BOTH readings on the first frame the ring exists
    await a.evaluate(() => {
      window.__first = null;
      const tick = () => {
        const p = document.querySelector(".join-trace");
        if (p && !window.__first) {
          window.__first = {
            oldDash: 1000 - parseFloat(getComputedStyle(p).strokeDashoffset),
            newWhole: /Z\s*$/i.test(p.getAttribute("d") ?? "") ? 1000 : 0,
            dLength: (p.getAttribute("d") ?? "").length,
          };
        }
        if (!window.__first) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    const bb = await ctx.newPage();
    await bb.goto(link);
    await bb.waitForSelector(".sudoku-cell");
    await a.waitForFunction(() => window.__first, null, { timeout: 15000 }).catch(() => {});
    out.C[name] = await a.evaluate(() => window.__first);
    await b.close();
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 1));
