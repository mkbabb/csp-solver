// MRK-LIVE pass-4 CRITIC probe, round 2 — the two re-cuts my round-1 instrument owed.
// B2 · --ring-ink ablation: round 1's walk `continue`d on every CSSStyleRule because modern
//      CSSStyleRule EXPOSES an (empty) `cssRules` for CSS nesting. Style check FIRST now.
// D2 · the phone arm: round 1 measured the framing error against `.drawer-tab` even after
//      focus moved to another button. The error is now read against the LIVE target the ring
//      claims (activeElement, or its aria-activedescendant), with that element named.
// E  · G-LIVE-16's live clauses, separated: outline-STYLE vs outline-WIDTH.
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4246";
const OUT = process.env.OUT || "/tmp/critic-live-probe2.json";
const out = {};

const READ = () => {
  const a = document.activeElement;
  const owned = a?.getAttribute?.("aria-activedescendant");
  const box = (owned && document.getElementById(owned)) || a;
  const name = (e) =>
    e ? e.tagName.toLowerCase() + "." + (String(e.className).split(" ")[0] || "") : null;
  const rings = document.querySelectorAll(".focus-ring").length;
  const ring = document.querySelector(".focus-ring");
  if (!ring || !box || box === document.body)
    return { rings, active: name(a), target: name(box), err: null };
  const rb = ring.getBoundingClientRect();
  const bb = box.getBoundingClientRect();
  const o = parseFloat(getComputedStyle(box).getPropertyValue("--focus-ring-outset"));
  return {
    rings,
    active: name(a),
    target: name(box),
    outset: o,
    err: +Math.max(Math.abs(rb.left - (bb.left - o)), Math.abs(rb.top - (bb.top - o))).toFixed(2),
  };
};

async function boardReady(page) {
  await page.goto(BASE + "/?game=sudoku");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}

for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  const r = {};

  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await boardReady(page);
    await page.keyboard.press("Tab");
    await page.evaluate(() => document.querySelector(".drawer-tab")?.focus({ preventScroll: true }));
    await page.waitForTimeout(500);

    r.ringInk = await page.evaluate(() => {
      const path = () => document.querySelector(".focus-ring")?.querySelector("path");
      const p0 = path();
      const before = p0 ? getComputedStyle(p0).stroke : null;
      const hits = [];
      const walk = (rules) => {
        for (const rule of Array.from(rules)) {
          if (rule.style && rule.style.getPropertyValue("--ring-ink")) {
            hits.push({
              sel: rule.selectorText ?? "(no selector)",
              val: rule.style.getPropertyValue("--ring-ink").trim(),
            });
            rule.style.removeProperty("--ring-ink");
          }
          if (rule.cssRules && rule.cssRules.length) walk(rule.cssRules);
        }
      };
      for (const s of Array.from(document.styleSheets)) {
        try {
          walk(s.cssRules);
        } catch {
          /* unreadable sheet */
        }
      }
      const p1 = path();
      const after = p1 ? getComputedStyle(p1).stroke : null;
      return { before, after, declarations: hits.length, hits };
    });

    // E. G-LIVE-16's two live clauses, told apart.
    r.outlineClause = await page.evaluate(() => {
      const strand = document.createElement("button");
      strand.className = "critic-stranded";
      strand.style.cssText = "position:fixed;left:2px;top:2px;width:40px;height:40px;outline:none!important;";
      document.body.appendChild(strand);
      strand.focus({ preventScroll: true });
      const cs = getComputedStyle(strand);
      const sample = ["button.drawer-tab", "button.logo-trigger", "button.ctrl-btn"].map((s) => {
        const e = document.querySelector(s);
        if (!e) return { sel: s, missing: true };
        e.focus({ preventScroll: true });
        const c = getComputedStyle(e);
        return { sel: s, width: c.outlineWidth, style: c.outlineStyle, color: c.outlineColor };
      });
      const o = {
        strandedWidth: cs.outlineWidth,
        strandedStyle: cs.outlineStyle,
        gateReadsWidthGtZero: parseFloat(cs.outlineWidth) > 0,
        sample,
      };
      strand.remove();
      return o;
    });
    await ctx.close();
  }

  // D2. the phone arm, witnessed coarse regime, error against the LIVE target.
  {
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 699 },
      deviceScaleFactor: 2,
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await boardReady(page);
    r.regime = await page.evaluate(() => ({
      coarse: matchMedia("(pointer: coarse)").matches,
      noHover: matchMedia("(hover: none)").matches,
      dpr: devicePixelRatio,
    }));
    await page.keyboard.press("Tab");
    await page.evaluate(() => document.querySelector(".drawer-tab")?.focus({ preventScroll: true }));
    await page.waitForTimeout(400);
    r.before = await page.evaluate(READ);
    await page.evaluate(() => document.querySelector(".drawer-tab")?.click());
    await page.waitForTimeout(120);
    r.t120 = await page.evaluate(READ);
    await page.waitForTimeout(160);
    r.t280 = await page.evaluate(READ);
    await page.waitForTimeout(1000);
    r.settled = await page.evaluate(READ);
    // the reversal: press again mid-glide
    await page.evaluate(() => document.querySelector(".drawer-tab")?.click());
    await page.waitForTimeout(140);
    await page.evaluate(() => document.querySelector(".drawer-tab")?.click());
    await page.waitForTimeout(1200);
    r.afterReversal = await page.evaluate(READ);
    await ctx.close();
  }

  await browser.close();
  out[name] = r;
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("DONE", OUT);
