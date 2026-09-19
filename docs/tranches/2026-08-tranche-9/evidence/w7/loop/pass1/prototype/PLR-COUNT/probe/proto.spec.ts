/**
 * PLR-COUNT pass-1 PROTOTYPE probe — the gates, against the patched tree on :4243.
 *
 * P1 geometry (mark box at every N, sheet box, @mbabb unmoved)   G3 · G8 · pi
 * P2 I3 (the head's player button opens [data-lobby])            r0 I3
 * P3 the painted strips (dpr3, both themes) for pixels.mjs       G1 · G2
 * P4 the filter census with the tally boiling + the sheet open   G5
 * P5 the tap floor, coarse, with the per-dimension control       G6
 * P6 F1 as code: 81 cells, 0 ink bindings, solo AND in a room    G4
 * P7 live regions 3 -> 3, .players-roster keeps role=log         G7
 * P8 M19 whole: a third join moves no focus and opens nothing    G9
 * P9 PRM: the draw-in snaps                                      brief
 * P10 the register at N=3 and N=16                               §3.2
 * P11 the crops
 */
import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import fs from "node:fs";

const OUT =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plr1/out";
fs.mkdirSync(OUT, { recursive: true });
const write = (name: string, v: unknown) =>
  fs.writeFileSync(`${OUT}/${name}`, JSON.stringify(v, null, 1));

const PHONE = { width: 390, height: 844 };
const DESK = { width: 1280, height: 800 };

const solo = () => "./?size=3&difficulty=EASY&wire=local";
const room = (r: string) => `./?size=3&difficulty=EASY&wire=local&s=${r}`;

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

/** Drive the roster to N people by speaking for N-1 fakes on the room's own channel. This is
 *  the grammar's own `hi` frame, not a forgery: `onPeer(id,true)` is what every arm calls. */
async function fill(page: Page, roomId: string, n: number) {
  await page.evaluate(
    ({ r, k }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${r}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `probe-peer-${i}` });
    },
    { r: roomId, k: n - 1 },
  );
  await page.waitForTimeout(220);
}

const mark = (p: Page) => p.locator("[data-player-mark]:visible");
const sheet = (p: Page) => p.locator("[data-lobby]:visible");

async function boxOf(p: Page, sel: string) {
  return p.evaluate((s) => {
    const el = [...document.querySelectorAll(s)].find(
      (e) => (e as HTMLElement).offsetParent !== null || getComputedStyle(e).position === "fixed",
    );
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  }, sel);
}

