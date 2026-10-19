import { readFileSync } from "node:fs";
const S = process.argv[2];
for (const eng of ["chromium", "webkit"]) {
  const ctl = {}, sim = {};
  for (const l of readFileSync(`${S}/logs/br-btg-control-${eng}.log`, "utf8").split("\n").filter((x) => x.startsWith("BTG"))) {
    const [, th, cell] = /(light|dark) cell (\d+)/.exec(l);
    for (const m of l.matchAll(/HEAD i=(\d) ([\d.]+)/g)) ctl[`${th}/${cell}/${m[1]}`] = +m[2];
  }
  for (const l of readFileSync(`${S}/logs/br-btg-tree-${eng}.log`, "utf8").split("\n").filter((x) => x.startsWith("BTG"))) {
    const [, th, cell] = /(light|dark) cell (\d+)/.exec(l);
    for (const m of l.matchAll(/sim i=(\d) ([\d.]+)/g)) sim[`${th}/${cell}/${m[1]}`] = +m[2];
  }
  for (const th of ["light", "dark"]) {
    const d = Object.keys(ctl).filter((k) => k.startsWith(th)).map((k) => +(sim[k] - ctl[k]).toFixed(3));
    console.log(eng, th, "sim-HEAD min", Math.min(...d), "max", Math.max(...d), "n", d.length, "gains", d.filter((x) => x > 0).length);
  }
}
