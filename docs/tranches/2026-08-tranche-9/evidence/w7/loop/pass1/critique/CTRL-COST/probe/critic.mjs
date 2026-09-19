#!/usr/bin/env node
/**
 * CTRL-COST · PASS-1 CRITIC PROBE — independent of the prototype's instruments, aimed at what
 * the prototype did NOT measure.
 *
 *   A · THE BERTH. T9-W2 §2.5 reserved 3.5rem of card foot because a hover tape inside a
 *       scrollport covers a control at SOME scroll offset (measured then: 16.9 / 57.4 / 23.6 /
 *       17.4 / 68.4%). This family deletes that reservation and asserts the sticky band head's
 *       right slack is the replacement. So: hover every tape-bearing control and every caption,
 *       at scrollTop 0 AND at the bottom, and measure what the tape actually lands on.
 *   B · THE ARMED FACE FROM THE AT'S SIDE. `no` is drawn and `aria-hidden`. Is the second
 *       answer exposed? Is the arm announced? Does Escape disarm? Does a Tab away disarm?
 *   C · THE TELEPORT'S FOCUS. `.play-controls` changes DOM parents when the sheet rises.
 *   D · π BEYOND THE CARD. The ROW-3 deletion re-ranks every `.section-heading` below 768 —
 *       the gallery's staging band included. Same page, both trees.
 *   E · RE-RUN OF THEIRS, independently coded: G6 (the arm moves nothing) and G8 (heights).
 *
 * Bases are pinned on the command line, never defaulted — the prototype banked the trap of a
 * spec that read another lane's server through an env default.
 *   node critic.mjs <protoBase> <headBase> <out.json>
 */
import fs from "node:fs";
import { chromium, webkit } from "playwright";

const [PROTO, HEAD, OUT] = process.argv.slice(2);
if (!PROTO || !HEAD || !OUT) throw new Error("usage: critic.mjs <protoBase> <headBase> <out>");

const out = {
  bases: { PROTO, HEAD },
  identity: {},
  berth: {},
  armed: {},
  focus: {},
  gallery: {},
  reflow: {},
};

async function load(page, { open = false } = {}) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 45000 });
  await page.waitForTimeout(1400);
  const shut = await page.evaluate(() =>
    document.documentElement.classList.contains("drawer-closed"),
  );
  if (open && shut) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
}

const identity = () => ({
  bands: Array.from(document.querySelectorAll(".cost-band .section-heading")).map((h) =>
    h.innerText.trim(),
  ),
  hasActionBar: !!document.querySelector(".action-bar"),
  hasZoneRowLabel: !!document.querySelector(".zone-row-label"),
  actFaces: document.querySelectorAll(".act-face").length,
  filters: document.querySelectorAll("filter").length,
});

// A — hover the element carrying `data-critic-hover`, then read every visible tape.
const berthRead = () => {
  const card = document.querySelector(".controls-card");
  const cardBox = card.getBoundingClientRect();
  const visible = (el) => {
    const cs = getComputedStyle(el);
    return cs.visibility !== "hidden" && +cs.opacity > 0.5 && cs.display !== "none";
  };
  const hovered = document.querySelector("[data-critic-hover]");
  const hb = hovered ? hovered.getBoundingClientRect() : null;
  const controls = Array.from(
    card.querySelectorAll("button, [role='button'], input, a, .ctrl-btn"),
  ).filter((c) => c.getBoundingClientRect().width > 0);
  const tapes = Array.from(document.querySelectorAll(".washi-label")).filter(visible);
  return {
    hoveredBox: hb ? [+hb.x.toFixed(1), +hb.y.toFixed(1), +hb.width.toFixed(1)] : null,
    tapes: tapes.map((t) => {
      const b = t.getBoundingClientRect();
      let worst = { what: null, frac: 0 };
      for (const c of controls) {
        if (hovered && (c === hovered || c.contains(hovered) || hovered.contains(c))) continue;
        const r = c.getBoundingClientRect();
        const ix = Math.max(0, Math.min(b.right, r.right) - Math.max(b.left, r.left));
        const iy = Math.max(0, Math.min(b.bottom, r.bottom) - Math.max(b.top, r.top));
        const frac = (ix * iy) / Math.max(1, r.width * r.height);
        if (frac > worst.frac)
          worst = {
            what: (c.getAttribute("aria-label") || c.className || c.tagName)
              .toString()
              .slice(0, 44),
            frac: +frac.toFixed(3),
          };
      }
      return {
        text: t.innerText.trim().slice(0, 46),
        box: [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)],
        inPort: b.bottom > cardBox.top && b.top < cardBox.bottom,
        clippedAbove: +Math.max(0, cardBox.top - b.top).toFixed(1),
        dyFromHovered: hb ? +(b.top - hb.top).toFixed(1) : null,
        worstCover: worst,
      };
    }),
  };
};

