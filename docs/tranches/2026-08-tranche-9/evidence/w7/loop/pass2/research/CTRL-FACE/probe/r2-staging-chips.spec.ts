import { test } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@playwright/test/index.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * CTRL-FACE pass-2 RESEARCH · H — the SECOND shared class nobody censused.
 * `OptionSelector` has two render consumers (`shared-class-census.mjs`): the controls card and
 * `StagingBand` — and the band pins the chip's SIZE and PADDING (`StagingBand.vue:289-292`),
 * never its FAMILY. So the face law's `.ctrl-btn` re-point moves the GALLERY's staging chips
 * too, on a row the estate declares `nowrap` with a reserve measured at the old face
 * (T8-W1 M4, `StagingBand.vue:268-289`). Read the chips, the row's overflow, and the label
 * column, as built and with HEAD's face restored in-page.
 */
const OUT = resolve(process.env.CTRL_FACE_OUT || "readings");
mkdirSync(OUT, { recursive: true });

const HEAD_CHIP = `.ctrl-btn{font-family:"Fira Code",monospace!important;text-transform:none!important}`;

const READ = () => {
  const axes = Array.from(document.querySelectorAll(".staging-axis")).map((ax) => {
    const label = ax.querySelector(".staging-axis-label") as HTMLElement;
    const row = ax.querySelector(".options-row") as HTMLElement;
    const chips = Array.from(ax.querySelectorAll(".ctrl-btn")).map((b) => {
      const cs = getComputedStyle(b);
      return {
        text: (b as HTMLElement).innerText.trim(),
        w: +b.getBoundingClientRect().width.toFixed(2),
        h: +b.getBoundingClientRect().height.toFixed(2),
        family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
        size: +parseFloat(cs.fontSize).toFixed(2),
      };
    });
    return {
      label: label?.innerText.trim(),
      labelW: label ? +label.getBoundingClientRect().width.toFixed(2) : null,
      rowScrollW: row ? +row.scrollWidth.toFixed(2) : null,
      rowClientW: row ? +row.clientWidth.toFixed(2) : null,
      overflow: row ? +(row.scrollWidth - row.clientWidth).toFixed(2) : null,
      chipsTotal: +chips.reduce((a, c) => a + c.w, 0).toFixed(2),
      chips,
    };
  });
  const band = document.querySelector(".staging-band");
  return {
    axes,
    bandW: band ? +band.getBoundingClientRect().width.toFixed(2) : null,
    labelCol: getComputedStyle(document.documentElement).getPropertyValue("--staging-label-col") ||
      getComputedStyle(document.querySelector(".staging-axis") as Element).gridTemplateColumns,
  };
};

for (const cell of [
  { name: "gallery-1280x800", w: 1280, h: 800, mobile: false },
  { name: "gallery-390x844", w: 390, h: 844, mobile: true },
]) {
  test(`H — the staging chips at ${cell.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile,
      baseURL: info.project.use.baseURL,
    });
    const p = await ctx.newPage();
    const out: Record<string, unknown> = { cell: cell.name, engine: info.project.name };
    try {
      for (const game of ["", "futoshiki"]) {
        await p.goto(`./?view=gallery${game ? `&game=${game}` : ""}`);
        await p.waitForSelector(".staging-axis .ctrl-btn", { timeout: 30000 });
        await p.waitForTimeout(1200);
        out[`built${game ? `-${game}` : ""}`] = await p.evaluate(READ);
        await p.addStyleTag({ content: HEAD_CHIP });
        await p.waitForTimeout(250);
        out[`headFace${game ? `-${game}` : ""}`] = await p.evaluate(READ);
      }
    } finally {
      writeFileSync(
        resolve(OUT, `H-staging-${cell.name}-${info.project.name}.json`),
        JSON.stringify(out, null, 2) + "\n",
      );
      await ctx.close();
    }
  });
}
