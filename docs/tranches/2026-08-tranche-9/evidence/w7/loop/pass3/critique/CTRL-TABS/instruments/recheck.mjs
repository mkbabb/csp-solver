import { chromium, webkit } from "playwright";
import fs from "node:fs";
const PROTO = "http://127.0.0.1:4241/";
const HEAD = "http://127.0.0.1:4242/";
const SETTLE = 950;
const OUT = process.argv[2];

const measure = () => {
  const r = (el) => (el ? el.getBoundingClientRect() : null);
  const q = (s) => document.querySelector(s);
  const f = (n) => (n == null ? null : +n.toFixed(2));
  const paper = r(q(".board-wrapper"));
  const tongue = r(q(".drawer-tab"));
  const berth = r(q("#board-edge"));
  const cardEl = q(".controls-card");
  const card = r(cardEl);
  const strip = r(q(".tab-strip"));
  const raised = q(".tab.is-raised");
  const tabs = [...document.querySelectorAll(".tab")].map((t) => {
    const b = t.getBoundingClientRect();
    return { w: f(b.width), h: f(b.height), y: f(b.y), raised: t.classList.contains("is-raised"), txt: (t.textContent||"").trim().slice(0,14) };
  });
  const board = q(".board-wrapper");
  const boardBox = board ? board.getBoundingClientRect() : null;
  const offCentre = boardBox ? Math.abs((boardBox.y + boardBox.height / 2) - window.innerHeight / 2) : null;
  // tabs painted over the board?
  let tabsOverBoard = 0;
  if (boardBox) for (const t of document.querySelectorAll(".tab")) {
    const b = t.getBoundingClientRect();
    if (b.width && b.height && b.right > boardBox.left && b.left < boardBox.right && b.bottom > boardBox.top && b.top < boardBox.bottom) tabsOverBoard++;
  }
  const smallTargets = [...document.querySelectorAll(".tab, .edge-tab, .play-controls button, #board-edge-tools button")]
    .map((e) => { const b = e.getBoundingClientRect(); return { sel: e.className.toString().slice(0,26), w: f(b.width), h: f(b.height) }; })
    .filter((t) => t.w > 0 && (t.w < 44 || t.h < 44));
  return {
    vw: innerWidth, vh: innerHeight,
    paper: paper && { y: f(paper.y), bottom: f(paper.bottom), h: f(paper.height), x: f(paper.x) },
    tongue: tongue && { y: f(tongue.y), bottom: f(tongue.bottom), w: f(tongue.width), h: f(tongue.height) },
    berth: berth && { y: f(berth.y), bottom: f(berth.bottom), h: f(berth.height) },
    card: card && { x: f(card.x), y: f(card.y), w: f(card.width), h: f(card.height) },
    cardScroll: cardEl && { sh: cardEl.scrollHeight, ch: cardEl.clientHeight },
    strip: strip && { y: f(strip.y), h: f(strip.height), x: f(strip.x), w: f(strip.width) },
    tabs, tabsOverBoard, smallTargets,
    tuckTop: (tongue && paper) ? f(tongue.y - paper.bottom) : null,
    tuckBottom: (tongue && berth) ? f(tongue.bottom - berth.bottom) : null,
    offCentre: f(offCentre),
    tablist: document.querySelectorAll('[role="tablist"]').length,
    logs: document.querySelectorAll('[role="log"]').length,
    foldTools: !!document.querySelector("#fold-tools"),
    afterContent: raised ? getComputedStyle(raised, "::after").content : null,
    docScroll: { sh: document.documentElement.scrollHeight, ch: document.documentElement.clientHeight },
  };
};

const CELLS = {
  portrait: [[390,844],[375,812],[430,932],[360,640],[412,915],[390,664]],
  desk: [[1024,800],[1280,800],[1360,900],[1440,900],[1600,900]],
  land: [[844,390],[812,375],[900,500]],
  short: [[360,560],[360,500]],
};

async function run(engine, name, out) {
  const browser = await engine.launch();
  for (const [kind, cells] of Object.entries(CELLS)) {
    for (const [w, h] of cells) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      for (const [tag, url] of [["proto", PROTO], ["head", HEAD]]) {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        await page.waitForTimeout(SETTLE);
        out.push({ engine: name, kind, cell: `${w}x${h}`, tree: tag, ...(await page.evaluate(measure)) });
      }
      await ctx.close();
      console.log(name, kind, w + "x" + h, "done");
    }
  }
  await browser.close();
}
const out = [];
await run(chromium, "chromium", out);
await run(webkit, "webkit", out);
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("EXIT OK", out.length);
