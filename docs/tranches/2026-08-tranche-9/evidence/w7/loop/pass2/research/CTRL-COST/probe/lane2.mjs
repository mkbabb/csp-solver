// T9-W7 pass 2 · CTRL-COST research probe — the numbers a synthesizer needs before it writes
// the spec. Served tree: worktree wf_e58b4764-0fc-40 (the pass-1 diff), 127.0.0.1:4235 (the
// charter's 4233 was held when this lane opened). Both engines, dock + desk.
//
// The composite contrast reader is CTRL-TABS' critic's (pass1/critique/CTRL-TABS/crit-contrast.mjs),
// taken as the §3.6 graft: ink alpha over the effective ground with the ancestor opacity chain
// multiplied in, so the reading is engine-independent instead of a painted extreme.
//
// Traps honoured (banked in pass 1): read the board off `.cell-native-input` values, never text;
// scroll BEFORE the "before" rect; a scrollport clips at its PADDING box; settle the sheet ≥950ms.
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4235/";
const OUT = new URL("../readings/lane2.json", import.meta.url);

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
      stack.push({ bg, op });
      if (bg && bg[3] === 1 && op === 1) break;
      n = n.parentElement;
    }
    let out = [255, 255, 255];
    for (let i = stack.length - 1; i >= 0; i--) {
      const { bg, op } = stack[i];
      if (bg && bg[3] > 0) {
        const a = bg[3];
        out = [0, 1, 2].map((k) => bg[k] * a + out[k] * (1 - a));
      }
      if (op < 1) out = [0, 1, 2].map((k) => out[k] * op + 255 * (1 - op));
    }
    return out;
  };
  window.__lum = (rgb) => {
    const f = (x) => { const v = x / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  };
  window.__ratio = (a, b) => { const [x, y] = [window.__lum(a), window.__lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
  window.__inkOn = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const ink = window.__parse(cs.color);
    const ground = window.__ground(el);
    let op = 1, n = el;
    while (n && n !== document.documentElement) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
    const a = (ink[3] ?? 1) * op;
    const painted = [0, 1, 2].map((k) => ink[k] * a + ground[k] * (1 - a));
    return { color: cs.color, ground: ground.map((v) => +v.toFixed(1)), ratio: window.__ratio(painted, ground) };
  };
  window.__r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)); };
  window.__board = () => [...document.querySelectorAll(".cell-native-input")].map((i) => i.value || "_").join("");
  window.__overlap = (a, b) => {
    if (!a || !b) return 0;
    const w = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
    const h = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
    return +(w * h).toFixed(1);
  };
};

const settle = (p, ms) => p.waitForTimeout(ms);

async function cell(engine, browserType, viewport, opts) {
  const browser = await browserType.launch();
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    hasTouch: !!opts.coarse,
    isMobile: opts.coarse && engine === "chromium" ? true : undefined,
    colorScheme: opts.scheme || "light",
  });
  const page = await ctx.newPage();
  await page.addInitScript(`try{localStorage.setItem("sudoku-color-scheme","${opts.scheme || "light"}")}catch{}`);
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await settle(page, 1200);
  if (opts.openSheet) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await settle(page, 1200); // the sheet SLIDES
  }
  await page.evaluate(HELPERS);
  return { browser, ctx, page };
}

const out = { base: BASE, when: new Date().toISOString(), cells: {} };