// ── P1 · geometry at every N, both widths ───────────────────────────────────────────────
for (const [name, vp, coarse] of [
  ["phone", PHONE, true],
  ["desk", DESK, false],
] as const) {
  test(`P1 geometry ${name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: vp,
      hasTouch: coarse,
      isMobile: coarse,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const r = `p1${name}`;
    await page.goto(room(r));
    await settled(page);

    const out: Record<string, unknown> = { engine: info.project.name, viewport: vp, coarse };
    out.trigger = await boxOf(page, ".attribution-trigger");
    const widths: Record<number, unknown> = {};
    const labels: Record<number, string> = {};
    for (const n of [1, 2, 3, 4, 5, 6, 7, 12, 16]) {
      if (n > 1) await fill(page, r, n);
      await page.waitForTimeout(120);
      widths[n] = await boxOf(page, "[data-player-mark]");
      labels[n] = (await mark(page).first().getAttribute("aria-label")) ?? "";
    }
    out.markBox = widths;
    out.ariaLabel = labels;
    out.triggerAfter = await boxOf(page, ".attribution-trigger");

    // The sheet, open and SETTLED (the house's 150ms fade; 700ms is the wave's own floor).
    await mark(page).first().click();
    await page.waitForTimeout(700);
    out.sheetN16 = await boxOf(page, "[data-lobby]");
    out.sheetLines = await page.evaluate(() => {
      const el = (() => { const els = [...document.querySelectorAll("[data-lobby]")]; return (els.find((e) => e.getBoundingClientRect().width > 0) ?? els[0] ?? null); })() as HTMLElement | null;
      if (!el) return null;
      return {
        rows: el.querySelectorAll(".pl-row").length,
        more: el.querySelector(".pl-more")?.textContent ?? "",
        scrollH: el.scrollHeight,
        clientH: el.clientHeight,
      };
    });
    out.sheetOpen = await page.evaluate(() => {
      const el = (() => { const els = [...document.querySelectorAll("[data-lobby]")]; return (els.find((e) => e.getBoundingClientRect().width > 0) ?? els[0] ?? null); })() as HTMLElement | null;
      return el
        ? { cls: el.className, transform: getComputedStyle(el).transform, vis: getComputedStyle(el).visibility }
        : null;
    });
    // The incumbent popover on the same line, for the comparison G8 actually needs.
    await page.evaluate(() => {
      const el = [...document.querySelectorAll(".hover-card")].find(
        (e) => (e as HTMLElement).offsetParent !== null,
      ) as HTMLElement | undefined;
      el?.classList.add("is-open");
    });
    await page.waitForTimeout(400);
    out.attributionCard = await boxOf(page, ".hover-card");
    // The board is the UNION of its cells — one honest rect, whatever the wrappers are called.
    out.board = await page.evaluate(() => {
      const rs = [...document.querySelectorAll(".sudoku-cell")].map((c) =>
        c.getBoundingClientRect(),
      );
      if (!rs.length) return null;
      return {
        top: +Math.min(...rs.map((r) => r.top)).toFixed(2),
        left: +Math.min(...rs.map((r) => r.left)).toFixed(2),
        right: +Math.max(...rs.map((r) => r.right)).toFixed(2),
        bottom: +Math.max(...rs.map((r) => r.bottom)).toFixed(2),
      };
    });
    write(`p1-${name}-${info.project.name}.json`, out);
    console.log(`P1|${name}|${info.project.name}|${JSON.stringify(out)}`);
    await ctx.close();
  });
}

// ── P2 · r0 I3, verbatim locator ────────────────────────────────────────────────────────
test("P2 I3 the head carries a player button that opens the lobby", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  await page.goto(room("p2"));
  await settled(page);
  const btn = page.getByRole("button", { name: /player|lobby|who.s (here|on this board)/i });
  const count = await btn.count();
  const box = count ? await btn.first().boundingBox() : null;
  await btn.first().click();
  const open = await page
    .getByRole("dialog")
    .or(page.locator("[data-lobby]"))
    .first()
    .isVisible();
  const out = { engine: info.project.name, candidates: count, box, opens: open };
  write(`p2-i3-${info.project.name}.json`, out);
  console.log(`P2|I3|${JSON.stringify(out)}`);
  expect(count).toBe(1);
  expect(open).toBe(true);
  await ctx.close();
});

// ── P3 · the painted strips, dpr3, both themes ──────────────────────────────────────────
for (const scheme of ["light", "dark"] as const) {
  test(`P3 strips ${scheme}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: PHONE,
      hasTouch: true,
      isMobile: true,
      deviceScaleFactor: 3,
      colorScheme: scheme,
    });
    const page = await ctx.newPage();
    const r = `p3${scheme}`;
    await page.goto(room(r));
    await settled(page);
    for (const n of [1, 2, 3, 4, 5, 6, 7, 12]) {
      if (n > 1) await fill(page, r, n);
      await page.waitForTimeout(150);
      await mark(page)
        .first()
        .screenshot({ path: `${OUT}/strip-${info.project.name}-${scheme}-n${n}.png` });
    }
    // The register's row marks, on the CARD ground, at the same dpr.
    await mark(page).first().click();
    await page.waitForTimeout(700);
    await sheet(page)
      .first()
      .screenshot({ path: `${OUT}/sheet-${info.project.name}-${scheme}.png` });
    await ctx.close();
  });
}

