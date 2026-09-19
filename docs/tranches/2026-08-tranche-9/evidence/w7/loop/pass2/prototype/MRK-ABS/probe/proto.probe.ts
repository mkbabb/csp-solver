/**
 * T9-W7 pass 2 · MRK-ABS PROTOTYPE — the readings the prototype brief names, on the real
 * surface, both engines. Server: this lane's own dev server on 127.0.0.1:4239.
 *
 * `ringBand` is copied verbatim from ../research/MRK-ABS/instruments/ring-band.probe.ts (the
 * banked instrument) so this file carries no test of its own from that module.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import sharp from "sharp";

const OUT = process.env.PROBE_OUT ?? ".";
const FRAMES = process.env.FRAME_OUT ?? join(OUT, "..", "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const bank = (name: string, data: unknown) =>
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(data, null, 2));

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
async function raw(buf: Buffer) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
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

/** THE BANKED INSTRUMENT (verbatim). `sel` paints the ring; `focusSel` takes focus. */
async function ringBand(page: Page, sel: string, focusSel = sel) {
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(150);
  const box = await el.boundingBox().catch(() => null);
  if (!box) return { sel, found: 0 };
  const M = 40;
  const vp = page.viewportSize()!;
  const clip = {
    x: Math.max(0, Math.floor(box.x - M)),
    y: Math.max(0, Math.floor(box.y - M)),
    width: Math.min(vp.width - Math.max(0, Math.floor(box.x - M)), Math.ceil(box.width + M * 2)),
    height: Math.min(vp.height - Math.max(0, Math.floor(box.y - M)), Math.ceil(box.height + M * 2)),
  };
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(250);
  const before = await page.screenshot({ clip });
  await page.locator(focusSel).first().evaluate((n: HTMLElement) => n.focus());
  await page.waitForTimeout(450);
  const st = await el.evaluate((n: HTMLElement) => {
    const cs = getComputedStyle(n);
    return {
      outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
      colour: cs.outlineColor,
      off: parseFloat(cs.outlineOffset) || 0,
      w: parseFloat(cs.outlineWidth) || 0,
      radius: cs.borderRadius,
    };
  });
  const after = await page.screenshot({ clip });
  const A = await raw(before);
  const B = await raw(after);
  const bx = box.x - clip.x;
  const by = box.y - clip.y;
  const d = st.off + st.w / 2;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 10; i++) {
    const t = box.width * 0.2 + box.width * 0.6 * (i / 10);
    pts.push([bx + t, by - d], [bx + t, by + box.height + d]);
  }
  for (let i = 0; i <= 10; i++) {
    const t = box.height * 0.2 + box.height * 0.6 * (i / 10);
    pts.push([bx - d, by + t], [bx + box.width + d, by + t]);
  }
  const changed: { ink: RGB; ground: RGB }[] = [];
  let sampled = 0;
  for (const [fx, fy] of pts) {
    const x = Math.round(fx);
    const y = Math.round(fy);
    if (x < 0 || y < 0 || x >= A.w || y >= A.h) continue;
    sampled++;
    const a = at(A, x, y);
    const b = at(B, x, y);
    if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) > 12)
      changed.push({ ink: b, ground: a });
  }
  if (!changed.length) return { sel, found: 1, ...st, sampled, changed: 0, isTheRing: false };
  const ink = [0, 1, 2].map((c) => med(changed.map((p) => p.ink[c]))) as RGB;
  const ground = [0, 1, 2].map((c) => med(changed.map((p) => p.ground[c]))) as RGB;
  const want = parseColour(st.colour);
  const expected = want
    ? (want.rgb.map((c, i) => Math.round(want.a * c + (1 - want.a) * ground[i])) as RGB)
    : null;
  const dev = expected
    ? Math.abs(ink[0] - expected[0]) + Math.abs(ink[1] - expected[1]) + Math.abs(ink[2] - expected[2])
    : null;
  return {
    sel,
    found: 1,
    ...st,
    sampled,
    changed: changed.length,
    ink,
    ground,
    expected,
    deltaToComputed: dev,
    isTheRing: dev === null ? null : dev <= 24,
    ratio: ratio(ink, ground),
  };
}

