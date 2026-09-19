// CTRL-TABS · pass-1 research probe — BASELINE then OVERLAY, both engines, three cells.
//
//   node ctrl-tabs.probe.mjs            (dev server at 127.0.0.1:4232, --strictPort)
//
// Read-only on the product: the prototype is an `addStyleTag` + `page.evaluate` overlay, so
// no file under `web/frontend/` is touched. Writes `readings.json` beside this file.
//
// PHASE A · baseline — the card's overflow at every cell, every tray's own height, the bar,
//           the board's free bottom edge, the mobile tab row as it ships.
// PHASE B · overlay — the tablist prototype (arm a tongue / arm b tape), one tray face-up:
//           scrollHeight ≤ clientHeight per tray, the tab boxes against the 44 floor in BOTH
//           dimensions with a per-dimension negative control, the hidden trays' tabbability,
//           the tab word's painted contrast, the strip inside 358px.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4232/";
const PROTO = join(HERE, "..", "proto");

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true },
  { name: "land-844x390", w: 844, h: 390, mobile: true, sheet: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, sheet: false },
];

const out = { base: BASE, at: new Date().toISOString(), cells: {} };

async function board(engine, cell, dark = false) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    isMobile: cell.mobile && engine === "chromium" ? true : undefined,
    hasTouch: cell.mobile,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.clear();
    } catch {
      /* private mode */
    }
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page
    .waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 30000 })
    .catch(() => {});
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  if (cell.sheet) {
    const shut = await page.evaluate(() =>
      document.documentElement.classList.contains("drawer-closed"),
    );
    if (shut) {
      await page.locator(".drawer-tab").click({ force: true });
      await page.waitForTimeout(950); // THE SHEET SLIDES
    }
  }
  return { browser, page };
}

// ── PHASE A ──────────────────────────────────────────────────────────────────
const baseline = () => {
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return {
      x: +r.x.toFixed(2),
      y: +r.y.toFixed(2),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
    };
  };
  const card = document.querySelector(".controls-card");
  const wrap = document.querySelector(".control-panel-wrap");
  const cs = card ? getComputedStyle(card) : null;
  const trays = Array.from(document.querySelectorAll(".tray-well")).map((t) => ({
    name: (t.querySelector(".washi-tag")?.textContent || "").trim(),
    box: box(t),
    marginBottom: getComputedStyle(t).marginBottom,
    tag: box(t.querySelector(".washi-tag")),
    optionRows: t.querySelectorAll(".ctrl-options").length,
  }));
  const paper = document.querySelector(".board-paper, .board-wrapper, #board-edge");
  const tab = document.querySelector(".drawer-tab");
  const foldTools = document.querySelector("#fold-tools");
  const playControls = document.querySelector(".play-controls");
  const bar = document.querySelector(".action-bar");
  return {
    card: card
      ? {
          box: box(card),
          scrollHeight: card.scrollHeight,
          clientHeight: card.clientHeight,
          overflowPx: card.scrollHeight - card.clientHeight,
          overflowFrac: +((card.scrollHeight - card.clientHeight) / card.scrollHeight).toFixed(4),
          maxHeight: cs.maxHeight,
          overflowY: cs.overflowY,
          padT: cs.paddingTop,
          padB: cs.paddingBottom,
        }
      : null,
    sheetChrome: getComputedStyle(
      document.querySelector(".scene-controls") || document.documentElement,
    ).getPropertyValue("--sheet-chrome"),
    wrapH: wrap ? +wrap.getBoundingClientRect().height.toFixed(2) : null,
    trays,
    bar: bar
      ? {
          box: box(bar),
          position: getComputedStyle(bar).position,
          border: getComputedStyle(bar).borderTopWidth,
          zIndex: getComputedStyle(bar).zIndex,
        }
      : null,
    mobileTabRow: box(document.querySelector(".mobile-heading-row")),
    mobileTabs: Array.from(document.querySelectorAll(".mobile-heading-btn")).map((b) => ({
      text: b.innerText.replace(/\s+/g, " ").trim(),
      box: box(b),
    })),
    boardEdge: box(document.querySelector("#board-edge")),
    boardPaper: box(document.querySelector(".board-paper")) || box(document.querySelector(".board-wrapper")),
    boardCells: box(document.querySelector(".board-cells")),
    drawerTab: tab
      ? { box: box(tab), writingMode: getComputedStyle(tab.querySelector(".drawer-tab-text")).writingMode }
      : null,
    foldTools: foldTools ? { box: box(foldTools), display: getComputedStyle(foldTools).display } : null,
    playControls: playControls
      ? {
          box: box(playControls),
          buttons: Array.from(playControls.querySelectorAll("button")).map((b) => ({
            label: b.getAttribute("aria-label") || b.innerText.trim(),
            box: box(b),
          })),
        }
      : null,
    tokens: (() => {
      const r = getComputedStyle(document.documentElement);
      const cardEl = document.querySelector(".controls-card");
      const rc = cardEl ? getComputedStyle(cardEl) : r;
      const g = (k) => (rc.getPropertyValue(k) || r.getPropertyValue(k)).trim();
      return {
        "--type-group-title": g("--type-group-title"),
        "--type-tag": g("--type-tag"),
        "--type-option": g("--type-option"),
        "--type-act": g("--type-act"),
        "--type-verb": g("--type-verb"),
        "--type-tool": g("--type-tool"),
        "--type-small": g("--type-small"),
        "--tap-floor": g("--tap-floor"),
        "--board-col": g("--board-col"),
        "--sheet-washi-neutral": g("--sheet-washi-neutral"),
        "--ink-press-quiet": g("--ink-press-quiet"),
        "--ink-press-rule": g("--ink-press-rule"),
      };
    })(),
  };
};

