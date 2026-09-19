/**
 * PLR-COUNT · PASS-2 RESEARCH PROBE — the numbers pass 1 never took.
 *
 * Read-only on the product: every reading is off the pass-1 worktree served as-is
 * (`wf_e58b4764-0fc-47`, 127.0.0.1:4242). Nothing in src/, e2e/ or scripts/ is touched and no
 * product file is patched; the in-page mutations below are `page.evaluate` overlays used to
 * READ a ground, and they are reverted in the same evaluate.
 *
 *  A · the width table, re-cut at its citation (the spec's is 1.16px off at every N)
 *  B · the sheet's REAL ground — the wordmark bleeding through the 80% pose — at N=16
 *  C · the desk bound (G8): the board's top-left box, the sheet's line arithmetic, per-regime ROWS
 *  D · the counting rule, measured across glyph / name / rows / compression
 *  E · the tally before any game exists (at `/`)
 *  F · the hover ink lift and the 6 <-> 7 swap (head-line step)
 *  G · the focusout seam (PLR-PLACE's graft) on THIS mark
 *  H · the filter census with the tally boiling and the sheet open, N=16
 *  I · positional identity: what a DEPARTURE does to whose ink is whose stroke
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(__dirname, "..", "readings");
fs.mkdirSync(OUT, { recursive: true });
const bank = (name: string, engine: string, data: unknown) => {
  fs.writeFileSync(
    path.join(OUT, `${name}-${engine}.json`),
    JSON.stringify(data, null, 1),
  );
  console.log(`${name}|${engine}|${JSON.stringify(data)}`);
};

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

/**
 * k MORE synthetic peers into the room, by the wire's own `hi` frame. The ids run from a
 * monotone cursor, never from 0 — re-sending `probe-peer-0` is a re-beat from somebody already
 * at the table, not an arrival, and a probe that restarts the ids grows the room by one and
 * then stops (measured: N stuck at 2 for every step of the first run).
 */
let peerCursor = 0;
async function peers(page: Page, room: string, k: number) {
  if (k <= 0) return;
  const from = peerCursor;
  peerCursor += k;
  await page.evaluate(
    ({ room, k, from }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (let i = 0; i < k; i++)
        w.__ch.postMessage({ kind: "hi", data: {}, from: `probe-peer-${from + i}` });
    },
    { room, k, from },
  );
  await page.waitForTimeout(900);
}

const markBox = (p: Page) =>
  p.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement | undefined;
    if (!m) return null;
    const r = m.getBoundingClientRect();
    const svg = m.querySelector("svg.pt-marks") as SVGElement | null;
    const cnt = m.querySelector(".pt-count") as HTMLElement | null;
    return {
      x: +r.x.toFixed(2),
      y: +r.y.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      name: m.getAttribute("aria-label"),
      glyph: cnt?.textContent?.trim() ?? null,
      viewBox: svg?.getAttribute("viewBox") ?? null,
      strokes: m.querySelectorAll(".pt-pose.is-active path").length,
      padding: getComputedStyle(m).padding,
    };
  });

// ── A · the width table ────────────────────────────────────────────────────────────────────
test("A width table, phone coarse, N=1..8", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  const room = "r2a";
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  const rows: unknown[] = [];
  let have = 1;
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8]) {
    await peers(page, room, n - have);
    have = n;
    await page.waitForTimeout(400);
    rows.push({ n, ...(await markBox(page)) });
  }
  // the band the head has left, re-derived here
  const band = await page.evaluate(() => {
    const vis = (sel: string) =>
      [...document.querySelectorAll(sel)].find((e) => e.getBoundingClientRect().width > 0) as
        | HTMLElement
        | undefined;
    const trig = vis(".attribution-trigger");
    const sun = vis(".corner-right");
    const t = trig?.getBoundingClientRect();
    const s = sun?.getBoundingClientRect();
    return {
      trigger: t ? { x: +t.x.toFixed(2), w: +t.width.toFixed(2), h: +t.height.toFixed(2) } : null,
      sunX: s ? +s.x.toFixed(2) : null,
      free: t && s ? +(s.x - (t.x + t.width)).toFixed(2) : null,
      rootFontSize: getComputedStyle(document.documentElement).fontSize,
      tapFloor: getComputedStyle(document.documentElement).getPropertyValue("--tap-floor"),
    };
  });
  bank("a-width", info.project.name, { rows, band });
  await ctx.close();
});