const armedRead = () => {
  const btn = document.querySelector(".deal-btn");
  const answer = btn?.querySelector(".act-answer");
  const cs = answer ? getComputedStyle(answer) : null;
  const r = answer ? answer.getBoundingClientRect() : null;
  const mid = r && r.width ? document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) : null;
  return {
    aria: btn?.getAttribute("aria-label"),
    answerVisible: cs?.visibility === "visible",
    answerAriaHidden: !!answer?.closest("[aria-hidden='true']"),
    answerHitTestable: !!mid && !!btn && btn.contains(mid),
    answerBox: r ? [+r.width.toFixed(1), +r.height.toFixed(1)] : null,
    liveRegions: Array.from(document.querySelectorAll("[aria-live]"))
      .map((n) => (n.innerText || "").trim())
      .filter(Boolean),
    shownWords: Array.from(btn?.querySelectorAll(".act-word") ?? [])
      .filter((w) => getComputedStyle(w).visibility === "visible")
      .map((w) => w.innerText.trim()),
  };
};

const rects = () => {
  const r = (s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)];
  };
  const card = document.querySelector(".controls-card");
  return {
    band: r(".cost-band:has(.deal-btn)"),
    deal: r(".deal-btn"),
    clear: r(".clear-btn"),
    scrollH: card.scrollHeight,
    clientH: card.clientHeight,
  };
};
const d4 = (a, b) => (a && b ? a.map((v, i) => +(b[i] - v).toFixed(2)) : null);

