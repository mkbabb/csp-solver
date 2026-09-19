/**
 * ACC-SIX pass-2 RESEARCH probe 2 — the masthead as INK (per-rect, never a union bbox), the
 * tape's three candidate poses priced against it, and the WebKit dash law on the SHIPPED
 * `.progress-trace`. HEAD, built dist, both engines.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(__dirname, "..", "readings");
mkdirSync(OUT, { recursive: true });
const SCENE = "./?size=3&difficulty=EASY";

async function settle(page: Page) {
  await page.goto(SCENE);
  await page.waitForSelector(".hand-drawn-grid", { timeout: 30000 });
  await page.waitForFunction(() => document.getAnimations().filter(a => a.playState === "running").length === 0, null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(800);
}

/** Per-rect masthead ink + the tape poses, priced. Tape metrics are pass-1's measured box. */
const INK = (tape: { w: number; h: number; dx: number }) => {
  const svg = document.querySelector(".hand-drawn-grid")!.getBoundingClientRect();
  const mast = document.querySelector(".masthead") as HTMLElement;
  const rects: { what: string; x: number; y: number; w: number; h: number }[] = [];
  const walker = document.createTreeWalker(mast, NodeFilter.SHOW_TEXT);
  let t: Node | null;
  while ((t = walker.nextNode())) {
    if (!t.textContent || !t.textContent.trim()) continue;
    const rg = document.createRange();
    rg.selectNodeContents(t);
    for (const r of Array.from(rg.getClientRects()))
      if (r.width && r.height) rects.push({ what: "text:" + t.textContent.trim().slice(0, 18), x: r.x, y: r.y, w: r.width, h: r.height });
  }
  for (const el of Array.from(mast.querySelectorAll("svg, img, canvas"))) {
    const r = el.getBoundingClientRect();
    if (r.width && r.height) rects.push({ what: el.tagName.toLowerCase() + "." + (el.getAttribute("class") ?? "").split(/\s+/)[0], x: r.x, y: r.y, w: r.width, h: r.height });
  }
  const inter = (a: {x:number;y:number;w:number;h:number}, b: {x:number;y:number;w:number;h:number}) =>
    Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  const poses = {
    "straddle (top = -h/2, pass-1)": { x: svg.x + tape.dx, y: svg.y - tape.h / 2, w: tape.w, h: tape.h },
    "flush (top = 0, box top on the board's top edge)": { x: svg.x + tape.dx, y: svg.y, w: tape.w, h: tape.h },
    "seated inside (top = +2)": { x: svg.x + tape.dx, y: svg.y + 2, w: tape.w, h: tape.h },
    "bottom-left head (top = board bottom - h)": { x: svg.x + tape.dx, y: svg.y + svg.height - tape.h, w: tape.w, h: tape.h },
  };
  const mastBox = mast.getBoundingClientRect();
  const out: Record<string, unknown> = {};
  for (const [name, box] of Object.entries(poses)) {
    out[name] = {
      box: { x: +box.x.toFixed(2), y: +box.y.toFixed(2), w: box.w, h: box.h },
      vsMastheadBOX: +inter(box, mastBox).toFixed(1),
      vsMastheadINK: +rects.reduce((n, r) => n + inter(box, r), 0).toFixed(1),
      inkRectsTouched: rects.filter(r => inter(box, r) > 0).map(r => r.what),
      liftAboveBoardTop: +(svg.y - box.y).toFixed(2),
    };
  }
  const inkBottom = Math.max(...rects.map(r => r.y + r.h));
  return {
    board: { x: +svg.x.toFixed(2), y: +svg.y.toFixed(2), w: svg.width, h: svg.height },
    mastheadBox: { x: +mastBox.x.toFixed(2), y: +mastBox.y.toFixed(2), w: +mastBox.width.toFixed(2), h: +mastBox.height.toFixed(2) },
    mastheadBottomEqualsBoardTop: +(mastBox.y + mastBox.height - svg.y).toFixed(3),
    inkRects: rects.map(r => ({ ...r, x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.w.toFixed(2), h: +r.h.toFixed(2) })),
    inkBottom: +inkBottom.toFixed(2),
    airBetweenInkAndBoard: +(svg.y - inkBottom).toFixed(2),
    poses: out,
  };
};

test("masthead ink, desk", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await settle(page);
  const r = await page.evaluate(INK, { w: 93.3, h: 23.0, dx: 7.48 });
  writeFileSync(join(OUT, `ink-${browserName}-desk.json`), JSON.stringify(r, null, 1));
  expect(r.inkRects.length).toBeGreaterThan(0);
});

test("masthead ink, phone", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 393, height: 699 });
  await settle(page);
  const r = await page.evaluate(INK, { w: 82.7, h: 20.1, dx: 4.25 });
  writeFileSync(join(OUT, `ink-${browserName}-phone.json`), JSON.stringify(r, null, 1));
  expect(r.inkRects.length).toBeGreaterThan(0);
});

test("dash law on the shipped trace", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ colorScheme: "light" });
  await settle(page);
  const box = await page.locator(".cell-native-input").first().boundingBox();
  await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  const mounted = await page.locator(".progress-trace").count();
  const info = await page.evaluate(() => {
    const paths = Array.from(document.querySelectorAll<SVGPathElement>(".progress-trace"));
    const meta = paths.map(p => {
      const cs = getComputedStyle(p);
      return { pathLength: p.getAttribute("pathLength"), dasharray: cs.strokeDasharray, dashoffset: cs.strokeDashoffset,
               totalLength: +(p as SVGGeometryElement).getTotalLength().toFixed(2), strokeWidth: cs.strokeWidth, stroke: cs.stroke };
    });
    for (const p of paths) p.style.setProperty("stroke-dashoffset", "750", "important");
    const b = document.querySelector(".hand-drawn-grid")!.getBoundingClientRect();
    return { n: paths.length, meta, board: { x: b.x, y: b.y, w: b.width, h: b.height } };
  });
  await page.waitForTimeout(400);
  const b = info.board;
  await page.screenshot({ path: join(OUT, `dash-${browserName}.png`),
    clip: { x: Math.max(0, b.x - 14), y: Math.max(0, b.y - 14), width: b.w + 28, height: b.h + 28 } });
  writeFileSync(join(OUT, `dash-${browserName}.json`), JSON.stringify({ mounted, ...info }, null, 1));
  expect(mounted).toBeGreaterThan(0);
});
