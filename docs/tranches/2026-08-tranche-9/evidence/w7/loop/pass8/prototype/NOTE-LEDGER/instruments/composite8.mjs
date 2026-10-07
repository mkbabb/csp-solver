// the T9-B-LEDGER composite (pass 8, WITH the swap fence): rows HOLD/AGE/STEP/TINT on union+homes+ERASE8+LEDGER8;
// a caption strip on the image; phone block (DPR 2 panels at 0.5) then desk block (DPR 1 at 1). node composite8.mjs <panels> <out>
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
const [P, OUT] = process.argv.slice(2);
const ARMS = ["hold", "age", "step", "tint"];
const PHONE = [["chromium", "light", "p100"], ["chromium", "light", "rest"], ["chromium", "dark", "rest"], ["webkit", "light", "p100"], ["webkit", "light", "rest"], ["webkit", "dark", "rest"]];
const DESK = [["chromium", "light", "rest"], ["webkit", "light", "rest"]];
const LW = 52, CAP = 16, HEAD = 18, PW = 270, PH = 66, DW = 460, DH = 36, GAP = 4;
const W = LW + PHONE.length * (PW + GAP);
const H = CAP + HEAD + ARMS.length * (PH + GAP) + HEAD + ARMS.length * (DH + GAP);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const txt = (x, y, s, size = 11) => `<text x="${x}" y="${y}" font-family="Helvetica" font-size="${size}" fill="#222">${esc(s)}</text>`;
let svg = txt(4, 12, "T9-B-LEDGER on union+homes+ERASE8+LEDGER8, the SWAP fence gated · one payload (classic easy 9x9, 30 givens) · one variable: LEDGER_FULFILLED (HOLD = the default) · P4 = ask, answer, ask, answer", 11);
const comps = [];
PHONE.forEach(([e, sc, w], c) => { svg += txt(LW + c * (PW + GAP) + 2, CAP + 13, `${e === "chromium" ? "cr" : "wk"} ${sc} 390×844 coarse DPR2@0.5 · P4 ${w === "p100" ? "+100 ms" : "rest +2.6 s"}`, 10); });
for (const [r, arm] of ARMS.entries()) {
  const y = CAP + HEAD + r * (PH + GAP);
  svg += txt(4, y + 38, arm.toUpperCase(), 12);
  for (const [c, [e, sc, w]] of PHONE.entries()) {
    const buf = await sharp(`${P}/${e}-phone2-${sc}-${w}-${arm}.png`).resize(PW, PH, { fit: "contain", background: "#ffffff" }).png().toBuffer();
    comps.push({ input: buf, left: LW + c * (PW + GAP), top: y });
  }
}
const y0 = CAP + HEAD + ARMS.length * (PH + GAP);
DESK.forEach(([e, sc], c) => { svg += txt(LW + c * (DW + GAP) + 2, y0 + 13, `${e === "chromium" ? "cr" : "wk"} ${sc} 1280×800 fine DPR1@1, left 460 px · P4 rest +2.6 s`, 10); });
for (const [r, arm] of ARMS.entries()) {
  const y = y0 + HEAD + r * (DH + GAP);
  svg += txt(4, y + 22, arm.toUpperCase(), 12);
  for (const [c, [e, sc]] of DESK.entries()) {
    const buf = await sharp(`${P}/${e}-desk1-${sc}-rest-${arm}.png`).extract({ left: 0, top: 0, width: DW, height: DH }).png().toBuffer();
    comps.push({ input: buf, left: LW + c * (DW + GAP), top: y });
  }
}
comps.push({ input: Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${svg}</svg>`), left: 0, top: 0 });
await sharp({ create: { width: W, height: H, channels: 3, background: "#e9e9e9" } }).composite(comps).png().toFile(OUT);
console.log(`composite ${W}x${H} -> ${OUT}`);
