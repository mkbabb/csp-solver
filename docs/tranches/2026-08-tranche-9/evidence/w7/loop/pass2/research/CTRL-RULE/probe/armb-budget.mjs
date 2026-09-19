// T9-W7 pass2 · CTRL-RULE research — THE ARM (b) WIDTH BUDGET, measured on HEAD.
// Read-only: every reading is taken on the shipped tree at 127.0.0.1:4231. Nothing under
// src/ is touched; the probe injects detached measuring nodes into the live document and
// removes them. `node armb-budget.mjs`.
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "readings");
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
  { name: "land-900x500", w: 900, h: 500, mobile: true },
];

// The seven names arm (a) shipped, plus the two HEAD strings they replaced.
const NAMES = [
  "size",
  "level",
  "new game",
  "marks",
  "what fits",
  "checking",
  "players",
  "candidates",
  "pencils",
];

async function open(engine, cell) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    isMobile: cell.mobile && engine === "chromium" ? true : undefined,
    hasTouch: cell.mobile,
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
  const shut = await page.evaluate(() =>
    document.documentElement.classList.contains("drawer-closed"),
  );
  if (shut) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
  return { browser, page };
}

const READ = (names) => {
  const n2 = (v) => +(+v).toFixed(2);
  const cs = (el) => getComputedStyle(el);
  const card = document.querySelector(".controls-card");
  const root = document.documentElement;
  const rs = cs(root);

  // ── tokens the budget is written in ───────────────────────────────────────
  const tok = {};
  for (const k of [
    "--type-group-title",
    "--type-heading",
    "--type-subheading",
    "--type-option",
    "--type-small",
    "--type-tag",
    "--tap-floor",
    "--type-tracking-wide",
    "--type-leading-heading",
  ])
    tok[k] = rs.getPropertyValue(k).trim();

  // ── the measuring rig: one detached span wearing .section-heading's exact tuple ──
  const live = card.querySelector(".section-heading");
  const lcs = live ? cs(live) : null;
  const probe = document.createElement("span");
  probe.setAttribute("data-ctrl-rule-probe", "1");
  probe.style.cssText =
    "position:absolute;left:-9999px;top:0;white-space:nowrap;visibility:hidden;padding:0;margin:0;";
  if (lcs) {
    probe.style.fontFamily = lcs.fontFamily;
    probe.style.fontWeight = lcs.fontWeight;
    probe.style.textTransform = lcs.textTransform;
    probe.style.letterSpacing = lcs.letterSpacing;
    probe.style.fontVariationSettings = lcs.fontVariationSettings;
    probe.style.lineHeight = lcs.lineHeight;
  }
  document.body.appendChild(probe);

  const inkAt = (text, sizePx) => {
    probe.style.fontSize = sizePx + "px";
    probe.textContent = text;
    const r = document.createRange();
    r.selectNodeContents(probe);
    return n2(r.getBoundingClientRect().width);
  };

  // φ (25.888) is arm (a)'s one rung everywhere; √φ (20.352) is HEAD's sub-768 rung.
  const PHI = parseFloat(rs.getPropertyValue("--type-heading")) * 16;
  const ROOTPHI = parseFloat(rs.getPropertyValue("--type-subheading")) * 16;
  const phiPx = n2(PHI);
  const rootPhiPx = n2(ROOTPHI);

  const nameInk = names.map((t) => {
    const words = t.split(" ");
    return {
      name: t,
      words,
      phi: inkAt(t, PHI),
      rootPhi: inkAt(t, ROOTPHI),
      // the longest UNBREAKABLE word — the true floor of a margin column
      longestWordPhi: Math.max(...words.map((w) => inkAt(w, PHI))),
      longestWordRootPhi: Math.max(...words.map((w) => inkAt(w, ROOTPHI))),
      longestWord: words.reduce((a, b) => (a.length >= b.length ? a : b)),
    };
  });
  probe.remove();

  // ── the card's own live geometry ─────────────────────────────────────────
  const wrap = document.querySelector(".control-panel-wrap");
  const cardCS = cs(card);
  const wrapCS = wrap ? cs(wrap) : null;
  const cardBox = card.getBoundingClientRect();
  const innerWidth =
    cardBox.width -
    parseFloat(cardCS.paddingLeft) -
    parseFloat(cardCS.paddingRight) -
    (wrapCS ? parseFloat(wrapCS.paddingLeft) + parseFloat(wrapCS.paddingRight) : 0);

  // ── every option row: intrinsic chip geometry at HEAD's shipped rung ──────
  const rows = [...card.querySelectorAll(".options-row")].map((r) => {
    const rcs = cs(r);
    const chips = [...r.querySelectorAll(".ctrl-btn")].map((b) => {
      const bcs = cs(b);
      const bb = b.getBoundingClientRect();
      return {
        text: b.innerText.replace(/\s+/g, " ").trim(),
        w: n2(bb.width),
        h: n2(bb.height),
        fontSize: n2(parseFloat(bcs.fontSize)),
        padL: n2(parseFloat(bcs.paddingLeft)),
        padR: n2(parseFloat(bcs.paddingRight)),
        minW: bcs.minWidth,
        family: bcs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      };
    });
    const gap = n2(parseFloat(rcs.columnGap) || parseFloat(rcs.gap) || 0);
    const natural = chips.reduce((s, c) => s + c.w, 0) + gap * Math.max(0, chips.length - 1);
    return {
      box: { w: n2(r.getBoundingClientRect().width), h: n2(r.getBoundingClientRect().height) },
      scrollW: n2(r.scrollWidth),
      gap,
      wrap: rcs.flexWrap,
      justify: rcs.justifyContent,
      count: chips.length,
      naturalRowW: n2(natural),
      chips,
    };
  });

  // ── group heights: what a margin name gets for free ───────────────────────
  const groups = [...card.querySelectorAll(".tray-well")].map((g) => {
    const b = g.getBoundingClientRect();
    const gcs = cs(g);
    return {
      cls: g.className,
      h: n2(b.height),
      w: n2(b.width),
      padT: n2(parseFloat(gcs.paddingTop)),
      padB: n2(parseFloat(gcs.paddingBottom)),
      padL: n2(parseFloat(gcs.paddingLeft)),
      tag: g.querySelector(".washi-tag")?.innerText?.trim() ?? null,
      rows: g.querySelectorAll(".options-row").length,
    };
  });

  // ── the 19: every focusable control in the card and its authored ring ────
  const FOCUSABLE =
    "button, [role=option], a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
  const controls = [...card.querySelectorAll(FOCUSABLE)].map((el) => {
    const c = cs(el);
    const b = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: el.className.toString().split(/\s+/).slice(0, 3).join(" "),
      text: (el.innerText || el.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 24),
      w: n2(b.width),
      h: n2(b.height),
      outlineWidth: c.outlineWidth,
      outlineStyle: c.outlineStyle,
      outlineColor: c.outlineColor,
      authored: c.outlineStyle !== "none" && c.outlineWidth !== "0px",
      sub44: n2(b.width) < 44 || n2(b.height) < 44,
    };
  });

  // ── the card's height seal ───────────────────────────────────────────────
  const seal = {
    scrollH: n2(card.scrollHeight),
    clientH: n2(card.clientHeight),
    belowFold: n2(100 * (1 - card.clientHeight / card.scrollHeight)),
    cardBox: { x: n2(cardBox.x), y: n2(cardBox.y), w: n2(cardBox.width), h: n2(cardBox.height) },
    innerWidth: n2(innerWidth),
    padL: n2(parseFloat(cardCS.paddingLeft)),
    padR: n2(parseFloat(cardCS.paddingRight)),
    wrapPadL: wrapCS ? n2(parseFloat(wrapCS.paddingLeft)) : null,
    wrapPadR: wrapCS ? n2(parseFloat(wrapCS.paddingRight)) : null,
  };

  // ── the heading census (HEAD's three voices), for the pi baseline ─────────
  const voices = new Set();
  const heads = [];
  for (const sel of [".section-heading", ".washi-tag", ".zone-row-label"])
    for (const el of card.querySelectorAll(sel)) {
      const c = cs(el);
      const v = [
        c.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
        n2(parseFloat(c.fontSize)),
        c.fontWeight,
        c.textTransform,
      ].join(" · ");
      voices.add(v);
      heads.push({
        sel,
        text: el.innerText.replace(/\s+/g, " ").trim(),
        voice: v,
        padL: c.paddingLeft,
        align: c.textAlign,
        rank: el.closest("h1,h2,h3,h4,h5,h6")?.tagName ?? "—",
      });
    }

  return { tok, phiPx, rootPhiPx, nameInk, rows, groups, controls, seal, heads, voices: [...voices] };
};

