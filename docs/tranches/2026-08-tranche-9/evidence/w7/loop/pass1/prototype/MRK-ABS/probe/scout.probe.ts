import { test, type Page } from "@playwright/test";

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForTimeout(1200);
}

test("scout — does programmatic focus arm :focus-visible on a button?", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  const read = async (tag: string) => {
    const r = await page.evaluate(() => {
      const b = document.querySelector<HTMLElement>(".ctrl-btn");
      if (!b) return null;
      const cs = getComputedStyle(b);
      return {
        fv: b.matches(":focus-visible"),
        f: b.matches(":focus"),
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
        offset: cs.outlineOffset,
      };
    });
    console.log(`SCOUT ${browserName} ${tag} ${JSON.stringify(r)}`);
  };
  await page.evaluate(() => document.querySelector<HTMLElement>(".ctrl-btn")?.focus());
  await page.waitForTimeout(120);
  await read("plain-focus");
  await page.keyboard.press("Shift");
  await page.evaluate(() => document.querySelector<HTMLElement>(".ctrl-btn")?.focus());
  await page.waitForTimeout(120);
  await read("after-shift");
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  const stops: string[] = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    const s = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a) return "none";
      const cs = getComputedStyle(a);
      const cls = (a.className || "").toString().split(" ")[0];
      return `${a.tagName}.${cls} fv=${a.matches(":focus-visible")} ${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor} off=${cs.outlineOffset}`;
    });
    stops.push(s);
  }
  console.log(`SCOUT-TAB ${browserName}\n` + stops.join("\n"));
});
