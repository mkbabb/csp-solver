/**
 * T9-W7 pass 3 · MRK-ABS PROTOTYPE — the DOM-WALK census and the readings around it.
 *
 * G-ABS-4 (one colour, same-frame, BOTH engines) and G-ABS-3 (>= 3:1 from the ring's own band,
 * BOTH engines) ran chromium-only in pass 2 because WebKit's Tab reaches form controls only.
 * The recipe proved on both engines here: walk the focusable set in DOCUMENT ORDER, call
 * `.focus()` programmatically, then press ONE key — the key press sets keyboard modality, so
 * `:focus-visible` matches on any focusable element in both engines. Never a Tab walk.
 *
 * Also banked here: boardPx at this base, pose 0's identity (G-ABS-8), `.live-face-slot`'s
 * radius focused vs blurred (G-ABS-9's second arm), the deck's reach/headroom/owner, the
 * toggle's painted ring, and §2.7's hovered-then-focused reading.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MRK-ABS/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => writeFileSync(`${OUT}/${n}.json`, JSON.stringify(d, null, 2));

type RGB = [number, number, number];
const lum = ([r, g, b]: RGB) => {
  const f = (x: number) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: RGB, b: RGB) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
};
const med = (v: number[]) => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];
const dist = (a: RGB, b: RGB) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);

async function rawOf(buf: Buffer) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: 4 };
}
const at = (I: { data: Buffer; w: number; ch: number }, x: number, y: number): RGB => {
  const i = (y * I.w + x) * I.ch;
  return [I.data[i], I.data[i + 1], I.data[i + 2]];
};
function parseColour(c: string): { rgb: RGB; a: number } | null {
  let m = c.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?/);
  if (m) return { rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : +m[4] };
  m = c.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?:\s*\/\s*([\d.]+))?/);
  if (m)
    return {
      rgb: [+m[1] * 255, +m[2] * 255, +m[3] * 255].map(Math.round) as RGB,
      a: m[4] === undefined ? 1 : +m[4],
    };
  return null;
}

/**
 * The theme is flipped BY KEYBOARD, never by a click. Measured here: in WebKit, once the last
 * interaction was a POINTER, a later programmatic `.focus()` plus one key press does NOT re-arm
 * `:focus-visible` — the whole dark arm came back with `outline-style: none` on all 8 stops and
 * zero colours. Focusing the real toggle and pressing Enter activates it and leaves the modality
 * keyboard, so the census that follows reads the ring both engines.
 */
async function setTheme(page: Page, want: "light" | "dark") {
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  if ((await isDark()) === (want === "dark")) return;
  await page.locator("button.sun-moon-toggle").first().evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Enter");
  await expect.poll(isDark, { timeout: 10000 }).toBe(want === "dark");
  await page.waitForTimeout(700);
}

