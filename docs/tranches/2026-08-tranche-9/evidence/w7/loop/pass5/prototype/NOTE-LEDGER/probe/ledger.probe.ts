/**
 * NOTE-LEDGER · pass-5 probe — the four arms on ONE encoded board, driven by the keyboard.
 *
 * Derived from pass-4's `rest.probe.mjs` (the loop driver) and `pi.probe.mjs` (the 9 keys × 14
 * paint properties), re-cut on the pass-4 critique: π is read WITH THE LEDGER POPULATED (the
 * instrument DRIVES the surface it censuses, and asserts both arms hold the same line one before
 * comparing, which is the fault the critic declared in its own +2.81 px row); π carries a
 * control-vs-control arm in the same run (LAWS P4). The payload is NOTE-ERASE's pass-5 one (the
 * classic easy 9×9, 30 givens, minted with the app's codec) so §7's two lanes read one board.
 * Painted AA is NOTE-ERASE's `paintedAA` (the sensitivity row), copied, with the selector a
 * parameter so line two and a spent line one are read by the same statistic.
 *
 * Run once per arm: ARM=<hold|age|step|tint> PROTO_ID=<index-*.js> (the served dist, checked by
 * hash). SHOOT=1 banks frame panels to the scratchpad; the composite is assembled outside.
 */