// ── P4 · the filter census, tally boiling + sheet open ──────────────────────────────────
for (const [name, vp, coarse] of [
  ["row", DESK, false],
  ["coarse", PHONE, true],
] as const) {
  test(`P4 filter census ${name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: vp,
      hasTouch: coarse,
      isMobile: coarse,
    });
    const page = await ctx.newPage();
    const r = `p4${name}`;
    await page.goto(room(r));
    await settled(page);
    await fill(page, r, 4);
    await mark(page).first().click();
    await page.waitForTimeout(900); // the sheet settles, the boil keeps running
    const hits = await page.evaluate(() =>
      [...document.querySelectorAll("*")]
        .filter((el) => {
          const cs = getComputedStyle(el);
          return cs.filter && cs.filter !== "none" && cs.display !== "none";
        })
        .map((el) => `${el.tagName.toLowerCase()}.${(el.getAttribute("class") ?? "").trim()}`),
    );
    const out = { engine: info.project.name, regime: name, count: hits.length, hits };
    write(`p4-census-${name}-${info.project.name}.json`, out);
    console.log(`P4|${name}|${info.project.name}|count=${hits.length}`);
    await ctx.close();
  });
}

// ── P5 · the tap floor, with its per-dimension negative control ─────────────────────────
test("P5 tap floor", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: PHONE,
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await page.goto(room("p5"));
  await settled(page);
  const armed = await boxOf(page, "[data-player-mark]");
  const control = await page.evaluate(() => {
    const el = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement;
    el.style.minWidth = "40px";
    el.style.minHeight = "40px";
    const r = el.getBoundingClientRect();
    return { w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
  });
  const out = { engine: info.project.name, armed, control };
  write(`p5-tap-${info.project.name}.json`, out);
  console.log(`P5|tap|${JSON.stringify(out)}`);
  expect(armed!.w).toBeGreaterThanOrEqual(44);
  expect(armed!.h).toBeGreaterThanOrEqual(44);
  expect(control.w).toBeLessThan(44);
  await ctx.close();
});

// ── P6 · F1 as code: the board is byte-identical solo and in a room ─────────────────────
test("P6 F1 the board keeps its blue", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const read = async (page: Page) =>
    page.evaluate(() => {
      const cells = [...document.querySelectorAll(".sudoku-cell")];
      const bound = cells.filter((c) =>
        (c.getAttribute("style") ?? "").includes("--color-user-ink"),
      ).length;
      return {
        cells: cells.length,
        bound,
        userInk: getComputedStyle(document.documentElement)
          .getPropertyValue("--color-user-ink")
          .trim(),
      };
    });
  const a = await ctx.newPage();
  await a.goto(solo());
  await settled(a);
  const aloneRead = await read(a);
  const b = await ctx.newPage();
  await b.goto(room("p6"));
  await settled(b);
  await fill(b, "p6", 4);
  const roomRead = await read(b);
  const out = { engine: info.project.name, solo: aloneRead, inRoom: roomRead };
  write(`p6-f1-${info.project.name}.json`, out);
  console.log(`P6|F1|${JSON.stringify(out)}`);
  expect(aloneRead.bound).toBe(0);
  expect(roomRead.bound).toBe(0);
  await ctx.close();
});

// ── P7 · the live-region census and the log's role ──────────────────────────────────────
test("P7 live regions", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  await page.goto(room("p7"));
  await settled(page);
  await fill(page, "p7", 3);
  const out = await page.evaluate(() => {
    const regions = [...document.querySelectorAll("[aria-live], [role=log], [role=status]")].map(
      (e) => ({
        cls: (e.getAttribute("class") ?? "").trim(),
        role: e.getAttribute("role"),
        live: e.getAttribute("aria-live"),
        tabindex: e.getAttribute("tabindex"),
        rect: (() => {
          const r = e.getBoundingClientRect();
          return { w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
        })(),
      }),
    );
    const well = document.querySelector(".tray-well, .players-well");
    return {
      regions,
      count: regions.length,
      wellHeight: well ? +well.getBoundingClientRect().height.toFixed(1) : null,
    };
  });
  write(`p7-regions-${info.project.name}.json`, { engine: info.project.name, ...out });
  console.log(`P7|regions|${info.project.name}|${JSON.stringify(out)}`);
  await ctx.close();
});

// ── P8 · M19 whole: a third join moves no focus and opens nothing ───────────────────────
test("P8 M19", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: DESK });
  const page = await ctx.newPage();
  await page.goto(room("p8"));
  await settled(page);
  await fill(page, "p8", 2);
  await mark(page).first().focus();
  const before = await page.evaluate(() => ({
    active: (document.activeElement as HTMLElement)?.className ?? "",
    tag: document.activeElement?.tagName ?? "",
    isMark: (document.activeElement as HTMLElement)?.hasAttribute?.("data-player-mark") ?? false,
    label:
      [...document.querySelectorAll("[data-player-mark]")]
        .find((e) => e.getBoundingClientRect().width > 0)
        ?.getAttribute("aria-label") ?? "",
    open: [...document.querySelectorAll("[data-lobby].is-open")].some(e=>e.getBoundingClientRect().width>0),
  }));
  await fill(page, "p8", 3);
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => ({
    active: (document.activeElement as HTMLElement)?.className ?? "",
    tag: document.activeElement?.tagName ?? "",
    isMark: (document.activeElement as HTMLElement)?.hasAttribute?.("data-player-mark") ?? false,
    label:
      [...document.querySelectorAll("[data-player-mark]")]
        .find((e) => e.getBoundingClientRect().width > 0)
        ?.getAttribute("aria-label") ?? "",
    open: [...document.querySelectorAll("[data-lobby].is-open")].some(e=>e.getBoundingClientRect().width>0),
  }));
  const out = { engine: info.project.name, before, after };
  write(`p8-m19-${info.project.name}.json`, out);
  console.log(`P8|M19|${JSON.stringify(out)}`);
  expect(after.active).toBe(before.active);
  expect(after.open).toBe(false);
  expect(after.label).not.toBe(before.label);
  await ctx.close();
});

// ── P9 · PRM: the draw-in snaps within a frame of a join ────────────────────────────────
test("P9 PRM snap", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: DESK,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(room("p9"));
  await settled(page);
  await page.evaluate(() => {
    const w = window as unknown as { __ch?: BroadcastChannel };
    w.__ch ??= new BroadcastChannel("board:p9");
    w.__ch.postMessage({ kind: "hi", data: {}, from: "probe-peer-0" });
  });
  await page.waitForTimeout(40); // roughly two frames: the swap, and nothing after it
  const offsets = await page.evaluate(() =>
    [...document.querySelectorAll("[data-player-mark] path")].map((p) =>
      p.getAttribute("stroke-dashoffset"),
    ),
  );
  const out = { engine: info.project.name, offsets };
  write(`p9-prm-${info.project.name}.json`, out);
  console.log(`P9|PRM|${JSON.stringify(out)}`);
  await ctx.close();
});

// ── P10 · the register at N=3 and N=16 ──────────────────────────────────────────────────
test("P10 register", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: PHONE,
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  const r = "p10";
  await page.goto(room(r));
  await settled(page);
  const readings: Record<string, unknown> = {};
  for (const n of [3, 16]) {
    await fill(page, r, n);
    if (n === 3) {
      // One peer quiet since before the sheet opened: the qualifier's whole condition.
      await page.evaluate(async () => {
        const m = await import("/src/games/shared/useSession.ts");
        (m as unknown as { lastHeard: Record<string, number> }).lastHeard["probe-peer-0"] =
          Date.now() - 26000;
      });
    }
    await mark(page).first().click();
    await page.waitForTimeout(700);
    readings[`n${n}`] = await page.evaluate(() => {
      const el = (() => { const els = [...document.querySelectorAll("[data-lobby]")]; return (els.find((e) => e.getBoundingClientRect().width > 0) ?? els[0] ?? null); })() as HTMLElement;
      const r0 = el.getBoundingClientRect();
      return {
        box: {
          x: +r0.x.toFixed(2),
          y: +r0.y.toFixed(2),
          w: +r0.width.toFixed(2),
          h: +r0.height.toFixed(2),
          right: +r0.right.toFixed(2),
          bottom: +r0.bottom.toFixed(2),
        },
        state: el.querySelector(".pl-state")?.textContent ?? "",
        rows: [...el.querySelectorAll(".pl-row")].map((li) => ({
          name: li.querySelector(".pl-name")?.textContent ?? "",
          qual: li.querySelector(".pl-qualifier")?.textContent ?? "",
          nameW: +(li.querySelector(".pl-name") as HTMLElement).getBoundingClientRect()
            .width.toFixed(2),
          markInk: getComputedStyle(li.querySelector(".pl-row-mark path")!).stroke,
          gap: (() => {
            const nm = (li.querySelector(".pl-name") as HTMLElement)?.getBoundingClientRect();
            const q = (li.querySelector(".pl-qualifier") as HTMLElement)?.getBoundingClientRect();
            return nm && q ? +(q.left - nm.right).toFixed(2) : null;
          })(),
        })),
        more: el.querySelector(".pl-more")?.textContent ?? "",
        lines: el.querySelectorAll(".pl-row").length + 1 + (el.querySelector(".pl-more") ? 1 : 0),
        scroll: { scrollH: el.scrollHeight, clientH: el.clientHeight },
      };
    });
    await page.keyboard.press("Escape").catch(() => {});
    await page.mouse.click(300, 700);
    await page.waitForTimeout(250);
  }
  write(`p10-register-${info.project.name}.json`, { engine: info.project.name, ...readings });
  console.log(`P10|register|${info.project.name}|${JSON.stringify(readings)}`);
  await ctx.close();
});

// ── P11 · the crops ────────────────────────────────────────────────────────────────────
test("P11 crops", async ({ browser }, info) => {
  if (info.project.name !== "chromium") test.skip();
  const shots = async (ctx: BrowserContext, tag: string, vp: { width: number; height: number }) => {
    const page = await ctx.newPage();
    const r = `crop${tag}`;
    await page.goto(room(r));
    await settled(page);
    for (const n of [1, 3, 6, 7]) {
      if (n > 1) await fill(page, r, n);
      await page.waitForTimeout(200);
      await page.screenshot({
        path: `${OUT}/crop-${tag}-n${n}.png`,
        clip: { x: 0, y: 0, width: vp.width, height: 56 },
      });
    }
    return page;
  };
  const light = await browser.newContext({
    viewport: PHONE,
    hasTouch: true,
    isMobile: true,
    colorScheme: "light",
  });
  await shots(light, "390-light", PHONE);
  await light.close();

  const dark = await browser.newContext({ viewport: DESK, colorScheme: "dark" });
  const dp = await dark.newPage();
  await dp.goto(room("cropdark"));
  await settled(dp);
  await fill(dp, "cropdark", 3);
  await dp.waitForTimeout(250);
  await dp.screenshot({
    path: `${OUT}/crop-1280-dark-n3.png`,
    clip: { x: 0, y: 0, width: 420, height: 70 },
  });
  await dark.close();

  const reg = await browser.newContext({
    viewport: PHONE,
    hasTouch: true,
    isMobile: true,
    colorScheme: "light",
  });
  for (const n of [3, 16]) {
    const p = await reg.newPage();
    const r = `regcrop${n}`;
    await p.goto(room(r));
    await settled(p);
    await fill(p, r, n);
    await p.locator("[data-player-mark]:visible").first().click();
    await p.waitForTimeout(700);
    await p.screenshot({
      path: `${OUT}/crop-register-390-n${n}.png`,
      clip: { x: 0, y: 0, width: 300, height: 260 },
    });
    await p.close();
  }
  await reg.close();
});
