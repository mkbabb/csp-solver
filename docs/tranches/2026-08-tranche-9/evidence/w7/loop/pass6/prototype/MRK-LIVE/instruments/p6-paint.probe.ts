/**
 * T9-W7 pass 5 · MRK-LIVE · THE PAINTED RING, priced (charter rows 8, 11; leader duty §2.6).
 *
 * COPIED RECIPES, each named: MRK-ABS critic's `readRing` (ring-OFF = the same pixels with focus
 * blurred; max-changed pixel per sample; `mintSudoku` real payload); PAL-TIN critic's CORE
 * DISTRIBUTION (max / p30 / median / fraction < 3.0 over every sample); PAL-WALK's `isTheRing`
 * (the core ink must sit within 24 of what the cascade says it composites to, or the number is
 * not believed); LAWS' sensitivity row (worst scan at 50/70/90/100 % of the median core change
 * + the share of scans under 3.0). CTRL-FACE's ring-differencing is the CHROME arm: ring shown
 * vs `.focus-ring{visibility:hidden}` on the SAME focus, after the colour settles.
 *
 * Sampling is ALONG THE PATH (`getPointAtLength` → screen), a perpendicular scan at each of 60
 * stations, so a wobbling hand-drawn line is found where it is rather than where a box says.
 *
 * PASS 6 COPY: OUT re-pointed to scratch; a dropped station COUNTS as under 3 (MRK-ABS's critic:
 * n/60 printed, fracUnder3All over all 60); MRKLIVE_PRM=reduce parks the boil for the arm.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs";

// PASS 6: raw JSON goes to the lane's scratch (never banked whole); the log lines are the record.
const OUT = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mrklive-p6/paint-json";
const PRM = (process.env.MRKLIVE_PRM ?? "no-preference") as "reduce" | "no-preference";
const TAG = process.env.MRKLIVE_TAG ?? "lane";
fs.mkdirSync(OUT, { recursive: true });
type RGB = number[];
const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};
const Lum = (c: RGB) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
const ratio = (a: RGB, b: RGB) => {
  const x = Lum(a),
    y = Lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const d1 = (a: RGB, b: RGB) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const d2 = (a: RGB, b: RGB) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const q = (v: number[], p: number) =>
  v.length ? [...v].sort((x, y) => x - y)[Math.min(v.length - 1, Math.floor(p * v.length))] : NaN;
const r3 = (x: number) => Math.round(x * 1000) / 1000;
const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** ABS critic's minter, verbatim: `toBase64Url("\x01" + "<size>.<cells base36>")`, cells 0 and
 *  1 held EMPTY (the frame crossing and the paper cell). */
export function mintSudoku(sub: number): string {
  const n = sub * sub;
  let cells = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const i = r * n + c;
      const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1;
      const keep = i > 1 && (r * 7 + c * 3) % 5 < 2;
      cells += (keep ? v : 0).toString(36);
    }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}

async function setTheme(page: Page, want: "light" | "dark") {
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  if ((await isDark()) === (want === "dark")) return;
  await page.locator("button.sun-moon-toggle").first().evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Enter");
  await expect.poll(isDark, { timeout: 10000 }).toBe(want === "dark");
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(900);
}
async function inject(page: Page, css: string, id = "mrklive-arm") {
  await page.evaluate(
    ({ css, id }) => {
      document.getElementById(id)?.remove();
      if (!css) return;
      const s = document.createElement("style");
      s.id = id;
      s.textContent = css;
      document.head.appendChild(s);
    },
    { css, id },
  );
}
const twoFrames = (page: Page) =>
  page.evaluate(
    () => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))),
  );
async function grab(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const buf = await page.screenshot({ clip, scale: "css" });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return (x: number, y: number): RGB | null => {
    const px = Math.round(x - clip.x),
      py = Math.round(y - clip.y);
    if (px < 0 || py < 0 || px >= info.width || py >= info.height) return null;
    const o = (py * info.width + px) * 4;
    return [data[o], data[o + 1], data[o + 2]];
  };
}

/** 60 stations along the VISIBLE path of `sel`, with the inward normal (toward the path's own
 *  bbox centre) in screen px. */
