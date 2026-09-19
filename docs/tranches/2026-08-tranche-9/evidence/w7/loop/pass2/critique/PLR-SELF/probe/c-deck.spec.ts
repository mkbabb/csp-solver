/**
 * THE DECK, where this family claims nothing. `/` auto-deals a board (the first census read the
 * PLAYING view by accident), so the gallery is entered by its own parameter — the estate's own
 * idiom, `e2e/gallery.spec.ts` and `filter-census.spec.ts:455`.
 */
import { test } from "@playwright/test";

const PROTO = "http://127.0.0.1:4245";
const HEAD = "http://127.0.0.1:4246";
const GALLERY = "/?view=gallery&size=3&difficulty=EASY";
const say = (o: unknown) => console.log(`CRIT|${JSON.stringify(o)}`);

const census = (url: string) =>
  async function (page: import("@playwright/test").Page) {
    await page.goto(url);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForTimeout(1500);
    return page.evaluate(() => {
      const box = (e: Element | null) => {
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)];
      };
      return {
        url: location.href,
        cards: document.querySelectorAll(".game-card").length,
        marks: document.querySelectorAll("[data-player-mark]").length,
        lobbies: document.querySelectorAll("[data-lobby]").length,
        cornerLeft: box(document.querySelector(".corner-left")),
        mobileAttr: box(document.querySelector(".mobile-attribution")),
        trigger: [...document.querySelectorAll(".attribution-trigger")].map(box),
        cornerRight: box(document.querySelector(".corner-right")),
        logo: box(document.querySelector("svg.handwritten-logo")),
        swatches: [...document.querySelectorAll(".game-card-swatch")]
          .slice(0, 4)
          .map((e) => getComputedStyle(e).backgroundColor),
      };
    });
  };

for (const vp of [
  { name: "desk-1280", width: 1280, height: 800 },
  { name: "phone-390", width: 390, height: 844 },
]) {
  test(`gallery pi ${vp.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const a = await ctx.newPage();
    const b = await ctx.newPage();
    const proto = await census(`${PROTO}${GALLERY}`)(a);
    const head = await census(`${HEAD}${GALLERY}`)(b);
    say({ t: "gallery-pi", engine: info.project.name, vp: vp.name, proto, head });
    await ctx.close();
  });
}
