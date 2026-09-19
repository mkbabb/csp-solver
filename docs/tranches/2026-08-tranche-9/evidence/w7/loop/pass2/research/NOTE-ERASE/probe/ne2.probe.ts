/**
 * T9-W7 §7 · NOTE-ERASE — PASS-2 RESEARCH PROBE.
 * Runs against the pass-1 prototype worktree's build (read-only), :4248.
 *
 *   N1  the repeat's REGION-TEXT TRAJECTORY (mutation-time, not frame-time) + the
 *       board voice's `announce()` trajectory as the control  (charter row 1)
 *   N2  the refusal's hold across a park: box, offsetParent, timer survival  (row 2)
 *   N3  the verb's frame interval and distinct clip states PER FRAME  (row 5)
 *   N4  one LIVE mid-erase capture, ink extent measured off the raster  (row 6)
 *   N5  the gold note's painted-byte reader validated against the ledger  (row 7)
 *   N6  G9's deal half at 1280  (row 13)
 *
 * Banks JSON under ./logs, frames under ./frames.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "logs");
const FRAMES = join(HERE, "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const BOARD = "?size=3&difficulty=EASY";

async function boardReady(page: Page, query = BOARD) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}

const strip = (page: Page) =>
  page.evaluate(() => {
    const n = document.querySelector<HTMLElement>(".margin-note");
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    const r = (ink ?? n)?.getBoundingClientRect();
    return {
      text: (n?.textContent || "").replace(/\s+/g, " ").trim(),
      inkPresent: !!ink,
      rects: ink ? ink.getClientRects().length : -1,
      offsetParentNull: ink ? ink.offsetParent === null : null,
      box: r ? { w: +r.width.toFixed(1), h: +r.height.toFixed(1) } : null,
    };
  });

/** Focus a given cell (readonly / aria-disabled) so a keystroke is REFUSED. */
async function focusGiven(page: Page) {
  return page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>(".game-cell input"),
    );
    const given = inputs.find((i) => !!i.value);
    given?.focus();
    return !!given;
  });
}

async function focusEmpty(page: Page) {
  return page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>(".game-cell input"),
    );
    const empty = inputs.find((i) => !i.value);
    empty?.focus();
    return !!empty;
  });
}

/* ────────────────────────── N1 — the repeat's trajectory ────────────────────────── */

test("N1 repeat trajectory", async ({ page }, info) => {
  await boardReady(page);
  await focusGiven(page);

  // arm the recorders BEFORE the first refusal
  await page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>;
    const region = document.querySelector(".margin-note")!;
    const voice = document.querySelector(".board-voice")!;
    const t0 = performance.now();
    const traj: unknown[] = [];
    const voiceTraj: unknown[] = [];
    const starts: unknown[] = [];
    w.__t0 = t0;
    w.__traj = traj;
    w.__voiceTraj = voiceTraj;
    w.__starts = starts;
    // MUTATION-TIME text: what an AT observing this region actually sees change.
    new MutationObserver((recs) => {
      traj.push({
        t: +(performance.now() - t0).toFixed(1),
        n: recs.length,
        kinds: [...new Set(recs.map((r) => r.type))],
        text: (region.textContent || "").replace(/\s+/g, " ").trim(),
        spans: region.querySelectorAll(".margin-note-ink").length,
      });
    }).observe(region, { childList: true, characterData: true, subtree: true });
    new MutationObserver(() => {
      voiceTraj.push({
        t: +(performance.now() - t0).toFixed(1),
        text: (voice.textContent || "").replace(/\s+/g, " ").trim(),
      });
    }).observe(voice, { childList: true, characterData: true, subtree: true });
    document.addEventListener(
      "animationstart",
      (e) => {
        const a = e as AnimationEvent;
        const el = e.target as HTMLElement;
        if (!el.closest || !el.closest(".margin-note")) return;
        starts.push({
          t: +(performance.now() - t0).toFixed(1),
          name: a.animationName,
          cls: el.className,
        });
      },
      true,
    );
  });

  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  const afterFirst = await strip(page);
  await page.keyboard.press("5"); // THE REPEAT — same given, same sentence
  await page.waitForTimeout(900);
  const afterSecond = await strip(page);

  const rec = await page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>;
    return {
      traj: w.__traj,
      voiceTraj: w.__voiceTraj,
      starts: w.__starts,
    };
  });

  // CONTROL: the board's own announce() idiom on a repeated deal (same sentence twice).
  await page.evaluate(() => {
    const w = window as unknown as Record<string, unknown>;
    (w.__voiceTraj as unknown[]).length = 0;
  });
  for (let i = 0; i < 2; i++) {
    const dealt = await page
      .locator('button:has-text("Deal"), [aria-label*="Deal" i]')
      .first()
      .click({ timeout: 4000 })
      .then(
        () => true,
        () => false,
      );
    if (!dealt) break;
    await page.waitForTimeout(2000);
  }
  const control = await page.evaluate(
    () => (window as unknown as Record<string, unknown>).__voiceTraj,
  );

  bank(`n1-repeat-${info.project.name}.json`, {
    engine: info.project.name,
    afterFirst,
    afterSecond,
    regionTrajectory: rec.traj,
    marginVoiceTrajectory: rec.voiceTraj,
    animationStarts: rec.starts,
    boardVoiceControlOnRepeatedDeal: control,
  });
});