const stations = (page: Page, sel: string) =>
  page.evaluate((sel) => {
    const paths = Array.from(document.querySelectorAll<SVGPathElement>(sel)).filter(
      (p) => getComputedStyle(p).opacity !== "0",
    );
    const p = paths[0];
    if (!p) return null;
    const m = p.getScreenCTM()!;
    const T = (x: number, y: number) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
    const L = p.getTotalLength();
    const bb = p.getBBox();
    const [cx, cy] = T(bb.x + bb.width / 2, bb.y + bb.height / 2);
    const out: { x: number; y: number; nx: number; ny: number }[] = [];
    for (let k = 0; k < 60; k++) {
      const t = ((k + 0.5) / 60) * L;
      const a = p.getPointAtLength(Math.max(0, t - 0.5));
      const b = p.getPointAtLength(Math.min(L, t + 0.5));
      const c = p.getPointAtLength(t);
      const [x, y] = T(c.x, c.y);
      const [ax, ay] = T(a.x, a.y);
      const [bx, by] = T(b.x, b.y);
      let nx = -(by - ay),
        ny = bx - ax;
      const n = Math.hypot(nx, ny) || 1;
      nx /= n;
      ny /= n;
      if ((cx - x) * nx + (cy - y) * ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      out.push({ x, y, nx, ny });
    }
    const cs = getComputedStyle(p);
    const sw = parseFloat(cs.strokeWidth) * Math.hypot(m.a, m.b);
    return { st: out, strokePx: sw, strokeOpacity: cs.strokeOpacity, stroke: cs.stroke };
  }, sel);

type Scan = { d: number; r: number; px: RGB }[];
/** Read one ring from two photographs: OFF (before) and ON (after). */
function price(
  before: (x: number, y: number) => RGB | null,
  after: (x: number, y: number) => RGB | null,
  st: { x: number; y: number; nx: number; ny: number }[],
  strokePx: number,
  expectInk: RGB | null,
  op: number,
) {
  const R = Math.max(5, strokePx * 1.5);
  const scans: Scan[] = [];
  const core: { r: number; rIn: number | null; px: RGB; ground: RGB }[] = [];
  for (const s of st) {
    const scan: Scan = [];
    let best: { d: number; r: number; px: RGB; ground: RGB; t: number } | null = null;
    for (let t = -R; t <= R; t += 0.5) {
      const x = s.x + s.nx * t,
        y = s.y + s.ny * t;
      const a = after(x, y),
        b = before(x, y);
      if (!a || !b) continue;
      const d = d1(a, b);
      const r = ratio(a, b);
      scan.push({ d, r, px: a });
      if (!best || d > best.d) best = { d, r, px: a, ground: b, t };
    }
    scans.push(scan);
    if (best && best.d >= 8) {
      // THE GROUND IT ABUTS ON THE INSIDE: the ON frame one half-stroke + 2px inward of the core.
      const k = best.t + strokePx / 2 + 2;
      const inside = after(s.x + s.nx * k, s.y + s.ny * k);
      // An inward sample that lands back on ink (a corner, the opposite side of a small ring)
      // is not a ground: dropped, never replaced.
      const ground = inside && d2(inside, best.px) >= 30 ? inside : null;
      core.push({
        r: best.r,
        rIn: ground ? ratio(best.px, ground) : null,
        px: best.px,
        ground: best.ground,
      });
    }
  }
  const rs = core.map((c) => c.r);
  const ins = core.map((c) => c.rIn).filter((v): v is number => v !== null);
  const med = (v: number[]) => q(v, 0.5);
  const inkMed = [0, 1, 2].map((i) => med(core.map((c) => c.px[i])));
  const groundMed = [0, 1, 2].map((i) => med(core.map((c) => c.ground[i])));
  // WALK's isTheRing: the core ink against the cascade's own composite over the measured ground.
  const composite = expectInk
    ? groundMed.map((g, i) => Math.round(g * (1 - op) + expectInk[i] * op))
    : null;
  const delta = composite ? d2(inkMed, composite) : null;
  const M = med(scans.map((s) => Math.max(0, ...s.map((p) => p.d))));
  const sens = [0.5, 0.7, 0.9, 1.0].map((f) => {
    const per = scans
      .map((s) => s.filter((p) => p.d >= f * M * 0.999))
      .filter((c) => c.length)
      .map((c) => Math.min(...c.map((p) => p.r)));
    return {
      at: `${Math.round(f * 100)}%`,
      worst: per.length ? r3(Math.min(...per)) : null,
      // a scan with no pixel at this mass is a station UNDER the floor, never a silent drop
      under3: `${per.filter((v) => v < 3).length + (scans.length - per.length)}/${scans.length}`,
    };
  });
  const dropped = st.length - core.length;
  return {
    painted: core.length,
    stations: st.length,
    fracUnder3All: r3((rs.filter((v) => v < 3).length + dropped) / (st.length || 1)),
    vsOff: {
      max: r3(Math.max(...rs)),
      p30: r3(q(rs, 0.3)),
      median: r3(med(rs)),
      worst: r3(Math.min(...rs)),
      fracUnder3: r3(rs.filter((v) => v < 3).length / (rs.length || 1)),
    },
    vsInside: ins.length
      ? {
          p30: r3(q(ins, 0.3)),
          median: r3(med(ins)),
          worst: r3(Math.min(...ins)),
          fracUnder3: r3(ins.filter((v) => v < 3).length / ins.length),
        }
      : null,
    sensitivity: sens,
    inkMed,
    groundMed,
    composite,
    isTheRing: delta === null ? null : delta <= 24,
    deltaToComposite: delta === null ? null : r3(delta),
  };
}

/** THE BOARD STOP: tier 2 on cell `idx`, ring-OFF = the same cell blurred. */
async function readBoard(page: Page, idx: number, css: string, inkHex: string, op: number) {
  const box = await page.locator(".board-shell .game-cell").nth(idx).boundingBox();
  if (!box) throw new Error("no cell " + idx);
  const clip = {
    x: Math.floor(box.x - 20),
    y: Math.floor(box.y - 20),
    width: Math.ceil(box.width + 40),
    height: Math.ceil(box.height + 40),
  };
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await inject(page, css);
  await page.waitForTimeout(300);
  const before = await grab(page, clip);
  await page.evaluate((i) => {
    document
      .querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")
      [i]?.focus();
  }, idx);
  await page.keyboard.press("Shift");
  await page.waitForTimeout(500);
  await page.evaluate((i) => {
    document.querySelectorAll(".board-shell .game-cell")[i]?.setAttribute("data-mrklive-cell", "");
  }, idx);
  const G = await stations(page, "[data-mrklive-cell] .cell-ghost-path");
  const after = await grab(page, clip);
  await page.evaluate(() => {
    (document.activeElement as HTMLElement)?.blur?.();
    document.querySelector("[data-mrklive-cell]")?.removeAttribute("data-mrklive-cell");
  });
  await inject(page, "");
  if (!G) return { error: "no path" };
  return {
    so: G.strokeOpacity,
    ...price(before, after, G.st, G.strokePx, hex(inkHex), op),
  };
}

/** THE CHROME STOP: FocusRing on `sel`; ring-OFF = the SAME focus with the ring hidden. */
async function readChrome(page: Page, sel: string) {
  await page.keyboard.press("Tab");
  await page.evaluate((s) => document.querySelector<HTMLElement>(s)?.focus({ preventScroll: true }), sel);
  await page.waitForTimeout(900);
  const ringBox = await page.evaluate(() => {
    const r = document.querySelector(".focus-ring")?.getBoundingClientRect();
    return r ? { x: r.x, y: r.y, w: r.width, h: r.height } : null;
  });
  if (!ringBox) return { error: "no ring on " + sel };
  const clip = {
    x: Math.max(0, Math.floor(ringBox.x - 12)),
    y: Math.max(0, Math.floor(ringBox.y - 12)),
    width: Math.ceil(ringBox.w + 24),
    height: Math.ceil(ringBox.h + 24),
  };
  const G = await stations(page, ".focus-ring path");
  const after = await grab(page, clip);
  await inject(page, ".focus-ring{visibility:hidden!important}", "mrklive-off");
  await twoFrames(page);
  const before = await grab(page, clip);
  await inject(page, "", "mrklive-off");
  const ink = await page.evaluate(() => {
    const p = document.querySelector(".focus-ring");
    const c = p ? getComputedStyle(p).stroke : "";
    const m = c.match(/\d+/g);
    return m ? m.slice(0, 3).map(Number) : null;
  });
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  if (!G) return { error: "no ring path" };
  const pr = price(before, after, G.st, G.strokePx, ink, 1);
  return { so: G.strokeOpacity, ...pr };
}

const ARMS: Record<"light" | "dark", string[]> = {
  light: ["#3a7bc4", "#4589d2"],
  dark: ["#3a7bc4", "#2f68aa", "#306cb0"],
};

test("P6-PAINT · the tier-2 ring × arm × opacity, frame and paper, 16×16", async ({ page }, info) => {
  test.setTimeout(900000);
  const engine = info.project.name;
  await page.emulateMedia({ reducedMotion: PRM });
  const payload = mintSudoku(4);
  await page.goto(`/?size=4&board=${payload}`);
  await expect
    .poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 })
    .toBe(256);
  const given = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".board-shell .game-cell input")).filter(
      (i) => (i as HTMLInputElement).value,
    ).length,
  );
  await page.waitForTimeout(900);
  const rows: Record<string, unknown>[] = [];
  for (const theme of ["light", "dark"] as const) {
    await setTheme(page, theme);
    for (const op of [0.95, 1])
      for (const h of ARMS[theme])
        for (const cell of [0, 1]) {
          const css = `:root,.dark{--color-focus-sketch:${h}!important} .game-cell:has(input:focus-visible) .cell-ghost-path{stroke-opacity:${op}!important}`;
          const r = await readBoard(page, cell, css, h, op);
          const row = { engine, theme, op, hex: h, arm: h === "#3a7bc4" ? "alias" : "two-value", on: cell === 0 ? "FRAME" : "paper", ...r };
          rows.push(row);
          console.log("ROW " + JSON.stringify({ tag: TAG, prm: PRM, engine, theme, op, hex: h, on: row.on, n: `${(r as any).painted}/${(r as any).stations}`, fracAll: (r as any).fracUnder3All, vsOff: (r as any).vsOff, vsIn: (r as any).vsInside, sens: (r as any).sensitivity?.map((s: any) => s.at + " " + s.worst + " " + s.under3).join(" | "), isTheRing: (r as any).isTheRing, d: (r as any).deltaToComposite }));
        }
  }
  fs.writeFileSync(`${OUT}/P6-paint-board16-${TAG}-${PRM}-${engine}.json`, JSON.stringify({ payload, given, rows }, null, 1));
  expect(rows.length).toBe(20);
});

