/**
 * NOTE-LEDGER · pass-3 — L15's second half, settled by NEGATIVE CONTROL instead of a heuristic.
 *
 * The gap-then-ink scan is device-scale sensitive (phone dsf 3, desk dsf 2), so a desk RED could
 * not be told from a scan artifact. This row renders the SAME box twice — once as shipped
 * (`text-overflow: ellipsis`) and once forced to `text-overflow: clip` — and diffs the tail. If
 * the ellipsis paints, the two tails differ; if webkit refuses it under `overflow-x: clip`, they
 * are identical and the DECLARED FALLBACK lands.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";
import { writeFileSync } from "node:fs";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/NOTE-LEDGER/logs";
const PROTO = "http://127.0.0.1:4249/";

async function run(engineName) {
  const browser = await pw[engineName].launch();
  const out = { engine: engineName, berths: {} };
  for (const rig of [
    { name: "phone 390x844", w: 390, h: 844, dsf: 3, mobile: true },
    { name: "desk 1280x800", w: 1280, h: 800, dsf: 2, mobile: false },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: rig.w, height: rig.h },
      deviceScaleFactor: rig.dsf,
      isMobile: rig.mobile && engineName === "chromium",
      hasTouch: rig.mobile,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await page.goto(PROTO + "?size=3&difficulty=EASY");
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
    await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
    await page.waitForTimeout(1300);
    // depth two
    await page.evaluate(() => {
      const i = [...document.querySelectorAll(".board-cells input")].filter(
        (x) => !x.value && !x.readOnly && !x.disabled,
      );
      i[0]?.focus();
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(700);
    await page.evaluate(() => {
      const g = [...document.querySelectorAll(".board-cells input")].find((i) => i.value);
      g?.focus();
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      set.call(g, "7");
      g.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.waitForTimeout(800);

    const geo = await page.evaluate(() => {
      const two = document.querySelector(".margin-note-previous");
      if (!two) return null;
      two.textContent = "x".repeat(400);
      const b = two.getBoundingClientRect();
      const cs = getComputedStyle(two);
      return {
        x: b.x,
        y: b.y,
        w: b.width,
        h: b.height,
        overflowX: cs.overflowX,
        overflowY: cs.overflowY,
        textOverflow: cs.textOverflow,
        clientWidth: two.clientWidth,
        scrollWidth: two.scrollWidth,
      };
    });
    if (!geo) {
      out.berths[rig.name] = { skipped: "no line two" };
      await ctx.close();
      continue;
    }
    const tailClip = { x: geo.x + geo.w - 30, y: geo.y, width: 30, height: geo.h };
    const shipped = await page.screenshot({ clip: tailClip });
    await page.addStyleTag({
      content: ".margin-note-previous { text-overflow: clip !important; }",
    });
    await page.waitForTimeout(150);
    const forced = await page.screenshot({ clip: tailClip });

    const raw = async (b) =>
      (await sharp(b).ensureAlpha().raw().toBuffer({ resolveWithObject: true })).data;
    const A = await raw(shipped),
      B = await raw(forced);
    let diff = 0;
    for (let i = 0; i < A.length; i += 4)
      if (
        Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) >
        18
      )
        diff++;
    out.berths[rig.name] = {
      geo,
      tailPixelsDiffering: diff,
      tailPixelsTotal: A.length / 4,
      verdict:
        diff > 0
          ? "GREEN — the tail differs from a forced `text-overflow: clip`, so the ellipsis PAINTS under overflow-x: clip"
          : "RED — the tail is byte-identical to a forced clip: no ellipsis. The DECLARED FALLBACK lands (overflow:hidden + padding-bottom .2em / margin-bottom -.2em)",
    };
    await ctx.close();
    console.log(engineName, rig.name, "| diff px", diff, "|", out.berths[rig.name].verdict);
  }
  await browser.close();
  writeFileSync(
    `${OUT}/P7-ellipsis-${engineName}.json`,
    JSON.stringify(out, null, 2),
  );
}
await run(process.argv[2]);