// ── B · the sheet's real ground ────────────────────────────────────────────────────────────
test("B the sheet's real ground at N=16", async ({ browser }, info) => {
  for (const scheme of ["light", "dark"] as const) {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
      colorScheme: scheme,
      deviceScaleFactor: 3,
    });
    const page = await ctx.newPage();
    const room = `r2b${scheme}`;
    await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
    await settled(page);
    await peers(page, room, 15);
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800); // the sheet is a 150ms fade; settle well past it

    const out = await page.evaluate(() => {
      const lum = (rgb: number[]) => {
        const f = rgb.map((c) => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2];
      };
      const parse = (s: string) => {
        const m = s.match(/[-\d.]+(e[-+]?\d+)?/gi) ?? [];
        const n = m.map(Number);
        return { rgb: n.slice(0, 3), a: n.length > 3 ? n[3] : 1 };
      };
      const over = (fg: number[], a: number, bg: number[]) =>
        fg.map((c, i) => c * a + bg[i] * (1 - a));
      const ratio = (a: number[], b: number[]) => {
        const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
        return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
      };
      const lobby = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement;
      if (!lobby) return { error: "no visible sheet" };
      const lb = lobby.getBoundingClientRect();

      // WHAT IS BEHIND THE SHEET, node by node. The pose is 80% popover over whatever the page
      // puts there; the wordmark is the thing that varies.
      const behind: Record<string, string> = {};
      const probeX = [lb.x + 6, lb.x + lb.width / 2, lb.x + lb.width - 6];
      const probeY = [lb.y + 6, lb.y + lb.height / 2, lb.y + lb.height - 6];
      lobby.style.pointerEvents = "none";
      for (const x of probeX)
        for (const y of probeY) {
          const el = document.elementFromPoint(x, y) as HTMLElement | null;
          behind[`${Math.round(x)},${Math.round(y)}`] = el
            ? `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]}`
            : "(none)";
        }
      lobby.style.pointerEvents = "";

      const runs = [
        [".pl-state", lobby.querySelector(".pl-state")],
        [".pl-name", lobby.querySelector(".pl-name")],
        [".pl-qualifier", lobby.querySelector(".pl-qualifier")],
        [".pl-more", lobby.querySelector(".pl-more")],
      ] as [string, HTMLElement | null][];

      const cs = getComputedStyle(lobby);
      const sheetOwn = parse(cs.backgroundColor);
      const bodyBg = parse(getComputedStyle(document.body).backgroundColor);

      return {
        scheme: cs.colorScheme,
        sheet: {
          x: +lb.x.toFixed(2),
          y: +lb.y.toFixed(2),
          w: +lb.width.toFixed(2),
          h: +lb.height.toFixed(2),
          background: cs.backgroundColor,
          own: sheetOwn,
        },
        bodyBg: getComputedStyle(document.body).backgroundColor,
        behind,
        rowCount: lobby.querySelectorAll(".pl-row").length,
        more: lobby.querySelector(".pl-more")?.textContent?.trim() ?? null,
        state: lobby.querySelector(".pl-state")?.textContent?.trim() ?? null,
        runs: runs
          .filter(([, el]) => el)
          .map(([sel, el]) => {
            const r = el!.getBoundingClientRect();
            const c = parse(getComputedStyle(el!).color);
            return {
              sel,
              text: el!.textContent?.trim() ?? "",
              box: {
                x: +r.x.toFixed(2),
                y: +r.y.toFixed(2),
                w: +r.width.toFixed(2),
                h: +r.height.toFixed(2),
              },
              color: getComputedStyle(el!).color,
              // against the SHEET'S OWN composited background alone (what pass 1 measured)
              onSheetOwn: ratio(over(c.rgb, c.a, sheetOwn.rgb), sheetOwn.rgb),
              onBody: ratio(over(c.rgb, c.a, bodyBg.rgb), bodyBg.rgb),
            };
          }),
      };
    });

    // The ground, in BYTES: hide every glyph in the sheet, shoot the sheet's box, read the
    // extremes per run. A colour read off computed styles cannot see the wordmark.
    const ground = await (async () => {
      const box = (out as { sheet?: { x: number; y: number; w: number; h: number } }).sheet;
      if (!box) return null;
      await page.evaluate(() => {
        const l = [...document.querySelectorAll("[data-lobby]")].find(
          (e) => e.getBoundingClientRect().width > 0,
        ) as HTMLElement;
        l.querySelectorAll<HTMLElement>(".pl-state,.pl-name,.pl-qualifier,.pl-more").forEach(
          (e) => (e.style.visibility = "hidden"),
        );
        l.querySelectorAll<HTMLElement>(".pl-row-mark").forEach(
          (e) => (e.style.visibility = "hidden"),
        );
      });
      await page.waitForTimeout(150);
      const buf = await page.screenshot({
        clip: { x: box.x, y: box.y, width: box.w, height: box.h },
      });
      await page.evaluate(() => {
        const l = [...document.querySelectorAll("[data-lobby]")].find(
          (e) => e.getBoundingClientRect().width > 0,
        ) as HTMLElement;
        l.querySelectorAll<HTMLElement>(
          ".pl-state,.pl-name,.pl-qualifier,.pl-more,.pl-row-mark",
        ).forEach((e) => (e.style.visibility = ""));
      });
      return buf.toString("base64");
    })();

    bank(`b-ground-${scheme}`, info.project.name, out);
    if (ground)
      fs.writeFileSync(
        path.join(OUT, `b-ground-${scheme}-${info.project.name}.b64`),
        ground,
      );
    await ctx.close();
  }
});