// ── PHASE B · the overlay ────────────────────────────────────────────────────
// ARM is "tongue" or "tape". Builds the tablist, hides all but one tray, promotes the bar to
// the tray's floor, and (on mobile) turns size/level from tabs into two rows inside `new game`.
const OVERLAY = (arm) => {
  const wrap = document.querySelector(".control-panel-wrap");
  const card = document.querySelector(".controls-card");
  if (!wrap || !card) return { error: "no card" };
  if (document.querySelector(".proto-tablist")) return { ok: "already" };

  const trays = Array.from(document.querySelectorAll(".tray-well"));
  const names = trays.map((t) => (t.querySelector(".washi-tag")?.textContent || "?").trim());

  // 1 · THE HEADING IS THE TAB — the in-tray tape stops being the name.
  for (const t of trays) {
    const tag = t.querySelector(".washi-tag");
    if (tag) tag.setAttribute("data-proto-hidden-tag", "1");
  }

  // 2 · size / level become two ROWS inside `new game`; the phone's tabs go away.
  const tabRow = document.querySelector(".mobile-heading-row");
  if (tabRow) tabRow.setAttribute("data-proto-gone", "1");
  const filtered = document.querySelector(".control-panel-filtered");
  if (filtered) {
    const sels = Array.from(filtered.querySelectorAll(".ctrl-options"));
    const labels = ["size", "level"];
    sels.forEach((s, i) => {
      s.setAttribute("data-proto-show", "1");
      const host = s.closest(".staged-section") || s;
      if (!host.previousElementSibling?.classList?.contains("proto-row-label")) {
        const cap = document.createElement("span");
        cap.className = "zone-row-label proto-row-label";
        cap.textContent = labels[i] ?? "row";
        host.parentElement.insertBefore(cap, host);
      }
    });
  }

  // 3 · THE STRIP. role=tablist / tab / tabpanel, roving tabindex, APG arrow keys.
  const strip = document.createElement("div");
  strip.className = `proto-tablist proto-arm-${arm}`;
  strip.setAttribute("role", "tablist");
  strip.setAttribute("aria-label", "controls");
  const tabs = names.map((n, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "proto-tab";
    b.setAttribute("role", "tab");
    b.id = `proto-tab-${i}`;
    b.setAttribute("aria-controls", `proto-panel-${i}`);
    const word = document.createElement("span");
    word.className = "proto-tab-word";
    word.textContent = n;
    b.appendChild(word);
    strip.appendChild(b);
    return b;
  });
  trays.forEach((t, i) => {
    t.id = `proto-panel-${i}`;
    t.setAttribute("role", "tabpanel");
    t.setAttribute("aria-labelledby", `proto-tab-${i}`);
    t.removeAttribute("aria-labelledby-old");
  });
  wrap.insertBefore(strip, wrap.firstChild);

  const select = (i) => {
    tabs.forEach((b, j) => {
      const on = i === j;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;
      b.classList.toggle("is-selected", on);
    });
    trays.forEach((t, j) => {
      const on = i === j;
      t.toggleAttribute("data-proto-off", !on);
      if (on) t.removeAttribute("inert");
      else t.setAttribute("inert", "");
    });
    window.__protoSelected = i;
  };
  strip.addEventListener("keydown", (e) => {
    const cur = window.__protoSelected ?? 0;
    const n = tabs.length;
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (cur + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (cur - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next !== null) {
      e.preventDefault();
      select(next);
      tabs[next].focus();
    }
  });
  tabs.forEach((b, i) => b.addEventListener("click", () => select(i)));
  window.__protoSelect = select;
  select(0);
  return { ok: true, names };
};

const OVERLAY_CSS = `
/* The heading IS the tab: the in-tray tape stops carrying the name. */
[data-proto-hidden-tag] { display: none !important; }
[data-proto-gone] { display: none !important; }
[data-proto-show] { display: flex !important; }
.proto-row-label { display: block; }

/* One tray face-up. */
.tray-well[data-proto-off] { display: none !important; }

.proto-tablist {
  display: flex;
  align-items: flex-end;
  gap: 0.25rem;
  width: 100%;
  margin: 0 0 -1.5px 0;
  padding: 0;
}
.proto-tab {
  flex: 1 1 auto;
  min-width: var(--tap-floor, 2.75rem);
  min-height: var(--tap-floor, 2.75rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
}
.proto-tab-word {
  font-family: var(--font-hand);
  font-size: var(--type-tag);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  line-height: 1.1;
  white-space: nowrap;
  color: var(--ink-press-quiet);
}
.proto-tab.is-selected .proto-tab-word { color: var(--color-foreground); }

/* ARM (a) — THE DRAWER TONGUE'S IDIOM. A --color-card tongue with a one-sided radius,
   the washi word on it, the selected one continuous with the tray below. */
.proto-arm-tongue .proto-tab {
  background: var(--color-card);
  border: 1.5px solid var(--ink-press-rule);
  border-bottom: none;
  border-radius: 0.75rem 0.75rem 0 0;
  opacity: 0.68;
}
.proto-arm-tongue .proto-tab.is-selected {
  opacity: 1;
  border-width: 2.5px;
  border-bottom: none;
  margin-bottom: -2.5px;
  padding-bottom: calc(0.35rem + 2.5px);
}

/* ARM (b) — THE WASHI TAPE PROMOTED. Flat quiet tapes; the selected one pulled out at its
   own ±1.5° tilt at full ink. */
.proto-arm-tape .proto-tab {
  background: var(--sheet-washi-neutral);
  clip-path: polygon(4% 2%, 96% 0%, 100% 50%, 97% 94%, 5% 100%, 0% 52%);
  opacity: 0.68;
  border: none;
}
.proto-arm-tape .proto-tab.is-selected {
  opacity: 1;
  transform: rotate(-1.5deg) translateY(-3px);
}

/* THE FLOOR — the bar drawn as the tray's own foot rather than a colour plane. */
.action-bar {
  border-top: 2.5px solid var(--ink-press-rule) !important;
}
`;

// per-dimension negative control for the 44 floor
const tapRows = (sel) =>
  Array.from(document.querySelectorAll(sel)).map((el) => {
    const r = el.getBoundingClientRect();
    return {
      text: el.innerText.replace(/\s+/g, " ").trim(),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      wOK: r.width >= 44,
      hOK: r.height >= 44,
    };
  });

const measureOverlay = () => {
  const card = document.querySelector(".controls-card");
  const strip = document.querySelector(".proto-tablist");
  const tabs = Array.from(document.querySelectorAll(".proto-tab"));
  const per = [];
  for (let i = 0; i < tabs.length; i++) {
    window.__protoSelect(i);
    // force layout
    void card.offsetHeight;
    const tray = document.querySelector(".tray-well:not([data-proto-off])");
    per.push({
      tab: tabs[i].innerText.trim(),
      scrollHeight: card.scrollHeight,
      clientHeight: card.clientHeight,
      fits: card.scrollHeight <= card.clientHeight,
      overflowPx: card.scrollHeight - card.clientHeight,
      trayH: tray ? +tray.getBoundingClientRect().height.toFixed(2) : null,
    });
  }
  window.__protoSelect(0);
  const sr = strip.getBoundingClientRect();
  const boxes = tabs.map((b) => {
    const r = b.getBoundingClientRect();
    return {
      text: b.innerText.replace(/\s+/g, " ").trim(),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      wOK: r.width >= 44,
      hOK: r.height >= 44,
    };
  });
  // seams: gap between adjacent tabs
  const seams = [];
  for (let i = 1; i < tabs.length; i++) {
    const a = tabs[i - 1].getBoundingClientRect();
    const b = tabs[i].getBoundingClientRect();
    seams.push(+(b.left - a.right).toFixed(2));
  }
  // hidden trays: tabbable?
  const hiddenTabbables = Array.from(
    document.querySelectorAll(".tray-well[data-proto-off]"),
  ).flatMap((t) =>
    Array.from(t.querySelectorAll("button, a[href], input, select, textarea, [tabindex]")).map(
      (el) => ({
        tag: el.tagName,
        label: (el.getAttribute("aria-label") || el.innerText || "").trim().slice(0, 24),
        // an inert subtree's controls are not focusable; prove it by trying
        focusable: (() => {
          const before = document.activeElement;
          try {
            el.focus();
          } catch {
            /* */
          }
          const got = document.activeElement === el;
          if (before instanceof HTMLElement) before.focus();
          return got;
        })(),
      }),
    ),
  );
  return {
    strip: { w: +sr.width.toFixed(2), h: +sr.height.toFixed(2), y: +sr.y.toFixed(2) },
    tabs: boxes,
    seams,
    stripSpend: +(boxes.reduce((a, b) => a + b.w, 0) + seams.reduce((a, b) => a + b, 0)).toFixed(2),
    perTray: per,
    hiddenTrayTabbables: hiddenTabbables.length,
    hiddenTrayFocusable: hiddenTabbables.filter((x) => x.focusable).length,
    hiddenSample: hiddenTabbables.slice(0, 4),
    tablist: {
      roles: {
        tablist: document.querySelectorAll('[role="tablist"]').length,
        tab: document.querySelectorAll('[role="tab"]').length,
        tabpanel: document.querySelectorAll('[role="tabpanel"]').length,
      },
      rovingZeros: document.querySelectorAll('[role="tab"][tabindex="0"]').length,
      labelledPanels: Array.from(document.querySelectorAll('[role="tabpanel"]')).map((p) => {
        const id = p.getAttribute("aria-labelledby");
        return { panel: p.id, name: (document.getElementById(id)?.innerText || "").trim() };
      }),
    },
  };
};

// ── run ──────────────────────────────────────────────────────────────────────
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const key = `${cell.name}-${engine}`;
    const { browser, page } = await board(engine, cell);
    try {
      const A = await page.evaluate(baseline);
      await page.addStyleTag({ content: OVERLAY_CSS });
      const built = await page.evaluate(OVERLAY, "tongue");
      await page.waitForTimeout(250);
      const Btongue = await page.evaluate(measureOverlay);
      // swap the arm's skin only — same DOM, same roles
      await page.evaluate(() => {
        const s = document.querySelector(".proto-tablist");
        s.classList.remove("proto-arm-tongue");
        s.classList.add("proto-arm-tape");
      });
      await page.waitForTimeout(200);
      const Btape = await page.evaluate(measureOverlay);
      out.cells[key] = { baseline: A, built, overlayTongue: Btongue, overlayTape: Btape };
      console.log(
        `[${key}] card ${A.card?.scrollHeight}/${A.card?.clientHeight} ` +
          `over ${A.card?.overflowPx} → tabs fit: ` +
          Btongue.perTray.map((p) => `${p.tab}=${p.fits ? "Y" : "N(" + p.overflowPx + ")"}`).join(" "),
      );
    } catch (e) {
      out.cells[key] = { error: String(e).slice(0, 400) };
      console.log(`[${key}] ERROR ${String(e).slice(0, 200)}`);
    }
    await browser.close();
  }
}
writeFileSync(join(HERE, "readings.json"), JSON.stringify(out, null, 1));
console.log("\nbanked probe/readings.json");
