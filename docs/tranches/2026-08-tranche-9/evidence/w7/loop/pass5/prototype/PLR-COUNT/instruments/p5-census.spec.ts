/**
 * PLR-COUNT pass 5 — the censuses. An INSTRUMENT: every test banks a reading and asserts only
 * that its arms were comparable (same given-set, witnessed regime). Numbers are the README's.
 *
 *   PROTO_DIST   this tree's built dist            CONTROL_DIST  w7-control dist (74a2b5d9)
 *   PROTO_DEV    this tree on dev (room rows)      CONTROL_DEV   w7-control on dev (room rows)
 *
 * ONE BOARD: each test mints `?board=` from the CONTROL's own deal — toBase64Url("\x01" + "3." +
 * 81 cells) — and every arm reads back the same given-set (cells labelled `given clue N`).
 * NOISE: every π reading has a control-vs-control arm on the same build.
 */
import { test, expect, type Browser, type BrowserContextOptions, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";

const PD = process.env.PROTO_DIST!;
const CD = process.env.CONTROL_DIST!;
const PV = process.env.PROTO_DEV!;
const CV = process.env.CONTROL_DEV!;
const OUT = process.env.OUT!;
mkdirSync(OUT, { recursive: true });
const bank = (name: string, data: unknown) =>
  writeFileSync(`${OUT}/${name}`, JSON.stringify(data, null, 1));

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function stable(read: () => Promise<unknown>) {
  let last: unknown = Symbol("unread");
  await expect
    .poll(
      async () => {
        const v = JSON.stringify(await read());
        const same = v === last;
        last = v;
        return same;
      },
      { intervals: [200], timeout: 10000 },
    )
    .toBe(true);
}
const givens = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => /given clue (\d)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? "0")
      .join(""),
  );
async function mint(browser: Browser, base: string): Promise<string> {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${base}/?size=3&difficulty=EASY`);
  await settled(page);
  const cells = await givens(page);
  await ctx.close();
  const b64 = Buffer.from("\x01" + "3." + cells, "binary").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
let cursor = 0;
async function peers(page: Page, room: string, k: number) {
  if (k <= 0) return;
  const from = cursor;
  cursor += k;
  const before = await page.locator(".players-roster .player-row").count();
  await page.evaluate(
    ({ room, k, from }) => {
      const ch = new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++) ch.postMessage({ kind: "hi", data: {}, from: `cen-${from + i}` });
      setTimeout(() => ch.close(), 0);
    },
    { room, k, from },
  );
  await expect
    .poll(() => page.locator(".players-roster .player-row").count(), { timeout: 15000 })
    .toBe(Math.max(before, 1) + k);
}
async function toDark(page: Page) {
  await page.getByRole("button", { name: "Switch to dark mode" }).first().click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains("dark")))
    .toBe(true);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.mouse.move(640, 790);
  await stable(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor));
}
const regime = (page: Page) =>
  page.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    band: matchMedia("(orientation: portrait) and (max-height: 799px)").matches,
    dark: document.documentElement.classList.contains("dark"),
  }));

// ── π: computed PAINT properties + tag + rect, every element of each selector ─────────────
const PI_KEYS = [
  ".corner-left",
  ".mobile-attribution",
  ".attribution-trigger",
  ".hover-card",
  "svg.handwritten-logo",
  ".corner-right",
  ".masthead",
  ".controls-card",
  ".control-panel-wrap",
  ".board-wrapper",
  ".drawer-tab",
  ".sudoku-cell",
  ".players-roster",
];
const PROPS = [
  "display", "visibility", "opacity", "color", "backgroundColor", "borderTopWidth",
  "borderTopStyle", "borderTopColor", "outlineStyle", "fontFamily", "fontSize", "fontWeight",
  "lineHeight", "letterSpacing", "filter", "boxShadow", "paddingTop", "transform",
] as const;
const piRead = (page: Page) =>
  page.evaluate(
    ({ keys, props }) => {
      const out: Record<string, unknown> = {};
      for (const k of keys) {
        [...document.querySelectorAll(k)].slice(0, 8).forEach((el, i) => {
          const b = el.getBoundingClientRect();
          const cs = getComputedStyle(el) as unknown as Record<string, string>;
          const rec: Record<string, unknown> = {
            tag: el.tagName,
            rect: [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)),
          };
          for (const p of props) rec[p] = cs[p];
          out[`${k}#${i}`] = rec;
        });
      }
      return out;
    },
    { keys: PI_KEYS, props: PROPS as unknown as string[] },
  );
