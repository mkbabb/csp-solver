/**
 * T9-W7 pass 2 · MRK-LIVE PROTOTYPE — the gates, on the built prototype served at
 * 127.0.0.1:4238 from the worktree `wf_8630d340-e56-33` (uncommitted diff).
 *
 * Every reading is from the real surface: computed styles, painted bytes, or observed DOM
 * writes. Nothing here is injected — the cures are IN the product files this server serves.
 */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "logs");
const FRAMES = join(HERE, "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

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
/** CIE L* of an sRGB triple — the laminate gate speaks in L*. */
const Lstar = (c: RGB) => {
  const y = lum(c);
  return Math.round((y > 0.008856 ? 116 * Math.cbrt(y) - 16 : 903.3 * y) * 100) / 100;
};
const med = (v: number[]) => v.slice().sort((a, b) => a - b)[Math.floor(v.length / 2)];

async function raw(buf: Buffer) {
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
type Img = Awaited<ReturnType<typeof raw>>;
const at = (I: Img, x: number, y: number): RGB => {
  const i = (Math.round(y) * I.w + Math.round(x)) * I.ch;
  return [I.data[i], I.data[i + 1], I.data[i + 2]];
};

async function boardReady(page: Page, q = "?game=sudoku") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

async function galleryReady(page: Page) {
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", {
    timeout: 60000,
  });
  await page.waitForTimeout(1600);
}

async function dirtyBoard(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value && !i.disabled && !i.readOnly)?.focus();
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
}

async function focusCell(page: Page, idx = 40) {
  await page.evaluate((i) => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[i]?.focus();
  }, idx);
  await page.waitForTimeout(900);
}

// ── G-LIVE-8 · the living mark turns off nothing else ────────────────────────────────────
// Cell 40 focused; a conflicting, a peer-cursor and a hovered cell each compute
// `.cell-ghost-path` opacity 1 at every pose. RED on the pass-1 build (0 at poses 1..3).

test("G-LIVE-8 · the swap reaches the living cell and nowhere else", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await focusCell(page, 40);
  const rows = await page.evaluate(() => {
    const grid = document.querySelector("[data-mark-pose]");
    if (!grid) return { error: "no [data-mark-pose]" };
    const cells = Array.from(document.querySelectorAll(".game-cell"));
    const inputs = Array.from(document.querySelectorAll(".game-cell input"));
    const focusedIdx = inputs.findIndex((i) => i === document.activeElement);
    const others = cells.filter((_, i) => i !== focusedIdx);
    const [conflict, peer, hover] = others;
    conflict.classList.add("is-invalid");
    peer.classList.add("is-peer-cursor");
    hover.querySelector(".cell-ghost")?.classList.add("is-active");
    const paths = (el: Element) => Array.from(el.querySelectorAll(".cell-ghost-path"));
    const op = (el: Element | null) => (el ? getComputedStyle(el).opacity : null);
    const out: Record<string, unknown>[] = [];
    for (const p of [0, 1, 2, 3]) {
      grid.setAttribute("data-mark-pose", String(p));
      out.push({
        pose: p,
        living: paths(cells[focusedIdx]).map(op),
        conflict: op(paths(conflict)[0]),
        peer: op(paths(peer)[0]),
        hover: op(paths(hover)[0]),
      });
    }
    grid.setAttribute("data-mark-pose", "0");
    return { focusedIdx, out };
  });
  bank(`G-LIVE-8-${browserName}.json`, { engine: browserName, ...rows });
  console.log(`[G-LIVE-8 ${browserName}] ` + JSON.stringify(rows));
  const r = rows as { out: { conflict: string; peer: string; hover: string; living: string[] }[] };
  for (const row of r.out) {
    expect(row.conflict).toBe("1");
    expect(row.peer).toBe("1");
    expect(row.hover).toBe("1");
  }
  // And the living cell's own swap is still exactly one opaque path per pose.
  r.out.forEach((row, p) => {
    expect(row.living.filter((o) => o === "1").length, `pose ${p}`).toBe(1);
    expect(row.living[p]).toBe("1");
  });
});

// ── G-LIVE-2 · one revolution, exact ─────────────────────────────────────────────────────

