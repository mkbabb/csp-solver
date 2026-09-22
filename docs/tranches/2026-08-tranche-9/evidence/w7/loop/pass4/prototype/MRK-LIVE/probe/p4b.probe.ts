/**
 * T9-W7 pass 4 · MRK-LIVE · ROUND B — the three rows round A's instruments could not read.
 *
 * PRM: live, because the ring's subject is a WAAPI glide; freezing it deletes the row.
 *
 * Round A found two instrument defects of its own, both banked as incidents:
 *   · the CSSOM walk was FLAT, so a declaration inside an `@layer` (Tailwind v4 wraps the whole
 *     sheet) was never reached and the ablation deleted 0 rules while reporting "no move".
 *   · deleting a registration does not re-run the component's `measure()`, so the ring that is
 *     already on screen survives any ablation until something forces a re-measure. A row that
 *     ablates and reads the OLD ring proves nothing at all — pass 3's G-LIVE-18 green included.
 */
import { test, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  process.env.MRKLIVE_OUT ??
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MRK-LIVE/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) => {
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));
  console.log(n + " " + JSON.stringify(d));
};

async function boardReady(page: Page, q = "?game=sudoku") {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}

/** Every rule in the document, RECURSIVELY — `@layer`, `@media`, `@supports` all carry rules. */
const WALK = `const allRules = () => {
  const walk = (rules, out) => {
    for (const r of Array.from(rules)) { out.push(r); if (r.cssRules) walk(r.cssRules, out); }
    return out;
  };
  const out = [];
  for (const s of Array.from(document.styleSheets)) {
    try { walk(s.cssRules, out); } catch { /* cross-origin */ }
  }
  return out;
};`;

/** Force the ring to RE-MEASURE: blur, then focus again. Nothing else in the component
 *  re-reads the token, which is exactly why an ablation that skips this reads a stale ring. */
async function reFocus(page: Page, sel: string) {
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(200);
  await page.keyboard.press("Tab");
  await page.evaluate(
    (s) => document.querySelector<HTMLElement>(s)?.focus({ preventScroll: true }),
    sel,
  );
  await page.waitForTimeout(450);
}

// ── B1 · gap 3 · `--ring-ink` BARE, ablated through a recursive walk ─────────────────────
test("B1 · --ring-ink bare, ablated (recursive)", async ({ page, browserName }) => {
  await boardReady(page);
  await page.keyboard.press("Tab");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(500);
  const read = () =>
    page.evaluate(() => {
      const p = document.querySelector<SVGPathElement>(".focus-ring path");
      const s = p ? getComputedStyle(p) : null;
      const root = getComputedStyle(document.documentElement);
      return {
        rings: document.querySelectorAll(".focus-ring").length,
        stroke: s?.stroke ?? null,
        currentColor: s?.color ?? null,
        alias: root.getPropertyValue("--ring-ink").trim(),
        aliasTarget: root.getPropertyValue("--color-focus-sketch").trim(),
      };
    });
  const before = await read();
  const ab = await page.evaluate(`(() => { ` + WALK + `
    let n = 0; const where = [];
    for (const r of allRules()) {
      const st = r.style;
      if (st && st.getPropertyValue('--ring-ink')) {
        where.push(r.selectorText || r.constructor.name);
        st.removeProperty('--ring-ink');
        n++;
      }
    }
    return { deleted: n, where };
  })()`);
  await page.waitForTimeout(250);
  const after = await read();
  await page.evaluate(() =>
    document.documentElement.style.setProperty("--ring-ink", "var(--color-focus-sketch)"),
  );
  await page.waitForTimeout(250);
  const restored = await read();
  bank(`B1-ring-ink-bare-${browserName}.json`, {
    engine: browserName,
    before,
    ablation: ab,
    after,
    restored,
    moved: before.stroke !== after.stroke,
    fellToCurrentColor: after.stroke === after.currentColor,
    restoredToBefore: restored.stroke === before.stroke,
  });
});

