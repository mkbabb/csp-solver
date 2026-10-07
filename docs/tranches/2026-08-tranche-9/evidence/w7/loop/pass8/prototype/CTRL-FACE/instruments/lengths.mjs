const SC = await import(process.argv[2]);
const fe = process.argv[3];
const names = ["masthead-foot","case-offset","card-foot-h","pin-band","fold-tools-h","strip-len","sheet-chrome","card-pad-b","head-rule","pin-tape-h","zone-step","card-pad-t","card-pad-x","action-bar-h"];
const regs = SC.propertyRegistrations(fe);
const out = [];
for (const n of names) {
  const t = "--" + n;
  const sites = SC.tokenSites(fe, t).filter((s) => !/@property/.test(s.prelude ?? "") && s.kind !== "at-property" && !s.unresolved);
  const r = SC.census; // readers via varRefs over every source
  let readers = 0;
  for (const f of SC.sources(fe)) {
    const txt = (await import("node:fs")).readFileSync(f, "utf8");
    readers += (txt.match(new RegExp(`var\\(\\s*${t}(?![\\w-])`, "g")) ?? []).length;
  }
  const reg = (Array.isArray(regs) ? regs : regs.sites ?? []).filter((x) => (x.name ?? x.prop) === t).length;
  out.push(`${t} readers ${readers} writers ${sites.length} reg ${reg}`);
}
console.log(out.join("\n"));