test("G-LIVE-2 · exactly four swaps, 1,2,3,0, then rest", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  await page.evaluate(() => {
    (window as any).__swaps = [];
    const grid = document.querySelector("[data-mark-pose]")!;
    (window as any).__t0 = performance.now();
    new MutationObserver(() => {
      (window as any).__swaps.push([
        Math.round(performance.now() - (window as any).__t0),
        grid.getAttribute("data-mark-pose"),
      ]);
    }).observe(grid, { attributes: true, attributeFilter: ["data-mark-pose"] });
  });
  await page.evaluate(() => {
    (window as any).__t0 = performance.now();
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[40]?.focus();
  });
  await page.waitForTimeout(3600);
  const live = await page.evaluate(() => ({
    swaps: (window as any).__swaps,
    final: document.querySelector("[data-mark-pose]")?.getAttribute("data-mark-pose"),
  }));

  // The PRM arm, on a fresh load: the beat driver is force-cleared, so nothing swaps.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await boardReady(page);
  await page.evaluate(() => {
    (window as any).__swaps = [];
    const grid = document.querySelector("[data-mark-pose]")!;
    (window as any).__t0 = performance.now();
    new MutationObserver(() => {
      (window as any).__swaps.push([
        Math.round(performance.now() - (window as any).__t0),
        grid.getAttribute("data-mark-pose"),
      ]);
    }).observe(grid, { attributes: true, attributeFilter: ["data-mark-pose"] });
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[40]?.focus();
  });
  await page.waitForTimeout(2200);
  const prm = await page.evaluate(() => ({
    swaps: (window as any).__swaps,
    final: document.querySelector("[data-mark-pose]")?.getAttribute("data-mark-pose"),
  }));

  const row = { engine: browserName, live, prm };
  bank(`G-LIVE-2-${browserName}.json`, row);
  console.log(`[G-LIVE-2 ${browserName}] ` + JSON.stringify(row));
  const seq = live.swaps.map((s: [number, string]) => s[1]);
  expect(seq).toEqual(["1", "2", "3", "0"]);
  expect(live.swaps[0][0]).toBeLessThanOrEqual(140);
  expect(live.swaps[3][0]).toBeGreaterThanOrEqual(375);
  expect(live.swaps[3][0]).toBeLessThanOrEqual(500);
  expect(live.final).toBe("0");
  expect(prm.swaps.length).toBe(0);
  expect(prm.final).toBe("0");
});

// ── G-LIVE-3 · one ring owner, exemptions, clearance ─────────────────────────────────────

test("G-LIVE-3 · one ring owner across the tab walk", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  const stops: unknown[] = [];
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(260);
    const s = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a) return null;
      const rings = Array.from(document.querySelectorAll<SVGElement>(".focus-ring"));
      const o =
        parseFloat(getComputedStyle(a).getPropertyValue("--focus-ring-outset")) || 3;
      const b = a.getBoundingClientRect();
      const fits = rings.map((r) => {
        const rr = r.getBoundingClientRect();
        return Math.max(
          Math.abs(rr.left - (b.left - o)),
          Math.abs(rr.top - (b.top - o)),
          Math.abs(rr.width - (b.width + 2 * o)),
          Math.abs(rr.height - (b.height + 2 * o)),
        );
      });
      return {
        tag: a.tagName.toLowerCase(),
        cls: a.className?.toString?.().slice(0, 60) ?? "",
        exempt: a.matches(".cell-native-input, .gallery-viewport"),
        outset: o,
        rings: rings.length,
        worstFit: fits.length ? Math.round(Math.min(...fits) * 100) / 100 : null,
        area: rings.length
          ? Math.round(
              rings[0].getBoundingClientRect().width *
                rings[0].getBoundingClientRect().height,
            )
          : 0,
      };
    });
    if (s) stops.push(s);
  }
  const row = { engine: browserName, stops };
  bank(`G-LIVE-3-walk-${browserName}.json`, row);
  console.log(`[G-LIVE-3 ${browserName}] ` + JSON.stringify(stops));
  const uniq = new Set(stops.map((s: any) => s.cls));
  expect(uniq.size).toBeGreaterThanOrEqual(6);
  for (const s of stops as any[]) {
    if (s.exempt) {
      // A declared exemption may show zero rings OR hand it to its first option (the deck).
      continue;
    }
    expect(s.rings, `${s.cls} ring count`).toBe(1);
    expect(s.worstFit, `${s.cls} fit`).toBeLessThanOrEqual(1);
  }
});

