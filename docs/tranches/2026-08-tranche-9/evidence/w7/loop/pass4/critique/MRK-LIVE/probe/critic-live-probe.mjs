// MRK-LIVE pass-4 CRITIC probe. Runs against the lane dev server (4246).
// A · G-LIVE-16 falsifiability: the gate's own walk, instrumented, plus an injected
//     STRANDED focusable with no indicator. If the gate greens with it present, it cannot fail.
// B · --ring-ink bare ablation re-run (recursive CSSOM walk), both engines.
// C · the rank read off live paint (tier1/tier2 stroke-opacity).
// D · the phone coarse arm: the WebKit stray-ring cure, in a witnessed coarse regime.
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4246";
const OUT = process.env.OUT || "/tmp/critic-live-probe.json";
const out = {};

async function boardReady(page) {
  await page.goto(BASE + "/?game=sudoku");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}

for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  const r = {};

  // ── A + B + C : desktop fine-pointer context ──────────────────────────────
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await boardReady(page);

    // A. the gate's walk, instrumented, WITH a stranded focusable injected.
    r.glive16 = await page.evaluate(() => {
      const strand = document.createElement("button");
      strand.id = "critic-stranded";
      strand.className = "critic-stranded";
      strand.textContent = "x";
      strand.style.cssText =
        "position:fixed;left:2px;top:2px;width:40px;height:40px;z-index:99;outline:none!important;";
      document.body.appendChild(strand);

      const FOCUSABLE =
        'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
      const stops = Array.from(document.querySelectorAll(FOCUSABLE)).filter((e) => {
        const b = e.getBoundingClientRect();
        return b.width > 0 && b.height > 0 && !e.closest("[inert]");
      });
      const seen = new Map();
      const sample = [];
      for (const e of stops) {
        const k = e.tagName + "." + (String(e.className).split(" ")[0] || "");
        const n = seen.get(k) ?? 0;
        if (n < 2) {
          seen.set(k, n + 1);
          sample.push(e);
        }
        if (sample.length >= 24) break;
      }
      const rows = [];
      let judged = 0;
      const bad = [];
      for (const e of sample) {
        e.focus({ preventScroll: true });
        const took = document.activeElement === e;
        const fv = took && e.matches(":focus-visible");
        const drawn = document.querySelectorAll(".focus-ring").length > 0;
        const boardInk = !!e.closest(".game-cell")?.querySelector(".cell-ghost-path");
        const outline = parseFloat(getComputedStyle(e).outlineWidth) > 0;
        const id = e.tagName.toLowerCase() + "." + String(e.className).split(" ")[0];
        rows.push({ id, took, fv, drawn, boardInk, outline });
        if (!took || !fv) continue;
        judged++;
        if (!drawn && !boardInk && !outline) bad.push(id);
      }
      const strandedRow = rows.find((x) => x.id.includes("critic-stranded")) ?? null;
      strand.remove();
      return {
        sampled: sample.length,
        judged,
        bad,
        strandedRow,
        strandedInSample: !!strandedRow,
        ringNodesDuringWalk: [...new Set(rows.map((x) => x.drawn))],
        rows,
      };
    });

    // A2. does the ring node exist at all after ONE awaited focus? (Vue flush timing)
    await page.keyboard.press("Tab");
    await page.evaluate(() =>
      document.querySelector(".drawer-tab")?.focus({ preventScroll: true }),
    );
    await page.waitForTimeout(400);
    r.ringAfterAwaitedFocus = await page.evaluate(
      () => document.querySelectorAll(".focus-ring").length,
    );

    // B. --ring-ink ablation, recursive walk.
    r.ringInk = await page.evaluate(() => {
      const target = document.querySelector(".focus-ring");
      const before = target ? getComputedStyle(target.querySelector("path")).stroke : null;
      let deleted = 0;
      const removed = [];
      const walk = (rules) => {
        for (let i = rules.length - 1; i >= 0; i--) {
          const rule = rules[i];
          if (rule.cssRules) {
            walk(rule.cssRules);
            continue;
          }
          if (rule.style && rule.style.getPropertyValue("--ring-ink")) {
            removed.push(rule.selectorText);
            rule.style.removeProperty("--ring-ink");
            deleted++;
          }
        }
      };
      for (const s of Array.from(document.styleSheets)) {
        try {
          walk(s.cssRules);
        } catch {
          /* cross-origin */
        }
      }
      const t2 = document.querySelector(".focus-ring");
      const after = t2 ? getComputedStyle(t2.querySelector("path")).stroke : null;
      return { before, after, deleted, removed };
    });

    // C. the rank, live paint.
    r.rank = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll(".game-cell"));
      cells[0]?.querySelector("input")?.focus();
      const read = (c) => {
        const p = c?.querySelector(".cell-ghost-path");
        return p ? parseFloat(getComputedStyle(p).strokeOpacity) : null;
      };
      return { tier2: read(cells[0]), tier1: read(cells[cells.length - 1]) };
    });

    // C2. the mouse landing claim.
    await page.reload();
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
    await page.waitForTimeout(1000);
    const box = await page.locator(".sun-moon-toggle").first().boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.up();
      await page.waitForTimeout(600);
      r.mouseLanding = await page.evaluate(() => {
        const a = document.activeElement;
        return {
          active: a ? a.tagName.toLowerCase() + "." + String(a.className).split(" ")[0] : null,
          fv: a && a !== document.body ? a.matches(":focus-visible") : false,
          rings: document.querySelectorAll(".focus-ring").length,
        };
      });
    }
    await ctx.close();
  }

  // ── D : the phone, witnessed coarse regime ────────────────────────────────
  {
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 699 },
      deviceScaleFactor: 2,
      hasTouch: true,
      isMobile: name === "chromium" ? true : undefined,
    });
    const page = await ctx.newPage();
    await boardReady(page);
    r.regime = await page.evaluate(() => ({
      coarse: matchMedia("(pointer: coarse)").matches,
      noHover: matchMedia("(hover: none)").matches,
      dpr: devicePixelRatio,
    }));
    const hasTab = await page.locator(".drawer-tab").count();
    if (hasTab) {
      await page.keyboard.press("Tab");
      await page.evaluate(() =>
        document.querySelector(".drawer-tab")?.focus({ preventScroll: true }),
      );
      await page.waitForTimeout(400);
      const read = () =>
        page.evaluate(() => {
          const ring = document.querySelector(".focus-ring");
          const a = document.activeElement;
          const tab = document.querySelector(".drawer-tab");
          if (!ring) return { rings: 0, active: a?.tagName.toLowerCase() ?? null, err: null };
          const rb = ring.getBoundingClientRect();
          const bb = tab.getBoundingClientRect();
          const o = parseFloat(getComputedStyle(tab).getPropertyValue("--focus-ring-outset"));
          return {
            rings: document.querySelectorAll(".focus-ring").length,
            active: a?.tagName.toLowerCase() ?? null,
            err: +Math.max(Math.abs(rb.left - (bb.left - o)), Math.abs(rb.top - (bb.top - o))).toFixed(2),
          };
        });
      r.phoneBefore = await read();
      await page.evaluate(() => document.querySelector(".drawer-tab")?.click());
      await page.waitForTimeout(260);
      r.phoneMid = await read();
      await page.waitForTimeout(900);
      r.phoneSettled = await read();
    } else {
      r.phone = "no .drawer-tab at 393x699";
    }
    await ctx.close();
  }

  await browser.close();
  out[name] = r;
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("DONE", OUT);
