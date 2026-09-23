/** T9-W7 pass 5 · MRK-ABS — the chrome census (charter rows 1 chrome cost, 5, 7, 8): home + deck +
 *  armed guard, both themes, one arm per run (BASE/ARM), FORCED=1 for forced colours, PRM=1 to park
 *  the boil. The tab's PROPOSED token form is re-pointed to `2px solid var(--ring-ink)` +
 *  `var(--focus-offset)` (the struck `--focus-ring` read nothing on the returned tree). */
import { test, expect, type Page } from "@playwright/test";
import { bank, mintSudoku, setTheme, inject } from "./abs-lib";
import { listStops, bandStop, arrival, armGuard } from "./chrome-lib";
const BASE = process.env.BASE ?? "http://127.0.0.1:4239"; const ARM = process.env.ARM ?? "A";
const FORCED = process.env.FORCED === "1"; const PRM = process.env.PRM === "1";
async function census(page: Page, label: string, scope = "") {
  const rows: Record<string, unknown>[] = [];
  for (const s of await listStops(page, scope)) {
    const first = await arrival(page, s.key, s.nth); const b = await bandStop(page, s.key, s.nth);
    rows.push({ ...b, firstFrame: first });
    console.log(`[${label}] ${s.key} host=${b.host} ${b.outline} worst=${(b.core as { worst: number })?.worst ?? "-"} f<3=${(b.core as { fracUnder3: number })?.fracUnder3 ?? "-"} side=${b.worstSide ?? "-"} owner=${b.groundOwner ?? "-"} sens=${((b.sensitivity as { at: string; worst: number; under3: string }[]) ?? []).map((x) => x.at + ":" + x.worst + "(" + x.under3 + ")").join(" ")}`);
    if (s.key.includes("drawer-tab") && !FORCED) {
      await inject(page, `.drawer-tab:focus-visible{outline:2px solid var(--ring-ink)!important;outline-offset:var(--focus-offset)!important}`, "abs-tab");
      const t = await bandStop(page, s.key, s.nth); await inject(page, "", "abs-tab");
      rows.push({ ...t, key: `${s.key}[PROPOSED token form]` });
      console.log(`[${label}] ${s.key}[PROPOSED token] ${t.outline} worst=${(t.core as { worst: number })?.worst ?? "-"} side=${t.worstSide ?? "-"} owner=${t.groundOwner ?? "-"}`);
    }
  }
  return rows;
}
test("census · home + deck + armed guard", async ({ page }, info) => {
  test.setTimeout(1500000);
  const engine = info.project.name; const out: Record<string, unknown> = { engine, arm: ARM, base: BASE, forced: FORCED, prm: PRM, payload9: mintSudoku(3) };
  const ident = await (await page.request.get(`${BASE}/`)).text(); out.identity = ident.match(/index-[A-Za-z0-9_-]+\.js/)?.[0];
  if (FORCED) await page.emulateMedia({ forcedColors: "active" });
  if (PRM) await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["light", "dark"] as const) {
    await page.goto(`${BASE}/?size=3&board=${mintSudoku(3)}`);
    await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBe(81);
    await setTheme(page, theme);
    const home = await census(page, `${engine} ${ARM} ${theme} home`);
    await page.goto(`${BASE}/?view=gallery&size=3&board=${mintSudoku(3)}`);
    await page.waitForSelector(".staging-band", { timeout: 30000 }); await page.waitForTimeout(900); await setTheme(page, theme);
    const deck = await census(page, `${engine} ${ARM} ${theme} deck`);
    let guard: unknown = null;
    try { await armGuard(page, BASE); await setTheme(page, theme);
      if (!(await page.locator(".gallery-guard").isVisible())) throw new Error("guard dismissed by the theme flip");
      guard = await census(page, `${engine} ${ARM} ${theme} guard`, ".gallery-guard"); }
    catch (e) { guard = { error: String(e).slice(0, 300) }; console.log(`[guard ${theme}] ${String(e).slice(0, 200)}`); }
    out[theme] = { home, deck, guard };
  }
  bank(`census-${ARM}${FORCED ? "-forced" : ""}${PRM ? "-prm" : ""}-${engine}`, out);
});