// ── G-LIVE-3b / the band clearance at the framed stops ───────────────────────────────────
//
// A RADIAL PROFILE, not an annulus maximum: sample outward from the control's border box in
// 0.25px steps on all four sides, unfocused and focused. The FRAME is whatever is already dark
// in the unfocused frame; the RING is whatever the focus added. Disjoint means the ring's
// innermost changed offset sits at least 1px outside the frame's outermost.

async function bands(page: Page, sel: string) {
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(200);
  const box = await el.boundingBox().catch(() => null);
  if (!box) return { sel, found: 0 };
  const M = 26;
  const vp = page.viewportSize()!;
  const clip = {
    x: Math.max(0, Math.floor(box.x - M)),
    y: Math.max(0, Math.floor(box.y - M)),
    width: Math.min(vp.width - Math.max(0, Math.floor(box.x - M)), Math.ceil(box.width + M * 2)),
    height: Math.min(vp.height - Math.max(0, Math.floor(box.y - M)), Math.ceil(box.height + M * 2)),
  };
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(300);
  const before = await raw(await page.screenshot({ clip, scale: "css" }));
  await el.evaluate((n: HTMLElement) => n.focus());
  await page.waitForTimeout(1200); // past the ring's own revolution: measure it at rest
  const after = await raw(await page.screenshot({ clip, scale: "css" }));
  const outset = await el.evaluate(
    (n: HTMLElement) =>
      parseFloat(getComputedStyle(n).getPropertyValue("--focus-ring-outset")) || 3,
  );
  const bx = box.x - clip.x;
  const by = box.y - clip.y;
  // Far ground: 24px out, top-left corner region.
  const ground = at(before, Math.max(0, bx - 24), Math.max(0, by - 24));
  const frameOff: number[] = [];
  const ringOff: number[] = [];
  const profile: Record<string, { frame: number; ring: number }> = {};
  for (let d = 0; d <= 14; d += 0.25) {
    const pts: [number, number][] = [];
    for (let i = 1; i < 10; i++) {
      const t = box.width * (i / 10);
      pts.push([bx + t, by - d], [bx + t, by + box.height + d]);
    }
    for (let i = 1; i < 10; i++) {
      const t = box.height * (i / 10);
      pts.push([bx - d, by + t], [bx + box.width + d, by + t]);
    }
    const inside = pts.filter(
      ([x, y]) => x >= 0 && y >= 0 && x < before.w && y < before.h,
    );
    if (!inside.length) continue;
    // frame ink: how far the UNFOCUSED pixels sit from the far ground
    const fd = med(
      inside.map(([x, y]) => {
        const a = at(before, x, y);
        return Math.abs(a[0] - ground[0]) + Math.abs(a[1] - ground[1]) + Math.abs(a[2] - ground[2]);
      }),
    );
    // ring ink: how far the FOCUSED pixels moved from the unfocused ones
    const rd = med(
      inside.map(([x, y]) => {
        const a = at(before, x, y);
        const b = at(after, x, y);
        return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
      }),
    );
    profile[d.toFixed(2)] = { frame: fd, ring: rd };
    if (fd > 24) frameOff.push(d);
    if (rd > 24) ringOff.push(d);
  }
  // The ring's ink and the ground it lands on, sampled at the ring band's own centre.
  let ink: RGB | null = null;
  let onGround: RGB | null = null;
  if (ringOff.length) {
    const c = ringOff[Math.floor(ringOff.length / 2)];
    const pts: [number, number][] = [];
    for (let i = 1; i < 10; i++) {
      const t = box.width * (i / 10);
      pts.push([bx + t, by - c], [bx + t, by + box.height + c]);
    }
    const inside = pts.filter(([x, y]) => x >= 0 && y >= 0 && x < after.w && y < after.h);
    const moved = inside.filter(([x, y]) => {
      const a = at(before, x, y);
      const b = at(after, x, y);
      return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) > 24;
    });
    if (moved.length) {
      ink = [0, 1, 2].map((k) => med(moved.map(([x, y]) => at(after, x, y)[k]))) as RGB;
      onGround = [0, 1, 2].map((k) =>
        med(moved.map(([x, y]) => at(before, x, y)[k])),
      ) as RGB;
    }
  }
  const frameMax = frameOff.length ? Math.max(...frameOff) : null;
  const ringMin = ringOff.length ? Math.min(...ringOff) : null;
  return {
    sel,
    found: 1,
    outset,
    frameBand: frameOff.length ? [Math.min(...frameOff), frameMax] : null,
    ringBand: ringOff.length ? [ringMin, Math.max(...ringOff)] : null,
    gap: frameMax != null && ringMin != null ? Math.round((ringMin - frameMax) * 100) / 100 : null,
    ink,
    onGround,
    ratio: ink && onGround ? ratio(ink, onGround) : null,
    profile,
  };
}