// ── C · the desk bound (G8) + the sheet's line arithmetic ──────────────────────────────────
test("C desk bound and the line budget", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  const room = "r2c";
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  const geom: Record<string, unknown> = {};
  let haveC = 1;
  for (const n of [1, 3, 6, 16]) {
    await peers(page, room, n - haveC);
    haveC = n;
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    geom[`n${n}`] = await page.evaluate(() => {
      const r = (el: Element | null) => {
        if (!el) return null;
        const b = el.getBoundingClientRect();
        return {
          x: +b.x.toFixed(2),
          y: +b.y.toFixed(2),
          w: +b.width.toFixed(2),
          h: +b.height.toFixed(2),
          bottom: +b.bottom.toFixed(2),
        };
      };
      const lobby = [...document.querySelectorAll("[data-lobby]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement | null;
      const grid =
        document.querySelector(".board-grid") ??
        document.querySelector(".game-board") ??
        document.querySelector("svg.grid-svg") ??
        document.querySelector(".board-group");
      const firstCell = document.querySelector(".sudoku-cell");
      const cs = lobby ? getComputedStyle(lobby) : null;
      return {
        lobby: r(lobby),
        rows: lobby?.querySelectorAll(".pl-row").length ?? 0,
        state: r(lobby?.querySelector(".pl-state") ?? null),
        row0: r(lobby?.querySelector(".pl-row") ?? null),
        more: r(lobby?.querySelector(".pl-more") ?? null),
        moreText: lobby?.querySelector(".pl-more")?.textContent?.trim() ?? null,
        padding: cs?.padding ?? null,
        board: r(grid),
        cell0: r(firstCell),
        boardGroup: r(document.querySelector(".board-group")),
        card: r(document.querySelector(".controls-card")),
      };
    });
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(400);
  }
  bank("c-desk-bound", info.project.name, geom);
  await ctx.close();
});

// ── D · the counting rule ──────────────────────────────────────────────────────────────────
test("D the counting rule across glyph, name, rows and compression", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  const room = "r2d";
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  const rows: unknown[] = [];
  let have = 1;
  for (const n of [1, 2, 3, 6, 7, 12, 16]) {
    await peers(page, room, n - have);
    have = n;
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(800);
    rows.push(
      await page.evaluate((n) => {
        const m = [...document.querySelectorAll("[data-player-mark]")].find(
          (e) => e.getBoundingClientRect().width > 0,
        ) as HTMLElement;
        const lobby = [...document.querySelectorAll("[data-lobby]")].find(
          (e) => e.getBoundingClientRect().width > 0,
        ) as HTMLElement | null;
        return {
          n,
          glyph: m.querySelector(".pt-count")?.textContent?.trim() ?? null,
          strokes: m.querySelectorAll(".pt-pose.is-active path").length,
          ariaLabel: m.getAttribute("aria-label"),
          state: lobby?.querySelector(".pl-state")?.textContent?.trim() ?? null,
          rowNames: [...(lobby?.querySelectorAll(".pl-row") ?? [])].map((li) => ({
            name: li.querySelector(".pl-name")?.textContent?.trim(),
            qual: li.querySelector(".pl-qualifier")?.textContent?.trim() ?? "",
          })),
          more: lobby?.querySelector(".pl-more")?.textContent?.trim() ?? null,
        };
      }, n),
    );
    await page.locator("[data-player-mark]:visible").first().click();
    await page.waitForTimeout(350);
  }
  bank("d-counting", info.project.name, rows);
  await ctx.close();
});

