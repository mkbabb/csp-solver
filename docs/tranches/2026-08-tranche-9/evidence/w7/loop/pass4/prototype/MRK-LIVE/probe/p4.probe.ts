/**
 * T9-W7 pass 4 · MRK-LIVE · the rows the pass-3 record left open.
 *
 * Prototype worktree `wf_f72f3b5a-83a-35` on 127.0.0.1:4238; the HEAD control
 * (`74a2b5d9`, `.claude/worktrees/w7-control`) on 127.0.0.1:4239 via PLAYWRIGHT_BASE_URL.
 *
 * PRM: live, because every row here samples the dock's WAAPI glide and the ring's own settle
 * on the real surface; the frozen arm is asserted in the estate spec this pass lands.
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

// ── N1 · gap 3 · `--ring-ink` consumed BARE: the born-RED under the new form ─────────────
//
// Pass 3 read the ablation under `var(--ring-ink, currentColor)` and got currentColor
// (rgb(10,10,10)) — a value the design never named. Bare, an absent declaration is invalid at
// computed-value time and `stroke` (inherited, initial `black`) falls to rgb(0,0,0) instead.
// The negative control restores the declaration in the same run.
test("N1 · --ring-ink bare, ablated", async ({ page, browserName }) => {
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
  // Delete the DECLARATION (not the consumer) from the live CSSOM.
  const deleted = await page.evaluate(() => {
    let n = 0;
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const r of Array.from(rules)) {
        const st = (r as CSSStyleRule).style;
        if (st && st.getPropertyValue("--ring-ink")) {
          st.removeProperty("--ring-ink");
          n++;
        }
      }
    }
    return n;
  });
  await page.waitForTimeout(250);
  const after = await read();
  await page.evaluate(() =>
    document.documentElement.style.setProperty("--ring-ink", "var(--color-focus-sketch)"),
  );
  await page.waitForTimeout(250);
  const restored = await read();
  bank(`N1-ring-ink-bare-${browserName}.json`, {
    engine: browserName,
    before,
    deletedDeclarations: deleted,
    after,
    restored,
    moved: before.stroke !== after.stroke,
    restoredToBefore: restored.stroke === before.stroke,
  });
});

// ── N2 · gap 2 · G-LIVE-18 RE-CUT: the registration's two jobs, on three host classes ────
//
// Pass 3's row said "delete the registration and no ring with a box exists". A critic proved
// that false on the three hosts that declare a PLAIN length: unregistered, `6.5px` still
// reaches JS as a token stream that `parseFloat` reads. The re-cut names what the registration
// actually buys and measures each half where it can fail:
//   (i)  the INITIAL VALUE, for a host that declares nothing        — logo-trigger, 3px
//   (ii) the TYPING, for a host whose declaration is a calc()       — sun-moon-toggle
//   (iii) the TYPING, for a host declaring a plain length: re-register with `<angle>` and the
//         declared `6.5px` becomes invalid at computed-value time and dies too — .drawer-tab
// Negative control in the same run: restore the original registration; every row returns.
test("N2 · G-LIVE-18 re-cut, three host classes", async ({ page, browserName }) => {
  await boardReady(page);
  const HOSTS = ["button.logo-trigger", ".drawer-tab", ".sun-moon-toggle"];
  const readHost = (sel: string) =>
    page.evaluate((s) => {
      const el = document.querySelector<HTMLElement>(s);
      if (!el) return { host: s, present: false } as Record<string, unknown>;
      const ring = document.querySelector<SVGElement>(".focus-ring");
      return {
        host: s,
        present: true,
        rings: document.querySelectorAll(".focus-ring").length,
        ringW: ring ? +ring.getBoundingClientRect().width.toFixed(2) : null,
        declared: getComputedStyle(el).getPropertyValue("--focus-ring-outset").trim(),
        parsed: parseFloat(
          getComputedStyle(el).getPropertyValue("--focus-ring-outset"),
        ),
      };
    }, sel);
  const focusHost = async (sel: string) => {
    await page.keyboard.press("Tab");
    await page.evaluate(
      (s) => document.querySelector<HTMLElement>(s)?.focus({ preventScroll: true }),
      sel,
    );
    await page.waitForTimeout(450);
  };
  /** Delete the @property rule; optionally insert a replacement with a different syntax. */
  const reRegister = (syntax: string | null, initial: string) =>
    page.evaluate(
      ([syn, init]) => {
        let deleted = 0;
        let text = "";
        for (const sheet of Array.from(document.styleSheets)) {
          let rules: CSSRuleList;
          try {
            rules = sheet.cssRules;
          } catch {
            continue;
          }
          for (let i = rules.length - 1; i >= 0; i--) {
            const r = rules[i];
            if (
              r.constructor.name === "CSSPropertyRule" &&
              (r as unknown as { name: string }).name === "--focus-ring-outset"
            ) {
              text = r.cssText;
              sheet.deleteRule(i);
              deleted++;
            }
          }
        }
        if (syn) {
          const s = document.styleSheets[0];
          s.insertRule(
            `@property --focus-ring-outset { syntax: "${syn}"; inherits: false; initial-value: ${init}; }`,
            s.cssRules.length,
          );
        }
        return { deleted, text };
      },
      [syntax, initial] as const,
    );

  const rows: unknown[] = [];
  // arm A — no registration at all
  for (const h of HOSTS) {
    await boardReady(page);
    await focusHost(h);
    const before = await readHost(h);
    const ab = await reRegister(null, "");
    await page.waitForTimeout(300);
    const after = await readHost(h);
    rows.push({ arm: "delete", ...{ before, ablation: ab, after } });
  }
  // arm B — re-registered as <angle>: a declared PLAIN LENGTH is now invalid too
  for (const h of HOSTS) {
    await boardReady(page);
    await focusHost(h);
    const before = await readHost(h);
    const ab = await reRegister("<angle>", "0deg");
    await page.waitForTimeout(300);
    const after = await readHost(h);
    rows.push({ arm: "retype<angle>", ...{ before, ablation: ab, after } });
  }
  // negative control — the registration back as shipped
  await boardReady(page);
  await focusHost(".drawer-tab");
  const ctlBefore = await readHost(".drawer-tab");
  await reRegister(null, "");
  await page.waitForTimeout(200);
  const ctlAblated = await readHost(".drawer-tab");
  await page.evaluate(() => {
    const s = document.styleSheets[0];
    s.insertRule(
      `@property --focus-ring-outset { syntax: "<length>"; inherits: false; initial-value: 3px; }`,
      s.cssRules.length,
    );
  });
  await page.waitForTimeout(300);
  const ctlRestored = await readHost(".drawer-tab");
  bank(`N2-glive18-recut-${browserName}.json`, {
    engine: browserName,
    rows,
    negativeControl: { ctlBefore, ctlAblated, ctlRestored },
  });
});

