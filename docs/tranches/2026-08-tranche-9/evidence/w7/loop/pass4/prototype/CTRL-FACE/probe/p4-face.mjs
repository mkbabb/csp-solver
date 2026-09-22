// T9-W7 pass 4 · CTRL-FACE — the paired census: the caption's used width, the two edges, the
// card's box, the chip tap box's headroom, and the two landscape cells' reachability.
//
// COPIED AND RE-POINTED from pass 3's `p3-card.mjs` + `p3-land-844.mjs` (pass 3 is frozen);
// OUT goes to `pass4/prototype/CTRL-FACE/readings/`. Every row is paired against the HEAD
// control at `74a2b5d9` on 4235, verified by its own asset hash `index-CubiZsMVSwTc.js`.
//
// Run: node p4-face.mjs   (servers: proto 4234, HEAD control 4235)

import { chromium, webkit } from "playwright";

const TREES = [
  ["proto", "http://127.0.0.1:4234"],
  ["head", "http://127.0.0.1:4235"],
];

/** The cells the charter names, plus the two landscape ones W2 §2.2 governs. */
const CELLS = [
  ["320×568", { width: 320, height: 568 }, true],
  ["390×844", { width: 390, height: 844 }, true],
  ["768×1024", { width: 768, height: 1024 }, true],
  ["1280×800", { width: 1280, height: 800 }, false],
];
const LAND = [
  ["844×390", { width: 844, height: 390 }],
  ["812×375", { width: 812, height: 375 }],
];

const px = (n) => Math.round(n * 100) / 100;

/** The card census: the captions by used width against their own min-content, and the box. */
const readCard = () => {
  const px = (n) => Math.round(n * 100) / 100;
  const card = [...document.querySelectorAll(".controls-card")].find(
    (c) => c.getClientRects().length,
  );
  if (!card) return { card: null };
  const wrap = card.querySelector(".control-panel-wrap") ?? card;
  const caps = [...card.querySelectorAll(".zone-row-label")].map((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    // MIN-CONTENT OFF A CLONE — the same instrument the e2e row uses, so the two readings are
    // the same number and a disagreement between them is a finding, not a unit confusion.
    const probe = document.createElement("span");
    probe.textContent = el.textContent;
    for (const p of [
      "font-family",
      "font-size",
      "font-weight",
      "font-style",
      "letter-spacing",
      "word-spacing",
      "text-transform",
    ])
      probe.style.setProperty(p, s.getPropertyValue(p));
    probe.style.cssText +=
      ";position:absolute;left:-9999px;top:0;width:max-content;white-space:nowrap;";
    document.body.appendChild(probe);
    const minContent = px(probe.getBoundingClientRect().width);
    probe.remove();
    const strip = el.parentElement.querySelector(".options-row");
    const sr = strip ? strip.getBoundingClientRect() : null;
    return {
      text: el.textContent.trim(),
      w: px(r.width),
      minContent,
      left: px(r.left),
      right: px(r.right),
      flexBasis: s.flexBasis,
      textAlign: s.textAlign,
      whiteSpace: s.whiteSpace,
      face: `${s.fontFamily.split(",")[0].replace(/["']/g, "")} · ${px(parseFloat(s.fontSize))} · ${s.fontWeight}`,
      stripLeft: sr ? px(sr.left) : null,
      stripW: sr ? px(sr.width) : null,
      sameLine: sr ? Math.abs(sr.top - r.top) < 12 : null,
    };
  });
  // The chip tap box, and the headroom the next rung would spend.
  const chips = [...card.querySelectorAll(".tray-well .ctrl-btn")].map((b) => {
    const r = b.getBoundingClientRect();
    const w = b.querySelector(".ctrl-word");
    const ws = w ? getComputedStyle(w) : null;
    const wr = w ? w.getBoundingClientRect() : null;
    return {
      text: b.textContent.trim(),
      w: px(r.width),
      h: px(r.height),
      wordW: wr && ws ? px(wr.width - parseFloat(ws.paddingLeft) - parseFloat(ws.paddingRight)) : null,
      rung: ws ? px(parseFloat(ws.fontSize)) : null,
      tracking: ws ? ws.letterSpacing : null,
    };
  });
  const printed = [...card.querySelectorAll(".section-heading")].map((h) => {
    const s = getComputedStyle(h);
    return `${s.fontFamily.split(",")[0].replace(/["']/g, "")} · ${px(parseFloat(s.fontSize))} · ${s.fontWeight} · ${s.textTransform}`;
  });
  const cs = getComputedStyle(card);
  return {
    card: { h: px(card.getBoundingClientRect().height), clientH: px(wrap.clientHeight) },
    caps,
    chips,
    printedVoices: [...new Set(printed)],
    tokens: {
      ringInk: cs.getPropertyValue("--ring-ink").trim(),
      motionWhisper: cs.getPropertyValue("--motion-whisper").trim(),
      cardPadX: cs.getPropertyValue("--card-pad-x").trim(),
      foldToolsH: cs.getPropertyValue("--fold-tools-h").trim(),
      headRule: cs.getPropertyValue("--head-rule").trim(),
      stripLen: cs.getPropertyValue("--strip-len").trim(),
    },
    // The two moved inks, read as PAINT, so the bare-var() strike is proved and not asserted.
    paint: (() => {
      const btn = card.querySelector(".tray-well .ctrl-btn");
      const head = card.querySelector(".section-heading");
      return {
        headTransition: head ? getComputedStyle(head).transition : null,
        chipOutline: btn ? getComputedStyle(btn).outlineColor : null,
      };
    })(),
  };
};