// ── B2 · gap 2 · G-LIVE-18 re-cut WITH the re-measure the row needs ──────────────────────
//
// The registration's two jobs, each measured where it can fail, and the stale-ring defect the
// row's own instrument had. Arms:
//   delete      — no registration at all: a non-declaring host loses the initial value.
//   retype      — re-registered `<angle>`: a DECLARED plain length becomes invalid too.
//   negative    — the shipped registration restored; every host returns.
// Each arm re-focuses AFTER the ablation, so the ring under test is baked from the ablated
// token rather than surviving from the read before it.
test("B2 · G-LIVE-18 with the re-measure", async ({ page, browserName }) => {
  const HOSTS = ["button.logo-trigger", ".drawer-tab", ".sun-moon-toggle"];
  const readHost = (sel: string) =>
    page.evaluate((s) => {
      const el = document.querySelector<HTMLElement>(s);
      const ring = document.querySelector<SVGElement>(".focus-ring");
      return {
        host: s,
        rings: document.querySelectorAll(".focus-ring").length,
        ringW: ring ? +ring.getBoundingClientRect().width.toFixed(2) : null,
        declared: el
          ? getComputedStyle(el).getPropertyValue("--focus-ring-outset").trim()
          : null,
        parsed: el
          ? parseFloat(getComputedStyle(el).getPropertyValue("--focus-ring-outset"))
          : null,
      };
    }, sel);
  const ablate = (syntax: string | null, initial: string) =>
    page.evaluate(
      `(() => { ` + WALK + `
        return ((syn, init) => {
        let deleted = 0, text = '';
        for (const s of Array.from(document.styleSheets)) {
          let rules; try { rules = s.cssRules; } catch { continue; }
          const kill = (list, sheetOrGroup) => {
            for (let i = list.length - 1; i >= 0; i--) {
              const r = list[i];
              if (r.constructor.name === 'CSSPropertyRule' && r.name === '--focus-ring-outset') {
                text = r.cssText; sheetOrGroup.deleteRule(i); deleted++;
              } else if (r.cssRules) kill(r.cssRules, r);
            }
          };
          kill(rules, s);
        }
        if (syn) {
          const s = document.styleSheets[0];
          s.insertRule('@property --focus-ring-outset { syntax: "' + syn + '"; inherits: false; initial-value: ' + init + '; }', s.cssRules.length);
        }
        return { deleted, text };
      })(${JSON.stringify(syntax)}, ${JSON.stringify(initial)}); })()`,
    );

  const rows: unknown[] = [];
  for (const [arm, syn, init] of [
    ["delete", null, ""],
    ["retype<angle>", "<angle>", "0deg"],
  ] as const) {
    for (const h of HOSTS) {
      await boardReady(page);
      await reFocus(page, h);
      const before = await readHost(h);
      const ab = await ablate(syn, init);
      await reFocus(page, h); // THE RE-MEASURE the pass-3 row skipped
      const after = await readHost(h);
      rows.push({ arm, host: h, before, ablation: ab, after, ringDied: after.rings === 0 });
    }
  }
  // negative control, in the same run
  await boardReady(page);
  await reFocus(page, ".drawer-tab");
  const ctlBefore = await readHost(".drawer-tab");
  await ablate(null, "");
  await reFocus(page, ".drawer-tab");
  const ctlAblated = await readHost(".drawer-tab");
  await page.evaluate(() => {
    const s = document.styleSheets[0];
    s.insertRule(
      `@property --focus-ring-outset { syntax: "<length>"; inherits: false; initial-value: 3px; }`,
      s.cssRules.length,
    );
  });
  await reFocus(page, ".drawer-tab");
  const ctlRestored = await readHost(".drawer-tab");
  bank(`B2-glive18-remeasured-${browserName}.json`, {
    engine: browserName,
    rows,
    negativeControl: { ctlBefore, ctlAblated, ctlRestored },
  });
});

// ── B3 · gap 9 · PAINTED contrast of the board ring, by the wave's own recipe ────────────
//
// MRK-ABS's critic's recipe, taken whole: focus → read the geometry → BLUR → sample. The ink
// is the pixel that CHANGED most between the two frames (3×3 max), the ground is that same
// pixel in the blurred frame, and the ratio is WCAG 1.4.11 over those two painted colours.
// Token arithmetic over-reports a stroke that antialiases against its own fill; this does not.
test("B3 · painted contrast, focused vs blurred", async ({ page, browserName }) => {
  const sharp = (await import(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs"
  )).default;
  const lum = (r: number, g: number, b: number) => {
    const f = (c: number) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a: number[], b: number[]) => {
    const [l1, l2] = [lum(a[0], a[1], a[2]), lum(b[0], b[1], b[2])].sort((x, y) => y - x);
    return +((l1 + 0.05) / (l2 + 0.05)).toFixed(3);
  };
  const rows: unknown[] = [];
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await boardReady(page);
    await page.waitForTimeout(500);
    await page.evaluate(() =>
      document.querySelector<HTMLInputElement>(".game-cell input")?.focus(),
    );
    await page.waitForTimeout(900);
    const geom = await page.evaluate(() => {
      const cell = document
        .querySelector<HTMLElement>(".game-cell input")
        ?.closest<HTMLElement>(".game-cell");
      const ghost = cell?.querySelector<SVGPathElement>(".cell-ghost-path");
      if (!ghost) return null;
      const b = ghost.getBoundingClientRect();
      const cs = getComputedStyle(ghost);
      return {
        clip: { x: Math.round(b.x - 4), y: Math.round(b.y - 4), width: Math.round(b.width + 8), height: Math.round(b.height + 8) },
        strokeOpacity: cs.strokeOpacity,
        stroke: cs.stroke,
        fillOpacity: cs.fillOpacity,
        isDark: document.documentElement.classList.contains("dark"),
      };
    });
    if (!geom) {
      rows.push({ theme, ok: false });
      continue;
    }
    const onBuf = await page.screenshot({ clip: geom.clip });
    await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
    await page.waitForTimeout(900);
    const offBuf = await page.screenshot({ clip: geom.clip });
    const on = await sharp(onBuf).raw().toBuffer({ resolveWithObject: true });
    const off = await sharp(offBuf).raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = on.info;
    let best = -1;
    let bx = 0;
    let by = 0;
    // 3×3 window, max total change: a single antialiased pixel is noise, a stroke is a run.
    for (let y = 1; y < height - 1; y++)
      for (let x = 1; x < width - 1; x++) {
        let s = 0;
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const i = ((y + dy) * width + (x + dx)) * channels;
            s +=
              Math.abs(on.data[i] - off.data[i]) +
              Math.abs(on.data[i + 1] - off.data[i + 1]) +
              Math.abs(on.data[i + 2] - off.data[i + 2]);
          }
        if (s > best) {
          best = s;
          bx = x;
          by = y;
        }
      }
    const i = (by * width + bx) * channels;
    const ink = [on.data[i], on.data[i + 1], on.data[i + 2]];
    const ground = [off.data[i], off.data[i + 1], off.data[i + 2]];
    // the cell's own INTERIOR fill, focused, as the second ground the comment names
    const ci = ((height >> 1) * width + (width >> 1)) * channels;
    const innerFill = [on.data[ci], on.data[ci + 1], on.data[ci + 2]];
    rows.push({
      theme,
      isDark: geom.isDark,
      strokeOpacity: geom.strokeOpacity,
      declaredStroke: geom.stroke,
      at: [bx, by],
      maxChange3x3: best,
      inkRGB: ink,
      groundRGB: ground,
      innerFillRGB: innerFill,
      ratioVsUnfocusedGround: ratio(ink, ground),
      ratioVsOwnFill: ratio(ink, innerFill),
    });
  }
  bank(`B3-painted-contrast-${browserName}.json`, { engine: browserName, rows });
});