function differ(a: Record<string, any>, b: Record<string, any>) {
  const rows: string[] = [];
  for (const el of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[el];
    const y = b[el];
    if (!x || !y) {
      rows.push(`${el}: ${x ? "only-control" : "only-proto"}`);
      continue;
    }
    for (const key of Object.keys(x))
      if (JSON.stringify(x[key]) !== JSON.stringify(y[key]))
        rows.push(`${el} ${key}: ${JSON.stringify(x[key])} -> ${JSON.stringify(y[key])}`);
  }
  return rows;
}

type Cell = { name: string; opts: BrowserContextOptions };
const CELLS: Cell[] = [
  { name: "desk-1280x800-fine", opts: { viewport: { width: 1280, height: 800 } } },
  { name: "phone-390x844-coarse", opts: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
  { name: "land-844x390-coarse", opts: { viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true } },
  { name: "land-812x375-coarse", opts: { viewport: { width: 812, height: 375 }, hasTouch: true, isMobile: true } },
];

test("pi dist-vs-dist with a noise arm, light and dark, shut and card-open", async ({ browser, browserName }) => {
  test.setTimeout(600000);
  const payload = await mint(browser, CD);
  const res: Record<string, unknown> = { payload: payload.slice(0, 24) + "…" };
  for (const cell of CELLS)
    for (const theme of ["light", "dark"] as const) {
      const reads: Record<string, { shut: any; open: any; givens: string; regime: any }> = {};
      for (const [arm, base] of [["control", CD], ["proto", PD], ["control2", CD]] as const) {
        const ctx = await browser.newContext(cell.opts);
        const page = await ctx.newPage();
        await page.goto(`${base}/?size=3&board=${payload}`);
        await settled(page);
        if (theme === "dark") await toDark(page);
        await stable(() => piRead(page));
        const shut = await piRead(page);
        // DRIVE the @mbabb card open by its own gesture (hover fine; tap coarse)
        const trig = page.locator(".attribution-trigger:visible").first();
        if (cell.opts.hasTouch) await trig.tap();
        else await trig.hover();
        await stable(() => piRead(page));
        const open = await piRead(page);
        reads[arm] = { shut, open, givens: await givens(page), regime: await regime(page) };
        await ctx.close();
      }
      expect(reads.proto.givens).toBe(reads.control.givens);
      expect(reads.control2.givens).toBe(reads.control.givens);
      res[`${cell.name}/${theme}`] = {
        regime: { control: reads.control.regime, proto: reads.proto.regime },
        givensN: reads.control.givens.replace(/0/g, "").length,
        noise: { shut: differ(reads.control.shut, reads.control2.shut), open: differ(reads.control.open, reads.control2.open) },
        proto: { shut: differ(reads.control.shut, reads.proto.shut), open: differ(reads.control.open, reads.proto.open) },
      };
    }
  bank(`pi-dist-${browserName}.json`, res);
});

// ── room π + live regions, DEV vs DEV (`?wire=local` is DEV-only) ──────────────────────────
test("room pi and live regions, dev-vs-dev, a stated room", async ({ browser, browserName }) => {
  test.setTimeout(300000);
  const payload = await mint(browser, CV);
  const liveRead = (page: Page) =>
    page.evaluate(() =>
      [...document.querySelectorAll("[aria-live], [role=log], [role=status], [role=alert]")].map(
        (e) =>
          `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join(".")}` +
          `[${e.getAttribute("role") ?? ""}|${e.getAttribute("aria-live") ?? ""}]` +
          (e.classList.contains("sr-only") ? "{sr-only}" : ""),
      ),
    );
  const reads: Record<string, any> = {};
  for (const [arm, base] of [["control", CV], ["proto", PV], ["control2", CV]] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    const room = `cen-room-${arm}-${Date.now()}`;
    await page.goto(`${base}/?size=3&board=${payload}&wire=local&s=${room}`);
    await settled(page);
    const solo = await liveRead(page);
    await peers(page, room, 2);
    await stable(() => piRead(page));
    reads[arm] = { pi: await piRead(page), solo, room3: await liveRead(page), givens: await givens(page) };
    await page.goto(`${base}/?view=gallery`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await stable(() => liveRead(page));
    reads[arm].deck = await liveRead(page);
    await ctx.close();
  }
  expect(reads.proto.givens).toBe(reads.control.givens);
  bank(`room-dev-${browserName}.json`, {
    room: "you + 2 local-wire peers (cen-*), desk 1280x800 fine, light",
    noise: differ(reads.control.pi, reads.control2.pi),
    proto: differ(reads.control.pi, reads.proto.pi),
    live: Object.fromEntries(
      Object.entries(reads).map(([k, v]) => [k, { solo: v.solo, room3: v.room3, deck: v.deck }]),
    ),
  });
});

// ── the filter census, BOTH themes (the estate's counting rule: own filter, own display) ──
const filterCount = (page: Page) =>
  page.evaluate(() => {
    const hits = [...document.querySelectorAll("*")].filter((el) => {
      const cs = getComputedStyle(el);
      return cs.filter !== "none" && cs.display !== "none";
    });
    return {
      n: hits.length,
      inMark: hits.filter((e) => e.closest("[data-player-mark], [data-lobby]")).length,
      ids: [...new Set(hits.map((e) => getComputedStyle(e).filter))].sort(),
    };
  });
test("filters, both themes: dist solo (shut / sheet open) and dev room of five, sheet open", async ({ browser, browserName }) => {
  test.setTimeout(900000);
  const out: Record<string, unknown> = {};
  for (const [label, arms, room] of [
    ["dist-solo", [["control", CD], ["proto", PD]], false],
    ["dev-room5", [["control", CV], ["proto", PV]], true],
  ] as const)
    for (const theme of ["light", "dark"] as const)
      for (const prm of [false, true]) {
        const row: Record<string, unknown> = {};
        for (const [arm, base] of arms) {
          const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: prm ? "reduce" : "no-preference" });
          const page = await ctx.newPage();
          const s = `cen-f-${arm}-${Date.now()}`;
          await page.goto(`${base}/?size=3&difficulty=EASY${room ? `&wire=local&s=${s}` : ""}`);
          await settled(page);
          if (theme === "dark") await toDark(page);
          if (room) await peers(page, s, 4);
          await stable(() => page.evaluate(() => document.querySelectorAll("[style*=filter], [filter]").length));
          const shut = await filterCount(page);
          const m = page.locator("[data-player-mark]:visible").first();
          let open: unknown = "no mark";
          if (await m.count()) {
            await m.click();
            const lobby = page.locator("[data-lobby]:visible").first();
            await stable(() => lobby.evaluate((e) => [e.getBoundingClientRect().height, getComputedStyle(e).opacity]));
            open = await filterCount(page);
          }
          row[arm] = { shut, open, label: (await m.count()) ? await m.getAttribute("aria-label", { timeout: 3000 }) : null };
          await ctx.close();
        }
        out[`${label}/${theme}/${prm ? "prm" : "motion"}`] = row;
        bank(`filters-${browserName}.json`, out);
      }
  bank(`filters-${browserName}.json`, out);
});