// ── E · the tally before any game exists ───────────────────────────────────────────────────
test("E the mark at '/', no board, no room", async ({ browser }, info) => {
  const out: Record<string, unknown> = {};
  for (const [name, vp, url] of [
    ["desk-root", { width: 1280, height: 800 }, "./"],
    ["phone-root", { width: 390, height: 844 }, "./"],
    ["desk-gallery", { width: 1280, height: 800 }, "./?view=gallery"],
    ["phone-gallery", { width: 390, height: 844 }, "./?view=gallery"],
  ] as const) {
    const ctx = await browser.newContext({ viewport: vp });
    const page = await ctx.newPage();
    await page.goto(url);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForTimeout(1500);
    out[name] = await page.evaluate(() => {
      const marks = [...document.querySelectorAll("[data-player-mark]")];
      const vis = marks.filter((m) => m.getBoundingClientRect().width > 0);
      const b = vis[0]?.getBoundingClientRect();
      return {
        inDom: marks.length,
        visible: vis.length,
        name: vis[0]?.getAttribute("aria-label") ?? null,
        box: b ? { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2) } : null,
        gallery: !!document.querySelector(".game-gallery, .gallery-deck, [class*='gallery']"),
        galleryView: document.querySelector(".board-group")?.classList.contains("is-gallery") ?? null,
        board: !!document.querySelector(".sudoku-cell"),
        boardVisible: (() => {
          const c = document.querySelector(".sudoku-cell");
          return c ? c.getBoundingClientRect().width > 0 : false;
        })(),
      };
    });
    await ctx.close();
  }
  bank("e-pregame", info.project.name, out);
});

