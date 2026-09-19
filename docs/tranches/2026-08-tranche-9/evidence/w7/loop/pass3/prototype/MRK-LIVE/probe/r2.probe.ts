/**
 * T9-W7 pass 3 · MRK-LIVE PROTOTYPE · ROUND 2 — the critic's seven, measured.
 *
 * Every row here answers a numbered finding of `pass3/critique/MRK-LIVE.md` on the same two
 * servers the first round used: the prototype (worktree `wf_f72f3b5a-83a-35`) on 4238, the HEAD
 * control (`74a2b5d9`, main tree, read-only) on 4239 via PLAYWRIGHT_BASE_URL.
 *
 * Motion declared (lint:motion grammar): rows A and B SAMPLE the dock's WAAPI glide
 * (`MOTION.curves.drawerGlide`, 520ms) live, so PRM is OFF by design there; row F asserts the
 * marks' own rung (`--motion-note`, 250ms) as a computed duration, which PRM does not gate at
 * HEAD either (`.pencil-marks` carries no reduce arm on this tree — stated, not assumed).
 */
import { test, expect, type Page } from "@playwright/test";
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
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}

const FRAMING = `(() => {
  const a = document.activeElement;
  const ring = document.querySelector('.focus-ring');
  const owned = a && a.getAttribute && a.getAttribute('aria-activedescendant');
  const box = owned ? document.getElementById(owned) : a;
  if (!ring || !box) return { ring: !!ring, box: !!box, err: null };
  const rb = ring.getBoundingClientRect();
  const bb = box.getBoundingClientRect();
  const o = parseFloat(getComputedStyle(box).getPropertyValue('--focus-ring-outset'));
  return {
    ring: true, outset: o,
    dLeft: +Math.abs(rb.left - (bb.left - o)).toFixed(2),
    dTop: +Math.abs(rb.top - (bb.top - o)).toFixed(2),
    err: +Math.max(Math.abs(rb.left - (bb.left - o)), Math.abs(rb.top - (bb.top - o))).toFixed(2),
    rings: document.querySelectorAll('.focus-ring').length,
  };
})()`;

async function waitStill(page: Page, ms = 100) {
  await page.waitForFunction(
    () => {
      const a = document.activeElement as HTMLElement | null;
      if (!a) return true;
      const owned = a.getAttribute?.("aria-activedescendant");
      const box = (owned && document.getElementById(owned)) || a;
      const out: Animation[] = [];
      for (let e: Element | null = box; e; e = e.parentElement)
        out.push(...e.getAnimations());
      return (
        out.filter((x) =>
          Number.isFinite(x.effect?.getComputedTiming().endTime ?? Infinity),
        ).length === 0
      );
    },
    undefined,
    { timeout: 20000 },
  );
  await page.waitForTimeout(ms);
}

// ── A · critique §2.1 · the settle loop's OWN cost, counted call by call ─────────────────
//
// The critic patched `Element.prototype.getAnimations` and counted 191 sweeps / 594 calls in
// one frame (chromium) for a single tab press, because the first cut armed a promise chain
// beside the rAF every frame. Same instrument, same gesture, after the one-chain cure.
test("A · §2.1 one press, one chain", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  await page.keyboard.press("Tab");
  await page.evaluate(() =>
    document.querySelector<HTMLElement>(".drawer-tab")?.focus({ preventScroll: true }),
  );
  await waitStill(page, 400);
  const before = await page.evaluate(FRAMING);

  const census = await page.evaluate(async () => {
    const proto = Element.prototype as unknown as {
      getAnimations: (o?: unknown) => Animation[];
    };
    const real = proto.getAnimations;
    const byFrame = new Map<number, number>();
    let calls = 0;
    let frame = 0;
    let stop = false;
    const tick = () => {
      if (stop) return;
      frame++;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    proto.getAnimations = function (this: Element, o?: unknown) {
      calls++;
      byFrame.set(frame, (byFrame.get(frame) ?? 0) + 1);
      return real.call(this, o);
    };
    document.querySelector<HTMLElement>(".drawer-tab")?.click();
    await new Promise((r) => setTimeout(r, 1400));
    stop = true;
    proto.getAnimations = real;
    const counts = [...byFrame.values()];
    const chainLen = (() => {
      let n = 0;
      for (
        let e: Element | null = document.querySelector(".drawer-tab");
        e;
        e = e.parentElement
      )
        n++;
      return n;
    })();
    return {
      chainLen,
      calls,
      framesTouched: counts.length,
      maxCallsInOneFrame: Math.max(...counts, 0),
      // one sweep = one `running()` = chainLen calls
      sweeps: +(calls / chainLen).toFixed(1),
      maxSweepsInOneFrame: +(Math.max(...counts, 0) / chainLen).toFixed(1),
    };
  });

  await waitStill(page);
  await page.waitForTimeout(700);
  await waitStill(page);
  const afterPress = await page.evaluate(FRAMING);

  // The reversal: press again mid-glide so the first glide is CANCELLED.
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
  await page.waitForTimeout(160);
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
  await waitStill(page);
  const afterReversal = await page.evaluate(FRAMING);

  const idle = await page.evaluate(async () => {
    const ring = document.querySelector<SVGElement>(".focus-ring");
    if (!ring) return { writes: null };
    let writes = 0;
    const mo = new MutationObserver((recs) => {
      writes += recs.length;
    });
    mo.observe(ring, { attributes: true, attributeFilter: ["style"] });
    await new Promise((r) => setTimeout(r, 900));
    mo.disconnect();
    return { writes };
  });

  const row = { engine: browserName, before, census, afterPress, afterReversal, idle };
  bank(`R2-A-settle-cost-${browserName}.json`, row);
  console.log("A " + JSON.stringify(row));
  expect(census.calls).toBeGreaterThan(0);
});