/* ────────────────────────── N2 — the hold across a park ────────────────────────── */

test("N2 park", async ({ page }, info) => {
  await boardReady(page);
  await focusGiven(page);
  const t0 = Date.now();
  await page.keyboard.press("5");
  await page.waitForTimeout(600);
  const atRefusal = await strip(page);

  // park: `g` is refused inside a cell input, so blur first (App.vue:774's own guard)
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.keyboard.press("g");
  await page.waitForTimeout(700);
  const parked = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    const board = document.querySelector<HTMLElement>(".board-shell");
    return {
      boardStillInDom: !!board,
      boardVisible: board ? board.checkVisibility?.() ?? null : null,
      inkPresent: !!ink,
      inkRects: ink ? ink.getClientRects().length : -1,
      inkOffsetParentNull: ink ? ink.offsetParent === null : null,
      inkCheckVisibility: ink ? ink.checkVisibility?.() ?? null : null,
      inkBox: ink
        ? (() => {
            const r = ink.getBoundingClientRect();
            return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
          })()
        : null,
      deckUp: !!document.querySelector(".gallery, .game-gallery, [class*='gallery']"),
    };
  });
  // hold is 24 beats = 3000ms from the refusal; sample behind the park
  while (Date.now() - t0 < 2800) await page.waitForTimeout(100);
  const at2_8s = await strip(page);
  while (Date.now() - t0 < 3600) await page.waitForTimeout(100);
  const at3_6s = await strip(page);

  // cancel the park (Escape returns to the board)
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1200);
  const afterCancel = await strip(page);

  bank(`n2-park-${info.project.name}.json`, {
    engine: info.project.name,
    atRefusal,
    parked,
    at2_8s,
    at3_6s,
    afterCancel,
  });
});

/* ──────────────────── N3 — frame interval and clip states per frame ──────────────────── */

