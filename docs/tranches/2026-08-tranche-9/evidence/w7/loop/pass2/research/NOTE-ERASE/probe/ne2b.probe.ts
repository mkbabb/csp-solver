/**
 * T9-W7 §7 · NOTE-ERASE — PASS-2 RESEARCH PROBE, part B.
 *   N4b  the LIVE mid-erase frame, ink extent off the exact rect (row 6)
 *   N2b  what a park actually does to the note: box, scale, a11y, 390 + 1280, PRM (row 2)
 *   N6b  G9's deal half at 1280, with the control discovered rather than guessed (row 13)
 *   N5b  the gold tone's painted core in DARK, star present and star excluded (row 7)
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
      box: r ? { w: +r.width.toFixed(1), h: +r.height.toFixed(1) } : null,
    };
  });
const focusEmpty = (page: Page) =>
  page.evaluate(() => {
    const i = Array.from(
      document.querySelectorAll<HTMLInputElement>(".game-cell input"),
    ).find((x) => !x.value);
    i?.focus();
    return !!i;
  });
const focusGiven = (page: Page) =>
  page.evaluate(() => {
    const i = Array.from(
      document.querySelectorAll<HTMLInputElement>(".game-cell input"),
    ).find((x) => !!x.value);
    i?.focus();
    return !!i;
  });

/** inked-column profile of a crop: where the line still carries ink. */
async function profile(buf: Buffer) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const lum = (i: number) => 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  const hist = new Map<number, number>();
  for (let p = 0; p < info.width * info.height; p++) {
    const L = Math.round(lum(p * ch));
    hist.set(L, (hist.get(L) ?? 0) + 1);
  }
  let paper = 0,
    best = -1;
  for (const [L, c] of hist) if (c > best) [best, paper] = [c, L];
  const cols: number[] = [];
  for (let x = 0; x < info.width; x++) {
    let hit = 0;
    for (let y = 0; y < info.height; y++)
      if (Math.abs(lum((y * info.width + x) * ch) - paper) > 20) hit++;
    cols.push(hit);
  }
  const inkedCols = cols.filter((c) => c > 0).length;
  let right = -1;
  for (let x = cols.length - 1; x >= 0; x--)
    if (cols[x] > 0) {
      right = x;
      break;
    }
  return {
    w: info.width,
    paper,
    inkedPixels: cols.reduce((a, b) => a + b, 0),
    inkedCols,
    rightmostInkedCol: right,
    cols,
  };
}

