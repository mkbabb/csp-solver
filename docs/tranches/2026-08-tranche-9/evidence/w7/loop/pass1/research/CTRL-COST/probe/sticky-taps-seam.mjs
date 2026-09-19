// CTRL-COST pass-1 · THE STICKY NAME, THE TAP COUNTS, AND THE 390 SEAM.
//
//   A · I3′ NON-VACUOUSLY. The prototype's band names are not sticky, so I3/I3′ green by
//       having nothing pinned — which is a pass nobody should accept. This arm makes the
//       three names sticky (W2 §2.6's landed mechanism, applied to three names instead of
//       four tapes) and asks the harder question: at every scroll state IS a name pinned,
//       and is it the name of the band under the reader's eye.
//   B · TAP COUNTS from the playing pose, control against the ladder.
//   C · THE 390 SEAM — the case's drawn top stroke against the wordmark's box at 390/375/430,
//       control against the ladder, because a family that changes the card's HEIGHT must say
//       whether it moved a seam somebody else owns.
//
//   node sticky-taps-seam.mjs
//
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROTO = resolve(HERE, "../proto");
const OUT = resolve(HERE, "../readings");
const BASE = "http://127.0.0.1:4233/";
const CSS = readFileSync(resolve(PROTO, "cost-card.css"), "utf8");
const JS_SRC = readFileSync(resolve(PROTO, "cost-card.js"), "utf8").replace(
  /^export const costCard = /m,
  "window.__costCard = ",
);
// The sticky arm. One declaration block, on the three names the card now has.
const STICKY = `
.cost-band-head{position:sticky;top:0;z-index:3;background:var(--color-card);
  padding-block:0.1rem;margin-bottom:0.25rem}
`;

const PINNED = () =>
  new Promise(async (done) => {
    const sc = [...document.querySelectorAll(".controls-card")].find(
      (e) => e.scrollHeight - e.clientHeight > 40,
    );
    if (!sc) return done({ skipped: "no overflowing scrollport" });
    const out = [];
    const span = sc.scrollHeight - sc.clientHeight;
    for (const f of [0, 0.25, 0.5, 0.75, 1]) {
      sc.scrollTop = Math.round(f * span);
      await new Promise((r) => setTimeout(r, 260));
      const scb = sc.getBoundingClientRect();
      let pinned = null;
      for (const n of document.querySelectorAll(".cost-band-name, .tray-well > .washi-tag")) {
        const b = n.getBoundingClientRect();
        if (b.top < scb.top - 2 || b.top > scb.top + 34) continue;
        pinned = n;
        break;
      }
      // which band actually owns the most of the reader's scrollport right now
      let best = null;
      let bestFrac = 0;
      for (const g of document.querySelectorAll(".cost-band, .tray-well")) {
        if (getComputedStyle(g).display === "none") continue;
        const gb = g.getBoundingClientRect();
        const seen = Math.max(0, Math.min(gb.bottom, scb.bottom) - Math.max(gb.top, scb.top));
        if (seen > bestFrac) {
          bestFrac = seen;
          best = g;
        }
      }
      const pinnedGroup = pinned?.closest(".cost-band, .tray-well") ?? null;
      const gb = pinnedGroup?.getBoundingClientRect();
      const ownFrac = gb
        ? Math.max(0, Math.min(gb.bottom, scb.bottom) - Math.max(gb.top, scb.top)) /
          Math.max(1, gb.height)
        : null;
      out.push({
        at: sc.scrollTop,
        pinned: pinned ? pinned.textContent.trim() : null,
        pinnedGroupOnScreenFrac: ownFrac == null ? null : +ownFrac.toFixed(3),
        bandUnderTheEye:
          best?.querySelector(".cost-band-name, .washi-tag")?.textContent.trim() ?? null,
      });
    }
    sc.scrollTop = 0;
    done({
      states: out,
      statesWithNoPin: out.filter((s) => !s.pinned).length,
      statesNamingSomethingElse: out.filter(
        (s) => s.pinned && s.bandUnderTheEye && s.pinned !== s.bandUnderTheEye,
      ).length,
      violations: out.filter((s) => s.pinned && s.pinnedGroupOnScreenFrac < 0.5).length,
    });
  });

const ACTS = [
  ["undo", /Undo last move/i],
  ["redo", /Redo move/i],
  ["hint", /Reveal a hint/i],
  ["peek", /^peek$/i],
  ["deal", /deal a new board/i],
  ["clear", /clear the board/i],
  ["fill", /Fill in every cell/i],
  ["solve", /Solve puzzle/i],
  ["share", /copy a link|share/i],
  ["play together", /invite|play together/i],
];

const REACH = (acts) => {
  const hit = (e) => {
    const b = e.getBoundingClientRect();
    if (!b.width || !b.height) return false;
    if (b.bottom < 0 || b.top > innerHeight || b.right < 0 || b.left > innerWidth) return false;
    if (e.closest("[inert]")) return false;
    const t = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
    return !!t && (t === e || e.contains(t) || t.contains(e));
  };
  const out = {};
  for (const [name, re] of acts) {
    const src = new RegExp(re.source, re.flags);
    const el = [...document.querySelectorAll("button, [role=button]")].find((b) =>
      src.test((b.getAttribute("aria-label") || b.textContent || "").trim()),
    );
    if (!el) {
      out[name] = { present: false };
      continue;
    }
    const chipRow = el.closest(".ctrl-options");
    out[name] = {
      present: true,
      reachableNow: hit(el),
      displayNone: getComputedStyle(el).display === "none" || !el.offsetParent,
      behindTab: !!chipRow && getComputedStyle(chipRow).display === "none",
    };
  }
  // the two SETTINGS, measured as their own chip rows
  const rows = [...document.querySelectorAll(".ctrl-options")];
  out["__optionRowsHidden"] = rows.filter((r) => getComputedStyle(r).display === "none").length;
  out["__optionRows"] = rows.length;
  return out;
};

