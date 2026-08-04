// T8-W3 Lane B — THE DECK GEOMETRY PROBE.
// Measures, per width and per snap index: the frame box, the slot width, --edge, maxScroll,
// how many WHOLE cards the frame shows, the centre face size, the depth grade, and the deck's
// node count. Both engines. No fixed sleeps — every wait is a predicate.
//
// usage: node deck-probe.mjs <label> [port]
import { chromium, webkit } from "@playwright/test";
import fs from "node:fs";

const LABEL = process.argv[2] ?? "run";
const PORT = process.argv[3] ?? "4231";
const BASE = `http://127.0.0.1:${PORT}/`;
const WIDTHS = [1024, 1280, 1808, 1920];
const OUT = new URL(".", import.meta.url).pathname;

/** AT REST — the track still AND every card's own 440ms depth/chime transition landed. The
 *  first cut of this probe read the depth mid-settle and reported the tween, not the pose. */
async function settled(page) {
  await page.waitForFunction(
    () => {
      const t = document.querySelector(".gallery-track");
      const vp = document.querySelector(".gallery-viewport");
      if (!t || !vp || document.fonts.status !== "loaded") return false;
      if (Math.abs(new DOMMatrixReadOnly(getComputedStyle(t).transform).m41) > 0.5)
        return false;
      const pose = [...document.querySelectorAll(".game-card")]
        .map((c) => {
          const s = getComputedStyle(c);
          return `${new DOMMatrixReadOnly(s.transform).a.toFixed(3)}:${(+s.opacity).toFixed(3)}`;
        })
        .join("|");
      const face = document.querySelector(".game-card.is-center .game-card-face");
      const fw = face ? face.getBoundingClientRect().width.toFixed(2) : "0";
      const now = `${t.scrollWidth}|${Math.round(vp.scrollLeft)}|${pose}|${fw}`;
      const w = window;
      const prev = w.__deck;
      w.__deck = now;
      return prev === now;
    },
    null,
    { timeout: 20000 },
  );
}

const read = () =>
  // eslint-disable-next-line no-undef
  ({
    ...(() => {
      const vp = document.querySelector(".gallery-viewport");
      const track = document.querySelector(".gallery-track");
      const slots = [...track.children];
      const vr = vp.getBoundingClientRect();
      const cards = [...document.querySelectorAll(".game-card")];
      const boxes = cards.map((c) => c.getBoundingClientRect());
      const whole = boxes.filter((b) => b.left >= vr.left - 0.5 && b.right <= vr.right + 0.5);
      const partial = boxes.filter(
        (b) => b.right > vr.left + 0.5 && b.left < vr.right - 0.5,
      );
      const face = document.querySelector(".game-card.is-center .game-card-face");
      return {
        frame: Math.round(vr.width),
        slot: Math.round(slots[1].getBoundingClientRect().width),
        edge: getComputedStyle(track).getPropertyValue("--edge").trim(),
        slotsVar: getComputedStyle(vp).getPropertyValue("--deck-slots").trim(),
        maxScroll: Math.round(vp.scrollWidth - vp.clientWidth),
        scrollLeft: Math.round(vp.scrollLeft),
        whole: whole.length,
        shown: partial.length,
        airL: Math.round(vr.left),
        centreFace: face ? Math.round(face.getBoundingClientRect().width) : null,
        depth: cards.map((c) => {
          const s = getComputedStyle(c);
          const m = new DOMMatrixReadOnly(s.transform);
          return `${m.a.toFixed(2)}/${(+s.opacity).toFixed(2)}`;
        }),
        deckNodes: document.querySelector(".game-gallery").querySelectorAll("*").length,
      };
    })(),
  });

async function probe(engine, name) {
  const browser = await engine.launch();
  const rows = [];
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(BASE + "?view=gallery&size=3&difficulty=EASY");
    await page.waitForSelector(".game-gallery", { timeout: 30000 });
    await page.waitForSelector("#gallery-card-0 .boil-pose", { timeout: 30000 });
    await settled(page);
    for (let i = 0; i < 5; i++) {
      if (i > 0) {
        await page.locator(".gallery-viewport").press("ArrowRight");
        await page.waitForFunction(
          (n) =>
            document.querySelector(".gallery-viewport").getAttribute("aria-activedescendant") ===
            `gallery-card-${n}`,
          i,
          { timeout: 10000 },
        );
        await settled(page);
      }
      rows.push({ engine: name, width, index: i, ...(await page.evaluate(read)) });
    }
    await page.close();
  }
  await browser.close();
  return rows;
}

const rows = [...(await probe(chromium, "chromium")), ...(await probe(webkit, "webkit"))];
fs.writeFileSync(OUT + `deck-${LABEL}.json`, JSON.stringify(rows, null, 2));

const pad = (s, n) => String(s).padEnd(n);
console.log(
  pad("engine", 9) + pad("w", 6) + pad("idx", 5) + pad("frame", 7) + pad("slot", 6) +
    pad("edge", 8) + pad("slots", 7) + pad("maxScr", 8) + pad("whole", 7) + pad("shown", 7) +
    pad("airL", 6) + pad("face", 6) + pad("nodes", 7) + "depth",
);
for (const r of rows)
  console.log(
    pad(r.engine, 9) + pad(r.width, 6) + pad(r.index, 5) + pad(r.frame, 7) + pad(r.slot, 6) +
      pad(r.edge, 8) + pad(r.slotsVar || "-", 7) + pad(r.maxScroll, 8) + pad(r.whole, 7) +
      pad(r.shown, 7) + pad(r.airL, 6) + pad(r.centreFace ?? "-", 6) + pad(r.deckNodes, 7) +
      r.depth.join(" "),
  );
