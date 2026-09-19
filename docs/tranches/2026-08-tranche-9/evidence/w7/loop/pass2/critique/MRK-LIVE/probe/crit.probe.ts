/**
 * T9-W7 pass 2 · MRK-LIVE CRITIQUE — the adversarial re-measure, on the prototype's own build.
 *
 * Worktree `wf_8630d340-e56-36`, served on 127.0.0.1:4241 by this lane's own server. Written
 * independently of `prototype/MRK-LIVE/probe/*` (no shared helper, no shared selector list).
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, q = "?game=sudoku") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1400);
}

// ── T1 · THE WHOLE TAB ORDER, not nine named stops ───────────────────────────────────────────
test("T1 every keyboard stop carries exactly one mark", async ({ page }, ti) => {
  await boardReady(page);
  const rows: unknown[] = [];
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  for (let i = 0; i < 45; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(90);
    const row = await page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      if (!a || a === document.body) return { stop: "body" };
      const name = (
        a.tagName.toLowerCase() +
        (a.className && typeof a.className === "string"
          ? "." + a.className.trim().split(/\s+/).slice(0, 2).join(".")
          : "")
      ).slice(0, 70);
      const fv = a.matches(":focus-visible");
      const rings = Array.from(document.querySelectorAll<SVGElement>(".focus-ring"));
      const cs = getComputedStyle(a);
      const r = a.getBoundingClientRect();
      const o =
        parseFloat(cs.getPropertyValue("--focus-ring-outset")) ||
        (cs.getPropertyValue("--focus-ring-outset").trim() === "0px" ? 0 : 3);
      let err: number | null = null;
      let ringVisible = 0;
      for (const ring of rings) {
        const b = ring.getBoundingClientRect();
        if (getComputedStyle(ring).display === "none" || b.width === 0) continue;
        ringVisible++;
        const e = Math.max(
          Math.abs(b.left - (r.left - o)),
          Math.abs(b.top - (r.top - o)),
        );
        err = err === null ? e : Math.min(err, e);
      }
      // Is the cell's OWN ink the mark here? (the board is exempt by design)
      const ownInk =
        a.matches(".cell-native-input") &&
        !!a.closest(".game-cell")?.querySelector(".cell-ghost-path");
      return {
        stop: name,
        focusVisible: fv,
        outlineStyle: cs.outlineStyle,
        rings: ringVisible,
        frameErr: err === null ? null : Math.round(err * 100) / 100,
        ownInk,
        box: [Math.round(r.width), Math.round(r.height)],
      };
    });
    rows.push(row);
    if ((row as { stop: string }).stop === "body" && i > 2) break;
  }
  const unmarked = rows.filter(
    (r) =>
      (r as { focusVisible?: boolean }).focusVisible === true &&
      (r as { rings?: number }).rings === 0 &&
      (r as { outlineStyle?: string }).outlineStyle === "none" &&
      !(r as { ownInk?: boolean }).ownInk,
  );
  bank(`T1-taborder-${ti.project.name}.json`, {
    stops: rows.length,
    unmarkedCount: unmarked.length,
    unmarked,
    rows,
  });
});

// ── T2 · THE BOX TRAVELS WHILE FOCUS STAYS PUT ───────────────────────────────────────────────
// The ring re-measures on scroll, resize, a ResizeObserver, and a LANDING. Nothing here is a
// landing: focus never moves. The drawer's own tongue travels when the sheet opens.
test("T2 a resident ring follows its host through the estate's own motion", async ({
  page,
}, ti) => {
  await boardReady(page);
  await page.waitForTimeout(600);
  const out = await page.evaluate(async () => {
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const tab = document.querySelector<HTMLElement>(".drawer-tab");
    if (!tab) return { error: "no .drawer-tab at 1280x800" };
    tab.focus();
    await wait(700);
    const read = () => {
      const r = tab.getBoundingClientRect();
      const ring = document.querySelector<SVGElement>(".focus-ring");
      const b = ring?.getBoundingClientRect();
      const o = parseFloat(getComputedStyle(tab).getPropertyValue("--focus-ring-outset")) || 3;
      return {
        host: [Math.round(r.left * 100) / 100, Math.round(r.top * 100) / 100],
        ring: b ? [Math.round(b.left * 100) / 100, Math.round(b.top * 100) / 100] : null,
        err: b
          ? Math.round(
              Math.max(Math.abs(b.left - (r.left - o)), Math.abs(b.top - (r.top - o))) * 100,
            ) / 100
          : null,
      };
    };
    const before = read();
    tab.click(); // the sheet slides; focus never leaves the tongue
    await wait(1200);
    const after = read();
    const stillFocused = document.activeElement === tab;
    return { before, after, stillFocused, drawerClass: document.documentElement.className };
  });
  bank(`T2-travel-${ti.project.name}.json`, out);
});

// ── T3 · THE SWAP REACHES NOTHING ELSE (G-LIVE-8, re-derived) ────────────────────────────────
test("T3 the living swap turns off no other mark", async ({ page }, ti) => {
  await boardReady(page);
  await page.evaluate(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>(".game-cell input");
    inputs[40]?.focus();
  });
  await page.waitForTimeout(900);
  const out = await page.evaluate(() => {
    const grid = document.querySelector("[data-mark-pose]");
    const cells = Array.from(document.querySelectorAll(".game-cell"));
    const inputs = Array.from(document.querySelectorAll(".game-cell input"));
    const fi = inputs.findIndex((i) => i === document.activeElement);
    const conflict = cells[0];
    const peer = cells[1];
    const hover = cells[2];
    conflict.classList.add("is-invalid");
    peer.classList.add("is-peer-cursor");
    hover.querySelector(".cell-ghost")?.classList.add("is-active");
    const first = (el: Element) =>
      getComputedStyle(el.querySelector(".cell-ghost-path") as Element).opacity;
    const rows: unknown[] = [];
    for (const p of ["0", "1", "2", "3"]) {
      grid?.setAttribute("data-mark-pose", p);
      const living = cells[fi];
      const lp = Array.from(living.querySelectorAll(".cell-ghost-path")).map(
        (e) => getComputedStyle(e).opacity,
      );
      rows.push({
        pose: p,
        living: lp,
        conflict: first(conflict),
        peer: first(peer),
        hover: first(hover),
      });
    }
    return { focusedIndex: fi, livingPathCount: cells[fi].querySelectorAll(".cell-ghost-path").length, rows };
  });
  bank(`T3-cascade-${ti.project.name}.json`, out);
});

// ── T4 · THE RING'S INK ON ITS REAL GROUND, both themes ──────────────────────────────────────
test("T4 painted contrast at a chrome stop", async ({ page }, ti) => {
  const readings: unknown[] = [];
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await boardReady(page);
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>("button.logo-trigger");
      el?.focus();
      return !!el;
    });
    if (!r) continue;
    await page.waitForTimeout(900);
    const geom = await page.evaluate(() => {
      const ring = document.querySelector<SVGElement>(".focus-ring");
      const b = ring?.getBoundingClientRect();
      const cs = getComputedStyle(document.body);
      return b
        ? {
            box: [b.left, b.top, b.width, b.height],
            stroke: getComputedStyle(ring as unknown as Element).stroke,
            ground: cs.backgroundColor,
          }
        : null;
    });
    readings.push({ theme, geom });
  }
  bank(`T4-ink-${ti.project.name}.json`, readings);
});

// ── T5 · CHAIR §6.11 GATE 2 — THE RIM AGAINST THE SELECTION BODY, from painted bytes ─────────
// The prototype's own G-LIVE-11 clips the CENTRE 40% of the cell, which is the body and never
// the rim, so the gate's second half has no measurement behind it. This scans the cell's left
// edge, where the 2px inset box-shadow paints.
import sharp from "sharp";
const lum = (c: readonly number[]) => {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
};
const ratio = (a: readonly number[], b: readonly number[]) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100;
};

test("T5 the hint rim under selection, painted", async ({ page }, ti) => {
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
      const lam = document.createElement("div");
      lam.className = "cell-because pointer-events-none absolute";
      lam.style.cssText = "inset:0";
      for (const a of Array.from(cell.attributes))
        if (a.name.startsWith("data-v-")) lam.setAttribute(a.name, "");
      cell.append(lam);
      inputs[idx].focus();
      const r = cell.getBoundingClientRect();
      return {
        idx,
        clip: {
          x: Math.round(r.x),
          y: Math.round(r.y + r.height / 2) - 1,
          width: Math.round(r.width),
          height: 2,
        },
      };
    });
    if (!pick) continue;
    await page.waitForTimeout(1200);
    const buf = await page.screenshot({ clip: pick.clip });
    const { data, info } = await sharp(buf)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const px = (i: number) => [
      data[i * info.channels],
      data[i * info.channels + 1],
      data[i * info.channels + 2],
    ];
    const scan: number[][] = [];
    for (let x = 0; x < Math.min(info.width, 20); x++) scan.push(px(x));
    const centre = px(Math.floor(info.width / 2));
    // the reddest pixel in the first 20 columns = the rim's own paint
    let rim = scan[0];
    let best = -1e9;
    for (const c of scan) {
      const s = c[0] - (c[1] + c[2]) / 2;
      if (s > best) {
        best = s;
        rim = c;
      }
    }
    rows.push({
      scheme,
      channels: info.channels,
      scanFirst20: scan,
      rim,
      body: centre,
      rimVsBody: ratio(rim, centre),
    });
    await page.evaluate(() => document.querySelector(".cell-because")?.remove());
  }
  bank(`T5-rim-${ti.project.name}.json`, rows);
});
