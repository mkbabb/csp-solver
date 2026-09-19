#!/usr/bin/env node
/**
 * THE TIN, PRICED (T9-W7 PAL-TIN) — three gates over the ten declarations in `index.css`.
 *
 * The walk this replaced was a FORMULA, so the r0 instrument could read the step and the
 * chroma out of `playerIdentity.ts` and re-derive every hue. A tin is a TABLE, so the gate has
 * to read the table — and reading it is the point: the tin cannot move without the numbers
 * moving with it, and the day somebody adds a sixth stick this says which law it broke.
 *
 *   GATE 1  THE FAMILY LAW.  No stick within MIN_SEP degrees of any reserved ink. A player is
 *           never assigned wax, never the solver's rainbow, never the incumbent blue.
 *   GATE 2  THE SEPARATION LAW.  No two sticks closer than MIN_DE in OKLab, per arm. This is
 *           the gate the family turns on: hue degrees measure the distance to an ANCHOR, ΔE
 *           measures whether two PLAYERS look like two people. Twelve sticks pass gate 1 and
 *           come out at ΔE 0.024 — five of them one teal.
 *   GATE 3  THE ANCHOR TEST.  No stick IS a reserved ink, said in hexes rather than degrees.
 *
 * `--self-test` mints a negative control: a thirteenth stick cut between two of the five must
 * turn gate 2 RED. A gate that cannot be shown failing is not a gate.
 *
 * RUN IT BARE. `node check-peer-tin.mjs | tail` prints RED and exits 0 — the pipe eats the
 * exit code, and this file's whole output is the exit code.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const INDEX_CSS = path.join(import.meta.dirname, "..", "src", "assets", "index.css");
const MIN_SEP = 12; // degrees, the r0 instrument's own floor
const MIN_DE = 0.1; // OKLab, the separation floor the tin is cut against

const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function oklab(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
const hueOf = (hex) => {
  const [, A, B] = oklab(hex);
  const h = (Math.atan2(B, A) * 180) / Math.PI;
  return h < 0 ? h + 360 : h;
};
const gap = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};
const dE = (a, b) => {
  const A = oklab(a);
  const B = oklab(b);
  return Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]);
};

const RESERVED =
  /--color-(user-ink|focus-sketch|crayon-\w+|progress-ink|solver-ink-\d|gold-ink|red-ink|green-ink|orange-ink):\s*(#[0-9a-fA-F]{6})/g;
const STICK = /--color-peer-(\d+):\s*(#[0-9a-fA-F]{6})/g;

function read(css) {
  const reserved = [...css.matchAll(RESERVED)].map((m) => ({ name: m[1], hex: m[2] }));
  const dark = css.indexOf(".dark {");
  const arm = (block) =>
    [...block.matchAll(STICK)].map((m) => ({ i: +m[1], hex: m[2] }));
  return { reserved, light: arm(css.slice(0, dark)), dark: arm(css.slice(dark)) };
}

function run(css, label) {
  const { reserved, light, dark } = read(css);
  if (!light.length || light.length !== dark.length) {
    console.error(
      `INSTRUMENT BROKEN (${label}): ${light.length} light sticks and ${dark.length} dark`,
    );
    return 2;
  }
  console.log(
    `${label}: ${light.length} sticks, two arms · ${reserved.length} reserved inks read from index.css · MIN_SEP ${MIN_SEP}deg · MIN_DE ${MIN_DE}`,
  );
  const arms = [
    ["light", light],
    ["dark", dark],
  ];

  const g1 = [];
  for (const [name, sticks] of arms)
    for (const s of sticks)
      for (const r of reserved) {
        const d = gap(hueOf(s.hex), hueOf(r.hex));
        if (d < MIN_SEP)
          g1.push(
            `  COLLISION peer-${s.i} (${name} ${s.hex}, h=${hueOf(s.hex).toFixed(1)}) vs --color-${r.name} ${r.hex} (h=${hueOf(r.hex).toFixed(1)}): ${d.toFixed(1)}deg < ${MIN_SEP}deg`,
          );
      }
  const nearest = Math.min(
    ...arms.flatMap(([, sticks]) =>
      sticks.flatMap((s) => reserved.map((r) => gap(hueOf(s.hex), hueOf(r.hex)))),
    ),
  );
  if (g1.length) console.log(g1.join("\n"));
  console.log(
    `GATE 1 THE FAMILY LAW: ${g1.length ? `RED — ${g1.length} collisions` : "GREEN"} · nearest anchor ${nearest.toFixed(1)}deg`,
  );

  const g2 = [];
  for (const [name, sticks] of arms)
    for (let i = 0; i < sticks.length; i++)
      for (let j = i + 1; j < sticks.length; j++) {
        const e = dE(sticks[i].hex, sticks[j].hex);
        if (e < MIN_DE)
          g2.push(
            `  TOO CLOSE peer-${sticks[i].i} ${sticks[i].hex} vs peer-${sticks[j].i} ${sticks[j].hex} (${name}): ΔE ${e.toFixed(3)} < ${MIN_DE}`,
          );
      }
  const worst = Math.min(
    ...arms.flatMap(([, s]) =>
      s.flatMap((x, i) => s.slice(i + 1).map((y) => dE(x.hex, y.hex))),
    ),
  );
  if (g2.length) console.log(g2.join("\n"));
  console.log(
    `GATE 2 THE SEPARATION LAW: ${g2.length ? `RED — ${g2.length} pairs under the floor` : "GREEN"} · worst pair ΔE ${worst.toFixed(3)}`,
  );

  const anchors = new Set(reserved.map((r) => r.hex.toLowerCase()));
  const g3 = [...light, ...dark].filter((s) => anchors.has(s.hex.toLowerCase()));
  console.log(
    `GATE 3 THE ANCHOR TEST: ${g3.length ? `RED — ${g3.map((s) => s.hex).join(", ")} IS a reserved ink` : "GREEN"}`,
  );
  return g1.length || g2.length || g3.length ? 1 : 0;
}

const css = fs.readFileSync(INDEX_CSS, "utf8");
let code = run(css, "tin");

if (process.argv.includes("--self-test")) {
  // A thirteenth stick cut between amber and green — passes the anchor law, fails the eye.
  const control = css
    .replace(
      "--color-peer-2: #5f7d00;",
      "--color-peer-2: #5f7d00;\n  --color-peer-6: #b25000;",
    )
    .replace(
      "--color-peer-2: #a0c942;",
      "--color-peer-2: #a0c942;\n  --color-peer-6: #ff9b63;",
    );
  console.log("\n— negative control: a sixth stick 0.002 off amber —");
  const red = run(control, "control");
  if (red !== 1) {
    console.error("SELF-TEST FAILED: the control did not turn the census RED");
    code = code || 3;
  } else {
    console.log("SELF-TEST: the control is RED, as it must be");
  }
}

process.exit(code);