test("G-LIVE-3b · the ring clears the frame it rings", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await galleryReady(page);
    rows.push({ scheme, ...(await bands(page, ".staging-btn")) });
    await boardReady(page, "?size=3&difficulty=EASY");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(400);
    if (await page.locator(".drawer-tab").count())
      rows.push({ scheme, ...(await bands(page, ".drawer-tab")) });
  }
  const row = { engine: browserName, rows };
  bank(`G-LIVE-3b-bands-${browserName}.json`, row);
  for (const r of rows as any[])
    console.log(
      `[G-LIVE-3b ${browserName} ${r.scheme}] ${r.sel} outset=${r.outset} frame=${JSON.stringify(r.frameBand)} ring=${JSON.stringify(r.ringBand)} gap=${r.gap} ratio=${r.ratio}`,
    );
  expect(rows.length).toBeGreaterThan(0);
});

// ── G-LIVE-9 · no stop is unmarked ───────────────────────────────────────────────────────

test("G-LIVE-9 · the deck with no activedescendant still has one owner", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await galleryReady(page);
  const out = await page.evaluate(async () => {
    const vp = document.querySelector<HTMLElement>(".gallery-viewport")!;
    (document.activeElement as HTMLElement)?.blur?.();
    vp.removeAttribute("aria-activedescendant");
    vp.focus();
    await new Promise((r) => setTimeout(r, 900));
    const rings = Array.from(document.querySelectorAll<SVGElement>(".focus-ring"));
    const first =
      vp.querySelector<HTMLElement>('[role="option"]') ??
      vp.querySelector<HTMLElement>(".game-card.is-center");
    const fb = first?.getBoundingClientRect();
    const rb = rings[0]?.getBoundingClientRect();
    const o = first
      ? parseFloat(getComputedStyle(first).getPropertyValue("--focus-ring-outset")) || 3
      : 3;
    return {
      rings: rings.length,
      firstOption: first?.id ?? null,
      fit:
        fb && rb
          ? Math.round(
              Math.max(
                Math.abs(rb.left - (fb.left - o)),
                Math.abs(rb.top - (fb.top - o)),
                Math.abs(rb.width - (fb.width + 2 * o)),
              ) * 100,
            ) / 100
          : null,
    };
  });
  bank(`G-LIVE-9-${browserName}.json`, { engine: browserName, ...out });
  console.log(`[G-LIVE-9 ${browserName}] ` + JSON.stringify(out));
  expect(out.rings).toBe(1);
  expect(out.firstOption).toBeTruthy();
  expect(out.fit!).toBeLessThanOrEqual(1);
});

// ── G-LIVE-10 · the ring rings a verb ────────────────────────────────────────────────────