async function setTheme(page: Page, dark: boolean) {
  await page.evaluate((d) => document.documentElement.classList.toggle("dark", d), dark);
  await page.waitForTimeout(200);
}

/** every distinct authored/UA tab stop the home route mounts, minus the DEV-only two */
const DEV_ONLY = [".tuner-toggle", ".debug-toggle"];

test("p2-1-ring-band-all", async ({ page, browserName }) => {
  const report: Record<string, unknown> = { engine: browserName, devOnlySubtracted: DEV_ONLY };
  for (const dark of [false, true]) {
    await page.goto("/");
    await page.waitForSelector(".game-cell", { timeout: 20000 });
    await setTheme(page, dark);
    await page.waitForTimeout(500);
    const sels = await page.evaluate((devOnly) => {
      const sel = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const out: string[] = [];
      const seen = new Set<string>();
      for (const n of Array.from(document.querySelectorAll<HTMLElement>(sel))) {
        if (n.closest("[inert]") || (n as HTMLInputElement).disabled) continue;
        const r = n.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        const cls = (n.className || "").toString().split(" ").filter(Boolean)[0];
        const key = cls ? `.${cls}` : n.tagName.toLowerCase();
        if (devOnly.includes(key) || seen.has(key)) continue;
        seen.add(key);
        out.push(key);
      }
      return out;
    }, DEV_ONLY);
    const rows = [];
    for (const s of sels) {
      if (s === ".cell-native-input" || s === "input") continue; // the board keeps the hand
      rows.push(await ringBand(page, s));
    }
    report[dark ? "dark" : "light"] = rows;
    for (const r of rows as { sel: string; ratio?: number; isTheRing?: boolean; outline?: string }[])
      console.log(
        `[band ${browserName} ${dark ? "dark" : "light"}] ${r.sel.padEnd(24)} ${r.ratio ?? "-"}  ring=${r.isTheRing}  ${r.outline ?? ""}`,
      );
  }
  bank(`p2-ring-band-${browserName}`, report);
});

