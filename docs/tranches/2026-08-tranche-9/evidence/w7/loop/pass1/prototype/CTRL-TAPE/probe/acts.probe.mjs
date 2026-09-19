// T9-W7 pass 1 · CTRL-TAPE — THE ACT HALF: §14 the quick set and §15 the confirm.
//
//   node acts.probe.mjs            # HEAD
//   node acts.probe.mjs --overlay  # the family's quick set + the extended two-tap confirm
//
// R7's I4 measure, re-run: one tap per verb on its own FRESH page with `localStorage` cleared,
// and a locator that does not key on the label under test (R7 note 2 — probe 3 failed both ways).

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
const { chromium, webkit } = await import(`${ROOT}/web/frontend/node_modules/playwright/index.mjs`);
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = "http://127.0.0.1:4244/";
const ON = process.argv.includes("--overlay");
const TAG = ON ? "after" : "before";
const engines = { chromium, webkit };

/* ── THE CONFIRM, extended to `fill` and `solve` (§15) ─────────────────────────────────────
   The sublabel the owner has passed twice, applied to the rest of the destructive set. W1 §1.5
   owns the ARMING; this is its FACE, prototyped as a capture-phase guard so no product file
   moves. Disarm on any other tap or after 4s, exactly as the shipped Deal/Clear arms do at
   2.5s — the charter asks for 4s and that is the one number that differs from the incumbent. */
const CONFIRM_PATCH = () => {
  const armed = new WeakMap();
  const dirty = () =>
    [...document.querySelectorAll(".sudoku-cell input")].some((i) => !i.readOnly && i.value);
  const disarmAll = () => {
    for (const b of document.querySelectorAll(".action-verbs button")) {
      const s = b.querySelector(".icon-sublabel");
      if (s && armed.get(b)) {
        s.textContent = armed.get(b).word;
        s.classList.remove("is-armed");
        clearTimeout(armed.get(b).t);
        armed.delete(b);
      }
    }
  };
  const verbs = [...document.querySelectorAll(".action-verbs button")];
  // fill is index 1, solve index 2 — read by position, never by the label under test
  for (const b of [verbs[1], verbs[2]].filter(Boolean)) {
    b.addEventListener(
      "click",
      (e) => {
        if (!matchMedia("(pointer: coarse)").matches || !dirty() || armed.get(b)) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        const s = b.querySelector(".icon-sublabel");
        const word = s.textContent;
        s.textContent = "sure?";
        s.classList.add("is-armed");
        armed.set(b, { word, t: setTimeout(() => disarmAll(), 4000) });
      },
      true,
    );
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".action-verbs button")) disarmAll();
  }, true);
  return verbs.length;
};

/* ── THE QUICK SET (§14) — three tongues under one outline ────────────────────────────────
   `undo · redo · controls` on the board's bottom edge in portrait, vertical on the right flank
   in landscape. The prototype mints the strip in the tongue's own berth and re-uses the
   tongue's washi + drawn-edge grammar; the real one is `HandDrawnOutline :pose="0"` at 2.5. */
