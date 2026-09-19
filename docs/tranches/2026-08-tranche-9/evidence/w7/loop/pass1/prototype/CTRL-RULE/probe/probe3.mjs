// T9-W7 pass1 PROTOTYPE · CTRL-RULE — probe 3: the ring painted under a REAL keyboard focus,
// the gallery ribbon's per-dimension negative control, access 2.1/2.2/2.3, the rule's
// antialiasing distribution, and the pi rects on the surfaces this wave does not claim.
//   node probe3.mjs <port> <tag>
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
const TAG = process.argv[3] || "proto";
const BASE = `http://127.0.0.1:${PORT}/`;
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
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 30000,
    })
    .catch(() => {});
  await page.waitForTimeout(1400);
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

const out = { tag: TAG, port: PORT };

// ══ 1 · THE RING, painted, under a REAL keyboard focus ═══════════════════════════════════
out.ring = {};
for (const engine of ["chromium", "webkit"]) {
  for (const dark of [false, true]) {
    const { browser, page } = await board(engine, { w: 1280, h: 800, mobile: false, dark });
    // the desk rail: the card is open, the acts are `.icon-btn`
    const r = await page.evaluate(() => {
      const btn = document.querySelector(".controls-card .deal-btn");
      const chip = document.querySelector(".controls-card .ctrl-btn");
      if (!btn) return null;
      btn.focus();
      return {
        deal: {
          box: (() => {
            const b = btn.getBoundingClientRect();
            return [b.x, b.y, b.width, b.height];
          })(),
        },
        chipHasRing: chip ? getComputedStyle(chip, ":focus-visible").outlineStyle : null,
      };
    });
    if (!r) {
      out.ring[`${engine}/${dark ? "dark" : "light"}`] = { error: "no deal" };
      await browser.close();
      continue;
    }
    // a REAL keyboard focus: press Tab from the focused element so :focus-visible matches
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await page.waitForTimeout(200);
    const fx = await page.evaluate(() => {
      const el = document.activeElement;
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      return {
        el: el.className,
        outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor} @${cs.outlineOffset}`,
        box: [b.x, b.y, b.width, b.height],
        matchesFV: el.matches(":focus-visible"),
        inCard: !!el.closest(".controls-card"),
      };
    });
    const [bx, by, bw, bh] = fx.box;
    const pad = 14;
    let painted = null;
    if (fx.matchesFV && bw > 4 && bh > 4) {
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
      // the ring band: offset 4 + width 2 ⇒ rows pad-6 .. pad-4 above the box
      const cols = [];
      for (let x = pad + 4; x < info.width - pad - 4; x++) {
        let best = null,
          bestD = -1;
        for (let y = Math.max(0, pad - 8); y < pad - 2; y++) {
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
      painted = {
        samples: cols.length,
        worst: cols.length ? +cols[0].toFixed(3) : null,
        median: cols.length ? +cols[Math.floor(cols.length / 2)].toFixed(3) : null,
        best: cols.length ? +cols[cols.length - 1].toFixed(3) : null,
      };
    }
    out.ring[`${engine}/${dark ? "dark" : "light"}`] = { ...fx, chipRing: r.chipHasRing, painted };
    await browser.close();
  }
}

// ══ 2 · THE GALLERY RIBBON — the per-dimension negative control ═══════════════════════════
out.negControl = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true, dark: true });
  const r = await page
    .evaluate(async () => {
      // walk back to the gallery and arm its guard: the deck's own confirm
      const back = document.querySelector(".back-to-gallery, .gallery-link, [aria-label*='gallery' i]");
      if (back) back.click();
      await new Promise((r) => setTimeout(r, 1400));
      const rib = document.querySelector(".guard-ribbon, [role=alertdialog]");
      if (!rib) return { present: false };
      const faces = [...rib.querySelectorAll(".guard-face")];
      return {
        present: true,
        verbs: faces.map((f) => {
          const b = f.getBoundingClientRect();
          return { w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
        }),
      };
    })
    .catch((e) => ({ error: String(e).slice(0, 120) }));
  // the STATIC reading of the gallery's ribbon CSS — the control's shape without the gesture
  const css = await page.evaluate(async () => {
    const sheets = [...document.styleSheets];
    const hits = [];
    for (const s of sheets) {
      let rules;
      try {
        rules = [...s.cssRules];
      } catch {
        continue;
      }
      const walk = (rs) => {
        for (const r of rs) {
          if (r.cssRules) walk([...r.cssRules]);
          else if (r.selectorText && /guard-face|confirm-face/.test(r.selectorText))
            hits.push(`${r.selectorText} { ${r.style.cssText} }`);
        }
      };
      walk(rules);
    }
    return hits;
  });
  out.negControl[engine] = { gesture: r, css };
  await browser.close();
}

// ══ 3 · ACCESS 2.1 / 2.2 / 2.3, at the dock ══════════════════════════════════════════════
out.access = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await board(engine, { w: 390, h: 844, mobile: true, dark: true });
  await openSheet(page);
  out.access[engine] = await page.evaluate(async () => {
    const card =
      [...document.querySelectorAll(".controls-card")].find((e) => e.offsetParent !== null) ||
      document.querySelector(".controls-card");
    const drawer = document.getElementById("controls-drawer") || card;
    const focusables = [...drawer.querySelectorAll(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
    )].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.display !== "none" && cs.visibility !== "hidden" && !e.closest("[inert]");
    });
    // 2.1 — no control focuses into a ≥96% burial
    const buried = [];
    for (const el of focusables) {
      el.focus({ preventScroll: false });
      await new Promise((r) => setTimeout(r, 30));
      const b = el.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) continue;
      let hidden = 0,
        n = 0;
      for (let i = 1; i <= 5; i++)
        for (let j = 1; j <= 5; j++) {
          const x = b.left + (b.width * i) / 6,
            y = b.top + (b.height * j) / 6;
          n++;
          const top = document.elementFromPoint(x, y);
          if (!top || (!el.contains(top) && top !== el)) hidden++;
        }
      if (hidden / n >= 0.96)
        buried.push({ el: el.className || el.tagName, frac: +(hidden / n).toFixed(2) });
    }
    // 2.3 — every chip carries text and aria-pressed
    const chips = [...card.querySelectorAll(".ctrl-btn")];
    const chipRows = chips.map((c) => ({
      text: c.textContent.trim(),
      pressed: c.getAttribute("aria-pressed"),
    }));
    // the 44 floor inside the card
    const small = [...card.querySelectorAll("button")]
      .map((b) => {
        const r = b.getBoundingClientRect();
        return { cls: b.className, w: +r.width.toFixed(1), h: +r.height.toFixed(1) };
      })
      .filter((r) => r.w > 0 && (r.w < 44 || r.h < 44));
    return {
      tabbables: focusables.length,
      buried,
      chips: chipRows.length,
      chipsOK: chipRows.filter((c) => c.text && c.pressed !== null).length,
      under44: small,
    };
  });
  await browser.close();
}

// ══ 4 · PI — the rects on the surfaces this wave does not claim ══════════════════════════
out.pi = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of [
    { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
    { name: "dock-390x844", w: 390, h: 844, mobile: true },
  ]) {
    const { browser, page } = await board(engine, { ...cell, dark: false });
    out.pi[`${cell.name}/${engine}`] = await page.evaluate(() => {
      const pick = (sel) => {
        const e = document.querySelector(sel);
        if (!e) return null;
        const b = e.getBoundingClientRect();
        return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)];
      };
      return {
        logo: pick("svg.handwritten-logo"),
        board: pick(".sudoku-board, .board-grid, .game-board"),
        boardSvg: pick(".boil-frame-layer"),
        masthead: pick("header, .masthead, .scene-masthead"),
        cellFirst: pick(".sudoku-cell"),
        tongue: pick(".drawer-tab"),
        foldTools: pick("#fold-tools"),
      };
    });
    await browser.close();
  }
}

writeFileSync(`${OUT}/probe3-${TAG}.json`, JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