// ── B · critique §2.3 · `--ring-ink` has a consumer, and it is load-bearing ──────────────
test("B · §2.3 the ring drinks from --ring-ink", async ({ page, browserName }) => {
  await boardReady(page);
  await page.evaluate(() =>
    document.querySelector<HTMLElement>("button.logo-trigger")?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(900);
  const row = await page.evaluate(() => {
    const path = document.querySelector<SVGPathElement>(".focus-ring path");
    const ring = document.querySelector<SVGElement>(".focus-ring");
    const before = path ? getComputedStyle(path).stroke : null;
    const declared = ring
      ? getComputedStyle(ring).getPropertyValue("--ring-ink").trim()
      : null;
    // Ablate the alias: every `--ring-ink` declaration out of the live CSSOM. The consumer's
    // own `currentColor` is the declared form for a colour seam, so the ring must fall to the
    // inherited text colour — a VISIBLE change, which is what "it has a consumer" means.
    let removed = 0;
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const r of Array.from(rules)) {
        const sr = r as CSSStyleRule;
        if (sr.style && sr.style.getPropertyValue("--ring-ink")) {
          sr.style.removeProperty("--ring-ink");
          removed++;
        }
      }
    }
    const after = path ? getComputedStyle(path).stroke : null;
    const currentColor = path ? getComputedStyle(path).color : null;
    return { declared, before, removed, after, currentColor, moved: before !== after };
  });
  bank(`R2-B-ring-ink-${browserName}.json`, { engine: browserName, ...row });
  console.log("B " + JSON.stringify(row));
});