/** W2 §2.2's reachability: a CUED path to deal and to level within ONE gesture. */
const readLand = () => {
  const px = (n) => Math.round(n * 100) / 100;
  const vis = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      w: px(r.width),
      h: px(r.height),
      onscreen: r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0,
      inert: !!el.closest("[inert]"),
      hidden: cs.visibility === "hidden" || cs.display === "none" || cs.opacity === "0",
      name: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 28),
    };
  };
  const card = document.querySelector(".controls-card .control-panel-wrap");
  const deal = [...document.querySelectorAll("button")].find((b) =>
    /deal/i.test(b.getAttribute("aria-label") || b.textContent || ""),
  );
  const heads = [...document.querySelectorAll(".mobile-heading-btn, .section-heading")];
  const level = heads.find((h) => /level/i.test(h.textContent || ""));
  const printed = [...document.querySelectorAll(".controls-card .section-heading")].map((h) => {
    const s = getComputedStyle(h);
    return `${s.fontFamily.split(",")[0].replace(/["']/g, "")} · ${px(parseFloat(s.fontSize))} · ${s.fontWeight} · ${s.textTransform}`;
  });
  return {
    cardH: card ? px(card.clientHeight) : null,
    tab: vis(document.querySelector(".drawer-tab")),
    deal: vis(deal),
    level: vis(level),
    caseOpen: !!document.querySelector("#controls-drawer .drawer-case"),
    // THE REGIME IS WITNESSED, on this page, not assumed from the context options.
    coarse: matchMedia("(pointer: coarse)").matches,
    printedVoices: [...new Set(printed)],
    printedN: printed.length,
  };
};

async function open(page, coarse) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?size=3&difficulty=EASY", { waitUntil: "networkidle" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  const visible = page.locator(".controls-card:visible").first();
  if (!(await visible.isVisible().catch(() => false))) {
    const tab = page.locator(".drawer-tab");
    if (coarse) await tab.tap();
    else await tab.click();
    await page.waitForTimeout(900); // the dock sheet SLIDES (~700ms) — settle before reading
  }
}