// ── F · hover ink lift, and the 6 <-> 7 head-line step ─────────────────────────────────────
test("F hover lift and the 6<->7 swap", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  const room = "r2f";
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  const read = () =>
    page.evaluate(() => {
      const m = [...document.querySelectorAll("[data-player-mark]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement;
      const p = m.querySelector(".pt-pose.is-active path") as SVGPathElement | null;
      const r = m.getBoundingClientRect();
      const row = m.closest(".head-left-row") as HTMLElement | null;
      const rr = row?.getBoundingClientRect();
      const trig = document.querySelector(".attribution-trigger")!.getBoundingClientRect();
      return {
        markBox: { y: +r.y.toFixed(2), h: +r.height.toFixed(2), w: +r.width.toFixed(2) },
        rowBox: rr ? { y: +rr.y.toFixed(2), h: +rr.height.toFixed(2) } : null,
        triggerY: +trig.y.toFixed(2),
        triggerH: +trig.height.toFixed(2),
        strokeOpacity: p ? getComputedStyle(p).strokeOpacity : null,
        stroke: p ? getComputedStyle(p).stroke : null,
        glyph:
          (m.querySelector(".pt-count") as HTMLElement | null)?.textContent?.trim() ?? null,
        glyphBox: (() => {
          const g = m.querySelector(".pt-count") as HTMLElement | null;
          if (!g) return null;
          const b = g.getBoundingClientRect();
          return { y: +b.y.toFixed(2), h: +b.height.toFixed(2) };
        })(),
      };
    });
  const rest1 = await read();
  await page.locator("[data-player-mark]:visible").first().hover();
  await page.waitForTimeout(400);
  const hover1 = await read();
  // does hovering the MARK open the @mbabb card? (the pass-1 collision, re-taken)
  const cardOnMarkHover = await page.evaluate(() => {
    const card = document.querySelector(".hover-card") as HTMLElement | null;
    const trig = document.querySelector(".attribution-trigger") as HTMLElement | null;
    if (!card) return null;
    const cs = getComputedStyle(card);
    const b = card.getBoundingClientRect();
    return {
      opacity: cs.opacity,
      visibility: cs.visibility,
      z: cs.zIndex,
      box: { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) },
      triggerExpanded: trig?.getAttribute("aria-expanded") ?? null,
    };
  });
  await page.mouse.move(640, 700);
  await page.waitForTimeout(400);

  const steps: unknown[] = [];
  let have = 1;
  for (const n of [5, 6, 7, 8]) {
    await peers(page, room, n - have);
    have = n;
    await page.waitForTimeout(500);
    steps.push({ n, ...(await read()) });
  }
  // press with the register open: how many popovers sit on the anchor?
  await page.locator("[data-player-mark]:visible").first().click();
  await page.waitForTimeout(800);
  const pressed = await page.evaluate(() => {
    const boxes = (sel: string) =>
      [...document.querySelectorAll(sel)]
        .map((e) => {
          const cs = getComputedStyle(e);
          const b = e.getBoundingClientRect();
          return {
            sel,
            opacity: cs.opacity,
            visibility: cs.visibility,
            z: cs.zIndex,
            x: +b.x.toFixed(2),
            y: +b.y.toFixed(2),
            w: +b.width.toFixed(2),
            h: +b.height.toFixed(2),
          };
        })
        .filter((b) => b.visibility !== "hidden" && b.opacity !== "0");
    const lobby = [...document.querySelectorAll("[data-lobby]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement;
    const lb = lobby?.getBoundingClientRect();
    const hit = lb
      ? document.elementFromPoint(lb.x + lb.width / 2, lb.y + 24)
      : null;
    return {
      cards: boxes(".hover-card"),
      lobbies: boxes("[data-lobby]"),
      atRegisterRow: hit
        ? `${hit.tagName.toLowerCase()}.${(hit.className || "").toString().split(" ").slice(0, 2).join(".")}`
        : null,
    };
  });
  bank("f-hover-swap", info.project.name, {
    rest1,
    hover1,
    cardOnMarkHover,
    steps,
    pressed,
  });
  await ctx.close();
});

// ── G · the focusout seam ──────────────────────────────────────────────────────────────────
test("G the focusout seam on the mark", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const a = await ctx.newPage();
  await a.goto("./?size=3&difficulty=EASY&wire=local");
  await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(a.url()).searchParams.get("s")).not.toBeNull();
  const link = a.url();
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await a.waitForTimeout(800);

  // A's own cursor, before and after a REAL press on the mark; and what B sees.
  const peerGhosts = () => b.locator(".game-cell.is-peer-cursor, [data-peer-cursor]").count();
  await a.locator(".sudoku-cell input, .sudoku-cell [tabindex='0']").first().click();
  await a.waitForTimeout(700);
  const before = {
    aActive: await a.evaluate(
      () => document.activeElement?.className?.toString().slice(0, 60) ?? "",
    ),
    bGhosts: await peerGhosts(),
  };
  await a.locator("[data-player-mark]:visible").first().click();
  await a.waitForTimeout(900);
  const after = {
    aActive: await a.evaluate(
      () => document.activeElement?.className?.toString().slice(0, 60) ?? "",
    ),
    bGhosts: await peerGhosts(),
    sheetOpen: await a.locator("[data-lobby]:visible").count(),
    escapeClosed: await (async () => {
      await a.keyboard.press("Escape");
      await a.waitForTimeout(500);
      return (await a.locator("[data-lobby]:visible").count()) === 0;
    })(),
  };
  bank("g-focusout", info.project.name, { before, after });
  await ctx.close();
});