test("N4b live mid-erase", async ({ page }, info) => {
  await boardReady(page);
  await focusEmpty(page);
  await page.keyboard.press("h");
  await page.waitForTimeout(1500);
  const box = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    return {
      x: Math.round(r.left),
      y: Math.round(r.top),
      width: Math.round(r.width),
      height: Math.round(r.height),
    };
  });
  if (!box) return bank(`n4b-${info.project.name}.json`, { error: "no ink" });
  const settledBuf = await page.screenshot({ clip: box, animations: "allow" });
  const settled = await profile(settledBuf);
  writeFileSync(join(FRAMES, `n4b-settled-${info.project.name}.png`), settledBuf);

  await page.evaluate(() => {
    const el = document.querySelector<HTMLInputElement>(".game-cell input:focus");
    if (el) {
      el.value = "1";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
  const shots: { t: number; buf: Buffer }[] = [];
  const s0 = Date.now();
  for (let i = 0; i < 8; i++) {
    const t = Date.now() - s0;
    let buf: Buffer;
    try {
      buf = await page.screenshot({ clip: box, animations: "allow", timeout: 5000 });
    } catch {
      break;
    }
    shots.push({ t, buf });
    if (Date.now() - s0 > 300) break;
  }
  const rows: { shotStartedAtMs: number; rightmostInkedCol: number; widthFractionRemaining: number; inkFractionRemaining: number; inkedCols: number; idx: number }[] = [];
  let banked: string | null = null;
  let bankedRow: unknown = null;
  for (let i = 0; i < shots.length; i++) {
    const s = shots[i];
    const p = await profile(s.buf);
    const frac = settled.rightmostInkedCol > 0 ? p.rightmostInkedCol / settled.rightmostInkedCol : 0;
    const inkFrac = settled.inkedPixels ? p.inkedPixels / settled.inkedPixels : 0;
    rows.push({
      idx: i,
      shotStartedAtMs: s.t,
      rightmostInkedCol: p.rightmostInkedCol,
      widthFractionRemaining: +frac.toFixed(4),
      inkFractionRemaining: +inkFrac.toFixed(4),
      inkedCols: p.inkedCols,
    });
  }
  // bank the ONE frame closest to half erased (the pose a number cannot say)
  const mid = rows
    .filter((r) => r.widthFractionRemaining > 0.08 && r.widthFractionRemaining < 0.92)
    .sort((a, b) => Math.abs(a.widthFractionRemaining - 0.5) - Math.abs(b.widthFractionRemaining - 0.5))[0];
  if (mid) {
    banked = `midErase-${info.project.name}.png`;
    writeFileSync(join(FRAMES, banked), shots[mid.idx].buf);
    bankedRow = mid;
  }
  bank(`n4b-${info.project.name}.json`, {
    engine: info.project.name,
    box,
    settled: { ...settled, cols: undefined, colProfileHead: settled.cols.slice(0, 20) },
    shots: rows,
    bankedFrame: banked,
    bankedRow,
  });
});

test("N2b park detail", async ({ page }, info) => {
  const out: Record<string, unknown> = { engine: info.project.name };
  for (const vp of [
    { w: 390, h: 844, n: "390x844" },
    { w: 1280, h: 800, n: "1280x800" },
  ]) {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await boardReady(page);
    await focusGiven(page);
    const t0 = Date.now();
    await page.keyboard.press("5");
    await page.waitForTimeout(500);
    const atRefusal = await strip(page);
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
    await page.keyboard.press("g");
    const samples: unknown[] = [];
    for (const at of [800, 1600, 2400]) {
      while (Date.now() - t0 < at) await page.waitForTimeout(60);
      samples.push(
        await page.evaluate((ms) => {
          const ink = document.querySelector<HTMLElement>(".margin-note-ink");
          const blk = document.querySelector<HTMLElement>(".margin-note-block");
          const layout = document.querySelector<HTMLElement>(
            ".app-layout, #app > .layout, main",
          );
          const chain: string[] = [];
          let el: HTMLElement | null = ink ?? blk;
          let scale = 1;
          while (el && chain.length < 14) {
            const cs = getComputedStyle(el);
            if (cs.display === "none" || cs.transform !== "none" || cs.visibility !== "visible")
              chain.push(
                `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}|d:${cs.display}|t:${cs.transform}|v:${cs.visibility}`,
              );
            const m = new DOMMatrixReadOnly(cs.transform === "none" ? "" : cs.transform);
            scale *= m.a || 1;
            el = el.parentElement;
          }
          const r = ink?.getBoundingClientRect();
          return {
            atMs: ms,
            text: (
              document.querySelector(".margin-note")?.textContent || ""
            ).replace(/\s+/g, " ").trim(),
            inkPresent: !!ink,
            inkRects: ink ? ink.getClientRects().length : -1,
            inkOffsetParentNull: ink ? ink.offsetParent === null : null,
            inkCheckVisibility: ink ? (ink.checkVisibility?.() ?? null) : null,
            inkBox: r ? { w: +r.width.toFixed(1), h: +r.height.toFixed(1) } : null,
            cumulativeScaleX: +scale.toFixed(4),
            effectiveFontPx: ink
              ? +(parseFloat(getComputedStyle(ink).fontSize) * scale).toFixed(2)
              : null,
            interestingAncestors: chain,
            layoutDisplay: layout ? getComputedStyle(layout).display : null,
          };
        }, at),
      );
    }
    while (Date.now() - t0 < 3700) await page.waitForTimeout(60);
    const at3_7s = await strip(page);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1400);
    const afterCancel = await strip(page);
    out[vp.n] = { atRefusal, samples, at3_7s, afterCancel };
  }
  bank(`n2b-park-${info.project.name}.json`, out);
});

