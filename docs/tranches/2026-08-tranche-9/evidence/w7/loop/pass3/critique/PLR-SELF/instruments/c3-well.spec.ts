/**
 * C6 — the 64px the roster gives back: WHAT moves inside the controls card, priced against the
 * HEAD control (74a2b5d9). The lane declares "the well goes 284.2 × 109 → 284.2 × 45, and the
 * 64px is the controls card's" and banks no row naming what travelled. This is that row.
 */
import { expect, test, type Page } from "@playwright/test";
import { DESK, SOLO, addPeers, invite, say, settled } from "./harness";

const HEAD = "http://127.0.0.1:4239";

async function cardParts(page: Page) {
  return page.evaluate(() => {
    const card = document.querySelector(".controls-card");
    const well = [...document.querySelectorAll(".tray-well")].find((w) =>
      w.querySelector(".players-roster"),
    );
    const b = (e: Element | null | undefined) => {
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { y: +r.y.toFixed(1), h: +r.height.toFixed(1), w: +r.width.toFixed(1) };
    };
    const kids = card
      ? [...card.querySelectorAll(":scope > *, :scope > * > *")]
          .slice(0, 40)
          .map((e) => ({
            cls: (e.className || "").toString().split(" ").slice(0, 2).join("."),
            ...b(e)!,
          }))
          .filter((k) => k.h > 0)
      : [];
    return {
      card: b(card),
      well: b(well),
      scrollH: (card as HTMLElement | null)?.scrollHeight ?? null,
      clientH: (card as HTMLElement | null)?.clientHeight ?? null,
      kids,
    };
  });
}

test("C6 — the 64px, named", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const a = await ctx.newPage();
  await a.goto(SOLO);
  await settled(a);
  await invite(a);
  await addPeers(a, 4);
  await a.waitForTimeout(700);
  const proto = await cardParts(a);

  const b = await ctx.newPage();
  await b.goto(`${HEAD}/${SOLO.replace("./", "")}`);
  await settled(b);
  await invite(b);
  await addPeers(b, 4);
  await b.waitForTimeout(700);
  const head = await cardParts(b);

  const moved = proto.kids
    .map((k) => {
      const h = head.kids.find((x) => x.cls === k.cls);
      return h ? { cls: k.cls, dy: +(k.y - h.y).toFixed(1), dh: +(k.h - h.h).toFixed(1) } : null;
    })
    .filter((m) => m && (m.dy || m.dh));
  say({ c: "C6", proto: { card: proto.card, well: proto.well, scrollH: proto.scrollH, clientH: proto.clientH }, head: { card: head.card, well: head.well, scrollH: head.scrollH, clientH: head.clientH }, moved });
  expect(proto.card).not.toBeNull();
  await ctx.close();
});