test("N3 frame budget", async ({ page }, info) => {
  await boardReady(page);
  await focusEmpty(page);
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  const armed = await strip(page);

  const trace = await page.evaluate(async () => {
    const out: { t: number; clip: string; op: string; cls: string; present: boolean }[] = [];
    const t0 = performance.now();
    let stop = false;
    const tick = () => {
      const ink = document.querySelector<HTMLElement>(".margin-note-ink");
      const cs = ink ? getComputedStyle(ink) : null;
      out.push({
        t: +(performance.now() - t0).toFixed(2),
        clip: cs?.clipPath ?? "-",
        op: cs?.opacity ?? "-",
        cls: ink?.className ?? "-",
        present: !!ink,
      });
      if (!stop) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // retract: type a digit into the focused empty cell
    const el = document.activeElement as HTMLInputElement | null;
    if (el && el.tagName === "INPUT") {
      el.value = "1";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
    await new Promise((r) => setTimeout(r, 600));
    stop = true;
    return out;
  });

  const ivs: number[] = [];
  for (let i = 1; i < trace.length; i++) ivs.push(+(trace[i].t - trace[i - 1].t).toFixed(2));
  ivs.sort((a, b) => a - b);
  const median = ivs.length ? ivs[Math.floor(ivs.length / 2)] : null;
  const leaving = trace.filter((f) => f.cls.includes("note-leave"));
  const clips = [...new Set(leaving.map((f) => f.clip))];
  bank(`n3-frames-${info.project.name}.json`, {
    engine: info.project.name,
    armed,
    frames: trace.length,
    medianFrameIntervalMs: median,
    impliedHz: median ? +(1000 / median).toFixed(1) : null,
    leavingFrames: leaving.length,
    distinctClipStatesWhileLeaving: clips.length,
    clips,
    leavingWindowMs: leaving.length
      ? +(leaving[leaving.length - 1].t - leaving[0].t).toFixed(1)
      : null,
    trace: trace.slice(0, 120),
  });
});

/* ──────────────────── N4 — one LIVE mid-erase capture ──────────────────── */

test("N4 live mid-erase", async ({ page }, info) => {
  await boardReady(page);
  await focusEmpty(page);
  await page.keyboard.press("h");
  await page.waitForTimeout(1500);
  const box = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    return {
      x: Math.floor(r.left) - 2,
      y: Math.floor(r.top) - 2,
      width: Math.ceil(r.width) + 6,
      height: Math.ceil(r.height) + 4,
    };
  });
  if (!box) {
    bank(`n4-live-${info.project.name}.json`, { engine: info.project.name, error: "no ink" });
    return;
  }
  const settled = await page.screenshot({ clip: box, animations: "allow" });

  // fire the retraction and shoot as fast as the engine allows
  await page.evaluate(() => {
    const el = document.querySelector<HTMLInputElement>(".game-cell input:focus");
    if (el) {
      el.value = "1";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  const shots: { i: number; t: number; buf: Buffer }[] = [];
  const s0 = Date.now();
  for (let i = 0; i < 6; i++) {
    const t = Date.now() - s0;
    let buf: Buffer;
    try {
      buf = await page.screenshot({ clip: box, animations: "allow", timeout: 5000 });
    } catch {
      break;
    }
    shots.push({ i, t, buf });
    if (Date.now() - s0 > 400) break;
  }

  /** inked columns: the fraction of the line's width still carrying ink above threshold. */
  const extent = async (buf: Buffer, ref?: number) => {
    const { data, info: meta } = await sharp(buf)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const ch = meta.channels;
    const lum = (i: number) =>
      0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    // paper = the modal luminance
    const hist = new Map<number, number>();
    for (let p = 0; p < meta.width * meta.height; p++) {
      const L = Math.round(lum(p * ch));
      hist.set(L, (hist.get(L) ?? 0) + 1);
    }
    let paper = 0,
      best = -1;
    for (const [L, c] of hist) if (c > best) [best, paper] = [c, L];
    let rightmost = -1,
      inked = 0;
    const cols: number[] = [];
    for (let x = 0; x < meta.width; x++) {
      let hit = 0;
      for (let y = 0; y < meta.height; y++) {
        const L = lum((y * meta.width + x) * ch);
        if (Math.abs(L - paper) > 24) hit++;
      }
      cols.push(hit);
      if (hit > 0) {
        rightmost = x;
        inked += hit;
      }
    }
    return {
      w: meta.width,
      paper,
      rightmostInkedCol: rightmost,
      inkedPixels: inked,
      fractionOfWidth: rightmost >= 0 ? +((rightmost + 1) / meta.width).toFixed(4) : 0,
      fractionOfRef: ref ? +(((rightmost + 1) / meta.width / ref) * 1).toFixed(4) : null,
      cols,
    };
  };

  const settledExtent = await extent(settled);
  const rows: unknown[] = [];
  let banked: string | null = null;
  for (const s of shots) {
    const e = await extent(s.buf, settledExtent.fractionOfWidth);
    rows.push({ i: s.i, tMs: s.t, ...e, cols: undefined });
    const f = e.fractionOfWidth / settledExtent.fractionOfWidth;
    if (!banked && f > 0.12 && f < 0.9) {
      banked = `midErase-${info.project.name}.png`;
      writeFileSync(join(FRAMES, banked), s.buf);
    }
  }
  writeFileSync(join(FRAMES, `settled-ref-${info.project.name}.png`), settled);
  bank(`n4-live-${info.project.name}.json`, {
    engine: info.project.name,
    box,
    settled: { ...settledExtent, cols: undefined },
    shots: rows,
    bankedFrame: banked,
  });
});

/* ──────────────────── N5 — the gold painted-byte reader ──────────────────── */

test("N5 gold reader", async ({ page }, info) => {
  await boardReady(page, "?size=2&difficulty=EASY");
  // solve the board so the gold verdict lands
  const solved = await page
    .locator('button:has-text("Solve"), [aria-label*="Solve" i]')
    .first()
    .click({ timeout: 6000 })
    .then(
      () => true,
      () => false,
    );
  await page.waitForTimeout(4500);
  const s = await strip(page);
  const geo = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    const star = document.querySelector<HTMLElement>(".note-star");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    const sr = star?.getBoundingClientRect() ?? null;
    return {
      ink: { x: r.left, y: r.top, w: r.width, h: r.height },
      star: sr ? { x: sr.left, y: sr.top, w: sr.width, h: sr.height } : null,
      color: getComputedStyle(ink).color,
      bg: getComputedStyle(document.body).backgroundColor,
    };
  });
  const readCore = async (clip: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    const buf = await page.screenshot({ clip, animations: "disabled" });
    const { data, info: meta } = await sharp(buf)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const ch = meta.channels;
    const lum = (c: number[]) => {
      const f = (x: number) => {
        const v = x / 255;
        return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    };
    const px: number[][] = [];
    for (let p = 0; p < meta.width * meta.height; p++)
      px.push([data[p * ch], data[p * ch + 1], data[p * ch + 2]]);
    const key = (c: number[]) => c.join(",");
    const hist = new Map<string, number>();
    for (const c of px) hist.set(key(c), (hist.get(key(c)) ?? 0) + 1);
    let paper = px[0],
      best = -1;
    for (const [k, c] of hist)
      if (c > best) {
        best = c;
        paper = k.split(",").map(Number);
      }
    const Lp = lum(paper);
    const sorted = px
      .map((c) => ({ c, d: Math.abs(lum(c) - Lp) }))
      .sort((a, b) => b.d - a.d);
    const core = sorted[Math.floor(sorted.length * 0.005)]?.c ?? sorted[0].c;
    const cr = (a: number[], b: number[]) => {
      const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x);
      return +(((h + 0.05) / (l + 0.05)).toFixed(3));
    };
    return { paper, core, ratio: cr(core, paper), n: px.length };
  };
  let whole = null,
    afterStar = null;
  if (geo) {
    whole = await readCore({
      x: Math.floor(geo.ink.x) - 2,
      y: Math.floor(geo.ink.y) - 2,
      width: Math.ceil(geo.ink.w) + 4,
      height: Math.ceil(geo.ink.h) + 4,
    });
    const startX = geo.star ? geo.star.x + geo.star.w + 1 : geo.ink.x;
    afterStar = await readCore({
      x: Math.floor(startX),
      y: Math.floor(geo.ink.y) - 2,
      width: Math.max(8, Math.ceil(geo.ink.x + geo.ink.w - startX) + 2),
      height: Math.ceil(geo.ink.h) + 4,
    });
  }
  bank(`n5-gold-${info.project.name}.json`, {
    engine: info.project.name,
    solvedClicked: solved,
    strip: s,
    geo,
    paintedWholeBox: whole,
    paintedTextOnly_starExcluded: afterStar,
  });
});

/* ──────────────────── N6 — G9's deal half at 1280 ──────────────────── */

test("N6 g9 deal at 1280", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  await focusEmpty(page);
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  const armed = await strip(page);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.keyboard.press("g");
  await page.waitForTimeout(900);
  const dealt = await page
    .locator('button:has-text("Deal"), [aria-label*="Deal" i]')
    .first()
    .click({ timeout: 6000 })
    .then(
      () => true,
      () => false,
    );
  await page.waitForTimeout(2500);
  const afterDeal = await strip(page);
  bank(`n6-g9deal-${info.project.name}.json`, {
    engine: info.project.name,
    viewport: "1280x800",
    armed,
    dealClicked: dealt,
    afterDeal,
  });
});
