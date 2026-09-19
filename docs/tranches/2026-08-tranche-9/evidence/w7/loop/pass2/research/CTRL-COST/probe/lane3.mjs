// T9-W7 pass 2 · CTRL-COST research probe 3 — the rows probe 2 could not close honestly.
//   K   the keyboard dialogue, TIMESTAMPED (probe 2's second-Enter read was confounded by the
//       4,000ms window: every reading below carries its own elapsed-ms since the arm)
//   O   the pinned head's OCCLUSION PREDICATE (graft §3.4): area AND `elementFromPoint`
//   N   the band names' INTRINSIC widths (the head's true right slack; `flex: 1 1 auto` makes
//       the measured slack 0 today)
//   B   the 4% ground arm read with a PARSEABLE colour — probe 2's `color-mix` arms serialized
//       as `oklab(...)`, which the composite reader cannot parse, so it silently read BARE CARD
//   F   the `--fold-tools-h` ratchet, demonstrated
//   R   I3′ under a POPULATED roster (the gate cannot fail at five states today)
//   S   the seam: the case top against the wordmark's foot at three widths
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4235/";
const OUT = new URL("../readings/lane3.json", import.meta.url);

const HELPERS = () => {
  window.__parse = (c) => {
    let m = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/.exec(c);
    if (m) return [+m[1] * 255, +m[2] * 255, +m[3] * 255, m[4] === undefined ? 1 : +m[4]];
    m = /^rgba?\(([^)]+)\)$/.exec(c);
    if (m) {
      const p = m[1].split(/[\s,\/]+/).filter(Boolean).map(Number);
      return [p[0], p[1], p[2], p[3] === undefined ? 1 : p[3]];
    }
    return null;
  };
  window.__ground = (el) => {
    const stack = [];
    let n = el;
    while (n && n !== document.documentElement) {
      const cs = getComputedStyle(n);
      const bg = window.__parse(cs.backgroundColor);
      const op = parseFloat(cs.opacity);
      stack.push({ bg, op, unparsed: bg === null && cs.backgroundColor !== "rgba(0, 0, 0, 0)" ? cs.backgroundColor : null });
      if (bg && bg[3] === 1 && op === 1) break;
      n = n.parentElement;
    }
    let out = [255, 255, 255];
    const blind = stack.filter((s) => s.unparsed).map((s) => s.unparsed);
    for (let i = stack.length - 1; i >= 0; i--) {
      const { bg, op } = stack[i];
      if (bg && bg[3] > 0) { const a = bg[3]; out = [0, 1, 2].map((k) => bg[k] * a + out[k] * (1 - a)); }
      if (op < 1) out = [0, 1, 2].map((k) => out[k] * op + 255 * (1 - op));
    }
    return { rgb: out, blind };
  };
  window.__lum = (rgb) => { const f = (x) => { const v = x / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]); };
  window.__ratio = (a, b) => { const [x, y] = [window.__lum(a), window.__lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
  window.__inkOn = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const ink = window.__parse(cs.color);
    const g = window.__ground(el);
    let op = 1, n = el;
    while (n && n !== document.documentElement) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
    const a = (ink[3] ?? 1) * op;
    const painted = [0, 1, 2].map((k) => ink[k] * a + g.rgb[k] * (1 - a));
    return { ratio: window.__ratio(painted, g.rgb), ground: g.rgb.map((v) => +v.toFixed(1)), groundBlindTo: g.blind };
  };
  window.__board = () => [...document.querySelectorAll(".cell-native-input")].map((i) => i.value || "_").join("");
  window.__r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)); };
  window.__armed = () => !!document.querySelector(".deal-btn .act-word.is-armed.is-shown");
};

const out = { base: BASE, when: new Date().toISOString(), cells: {} };
const settle = (p, ms) => p.waitForTimeout(ms);

async function open(engine, BT, viewport, scheme = "light", coarse = true, sheet = true) {
  const browser = await BT.launch();
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: coarse, isMobile: coarse && engine === "chromium" ? true : undefined, colorScheme: scheme });
  const page = await ctx.newPage();
  await page.addInitScript(`try{localStorage.setItem("sudoku-color-scheme","${scheme}")}catch{}`);
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await settle(page, 1200);
  if (sheet) { await page.locator(".drawer-tab").first().click({ force: true }); await settle(page, 1200); }
  await page.evaluate(HELPERS);
  return { browser, page };
}