import { test, expect, type Page, type Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { encodeSudoku } from "../e2e/wire";

const ARM = process.env.ARM ?? "hold";
const PROTO_ID = process.env.PROTO_ID ?? "";
const CONTROL_ID = "index-CubiZsMVSwTc.js";
const PROTO = "http://127.0.0.1:4249";
const CONTROL = "http://127.0.0.1:4248";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/NOTE-LEDGER/logs";
const PANELS =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger/panels";
mkdirSync(OUT, { recursive: true });
mkdirSync(PANELS, { recursive: true });

const GIVENS: Record<number, number> = {
  0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3,
  36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9,
  71: 5, 76: 8, 79: 7, 80: 9,
};
const PAYLOAD = encodeSudoku(3, GIVENS, 81);
const EXPECTED = Array.from({ length: 81 }, (_, i) => (GIVENS[i] ? String(GIVENS[i]) : ".")).join("");
/** The board's unique solution (the classic puzzle): the "next write" types a TRUE digit, so it
 *  can never falsify a record — it only tests what the arm does with the next beat. */
const SOLUTION =
  "534678912672195348198342567859761423426853791713924856961537284287419635345286179";

type Rig = { name: string; w: number; h: number; coarse: boolean; dpr: number };
const DESK: Rig = { name: "1280x800-fine", w: 1280, h: 800, coarse: false, dpr: 2 };
const PHONE: Rig = { name: "390x844-coarse", w: 390, h: 844, coarse: true, dpr: 3 };
const L844: Rig = { name: "844x390-coarse", w: 844, h: 390, coarse: true, dpr: 3 };
const L812: Rig = { name: "812x375-coarse", w: 812, h: 375, coarse: true, dpr: 3 };

const bank: Record<string, unknown> = { arm: ARM, protoId: PROTO_ID, payload: PAYLOAD };
const say = (k: string, v: unknown) => console.log(`NL5|${ARM}|${k}|${JSON.stringify(v)}`);

async function open(browser: Browser, base: string, rig: Rig, scheme: "light" | "dark", engine: string) {
  const ctx = await browser.newContext({
    viewport: { width: rig.w, height: rig.h },
    deviceScaleFactor: rig.dpr,
    hasTouch: rig.coarse,
    isMobile: rig.coarse && engine === "chromium",
  });
  await ctx.addInitScript(() => {
    const w = window as unknown as { __push: unknown[] };
    w.__push = [];
    const real = Element.prototype.animate;
    Element.prototype.animate = function (kf, opts) {
      try {
        if (String(this.className).includes("margin-note-previous")) {
          const one = document.querySelector(".board-margin .margin-note");
          const r = one?.getBoundingClientRect();
          w.__push.push({
            lineOneAtCall: r ? { w: r.width, h: r.height, top: r.top, bottom: r.bottom } : null,
            kf0: JSON.parse(JSON.stringify(kf))?.[0]?.transform ?? null,
          });
        }
      } catch {
        /* never break the page */
      }
      return real.call(this, kf, opts);
    };
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
  await page.goto(`${base}/?board=${PAYLOAD}`);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  let got = "";
  for (let i = 0; i < 80; i++) {
    got = await boardString(page);
    if (got === EXPECTED) break;
    await page.waitForTimeout(100);
  }
  if (got !== EXPECTED) throw new Error(`payload not dealt on ${base}: ${got}`);
  const id = await page.evaluate(
    () => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "",
  );
  const want = base === PROTO ? PROTO_ID : CONTROL_ID;
  if (!id.includes(want)) throw new Error(`${base} serves ${id}, expected ${want}`);
  await page.waitForTimeout(900);
  return { ctx, page };
}

const boardString = (p: Page) =>
  p.evaluate(() =>
    [...document.querySelectorAll(".game-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""),
  );

const lines = (page: Page) =>
  page.evaluate(() => {
    const one = document.querySelector<HTMLElement>(".board-margin .margin-note");
    const two = document.querySelector<HTMLElement>(".board-margin .margin-note-previous");
    const box = (el: HTMLElement | null) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { w: +r.width.toFixed(2), h: +r.height.toFixed(2), top: +r.top.toFixed(2), color: cs.color, display: cs.display, fontSize: cs.fontSize };
    };
    return {
      one: one?.textContent?.trim() ?? "",
      two: two?.textContent?.trim() ?? "",
      spent: !!one?.classList.contains("is-spent"),
      oneBox: box(one),
      twoBox: box(two),
    };
  });

async function ask(page: Page) {
  await page.evaluate(() => {
    const e = ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).filter((i) => !i.value);
    e[0]?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(800);
  return (await lines(page)).one;
}
/** Write the digit the live sentence names into the cell it names. The hint does NOT move focus
 *  (pass 4's driver typed into the focused cell, which was not the hint's; declared in the README):
 *  the target is the one EMPTY because-cell whose solution is the named digit. */
async function answer(page: Page) {
  const s = (await lines(page)).one;
  const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1];
  if (!d) throw new Error(`no digit in "${s}"`);
  const target = await page.evaluate(
    ([d, sol]) =>
      [...document.querySelectorAll(".game-cell")]
        .map((c, i) => ({ c, i }))
        .filter(({ c, i }) => c.querySelector(".cell-because") && !(c.querySelector("input") as HTMLInputElement).value && sol[i] === d)
        .map(({ i }) => i),
    [d, SOLUTION] as const,
  );
  if (target.length !== 1) throw new Error(`"${s}": ${target.length} target cells`);
  await page.locator(".game-cell input").nth(target[0]).focus();
  await page.keyboard.type(d);
  await page.waitForTimeout(800);
  const landed = await page.evaluate((i) => (document.querySelectorAll(".game-cell input")[i] as HTMLInputElement).value, target[0]);
  if (landed !== d) throw new Error(`wrote ${d} to ${target[0]}, reads "${landed}"`);
}
/** A TRUE digit into the first empty cell: the reader moves on. */
async function nextWrite(page: Page) {
  const i = await page.evaluate(() => {
    const all = [...document.querySelectorAll(".game-cell input")] as HTMLInputElement[];
    const el = all.find((x) => !x.value);
    el?.focus();
    return el ? all.indexOf(el) : -1;
  });
  await page.keyboard.type(SOLUTION[i]);
  await page.waitForTimeout(800);
  return i;
}
type Pose = "P1" | "P2" | "P3" | "P4";
/** P1 ask·answer · P2 ask·answer·next-write · P3 ask·answer·ask · P4 ask·answer·ask·answer */
async function drive(page: Page, pose: Pose) {
  await ask(page);
  await answer(page);
  if (pose === "P2") await nextWrite(page);
  if (pose === "P3" || pose === "P4") await ask(page);
  if (pose === "P4") await answer(page);
  await page.waitForTimeout(500);
}

const KEYS = [
  "[role=grid]", ".board-margin", ".margin-note", "#fold-tools", ".app-layout",
  "#controls-drawer", ".masthead", ".board-card", ".play-controls",
];
const CLAIMED = new Set([".board-margin", ".margin-note"]);
const PAINT = [
  "display", "position", "fontFamily", "fontSize", "lineHeight", "letterSpacing", "color",
  "backgroundColor", "opacity", "filter", "transform", "zIndex", "overflowX", "overflowY",
];
const census = (page: Page) =>
  page.evaluate(
    ([keys, paint]) => ({
      keys: (keys as string[]).map((sel) => {
        const el = document.querySelector(sel);
        if (!el) return { sel, present: false };
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el) as unknown as Record<string, string>;
        return { sel, present: true, tag: el.tagName, x: r.x, y: r.y, w: r.width, h: r.height, paint: Object.fromEntries((paint as string[]).map((k) => [k, cs[k]])) };
      }),
      scrollHeight: document.documentElement.scrollHeight,
      filters: [...document.querySelectorAll("*")].filter((e) => {
        const f = getComputedStyle(e).filter;
        return f && f !== "none";
      }).length,
    }),
    [KEYS, PAINT],
  );
type Census = Awaited<ReturnType<typeof census>>;
function diff(a: Census, b: Census) {
  const out: { sel: string; kind: string; d?: number; a?: string; b?: string; claimed: boolean }[] = [];
  a.keys.forEach((p, i) => {
    const c = b.keys[i];
    const claimed = CLAIMED.has(p.sel);
    if (p.present !== c.present) return out.push({ sel: p.sel, kind: "presence", claimed });
    if (!p.present || !("tag" in p) || !("tag" in c)) return;
    if (p.tag !== c.tag) out.push({ sel: p.sel, kind: "tag", a: p.tag, b: c.tag, claimed });
    for (const k of ["x", "y", "w", "h"] as const) {
      const d = Math.abs(p[k] - c[k]);
      if (d > 0.01) out.push({ sel: p.sel, kind: k, d: +d.toFixed(3), claimed });
    }
    for (const k of PAINT) if (p.paint[k] !== c.paint[k]) out.push({ sel: p.sel, kind: `paint.${k}`, a: p.paint[k], b: c.paint[k], claimed });
  });
  return out;
}

function ratio(a: number[], b: number[]) {
  const lum = (c: number[]) => {
    const f = (x: number) => ((x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
}
/** NOTE-ERASE's painted AA (pass 5), the selector made a parameter. */
async function paintedAA(page: Page, selector: string, floor = 4.5) {
  const box = await page.evaluate((sel) => {
    const el = document.querySelector<HTMLElement>(sel);
    if (!el || !el.textContent?.trim()) return null;
    // The TEXT's own extent, not the element's box: at ≥1024 line two is `flex: 1 1 0` and, with
    // line one empty, its box spans the whole strip into the card's shadow (1,258 columns of
    // shadow read as ink, first run; README incident). The stroke abuts the paper under its text.
    const range = document.createRange();
    range.selectNodeContents(el);
    const r = range.getBoundingClientRect();
    if (!r.width || !r.height || getComputedStyle(el).display === "none") return null;
    return { x: Math.floor(r.left) - 2, y: Math.floor(r.top) - 2, width: Math.ceil(r.width) + 4, height: Math.ceil(r.height) + 4, computed: getComputedStyle(el).color };
  }, selector);
  if (!box) return null;
  const { computed, ...clip } = box;
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const px = (x: number, y: number) => {
    const i = (y * info.width + x) * ch;
    return [data[i], data[i + 1], data[i + 2]];
  };
  const L = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const counts = new Map<string, number>();
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const k = px(x, y).join(",");
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const ground = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const gL = L(ground);
  const cols: { mass: number; core: number }[] = [];
  for (let x = 0; x < info.width; x++) {
    let mass = 0, best = 0, bestPx = ground;
    for (let y = 0; y < info.height; y++) {
      const c = px(x, y);
      const d = Math.abs(L(c) - gL);
      if (d > 12) mass += d;
      if (d > best) ((best = d), (bestPx = c));
    }
    if (mass > 0) cols.push({ mass, core: ratio(bestPx, ground) });
  }
  const masses = cols.map((c) => c.mass).sort((a, b) => a - b);
  const med = masses[Math.floor(masses.length / 2)] ?? 0;
  const worstAt = (f: number) => {
    const s = cols.filter((c) => c.mass >= f * med).map((c) => c.core);
    return s.length ? Math.min(...s) : null;
  };
  const cores = cols.map((c) => c.core).sort((a, b) => a - b);
  return {
    computed,
    ground: `rgb(${ground.join(",")})`,
    coreMax: cores.at(-1) ?? null,
    coreMedian: cores[Math.floor(cores.length / 2)] ?? null,
    p30: cores[Math.floor(cores.length * 0.3)] ?? null,
    worstAtMedianMass: { "50": worstAt(0.5), "70": worstAt(0.7), "90": worstAt(0.9), "100": worstAt(1) },
    fractionUnderFloor: cols.length ? +(cols.filter((c) => c.core < floor).length / cols.length).toFixed(3) : null,
    columns: cols.length,
  };
}

test.describe.configure({ mode: "serial" });

test("rest: the canonical loop, then the next write (390x844 coarse, light)", async ({ browser, browserName }) => {
  const { ctx, page } = await open(browser, PROTO, PHONE, "light", browserName);
  const regime = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, under1024: matchMedia("(max-width: 1023.98px)").matches }));
  const rounds = [];
  for (let i = 0; i < 3; i++) {
    const q = await ask(page);
    await answer(page);
    const l = await lines(page);
    rounds.push({ q, one: l.one, two: l.two, spent: l.spent, twoLine: !!(l.one && l.two) });
  }
  const cell = await nextWrite(page);
  const after = await lines(page);
  const pushes = await page.evaluate(() => (window as unknown as { __push: unknown[] }).__push);
  bank[`rest-${browserName}`] = { regime, rounds, twoLineAtRest: rounds.map((r) => r.twoLine), nextWrite: { cell, ...after }, pushes };
  say(`rest-${browserName}`, { regime, twoLineAtRest: rounds.map((r) => r.twoLine), rounds: rounds.map((r) => [r.one, r.two, r.spent]), nextWrite: [after.one, after.two, after.spent, after.oneBox?.color] });
  await ctx.close();
});

test("pi: populated, proto vs control, with a control-vs-control arm", async ({ browser, browserName }) => {
  const rows = [];
  for (const rig of [DESK, PHONE]) {
    for (const pose of ["P1", "P3"] as Pose[]) {
      const a = await open(browser, PROTO, rig, "light", browserName);
      const b = await open(browser, CONTROL, rig, "light", browserName);
      await drive(a.page, pose);
      await drive(b.page, pose);
      const [la, lb] = [await lines(a.page), await lines(b.page)];
      const [ca, cb] = [await census(a.page), await census(b.page)];
      const d = diff(ca, cb);
      const row = {
        rig: rig.name, pose,
        state: { proto: [la.one, la.two, la.spent], control: [lb.one, lb.two] },
        lineOneAgrees: la.one === lb.one,
        scrollHeight: [ca.scrollHeight, cb.scrollHeight],
        filters: [ca.filters, cb.filters],
        unclaimed: d.filter((x) => !x.claimed),
        claimed: d.filter((x) => x.claimed),
      };
      rows.push(row);
      say(`pi-${browserName}-${rig.name}-${pose}`, { state: row.state, lineOneAgrees: row.lineOneAgrees, scrollHeight: row.scrollHeight, filters: row.filters, unclaimed: row.unclaimed.length, claimed: row.claimed.map((x) => `${x.sel}.${x.kind}${x.d ?? ""}`) });
      await a.ctx.close();
      await b.ctx.close();
    }
    // THE NEGATIVE CONTROL, same run: the control against itself at the populated pose.
    const c1 = await open(browser, CONTROL, rig, "light", browserName);
    const c2 = await open(browser, CONTROL, rig, "light", browserName);
    await drive(c1.page, "P3");
    await drive(c2.page, "P3");
    const nd = diff(await census(c1.page), await census(c2.page));
    rows.push({ rig: rig.name, pose: "P3", controlVsControl: nd });
    say(`pi-neg-${browserName}-${rig.name}`, nd.map((x) => `${x.sel}.${x.kind}${x.d ?? ""}`));
    await c1.ctx.close();
    await c2.ctx.close();
  }
  bank[`pi-${browserName}`] = rows;
});

test("aa: painted, both themes, line one and line two at P4", async ({ browser, browserName }) => {
  const rows = [];
  for (const rig of [PHONE, DESK])
    for (const scheme of ["light", "dark"] as const) {
      const { ctx, page } = await open(browser, PROTO, rig, scheme, browserName);
      await drive(page, "P4");
      const l = await lines(page);
      const one = await paintedAA(page, ".board-margin .margin-note-ink");
      const two = await paintedAA(page, ".board-margin .margin-note-previous");
      rows.push({ rig: rig.name, scheme, one: l.one, spent: l.spent, two: l.two, aaOne: one, aaTwo: two });
      say(`aa-${browserName}-${rig.name}-${scheme}`, { one: l.one, spent: l.spent, two: l.two, oneMedian: one?.coreMedian, oneW50: one?.worstAtMedianMass["50"], oneUnder: one?.fractionUnderFloor, twoMedian: two?.coreMedian, twoW50: two?.worstAtMedianMass["50"], twoUnder: two?.fractionUnderFloor });
      await ctx.close();
    }
  bank[`aa-${browserName}`] = rows;
});

test("push: line one's rect when the FLIP reads it, every path the arm plays", async ({ browser, browserName }) => {
  const out: Record<string, unknown> = {};
  for (const rig of [PHONE, DESK])
    for (const pose of ["P1", "P2", "P3"] as Pose[]) {
      const { ctx, page } = await open(browser, PROTO, rig, "light", browserName);
      await drive(page, pose);
      out[`${rig.name}-${pose}`] = await page.evaluate(() => (window as unknown as { __push: unknown[] }).__push);
      await ctx.close();
    }
  bank[`push-${browserName}`] = out;
  say(`push-${browserName}`, out);
});

test("desk: the run-on gap between the two runs of ink at P4 (1280x800 fine)", async ({ browser, browserName }) => {
  const { ctx, page } = await open(browser, PROTO, DESK, "light", browserName);
  await drive(page, "P4");
  const gap = await page.evaluate(() => {
    const ink = (el: Element | null) => {
      if (!el) return null;
      const r = document.createRange();
      r.selectNodeContents(el);
      const rects = [...r.getClientRects()].filter((x) => x.width > 0);
      return rects.length ? { left: Math.min(...rects.map((x) => x.left)), right: Math.max(...rects.map((x) => x.right)), top: Math.min(...rects.map((x) => x.top)) } : null;
    };
    const one = ink(document.querySelector(".board-margin .margin-note-ink"));
    const two = ink(document.querySelector(".board-margin .margin-note-previous"));
    return { one, two, gap: one && two ? +(two.left - one.right).toFixed(2) : null, sameRow: one && two ? Math.abs(one.top - two.top) < 12 : null };
  });
  bank[`desk-${browserName}`] = gap;
  say(`desk-${browserName}`, gap);
  await ctx.close();
});

test("landscape: line two's depth, and its price if it were shown", async ({ browser, browserName }) => {
  test.skip(ARM !== "hold", "one CSS for every arm; read once on HOLD");
  const rows = [];
  for (const rig of [L844, L812]) {
    const { ctx, page } = await open(browser, PROTO, rig, "light", browserName);
    const regime = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, landscape: matchMedia("(orientation: landscape)").matches, under1024: matchMedia("(max-width: 1023.98px)").matches }));
    await drive(page, "P3");
    const read = () => page.evaluate(() => {
      const two = document.querySelector<HTMLElement>(".board-margin .margin-note-previous");
      return { two: two?.textContent?.trim() ?? "", display: two ? getComputedStyle(two).display : null, scrollHeight: document.documentElement.scrollHeight, clientHeight: document.documentElement.clientHeight };
    });
    const hidden = await read();
    await page.addStyleTag({ content: ".board-margin .margin-note-previous{display:block !important}" });
    await page.waitForTimeout(300);
    const shown = await read();
    rows.push({ rig: rig.name, regime, hidden, shown, priceScroll: shown.scrollHeight - hidden.scrollHeight });
    say(`landscape-${browserName}-${rig.name}`, { regime, hidden, shown });
    await ctx.close();
  }
  bank[`landscape-${browserName}`] = rows;
});

