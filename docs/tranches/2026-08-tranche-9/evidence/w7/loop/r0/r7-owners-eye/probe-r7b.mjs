// T9-W7 r0 · lane R7 — probe 2: the live acts. M12 (confirm on the destructive set),
// M13 (what the tab carries), M09 (the drawer's measured slide + the dark toggle's snap),
// M03 (the deep sticky state: which tag is pinned when its group has left).
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

async function phonePage(engine, dark = true) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
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
  await page.waitForTimeout(1400);
  return { browser, page };
}

const verbState = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".action-bar button, .deal-row button")].map((b) => ({
      aria: (b.getAttribute("aria-label") || "").slice(0, 46),
      sub: (b.querySelector(".icon-sublabel")?.textContent || "").trim(),
      armed: !!b.querySelector(".icon-sublabel.is-armed"),
    })),
  );

// ── M12 · dirty board → each destructive verb ───────────────────────────────
async function confirmCensus(engine) {
  const { browser, page } = await phonePage(engine);
  const r = { engine };

  // make the board dirty: type into the first writable cell
  r.dirtied = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll(".sudoku-cell input")].filter(
      (i) => !i.readOnly && !i.disabled && !i.value,
    );
    if (!inputs.length) return false;
    inputs[0].focus();
    return true;
  });
  await page.keyboard.type("5");
  await page.waitForTimeout(500);
  r.undoDepth = await page.evaluate(() => {
    const u = document.querySelector('.play-controls button[aria-label*="Undo" i]');
    return u ? !u.disabled : null;
  });

  await page.locator(".drawer-tab").click();
  await page.waitForTimeout(900); // the sheet SLIDES

  r.before = await verbState(page);

  // tap each destructive verb once and read whether anything armed
  const acts = ["Clear", "Fill", "Solve", "Deal"];
  r.perVerb = {};
  for (const name of acts) {
    const sel =
      name === "Deal"
        ? ".deal-row button"
        : `.action-bar button:has(.icon-sublabel:text-is("${name}"))`;
    const loc = page.locator(sel).first();
    if (!(await loc.count())) {
      r.perVerb[name] = { found: false };
      continue;
    }
    const boardBefore = await page.evaluate(
      () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
    );
    await loc.click({ timeout: 4000 }).catch(() => {});
    await page.waitForTimeout(450);
    const st = await page.evaluate((s) => {
      const b = document.querySelector(s);
      const sub = b?.querySelector(".icon-sublabel");
      return {
        sub: (sub?.textContent || "").trim(),
        armed: !!sub?.classList.contains("is-armed"),
        glyphs: document.querySelectorAll(".sudoku-cell .glyph-svg").length,
        guardRibbon: !!document.querySelector(".gallery-guard, .guard-ribbon, [role=alertdialog]"),
      };
    }, name === "Deal" ? ".deal-row button" : `.action-bar button`);
    r.perVerb[name] = {
      found: true,
      boardBefore,
      afterSub: st.sub,
      armedAfterOneTap: st.armed,
      glyphsAfter: st.glyphs,
      boardChangedOnFirstTap: st.glyphs !== boardBefore,
      guardRibbonShown: st.guardRibbon,
    };
    // restore a clean-ish state for the next verb
    await page.reload({ waitUntil: "domcontentloaded" }).catch(() => {});
    await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1400);
    await page.evaluate(() => {
      const inputs = [...document.querySelectorAll(".sudoku-cell input")].filter(
        (i) => !i.readOnly && !i.disabled && !i.value,
      );
      inputs[0]?.focus();
    });
    await page.keyboard.type("5");
    await page.waitForTimeout(400);
    await page.locator(".drawer-tab").click().catch(() => {});
    await page.waitForTimeout(900);
  }
  await browser.close();
  return r;
}

