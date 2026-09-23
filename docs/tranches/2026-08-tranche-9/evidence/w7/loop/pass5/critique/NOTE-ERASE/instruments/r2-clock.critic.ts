/**
 * CRITIC · the honest clock on the tree's BUILT dist (B5bcl), independent of the lane's probe.
 * Negative control = the hook BLOCKED at the source (CSSStyleDeclaration.setProperty patched by an
 * init script to drop exactly the hook's write), not stripped after the fact. Adversaries: (1,1,0),
 * (1,1,0) !important, a DELAY adversary (10ms + 900ms delay), and a (2,1,0) !important.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { bank, say, boardReady, refuseAGiven, armHint, watchLeave, leaveResult, PROTO, PAYLOAD } from "./lib";

const PLANTS: Record<string, string> = {
  none: "",
  p110: "#app .margin-note-ink{transition: color 350ms linear}",
  "p110-imp": "#app .margin-note-ink{transition: color 350ms linear !important}",
  "delay-imp": "#app .margin-note-ink{transition: color 10ms linear 900ms !important}",
  // NEW (re-audit): the longhand adversary, and a property the inline shorthand resets but a later sheet could re-add.
  "longhand-imp": "html body #app .margin-note .margin-note-ink.note-leave-active{transition-property: all !important; transition-duration: 800ms !important}",
  "p210-imp": "#app #app-root-x, #app .margin-note .margin-note-ink{transition: color 600ms linear !important}",
};
const BLOCK = () => {
  const orig = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function (p: string, v: string | null, pr?: string) {
    if (p === "transition" && v === "none" && pr === "important") return;
    return orig.call(this, p, v, pr);
  };
};

async function ctx(browser: Browser, blocked: boolean) {
  const c = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  if (blocked) await c.addInitScript(BLOCK);
  return c;
}
async function fresh(page: Page, plant: string) {
  await boardReady(page, PROTO);
  if (plant) await page.addStyleTag({ content: plant });
  await refuseAGiven(page, "5");
  await page.waitForTimeout(600);
  await watchLeave(page, false);
  await page.keyboard.press("5");
  return leaveResult(page);
}
async function settled(page: Page, plant: string) {
  await boardReady(page, PROTO);
  if (plant) await page.addStyleTag({ content: plant });
  await armHint(page, 0);
  await expect
    .poll(() => page.evaluate(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age")), { timeout: 5000 })
    .toBe("settled");
  await watchLeave(page, false);
  await armHint(page, 3);
  return leaveResult(page);
}

test("critic clock", async ({ browser }, info) => {
  const rows: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD, dist: "index-B5bclKNTuHnj.js (the tree dist; the re-audit rebuild is diff -r identical)" };
  for (const blocked of [false, true]) {
    const c = await ctx(browser, blocked);
    const page = await c.newPage();
    const tag = blocked ? "BLOCKED" : "hook";
    for (const [k, plant] of Object.entries(PLANTS)) rows[`${tag}.fresh.${k}`] = await fresh(page, plant);
    rows[`${tag}.settled.p110-imp`] = await settled(page, PLANTS["p110-imp"]);
    await c.close();
  }
  bank(`critic5r2-clock-${info.project.name}.json`, rows);
  say("clock", Object.fromEntries(Object.entries(rows).map(([k, v]) => [k, v && typeof v === "object" ? `${(v as any).transitionDuration} ${(v as any).absentMs}ms ${(v as any).inlinePriority}` : v])));
});
