/**
 * NOTE-ERASE pass-6 probe helpers (copied from pass 5, OUT re-pointed). OUT re-pointed at pass6/prototype/NOTE-ERASE/logs (LAWS:
 * the record is frozen; a copied instrument writes to its own pass). Every row deals ONE
 * encoded payload through the estate's own codec and asserts both arms read it back.
 */
import { type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { encodeSudoku } from "../e2e/wire";

export const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/prototype/NOTE-ERASE/logs";
export const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/prototype/NOTE-ERASE";
mkdirSync(OUT, { recursive: true });
export const bank = (n: string, d: unknown) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));
export const say = (k: string, v: unknown) => console.log(`NE6|${k}|${JSON.stringify(v)}`);

export const PROTO = "http://127.0.0.1:4248";
export const CONTROL = "http://127.0.0.1:4249";

/** The classic easy 9x9 (30 givens), the pass-4 π payload, minted with the app's codec. */
export const GIVENS: Record<number, number> = {
  0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3,
  36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9,
  71: 5, 76: 8, 79: 7, 80: 9,
};
export const PAYLOAD = encodeSudoku(3, GIVENS, 81);
export const BOARD = "?board=" + PAYLOAD;
export const EXPECTED = Array.from({ length: 81 }, (_, i) => (GIVENS[i] ? String(GIVENS[i]) : ".")).join("");

