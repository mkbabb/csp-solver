import { test } from "@playwright/test";
test("P6-REVERSAL · per-frame framing error through a reversed glide", async ({ page }, info) => {
  await page.goto("./?game=sudoku");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.keyboard.press("Tab");
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }));
  await page.waitForTimeout(600);
  if (process.env.MRKLIVE_REV_FROM === "pressed") {
    await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
    await page.waitForTimeout(1500);
  }
  const out = await page.evaluate(async () => {
    const tab = document.querySelector<HTMLElement>(".drawer-tab")!;
    const err = () => {
      const ring = document.querySelector(".focus-ring");
      if (!ring) return null;
      const rb = ring.getBoundingClientRect();
      const bb = tab.getBoundingClientRect();
      const o = parseFloat(getComputedStyle(tab).getPropertyValue("--focus-ring-outset"));
      return +Math.max(Math.abs(rb.left - (bb.left - o)), Math.abs(rb.top - (bb.top - o))).toFixed(2);
    };
    const series: (number | null)[] = [];
    let stop = false;
    const loop = () => requestAnimationFrame(() => setTimeout(() => { series.push(err()); if (!stop) loop(); }, 0));
    tab.click();
    loop();
    await new Promise((r) => setTimeout(r, 140));
    const at = series.length;
    tab.click();
    await new Promise((r) => setTimeout(r, 1400));
    stop = true;
    const after = series.slice(at).filter((v): v is number => v !== null);
    const before = series.slice(0, at).filter((v): v is number => v !== null);
    const a = document.activeElement as HTMLElement;
    const rr = document.querySelector(".focus-ring")?.getBoundingClientRect();
    const tb = tab.getBoundingClientRect();
    const where = { active: a.tagName + "." + String(a.className).split(" ")[0], rings: document.querySelectorAll(".focus-ring").length, ring: rr && [rr.x, rr.y, rr.width, rr.height].map(Math.round), tab: [tb.x, tb.y, tb.width, tb.height].map(Math.round), expanded: tab.getAttribute("aria-expanded") };
    return { where, frames: series.length, reversalAt: at, maxBefore: Math.max(...before), maxAfter: Math.max(...after), last: series.at(-1), over1: after.filter((v) => v > 1).length };
  });
  console.log(`REV ${process.env.MRKLIVE_TAG ?? "lane"} ${info.project.name} ` + JSON.stringify(out));
});