test("p2-2-board", async ({ page, browserName }) => {
  const report: Record<string, unknown> = { engine: browserName };
  for (const dark of [true, false]) {
    const theme = dark ? "dark" : "light";
    // `size` is the SUBGRID size (persistence.ts `sizeField`), so 16x16 is ?size=4.
    await page.goto("/?size=4&difficulty=EASY");
    await page.waitForSelector(".game-cell", { timeout: 30000 });
    await page.waitForFunction(() => document.querySelectorAll(".game-cell").length === 256, {
      timeout: 90000,
    });
    await setTheme(page, dark);
    await page.waitForTimeout(900);

    // geometry: the ghost's own scale, and the board's px
    const geom = await page.evaluate(() => {
      const board = document.querySelector(".game-cell")?.closest("svg, .game-board") as HTMLElement | null;
      const cell = document.querySelector(".game-cell") as HTMLElement;
      const svg = cell.querySelector("svg") as SVGSVGElement;
      const vb = svg.getAttribute("viewBox")!.split(/\s+/).map(Number);
      const er = svg.getBoundingClientRect();
      const cr = cell.getBoundingClientRect();
      const grid = document.querySelector(".hand-drawn-grid, .grid-svg, svg[viewBox='0 0 1000 1000']") as SVGSVGElement | null;
      return {
        cellPx: [Math.round(cr.width * 100) / 100, Math.round(cr.height * 100) / 100],
        ghostElPx: [Math.round(er.width * 100) / 100, Math.round(er.height * 100) / 100],
        ghostViewBox: vb,
        pxPerGhostUnit: Math.round((er.width / vb[2]) * 1e6) / 1e6,
        boardPx: grid ? Math.round(grid.getBoundingClientRect().width * 100) / 100 : null,
        boardSel: board?.className?.toString().slice(0, 40) ?? null,
      };
    });

    // focus a middle cell by keyboard-free click, then read its resident d
    const cellIdx = 16 * 8 + 8;
    await page.locator(".game-cell").nth(cellIdx).locator("input").first().focus();
    await page.waitForTimeout(400);
    const resident = await page.evaluate((i) => {
      const cell = document.querySelectorAll(".game-cell")[i] as HTMLElement;
      const p = cell.querySelector(".cell-ghost-path") as SVGPathElement;
      const cs = getComputedStyle(p);
      const svg = cell.querySelector("svg") as SVGSVGElement;
      return {
        index: i,
        d: p.getAttribute("d"),
        viewBox: svg.getAttribute("viewBox"),
        stroke: cs.stroke,
        strokeWidth: cs.strokeWidth,
        strokeOpacity: cs.strokeOpacity,
        fillOpacity: cs.fillOpacity,
        focusVisible: (cell.querySelector("input") as HTMLElement).matches(":focus-visible"),
        inputOutline: getComputedStyle(cell.querySelector("input")!).outlineStyle,
      };
    }, cellIdx);

    // the painted ring band on the board: a scanline through the focused cell's middle row,
    // looking for RING ink and RULE ink and the gap between them.
    const cellBox = await page.locator(".game-cell").nth(cellIdx).boundingBox();
    let scan: unknown = null;
    if (cellBox) {
      const pad = 14;
      const clip = {
        x: Math.floor(cellBox.x - pad),
        y: Math.floor(cellBox.y - pad),
        width: Math.ceil(cellBox.width + pad * 2),
        height: Math.ceil(cellBox.height + pad * 2),
      };
      const shot = await page.screenshot({ clip });
      const I = await raw(shot);
      const yMid = Math.round(cellBox.height / 2 + pad);
      const line: RGB[] = [];
      for (let x = 0; x < I.w; x++) line.push(at(I, x, yMid));
      // the ground is the card: the pixel furthest from any ink, taken at the cell's centre
      const ground = at(I, Math.round(cellBox.width / 2 + pad), yMid);
      const blueness = (p: RGB) => p[2] - (p[0] + p[1]) / 2;
      const dark0 = (p: RGB) => Math.abs(lum(p) - lum(ground));
      const ringIdx: number[] = [];
      const ruleIdx: number[] = [];
      for (let x = 0; x < line.length; x++) {
        const p = line[x];
        const isBlue = blueness(p) > 14;
        const isInk = dark0(p) > 0.012;
        if (isBlue) ringIdx.push(x);
        else if (isInk) ruleIdx.push(x);
      }
      const runs = (idx: number[]) => {
        const out: [number, number][] = [];
        for (const i of idx) {
          const last = out[out.length - 1];
          if (last && i - last[1] <= 1) last[1] = i;
          else out.push([i, i]);
        }
        return out;
      };
      const rr = runs(ringIdx);
      const gr = runs(ruleIdx);
      let minGap: number | null = null;
      for (const a of rr)
        for (const b of gr) {
          const gap = a[0] > b[1] ? a[0] - b[1] - 1 : b[0] > a[1] ? b[0] - a[1] - 1 : -1;
          if (minGap === null || gap < minGap) minGap = gap;
        }
      scan = {
        y: yMid,
        ground,
        ringRuns: rr,
        ruleRuns: gr,
        minGapPx: minGap,
        disjoint: minGap !== null ? minGap >= 1 : null,
        ringInk: rr.length ? med(ringIdx.map((x) => lum(line[x]) * 1000)) / 1000 : null,
        ringRatio: rr.length
          ? ratio(
              [0, 1, 2].map((c) => med(ringIdx.map((x) => line[x][c]))) as RGB,
              ground,
            )
          : null,
      };
    }
    report[theme] = { geom, resident, scan };
    console.log(
      `[board ${browserName} ${theme}] ghost px/unit ${geom.pxPerGhostUnit} · ring ratio ${(scan as { ringRatio?: number })?.ringRatio} · gap ${(scan as { minGapPx?: number })?.minGapPx}px`,
    );

    // CROP 1 (dark, chromium): the focused cell and its four neighbours at 16x16
    if (dark && browserName === "chromium" && cellBox) {
      await page.screenshot({
        path: join(FRAMES, "crop1-cell-16x16-dark-f086.png"),
        clip: {
          x: Math.floor(cellBox.x - cellBox.width),
          y: Math.floor(cellBox.y - cellBox.height),
          width: Math.ceil(cellBox.width * 3),
          height: Math.ceil(cellBox.height * 3),
        },
        scale: "css",
      });
    }
  }
  bank(`p2-board-${browserName}`, report);
});

