// T9-W7 pass 4 · CTRL-FACE — the CRITIC's second instrument.
// (1) THE NEW STROKE, FROM PAINTED BYTES, BOTH THEMES: `outline: 2px dashed var(--ring-ink)`
//     landed at two §10 sites this slice and the record carries no contrast reading for it.
//     The ring is isolated by DIFFERENCING two crops of the same chip (focused / not), which is
//     this family's own `paintedExtent()` idiom, and the ratio is computed against the paper
//     those same pixels showed before the ring arrived.
// (2) THE DECK'S π, read as computed PAINT properties on the gallery route, proto vs the
//     74a2b5d9 control.
// Servers: proto 4240 · control preview (index-CubiZsMVSwTc.js) 4242.

import { chromium, webkit } from "playwright";

const PROTO = "http://127.0.0.1:4240";
const HEAD = "http://127.0.0.1:4242";

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
};

async function ringAA(engine, launcher, scheme) {
  const browser = await launcher.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    baseURL: PROTO,
    hasTouch: true,
    isMobile: engine === "chromium",
    deviceScaleFactor: 3,
    colorScheme: scheme,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
  await page.goto("/?size=3&difficulty=EASY", { waitUntil: "networkidle" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  const card = page.locator(".controls-card:visible").first();
  if (!(await card.isVisible().catch(() => false))) {
    await page.locator(".drawer-tab").tap();
    await page.waitForTimeout(1100);
  }
  const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"));

  // Walk the tab ring until a card chip holds focus — a REAL keyboard arrival, so
  // `:focus-visible` is the UA's own verdict and not a class we asserted into existence.
  let hops = 0;
  let onChip = false;
  while (hops < 80 && !onChip) {
    await page.keyboard.press("Tab");
    hops++;
    onChip = await page.evaluate(() => {
      const a = document.activeElement;
      return !!a && a.matches(".tray-well .ctrl-btn") && a.matches(":focus-visible");
    });
  }
  if (!onChip) {
    // WebKit does not put a <button> in the Tab order by default (Safari's "full keyboard
    // access" is off), so the ring is unreachable by Tab on that engine at this cell. Force the
    // state the rule targets so the STROKE can still be priced, and say that is what was done.
    await page.addStyleTag({
      content: ".tray-well .ctrl-btn.crit-ring { outline: 2px dashed var(--ring-ink); outline-offset: 3px }",
    });
    await page.evaluate(() => {
      const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
      const b = [...card.querySelectorAll(".tray-well .ctrl-btn")].find((x) => x.getClientRects().length);
      b.classList.add("crit-ring");
      b.focus();
    });
    onChip = "FORCED (webkit: <button> is not in the Tab order)";
  }

  await page.waitForTimeout(700);
  const geo = await page.evaluate(() => {
    const a = document.querySelector(".tray-well .ctrl-btn.crit-ring") ?? document.activeElement;
    const r = a.getBoundingClientRect();
    const cs = getComputedStyle(a);
    return {
      x: r.x,
      y: r.y,
      w: r.width,
      h: r.height,
      text: a.textContent.trim(),
      outline: `${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`,
      offset: cs.outlineOffset,
      cardBg: getComputedStyle(a.closest(".controls-card")).backgroundColor,
    };
  });

  const pad = 12;
  const clip = {
    x: Math.max(0, Math.floor(geo.x - pad)),
    y: Math.max(0, Math.floor(geo.y - pad)),
    width: Math.ceil(geo.w + pad * 2),
    height: Math.ceil(geo.h + pad * 2),
  };
  const b64 = (buf) => "data:image/png;base64," + buf.toString("base64");
  const A = b64(await page.screenshot({ clip }));
  const h = await page.addStyleTag({
    content: ".tray-well .ctrl-btn:focus-visible, .tray-well .ctrl-btn.crit-ring { outline: none !important }",
  });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const B = b64(await page.screenshot({ clip }));
  await h.evaluate((n) => n.remove());

  const stat = await page.evaluate(async ({ a, b }) => {
    const load = (d) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = d; });
    const [ia, ib] = await Promise.all([load(a), load(b)]);
    const cv = (img) => { const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
      c.getContext("2d").drawImage(img, 0, 0); return c.getContext("2d").getImageData(0, 0, img.width, img.height).data; };
    const da = cv(ia), db = cv(ib);
    const rows = [];
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.abs(da[i] - db[i]) + Math.abs(da[i+1] - db[i+1]) + Math.abs(da[i+2] - db[i+2]);
      if (d < 24) continue;
      rows.push([[da[i], da[i+1], da[i+2]], [db[i], db[i+1], db[i+2]]]);
    }
    return rows;
  }, { a: A, b: B });

  let n = stat.length;
  const rows = stat.map(([ink, paper]) => ({ r: ratio(ink, paper), ink, paper }));
  let worst = rows.length ? rows.reduce((p, q) => (q.r > p.r ? q : p)) : null;
  // The ring's own strongest painted pixel against the paper it covered, and the MEDIAN of the
  // stroke pixels — a dashed 2px ring at dpr 3 is mostly full-strength, so the median is the
  // honest headline and the max is the best case.
  rows.sort((p, q) => p.r - q.r);
  const med = rows.length ? rows[Math.floor(rows.length / 2)] : null;
  await browser.close();
  return {
    engine,
    scheme,
    dark,
    reach: onChip,
    chip: geo.text,
    outline: geo.outline,
    offset: geo.offset,
    cardBg: geo.cardBg,
    strokePx: n,
    best: worst ? { ratio: worst.r, ink: worst.ink, paper: worst.paper } : null,
    median: med ? { ratio: med.r, ink: med.ink, paper: med.paper } : null,
  };
}

