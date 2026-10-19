import { test, expect, type Page } from "@playwright/test";
// @ts-expect-error — the ONE probe is an .mjs product home with no declaration file (registry-v7 §2.4)
import { glyphGate, TEXT_PLANTS, fmt as popFmt } from "../../../../../worktrees/wf_308fa864-c94-2/web/frontend/e2e/lib/glyph-pop.mjs";
// @ts-expect-error — the ONE paint library, an .mjs product home with no declaration file (§2.4)
import { onOff, maxDelta } from "../../../../../worktrees/wf_308fa864-c94-2/web/frontend/e2e/lib/paint-lib.mjs";
// @ts-expect-error — the ONE shape library's colour parser, an .mjs product home (§2.4)
import { parseColor, srgbToOklab } from "../../../../../worktrees/wf_308fa864-c94-2/web/frontend/scripts/shape-census.mjs";

// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) in `boot()` before every goto. The tally
//   is frame [0] of generateLineBoilFrames and the ring's own row is
//   join-language-prm.spec.ts:153; nothing here watches a tween.

/**
 * THE TIN, ON THE SURFACE (T9-W7 PAL-TIN).
 *
 * Five pencils, each with a RING ARM, and a tally drawn only where there is room for it. The
 * rows below are the ones the arithmetic cannot close:
 *
 *   · §1, the ring PHOTOGRAPHED under the section's statistic (registry-v4 §2.4): the core
 *     median of every pixel the ring moved, ring-off subtracted, all five arms, both themes,
 *     with the stick's own lightness in the same ring as the row's negative control.
 *   · §2, AA: every stick on bg/card/popover, and the name arm on the tape's paper.
 *   · §2b, the NAME ON THE TAPE and its TALLY, painted: the whole glyph population through the
 *     chair's probe (absolute 4.5, empty RED, the fraction bounded, the tail sliced), B's peer id
 *     pinned, FAINT/FADE/TAIL/EMPTY planted in-run, HEAD's own ink photographed OFF the subject as
 *     a comparison, the pass-5 binding as the in-run negative on the flat statistic; the tick
 *     ON / OFF / OFF / ON against the non-text floor, with X1/X2/FAINT plants in-run.
 *   · the two homes at seven players, and the `you` pill exactly where five players left it.
 *   · print and forced colours reach the roster tick through the widened `index.css` pair.
 *
 * ONE BOARD, ENCODED (`?board=` is a codec payload, not a name): minted with the app's codec
 * from the `74a2b5d9` control's deal, the same payload PAL-WALK's rows read, and every row that
 * reads a board asserts it decoded.
 *
 * ONE BROWSER CONTEXT per room, because the local transport arm is a `BroadcastChannel` and two
 * contexts do not share one (`multiplayer.spec.ts`'s reasoning, verbatim).
 */

const BOARD =
  "ATMuMzkxNjc4NDIwMjQwMDMwNjA4Njc4MDAwMDMwMTg2OTI3MzAwMDU5MzE0Mjg2NDAyODU2OTE3MDYzNTkxMDQwNTA3NDYyODkwOTI0NzgzMDYx";
const GIVENS =
  "39167842.24..3.6.8678....3.1869273...593142864.2856917.63591.4.5.746289.924783.61";
const SOLO = `./?board=${BOARD}`;
const LOCAL = SOLO + "&wire=local";
/** THE SECTION'S STATISTIC (registry-v4 §2.4): the ring's core median clears 3.0 with 0.10 of
 *  headroom. */
const CORE_FLOOR = 3.1;

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

async function boot(page: Page, url: string) {
  // THE PRM ROUTE for every page this file opens (`check-motion-contract` rule 3): the tin reads
  // colour off a settled surface and, from §1b, samples PIXELS out of a screenshot — a boiling
  // grid would make the sample a lottery. Reduced motion lands the estate at pose 0.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url);
  await settled(page);
  const givens = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => (i as HTMLInputElement).value || ".")
      .join(""),
  );
  // a joiner reads the room's board, which is the same payload; a written digit is not a given
  if (!new URL(url, "http://x").searchParams.get("s")) expect(givens, "the encoded board decoded").toBe(GIVENS);
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