const QUICKSET_PATCH = () => {
  const tab = document.querySelector(".drawer-tab");
  if (!tab) return null;
  const berth = tab.parentElement;
  const portrait = matchMedia("(orientation: portrait)").matches;
  const strip = document.createElement("div");
  strip.className = "proto-quickset";
  strip.style.cssText = `position:absolute;display:flex;gap:0;pointer-events:auto;z-index:-1;${
    portrait
      ? "right:0;top:calc(100% - 0.5rem);flex-direction:row;height:48px;"
      : "left:calc(100% - 0.5rem);top:50%;transform:translateY(-50%);flex-direction:column;width:48px;"
  }`;
  for (const [word, act] of [["undo", "undo"], ["redo", "redo"], ["controls", "controls"]]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "proto-tongue";
    b.dataset.act = act;
    b.style.cssText = `min-width:44px;min-height:44px;${portrait ? "width:92px;height:48px;" : "width:48px;height:92px;"}background:var(--color-card);border:none;padding:0;cursor:pointer;display:flex;align-items:center;justify-content:center;`;
    const w = document.createElement("span");
    w.textContent = word;
    w.style.cssText = `font-family:var(--font-hand);font-size:var(--type-small);font-weight:600;letter-spacing:0.06em;color:var(--color-foreground);background:var(--sheet-washi-neutral);padding:0.15rem 0.5rem;clip-path:polygon(4% 2%,96% 0%,100% 50%,97% 94%,5% 100%,0% 52%);${portrait ? "" : "writing-mode:vertical-rl;padding:0.5rem 0.15rem;"}`;
    b.appendChild(w);
    if (act === "controls") b.addEventListener("click", () => tab.click());
    else
      b.addEventListener("click", () => {
        const ribbon = document.querySelector("#fold-tools");
        const n = act === "undo" ? 0 : 1;
        ribbon?.querySelectorAll("button")[n]?.click();
      });
    strip.appendChild(b);
  }
  tab.style.display = "none";
  berth.appendChild(strip);
  const r = strip.getBoundingClientRect();
  return { box: [r.x, r.y, r.width, r.height].map((n) => +n.toFixed(2)), segments: 3 };
};

/* ── THE BOARD'S EDGE — what is on it, and how much of it is left ─────────────────────── */
const EDGE = () => {
  const paper = document.querySelector(".board-paper, .board-wrapper, .board-cells, [role=grid]");
  const pb = paper && paper.getBoundingClientRect();
  const tab = document.querySelector(".drawer-tab");
  const strip = document.querySelector("#quick-set .play-controls, .proto-quickset");
  const occ = strip || tab;
  const ob = occ && occ.getBoundingClientRect();
  const ribbon = document.querySelector("#fold-tools");
  const rb = ribbon && ribbon.getBoundingClientRect();
  return {
    paper: pb ? [pb.x, pb.y, pb.width, pb.height].map((n) => +n.toFixed(2)) : null,
    occupant: occ ? occ.className : null,
    occupantBox: ob ? [ob.x, ob.y, ob.width, ob.height].map((n) => +n.toFixed(2)) : null,
    freeEdgePx: pb && ob ? +(pb.width - ob.width).toFixed(2) : null,
    ribbonBox: rb ? [rb.width, rb.height].map((n) => +n.toFixed(2)) : null,
    ribbonActs: ribbon ? [...ribbon.querySelectorAll("button")].map((b) => (b.innerText || "").replace(/\s+/g, " ").trim()) : [],
    /* M13's own fence, as a number: how many drawn control surfaces the board's edge carries,
       and how many of their acts are ALSO reachable at zero taps somewhere else on the page */
    edgeControls: strip ? strip.querySelectorAll("button").length : tab ? 1 : 0,
    duplicated: strip
      ? [...strip.querySelectorAll("button")].filter((b) =>
          [...(ribbon?.querySelectorAll("button") ?? [])].some(
            (r) => (r.innerText || "").toLowerCase().includes(b.dataset.act),
          ),
        ).length
      : 0,
    tapFloor: strip
      ? [...strip.querySelectorAll("button")].map((b) => {
          const r = b.getBoundingClientRect();
          return { w: +r.width.toFixed(2), h: +r.height.toFixed(2), ok: r.width >= 44 && r.height >= 44 };
        })
      : null,
  };
};

