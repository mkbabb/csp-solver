/** Why is the self row colourless in a live room? Ask the module, not the pixels. */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY";

async function boot(page: Page, url: string) {
  await page.goto(url);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForTimeout(800);
}

const dump = (p: Page) =>
  p.evaluate(async () => {
    const m = (await import("/src/games/shared/useSession.ts")) as unknown as {
      session: {
        players: { value: { id: string; slug: string; self?: boolean; ink: unknown }[] };
        live: { value: boolean };
        roomId: { value: string | null };
      };
      authorInk: { value: Record<string, unknown> };
    };
    return {
      live: m.session.live.value,
      room: m.session.roomId.value,
      players: m.session.players.value.map((r) => ({
        id: r.id.slice(0, 6),
        slug: r.slug,
        self: !!r.self,
        ink: r.ink,
      })),
      authorInk: m.authorInk.value,
    };
  });

test("the room, asked directly", async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: "light", reducedMotion: "reduce" });
  const a = await ctx.newPage();
  await boot(a, SOLO + "&wire=local");
  console.log("A solo:", JSON.stringify(await dump(a)));
  await a
    .locator('.controls-card button[aria-label="Play together on this board"]')
    .click({ timeout: 15000 });
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  console.log("A alone in a room:", JSON.stringify(await dump(a)));
  const b = await ctx.newPage();
  await b.emulateMedia({ reducedMotion: "reduce" });
  await b.goto(a.url());
  await b.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2, {
    timeout: 30000,
  });
  await a.waitForTimeout(1200);
  console.log("A with a peer:", JSON.stringify(await dump(a)));
  console.log("B with a peer:", JSON.stringify(await dump(b)));
  const rows = await a.evaluate(() =>
    Array.from(
      document.querySelectorAll<HTMLElement>(".controls-card .players-roster .player-row"),
    ).map((r) => ({
      cls: r.className,
      ink: r.style.getPropertyValue("--color-user-ink"),
      swatch: getComputedStyle(r.querySelector(".player-swatch")!).backgroundColor,
      text: (r.textContent ?? "").trim().slice(0, 24),
    })),
  );
  console.log("A rows:", JSON.stringify(rows));

  // A WRITES: does A's own cell take A's own ink, on A's page and on B's?
  const emptyIdx: number = await a.evaluate(
    () =>
      Array.from(document.querySelectorAll<HTMLElement>(".sudoku-cell")).findIndex(
        (c) => !c.querySelector<HTMLInputElement>("input")?.value,
      ),
  );
  await a.evaluate((n: number) => {
    document
      .querySelectorAll<HTMLElement>(".sudoku-cell")
      [n].querySelector<HTMLInputElement>("input")
      ?.focus();
  }, emptyIdx);
  await a.keyboard.type("5");
  await a.waitForTimeout(1500);
  const bound = async (p: Page, label: string) => {
    const r = await p.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>(".game-cell"))
        .map((c, i) => ({
          i,
          ink: c.style.getPropertyValue("--color-user-ink"),
          glyph: getComputedStyle(c.querySelector(".glyph-svg path") ?? c).stroke,
          mine: /your entry/i.test(c.querySelector("input")?.getAttribute("aria-label") ?? ""),
        }))
        .filter((x) => x.ink),
    );
    console.log(label, JSON.stringify(r));
  };
  await bound(a, "A cells bound (A wrote):");
  await bound(b, "B cells bound (A wrote):");
  // and the leave: B goes, A's own ink goes back to the pencil
  await b.close();
  await a.waitForTimeout(2000);
  const afterLeave = await a.evaluate(() => {
    const row = document.querySelector<HTMLElement>(".controls-card .players-roster .player-row");
    const cells = Array.from(document.querySelectorAll<HTMLElement>(".game-cell")).filter((c) =>
      c.style.getPropertyValue("--color-user-ink"),
    ).length;
    return { rowInk: row?.style.getPropertyValue("--color-user-ink") ?? null, cellsBound: cells };
  });
  console.log("A after the peer leaves:", JSON.stringify(afterLeave));
  await ctx.close();
});