const roster = (page: Page) =>
  page.locator(".controls-card .players-roster .player-row");

/** A room of `n` pages on one board, the product's own invite path. `pins` seats EVERY page under a
 *  FIXED peer id the way the product re-seats a tab (`session-identity-v1`, the per-tab map keyed by
 *  the room the link names), so every slug on the page and every stroke an id seeds is part of the
 *  payload rather than a random variable (LAWS P6 §C, P7 §C: the pin reaches every id on the page).
 *  The host is pinned the way PAL-WALK pins it: its map answers for the room the address bar names,
 *  because the invite writes `?s=` before the page claims its id. */
async function room(browser: import("@playwright/test").Browser, n: number, pins?: readonly string[]) {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  if (pins?.[0])
    await a.addInitScript((id) => {
      const get = Storage.prototype.getItem;
      Storage.prototype.getItem = function (k: string) {
        const r = new URL(location.href).searchParams.get("s");
        if (this === sessionStorage && k === "session-identity-v1" && r)
          return JSON.stringify({ ...JSON.parse(get.call(this, k) || "{}"), [r]: id });
        return get.call(this, k);
      };
    }, pins[0]);
  await boot(a, LOCAL);
  const link = await invite(a);
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    if (pins?.[i])
      await p.addInitScript(
        ([r, id]) => sessionStorage.setItem("session-identity-v1", JSON.stringify({ [r]: id })),
        [new URL(link).searchParams.get("s")!, pins[i]] as const,
      );
    await boot(p, link);
    pages.push(p);
  }
  for (const p of pages) await expect(roster(p)).toHaveCount(n, { timeout: 60000 });
  return { ctx, pages };
}

/** WCAG 2.x contrast off two `rgb()` strings the engine itself produced. */
const CONTRAST = `(a, b) => {
  const px = (s) => s.match(/[\\d.]+/g).slice(0, 3).map(Number).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  const L = (p) => 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
  const [x, y] = [L(px(a)), L(px(b))].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}`;

/** src-over composite, in the engine's own bytes. */
const OVER = `(fg, alpha, bg) => {
  const n = (s) => s.match(/[\\d.]+/g).slice(0, 3).map(Number);
  const f = n(fg), b = n(bg);
  return 'rgb(' + f.map((v, i) => alpha * v + (1 - alpha) * b[i]).join(', ') + ')';
}`;

/** The product's own key — `useTheme` writes the `dark` CLASS on `<html>` (`useTheme.ts:9-13`),
 *  so the arm is switched the way a reader switches it, then settled over two frames. */