export const boardString = (p: Page) =>
  p.evaluate(() =>
    [...document.querySelectorAll(".game-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""),
  );

/** The given-set as the aria-label corpus reads it ("…, given clue 5"), '.' elsewhere. */
export const givensAria = (p: Page) =>
  p.evaluate(() =>
    [...document.querySelectorAll(".game-cell input")]
      .map((i) => /given clue (\S+)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? ".")
      .join(""),
  );

/** Load the pinned board and prove the arm dealt it (the payload law). */
export async function boardReady(page: Page, base = PROTO, extra = "") {
  await page.goto(base + "/" + BOARD + extra);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  for (let i = 0; i < 60; i++) {
    if ((await boardString(page)) === EXPECTED) break;
    await page.waitForTimeout(100);
  }
  const got = await boardString(page);
  if (got !== EXPECTED) throw new Error(`payload not dealt: ${got}`);
  // LAWS P5: the given-set read back through the aria-label corpus, not the value/innerText.
  const aria = await givensAria(page);
  if (aria !== EXPECTED) throw new Error(`payload not dealt (aria): ${aria}`);
  await page.waitForTimeout(900);
}

/** Focus an empty cell (the k-th) and press H: the hint names a cell and arms the note. */
export async function armHint(page: Page, k = 0) {
  await page.evaluate((k) => {
    const empties = ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).filter((i) => !i.value);
    empties[Math.min(k, empties.length - 1)]?.focus();
  }, k);
  await page.keyboard.press("h");
  await page.waitForTimeout(800);
}

/** Focus the first given and type a digit: the refusal's own act. */
export async function refuseAGiven(page: Page, digit = "5") {
  const idx = await page.evaluate(() =>
    [...document.querySelectorAll(".game-cell input")].findIndex((i) => !!(i as HTMLInputElement).value),
  );
  await page.locator(".game-cell input").nth(idx).click();
  await page.keyboard.press(digit);
}

/** Watch the NEXT leave: the leaving node's clock read at leave-start, and the moment it drops. */
export async function watchLeave(page: Page, ablateHook = false) {
  await page.evaluate((ablate) => {
    const host = document.querySelector(".margin-note")!;
    const rec: Record<string, unknown> = { enters: [] as number[] };
    (window as unknown as { __leave: Record<string, unknown> }).__leave = rec;
    new MutationObserver((muts) => {
      for (const m of muts)
        for (const n of Array.from(m.addedNodes))
          if (n instanceof Element && n.classList.contains("margin-note-ink"))
            (rec.enters as number[]).push(performance.now());
      const el = (rec.el as Element) ?? host.querySelector(".margin-note-ink.note-leave-active");
      if (el && !rec.el) {
        // THE RUNTIME ABLATION: strip what the hook wrote, before Vue reads the clock.
        if (ablate) (el as HTMLElement).style.removeProperty("transition");
        const cs = getComputedStyle(el);
        Object.assign(rec, {
          el,
          t0: performance.now(),
          inline: (el as HTMLElement).style.getPropertyValue("transition"),
          inlinePriority: (el as HTMLElement).style.getPropertyPriority("transition"),
          age: el.getAttribute("data-note-age"),
          transitionDuration: cs.transitionDuration,
          animationName: cs.animationName,
          animationDuration: cs.animationDuration,
        });
      }
      if (rec.el && rec.t1 === undefined && !(rec.el as Element).isConnected) rec.t1 = performance.now();
    }).observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
  }, ablateHook);
}

export async function leaveResult(page: Page, awaitEnter = false) {
  if (awaitEnter)
    for (let i = 0; i < 30; i++) {
      const ok = await page.evaluate(() => {
        const r = (window as unknown as { __leave: Record<string, unknown> }).__leave;
        return r.t1 !== undefined && (r.enters as number[]).some((t) => t > (r.t1 as number));
      });
      if (ok) break;
      await page.waitForTimeout(100);
    }
  for (let i = 0; i < 40; i++) {
    const r = await page.evaluate(() => {
      const r = (window as unknown as { __leave: Record<string, unknown> }).__leave;
      if (r.t1 === undefined) return null;
      const enters = (r.enters as number[]).filter((t) => t > (r.t1 as number));
      return {
        absentMs: Math.round(((r.t1 as number) - (r.t0 as number)) * 10) / 10,
        holeMs: enters.length ? Math.round((enters[0] - (r.t1 as number)) * 10) / 10 : null,
        inline: r.inline,
        inlinePriority: r.inlinePriority,
        age: r.age,
        transitionDuration: r.transitionDuration,
        animationName: r.animationName,
        animationDuration: r.animationDuration,
      };
    });
    if (r) return r;
    await page.waitForTimeout(100);
  }
  return null;
}

export function ratio(a: number[], b: number[]) {
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

/**
 * PAINTED AA with the LAWS' sensitivity row. Ground = the modal pixel of the ink's own box (the
 * paper the stroke ABUTS). Per ink column (any pixel >12 luma off the ground): mass = summed
 * |dL|, core = the column's most distant pixel. The row reports the worst column's core ratio
 * among columns at >= 50/70/90/100 % of the median mass, and the fraction of ink columns whose
 * core is under the floor.
 */
export async function paintedAA(page: Page, floor = 4.5) {
  const box = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    return {
      clip: { x: Math.floor(r.left) - 2, y: Math.floor(r.top) - 2, width: Math.ceil(r.width) + 4, height: Math.ceil(r.height) + 4 },
      computed: getComputedStyle(ink).color,
      age: ink.getAttribute("data-note-age"),
    };
  });
  if (!box) return null;
  const buf = await page.screenshot({ clip: box.clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const px = (x: number, y: number) => {
    const i = (y * info.width + x) * ch;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const L = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const counts = new Map<string, number>();
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const k = px(x, y).join(",");
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const ground = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const gL = L(ground);
  const cols: { mass: number; core: number }[] = [];
  let globalCore = ground;
  for (let x = 0; x < info.width; x++) {
    let mass = 0, best = 0, bestPx = ground;
    for (let y = 0; y < info.height; y++) {
      const c = px(x, y);
      const d = Math.abs(L(c) - gL);
      if (d > 12) mass += d;
      if (d > best) ((best = d), (bestPx = c));
    }
    if (mass > 0) cols.push({ mass, core: ratio(bestPx, ground) });
    if (Math.abs(L(bestPx) - gL) > Math.abs(L(globalCore) - gL)) globalCore = bestPx;
  }
  const masses = cols.map((c) => c.mass).sort((a, b) => a - b);
  const med = masses[Math.floor(masses.length / 2)] ?? 0;
  const worstAt = (f: number) => {
    const sel = cols.filter((c) => c.mass >= f * med).map((c) => c.core);
    return sel.length ? Math.min(...sel) : null;
  };
  const cores = cols.map((c) => c.core).sort((a, b) => a - b);
  return {
    age: box.age,
    computed: box.computed,
    ground: `rgb(${ground.join(",")})`,
    core: `rgb(${globalCore.join(",")})`,
    coreRatio: ratio(globalCore, ground),
    columns: cols.length,
    coreMedian: cores[Math.floor(cores.length / 2)] ?? null,
    worstAtMedianMass: { "50": worstAt(0.5), "70": worstAt(0.7), "90": worstAt(0.9), "100": worstAt(1) },
    fractionUnderFloor: cols.length ? Math.round((cols.filter((c) => c.core < floor).length / cols.length) * 1000) / 1000 : null,
    floor,
    devicePx: { w: info.width, h: info.height },
  };
}