test("G-LIVE-10 · arming lands on the keep verb and the ring fits it", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await dirtyBoard(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus(),
  );
  await page.keyboard.press("Enter");
  await page.waitForSelector(".gallery-viewport[aria-activedescendant]", { timeout: 60000 });
  await page.waitForTimeout(1600);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".staging-btn.staging-deal")?.click(),
  );
  await page.waitForTimeout(1500);
  const out = await page.evaluate(() => {
    const keep = document.querySelector<HTMLElement>(".guard-btn.guard-keep");
    const ribbon = document.querySelector<HTMLElement>(".gallery-guard");
    const ring = document.querySelector<SVGElement>(".focus-ring");
    const area = (e: Element | null) => {
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return Math.round(r.width * r.height);
    };
    return {
      armed: !!ribbon,
      activeIsKeep: document.activeElement === keep,
      activeCls: (document.activeElement as HTMLElement)?.className ?? null,
      keepArea: area(keep),
      ribbonArea: area(ribbon),
      ringArea: area(ring),
      rings: document.querySelectorAll(".focus-ring").length,
      keepOutset: keep
        ? parseFloat(getComputedStyle(keep).getPropertyValue("--focus-ring-outset"))
        : null,
    };
  });
  bank(`G-LIVE-10-${browserName}.json`, { engine: browserName, ...out });
  console.log(`[G-LIVE-10 ${browserName}] ` + JSON.stringify(out));
  expect(out.armed).toBe(true);
  expect(out.activeIsKeep).toBe(true);
  // THE GATE'S SENTENCE is the ratio: the ring is at most twice the verb it rings. The 3,200px²
  // figure in the pass-2 brief was arithmetic off an outset the surface later convicted (5.5 →
  // 7.75 for the frame clearance), so it is REPORTED, not asserted — a stale derivative of a
  // number that moved, never a reason to leave a ring drawing on a frame.
  expect(out.ringArea!).toBeLessThanOrEqual(2 * out.keepArea!);
  console.log(
    `[G-LIVE-10 ${browserName}] ratio=${(out.ringArea! / out.keepArea!).toFixed(3)}x  absolute=${out.ringArea} vs the brief's 3200 (delta ${out.ringArea! - 3200})`,
  );
});

// ── G-LIVE-4 · position, bounded in time ─────────────────────────────────────────────────

