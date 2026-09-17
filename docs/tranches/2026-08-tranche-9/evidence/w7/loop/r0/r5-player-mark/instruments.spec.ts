/**
 * R5 BORN-RED INSTRUMENTS — the player mark's substrate, written before any cure.
 *
 * Every row here asserts the LAW T9-M14 asks for, against the product at HEAD. All four are
 * expected RED. They live in the lane's evidence dir, run off the estate (the lane's own
 * scratch config, 127.0.0.1:4231), and touch no product file.
 *
 *   I2  a player's own colour is the colour the room sees            RED at HEAD
 *   I3  the top-left carries a player mark that opens a lobby        RED at HEAD
 *   I4  an agreed ink index is never reassigned                      RED at HEAD
 *   I5  a live identity claim is never handed to a second page       RED at HEAD
 */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
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
const roster = (p: Page) => p.locator(".controls-card .players-roster .player-row");
const swatchOf = (p: Page, slug: string) =>
  p.evaluate((s) => {
    const li = [...document.querySelectorAll(".controls-card .players-roster .player-row")].find(
      (e) => e.querySelector(".player-name")?.textContent?.trim() === s,
    );
    return li
      ? getComputedStyle(li.querySelector(".player-swatch")!).backgroundColor
      : "(no row)";
  }, slug);
const selfSlug = (p: Page) =>
  p.evaluate(
    () =>
      document
        .querySelector(".controls-card .players-roster .player-row:has(.player-self) .player-name")
        ?.textContent?.trim() ?? "",
  );

test("I2 — a player's own colour is the colour the room sees", async ({ browser }) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(roster(a)).toHaveCount(2);

  const aSlug = await selfSlug(a);
  const mine = await swatchOf(a, aSlug); // what A paints for A
  const theirs = await swatchOf(b, aSlug); // what B paints for A
  console.log(`R5-I2|self=${mine}|room=${theirs}`);
  // T9-M14: "each player should have a unique colour". A colour that is one thing on your
  // screen and another on everybody else's is not a player's colour; it is a page's.
  expect(mine, "the player's own swatch must be the colour the room sees").toBe(theirs);
  await ctx.close();
});

test("I3 — the top-left carries a player mark that opens a lobby", async ({ browser }) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  await expect(roster(a)).toHaveCount(1);

  // The mark: a control in the head's left corner that is NOT the attribution trigger, that
  // carries a colour while the session is live, and whose press opens a surface naming the
  // players. Addressed by role + accessible name so the instrument survives any chrome.
  const mark = a.getByRole("button", { name: /player|lobby|who.s (here|on this board)/i });
  console.log(`R5-I3|candidates=${await mark.count()}`);
  await expect(mark, "a player mark lives in the head").toHaveCount(1);
  const box = await mark.first().boundingBox();
  expect(box!.x, "it is in the LEFT of the head").toBeLessThan(200);
  expect(box!.y, "it is in the head, not the card").toBeLessThan(120);
  await mark.first().click();
  await expect(
    a.getByRole("dialog").or(a.locator("[data-lobby]")),
    "pressing it opens the lobby",
  ).toBeVisible();
  await ctx.close();
});

test("I4 — an agreed ink index is never reassigned", async ({ browser }) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const room = new URL(link).searchParams.get("s")!;

  // Capture the room's own `st` — the frame that CARRIES the agreed assignment.
  await a.evaluate((r) => {
    const w = window as any;
    w.__st = null;
    const ch = new BroadcastChannel(`board:${r}`);
    w.__ch = ch;
    ch.onmessage = (ev: MessageEvent) => {
      if (ev.data?.kind === "st") w.__st = ev.data.data;
    };
  }, room);

  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(roster(a)).toHaveCount(2);

  const bSlug = await b.evaluate(
    () =>
      document
        .querySelector(".controls-card .players-roster .player-row:has(.player-self) .player-name")
        ?.textContent?.trim() ?? "",
  );
  const before = await swatchOf(a, bSlug);

  // A rival `st` — the SAME board, a newer epoch, and the assignment swapped. This is not a
  // forgery of anything the grammar forbids: it is exactly the frame a peer publishes when it
  // deals before it has adopted the room's own `k` (useSession.publishBoard → sendState).
  const sent = await a.evaluate(() => {
    const w = window as any;
    const st = w.__st;
    if (!st) return "no st captured";
    const ids = Object.keys(st.k ?? {});
    if (ids.length < 2) return "k held fewer than two ids";
    // Shifted, not swapped: the two pages publish MIRRORED `k`s (each one's own id at 0), so a
    // swap of whichever frame landed last can reproduce the other page's assignment exactly and
    // prove nothing. +5 puts every id on an index neither page has ever held.
    const swapped: Record<string, number> = {};
    ids.forEach((id) => (swapped[id] = st.k[id] + 5));
    w.__ch.postMessage({
      kind: "st",
      from: "zzzz-rival",
      data: { ...st, e: 1_000_000, ea: "zzzz-rival", k: swapped },
    });
    return JSON.stringify({ was: st.k, now: swapped });
  });
  console.log(`R5-I4|${sent}`);
  await a.waitForTimeout(500);
  const after = await swatchOf(a, bSlug);
  console.log(`R5-I4|before=${before}|after=${after}`);
  // playerIdentity.ts's own claim: "the index is never reassigned — which is the whole of why
  // a rejoiner cannot arrive to find somebody else in their colour."
  expect(after, "an agreed index survives a rival assignment").toBe(before);
  await ctx.close();
});

test("I5 — a live identity claim is never handed to a second page", async ({ browser }) => {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await p.goto(SOLO);
  await settled(p);
  const out = await p.evaluate(async () => {
    const m = await import("/src/games/shared/playerIdentity.ts");
    const KEY = "session-identity-v1";
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    const live: string[] = [];
    // Nine live pages, each in its own room, none released — one more than IDENTITY_CAP.
    for (let i = 0; i < 9; i++) {
      sessionStorage.removeItem(KEY); // a fresh tab has no per-tab half
      live.push(m.claimIdentity(`live-${i}`));
    }
    sessionStorage.removeItem(KEY);
    const tenth = m.claimIdentity("live-0"); // a tenth page opens the FIRST page's room
    return { first: live[0], tenth, collided: tenth === live[0] };
  });
  console.log(`R5-I5|${JSON.stringify(out)}`);
  // playerIdentity.ts §THE BINDING: "a second tab that finds the binding claimed mints fresh".
  // Two pages under one peer id filter each other out as self — a room of one, twice.
  expect(out.collided, "a claimed id is never re-issued to a second page").toBe(false);
  await ctx.close();
});
