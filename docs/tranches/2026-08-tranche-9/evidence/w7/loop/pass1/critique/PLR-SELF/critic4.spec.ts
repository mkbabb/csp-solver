/** CRITIC round 4 — the face, the well's remains, and the one claim in one scene. */
import { test, expect, type Page } from "@playwright/test";
const SOLO = "./?size=3&difficulty=EASY&wire=local";
const say = (o: unknown) => console.log(`CRITIC4|${JSON.stringify(o)}`);
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page) {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  if (!(await verb.isVisible())) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700);
  }
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
}
async function addPeers(page: Page, n: number) {
  const room = new URL(page.url()).searchParams.get("s")!;
  await page.evaluate(
    ({ room, n }) => {
      const ch = new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < n; i++) ch.postMessage({ kind: "hi", data: {}, from: `synth-${i + 1}` });
      ch.close();
    },
    { room, n },
  );
  await page.waitForTimeout(500);
}

test("J · the face, the well, and mark-ink == self-row-ink in ONE scene", async ({ page }) => {
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 3);
  await expect
    .poll(async () =>
      page.evaluate(
        () =>
          ([...document.querySelectorAll("[data-player-mark]")].find(
            (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
          ) as HTMLElement | null)?.getAttribute("aria-label") ?? "",
      ),
    )
    .toContain("3 other players");
  await page.locator("[data-player-mark]").filter({ visible: true }).first().click();
  await page.waitForTimeout(700);
  await page.mouse.move(900, 700); // park the pointer OFF the mark: no hover lift
  await page.waitForTimeout(600);
  const out = await page.evaluate(() => {
    const painted = (sel: string) =>
      [...document.querySelectorAll(sel)].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement | null;
    const m = painted("[data-player-mark]");
    const lobby = m?.parentElement?.querySelector("[data-lobby]") as HTMLElement | null;
    const rows = lobby ? [...lobby.querySelectorAll(".lobby-row")] : [];
    const selfRow = rows.find((r) => r.querySelector(".lobby-qualifier")?.textContent === "you");
    const stub = m?.querySelector("svg");
    const well = painted(".players-well");
    const wellVisible = well
      ? [...well.querySelectorAll("*")]
          .filter((e) => {
            const r = e.getBoundingClientRect();
            const cs = getComputedStyle(e);
            return r.width > 2 && r.height > 2 && cs.visibility !== "hidden";
          })
          .map((e) => `${e.tagName.toLowerCase()}.${(e.className || "").toString().split(" ")[0]}`)
      : null;
    const cs = (e: Element | null) => (e ? getComputedStyle(e) : null);
    return {
      rowCount: rows.length,
      markLabel: m?.getAttribute("aria-label") ?? null,
      markLive: m?.classList.contains("is-live") ?? null,
      markInlineStyle: m?.getAttribute("style") ?? null,
      stateFont: cs(lobby?.querySelector(".lobby-state") ?? null)?.fontFamily ?? null,
      nameFont: cs(rows[0]?.querySelector(".lobby-name") ?? null)?.fontFamily ?? null,
      stateSize: cs(lobby?.querySelector(".lobby-state") ?? null)?.fontSize ?? null,
      nameSize: cs(rows[0]?.querySelector(".lobby-name") ?? null)?.fontSize ?? null,
      markColor: m ? getComputedStyle(m).color : null,
      markHover: m?.matches(":hover") ?? null,
      selfRowColor: selfRow ? getComputedStyle(selfRow.querySelector(".lobby-name")!).color : null,
      selfRowName: selfRow?.querySelector(".lobby-name")?.textContent ?? null,
      stubFill: stub ? getComputedStyle(stub.querySelector("path")!).fill : null,
      stubBox: stub ? stub.getBoundingClientRect().width + "x" + stub.getBoundingClientRect().height : null,
      wellRect: well
        ? (() => {
            const r = well.getBoundingClientRect();
            return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
          })()
        : null,
      wellVisible,
      rosterClass: document.querySelector(".players-roster")?.className ?? null,
      rosterRole: document.querySelector(".players-roster")?.getAttribute("role") ?? null,
      rosterTab: document.querySelector(".players-roster")?.getAttribute("tabindex") ?? null,
    };
  });
  say({ case: "one-scene", ...out });
});
