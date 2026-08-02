import fs from "node:fs";
const B = process.argv[2],
  A = process.argv[3];
const pre = JSON.parse(fs.readFileSync(B, "utf8"));
const post = JSON.parse(fs.readFileSync(A, "utf8"));
const out = [];
const p = (s) => {
  out.push(s);
  console.log(s);
};

// Deal-variant figures: the board is generated fresh each load, so anything that counts
// rendered digits moves with the deal and is NOT a regression signal.
// StaticText/InlineTextBox are in the set on measurement, not assumption: the run1-vs-run2
// stability pass caught kenken drifting 46->45 on both while every structural row held.
const DEAL_VARIANT = new Set([
  "image",
  "labelledSvgNoRoleByClass",
  "StaticText",
  "InlineTextBox",
]);

let deltas = 0;
for (const g of Object.keys(post.games)) {
  const a = pre.games[g],
    b = post.games[g];
  p(`\n### ${g}`);
  const rows = [];
  const named = new Set([
    ...Object.keys(a.playing.axRolesNamed),
    ...Object.keys(b.playing.axRolesNamed),
  ]);
  for (const r of named) {
    const x = a.playing.axRolesNamed[r] ?? 0,
      y = b.playing.axRolesNamed[r] ?? 0;
    rows.push([`ax role ${r}`, x, y, DEAL_VARIANT.has(r)]);
  }
  // Full census union — catches a role that appeared or vanished outside the named set.
  const allRoles = new Set([
    ...Object.keys(a.playing.axRolesFull),
    ...Object.keys(b.playing.axRolesFull),
  ]);
  for (const r of allRoles) {
    if (named.has(r)) continue;
    const x = a.playing.axRolesFull[r] ?? 0,
      y = b.playing.axRolesFull[r] ?? 0;
    rows.push([`ax role ${r}`, x, y, DEAL_VARIANT.has(r)]);
  }
  const j = (v) => JSON.stringify(v);
  rows.push(["gridChildRoles", j(a.playing.gridChildRoles), j(b.playing.gridChildRoles), false]);
  rows.push(["gridChildCount", a.playing.gridChildCount, b.playing.gridChildCount, false]);
  rows.push(["domGridcells", a.playing.domGridcells, b.playing.domGridcells, false]);
  rows.push(["domRowRoles", a.playing.domRowRoles, b.playing.domRowRoles, false]);
  rows.push(["gridAttrs", j(a.playing.gridAttrs), j(b.playing.gridAttrs), false]);
  rows.push(["landmarks", j(a.playing.landmarks), j(b.playing.landmarks), false]);
  rows.push(["tabStops(selector)", a.playing.tabStops, b.playing.tabStops, false]);
  rows.push([
    "focusableOutsideMain",
    j(a.playing.focusableOutsideMain),
    j(b.playing.focusableOutsideMain),
    false,
  ]);
  rows.push(["bareSvgByClass", j(a.playing.bareSvgByClass), j(b.playing.bareSvgByClass), false]);
  rows.push([
    "labelledSvgNoRoleByClass",
    j(a.playing.labelledSvgNoRoleByClass),
    j(b.playing.labelledSvgNoRoleByClass),
    true,
  ]);
  rows.push(["duplicateIds", j(a.playing.duplicateIds), j(b.playing.duplicateIds), false]);
  rows.push(["danglingIdrefs", j(a.playing.danglingIdrefs), j(b.playing.danglingIdrefs), false]);
  rows.push([
    "gallery listbox",
    a.gallery.axRolesNamed.listbox,
    b.gallery.axRolesNamed.listbox,
    false,
  ]);
  rows.push(["gallery option(AX)", a.gallery.axRolesNamed.option, b.gallery.axRolesNamed.option, false]);
  rows.push(["gallery option(DOM)", a.gallery.domOptions, b.gallery.domOptions, false]);
  rows.push(["gallery inert options", a.gallery.inertOptions, b.gallery.inertOptions, false]);
  rows.push(["gallery option names", j(a.gallery.galleryOptions), j(b.gallery.galleryOptions), false]);
  rows.push(["pageErrors", a.pageErrors.length, b.pageErrors.length, false]);

  for (const [k, x, y, variant] of rows) {
    const same = String(x) === String(y);
    if (!same && !variant) deltas++;
    if (!same)
      p(`  ${variant ? "~" : "!"} ${k}: PRE=${x}  POST=${y}${variant ? "   [deal-variant]" : ""}`);
  }
  p(`  (rows compared: ${rows.length}; moved-and-invariant: ${rows.filter(([k, x, y, v]) => String(x) !== String(y) && !v).length})`);
}
p(`\nTOTAL INVARIANT DELTAS: ${deltas}`);
fs.writeFileSync(process.argv[4], out.join("\n") + "\n");
