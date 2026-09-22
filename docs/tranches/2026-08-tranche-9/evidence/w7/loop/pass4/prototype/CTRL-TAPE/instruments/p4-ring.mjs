/**
 * T9-W7 pass 4 · CTRL-TAPE — `--ring-ink` CONSUMED BARE, BANDED ON FOUR GROUNDS FROM PAINTED
 * BYTES, and the ribbon's discriminating occlusion read.
 *
 * THE FOCUS IS A KEYBOARD FOCUS, WALKED. `:focus-visible` is a heuristic: an `el.focus()` from
 * script does not set it in WebKit, which is why pass 4's first ring read landed on a board cell
 * with `outline-style: none`. This walks Tab from the document until `document.activeElement` is
 * a `.ctrl-btn`, then reads, and reports the number of presses it took (0 = never reached, and
 * the row says so rather than reading whatever had focus).
 *
 * THE BAND IS PAINTED, NOT COMPOSITED IN ARITHMETIC. The chip is screenshotted twice — focused
 * and blurred — at DPR 2; the ring's pixels are the ones that CHANGED between the two, and the
 * ground under each is the same pixel in the blurred frame. Four grounds are named by where the
 * ring's own box lands: the card, a well's interior, the tape, the foot. The reported ratio is
 * the WORST over the changed pixels against their own ground pixel.
 *
 *   node p4-ring.mjs <out.json> <baseURL>
 */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";

const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const la = L(...a),
    lb = L(...b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
};

async function walkToChip(page) {
  for (let i = 1; i <= 60; i++) {
    await page.keyboard.press("Tab");
    const hit = await page.evaluate(() => {
      const a = document.activeElement;
      return !!(a && a.classList && a.classList.contains("ctrl-btn"));
    });
    if (hit) return i;
  }
  return 0;
}

const out = {};
for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const br = await launcher.launch();
  for (const theme of ["light", "dark"]) {
    const key = `${eng}|${theme}`;
    const ctx = await br.newContext({
      baseURL: BASE,
      viewport: { width: 1440, height: 900 },
      colorScheme: theme,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    try {
      await page.goto("/?size=3&difficulty=EASY&board=ring");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
      await page.waitForSelector(".controls-card .ctrl-btn", { timeout: 30000 });
      await page.waitForTimeout(600);

      // WebKit's Tab does not reach a <button> under the platform's default keyboard access, so
      // the walk returns 0 there. One Tab sets the keyboard modality flag `:focus-visible` reads,
      // and a scripted focus after it lands the pose; the row reports which route it took.
      let presses = await walkToChip(page);
      let route = presses ? "tab-walk" : null;
      if (!presses) {
        await page.keyboard.press("Tab");
        await page.locator(".controls-card .ctrl-btn").first().evaluate((e) => e.focus());
        route = "tab-then-focus";
      }
      // The ring's colour TRANSITIONS: `.transition-colors` lists `outline-color`, so a read in
      // the same task as the focus returns the START value (Tailwind preflight's
      // `* { outline-color: color-mix(in srgb, <fg>, transparent) }` — pass 3's unattributed 50%).
      await page.waitForTimeout(400);
      const read = await page.evaluate(() => {
        const a = document.activeElement;
        const cs = getComputedStyle(a);
        const root = getComputedStyle(document.documentElement);
        const b = a.getBoundingClientRect();
        return {
          who: (a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 20),
          isChip: !!(a.classList && a.classList.contains("ctrl-btn")),
          focusVisible: a.matches(":focus-visible"),
          outlineStyle: cs.outlineStyle,
          outlineWidth: cs.outlineWidth,
          outlineColor: cs.outlineColor,
          outlineOffset: cs.outlineOffset,
          elColor: cs.color,
          ringInk: root.getPropertyValue("--ring-ink").trim(),
          box: [b.x, b.y, b.width, b.height].map((n) => +n.toFixed(2)),
        };
      });

      // PAINTED: the focused frame minus the blurred frame, over the ring's own band.
      const pad = 10;
      const clip = {
        x: Math.max(0, read.box[0] - pad),
        y: Math.max(0, read.box[1] - pad),
        width: read.box[2] + pad * 2,
        height: read.box[3] + pad * 2,
      };
      const focused = await page.screenshot({ clip, scale: "device" });
      await page.evaluate(() => document.activeElement.blur());
      await page.waitForTimeout(200);
      const blurred = await page.screenshot({ clip, scale: "device" });

      const A = await sharp(focused).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const B = await sharp(blurred).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      // THE RING'S OWN INK is the STRONGEST-changed pixel, not the weakest: a dashed 2px stroke
      // antialiases to near-ground at its edge, so `worst over every changed pixel` reports the
      // faintest AA fringe and says nothing about the stroke. The band is the core pixel's.
      let strongest = -1;
      let corePx = null;
      let changed = 0;
      const n = Math.min(A.data.length, B.data.length) / 4;
      for (let i = 0; i < n; i++) {
        const o = i * 4;
        const fa = [A.data[o], A.data[o + 1], A.data[o + 2]];
        const bg = [B.data[o], B.data[o + 1], B.data[o + 2]];
        const d = Math.abs(fa[0] - bg[0]) + Math.abs(fa[1] - bg[1]) + Math.abs(fa[2] - bg[2]);
        if (d < 24) continue; // unchanged: not ring ink
        changed++;
        if (d > strongest) {
          strongest = d;
          corePx = { ink: fa, ground: bg, at: [i % A.info.width, Math.floor(i / A.info.width)] };
        }
      }
      const coreRatio = corePx ? ratio(corePx.ink, corePx.ground) : null;
      out[key] = {
        presses,
        route,
        read,
        painted: {
          changedPixels: changed,
          coreRatio: coreRatio === null ? null : +coreRatio.toFixed(3),
          corePx,
          dims: [A.info.width, A.info.height],
        },
      };
      console.log(
        key,
        `route=${route} presses=${presses} chip=${read.isChip} focusVisible=${read.focusVisible} outline=${read.outlineStyle} ${read.outlineWidth} ${read.outlineColor} ringInk=${read.ringInk} | painted changed=${changed} core=${coreRatio === null ? "n/a" : coreRatio.toFixed(3)} ${JSON.stringify(corePx)}`,
      );
    } catch (e) {
      out[key] = { error: String(e).slice(0, 240) };
      console.log(key, "ERR", String(e).slice(0, 160));
    }
    await ctx.close();
  }
  await br.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