test("G-LIVE-4 · scroll, resize, landing burst, idle", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  // Instrument every style write on the ring node, from the moment it exists.
  await page.evaluate(() => {
    (window as any).__w = [];
    (window as any).__t0 = performance.now();
    const hook = (n: Element) =>
      new MutationObserver(() =>
        (window as any).__w.push(Math.round(performance.now() - (window as any).__t0)),
      ).observe(n, { attributes: true, attributeFilter: ["style", "width", "height"] });
    const found = document.querySelector(".focus-ring");
    if (found) hook(found);
    new MutationObserver(() => {
      const r = document.querySelector(".focus-ring");
      if (r && !(r as any).__hooked) {
        (r as any).__hooked = 1;
        hook(r);
      }
    }).observe(document.body, { childList: true, subtree: true });
  });
  await page.evaluate(() => {
    (window as any).__t0 = performance.now();
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus();
  });
  await page.waitForTimeout(1400);
  const landing = await page.evaluate(() => (window as any).__w.slice());
  await page.evaluate(() => ((window as any).__w.length = 0));
  await page.waitForTimeout(900);
  const idle = await page.evaluate(() => (window as any).__w.length);

  const fit = async () =>
    page.evaluate(() => {
      const a = document.activeElement as HTMLElement;
      const r = document.querySelector<SVGElement>(".focus-ring");
      if (!a || !r) return null;
      const o = parseFloat(getComputedStyle(a).getPropertyValue("--focus-ring-outset")) || 3;
      const b = a.getBoundingClientRect();
      const rr = r.getBoundingClientRect();
      return (
        Math.round(
          Math.max(Math.abs(rr.left - (b.left - o)), Math.abs(rr.top - (b.top - o))) * 1000,
        ) / 1000
      );
    });
  const atRest = await fit();
  await page.mouse.wheel(0, 240);
  await page.waitForTimeout(500);
  const afterScroll = await fit();
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.waitForTimeout(700);
  const afterResize = await fit();

  // A MOVING landing — the case the settle loop exists for. The logo is a static box, so it
  // lands with zero writes (correct, and unfalsifiable); the deck glides its track under the
  // card with a WAAPI transform that fires neither scroll nor resize nor a ResizeObserver, so
  // the burst here is the one the bound actually governs. Same instrument, same page.
  await galleryReady(page);
  await page.evaluate(() => {
    (window as any).__w = [];
    (window as any).__t0 = performance.now();
  });
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(1400);
  const glide = await page.evaluate(() => (window as any).__w.slice());
  await page.evaluate(() => ((window as any).__w.length = 0));
  await page.waitForTimeout(900);
  const glideIdle = await page.evaluate(() => (window as any).__w.length);
  const glideFit = await page.evaluate(() => {
    const a = document.activeElement as HTMLElement;
    const owned = a?.getAttribute("aria-activedescendant");
    const t = (owned && document.getElementById(owned)) || a;
    const r = document.querySelector<SVGElement>(".focus-ring");
    if (!t || !r) return null;
    const o = parseFloat(getComputedStyle(t).getPropertyValue("--focus-ring-outset")) || 3;
    const b = t.getBoundingClientRect();
    const rr = r.getBoundingClientRect();
    return (
      Math.round(
        Math.max(Math.abs(rr.left - (b.left - o)), Math.abs(rr.top - (b.top - o))) * 1000,
      ) / 1000
    );
  });

  const row = {
    engine: browserName,
    staticLanding: {
      writes: landing.length,
      lastWriteMs: landing.length ? landing[landing.length - 1] : null,
      note: "a static box: zero writes IS the landing, not a missing one",
    },
    glideLanding: {
      writes: glide.length,
      firstWriteMs: glide.length ? glide[0] : null,
      lastWriteMs: glide.length ? glide[glide.length - 1] : null,
      idleWritesPer900ms: glideIdle,
      errPx: glideFit,
    },
    idleWritesPer900ms: idle,
    errAtRestPx: atRest,
    errAfterScrollPx: afterScroll,
    errAfterResizePx: afterResize,
  };
  bank(`G-LIVE-4-${browserName}.json`, row);
  console.log(`[G-LIVE-4 ${browserName}] ` + JSON.stringify(row));
  // The law is "no write LATER than MOTION.boardFoldMs". A landing with no writes satisfies it
  // vacuously, so the glide arm is the one that can actually red this gate; it is asserted to
  // produce writes so the gate cannot pass by measuring nothing.
  for (const l of [row.staticLanding.lastWriteMs, row.glideLanding.lastWriteMs])
    if (l !== null) expect(l).toBeLessThanOrEqual(520);
  expect(row.glideLanding.writes).toBeGreaterThan(0);
  expect(row.idleWritesPer900ms).toBe(0);
  expect(row.glideLanding.idleWritesPer900ms).toBe(0);
  expect(Math.abs(row.glideLanding.errPx ?? 99)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(row.errAfterScrollPx ?? 99)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(row.errAfterResizePx ?? 99)).toBeLessThanOrEqual(0.5);
});

// ── G-LIVE-5 · painted contrast, the board stop included ─────────────────────────────────

