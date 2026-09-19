import { test } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@playwright/test/index.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * CTRL-FACE pass-2 RESEARCH · G — the tape's LEADING is the term that pays.
 * The printed rung grows the tape's paper by its leading, and the paper is what collides
 * with the tab head and what the first well's margin was bought to clear. With an
 * `lh`-derived pull the leading is free to move (net flow stays zero by construction), so
 * sweep it: clearance at the dock with the first well back at 0.35rem, the iPad panel
 * height, and whether the tape's own INK still fits its paper.
 */
const OUT = resolve(process.env.CTRL_FACE_OUT || "readings");
mkdirSync(OUT, { recursive: true });

const LEADINGS = ["1.2", "1.1", "1.05", "1", "0.95", "0.9"];
const css = (lh: string, fw: string) =>
  `.tray-well{--washi-tag-lh:${lh}!important}` +
  `.washi-tag{line-height:var(--washi-tag-lh,1.5)!important;` +
  `margin-top:calc(-1lh - 0.04rem - var(--washi-tag-lift, 0px))!important}` +
  `.tray-well:first-child{margin-top:${fw}!important}`;

const READ = () => {
  const tape = document.querySelector(".tray-well > .washi-tag") as HTMLElement | null;
  const head = document.querySelector(
    ".mobile-heading-btn, .mobile-heading-row .section-heading, .section-heading",
  ) as HTMLElement | null;
  const card = document.querySelector(".controls-card") as HTMLElement | null;
  const pw = document.querySelector(".controls-card .control-panel-wrap");
  const well = document.querySelector(".tray-well") as HTMLElement | null;
  if (!tape || !card || !well) return null;
  const t = tape.getBoundingClientRect();
  const cs = getComputedStyle(tape);
  const cv = document.createElement("canvas");
  const g = cv.getContext("2d")!;
  g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const m = g.measureText(tape.textContent!.trim());
  const pad = parseFloat(cs.paddingTop) * 2;
  const paper = t.height;
  const inkH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  return {
    leading: cs.lineHeight,
    paperH: +paper.toFixed(2),
    inkH: +inkH.toFixed(2),
    inkFitsPaper: +(paper - pad - inkH).toFixed(2),
    fontAscDesc: +(m.fontBoundingBoxAscent + m.fontBoundingBoxDescent).toFixed(2),
    gapToHead: head ? +(head.getBoundingClientRect().top - t.bottom).toFixed(2) : null,
    tapeTopMinusCaseEdge: +(t.top - card.getBoundingClientRect().top).toFixed(2),
    wellFlowCost: null as number | null,
    cardScroll: +card.scrollHeight.toFixed(2),
    panel: pw ? +pw.getBoundingClientRect().height.toFixed(2) : null,
  };
};

for (const cell of [
  { name: "dock-390x844", w: 390, h: 844 },
  { name: "ipad-1280x800", w: 1280, h: 800 },
]) {
  test(`G — the tape's leading swept at ${cell.name}`, async ({ browser }, info) => {
    const out: Record<string, unknown> = { cell: cell.name, engine: info.project.name };
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: true,
      isMobile: true,
      baseURL: info.project.use.baseURL,
    });
    const p = await ctx.newPage();
    for (const fw of ["0.35rem", "1.5rem"]) {
      for (const lh of LEADINGS) {
        await p.goto("./?size=3&difficulty=EASY");
        await p.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
        await p.waitForTimeout(1300);
        if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
          await p.locator(".drawer-tab").click({ force: true });
          await p.waitForTimeout(950);
        }
        await p.addStyleTag({ content: css(lh, fw) });
        await p.waitForTimeout(250);
        const r = await p.evaluate(READ);
        // the tape's TRUE flow cost on its own well, with this leading
        const before = await p.evaluate(() => {
          const w = document.querySelector(".tray-well") as HTMLElement;
          return +w.getBoundingClientRect().height.toFixed(2);
        });
        await p.addStyleTag({ content: `.tray-well > .washi-tag{display:none!important}` });
        await p.waitForTimeout(150);
        const after = await p.evaluate(() => {
          const w = document.querySelector(".tray-well") as HTMLElement;
          return +w.getBoundingClientRect().height.toFixed(2);
        });
        if (r) r.wellFlowCost = +(before - after).toFixed(2);
        out[`fw ${fw} · lh ${lh}`] = r;
      }
    }
    await ctx.close();
    writeFileSync(
      resolve(OUT, `G-leading-${cell.name}-${info.project.name}.json`),
      JSON.stringify(out, null, 2) + "\n",
    );
    console.log("G", cell.name, info.project.name, "banked");
  });
}
