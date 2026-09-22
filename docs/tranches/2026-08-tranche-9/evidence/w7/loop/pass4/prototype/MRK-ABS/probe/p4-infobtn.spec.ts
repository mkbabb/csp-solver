/** MRK-ABS pass 4 — charter row 6: name the ground under `.info-btn`'s right-side ring. */
import { test, expect } from "@playwright/test";
import { bank, mintSudoku } from "./abs-lib";
test("info-btn right ground owner", async ({ page }, info) => {
  await page.goto(`/?size=3&board=${mintSudoku(3)}`);
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBe(81);
  await page.waitForTimeout(800);
  const out = await page.evaluate(() => {
    const b = document.querySelector("button.info-btn") as HTMLElement; const r = b.getBoundingClientRect();
    const rows: unknown[] = [];
    for (const t of [0.2, 0.35, 0.5, 0.65, 0.8]) for (const s of [3, 4, 5]) {
      const x = r.right + s, y = r.y + r.height * t;
      const st = document.elementsFromPoint(x, y).slice(0, 4).map((n) => `${n.tagName.toLowerCase()}.${[...n.classList].slice(0, 2).join(".")}`);
      rows.push({ t, s, stack: st.join(" > ") });
    }
    const sib = b.nextElementSibling as HTMLElement | null; const par = b.parentElement!;
    return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, next: sib ? `${sib.tagName.toLowerCase()}.${[...sib.classList].join(".")} gap ${(sib.getBoundingClientRect().left - r.right).toFixed(2)}px` : null,
      parent: `${par.tagName.toLowerCase()}.${[...par.classList].slice(0, 3).join(".")}`, rows };
  });
  console.log(JSON.stringify(out, null, 1)); bank(`infobtn-ground-${info.project.name}`, out);
});