for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  for (const [label, viewport, coarse] of CELLS) {
    const rows = {};
    for (const [tree, base] of TREES) {
      const browser = await launcher.launch();
      const ctx = await browser.newContext({
        viewport,
        baseURL: base,
        hasTouch: coarse,
        isMobile: coarse && engine === "chromium",
        deviceScaleFactor: coarse ? 3 : 1,
      });
      const page = await ctx.newPage();
      await open(page, coarse);
      rows[tree] = await page.evaluate(readCard);
      await browser.close();
    }
    const p = rows.proto,
      h = rows.head;
    console.log(`\n== ${engine} · ${label} ${coarse ? "coarse" : "fine"} ==`);
    if (!p.card) {
      console.log("  no visible card at this cell");
      continue;
    }
    console.log(
      `  card h  proto ${p.card.h} / head ${h.card ? h.card.h : "n/a"}  Δ ${h.card ? px(p.card.h - h.card.h) : "n/a"}`,
    );
    for (const c of p.caps) {
      const hc = (h.caps || []).find((x) => x.text === c.text);
      console.log(
        `  cap "${c.text}"  used ${c.w} min-content ${c.minContent} (Δ ${px(c.w - c.minContent)})` +
          `  x ${c.left}→${c.right}  basis ${c.flexBasis} align ${c.textAlign}` +
          `  strip@${c.stripLeft} w${c.stripW} ${c.sameLine ? "same-line" : "next-line"}` +
          (hc ? `  | HEAD used ${hc.w} x ${hc.left}→${hc.right}` : "  | HEAD absent"),
      );
    }
    if (p.caps.length >= 2)
      console.log(
        `  left-edge spread ${px(Math.max(...p.caps.map((c) => c.left)) - Math.min(...p.caps.map((c) => c.left)))}` +
          `  right-edge spread ${px(Math.max(...p.caps.map((c) => c.right)) - Math.min(...p.caps.map((c) => c.right)))}`,
      );
    const tap = p.chips.filter((c) => c.w && c.h);
    if (tap.length)
      console.log(
        `  chip tap box min ${Math.min(...tap.map((c) => c.w))}×${Math.min(...tap.map((c) => c.h))}` +
          ` rung ${tap[0].rung} tracking ${tap[0].tracking}` +
          `  widest word ${Math.max(...tap.map((c) => c.wordW ?? 0))}`,
      );
    console.log(`  printed voices ${JSON.stringify(p.printedVoices)}`);
    console.log(`  tokens ${JSON.stringify(p.tokens)}`);
    console.log(`  paint  ${JSON.stringify(p.paint)}`);
    if (h.tokens) console.log(`  HEAD tokens ${JSON.stringify(h.tokens)}`);
    if (h.paint) console.log(`  HEAD paint  ${JSON.stringify(h.paint)}`);
  }

  for (const [label, viewport] of LAND) {
    console.log(`\n== ${engine} · ${label} landscape (coarse, hasTouch) ==`);
    for (const [tree, base] of TREES) {
      const browser = await launcher.launch();
      const ctx = await browser.newContext({
        viewport,
        baseURL: base,
        hasTouch: true,
        isMobile: engine === "chromium",
      });
      const page = await ctx.newPage();
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/?size=3&difficulty=EASY", { waitUntil: "networkidle" });
      await page.waitForTimeout(900);
      const before = await page.evaluate(readLand);
      let gestures = 0;
      if (before.tab && before.tab.onscreen) {
        await page.locator(".drawer-tab").tap();
        gestures = 1;
        await page.waitForTimeout(900);
      }
      const after = await page.evaluate(readLand);
      const reach = (t) => (t && t.onscreen && !t.inert && !t.hidden ? "REACHED" : "NOT REACHED");
      console.log(
        `  ${tree}  coarse=${after.coarse}  tab ${before.tab ? `"${before.tab.name}" ${before.tab.w}×${before.tab.h} onscreen=${before.tab.onscreen}` : "ABSENT"}` +
          `  →${gestures} gesture: case=${after.caseOpen} deal ${reach(after.deal)} level ${reach(after.level)}` +
          `  | cardH ${after.cardH} (READING)  printed n=${after.printedN} ${JSON.stringify(after.printedVoices)}`,
      );
      await browser.close();
    }
  }
}
