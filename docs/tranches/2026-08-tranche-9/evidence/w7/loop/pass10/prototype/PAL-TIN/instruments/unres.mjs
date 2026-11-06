// PAL-TIN pass 10 probe: the library's UNRESOLVED token sites in one file (wash reach row)
const [fe, rel] = process.argv.slice(2);
const SHAPE = await import(`${fe}/scripts/shape-census.mjs`);
const sites = SHAPE.tokenSites(fe, "--wash-blue", { files: [`${fe}/${rel}`] });
for (const s of SHAPE.unresolvedSites(sites)) console.log(s.line, s.kind, String(s.value ?? "").slice(0, 60), s.key ?? "");