// ── B4 · gap 12 + POINTER CLASS · the phone arm in a WITNESSED coarse regime ─────────────
//
// Round A ran 393×699 on a Desktop Chrome descriptor: a mouse pointer at a phone viewport,
// which is not a phone row (LAWS). This one runs `hasTouch` and ASSERTS `(pointer: coarse)`
// on the page before it reads anything, and captures `activeElement` AT the reversal instant.
test("B4 · the phone arm, coarse and witnessed", async ({ browser, browserName }) => {
  const ctx = await browser.newContext({
    viewport: { width: 393, height: 699 },
    hasTouch: true,
    isMobile: browserName === "chromium",
    deviceScaleFactor: 2,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4238",
  });
  const page = await ctx.newPage();
  await boardReady(page);
  const regime = await page.evaluate(() => ({
    coarse: window.matchMedia("(pointer: coarse)").matches,
    noHover: window.matchMedia("(hover: none)").matches,
    dpr: window.devicePixelRatio,
  }));
  const snap = () =>
    page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      const ring = document.querySelector<SVGElement>(".focus-ring");
      const owned = a?.getAttribute?.("aria-activedescendant");
      const box = ((owned && document.getElementById(owned)) || a) as HTMLElement | null;
      const o = box
        ? parseFloat(getComputedStyle(box).getPropertyValue("--focus-ring-outset"))
        : NaN;
      const rb = ring?.getBoundingClientRect();
      const bb = box?.getBoundingClientRect();
      return {
        active: a
          ? a.tagName.toLowerCase() +
            (a.className ? "." + String(a.className).split(" ")[0] : "")
          : null,
        fv: !!a?.matches(":focus-visible"),
        rings: document.querySelectorAll(".focus-ring").length,
        outset: Number.isFinite(o) ? o : null,
        err:
          rb && bb && Number.isFinite(o)
            ? +Math.max(
                Math.abs(rb.left - (bb.left - o)),
                Math.abs(rb.top - (bb.top - o)),
              ).toFixed(2)
            : null,
      };
    });
  await page.keyboard.press("Tab");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(500);
  const before = await snap();
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
  await page.waitForTimeout(140);
  const mid = await snap();
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
  const atReversal = await snap();
  await page.waitForTimeout(1500);
  const settled = await snap();
  // and the estate's real coarse focus destination, if the sheet opened at all
  const dest = await page.evaluate(() => {
    const b = document.querySelector<HTMLElement>("button.mobile-heading-btn");
    if (!b) return { present: false };
    b.focus({ preventScroll: true });
    const ring = document.querySelector<SVGElement>(".focus-ring");
    const bb = b.getBoundingClientRect();
    const o = parseFloat(getComputedStyle(b).getPropertyValue("--focus-ring-outset"));
    const rb = ring?.getBoundingClientRect();
    return {
      present: true,
      fv: b.matches(":focus-visible"),
      rings: document.querySelectorAll(".focus-ring").length,
      err:
        rb && Number.isFinite(o)
          ? +Math.max(
              Math.abs(rb.left - (bb.left - o)),
              Math.abs(rb.top - (bb.top - o)),
            ).toFixed(2)
          : null,
    };
  });
  bank(`B4-phone-coarse-${browserName}.json`, {
    engine: browserName,
    viewport: "393x699",
    pointerClass: regime,
    before,
    mid,
    atReversal,
    settled,
    mobileHeadingBtn: dest,
  });
  await ctx.close();
});
