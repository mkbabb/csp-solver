#!/usr/bin/env node
/**
 * WHAT THE TWO NEW RULES WOULD COST (T9-W7 pass 2, MOT-VERB research).
 *
 * The charter asks for two things the pass-1 gate cannot do:
 *   RULE 1′ — outside the keyframe exemption a declaration must name a `--verb-*-ease`,
 *             not merely "a house token". (Negative control A: a cured row reverted to
 *             `var(--ease-glassGlide)` must go RED.)
 *   RULE 5  — the properties a declaration animates must be a SUBSET of the verb's own
 *             property set. (Negative control B: `note-in … var(--verb-rubOut-ease)`
 *             must go RED, because `note-in` moves transform+opacity and rubOut owns
 *             clip-path+opacity.)
 *
 * This reads the prototype's `src/` and reports, per declaration, what each rule would say
 * — so the synthesizer knows the rule's COST (how many honest rows it newly reds) before
 * it writes it. Read-only; nothing is written to any tree.
 *
 *   SRC=<a src dir> node enforce-cost.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const SRC = resolve(process.env.SRC ?? ".");

// MOTION.verbs' property sets, verbatim from the pass-1 diff (pencilConfig.ts).
const PROPS = {
  layDown: ["opacity", "transform", "background-color", "color", "box-shadow", "stroke"],
  lift: ["opacity", "transform", "scale"],
  turn: ["transform"],
  slide: ["transform"],
  writeIn: ["clip-path", "stroke-dashoffset", "opacity"],
  rubOut: ["clip-path", "opacity"],
  dusk: ["background-color", "color"],
};
// What each shipped @keyframes actually moves, read from the stylesheets (see
// readings/keyframe-properties.txt — this map is the reading, not a guess).
const KEYFRAME_PROPS = {};

const DECL = /(?:transition|animation)(?:-[a-z-]+)?\s*:\s*/;
const RAW_MS = /(?<!\()\b\d+(?:\.\d+)?m?s\b/;

function* walk(dir) {
  for (const n of readdirSync(dir).sort()) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { if (n !== "dev") yield* walk(p); }
    else if (/\.(vue|css)$/.test(n)) yield p;
  }
}
function strip(text) {
  let out = "";
  for (let i = 0, n = text.length; i < n;) {
    if (text[i] === "/" && text[i + 1] === "*") {
      const e = text.indexOf("*/", i + 2), end = e < 0 ? n : e + 2;
      for (let k = i; k < end; k++) out += text[k] === "\n" ? "\n" : " ";
      i = end;
    } else if (text[i] === "/" && text[i + 1] === "/") {
      while (i < n && text[i] !== "\n") { out += " "; i++; }
    } else out += text[i++];
  }
  return out;
}
function terms(body) {
  const out = []; let d = 0, cur = "";
  for (const ch of body) {
    if (ch === "(") d++; else if (ch === ")") d--;
    if (ch === "," && d === 0) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out;
}

/** Read every @keyframes in the tree and record the properties it actually moves. */
function readKeyframes() {
  for (const f of walk(SRC)) {
    const t = strip(readFileSync(f, "utf8"));
    const re = /@keyframes\s+([A-Za-z-]+)\s*\{/g;
    let m;
    while ((m = re.exec(t))) {
      let d = 1, i = re.lastIndex, body = "";
      while (i < t.length && d > 0) {
        if (t[i] === "{") d++; else if (t[i] === "}") d--;
        if (d > 0) body += t[i];
        i++;
      }
      const props = new Set();
      for (const p of body.matchAll(/(?:^|[{;\s])([a-z-]+)\s*:/g)) {
        const name = p[1];
        if (name === "animation-timing-function") continue;
        props.add(name);
      }
      KEYFRAME_PROPS[m[1]] = [...props].sort();
    }
  }
}
readKeyframes();

const stats = { rows: 0, rule1Red: 0, rule5Red: 0, rule5Unknown: 0 };
const out = [];
for (const file of walk(SRC)) {
  const lines = strip(readFileSync(file, "utf8")).split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (!DECL.test(lines[i])) continue;
    let buf = lines[i], j = i;
    while (!buf.includes(";") && j - i < 8 && j + 1 < lines.length) buf += " " + lines[++j];
    const body = buf.slice(buf.search(DECL)).replace(DECL, "").split(";")[0].replace(/\s+/g, " ").trim();
    const at = `${relative(SRC, file)}:${i + 1}`;
    i = j;
    if (!body || body.startsWith("none")) continue;
    stats.rows++;
    const isAnim = /animation(?:-[a-z-]+)?\s*:/.test(buf.slice(buf.search(DECL)));

    for (const term of terms(body)) {
      const t = term.trim();
      if (!t) continue;
      const verb = /var\(--verb-([A-Za-z]+)-ease\)/.exec(t)?.[1];
      const legacy = /var\(--ease-([A-Za-z]+)\)/.exec(t)?.[1];
      // what the term animates
      let moved = null, how = "";
      if (isAnim) {
        const kf = /^([A-Za-z][A-Za-z0-9-]*)/.exec(t)?.[1];
        if (kf && KEYFRAME_PROPS[kf]) { moved = KEYFRAME_PROPS[kf]; how = `keyframe ${kf}`; }
        else if (kf) { moved = null; how = `keyframe ${kf} (not found)`; }
      } else {
        const p = /^([a-z-]+)\b/.exec(t)?.[1];
        if (p && p !== "var") { moved = [p]; how = `property ${p}`; }
      }

      // RULE 1′: outside a keyframe's own timing function, a legacy token is not a verb.
      if (legacy && !verb && !isAnim) {
        stats.rule1Red++;
        out.push(`RULE1  ${at.padEnd(46)} transition names --ease-${legacy}, not a verb   [${t.slice(0, 54)}]`);
      }
      if (legacy && !verb && isAnim) {
        stats.rule1Red++;
        out.push(`RULE1? ${at.padEnd(46)} animation shorthand names --ease-${legacy} (shorthand, not an inner step) [${t.slice(0, 40)}]`);
      }

      // RULE 5: the moved properties must be a subset of the verb's set.
      if (verb) {
        const own = PROPS[verb];
        if (!moved) { stats.rule5Unknown++; out.push(`RULE5? ${at.padEnd(46)} ${verb}: cannot read what moves (${how})`); continue; }
        const outside = moved.filter((p) => !own.includes(p));
        if (outside.length) {
          stats.rule5Red++;
          out.push(`RULE5  ${at.padEnd(46)} ${verb} does not own ${outside.join(", ")}  (${how}; ${verb} owns ${own.join(", ")})`);
        }
      }
    }
  }
}
console.log("KEYFRAMES AND WHAT THEY MOVE");
for (const [k, v] of Object.entries(KEYFRAME_PROPS).sort()) console.log(`  ${k.padEnd(24)} ${v.join(", ")}`);
console.log("\nWHAT THE TWO RULES WOULD SAY");
for (const l of out) console.log("  " + l);
console.log(`\ndeclarations read ${stats.rows} · rule 1′ reds ${stats.rule1Red} · rule 5 reds ${stats.rule5Red} · rule 5 unreadable ${stats.rule5Unknown}`);
