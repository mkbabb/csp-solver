/**
 * MRK-ABS pass-1 · THE EYE — the static page the family is built to be killed by.
 *
 * Emits `ring-crop.html`: a self-contained page drawing, at the TRUE measured px sizes of this
 * tree, a 2×2 patch of board per size with the product's own rules, and the selection ring on
 * the top-left cell — HEAD's ring beside the length-compensated one. Every path comes from the
 * product's library (`@mkbabb/pencil-boil` `wobbleRect` / `boilLineFrames`) with the product's
 * own parameters:
 *   - cell rules  roughness 0.4, segments 4, seed `42 + 100 + i`, span [26, 974]
 *                                                              (gridPaths.ts:478-497)
 *   - the ring    `wobbleRect(x, y, cellSize, cellSize, {roughness, segments,
 *                 seed: 42+500+pos*7, jagged: true})`           (gridPaths.ts:59-67)
 *   - the ring's svg viewBox is the cell padded 15% each side   (useGameCell.ts:86-97)
 *   - stroke 7 units, #3a7bc4, opacity 0.9, fill 0.08           (gameCell.css:245-252)
 *   - rule stroke 5 units, `--grid-line-color`                  (HandDrawnGrid.vue:363-366)
 *   - px-per-unit MEASURED on this tree, per size               (logs/scale-desktop-*.json)
 *
 * Compensated roughness = `target / (cellSize × 0.015 × k × pxPerUnit)`, k = 0.3241 at
 * segments 4 pooled over the three sizes (logs/k-segments.json). The rules pane is CLIPPED to
 * the patch; the ring's svg is `overflow: visible` exactly as `DigitCell.vue:414` has it, so a
 * ring that leaves its cell is visible leaving it.
 *
 * Run: node ring-crop.mjs > ring-crop.html
 */
const LIB =
  process.env.PENCIL_BOIL ??
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@mkbabb/pencil-boil/dist/path.js";
const { wobbleRect, wobbleLine } = await import(LIB);

const GHOST_SCALE = { 4: 0.3169, 9: 0.4892, 16: 0.4892 }; // MEASURED
const BOARD_SCALE = { 4: 0.412, 9: 0.636, 16: 0.636 }; // MEASURED
const CELL_PX = { 4: 103.0, 9: 70.6563, 16: 39.75 }; // MEASURED
const K4 = 0.3241; // logs/k-segments.json
const TARGET = 1.443; // the mark rung (grid rule σ, R3-census)
const FLOOR = 0.85; // the band floor rung — the most 16×16 can carry without leaving its cell
const HEAD_SIGMA = { 4: 0.151, 9: 0.105, 16: 0.042 }; // logs/k-constant.json, all cells
const CARD = "hsl(48 12% 99%)";
const GRID = "hsl(0 0% 15%)";
const RING = "#3a7bc4";

/** The patch: cells (0,0)…(1,1) of the board, so the rules at i=1 bound the ring's cell. */
function panel(n, roughness, segments, label) {
  const cellSize = 1000 / n;
  const cellPx = CELL_PX[n];
  const W = cellPx * 2;
  const v = wobbleLine(cellSize, 26, cellSize, 974, { roughness: 0.4, segments: 4, seed: 142, jagged: true });
  const h = wobbleLine(26, cellSize, 974, cellSize, { roughness: 0.4, segments: 4, seed: 152, jagged: true });
  const pad = cellSize * 0.15;
  const ring = wobbleRect(0, 0, cellSize, cellSize, {
    roughness,
    segments,
    seed: 42 + 500 + 0 * 7,
    jagged: true,
  });
  return `<figure class="panel">
    <div class="patch" style="width:${W}px;height:${W}px">
      <svg class="rules" viewBox="0 0 ${cellSize * 2} ${cellSize * 2}" width="${W}" height="${W}"
           preserveAspectRatio="xMidYMid meet">
        <path d="${v}" fill="none" stroke="${GRID}" stroke-width="5" stroke-opacity="0.72" stroke-linecap="round"/>
        <path d="${h}" fill="none" stroke="${GRID}" stroke-width="5" stroke-opacity="0.72" stroke-linecap="round"/>
      </svg>
      <svg class="ghost" viewBox="${-pad} ${-pad} ${cellSize + pad * 2} ${cellSize + pad * 2}"
           width="${cellPx}" height="${cellPx}" preserveAspectRatio="xMidYMid meet">
        <path d="${ring}" fill="${RING}" fill-opacity="0.08" stroke="${RING}" stroke-width="7"
              stroke-opacity="0.9" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <figcaption>${label}</figcaption>
  </figure>`;
}

const rows = [4, 9, 16]
  .map((n) => {
    const cellSize = 1000 / n;
    const roughRung = TARGET / (cellSize * 0.015 * K4 * GHOST_SCALE[n]);
    const roughFloor = FLOOR / (cellSize * 0.015 * K4 * GHOST_SCALE[n]);
    return `<div class="row">
      <div class="rowlabel">${n}x${n}<br><small>cell ${CELL_PX[n].toFixed(1)}px</small></div>
      ${panel(n, 0.4, n >= 16 ? 2 : 4, `head\n\u03c3 ${HEAD_SIGMA[n]}px`)}
      ${panel(n, roughFloor, 4, `floor r${roughFloor.toFixed(1)}\n\u03c3 ${FLOOR}px`)}
      ${panel(n, roughRung, 4, `rung  r${roughRung.toFixed(1)}\n\u03c3 ${TARGET}px`)}
    </div>`;
  })
  .join("");

console.log(`<!doctype html>
<html><head><meta charset="utf-8"><title>ring crop</title>
<style>
  html,body{margin:0;padding:0;background:${CARD};font:11px/1.25 ui-sans-serif,system-ui,sans-serif;color:#444}
  #crop{display:inline-block;padding:12px 14px 10px;background:${CARD}}
  .row{display:flex;align-items:flex-start;gap:26px;margin-bottom:14px}
  .rowlabel{width:58px;text-align:right;color:#777;padding-top:2px}
  .panel{margin:0}
  .patch{position:relative;background:${CARD}}
  .rules{position:absolute;left:0;top:0;overflow:hidden}
  .ghost{position:absolute;left:0;top:0;overflow:visible}
  figcaption{margin-top:3px;color:#888;font-size:9.5px;white-space:pre}
</style></head>
<body><div id="crop">${rows}</div></body></html>`);
