/** The two head disclosures share one origin — and PRM stills the ink. */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

test("the two head disclosures share one origin, and PRM stills the ink", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const state = () =>
    a.evaluate(() => {
      const painted = (s: string) =>
        [...document.querySelectorAll(s)].find(
          (e) => e.getBoundingClientRect().width > 0,
        ) as HTMLElement | undefined;
      const mark = painted("[data-player-mark]")!;
      const card = painted(".attribution-trigger")!.parentElement!.querySelector(
        ".hover-card",
      ) as HTMLElement;
      const lobby = mark.parentElement!.querySelector("[data-lobby]") as HTMLElement;
      return {
        card: getComputedStyle(card).visibility,
        lobby: getComputedStyle(lobby).visibility,
        inkDur: getComputedStyle(mark).transitionDuration,
      };
    });
  await a.locator("[data-player-mark]:visible").click();
  await a.waitForTimeout(260);
  const lobbyOpen = await state();
  // HOVER, not click: on a fine pointer this card opens on `mouseenter` and the click that
  // follows TOGGLES it shut again — the estate's shipped grammar, untouched by this family.
  // What is under test is the claim: the card opening must shut the lobby.
  await a.locator(".attribution-trigger:visible").hover();
  await a.waitForTimeout(260);
  const cardOpen = await state();
  await a.mouse.click(640, 780); // the page root's own outside-click dismissal, far from the head
  await a.waitForTimeout(260);
  const shut = await state();
  console.log(
    `DISC|${JSON.stringify({ engine: info.project.name, lobbyOpen, cardOpen, shut })}`,
  );
  expect(lobbyOpen.lobby).toBe("visible");
  expect(lobbyOpen.card, "opening the lobby shuts the card").toBe("hidden");
  expect(cardOpen.card).toBe("visible");
  expect(cardOpen.lobby, "opening the card shuts the lobby").toBe("hidden");
  expect(shut.card).toBe("hidden");
  expect(shut.lobby).toBe("hidden");
  expect(lobbyOpen.inkDur, "PRM stills the ink transition").toBe("0s");
  await ctx.close();
});
