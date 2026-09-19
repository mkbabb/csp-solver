/**
 * PAL-WALK pass-1 CRITIQUE — the arithmetic on the bytes `recheck.spec.ts` read, done here
 * rather than taken from the prototype: painted hue vs requested, AA on four grounds, the
 * family law against the 29 reserved hexes derived from index.css, the peer ring at its drawn
 * opacity, chroma, and the separation/room size.
 */
import fs from "node:fs";
import path from "node:path";

const HERE = import.meta.dirname;
const CSS = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-49/web/frontend/src/assets/index.css";

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const oklab = ([R, G, B]) => {
  const [r, g, b] = [R, G, B].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
};
const hueOf = (rgb) => {
  const { a, b } = oklab(rgb);
  const h = (Math.atan2(b, a) * 180) / Math.PI;
  return h < 0 ? h + 360 : h;
};
const chromaOf = (rgb) => {
  const { a, b } = oklab(rgb);
  return Math.hypot(a, b);
};
const relL = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const contrast = (x, y) => {
  const a = relL(x) + 0.05;
  const b = relL(y) + 0.05;
  return a > b ? a / b : b / a;
};
const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
const dE = (p, q) => {
  const A = oklab(p);
  const B = oklab(q);
  return Math.hypot(A.L - B.L, A.a - B.a, A.b - B.b);
};

// the 29 reserved hexes, derived here from index.css with the r0 census's own token regex
const css = fs.readFileSync(CSS, "utf8");
const RE =
  /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const reserved = [...css.matchAll(RE)].map((m) => {
  const n = parseInt(m[2].slice(1), 16);
  return { name: m[1], hex: m[2], h: hueOf([(n >> 16) & 255, (n >> 8) & 255, n & 255]) };
});

for (const engine of ["chromium", "webkit"]) {
  const f = path.join(HERE, `../readings/bytes-${engine}.json`);
  if (!fs.existsSync(f)) continue;
  const { strings, bands, grounds, ringOpacity } = JSON.parse(fs.readFileSync(f, "utf8"));
  const req = strings.map((s) => {
    const m = /oklch\(var\(--peer-ink-l\)\s+([\d.]+)\s+([\d.]+)deg\)/.exec(s);
    return { C: Number(m[1]), h: Number(m[2]) };
  });
  console.log(`\n════════ ${engine} ════════`);
  console.log(`  first three: ${strings.slice(0, 3).join(" | ")}`);
  console.log(
    `  requested chroma: mean ${(req.reduce((s, r) => s + r.C, 0) / 144).toFixed(4)} · min ${Math.min(...req.map((r) => r.C)).toFixed(4)} · at the wax ${req.filter((r) => r.C >= 0.166).length}/144`,
  );
  console.log(`  drawn peer-cursor stroke-opacity (off the sheet): ${ringOpacity}`);

  for (const [theme, L] of [
    ["light", "0.5"],
    ["dark", "0.8"],
  ]) {
    const px = bands[L];
    const dh = px.map((p, i) => gap(hueOf(p), req[i].h));
    const worstI = dh.indexOf(Math.max(...dh));
    const paintedC = px.map(chromaOf);
    const g = grounds[theme];
    const rows = [];
    for (const [gn, gv] of Object.entries(g)) {
      const cs = px.map((p) => contrast(p, gv));
      const wi = cs.indexOf(Math.min(...cs));
      rows.push(
        `    AA vs ${gn.padEnd(10)} worst ${Math.min(...cs).toFixed(3)} @i=${wi} · under 4.5: ${cs.filter((c) => c < 4.5).length}/144`,
      );
      // ring: the drawn stroke composited on the ground at its own opacity
      const alpha = Number(ringOpacity);
      const ring = px.map((p) => p.map((c, k) => alpha * c + (1 - alpha) * gv[k]));
      const rc = ring.map((p) => contrast(p, gv));
      const ri = rc.indexOf(Math.min(...rc));
      rows.push(
        `    RING(${alpha}) vs ${gn.padEnd(6)} worst ${Math.min(...rc).toFixed(3)} @i=${ri} · under 3.0: ${rc.filter((c) => c < 3).length}/144`,
      );
      const ring55 = px.map((p) => p.map((c, k) => 0.55 * c + 0.45 * gv[k]));
      const rc55 = ring55.map((p) => contrast(p, gv));
      rows.push(
        `      control 0.55 worst ${Math.min(...rc55).toFixed(3)} · under 3.0: ${rc55.filter((c) => c < 3).length}/144`,
      );
    }
    // the family law on the PAINTED bytes
    const viol = [];
    for (const n of [16, 24, 40]) {
      let bad = 0;
      let worst = 999;
      let who = "";
      for (let i = 0; i < n; i++) {
        for (const r of reserved) {
          const d = gap(hueOf(px[i]), r.h);
          if (d < worst) {
            worst = d;
            who = `i=${i} vs ${r.name}`;
          }
          if (d < 12) bad++;
        }
      }
      viol.push(`      first ${n}: collisions ${bad} · closest ${worst.toFixed(2)}° (${who})`);
    }
    // separation and room size on painted hues
    const sep = (n) => {
      let m = 360;
      for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) m = Math.min(m, gap(hueOf(px[i]), hueOf(px[j])));
      return m;
    };
    let room = 1;
    while (room < 40 && sep(room + 1) >= 12) room++;
    const dEat = (n) => {
      let m = 9;
      for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) m = Math.min(m, dE(px[i], px[j]));
      return m;
    };
    console.log(`  ── ${theme} (--peer-ink-l ${L}) ──`);
    console.log(
      `    painted hue error: max ${Math.max(...dh).toFixed(2)}° @i=${worstI} · mean ${(dh.reduce((a, b) => a + b, 0) / 144).toFixed(2)}°`,
    );
    console.log(
      `    painted chroma: mean ${(paintedC.reduce((a, b) => a + b, 0) / 144).toFixed(4)} · min ${Math.min(...paintedC).toFixed(4)}`,
    );
    rows.forEach((r) => console.log(r));
    console.log(`    family law on painted bytes (29 reserved hexes, floor 12°):`);
    viol.forEach((v) => console.log(v));
    console.log(
      `    painted separation 4/8/16: ${sep(4).toFixed(2)}° / ${sep(8).toFixed(2)}° / ${sep(16).toFixed(2)}° · room at 12° floor: ${room}`,
    );
    console.log(
      `    painted ΔE(OKLab) 4/8/16: ${dEat(4).toFixed(4)} / ${dEat(8).toFixed(4)} / ${dEat(16).toFixed(4)}`,
    );
  }
}

// the crayon reference, computed here
const crayons = reserved.filter((r) => /^crayon-/.test(r.name));
console.log(`\n  reserved tokens parsed: ${reserved.length}`);