// ── H · the filter census with the sheet open at N=16 ──────────────────────────────────────
test("H filter census, sheet open, N=16", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  const room = "r2h";
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  await page.waitForTimeout(1500);
  const closed = await page.evaluate(() => ({
    live: [...document.querySelectorAll("*")].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.filter && cs.filter !== "none" && cs.display !== "none";
    }).length,
    defs: document.querySelectorAll("filter").length,
  }));
  await peers(page, room, 15);
  await page.locator("[data-player-mark]:visible").first().click();
  await page.waitForTimeout(900);
  const open = await page.evaluate(() => ({
    filters: document.querySelectorAll("filter").length,
    filterIds: [...document.querySelectorAll("filter")].map((f) => f.id),
    // THE ESTATE'S OWN COUNTING RULE (`e2e/filter-census.spec.ts`): an element counts when its
    // OWN computed `filter` is not `none` AND its OWN computed `display` is not `none`.
    live: [...document.querySelectorAll("*")].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.filter && cs.filter !== "none" && cs.display !== "none";
    }).length,
    liveNoDisplayClause: [...document.querySelectorAll("*")].filter((e) => {
      const f = getComputedStyle(e).filter;
      return f && f !== "none";
    }).length,
    budget: (window as unknown as { __pencilConfig?: { filterBudget?: number } }).__pencilConfig
      ?.filterBudget ?? null,
  }));
  bank("h-filters", info.project.name, { closed, open });
  await ctx.close();
});

// ── I · positional identity under a departure ──────────────────────────────────────────────
test("I whose ink is whose stroke, across a departure", async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const room = "r2i";
  await page.goto(`./?size=3&difficulty=EASY&wire=local&s=${room}`);
  await settled(page);
  const ids = ["dep-a", "dep-b", "dep-c", "dep-d"];
  await page.evaluate(
    ({ room, ids }) => {
      const w = window as unknown as { __ch?: BroadcastChannel };
      w.__ch ??= new BroadcastChannel(`board:${room}`);
      for (const id of ids) w.__ch.postMessage({ kind: "hi", data: {}, from: id });
    },
    { room, ids },
  );
  await page.waitForTimeout(1200); // N = 5
  const snap = () =>
    page.evaluate(() => {
      const m = [...document.querySelectorAll("[data-player-mark]")].find(
        (e) => e.getBoundingClientRect().width > 0,
      ) as HTMLElement;
      return [...m.querySelectorAll(".pt-pose.is-active path")].map((p) => ({
        stroke: getComputedStyle(p).stroke,
        d: (p.getAttribute("d") ?? "").slice(0, 40),
        dash: (p as SVGPathElement).style.strokeDashoffset || p.getAttribute("stroke-dashoffset"),
      }));
    });
  const before = await snap();
  const namesBefore = await page.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement;
    return m.getAttribute("aria-label");
  });
  // the middle peer leaves, out of band, exactly as the wire's `bye` does it
  await page.evaluate((room) => {
    const w = window as unknown as { __ch?: BroadcastChannel };
    w.__ch ??= new BroadcastChannel(`board:${room}`);
    w.__ch.postMessage({ kind: "bye", data: {}, from: "dep-b" });
  }, room);
  await page.waitForTimeout(900);
  const after = await snap();
  const namesAfter = await page.evaluate(() => {
    const m = [...document.querySelectorAll("[data-player-mark]")].find(
      (e) => e.getBoundingClientRect().width > 0,
    ) as HTMLElement;
    return m.getAttribute("aria-label");
  });
  bank("i-departure", info.project.name, { namesBefore, before, namesAfter, after });
  await ctx.close();
});
