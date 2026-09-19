/**
 * NOTE-ERASE pass-2 probe helpers. Lifted from the pass-1 probe (`p1-erase.probe.ts`) with
 * the pass-2 readings added: the rung vars replace the `--note-*` vars, the painted reader
 * cross-checks itself against `getComputedStyle(ink).color`, and the rAF train reports its
 * own median interval so the frame bar is the engine's, not a constant.
 */
import { type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const HERE = dirname(new URL(import.meta.url).pathname);
export const OUT = join(HERE, "..", "logs");
export const FRAMES = join(HERE, "..", "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
export const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));
export const say = (k: string, v: unknown) => console.log(`NE2|${k}|${JSON.stringify(v)}`);

export const BOARD = "?size=3&difficulty=EASY";

export async function boardReady(page: Page, query = BOARD) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}

export const readNote = (page: Page) =>
  page.evaluate(() => {
    const n = document.querySelector<HTMLElement>(".margin-note");
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!n) return null;
    const cs = getComputedStyle(n);
    const ics = ink ? getComputedStyle(ink) : null;
    const r = (ink ?? n).getBoundingClientRect();
    const r1 = (x: number) => Math.round(x * 10) / 10;
    const root = getComputedStyle(document.documentElement);
    return {
      text: (n.textContent || "").replace(/\s+/g, " ").trim(),
      tone: (n.getAttribute("class") || "").replace("margin-note", "").trim(),
      inkPresent: !!ink,
      age: ink?.getAttribute("data-note-age") ?? null,
      color: ics?.color ?? cs.color,
      opacity: ics?.opacity ?? cs.opacity,
      fontSize: cs.fontSize,
      filter: ics?.filter ?? "none",
      transform: ics?.transform ?? "none",
      transitionProperty: ics?.transitionProperty ?? null,
      transitionDuration: ics?.transitionDuration ?? null,
      animationDuration: ics?.animationDuration ?? null,
      quiet: !!document.querySelector(".margin-note-block.is-quiet"),
      rungs: {
        note: root.getPropertyValue("--motion-note").trim(),
        whisper: root.getPropertyValue("--motion-whisper").trim(),
        dusk: root.getPropertyValue("--motion-dusk").trim(),
      },
      box: { w: r1(r.width), h: r1(r.height), x: r1(r.left), y: r1(r.top) },
      becauseCells: document.querySelectorAll(".game-cell.is-because").length,
    };
  });

export async function armHint(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  return readNote(page);
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
 * The computed colour, as sRGB bytes composited over the paper the reader measured.
 * Two spellings reach us: `rgb(…)` (a plain token) and `color(srgb r g b / a)` (what both
 * engines report for a `color-mix` at a stop — the settled rung). A mid-transition value can
 * also arrive as `oklab(…)`, which is NOT converted here: the cross-check reports null rather
 * than guess, and the steady pose is the one it grades.
 */
const rgbOf = (css: string, over: number[]): number[] | null => {
  const plain = css.match(/rgba?\(([^)]+)\)/);
  if (plain) {
    const p = plain[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (p.length < 3) return null;
    const a = p.length > 3 ? p[3] : 1;
    return [0, 1, 2].map((i) => a * p[i] + (1 - a) * over[i]);
  }
  const srgb = css.match(/color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/);
  if (srgb) {
    const a = srgb[4] === undefined ? 1 : Number(srgb[4]);
    return [1, 2, 3].map((k, i) => a * Number(srgb[k]) * 255 + (1 - a) * over[i]);
  }
  return null;
};

/**
 * PAINTED BYTES — the engine's own raster of the note's box, with the pass-2 CROSS-CHECK:
 * the reader's ink core is compared to `getComputedStyle(ink).color`, and any channel off by
 * more than 12 is reported. Pass 1 read the inline gold STAR (#FDE68A at 0.9) as the note's
 * ink and banked 12.46 for a token that computes 11.48; |125 − 77| = 48 on the blue channel.
 */
export async function paintedBytes(page: Page, name: string | null, clipStar = false) {
  const probe = await page.evaluate((clipStar) => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    const star = clipStar
      ? ink.querySelector<SVGElement>(".note-star")?.getBoundingClientRect()
      : null;
    const left = star ? Math.max(r.left, star.right) : r.left;
    return {
      box: {
        x: Math.floor(left) - 2,
        y: Math.floor(r.top) - 2,
        width: Math.ceil(r.right - left) + 4,
        height: Math.ceil(r.height) + 4,
      },
      computedColor: getComputedStyle(ink).color,
    };
  }, clipStar);
  if (!probe || probe.box.width <= 4 || probe.box.height <= 4) return null;
  const buf = await page.screenshot({ clip: probe.box, animations: "disabled" });
  if (name) writeFileSync(join(FRAMES, name + ".png"), buf);
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
  const extreme = lums[0].px;
  const p005 = lums[Math.min(lums.length - 1, Math.floor(lums.length * 0.005))].px;
  const want = rgbOf(probe.computedColor, paper);
  const delta = want
    ? extreme.map((c, i) => Math.round(Math.abs(c - want[i]) * 10) / 10)
    : null;
  return {
    bytes: buf.length,
    devicePixels: { w: info.width, h: info.height },
    paper: `rgb(${paper.join(", ")})`,
    inkCorePx: `rgb(${extreme.join(", ")})`,
    computedColor: probe.computedColor,
    channelDelta: delta,
    coreAgreesWithComputed: delta ? delta.every((d) => d <= 12) : null,
    extremeRatio: ratio(extreme, paper),
    p005Ratio: ratio(p005, paper),
    coverageP:
      Math.round(
        (lums.filter((l) => Math.abs(l.L - paperL) > 12).length / lums.length) * 1000,
      ) / 10,
  };
}

