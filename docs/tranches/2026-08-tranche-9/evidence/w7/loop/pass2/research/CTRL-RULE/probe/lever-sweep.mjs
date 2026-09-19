// T9-W7 pass2 · CTRL-RULE research — THE LEVER SWEEP. Arm (b) is short at 390; this prices
// every lever that could close the gap, on HEAD's own chips, both engines. Read-only: the
// sweep mutates inline styles inside `page.evaluate` and restores them; no product file moves.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

async function open(engine) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: engine === "chromium" ? true : undefined,
    hasTouch: true,
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
  await page.waitForTimeout(1400);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  return { browser, page };
}

const SWEEP = () => {
  const n2 = (v) => +(+v).toFixed(2);
  const card = document.querySelector(".controls-card");

  // Force EVERY option row visible — the `level` row is display:none behind the tab at HEAD,
  // and arm (b) retires the tabs, so its natural width is part of the budget.
  const style = document.createElement("style");
  style.textContent =
    ".controls-card .control-panel-filtered > *, .controls-card .ctrl-options{display:flex!important}";
  document.head.appendChild(style);

  const rowsOf = () =>
    [...card.querySelectorAll(".options-row")].map((r) => {
      const chips = [...r.querySelectorAll(".ctrl-btn")];
      const rcs = getComputedStyle(r);
      const gap = parseFloat(rcs.columnGap) || parseFloat(rcs.gap) || 0;
      const w = chips.map((b) => n2(b.getBoundingClientRect().width));
      return {
        words: chips.map((b) => b.innerText.trim()),
        chipW: w,
        gap: n2(gap),
        natural: n2(w.reduce((a, b) => a + b, 0) + gap * Math.max(0, w.length - 1)),
        fontSize: chips[0] ? n2(parseFloat(getComputedStyle(chips[0]).fontSize)) : null,
        padL: chips[0] ? n2(parseFloat(getComputedStyle(chips[0]).paddingLeft)) : null,
        chipH: chips[0] ? n2(chips[0].getBoundingClientRect().height) : null,
      };
    });

  const base = rowsOf();

  // ── the sweep: chip font-size × horizontal padding, every combination ──────
  const sweep = [];
  const chips = [...card.querySelectorAll(".options-row .ctrl-btn")];
  for (const fs of [20, 19, 18, 17, 16]) {
    for (const pad of [12, 10.4, 8, 6, 4]) {
      for (const b of chips) {
        b.style.fontSize = fs + "px";
        b.style.paddingLeft = pad + "px";
        b.style.paddingRight = pad + "px";
      }
      void card.offsetHeight;
      const rows = rowsOf();
      const widest = Math.max(...rows.map((r) => r.natural));
      const widestRow = rows.find((r) => r.natural === widest);
      sweep.push({
        fontSize: fs,
        pad,
        widestRow: widestRow ? widestRow.words.join("·") : null,
        widestNatural: n2(widest),
        perRow: rows.map((r) => ({ words: r.words.join("·"), natural: r.natural, h: r.chipH })),
      });
    }
  }
  for (const b of chips) {
    b.style.fontSize = "";
    b.style.paddingLeft = "";
    b.style.paddingRight = "";
  }
  void card.offsetHeight;

  // ── the WRAP lever: what does one wrapped row cost in height? ──────────────
  const marks = [...card.querySelectorAll(".options-row")].find((r) =>
    [...r.querySelectorAll(".ctrl-btn")].some((b) => b.innerText.trim() === "Normal"),
  );
  let wrapCost = null;
  if (marks) {
    const h0 = n2(marks.getBoundingClientRect().height);
    const parentH0 = n2(card.scrollHeight);
    marks.style.flexWrap = "wrap";
    marks.style.width = "201.1px"; // two chips + one gap, the 2+1 pose
    void card.offsetHeight;
    const h1 = n2(marks.getBoundingClientRect().height);
    const parentH1 = n2(card.scrollHeight);
    marks.style.flexWrap = "";
    marks.style.width = "";
    void card.offsetHeight;
    wrapCost = { rowH: h0, rowHWrapped: h1, dRow: n2(h1 - h0), cardH: parentH0, cardHWrapped: parentH1, dCard: n2(parentH1 - parentH0) };
  }

  style.remove();
  void card.offsetHeight;

  // ── the 19: the authored-ring census, restated per selector ───────────────
  const FOCUSABLE =
    "button, [role=option], a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
  const byClass = {};
  for (const el of card.querySelectorAll(FOCUSABLE)) {
    const c = getComputedStyle(el);
    const key =
      (el.className.toString().match(/\b(ctrl-btn|icon-btn|info-btn|players-leave|mobile-heading-btn|peek-chip|deal-btn|invite-btn)\b/g) || ["(other)"]).join(".");
    byClass[key] = byClass[key] || { n: 0, authored: 0, examples: [], outline: c.outlineStyle + " " + c.outlineWidth };
    byClass[key].n++;
    if (c.outlineStyle !== "none" && c.outlineWidth !== "0px") byClass[key].authored++;
    if (byClass[key].examples.length < 3)
      byClass[key].examples.push((el.innerText || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 18));
  }

  return { base, sweep, wrapCost, ringCensus: byClass, inner: n2(374) };
};

const out = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await open(engine);
  out[engine] = await page.evaluate(SWEEP);
  await browser.close();
  console.log(engine, "rows:", out[engine].base.map((r) => r.words.join("·") + "=" + r.natural).join("  "));
  console.log(engine, "wrapCost:", JSON.stringify(out[engine].wrapCost));
}
writeFileSync(join(OUT, "lever-sweep.json"), JSON.stringify(out, null, 1));
console.log("banked readings/lever-sweep.json");