for (const engine of ["chromium", "webkit"]) {
  const BT = engine === "webkit" ? webkit : chromium;
  const rec = {};

  // ── dock 390×844 coarse ────────────────────────────────────────────────────────────────
  {
    const { browser, page } = await open(engine, BT, { width: 390, height: 844 });

    // N · the names' intrinsic widths → the head's real right slack
    rec.names = await page.evaluate(() => {
      const res = [];
      for (const h of document.querySelectorAll(".cost-band-head > h2")) {
        const head = h.parentElement;
        const prev = h.style.flex;
        h.style.flex = "0 1 auto";
        const nr = h.getBoundingClientRect(), hr = head.getBoundingClientRect();
        res.push({ name: h.textContent.trim(), intrinsicW: +nr.width.toFixed(2), headW: +hr.width.toFixed(2), slack: +(hr.width - nr.width).toFixed(2), headH: +hr.height.toFixed(2) });
        h.style.flex = prev;
      }
      return res;
    });

    // O · the occlusion predicate on the pinned head
    rec.occlusion = await page.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const max = card.scrollHeight - card.clientHeight;
      const states = [];
      for (const f of [0, 0.5, 1]) {
        card.scrollTop = max * f;
        const heads = [...document.querySelectorAll(".cost-band-head")];
        const hits = [];
        for (const c of card.querySelectorAll("button, .ctrl-btn")) {
          const cb = c.getBoundingClientRect();
          if (cb.width === 0) continue;
          let cov = 0;
          for (const h of heads) {
            const hb = h.getBoundingClientRect();
            const w = Math.max(0, Math.min(hb.right, cb.right) - Math.max(hb.left, cb.left));
            const ht = Math.max(0, Math.min(hb.bottom, cb.bottom) - Math.max(hb.top, cb.top));
            cov += w * ht;
          }
          if (cov <= 0) continue;
          const cx = cb.left + cb.width / 2, cy = cb.top + cb.height / 2;
          const top = document.elementFromPoint(cx, cy);
          hits.push({
            control: (c.getAttribute("aria-label") || c.textContent.trim()).slice(0, 28),
            box: [+cb.width.toFixed(1), +cb.height.toFixed(1)],
            coveredPx2: +cov.toFixed(1),
            coveredFrac: +(cov / (cb.width * cb.height)).toFixed(3),
            centreHitsOwnControl: !!(top && (top === c || c.contains(top))),
            centreHits: top ? (top.className || top.tagName).toString().slice(0, 40) : null,
          });
        }
        states.push({ f, scrollTop: +card.scrollTop.toFixed(1), hits });
      }
      card.scrollTop = 0;
      return states;
    });

    // K · the keyboard dialogue, timestamped
    rec.keyboard = await (async () => {
      const r = { steps: [] };
      const fill = page.locator(".controls-card button", { hasText: /^fill$/ }).first();
      if (await fill.count()) { await fill.click({ force: true }); await settle(page, 1500); }
      r.board0 = await page.evaluate(() => window.__board());
      await page.evaluate(() => { const b = document.querySelector(".deal-btn"); b.scrollIntoView({ block: "center" }); b.focus(); window.__t0 = 0; });
      await settle(page, 200);
      // 1 · the FIRST Enter
      await page.evaluate(() => { window.__t0 = performance.now(); });
      await page.keyboard.press("Enter");
      r.steps.push(await page.evaluate(() => ({ step: "enter#1", armed: window.__armed(), sinceArm: +(performance.now() - window.__t0).toFixed(0) })));
      // 2 · Escape, immediately
      await page.keyboard.press("Escape");
      r.steps.push(await page.evaluate(() => ({ step: "escape", armed: window.__armed(), sinceArm: +(performance.now() - window.__t0).toFixed(0) })));
      // 3 · the SECOND Enter, inside the window
      await page.keyboard.press("Enter");
      r.steps.push(await page.evaluate(() => ({ step: "enter#2", armed: window.__armed(), sinceArm: +(performance.now() - window.__t0).toFixed(0) })));
      // did the board change? poll (a deal is async)
      r.dealt = await page.evaluate(async (b0) => {
        const t = performance.now();
        while (performance.now() - t < 8000) { if (window.__board() !== b0) return { changed: true, ms: +(performance.now() - t).toFixed(0) }; await new Promise((s) => setTimeout(s, 100)); }
        return { changed: false, ms: 8000 };
      }, r.board0);
      // 4 · a fresh arm, then Tab away
      await settle(page, 600);
      const fill2 = page.locator(".controls-card button", { hasText: /^fill$/ }).first();
      if (await fill2.count()) { await fill2.click({ force: true }); await settle(page, 1200); }
      await page.evaluate(() => { const b = document.querySelector(".deal-btn"); b.scrollIntoView({ block: "center" }); b.focus(); });
      await settle(page, 150);
      await page.evaluate(() => { window.__t0 = performance.now(); });
      await page.keyboard.press("Enter");
      const armedAgain = await page.evaluate(() => ({ armed: window.__armed(), sinceArm: +(performance.now() - window.__t0).toFixed(0) }));
      await page.keyboard.press("Tab");
      const afterTab = await page.evaluate(() => ({ armed: window.__armed(), sinceArm: +(performance.now() - window.__t0).toFixed(0), focus: document.activeElement?.getAttribute("aria-label") || document.activeElement?.className?.toString().slice(0, 40) || null }));
      r.steps.push({ step: "enter#1(again)", ...armedAgain }, { step: "tab-away", ...afterTab });
      // 5 · what an AT would hear at the arm
      r.spoken = await page.evaluate(() => ({
        regions: [...document.querySelectorAll("[aria-live],[role=status],[role=alert],[role=log]")].map((n) => ({ role: n.getAttribute("role") || n.getAttribute("aria-live"), text: n.textContent.trim().slice(0, 60) })),
        dealAria: document.querySelector(".deal-btn")?.getAttribute("aria-label"),
        noAriaHidden: document.querySelector(".deal-btn .act-answer")?.getAttribute("aria-hidden"),
      }));
      return r;
    })();

    // B · the 4% ground arm with a PARSEABLE colour (and the blindness the reader carries)
    rec.aa = await (async () => {
      const read = () => page.evaluate(() => {
        const b = document.querySelector(".deal-btn");
        const word = [...b.querySelectorAll(".act-word")].find((w) => w.classList.contains("is-armed"));
        const no = b.querySelector(".act-answer");
        const face = b.querySelector(".act-face");
        return { asked: window.__inkOn(word), no: window.__inkOn(no), faceBg: getComputedStyle(face).backgroundColor };
      });
      // re-arm so the red word is live
      await page.evaluate(() => { const b = document.querySelector(".deal-btn"); b.scrollIntoView({ block: "center" }); });
      const arms = {};
      arms.asSpecced_8pct = await read();
      await page.addStyleTag({ id: "b4", content: ".controls-card .act-face.is-heavy{background:rgba(10,10,10,0.04)!important}" });
      arms.cureB_4pct_rgba = await read();
      await page.evaluate(() => document.getElementById("b4")?.remove());
      await page.addStyleTag({ id: "b6", content: ".controls-card .act-face.is-heavy{background:rgba(10,10,10,0.06)!important}" });
      arms.at6pct_rgba = await read();
      await page.evaluate(() => document.getElementById("b6")?.remove());
      await page.addStyleTag({ id: "b0", content: ".controls-card .act-face.is-heavy{background:rgba(0,0,0,0)!important}" });
      arms.bareCard = await read();
      await page.evaluate(() => document.getElementById("b0")?.remove());
      return arms;
    })();

    // F · the ratchet
    rec.fold = await (async () => {
      const readFold = () => page.evaluate(() => {
        const fold = document.querySelector(".fold-tools");
        if (!fold) return null;
        return { published: fold.style.getPropertyValue("--fold-tools-h"), rect: +fold.getBoundingClientRect().height.toFixed(2), minHeight: getComputedStyle(fold).minHeight };
      });
      const before = await readFold();
      // shrink the row's natural content, then force a resize pass
      await page.addStyleTag({ id: "shrink", content: ".play-controls .icon-sublabel{display:none!important} .play-controls svg{width:12px!important;height:12px!important}" });
      await page.setViewportSize({ width: 391, height: 844 });
      await settle(page, 700);
      await page.setViewportSize({ width: 390, height: 844 });
      await settle(page, 700);
      const afterShrink = await readFold();
      await page.evaluate(() => document.getElementById("shrink")?.remove());
      await page.setViewportSize({ width: 392, height: 844 });
      await settle(page, 700);
      await page.setViewportSize({ width: 390, height: 844 });
      await settle(page, 700);
      const afterRestore = await readFold();
      return { before, afterShrink, afterRestore, fallbackLiteral: "3.5rem = 56px" };
    })();

    // R · I3′ under a POPULATED roster (injected rows: a layout stress, declared as such)
    rec.rosterStress = await page.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const roster = card.querySelector(".players-roster") || card.querySelector(".cost-band:last-of-type .band-acts");
      if (!roster) return { injected: 0, note: "no roster node" };
      const made = [];
      for (let i = 0; i < 8; i++) {
        const li = document.createElement("div");
        li.className = "lane-fake-roster-row";
        li.style.cssText = "height:20px;line-height:20px;font-size:14px";
        li.textContent = `player ${i + 1} is here`;
        roster.appendChild(li);
        made.push(li);
      }
      const max = card.scrollHeight - card.clientHeight;
      const states = [];
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        card.scrollTop = max * f;
        const cr = card.getBoundingClientRect();
        const padTop = parseFloat(getComputedStyle(card).paddingTop) || 0;
        const bands = [...document.querySelectorAll(".cost-band")].map((b) => {
          const br = b.getBoundingClientRect();
          const vis = Math.max(0, Math.min(br.bottom, cr.bottom) - Math.max(br.top, cr.top));
          return { name: b.querySelector("h2").textContent.trim(), frac: +(vis / cr.height).toFixed(3) };
        });
        const pinned = [...document.querySelectorAll(".cost-band-head")].filter((h) => Math.abs(h.getBoundingClientRect().top - (cr.top + padTop)) < 2).map((h) => h.textContent.trim());
        const owner = bands.slice().sort((a, b) => b.frac - a.frac)[0];
        states.push({ f, pinned, owner: owner.name, bands, violation: pinned.length === 1 && pinned[0] !== owner.name });
      }
      card.scrollTop = 0;
      const scrollHeight = card.scrollHeight;
      for (const n of made) n.remove();
      return { injected: made.length, scrollHeightWithRoster: scrollHeight, maxScroll: +max.toFixed(1), states };
    });

    out.cells[`${engine}·dock390`] = rec;
    await browser.close();
  }

  // ── S · the seam at three widths ───────────────────────────────────────────────────────
  {
    const seam = {};
    for (const [w, h] of [[390, 844], [375, 812], [430, 932]]) {
      const { browser, page } = await open(engine, BT, { width: w, height: h });
      seam[`${w}x${h}`] = await page.evaluate(() => {
        const cs = getComputedStyle(document.querySelector(".scene-controls"));
        const caseEl = document.querySelector(".drawer-case");
        const logo = document.querySelector("svg.handwritten-logo");
        const card = document.querySelector(".controls-card");
        const cr = caseEl?.getBoundingClientRect(), lr = logo?.getBoundingClientRect();
        return {
          sheetChrome: cs.getPropertyValue("--sheet-chrome").trim(),
          caseTop: cr ? +cr.top.toFixed(2) : null,
          wordmarkFoot: lr ? +lr.bottom.toFixed(2) : null,
          seam: cr && lr ? +(cr.top - lr.bottom).toFixed(2) : null,
          cardH: card ? +card.getBoundingClientRect().height.toFixed(2) : null,
          cardScrollH: card ? card.scrollHeight : null,
          dvh: window.innerHeight,
        };
      });
      await browser.close();
    }
    out.cells[`${engine}·seam`] = seam;
  }
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("banked", OUT.pathname);