// ── M09 · the drawer's measured slide, and the dark toggle's snap ───────────
async function motion(engine) {
  const { browser, page } = await phonePage(engine);
  const r = { engine };

  r.declared = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const names = [
      "--ease-glassGlide",
      "--ease-standard",
      "--ease-springPop",
      "--ease-fadeOut",
      "--ease-drawOn",
    ];
    const o = {};
    for (const n of names) o[n] = cs.getPropertyValue(n).trim();
    return o;
  });

  // sample the case's translate every frame across the open gesture
  r.drawerTrace = await page.evaluate(async () => {
    const tab = document.querySelector(".drawer-tab");
    const samples = [];
    const t0 = performance.now();
    let raf;
    const tick = () => {
      const c = document.querySelector("#controls-drawer .drawer-case");
      if (c) {
        const b = c.getBoundingClientRect();
        samples.push([+(performance.now() - t0).toFixed(1), +b.top.toFixed(1)]);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    tab.click();
    await new Promise((res) => setTimeout(res, 1100));
    cancelAnimationFrame(raf);
    const ys = samples.map((s) => s[1]);
    const first = ys[0];
    const last = ys[ys.length - 1];
    // settle = first sample within 0.5px of the last
    let settleAt = null;
    for (const [t, y] of samples) if (Math.abs(y - last) < 0.5 && settleAt === null) settleAt = t;
    // frame gaps
    const gaps = [];
    for (let i = 1; i < samples.length; i++) gaps.push(samples[i][0] - samples[i - 1][0]);
    gaps.sort((a, b) => a - b);
    return {
      n: samples.length,
      travelPx: +(first - last).toFixed(1),
      settleMs: settleAt,
      medianFrameMs: +gaps[Math.floor(gaps.length / 2)].toFixed(1),
      p95FrameMs: +gaps[Math.floor(gaps.length * 0.95)].toFixed(1),
      maxFrameMs: +gaps[gaps.length - 1].toFixed(1),
      framesOver32ms: gaps.filter((g) => g > 32).length,
    };
  });

  // the dark toggle: is anything tweened at all?
  r.themeToggle = await page.evaluate(async () => {
    const t =
      document.querySelector('[aria-label*="dark" i], [aria-label*="theme" i], .theme-toggle button, .dark-mode-toggle') ||
      document.querySelector(".dark-mode-toggle");
    if (!t) return { found: false };
    const before = getComputedStyle(document.body).backgroundColor;
    const seen = [];
    const t0 = performance.now();
    let raf;
    const tick = () => {
      seen.push([
        +(performance.now() - t0).toFixed(1),
        getComputedStyle(document.body).backgroundColor,
      ]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    t.click();
    await new Promise((r2) => setTimeout(r2, 800));
    cancelAnimationFrame(raf);
    const distinct = [...new Set(seen.map((s) => s[1]))];
    return {
      found: true,
      before,
      after: seen[seen.length - 1][1],
      distinctBodyColours: distinct.length,
      distinct: distinct.slice(0, 6),
      firstChangeAtMs: (seen.find((s) => s[1] !== before) || [null])[0],
      note: "distinctBodyColours 2 == a snap (no tween); >2 == a tween",
    };
  });

  await browser.close();
  return r;
}

// ── M03 · the deep sticky state ─────────────────────────────────────────────
async function stickyDeep(engine) {
  const { browser, page } = await phonePage(engine);
  await page.locator(".drawer-tab").click();
  await page.waitForTimeout(900);
  const r = await page.evaluate(async () => {
    const cands = [...document.querySelectorAll("#controls-drawer *")].filter(
      (e) => e.scrollHeight - e.clientHeight > 40,
    );
    const sc = cands[0];
    if (!sc) return { scroller: null };
    const read = () =>
      [...document.querySelectorAll(".tray-well .washi-tag")].map((e) => {
        const b = e.getBoundingClientRect();
        const well = e.closest(".tray-well");
        const wb = well.getBoundingClientRect();
        const scb = sc.getBoundingClientRect();
        return {
          t: (e.textContent || "").trim(),
          tagY: +b.y.toFixed(1),
          wellTop: +wb.top.toFixed(1),
          wellBottom: +wb.bottom.toFixed(1),
          pinned: b.top <= scb.top + 26,
          groupOnScreen: wb.bottom > scb.top && wb.top < scb.bottom,
          visible: getComputedStyle(e).opacity !== "0",
        };
      });
    const states = [];
    for (const st of [0, 180, 360, 540, sc.scrollHeight]) {
      sc.scrollTop = st;
      await new Promise((r2) => setTimeout(r2, 240));
      states.push({ scrollTop: sc.scrollTop, tags: read() });
    }
    sc.scrollTop = 0;
    return {
      scroller: sc.className.slice(0, 50),
      overflow: sc.scrollHeight - sc.clientHeight,
      states,
    };
  });
  await browser.close();
  return r;
}

out.confirm_webkit = await confirmCensus("webkit");
out.motion_webkit = await motion("webkit");
out.motion_chromium = await motion("chromium");
out.sticky_webkit = await stickyDeep("webkit");
writeFileSync(resolve(HERE, "probe-r7b.json"), JSON.stringify(out, null, 2));
console.log("OK →", resolve(HERE, "probe-r7b.json"));
