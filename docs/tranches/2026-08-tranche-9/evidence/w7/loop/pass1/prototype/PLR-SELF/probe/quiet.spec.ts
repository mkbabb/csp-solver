/**
 * The qualifier, on the clock the session actually keeps, and r0's I3 with ONE adjustment.
 *
 * I3-adjusted: r0's row verbatim except the lobby locator, which the head's TWO attribution
 * instances (desk + mobile, both always in the DOM since T6.2) make strict-mode ambiguous. The
 * adjustment is `:visible`, nothing else — the same class of correction the research lane found
 * on the same instrument's name regex, one step later in the row.
 */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}

test("I3-adjusted — the mark in the head opens the lobby", async ({ browser }, info) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  const mark = a.getByRole("button", {
    name: /player|lobby|who.s (here|on this board)/i,
  });
  console.log(`I3ADJ|candidates=${await mark.count()}`);
  await expect(mark).toHaveCount(1);
  const box = await mark.first().boundingBox();
  await mark.first().click();
  await a.waitForTimeout(260);
  const lobby = a.locator("[data-lobby]:visible");
  await expect(lobby, "pressing it opens the lobby").toBeVisible();
  console.log(
    `I3ADJ|${JSON.stringify({ engine: info.project.name, box, lobbies: await a.locator("[data-lobby]").count(), visible: await lobby.count() })}`,
  );
  await ctx.close();
});

test("the qualifier says how long a peer has been quiet — read at the open, never ticking", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  await a.waitForTimeout(500);
  const room = new URL(a.url()).searchParams.get("s")!;
  await a.evaluate((r) => {
    const ch = new BroadcastChannel(`board:${r}`);
    ch.postMessage({ kind: "hi", data: {}, from: "synth-quiet" });
    ch.close();
  }, room);
  await a.waitForTimeout(250);
  const open = async () => {
    await a.locator("[data-player-mark]:visible").click();
    await a.waitForTimeout(260);
    const rows = await a.evaluate(() =>
      [...document.querySelectorAll("[data-lobby] .lobby-row")]
        .slice(0, 2)
        .map((e) => ({
          name: e.querySelector(".lobby-name")?.textContent ?? "",
          qualifier: e.querySelector(".lobby-qualifier")?.textContent ?? "",
        })),
    );
    await a.locator("[data-player-mark]:visible").click();
    await a.waitForTimeout(200);
    return rows;
  };
  const fresh = await open();
  // PRESENCE_QUIET_MS is 20s; the beat is 15s, but a synthetic peer never beats again.
  await a.waitForTimeout(21000);
  const aged = await open();
  console.log(`QUIET|${JSON.stringify({ engine: info.project.name, fresh, aged })}`);
  expect(fresh[0].qualifier, "your own row says `you`").toBe("you");
  expect(fresh[1].qualifier, "a peer heard a moment ago says nothing").toBe("");
  expect(aged[1].qualifier, "a peer past the quiet threshold says how long").toMatch(
    /^2[0-9] seconds ago$/,
  );
  await ctx.close();
});
