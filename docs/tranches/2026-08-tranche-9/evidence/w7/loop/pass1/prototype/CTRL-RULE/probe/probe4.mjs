// probe 4 — the webkit ring under a real Tab, the confirm's per-dimension ABLATION control,
// and the rule's antialiasing distribution.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const sharp = (
  await import(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs"
  )
).default;
import { writeFileSync } from "node:fs";
const PORT = process.argv[2] || "4230";
const OUT =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ctrl-rule";

async function board(engine, { w = 390, h = 844, mobile = true, dark = true } = {}) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: mobile && engine === "chromium" ? true : undefined,
    hasTouch: mobile,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/?size=3&difficulty=EASY`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1600);
  return { browser, page };
}
const openSheet = async (page) => {
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
};
const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
};

const out = {};

// ── 1 · THE RING, both engines, a REAL Tab walk to the deal button ───────────────────────
out.ring = {};
for (const engine of ["chromium", "webkit"]) {
  for (const dark of [false, true]) {
    const { browser, page } = await board(engine, { w: 1280, h: 800, mobile: false, dark });
    await page.evaluate(() => document.body.focus());
    let found = null;
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press("Tab");
      const a = await page.evaluate(() => {
        const el = document.activeElement;
        return {
          cls: el?.className?.toString() || "",
          fv: el?.matches(":focus-visible") ?? false,
          inCard: !!el?.closest(".controls-card"),
        };
      });
      if (a.inCard && a.fv && /icon-btn|deal-btn|players-leave|info-btn/.test(a.cls)) {
        found = a;
        break;
      }
    }
    if (!found) {
      out.ring[`${engine}/${dark ? "dark" : "light"}`] = { error: "no ringed control reached" };
      await browser.close();
      continue;
    }
    const fx = await page.evaluate(() => {
      const el = document.activeElement;
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      return {
        cls: el.className.toString().slice(0, 40),
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor} @${cs.outlineOffset}`,
        box: [b.x, b.y, b.width, b.height],
      };
    });
    const [bx, by, bw, bh] = fx.box;
    const pad = 14;
    const buf = await page.screenshot({
      clip: {
        x: Math.max(0, Math.round(bx - pad)),
        y: Math.max(0, Math.round(by - pad)),
        width: Math.round(bw + pad * 2),
        height: Math.round(bh + pad * 2),
      },
    });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    const px = (x, y) => {
      const i = (y * info.width + x) * ch;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const bgL = lum(...px(1, 1));
    const cols = [];
    for (let x = pad + 6; x < info.width - pad - 6; x++) {
      let best = null,
        bestD = -1;
      for (let y = Math.max(0, pad - 9); y < pad - 2; y++) {
        const L = lum(...px(x, y));
        const d = Math.abs(L - bgL);
        if (d > bestD) {
          bestD = d;
          best = L;
        }
      }
      if (bestD > 0.002) cols.push(ratio(best, bgL));
    }
    cols.sort((a, b) => a - b);
    out.ring[`${engine}/${dark ? "dark" : "light"}`] = {
      ...fx,
      samples: cols.length,
      worst: cols.length ? +cols[0].toFixed(3) : null,
      p10: cols.length ? +cols[Math.floor(cols.length * 0.1)].toFixed(3) : null,
      median: cols.length ? +cols[Math.floor(cols.length / 2)].toFixed(3) : null,
      best: cols.length ? +cols[cols.length - 1].toFixed(3) : null,
    };
    await browser.close();
  }
}