export type Trace = {
  frames: number;
  medianRafMs: number;
  leaveSeen: boolean;
  leaveAnimation: string | null;
  leaveDuration: string | null;
  leaveEasing: string | null;
  absentAtMs: number | null;
  reappearedAfterAbsent: boolean;
  dirtyAncestors: string[];
  samples: {
    t: number;
    clip: string;
    opacity: string;
    filter: string;
    transform: string;
    anim: string;
    leaving: boolean;
  }[];
};

/** rAF trace of the ink span across a retraction, reporting its OWN median interval. */
export function traceRetraction(page: Page, ms = 800): Promise<Trace> {
  return page.evaluate((ms) => {
    return new Promise<Trace>((res) => {
      const t0 = performance.now();
      const samples: Trace["samples"] = [];
      const ticks: number[] = [];
      const dirty = new Set<string>();
      let leaveSeen = false;
      let leaveAnimation: string | null = null;
      let leaveDuration: string | null = null;
      let leaveEasing: string | null = null;
      let absentAtMs: number | null = null;
      let reappeared = false;
      let last = t0;
      const tick = () => {
        const now = performance.now();
        ticks.push(now - last);
        last = now;
        const t = Math.round((now - t0) * 10) / 10;
        const el = document.querySelector<HTMLElement>(".margin-note-ink");
        if (el) {
          if (absentAtMs !== null) reappeared = true;
          const cs = getComputedStyle(el);
          const leaving = el.classList.contains("note-leave-active");
          if (leaving && !leaveSeen) {
            leaveSeen = true;
            leaveAnimation = cs.animationName;
            leaveDuration = cs.animationDuration;
            leaveEasing = cs.animationTimingFunction;
          }
          samples.push({
            t,
            clip: cs.clipPath,
            opacity: cs.opacity,
            filter: cs.filter,
            transform: cs.transform,
            anim: cs.animationName,
            leaving,
          });
          for (let n: HTMLElement | null = el; n; n = n.parentElement) {
            const c = getComputedStyle(n);
            if (c.filter !== "none" || c.transform !== "none")
              dirty.add(
                `${n.className || n.tagName}: filter=${c.filter} transform=${c.transform}`,
              );
          }
        } else if (absentAtMs === null) {
          absentAtMs = t;
        }
        if (performance.now() - t0 > ms) {
          const sorted = ticks.slice(1).sort((a, b) => a - b);
          res({
            frames: samples.length,
            medianRafMs:
              Math.round((sorted[Math.floor(sorted.length / 2)] ?? 0) * 10) / 10,
            leaveSeen,
            leaveAnimation,
            leaveDuration,
            leaveEasing,
            absentAtMs,
            reappearedAfterAbsent: reappeared,
            dirtyAncestors: [...dirty],
            samples,
          });
        } else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, ms);
}

/** Focus the first given (a refusable cell) and type a digit — the refusal's own act. */
export async function refuseAGiven(page: Page, digit = "5") {
  const idx = await page.evaluate(
    () =>
      [...document.querySelectorAll(".game-cell input")].findIndex(
        (i) => !!(i as HTMLInputElement).value,
      ),
  );
  await page.locator(".game-cell input").nth(idx).click();
  await page.keyboard.press(digit);
  return idx;
}