test("p2-3-deck-radius", async ({ page, browserName }) => {
  const report: Record<string, unknown> = { engine: browserName };
  for (const dark of [false, true]) {
    await page.goto("/?view=gallery");
    await page.waitForSelector(".gallery-viewport", { timeout: 20000 });
    await setTheme(page, dark);
    await page.waitForTimeout(800);
    const blurred = await page.evaluate(() => {
      const slot = document.querySelector(".live-face-slot") as HTMLElement | null;
      const centre = document.querySelector(".game-card.is-center") as HTMLElement | null;
      return {
        slotRadius: slot ? getComputedStyle(slot).borderRadius : null,
        centreRadius: centre ? getComputedStyle(centre).borderRadius : null,
        centreOutline: centre ? getComputedStyle(centre).outlineStyle : null,
      };
    });
    await page.evaluate(() => (document.querySelector(".gallery-viewport") as HTMLElement)?.focus());
    await page.waitForTimeout(500);
    const focused = await page.evaluate(() => {
      const vp = document.querySelector(".gallery-viewport") as HTMLElement;
      const slot = document.querySelector(".live-face-slot") as HTMLElement | null;
      const cards = Array.from(document.querySelectorAll(".game-card")) as HTMLElement[];
      const centre = document.querySelector(".game-card.is-center") as HTMLElement | null;
      const vr = vp.getBoundingClientRect();
      const measure = (c: HTMLElement) => {
        const cs = getComputedStyle(c);
        const r = c.getBoundingClientRect();
        const off = parseFloat(cs.outlineOffset) || 0;
        const w = parseFloat(cs.outlineWidth) || 0;
        const reach = off + w;
        const air = Math.min(r.left - vr.left, vr.right - r.right);
        return {
          outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
          offset: cs.outlineOffset,
          radius: cs.borderRadius,
          reach,
          air: Math.round(air * 100) / 100,
          headroom: Math.round((air - reach) * 100) / 100,
          whole: air >= reach,
        };
      };
      return {
        activeDescendant: vp.getAttribute("aria-activedescendant"),
        viewportOutlineStyle: getComputedStyle(vp).outlineStyle,
        slotRadius: slot ? getComputedStyle(slot).borderRadius : null,
        centre: centre ? measure(centre) : null,
        ends: [measure(cards[0]), measure(cards[cards.length - 1])],
        ownersWithRing: cards.filter((c) => getComputedStyle(c).outlineStyle !== "none").length,
      };
    });
    report[dark ? "dark" : "light"] = {
      blurred,
      focused,
      slotRadiusUnchanged: blurred.slotRadius === focused.slotRadius,
    };
    console.log(
      `[deck ${browserName} ${dark ? "dark" : "light"}] slot radius ${blurred.slotRadius} -> ${focused.slotRadius} · centre ${JSON.stringify(focused.centre)}`,
    );
    // CROP 3 (light, webkit): the deck's centre card focused
    if (!dark && browserName === "webkit") {
      const box = await page.locator(".game-card.is-center").first().boundingBox();
      if (box)
        await page.screenshot({
          path: join(FRAMES, "crop3-deck-centre-light-webkit.png"),
          clip: {
            x: Math.max(0, Math.floor(box.x - 18)),
            y: Math.max(0, Math.floor(box.y - 18)),
            width: Math.ceil(box.width + 36),
            height: Math.ceil(Math.min(box.height + 36, 300)),
          },
          scale: "css",
        });
    }
  }
  bank(`p2-deck-${browserName}`, report);
});

