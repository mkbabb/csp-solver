/**
 * PLR-PLACE · PROBE 5 — I3 UNDER THE OVERLAY.
 *
 * `r0/r5-player-mark/instruments.spec.ts` I3 is RED at HEAD, both engines (0 candidates,
 * re-run on this tree). Its assertions are copied here VERBATIM — role + accessible name,
 * x < 200, y < 120, and a press that opens the lobby — and run against the family's own
 * prototype mark, mounted with `proto/mount-miniature.js` and a `<dialog>`-less disclosure in
 * the estate's own shape (`AttributionCard`'s: a button in the head's left corner whose press
 * shows a card hung off `--head-rule`).
 *
 * This is not a cure. It is the family's claim, made checkable: if the shape I3 asks for
 * cannot be built out of the wire's own facts without a product patch, the family has a
 * substrate problem and not a design one.
 *
 * M19 rides it: the mark opens on the READER's press. A peer arriving moves no focus and
 * opens nothing — asserted below by driving a join while focus sits on the board.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const HOME = process.env.PLC_HOME || join(__dirname, "..");
const PROTO = join(HOME, "proto", "mount-miniature.js");
const OUT = join(HOME, "logs");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);

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

test("I3 under the overlay — the mark is in the head and its press opens the lobby", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(a.locator(".controls-card .players-roster .player-row")).toHaveCount(2);

  await a.addScriptTag({ path: PROTO });

  // The overlay: one button in the head's left corner, one card it discloses. Every string
  // is the roster's own (M16, R6 law 33 — one name per act) and lowercase (Patrick Hand's
  // cut; no `j`, no `x` in the hand face).
  await a.evaluate(async () => {
    const m = (await import(
      /* @vite-ignore */ "/src/games/shared/useSession.ts"
    )) as {
      peerCursors: { value: Record<string, number | null> };
      session: { players: { value: Array<{ slug: string; self: boolean }> } };
    };
    const players = m.session.players.value;
    const cur = m.peerCursors.value;

    document.querySelector("#plc-head")?.remove();
    const host = document.createElement("div");
    host.id = "plc-head";
    host.style.cssText =
      "position:fixed;top:var(--head-rule, 0.75rem);left:88px;z-index:41;";
    const btn = document.createElement("button");
    btn.type = "button";
    // The accessible name says the COUNT and nothing the roster does not already say (R6
    // law 32, counts not feelings; law 33, one name per act — so it is NOT the roster's own
    // `who's on this board`, which already names the log). Solo takes the product's own
    // sentence rather than "1 player".
    btn.setAttribute(
      "aria-label",
      players.length > 1
        ? `${players.length} players on this board`
        : "players on this board, just you",
    );
    btn.setAttribute("aria-expanded", "false");
    btn.style.cssText =
      "min-width:2.75rem;min-height:2.75rem;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:none;padding:0;cursor:pointer;";
    const card = document.createElement("div");
    card.setAttribute("data-lobby", "");
    card.hidden = true;
    card.style.cssText =
      "position:absolute;top:100%;left:0;width:256px;padding:16px;border-radius:16px;background:var(--color-popover);border:2px solid color-mix(in srgb, var(--color-border) 30%, transparent);font-family:var(--font-hand);";
    const list = document.createElement("ul");
    list.style.cssText = "list-style:none;margin:0;padding:0;";
    for (const p of players) {
      const li = document.createElement("li");
      li.textContent = p.self ? `${p.slug} you` : p.slug;
      list.appendChild(li);
    }
    card.appendChild(list);
    btn.addEventListener("click", () => {
      card.hidden = !card.hidden;
      btn.setAttribute("aria-expanded", String(!card.hidden));
    });
    host.appendChild(btn);
    host.appendChild(card);
    document.body.appendChild(host);

    await (
      window as unknown as { __PLC: { mount: (o: unknown) => Promise<HTMLElement> } }
    ).__PLC.mount({
      size: 24,
      boardSize: 9,
      strokeUnits: 12,
      dotUnits: (1000 / 9) * 0.32,
      peers: Object.entries(cur).map(([, pos], i) => ({ index: i + 1, pos })),
      host: btn,
    });
  });

  // ── I3's own assertions, unchanged ────────────────────────────────────────────────────
  const mark = a.getByRole("button", {
    name: /player|lobby|who.s (here|on this board)/i,
  });
  const candidates = await mark.count();
  say("I3.candidates", candidates);
  expect(mark, "a player mark lives in the head").toHaveCount(1);
  const box = await mark.first().boundingBox();
  say("I3.box", box);
  expect(box!.x, "it is in the LEFT of the head").toBeLessThan(200);
  expect(box!.y, "it is in the head, not the card").toBeLessThan(120);
  await mark.first().click();
  await expect(
    a.getByRole("dialog").or(a.locator("[data-lobby]")),
    "pressing it opens the lobby",
  ).toBeVisible();
  say("I3.verdict", "GREEN under the overlay");

  // ── M19: a peer arriving moves no focus and opens nothing ─────────────────────────────
  await a.evaluate(() => {
    (document.querySelector("[data-lobby]") as HTMLElement).hidden = true;
  });
  await a.locator(".sudoku-cell").first().click();
  const focusBefore = await a.evaluate(
    () => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName,
  );
  const c = await ctx.newPage();
  await c.goto(link);
  await settled(c);
  await a.waitForTimeout(1500);
  const focusAfter = await a.evaluate(
    () => document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName,
  );
  const lobbyOpen = await a.evaluate(
    () => !(document.querySelector("[data-lobby]") as HTMLElement).hidden,
  );
  say("M19", { focusBefore, focusAfter, moved: focusBefore !== focusAfter, lobbyOpen });
  expect(focusAfter, "a peer arriving moves no focus").toBe(focusBefore);
  expect(lobbyOpen, "a peer arriving opens nothing").toBe(false);

  // ── W3's live-region idiom: the head must not mint a second region ────────────────────
  const regions = await a.evaluate(() =>
    [...document.querySelectorAll("[aria-live], [role=log], [role=status], [role=alert]")].map(
      (e) => ({
        cls: (e.getAttribute("class") || "").split(" ")[0],
        role: e.getAttribute("role"),
        live: e.getAttribute("aria-live"),
        label: e.getAttribute("aria-label"),
        text: (e.textContent || "").trim().slice(0, 60),
      }),
    ),
  );
  say("liveRegions", regions);

  mkdirSync(OUT, { recursive: true });
  writeFileSync(
    join(OUT, `i3-${info.project.name}.json`),
    JSON.stringify({ engine: info.project.name, candidates, box, regions }, null, 1),
  );
  await ctx.close();
});
