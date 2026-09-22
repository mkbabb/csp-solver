// T9-W7 pass 4 · CTRL-FACE — the CRITIC's fourth instrument: THE DECK'S CHIPS.
// `OptionSelector.vue` is a SHARED component and this slice edited it — a new `.ctrl-word` span,
// the 6px of scribble room moved from the button's padding onto the span, and the scribble's own
// rules re-pointed at the span. The comment claims "this component's own deck paints
// byte-for-byte". The lane's own gallery-π instrument measured TAPES and TOOLTIPS. This measures
// the CHIPS: box, padding, painted face, and the scribble mark's painted extent.
// proto DEV 4240 vs control DEV 4241 (same rendering mode on both arms).

import { chromium, webkit } from "playwright";

const TREES = [
  ["proto", "http://127.0.0.1:4240"],
  ["head", "http://127.0.0.1:4241"],
];

const read = () => {
  const px = (n) => Math.round(n * 1000) / 1000;
  const band = document.querySelector(".staging-band");
  if (!band) return null;
  return [...band.querySelectorAll(".ctrl-btn")]
    .filter((b) => b.getClientRects().length)
    .map((b) => {
      const s = getComputedStyle(b);
      const r = b.getBoundingClientRect();
      // The mark hangs off the button at HEAD and off the span on the prototype — read whichever
      // box actually carries the background image.
      const word = b.querySelector(".ctrl-word");
      const ms = word ? getComputedStyle(word) : s;
      const mr = word ? word.getBoundingClientRect() : r;
      return {
        text: b.textContent.trim(),
        box: [px(r.x), px(r.y), px(r.width), px(r.height)],
        pad: `${s.paddingTop}/${s.paddingRight}/${s.paddingBottom}/${s.paddingLeft}`,
        face: `${s.fontFamily.split(",")[0].replace(/["']/g, "")}·${px(parseFloat(s.fontSize))}·${s.fontWeight}`,
        markHost: word ? ".ctrl-word" : ".ctrl-btn",
        markBox: [px(mr.x), px(mr.y), px(mr.width), px(mr.height)],
        markImage: ms.backgroundImage === "none" ? "none" : "image",
        markSize: ms.backgroundSize,
        markOrigin: ms.backgroundOrigin,
        markPos: ms.backgroundPosition,
        markPadB: ms.paddingBottom,
      };
    });
};

for (const [engine, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const out = {};
  for (const [tree, base] of TREES) {
    const b = await L.launch();
    const c = await b.newContext({ viewport: { width: 1280, height: 800 }, baseURL: base });
    const p = await c.newPage();
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto("/?view=gallery&size=3&difficulty=MEDIUM", { waitUntil: "networkidle" });
    await p.waitForSelector("svg.handwritten-logo", { timeout: 25000 });
    await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
    await p.waitForTimeout(900);
    out[tree] = await p.evaluate(read);
    await b.close();
  }
  console.log(`\n== DECK CHIPS · ${engine} ==`);
  if (!out.proto || !out.head) {
    console.log("  band missing");
    continue;
  }
  for (const a of out.proto) {
    const h = out.head.find((x) => x.text === a.text);
    if (!h) {
      console.log(`  "${a.text}" on proto only`);
      continue;
    }
    const d = a.box.map((v, i) => Math.round((v - h.box[i]) * 10000) / 10000);
    console.log(
      `  "${a.text}" dBOX ${JSON.stringify(d)} | proto pad ${a.pad} host ${a.markHost} markBox ${JSON.stringify(a.markBox)} size ${a.markSize} padB ${a.markPadB} img ${a.markImage}`,
    );
    console.log(
      `      head  pad ${h.pad} host ${h.markHost} markBox ${JSON.stringify(h.markBox)} size ${h.markSize} padB ${h.markPadB} img ${h.markImage}`,
    );
  }
}
console.log("DONE-D");
