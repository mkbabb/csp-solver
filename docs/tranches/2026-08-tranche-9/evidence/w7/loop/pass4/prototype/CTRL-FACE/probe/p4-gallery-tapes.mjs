// T9-W7 pass 4 · CTRL-FACE (COPIED from pass3/probe/p3-gallery-tapes.mjs, OUT re-pointed to pass4/readings) · the gallery π fence, RE-AIMED.
//
// Why this file exists: `p3-gallery.mjs` reads the tape through
// `document.querySelector(".staging-band .washi-tag, .washi-tag")`, which is a
// FALLBACK selector — if the staging band ships no tape, it returns the first
// `.washi-tag` in the document, and on the live-board fold that is the CONTROLS
// CARD's own tape, which this family re-faces BY DESIGN. That is how
// `gallery-pi.log` came to read "8 beyond 0.25" on a row the README calls π.
//
// This probe names every `.washi-tag` / `.washi-label` on the gallery route, with
// the region that owns it, and reads its computed face on BOTH trees. A tape
// outside `.tray-well` that moves is a real π break; a tape inside it is the
// family's own claimed surface.
//
// Run: node p3-gallery-tapes.mjs   (servers: proto 4234, HEAD control 4235)

import { chromium, webkit } from "playwright";

const PIN = "/?view=gallery&size=3&difficulty=MEDIUM";
const TREES = [
  ["proto", "http://127.0.0.1:4234"],
  ["head", "http://127.0.0.1:4235"],
];

const collect = () => {
  const region = (el) => {
    for (let n = el; n; n = n.parentElement) {
      if (n.classList?.contains("tray-well")) return "tray-well (THE CARD)";
      if (n.classList?.contains("staging-band")) return "staging-band";
      if (n.classList?.contains("game-card")) return "game-card (THE DECK)";
      if (n.classList?.contains("sketchbook")) return "sketchbook";
      if (n.classList?.contains("controls-card")) return "controls-card";
      if (n.classList?.contains("game-board")) return "game-board";
    }
    return "(document)";
  };
  return [...document.querySelectorAll(".washi-tag, .washi-label")].map((el, i) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      i,
      region: region(el),
      cls: el.className,
      text: (el.textContent || "").trim().slice(0, 24),
      face: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
      size: +(+cs.fontSize.replace("px", "")).toFixed(4),
      weight: cs.fontWeight,
      transform: cs.textTransform,
      marginTop: cs.marginTop,
      w: +r.width.toFixed(4),
      h: +r.height.toFixed(4),
      x: +r.x.toFixed(4),
      y: +r.y.toFixed(4),
    };
  });
};

const run = async (engine, launcher) => {
  const out = {};
  for (const [tree, base] of TREES) {
    const browser = await launcher.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(base + PIN, { waitUntil: "networkidle" });
    await page.waitForTimeout(900); // the dock sheet SLIDES; settle before measuring
    out[tree] = await page.evaluate(collect);
    await browser.close();
  }
  return out;
};

const key = (t) => `${t.region} | "${t.text}"`;

for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const { proto, head } = await run(engine, launcher);
  console.log(`\n===== ${engine} · ${PIN} · 1280x800 =====`);
  console.log(`tapes: head ${head.length}  proto ${proto.length}`);
  const hm = new Map(head.map((t) => [key(t), t]));
  for (const p of proto) {
    const h = hm.get(key(p));
    if (!h) {
      console.log(`  UNPAIRED proto  ${key(p)}  ${p.face} ${p.size} ${p.weight}`);
      continue;
    }
    const voiceMoved = h.face !== p.face || h.size !== p.size || h.weight !== p.weight;
    const dBox = Math.max(
      Math.abs(h.w - p.w),
      Math.abs(h.h - p.h),
      Math.abs(h.x - p.x),
      Math.abs(h.y - p.y),
    );
    const verdict = voiceMoved
      ? p.region.includes("tray-well")
        ? "CLAIMED (the card)"
        : "*** PI BREAK ***"
      : "pi";
    console.log(
      `  ${verdict.padEnd(20)} ${key(p).padEnd(40)} ` +
        `face ${h.face}/${p.face}  size ${h.size}/${p.size}  wt ${h.weight}/${p.weight}  ` +
        `|dBox| ${dBox.toFixed(4)}`,
    );
  }
}