for (const engine of ["chromium", "webkit"]) {
  const BT = engine === "webkit" ? webkit : chromium;

  // ── DOCK 390×844 coarse, light ─────────────────────────────────────────────────────────
  {
    const key = `${engine}·dock390·light`;
    const { browser, page } = await cell(engine, BT, { width: 390, height: 844 }, { coarse: true, openSheet: true, scheme: "light" });
    const rec = {};
    rec.identity = await page.evaluate(() => ({
      bands: [...document.querySelectorAll(".cost-band h2")].map((h) => h.textContent.trim()),
      actionBar: document.querySelectorAll(".action-bar").length,
      trayWell: document.querySelectorAll(".tray-well").length,
      actFaces: document.querySelectorAll(".act-face").length,
    }));

    // the heads, their slack, and the air under them
    rec.heads = await page.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const cs = getComputedStyle(card);
      const port = card.getBoundingClientRect();
      return {
        card: { rect: window.__r(card), scrollHeight: card.scrollHeight, clientHeight: card.clientHeight, padT: cs.paddingTop, padB: cs.paddingBottom },
        bands: [...document.querySelectorAll(".cost-band")].map((b) => {
          const head = b.querySelector(".cost-band-head");
          const name = b.querySelector("h2");
          const first = b.querySelector(".band-acts > *, .band-row");
          const hr = head.getBoundingClientRect(), nr = name.getBoundingClientRect();
          return {
            name: name.textContent.trim(),
            head: window.__r(head),
            headStyle: { padTop: getComputedStyle(head).paddingTop, padBottom: getComputedStyle(head).paddingBottom, marginBottom: getComputedStyle(head).marginBottom },
            nameRect: window.__r(name),
            nameFont: getComputedStyle(name).fontSize,
            rightSlackPx: +(hr.right - nr.right).toFixed(2),
            headH: +hr.height.toFixed(2),
            firstChild: first ? window.__r(first) : null,
            airUnderHead: first ? +(first.getBoundingClientRect().top - hr.bottom).toFixed(2) : null,
          };
        }),
        portTop: +port.top.toFixed(2),
      };
    });

    // the hover tape: its real box, and the box it would have one rank down
    rec.tape = await page.evaluate(() => {
      const hint = document.querySelector(".cost-band .zone-hint");
      if (!hint) return null;
      const cs = getComputedStyle(hint);
      const before = { rect: window.__r(hint), font: cs.fontSize, lh: cs.lineHeight, maxW: cs.maxWidth, pad: cs.padding, ws: cs.whiteSpace, text: hint.textContent.trim() };
      const s = document.createElement("style");
      s.id = "lane-rerank";
      s.textContent = ".controls-card .washi-label{font-size:var(--type-tag)!important;line-height:1.3!important;padding:0.02rem 0.4rem!important}";
      document.head.appendChild(s);
      const after = { rect: window.__r(hint), font: getComputedStyle(hint).fontSize };
      s.remove();
      return { asShipped: before, atTagRank: after };
    });

    // every tape in the card at BOTH ranks, against every control: the berth's real bill
    rec.tapeCensus = await page.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const tapes = [...card.querySelectorAll(".washi-label")];
      const read = () => tapes.map((t) => ({ text: t.textContent.trim().slice(0, 42), h: +t.getBoundingClientRect().height.toFixed(2), w: +t.getBoundingClientRect().width.toFixed(2) }));
      const shipped = read();
      const s = document.createElement("style");
      s.textContent = ".controls-card .washi-label{font-size:var(--type-tag)!important;line-height:1.3!important;padding:0.02rem 0.4rem!important}";
      document.head.appendChild(s);
      const tag = read();
      s.remove();
      return { shipped, atTagRank: tag };
    });

    // the fold sentinels
    rec.sentinels = await page.evaluate(() => {
      const card = document.querySelector(".controls-card");
      return {
        before: getComputedStyle(card, "::before").height,
        after: getComputedStyle(card, "::after").height,
        foldAbove: card.hasAttribute("data-fold-above"),
        foldBelow: card.hasAttribute("data-fold-below"),
      };
    });

    // the published fold band, and the ratchet
    rec.foldTools = await page.evaluate(() => {
      const fold = document.querySelector(".fold-tools");
      if (!fold) return null;
      const published = fold.style.getPropertyValue("--fold-tools-h");
      const cs = getComputedStyle(fold);
      const withMin = +fold.getBoundingClientRect().height.toFixed(2);
      const prev = fold.style.minHeight;
      fold.style.minHeight = "0px";
      const natural = +fold.getBoundingClientRect().height.toFixed(2);
      fold.style.minHeight = prev;
      const rootFont = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return { published, computedMinHeight: cs.minHeight, heightWithMin: withMin, naturalHeight: natural, fallbackLiteralPx: 3.5 * rootFont, rootFont };
    });

    // dirty the board, then the ask: keyboard, AT, and the two AA cures
    rec.ask = await (async () => {
      const r = {};
      const fill = page.locator(".controls-card button", { hasText: /^fill$/ }).first();
      if (await fill.count()) {
        await fill.click({ force: true });
        await settle(page, 1500);
      }
      r.boardAfterFill = await page.evaluate(() => window.__board());
      const deal = page.locator(".deal-btn").first();
      await deal.scrollIntoViewIfNeeded();
      await settle(page, 300);
      // press once (pointer) → armed?
      await deal.click({ force: true });
      await settle(page, 350);
      r.armedAfterFirstPress = await page.evaluate(() => {
        const b = document.querySelector(".deal-btn");
        const word = [...b.querySelectorAll(".act-word")].find((w) => w.classList.contains("is-shown"));
        const no = b.querySelector(".act-answer");
        return {
          word: word ? word.textContent.trim() : null,
          aria: b.getAttribute("aria-label"),
          noShown: no ? no.classList.contains("is-shown") : null,
          noAriaHidden: no ? no.getAttribute("aria-hidden") : null,
          noVisibility: no ? getComputedStyle(no).visibility : null,
          liveText: [...document.querySelectorAll("[aria-live], [role=status], [role=alert]")].map((n) => n.textContent.trim()).filter(Boolean),
        };
      });
      // AA on the asked word, as specced and under both cures
      const readAsked = () => page.evaluate(() => {
        const b = document.querySelector(".deal-btn");
        const word = [...b.querySelectorAll(".act-word")].find((w) => w.classList.contains("is-shown"));
        const no = b.querySelector(".act-answer");
        const face = b.querySelector(".act-face");
        return { asked: window.__inkOn(word), no: window.__inkOn(no), faceBg: getComputedStyle(face).backgroundColor };
      });
      r.aa = { asSpecced: await readAsked() };
      await page.addStyleTag({ id: "cureA", content: ".controls-card .icon-btn:has(.act-word.is-armed.is-shown) .act-face.is-heavy{background:transparent!important}" });
      r.aa.cureA_groundClearsWhileAsking = await readAsked();
      await page.evaluate(() => document.getElementById("cureA")?.remove());
      await page.addStyleTag({ id: "cureB", content: ".controls-card .act-face.is-heavy{background:color-mix(in srgb, var(--color-foreground) 4%, transparent)!important}" });
      r.aa.cureB_groundAt4 = await readAsked();
      await page.evaluate(() => document.getElementById("cureB")?.remove());
      // C: the chair's candidate wave law — the verb sits on bare card, weight alone marks it
      await page.addStyleTag({ id: "cureC", content: ".controls-card .act-face.is-heavy{background:transparent!important}" });
      r.aa.cureC_bareCard = await readAsked();
      await page.evaluate(() => document.getElementById("cureC")?.remove());

      // KEYBOARD: Escape, Tab-away, and the second Enter
      await page.evaluate(() => document.querySelector(".deal-btn").focus());
      await settle(page, 150);
      r.keyboard = {};
      r.keyboard.focusIsDeal = await page.evaluate(() => document.activeElement?.className || null);
      await page.keyboard.press("Escape");
      await settle(page, 250);
      r.keyboard.armedAfterEscape = await page.evaluate(() => !!document.querySelector(".deal-btn .act-word.is-armed.is-shown"));
      const boardBefore = await page.evaluate(() => window.__board());
      await page.keyboard.press("Tab");
      await settle(page, 250);
      r.keyboard.armedAfterTab = await page.evaluate(() => !!document.querySelector(".deal-btn .act-word.is-armed.is-shown"));
      r.keyboard.focusAfterTab = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || document.activeElement?.className || null);
      // re-focus and send the SECOND Enter on an armed face
      await page.evaluate(() => document.querySelector(".deal-btn").focus());
      await settle(page, 150);
      r.keyboard.armedBeforeSecondEnter = await page.evaluate(() => !!document.querySelector(".deal-btn .act-word.is-armed.is-shown"));
      await page.keyboard.press("Enter");
      await settle(page, 1200);
      r.keyboard.boardChangedBySecondEnter = (await page.evaluate(() => window.__board())) !== boardBefore;
      r.keyboard.armedAfterSecondEnter = await page.evaluate(() => !!document.querySelector(".deal-btn .act-word.is-armed.is-shown"));
      return r;
    })();

    // I3′ inputs at the scrolled states, and what the sticky head covers
    rec.scroll = await page.evaluate(() => {
      const card = document.querySelector(".controls-card");
      const cs = getComputedStyle(card);
      const padTop = parseFloat(cs.paddingTop) || 0;
      const padBottom = parseFloat(cs.paddingBottom) || 0;
      const states = [];
      const max = card.scrollHeight - card.clientHeight;
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        card.scrollTop = max * f;
        const cr = card.getBoundingClientRect();
        // the scrollport is the PADDING box
        const portTop = cr.top + 0, portBottom = cr.bottom;
        const bands = [...document.querySelectorAll(".cost-band")].map((b) => {
          const br = b.getBoundingClientRect();
          const vis = Math.max(0, Math.min(br.bottom, portBottom) - Math.max(br.top, portTop));
          return { name: b.querySelector("h2").textContent.trim(), visible: +vis.toFixed(1), frac: +(vis / (portBottom - portTop)).toFixed(3) };
        });
        const pinned = [...document.querySelectorAll(".cost-band-head")].filter((h) => Math.abs(h.getBoundingClientRect().top - (cr.top + padTop)) < 2).map((h) => h.textContent.trim());
        // what sits under the pinned head's box
        const headBoxes = [...document.querySelectorAll(".cost-band-head")].map((h) => h.getBoundingClientRect());
        const controls = [...card.querySelectorAll("button, .ctrl-btn")];
        let worst = 0, worstName = null;
        for (const hb of headBoxes) for (const c of controls) {
          const cb = c.getBoundingClientRect();
          const ov = window.__overlap(hb, cb);
          if (ov > worst) { worst = ov; worstName = (c.getAttribute("aria-label") || c.textContent.trim()).slice(0, 30); }
        }
        states.push({ f, scrollTop: +card.scrollTop.toFixed(1), pinned, bands, headOverControlPx2: worst, headOverControlName: worstName, padTop, padBottom });
      }
      card.scrollTop = 0;
      return { max: +max.toFixed(1), states };
    });

    out.cells[key] = rec;
    await browser.close();
  }

  // ── DESK 1280×800 fine, light ──────────────────────────────────────────────────────────
  {
    const key = `${engine}·desk1280·light`;
    const { browser, page } = await cell(engine, BT, { width: 1280, height: 800 }, { coarse: false, openSheet: false, scheme: "light" });
    const rec = {};
    rec.identity = await page.evaluate(() => ({
      bands: [...document.querySelectorAll(".cost-band h2")].map((h) => h.textContent.trim()),
      actionBar: document.querySelectorAll(".action-bar").length,
      actFaces: document.querySelectorAll(".act-face").length,
    }));
    rec.card = await page.evaluate(() => {
      const card = document.querySelector(".controls-card");
      return { rect: window.__r(card), scrollHeight: card.scrollHeight, clientHeight: card.clientHeight };
    });
    rec.heads = await page.evaluate(() => [...document.querySelectorAll(".cost-band")].map((b) => {
      const head = b.querySelector(".cost-band-head"), name = b.querySelector("h2");
      const hr = head.getBoundingClientRect(), nr = name.getBoundingClientRect();
      const first = b.querySelector(".band-acts > *, .band-row");
      return { name: name.textContent.trim(), headH: +hr.height.toFixed(2), nameFont: getComputedStyle(name).fontSize, rightSlackPx: +(hr.right - nr.right).toFixed(2), airUnderHead: first ? +(first.getBoundingClientRect().top - hr.bottom).toFixed(2) : null };
    }));
    // THE TAPE OVER A CONTROL, at the scrolled state the critic named
    rec.tapeOverControl = await (async () => {
      const r = {};
      const card = page.locator(".controls-card");
      await page.evaluate(() => { const c = document.querySelector(".controls-card"); c.scrollTop = c.scrollHeight; });
      await settle(page, 300);
      for (const verb of ["fill", "solve"]) {
        const btn = page.locator(`.controls-card button`, { hasText: new RegExp(`^${verb}$`) }).first();
        if (!(await btn.count())) continue;
        await btn.hover({ force: true }).catch(() => {});
        await settle(page, 300);
        r[verb] = await page.evaluate((v) => {
          const card = document.querySelector(".controls-card");
          const port = card.getBoundingClientRect();
          const tape = [...card.querySelectorAll(".washi-label")].find((t) => getComputedStyle(t).opacity !== "0" && t.getBoundingClientRect().height > 0);
          if (!tape) return { tape: null };
          const tr = tape.getBoundingClientRect();
          const controls = [...card.querySelectorAll("button, .ctrl-btn")];
          let worst = 0, name = null, frac = 0;
          for (const c of controls) {
            const cb = c.getBoundingClientRect();
            const ov = window.__overlap(tr, cb);
            if (ov > worst) { worst = ov; name = (c.getAttribute("aria-label") || c.textContent.trim()).slice(0, 30); frac = +(ov / (cb.width * cb.height)).toFixed(3); }
          }
          const above = +(port.top - tr.top).toFixed(2);
          return { verb: v, text: tape.textContent.trim().slice(0, 40), rect: window.__r(tape), clippedAbovePortPx: above > 0 ? above : 0, fullyOffPort: tr.bottom < port.top, worstOverlapPx2: worst, worstControl: name, worstFrac: frac };
        }, verb);
      }
      await page.evaluate(() => { document.querySelector(".controls-card").scrollTop = 0; });
      return r;
    })();
    // the fine-pointer tier 3: does a press ASK or ACT?
    rec.fineTier3 = await (async () => {
      const fill = page.locator(".controls-card button", { hasText: /^fill$/ }).first();
      if (await fill.count()) { await fill.click({ force: true }); await settle(page, 1500); }
      const before = await page.evaluate(() => window.__board());
      const deal = page.locator(".deal-btn").first();
      await deal.scrollIntoViewIfNeeded();
      await settle(page, 250);
      await deal.click({ force: true });
      await settle(page, 1200);
      const after = await page.evaluate(() => window.__board());
      return {
        armed: await page.evaluate(() => !!document.querySelector(".deal-btn .act-word.is-armed.is-shown")),
        boardChanged: before !== after,
        faceStrokeWidth: await page.evaluate(() => { const f = document.querySelector(".deal-btn .act-face svg path"); return f ? f.getAttribute("stroke-width") : null; }),
        faceGround: await page.evaluate(() => getComputedStyle(document.querySelector(".deal-btn .act-face")).backgroundColor),
      };
    })();
    out.cells[key] = rec;
    await browser.close();
  }
}

writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("banked", OUT.pathname);
