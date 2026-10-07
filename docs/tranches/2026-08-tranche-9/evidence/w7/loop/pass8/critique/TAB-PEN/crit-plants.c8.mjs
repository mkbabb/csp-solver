// TAB-PEN pass-8 critic's NEW escape plants against check-favicon.mjs (fd3ef080). Each plant is a fresh
// copy of the bank's web/frontend inputs (no node_modules), read by the gate through --root; the sidecar
// is re-stamped as the lane's own plants do. Table plants run the COPY's own gate (it imports ./icons.mjs).
// No delete of any kind: every plant dir is new and lane-named.
import fs from "node:fs"; import path from "node:path"; import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto"; import zlib from "node:zlib";
const D = process.argv[2]; const GATE = process.argv[3]; const NM = process.argv[4]; const FE = path.dirname(path.dirname(GATE));
const sha = (b) => createHash("sha256").update(b).digest("hex");
const base = path.join(D, "base");
const clean = fs.readFileSync(path.join(base, "public/icon.svg"), "utf8");
const png0 = fs.readFileSync(path.join(base, "public/apple-touch-icon.png"));
const MAIN = fs.readFileSync(process.env.MAIN_FAVICON, "utf8");
// decode the shipped palette PNG through sharp (a dependency-free route is the gate's; this is the critic's)
import { createRequire } from "node:module";
const sharp = createRequire(path.join(NM, "..", "package.json"))("sharp");
const raw0 = await sharp(png0).removeAlpha().raw().toBuffer();
async function stamp(sq) { // the shipped PNG with an ink square [x0,y0,size]
  const b = Buffer.from(raw0);
  const [x0, y0, n] = sq;
  for (let y = y0; y < y0 + n; y++) for (let x = x0; x < x0 + n; x++) b.set([10, 10, 10], (y * 180 + x) * 3);
  return sharp(b, { raw: { width: 180, height: 180, channels: 3 } }).png({ palette: true, compressionLevel: 9 }).toBuffer();
}
const linkPair = /(<link rel="icon"[^>]*>\s*<link rel="apple-touch-icon"[^>]*>)/;
const plants = [
  ["E1 the svg link scoped to dark only: media=(prefers-color-scheme: dark) (a light tab shows no s)", { html: (h) => h.replace('<link rel="icon" type="image/svg+xml"', '<link rel="icon" media="(prefers-color-scheme: dark)" type="image/svg+xml"') }],
  ["E2 the svg link typed text/plain (a UA skips an unsupported icon type)", { html: (h) => h.replace('type="image/svg+xml"', 'type="text/plain"') }],
  ["E3 both links inside <template> (inert content, no icon)", { html: (h) => h.replace(linkPair, "<template>$1</template>") }],
  ["E4 both links inside <noscript> (raw text in head with scripting on, no icon)", { html: (h) => h.replace(linkPair, "<noscript>$1</noscript>") }],
  ["E5 links removed, their text kept in a head <script> string", { html: (h) => h.replace(linkPair, (m) => `<script>window.__x = '${m.replace(/\n\s*/g, " ")}';</script>`) }],
  ["E6 a <base href> to a foreign origin before the links (the icon loads off-site)", { html: (h) => h.replace("<title>", '<base href="https://example.com/" />\n    <title>') }],
  ["E7 src/main.ts re-points the icon to main's thick s at runtime", { extra: { "public/thick.svg": "MAIN" }, append: { "src/main.ts": '\ndocument.querySelector(\'link[rel~="icon"]\')?.setAttribute("href", "/thick.svg");\n' } }],
  ["E8 the touch icon with a 12x12 ink square in its paper (a mark that isn't the s)", { png: [150, 150, 12] }],
  ["E9 the touch icon with a 16x16 ink square in its paper", { png: [150, 150, 16] }],
  ["E10 the touch icon with a 20x20 ink square in its paper", { png: [148, 148, 20] }],
  ["T1 the arm table itself edited: PEN.W = a Z, svg+png re-made by the real icons.mjs (sharp)", { table: (t) => t.replace(/W: "M22\.6[^"]*"/, 'W: "M9,6H23L9,26H23"') }],
  ["T2 the arm table edited: PEN.W = a 2-line zigzag 'N' at the s's box", { table: (t) => t.replace(/W: "M22\.6[^"]*"/, 'W: "M9.5,26V6L22.5,26V6"') }],
  ["NN-a the shipped bytes (negative control)", {}],
];
for (const [label, p] of plants) {
  const dir = path.join(D, "c8-plant-" + label.split(" ")[0]);
  fs.cpSync(base, dir, { recursive: true });
  let svg = clean, pn = png0;
  if (p.table) {
    const f = path.join(dir, "scripts/icons.mjs");
    fs.writeFileSync(f, p.table(fs.readFileSync(f, "utf8")));
    fs.symlinkSync(NM, path.join(dir, "node_modules"));
    execFileSync("node", ["scripts/icons.mjs"], { cwd: dir, stdio: "ignore" });
    svg = fs.readFileSync(path.join(dir, "public/icon.svg"), "utf8"); pn = fs.readFileSync(path.join(dir, "public/apple-touch-icon.png"));
  } else {
    if (p.png) pn = await stamp(p.png);
    fs.writeFileSync(path.join(dir, "public/icon.svg"), svg);
    fs.writeFileSync(path.join(dir, "public/apple-touch-icon.png"), pn);
    fs.writeFileSync(path.join(dir, "scripts/icons.provenance.json"), JSON.stringify({ arm: "W", width: 4, "icon.svg": sha(svg), "apple-touch-icon.png": sha(pn) }, null, 2) + "\n");
  }
  if (p.html) fs.writeFileSync(path.join(dir, "index.html"), p.html(fs.readFileSync(path.join(base, "index.html"), "utf8")));
  for (const [f, t] of Object.entries(p.extra ?? {})) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), t === "MAIN" ? MAIN : t); }
  for (const [f, t] of Object.entries(p.append ?? {})) fs.appendFileSync(path.join(dir, f), t);
  const html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
  if (p.html && html === fs.readFileSync(path.join(base, "index.html"), "utf8")) { console.log(`VOID (html replace missed)  ${label}`); continue; }
  const gate = p.table ? path.join(dir, "scripts/check-favicon.mjs") : GATE;
  let code = 0, out = "";
  try { out = execFileSync("node", [gate, "--root", dir], { cwd: p.table ? dir : FE, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { code = e.status; out = e.stdout; }
  const reds = [...out.matchAll(/^  ([a-e])  RED/gm)].map((m) => m[1]).join("");
  const rd = (out.match(/readings: .*/) ?? [""])[0];
  console.log(`${code ? "RED  " : "GREEN"} exit ${code} red[${reds || "-"}]  ${label}\n      ${rd}`);
  if (code) console.log("      " + out.split("\n").filter((l) => /^       /.test(l)).map((l) => l.trim()).join(" | ").slice(0, 300));
}
