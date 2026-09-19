import { chromium, webkit } from "playwright";
import fs from "node:fs";

const PROTO = "http://127.0.0.1:4232/";
const HEAD = "http://127.0.0.1:4233/";
const SETTLE = 950;
const OUT = process.argv[2] ?? "/tmp/probe.json";

const PORTRAIT = [
  [390, 844],
  [375, 812],
  [430, 932],
  [360, 640],
  [412, 915],
];
const DESK = [
  [1024, 800],
  [1280, 800],
  [1360, 900],
  [1440, 900],
  [1600, 900],
];

const measure = () => {
  const r = (el) => (el ? el.getBoundingClientRect() : null);
  const pick = (s) => document.querySelector(s);
  const paper = r(pick(".board-wrapper"));
  const tongue = r(pick(".drawer-tab"));
  const berth = r(pick("#board-edge"));
  const card = r(pick(".controls-card"));
  const strip = r(pick(".tab-strip"));
  const shell = r(pick(".board-shell"));
  const cardEl = pick(".controls-card");
  const tabs = [...document.querySelectorAll(".tab")].map((t) => {
    const b = t.getBoundingClientRect();
    return { w: +b.width.toFixed(2), h: +b.height.toFixed(2), raised: t.classList.contains("is-raised") };
  });
  const raised = pick(".tab.is-raised");
  const afterContent = raised ? getComputedStyle(raised, "::after").content : null;
  const afterDisplay = raised ? getComputedStyle(raised, "::after").display : null;
  const play = r(pick(".play-controls"));
  const caseBody = r(pick(".case-body"));
  const doc = document.documentElement;
  const edgeH = berth ? +berth.height.toFixed(2) : null;
  // the centring arm: the playing block's offset from the viewport's vertical centre
  const layout = r(pick(".app-layout"));
  return {
    vw: window.innerWidth,
    vh: window.innerHeight,
    paper: paper && { x: +paper.x.toFixed(2), y: +paper.y.toFixed(2), w: +paper.width.toFixed(2), h: +paper.height.toFixed(2), bottom: +paper.bottom.toFixed(2) },
    tongue: tongue && { x: +tongue.x.toFixed(2), y: +tongue.y.toFixed(2), w: +tongue.width.toFixed(2), h: +tongue.height.toFixed(2), bottom: +tongue.bottom.toFixed(2) },
    berth: berth && { y: +berth.y.toFixed(2), h: edgeH, bottom: +berth.bottom.toFixed(2) },
    shell: shell && { y: +shell.y.toFixed(2), h: +shell.height.toFixed(2), bottom: +shell.bottom.toFixed(2) },
    card: card && { x: +card.x.toFixed(2), y: +card.y.toFixed(2), w: +card.width.toFixed(2), h: +card.height.toFixed(2) },
    cardScroll: cardEl && { sh: cardEl.scrollHeight, ch: cardEl.clientHeight },
    strip: strip && { x: +strip.x.toFixed(2), y: +strip.y.toFixed(2), w: +strip.width.toFixed(2), h: +strip.height.toFixed(2), bottom: +strip.bottom.toFixed(2) },
    caseTop: caseBody ? +caseBody.y.toFixed(2) : null,
    play: play && { x: +play.x.toFixed(2), y: +play.y.toFixed(2), w: +play.width.toFixed(2), h: +play.height.toFixed(2) },
    tabs,
    afterContent,
    afterDisplay,
    tablist: document.querySelectorAll('[role="tablist"]').length,
    logs: document.querySelectorAll('[role="log"]').length,
    docScroll: { sh: doc.scrollHeight, ch: doc.clientHeight },
    layoutY: layout ? +layout.y.toFixed(2) : null,
    headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      tag: h.tagName,
      t: (h.textContent || "").trim().slice(0, 40),
    })),
  };
};

async function run(engine, name) {
  const browser = await engine.launch();
  const out = { engine: name, portrait: [], desk: [], landscape: [], short: [] };
  for (const [kind, cells] of [
    ["portrait", PORTRAIT],
    ["desk", DESK],
    ["landscape", [[844, 390], [812, 375], [900, 500]]],
    ["short", [[360, 560], [360, 500], [390, 844], [375, 812], [430, 932]]],
  ]) {
    for (const [w, h] of cells) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      for (const [tag, url] of [["proto", PROTO], ["head", HEAD]]) {
        try {
          await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
          await page.waitForTimeout(SETTLE);
          const m = await page.evaluate(measure);
          out[kind].push({ cell: `${w}x${h}`, tree: tag, ...m });
        } catch (e) {
          out[kind].push({ cell: `${w}x${h}`, tree: tag, error: String(e).slice(0, 200) });
        }
      }
      await ctx.close();
    }
  }
  await browser.close();
  return out;
}

const res = [];
res.push(await run(chromium, "chromium"));
res.push(await run(webkit, "webkit"));
fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
console.log("DONE", OUT);
