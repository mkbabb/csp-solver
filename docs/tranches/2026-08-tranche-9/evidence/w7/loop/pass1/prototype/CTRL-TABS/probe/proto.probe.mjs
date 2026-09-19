// T9-W7 · pass 1 · PROTOTYPE · CTRL-TABS — the numbers, on the REAL surface.
// The patch is in the tree (no overlay, no addStyleTag): every selector below is a product
// selector the patch mints. Both engines, seven cells, the sheet settled 950ms after the tap.
//
//   node .scratch-w7/proto.probe.mjs           (dev server: vite --port 4238 --strictPort)
//
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4238/";
const OUT = process.env.OUT || "/tmp/ctrl-tabs-proto.json";

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true, schemes: ["dark", "light"] },
  { name: "dock-375x812", w: 375, h: 812, mobile: true, sheet: true, schemes: ["light"] },
  { name: "dock-430x932", w: 430, h: 932, mobile: true, sheet: true, schemes: ["light"] },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true, schemes: ["light"] },
  { name: "land-844x390", w: 844, h: 390, mobile: true, sheet: true, schemes: ["light"] },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, sheet: false, schemes: ["light", "dark"] },
  { name: "desk-1440x900", w: 1440, h: 900, mobile: false, sheet: false, schemes: ["light"] },
];

