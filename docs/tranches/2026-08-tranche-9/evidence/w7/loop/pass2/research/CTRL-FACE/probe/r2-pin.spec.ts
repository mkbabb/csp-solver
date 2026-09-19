import { test } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@playwright/test/index.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * CTRL-FACE pass-2 RESEARCH · F — the first well's 1.5rem is paying for a STICKY OFFSET.
 * The prototype bought the tape's clearance with 0.35 → 1.5rem of flow (18.41px of the iPad
 * breach). The pin (`--washi-tag-top`) costs NOTHING in flow. Sweep both at the dock and
 * read the clearance, the clip against the card's own case edge, and the card's height.
 */
const OUT = resolve(process.env.CTRL_FACE_OUT || "readings");
mkdirSync(OUT, { recursive: true });

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844 },
  { name: "dock-375x812", w: 375, h: 812 },
  { name: "land-900x500", w: 900, h: 500 },
];

test("F — the first well vs the pin, swept at the dock", async ({ browser }, info) => {
  const out: Record<string, unknown> = { engine: info.project.name };
  for (const cell of CELLS) {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: true,
      isMobile: true,
      baseURL: info.project.use.baseURL,
    });
    const p = await ctx.newPage();
    await p.goto("./?size=3&difficulty=EASY");
    await p.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
    await p.waitForTimeout(1400);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await p.locator(".drawer-tab").click({ force: true });
      await p.waitForTimeout(950);
    }
    const read = () =>
      p.evaluate(() => {
        const tape = document.querySelector(".tray-well > .washi-tag") as HTMLElement | null;
        const head = document.querySelector(
          ".mobile-heading-btn, .mobile-heading-row .section-heading, .section-heading",
        ) as HTMLElement | null;
        const card = document.querySelector(".controls-card") as HTMLElement | null;
        const well = document.querySelector(".tray-well") as HTMLElement | null;
        if (!tape || !card) return null;
        const t = tape.getBoundingClientRect();
        const c = card.getBoundingClientRect();
        const cs = getComputedStyle(card);
        const padTop = parseFloat(cs.paddingTop) || 0;
        return {
          gapToHead: head ? +(head.getBoundingClientRect().top - t.bottom).toFixed(2) : null,
          tapeTopMinusCaseEdge: +(t.top - c.top).toFixed(2),
          tapeTopMinusContentEdge: +(t.top - (c.top + padTop)).toFixed(2),
          pinned: +(t.top - c.top).toFixed(2) < +(well!.getBoundingClientRect().top - c.top).toFixed(2),
          cardScroll: +card.scrollHeight.toFixed(2),
          panel: (() => {
            const pw = document.querySelector(".controls-card .control-panel-wrap");
            return pw ? +pw.getBoundingClientRect().height.toFixed(2) : null;
          })(),
          tape: { top: +t.top.toFixed(2), bottom: +t.bottom.toFixed(2), h: +t.height.toFixed(2) },
        };
      });
    const arms: Record<string, unknown> = { "as-built (1.5rem / pin 0.15rem)": await read() };
    for (const [name, css] of [
      ["fw 0.35rem", `.tray-well:first-child{margin-top:0.35rem!important}`],
      ["fw 0.35 + pin 0", `.tray-well:first-child{margin-top:0.35rem!important}.tray-well{--washi-tag-top:calc(0rem - var(--card-pad-t, 0px))!important}`],
      ["fw 0.35 + pin -0.3rem", `.tray-well:first-child{margin-top:0.35rem!important}.tray-well{--washi-tag-top:calc(-0.3rem - var(--card-pad-t, 0px))!important}`],
      ["fw 0.35 + pin -0.6rem", `.tray-well:first-child{margin-top:0.35rem!important}.tray-well{--washi-tag-top:calc(-0.6rem - var(--card-pad-t, 0px))!important}`],
      ["fw 0.35 + lift 12px", `.tray-well:first-child{margin-top:0.35rem!important}.tray-well{--washi-tag-lift:12px!important}`],
      ["fw 0.5rem", `.tray-well:first-child{margin-top:0.5rem!important}`],
      ["fw 1.2rem", `.tray-well:first-child{margin-top:1.2rem!important}`],
    ] as [string, string][]) {
      await p.reload();
      await p.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
      await p.waitForTimeout(1300);
      if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
        await p.locator(".drawer-tab").click({ force: true });
        await p.waitForTimeout(950);
      }
      await p.addStyleTag({ content: css });
      await p.waitForTimeout(250);
      arms[name] = await read();
    }
    out[cell.name] = arms;
    await ctx.close();
  }
  writeFileSync(resolve(OUT, `F-pin-${info.project.name}.json`), JSON.stringify(out, null, 2) + "\n");
  console.log("F", info.project.name, "banked");
});