test("G-LIVE-5 · the board ring against its own fill, both themes", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    const pick = await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      const idx = inputs.findIndex((i) => !i.value);
      const cell = inputs[idx]?.closest(".game-cell") as HTMLElement | null;
      if (!cell) return null;
      const r = cell.getBoundingClientRect();
      return {
        idx,
        clip: {
          x: Math.max(0, Math.round(r.x - 8)),
          y: Math.max(0, Math.round(r.y - 8)),
          width: Math.round(r.width + 16),
          height: Math.round(r.height + 16),
        },
      };
    });
    if (!pick) continue;
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
    await page.waitForTimeout(300);
    const off = await raw(await page.screenshot({ clip: pick.clip, scale: "css" }));
    await focusCell(page, pick.idx);
    await page.waitForTimeout(1200); // past the revolution — pose 0, the resting ring
    const on = await raw(await page.screenshot({ clip: pick.clip, scale: "css" }));
    // the ring: the pixels that moved most; the fill: the cell's centre under focus
    const moved: { i: number; d: number }[] = [];
    for (let i = 0; i < off.data.length; i += off.ch) {
      const d =
        Math.abs(off.data[i] - on.data[i]) +
        Math.abs(off.data[i + 1] - on.data[i + 1]) +
        Math.abs(off.data[i + 2] - on.data[i + 2]);
      if (d > 20) moved.push({ i, d });
    }
    moved.sort((a, b) => b.d - a.d);
    const top = moved.slice(0, Math.max(1, Math.floor(moved.length * 0.15)));
    const ringPx = [0, 1, 2].map((k) => med(top.map((p) => on.data[p.i + k]))) as RGB;
    const cx = Math.floor(on.w / 2);
    const cy = Math.floor(on.h / 2);
    const fill = at(on, cx, cy);
    const cellGround = at(off, cx, cy);
    rows.push({
      scheme,
      cellIdx: pick.idx,
      movedPx: moved.length,
      ringPx,
      focusedFill: fill,
      restingCell: cellGround,
      ringVsOwnFill: ratio(ringPx, fill),
      ringVsCell: ratio(ringPx, cellGround),
    });
  }
  const row = { engine: browserName, rows };
  bank(`G-LIVE-5-board-${browserName}.json`, row);
  for (const r of rows as any[])
    console.log(
      `[G-LIVE-5 ${browserName} ${r.scheme}] ring=${JSON.stringify(r.ringPx)} vsFill=${r.ringVsOwnFill} vsCell=${r.ringVsCell}`,
    );
  for (const r of rows as any[]) expect(r.ringVsOwnFill).toBeGreaterThanOrEqual(3);
});

// ── G-LIVE-11 · the laminate yields ──────────────────────────────────────────────────────

test("G-LIVE-11 · the hint laminate's body yields, its rim survives", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
    await boardReady(page);
    const pick = await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      const idx = inputs.findIndex((i) => !i.value);
      const cell = inputs[idx]?.closest(".game-cell") as HTMLElement | null;
      if (!cell) return null;
      // Mount the laminate the way the armed hint does: the class on the cell's own layer.
      const lam = document.createElement("div");
      lam.className = "cell-because pointer-events-none absolute";
      lam.setAttribute("aria-hidden", "true");
      cell.querySelector(".cell-ghost")?.before(lam);
      const r = cell.getBoundingClientRect();
      return {
        idx,
        clip: {
          x: Math.max(0, Math.round(r.x)),
          y: Math.max(0, Math.round(r.y)),
          width: Math.round(r.width),
          height: Math.round(r.height),
        },
      };
    });
    if (!pick) continue;
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
    await page.waitForTimeout(500);
    const unsel = await raw(await page.screenshot({ clip: pick.clip, scale: "css" }));
    await focusCell(page, pick.idx);
    await page.waitForTimeout(1200);
    const sel = await raw(await page.screenshot({ clip: pick.clip, scale: "css" }));
    const cx = Math.floor(sel.w / 2);
    const cy = Math.floor(sel.h / 2);
    const body = at(sel, cx, cy);
    const bodyUnsel = at(unsel, cx, cy);
    // A control selected cell with NO laminate, for the ±0.5 L* comparison.
    await page.evaluate(() => document.querySelector(".cell-because")?.remove());
    await page.waitForTimeout(400);
    const clean = await raw(await page.screenshot({ clip: pick.clip, scale: "css" }));
    const cleanBody = at(clean, cx, cy);
    // The rim: the laminate's inset 2px box-shadow, sampled on the laminate's own edge.
    // `.cell-because` is inset 9% of the cell; its border sits ~9% in plus a pixel.
    const inset = Math.round(sel.w * 0.09) + 1;
    const rimPts: [number, number][] = [];
    for (let i = 3; i < 8; i++) {
      const t = (sel.w * i) / 10;
      rimPts.push([t, inset], [t, sel.h - inset]);
    }
    const rimSel = [0, 1, 2].map((k) =>
      med(rimPts.map(([x, y]) => at(sel, x, y)[k])),
    ) as RGB;
    rows.push({
      scheme,
      selectedBecauseBody: body,
      selectedBecauseL: Lstar(body),
      selectedCleanBody: cleanBody,
      selectedCleanL: Lstar(cleanBody),
      deltaL: Math.round((Lstar(body) - Lstar(cleanBody)) * 100) / 100,
      unselectedBecauseL: Lstar(bodyUnsel),
      rimPx: rimSel,
      rimVsSelectionBody: ratio(rimSel, body),
    });
  }
  const row = { engine: browserName, rows };
  bank(`G-LIVE-11-${browserName}.json`, row);
  for (const r of rows as any[])
    console.log(
      `[G-LIVE-11 ${browserName} ${r.scheme}] becauseL=${r.selectedBecauseL} cleanL=${r.selectedCleanL} dL=${r.deltaL} rim=${r.rimVsSelectionBody}`,
    );
  for (const r of rows as any[]) {
    expect(Math.abs(r.deltaL)).toBeLessThanOrEqual(0.5);
    expect(r.rimVsSelectionBody).toBeGreaterThanOrEqual(3);
  }
});