// ── the gallery's own arm (b): StagingBand, the estate's shipped margin column ──
const GALLERY = () => {
  const n2 = (v) => +(+v).toFixed(2);
  const cs = (el) => getComputedStyle(el);
  const band = document.querySelector(".staging-band");
  if (!band) return { present: false };
  const axes = [...band.querySelectorAll(".staging-axis")].map((a) => {
    const acs = cs(a);
    const lab = a.querySelector(".staging-axis-label");
    const lcs = lab ? cs(lab) : null;
    const lb = lab ? lab.getBoundingClientRect() : null;
    const r = document.createRange();
    let ink = null;
    if (lab) {
      r.selectNodeContents(lab);
      ink = n2(r.getBoundingClientRect().width);
    }
    const row = a.querySelector(".options-row");
    const chips = row
      ? [...row.querySelectorAll(".ctrl-btn")].map((b) => {
          const bcs = cs(b);
          const bb = b.getBoundingClientRect();
          return {
            text: b.innerText.trim(),
            w: n2(bb.width),
            h: n2(bb.height),
            fontSize: n2(parseFloat(bcs.fontSize)),
            padL: n2(parseFloat(bcs.paddingLeft)),
          };
        })
      : [];
    return {
      cols: acs.gridTemplateColumns,
      colGap: acs.columnGap,
      label: lab
        ? {
            text: lab.innerText.trim(),
            trackW: n2(lb.width),
            ink,
            fontSize: n2(parseFloat(lcs.fontSize)),
            family: lcs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
            padL: lcs.paddingLeft,
            align: lcs.textAlign,
            glyphX: n2(ink !== null ? r.getBoundingClientRect().x : lb.x),
          }
        : null,
      chips,
      rowW: row ? n2(row.getBoundingClientRect().width) : null,
      rowScrollW: row ? n2(row.scrollWidth) : null,
      chipRatio:
        lab && chips.length
          ? n2(parseFloat(cs(lab).fontSize) / chips[0].fontSize)
          : null,
    };
  });
  const bcs = cs(band);
  return {
    present: true,
    bandW: n2(band.getBoundingClientRect().width),
    labelCol: bcs.getPropertyValue("--staging-label-col").trim(),
    verbsCol: bcs.getPropertyValue("--staging-verbs-col").trim(),
    axes,
  };
};

const out = {};
for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const { browser, page } = await open(engine, cell);
    const key = `${cell.name}/${engine}`;
    out[key] = await page.evaluate(READ, NAMES);
    // the gallery, same page, same server: open it with the wordmark
    try {
      await page.keyboard.press("g");
      await page.waitForTimeout(900);
      out[key].gallery = await page.evaluate(GALLERY);
    } catch (e) {
      out[key].gallery = { present: false, err: String(e).slice(0, 120) };
    }
    await browser.close();
    console.log(
      key,
      "seal",
      out[key].seal.scrollH + "/" + out[key].seal.clientH,
      "inner",
      out[key].seal.innerWidth,
      "gallery",
      out[key].gallery?.present ? out[key].gallery.bandW : "—",
    );
  }
}
writeFileSync(join(OUT, "armb-budget.json"), JSON.stringify(out, null, 1));
console.log("banked readings/armb-budget.json");