const galleryRead = () => ({
  headings: Array.from(document.querySelectorAll(".section-heading")).map((h) => {
    const b = h.getBoundingClientRect();
    return {
      text: h.innerText.trim().slice(0, 24),
      px: +getComputedStyle(h).fontSize.replace("px", ""),
      family: getComputedStyle(h).fontFamily.split(",")[0].replace(/['"]/g, ""),
      box: [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)],
    };
  }),
  docHeight: document.documentElement.scrollHeight,
  filters: document.querySelectorAll("filter").length,
});

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();

  // ── A · THE BERTH (desk fine, proto) ───────────────────────────────────────────────────
  {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 1,
      baseURL: PROTO,
    });
    const page = await ctx.newPage();
    await load(page);
    out.identity[`proto-desk-${engine}`] = await page.evaluate(identity);
    const targets = [
      ["fill", page.locator("button[aria-label^='Fill in every cell']")],
      ["solve", page.locator("button[aria-label='Solve puzzle']")],
      ["invite/share", page.locator(".band-acts button").last()],
      ["caption-marks", page.locator(".band-row-caption", { hasText: /^marks$/ })],
      ["caption-what-fits", page.locator(".band-row-caption", { hasText: /^what fits$/ })],
      ["caption-checking", page.locator(".band-row-caption", { hasText: /^checking$/ })],
    ];
    for (const at of ["top", "bottom"]) {
      await page.evaluate((where) => {
        const c = document.querySelector(".controls-card");
        c.scrollTop = where === "top" ? 0 : c.scrollHeight;
      }, at);
      await page.waitForTimeout(400);
      for (const [name, loc] of targets) {
        const key = `${engine}-${at}-${name}`;
        const one = loc.first();
        if (!(await one.count())) {
          out.berth[key] = { missing: true };
          continue;
        }
        await one.evaluate((el) => el.setAttribute("data-critic-hover", "1"));
        await one.hover({ force: true }).catch(() => {});
        await page.waitForTimeout(500);
        out.berth[key] = await page.evaluate(berthRead);
        await one.evaluate((el) => el.removeAttribute("data-critic-hover"));
        await page.mouse.move(3, 3);
        await page.waitForTimeout(250);
      }
    }
    await ctx.close();
  }

  // ── B + C + E · the dock: the armed face, the teleport's focus, the reflow, the heights ──
  {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: engine === "chromium",
      deviceScaleFactor: 1,
      baseURL: PROTO,
    });
    const page = await ctx.newPage();
    await load(page, { open: false });

    // C — focus sits on `undo` in the ribbon; the sheet rises and the node changes parents.
    const before = await page.evaluate(() => {
      const u = document.querySelector('button[aria-label="Undo last move"]');
      if (!u) return { found: false };
      u.focus();
      return {
        found: true,
        home: u.closest(".fold-tools") ? "ribbon" : "card",
        active: document.activeElement?.getAttribute("aria-label") ?? document.activeElement?.tagName,
      };
    });
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(1100);
    const after = await page.evaluate(() => {
      const u = document.querySelector('button[aria-label="Undo last move"]');
      const a = document.activeElement;
      return {
        undoHome: u
          ? u.closest(".cost-band")?.querySelector(".section-heading")?.innerText.trim() ??
            (u.closest(".fold-tools") ? "ribbon" : "?")
          : "gone",
        active: a?.getAttribute?.("aria-label") ?? a?.className ?? a?.tagName,
        activeTag: a?.tagName,
        ribbonChildren: document.querySelectorAll("#fold-tools button").length,
      };
    });
    out.focus[`dock-${engine}`] = { before, after };

    // dirty the board so tier 3 asks
    await page.locator("button[aria-label^='Fill in every cell']").first().click({ force: true });
    await page.waitForTimeout(1700);

    const r0 = await page.evaluate(rects);
    await page.locator(".deal-btn").first().scrollIntoViewIfNeeded().catch(() => {});
    await page.waitForTimeout(300);
    const rBefore = await page.evaluate(rects);
    await page.locator(".deal-btn").first().click({ force: true });
    await page.waitForTimeout(350);
    const armed = await page.evaluate(armedRead);
    const rAfter = await page.evaluate(rects);

    // does Escape disarm? does a Tab away disarm?
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    const afterEsc = await page.evaluate(armedRead);
    let afterTab = null;
    if (afterEsc.shownWords.join() === "sure?") {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(250);
      afterTab = await page.evaluate(armedRead);
    }

    out.armed[`dock-${engine}`] = { armed, afterEsc, afterTab };
    out.reflow[`dock-${engine}`] = {
      bandDelta: d4(rBefore.band, rAfter.band),
      dealDelta: d4(rBefore.deal, rAfter.deal),
      clearDelta: d4(rBefore.clear, rAfter.clear),
      scrollHDelta: rAfter.scrollH - rBefore.scrollH,
      scrollH: rAfter.scrollH,
      clientH: rAfter.clientH,
      scrollHAtRest: r0.scrollH,
    };
    await ctx.close();
  }

  // ── D · the gallery, both trees, 390 and 1280 ──────────────────────────────────────────
  for (const [tree, base] of [
    ["proto", PROTO],
    ["head", HEAD],
  ]) {
    for (const [cell, w, h] of [
      ["390x844", 390, 844],
      ["1280x800", 1280, 800],
    ]) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: h },
        hasTouch: w < 800,
        isMobile: w < 800 && engine === "chromium",
        deviceScaleFactor: 1,
        baseURL: base,
      });
      const page = await ctx.newPage();
      // the GALLERY is the root route with no game selected
      await page.goto("./");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 45000 });
      await page.waitForTimeout(1600);
      out.gallery[`${tree}-${cell}-${engine}`] = await page.evaluate(galleryRead);
      await ctx.close();
    }
  }

  await browser.close();
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("wrote", OUT);
