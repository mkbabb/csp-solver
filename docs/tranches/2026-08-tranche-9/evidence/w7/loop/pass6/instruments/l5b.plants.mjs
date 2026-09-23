#!/usr/bin/env node
/**
 * L5b's NEGATIVE CONTROLS, run in the same batch as the row (LAWS P5: a re-cut gate ships with the
 * plants that red it). Every plant is an in-memory copy of ONE real file of the tree named — the
 * tree is read, never written. Exit 0 only when the clean tree is GREEN and every plant REDS.
 *
 *   node l5b.plants.mjs <web/frontend>
 *
 *   A  the pass-4 border on AttributionCard.vue's `.hover-card` (a consumer)        — critic's plant A
 *   B  the same border on PlayerLobby.vue's `.player-lobby` (the pass-4 site)       — critic's plant B
 *   C  `<HandDrawnOutline>` deleted from HeadSheet's template                        — critic's plant C
 *   D  a Tailwind `border` utility on the consumer's `<HeadSheet class="…">`
 *   E  a LOGICAL longhand, `border-block-start: 2px solid`, on `.player-lobby.is-open`
 *   F  a spread `box-shadow: 0 0 0 2px` on HeadSheet's own `.head-sheet`
 *   G  a border on the consumer's data hook, `[data-lobby]`
 *   H  a gradient hairline, `background-image: linear-gradient(…)`, on `.hover-card`
 */
import fs from "node:fs";
import path from "node:path";
import { l5b } from "./l5b.mjs";

const FE = path.resolve(process.argv[2] ?? ".");
const chrome = path.join(FE, "src/pencil/chrome");
const find = (base) => {
  const hit = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (e.name === base) hit.push(f); } };
  walk(chrome);
  return hit[0];
};
const card = find("AttributionCard.vue"), lobby = find("PlayerLobby.vue"), sheet = find("HeadSheet.vue");
const txt = (f) => fs.readFileSync(f, "utf8");
const BORDER = "border: 2px solid color-mix(in srgb, var(--color-border) 30%, transparent);";
const intoRule = (t, sel, decl) => {
  const re = new RegExp(`(\\n${sel.replace(/[.[\]]/g, (c) => `\\${c}`)}\\s*\\{)`);
  if (!re.test(t)) return null;
  return t.replace(re, `$1\n  ${decl}`);
};
const addRule = (t, rule) => t.replace(/<style([^>]*)>/, `<style$1>\n${rule}\n`);
const plants = [
  ["A", "pass-4 border on AttributionCard .hover-card", card && { [card]: intoRule(txt(card), ".hover-card", BORDER) }],
  ["B", "pass-4 border on PlayerLobby .player-lobby (the pass-4 site)", lobby && { [lobby]: intoRule(txt(lobby), ".player-lobby", BORDER) }],
  ["C", "<HandDrawnOutline> deleted from HeadSheet", sheet && { [sheet]: txt(sheet).replace(/<HandDrawnOutline\b[\s\S]*?\/>/, "") }],
  ["D", "Tailwind `border` on the consumer's <HeadSheet class>", card && { [card]: txt(card).replace(/<HeadSheet\b([^>]*?)class="/, '<HeadSheet$1class="border ') }],
  ["E", "border-block-start on .player-lobby.is-open", lobby && { [lobby]: addRule(txt(lobby), ".player-lobby.is-open { border-block-start: 2px solid currentColor; }") }],
  ["F", "box-shadow spread on HeadSheet .head-sheet", sheet && { [sheet]: intoRule(txt(sheet), ".head-sheet", "box-shadow: 0 0 0 2px var(--color-border);") }],
  ["G", "border on the data hook [data-lobby]", lobby && { [lobby]: addRule(txt(lobby), "[data-lobby] { border: 1px solid; }") }],
  ["H", "gradient hairline on .hover-card", card && { [card]: intoRule(txt(card), ".hover-card", "background-image: linear-gradient(var(--color-border), var(--color-border));") }],
];
const clean = l5b(FE);
console.log(`clean: ${clean.ok ? "GREEN" : "RED"} | ${clean.detail}`);
let fail = clean.ok ? 0 : 1;
for (const [id, what, over] of plants) {
  if (!over || Object.values(over).some((v) => v == null)) { console.log(`${id}: CANNOT PLANT (site absent on this tree) · ${what}`); fail++; continue; }
  const r = l5b(FE, over);
  if (r.ok) fail++;
  console.log(`${id}: ${r.ok ? "GREEN — FAILED to red" : "RED as required"} · ${what}${r.ok ? "" : ` · ${r.detail.slice(0, 140)}`}`);
}
console.log(fail ? `\nl5b plants: ${fail} FAILED` : "\nl5b plants: clean GREEN, every plant RED");
process.exit(fail ? 1 : 0);
