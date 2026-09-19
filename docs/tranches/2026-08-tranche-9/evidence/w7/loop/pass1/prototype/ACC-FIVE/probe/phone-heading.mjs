/**
 * phone-heading.mjs — row 11, taken on the PHONE.
 *
 * The desk rail's `h2.section-heading` reads muted after the cure. The phone's tab head is a
 * different node: `.mobile-heading-btn .section-heading`, which carries its OWN scoped
 * `color: var(--ink-press-quiet)` and an `.is-active` state. A scoped rule is unlayered and
 * outranks a `@layer utilities` utility class, so the retirement has to be measured there,
 * not inferred from the rail. Both engines, both themes, both tabs, after the tween settles.
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const OUT = process.env.OUT;
const out = { rows: [] };

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      colorScheme: scheme,
      reducedMotion: "reduce",
      viewport: { width: 393, height: 699 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
    await page.waitForTimeout(800);
    // open the dock sheet and let it SLIDE (~700ms) before reading anything in it
    await page
      .locator(".drawer-tab, [class*='drawer-tab']")
      .first()
      .click({ timeout: 8000 })
      .catch(() => {});
    await page.waitForTimeout(1100);
    // and settle the 250ms colour tween on the heads
    await page.waitForTimeout(600);

    const heads = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".mobile-heading-btn .section-heading")).map(
        (el) => ({
          text: el.textContent?.trim().slice(0, 24) ?? "",
          color: getComputedStyle(el).color,
          cls: el.className,
          active: el.classList.contains("is-active"),
        }),
      ),
    );
    // click the other tab so BOTH heads are seen in the active state
    await page
      .locator(".mobile-heading-btn")
      .nth(1)
      .click({ timeout: 6000 })
      .catch(() => {});
    await page.waitForTimeout(800);
    const heads2 = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".mobile-heading-btn .section-heading")).map(
        (el) => ({
          text: el.textContent?.trim().slice(0, 24) ?? "",
          color: getComputedStyle(el).color,
          active: el.classList.contains("is-active"),
        }),
      ),
    );
    const chroma = (css) => {
      const m = /rgba?\(([^)]+)\)/.exec(css);
      if (!m) return null;
      const [r, g, b] = m[1].split(",").map((v) => parseFloat(v));
      return +rgbToOklch(r, g, b).C.toFixed(4);
    };
    const all = [...heads, ...heads2].map((h) => ({ ...h, C: chroma(h.color) }));
    out.rows.push({ engine, scheme, heads: all, found: all.length });
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(`${OUT}/row11-phone-heading.json`, JSON.stringify(out, null, 2));
for (const r of out.rows)
  console.log(
    r.engine.padEnd(9),
    r.scheme.padEnd(5),
    "heads",
    r.found,
    "|",
    r.heads.map((h) => `${h.text}=${h.color} C${h.C}${h.active ? "*" : ""}`).join("  "),
  );
