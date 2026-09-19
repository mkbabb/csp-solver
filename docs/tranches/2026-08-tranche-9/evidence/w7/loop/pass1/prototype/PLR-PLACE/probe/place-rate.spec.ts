/**
 * PLR-PLACE · PROTOTYPE GATES G1 + G4 — THE RATE, AND THE STILLNESS OF THE HEAD.
 *
 * The pass-1 research banked four real traces of the product's own wire (`rate.spec.ts`, two
 * engines, `BroadcastChannel.postMessage` tapped in an `addInitScript`). This gate REPLAYS the
 * banked ORDINARY and SWEEP traces onto a live room at their recorded cadence — the same
 * frames, the same gaps — and counts what the PROTOTYPE actually paints:
 *
 *   G1 — with the sheet OPEN, how many times a dot's `cx` changes (a STEP), per peer per
 *        minute, under `WASH.placeSettleMs` 700. The banked raw rate is 74.7 / 71.4 a minute
 *        ordinary and 469.8 / 463.6 on the sweep.
 *   G4 — with the sheet SHUT, how many DOM mutations happen under `[data-player-mark]` over
 *        60 s of that sweep. The head is still by construction; this counts the construction.
 *
 * The replay is the product's own message shape from an id the room has met (`hi` first), so
 * nothing is forged that the grammar does not carry.
 */
import { test, expect, type Page } from "@playwright/test";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const HOME =
  process.env.PLC_HOME ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PLR-PLACE";
const BANK =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/PLR-PLACE/logs";
const OUT = join(HOME, "logs");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

/** The banked trace, as gaps from its own first frame. */
function banked(engine: string, arm: "ordinary" | "sweep") {
  const raw = JSON.parse(
    readFileSync(join(BANK, `rate-${engine === "webkit" ? "webkit" : "chromium"}.json`), "utf8"),
  ) as { trace: Record<string, { t: number; p: number | null }[]> };
  const trace = raw.trace[arm];
  const t0 = trace[0].t;
  return trace.map((f) => ({ dt: f.t - t0, p: f.p }));
}

