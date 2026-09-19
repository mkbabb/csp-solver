/**
 * T9-W7 pass 2 · CTRL-TAPE — two readings in one run.
 *
 *  A · THE RING, FROM PAINTED BYTES. Four grounds, both themes, both engines: the ring is
 *      sampled off a screenshot (never computed from the token), against the ground painted
 *      immediately outside it. The dashes are why the sample is a RUN of pixels reduced by
 *      extremes rather than one point — half the ring's own band is gap.
 *  B · THE DECK'S π. Band box, first card y, the staging tape's box and tagName, and the a11y
 *      tree's heading population — the five readings the gate holds against HEAD.
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = "http://127.0.0.1:4230";

/** WCAG relative luminance + contrast, on 8-bit sRGB. */
const lum = ([r, g, b]) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(2);
};

/** in-page: decode a data URL and hand back the pixel rows we asked for. */
const SAMPLE = async ([dataUrl, rows]) => {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const cv = document.createElement("canvas");
  cv.width = img.width;
  cv.height = img.height;
  const cx = cv.getContext("2d");
  cx.drawImage(img, 0, 0);
  return rows.map(({ x0, y0, x1, y1 }) => {
    const out = [];
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= n; i++) {
      const x = Math.round(x0 + ((x1 - x0) * i) / n);
      const y = Math.round(y0 + ((y1 - y0) * i) / n);
      const d = cx.getImageData(x, y, 1, 1).data;
      out.push([d[0], d[1], d[2]]);
    }
    return out;
  });
};

const TARGETS = [
  ["the chosen level chip", ".ctrl-btn.is-selected, .ctrl-btn[aria-pressed='true']"],
  ["a size chip on the card's paper", ".new-game-zone .ctrl-btn"],
  ["Deal, the one boxed control", ".deal-btn"],
  ["a verb in the case's foot", "#card-foot .action-verbs .icon-btn"],
];

for (const [engName, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await eng.launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await b.newContext({
      baseURL: BASE,
      viewport: { width: 1440, height: 900 },
      colorScheme: theme,
    });
    const p = await ctx.newPage();
    await p.goto("/?size=3&difficulty=EASY");
    await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await p.waitForSelector(".ctrl-btn", { timeout: 30000 });
    await p.keyboard.press("Tab"); // the keyboard modality :focus-visible wants
    for (const [label, sel] of TARGETS) {
      const el = p.locator(sel).first();
      if (!(await el.count())) {
        console.log(`   ${engName}|${theme}  ${label}: NOT PRESENT`);
        continue;
      }
      await el.evaluate((e) => e.focus());
      await p.waitForTimeout(120);
      const info = await el.evaluate((e) => ({
        fv: e.matches(":focus-visible"),
        outline: getComputedStyle(e).outline,
        offset: getComputedStyle(e).outlineOffset,
        box: (() => {
          const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        })(),
      }));
      const pad = 12;
      const clip = {
        x: Math.max(0, Math.floor(info.box.x - pad)),
        y: Math.max(0, Math.floor(info.box.y - pad)),
        width: Math.ceil(info.box.w + pad * 2),
        height: Math.ceil(info.box.h + pad * 2),
      };
      const shot = await p.screenshot({ clip });
      const dataUrl = `data:image/png;base64,${shot.toString("base64")}`;
      // the LEFT edge: the ring's band is at offset 3 + 2px thick, so 3..5px out from the box.
      const lx = info.box.x - clip.x;
      const ly0 = info.box.y - clip.y + 4;
      const ly1 = info.box.y - clip.y + info.box.h - 4;
      const dpr = await p.evaluate(() => devicePixelRatio);
      const S = (v) => Math.round(v * dpr);
      const [ring, ground] = await p.evaluate(SAMPLE, [
        dataUrl,
        [
          { x0: S(lx - 4), y0: S(ly0), x1: S(lx - 4), y1: S(ly1) },
          { x0: S(lx - 9), y0: S(ly0), x1: S(lx - 9), y1: S(ly1) },
        ],
      ]);
      // the ring is the extreme against the ground's mode: dashes mean most samples ARE ground.
      const mode = (px) => {
        const c = new Map();
        for (const q of px) {
          const k = q.join(",");
          c.set(k, (c.get(k) ?? 0) + 1);
        }
        return [...c.entries()].sort((a, z) => z[1] - a[1])[0][0].split(",").map(Number);
      };
      const g = mode(ground);
      const inkiest = px => px.reduce((best, q) => (ratio(q, g) > ratio(best, g) ? q : best), g);
      const r = inkiest(ring);
      console.log(
        `   ${engName}|${theme}  ${label.padEnd(34)} ring rgb(${r}) vs ground rgb(${g}) = ${ratio(r, g)}:1   [focus-visible ${info.fv}, ${info.outline} @ ${info.offset}]`,
      );
    }
    await ctx.close();
  }

  // ── B · the deck ────────────────────────────────────────────────────────────────────────
  for (const [w, h] of [
    [390, 844],
    [1280, 800],
  ]) {
    const ctx = await b.newContext({ baseURL: BASE, viewport: { width: w, height: h } });
    const p = await ctx.newPage();
    await p.goto("/?view=gallery&size=3&difficulty=EASY");
    await p.waitForSelector(".game-gallery", { timeout: 30000 });
    await p.waitForSelector(".staging-band", { timeout: 30000 });
    await p.waitForTimeout(800);
    const deck = await p.evaluate(() => {
      const r = (e) => {
        if (!e) return null;
        const q = e.getBoundingClientRect();
        return {
          x: +q.x.toFixed(2),
          y: +q.y.toFixed(2),
          w: +q.width.toFixed(2),
          h: +q.height.toFixed(2),
        };
      };
      const tag = document.querySelector(".staging-band .washi-tag");
      const cs = tag ? getComputedStyle(tag) : null;
      const card0 =
        document.querySelector("#gallery-card-0") || document.querySelector(".game-card");
      return {
        band: r(document.querySelector(".staging-band")),
        firstCardY: card0 ? +card0.getBoundingClientRect().y.toFixed(2) : null,
        tape: r(tag),
        tapeTag: tag ? tag.tagName : null,
        netFlow: tag
          ? +(
              tag.getBoundingClientRect().height +
              parseFloat(cs.marginTop) +
              parseFloat(cs.marginBottom)
            ).toFixed(2)
          : null,
        headingsInBand: [...document.querySelectorAll(".staging-band h1,.staging-band h2")].length,
      };
    });
    const snap = await p.locator("body").ariaSnapshot();
    const heads = snap.split("\n").filter((l) => /heading/.test(l)).map((l) => l.trim());
    console.log(`\n   ${engName}|deck-${w}x${h}`, JSON.stringify(deck));
    console.log(`      AX headings (${heads.length}): ${heads.join(" | ")}`);
    await ctx.close();
  }
  await b.close();
}