// ── painted-byte contrast, the research's own reader ────────────────────────────────────────
const lum = (r, g, b) => {
  const f = (x) => {
    const v = x / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [l1, l2] = [a, b].sort((x, y) => y - x);
  return +(((l1 + 0.05) / (l2 + 0.05))).toFixed(2);
};
async function painted(page, selector, inflate = 0) {
  const el = page.locator(selector).first();
  if (!(await el.count())) return null;
  const box = await el.boundingBox();
  if (!box) return null;
  const clip = {
    x: Math.max(0, box.x - inflate),
    y: Math.max(0, box.y - inflate),
    width: Math.max(2, box.width + 2 * inflate),
    height: Math.max(2, box.height + 2 * inflate),
  };
  const buf = await page.screenshot({ clip });
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const hist = new Map();
  let dark = { L: 2, px: null };
  let light = { L: -1, px: null };
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    hist.set(`${r},${g},${b}`, (hist.get(`${r},${g},${b}`) || 0) + 1);
    const L = lum(r, g, b);
    if (L < dark.L) dark = { L, px: [r, g, b] };
    if (L > light.L) light = { L, px: [r, g, b] };
  }
  const ground = [...hist.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  const gL = lum(...ground);
  const ink = Math.abs(dark.L - gL) >= Math.abs(light.L - gL) ? dark : light;
  return {
    ground: `rgb(${ground.join(",")})`,
    ink: `rgb(${ink.px.join(",")})`,
    ratio: ratio(gL, ink.L),
  };
}

// ── the in-page census ──────────────────────────────────────────────────────────────────────
const census = () => {
  const card = document.querySelector(".controls-card");
  const strip = document.querySelector(".tab-strip");
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { w: +r.width.toFixed(2), h: +r.height.toFixed(2), x: +r.x.toFixed(2), y: +r.y.toFixed(2) };
  };
  const perTab = [];
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].click();
    void card.offsetHeight;
    const tray = document.querySelector(".tray:not([inert])");
    perTab.push({
      tab: tabs[i].innerText.replace(/\s+/g, " ").trim(),
      trayH: tray ? +tray.getBoundingClientRect().height.toFixed(2) : null,
      cardH: +card.getBoundingClientRect().height.toFixed(2),
      scrollHeight: card.scrollHeight,
      clientHeight: card.clientHeight,
      fits: card.scrollHeight <= card.clientHeight,
      over: card.scrollHeight - card.clientHeight,
    });
  }
  tabs[0].click();
  const boxes = tabs.map((t) => {
    const b = box(t);
    return { text: t.innerText.replace(/\s+/g, " ").trim(), ...b, wOK: b.w >= 44, hOK: b.h >= 44 };
  });
  const vertical = getComputedStyle(strip).writingMode.startsWith("vertical");
  const seams = [];
  {
    const rects = tabs
      .map((t) => t.getBoundingClientRect())
      .sort((a, b) => (vertical ? a.top - b.top : a.left - b.left));
    for (let i = 1; i < rects.length; i++)
      seams.push(
        +(vertical ? rects[i].top - rects[i - 1].bottom : rects[i].left - rects[i - 1].right).toFixed(2),
      );
  }
  // nothing may scroll: the card AND every ancestor up to the document
  const scrollers = [];
  for (let el = card; el; el = el.parentElement) {
    if (el.scrollHeight - el.clientHeight > 1)
      scrollers.push({
        sel: el.className ? `.${String(el.className).split(" ")[0]}` : el.tagName,
        over: el.scrollHeight - el.clientHeight,
      });
  }
  // the three trays not face up
  const hidden = [...document.querySelectorAll(".tray[inert]")].flatMap((t) =>
    [...t.querySelectorAll("button,a[href],input,select,textarea,[tabindex]")].map((el) => {
      const before = document.activeElement;
      let got = false;
      try {
        el.focus();
        got = document.activeElement === el;
      } catch {}
      if (before instanceof HTMLElement) before.focus();
      return { tag: el.tagName, got };
    }),
  );
  const bar = document.querySelector(".action-bar");
  const verbs = [...document.querySelectorAll(".action-verbs > *")].map((b) => ({
    label: (b.getAttribute("aria-label") || b.innerText || "").replace(/\s+/g, " ").trim().slice(0, 24),
    ...box(b),
  }));
  // I2's own geometry, re-aimed at the panels that exist (the wells are gone)
  const barB = bar?.getBoundingClientRect();
  let worst = 0, who = null;
  for (const p of document.querySelectorAll('[role="tabpanel"]:not([inert])')) {
    const pb = p.getBoundingClientRect();
    if (!barB || !pb.width || !pb.height) continue;
    const ov =
      Math.max(0, Math.min(pb.bottom, barB.bottom) - Math.max(pb.top, barB.top)) *
      Math.max(0, Math.min(pb.right, barB.right) - Math.max(pb.left, barB.left));
    const frac = ov / Math.max(1, pb.width * pb.height);
    if (frac > worst) { worst = frac; who = p.id; }
  }
  const barCS = bar ? getComputedStyle(bar) : null;
  const edge = [...document.querySelectorAll(".edge-tools button")].map((b) => ({
    label: (b.getAttribute("aria-label") || "").slice(0, 18),
    ...box(b),
  }));
  const tongue = document.querySelector(".drawer-tab");
  const caseEl = document.querySelector("#controls-drawer .drawer-case");
  const mark = document.querySelector("svg.handwritten-logo");
  const chip = card?.querySelector(".ctrl-btn");
  const word = document.querySelector(".tab-word");
  return {
    roles: {
      tablist: document.querySelectorAll('[role="tablist"]').length,
      tab: tabs.length,
      tabpanel: document.querySelectorAll('[role="tabpanel"]').length,
      rovingZeros: document.querySelectorAll('[role="tab"][tabindex="0"]').length,
      selected: document.querySelectorAll('[role="tab"][aria-selected="true"]').length,
      headingHosts: [...document.querySelectorAll('h2 > [role="tab"]')].length,
      inertTrays: document.querySelectorAll(".tray[inert]").length,
    },
    perTab,
    cardHeightSpread: +(
      Math.max(...perTab.map((p) => p.cardH)) - Math.min(...perTab.map((p) => p.cardH))
    ).toFixed(2),
    tabs: boxes,
    tapFloorFails: boxes.filter((b) => !b.wOK || !b.hOK).length,
    seams,
    vertical,
    strip: strip ? box(strip) : null,
    stripSpend: +(boxes.reduce((a, b) => a + (vertical ? b.h : b.w), 0) + seams.reduce((a, b) => a + b, 0)).toFixed(2),
    scrollers,
    hiddenTabbables: hidden.length,
    hiddenFocusable: hidden.filter((x) => x.got).length,
    floor: {
      ...(bar ? box(bar) : {}),
      ownChrome: barCS
        ? parseFloat(barCS.borderTopWidth) > 0 || barCS.boxShadow !== "none"
        : null,
      borderTop: barCS?.borderTopWidth ?? null,
      verbs,
      spend: +verbs.reduce((a, b) => a + b.w, 0).toFixed(2),
    },
    i2: { worstCoverage: +worst.toFixed(4), who },
    edge,
    edgeFails: edge.filter((b) => b.w < 44 || b.h < 44).length,
    tongue: tongue ? box(tongue) : null,
    seam:
      caseEl && mark
        ? +(caseEl.getBoundingClientRect().top - mark.getBoundingClientRect().bottom).toFixed(2)
        : null,
    type: {
      namePx: word ? +parseFloat(getComputedStyle(word).fontSize).toFixed(3) : null,
      nameWeight: word ? getComputedStyle(word).fontWeight : null,
      nameTracking: word ? getComputedStyle(word).letterSpacing : null,
      nameFamily: word ? getComputedStyle(word).fontFamily.split(",")[0].replace(/["']/g, "") : null,
      chipPx: chip ? +parseFloat(getComputedStyle(chip).fontSize).toFixed(3) : null,
    },
    dies: {
      foldTools: document.querySelectorAll("#fold-tools").length,
      trayWell: document.querySelectorAll(".tray-well").length,
      washiTagSticky: [...document.querySelectorAll(".washi-tag")].filter(
        (t) => getComputedStyle(t).position === "sticky",
      ).length,
      peekHoldSurface: document.querySelectorAll(".peek-hold-surface").length,
      boilDivider: document.querySelectorAll(".boil-divider-wrap").length,
      mobileHeadingRow: document.querySelectorAll(".mobile-heading-row").length,
      liveFilterEls: [...document.querySelectorAll("*")].filter((el) => {
        const f = getComputedStyle(el).filter;
        return f && f !== "none" && f.includes("url(");
      }).length,
    },
  };
};

// Per-dimension negative control: force ONE tab under the floor on each axis and count the
// catches. The flex terms are part of it — a tab is `flex: 1 1 auto` with a `--tap-floor`
// minimum on BOTH axes, so a bare `width: 40px` is absorbed by the grow factor and the row
// would read as vacuous when it is not.
const negControl = (axis) => {
  const t = document.querySelectorAll('[role="tab"]')[1];
  const set = (k, v) => t.style.setProperty(k, v, "important");
  if (axis === "h") {
    set("min-height", "0");
    set("height", "40px");
    set("align-self", "flex-start");
  } else {
    set("min-inline-size", "0");
    set("flex", "0 0 40px");
    set("width", "40px");
  }
  void t.offsetHeight;
  const bad = [...document.querySelectorAll('[role="tab"]')].filter((b) => {
    const r = b.getBoundingClientRect();
    return axis === "h" ? r.height < 44 : r.width < 44;
  }).length;
  for (const k of ["min-height", "height", "align-self", "min-inline-size", "flex", "width"])
    t.style.removeProperty(k);
  void t.offsetHeight;
  return bad;
};

async function boot(engine, cell, scheme) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    isMobile: cell.mobile && engine === "chromium" ? true : undefined,
    hasTouch: cell.mobile,
    colorScheme: scheme,
  });
  await ctx.addInitScript((s) => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("sudoku-color-scheme", s);
    } catch {}
  }, scheme);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  return { browser, page };
}

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    for (const scheme of cell.schemes) {
      const key = `${cell.name}-${engine}-${scheme}`;
      let browser;
      try {
        const b = await boot(engine, cell, scheme);
        browser = b.browser;
        const page = b.page;

        // ── SHEET SHUT: the board's edge is the tools' home, and undo is at ZERO taps ───────
        const shut = await page.evaluate(() => {
          const rows = [...document.querySelectorAll(".edge-tools button")].map((b) => {
            const r = b.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const cy = r.top + r.height / 2;
            const hit = document.elementFromPoint(cx, cy);
            return {
              label: (b.getAttribute("aria-label") || "").slice(0, 18),
              w: +r.width.toFixed(2),
              h: +r.height.toFixed(2),
              onScreen: r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth,
              topHit: !!hit && (hit === b || b.contains(hit)),
            };
          });
          const berth = document.querySelector("#board-edge-tools");
          return {
            tools: rows,
            zeroTapTools: rows.filter((r) => r.onScreen && r.topHit).length,
            berthPresent: !!berth,
            foldTools: document.querySelectorAll("#fold-tools").length,
          };
        });

        if (cell.sheet) {
          await page.locator(".drawer-tab").click({ force: true });
          await page.waitForTimeout(950); // the sheet SLIDES
        }
        const c = await page.evaluate(census);
        const negH = await page.evaluate(negControl, "h");
        const negW = await page.evaluate(negControl, "w");

        // ── ONE DIMMING: the unraised word painted, and the double-dim negative control ─────
        const quiet = await painted(page, '[role="tab"]:not(.is-raised) .tab-word');
        const raised = await painted(page, '[role="tab"].is-raised .tab-word');
        await page.evaluate(() => {
          const f = document.querySelector('[role="tab"]:not(.is-raised) .tab-face');
          f?.style.setProperty("opacity", "0.68", "important");
        });
        await page.waitForTimeout(120);
        const doubleDim = await painted(page, '[role="tab"]:not(.is-raised) .tab-word');
        await page.evaluate(() => {
          const f = document.querySelector('[role="tab"]:not(.is-raised) .tab-face');
          f?.style.removeProperty("opacity");
        });

        // ── THE AUTHORED RING, painted: focus the second tab, read the band outside its face ─
        // The band around the focused face must hold the RING and the card's ground and nothing
        // else — the tabs touch at 4px seams, so a neighbour's own word would otherwise be the
        // extreme pixel in the crop. The siblings are hidden for the read alone.
        await page.evaluate(() => {
          const tabs = [...document.querySelectorAll('[role="tab"]')];
          tabs.forEach((t, i) => {
            if (i !== 1) t.style.setProperty("visibility", "hidden", "important");
          });
          const t = tabs[1];
          t.focus();
          t.classList.add("proto-force-focus");
        });
        await page.addStyleTag({
          content: ".proto-force-focus .tab-face{outline:2px solid var(--ring-ink);outline-offset:4px}",
        });
        await page.waitForTimeout(150);
        const ringBand = await (async () => {
          const face = page.locator(".proto-force-focus .tab-face").first();
          if (!(await face.count())) return null;
          const b = await face.boundingBox();
          if (!b) return null;
          const pad = 8;
          const clip = {
            x: Math.max(0, b.x - pad),
            y: Math.max(0, b.y - pad),
            width: b.width + 2 * pad,
            height: b.height + 2 * pad,
          };
          const buf = await page.screenshot({ clip });
          const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
          const ch = info.channels;
          // band = pixels OUTSIDE the face rect (the ring rides at offset 4 on the card ground)
          const inner = { x0: pad, y0: pad, x1: pad + b.width, y1: pad + b.height };
          const hist = new Map();
          let extreme = null;
          const ground = [];
          for (let y = 0; y < info.height; y++) {
            for (let x = 0; x < info.width; x++) {
              if (x > inner.x0 && x < inner.x1 && y > inner.y0 && y < inner.y1) continue;
              const i = (y * info.width + x) * ch;
              const px = [data[i], data[i + 1], data[i + 2]];
              const k = px.join(",");
              hist.set(k, (hist.get(k) || 0) + 1);
              ground.push(px);
            }
          }
          if (!hist.size) return null;
          const modal = [...hist.entries()].sort((a, b2) => b2[1] - a[1])[0][0].split(",").map(Number);
          const gL = lum(...modal);
          for (const px of ground) {
            const L = lum(...px);
            if (!extreme || Math.abs(L - gL) > Math.abs(extreme.L - gL)) extreme = { L, px };
          }
          return {
            ground: `rgb(${modal.join(",")})`,
            ring: `rgb(${extreme.px.join(",")})`,
            ratio: ratio(gL, extreme.L),
          };
        })();
        await page.evaluate(() => {
          document.querySelector(".proto-force-focus")?.classList.remove("proto-force-focus");
          for (const t of document.querySelectorAll('[role="tab"]')) t.style.removeProperty("visibility");
        });

        // ── the AX tree the strip publishes ────────────────────────────────────────────────
        const snap = await page.locator('[role="tablist"]').first().ariaSnapshot().catch(() => null);

        // ── KEYBOARD: arrow moves AND activates; Home/End ──────────────────────────────────
        const keys = await (async () => {
          await page.locator('[role="tab"]').first().focus();
          const seen = [];
          for (const k of ["ArrowRight", "ArrowRight", "End", "Home", "ArrowLeft"]) {
            await page.keyboard.press(k);
            await page.waitForTimeout(80);
            seen.push(
              await page.evaluate(() => {
                const sel = document.querySelector('[role="tab"][aria-selected="true"]');
                const act = document.activeElement;
                return {
                  selected: sel?.innerText.replace(/\s+/g, " ").trim(),
                  focusIsSelected: sel === act,
                  zeros: document.querySelectorAll('[role="tab"][tabindex="0"]').length,
                };
              }),
            );
          }
          return seen;
        })();

        out[key] = { shut, census: c, negH, negW, contrast: { quiet, raised, doubleDim, ring: ringBand }, ariaSnapshot: snap, keys };
        const worstFit = c.perTab.filter((p) => !p.fits);
        console.log(
          `[${key}] fit ${c.perTab.map((p) => `${p.tab}:${p.scrollHeight}/${p.clientHeight}`).join(" ")}` +
            ` ${worstFit.length ? "OVER" : "FIT×" + c.perTab.length}` +
            ` | tabs ${c.tabs.map((t) => `${t.w}x${t.h}`).join(",")} spend ${c.stripSpend}/${c.strip?.w}` +
            ` | neg ${negH}/${negW} | quiet ${quiet?.ratio} raised ${raised?.ratio} dbl ${doubleDim?.ratio} ring ${ringBand?.ratio}` +
            ` | hid ${c.hiddenFocusable}/${c.hiddenTabbables} | I2 ${c.i2.worstCoverage} | edge0tap ${shut.zeroTapTools} | seam ${c.seam}`,
        );
      } catch (e) {
        out[key] = { error: String(e).slice(0, 400) };
        console.log(`[${key}] ERROR ${String(e).slice(0, 200)}`);
      }
      await browser?.close();
    }
  }
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("\nbanked " + OUT);
