/**
 * ACC-FIVE pass 7 · G9 re-cut WITH its negative control (pass-6 critique §3.5; registry-v6 §2.6 row 6).
 *
 * G9 (pass 2's declared term): over the whole 1280×800 viewport after ten hints, the share of chromatic pixels
 * (OKLCH C ≥ 0.05) OUTSIDE the family arc 40–115°, the 240–270° bin excluded (the pen and the ring, owned by
 * the kinship rows). Ceiling 12 %. Pass 6 read dark 15.46–17.55 % and named the dominant off-family bin: 140°,
 * the LEVEL ladder's EASY green (`h2.section-heading` "Level" and its Easy button), identical on the control.
 *
 * THE RE-CUT: the Level section (the `.staged-section` holding the "Level" heading) is EXCLUDED by its painted
 * rect — it is the difficulty ladder's colour, not this family's subject. A re-cut is a re-word unless it
 * ships with the plant that still reds it, so in the SAME run, on the tree, three off-family plants on the
 * family's OWN surfaces, each of which must lift the re-cut term above 12 %:
 *   TRACE  the fill trace stroked a 145° green (`--color-progress-ink`, both themes)
 *   TALLY  the tally's inked strokes stroked the same green
 *   SPARK  the solver sparkle's glow tokens turned violet (the pass-5 accent the family retired)
 * The un-cut term is printed beside, and the excluded pixel count, so the exclusion's size is on the page.
 *
 *   node p7-g9-plant.mjs <tree> <control>
 */
import { chromium, webkit, mintFromControl, assertSameBoard, fillTo, rawOf } from "./p7-lib.mjs";
const [TREE, CTRL] = process.argv.slice(2);
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const ok = (r, g, b) => { const [R, G, B] = [lin(r), lin(g), lin(b)]; const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B); const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s; return { C: Math.hypot(A, Bb), h: ((Math.atan2(Bb, A) * 180) / Math.PI + 360) % 360 }; };
const census = (R, ex) => {
  let chr = 0, off = 0, chrX = 0, offX = 0, excluded = 0;
  for (let y = 0; y < R.h; y++) for (let x = 0; x < R.w; x++) {
    const i = (y * R.w + x) * 4;
    const o = ok(R.data[i], R.data[i + 1], R.data[i + 2]);
    if (o.C < 0.05) continue;
    const isOff = !(o.h >= 240 && o.h <= 270) && !(o.h >= 40 && o.h <= 115);
    chr++; if (isOff) off++;
    if (ex && x >= ex.x && x < ex.x + ex.w && y >= ex.y && y < ex.y + ex.h) { excluded++; continue; }
    chrX++; if (isOff) offX++;
  }
  return { uncut: +((off / Math.max(1, chr)) * 100).toFixed(2), recut: +((offX / Math.max(1, chrX)) * 100).toFixed(2), excluded, chr };
};
const LEVEL = () => {
  const h = [...document.querySelectorAll("h2.section-heading")].find((e) => e.textContent.trim() === "Level");
  const sec = h?.closest(".staged-section") ?? h?.parentElement;
  if (!sec) return null;
  const r = sec.getBoundingClientRect();
  return { x: Math.floor(r.x), y: Math.floor(r.y), w: Math.ceil(r.width), h: Math.ceil(r.height), tag: sec.className.split(" ").slice(0, 2).join(".") };
};
const GREEN = "#2f9e44";
const PLANTS = {
  TRACE: `:root, .dark, html.dark { --color-progress-ink: ${GREEN} !important }`,
  TALLY: `html body .dt-stroke.inked, html body .dt-stroke.inked path { stroke: ${GREEN} !important }`,
  SPARK: `:root, .dark, html.dark { --sparkle-glow-soft: color-mix(in srgb, #8b5cf6 60%, transparent) !important; --sparkle-glow-strong: #8b5cf6 !important }`,
};
const board = await mintFromControl(CTRL);
console.log(`payload ${board.payload.slice(0, 18)}… (${board.givens} givens) · ceiling 12 %`);
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  for (const scheme of ["dark", "light"]) for (const [arm, base] of [["tree", TREE], ["control", CTRL]]) {
    const p = await (await b.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 } })).newPage();
    await p.goto(base + board.query); await p.waitForSelector(".sudoku-cell", { timeout: 60000 }); await p.waitForTimeout(1500);
    await assertSameBoard(p, board.cells);
    const v = await fillTo(p, 25); if (v < 25) throw new Error(`gauge reached only ${v} %`);
    await p.evaluate(() => document.activeElement?.blur?.()); await p.mouse.move(2, 2); await p.waitForTimeout(1500);
    const ex = await p.evaluate(LEVEL);
    const clean = census(await rawOf(await p.screenshot()), ex);
    const verdict = (c) => (c.recut > 12 ? "RED" : "GREEN");
    console.log(`${name} ${scheme} ${arm}: re-cut ${clean.recut}% (${verdict(clean)}) · un-cut ${clean.uncut}% · excluded ${clean.excluded} px of ${clean.chr} chromatic (Level rect ${ex ? `${ex.w}×${ex.h} ${ex.tag}` : "NOT FOUND"})`);
    if (arm === "tree") for (const [pn, css] of Object.entries(PLANTS)) {
      const tag = await p.addStyleTag({ content: css }); await p.waitForTimeout(400);
      const r = census(await rawOf(await p.screenshot()), await p.evaluate(LEVEL));
      console.log(`${name} ${scheme} tree+${pn}: re-cut ${r.recut}% (${r.recut > 12 ? "RED, the plant is seen" : "GREEN — A HOLE"}) · un-cut ${r.uncut}%`);
      await tag.evaluate((e) => e.remove()); await p.waitForTimeout(300);
    }
    await p.context().close();
  }
  await b.close();
}
console.log("ALLDONE");
