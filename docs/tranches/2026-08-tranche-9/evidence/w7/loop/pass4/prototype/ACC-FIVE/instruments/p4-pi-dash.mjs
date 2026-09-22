/**
 * ACC-FIVE pass 4 · π IDENTITY against the named control, and the DASH SURVIVOR census.
 *
 * π (charter row 10): prototype dist :4238 vs the shared read-only HEAD control
 * `.claude/worktrees/w7-control` at `74a2b5d9`, served :4237 (identity `index-CubiZsMVSwTc.js`).
 * BOTH ARMS ARE PREVIEWS OF A BUILT DIST — a dev server against a preview would compare two
 * build modes, not two trees. Both deal the SAME board (`?board=`). The census reads computed
 * PAINT properties and tag names, not rects alone (LAWS §Constraints), and the rect beside them.
 *
 * DASH SURVIVORS (charter row 7): `DifficultyTally`'s comment claimed ONE grammar for a drawn
 * front estate-wide and the estate still dashes in four other places. This counts, on the
 * rendered surface, the polyline SEGMENTS of every element whose own computed `stroke-dasharray`
 * is not `none` — against the ~128-segment boundary at which WebKit restarts a polyline's dash
 * phase. A survivor under the boundary is safe today and the number says by how much.
 *
 *   node p4-pi-dash.mjs <protoUrl> <controlUrl> <outdir>
 */
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const PROTO = process.argv[2] ?? "http://127.0.0.1:4238";
const CTRL = process.argv[3] ?? "http://127.0.0.1:4237";
const OUT = process.argv[4] ?? ".";
mkdirSync(OUT, { recursive: true });

/**
 * BOTH ARMS DEAL THE SAME BOARD (chair §2 — LADDER/LEDGER's confound, and this instrument's own
 * first run walked into it: `?size=3&difficulty=EASY` deals a RANDOM template, so 31–40 "rect
 * diffs" were two different puzzles' given digits, not a moved pixel). The board is read off the
 * control once and re-encoded in the app's own wire grammar (`e2e/wire.ts`: base64url of
 * `\x01` + `<size>.<base36 cells>`), then both arms are pinned to it.
 */
