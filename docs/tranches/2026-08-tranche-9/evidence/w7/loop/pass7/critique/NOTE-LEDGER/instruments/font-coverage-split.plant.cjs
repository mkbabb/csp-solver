const fs=require('fs'); const p='scripts/check-font-coverage.mjs'; let s=fs.readFileSync(p,'utf8');
s=s.replace('derive: ["marginRecordCopy", "marginVerdictCopy"],','derive: ["marginRecordCopy"],');
const a=s.indexOf('          "that\'s a given clue",'); const b=s.indexOf('"check the thermometer",')+'"check the thermometer",'.length;
const moved=s.slice(a,b); s=s.slice(0,a)+s.slice(b);
s=s.replace('      {\n        where: ".zone-row-label (row captions)",','      {\n        where: "the verdicts (an open twin)",\n        transform: "none",\n        derive: ["marginVerdictCopy"],\n        strings: [\n          "row",\n          "column",\n          "box",\n'+moved+'\n        ],\n        admits: [{ cp: 0x78, why: "HOUSE_WORD.box", seen: "the corpus above" }],\n      },\n      {\n        where: ".zone-row-label (row captions)",');
fs.writeFileSync(p,s);
