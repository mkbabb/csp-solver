import { test } from "@playwright/test";
test("P6-REVDBG", async ({ page }, info) => {
  await page.goto("./?game=sudoku");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.keyboard.press("Tab");
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }));
  await page.waitForTimeout(600);
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
  await page.waitForTimeout(1500);
  const out = await page.evaluate(async () => {
    const tab = document.querySelector<HTMLElement>(".drawer-tab")!;
    const path = () => { const set: Animation[] = []; for (let e: Element | null = tab; e; e = e.parentElement) set.push(...e.getAnimations()); return set.filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity)); };
    const snap = (tag: string) => `${tag}[${(document.activeElement as HTMLElement).className.split(" ")[0]}|same=${document.activeElement === tab}|conn=${tab.isConnected}]:` + document.getAnimations().filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity)).map((a) => `${((a.effect as KeyframeEffect).target as HTMLElement)?.className?.toString().split(" ")[0]}/${a.playState}/${a.playbackRate}/${Math.round(Number(a.currentTime))}/onpath=${tab.contains(((a.effect as KeyframeEffect).target as Element)) || ((a.effect as KeyframeEffect).target as Element)?.contains(tab)}`).join(",");
    const log: string[] = [];
    tab.click();
    log.push(snap("c1"));
    await new Promise((r) => setTimeout(r, 140));
    log.push(snap("t140"));
    tab.click();
    log.push(snap("c2"));
    for (let i = 0; i < 6; i++) { await new Promise((r) => requestAnimationFrame(r)); log.push(snap("f" + i)); }
    log.push("expanded=" + tab.getAttribute("aria-expanded"));
    return log;
  });
  console.log(`DBG ${info.project.name} ` + out.join(" | "));
});