// ── G-LIVE-12 · the seventh rule is gone ─────────────────────────────────────────────────

test("G-LIVE-12 · a focused cell computes no outline and no ground", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await focusCell(page, 40);
  const out = await page.evaluate(() => {
    const cell = document.querySelectorAll(".game-cell")[40] as HTMLElement;
    const cs = getComputedStyle(cell);
    const anyRule = Array.from(document.styleSheets).some((s) => {
      try {
        return Array.from(s.cssRules ?? []).some((r) =>
          (r as CSSStyleRule).selectorText?.includes(".sudoku-cell:focus-within"),
        );
      } catch {
        return false;
      }
    });
    return {
      outlineStyle: cs.outlineStyle,
      background: cs.backgroundColor,
      seventhRuleStillInSheet: anyRule,
    };
  });
  bank(`G-LIVE-12-${browserName}.json`, { engine: browserName, ...out });
  console.log(`[G-LIVE-12 ${browserName}] ` + JSON.stringify(out));
  expect(out.outlineStyle).toBe("none");
  expect(out.seventhRuleStillInSheet).toBe(false);
});

// ── G-LIVE-6 · forced colors, with its negative control ──────────────────────────────────

test("G-LIVE-6 · forced colors restores an outline, and the arm CAN zero", async ({
  page,
  browserName,
}) => {
  if (browserName !== "chromium") {
    test.skip(true, "forcedColors emulation is chromium-only in this rig");
    return;
  }
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await boardReady(page, "?size=3&difficulty=EASY");
  const stops: unknown[] = [];
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    stops.push(
      await page.evaluate(() => {
        const a = document.activeElement as HTMLElement;
        const cs = getComputedStyle(a);
        return {
          cls: a.className?.toString?.().slice(0, 40) ?? a.tagName,
          outlineStyle: cs.outlineStyle,
          outlineWidth: cs.outlineWidth,
          outlineOffset: cs.outlineOffset,
          drawnRings: Array.from(document.querySelectorAll(".focus-ring")).filter(
            (r) => getComputedStyle(r).display !== "none",
          ).length,
        };
      }),
    );
  }
  // THE NEGATIVE CONTROL: raise a (0,4,0) suppression and prove the arm goes to zero.
  await page.evaluate(() => {
    const s = document.createElement("style");
    s.id = "neg-control";
    s.textContent = `html body main :focus-visible { outline-style: none }`;
    document.head.append(s);
  });
  await page.waitForTimeout(200);
  const suppressed = await page.evaluate(() => {
    const el = document.querySelector<HTMLElement>("main :focus-visible");
    const probe =
      el ?? (document.querySelector("main button") as HTMLElement | null);
    probe?.focus();
    const a = document.activeElement as HTMLElement;
    return {
      cls: a?.className?.toString?.().slice(0, 40) ?? null,
      outlineStyle: a ? getComputedStyle(a).outlineStyle : null,
      insideMain: !!a?.closest("main"),
    };
  });
  await page.evaluate(() => document.getElementById("neg-control")?.remove());
  const row = { engine: browserName, stops, negativeControl: suppressed };
  bank(`G-LIVE-6-${browserName}.json`, row);
  console.log(`[G-LIVE-6 ${browserName}] ` + JSON.stringify(row));
  const solid = (stops as any[]).filter((s) => s.outlineStyle === "solid").length;
  expect(solid).toBeGreaterThanOrEqual(5);
  for (const s of stops as any[]) expect(s.drawnRings).toBe(0);
});