// ── C · critique §2.2 · the ablation on a DECLARING host and a non-declaring one ─────────
//
// The gate as pass 3 first wrote it ("delete the registration and no .focus-ring with a box
// exists") is true only where the host inherits the initial value. A host that declares its own
// plain length still hands JS a token stream that parseFloat reads. Both hosts, measured, and
// the row is reported NARROWED with this number rather than re-worded to pass.
test("C · §2.2 G-LIVE-18 on both kinds of host", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  const rows: unknown[] = [];
  for (const sel of ["button.logo-trigger", ".drawer-tab", ".sun-moon-toggle"]) {
    const present = await page.locator(sel).count();
    if (!present) {
      rows.push({ host: sel, present: 0 });
      continue;
    }
    await page.reload();
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
    await page.waitForTimeout(1000);
    const r = await page.evaluate((s) => {
      const el = document.querySelector<HTMLElement>(s);
      el?.focus({ preventScroll: true });
      const read = () => {
        const ring = document.querySelector<SVGElement>(".focus-ring");
        const rb = ring?.getBoundingClientRect();
        return {
          rings: document.querySelectorAll(".focus-ring").length,
          w: rb ? +rb.width.toFixed(2) : null,
          declared: el
            ? getComputedStyle(el).getPropertyValue("--focus-ring-outset").trim()
            : null,
        };
      };
      const before = read();
      let deleted = 0;
      for (const sheet of Array.from(document.styleSheets)) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (let i = rules.length - 1; i >= 0; i--) {
          const rr = rules[i] as CSSRule & { name?: string };
          if (rr.constructor.name === "CSSPropertyRule" && rr.name === "--focus-ring-outset") {
            sheet.deleteRule(i);
            deleted++;
          }
        }
      }
      return { host: s, before, deleted, ownDeclaration: before.declared };
    }, sel);
    await page.waitForTimeout(400);
    const after = await page.evaluate((s) => {
      const el = document.querySelector<HTMLElement>(s);
      const ring = document.querySelector<SVGElement>(".focus-ring");
      const rb = ring?.getBoundingClientRect();
      return {
        rings: document.querySelectorAll(".focus-ring").length,
        w: rb ? +rb.width.toFixed(2) : null,
        declared: el
          ? getComputedStyle(el).getPropertyValue("--focus-ring-outset").trim()
          : null,
      };
    }, sel);
    rows.push({ ...r, after });
  }
  bank(`R2-C-ablation-hosts-${browserName}.json`, { engine: browserName, rows });
  console.log("C " + JSON.stringify(rows));
});

// ── D · critique §2.7 · the gesture a mouse user actually makes ──────────────────────────
test("D · §2.7 a real pointer landing on the target itself", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  const rows: unknown[] = [];
  for (const sel of [".sun-moon-toggle", ".drawer-tab", "button.logo-trigger"]) {
    const loc = page.locator(sel).first();
    if (!(await loc.count())) {
      rows.push({ host: sel, present: 0 });
      continue;
    }
    await page.reload();
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
    await page.waitForTimeout(1000);
    const box = await loc.boundingBox();
    if (!box) {
      rows.push({ host: sel, box: null });
      continue;
    }
    // A mouse press, not a synthetic .click(): down and up where a hand would put them.
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(900);
    rows.push(
      await page.evaluate((s) => {
        const a = document.activeElement as HTMLElement | null;
        const el = document.querySelector<HTMLElement>(s);
        return {
          host: s,
          activeIsHost: a === el || !!el?.contains(a),
          active: a ? a.tagName.toLowerCase() + "." + String(a.className).split(/\s+/)[0] : null,
          fv: !!a?.matches(":focus-visible"),
          rings: document.querySelectorAll(".focus-ring").length,
        };
      }, sel),
    );
  }
  bank(`R2-D-pointer-modality-${browserName}.json`, { engine: browserName, rows });
  console.log("D " + JSON.stringify(rows));
});

// ── E · critique §2.6 · what else the coarse tape's painted label covers ─────────────────
//
// W2 §2.5 as the chair restated it in §6.1 is a CLASS law, measured against the tape's own
// painted `<path>` bounding box. The family measured the label against the ring on ITS cell;
// this row asks which OTHER interactive boxes the painted label overlaps.
test("E · §2.6 the label's painted bbox over its neighbours", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 393, height: 699 });
  await page.goto("./?game=sudoku&size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
  const row = await page.evaluate(() => {
    const cells = Array.from(
      document.querySelectorAll<HTMLElement>('[role="grid"] [role="gridcell"]'),
    );
    const labels = Array.from(document.querySelectorAll<HTMLElement>(".washi-label"));
    const overlaps = (a: DOMRect, b: DOMRect) =>
      Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
      Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return {
      cells: cells.length,
      cellBox: cells[0]
        ? +cells[0].getBoundingClientRect().width.toFixed(2) +
          "x" +
          +cells[0].getBoundingClientRect().height.toFixed(2)
        : null,
      labels: labels.length,
      rows: labels.map((l) => {
        const p = l.querySelector("path");
        const rect = (p
          ? (p as SVGGraphicsElement).getBoundingClientRect()
          : l.getBoundingClientRect()) as DOMRect;
        const cover = cells
          .map((c) => +overlaps(rect, c.getBoundingClientRect()).toFixed(2))
          .filter((a) => a > 0);
        return {
          node:
            +l.getBoundingClientRect().width.toFixed(2) +
            "x" +
            +l.getBoundingClientRect().height.toFixed(2),
          paintedPath: p ? +rect.width.toFixed(2) + "x" + +rect.height.toFixed(2) : null,
          pointerEvents: getComputedStyle(l).pointerEvents,
          cellsCovered: cover.length,
          coveredAreaPx2: +cover.reduce((s, x) => s + x, 0).toFixed(2),
        };
      }),
    };
  });
  bank(`R2-E-label-neighbours-${browserName}.json`, { engine: browserName, ...row });
  console.log("E " + JSON.stringify(row));
});