/** The RING BAND, PER SIDE (pass-2 gap 1: the pooled form mixed a co-changing element in). */
async function ringBandPerSide(page: Page, handle: any) {
  const box = await handle.boundingBox();
  if (!box) return null;
  // The outline's geometry only EXISTS while the element is focused, so the band's window is
  // read in the focused state first (pass-2's form read it blurred and placed the strips on
  // the border box, where a ring at offset 3 never is).
  await handle.evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Shift");
  await page.waitForTimeout(400);
  const st = await handle.evaluate((n: HTMLElement) => {
    const cs = getComputedStyle(n);
    return {
      colour: cs.outlineColor,
      style: cs.outlineStyle,
      w: parseFloat(cs.outlineWidth) || 0,
      off: parseFloat(cs.outlineOffset) || 0,
      radius: cs.borderRadius,
      focusVisible: n.matches(":focus-visible"),
    };
  });
  const vp = page.viewportSize()!;
  const M = 30;
  const clip = {
    x: Math.max(0, Math.floor(box.x - M)),
    y: Math.max(0, Math.floor(box.y - M)),
    width: Math.min(vp.width - Math.max(0, Math.floor(box.x - M)), Math.ceil(box.width + M * 2)),
    height: Math.min(vp.height - Math.max(0, Math.floor(box.y - M)), Math.ceil(box.height + M * 2)),
  };
  if (clip.width < 4 || clip.height < 4) return null;
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(220);
  const A = await rawOf(await page.screenshot({ clip, scale: "css" }));
  await handle.evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Shift");
  await page.waitForTimeout(420);
  const B = await rawOf(await page.screenshot({ clip, scale: "css" }));
  const bx = box.x - clip.x,
    by = box.y - clip.y,
    d = st.off + st.w / 2;
  const sides: Record<string, [number, number][]> = { top: [], bottom: [], left: [], right: [] };
  for (let i = 0; i <= 10; i++) {
    const t = box.width * 0.2 + box.width * 0.6 * (i / 10);
    sides.top.push([bx + t, by - d]);
    sides.bottom.push([bx + t, by + box.height + d]);
  }
  for (let i = 0; i <= 10; i++) {
    const t = box.height * 0.2 + box.height * 0.6 * (i / 10);
    sides.left.push([bx - d, by + t]);
    sides.right.push([bx + box.width + d, by + t]);
  }
  const want = parseColour(st.colour);
  const out: Record<string, unknown> = {
    outline: `${st.w}px ${st.style} ${st.colour}`,
    offset: st.off,
    radius: st.radius,
    focusVisible: st.focusVisible,
  };
  let bestSide: string | null = null,
    bestRatio: number | null = null,
    anyRing = false;
  for (const [side, pts] of Object.entries(sides)) {
    const ch: { ink: RGB; ground: RGB }[] = [];
    let sampled = 0;
    for (const [fx, fy] of pts) {
      const x = Math.round(fx),
        y = Math.round(fy);
      if (x < 0 || y < 0 || x >= A.w || y >= A.h) continue;
      sampled++;
      const a = at(A, x, y),
        b = at(B, x, y);
      if (dist(a, b) > 12) ch.push({ ink: b, ground: a });
    }
    if (!ch.length) {
      out[side] = { sampled, changed: 0 };
      continue;
    }
    const ink = [0, 1, 2].map((c) => med(ch.map((p) => p.ink[c]))) as RGB;
    const ground = [0, 1, 2].map((c) => med(ch.map((p) => p.ground[c]))) as RGB;
    const expected = want
      ? (want.rgb.map((c, i) => Math.round(want.a * c + (1 - want.a) * ground[i])) as RGB)
      : null;
    const dev = expected ? dist(ink, expected) : null;
    const isRing = dev !== null && dev <= 24;
    const r = ratio(ink, ground);
    out[side] = { sampled, changed: ch.length, ink, ground, deltaToComputed: dev, isTheRing: isRing, ratio: r };
    if (isRing) {
      anyRing = true;
      if (bestRatio === null || r < bestRatio) {
        bestRatio = r;
        bestSide = side;
      }
    }
  }
  out.isTheRing = anyRing;
  out.worstRingSide = bestSide;
  out.worstRingRatio = bestRatio;
  return out;
}

const WALK = 'a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"])';

test.describe.configure({ mode: "serial" });

test("A · boardPx at this base + pose 0 is the shipped artifact (G-ABS-8)", async ({ page }, info) => {
  const rows: Record<string, unknown>[] = [];
  for (const N of [4, 9, 16]) {
    await page.goto(`/?size=${Math.round(Math.sqrt(N))}`); // subgrid dim: 2=4x4, 3=9x9, 4=16x16
    await page.waitForSelector(".board-shell .game-cell", { timeout: 40000 });
    await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 40000 }).toBe(N * N);
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => {
      const grid = document.querySelector(".board-shell svg.hand-drawn-grid") as SVGSVGElement;
      const b = grid.getBoundingClientRect();
      const p = document.querySelector(".board-shell .game-cell .cell-ghost-path") as SVGPathElement;
      return { boardPx: +b.width.toFixed(3), d0: p.getAttribute("d") };
    });
    rows.push({ board: `${N}x${N}`, ...r });
  }
  bank(`boardpx-${info.project.name}`, rows);
  for (const r of rows) console.log(`[boardPx ${info.project.name}] ${r.board} = ${r.boardPx}  d0 ${(r.d0 as string).length} B`);
  expect(rows.length).toBe(3);
});