test("frames: panels at P1 and P2, both cells", async ({ browser, browserName }) => {
  test.skip(!process.env.SHOOT || browserName !== "chromium", "panels are chromium, light, on request");
  for (const rig of [PHONE, DESK])
    for (const pose of ["P1", "P2"] as Pose[]) {
      const { ctx, page } = await open(browser, PROTO, rig, "light", browserName);
      await drive(page, pose);
      await page.mouse.move(1, 1);
      await page.waitForTimeout(600);
      const clip = await page.evaluate(() => {
        const g = document.querySelector('[role="grid"]')!.getBoundingClientRect();
        const m = document.querySelector(".board-margin")!.getBoundingClientRect();
        const top = Math.floor(g.bottom - 24);
        return { x: Math.floor(g.left), y: top, width: Math.ceil(g.width), height: Math.ceil(m.bottom - top + 26) };
      });
      await page.screenshot({ path: join(PANELS, `${rig.name}-${pose}-${ARM}.png`), clip });
      bank[`frame-${rig.name}-${pose}`] = { clip, lines: await lines(page) };
      await ctx.close();
    }
});

test.afterAll(async ({ browserName }) => {
  writeFileSync(join(OUT, `probe-${ARM}${process.env.SUFFIX ?? ""}-${browserName}.json`), JSON.stringify(bank, null, 1));
});