test("N6b g9 deal 1280", async ({ page }, info) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  await focusEmpty(page);
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  const armed = await strip(page);
  // park, then come back, then DEAL from the open drawer at 1280
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.keyboard.press("g");
  await page.waitForTimeout(1200);
  const parked = await strip(page);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1500);
  const afterCancel = await strip(page);
  const controls = await page.evaluate(() =>
    Array.from(document.querySelectorAll("button"))
      .map((b) => ({
        label: b.getAttribute("aria-label"),
        text: (b.textContent || "").replace(/\s+/g, " ").trim().slice(0, 30),
        visible: b.checkVisibility?.() ?? null,
        cls: (b.className || "").toString().slice(0, 60),
      }))
      .filter((b) => /deal|dice/i.test(`${b.label} ${b.text} ${b.cls}`)),
  );
  let clicked: string | null = null;
  for (const sel of [
    'button[aria-label*="Deal" i]',
    'button:has-text("Deal")',
    "button.deal-commit",
    "button:has(.dice-icon)",
  ]) {
    const ok = await page
      .locator(sel)
      .first()
      .click({ timeout: 2500 })
      .then(
        () => true,
        () => false,
      );
    if (ok) {
      clicked = sel;
      break;
    }
  }
  await page.waitForTimeout(2600);
  const afterDeal = await strip(page);
  bank(`n6b-${info.project.name}.json`, {
    engine: info.project.name,
    armed,
    parked,
    afterCancel,
    dealControls: controls,
    clicked,
    afterDeal,
  });
});

test("N5b gold dark", async ({ page }, info) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await boardReady(page, "?size=2&difficulty=EASY");
  await page
    .locator('button[aria-label*="Solve" i], button:has-text("Solve")')
    .first()
    .click({ timeout: 6000 })
    .catch(() => {});
  await page.waitForTimeout(6000); // past the crest, so the voice is not sr-only
  const s = await page.evaluate(() => {
    const blk = document.querySelector<HTMLElement>(".margin-note-block");
    const n = document.querySelector<HTMLElement>(".margin-note");
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    const star = document.querySelector<HTMLElement>(".note-star");
    const r = ink?.getBoundingClientRect();
    const sr = star?.getBoundingClientRect();
    return {
      text: (n?.textContent || "").replace(/\s+/g, " ").trim(),
      quiet: blk?.classList.contains("is-quiet") ?? null,
      color: ink ? getComputedStyle(ink).color : null,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      age: ink?.getAttribute("data-note-age") ?? null,
      ink: r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null,
      star: sr ? { x: sr.left, y: sr.top, w: sr.width, h: sr.height } : null,
    };
  });
  const read = async (clip: { x: number; y: number; width: number; height: number }) => {
    const buf = await page.screenshot({ clip, animations: "disabled" });
    const { data, info: m } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const ch = m.channels;
    const f = (x: number) => {
      const v = x / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    const lum = (c: number[]) => 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    const px: number[][] = [];
    for (let p = 0; p < m.width * m.height; p++)
      px.push([data[p * ch], data[p * ch + 1], data[p * ch + 2]]);
    const hist = new Map<string, number>();
    for (const c of px) hist.set(c.join(","), (hist.get(c.join(",")) ?? 0) + 1);
    let paper = px[0],
      best = -1;
    for (const [k, c] of hist)
      if (c > best) {
        best = c;
        paper = k.split(",").map(Number);
      }
    const Lp = lum(paper);
    const sorted = px.map((c) => ({ c, d: Math.abs(lum(c) - Lp) })).sort((a, b) => b.d - a.d);
    const core = sorted[Math.floor(sorted.length * 0.005)]?.c ?? sorted[0].c;
    const cr = (a: number[], b: number[]) => {
      const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x);
      return +((h + 0.05) / (l + 0.05)).toFixed(3);
    };
    return {
      paper,
      core,
      ratio: cr(core, paper),
      brightest: sorted[0].c,
      brightestRatio: cr(sorted[0].c, paper),
      n: px.length,
    };
  };
  let whole = null,
    textOnly = null;
  if (s.ink && s.ink.w > 4) {
    whole = await read({
      x: Math.floor(s.ink.x) - 1,
      y: Math.floor(s.ink.y) - 1,
      width: Math.ceil(s.ink.w) + 2,
      height: Math.ceil(s.ink.h) + 2,
    });
    const sx = s.star ? s.star.x + s.star.w + 2 : s.ink.x;
    textOnly = await read({
      x: Math.floor(sx),
      y: Math.floor(s.ink.y) - 1,
      width: Math.max(8, Math.ceil(s.ink.x + s.ink.w - sx)),
      height: Math.ceil(s.ink.h) + 2,
    });
  }
  bank(`n5b-golddark-${info.project.name}.json`, {
    engine: info.project.name,
    note: s,
    paintedWholeBox: whole,
    paintedTextOnly_starExcluded: textOnly,
  });
});
