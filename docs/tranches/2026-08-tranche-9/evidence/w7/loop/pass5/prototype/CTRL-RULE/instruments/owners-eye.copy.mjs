// T9-W7 r0 · lane R7 — THE OWNER'S EYE, as instruments.
//
// Seven assertions, one per mark the census can measure. Six are BORN-RED: they state the
// law the owner's mark asks for and they fail on this tree. One (M20) is a GREEN regression
// guard and says so. They live here, not in `e2e/`, because round zero is read-only on the
// product; a cure wave lifts the bodies into the estate's own suite.
//
//   node owners-eye.instruments.mjs        (dev server at 127.0.0.1:4247)
//
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
// pass-5 CTRL-RULE copy (r0 frozen): SRC, BASE and the output re-pointed by env.
const SRC = process.env.SRC || "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src";
const BASE = process.env.BASE || "http://127.0.0.1:4247/";
const results = [];
const record = (id, mark, law, pass, reading) =>
  results.push({ id, mark, law, verdict: pass ? "GREEN" : "RED", reading });

async function board(engine, { w = 390, h = 844, mobile = true, dark = true } = {}) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: mobile || undefined,
    hasTouch: mobile,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {
      /* private mode */
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
const openSheet = async (page) => {
  await page.locator(".drawer-tab").click();
  await page.waitForTimeout(950); // the sheet SLIDES
};

// ── I1 · M03/M05 — ONE HEADING VOICE ──────────────────────────────────────────
// Five identical option groups are titled in ONE typographic voice.
{
  const { browser, page } = await board("webkit", { w: 1440, h: 900, mobile: false, dark: false });
  const voices = await page.evaluate(() => {
    const sel = [...document.querySelectorAll(".section-heading, .tray-well .washi-tag, .zone-row-label")];
    const v = new Set();
    for (const e of sel) {
      const cs = getComputedStyle(e);
      v.add(`${cs.fontSize}|${cs.fontFamily.split(",")[0].replace(/["']/g, "")}|${cs.fontWeight}`);
    }
    return [...v];
  });
  await browser.close();
  record(
    "I1",
    "T9-M03 / T9-M05",
    "the controls card titles its option groups in ONE typographic voice",
    voices.length === 1,
    `${voices.length} voices at 1440×900: ${voices.join(" · ")}`,
  );
}

// ── I2 · M04 — THE BAR HAS ITS OWN CHROME AND BURIES NOTHING ─────────────────
{
  const { browser, page } = await board("webkit");
  await openSheet(page);
  const r = await page.evaluate(() => {
    const bar = document.querySelector(".action-bar");
    const cs = getComputedStyle(bar);
    const bb = bar.getBoundingClientRect();
    const own =
      parseFloat(cs.borderTopWidth) > 0 ||
      cs.outlineStyle !== "none" ||
      cs.boxShadow !== "none" ||
      !!bar.querySelector(":scope > .outline-container, :scope > svg.outline-svg");
    let worst = 0;
    let who = null;
    for (const w of document.querySelectorAll(".tray-well")) {
      const wb = w.getBoundingClientRect();
      const ov =
        Math.max(0, Math.min(wb.bottom, bb.bottom) - Math.max(wb.top, bb.top)) *
        Math.max(0, Math.min(wb.right, bb.right) - Math.max(wb.left, bb.left));
      const frac = ov / Math.max(1, wb.width * wb.height);
      if (frac > worst) {
        worst = frac;
        who = (w.querySelector(".washi-tag")?.textContent || "?").trim();
      }
    }
    return { own, worst: +worst.toFixed(3), who, border: cs.borderTopWidth, shadow: cs.boxShadow };
  });
  await browser.close();
  record(
    "I2",
    "T9-M04",
    "the mobile floating bar carries chrome of its own and covers no option group",
    r.own && r.worst < 0.05,
    `ownChrome=${r.own} (border ${r.border}, shadow ${r.shadow}) · worst group coverage ${(r.worst * 100).toFixed(1)}% (${r.who})`,
  );
}

// ── I3 · M03 — THE PINNED TAPE NAMES THE GROUP ON SCREEN ────────────────────
{
  const { browser, page } = await board("webkit", { w: 1440, h: 900, mobile: false, dark: false });
  const r = await page.evaluate(async () => {
    const sc = [...document.querySelectorAll(".controls-card")].find(
      (e) => e.scrollHeight - e.clientHeight > 40,
    );
    const bad = [];
    for (const st of [0, 160, 327, 500, 9999]) {
      sc.scrollTop = st;
      await new Promise((r2) => setTimeout(r2, 260));
      const scb = sc.getBoundingClientRect();
      for (const tag of document.querySelectorAll(".tray-well .washi-tag")) {
        const b = tag.getBoundingClientRect();
        if (b.top > scb.top + 30) continue; // not pinned
        const wb = tag.closest(".tray-well").getBoundingClientRect();
        const frac =
          Math.max(0, Math.min(wb.bottom, scb.bottom) - Math.max(wb.top, scb.top)) /
          Math.max(1, wb.height);
        if (frac < 0.5)
          bad.push({ at: sc.scrollTop, tag: tag.textContent.trim(), frac: +frac.toFixed(3) });
      }
    }
    return bad;
  });
  await browser.close();
  record(
    "I3",
    "T9-M03",
    "a pinned compartment tape names a group at least half on screen, at every scroll state",
    r.length === 0,
    r.length
      ? `${r.length} violating states: ` + r.map((x) => `scrollTop ${x.at} "${x.tag}" ${x.frac}`).join(" · ")
      : "no violating state",
  );
}

// ── I4 · M12 — THE DESTRUCTIVE SET ASKS FIRST ───────────────────────────────
{
  const rows = [];
  for (const v of ["Deal", "Clear", "Fill", "Solve"]) {
    const { browser, page } = await board("webkit");
    await page.evaluate(() => {
      const i = [...document.querySelectorAll(".sudoku-cell input")].filter(
        (x) => !x.readOnly && !x.disabled && !x.value,
      )[0];
      i?.focus();
    });
    await page.keyboard.type("5");
    await page.waitForTimeout(500);
    await openSheet(page);
    rows.push(
      await page.evaluate(
        async ([name]) => {
          const idx = { Clear: 0, Fill: 1, Solve: 2 };
          const b =
            name === "Deal"
              ? document.querySelector(".deal-row button")
              : document.querySelectorAll(".action-bar .action-verbs button")[idx[name]];
          const before = [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join("");
          b.click();
          await new Promise((r) => setTimeout(r, 1200));
          const after = [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join("");
          return {
            verb: name,
            armed: !!b.querySelector(".icon-sublabel.is-armed"),
            dialog: !!document.querySelector("[role=alertdialog],[role=dialog]"),
            cellsWritten: [...before].filter((c, i) => c !== after[i]).length,
          };
        },
        [v],
      ),
    );
    await browser.close();
  }
  const bad = rows.filter((x) => x.cellsWritten > 0 || (!x.armed && !x.dialog));
  record(
    "I4",
    "T9-M12",
    "on a dirty board every destructive verb asks before it acts — one tap changes nothing",
    bad.length === 0,
    rows
      .map((x) => `${x.verb}: armed=${x.armed} wrote=${x.cellsWritten}`)
      .join(" · "),
  );
}

// ── I5 · M14 — THE PLAYER MARK EXISTS, TOP LEFT ─────────────────────────────
{
  const { browser, page } = await board("webkit");
  const r = await page.evaluate(() => {
    const el = document.querySelector("[data-player-mark], .player-mark, .presence-mark, .player-icon");
    if (!el) return { present: false };
    const b = el.getBoundingClientRect();
    return { present: true, box: [b.x, b.y, b.width, b.height], topLeft: b.top < 120 && b.left < 160 };
  });
  await browser.close();
  record(
    "I5",
    "T9-M14",
    "a player mark sits in the top left of every viewport and opens the lobby",
    r.present && r.topLeft,
    r.present ? `present at ${JSON.stringify(r.box)}` : "no player mark in the DOM",
  );
}

// ── I6 · M09 — EVERY MOTION DURATION IS NAMED ───────────────────────────────
// Static: the transition/animation durations spelled as literals inside `src/` rather than
// as a named token in pencilConfig's MOTION bands or a `--*-dur` custom property.
{
  const files = [];
  (function walk(d) {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(vue|css|ts)$/.test(f)) files.push(p);
    }
  })(SRC);
  const literals = new Map();
  let decls = 0;
  for (const f of files) {
    const t = readFileSync(f, "utf8");
    for (const m of t.matchAll(/(?:transition|animation)[a-z-]*:\s*([^;]+);/g)) {
      const body = m[1];
      const found = body.match(/\b\d+(?:\.\d+)?m?s\b/g);
      if (!found) continue;
      decls++;
      for (const d of found) literals.set(d, (literals.get(d) || 0) + 1);
    }
  }
  const named = ["beatMs 125", "cardStepMs 440", "boardFoldMs 520", "chromeLeaveMs 200"];
  record(
    "I6",
    "T9-M09 (§13)",
    "every transition duration in the product is a named decision, not a literal in a rule",
    literals.size === 0,
    `${decls} declarations spell ${literals.size} distinct literal durations (top: ${[...literals.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([k, v]) => `${k}×${v}`)
      .join(", ")}) against ${named.length} named in MOTION`,
  );
}

// ── I7 · T8-M20 — THE WORDMARK DOES NOT LIE ON THE GRID (GREEN guard) ───────
{
  const { browser, page } = await board("webkit", { w: 900, h: 900, mobile: false, dark: true });
  const worst = { overlap: 0, gap: 1e9, h: null };
  for (const h of [1000, 900, 820, 760, 700, 640, 600, 560, 520, 480]) {
    await page.setViewportSize({ width: 900, height: h });
    await page.waitForTimeout(500);
    const one = await page.evaluate(() => {
      const a = document.querySelector("svg.handwritten-logo").getBoundingClientRect();
      const g = document.querySelector(".board-wrapper, .sudoku-board").getBoundingClientRect();
      const ov =
        Math.max(0, Math.min(a.bottom, g.bottom) - Math.max(a.top, g.top)) *
        Math.max(0, Math.min(a.right, g.right) - Math.max(a.left, g.left));
      return { overlap: +ov.toFixed(1), gap: +(g.top - a.bottom).toFixed(1) };
    });
    if (one.overlap > worst.overlap) {
      worst.overlap = one.overlap;
      worst.h = h;
    }
    if (one.gap < worst.gap) worst.gap = one.gap;
  }
  await browser.close();
  record(
    "I7",
    "T8-M20",
    'in a ~900px dark window "sudoku" never lies on the grid (GREEN guard, not born-RED)',
    worst.overlap === 0,
    `worst overlap ${worst.overlap}px² · min gap ${worst.gap}px (full sweep in probe-r7f-m20sweep.json: 4.4px webkit / 5.0px chromium at all ten heights)`,
  );
}

writeFileSync(process.env.OUTF || resolve(HERE, "readings-at-head.json"), JSON.stringify(results, null, 2));
for (const r of results)
  console.log(`${r.verdict.padEnd(5)} ${r.id} ${r.mark.padEnd(16)} — ${r.reading}`);
console.log(
  `\n${results.filter((r) => r.verdict === "RED").length} RED / ${results.length} at HEAD`,
);
