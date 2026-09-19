/**
 * CRITIQUE · MRK-ABS pass 1 — the critic's OWN re-run, both engines.
 * Four questions the prototype's own logs do not answer:
 *  (1) TAB-WALK census: what does a REAL keyboard walk reach, and does every reached stop
 *      carry one outline colour? (the prototype's census enumerated a static selector list)
 *  (2) the gallery's two rewritten faces — `.staging-face`, `.guard-face` — never measured
 *      in r0 ("not sampled") nor in pass 1.
 *  (3) 16x16: the ring's ink against the GRID RULE's painted ink, not against the cell's
 *      nominal box. The guard measures the nominal box; a reader sees the rule.
 *  (4) the PHONE: does any chrome stop actually paint the token at 393x699?
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
const OUT = join(dirname(new URL(import.meta.url).pathname), "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function ready(page: Page, q: string) {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 90000 });
  await page.waitForTimeout(1600);
}

test("tab-walk census + gallery faces", async ({ page }, info) => {
  const eng = info.project.name;
  await ready(page, "?size=3&difficulty=EASY");
  const seen: any[] = [];
  const keys = new Set<string>();
  await page.locator("body").click({ position: { x: 2, y: 2 } });
  for (let i = 0; i < 160; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(40);
    const row = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const fv = el.matches(":focus-visible");
      // the ring may ride a descendant (staging/guard faces)
      let rider: any = null;
      for (const sel of [".staging-face", ".guard-face"]) {
        const d = el.querySelector(sel) as HTMLElement | null;
        if (d) {
          const ds = getComputedStyle(d);
          rider = { sel, style: ds.outlineStyle, color: ds.outlineColor, width: ds.outlineWidth, offset: ds.outlineOffset };
        }
      }
      return {
        tag: el.tagName, cls: (el.className || "").toString().slice(0, 60), fv,
        style: cs.outlineStyle, color: cs.outlineColor, width: cs.outlineWidth, offset: cs.outlineOffset,
        rider,
      };
    });
    if (!row) break;
    const k = row.tag + "|" + row.cls;
    if (keys.has(k) && seen.length > 4) continue;
    keys.add(k);
    seen.push(row);
  }
  // settle, then re-read the CURRENT stop after 500ms to test the transition claim
  bank(`crit-tabwalk-${eng}.json`, {
    engine: eng, stopsWalked: seen.length,
    distinctPaintedColours: [...new Set(seen.filter((r) => r.style !== "none" && r.style !== "").map((r) => r.color))],
    riders: seen.filter((r) => r.rider).map((r) => ({ cls: r.cls, rider: r.rider })),
    rows: seen,
  });
});

test("16x16 ring ink vs the rule's ink", async ({ page }, info) => {
  const eng = info.project.name;
  await ready(page, "?size=4&difficulty=EASY");
  const cells = page.locator('[role="gridcell"] input.cell-native-input');
  await cells.nth(16 * 8 + 8).focus();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(500);
  const d = await page.evaluate(() => {
    const cell = document.querySelector(".game-cell:has(input:focus-visible)") as HTMLElement | null;
    const ghost = cell?.querySelector(".cell-ghost-path") as SVGGeometryElement | null;
    if (!cell || !ghost) return { error: "no focused ghost" };
    const gs = getComputedStyle(ghost);
    const svg = ghost.ownerSVGElement!;
    const vb = svg.viewBox.baseVal;
    const box = svg.getBoundingClientRect();
    const scale = box.width / vb.width;
    const bb = ghost.getBBox();
    const strokeU = parseFloat(gs.strokeWidth);
    // ring ink rect in viewport px
    const ring = {
      left: box.left + (bb.x - vb.x - strokeU / 2) * scale,
      top: box.top + (bb.y - vb.y - strokeU / 2) * scale,
      right: box.left + (bb.x + bb.width - vb.x + strokeU / 2) * scale,
      bottom: box.top + (bb.y + bb.height - vb.y + strokeU / 2) * scale,
    };
    // the grid's rules, in viewport px, with their own stroke and their own wander
    const rules = Array.from(document.querySelectorAll("path.cell-line")) as unknown as SVGGeometryElement[];
    let best: any = null;
    for (const r of rules) {
      const rsvg = r.ownerSVGElement!;
      const rvb = rsvg.viewBox.baseVal;
      const rbox = rsvg.getBoundingClientRect();
      const rs = rbox.width / rvb.width;
      const rw = parseFloat(getComputedStyle(r).strokeWidth) || 0;
      const rbb = r.getBBox();
      const rect = {
        left: rbox.left + (rbb.x - rvb.x - rw / 2) * rs,
        top: rbox.top + (rbb.y - rvb.y - rw / 2) * rs,
        right: rbox.left + (rbb.x + rbb.width - rvb.x + rw / 2) * rs,
        bottom: rbox.top + (rbb.y + rbb.height - rvb.y + rw / 2) * rs,
      };
      const gapX = Math.max(rect.left - ring.right, ring.left - rect.right);
      const gapY = Math.max(rect.top - ring.bottom, ring.top - rect.bottom);
      const gap = Math.max(gapX, gapY);
      if (!best || gap < best.gapPx) best = { gapPx: +gap.toFixed(3), ruleStrokePx: +(rw * rs).toFixed(3) };
    }
    return {
      cellBoxPx: +box.width.toFixed(2),
      ringScalePxPerUnit: +scale.toFixed(4),
      ringStrokeUnits: strokeU,
      ringInkRectPx: { w: +(ring.right - ring.left).toFixed(2), h: +(ring.bottom - ring.top).toFixed(2) },
      nominalMarginPx: +(((box.width - (vb.width / 1.3) * scale) / 2)).toFixed(3),
      nearestRule: best,
      ringColour: gs.stroke,
      ringOpacity: gs.strokeOpacity,
    };
  });
  bank(`crit-ring-vs-rule-16-${eng}.json`, { engine: eng, ...d });
});

test("phone: does any chrome stop paint the token", async ({ page }, info) => {
  const eng = info.project.name;
  await page.setViewportSize({ width: 393, height: 699 });
  await ready(page, "?size=3&difficulty=EASY");
  await page.locator("body").click({ position: { x: 2, y: 2 } });
  const rows: any[] = [];
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(40);
    const r = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      return {
        cls: (el.className || "").toString().slice(0, 48), fv: el.matches(":focus-visible"),
        style: cs.outlineStyle, color: cs.outlineColor, offset: cs.outlineOffset,
        box: [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)],
        inViewport: b.top >= -1 && b.bottom <= window.innerHeight + 1 && b.left >= -1 && b.right <= window.innerWidth + 1,
      };
    });
    if (!r) break;
    rows.push(r);
    if (rows.length > 3 && rows.slice(-3).every((x) => x.cls === r.cls)) break;
  }
  bank(`crit-phone-${eng}.json`, {
    engine: eng, stops: rows.length,
    paintedColours: [...new Set(rows.filter((r) => r.style !== "none").map((r) => r.color))],
    rows,
  });
});

test("filter budget guard", async ({ page }, info) => {
  const eng = info.project.name;
  const out: any = { engine: eng };
  for (const [tag, q, n] of [["4x4", "?size=2&difficulty=EASY", 16], ["9x9", "?size=3&difficulty=EASY", 81], ["16x16", "?size=4&difficulty=EASY", 256]] as const) {
    await ready(page, q);
    out[tag] = await page.evaluate(() => {
      let live = 0;
      for (const el of Array.from(document.querySelectorAll("*"))) {
        const cs = getComputedStyle(el);
        if (cs.filter && cs.filter !== "none" && cs.display !== "none") live++;
      }
      return { liveFilters: live, ghosts: document.querySelectorAll(".cell-ghost-path").length };
    });
    if (out[tag].ghosts !== n) out[tag].ghostsExpected = n;
  }
  bank(`crit-budget-${eng}.json`, out);
});
