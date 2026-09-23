/**
 * CRITIC · painted AA with the sensitivity row, tree dist, 1280, DPR 1 AND DPR 2, light and dark,
 * fresh and settled; plus the CONTROL's fresh line (HEAD has no settle) at DPR 1 and 2 as the
 * estate baseline for the sensitivity statistic.
 */
import { test, expect, type Browser } from "@playwright/test";
import { bank, boardReady, armHint, paintedAA, PROTO, CONTROL, PAYLOAD } from "./lib";

async function read(browser: Browser, base: string, scheme: "light" | "dark", dpr: number, wantSettled: boolean) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme, deviceScaleFactor: dpr });
  const page = await ctx.newPage();
  await boardReady(page, base);
  await armHint(page, 0);
  if (wantSettled) {
    await expect.poll(() => page.evaluate(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age")), { timeout: 5000 }).toBe("settled");
  }
  // settle the colour tween: poll the computed colour to a stable value (never a fixed wait)
  let last = "", same = 0;
  for (let i = 0; i < 40 && same < 3; i++) {
    const c = await page.evaluate(() => getComputedStyle(document.querySelector(".margin-note-ink")!).color);
    same = c === last ? same + 1 : 0; last = c;
    await page.waitForTimeout(100);
  }
  const r = await paintedAA(page);
  await ctx.close();
  return r;
}
test("critic AA", async ({ browser }, info) => {
  test.setTimeout(400000);
  const out: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD };
  for (const dpr of [1, 2]) for (const scheme of ["light", "dark"] as const) {
    out[`tree.${scheme}.dpr${dpr}.fresh`] = await read(browser, PROTO, scheme, dpr, false);
    out[`tree.${scheme}.dpr${dpr}.settled`] = await read(browser, PROTO, scheme, dpr, true);
    out[`control.${scheme}.dpr${dpr}.fresh`] = await read(browser, CONTROL, scheme, dpr, false);
  }
  bank(`critic-aa-${info.project.name}.json`, out);
});
