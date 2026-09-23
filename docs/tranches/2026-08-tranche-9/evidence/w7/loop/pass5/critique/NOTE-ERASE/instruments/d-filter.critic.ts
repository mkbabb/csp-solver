/** CRITIC · painted computed-filter population, both themes, both arms, 9x9 payload + hint armed. */
import { test, type Browser } from "@playwright/test";
import { bank, boardReady, armHint, PROTO, CONTROL, PAYLOAD } from "./lib";
const census = () => {
  const out: Record<string, number> = {};
  let total = 0;
  for (const el of document.querySelectorAll("*")) {
    const f = getComputedStyle(el).filter;
    if (f === "none") continue;
    const r = el.getBoundingClientRect();
    if (r.width * r.height === 0) continue;
    if (el.closest(".baked-hidden, .logo-pose-parked")) continue;
    const k = `${el.tagName.toLowerCase()}.${[...el.classList].join(".")} ${f}`;
    out[k] = (out[k] ?? 0) + 1; total++;
  }
  return { total, out };
};
async function arm(browser: Browser, base: string, scheme: "light" | "dark") {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme });
  const page = await ctx.newPage();
  await boardReady(page, base);
  const load = await page.evaluate(census);
  await armHint(page, 0);
  const hint = await page.evaluate(census);
  await ctx.close();
  return { load, hint };
}
test("critic filter census", async ({ browser }, info) => {
  test.setTimeout(300000);
  const out: Record<string, unknown> = { engine: info.project.name, payload: PAYLOAD };
  for (const s of ["light", "dark"] as const) {
    out[`tree.${s}`] = await arm(browser, PROTO, s);
    out[`control.${s}`] = await arm(browser, CONTROL, s);
  }
  bank(`critic-filter-${info.project.name}.json`, out);
});