test("p2-4-guard-face", async ({ page, browserName }) => {
  // ARM IT BY HAND: write a digit, open the deck from the wordmark, arrow to another game, Enter.
  const report: Record<string, unknown> = { engine: browserName };
  await page.goto("/");
  await page.waitForSelector(".game-cell input", { timeout: 20000 });
  await setTheme(page, true);
  await page.waitForTimeout(600);
  const idx = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".game-cell input"));
    const i = inputs.findIndex((n) => !n.value && !n.readOnly && !n.disabled);
    if (i >= 0) inputs[i].focus();
    return i;
  });
  await page.waitForTimeout(250);
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  report.dirtied = await page.evaluate((i) => {
    const inputs = Array.from(document.querySelectorAll<HTMLInputElement>(".game-cell input"));
    return {
      cell: i,
      wrote: i >= 0 ? inputs[i].value : null,
      nonEmpty: inputs.filter((n) => n.value).length,
    };
  }, idx);
  await page.locator(".logo-trigger").first().click();
  await page.waitForSelector(".gallery-viewport", { timeout: 20000 });
  await page.waitForTimeout(900);
  // The SELECT guard arms only on a shared table (GameGallery `attemptSelect`); the solo arm
  // lives on the DEAL verb, which genuinely writes over the marks (`attemptDeal`).
  await page.locator(".staging-deal").first().click();
  await page.waitForTimeout(1100);
  // Chromium grants :focus-visible to a programmatic focus only when the last input modality
  // was the keyboard, and the deal verb was CLICKED — so the guard's verbs are reached by Tab.
  for (let i = 0; i < 10; i++) {
    const on = await page.evaluate(() =>
      (document.activeElement as HTMLElement)?.classList?.contains("guard-btn"),
    );
    if (on) break;
    await page.keyboard.press("Tab");
    await page.waitForTimeout(150);
  }
  const armed = await page.locator(".guard-btn").count();
  report.armed = armed;
  if (armed) {
    // The band, read WITHOUT a programmatic blur: `Shift+Tab` away and `Tab` back keeps the
    // keyboard modality that :focus-visible depends on.
    const face = page.locator(".guard-btn .guard-face").first();
    const gbox = (await face.boundingBox())!;
    const M = 30;
    const vpz = page.viewportSize()!;
    const gclip = {
      x: Math.max(0, Math.floor(gbox.x - M)),
      y: Math.max(0, Math.floor(gbox.y - M)),
      width: Math.min(vpz.width - Math.max(0, Math.floor(gbox.x - M)), Math.ceil(gbox.width + M * 2)),
      height: Math.min(vpz.height - Math.max(0, Math.floor(gbox.y - M)), Math.ceil(gbox.height + M * 2)),
    };
    const gAfter = await page.screenshot({ clip: gclip });
    const gst = await face.evaluate((n: HTMLElement) => {
      const cs = getComputedStyle(n);
      return {
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
        colour: cs.outlineColor,
        off: parseFloat(cs.outlineOffset) || 0,
        w: parseFloat(cs.outlineWidth) || 0,
        radius: cs.borderRadius,
      };
    });
    await page.keyboard.press("Shift+Tab");
    await page.waitForTimeout(450);
    const gBefore = await page.screenshot({ clip: gclip });
    await page.keyboard.press("Tab");
    await page.waitForTimeout(350);
    const GA = await raw(gBefore);
    const GB = await raw(gAfter);
    const gbx = gbox.x - gclip.x;
    const gby = gbox.y - gclip.y;
    const gd = gst.off + gst.w / 2;
    const gpts: [number, number][] = [];
    for (let i = 0; i <= 10; i++) {
      const tw = gbox.width * 0.2 + gbox.width * 0.6 * (i / 10);
      const th = gbox.height * 0.2 + gbox.height * 0.6 * (i / 10);
      gpts.push([gbx + tw, gby - gd], [gbx + tw, gby + gbox.height + gd], [gbx - gd, gby + th], [gbx + gbox.width + gd, gby + th]);
    }
    const gchanged: { ink: RGB; ground: RGB }[] = [];
    let gsampled = 0;
    for (const [fx, fy] of gpts) {
      const x = Math.round(fx);
      const y = Math.round(fy);
      if (x < 0 || y < 0 || x >= GA.w || y >= GA.h) continue;
      gsampled++;
      const a = at(GA, x, y);
      const b = at(GB, x, y);
      if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) > 12)
        gchanged.push({ ink: b, ground: a });
    }
    const gink = gchanged.length ? ([0, 1, 2].map((c) => med(gchanged.map((p) => p.ink[c]))) as RGB) : null;
    const gground = gchanged.length ? ([0, 1, 2].map((c) => med(gchanged.map((p) => p.ground[c]))) as RGB) : null;
    const gwant = parseColour(gst.colour);
    const gexp =
      gwant && gground
        ? (gwant.rgb.map((c, i) => Math.round(gwant.a * c + (1 - gwant.a) * gground[i])) as RGB)
        : null;
    const gdev =
      gexp && gink ? Math.abs(gink[0] - gexp[0]) + Math.abs(gink[1] - gexp[1]) + Math.abs(gink[2] - gexp[2]) : null;
    const band = {
      sel: ".guard-btn .guard-face",
      ...gst,
      sampled: gsampled,
      changed: gchanged.length,
      ink: gink,
      ground: gground,
      expected: gexp,
      deltaToComputed: gdev,
      isTheRing: gdev === null ? null : gdev <= 24,
      ratio: gink && gground ? ratio(gink, gground) : null,
    };
    report.keyboardFocused = await page.evaluate(() => {
      const b = document.querySelector(".guard-btn") as HTMLElement;
      b.focus();
      return { focusVisible: b.matches(":focus-visible"), active: document.activeElement === b };
    });
    const facts = await page.evaluate(() => {
      const b = document.querySelector(".guard-btn") as HTMLElement;
      const f = b.querySelector(".guard-face") as HTMLElement;
      const cs = getComputedStyle(f);
      return {
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
        offset: cs.outlineOffset,
        radius: cs.borderRadius,
        focusVisible: b.matches(":focus-visible"),
        stops: document.querySelectorAll(".guard-btn").length,
      };
    });
    report.band = band;
    report.facts = facts;
    console.log(`[guard ${browserName}] ${JSON.stringify(facts)} band ratio ${(band as { ratio?: number }).ratio}`);
    if (browserName === "chromium") {
      const box = await page.locator(".guard-btn").first().boundingBox();
      if (box)
        await page.screenshot({
          path: join(FRAMES, "crop4-guard-face-dark.png"),
          clip: {
            x: Math.max(0, Math.floor(box.x - 22)),
            y: Math.max(0, Math.floor(box.y - 22)),
            width: Math.ceil(box.width + 44),
            height: Math.ceil(box.height + 44),
          },
          scale: "css",
        });
    }
  } else {
    console.log(`[guard ${browserName}] NOT ARMED — ${(await page.locator("body").innerText()).slice(0, 160)}`);
  }
  bank(`p2-guard-${browserName}`, report);
});

