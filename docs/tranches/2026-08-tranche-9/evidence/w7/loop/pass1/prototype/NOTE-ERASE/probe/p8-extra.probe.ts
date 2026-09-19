/**
 * NOTE-ERASE pass-1 — the rows P1's first cut mis-sampled or missed.
 *
 *   P4b  the refusal's clock, sampled with the RUB-OUT counted (the hold ENDS the note by
 *        rubbing it out, and the rub-out is a beat: absence lands at hold + 1 beat + a frame)
 *   P8   the gold verdict at 1280 (the solve control lives in the drawer at 390)
 *   P9   the repeat, mechanism-traced: does the old line actually rub out?
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));
const say = (k: string, v: unknown) => console.log(`P8|${k}|${JSON.stringify(v)}`);

const BOARD = "?size=3&difficulty=EASY";

async function boardReady(page: Page, query = BOARD) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForTimeout(1200);
}

const readNote = (page: Page) =>
  page.evaluate(() => {
    const n = document.querySelector<HTMLElement>(".margin-note");
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!n) return null;
    return {
      text: (n.textContent || "").replace(/\s+/g, " ").trim(),
      tone: (n.getAttribute("class") || "").replace("margin-note", "").trim(),
      inkPresent: !!ink,
      leaving: !!ink?.classList.contains("note-leave-active"),
      age: ink?.getAttribute("data-note-age") ?? null,
      color: ink ? getComputedStyle(ink).color : null,
      quiet: !!document.querySelector(".margin-note-block.is-quiet"),
    };
  });

function ratio(a: number[], b: number[]) {
  const lum = (c: number[]) => {
    const f = (x: number) => {
      const v = x / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
}

async function paintedBytes(page: Page) {
  const box = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    return {
      x: Math.floor(r.left) - 2,
      y: Math.floor(r.top) - 2,
      width: Math.ceil(r.width) + 4,
      height: Math.ceil(r.height) + 4,
    };
  });
  if (!box || box.width <= 4 || box.height <= 4) return null;
  const buf = await page.screenshot({ clip: box, animations: "disabled" });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const counts = new Map<string, number>();
  const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const lums: { L: number; px: number[] }[] = [];
  for (let i = 0; i < data.length; i += ch) {
    const px = [data[i], data[i + 1], data[i + 2]];
    counts.set(px.join(","), (counts.get(px.join(",")) ?? 0) + 1);
    lums.push({ L: lum(px[0], px[1], px[2]), px });
  }
  let modal = "255,255,255";
  let best = 0;
  for (const [k, v] of counts) if (v > best) ((best = v), (modal = k));
  const paper = modal.split(",").map(Number);
  const paperL = lum(paper[0], paper[1], paper[2]);
  lums.sort((a, b) => Math.abs(b.L - paperL) - Math.abs(a.L - paperL));
  const p005 = lums[Math.min(lums.length - 1, Math.floor(lums.length * 0.005))].px;
  return {
    paper: `rgb(${paper.join(", ")})`,
    inkCorePx: `rgb(${lums[0].px.join(", ")})`,
    p005Ratio: ratio(p005, paper),
  };
}

test("P4b the refusal's clock, with the rub-out counted (G5)", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  const givenIdx = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !!(i as HTMLInputElement).value,
    ),
  );

  // ONE refusal — the sample train across the hold, in beats from the keystroke.
  const cell = page.locator(".sudoku-cell input").nth(givenIdx);
  await cell.click();
  const t0 = Date.now();
  await page.keyboard.press("5");
  const train: { beats: number; atMs: number; text: string; ink: boolean; leaving: boolean }[] =
    [];
  for (const beats of [23, 24.5, 25.5, 27]) {
    const target = beats * 125;
    const wait = target - (Date.now() - t0);
    if (wait > 0) await page.waitForTimeout(wait);
    const n = await readNote(page);
    train.push({
      beats,
      atMs: Date.now() - t0,
      text: n?.text ?? "",
      ink: !!n?.inkPresent,
      leaving: !!n?.leaving,
    });
  }

  // A SECOND refusal at beat 12 restarts the clock (ends at beat 36, gone by beat 38).
  await boardReady(page);
  const cell2 = page.locator(".sudoku-cell input").nth(givenIdx);
  await cell2.click();
  const t1 = Date.now();
  await page.keyboard.press("5");
  await page.waitForTimeout(Math.max(0, 1500 - (Date.now() - t1)));
  await cell2.click();
  await page.keyboard.press("6");
  const train2: { beats: number; atMs: number; text: string; ink: boolean }[] = [];
  for (const beats of [30, 35, 38, 40]) {
    const wait = beats * 125 - (Date.now() - t1);
    if (wait > 0) await page.waitForTimeout(wait);
    const n = await readNote(page);
    train2.push({
      beats,
      atMs: Date.now() - t1,
      text: n?.text ?? "",
      ink: !!n?.inkPresent,
    });
  }
  bank(`p4b-refusal-${browserName}.json`, { engine: browserName, train, train2 });
  say("P4b", { train, train2 });
  expect(train.length).toBe(4);
});

test("P8 the gold verdict never settles (G3), at 1280", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: scheme });
    await boardReady(page);
    await page
      .getByRole("button", { name: /^solve/i })
      .first()
      .click({ timeout: 8000 })
      .catch(() => {});
    await page.waitForTimeout(1000);
    const early = await readNote(page); // ~8 beats after the grade landed
    await page.waitForTimeout(1200);
    const at8beats = await readNote(page);
    await page.waitForTimeout(4000); // the crest passes, the voice unquiets
    const afterCrest = await readNote(page);
    const painted = afterCrest?.quiet ? null : await paintedBytes(page);
    rows.push({ scheme, early, at8beats, afterCrest, painted });
  }
  bank(`p8-gold-${browserName}.json`, { engine: browserName, rows });
  say("P8", rows.map((r: any) => ({
    scheme: r.scheme,
    text: r.at8beats?.text,
    tone: r.at8beats?.tone,
    age: r.at8beats?.age,
    afterCrestAge: r.afterCrest?.age,
    afterCrestColor: r.afterCrest?.color,
    painted: r.painted?.p005Ratio,
  })));
  expect(rows.length).toBe(2);
});

test("P9 the repeat, mechanism-traced (G6)", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  const givenIdx = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !!(i as HTMLInputElement).value,
    ),
  );
  const cell = page.locator(".sudoku-cell input").nth(givenIdx);
  await cell.click();
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  // Watch the span across the repeat: every class list and every text the node wears.
  const watcher = page.evaluate(() => {
    const block = document.querySelector<HTMLElement>(".margin-note-block");
    if (!block) return Promise.resolve(null);
    const states: { t: number; cls: string; text: string; anim: string }[] = [];
    const starts: string[] = [];
    const ends: string[] = [];
    let mutations = 0;
    const t0 = performance.now();
    block.addEventListener("animationstart", (e) =>
      starts.push((e as AnimationEvent).animationName),
    );
    block.addEventListener("animationend", (e) =>
      ends.push((e as AnimationEvent).animationName),
    );
    const mo = new MutationObserver((m) => (mutations += m.length));
    mo.observe(block, { childList: true, subtree: true, characterData: true });
    const tick = () => {
      const ink = block.querySelector<HTMLElement>(".margin-note-ink");
      states.push({
        t: Math.round(performance.now() - t0),
        cls: ink ? ink.className : "(absent)",
        text: (ink?.textContent || "").trim().slice(0, 24),
        anim: ink ? getComputedStyle(ink).animationName : "-",
      });
      if (performance.now() - t0 < 1400) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    return new Promise<{
      states: { t: number; cls: string; text: string; anim: string }[];
      starts: string[];
      ends: string[];
      mutations: number;
    }>((res) => {
      (window as unknown as { __neDone: () => void }).__neDone = () => {
        mo.disconnect();
        res({ states, starts, ends, mutations });
      };
    });
  });
  await page.waitForTimeout(200);
  await cell.click();
  await page.keyboard.press("6"); // the same sentence again
  await page.waitForTimeout(1400);
  await page.evaluate(() => (window as unknown as { __neDone: () => void }).__neDone());
  const trace = await watcher;
  const compressed: string[] = [];
  let last = "";
  for (const s of trace?.states ?? []) {
    const k = `${s.cls}|${s.text}|${s.anim}`;
    if (k !== last) {
      compressed.push(`${s.t}ms ${k}`);
      last = k;
    }
  }
  bank(`p9-repeat-${browserName}.json`, {
    engine: browserName,
    starts: trace?.starts,
    ends: trace?.ends,
    mutations: trace?.mutations,
    timeline: compressed,
  });
  say("P9", {
    starts: trace?.starts,
    ends: trace?.ends,
    mutations: trace?.mutations,
    timeline: compressed,
  });
  expect(trace).not.toBeNull();
});
