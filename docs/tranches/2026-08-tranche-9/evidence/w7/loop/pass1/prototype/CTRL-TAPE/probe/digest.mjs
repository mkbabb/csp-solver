// T9-W7 pass 1 · CTRL-TAPE PROTOTYPE — the before/after digest, one row per reading.
//   node digest.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const R = (t) => JSON.parse(readFileSync(join(HERE, "..", "readings", `readings-${t}.json`), "utf8"));
const B = R("before"), A = R("after");

const CELLS = Object.keys(A.cells);
const rows = [];
const push = (label, fn) => {
  for (const c of CELLS)
    for (const e of ["chromium", "webkit"]) {
      const b = B.cells[c]?.[e], a = A.cells[c]?.[e];
      if (!b || !a) continue;
      let bv, av;
      try { bv = fn(b); } catch { bv = "-"; }
      try { av = fn(a); } catch { av = "-"; }
      rows.push({ reading: label, cell: c, engine: e, before: bv, after: av });
    }
};

push("voices", (v) => v.names.voices.length);
push("voice tuple", (v) => v.names.voices.join(" | "));
push("docHeadings/names", (v) => `${v.names.docHeadings}/${v.names.names}`);
push("name ÷ option", (v) => v.names.ratio);
push("namePx", (v) => v.names.namePx);
push("optionPx", (v) => v.names.optionPx);
push("first tape clearance", (v) => v.names.cardTopClearance);
push("panel height", (v) => v.chrome.card.panelHeight);
push("card width", (v) => v.chrome.card.box[2]);
push("bar position", (v) => v.chrome.bar.position);
push("bar ownChrome", (v) => v.chrome.bar.ownChrome);
push("bar worstVisibleBurial", (v) => v.chrome.bar.worstVisibleBurial);
push("url() filters", (v) => v.chrome.filters);
push("I3 violations (one-sided)", (v) => v.sticky.i3Violations?.length ?? "-");
push("BAND violations (added row)", (v) => v.sticky.bandViolations?.length ?? "-");
push("--type-tag consumers px", (v) =>
  `hv ${v.names.tagConsumers.headingValue} / status ${v.names.tagConsumers.playersStatus} / row ${v.names.tagConsumers.playerRow}`);
push("tab boxes", (v) => (v.tabs.present ? v.tabs.tabs.map((t) => `${t.w}x${t.h}`).join(" ") : "-"));
push("tab decoration", (v) => (v.tabs.present ? [...new Set(v.tabs.tabs.map((t) => t.decoration))].join(",") : "-"));
push("tab opacity", (v) => (v.tabs.present ? v.tabs.tabs.map((t) => t.opacity).join(" ") : "-"));
push("radii", (v) => JSON.stringify(v.chrome.radii));
push("drawn strokes", (v) =>
  Object.entries(v.chrome.drawn).map(([k, d]) => `${k}=${d.drawnStroke}`).join(" "));

const seam = [];
for (const w of Object.keys(A.seamLadder))
  for (const e of ["chromium", "webkit"])
    seam.push({
      width: w, engine: e,
      clearanceBefore: B.seamLadder[w][e]?.clearance,
      clearanceAfter: A.seamLadder[w][e]?.clearance,
      sheetChromeAfter: A.seamLadder[w][e]?.sheetChrome,
      mastToBoardBefore: B.seamLadder[w][e]?.mastheadToBoard,
      mastToBoardAfter: A.seamLadder[w][e]?.mastheadToBoard,
    });

const rings = {};
for (const e of ["chromium", "webkit"])
  rings[e] = {
    before: (B.cells["dock-390x844"][e].ringBytes || []).map((r) => `${r.label}: ${r.ratio ?? r.skipped}`),
    after: (A.cells["dock-390x844"][e].ringBytes || []).map((r) => `${r.label}: ${r.ratio ?? r.skipped}`),
  };

const floor = {};
for (const e of ["chromium", "webkit"]) {
  const c = A.cells["dock-390x844"][e].tabFloorControl;
  floor[e] = {
    live: A.cells["dock-390x844"][e].tabs.tabs.map((t) => `${t.w}x${t.h}`),
    killMinWidth: c?.w?.tabs?.map((t) => `${t.w}x${t.h}`),
    killMinHeight: c?.h?.tabs?.map((t) => `${t.w}x${t.h}`),
  };
}

const contrast = {};
for (const e of ["chromium", "webkit"]) {
  const pick = (v) => (v || []).map((r) => `${r.sel} "${r.text}" ${r.ratio} on ${r.bg}`);
  contrast[e] = {
    lightAfter: pick(A.cells["dock-390x844"][e].contrast),
    darkAfter: pick(A.dark[e].contrast),
    darkArmedInk: A.dark[e].armed,
  };
}

const out = { rows, seam, rings, floor, contrast };
writeFileSync(join(HERE, "..", "readings", "digest.json"), JSON.stringify(out, null, 1));

const changed = rows.filter((r) => String(r.before) !== String(r.after));
console.log("== CHANGED ==");
for (const r of changed) console.log(`${r.reading.padEnd(30)} ${r.cell.padEnd(22)} ${r.engine.padEnd(9)} ${r.before}  ->  ${r.after}`);
console.log("\n== UNCHANGED GUARDS ==");
const guards = new Set(["card width", "url() filters", "--type-tag consumers px"]);
for (const r of rows.filter((x) => guards.has(x.reading) && String(x.before) === String(x.after)))
  console.log(`${r.reading.padEnd(24)} ${r.cell.padEnd(22)} ${r.engine.padEnd(9)} ${r.after}`);
console.log("\n== SEAM ==");
for (const s of seam) console.log(JSON.stringify(s));
console.log("\n== RING (painted bytes) ==");
console.log(JSON.stringify(rings, null, 1));
console.log("\n== TAP FLOOR + per-dimension controls ==");
console.log(JSON.stringify(floor, null, 1));
console.log("\n== CONTRAST ==");
console.log(JSON.stringify(contrast, null, 1));
