/** T9-W7 pass 6 · MRK-LIVE · 60/120 Hz STATED (charter row 11). The living mark's revolution is
 *  counted in BEATS on pencil-boil's shared beat, never in frames, so its writes and its settle
 *  must not move with the display's clock. Under the chair's rate-clock (CLOCK=60 the shim, the
 *  negative-control clock; CLOCK=driven 125 Hz; CLOCK=native), focus a cell by keyboard and record
 *  every `data-mark-pose` write on the grid for 1.2 s: the pose sequence, the write count, the
 *  settle instant (last write after landing), and the measured clock. */
import { test } from "@playwright/test";
import { clockFor, clockHz } from "./rate-clock";
test("P6-HZ · the living mark's writes under 60 Hz, driven 125 Hz and native clocks", async ({ page }, info) => {
  const clock = clockFor();
  await page.addInitScript(clock.script as (a?: number) => void, clock.arg);
  await page.goto("./?size=3&board=ATMuMDAzMDA2MDgwMDUwNzAwMTAzMDA5MDIwMDUwMjAwNTA3MDAxMDYwMDkwMjAwODAxMDA0MDYwMDQwNjAwOTAyMDA4MDEwMDQwOTAwMzA1MDA4");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.keyboard.press("Tab");
  const since = await page.evaluate(() => performance.now());
  const out = await page.evaluate(async () => {
    const host = document.querySelector("[data-mark-pose]") as HTMLElement | null;
    const writes: { t: number; v: string | null }[] = [];
    const t0 = performance.now();
    const mo = new MutationObserver(() => writes.push({ t: Math.round(performance.now() - t0), v: host!.getAttribute("data-mark-pose") }));
    if (host) mo.observe(host, { attributes: true, attributeFilter: ["data-mark-pose"] });
    document.querySelectorAll<HTMLInputElement>(".game-cell input")[40].focus();
    await new Promise((r) => setTimeout(r, 1200));
    mo.disconnect();
    return { host: !!host, writes };
  });
  const hz = await clockHz(page, since);
  console.log(`HZ ${info.project.name} ${clock.name} clock ${hz.hz.toFixed(1)} Hz · writes ${out.writes.length} · seq ${out.writes.map((w) => w.v).join(",")} · at ${out.writes.map((w) => w.t).join(",")} ms`);
});