async function page(engine, { w, h, mobile = true, dark = false }) {
  const browser = await engines[engine].launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    hasTouch: mobile,
    isMobile: mobile && engine === "chromium",
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript(() => { try { localStorage.clear(); } catch {} });
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&difficulty=EASY`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await p.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await p.waitForTimeout(1500);
  return { browser, page: p };
}

const out = { tag: TAG, at: new Date().toISOString(), i4: {}, edge: {}, taps: {} };

/* ══ I4 · the destructive set asks first ═══════════════════════════════════════════════ */
for (const engine of ["chromium", "webkit"]) {
  const rows = [];
  for (const verb of ["Deal", "Clear", "Fill", "Solve"]) {
    const { browser, page: p } = await page(engine, { w: 390, h: 844 });
    await p.evaluate(() => {
      const i = [...document.querySelectorAll(".sudoku-cell input")].filter((x) => !x.readOnly && !x.disabled && !x.value)[0];
      i?.focus();
    });
    await p.keyboard.type("5");
    await p.waitForTimeout(500);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await p.locator(".drawer-tab").click({ force: true });
      await p.waitForTimeout(950);
    }
    if (ON) await p.evaluate(CONFIRM_PATCH);
    rows.push(
      await p.evaluate(async ([name]) => {
        const idx = { Clear: 0, Fill: 1, Solve: 2 };
        const b = name === "Deal"
          ? document.querySelector(".deal-row button")
          : document.querySelectorAll(".action-bar .action-verbs button")[idx[name]];
        const before = [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join("");
        b.click();
        await new Promise((r) => setTimeout(r, 1200));
        const after = [...document.querySelectorAll(".sudoku-cell input")].map((i) => i.value).join("");
        const sub = b.querySelector(".icon-sublabel");
        return {
          verb: name,
          armed: !!b.querySelector(".icon-sublabel.is-armed"),
          sublabel: sub ? sub.textContent.trim() : null,
          sublabelColor: sub ? getComputedStyle(sub).color : null,
          sublabelWeight: sub ? getComputedStyle(sub).fontWeight : null,
          dialog: !!document.querySelector("[role=alertdialog],[role=dialog]"),
          cellsWritten: [...before].filter((c, i) => c !== after[i]).length,
        };
      }, [verb]),
    );
    await browser.close();
  }
  out.i4[engine] = {
    rows,
    violations: rows.filter((r) => r.cellsWritten > 0 || (!r.armed && !r.dialog)).map((r) => r.verb),
  };
}

/* ══ §14 · the quick set, at the three cells the charter names ═════════════════════════ */
for (const [name, w, h] of [["portrait-390x844", 390, 844], ["landscape-844x390", 844, 390], ["landscape-900x500", 900, 500]]) {
  for (const engine of ["chromium", "webkit"]) {
    const { browser, page: p } = await page(engine, { w, h });
    if (ON) {
      const q = await p.evaluate(QUICKSET_PATCH);
      (out.taps[name] ??= {})[engine] = { strip: q };
    }
    await p.waitForTimeout(250);
    (out.edge[name] ??= {})[engine] = await p.evaluate(EDGE);
    /* the tap count for each quick act FROM THE PLAYING VIEW (sheet shut) */
    (out.taps[name] ??= {})[engine] = {
      ...(out.taps[name]?.[engine] ?? {}),
      zeroTap: await p.evaluate(() => {
        const vis = (e) => {
          if (!e) return false;
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0 && getComputedStyle(e).visibility !== "hidden";
        };
        const strip = document.querySelector("#quick-set .play-controls, .proto-quickset");
        const ribbon = document.querySelector("#fold-tools");
        return {
          undo: vis(strip?.querySelectorAll("button")[0]) || vis(ribbon?.querySelectorAll("button")[0]),
          redo: vis(strip?.querySelectorAll("button")[1]) || vis(ribbon?.querySelectorAll("button")[1]),
          controls: vis(document.querySelector(".proto-quickset [data-act=controls]")) || vis(document.querySelector(".drawer-tab")),
          ribbonPresent: vis(ribbon),
        };
      }),
    };
    await browser.close();
  }
}

writeFileSync(join(HERE, "..", `acts-${TAG}.json`), JSON.stringify(out, null, 1));
console.log(`banked acts-${TAG}.json`);