test("p2-5-toggle-and-mobile", async ({ page, browserName }) => {
  const report: Record<string, unknown> = { engine: browserName };
  for (const vp of [
    { width: 1280, height: 800 },
    { width: 393, height: 699 },
  ]) {
    await page.setViewportSize(vp);
    const key = `${vp.width}x${vp.height}`;
    const per: Record<string, unknown> = {};
    for (const dark of [false, true]) {
      await page.goto("/");
      await page.waitForSelector(".game-cell", { timeout: 20000 });
      await setTheme(page, dark);
      await page.waitForTimeout(500);
      const band = await ringBand(page, ".sun-moon-toggle");
      const facts = await page.evaluate(() => {
        const t = document.querySelector(".sun-moon-toggle") as HTMLElement;
        t.focus();
        const cs = getComputedStyle(t);
        return {
          outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
          offset: cs.outlineOffset,
          bleed: getComputedStyle(t).getPropertyValue("--toggle-bleed"),
        };
      });
      per[dark ? "dark" : "light"] = { band, facts };
      console.log(
        `[toggle ${browserName} ${key} ${dark ? "dark" : "light"}] ${facts.outline} off ${facts.offset} · band ${(band as { ratio?: number }).ratio} changed ${(band as { changed?: number }).changed}`,
      );
    }
    report[key] = per;
  }
  bank(`p2-toggle-${browserName}`, report);
});