const SEAM = () => {
  const caseSvg = document.querySelector(".drawer-case > svg.outline-svg, .drawer-case svg.outline-svg");
  const logo = document.querySelector("svg.handwritten-logo");
  if (!caseSvg || !logo) return null;
  const c = caseSvg.getBoundingClientRect();
  const l = logo.getBoundingClientRect();
  return {
    caseTop: +c.top.toFixed(2),
    wordmarkBottom: +l.bottom.toFixed(2),
    gap: +(c.top - l.bottom).toFixed(2),
  };
};

async function open(engine, w, h, coarse) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    hasTouch: coarse,
    isMobile: coarse && engine === "chromium",
    colorScheme: "light",
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", "light");
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1500);
  return { browser, page };
}
const openSheet = async (page) => {
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
};

const results = { pinned: {}, taps: {}, seam: {} };

// ── A · the sticky name ─────────────────────────────────────────────────────────────────
for (const [name, w, h, coarse] of [
  ["desk-1280x800", 1280, 800, false],
  ["dock-390x844", 390, 844, true],
]) {
  for (const engine of ["chromium", "webkit"]) {
    const key = `${name}-${engine}`;
    const { browser, page } = await open(engine, w, h, coarse);
    await openSheet(page);
    const control = await page.evaluate(PINNED);
    await page.addStyleTag({ content: CSS });
    await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
    await page.waitForTimeout(300);
    const loose = await page.evaluate(PINNED);
    const hLoose = await page.evaluate(() => document.querySelector(".controls-card").scrollHeight);
    await page.addStyleTag({ content: STICKY });
    await page.waitForTimeout(250);
    const sticky = await page.evaluate(PINNED);
    const hSticky = await page.evaluate(() => document.querySelector(".controls-card").scrollHeight);
    results.pinned[key] = { control, loose, sticky, scrollHeight: { loose: hLoose, sticky: hSticky } };
    console.log(
      `${key.padEnd(24)} pinned-name states: control ${5 - control.statesWithNoPin}/5 (viol ${control.violations}) · ` +
        `ladder-loose ${5 - loose.statesWithNoPin}/5 (viol ${loose.violations}) · ` +
        `ladder-sticky ${5 - sticky.statesWithNoPin}/5 (viol ${sticky.violations}, names-something-else ${sticky.statesNamingSomethingElse}) · ` +
        `height ${hLoose}→${hSticky}`,
    );
    await browser.close();
  }
}

// ── B · tap counts from the playing pose ────────────────────────────────────────────────
for (const [name, w, h] of [
  ["dock-390x844", 390, 844],
  ["land-844x390", 844, 390],
]) {
  for (const engine of ["chromium", "webkit"]) {
    const key = `${name}-${engine}`;
    const { browser, page } = await open(engine, w, h, true);
    const shut = await page.evaluate(REACH, ACTS);
    await openSheet(page);
    const openedControl = await page.evaluate(REACH, ACTS);
    await page.addStyleTag({ content: CSS });
    await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
    await page.waitForTimeout(300);
    const openedLadder = await page.evaluate(REACH, ACTS);
    results.taps[key] = { shut, openedControl, openedLadder };
    const taps = (shutR, openR) =>
      Object.fromEntries(
        ACTS.map(([a]) => [
          a,
          !openR[a]?.present ? "—" : shutR[a]?.reachableNow ? 0 : openR[a]?.behindTab ? 3 : 2,
        ]),
      );
    console.log(
      `${key.padEnd(24)} taps control ${JSON.stringify(taps(shut, openedControl))}\n` +
        `${"".padEnd(24)} taps ladder  ${JSON.stringify(taps(shut, openedLadder))} · hidden option rows ${openedControl.__optionRowsHidden}→${openedLadder.__optionRowsHidden}`,
    );
    await browser.close();
  }
}

// ── C · the 390 seam ────────────────────────────────────────────────────────────────────
for (const [w, h] of [
  [390, 844],
  [375, 812],
  [430, 932],
]) {
  for (const engine of ["chromium", "webkit"]) {
    const key = `${w}x${h}-${engine}`;
    const { browser, page } = await open(engine, w, h, true);
    await openSheet(page);
    const control = await page.evaluate(SEAM);
    await page.addStyleTag({ content: CSS });
    await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
    await page.waitForTimeout(400);
    const ladder = await page.evaluate(SEAM);
    results.seam[key] = { control, ladder };
    console.log(
      `seam ${key.padEnd(18)} control gap ${control?.gap} · ladder gap ${ladder?.gap} · Δ ${(
        (ladder?.gap ?? 0) - (control?.gap ?? 0)
      ).toFixed(2)}`,
    );
    await browser.close();
  }
}

writeFileSync(resolve(OUT, "sticky-taps-seam.json"), JSON.stringify(results, null, 1));
console.log("\nbanked readings/sticky-taps-seam.json");
