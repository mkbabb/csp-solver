const fe = process.argv[2];
const L = await import(fe + "/scripts/shape-census.mjs");
const files = L.followImports(L.sources(fe, { tests: true }), {});
for (const tok of ["--peer-name-l", "--color-peer-name-ink"]) {
  const s = L.tokenSites(fe, tok, { files });
  console.log(tok, "sites", s.length, s.filter((x) => /peerx/.test(x.file)).map((x) => `${x.file.split("/").pop()} ${x.kind} ${x.value}`));
}
