/**
 * MRK-WASH pass-1 · W4 — THE CHROME WAX GROUND.
 *
 * Six bespoke geometric rects and the UA default are struck in one sweep and replaced by a
 * ground. Three questions per subject, all from painted bytes, by the same difference method
 * the board wash used:
 *
 *   FINDABLE   the ground's own 1.4.11 against the control's unfocused ground (≥ 3:1)
 *   READABLE   the control's TEXT through the ground (≥ 4.5:1, `access.spec.ts` 2.3's floor)
 *   WHOLE      a ground has no reach: outlineOffset + outlineWidth = 0, so R3-e's 3.6px of
 *              deck headroom stops being a constraint. Measured, not asserted.
 *
 * The subject-count guard is explicit: a sweep that reached fewer than three real controls
 * proves nothing, so the row carries `reached` and the arm is void below three.
 */
import { chromium, webkit } from "playwright";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HERE, bank, decode, sampleRect, lum, ratio, boardReady } from "./lib.mjs";

const GROUND_CSS = readFileSync(join(HERE, "..", "proto", "wax-ground.css"), "utf8");

const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y) / 116 + 16 / 116;
  return 116 * f - 16;
};
const med = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const medPx = (px) => [med(px.map((p) => p[0])), med(px.map((p) => p[1])), med(px.map((p) => p[2]))];

function boxPixels(img, rect, dpr, inset = 0.1) {
  const x0 = Math.max(0, Math.round((rect.x + rect.width * inset) * dpr));
  const x1 = Math.min(img.w, Math.round((rect.x + rect.width * (1 - inset)) * dpr));
  const y0 = Math.max(0, Math.round((rect.y + rect.height * inset) * dpr));
  const y1 = Math.min(img.h, Math.round((rect.y + rect.height * (1 - inset)) * dpr));
  const px = [];
  for (let y = y0; y < y1; y++)
    for (let x = x0; x < x1; x++) {
      const i = (y * img.w + x) * img.ch;
      px.push([img.data[i], img.data[i + 1], img.data[i + 2]]);
    }
  return px;
}

/** ink vs ground inside one control: the extremes of its own box, painted. */
function inkAndGround(img, rect, dpr) {
  const px = boxPixels(img, rect, dpr, 0.06);
  if (px.length < 40) return null;
  const byL = px.map((p) => [lstar(p), p]).sort((a, b) => a[0] - b[0]);
  const dark = medPx(byL.slice(0, Math.max(1, Math.floor(byL.length * 0.05))).map((r) => r[1]));
  const light = medPx(byL.slice(-Math.max(1, Math.floor(byL.length * 0.2))).map((r) => r[1]));
  return { ink: dark, ground: light, textRatio: ratio(dark, light) };
}

const SUBJECTS = [
  { name: "ctrl-btn (size chip)", sel: ".ctrl-btn" },
  { name: "icon-btn (a verb)", sel: ".icon-btn" },
  { name: "info-btn", sel: ".info-btn" },
  { name: "drawer-tab (the tongue)", sel: ".drawer-tab" },
  { name: "sun-moon-toggle", sel: ".sun-moon-toggle" },
  { name: "logo-trigger (masthead)", sel: ".logo-trigger" },
  { name: "attribution-trigger", sel: ".attribution-trigger" },
];

const ALPHAS = ["6%", "10%", "14%", "18%", "24%", "30%", "40%"];
const INKS = ["var(--color-pencil-graphite)", "var(--color-crayon-blue)"];

const out = {};
for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    await boardReady(page);
    await page.keyboard.press("Tab"); // establish keyboard modality for both engines

    // Which subjects are on screen and can actually take focus.
    const present = [];
    for (const s of SUBJECTS) {
      const r = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const b = el.getBoundingClientRect();
        if (b.width < 8 || b.height < 8) return null;
        return { x: b.x, y: b.y, width: b.width, height: b.height };
      }, s.sel);
      if (r) present.push({ ...s, rect: r });
    }

    const rows = [];
    // CONTROL: the incumbent indicators, measured the same way.
    await page.addStyleTag({ content: GROUND_CSS });
    await page.evaluate(() => {
      // Park the overlay by neutralising its alpha; the CONTROL arm must paint HEAD's rings.
      document.documentElement.style.setProperty("--ground-a", "0%");
      document.documentElement.style.setProperty("--ground-hover-a", "0%");
    });

    for (const ink of INKS) {
      for (const a of ["CONTROL", ...ALPHAS]) {
        await page.evaluate(
          ({ a, ink }) => {
            const s = document.documentElement.style;
            s.setProperty("--ground-a", a === "CONTROL" ? "0%" : a);
            s.setProperty("--ground-ink", ink);
          },
          { a, ink },
        );
        let reached = 0;
        const subjects = [];
        for (const s of present) {
          await page.evaluate(() => {
            document.querySelectorAll(".wax-probe-focus").forEach((e) => e.classList.remove("wax-probe-focus"));
            document.activeElement?.blur?.();
          });
          await page.waitForTimeout(140);
          const off = await decode(await page.screenshot({ type: "png" }));
          const real = await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            el.focus();
            const fv = el.matches(":focus-visible");
            if (!fv) el.classList.add("wax-probe-focus");
            return fv;
          }, s.sel);
          await page.waitForTimeout(220);
          const on = await decode(await page.screenshot({ type: "png" }));

          // the ground's own change, isolated
          const onPx = boxPixels(on, s.rect, 1, 0.14);
          const offPx = boxPixels(off, s.rect, 1, 0.14);
          const onG = medPx(onPx);
          const offG = medPx(offPx);
          const moved = Math.abs(lstar(onG) - lstar(offG));
          const text = inkAndGround(on, s.rect, 1);
          if (moved >= 1) reached++;
          subjects.push({
            subject: s.name,
            realFocusVisible: real,
            groundOn: onG,
            groundOff: offG,
            dLstar: Math.round(moved * 100) / 100,
            findRatio: ratio(onG, offG),
            textRatio: text?.textRatio ?? null,
            reach: await page.evaluate((sel) => {
              const cs = getComputedStyle(document.querySelector(sel));
              return Math.round((parseFloat(cs.outlineOffset) + parseFloat(cs.outlineWidth)) * 10) / 10;
            }, s.sel),
          });
        }
        rows.push({ ink, alpha: a, reached, subjects });
      }
    }
    const key = `${engineName}-${theme}`;
    out[key] = { present: present.map((p) => p.name), rows };
    for (const r of rows) {
      const worstFind = Math.min(...r.subjects.map((s) => s.findRatio));
      const worstText = Math.min(...r.subjects.filter((s) => s.textRatio).map((s) => s.textRatio));
      console.log(
        `GROUND ${key} ink=${r.ink.includes("blue") ? "crayon-blue" : "graphite"} a=${r.alpha} ` +
          `reached=${r.reached}/${r.subjects.length} worstFind=${worstFind} worstText=${worstText} ` +
          `reach=${[...new Set(r.subjects.map((s) => s.reach))].join(",")}`,
      );
    }
    await ctx.close();
  }
  await browser.close();
}
bank("ground.json", out);
