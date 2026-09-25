// TAB-PEN pass-7 critic's escape plants against check-favicon.mjs (--root). Each plant is a fresh
// copy of the worktree's web/frontend inputs; the sidecar is re-stamped as the lane's own plants do.
import fs from "node:fs"; import path from "node:path"; import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto"; import zlib from "node:zlib";
const D = process.argv[2]; const GATE = process.argv[3]; const FE = path.dirname(path.dirname(GATE));
const sha = (b) => createHash("sha256").update(b).digest("hex");
const base = path.join(D, "base");
const clean = fs.readFileSync(path.join(base, "public/icon.svg"), "utf8");
const png0 = fs.readFileSync(path.join(base, "public/apple-touch-icon.png"));
function png(fn) { // 180x180 RGB from fn(x,y)->[r,g,b]
  const chunk = (t, d) => { const o = Buffer.alloc(12 + d.length); o.writeUInt32BE(d.length, 0); o.write(t, 4, "latin1"); d.copy(o, 8); o.writeUInt32BE(zlib.crc32(Buffer.concat([Buffer.from(t), d])) >>> 0, 8 + d.length); return o; };
  const rows = []; for (let y = 0; y < 180; y++) { const r = [0]; for (let x = 0; x < 180; x++) r.push(...fn(x, y)); rows.push(Buffer.from(r)); }
  return Buffer.concat([Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]), chunk("IHDR", Buffer.from([0,0,0,180,0,0,0,180,8,2,0,0,0])), chunk("IDAT", zlib.deflateSync(Buffer.concat(rows))), chunk("IEND", Buffer.alloc(0))]);
}
const PAPER = [251,250,249], INK = [10,10,10];
const plants = [
  ["C1 SVG ink mass: a block of five pen lines (the thick tab again, PNG kept)", { svg: (s) => s.replace(/d="[^"]*"/, 'd="M8,6H24V26H8ZM8,11H24M8,16H24M8,21H24"') }],
  ["C2 a PNG of four ink bars (not the s), coverage ~0.23", { png: png((x, y) => (Math.floor(y / 22) % 2 === 1 && y > 10 && y < 170 && x > 30 && x < 150 ? INK : PAPER)) }],
  ["C3 the letter Z at the same box and pen", { svg: (s) => s.replace(/d="[^"]*"/, 'd="M9,6H23L9,26H23"') }],
  ["C4 T9-B28 arm B: stroke-width 5 (the ballot's own arm)", { svg: (s) => s.replace('stroke-width="4"', 'stroke-width="5"') }],
  ["C5 arm H's path with W's PNG kept (SVG/PNG divergence)", { svg: (s) => s.replace(/d="[^"]*"/, 'd="M23.6,8.7L23.9,6.3L15.2,5.9C11.2,5.8 9.3,8.1 9.6,10.9C10,13.9 12.8,14.7 16.6,16C21.4,17.5 24.2,18.9 23.8,21.7C23.5,24.7 19.9,26.3 15.4,26.1C11.4,25.9 8.4,24.2 8.1,22.2"') }],
  ["C6 both icon links commented out in index.html (no icon ships)", { html: (h) => h.replace(/(<link rel="icon"[^>]*>\s*<link rel="apple-touch-icon"[^>]*>)/, "<!-- $1 -->") }],
  ["C7 a second rel=icon after ours, to main's thick favicon (browsers take the last)", { html: (h) => h.replace(/(<link rel="apple-touch-icon"[^>]*>)/, '$1\n    <link rel="icon" type="image/svg+xml" href="/thick.svg" />'), extra: { "public/thick.svg": "MAIN" } }],
  ["C8 a second @theme site for the paper in another file (placed, order-resolved)", { extra: { "src/zz-palette.css": "@theme { --color-background: #f4efe4; }" } }],
  ["C9 a second @theme site sorting first", { extra: { "src/assets/aa-palette.css": "@theme { --color-background: #f4efe4; }" } }],
  ["C10 a .dark site in an SFC style retoning the ink (placed as dark)", { extra: { "src/zz.vue": "<template><i/></template>\n<style>\n.dark { --color-foreground: #8a8a8a; }\n</style>\n" } }],
];
const MAIN = fs.readFileSync(path.join(FE, "..", "..", "..", "..", "..", "web/frontend/public/favicon.svg"), "utf8");
for (const [label, p] of plants) {
  const dir = path.join(D, "plant-" + label.split(" ")[0]);
  fs.cpSync(base, dir, { recursive: true });
  const svg = p.svg ? p.svg(clean) : clean; fs.writeFileSync(path.join(dir, "public/icon.svg"), svg);
  const pn = p.png ?? png0; fs.writeFileSync(path.join(dir, "public/apple-touch-icon.png"), pn);
  if (p.html) fs.writeFileSync(path.join(dir, "index.html"), p.html(fs.readFileSync(path.join(base, "index.html"), "utf8")));
  for (const [f, t] of Object.entries(p.extra ?? {})) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), t === "MAIN" ? MAIN : t); }
  fs.writeFileSync(path.join(dir, "scripts/icons.provenance.json"), JSON.stringify({ arm: "W", "icon.svg": sha(svg), "apple-touch-icon.png": sha(pn) }, null, 2) + "\n");
  let code = 0, out = "";
  try { out = execFileSync("node", [GATE, "--root", dir], { cwd: FE, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { code = e.status; out = e.stdout; }
  const reds = [...out.matchAll(/^  ([a-e])  RED/gm)].map((m) => m[1]).join("");
  console.log(`${code ? "RED  " : "GREEN"} exit ${code} red[${reds || "-"}]  ${label}`);
  if (code) console.log("      " + out.split("\n").filter((l) => /^       /.test(l)).map((l) => l.trim()).join(" | ").slice(0, 300));
}
