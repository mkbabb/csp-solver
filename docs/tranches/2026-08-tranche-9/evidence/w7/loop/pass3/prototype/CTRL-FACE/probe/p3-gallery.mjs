/** T9-W7 pass 3 · CTRL-FACE · the deck (π: the wave does not claim it). */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const [BASE, OUT] = process.argv.slice(2);
const CELLS = [
  { id: "1280f", w: 1280, h: 800, coarse: false },
  { id: "390f", w: 390, h: 844, coarse: false },
  { id: "900x500c", w: 900, h: 500, coarse: true },
  { id: "768x1024c", w: 768, h: 1024, coarse: true },
];

const PROBE = () => {
  const px = (n) => Math.round(n * 10000) / 10000;
  const box = (el) => {
    const r = el.getBoundingClientRect();
    return { x: px(r.x), y: px(r.y), w: px(r.width), h: px(r.height) };
  };
  const voice = (el) => {
    const s = getComputedStyle(el);
    return [
      s.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px(parseFloat(s.fontSize)),
      s.fontWeight,
      s.textTransform,
    ].join(" · ");
  };
  const band = document.querySelector(".staging-band, .staging-axis")?.closest("*");
  const labels = [...document.querySelectorAll(".staging-axis-label")];
  const chips = [...document.querySelectorAll(".staging-axis .ctrl-btn")];
  const tape = document.querySelector(".staging-band .washi-tag, .washi-tag");
  const card = document.querySelector(".sketch-card, .gallery-card, [class*='card']");
  const marked = chips.filter((c) => {
    const w = c.querySelector(".ctrl-word");
    return w && getComputedStyle(w).backgroundImage !== "none";
  });
  return {
    band: band ? box(band) : null,
    labels: labels.map((l) => ({ t: l.textContent.trim(), b: box(l), v: voice(l) })),
    chips: chips.map((c) => {
      const w = c.querySelector(".ctrl-word");
      const ws = w ? getComputedStyle(w) : null;
      return {
        t: c.textContent.trim(),
        b: box(c),
        v: voice(c),
        wordB: w ? box(w) : null,
        markSize: ws ? ws.backgroundSize : null,
        markPos: ws ? ws.backgroundPosition : null,
        markPad: ws ? ws.paddingLeft + "/" + ws.paddingRight + "/" + ws.paddingBottom : null,
        markMargin: ws ? ws.marginLeft + "/" + ws.marginRight : null,
        painted: ws ? ws.backgroundImage !== "none" : null,
      };
    }),
    tape: tape ? { t: tape.textContent.trim(), b: box(tape), v: voice(tape), m: getComputedStyle(tape).margin } : null,
    firstCardY: card ? px(card.getBoundingClientRect().y) : null,
    markedCount: marked.length,
  };
};

async function run(engine, name) {
  const b = await engine.launch();
  const rows = [];
  for (const c of CELLS) {
    const ctx = await b.newContext({
      viewport: { width: c.w, height: c.h },
      hasTouch: c.coarse,
      isMobile: c.coarse && name === "chromium",
      deviceScaleFactor: 2,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const p = await ctx.newPage();
    try {
      await p.goto(`${BASE}/?view=gallery&size=3&difficulty=MEDIUM`, { waitUntil: "load", timeout: 30000 });
      await p.waitForSelector(".staging-axis-label, .staging-axis", { timeout: 25000 });
      await p.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
      await p.waitForTimeout(900);
      rows.push({ engine: name, cell: c.id, ...(await p.evaluate(PROBE)) });
    } catch (e) {
      rows.push({ engine: name, cell: c.id, err: String(e).slice(0, 200) });
    }
    await ctx.close();
  }
  await b.close();
  return rows;
}

const all = [...(await run(chromium, "chromium")), ...(await run(webkit, "webkit"))];
writeFileSync(OUT, all.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log(`${all.length} rows -> ${OUT}`);
for (const r of all)
  console.log(
    `${r.engine} ${r.cell}: ${r.err ?? `labels=${r.labels?.length} chips=${r.chips?.length} marked=${r.markedCount} tape=${r.tape?.t}`}`,
  );