const encodeBoard = (size, cells, total) => {
  let c = "";
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  const body = String.fromCharCode(1) + `${size}.${c}`;
  return Buffer.from(body, "latin1")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const READ_GIVENS = () => {
  const out = {};
  document.querySelectorAll(".sudoku-cell").forEach((cell, i) => {
    const input = cell.querySelector("input");
    // read at REST, before any act: every filled cell is a given
    const v = input?.value ?? "";
    if (v) out[i] = Number(v);
  });
  return out;
};

const PAINT = [
  "color",
  "backgroundColor",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing",
  "borderTopWidth",
  "borderTopColor",
  "opacity",
  "stroke",
  "strokeWidth",
  "fill",
];

const CENSUS = (paintKeys) => {
  const out = [];
  const path = (el) => {
    const bits = [];
    let n = el;
    while (n && n !== document.body && bits.length < 6) {
      const p = n.parentElement;
      const i = p ? [...p.children].indexOf(n) : 0;
      bits.unshift(`${n.tagName.toLowerCase()}[${i}]`);
      n = p;
    }
    return bits.join(">");
  };
  document.querySelectorAll("*").forEach((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const paint = {};
    for (const k of paintKeys) paint[k] = cs[k];
    out.push({
      key: path(el),
      tag: el.tagName.toLowerCase(),
      cls: el.getAttribute("class") ?? "",
      rect: [
        Math.round(r.x * 10) / 10,
        Math.round(r.y * 10) / 10,
        Math.round(r.width * 10) / 10,
        Math.round(r.height * 10) / 10,
      ],
      paint,
    });
  });
  return out;
};

const DASH = () => {
  const rows = [];
  document.querySelectorAll("*").forEach((el) => {
    const cs = getComputedStyle(el);
    const attr = el.getAttribute?.("stroke-dasharray");
    const pl = el.getAttribute?.("pathLength");
    const dash = cs.strokeDasharray;
    // a `pathLength` normalisation is the dash grammar's other half — a surface carrying it is
    // a survivor even when its dash is only declared for the draw-on window.
    if ((!dash || dash === "none") && !attr && !pl) return;
    if (cs.display === "none") return;
    const d = el.getAttribute?.("d") ?? "";
    const segs = (d.match(/[LlHhVvCcSsQqTtAa]/g) ?? []).length;
    rows.push({
      tag: el.tagName.toLowerCase(),
      cls: el.getAttribute("class") ?? "",
      dash,
      attrDash: attr ?? null,
      pathLength: el.getAttribute?.("pathLength") ?? null,
      segments: segs,
      host: (() => {
        let n = el;
        while (n && n !== document.body) {
          const c = n.getAttribute?.("class") ?? "";
          if (/digit|glyph|scribble|laminate|tally|cage|heart|icon|grid/i.test(c)) return c;
          n = n.parentElement;
        }
        return "";
      })(),
    });
  });
  return rows;
};

// one board, read off the control, used by every cell below
let BOARD = "";
{
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto(CTRL + "/?size=3&difficulty=EASY");
  await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await p.waitForTimeout(2500);
  const givens = await p.evaluate(READ_GIVENS);
  BOARD = "/?size=3&board=" + encodeBoard(3, givens, 81);
  console.log(`pinned board: ${Object.keys(givens).length} givens, param ${BOARD.length} chars`);
  await b.close();
}

const report = {};
for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const grab = async (url) => {
      const ctx = await browser.newContext({
        colorScheme: scheme,
        reducedMotion: "reduce",
        viewport: { width: 1280, height: 800 },
      });
      const page = await ctx.newPage();
      await page.goto(url + BOARD);
      await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
      await page.waitForTimeout(2500);
      // three HINTS: the player's own digits render, so the glyph/DigitCell dash survivors are
      // on the surface when the census runs (at rest they are not).
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => {
          const b = document.querySelector('[aria-label*="Hint" i]');
          if (b && !b.disabled) b.click();
        });
        await page.waitForTimeout(250);
      }
      await page.evaluate(() => document.activeElement?.blur?.());
      await page.waitForTimeout(1200);
      const census = await page.evaluate(CENSUS, PAINT);
      const dash = await page.evaluate(DASH);
      await ctx.close();
      return { census, dash };
    };
    const a = await grab(PROTO);
    const b = await grab(CTRL);

    const byKey = (rows) => new Map(rows.map((r) => [r.key + "|" + r.cls, r]));
    const A = byKey(a.census);
    const B = byKey(b.census);
    const paintDiffs = [];
    const rectDiffs = [];
    let shared = 0;
    for (const [k, ra] of A) {
      const rb = B.get(k);
      if (!rb) continue;
      shared++;
      for (const p of PAINT)
        if (ra.paint[p] !== rb.paint[p])
          paintDiffs.push({ key: k, prop: p, proto: ra.paint[p], control: rb.paint[p] });
      for (let i = 0; i < 4; i++)
        if (Math.abs(ra.rect[i] - rb.rect[i]) > 0.5) {
          rectDiffs.push({ key: k, proto: ra.rect, control: rb.rect });
          break;
        }
    }
    report[`${name}/${scheme}`] = {
      nodesProto: a.census.length,
      nodesControl: b.census.length,
      sharedKeys: shared,
      onlyProto: [...A.keys()].filter((k) => !B.has(k)).length,
      onlyControl: [...B.keys()].filter((k) => !A.has(k)).length,
      paintDiffCount: paintDiffs.length,
      rectDiffCount: rectDiffs.length,
      paintDiffs: paintDiffs.slice(0, 60),
      rectDiffs: rectDiffs.slice(0, 40),
      dashProto: a.dash,
      dashControl: b.dash,
    };
    console.log(
      `${name}/${scheme}: nodes ${a.census.length} vs ${b.census.length}, shared ${shared}, ` +
        `only-proto ${report[`${name}/${scheme}`].onlyProto}, only-control ${report[`${name}/${scheme}`].onlyControl}, ` +
        `paint diffs ${paintDiffs.length}, rect diffs ${rectDiffs.length}, dash rows ${a.dash.length} vs ${b.dash.length}`,
    );
  }
  await browser.close();
}
writeFileSync(`${OUT}/pi-dash.json`, JSON.stringify(report, null, 2));
