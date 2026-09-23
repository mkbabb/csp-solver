import { test, expect, type Page } from "@playwright/test";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const ARM = () => (test.info().project.use.baseURL?.includes("4241") ? "control" : "lane");
const out = (tag: string, o: unknown) => console.log(`[RC6] ${tag} ${test.info().project.name} ${ARM()} ${JSON.stringify(o)}`);
async function load(page: Page, q = `?size=3&board=${BOARD}`) {
  await page.goto(`./${q}`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 20000 }).toBeGreaterThan(0);
}
async function settled(page: Page) {
  let last = NaN;
  await expect.poll(async () => { const t = await page.evaluate(() => { const r = document.querySelector(".drawer-case")!.getBoundingClientRect(); return r.top + r.height * 7 + r.left * 1000; }); const s = Math.abs(t - last) < 0.01; last = t; return s; }, { intervals: [120] }).toBe(true);
}
const FP = (page: Page) => page.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].map((c) => (c.querySelector(".glyph-svg") ? "g" : ".")).join(""));

test.describe("D2 cross tap answers", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  for (const dir of ["deal→clear", "clear→deal", "clear", "deal"] as const) {
    test(`D2 ${dir}`, async ({ page }) => {
      if (ARM() === "control") return;
      await load(page, "?size=3&difficulty=EASY");
      const g0 = await FP(page);
      const blank = g0.indexOf(".");
      const input = page.locator(".board-cells input").nth(blank);
      await input.tap();
      await page.keyboard.type("5");
      await expect(input).toHaveValue("5");
      if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await page.locator(".drawer-tab").tap();
      await settled(page);
      const deal = page.locator(".mobile-control-panel").getByRole("button", { name: "Deal a new board" });
      const clear = page.locator("#controls-drawer").getByRole("button", { name: "Clear the board" });
      const standing = () => page.locator(".confirm-ribbon").evaluateAll((rs) => rs.map((r) => r.getAttribute("aria-label")));
      const [first, second] = dir === "deal→clear" ? [deal, clear] : dir === "clear→deal" ? [clear, deal] : dir === "clear" ? [clear, null] : [deal, null];
      await first.tap();
      await expect.poll(standing).toHaveLength(1);
      if (second) await second.tap();
      const q = await standing();
      await page.locator(".confirm-ribbon .confirm-go").tap();
      await expect.poll(standing).toEqual([]);
      await expect.poll(async () => (await FP(page)) !== g0 || (await input.inputValue()) === "").toBe(true);
      await page.evaluate(() => new Promise((r) => setTimeout(r, 6000)));
      const g1 = await FP(page);
      const diff = [...g1].filter((c, i) => c !== g0[i]).length;
      const r = { glyphs: (g1.match(/g/g) || []).length, glyphs0: (g0.match(/g/g) || []).length, q, sameGivens: g1 === g0, diffCells: diff, typedCleared: (await input.inputValue()) === "" };
      out(`D2.${dir}`, r);
      if (dir === "deal→clear" || dir === "clear") { expect(r.q).toEqual(["clear the board?"]); expect(r.sameGivens).toBe(true); expect(r.typedCleared).toBe(true); }
      else if (dir !== "clear") { expect(r.q).toEqual(["start a new board?"]); expect(r.sameGivens).toBe(false); }
    });
  }
});

test.describe("E publisher writes + live resize", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("E masthead-foot writes and follow", async ({ page }) => {
    await page.addInitScript(() => {
      const w: string[] = [];
      (window as any).__mfw = w;
      const orig = CSSStyleDeclaration.prototype.setProperty;
      CSSStyleDeclaration.prototype.setProperty = function (n: string, v: string | null, p?: string) {
        if (n === "--masthead-foot") w.push(`${Math.round(performance.now())}:${v}`);
        return orig.call(this, n, v, p);
      };
    });
    await load(page);
    await page.evaluate(() => new Promise((r) => setTimeout(r, 1500)));
    const atLoad = await page.evaluate(() => (window as any).__mfw.slice());
    if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await page.locator(".drawer-tab").click();
    await settled(page);
    const afterOpen = await page.evaluate(() => (window as any).__mfw.length);
    const air0 = await page.evaluate(() => +(document.querySelector(".drawer-case")!.getBoundingClientRect().top - document.querySelector("svg.handwritten-logo")!.getBoundingClientRect().bottom).toFixed(2));
    await page.setViewportSize({ width: 360, height: 800 });
    await settled(page);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await settled(page);
    const r = await page.evaluate(() => ({ ink: +document.querySelector("svg.handwritten-logo")!.getBoundingClientRect().bottom.toFixed(2), mf: document.documentElement.style.getPropertyValue("--masthead-foot"), air: +(document.querySelector(".drawer-case")!.getBoundingClientRect().top - document.querySelector("svg.handwritten-logo")!.getBoundingClientRect().bottom).toFixed(2), writes: (window as any).__mfw.length }));
    out("E", { atLoad, afterOpen, air0, afterResize360: r });
  });
});