test("P6-PAINT · the shipped tier-2 ring on the 9×9 route, and the chrome ring, both themes", async ({ page }, info) => {
  test.setTimeout(600000);
  const engine = info.project.name;
  await page.emulateMedia({ reducedMotion: PRM });
  const payload = mintSudoku(3);
  await page.goto(`/?size=3&board=${payload}`);
  await expect
    .poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 })
    .toBe(81);
  await page.waitForTimeout(900);
  const rows: Record<string, unknown>[] = [];
  for (const theme of ["light", "dark"] as const) {
    await setTheme(page, theme);
    const inkHex = "#3a7bc4";
    for (const cell of [0, 40]) {
      const r = await readBoard(page, cell, "", inkHex, 0.95);
      rows.push({ engine, theme, subject: `board 9x9 cell ${cell}`, ...r });
      console.log("ROW " + JSON.stringify({ tag: TAG, prm: PRM, engine, theme, subject: `board cell ${cell}`, n: `${(r as any).painted}/${(r as any).stations}`, fracAll: (r as any).fracUnder3All, vsOff: (r as any).vsOff, vsIn: (r as any).vsInside, sens: (r as any).sensitivity?.map((s: any) => s.at + " " + s.worst + " " + s.under3).join(" | "), isTheRing: (r as any).isTheRing, d: (r as any).deltaToComposite }));
    }
    for (const sel of ["button.logo-trigger", ".drawer-tab", ".controls-card button"]) {
      if (!(await page.locator(sel).count())) {
        rows.push({ engine, theme, subject: sel, error: "absent" });
        continue;
      }
      const r = await readChrome(page, sel);
      rows.push({ engine, theme, subject: sel, ...r });
      console.log("ROW " + JSON.stringify({ tag: TAG, prm: PRM, engine, theme, subject: sel, n: `${(r as any).painted}/${(r as any).stations}`, fracAll: (r as any).fracUnder3All, vsOff: (r as any).vsOff, vsIn: (r as any).vsInside, sens: (r as any).sensitivity?.map((s: any) => s.at + " " + s.worst + " " + s.under3).join(" | "), isTheRing: (r as any).isTheRing, d: (r as any).deltaToComposite, err: (r as any).error }));
    }
  }
  fs.writeFileSync(`${OUT}/P6-paint-9x9-chrome-${TAG}-${PRM}-${engine}.json`, JSON.stringify({ payload, rows }, null, 1));
  expect(rows.length).toBeGreaterThan(0);
});

