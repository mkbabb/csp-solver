// T9-W7 pass 4 · CTRL-FACE — the CRITIC's independent re-measurement.
// Written from the charter's claims, not copied from the lane's probe: the caption's used width
// against its own min-content clone, the two edges, the card box, the chip tap box, the two
// struck tokens read as PAINT, and the printed voice census.
// Servers: proto dev 4240 · HEAD control (74a2b5d9) vite preview over its own dist 4242
// (verified by asset hash index-CubiZsMVSwTc.js) · HEAD control dev 4241 (parity spot check).

import { chromium, webkit } from "playwright";

const PROTO = "http://127.0.0.1:4240";
const HEADP = "http://127.0.0.1:4242";
const HEADD = "http://127.0.0.1:4241";

const CELLS = [
  ["320x568", { width: 320, height: 568 }, true],
  ["390x844", { width: 390, height: 844 }, true],
  ["768x1024", { width: 768, height: 1024 }, true],
  ["1280x800", { width: 1280, height: 800 }, false],
];

const px = (n) => Math.round(n * 100) / 100;

const read = () => {
  const px = (n) => Math.round(n * 100) / 100;
  const card = [...document.querySelectorAll(".controls-card")].find(
    (c) => c.getClientRects().length,
  );
  if (!card) return { card: null, coarse: matchMedia("(pointer: coarse)").matches };
  const wrap = card.querySelector(".control-panel-wrap") ?? card;
  const caps = [...card.querySelectorAll(".zone-row-label")].map((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    // min-content off an OFFSCREEN CLONE of the same computed face — independent of the lane's
    // own clone: this one also copies font-variant/font-stretch and asserts the clone's face
    // string matches the subject's, so a clone that silently fell back is a visible row.
    const probe = document.createElement("span");
    probe.textContent = el.textContent;
    for (const p of [
      "font-family",
      "font-size",
      "font-weight",
      "font-style",
      "font-stretch",
      "font-variant",
      "letter-spacing",
      "word-spacing",
      "text-transform",
    ])
      probe.style.setProperty(p, s.getPropertyValue(p));
    probe.style.cssText +=
      ";position:absolute;left:-9999px;top:0;width:max-content;white-space:nowrap;";
    document.body.appendChild(probe);
    const ps = getComputedStyle(probe);
    const minContent = px(probe.getBoundingClientRect().width);
    const cloneFace = `${ps.fontFamily.split(",")[0].replace(/["']/g, "")}·${px(parseFloat(ps.fontSize))}·${ps.fontWeight}`;
    probe.remove();
    const row = el.parentElement;
    const strip = row ? row.querySelector(".options-row") : null;
    const sr = strip ? strip.getBoundingClientRect() : null;
    return {
      text: el.textContent.trim(),
      w: px(r.width),
      minContent,
      left: px(r.left),
      right: px(r.right),
      top: px(r.top),
      basis: s.flexBasis,
      align: s.textAlign,
      ws: s.whiteSpace,
      alignSelf: s.alignSelf,
      face: `${s.fontFamily.split(",")[0].replace(/["']/g, "")}·${px(parseFloat(s.fontSize))}·${s.fontWeight}·${s.textTransform}`,
      cloneFace,
      stripLeft: sr ? px(sr.left) : null,
      stripTop: sr ? px(sr.top) : null,
      sameLine: sr ? Math.abs(sr.top - r.top) < 12 : null,
    };
  });
  const chips = [...card.querySelectorAll(".tray-well .ctrl-btn")].map((b) => {
    const r = b.getBoundingClientRect();
    return { text: b.textContent.trim(), w: px(r.width), h: px(r.height) };
  });
  const heads = [...card.querySelectorAll(".section-heading")].map((h) => {
    const s = getComputedStyle(h);
    return `${s.fontFamily.split(",")[0].replace(/["']/g, "")}·${px(parseFloat(s.fontSize))}·${s.fontWeight}·${s.textTransform}`;
  });
  const tapes = [...card.querySelectorAll(".tray-well .washi-tag")].map((t) => {
    const s = getComputedStyle(t);
    return `${s.fontFamily.split(",")[0].replace(/["']/g, "")}·${px(parseFloat(s.fontSize))}·${s.fontWeight}`;
  });
  const cs = getComputedStyle(card);
  const head0 = card.querySelector(".section-heading");
  const btn0 = card.querySelector(".tray-well .ctrl-btn");
  return {
    coarse: matchMedia("(pointer: coarse)").matches,
    card: { h: px(card.getBoundingClientRect().height), clientH: px(wrap.clientHeight) },
    caps,
    chipMin: chips.length
      ? { w: Math.min(...chips.map((c) => c.w)), h: Math.min(...chips.map((c) => c.h)), n: chips.length }
      : null,
    voices: [...new Set(heads)],
    tapeVoices: [...new Set(tapes)],
    nPrinted: heads.length + tapes.length + caps.length,
    counts: { heads: heads.length, tapes: tapes.length, caps: caps.length },
    tok: {
      ringInk: cs.getPropertyValue("--ring-ink").trim(),
      whisper: cs.getPropertyValue("--motion-whisper").trim(),
      headRule: cs.getPropertyValue("--head-rule").trim(),
      cardPadT: cs.getPropertyValue("--card-pad-t").trim(),
    },
    paint: {
      headTransition: head0 ? getComputedStyle(head0).transition : null,
      headTransDur: head0 ? getComputedStyle(head0).transitionDuration : null,
      chipOutline: btn0 ? getComputedStyle(btn0).outlineColor : null,
    },
  };
};

