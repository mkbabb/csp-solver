import { test } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@playwright/test/index.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * CTRL-FACE pass-2 RESEARCH · E — WHY the gallery moved, and what a HONEST zero-flow gate
 * reads. The pass-1 covenant is arithmetic over the tape's own margins; this asks the
 * CONSUMER instead: take the tape out of the flow (`display: none`) and read what the box
 * around it loses. A covenant that is true reads 0.00 on every consumer.
 */
const OUT = resolve(process.env.CTRL_FACE_OUT || "readings");
mkdirSync(OUT, { recursive: true });

const boxOf = (sel: string) =>
  ((s: string) => {
    const e = document.querySelector(s) as HTMLElement | null;
    return e ? +e.getBoundingClientRect().height.toFixed(2) : null;
  }) as unknown as (s: string) => number | null;

test("E — the tape's true flow cost, per consumer", async ({ browser }, info) => {
  const out: Record<string, unknown> = { engine: info.project.name };
  /* ── the GALLERY consumer ─────────────────────────────────────────────── */
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      baseURL: info.project.use.baseURL,
    });
    const p = await ctx.newPage();
    await p.goto("./?view=gallery");
    await p.waitForSelector(".staging-band .washi-tag", { timeout: 30000 });
    await p.waitForTimeout(1200);
    const shape = await p.evaluate(() => {
      const t = document.querySelector(".staging-band .washi-tag") as HTMLElement;
      const parent = t.parentElement as HTMLElement;
      const cs = getComputedStyle(t);
      return {
        display: cs.display,
        position: cs.position,
        parentTag: parent.tagName.toLowerCase(),
        parentClass: parent.className,
        parentDisplay: getComputedStyle(parent).display,
        isFlexItem: ["flex", "inline-flex", "grid", "inline-grid"].includes(
          getComputedStyle(parent).display,
        ),
        rects: t.getClientRects().length,
        marginTopUsed: cs.marginTop,
        offsetHeight: t.offsetHeight,
      };
    });
    const withTape = await p.evaluate(boxOf(".staging-band"), ".staging-band");
    await p.addStyleTag({ content: `.staging-band .washi-tag{display:none!important}` });
    await p.waitForTimeout(200);
    const without = await p.evaluate(boxOf(".staging-band"), ".staging-band");
    out.gallery = { shape, withTape, without, trueFlowCost: +(withTape! - without!).toFixed(2) };
    await ctx.close();
  }
  /* ── the CONTROLS consumer ────────────────────────────────────────────── */
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
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
    const shape = await p.evaluate(() => {
      const t = document.querySelector(".tray-well > .washi-tag") as HTMLElement;
      const parent = t.parentElement as HTMLElement;
      const cs = getComputedStyle(t);
      return {
        display: cs.display,
        position: cs.position,
        parentClass: parent.className,
        parentDisplay: getComputedStyle(parent).display,
        isFlexItem: ["flex", "inline-flex", "grid", "inline-grid"].includes(
          getComputedStyle(parent).display,
        ),
        marginTopUsed: cs.marginTop,
        lineHeight: cs.lineHeight,
        offsetHeight: t.offsetHeight,
      };
    });
    const read = () =>
      p.evaluate(() => {
        const wells = Array.from(document.querySelectorAll(".tray-well")).map(
          (w) => +w.getBoundingClientRect().height.toFixed(2),
        );
        const card = document.querySelector(".controls-card");
        return { wells, cardScroll: card ? +(card as HTMLElement).scrollHeight.toFixed(2) : null };
      });
    const withTape = await read();
    await p.addStyleTag({ content: `.tray-well > .washi-tag{display:none!important}` });
    await p.waitForTimeout(200);
    const without = await read();
    out.controls = {
      shape,
      withTape,
      without,
      trueFlowCostPerWell: withTape.wells.map((h, i) => +(h - without.wells[i]).toFixed(2)),
    };
    await ctx.close();
  }
  writeFileSync(resolve(OUT, `E-flow-${info.project.name}.json`), JSON.stringify(out, null, 2) + "\n");
  console.log("E", info.project.name, JSON.stringify(out));
});