// ── W2 §2.2's landscape cell: the card, the wells' reach, the sheet's lap (dev, a room of 7) ─
const cardRead = (page: Page) =>
  page.evaluate(() => {
    const card = document.querySelector(".controls-card") as HTMLElement | null;
    if (!card) return null;
    const max = card.scrollHeight - card.clientHeight;
    const wells = [...card.querySelectorAll(".tray-well")].map((well) => {
      const tag = well.querySelector(".washi-tag");
      const name = (tag?.textContent ?? "").trim() || "(untagged)";
      // REACHED = scrolled as far as the card allows toward this well, its tape is wholly in view
      card.scrollTop = 0;
      const c0 = card.getBoundingClientRect();
      const w0 = well.getBoundingClientRect();
      card.scrollTop = Math.max(0, Math.min(max, w0.top - c0.top));
      const c = card.getBoundingClientRect();
      const g = (tag ?? well).getBoundingClientRect();
      const inView = g.top >= c.top - 0.5 && g.bottom <= c.bottom + 0.5;
      return { name, h: +w0.height.toFixed(2), reachable: inView, scrollTop: card.scrollTop };
    });
    card.scrollTop = 0;
    return { clientHeight: card.clientHeight, scrollHeight: card.scrollHeight, max, wells };
  });
test("landscape cells: the card and its wells, the mark, the sheet's lap, both arms", async ({ browser, browserName }) => {
  test.setTimeout(300000);
  const payload = await mint(browser, CV);
  const out: Record<string, unknown> = { payload: payload.slice(0, 24) + "…" };
  for (const vp of [{ width: 844, height: 390 }, { width: 812, height: 375 }])
    for (const [arm, base] of [["control", CV], ["proto", PV]] as const) {
      const ctx = await browser.newContext({ viewport: vp, hasTouch: true, isMobile: true });
      const page = await ctx.newPage();
      const room = `cen-land-${arm}-${Date.now()}`;
      await page.goto(`${base}/?size=3&board=${payload}&wire=local&s=${room}`);
      await settled(page);
      await peers(page, room, 6);
      await stable(() => cardRead(page));
      const card = await cardRead(page);
      const mark = page.locator("[data-player-mark]:visible").first();
      let sheet: unknown = "no mark";
      if (await mark.count()) {
        const hit = await mark.evaluate((m) => {
          const b = m.getBoundingClientRect();
          const e = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
          return { box: [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)), hitsSelf: !!e && m.contains(e) };
        });
        await mark.tap();
        const lobby = page.locator("[data-lobby]:visible").first();
        await stable(() => lobby.evaluate((e) => e.getBoundingClientRect().height));
        sheet = {
          markHit: hit,
          ...(await lobby.evaluate((s) => {
            const b = s.getBoundingClientRect();
            const lapped = [...document.querySelectorAll(".sudoku-cell")].filter((c) => {
              const r = c.getBoundingClientRect();
              return r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top;
            }).length;
            return {
              rows: s.querySelectorAll(".pl-row").length,
              more: s.querySelector(".pl-more")?.textContent?.trim() ?? "",
              box: [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)),
              lapped,
            };
          })),
        };
      }
      out[`${vp.width}x${vp.height}/${arm}`] = { regime: await regime(page), card, sheet };
      await ctx.close();
    }
  bank(`landscape-${browserName}.json`, out);
});