async function open(page, coarse) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?size=3&difficulty=EASY", { waitUntil: "networkidle" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  const visible = page.locator(".controls-card:visible").first();
  if (!(await visible.isVisible().catch(() => false))) {
    const tab = page.locator(".drawer-tab");
    if (coarse) await tab.tap();
    else await tab.click();
    await page.waitForTimeout(1100); // the dock sheet SLIDES ~700ms — settle before reading
    await visible.waitFor({ state: "visible", timeout: 15000 }).catch(() => {});
  }
  await page.waitForTimeout(150);
}

const trees = [
  ["proto", PROTO],
  ["headP", HEADP],
];
if (process.env.PARITY) trees.push(["headD", HEADD]);

for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  for (const [label, viewport, coarse] of CELLS) {
    const rows = {};
    for (const [tree, base] of trees) {
      const browser = await launcher.launch();
      const ctx = await browser.newContext({
        viewport,
        baseURL: base,
        hasTouch: coarse,
        isMobile: coarse && engine === "chromium",
        deviceScaleFactor: coarse ? 3 : 1,
      });
      const page = await ctx.newPage();
      try {
        await open(page, coarse);
        rows[tree] = await page.evaluate(read);
      } catch (e) {
        rows[tree] = { error: String(e).slice(0, 160) };
      }
      await browser.close();
    }
    console.log(`\n== ${engine} · ${label} ${coarse ? "coarse" : "fine"} ==`);
    for (const [tree] of trees) {
      const r = rows[tree];
      if (!r || r.error) {
        console.log(`  ${tree}: ERROR ${r && r.error}`);
        continue;
      }
      if (!r.card) {
        console.log(`  ${tree}: no visible card (coarse=${r.coarse})`);
        continue;
      }
      console.log(
        `  ${tree}  coarse=${r.coarse} cardH ${r.card.h} clientH ${r.card.clientH} chipMin ${r.chipMin ? r.chipMin.w + "x" + r.chipMin.h + " n" + r.chipMin.n : "-"}`,
      );
      for (const c of r.caps)
        console.log(
          `    cap "${c.text}" used ${c.w} minC ${c.minContent} (d ${px(c.w - c.minContent)}) x ${c.left}->${c.right} top ${c.top} basis ${c.basis} align ${c.align} self ${c.alignSelf} ws ${c.ws} face ${c.face} clone ${c.cloneFace} strip@${c.stripLeft} ${c.sameLine ? "SAME-LINE" : "next-line"}`,
        );
      if (r.caps.length >= 2)
        console.log(
          `    left spread ${px(Math.max(...r.caps.map((c) => c.left)) - Math.min(...r.caps.map((c) => c.left)))} right spread ${px(Math.max(...r.caps.map((c) => c.right)) - Math.min(...r.caps.map((c) => c.right)))}`,
        );
      console.log(`    voices ${JSON.stringify(r.voices)} tapes ${JSON.stringify(r.tapeVoices)}`);
      console.log(`    counts ${JSON.stringify(r.counts)} nPrinted ${r.nPrinted}`);
      console.log(`    tok ${JSON.stringify(r.tok)}`);
      console.log(`    paint ${JSON.stringify(r.paint)}`);
    }
    if (rows.proto && rows.headP && rows.proto.card && rows.headP.card)
      console.log(`    >>> cardH delta proto-head = ${px(rows.proto.card.h - rows.headP.card.h)}`);
  }
}
console.log("\nDONE-A");
