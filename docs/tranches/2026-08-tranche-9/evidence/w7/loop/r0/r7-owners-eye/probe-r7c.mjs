// T9-W7 r0 · lane R7 — probe 3. Tightened: M12 one verb per FRESH page (persistence
// confounded probe 2), M09's dark-toggle trace on the real `.sun-moon-toggle`, and the
// DESKTOP rail's sticky state at 1440×900 (where the tag census has room to move).
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "frames");
mkdirSync(OUT, { recursive: true });
const BASE = "http://127.0.0.1:4247/";
const out = {};

async function fresh(engine, { w = 390, h = 844, mobile = true, dark = true } = {}) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile || undefined,
    hasTouch: mobile,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear(); // a FRESH board every time — persistence confounded probe 2
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {
      /* private */
    }
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 20000,
    })
    .catch(() => {});
  await page.waitForTimeout(1500);
  return { browser, page };
}

const snapshot = (page) =>
  page.evaluate(() => ({
    glyphs: document.querySelectorAll(".sudoku-cell .glyph-svg").length,
    values: [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join(""),
    undoEnabled: !document.querySelector('.play-controls button[aria-label*="Undo" i]')?.disabled,
  }));

// ── M12 · ONE destructive verb per fresh page, board dirtied first ──────────
async function oneVerb(engine, verb) {
  const { browser, page } = await fresh(engine);
  const r = { verb };
  // dirty the board with one user digit
  await page.evaluate(() => {
    const i = [...document.querySelectorAll(".sudoku-cell input")].filter(
      (x) => !x.readOnly && !x.disabled && !x.value,
    )[0];
    i?.focus();
  });
  await page.keyboard.type("5");
  await page.waitForTimeout(500);
  r.dirty = await snapshot(page);

  await page.locator(".drawer-tab").click();
  await page.waitForTimeout(900); // the sheet SLIDES

  const sel =
    verb === "Deal"
      ? ".deal-row button"
      : `.action-bar button:has(.icon-sublabel:text-is("${verb}"))`;
  const loc = page.locator(sel).first();
  r.found = (await loc.count()) > 0;
  if (r.found) {
    await loc.click({ timeout: 5000 }).catch((e) => (r.clickErr = String(e).slice(0, 70)));
    await page.waitForTimeout(650);
    r.afterFirstTap = await snapshot(page);
    r.sublabel = await loc.locator(".icon-sublabel").innerText().catch(() => null);
    r.armed = await loc
      .locator(".icon-sublabel.is-armed")
      .count()
      .then((n) => n > 0);
    r.anyDialog = await page.evaluate(
      () => !!document.querySelector("[role=alertdialog], [role=dialog], .gallery-guard"),
    );
    r.boardChanged = r.afterFirstTap.values !== r.dirty.values;
    r.guarded = !r.boardChanged && (r.armed || r.anyDialog);
  }
  await browser.close();
  return r;
}

// ── M09 · the dark toggle, traced ──────────────────────────────────────────
async function themeTrace(engine) {
  const { browser, page } = await fresh(engine);
  const r = await page.evaluate(async () => {
    const t = document.querySelector(".sun-moon-toggle");
    if (!t) return { found: false };
    const probe = () => ({
      body: getComputedStyle(document.body).backgroundColor,
      fg: getComputedStyle(document.documentElement).getPropertyValue("--color-foreground").trim(),
    });
    const before = probe();
    const seen = [];
    const t0 = performance.now();
    let raf;
    const tick = () => {
      seen.push([+(performance.now() - t0).toFixed(1), probe().body]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    t.click();
    await new Promise((res) => setTimeout(res, 900));
    cancelAnimationFrame(raf);
    const gaps = [];
    for (let i = 1; i < seen.length; i++) gaps.push(seen[i][0] - seen[i - 1][0]);
    gaps.sort((a, b) => a - b);
    const distinct = [...new Set(seen.map((s) => s[1]))];
    return {
      found: true,
      beforeBody: before.body,
      afterBody: seen[seen.length - 1][1],
      distinctBodyColours: distinct.length,
      distinct: distinct.slice(0, 5),
      note: "2 distinct == a hard snap (no tween); >2 == a tween",
      frames: seen.length,
      medianFrameMs: +gaps[Math.floor(gaps.length / 2)].toFixed(1),
      maxFrameMs: +gaps[gaps.length - 1].toFixed(1),
      framesOver32ms: gaps.filter((g) => g > 32).length,
      transitionDurationOnBody: getComputedStyle(document.body).transitionDuration,
      transitionPropertyOnBody: getComputedStyle(document.body).transitionProperty.slice(0, 60),
    };
  });
  await browser.close();
  return r;
}

// ── M03 · the DESKTOP rail's sticky state at 1440×900 ──────────────────────
async function rail(engine) {
  const { browser, page } = await fresh(engine, {
    w: 1440,
    h: 900,
    mobile: false,
    dark: false,
  });
  const r = await page.evaluate(async () => {
    const sc = [...document.querySelectorAll(".controls-card, .control-panel-wrap, .control-panel-filtered")].find(
      (e) => e.scrollHeight - e.clientHeight > 40,
    );
    if (!sc) return { scroller: null };
    const read = () => {
      const scb = sc.getBoundingClientRect();
      return [...document.querySelectorAll(".tray-well .washi-tag")].map((e) => {
        const b = e.getBoundingClientRect();
        const wb = e.closest(".tray-well").getBoundingClientRect();
        return {
          t: (e.textContent || "").trim(),
          tagY: +b.y.toFixed(1),
          pinned: b.top <= scb.top + 30,
          groupVisible: wb.bottom > scb.top + 4 && wb.top < scb.bottom - 4,
          fracOfGroupOnScreen: +(
            Math.max(0, Math.min(wb.bottom, scb.bottom) - Math.max(wb.top, scb.top)) /
            Math.max(1, wb.height)
          ).toFixed(3),
        };
      });
    };
    const states = [];
    for (const st of [0, 160, 327, 500, 9999]) {
      sc.scrollTop = st;
      await new Promise((r2) => setTimeout(r2, 260));
      states.push({ scrollTop: sc.scrollTop, tags: read() });
    }
    const heads = [...document.querySelectorAll(".section-heading")].map((e) => {
      const cs = getComputedStyle(e);
      return { t: e.textContent.trim(), px: cs.fontSize, fam: cs.fontFamily.split(",")[0].replace(/["']/g, ""), w: cs.fontWeight, pos: cs.position, color: cs.color };
    });
    const tags = [...document.querySelectorAll(".tray-well .washi-tag")].map((e) => {
      const cs = getComputedStyle(e);
      return { t: e.textContent.trim(), px: cs.fontSize, fam: cs.fontFamily.split(",")[0].replace(/["']/g, ""), w: cs.fontWeight, pos: cs.position };
    });
    const zones = [...document.querySelectorAll(".zone-row-label")].map((e) => {
      const cs = getComputedStyle(e);
      return { t: e.textContent.trim(), px: cs.fontSize, fam: cs.fontFamily.split(",")[0].replace(/["']/g, ""), w: cs.fontWeight, color: cs.color };
    });
    sc.scrollTop = 0;
    return { scroller: sc.className.slice(0, 44), overflow: sc.scrollHeight - sc.clientHeight, states, heads, tags, zones };
  });
  await browser.close();
  return r;
}

out.m12_webkit = {};
for (const v of ["Clear", "Fill", "Solve", "Deal"]) out.m12_webkit[v] = await oneVerb("webkit", v);
out.theme_webkit = await themeTrace("webkit");
out.theme_chromium = await themeTrace("chromium");
out.rail_webkit = await rail("webkit");
writeFileSync(resolve(HERE, "probe-r7c.json"), JSON.stringify(out, null, 2));
console.log("OK →", resolve(HERE, "probe-r7c.json"));