test("p2-6-dock-sheet-open", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 393, height: 699 });
  const report: Record<string, unknown> = { engine: browserName };
  for (const dark of [false, true]) {
    await page.goto("/");
    await page.waitForSelector(".game-cell", { timeout: 20000 });
    await setTheme(page, dark);
    await page.waitForTimeout(500);
    const shutTongue = await page.evaluate(() => {
      const t = document.querySelector(".drawer-tab") as HTMLElement | null;
      if (!t) return null;
      const cs = getComputedStyle(t);
      const r = t.getBoundingClientRect();
      return {
        rect: [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 100) / 100),
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
        offset: cs.outlineOffset,
      };
    });
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(900); // THE SHEET SLIDES
    const open = await page.evaluate(() => {
      const clipper = document.querySelector(".controls-card") as HTMLElement | null;
      if (!clipper) return { found: false };
      const cr = clipper.getBoundingClientRect();
      const stops = Array.from(
        clipper.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      ) as HTMLElement[];
      const rows = stops.map((n) => {
        const cs = getComputedStyle(n);
        const r = n.getBoundingClientRect();
        const reach = (parseFloat(cs.outlineOffset) || 0) + (parseFloat(cs.outlineWidth) || 0);
        const clear = Math.min(r.left - cr.left, cr.right - r.right, r.top - cr.top, cr.bottom - r.bottom);
        return {
          cls: (n.className || "").toString().split(" ").filter(Boolean).slice(0, 2).join("."),
          display: cs.display,
          reachable: cs.display !== "none" && r.width > 0 && r.height > 0,
          outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
          offset: cs.outlineOffset,
          reach,
          clear: Math.round(clear * 100) / 100,
          whole: clear >= reach,
        };
      });
      return {
        found: true,
        clipperOverflow: getComputedStyle(clipper).overflow,
        stops: rows.length,
        reachable: rows.filter((r) => r.reachable).length,
        displayNone: rows.filter((r) => r.display === "none").length,
        notWhole: rows.filter((r) => r.reachable && !r.whole),
        tightest: rows
          .filter((r) => r.reachable && r.whole)
          .sort((a, b) => a.clear - b.clear)
          .slice(0, 3),
        rows,
      };
    });
    report[dark ? "dark" : "light"] = { shutTongue, open };
    const o = open as { stops?: number; reachable?: number; notWhole?: unknown[] };
    console.log(
      `[dock ${browserName} ${dark ? "dark" : "light"}] ${o.stops} stops / ${o.reachable} reachable · not WHOLE: ${JSON.stringify(o.notWhole)}`,
    );
  }
  bank(`p2-dock-${browserName}`, report);
});
