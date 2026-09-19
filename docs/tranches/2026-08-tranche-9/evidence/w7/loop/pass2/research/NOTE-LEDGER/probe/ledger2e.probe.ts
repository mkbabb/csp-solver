/**
 * NOTE-LEDGER · pass-2 RESEARCH probe, part five — R14, THE RANSOM TEST BY ADVANCE.
 *
 * `document.fonts.check` answered `true` for every character in R11, including the comma the
 * hand's declared `unicode-range` gates out (`index.css:93-96`), so it is not evidence — the
 * same trap CTRL-FACE booked in pass 1 ("ransom `p` by advance not cmap"). The honest test is
 * the ADVANCE: render the character with the hand in front of a distinctive fallback, then
 * with the fallback alone. Equal advances mean the hand never painted it.
 */
import { test, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/research/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function ctxFor(browser: Browser, browserName: string) {
  const ctx = await browser.newContext({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 3,
    isMobile: browserName === "chromium",
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  return { ctx, page };
}
async function boardReady(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForTimeout(1200);
}

test("R14 the ransom test by advance", async ({ browser }, info) => {
  const { ctx, page } = await ctxFor(browser, info.project.name);
  await boardReady(page);
  await page.evaluate(() => document.fonts.ready);
  const row = await page.evaluate(() => {
    const round = (x: number) => Math.round(x * 100) / 100;
    const probe = document.createElement("span");
    probe.style.cssText =
      "position:absolute;left:-9999px;top:0;font-size:16px;letter-spacing:0.02em;white-space:pre";
    document.body.appendChild(probe);
    const adv = (ch: string, family: string) => {
      probe.style.fontFamily = family;
      probe.textContent = `x${ch}x`;
      const a = probe.getBoundingClientRect().width;
      probe.textContent = "xx";
      const b = probe.getBoundingClientRect().width;
      return round(a - b);
    };
    const chars = "123456789ABCDEFGCRS,;jx".split("");
    const seen = new Set<string>();
    const out: unknown[] = [];
    for (const ch of chars) {
      if (seen.has(ch)) continue;
      seen.add(ch);
      const withHand = adv(ch, '"Patrick Hand", monospace');
      const fallbackOnly = adv(ch, "monospace");
      out.push({
        ch,
        cp: "U+" + ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0"),
        withHand,
        fallbackOnly,
        paintedByHand: Math.abs(withHand - fallbackOnly) > 0.01,
      });
    }
    probe.remove();
    return out;
  });
  bank(`R14-ransom-${info.project.name}.json`, row);
  await ctx.close();
});