// ── 2 · THE PER-DIMENSION FLOOR, with its ABLATION control ───────────────────────────────
out.floor = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true, dark: true });
  await page.evaluate(() => {
    const i = [...document.querySelectorAll(".sudoku-cell input")].filter(
      (x) => !x.readOnly && !x.disabled && !x.value,
    )[0];
    i?.focus();
  });
  await page.keyboard.type("5");
  await page.waitForTimeout(500);
  await openSheet(page);
  out.floor[engine] = await page.evaluate(async () => {
    const clear = document.querySelectorAll(".action-bar .action-verbs > button")[0];
    clear.click();
    await new Promise((r) => setTimeout(r, 420));
    const read = () =>
      [...document.querySelectorAll(".confirm-ribbon .confirm-face")].map((f) => {
        const r = f.getBoundingClientRect();
        const cs = getComputedStyle(f);
        return {
          word: f.textContent.trim(),
          w: +r.width.toFixed(2),
          h: +r.height.toFixed(2),
          minH: cs.minHeight,
          minI: cs.minInlineSize,
          bothOK: r.width >= 44 && r.height >= 44,
        };
      });
    const cured = read();
    // THE NEGATIVE CONTROL: take the second dimension back off and re-measure. A predicate
    // that only reads height would call both shapes green; this one must call the ablated one
    // red in WIDTH alone.
    const st = document.createElement("style");
    st.textContent = `@media (pointer: coarse){ .confirm-face { min-inline-size: auto !important; } }`;
    document.head.appendChild(st);
    await new Promise((r) => setTimeout(r, 120));
    const ablated = read();
    st.remove();
    return { cured, ablated };
  });
  await browser.close();
}

// ── 3 · THE RULE'S ANTIALIASING, distributed ─────────────────────────────────────────────
out.aa = {};
for (const engine of ["chromium", "webkit"]) {
  for (const dark of [false, true]) {
    const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true, dark });
    await openSheet(page);
    await page.waitForTimeout(700);
    const box = await page.evaluate(() => {
      const svg = document.querySelector(".ruled-group .ruled-line");
      const b = svg.getBoundingClientRect();
      return {
        x: Math.round(b.x + 12),
        y: Math.round(b.y - 4),
        w: Math.max(40, Math.round(b.width - 24)),
        h: Math.round(b.height + 8),
      };
    });
    const buf = await page.screenshot({
      clip: { x: box.x, y: box.y, width: box.w, height: box.h },
    });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    const px = (x, y) => {
      const i = (y * info.width + x) * ch;
      return [data[i], data[i + 1], data[i + 2]];
    };
    const bgL = lum(...px(0, 0));
    const cols = [];
    // the COLUMN's total ink, not one pixel: a 1.6px stroke crossing a pixel boundary splits
    // its coverage over two rows and neither is the mark — the mark is the pair.
    const colsPaired = [];
    for (let x = 0; x < info.width; x++) {
      let best = null,
        bestD = -1,
        bestY = 0;
      for (let y = 0; y < info.height; y++) {
        const L = lum(...px(x, y));
        const d = Math.abs(L - bgL);
        if (d > bestD) {
          bestD = d;
          best = L;
          bestY = y;
        }
      }
      if (bestD <= 0.0005) continue;
      cols.push(ratio(best, bgL));
      // the pair: the extreme row and its darker neighbour, area-averaged
      const nb = [bestY - 1, bestY + 1]
        .filter((y) => y >= 0 && y < info.height)
        .map((y) => lum(...px(x, y)));
      const other = nb.length
        ? nb.reduce((a, b) => (Math.abs(a - bgL) > Math.abs(b - bgL) ? a : b))
        : bgL;
      colsPaired.push(ratio((best + other) / 2, bgL));
    }
    cols.sort((a, b) => a - b);
    colsPaired.sort((a, b) => a - b);
    const q = (arr, p) => +arr[Math.min(arr.length - 1, Math.floor(arr.length * p))].toFixed(3);
    out.aa[`${engine}/${dark ? "dark" : "light"}`] = {
      samples: cols.length,
      worst: q(cols, 0),
      p05: q(cols, 0.05),
      p25: q(cols, 0.25),
      median: q(cols, 0.5),
      best: q(cols, 0.999),
      below3: cols.filter((c) => c < 3).length,
      below3pct: +((cols.filter((c) => c < 3).length / cols.length) * 100).toFixed(1),
      pairedWorst: q(colsPaired, 0),
      pairedMedian: q(colsPaired, 0.5),
    };
    await browser.close();
  }
}

writeFileSync(`${OUT}/probe4.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
