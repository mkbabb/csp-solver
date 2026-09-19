/**
 * MRK-WASH pass-1 · W4b — `access.spec.ts` 2.3, WITH THE GROUND UNDER THE TEXT.
 *
 * The gate's own method, copied byte-for-byte in spirit (`e2e/access.spec.ts:440-511`): parse
 * the computed colours, composite every ancestor background bottom-up to the first opaque
 * layer, and read the text against that. Two things this lane adds, because the gate cannot:
 *
 * 1. THE GATE NEVER FOCUSES ANYTHING. It measures `.icon-sublabel` and `.ctrl-btn` at rest, so
 *    a background that only paints on `:focus-visible` is outside what it composites. A wax
 *    ground is therefore invisible to the one gate that would have caught it. This instrument
 *    focuses each subject in turn and re-reads it — the arm the cure would have to carry.
 * 2. It sweeps the ground's alpha, so the record can say where the floor breaks rather than
 *    that it breaks.
 */
import { chromium, webkit } from "playwright";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HERE, bank, boardReady } from "./lib.mjs";

const GROUND_CSS = readFileSync(join(HERE, "..", "proto", "wax-ground.css"), "utf8");
const INVERT_CSS = readFileSync(join(HERE, "..", "proto", "wax-ground-invert.css"), "utf8");
const CARD = ".controls-card";

const sample = (page, only) =>
  page.evaluate(
    ({ CARD, only }) => {
      const parse = (c) => {
        const s = (c || "").trim();
        if (!s || s === "transparent") return [0, 0, 0, 0];
        let m = /^color\(\s*srgb\s+([^)]+)\)$/i.exec(s);
        if (m) {
          const parts = m[1].split("/");
          const rgb = parts[0].trim().split(/\s+/).map(Number);
          const a =
            parts[1] === undefined
              ? 1
              : Number(parts[1].trim().replace("%", "")) / (parts[1].includes("%") ? 100 : 1);
          return [rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, a];
        }
        m = /^rgba?\(([^)]+)\)$/i.exec(s);
        if (m) {
          const p = m[1].split(/[,/]/).map((x) => x.trim());
          const n = p.map((x) => (x.endsWith("%") ? Number(x.slice(0, -1)) / 100 : Number(x)));
          return [n[0], n[1], n[2], p[3] === undefined ? 1 : n[3]];
        }
        return [0, 0, 0, 0];
      };
      const over = (fg, bg) => {
        const a = fg[3] + bg[3] * (1 - fg[3]);
        if (a === 0) return [0, 0, 0, 0];
        const ch = (i) => (fg[i] * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / a;
        return [ch(0), ch(1), ch(2), a];
      };
      const lum = (c) => {
        const f = (x) => {
          const v = x / 255;
          return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
      };
      const read = (el, sel) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return null;
        const layers = [];
        for (let n = el; n; n = n.parentElement) {
          const c = parse(getComputedStyle(n).backgroundColor);
          if (c[3] > 0) layers.push(c);
          if (c[3] >= 1) break;
        }
        let bg = [255, 255, 255, 1];
        for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
        const fg = over(parse(getComputedStyle(el).color), bg);
        const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
        return {
          sel,
          text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 18),
          ratio: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
        };
      };
      const out = [];
      const sels = [`${CARD} .icon-sublabel`, `${CARD} .ctrl-btn`];
      if (only === null) {
        for (const sel of sels)
          for (const el of document.querySelectorAll(sel)) {
            const row = read(el, sel);
            if (row) out.push(row);
          }
        return out;
      }
      // ONE SUBJECT PER CALL. The focus + settle wait lives in node, not in the page: a long
      // in-page loop that focuses chips walks the app into a navigation and the evaluate dies
      // with "execution context was destroyed".
      let k = 0;
      for (const sel of sels)
        for (const el of document.querySelectorAll(sel)) {
          if (k++ !== only) continue;
          const row = read(el, sel);
          if (row) out.push(row);
        }
      return out;
    },
    { CARD, only },
  );

const out = {};
for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await boardReady(page);
    await page.keyboard.press("Tab");

    const key = `${engineName}-${theme}`;
    out[key] = {};
    const head = await sample(page, null);
    out[key].HEAD_at_rest = { n: head.length, worst: Math.min(...head.map((r) => r.ratio)), rows: head };
    const count = head.length;

    /** Focus subject i, settle the 150ms colour transition, then read it. */
    const focusedSweep = async () => {
      const rows = [];
      for (let i = 0; i < count; i++) {
        await page.evaluate(
          ({ CARD, i }) => {
            document.querySelectorAll(".wax-probe-focus").forEach((e) => e.classList.remove("wax-probe-focus"));
            let k = 0;
            for (const sel of [`${CARD} .icon-sublabel`, `${CARD} .ctrl-btn`])
              for (const el of document.querySelectorAll(sel)) {
                if (k++ !== i) continue;
                const t = el.closest("button, a") || el;
                t.focus();
                if (!t.matches(":focus-visible")) t.classList.add("wax-probe-focus");
              }
          },
          { CARD, i },
        );
        await page.waitForTimeout(400); // the ground fades in over `transition-colors 150ms`
        const r = await sample(page, i);
        if (r[0]) rows.push(r[0]);
      }
      return rows;
    };

    const headFocused = await focusedSweep();
    out[key].HEAD_focused = {
      n: headFocused.length,
      worst: Math.min(...headFocused.map((r) => r.ratio)),
    };

    await page.addStyleTag({ content: GROUND_CSS });
    await page.addStyleTag({ content: INVERT_CSS });
    for (const a of ["40%", "55%", "65%", "75%", "85%", "100%"]) {
      await page.evaluate((a) => document.documentElement.style.setProperty("--ground-a", a), a);
      await page.waitForTimeout(140);
      const rows = await focusedSweep();
      const worst = rows.reduce((x, y) => (x.ratio <= y.ratio ? x : y));
      out[key][`ground-${a}`] = {
        n: rows.length,
        worst: worst.ratio,
        worstText: worst.text,
        under45: rows.filter((r) => r.ratio < 4.5).length,
        rows,
      };
    }
    console.log(
      `INVERT ${key} head-rest=${out[key].HEAD_at_rest.worst} head-focus=${out[key].HEAD_focused.worst} ` +
        ["40%", "55%", "65%", "75%", "85%", "100%"]
          .map((a) => `${a}:${out[key][`ground-${a}`].worst}(${out[key][`ground-${a}`].under45}/${out[key][`ground-${a}`].n} under)`)
          .join(" "),
    );
    await ctx.close();
  }
  await browser.close();
}
bank("invert-ground.json", out);