test("B · the DOM-WALK census: one colour per theme, same-frame, from the band (G-ABS-3/4)", async ({
  page,
}, info) => {
  const engine = info.project.name;
  const report: Record<string, unknown> = { engine, base: "prototype" };
  for (const theme of ["light", "dark"] as const) {
    await page.goto("/");
    await page.waitForSelector(".board-shell .game-cell", { timeout: 40000 });
    await setTheme(page, theme);
    await page.waitForTimeout(800);

    // the focusable set in DOCUMENT ORDER, visibility-filtered
    const stops = await page.evaluate((sel) => {
      const vis = (n: Element) => {
        const r = n.getBoundingClientRect();
        const cs = getComputedStyle(n);
        return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none";
      };
      const out: { key: string; cls: string; tag: string }[] = [];
      const seen = new Set<string>();
      document.querySelectorAll(sel).forEach((n, i) => {
        if (!vis(n)) return;
        if ((n as HTMLElement).closest("[inert]")) return;
        const cls = ((n as HTMLElement).className || "").toString().trim().split(/\s+/)[0] || "";
        const key = `${n.tagName.toLowerCase()}.${cls}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ key, cls, tag: n.tagName.toLowerCase(), idx: i } as never);
      });
      return out as unknown as { key: string; cls: string; tag: string; idx: number }[];
    }, WALK);

    const rows: Record<string, unknown>[] = [];
    for (const s of stops) {
      const esc = (c: string) => c.replace(/([^\w-])/g, "\\$1");
      const h = page.locator(`${s.tag}${s.cls ? "." + esc(s.cls) : ""}`).first();
      if (!(await h.count())) continue;
      // arrival: the outline colour on the FIRST animation frame after focus
      const arrival = await page.evaluate(
        async ({ tag, cls }) => {
          const el = document.querySelector(cls ? `${tag}.${CSS.escape(cls)}` : tag) as HTMLElement; // in-page: CSS.escape exists
          if (!el) return null;
          (document.activeElement as HTMLElement)?.blur?.();
          await new Promise((r) => requestAnimationFrame(() => r(null)));
          const t0 = performance.now();
          el.focus();
          await new Promise((r) => requestAnimationFrame(() => r(null)));
          const cs = getComputedStyle(el);
          return {
            firstFrameMs: +(performance.now() - t0).toFixed(2),
            firstFrameColour: cs.outlineColor,
            firstFrameStyle: cs.outlineStyle,
            firstFrameWidth: cs.outlineWidth,
            transitionProperty: cs.transitionProperty,
          };
        },
        { tag: s.tag, cls: s.cls },
      );
      // settled computed facts, with keyboard modality
      await h.evaluate((n: HTMLElement) => n.focus());
      await page.keyboard.press("Shift");
      await page.waitForTimeout(400);
      const settled = await h.evaluate((n: HTMLElement) => {
        const cs = getComputedStyle(n);
        return {
          colour: cs.outlineColor,
          style: cs.outlineStyle,
          width: cs.outlineWidth,
          offset: cs.outlineOffset,
          radius: cs.borderRadius,
          focusVisible: n.matches(":focus-visible"),
        };
      });
      const band = await ringBandPerSide(page, h);
      rows.push({ stop: s.key, arrival, settled, band });
    }
    const colours = new Set(
      rows.filter((r) => (r.settled as any).style !== "none").map((r) => (r.settled as any).colour),
    );
    const autos = rows.filter((r) => (r.settled as any).style === "auto").length;
    const sameFrame = rows.filter(
      (r) => (r.arrival as any) && (r.arrival as any).firstFrameColour === (r.settled as any).colour,
    ).length;
    const banded = rows.filter((r) => (r.band as any)?.isTheRing);
    const worst = banded.length
      ? Math.min(...banded.map((r) => (r.band as any).worstRingRatio as number))
      : null;
    report[theme] = {
      stops: rows.length,
      colours: [...colours],
      autos,
      sameFrameOfStops: `${sameFrame}/${rows.length}`,
      bandedStops: banded.length,
      worstBandRatio: worst,
      under3: banded.filter((r) => ((r.band as any).worstRingRatio as number) < 3).map((r) => [r.stop, (r.band as any).worstRingRatio]),
      rows,
    };
    console.log(
      `[census ${engine} ${theme}] ${rows.length} stops · colours ${[...colours].join(" | ")} · auto ${autos} · same-frame ${sameFrame}/${rows.length} · banded ${banded.length} worst ${worst}`,
    );
    for (const u of (report[theme] as any).under3) console.log(`   UNDER 3:1 -> ${u[0]} ${u[1]}`);
  }
  bank(`census-${engine}`, report);
  expect(Object.keys(report).length).toBeGreaterThan(2);
});

test("C · the deck, the live face, the toggle, and the hovered-then-focused reading", async ({
  page,
}, info) => {
  const engine = info.project.name;
  const out: Record<string, unknown> = { engine };

  await page.goto("/?view=gallery");
  await page.waitForSelector(".gallery-viewport", { timeout: 40000 });
  await page.waitForTimeout(900);
  out.deck = await page.evaluate(() => {
    const vp = document.querySelector(".gallery-viewport") as HTMLElement;
    const centre = document.querySelector(".game-card.is-center") as HTMLElement;
    const slot = document.querySelector(".live-face-slot") as HTMLElement | null;
    const cs = getComputedStyle(centre);
    const vr = vp.getBoundingClientRect(),
      cr = centre.getBoundingClientRect();
    const reach = (parseFloat(cs.outlineOffset) || 0) + (parseFloat(cs.outlineWidth) || 0);
    return {
      viewportOutlineStyle: getComputedStyle(vp).outlineStyle,
      owners: document.querySelectorAll(".game-card.is-center").length,
      cardRadius: cs.borderRadius,
      reach,
      airLeft: +(cr.left - vr.left).toFixed(3),
      airRight: +(vr.right - cr.right).toFixed(3),
      headroom: +(Math.min(cr.left - vr.left, vr.right - cr.right) - reach).toFixed(3),
      whole: cr.left - reach >= vr.left && cr.right + reach <= vr.right,
      slotRadiusBlurred: slot ? getComputedStyle(slot).borderRadius : null,
    };
  });
  await page.evaluate(() => (document.querySelector(".gallery-viewport") as HTMLElement)?.focus());
  await page.keyboard.press("Shift");
  await page.waitForTimeout(400);
  (out.deck as any).focused = await page.evaluate(() => {
    const centre = document.querySelector(".game-card.is-center") as HTMLElement;
    const slot = document.querySelector(".live-face-slot") as HTMLElement | null;
    const cs = getComputedStyle(centre);
    return {
      outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
      offset: cs.outlineOffset,
      cardRadius: cs.borderRadius,
      slotRadiusFocused: slot ? getComputedStyle(slot).borderRadius : null,
    };
  });

  // the toggle's painted ring, desktop
  await page.goto("/");
  await page.waitForSelector("button.sun-moon-toggle", { timeout: 30000 });
  await page.waitForTimeout(700);
  const toggle = page.locator("button.sun-moon-toggle").first();
  out.toggle1280 = await ringBandPerSide(page, toggle);

  // §2.7 — a cell HOVERED then keyboard-focused, the same pixels. A reading, not a gate.
  await page.goto("/?size=3"); // 9x9
  await page.waitForSelector(".board-shell .game-cell", { timeout: 40000 });
  await page.waitForTimeout(900);
  const cellBox = await page.locator(".board-shell .game-cell").nth(40).boundingBox();
  if (cellBox) {
    const clip = {
      x: Math.floor(cellBox.x - 6),
      y: Math.floor(cellBox.y - 6),
      width: Math.ceil(cellBox.width + 12),
      height: Math.ceil(cellBox.height + 12),
    };
    await page.mouse.move(cellBox.x + cellBox.width / 2, cellBox.y + cellBox.height / 2);
    await page.waitForTimeout(450);
    const hovered = await rawOf(await page.screenshot({ clip, scale: "css" }));
    await page.evaluate(() => {
      const inp = document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")[40];
      inp?.focus();
    });
    await page.keyboard.press("Shift");
    await page.waitForTimeout(450);
    const focused = await rawOf(await page.screenshot({ clip, scale: "css" }));
    const ch: { a: RGB; b: RGB }[] = [];
    for (let y = 0; y < hovered.h; y += 2)
      for (let x = 0; x < hovered.w; x += 2) {
        const a = at(hovered, x, y),
          b = at(focused, x, y);
        if (dist(a, b) > 12) ch.push({ a, b });
      }
    out.hoverThenFocus = ch.length
      ? {
          changedSamples: ch.length,
          hoveredMedian: [0, 1, 2].map((c) => med(ch.map((p) => p.a[c]))),
          focusedMedian: [0, 1, 2].map((c) => med(ch.map((p) => p.b[c]))),
          ratio: ratio(
            [0, 1, 2].map((c) => med(ch.map((p) => p.b[c]))) as RGB,
            [0, 1, 2].map((c) => med(ch.map((p) => p.a[c]))) as RGB,
          ),
        }
      : { changedSamples: 0 };
  }

  bank(`surfaces-${engine}`, out);
  console.log(`[surfaces ${engine}] ${JSON.stringify(out.deck)}`);
  console.log(`[surfaces ${engine}] toggle ring ${JSON.stringify((out.toggle1280 as any)?.outline)} worst ${(out.toggle1280 as any)?.worstRingRatio}`);
  console.log(`[surfaces ${engine}] hover->focus ${JSON.stringify(out.hoverThenFocus)}`);
  expect(out.deck).toBeTruthy();
});