// ── N3 · gap 7 · a real mouse landing on the target itself ───────────────────────────────
test("N3 · a real pointer landing", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const sel of [".drawer-tab", ".sun-moon-toggle", "button.logo-trigger"]) {
    await boardReady(page);
    const box = await page.locator(sel).first().boundingBox();
    if (!box) {
      rows.push({ host: sel, present: false });
      continue;
    }
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(900);
    rows.push(
      await page.evaluate((s) => {
        const a = document.activeElement as HTMLElement | null;
        const ring = document.querySelector<SVGElement>(".focus-ring");
        return {
          host: s,
          present: true,
          active: a ? a.tagName.toLowerCase() + "." + (a.className || "") : null,
          activeIsHost: !!a?.matches(s),
          fv: !!a?.matches(":focus-visible"),
          rings: document.querySelectorAll(".focus-ring").length,
          ringW: ring ? +ring.getBoundingClientRect().width.toFixed(2) : null,
          ringH: ring ? +ring.getBoundingClientRect().height.toFixed(2) : null,
        };
      }, sel),
    );
  }
  // and the keyboard arm on the same toggle, for the contrast the frame needs
  await boardReady(page);
  await page.keyboard.press("Tab");
  await page.evaluate(() =>
    document
      .querySelector<HTMLElement>(".sun-moon-toggle")
      ?.focus({ preventScroll: true }),
  );
  await page.waitForTimeout(900);
  const kb = await page.evaluate(() => {
    const ring = document.querySelector<SVGElement>(".focus-ring");
    return {
      host: ".sun-moon-toggle (keyboard)",
      fv: !!document.activeElement?.matches(":focus-visible"),
      rings: document.querySelectorAll(".focus-ring").length,
      ringW: ring ? +ring.getBoundingClientRect().width.toFixed(2) : null,
      ringH: ring ? +ring.getBoundingClientRect().height.toFixed(2) : null,
    };
  });
  bank(`N3-pointer-landing-${browserName}.json`, { engine: browserName, rows, kb });
});

