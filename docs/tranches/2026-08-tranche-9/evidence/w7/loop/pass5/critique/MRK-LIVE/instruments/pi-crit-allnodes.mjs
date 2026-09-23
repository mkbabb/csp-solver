// CRITIC COPY (pass5/critique/MRK-LIVE): the prototype's pi-p5.COPY.mjs with the `.slice(0, 3)` cap REMOVED —
// LAWS: every element of a selector. Nothing else changed.
// COPY of pass4/critique/MRK-LIVE/probe/critic-pi.mjs, re-pointed for T9-W7 pass 5 · MRK-LIVE.
// What changed, each for a law: (1) a REAL `?board=` payload minted with the app's codec (the
// critic's `?board=1` pinned nothing — chair addendum); both arms' given-sets are read back and
// compared; (2) PROD vs PROD — the lane's own built dist beside the chair's control dist (LAWS P4:
// one rendering mode); (3) the census DRIVES the surface — a load read, the deck opened, and the
// dark theme — instead of reading at load alone; (4) the π NEGATIVE CONTROL in the same run:
// control vs control, a second context on the same control URL, so the noise floor is printed
// beside the delta. Computed PAINT properties + tag names, every element of a selector (≤ 3).
// usage: node pi-p5.COPY.mjs <laneURL> <controlURL> <out.json>
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const [, , LANE, CTRL, OUT] = process.argv;
const PROPS = [
  "color", "fill", "stroke", "fillOpacity", "strokeOpacity", "strokeWidth", "font", "lineHeight",
  "backgroundColor", "opacity", "outlineStyle", "outlineWidth", "boxShadow", "filter", "display", "visibility",
];
const SELECTORS = [
  "button.logo-trigger", ".sun-moon-toggle", ".drawer-tab", "[role=grid]", "main", ".game-cell",
  ".cell-ghost-path", ".cell-native-input", ".ctrl-btn", ".icon-btn", ".info-btn", "header", "footer",
  ".game-board", ".glyph-svg", ".controls-card", ".action-bar", "path.cell-line",
];
const DECK = [".gallery-viewport", ".game-card", ".game-card.is-center", ".staging-btn", ".staging-face", ".game-card-underline"];

function mint(sub) {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const i = r * n + c; const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1;
    cells += ((i > 1 && (r * 7 + c * 3) % 5 < 2) ? v : 0).toString(36);
  }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
const PAYLOAD = mint(3);

const read = (page, sels) => page.evaluate(({ sels, PROPS }) => {
  const rows = [];
  for (const sel of sels) {
    const els = Array.from(document.querySelectorAll(sel));
    if (!els.length) rows.push({ key: sel + "#missing", tag: null, paint: null, rect: null });
    els.forEach((e, i) => {
      const c = getComputedStyle(e); const r = e.getBoundingClientRect(); const paint = {};
      for (const p of PROPS) paint[p] = c[p];
      rows.push({ key: sel + "#" + i, tag: e.tagName.toLowerCase(), paint, rect: [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)] });
    });
  }
  return rows;
}, { sels, PROPS });

async function census(page, url) {
  await page.goto(url + "/?size=3&board=" + PAYLOAD);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1800);
  const given = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => i.value || "0").join(""));
  const light = await read(page, SELECTORS);
  await page.locator("button.logo-trigger").click();
  await page.waitForSelector(".gallery-viewport", { timeout: 15000 });
  await page.waitForTimeout(1500);
  const deck = await read(page, DECK);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1200);
  await page.evaluate(() => { const t = document.querySelector(".sun-moon-toggle"); t?.focus(); });
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"), null, { timeout: 10000 });
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(1800);
  const dark = await read(page, SELECTORS);
  return { given, rows: [...light.map((r) => ({ ...r, key: "light " + r.key })), ...deck.map((r) => ({ ...r, key: "deck " + r.key })), ...dark.map((r) => ({ ...r, key: "dark " + r.key }))] };
}

function diff(a, b) {
  const byKey = Object.fromEntries(b.rows.map((r) => [r.key, r]));
  const deltas = []; let maxRect = 0;
  for (const r of a.rows) {
    const c = byKey[r.key];
    if (!c) { deltas.push({ key: r.key, why: "absent on other" }); continue; }
    if (r.tag !== c.tag) deltas.push({ key: r.key, prop: "tag", a: r.tag, b: c.tag });
    if (r.paint && c.paint) for (const p of PROPS) if (r.paint[p] !== c.paint[p]) deltas.push({ key: r.key, prop: p, a: r.paint[p], b: c.paint[p] });
    if (r.rect && c.rect) maxRect = Math.max(maxRect, ...r.rect.map((v, i) => Math.abs(v - c.rect[i])));
  }
  return { nodes: a.rows.length, paintDeltas: deltas.length, maxRectDelta: +maxRect.toFixed(2), sameBoard: a.given === b.given, deltas };
}

const out = { payload: PAYLOAD, lane: LANE, control: CTRL };
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  const mk = async () => (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  const lane = await census(await mk(), LANE);
  const c1 = await census(await mk(), CTRL);
  const c2 = await census(await mk(), CTRL);
  out[name] = { laneVsControl: diff(lane, c1), controlVsControl: diff(c2, c1), givens: lane.given.replace(/0/g, "").length };
  await b.close();
  console.log(name, "lane-vs-control", out[name].laneVsControl.paintDeltas, out[name].laneVsControl.maxRectDelta, "ctl-vs-ctl", out[name].controlVsControl.paintDeltas, out[name].controlVsControl.maxRectDelta, "sameBoard", out[name].laneVsControl.sameBoard);
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("DONE");
