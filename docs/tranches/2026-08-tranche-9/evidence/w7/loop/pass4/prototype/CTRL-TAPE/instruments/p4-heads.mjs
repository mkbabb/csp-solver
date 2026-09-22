/**
 * T9-W7 pass 4 · CTRL-TAPE — THE HEADING POPULATION, and whether a READER hears it.
 *
 * r0's heading instrument (`r0/r1-controls/probe/heading-voice.spec.ts` ROW 2) asserts that
 * every group name on the card is a document heading; at HEAD two of eight were. This design
 * makes all eight `<h2>`, so the row's RED is cured and the DOCUMENT's h2 population moves
 * 2 → 8 wherever the card mounts — including `/?view=gallery`, a surface this wave does not
 * claim. The question that decides whether that is a π break or a DOM fact is whether the eight
 * are in the ACCESSIBILITY tree while the gallery is showing, so this reads both: the raw
 * element count AND Playwright's `ariaSnapshot` heading roster on the same page.
 *
 *   node p4-heads.mjs <out.json> <protoURL> <controlURL>
 */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const PROTO = process.argv[3] || "http://127.0.0.1:4230";
const CTRL = process.argv[4] || "http://127.0.0.1:4231";

const DOM = () =>
  [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => {
    const cs = getComputedStyle(h);
    const b = h.getBoundingClientRect();
    const hiddenAncestor = !!h.closest("[aria-hidden='true'],[hidden],[inert]");
    return {
      tag: h.tagName,
      text: (h.textContent || "").trim().slice(0, 20),
      display: cs.display,
      visibility: cs.visibility,
      box: `${+b.width.toFixed(1)}x${+b.height.toFixed(1)}`,
      inCard: !!h.closest(".controls-card"),
      hiddenAncestor,
      // "rendered" in the a11y sense: a box, not display:none, not visibility:hidden,
      // and not under an aria-hidden / hidden / inert ancestor.
      exposed:
        cs.display !== "none" &&
        cs.visibility !== "hidden" &&
        b.width > 0 &&
        b.height > 0 &&
        !hiddenAncestor,
    };
  });

const out = {};
for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const br = await launcher.launch();
  for (const [arm, base] of [
    ["proto", PROTO],
    ["control", CTRL],
  ]) {
    for (const route of ["/?view=gallery", "/?size=3&difficulty=EASY&board=heads"]) {
      const ctx = await br.newContext({ baseURL: base, viewport: { width: 1440, height: 900 } });
      const page = await ctx.newPage();
      const key = `${eng}|${arm}|${route.includes("gallery") ? "gallery" : "play"}`;
      try {
        await page.goto(route);
        await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
        await page.waitForTimeout(900);
        const dom = await page.evaluate(DOM);
        const snap = await page.locator("body").ariaSnapshot();
        const ariaHeadings = (snap.match(/^\s*- heading /gm) || []).length;
        out[key] = {
          domHeadings: dom.length,
          exposed: dom.filter((h) => h.exposed).length,
          inCardExposed: dom.filter((h) => h.inCard && h.exposed).length,
          ariaHeadings,
          rows: dom,
        };
      } catch (e) {
        out[key] = { error: String(e).slice(0, 220) };
      }
      await ctx.close();
    }
  }
  await br.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
for (const k of Object.keys(out)) {
  const v = out[k];
  console.log(
    k,
    v.error
      ? "ERR " + v.error
      : `dom=${v.domHeadings} exposed=${v.exposed} inCardExposed=${v.inCardExposed} aria=${v.ariaHeadings}`,
  );
}
console.log("BANKED", OUT);
