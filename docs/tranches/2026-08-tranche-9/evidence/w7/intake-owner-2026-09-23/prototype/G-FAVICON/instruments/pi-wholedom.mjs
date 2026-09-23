// G-FAVICON lane copy of MRK-LIVE's pi-p6-wholedom.mjs (pass 6), one change: REGIME=coarse runs 390x844
// hasTouch+isMobile and prints matchMedia('(pointer: coarse)') as the regime's witness; fine = 1280x800 as banked.
// T9-W7 pass 6 · MRK-LIVE · π, WHOLE-DOM (LAWS P5): every element of the document, keyed by
// SEMANTIC ANCESTRY (tag + role + first authored class per level, never the full class chain or a
// data-v hash), 16 computed PAINT properties + tag names, lane dist vs control dist, one real
// `?board=` payload (given-set read back by aria-label), and the control-vs-control floor in the
// same run. The census DRIVES the surface: board at load (light), the deck opened, the board dark.
// Deltas inside `.focus-ring` (the claimed surface: the drawn ring itself) are classed apart.
// usage: [PRM=1] node pi-p6-wholedom.mjs <laneURL> <controlURL> <summary.txt>   (PRM=1 parks the boil)
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const [, , LANE, CTRL, OUT] = process.argv;
const PROPS = ["color", "fill", "stroke", "fillOpacity", "strokeOpacity", "strokeWidth", "font", "lineHeight",
  "backgroundColor", "opacity", "outlineStyle", "outlineWidth", "boxShadow", "filter", "display", "visibility"];
function mint(sub) {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const i = r * n + c; const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1;
    cells += ((i > 1 && (r * 7 + c * 3) % 5 < 2) ? v : 0).toString(36);
  }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
const PAYLOAD = mint(3);
const read = (page) => page.evaluate((PROPS) => {
  const rows = [];
  const seg = (e) => {
    const cls = [...e.classList].find((c) => !c.startsWith("data-v")) ?? "";
    return e.tagName.toLowerCase() + (e.getAttribute("role") ? `[${e.getAttribute("role")}]` : "") + (cls ? "." + cls : "");
  };
  const walk = (e, path) => {
    const counts = new Map();
    for (const k of e.children) {
      const s = seg(k); const n = counts.get(s) ?? 0; counts.set(s, n + 1);
      const key = path + ">" + s + (n ? `:${n}` : "");
      const c = getComputedStyle(k); const paint = {};
      for (const p of PROPS) paint[p] = c[p];
      rows.push({ key, tag: k.tagName.toLowerCase(), paint, ring: !!k.closest(".focus-ring") });
      walk(k, key);
    }
  };
  walk(document.documentElement, "html");
  const given = [...document.querySelectorAll(".game-cell [aria-label]")].map((x) => x.getAttribute("aria-label")).join("|");
  return { rows, given };
}, PROPS);
async function census(page, url) {
  await page.goto(url + "/?size=3&board=" + PAYLOAD);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1800);
  const light = await read(page);
  await page.locator("button.logo-trigger").click();
  await page.waitForSelector(".gallery-viewport", { timeout: 15000 });
  await page.waitForTimeout(1500);
  const deck = await read(page);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1200);
  await page.evaluate(() => document.querySelector(".sun-moon-toggle")?.focus());
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"), null, { timeout: 10000 });
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(1800);
  const dark = await read(page);
  const tag = (p, s) => s.rows.map((r) => ({ ...r, key: p + " " + r.key }));
  return { given: light.given, rows: [...tag("light", light), ...tag("deck", deck), ...tag("dark", dark)] };
}
function diff(a, b) {
  const byKey = new Map(b.rows.map((r) => [r.key, r]));
  const aKeys = new Set(a.rows.map((r) => r.key));
  const out = { nodes: a.rows.length, other: b.rows.length, paint: [], onlyHere: [], onlyThere: [], ring: 0 };
  for (const r of a.rows) {
    const c = byKey.get(r.key);
    if (!c) { (r.ring ? out.ring++ : out.onlyHere.push(r.key)); continue; }
    if (r.tag !== c.tag) out.paint.push(`${r.key} tag ${r.tag}≠${c.tag}`);
    for (const p of PROPS) if (r.paint[p] !== c.paint[p]) (r.ring || c.ring ? out.ring++ : out.paint.push(`${r.key} ${p}: ${r.paint[p]} ≠ ${c.paint[p]}`));
  }
  for (const r of b.rows) if (!aKeys.has(r.key) && !r.ring) out.onlyThere.push(r.key);
  out.sameBoard = a.given === b.given; out.givens = a.given.split("|").filter(Boolean).length;
  return out;
}
const lines = [`PRM ${process.env.PRM === "1" ? "reduce (boil parked)" : "no-preference"}`, `payload ${PAYLOAD}`, `lane ${LANE} · control ${CTRL}`];
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  const COARSE = process.env.REGIME === "coarse";
  const mk = async () => { const p = await (await b.newContext({ viewport: COARSE ? { width: 390, height: 844 } : { width: 1280, height: 800 }, ...(COARSE ? { hasTouch: true, isMobile: name === "chromium" } : {}), reducedMotion: process.env.PRM === "1" ? "reduce" : "no-preference" })).newPage(); return p; };
  { const w = await mk(); await w.goto(CTRL); lines.push(`${name} regime ${COARSE ? "coarse 390x844" : "fine 1280x800"} · pointer:coarse ${await w.evaluate(() => matchMedia("(pointer: coarse)").matches)} · hover:none ${await w.evaluate(() => matchMedia("(hover: none)").matches)}`); await w.context().close(); }
  const lane = await census(await mk(), LANE);
  const c1 = await census(await mk(), CTRL);
  const c2 = await census(await mk(), CTRL);
  const lc = diff(lane, c1), cc = diff(c2, c1);
  const fc = (x) => ["light", "deck", "dark"].map((st) => `${st} ${x.rows.filter((r) => r.key.startsWith(st + " ") && r.paint.filter !== "none" && r.paint.display !== "none").length}`).join(" · ");
  lines.push(`${name} filter census (own filter ≠ none, own display ≠ none): lane ${fc(lane)} | control ${fc(c1)}`);
  await b.close();
  const fmt = (d) => `nodes ${d.nodes}/${d.other} · paint deltas ${d.paint.length} · only-here ${d.onlyHere.length} · only-there ${d.onlyThere.length} · ring-claimed ${d.ring} · same board ${d.sameBoard} (${d.givens} labelled cells)`;
  lines.push(`${name} lane-vs-control: ${fmt(lc)}`, `${name} control-vs-control (floor): ${fmt(cc)}`);
  for (const x of [...lc.paint.slice(0, 20), ...lc.onlyHere.slice(0, 10).map((k) => "ONLY-LANE " + k), ...lc.onlyThere.slice(0, 10).map((k) => "ONLY-CONTROL " + k)]) lines.push("   " + x);
  console.log(lines.slice(-3).join("\n"));
}
writeFileSync(OUT, lines.join("\n") + "\n");
console.log("DONE");