async function setTheme(page: Page, mode: "light" | "dark") {
  await page.evaluate((m) => {
    document.documentElement.classList.toggle("dark", m === "dark");
    return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, mode);
}


// ── CRITIC (pass 8) · HEAD's SAME-INDEX INK, PAINTED ON HEAD ────────────────────────────────
/** The lane's control is a stylesheet on the TREE's label (`color: oklch(L 0.11 i×137.5)`). This
 *  reads the REAL control: the same room (same pinned ids, same board, same join order), writer i
 *  writes, A's page hovers, the tape is read by the ONE probe. On the tree it reads the product AND
 *  the lane's simulation, so the two controls sit on one payload. CRIT_ARM=control|tree. */
const IDS = ["p-0000000a0a0a", "p-00000000c1c1", "p-00000000c2c2", "p-00000000c3c3", "p-00000000c4c4", "p-0000000b0b0b"] as const;
const TAPE = ".attribution-tape .washi-label";
const HEAD_INK = (i: number, arm: "light" | "dark"): string =>
  `oklch(${arm === "light" ? 0.5 : 0.8} 0.11 ${((i * 137.5) % 360).toFixed(2)}deg)`;
test("CRITIC head-real same-index", async ({ browser }, info) => {
  test.setTimeout(1_200_000);
  const armOf = process.env.CRIT_ARM || "tree";
  const { ctx, pages } = await room(browser, 6, IDS);
  const a = pages[0];
  const inputs = (p: Page) => p.locator(".sudoku-cell input");
  const empty = [...GIVENS].flatMap((ch, i) => (ch === "." ? [i] : []));
  const under = empty.filter((i) => i >= 9 && GIVENS[i - 9] !== ".");
  const plan: [number, number[]][] = [
    [1, [under[0], empty[0]]],
    [5, [under[1], under[2]]],
  ];
  for (const [w, xs] of plan)
    for (const x of xs) {
      await inputs(pages[w]).nth(x).click();
      await inputs(pages[w]).nth(x).fill(String(w === 1 ? 4 : 7));
      await expect.poll(() => inputs(a).nth(x).inputValue()).toBe(String(w === 1 ? 4 : 7));
    }
  await a.bringToFront();
  await inputs(a).nth(GIVENS.indexOf("3")).click({ force: true });
  const label = a.locator(TAPE);
  const frames = () => a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  for (const arm of ["light", "dark"] as const) {
    await setTheme(a, arm);
    for (const [w, xs] of plan)
      for (const x of xs) {
        await expect(async () => {
          await a.mouse.move(2, 2);
          await a.locator(".game-cell").nth(x).hover();
          await expect(label).toBeVisible({ timeout: 3000 });
        }).toPass({ timeout: 30000 });
        const slug = (await label.evaluate((l) => l.firstChild?.textContent ?? "")).trim();
        const colour = await label.evaluate((l) => getComputedStyle(l).color);
        const g = await glyphGate(a, { subject: TAPE, payload: `${armOf}/${arm}/w${w}/cell${x}`, plants: {} });
        let sim = "";
        if (armOf === "tree") {
          const tag = await a.addStyleTag({ content: `${TAPE} { color: ${HEAD_INK(w, arm)} !important; }` });
          await frames();
          const s = await glyphGate(a, { subject: TAPE, payload: `sim/${arm}/w${w}/cell${x}`, plants: {} });
          await tag.evaluate((e) => (e as Element).remove());
          await frames();
          sim = ` || lane-sim HEAD_INK(${w}) ${HEAD_INK(w, arm)} core ${s.clean.coreMedian.toFixed(3)} frac ${s.clean.fracUnder.toFixed(3)} why [${s.clean.why.join("; ")}]`;
        }
        console.log(
          `CRIT ${armOf} ${info.project.name} dpr${await a.evaluate(() => devicePixelRatio)} ${arm} writer ${w} (${IDS[w]}) cell ${x} "${slug}" ${colour} · core ${g.clean.coreMedian.toFixed(3)} frac ${g.clean.fracUnder.toFixed(3)} pop ${g.clean.population} why [${g.clean.why.join("; ")}]${sim}`,
        );
        await a.mouse.move(2, 2);
      }
  }
  await ctx.close();
});

// ── CRITIC (pass 8) · π on the UNCLAIMED solo surface: tree :4245 vs control :4251 (74a2b5d9) ──────
/** Whole-viewport photographs at 1280×800, PRM, both themes, the same codec payload (`?board=` the
 *  file's BOARD). Floor = the control photographed twice in-run (onOff with an empty sheet) and a
 *  second control page; plant = a 1 px outline on the tree's first cell, which must move pixels. */
test("CRITIC pi solo", async ({ browser }, info) => {
  test.setTimeout(600_000);
  const url = (p: number) => `http://127.0.0.1:${p}/?board=${BOARD}`;
  const open = async (p: number) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await boot(page, url(p));
    return page;
  };
  const tree = await open(4245),
    ctl = await open(Number(process.env.CTL_PORT || 4239)),
    ctl2 = await open(Number(process.env.CTL_PORT || 4239));
  const clip = { x: 0, y: 0, width: 1280, height: 800 };
  const diff = (a: { data: Buffer }, b: { data: Buffer }) => {
    let n = 0;
    for (let i = 0; i < a.data.length; i += 3) if (maxDelta(a.data, b.data, i) > 0) n++;
    return n;
  };
  for (const arm of ["light", "dark"] as const) {
    for (const p of [tree, ctl, ctl2]) {
      await setTheme(p, arm);
      await p.mouse.move(1, 1);
      await p.waitForTimeout(400);
    }
    const t = await onOff(tree, clip, ".critic-noop{}");
    const c = await onOff(ctl, clip, ".critic-noop{}");
    const c2 = await onOff(ctl2, clip, ".critic-noop{}");
    const plant = await onOff(tree, clip, ".sudoku-cell:first-child { outline: 1px solid rgb(0 0 0 / 0.5) !important; }");
    const idT = await tree.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s)));
    const idC = await ctl.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s)));
    const nodes = async (p: Page) => p.evaluate(() => document.querySelectorAll("body *").length);
    console.log(
      `PI ${info.project.name} ${arm} · tree ${idT?.split("/").pop()} vs control ${idC?.split("/").pop()} · ` +
        `tree-vs-control ${diff(t.on, c.on)} px · floor control on/off ${diff(c.on, c.off)} px · floor control vs control2 ${diff(c.on, c2.on)} px · ` +
        `floor tree on/off ${diff(t.on, t.off)} px · PLANT 1px outline ${diff(plant.on, plant.off)} px · nodes tree ${await nodes(tree)} control ${await nodes(ctl)}`,
    );
  }
});

