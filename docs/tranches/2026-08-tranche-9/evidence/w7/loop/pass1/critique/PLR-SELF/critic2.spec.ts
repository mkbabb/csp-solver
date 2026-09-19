/** PLR-SELF pass-1 CRITIC probe, round 2 — the mechanism behind round 1's readings. */
import { test, expect, type Page } from "@playwright/test";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const say = (o: unknown) => console.log(`CRITIC2|${JSON.stringify(o)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function invite(page: Page) {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  if (!(await verb.isVisible())) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700);
  }
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
}
async function addPeers(page: Page, n: number, from = 1) {
  const room = new URL(page.url()).searchParams.get("s")!;
  await page.evaluate(
    ({ room, n, from }) => {
      const ch = new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < n; i++)
        ch.postMessage({ kind: "hi", data: {}, from: `synth-${from + i}` });
      ch.close();
    },
    { room, n, from },
  );
  await page.waitForTimeout(400);
}
const probe = (page: Page) =>
  page.evaluate(() => {
    const painted = (sel: string) =>
      [...document.querySelectorAll(sel)].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement | null;
    const m = painted("[data-player-mark]");
    const lobby = m?.parentElement?.querySelector("[data-lobby]") as HTMLElement | null;
    return {
      color: m ? getComputedStyle(m).color : null,
      hover: m?.matches(":hover") ?? null,
      focusVisible: m?.matches(":focus-visible") ?? null,
      focus: m?.matches(":focus") ?? null,
      expanded: m?.getAttribute("aria-expanded") ?? null,
      vis: lobby ? getComputedStyle(lobby).visibility : null,
    };
  });

test("E · why the live mark reads graphite while its sheet is open", async ({ page }) => {
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 2);
  say({ case: "before", ...(await probe(page)) });
  const mark = page.locator("[data-player-mark]").filter({ visible: true }).first();
  await mark.click();
  await page.waitForTimeout(400);
  say({ case: "after-mouse-open", ...(await probe(page)) });
  await page.mouse.move(600, 600);
  await page.waitForTimeout(400);
  say({ case: "pointer-parked-away", ...(await probe(page)) });
  // and the keyboard path: Space-open with focus on the mark
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.waitForTimeout(200);
  say({ case: "blurred", ...(await probe(page)) });
});

test("F · the incumbent @mbabb trigger under the same Enter", async ({ page }) => {
  await page.goto(SOLO);
  await settled(page);
  const read = () =>
    page.evaluate(() => {
      const painted = (sel: string) =>
        [...document.querySelectorAll(sel)].find(
          (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
        ) as HTMLElement | null;
      const t = painted(".attribution-trigger");
      const card = t?.parentElement?.querySelector(".hover-card") as HTMLElement | null;
      return {
        expanded: t?.getAttribute("aria-expanded") ?? null,
        cardVis: card ? getComputedStyle(card).visibility : null,
        focused: document.activeElement?.className ?? null,
      };
    });
  await page.evaluate(() => {
    const t = [...document.querySelectorAll(".attribution-trigger")].find(
      (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
    ) as HTMLElement;
    t.focus();
  });
  await page.waitForTimeout(300);
  say({ case: "mbabb-focused", ...(await read()) });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  say({ case: "mbabb-after-enter", ...(await read()) });
});

test("G · dark arm: AA on the sheet, painted bytes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 4);
  await page.locator("[data-player-mark]").filter({ visible: true }).first().click();
  await page.waitForTimeout(700);
  const out = await page.evaluate(() => {
    const painted = (sel: string) =>
      [...document.querySelectorAll(sel)].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement | null;
    const m = painted("[data-player-mark]");
    const lobby = m?.parentElement?.querySelector("[data-lobby]") as HTMLElement | null;
    const cv = document.createElement("canvas");
    cv.width = cv.height = 8;
    const cx = cv.getContext("2d", { willReadFrequently: true })!;
    const bytes = (layers: string[]) => {
      cx.clearRect(0, 0, 8, 8);
      for (const l of layers) {
        cx.fillStyle = l;
        cx.fillRect(0, 0, 8, 8);
      }
      const d = cx.getImageData(4, 4, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
    const lum = (c: number[]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    };
    const ratio = (a: number[], b: number[]) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
      return +((x + 0.05) / (y + 0.05)).toFixed(2);
    };
    const resolve = (css: string) => {
      const p = document.createElement("div");
      p.style.color = css;
      document.body.appendChild(p);
      const c = getComputedStyle(p).color;
      p.remove();
      return c;
    };
    const cs = getComputedStyle(document.documentElement);
    const bg = cs.getPropertyValue("--color-background").trim();
    const popover = cs.getPropertyValue("--color-popover").trim();
    const card = cs.getPropertyValue("--color-card").trim();
    const overBg = [resolve(bg), resolve(`color-mix(in srgb, ${popover} 80%, transparent)`)];
    const overCard = [resolve(card), resolve(`color-mix(in srgb, ${popover} 80%, transparent)`)];
    const gB = bytes(overBg);
    const gC = bytes(overCard);
    const rows = lobby ? [...lobby.querySelectorAll(".lobby-row")] : [];
    const aa = rows.map((r) => {
      const n = r.querySelector(".lobby-name") as HTMLElement;
      const ink = getComputedStyle(n).color;
      return { text: n.textContent, ink, onBg: ratio(bytes([...overBg, ink]), gB), onCard: ratio(bytes([...overCard, ink]), gC) };
    });
    const quiet = resolve(cs.getPropertyValue("--ink-press-quiet").trim());
    // Also: the whole first-16 walk, synthesised from the peer-ink tokens.
    const L = cs.getPropertyValue("--peer-ink-l").trim();
    const walk: Record<number, { onBg: number; onCard: number }> = {};
    for (let i = 0; i < 16; i++) {
      const h = (i * 137.5) % 360;
      const ink = resolve(`oklch(${L} 0.11 ${h})`);
      walk[i] = { onBg: ratio(bytes([...overBg, ink]), gB), onCard: ratio(bytes([...overCard, ink]), gC) };
    }
    return {
      theme: cs.getPropertyValue("--color-background").trim(),
      peerInkL: L,
      aa,
      quietOnBg: ratio(bytes([...overBg, quiet]), gB),
      walk,
      markColor: m ? getComputedStyle(m).color : null,
    };
  });
  say({ case: "dark", ...out });
});

test("H · pi: the deck's roster echo with a live room (press g for the gallery)", async ({ page }) => {
  await page.goto(SOLO);
  await settled(page);
  await invite(page);
  await addPeers(page, 2);
  const boardSwatch = await page.evaluate(() => {
    const r = [...document.querySelectorAll(".players-roster .player-row")].map((e) => ({
      style: (e as HTMLElement).getAttribute("style"),
      swatchBg: getComputedStyle(e.querySelector(".player-swatch")!).backgroundColor,
      name: e.querySelector(".player-name")?.textContent,
      self: !!e.querySelector(".player-self"),
    }));
    return r;
  });
  say({ case: "roster-rows", boardSwatch });
  await page.keyboard.press("g");
  await page.waitForTimeout(1200);
  const out = await page.evaluate(() => {
    const sw = [...document.querySelectorAll(".game-card-swatch")].map((e) => ({
      style: (e as HTMLElement).getAttribute("style"),
      parentStyle: (e.parentElement as HTMLElement)?.getAttribute("style"),
      bg: getComputedStyle(e).backgroundColor,
    }));
    const painted = (sel: string) =>
      [...document.querySelectorAll(sel)].find(
        (e) => (e as HTMLElement).getBoundingClientRect().width > 0,
      ) as HTMLElement | null;
    const m = painted("[data-player-mark]");
    return {
      gallery: !!document.querySelector(".game-gallery, .gallery-deck, [class*=gallery]"),
      swatchCount: sw.length,
      swatches: sw,
      markPainted: !!m,
      markColor: m ? getComputedStyle(m).color : null,
      markLabel: m?.getAttribute("aria-label") ?? null,
    };
  });
  say({ case: "gallery-deck", ...out });
});