// ── N4 · gap 8 · G-LIVE-16's four `0 == 0` webkit rows, exercised ────────────────────────
//
// Pass 3 read the masthead link and a Tab-arrived tab as fv=false / 0 rings in webkit because
// the walk never reached them and a programmatic focus on an <a> does not stick. This row
// reaches the link by WALKING to it and reports the walk's length, so a row that is trivially
// satisfied says so by its own number.
test("N4 · G-LIVE-16 exercised, not assumed", async ({ page, browserName }) => {
  await boardReady(page);
  const walk = await page.evaluate(async () => {
    const seen: string[] = [];
    return { seen };
  });
  const rows: unknown[] = [];
  for (const target of [".drawer-tab", "a[href^='https://']", "button.logo-trigger"]) {
    await boardReady(page);
    let reachedAt = -1;
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press("Tab");
      const hit = await page.evaluate(
        (s) => !!document.activeElement?.matches(s),
        target,
      );
      if (hit) {
        reachedAt = i + 1;
        break;
      }
    }
    await page.waitForTimeout(400);
    rows.push({
      target,
      reachedAtPress: reachedAt,
      ...(await page.evaluate((s) => {
        const a = document.activeElement as HTMLElement | null;
        return {
          active: a ? a.tagName.toLowerCase() : null,
          isTarget: !!a?.matches(s),
          fv: !!a?.matches(":focus-visible"),
          rings: document.querySelectorAll(".focus-ring").length,
          exercised: !!a?.matches(s),
        };
      }, target)),
    });
  }
  bank(`N4-glive16-exercised-${browserName}.json`, { engine: browserName, walk, rows });
});

// ── N5 · gap 9 · the token comment's figures, from PAINTED bytes ─────────────────────────
//
// The comment claims 3.97/3.61 light and 4.00/3.73 dark for the board ring at its shipped
// opacity. A critic recomputed 3.57/3.71 at 0.95 from tokens. Neither is a painted read. This
// samples the focused cell's painted ring pixel and its own fill pixel off the page itself.
test("N5 · painted contrast of the board ring", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await boardReady(page);
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      const i = document.querySelector<HTMLInputElement>(".game-cell input");
      i?.focus();
    });
    await page.waitForTimeout(900);
    const geom = await page.evaluate(() => {
      const cell = document
        .querySelector<HTMLElement>(".game-cell input")
        ?.closest<HTMLElement>(".game-cell");
      const ghost = cell?.querySelector<SVGPathElement>(".cell-ghost-path");
      if (!cell || !ghost) return null;
      const b = ghost.getBoundingClientRect();
      const cs = getComputedStyle(ghost);
      return {
        box: { x: b.x, y: b.y, w: b.width, h: b.height },
        strokeOpacity: cs.strokeOpacity,
        stroke: cs.stroke,
        fill: cs.fill,
        fillOpacity: cs.fillOpacity,
        theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
      };
    });
    if (!geom) {
      rows.push({ theme, ok: false });
      continue;
    }
    const buf = await page.screenshot({
      clip: {
        x: Math.max(0, geom.box.x - 6),
        y: Math.max(0, geom.box.y - 6),
        width: geom.box.w + 12,
        height: geom.box.h + 12,
      },
    });
    rows.push({ theme, ...geom, pngBytes: buf.length, png: buf.toString("base64") });
  }
  const slim = rows.map((r) => {
    const o = { ...(r as Record<string, unknown>) };
    delete o.png;
    return o;
  });
  writeFileSync(
    join(OUT, `N5-painted-raw-${browserName}.json`),
    JSON.stringify(rows),
  );
  bank(`N5-painted-geom-${browserName}.json`, { engine: browserName, rows: slim });
});

