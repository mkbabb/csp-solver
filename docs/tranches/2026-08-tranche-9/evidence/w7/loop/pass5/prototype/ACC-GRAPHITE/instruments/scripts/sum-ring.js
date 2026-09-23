const fs=require('fs'); const dir=process.argv[2];
for (const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort()) {
  const j=JSON.parse(fs.readFileSync(dir+'/'+f));
  console.log(`== ${j.engine} ${j.regime}`);
  for (const a of ["tree","control","control2","second-11","second-10","inset-84"]) { const r=j[a]; if(!r) continue;
    console.log(`  ${a.padEnd(10)} ${r.asset.slice(6,14)} fv=${r.focusVisible} regime=${JSON.stringify(r.regimeRead)} band=${r.g2.bandW} paperOut=${r.g2.paperOut} frameCol=${r.g2.frameW} bandM=${r.g2.bandM} wash=${r.washStep} hue=${JSON.stringify(r.washHue)} yours=${r.aa.yoursOnPaper} given=${r.aa.givenOnPaper} bandInk=${r.aa.bandOnPaper} auth=${r.aa.givenOverYours} rank=${r.rank.bandMed}/${r.rank.restMed}/${r.rank.restP95} j=${r.rank.junctionPx} rankP95=${r.rank.rankP95}`);
  }
  const cls=(pi)=>{const c={};for(const d of pi.diffs){const k=(d.cls.split(" ")[0]||d.p.split(">").slice(-2).join(">"))+" :: "+d.d.replace(/color\(srgb[^)]*\)/g,"cmix").slice(0,90);c[k]=(c[k]||0)+1;}return c;};
  console.log(`  pi load ${j.pi.load.differing} (+${j.pi.load.onlyTree}/-${j.pi.load.onlyControl}) focus ${j.pi.focus.differing} (+${j.pi.focus.onlyTree}/-${j.pi.focus.onlyControl}) | noise load ${j.piNoise.load.differing} focus ${j.piNoise.focus.differing}`);
  console.log('   ', JSON.stringify(cls(j.pi.focus)));
}
