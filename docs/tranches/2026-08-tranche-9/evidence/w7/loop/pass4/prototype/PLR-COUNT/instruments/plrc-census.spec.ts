/**
 * PLR-COUNT pass-4 — the censuses and the strips. An INSTRUMENT, not an estate spec: every row
 * writes crops or a reading and asserts only what it measured. Lane server 4242 (this tree),
 * HEAD control 4230 (`w7-control`, 74a2b5d9, dist `index-CubiZsMVSwTc.js`).
 *
 * BOTH ARMS DEAL ONE BOARD: `?board=` is the app's own codec payload (chair's addendum), minted
 * as toBase64Url("\x01" + "3." + <81 cells>) — the classic 530070000… grid — and every π row
 * reads cell 0's given on both pages to prove it decoded.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const PROTO = "http://127.0.0.1:4242";
const CONTROL = "http://127.0.0.1:4230";
const BOARD =
  "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const OUT = process.env.PLRC_OUT!;
const CROPS = process.env.PLRC_CROPS!;
mkdirSync(OUT, { recursive: true });
const bank = (name: string, data: unknown) =>
  writeFileSync(`${OUT}/${name}`, JSON.stringify(data, null, 1));

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(600);
}

let cursor = 0;
async function peers(page: Page, room: string, k: number) {
  if (k <= 0) return;
  const from = cursor;
  cursor += k;
  await page.evaluate(
    ({ room, k, from }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `cen-${from + i}` });
    },
    { room, k, from },
  );
  await page.waitForTimeout(900);
}

const visibleMark = (page: Page) =>
  page.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement | undefined;
    if (!m) return null;
    const b = m.getBoundingClientRect();
    return { x: b.x, y: b.y, w: b.width, h: b.height };
  });

async function toDark(page: Page) {
  // the estate's own control, then the focus handed back so no ring rides a crop
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains("dark")))
    .toBe(true);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.mouse.move(5, 700);
  await page.waitForTimeout(500);
}

// ── THE STRIP: N = 1…6 at 390 coarse, dpr 3, both themes, plus the ablated rung ────────────
for (const theme of ["light", "dark"] as const) {
  test.describe(`strip ${theme}`, () => {
    test.use({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 3,
    });
    test(`strip ${theme}`, async ({ page, browserName }) => {
      const room = `cen-strip-${theme}-${Date.now()}`;
      await page.goto(`${PROTO}/?size=3&board=${BOARD}&wire=local&s=${room}`);
      await settled(page);
      if (theme === "dark") await toDark(page);
      const regime = await page.evaluate(() => ({
        coarse: matchMedia("(pointer: coarse)").matches,
        dpr: devicePixelRatio,
        dark: document.documentElement.classList.contains("dark"),
      }));
      expect(regime.coarse).toBe(true);
      const dir = `${CROPS}/${browserName}-${theme}`;
      mkdirSync(dir, { recursive: true });
      const boxes: Record<string, unknown> = {};
      let at = 1;
      // the crop is FIXED: the widest mark (N=5) plus a margin, so every N is read on one frame
      for (const N of [1, 2, 3, 4, 5, 6]) {
        await peers(page, room, N - at);
        at = N;
        await page.waitForTimeout(700); // the draw-in is ~280ms + stagger; read the rest pose
        const m = await visibleMark(page);
        boxes[N] = m;
        boxes[`label${N}`] = await page.evaluate(() => ({
          label: [...document.querySelectorAll("[data-player-mark]")]
            .map((e) => e.getAttribute("aria-label"))
            .join("|"),
          url: location.search.slice(0, 60),
          t: Math.round(performance.now()),
        }));
        await page.screenshot({
          path: `${dir}/N${N}.png`,
          clip: { x: m!.x - 4, y: m!.y - 4, width: 82, height: m!.h + 8 },
        });
      }
      // THE ABLATION, SAME PAGE: the numeral at the subheading rung pass 2 shipped
      await page.addStyleTag({
        content: ".pt-count { font-size: var(--type-subheading) !important; }",
      });
      await page.waitForTimeout(200);
      const m6 = await visibleMark(page);
      await page.screenshot({
        path: `${dir}/N6-subheading.png`,
        clip: { x: m6!.x - 4, y: m6!.y - 4, width: 82, height: m6!.h + 8 },
      });
      // THE OTHER ARM, SAME PAGE: the numeral at pass 3's heading rung (25.888px)
      await page.addStyleTag({
        content: ".pt-count { font-size: var(--type-heading) !important; }",
      });
      await page.waitForTimeout(200);
      const m6t = await visibleMark(page);
      boxes["6-heading"] = m6t;
      boxes["6-subheading"] = m6;
      await page.screenshot({
        path: `${dir}/N6-heading.png`,
        clip: { x: m6t!.x - 4, y: m6t!.y - 4, width: 82, height: m6t!.h + 8 },
      });
      bank(`strip-${browserName}-${theme}.json`, { regime, boxes });
    });
  });
}

// ── THE SHEET'S ROW STROKES, painted, both themes (G2's sheet half) ────────────────────────
for (const theme of ["light", "dark"] as const) {
  test.describe(`rows ${theme}`, () => {
    test.use({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 3 });
    test(`rows ${theme}`, async ({ page, browserName }) => {
      const room = `cen-rows-${theme}-${Date.now()}`;
      await page.goto(`${PROTO}/?size=3&board=${BOARD}&wire=local&s=${room}`);
      await settled(page);
      if (theme === "dark") await toDark(page);
      await peers(page, room, 3);
      await page.locator("[data-player-mark]:visible").first().click();
      await page.waitForTimeout(400);
      const rows = await page.evaluate(() => {
        const sheet = [...document.querySelectorAll("[data-lobby]")].find(
          (e) => e.getBoundingClientRect().width > 0,
        )!;
        return [...sheet.querySelectorAll(".pl-row")].map((r) => {
          const s = r.querySelector(".pl-stub")!.getBoundingClientRect();
          return { x: s.x, y: s.y, w: s.width, h: s.height };
        });
      });
      const dir = `${CROPS}/${browserName}-${theme}`;
      mkdirSync(dir, { recursive: true });
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        await page.screenshot({
          path: `${dir}/row${i}.png`,
          clip: { x: r.x - 5, y: r.y - 2, width: r.w + 10, height: r.h + 4 },
        });
      }
      bank(`rows-${browserName}-${theme}.json`, rows);
    });
  });
}

// ── π: computed PAINT properties + tag names against the HEAD control, one board ───────────
const PI_KEYS = [
  ".corner-left",
  ".mobile-attribution",
  ".attribution-trigger",
  "svg.handwritten-logo",
  ".corner-right",
  ".controls-card",
  ".board-wrapper",
  ".drawer-tab",
  ".masthead",
  ".sudoku-cell",
];
const piRead = (page: Page) =>
  page.evaluate((keys) => {
    const out: Record<string, unknown> = {};
    for (const k of keys) {
      const el = [...document.querySelectorAll(k)].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement | undefined;
      if (!el) {
        out[k] = null;
        continue;
      }
      const b = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      out[k] = {
        tag: el.tagName,
        rect: [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)),
        color: cs.color,
        bg: cs.backgroundColor,
        font: `${cs.fontFamily.slice(0, 40)}|${cs.fontSize}|${cs.lineHeight}|${cs.fontWeight}`,
      };
    }
    const cell0 = document.querySelector(".sudoku-cell input") as HTMLInputElement | null;
    out.cell0 = cell0?.value ?? null;
    out.boardParam = new URL(location.href).searchParams.get("board") !== null;
    out.regime = {
      coarse: matchMedia("(pointer: coarse)").matches,
      hover: matchMedia("(hover: hover)").matches,
    };
    return out;
  }, PI_KEYS);

async function piScene(
  browser: Browser,
  opts: { viewport: { width: number; height: number }; hasTouch?: boolean; isMobile?: boolean },
  roomOf?: number,
) {
  const ctx = await browser.newContext(opts);
  const res: Record<string, Record<string, unknown>> = {};
  for (const [arm, base] of [
    ["control", CONTROL],
    ["proto", PROTO],
  ] as const) {
    const page = await ctx.newPage();
    const room = `cen-pi-${arm}-${Date.now()}`;
    const q = roomOf ? `&wire=local&s=${room}` : "";
    await page.goto(`${base}/?size=3&board=${BOARD}${q}`);
    await settled(page);
    if (roomOf) await peers(page, room, roomOf - 1);
    res[arm] = await piRead(page);
  }
  await ctx.close();
  const diff: Record<string, unknown> = {};
  for (const k of PI_KEYS) {
    const a = res.control[k] as Record<string, unknown> | null;
    const b = res.proto[k] as Record<string, unknown> | null;
    if (JSON.stringify(a) !== JSON.stringify(b)) diff[k] = { control: a, proto: b };
  }
  return {
    witnessed: { control: res.control.regime, proto: res.proto.regime },
    cell0: { control: res.control.cell0, proto: res.proto.cell0 },
    boardParam: { control: res.control.boardParam, proto: res.proto.boardParam },
    differing: Object.keys(diff),
    diff,
  };
}

test("pi against the HEAD control", async ({ browser, browserName }) => {
  test.setTimeout(240000);
  const scenes = {
    deskSolo: await piScene(browser, { viewport: { width: 1280, height: 800 } }),
    deskRoom3: await piScene(browser, { viewport: { width: 1280, height: 800 } }, 3),
    deskRoom6: await piScene(browser, { viewport: { width: 1280, height: 800 } }, 6),
    phoneSolo: await piScene(browser, {
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    }),
    landscape844: await piScene(browser, {
      viewport: { width: 844, height: 390 },
      hasTouch: true,
      isMobile: true,
    }),
  };
  bank(`pi-${browserName}.json`, scenes);
});

// ── the live-region census, in DOM order, both trees ───────────────────────────────────────
test("live regions", async ({ browser, browserName }) => {
  test.setTimeout(180000);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const read = (page: Page) =>
    page.evaluate(() =>
      [...document.querySelectorAll("[aria-live], [role=log], [role=status], [role=alert]")].map(
        (e) =>
          `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join(".")}` +
          `[${e.getAttribute("role") ?? ""}|${e.getAttribute("aria-live") ?? ""}]`,
      ),
    );
  const out: Record<string, unknown> = {};
  for (const [arm, base] of [
    ["control", CONTROL],
    ["proto", PROTO],
  ] as const) {
    const page = await ctx.newPage();
    const room = `cen-live-${arm}-${Date.now()}`;
    await page.goto(`${base}/?size=3&board=${BOARD}&wire=local&s=${room}`);
    await settled(page);
    const solo = await read(page);
    await peers(page, room, 2);
    const room3 = await read(page);
    await page.goto(`${base}/?view=gallery`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForTimeout(1200);
    const deck = await read(page);
    out[arm] = { solo, room3, deck, counts: [solo.length, room3.length, deck.length] };
  }
  await ctx.close();
  bank(`live-regions-${browserName}.json`, out);
});

// ── the @mbabb hover region, priced over the HEAD's own .corner-left box ────────────────────
test("hover region", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const out: Record<string, unknown> = {};
  let headBox: { x: number; y: number; w: number; h: number } | null = null;
  for (const [arm, base, owner] of [
    ["control", CONTROL, ".corner-left"],
    ["proto", PROTO, ".attribution-disclosure"],
  ] as const) {
    const page = await ctx.newPage();
    await page.goto(`${base}/?size=3&board=${BOARD}`);
    await settled(page);
    const r = await page.evaluate(
      ({ owner, headBox }) => {
        const o = document.querySelector(owner)!.getBoundingClientRect();
        const cl = document.querySelector(".corner-left")!.getBoundingClientRect();
        const box = headBox ?? { x: cl.x, y: cl.y, w: cl.width, h: cl.height };
        // sweep a box 60px wider than the HEAD's corner, so the proto's mark is inside it
        let inOwner = 0;
        let n = 0;
        const stray: Record<string, number> = {};
        for (let y = box.y + 1; y < box.y + box.h; y += 2)
          for (let x = box.x + 1; x < box.x + box.w + 60; x += 2) {
            n++;
            const e = document.elementFromPoint(x, y);
            if (e && e.closest(owner)) inOwner++;
            else if (x >= o.x && x < o.x + o.width && y >= o.y && y < o.y + o.height) {
              const k = e ? `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join(".")}` : "null";
              stray[k] = (stray[k] ?? 0) + 1;
            }
          }
        return {
          owner: [o.x, o.y, o.width, o.height].map((v) => +v.toFixed(2)),
          corner: [cl.x, cl.y, cl.width, cl.height].map((v) => +v.toFixed(2)),
          sweptPoints: n,
          hitsOwner: inOwner,
          ownerAreaPx2: +(inOwner * 4).toFixed(0),
          strayInsideOwnerRect: stray,
          box,
        };
      },
      { owner, headBox },
    );
    if (!headBox) headBox = r.box;
    out[arm] = r;
  }
  await ctx.close();
  bank(`hover-region-${browserName}.json`, out);
});
