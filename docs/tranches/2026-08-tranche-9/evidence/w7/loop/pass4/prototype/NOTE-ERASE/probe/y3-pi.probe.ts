/**
 * NOTE-ERASE pass 4 · Y3 — π AGAINST 74a2b5d9, AND THE STRIP'S OWN BOX.
 *
 * Both arms in ONE run, dealing the SAME board (`?board=`-equivalent: the same size+difficulty
 * seed route pass 3 used), so a layout delta cannot be a deal. The control is the shared
 * read-only tree `.claude/worktrees/w7-control` at `74a2b5d9`, served dev-mode on :4247 (the
 * prototype arm is a dev server; a preview control would differ by pipeline as well as by diff).
 *
 * Registry §2.13: a π instrument reads computed PAINT properties and TAG NAMES, not rects alone.
 * So every key reports its box AND its `font`, `line-height`, `color`, `background-color` and
 * `tagName`.
 *
 * The one row the family owns here is the strip's reserve. Pass 3 measured it growing 20.8 →
 * 23.61 px at 1280 the first time the voice spoke, on BOTH arms, against a spec sentence that
 * said no box moves. Pass 4 derives the floor from `--type-body × --type-leading-caption`, so
 * the PROTOTYPE's strip must not move between empty and fresh — and its resting height at 1280
 * is now the spoken line's height, which is a DECLARED delta against the control.
 */
import { test, expect, type Page } from "@playwright/test";
import { bank, say } from "./lib";
import { encodeSudoku } from "../e2e/wire";

/** THE DEAL IS PINNED (chair §2.13, LADDER/LEDGER's confound). An unpinned `?size=` deals a
 *  RANDOM board on each arm, so the hint's sentence differs and `.margin-note`'s box differs
 *  with it — a text delta read as a layout delta. The first run of this probe measured exactly
 *  that (note 92.84 px at 390, 105.44 at 1280, both engines, on two different sentences). The
 *  classic easy 9×9, encoded through the estate's own wire codec, is the same board on both. */
const GIVENS: Record<number, number> = {
  0: 5, 1: 3, 4: 7,
  9: 6, 12: 1, 13: 9, 14: 5,
  19: 9, 20: 8, 25: 6,
  27: 8, 31: 6, 35: 3,
  36: 4, 39: 8, 41: 3, 44: 1,
  45: 7, 49: 2, 53: 6,
  55: 6, 60: 2, 61: 8,
  66: 4, 67: 1, 68: 9, 71: 5,
  76: 8, 79: 7, 80: 9,
};
const BOARD = "?board=" + encodeSudoku(3, GIVENS, 81);
const CONTROL = "http://127.0.0.1:4247";

const read = (p: Page) =>
  p.evaluate(() => {
    const r2 = (x: number) => Math.round(x * 100) / 100;
    const key = (sel: string) => {
      const el = document.querySelector<HTMLElement>(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        box: { x: r2(r.x), y: r2(r.y), w: r2(r.width), h: r2(r.height) },
        font: cs.font || `${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`,
        lineHeight: cs.lineHeight,
        color: cs.color,
        background: cs.backgroundColor,
      };
    };
    return {
      board: key('[role="grid"]'),
      controls: key(".controls-card"),
      strip: key(".margin-note-block"),
      note: key(".margin-note"),
      docH: r2(document.documentElement.scrollHeight),
      typeBody: getComputedStyle(document.documentElement)
        .getPropertyValue("--type-body")
        .trim(),
      leading: getComputedStyle(document.documentElement)
        .getPropertyValue("--type-leading-caption")
        .trim(),
    };
  });

type R = Awaited<ReturnType<typeof read>>;
const boxDelta = (a: R, b: R, k: "board" | "controls" | "strip" | "note") => {
  const x = a?.[k]?.box;
  const y = b?.[k]?.box;
  return x && y
    ? Math.round(
        Math.max(
          Math.abs(x.x - y.x),
          Math.abs(x.y - y.y),
          Math.abs(x.w - y.w),
          Math.abs(x.h - y.h),
        ) * 100,
      ) / 100
    : null;
};
const paintDelta = (a: R, b: R) => {
  const out: string[] = [];
  for (const k of ["board", "controls", "strip", "note"] as const) {
    const x = a?.[k];
    const y = b?.[k];
    if (!x || !y) {
      if (x || y) out.push(`${k}: present on one arm only`);
      continue;
    }
    for (const p of ["tag", "font", "lineHeight", "color", "background"] as const)
      if (x[p] !== y[p]) out.push(`${k}.${p}: ${x[p]} vs ${y[p]}`);
  }
  return out;
};

