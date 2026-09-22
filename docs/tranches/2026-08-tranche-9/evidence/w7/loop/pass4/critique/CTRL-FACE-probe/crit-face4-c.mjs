// T9-W7 pass 4 · CTRL-FACE — the CRITIC's third instrument.
// (1) THE RING'S INK, read where it PAINTS: the token at the chip, the computed outline colour
//     of the chip that actually holds keyboard focus, and which rule won.
// (2) THE DECK, paired proto-DEV (4240) against control-DEV (4241) — the same rendering mode on
//     both arms, keyed by tag+class+text instead of document index.

import { chromium, webkit } from "playwright";

const PROTO = "http://127.0.0.1:4240";
const HEADD = "http://127.0.0.1:4241";

async function ringInk(engine, L, scheme) {
  const b = await L.launch();
  const c = await b.newContext({
    viewport: { width: 390, height: 844 },
    baseURL: PROTO,
    hasTouch: true,
    isMobile: engine === "chromium",
    deviceScaleFactor: 3,
    colorScheme: scheme,
  });
  const p = await c.newPage();
  await p.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
  await p.goto("/?size=3&difficulty=EASY", { waitUntil: "networkidle" });
  await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
  const card = p.locator(".controls-card:visible").first();
  if (!(await card.isVisible().catch(() => false))) {
    await p.locator(".drawer-tab").tap();
    await p.waitForTimeout(1100);
  }
  // Focus the chip directly and force the visible state the rule targets, then read what the
  // cascade actually produced. `.focus()` after a keyboard event is a keyboard arrival on both
  // engines; if `:focus-visible` still does not match, that is itself the reading.
  const out = await p.evaluate(() => {
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const btn = [...card.querySelectorAll(".tray-well .ctrl-btn")].find((b) => b.getClientRects().length);
    const head = card.querySelector(".mobile-heading-btn");
    const rs = getComputedStyle(document.documentElement);
    const read = (el) => {
      if (!el) return null;
      el.focus();
      const s = getComputedStyle(el);
      return {
        cls: el.className.toString().slice(0, 40),
        focusVisible: el.matches(":focus-visible"),
        outline: `${s.outlineWidth} ${s.outlineStyle} ${s.outlineColor}`,
        offset: s.outlineOffset,
        ringInkHere: s.getPropertyValue("--ring-ink").trim(),
      };
    };
    return {
      rootRingInk: rs.getPropertyValue("--ring-ink").trim(),
      rootFocusSketch: rs.getPropertyValue("--color-focus-sketch").trim(),
      chip: read(btn),
      tabHead: read(head),
    };
  });
  await b.close();
  return { engine, scheme, ...out };
}

const deckRead = () => {
  const px = (n) => Math.round(n * 1000) / 1000;
  const band = document.querySelector(".staging-band");
  if (!band) return null;
  const of = (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      key: `${el.tagName.toLowerCase()}|${el.className.toString().replace(/\s+/g, " ").trim()}|${(el.textContent || "").trim().slice(0, 20)}`,
      box: [px(r.x), px(r.y), px(r.width), px(r.height)],
      face: `${s.fontFamily.split(",")[0].replace(/["']/g, "")}·${px(parseFloat(s.fontSize))}·${s.fontWeight}·${s.lineHeight}·${s.letterSpacing}·${s.textTransform}`,
      color: s.color,
    };
  };
  return [band, ...band.querySelectorAll("*")].filter((e) => e.getClientRects().length).map(of);
};

for (const [engine, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  for (const scheme of ["light", "dark"])
    console.log(`RINGINK ${JSON.stringify(await ringInk(engine, L, scheme))}`);

  const out = {};
  for (const [tree, base] of [
    ["proto", PROTO],
    ["headDev", HEADD],
  ]) {
    const b = await L.launch();
    const c = await b.newContext({ viewport: { width: 1280, height: 800 }, baseURL: base });
    const p = await c.newPage();
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto("/?view=gallery&size=3&difficulty=MEDIUM", { waitUntil: "networkidle" });
    await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
    await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
    await p.waitForTimeout(900);
    out[tree] = await p.evaluate(deckRead);
    await b.close();
  }
  if (!out.proto || !out.headDev) {
    console.log(`DECK ${engine}: band missing`);
    continue;
  }
  const map = (rows) => {
    const m = new Map();
    for (const r of rows) m.set(r.key + "#" + (m.has(r.key) ? m.get(r.key).length : 0), r);
    return m;
  };
  const byKey = (rows) => {
    const m = new Map();
    for (const r of rows) {
      const n = (m.get(r.key) || []).length;
      m.set(r.key, [...(m.get(r.key) || []), r]);
    }
    return m;
  };
  const a = byKey(out.proto),
    h = byKey(out.headDev);
  const keys = [...new Set([...a.keys(), ...h.keys()])];
  const deltas = [];
  for (const k of keys) {
    const ax = a.get(k) || [],
      hx = h.get(k) || [];
    if (ax.length !== hx.length) {
      deltas.push(`COUNT ${k} proto ${ax.length} head ${hx.length}`);
      continue;
    }
    for (let i = 0; i < ax.length; i++) {
      if (ax[i].face !== hx[i].face) deltas.push(`FACE ${k} ${ax[i].face} vs ${hx[i].face}`);
      if (ax[i].color !== hx[i].color) deltas.push(`COLOR ${k} ${ax[i].color} vs ${hx[i].color}`);
      const db = ax[i].box.map((v, j) => Math.round((v - hx[i].box[j]) * 10000) / 10000);
      if (db.some((v) => Math.abs(v) > 0.001)) deltas.push(`BOX ${k} d${JSON.stringify(db)}`);
    }
  }
  console.log(
    `DECK ${engine} (dev vs dev): proto ${out.proto.length} / head ${out.headDev.length} elements, ${deltas.length} deltas`,
  );
  for (const d of deltas.slice(0, 20)) console.log(`   ${d}`);
}
console.log("DONE-C");
