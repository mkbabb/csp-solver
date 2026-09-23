import fs from "node:fs"; import path from "node:path";
const FE = process.argv[2];
// L5b body, verbatim from law-probe.L5b.PROPOSED.diff
const dir = path.join(FE, "src/pencil/chrome");
const files = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (f.endsWith(".vue")) files.push(f); } };
walk(dir);
const bad = [];
let sheets = 0;
for (const f of files) {
  const src = fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "");
  const style = (src.match(/<style[^>]*>([\s\S]*?)<\/style>/) || [])[1] || "";
  for (const m of style.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/(^|;|\s)top:\s*100%/.test(m[2])) continue;
    sheets++;
    const border = [...m[2].matchAll(/border(?:-(?:top|right|bottom|left))?(?:-width)?:\s*([^;]+)/g)].some((b) => /(^|\s)(?!0(px)?\b)\d*\.?\d+(px|rem|em)\b|thin|medium|thick/.test(b[1]) && !/^none\b/.test(b[1].trim()));
    const drawn = /<HandDrawnOutline\b/.test(src);
    if (border || !drawn) bad.push(`${path.basename(f)} ${m[1].trim()}${border ? " paints a border" : ""}${drawn ? "" : " draws no HandDrawnOutline"}`);
  }
}
const ok = sheets > 0 && bad.length === 0;
console.log(ok ? "GREEN" : "RED", "|", bad.length ? bad.join("; ") : `${sheets} head sheet rule(s), each drawn, none bordered`);