// ── N6 · gap 12 · the phone arm, with activeElement AT the reversal instant ──────────────
test("N6 · the phone arm, re-cut", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 393, height: 699 });
  await boardReady(page);
  const snap = () =>
    page.evaluate(() => {
      const a = document.activeElement as HTMLElement | null;
      const ring = document.querySelector<SVGElement>(".focus-ring");
      const owned = a?.getAttribute?.("aria-activedescendant");
      const box = (owned && document.getElementById(owned)) || a;
      const o = box
        ? parseFloat(getComputedStyle(box).getPropertyValue("--focus-ring-outset"))
        : NaN;
      const rb = ring?.getBoundingClientRect();
      const bb = box?.getBoundingClientRect();
      return {
        active: a
          ? a.tagName.toLowerCase() + (a.className ? "." + String(a.className).split(" ")[0] : "")
          : null,
        fv: !!a?.matches(":focus-visible"),
        rings: document.querySelectorAll(".focus-ring").length,
        outset: Number.isFinite(o) ? o : null,
        err:
          rb && bb
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
  // THE REVERSAL: press again mid-glide and read activeElement at that instant.
  await page.evaluate(() => document.querySelector<HTMLElement>(".drawer-tab")?.click());
  const atReversal = await snap();
  await page.waitForTimeout(160);
  const justAfter = await snap();
  await page.waitForTimeout(1400);
  const settled = await snap();
  bank(`N6-phone-recut-${browserName}.json`, {
    engine: browserName,
    viewport: "393x699",
    before,
    mid,
    atReversal,
    justAfter,
    settled,
  });
});

// ── N7 · π · computed PAINT properties and tag names, against the named control ──────────
test("π · paint census", async ({ page, browserName }) => {
  const which = process.env.MRKLIVE_ARM ?? "proto";
  await boardReady(page);
  const census = await page.evaluate(() => {
    const SEL = [
      "button.logo-trigger",
      ".drawer-tab",
      ".sun-moon-toggle",
      "[role=grid]",
      "main",
      ".pencil-marks",
      ".cell-ghost-path",
      ".game-cell",
    ];
    const out: Record<string, unknown>[] = [];
    for (const s of SEL) {
      const els = Array.from(document.querySelectorAll<HTMLElement>(s)).slice(0, 6);
      els.forEach((e, i) => {
        const c = getComputedStyle(e);
        const b = e.getBoundingClientRect();
        out.push({
          sel: s + "#" + i,
          tag: e.tagName.toLowerCase(),
          color: c.color,
          fill: c.fill,
          stroke: c.stroke,
          fillOpacity: c.fillOpacity,
          strokeOpacity: c.strokeOpacity,
          strokeWidth: c.strokeWidth,
          font: c.font,
          lineHeight: c.lineHeight,
          background: c.backgroundColor,
          opacity: c.opacity,
          rect: [
            +b.x.toFixed(2),
            +b.y.toFixed(2),
            +b.width.toFixed(2),
            +b.height.toFixed(2),
          ],
        });
      });
    }
    return out;
  });
  bank(`N7-pi-${browserName}-${which}.json`, { engine: browserName, arm: which, census });
});