const deckRead = () => {
  const px = (n) => Math.round(n * 1000) / 1000;
  const band = document.querySelector(".staging-band");
  if (!band) return { band: null };
  const of = (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: el.className.toString().slice(0, 48),
      text: (el.textContent || "").trim().slice(0, 18),
      box: [px(r.x), px(r.y), px(r.width), px(r.height)],
      face: `${s.fontFamily.split(",")[0].replace(/["']/g, "")}·${px(parseFloat(s.fontSize))}·${s.fontWeight}·${s.lineHeight}·${s.letterSpacing}·${s.textTransform}`,
      color: s.color,
    };
  };
  return {
    band: of(band),
    kids: [...band.querySelectorAll("*")].filter((e) => e.getClientRects().length).map(of),
  };
};

for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  for (const scheme of ["light", "dark"]) {
    const r = await ringAA(engine, launcher, scheme);
    console.log(`RING ${engine} ${scheme}: ${JSON.stringify(r)}`);
  }
  // the deck, both trees
  const out = {};
  for (const [tree, base] of [
    ["proto", PROTO],
    ["head", HEAD],
  ]) {
    const b = await launcher.launch();
    const c = await b.newContext({ viewport: { width: 1280, height: 800 }, baseURL: base });
    const p = await c.newPage();
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto("/?view=gallery&size=3&difficulty=MEDIUM", { waitUntil: "networkidle" });
    await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
    await p.waitForTimeout(600);
    out[tree] = await p.evaluate(deckRead);
    await b.close();
  }
  const a = out.proto,
    h = out.head;
  if (!a.band || !h.band) {
    console.log(`DECK ${engine}: band missing proto=${!!a.band} head=${!!h.band}`);
    continue;
  }
  const diffs = [];
  const n = Math.max(a.kids.length, h.kids.length);
  for (let i = 0; i < n; i++) {
    const x = a.kids[i],
      y = h.kids[i];
    if (!x || !y) {
      diffs.push(`#${i} present on ${x ? "proto" : "head"} only`);
      continue;
    }
    if (x.face !== y.face) diffs.push(`#${i} ${x.cls} FACE ${x.face} vs ${y.face}`);
    if (x.color !== y.color) diffs.push(`#${i} ${x.cls} COLOR ${x.color} vs ${y.color}`);
    const db = x.box.map((v, k) => Math.round((v - y.box[k]) * 10000) / 10000);
    if (db.some((v) => Math.abs(v) > 0.001)) diffs.push(`#${i} ${x.cls} BOX d${JSON.stringify(db)}`);
  }
  console.log(
    `DECK ${engine}: proto ${a.kids.length} elements / head ${h.kids.length}; ${diffs.length} deltas`,
  );
  for (const d of diffs.slice(0, 14)) console.log(`   ${d}`);
}
console.log("DONE-B");