// ── INCIDENT 2, bounded: the 1…6 ladder ten times, the label traced at every step ──────────
test("the ladder ten times: does a room ever read solo mid-ladder", async ({ browser, browserName }) => {
  test.setTimeout(600000);
  const runs: unknown[] = [];
  let collapses = 0;
  for (let r = 0; r < 10; r++) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    const room = `cen-ladder-${r}-${Date.now()}`;
    await page.goto(`${PV}/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    const t0 = Date.now();
    const trace: string[] = [];
    for (let n = 1; n <= 5; n++) {
      await peers(page, room, 1);
      // hold each step as long as pass 4's census did (~0.9 s + the crop), reading the label
      for (let i = 0; i < 4; i++) {
        trace.push(`${n + 1}:${await page.locator("[data-player-mark]:visible").first().getAttribute("aria-label")}`);
        await page.waitForTimeout(400); // sleep-ok: the elapsed time IS the subject, a room held for 8 s
      }
    }
    const bad = trace.filter((s) => s.split(":")[0] !== String(parseInt(s.split(":")[1], 10)));
    if (bad.length) collapses++;
    runs.push({ r, ms: Date.now() - t0, bad });
    await ctx.close();
  }
  bank(`ladder-${browserName}.json`, { runs: 10, collapses, detail: runs });
});

// ── the @mbabb hover region, re-priced on the HeadSheet tree (desk, dist) ──────────────────
test("hover region", async ({ browser, browserName }) => {
  const payload = await mint(browser, CD);
  const out: Record<string, unknown> = {};
  let box: { x: number; y: number; w: number; h: number } | null = null;
  for (const [arm, base] of [["control", CD], ["proto", PD]] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${base}/?size=3&board=${payload}`);
    await settled(page);
    const r = await page.evaluate((headBox) => {
      const trig = document.querySelector(".attribution-trigger")!;
      const owner = trig.closest(".attribution-disclosure") ?? trig.closest(".corner-left")!;
      const o = owner.getBoundingClientRect();
      const cl = document.querySelector(".corner-left")!.getBoundingClientRect();
      const b = headBox ?? { x: cl.x, y: cl.y, w: cl.width, h: cl.height };
      let hits = 0;
      const stray: Record<string, number> = {};
      for (let y = b.y + 1; y < b.y + b.h; y += 2)
        for (let x = b.x + 1; x < b.x + b.w; x += 2) {
          const e = document.elementFromPoint(x, y);
          if (e && owner.contains(e)) hits++;
          else {
            const k = e ? `${e.tagName.toLowerCase()}.${[...e.classList].slice(0, 2).join(".")}` : "null";
            stray[k] = (stray[k] ?? 0) + 1;
          }
        }
      return { owner: [o.x, o.y, o.width, o.height].map((v) => +v.toFixed(2)), hits, px2: hits * 4, stray, b };
    }, box);
    if (!box) box = r.b;
    out[arm] = r;
    await ctx.close();
  }
  bank(`hover-region-${browserName}.json`, out);
});