/** LAW 39's TAB (the chair's row, read by this lane): the drawer tab's indicator at 1280×800 fine,
 *  the boil PARKED (reduce), both themes. The lane draws FocusRing on it; the control 74a2b5d9
 *  draws `outline: 2px dashed currentColor` offset 3. Stations: the ring's own path on the lane;
 *  on the control the outline's centre line (the box grown by offset + width/2), 60 along the
 *  perimeter, inward normals. ON = keyboard focus; OFF = the same focus with both forms struck. */
test("P6-LAW39 · the drawer tab's indicator, boil parked, both themes", async ({ page }, info) => {
  test.setTimeout(300000);
  const engine = info.project.name;
  await page.emulateMedia({ reducedMotion: "reduce" });
  const payload = mintSudoku(3);
  await page.goto(`/?size=3&board=${payload}`);
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(81);
  await page.waitForTimeout(900);
  for (const theme of ["light", "dark"] as const) {
    await setTheme(page, theme);
    for (const run of [1, 2]) {
      await page.keyboard.press("Tab");
      await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }));
      await page.waitForTimeout(700);
      const geo = await page.evaluate(() => {
        const t = document.querySelector<HTMLElement>(".drawer-tab")!;
        const r = t.getBoundingClientRect();
        const cs = getComputedStyle(t);
        return {
          fv: t.matches(":focus-visible"),
          ring: !!document.querySelector(".focus-ring path"),
          outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor} +${cs.outlineOffset}`,
          grow: parseFloat(cs.outlineOffset || "0") + parseFloat(cs.outlineWidth || "0") / 2,
          box: { x: r.x, y: r.y, w: r.width, h: r.height },
        };
      });
      const G = geo.ring ? await stations(page, ".focus-ring path") : null;
      let st: { x: number; y: number; nx: number; ny: number }[];
      let strokePx: number;
      if (G) {
        st = G.st;
        strokePx = G.strokePx;
      } else {
        const g = geo.grow;
        const x0 = geo.box.x - g, y0 = geo.box.y - g, x1 = geo.box.x + geo.box.w + g, y1 = geo.box.y + geo.box.h + g;
        const P = 2 * (x1 - x0) + 2 * (y1 - y0);
        st = [];
        for (let k = 0; k < 60; k++) {
          let d = ((k + 0.5) / 60) * P;
          if (d < x1 - x0) { st.push({ x: x0 + d, y: y0, nx: 0, ny: 1 }); continue; }
          d -= x1 - x0;
          if (d < y1 - y0) { st.push({ x: x1, y: y0 + d, nx: -1, ny: 0 }); continue; }
          d -= y1 - y0;
          if (d < x1 - x0) { st.push({ x: x1 - d, y: y1, nx: 0, ny: -1 }); continue; }
          d -= x1 - x0;
          st.push({ x: x0, y: y1 - d, nx: 1, ny: 0 });
        }
        strokePx = 2;
      }
      const pad = 16;
      const clip = {
        x: Math.max(0, Math.floor(geo.box.x - pad)),
        y: Math.max(0, Math.floor(geo.box.y - pad)),
        width: Math.ceil(geo.box.w + 2 * pad),
        height: Math.ceil(geo.box.h + 2 * pad),
      };
      const after = await grab(page, clip);
      await inject(page, ".focus-ring{visibility:hidden!important} .drawer-tab{outline-style:none!important}", "mrklive-off");
      await twoFrames(page);
      const before = await grab(page, clip);
      await inject(page, "", "mrklive-off");
      const pr = price(before, after, st, strokePx, null, 1);
      console.log("LAW39 " + JSON.stringify({ tag: TAG, engine, theme, run, fv: geo.fv, form: G ? "drawn ring" : geo.outline, n: `${pr.painted}/${pr.stations}`, fracAll: pr.fracUnder3All, vsOff: pr.vsOff, sens: pr.sensitivity.map((s) => s.at + " " + s.worst + " " + s.under3).join(" | ") }));
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
      await page.waitForTimeout(300);
    }
  }
});