async function armReadings(page: Page, base: string, w: number, h: number) {
  await page.setViewportSize({ width: w, height: h });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await page.goto(base + "/" + BOARD);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForTimeout(1800);
  const empty = await read(page);
  // The first speech: arm a hint (graphite, kind `state`).
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  const fresh = await read(page);
  await page.waitForTimeout(1300);
  const settled = await read(page);
  return { empty, fresh, settled };
}

test("Y3 π vs 74a2b5d9, and the strip's reserve", async ({ page }, info) => {
  const out: Record<string, unknown> = { engine: info.project.name, control: "74a2b5d9" };
  for (const [label, w, h] of [
    ["390x844", 390, 844],
    ["1280x800", 1280, 800],
  ] as const) {
    const proto = await armReadings(page, "http://127.0.0.1:4248", w, h);
    const ctrl = await armReadings(page, CONTROL, w, h);
    out[label] = {
      protoStripH: {
        empty: proto.empty.strip?.box.h,
        fresh: proto.fresh.strip?.box.h,
        settled: proto.settled.strip?.box.h,
        growthEmptyToFresh:
          Math.round(
            ((proto.fresh.strip?.box.h ?? 0) - (proto.empty.strip?.box.h ?? 0)) * 100,
          ) / 100,
      },
      controlStripH: {
        empty: ctrl.empty.strip?.box.h,
        fresh: ctrl.fresh.strip?.box.h,
        growthEmptyToFresh:
          Math.round(
            ((ctrl.fresh.strip?.box.h ?? 0) - (ctrl.empty.strip?.box.h ?? 0)) * 100,
          ) / 100,
      },
      typeBody: proto.empty.typeBody,
      leading: proto.empty.leading,
      // π: proto vs control, at the SAME state, on every key the wave does not claim.
      piEmpty: {
        board: boxDelta(proto.empty, ctrl.empty, "board"),
        controls: boxDelta(proto.empty, ctrl.empty, "controls"),
        note: boxDelta(proto.empty, ctrl.empty, "note"),
        strip: boxDelta(proto.empty, ctrl.empty, "strip"),
        docH:
          Math.round(((proto.empty.docH ?? 0) - (ctrl.empty.docH ?? 0)) * 100) / 100,
        paint: paintDelta(proto.empty, ctrl.empty),
      },
      piFresh: {
        board: boxDelta(proto.fresh, ctrl.fresh, "board"),
        controls: boxDelta(proto.fresh, ctrl.fresh, "controls"),
        note: boxDelta(proto.fresh, ctrl.fresh, "note"),
        strip: boxDelta(proto.fresh, ctrl.fresh, "strip"),
        docH:
          Math.round(((proto.fresh.docH ?? 0) - (ctrl.fresh.docH ?? 0)) * 100) / 100,
        paint: paintDelta(proto.fresh, ctrl.fresh),
      },
    };
  }
  out.board = BOARD;
  bank(`y3-pi-${info.project.name}.json`, out);
  say("y3", out);

  // THE FAMILY'S OWN ROW: the reserve no longer moves when the voice speaks, at either width.
  for (const label of ["390x844", "1280x800"] as const) {
    const r = out[label] as { protoStripH: { growthEmptyToFresh: number } };
    expect(r.protoStripH.growthEmptyToFresh, `${label}: the strip holds`).toBe(0);
  }
  // π on the BOARD and the CONTROLS card, both widths, both states.
  for (const label of ["390x844", "1280x800"] as const) {
    const r = out[label] as {
      piEmpty: { board: number; controls: number };
      piFresh: { board: number; controls: number };
    };
    expect(r.piEmpty.board).toBe(0);
    expect(r.piEmpty.controls).toBe(0);
    expect(r.piFresh.board).toBe(0);
    expect(r.piFresh.controls).toBe(0);
    // And the note's own box, now that both arms deal the SAME board and say the SAME sentence.
    expect((r as unknown as { piFresh: { note: number } }).piFresh.note).toBeLessThanOrEqual(0.05);
  }
});
