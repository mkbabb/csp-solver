/**
 * T9-W7 pass 3 · CTRL-FACE · the card census.
 *   node p3-card.mjs <baseURL> <tag> <outJsonl>
 * Both engines, the six cells the brief names. Everything is read off the real surface.
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const [BASE, TAG, OUT] = process.argv.slice(2);

const CELLS = [
  { id: "320", w: 320, h: 568, coarse: true },
  { id: "360", w: 360, h: 740, coarse: true },
  { id: "375", w: 375, h: 812, coarse: true },
  { id: "390", w: 390, h: 844, coarse: true },
  { id: "430", w: 430, h: 932, coarse: true },
  { id: "900x500", w: 900, h: 500, coarse: true },
  { id: "desk1280", w: 1280, h: 800, coarse: false },
  { id: "1440", w: 1440, h: 900, coarse: false },
  { id: "ipad1280c", w: 1280, h: 800, coarse: true },
];

const PROBE = () => {
  const px = (n) => Math.round(n * 100) / 100;
  const cs = (el) => getComputedStyle(el);
  const card = document.querySelector(".controls-card");
  if (!card) return { err: "no card" };

  // ── the eight printed names: tapes + row captions + section headings
  const tapes = [...card.querySelectorAll(".washi-tag")];
  const captions = [...card.querySelectorAll(".zone-row-label")];
  const heads = [...card.querySelectorAll(".section-heading")];
  const printedEls = [...tapes, ...captions, ...heads];
  const voice = (el) => {
    const s = cs(el);
    return [
      s.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px(parseFloat(s.fontSize)),
      s.fontWeight,
      s.textTransform,
    ].join(" · ");
  };
  const voices = {};
  for (const el of printedEls) voices[voice(el)] = (voices[voice(el)] ?? 0) + 1;

  // ── ROW 3: the printed rung over the option rung
  const chip = card.querySelector(".ctrl-btn");
  const row3 =
    heads[0] && chip
      ? px(parseFloat(cs(heads[0]).fontSize) / parseFloat(cs(chip).fontSize))
      : null;

  // ── the caption lane: one line?
  const capRows = captions.map((c) => {
    const rects = [...c.getClientRects()];
    const r = c.getBoundingClientRect();
    const lh = parseFloat(cs(c).lineHeight);
    return {
      text: c.textContent.trim(),
      clientRects: rects.length,
      h: px(r.height),
      w: px(r.width),
      lines: px(r.height / lh),
      lineHeight: px(lh),
      whiteSpace: cs(c).whiteSpace,
      // the row the caption sits in, and the chip strip beside it
      rowH: px(c.parentElement.getBoundingClientRect().height),
      optionsRowW: (() => {
        const o = c.parentElement.querySelector(".options-row");
        return o ? px(o.getBoundingClientRect().width) : null;
      })(),
      chips: c.parentElement.querySelectorAll(".ctrl-btn").length,
      // does the caption share a line with its chips?
      beside: (() => {
        const o = c.parentElement.querySelector(".options-row");
        if (!o) return null;
        const a = c.getBoundingClientRect();
        const b = o.getBoundingClientRect();
        return b.top < a.bottom - 1 && a.top < b.bottom - 1;
      })(),
    };
  });

  // ── glyph ink, by Range (advance box) and by the painted intersection of a line box
  const inkOf = (el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const b = r.getBoundingClientRect();
    return { top: px(b.top), bottom: px(b.bottom), left: px(b.left), right: px(b.right) };
  };

  // ── the ink gate: `checking`'s tape paper over the caption above it
  const tapeBoxes = tapes.map((t) => {
    const b = t.getBoundingClientRect();
    return {
      text: t.textContent.trim(),
      paper: { top: px(b.top), bottom: px(b.bottom), left: px(b.left), right: px(b.right) },
      ink: inkOf(t),
      face: voice(t),
    };
  });
  const checking = tapeBoxes.find((t) => t.text === "checking");
  const whatFits = captions.find((c) => c.textContent.trim() === "what fits");
  let inkGate = null;
  if (checking && whatFits) {
    const ink = inkOf(whatFits);
    // the worst descender the face can draw at this rung, measured in place
    const probe = document.createElement("span");
    probe.textContent = "pgjqy";
    probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap";
    const s = cs(whatFits);
    probe.style.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize}/${s.lineHeight} ${s.fontFamily}`;
    whatFits.parentElement.appendChild(probe);
    const pr = document.createRange();
    pr.selectNodeContents(probe);
    const pb = pr.getBoundingClientRect();
    const capBox = whatFits.getBoundingClientRect();
    const descender = px(pb.bottom - capBox.bottom);
    probe.remove();
    inkGate = {
      paperTop: checking.paper.top,
      inkBottom: ink.bottom,
      clearance: px(checking.paper.top - ink.bottom),
      worstDescender: px(checking.paper.top - (ink.bottom + Math.max(0, descender))),
      descenderOverhang: descender,
    };
  }

  // ── paper over glyph, per tape (the tape's own paper over its own word's ink)
  const paperOverGlyph = tapeBoxes.map((t) => ({
    text: t.text,
    top: px(t.ink.top - t.paper.top),
    bottom: px(t.paper.bottom - t.ink.bottom),
  }));

  // ── tab-head daylight: the first tape's paper bottom vs the tab head's ink top
  const tabHeads = [...card.querySelectorAll(".mobile-heading-btn")];
  const daylight = tabHeads.map((b) => {
    const h = b.querySelector(".section-heading");
    const ink = inkOf(h);
    const first = tapeBoxes[0];
    const hb = h.getBoundingClientRect();
    const fb = first ? { ...first.paper } : null;
    const inter =
      fb && hb
        ? px(
            Math.max(0, Math.min(fb.bottom, hb.bottom) - Math.max(fb.top, hb.top)) *
              Math.max(0, Math.min(fb.right, hb.right) - Math.max(fb.left, hb.left)),
          )
        : null;
    return {
      head: h.textContent.trim(),
      gap: fb ? px(ink.top - fb.bottom) : null,
      intersectionPx2: inter,
      expanded: b.getAttribute("aria-expanded"),
      headVoice: voice(h),
      headColor: cs(h).color,
      valueWord: (() => {
        const v = b.querySelector(".heading-value");
        if (!v) return null;
        return {
          text: v.textContent.trim(),
          voice: voice(v),
          color: cs(v).color,
          transition: cs(v).transitionDuration,
        };
      })(),
      headTransition: cs(h).transitionDuration,
      textDecoration: cs(h).textDecorationLine,
    };
  });

  // ── the chips: face, weight, the mark's painted width, the chip's tap box
  const chips = [...card.querySelectorAll(".tray-well .ctrl-btn")].map((b) => {
    const w = b.querySelector(".ctrl-word");
    const r = b.getBoundingClientRect();
    const cw = w ? w.getBoundingClientRect() : null;
    const ws = w ? cs(w) : null;
    const bs = cs(b);
    // the painted mark: background-size resolved against the word's content box
    const markW = ws ? ws.backgroundSize.split(" ")[0] : null;
    return {
      text: b.textContent.trim(),
      face: bs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      weight: bs.fontWeight,
      transform: bs.textTransform,
      size: px(parseFloat(bs.fontSize)),
      box: { w: px(r.width), h: px(r.height) },
      wordBox: cw ? { w: px(cw.width), h: px(cw.height), x: px(cw.left), y: px(cw.top) } : null,
      wordInk: w ? inkOf(w) : null,
      markW,
      markWpx: (() => {
        if (!ws || !cw) return null;
        const m = ws.backgroundSize.split(" ")[0];
        if (m.endsWith("px")) return px(parseFloat(m));
        if (m.endsWith("%")) return px((parseFloat(m) / 100) * (cw.width - 0));
        return null;
      })(),
      hasMark: ws ? ws.backgroundImage !== "none" : null,
      pressed: b.getAttribute("aria-pressed"),
      bgPos: ws ? ws.backgroundPosition : null,
    };
  });

  // one `ch` under each face, measured in place (the engine split's own number)
  const chIn = (fam) => {
    const p = document.createElement("div");
    p.style.cssText = `position:absolute;visibility:hidden;font-family:${fam};width:1ch`;
    document.body.appendChild(p);
    const v = px(p.getBoundingClientRect().width);
    p.remove();
    return v;
  };

  return {
    voices,
    printedCount: printedEls.length,
    derivation: {
      tapes: tapes.length,
      captions: captions.length,
      sections: heads.length,
      sum: tapes.length + captions.length + heads.length,
    },
    row3,
    capRows,
    tapeBoxes,
    paperOverGlyph,
    inkGate,
    daylight,
    chips,
    cardH: px(card.getBoundingClientRect().height),
    ch: { fira: chIn('"Fira Code", monospace'), hand: chIn('"Patrick Hand", cursive') },
  };
};

async function run(engine, name) {
  const b = await engine.launch();
  const rows = [];
  for (const cell of CELLS) {
    const ctx = await b.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.coarse,
      isMobile: cell.coarse && name === "chromium",
      deviceScaleFactor: 2,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const p = await ctx.newPage();
    try {
      await p.goto(`${BASE}/?size=3&difficulty=EASY`, { waitUntil: "load", timeout: 30000 });
      await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
      await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
      await p.waitForTimeout(400);
      // the dock: open the sheet and let the glide settle
      const tab = p.locator(".drawer-tab");
      if (await tab.isVisible().catch(() => false)) {
        await tab.tap({ force: true }).catch(() => tab.click({ force: true }));
        await p.waitForTimeout(900);
      }
      await p.waitForSelector(".controls-card", { timeout: 15000 });
      await p.waitForTimeout(300);
      const data = await p.evaluate(PROBE);
      rows.push({ engine: name, cell: cell.id, ...data });
    } catch (e) {
      rows.push({ engine: name, cell: cell.id, err: String(e).slice(0, 220) });
    }
    await ctx.close();
  }
  await b.close();
  return rows;
}

const all = [
  ...(await run(chromium, "chromium")),
  ...(await run(webkit, "webkit")),
];
writeFileSync(OUT, all.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`${TAG}: ${all.length} rows -> ${OUT}`);
console.log(
  all
    .map(
      (r) =>
        `${r.engine} ${r.cell}: ${r.err ? "ERR " + r.err : `voices=${Object.keys(r.voices).length} printed=${r.printedCount} card=${r.cardH} row3=${r.row3}`}`,
    )
    .join("\n"),
);
