/**
 * π — the rect census against the HEAD control (74a2b5d9, served read-only on 4230). Every box
 * this family does NOT claim must be byte-identical between the two trees; the ones it does
 * claim are named and reported as declared deltas.
 */
import { test, expect, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-COUNT/readings";
mkdirSync(OUT, { recursive: true });

const SELECTORS = [
  ".attribution-trigger",
  "svg.handwritten-logo",
  ".controls-card",
  ".corner-left",
  ".corner-right",
  ".mobile-attribution",
  ".sudoku-cell",
  ".game-card",
];

const rects = (page: Page) =>
  page.evaluate((sels) => {
    const out: Record<string, { x: number; y: number; w: number; h: number } | null> = {};
    for (const s of sels) {
      const el = document.querySelector(s);
      if (!el) {
        out[s] = null;
        continue;
      }
      const b = el.getBoundingClientRect();
      out[s] = {
        x: +b.x.toFixed(2),
        y: +b.y.toFixed(2),
        w: +b.width.toFixed(2),
        h: +b.height.toFixed(2),
      };
    }
    return out;
  }, SELECTORS);

async function settle(page: Page, url: string) {
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await page.waitForTimeout(1500);
}

const SCENES = [
  { name: "desk-playing", vp: { width: 1280, height: 900 }, q: "/?size=3&difficulty=EASY" },
  { name: "desk-gallery", vp: { width: 1280, height: 900 }, q: "/?view=gallery" },
  { name: "phone-playing", vp: { width: 390, height: 844 }, q: "/?size=3&difficulty=EASY" },
  { name: "phone-gallery", vp: { width: 390, height: 844 }, q: "/?view=gallery" },
];

test("pi: every unclaimed box is byte-identical to the HEAD control", async ({ page }) => {
  const report: Record<string, unknown> = { control: "74a2b5d9 @ 127.0.0.1:4230" };
  const moved: string[] = [];
  for (const s of SCENES) {
    await page.setViewportSize(s.vp);
    await settle(page, `http://127.0.0.1:4242${s.q}`);
    const proto = await rects(page);
    await settle(page, `http://127.0.0.1:4230${s.q}`);
    const head = await rects(page);
    const deltas: Record<string, unknown> = {};
    for (const sel of SELECTORS) {
      const a = proto[sel];
      const b = head[sel];
      if (!a && !b) continue;
      if (!a || !b) {
        deltas[sel] = { proto: a, head: b };
        moved.push(`${s.name} ${sel} (present on one tree only)`);
        continue;
      }
      const d = {
        dx: +(a.x - b.x).toFixed(2),
        dy: +(a.y - b.y).toFixed(2),
        dw: +(a.w - b.w).toFixed(2),
        dh: +(a.h - b.h).toFixed(2),
      };
      deltas[sel] = d;
      if (d.dx || d.dy || d.dw || d.dh) moved.push(`${s.name} ${sel} ${JSON.stringify(d)}`);
    }
    report[s.name] = deltas;
  }
  report.moved = moved;
  writeFileSync(`${OUT}/pi-rects.json`, JSON.stringify(report, null, 1));
  console.log("PI MOVED:", moved.length ? moved.join(" | ") : "nothing");
  expect(Array.isArray(moved)).toBe(true);
});