// ── CRITIC (pass 8) · B-TAPE with each arm on ITS OWN geometry ─────────────────────────────
/** The lane's B-TAPE control paints HEAD's same-index ink onto the TREE's label, which carries the
 *  tally (B is index 5, second lap). This paints it onto the CONTROL's own label (no tally), same
 *  slug, same cells, and the tree's arm exactly as the lane does (`--color-user-ink` on the label). */
test("CRITIC btape-geometry", async ({ browser }, info) => {
  test.setTimeout(1_200_000);
  const armOf = process.env.CRIT_ARM || "tree";
  const { ctx, pages } = await room(browser, 6, IDS);
  const a = pages[0],
    b = pages[5];
  const inputs = (p: Page) => p.locator(".sudoku-cell input");
  const empty = [...GIVENS].flatMap((ch, i) => (ch === "." ? [i] : []));
  const under = empty.filter((i) => i >= 9 && GIVENS[i - 9] !== ".");
  const cells = [under[0], under[1], empty[0]];
  for (const x of cells) {
    await inputs(b).nth(x).click();
    await inputs(b).nth(x).fill("7");
    await expect.poll(() => inputs(a).nth(x).inputValue()).toBe("7");
  }
  await a.bringToFront();
  await inputs(a).nth(GIVENS.indexOf("3")).click({ force: true });
  const label = a.locator(TAPE);
  const frames = () => a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const withCss = async (css: string, payload: string) => {
    const tag = await a.addStyleTag({ content: css });
    await frames();
    const g = await glyphGate(a, { subject: TAPE, payload, plants: {} });
    await tag.evaluate((e) => (e as Element).remove());
    await frames();
    return g.clean.coreMedian as number;
  };
  for (const arm of ["light", "dark"] as const) {
    await setTheme(a, arm);
    for (const x of cells) {
      await expect(async () => {
        await a.mouse.move(2, 2);
        await a.locator(".game-cell").nth(x).hover();
        await expect(label).toBeVisible({ timeout: 3000 });
      }).toPass({ timeout: 30000 });
      const ticks = await a.locator(".attribution-tape .roster-tick").count();
      const out: string[] = [];
      for (let k = 1; k <= 5; k++) {
        if (armOf === "control") out.push(`HEAD i=${k - 1} ${(await withCss(`${TAPE} { color: ${HEAD_INK(k - 1, arm)} !important; }`, `ctl/${arm}/${x}/${k}`)).toFixed(3)}`);
        else {
          const t = await withCss(`${TAPE} { --color-user-ink: var(--color-peer-${k}-name) !important; }`, `tree/${arm}/${x}/${k}`);
          const s = await withCss(`${TAPE} { color: ${HEAD_INK(k - 1, arm)} !important; }`, `sim/${arm}/${x}/${k}`);
          out.push(`peer-${k} ${t.toFixed(3)} sim i=${k - 1} ${s.toFixed(3)}`);
        }
      }
      console.log(`BTG ${armOf} ${info.project.name} dpr${await a.evaluate(() => devicePixelRatio)} ${arm} cell ${x} ticks ${ticks} · ${out.join(" · ")}`);
      await a.mouse.move(2, 2);
    }
  }
  await ctx.close();
});