test("THE RATE AND THE STILL HEAD — G1 and G4 on the banked traces", async ({
  browser,
}, info) => {
  const eng = info.project.name;
  mkdirSync(OUT, { recursive: true });
  const bankOut: Record<string, unknown> = {};
  const rec = (k: string, v: unknown) => {
    bankOut[k] = v;
    say(k, v);
  };

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const room = new URL(link).searchParams.get("s")!;
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);

  // the epoch, and a channel this page can publish on
  await a.evaluate((r) => {
    const w = window as unknown as { __st: unknown; __ch: BroadcastChannel };
    w.__st = null;
    const ch = new BroadcastChannel(`board:${r}`);
    w.__ch = ch;
    ch.onmessage = (ev: MessageEvent) => {
      if (ev.data?.kind === "st") w.__st = ev.data.data;
    };
  }, room);
  await b.evaluate(() => {
    const ch = new BroadcastChannel(`board:${new URL(location.href).searchParams.get("s")}`);
    ch.postMessage({ kind: "hi", data: {}, from: "p-probe000000" });
    ch.close();
  });
  await a.waitForTimeout(700);
  const joined = await a.evaluate(() => {
    const w = window as unknown as {
      __st: { e: number; ea: string } | null;
      __ch: BroadcastChannel;
    };
    if (!w.__st) return "no st";
    w.__ch.postMessage({ kind: "hi", data: { ack: true }, from: "p-trace000000" });
    return "joined";
  });
  rec("replay.peer", joined);
  await a.waitForTimeout(600);

  /** Replay one banked arm from inside the page, and count what the chart paints. */
  async function replay(arm: "ordinary" | "sweep", trace: { dt: number; p: number | null }[], open: boolean) {
    // open or shut the sheet
    const markOpen = await a.locator("[data-lobby]").count();
    if (open && !markOpen) {
      await a.locator("[data-player-mark]").first().click();
      await a.waitForTimeout(900);
    }
    if (!open && markOpen) {
      await a.mouse.click(640, 700);
      await a.waitForTimeout(400);
    }
    const res = await a.evaluate(
      async ([frames, watchHead]) => {
        const w = window as unknown as {
          __st: { e: number; ea: string };
          __ch: BroadcastChannel;
        };
        const { e, ea } = w.__st;
        // A STEP is one PAINT, not one attribute: Vue patches `cx` and `cy` in the same task
        // and the observer hands them over in one callback, so the batch is the step.
        const counts = { steps: 0, cx: 0, cy: 0, dotsAdded: 0, headMutations: 0, records: 0 };
        const chart = document.querySelector("[data-lobby] .place-chart");
        const head = [...document.querySelectorAll("[data-player-mark]")].find(
          (el) => (el as HTMLElement).getBoundingClientRect().width > 0,
        )!;
        const obs = new MutationObserver((recs) => {
          counts.steps++;
          for (const r of recs) {
            counts.records++;
            if (watchHead) {
              counts.headMutations++;
              continue;
            }
            if (r.type === "attributes" && r.attributeName === "cx") counts.cx++;
            if (r.type === "attributes" && r.attributeName === "cy") counts.cy++;
            if (r.type === "childList") counts.dotsAdded += r.addedNodes.length;
          }
        });
        obs.observe(watchHead ? head : chart!, {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: true,
        });
        // AND THE UNAMBIGUOUS READING: sample the dot's own (cx, cy) once per animation frame
        // and count the frames where it differs from the frame before. That is exactly "how
        // many times does a reader see the dot jump" — no batching artefact, no double count
        // when Vue happens to write `cx` and `cy` in two patches.
        let jumps = 0;
        let last = "";
        let sampling = true;
        const sample = () => {
          if (!sampling) return;
          const d = document.querySelector("[data-lobby] .chart-dot");
          const now = d ? `${d.getAttribute("cx")},${d.getAttribute("cy")}` : "";
          if (now && last && now !== last) jumps++;
          if (now) last = now;
          requestAnimationFrame(sample);
        };
        if (!watchHead) requestAnimationFrame(sample);
        const t0 = performance.now();
        for (const f of frames as { dt: number; p: number | null }[]) {
          const wait = f.dt - (performance.now() - t0);
          if (wait > 0) await new Promise((r) => setTimeout(r, wait));
          w.__ch.postMessage({
            kind: "cur",
            data: { p: f.p, e, ea },
            from: "p-trace000000",
          });
        }
        // let the last settle timer fire
        await new Promise((r) => setTimeout(r, 900));
        obs.disconnect();
        sampling = false;
        const span = (performance.now() - t0) / 60000;
        return { ...counts, jumps, spanMin: +span.toFixed(3) };
      },
      [trace, !open] as [unknown, boolean],
    );
    return res;
  }

  // ── G1, sheet OPEN ───────────────────────────────────────────────────────────────────
  const ord = banked(eng, "ordinary");
  const ordRes = await replay("ordinary", ord, true);
  rec("g1.ordinary", {
    frames: ord.length,
    ...ordRes,
    movesPerMin: +(ordRes.jumps / ordRes.spanMin).toFixed(1),
    batchesPerMin: +(ordRes.steps / ordRes.spanMin).toFixed(1),
    bankedRaw: eng === "webkit" ? 71.4 : 74.7,
    bankedSettle700: eng === "webkit" ? 37.2 : 33.3,
  });

  const swp = banked(eng, "sweep");
  const swpRes = await replay("sweep", swp, true);
  rec("g1.sweep", {
    frames: swp.length,
    ...swpRes,
    movesPerMin: +(swpRes.jumps / swpRes.spanMin).toFixed(1),
    batchesPerMin: +(swpRes.steps / swpRes.spanMin).toFixed(1),
    bankedRaw: eng === "webkit" ? 463.6 : 469.8,
    bankedSettle700: 3.0,
  });

  // ── G4, sheet SHUT, 60 s of the sweep (three consecutive replays) ────────────────────
  let head = { headMutations: 0, records: 0, steps: 0, spanMin: 0 };
  for (let i = 0; i < 3; i++) {
    const r = await replay("sweep", swp, false);
    head = {
      headMutations: head.headMutations + r.headMutations,
      records: head.records + r.records,
      steps: head.steps + r.steps,
      spanMin: +(head.spanMin + r.spanMin).toFixed(3),
    };
  }
  rec("g4.headStill", { ...head, sheetOpenDuring: await a.locator("[data-lobby]").count() });

  writeFileSync(join(OUT, `rate-${eng}.json`), JSON.stringify({ engine: eng, ...bankOut }, null, 1));
  expect(head.headMutations, "G4: the head is still").toBe(0);
  await ctx.close();
});
