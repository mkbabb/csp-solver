// the four poses the brief names, both engines, cropped; plus the webkit ring painted from
// the AUTHORED declaration (webkit's Tab walk never reaches a button, so the ring's INK is
// measured by applying the declaration the cure ships and reading the bytes).
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const sharp = (
  await import(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs"
  )
).default;
import { writeFileSync, mkdirSync } from "node:fs";

const PORT = process.argv[2] || "4230";
const FRAMES =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/CTRL-RULE/frames";
const OUT =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ctrl-rule";
mkdirSync(FRAMES, { recursive: true });

async function board(engine, { w, h, mobile = true, dark = true }) {
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
const shrink = async (buf, path) => {
  let out = buf;
  let q = 100;
  while (out.length > 150 * 1024 && q > 20) {
    q -= 15;
    out = await sharp(buf).png({ quality: q, compressionLevel: 9, palette: true }).toBuffer();
  }
  writeFileSync(path, out);
  return out.length;
};

const sizes = {};
for (const engine of ["chromium", "webkit"]) {
  // 1 · 390×844 dark, sheet up — the seven names on their rules, the boxed deal, the foot bar
  {
    const { browser, page } = await board(engine, { w: 390, h: 844 });
    await openSheet(page);
    await page.waitForTimeout(700);
    const clip = await page.evaluate(() => {
      const c = document.querySelector(".drawer-case").getBoundingClientRect();
      return {
        x: Math.max(0, Math.floor(c.x - 4)),
        y: Math.max(0, Math.floor(c.y - 4)),
        width: Math.min(390, Math.ceil(c.width + 8)),
        height: Math.min(844, Math.ceil(c.height + 8)),
      };
    });
    sizes[`1-${engine}`] = await shrink(
      await page.screenshot({ clip }),
      `${FRAMES}/1-ruled-page-390-dark-${engine}.png`,
    );
    await browser.close();
  }
  // 2 · 1440×900 at scrollTop 500 — the pinned name names the group under the eye
  {
    const { browser, page } = await board(engine, { w: 1440, h: 900, mobile: false, dark: false });
    await page.evaluate(() => {
      const card = [...document.querySelectorAll(".controls-card")].find(
        (e) => e.scrollHeight - e.clientHeight > 40,
      );
      if (card) card.scrollTop = 500;
    });
    await page.waitForTimeout(400);
    const clip = await page.evaluate(() => {
      const c = document.querySelector(".drawer-case").getBoundingClientRect();
      return {
        x: Math.max(0, Math.floor(c.x - 4)),
        y: Math.max(0, Math.floor(c.y - 4)),
        width: Math.ceil(c.width + 8),
        height: Math.ceil(Math.min(c.height + 8, 420)),
      };
    });
    sizes[`2-${engine}`] = await shrink(
      await page.screenshot({ clip }),
      `${FRAMES}/2-pinned-name-1440-${engine}.png`,
    );
    await browser.close();
  }
  // 3 · 900×500 sheet up — the foot bar in the landscape dock
  {
    const { browser, page } = await board(engine, { w: 900, h: 500 });
    await openSheet(page);
    await page.waitForTimeout(700);
    const clip = await page.evaluate(() => {
      const c = document.querySelector(".drawer-case").getBoundingClientRect();
      return {
        x: Math.max(0, Math.floor(c.x - 4)),
        y: Math.max(0, Math.floor(c.y - 4)),
        width: Math.min(900, Math.ceil(c.width + 8)),
        height: Math.min(500, Math.ceil(c.height + 8)),
      };
    });
    sizes[`3-${engine}`] = await shrink(
      await page.screenshot({ clip }),
      `${FRAMES}/3-landscape-900x500-${engine}.png`,
    );
    await browser.close();
  }
  // 4 · the ribbon berthed under `clear` at 390
  {
    const { browser, page } = await board(engine, { w: 390, h: 844 });
    await page.evaluate(() => {
      const i = [...document.querySelectorAll(".sudoku-cell input")].filter(
        (x) => !x.readOnly && !x.disabled && !x.value,
      )[0];
      i?.focus();
    });
    await page.keyboard.type("5");
    await page.waitForTimeout(500);
    await openSheet(page);
    await page.evaluate(() =>
      document.querySelectorAll(".action-bar .action-verbs > button")[0].click(),
    );
    await page.waitForTimeout(500);
    const clip = await page.evaluate(() => {
      const rib = document.querySelector(".confirm-ribbon");
      const bar = document.querySelector(".action-bar").getBoundingClientRect();
      const r = rib ? rib.getBoundingClientRect() : bar;
      const top = Math.min(r.top, bar.top) - 8;
      return {
        x: 0,
        y: Math.max(0, Math.floor(top)),
        width: 390,
        height: Math.min(844 - Math.max(0, Math.floor(top)), Math.ceil(bar.bottom - top + 12)),
      };
    });
    sizes[`4-${engine}`] = await shrink(
      await page.screenshot({ clip }),
      `${FRAMES}/4-confirm-berth-390-${engine}.png`,
    );
    await browser.close();
  }
}

// ── the webkit ring's INK, painted from the authored declaration ─────────────────────────
const ringInk = {};
for (const engine of ["chromium", "webkit"]) {
  for (const dark of [false, true]) {
    const { browser, page } = await board(engine, { w: 1280, h: 800, mobile: false, dark });
    const box = await page.evaluate(() => {
      const el = document.querySelector(".controls-card .deal-btn");
      el.style.outline = "2px solid var(--ring-ink)";
      el.style.outlineOffset = "4px";
      const b = el.getBoundingClientRect();
      return [b.x, b.y, b.width, b.height];
    });
    await page.waitForTimeout(200);
    const pad = 14;
    const buf = await page.screenshot({
      clip: {
        x: Math.round(box[0] - pad),
        y: Math.round(box[1] - pad),
        width: Math.round(box[2] + pad * 2),
        height: Math.round(box[3] + pad * 2),
      },
    });
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    const ch = info.channels;
    const px = (x, y) => {
      const i = (y * info.width + x) * ch;
      return [data[i], data[i + 1], data[i + 2]];
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
    const bgL = lum(...px(1, 1));
    const cols = [];
    for (let x = pad + 8; x < info.width - pad - 8; x++) {
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
    const q = (p) => (cols.length ? +cols[Math.floor(cols.length * p)].toFixed(3) : null);
    ringInk[`${engine}/${dark ? "dark" : "light"}`] = {
      samples: cols.length,
      worst: q(0),
      p25: q(0.25),
      median: q(0.5),
    };
    await browser.close();
  }
}

writeFileSync(`${OUT}/frames.json`, JSON.stringify({ sizes, ringInk }, null, 1));
console.log(JSON.stringify({ sizes, ringInk }, null, 1));