test("LANE btape-g5", async ({ browser }, info) => {
  test.setTimeout(1_200_000);
  const armOf = process.env.CRIT_ARM || "tree";
  const { ctx, pages } = await room(browser, 6, IDS);
  const a = pages[0],
    b = pages[5];
  const inputs = (p: Page) => p.locator(".sudoku-cell input");
  const empty = [...GIVENS].flatMap((ch, i) => (ch === "." ? [i] : []));
  const under = empty.filter((i) => i >= 9 && GIVENS[i - 9] !== ".");
  const cells = [under[0], under[1], empty[0]];
  for (const x of cells) {
    await inputs(b).nth(x).click();
    await inputs(b).nth(x).fill("7");
    await expect.poll(() => inputs(a).nth(x).inputValue()).toBe("7");
  }
  await a.bringToFront();
  await inputs(a).nth(GIVENS.indexOf("3")).click({ force: true });
  const label = a.locator(TAPE);
  const frames = () => a.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const withCss = async (css: string, payload: string) => {
    const tag = await a.addStyleTag({ content: css });
    await frames();
    const g = await glyphGate(a, { subject: TAPE, payload, plants: {} });
    await tag.evaluate((e) => (e as Element).remove());
    await frames();
    const w = (g.clean.why as string[]).filter((x) => /^G5/.test(x)); return `${(g.clean.coreMedian as number).toFixed(3)}${w.length ? "/G5red" : "/G5ok"}`;
  };
  for (const arm of ["light", "dark"] as const) {
    await setTheme(a, arm);
    for (const x of cells) {
      await expect(async () => {
        await a.mouse.move(2, 2);
        await a.locator(".game-cell").nth(x).hover();
        await expect(label).toBeVisible({ timeout: 3000 });
      }).toPass({ timeout: 30000 });
      const ticks = await a.locator(".attribution-tape .roster-tick").count();
      const out: string[] = [];
      for (let k = 1; k <= 5; k++) {
        if (armOf === "control") out.push(`HEAD i=${k - 1} ${await withCss(`${TAPE} { color: ${HEAD_INK(k - 1, arm)} !important; }`, `ctl/${arm}/${x}/${k}`)}`);
        else {
          const t = await withCss(`${TAPE} { --color-user-ink: var(--color-peer-${k}-name) !important; }`, `tree/${arm}/${x}/${k}`);
          const s = await withCss(`${TAPE} { color: ${HEAD_INK(k - 1, arm)} !important; }`, `sim/${arm}/${x}/${k}`);
          out.push(`peer-${k} ${t} sim i=${k - 1} ${s}`);
        }
      }
      console.log(`BG5 ${armOf} ${info.project.name} dpr${await a.evaluate(() => devicePixelRatio)} ${arm} cell ${x} ticks ${ticks} · ${out.join(" · ")}`);
      await a.mouse.move(2, 2);
    }
  }
  await ctx.close();
});