// ── F · critique §2.5 · the note rung's one home, and the row that deletes it ────────────
test("F · §2.5 --motion-note is published once and fails loud", async ({ page, browserName }) => {
  await boardReady(page);
  const row = await page.evaluate(() => {
    const marks = document.querySelector<HTMLElement>(".pencil-marks, .user-marks");
    const read = () => {
      const m = document.querySelector<HTMLElement>(".pencil-marks, .user-marks");
      if (!m) return null;
      const cs = getComputedStyle(m);
      return {
        duration: cs.animationDuration,
        name: cs.animationName,
        token: cs.getPropertyValue("--motion-note").trim(),
      };
    };
    const before = read();
    let deleted = 0;
    let rootCopies = 0;
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (let i = rules.length - 1; i >= 0; i--) {
        const rr = rules[i] as CSSRule & { name?: string };
        if (rr.constructor.name === "CSSPropertyRule" && rr.name === "--motion-note") {
          sheet.deleteRule(i);
          deleted++;
        } else {
          const sr = rr as CSSStyleRule;
          if (sr.style && sr.style.getPropertyValue("--motion-note")) rootCopies++;
        }
      }
    }
    return { present: !!marks, before, deleted, rootCopies, after: read() };
  });
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => {
    const m = document.querySelector<HTMLElement>(".pencil-marks, .user-marks");
    return m ? getComputedStyle(m).animationDuration : null;
  });
  bank(`R2-F-motion-note-${browserName}.json`, { engine: browserName, ...row, afterSettled: after });
  console.log("F " + JSON.stringify({ ...row, afterSettled: after }));
});

// ── G · the rank, re-read after the ten fallbacks were struck ────────────────────────────
test("G · G-LIVE-14 the rank in both arms", async ({ page, browserName }) => {
  const arms: unknown[] = [];
  for (const contrast of ["no-preference", "more"] as const) {
    await page.emulateMedia({ contrast });
    await boardReady(page);
    arms.push(
      await page.evaluate((arm) => {
        const grid = document.querySelector('[role="grid"]');
        const cells = Array.from(
          grid?.querySelectorAll<HTMLElement>("[role=gridcell]") ?? [],
        );
        const ghostOf = (c: Element) =>
          c.querySelector<SVGPathElement>(".cell-ghost-path");
        const read = (c: Element | null | undefined) => {
          const g = c ? ghostOf(c) : null;
          return g
            ? {
                strokeOpacity: getComputedStyle(g).strokeOpacity,
                strokeWidth: getComputedStyle(g).strokeWidth,
                stroke: getComputedStyle(g).stroke,
              }
            : null;
        };
        const input = cells
          .map((c) => c.querySelector<HTMLInputElement>("input.cell-native-input"))
          .find((i) => i && !i.value);
        input?.focus();
        const focusCell = input?.closest("[role=gridcell]");
        const invalid = document.querySelector(".game-cell.is-invalid");
        const peer = document.querySelector(".game-cell.is-peer-cursor");
        return {
          arm,
          matchMedia: matchMedia("(prefers-contrast: more)").matches,
          tier2_focus: read(focusCell),
          tier3_invalid: read(invalid),
          tier4_peer: read(peer),
          tier1_hover_sheet: (() => {
            for (const s of Array.from(document.styleSheets)) {
              let rs: CSSRuleList;
              try {
                rs = s.cssRules;
              } catch {
                continue;
              }
              for (const r of Array.from(rs)) {
                const t = r.cssText || "";
                if (
                  t.includes(":hover") &&
                  t.includes("cell-ghost-path") &&
                  t.includes("stroke-opacity")
                )
                  return t.slice(0, 260);
              }
            }
            return null;
          })(),
        };
      }, contrast),
    );
  }
  bank(`R2-G-rank-${browserName}.json`, { engine: browserName, arms });
  console.log("G " + JSON.stringify(arms));
});
