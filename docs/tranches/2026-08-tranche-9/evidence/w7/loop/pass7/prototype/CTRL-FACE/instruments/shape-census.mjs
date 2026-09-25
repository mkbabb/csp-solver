// shape-census.mjs — THE shape-census library (T9-W7 pass 7, chair's instruments; registry-v6 §2.10;
// LAWS P6 §F "THE SHAPE LAW"). Seeded from NOTE-LEDGER's critic's `reserve-law.PROPOSED.mjs` (pass6/
// critique/NOTE-LEDGER/instruments/). A source gate reads the SHAPE, not the spelling. ONE copy: a lane
// that hand-rolls a second is a row against LAWS P6 §I.
//
// What it reads (every site a declaration can reach a subject from):
//   · EVERY <style> block of every SFC (scoped or not, a second block too), every stylesheet under src/,
//     public/** and index.html's <style>; comments stripped by a STRING-AWARE stripper per language
//     (a `/*` inside `accept="image/*"` or a CSS string never opens a comment)
//   · nested rules at any depth with their at-rule context, every declaration in SOURCE ORDER with
//     `!important` read; a SHORTHAND whose value is var()-led is a literal hit on every longhand
//   · the SUBJECT COMPOUND of each selector (the last compound): positive classes (incl. :is()/:where()
//     arms) vs negated ones (:not()) — `.x:not(.y)` is subject x under a condition, `.y:not(.x)` is NOT x
//   · template `style="…"` attributes, `:style` objects (quoted and unquoted keys, camelCase), `:style`
//     strings and template literals, and Tailwind candidates on elements whose class names the subject
//   · script style writes anywhere (.vue/.ts/.tsx/.js): `.style.prop =`, `.style['prop'] =`,
//     `.style[expr] =` (a COMPUTED key is reported unresolved — never dropped), `setProperty(…)` incl.
//     concatenated names, `Object.assign(x.style, {…})`
//   · tokens: `--x:` declarations everywhere; `resolve(value)` evaluates var() with fallbacks;
//     `var(--stem-${x})` is read as EVERY token under the stem
//   · colours: ONE parser for hex 3/4/6/8, rgb/rgba (comma or space, %), hsl/hsla (deg/turn/rad/grad),
//     hwb, lab, lch, oklab, oklch, color(srgb|srgb-linear|display-p3 …), named colours, transparent,
//     color-mix(in srgb|oklab …) → sRGB; `deltaE` in OKLab. A literal is scored by ΔE, never spelling.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

// ---------------------------------------------------------------------------------------- files
export function walk(dir, pred, out = []) {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    if (n === "node_modules" || n.startsWith(".")) continue;
    const p = join(dir, n); const s = statSync(p);
    if (s.isDirectory()) walk(p, pred, out); else if (pred(p)) out.push(p);
  }
  return out;
}
const isTest = (p) => /\.(test|spec)\.[cm]?[jt]sx?$/.test(p) || /[\\/]__tests__[\\/]/.test(p);
/** Every source a declaration can come from, under the frontend root `fe`. */
export function sources(fe, { tests = false } = {}) {
  const src = walk(join(fe, "src"), (p) => /\.(vue|css|ts|tsx|js|mjs|json)$/.test(p) && (tests || !isTest(p)));
  const pub = walk(join(fe, "public"), (p) => /\.css$/.test(p));
  const html = existsSync(join(fe, "index.html")) ? [join(fe, "index.html")] : [];
  return [...src, ...pub, ...html];
}

// ------------------------------------------------------------------------- string-aware strippers
/** CSS: removes /* … *\/ outside strings; keeps line count (comments → spaces, newlines kept). */
export function stripCss(s) {
  let o = "", q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { o += c; if (c === "\\") { o += s[++i] ?? ""; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'") { q = c; o += c; continue; }
    if (c === "/" && s[i + 1] === "*") { const e = s.indexOf("*/", i + 2); const end = e < 0 ? s.length : e + 2; o += s.slice(i, end).replace(/[^\n]/g, " "); i = end - 1; continue; }
    o += c;
  }
  return o;
}
/** JS/TS: removes // and /* *\/ outside strings and template literals (with ${} nesting). */
export function stripJs(s) {
  let o = "", i = 0; const stack = [];
  const blank = (t) => t.replace(/[^\n]/g, " ");
  while (i < s.length) {
    const c = s[i], top = stack.at(-1);
    if (top === "`") { if (c === "\\") { o += c + (s[i + 1] ?? ""); i += 2; continue; } if (c === "`") { stack.pop(); o += c; i++; continue; } if (c === "$" && s[i + 1] === "{") { stack.push("{"); o += "${"; i += 2; continue; } o += c; i++; continue; }
    if (top === '"' || top === "'") { if (c === "\\") { o += c + (s[i + 1] ?? ""); i += 2; continue; } if (c === top || c === "\n") stack.pop(); o += c; i++; continue; }
    if (c === '"' || c === "'" || c === "`") { stack.push(c); o += c; i++; continue; }
    if (c === "{" && top === "{") { stack.push("{"); o += c; i++; continue; }
    if (c === "}" && top === "{") { stack.pop(); o += c; i++; continue; }
    if (c === "/" && s[i + 1] === "/") { const e = s.indexOf("\n", i); const end = e < 0 ? s.length : e; o += blank(s.slice(i, end)); i = end; continue; }
    if (c === "/" && s[i + 1] === "*") { const e = s.indexOf("*/", i + 2); const end = e < 0 ? s.length : e + 2; o += blank(s.slice(i, end)); i = end; continue; }
    o += c; i++;
  }
  return o;
}
/** HTML/template: removes <!-- … --> (attribute values never open one: `<!--` only starts outside a tag). */
export function stripHtml(s) {
  let o = "", inTag = false, q = null;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inTag) { if (q) { if (c === q) q = null; } else if (c === '"' || c === "'") q = c; else if (c === ">") inTag = false; o += c; continue; }
    if (s.startsWith("<!--", i)) { const e = s.indexOf("-->", i + 4); const end = e < 0 ? s.length : e + 3; o += s.slice(i, end).replace(/[^\n]/g, " "); i = end - 1; continue; }
    if (c === "<" && /[a-zA-Z/]/.test(s[i + 1] ?? "")) inTag = true;
    o += c;
  }
  return o;
}

// ------------------------------------------------------------------------------------- SFC blocks
const lineAt = (s, idx) => s.slice(0, idx).split("\n").length;
/** { styles: [{attrs, css, line}], template: {text, line} | null, scripts: [{text, line}] } — EVERY block. */
export function sfc(text) {
  const styles = [...text.matchAll(/<style([^>]*)>([\s\S]*?)<\/style>/g)].map((m) => ({ attrs: m[1], css: m[2], line: lineAt(text, m.index + m[0].indexOf(">") + 1) }));
  const scripts = [...text.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)].map((m) => ({ attrs: m[1], text: m[2], line: lineAt(text, m.index + m[0].indexOf(">") + 1) }));
  const t0 = text.indexOf("<template"); const t1 = text.lastIndexOf("</template>");
  const template = t0 >= 0 && t1 > t0 ? { text: text.slice(text.indexOf(">", t0) + 1, t1), line: lineAt(text, text.indexOf(">", t0) + 1) } : null;
  return { styles, scripts, template };
}

// --------------------------------------------------------------------------------------- CSS rules
/** Nested rules: [{ctx: [at-preludes], prelude, decls: [{prop, value, important, line}], line}] in source order. */
export function cssRules(css, baseLine = 1, ctx = [], out = []) {
  const s = stripCss(css);
  let depth = 0, start = 0, open = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'") { const q = c; i++; while (i < s.length && s[i] !== q) { if (s[i] === "\\") i++; i++; } continue; }
    if (c === "{") { if (depth++ === 0) open = i; }
    else if (c === "}") {
      if (--depth === 0) {
        const prelude = s.slice(start, open).trim().replace(/^[;\s]+/, "").split(/;\s*/).pop().trim();
        const body = s.slice(open + 1, i);
        const line = baseLine + lineAt(s, open) - 1;
        if (prelude.startsWith("@")) {
          // CTRL-FACE pass 7 (PROPOSED): an at-rule whose body holds DECLARATIONS of its own (Tailwind v4's
          // `@utility x { font-family: … }`, `@font-face`, `@page`) was read only for nested rules, so every
          // declaration in it was dropped — typography.css's twelve `@utility` families never reached a law.
          // `@utility name` is the class `.name`; any other at-rule keeps its prelude (a descriptor block).
          const own = decls(body.replace(/[^{};]*\{(?:[^{}]|\{[^{}]*\})*\}/g, ""), line);
          const at = prelude.replace(/\s+/g, " ");
          if (own.length) out.push({ ctx, prelude: /^@utility\s+([\w-]+)/.test(at) ? `.${/^@utility\s+([\w-]+)/.exec(at)[1]}` : at, decls: own, line });
          cssRules(body, line, [...ctx, at], out);
        }
        else {
          // a nested rule inside a style rule (CSS nesting) — flatten with `&`
          const nested = [];
          const flat = body.replace(/([^{};]+)\{([^{}]*)\}/g, (m, pre, inner) => { nested.push({ pre: pre.trim(), inner }); return ""; });
          out.push({ ctx, prelude: prelude.replace(/\s+/g, " "), decls: decls(flat, line), line });
          for (const n of nested) out.push({ ctx, prelude: n.pre.includes("&") ? n.pre.replace(/&/g, prelude) : `${prelude} ${n.pre}`, decls: decls(n.inner, line), line });
        }
        start = i + 1;
      }
    } else if (c === ";" && depth === 0) start = i + 1;
  }
  return out;
}
/** Declarations of a block body in source order (strings respected). */
export function decls(body, line = 0) {
  const out = []; let cur = "", q = null, par = 0;
  const push = () => { const m = /^\s*(--[\w-]+|-?[a-zA-Z][\w-]*)\s*:\s*([\s\S]*)$/.exec(cur); if (m) { let v = m[2].trim(); const imp = /!\s*important\s*$/i.test(v); if (imp) v = v.replace(/!\s*important\s*$/i, "").trim(); out.push({ prop: m[1].startsWith("--") ? m[1] : m[1].toLowerCase(), value: v, important: imp, line }); } cur = ""; };
  for (const c of body) { if (q) { cur += c; if (c === q) q = null; continue; } if (c === '"' || c === "'") { q = c; cur += c; continue; } if (c === "(") par++; if (c === ")") par--; if (c === ";" && par === 0) { push(); continue; } cur += c; }
  push();
  return out;
}

// ------------------------------------------------------------------------------------- selectors
const splitTop = (s, sep) => { const out = []; let d = 0, cur = "", q = null; for (const c of s) { if (q) { cur += c; if (c === q) q = null; continue; } if (c === '"' || c === "'") q = c; if (c === "(" || c === "[") d++; if (c === ")" || c === "]") d--; if (d === 0 && sep.test(c)) { out.push(cur); cur = ""; continue; } cur += c; } out.push(cur); return out.map((x) => x.trim()).filter(Boolean); };
/** The subject compound of one complex selector (the last compound after a combinator). */
export function subjectCompound(sel) {
  const s = sel.replace(/:deep\(([^)]*)\)/g, " $1").replace(/::v-deep/g, " ").replace(/::?[\w-]+$/, (m) => (/^::/.test(m) ? "" : m));
  const parts = splitTop(s, /[\s>+~]/);
  return parts.at(-1) ?? "";
}
/** { pos: Set<class>, neg: Set<class>, tags } of a compound: :not() args negate; :is()/:where() args are positive arms. */
export function compoundClasses(compound) {
  const pos = new Set(), neg = new Set();
  let rest = compound;
  rest = rest.replace(/:not\(((?:[^()]|\([^()]*\))*)\)/g, (m, inner) => { for (const c of inner.matchAll(/\.([\w-]+)/g)) neg.add(c[1]); return ""; });
  rest = rest.replace(/:(?:is|where|matches)\(((?:[^()]|\([^()]*\))*)\)/g, (m, inner) => { for (const arm of splitTop(inner, /,/)) for (const c of subjectCompound(arm).matchAll(/\.([\w-]+)/g)) pos.add(c[1]); return ""; });
  for (const c of rest.matchAll(/\.([\w-]+)/g)) pos.add(c[1]);
  return { pos, neg };
}
/** Does the prelude's selector list carry `cls` in some selector's SUBJECT compound (positively)? */
export function subjectHas(prelude, cls) {
  if (cls === "*") return true; // CTRL-FACE pass 7 (PROPOSED): the WILDCARD subject — a law over every rule (CHECK 7: every font-family)
  return splitTop(prelude, /,/).some((sel) => compoundClasses(subjectCompound(sel)).pos.has(cls));
}

// ---------------------------------------------------------------------------------- shorthands
const SHORTHANDS = {
  font: ["font-family", "font-size", "font-weight", "font-style", "line-height", "font-variant", "font-stretch"],
  margin: ["margin-top", "margin-right", "margin-bottom", "margin-left"], padding: ["padding-top", "padding-right", "padding-bottom", "padding-left"],
  inset: ["top", "right", "bottom", "left"], transition: ["transition-property", "transition-duration", "transition-timing-function", "transition-delay"],
  animation: ["animation-name", "animation-duration", "animation-timing-function", "animation-delay", "animation-iteration-count", "animation-direction", "animation-fill-mode"],
  overflow: ["overflow-x", "overflow-y"], "contain-intrinsic-size": ["contain-intrinsic-width", "contain-intrinsic-height"],
  border: ["border-width", "border-style", "border-color"], outline: ["outline-width", "outline-style", "outline-color"], background: ["background-color", "background-image"],
};
/** Does declaration `d` set `prop` (directly, via its shorthand, or as a var()-led shorthand — a literal hit)? */
export function sets(d, prop) {
  if (d.prop === prop) return true;
  const lh = SHORTHANDS[d.prop];
  if (lh && lh.includes(prop)) return true;
  if (d.prop === "min-block-size" && prop === "min-height") return true;
  return false;
}
const kebab = (k) => k.replace(/^['"]|['"]$/g, "").replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

// ------------------------------------------------------------------------- template + script sites
/** Elements in a template whose static class or :class names `cls`: their style=, :style, Tailwind candidates. */
export function templateSites(tpl, cls, baseLine = 1) {
  const t = stripHtml(tpl); const out = [];
  for (const m of t.matchAll(/<([a-zA-Z][\w-]*)((?:\s+(?:"[^"]*"|'[^']*'|[^\s>"'])+)*)\s*\/?>/g)) {
    const attrs = m[2] ?? ""; const line = baseLine + lineAt(t, m.index) - 1;
    const classes = [...attrs.matchAll(/(?:^|\s)(?::class|v-bind:class|class)\s*=\s*("([^"]*)"|'([^']*)')/g)].map((a) => a[2] ?? a[3]).join(" ");
    if (cls !== "*" && !new RegExp(`(^|[^\\w-])${cls.replace(/[-]/g, "\\-")}(?![\\w-])`).test(classes)) continue;
    for (const a of attrs.matchAll(/(?:^|\s)(:style|v-bind:style|style)\s*=\s*("([^"]*)"|'([^']*)')/g)) {
      const raw = a[3] ?? a[4];
      if (a[1] === "style") for (const d of decls(raw, line)) out.push({ kind: "style-attr", ...d, file: null });
      else {
        for (const kv of raw.matchAll(/(['"]?)([a-zA-Z-]+)\1\s*:\s*([^,}]+)/g)) out.push({ kind: "style-object", prop: kebab(kv[2]), value: kv[3].trim(), important: /!important/.test(kv[3]), line });
        for (const str of raw.matchAll(/(`|')([^`']*?:[^`']*)\1/g)) for (const d of decls(str[2], line)) out.push({ kind: "style-string", ...d });
      }
    }
    // CTRL-FACE pass 7 (PROPOSED): the split on `[`/`]`/`:` cut every arbitrary value (`font-[Comic_Sans_MS]`
    // read as `font-` + `Comic_Sans_MS`, invisible) — split on whitespace, quotes, braces and commas; a
    // trailing `:` (an object key) is trimmed; a variant prefix (`hover:`) is TAILWIND's to strip.
    for (const tw of classes.split(/[\s'"{},]+/).map((x) => x.replace(/:$/, ""))) { const map = TAILWIND(tw); if (map) out.push({ kind: "tailwind", prop: map[0], value: map[1], important: tw.startsWith("!"), line, token: tw }); }
  }
  return out;
}
/** A small Tailwind candidate table (the utilities the estate's gates key on); unknown utilities are ignored. */
export function TAILWIND(tw) {
  const t = tw.replace(/^!/, "").replace(/^[\w-]+:/, "");
  let m;
  if ((m = /^min-h-(.+)$/.exec(t))) return ["min-height", m[1] === "0" ? "0px" : m[1].replace(/^\[|\]$/g, "")];
  if ((m = /^font-(sans|serif|mono|hand|display)$/.exec(t))) return ["font-family", m[1]];
  if ((m = /^font-\[(.+)\]$/.exec(t))) return ["font-family", m[1]];
  if ((m = /^overflow-(hidden|clip|visible|auto|scroll)$/.exec(t))) return ["overflow", m[1]];
  if ((m = /^(?:text|bg|border|stroke|fill)-\[(#[0-9a-fA-F]{3,8}|(?:rgb|hsl|oklch|oklab|lab|lch|hwb)\([^\]]+\))\]$/.exec(t))) return ["color-literal", m[1]];
  return null;
}
/** Script style writes of `prop` (kebab) anywhere in `text`; computed keys are reported as unresolved sites. */
export function scriptWrites(text, prop, baseLine = 1) {
  const s = stripJs(text); const out = []; const camel = prop.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
  const L = (i) => baseLine + lineAt(s, i) - 1;
  for (const m of s.matchAll(/\.style\.([a-zA-Z]+)\s*=(?!=)\s*([^;\n]+)/g)) if (m[1] === camel) out.push({ kind: "script-write", prop, value: m[2].trim(), line: L(m.index) });
  for (const m of s.matchAll(/\.style\[\s*(['"`])([^'"`]+)\1\s*\]\s*=(?!=)\s*([^;\n]+)/g)) if (kebab(m[2]) === prop) out.push({ kind: "script-write", prop, value: m[3].trim(), line: L(m.index) });
  for (const m of s.matchAll(/\.style\[\s*([^\]'"`]+)\s*\]\s*=(?!=)\s*([^;\n]+)/g)) out.push({ kind: "script-write-computed", prop: `?${m[1].trim()}`, value: m[2].trim(), line: L(m.index), unresolved: true });
  for (const m of s.matchAll(/setProperty\(\s*([^,]+),\s*([^)]+)\)/g)) {
    const k = m[1].trim(); const lit = /^(['"`])([^'"`$]*)\1$/.exec(k);
    if (lit) { if (kebab(lit[2]) === prop) out.push({ kind: "script-setProperty", prop, value: m[2].trim(), line: L(m.index) }); }
    else out.push({ kind: "script-setProperty-computed", prop: `?${k}`, value: m[2].trim(), line: L(m.index), unresolved: true });
  }
  for (const m of s.matchAll(/Object\.assign\(\s*[\w.$?]+\.style\s*,\s*\{([^}]*)\}/g)) for (const kv of m[1].matchAll(/(['"]?)([a-zA-Z-]+)\1\s*:\s*([^,}]+)/g)) if (kebab(kv[2]) === prop) out.push({ kind: "script-assign", prop, value: kv[3].trim(), line: L(m.index) });
  return out;
}

// ------------------------------------------------------------------------------------- the census
/** Every site that sets `prop` on subject class `cls`, tree-wide, in source order per file.
 *  Returns [{file, kind, ctx, prelude, prop, value, important, line, unresolved?}]. */
export function census(fe, cls, prop, { files, read, extra = [] } = {}) {
  const out = []; const rd = read ?? ((f) => readFileSync(f, "utf8"));
  for (const f of [...(files ?? sources(fe)), ...extra]) {
    const rel = relative(fe, f); const text = rd(f);
    const cssBlocks = f.endsWith(".vue") ? sfc(text).styles.map((b) => ({ css: b.css, line: b.line, kind: /scoped/.test(b.attrs) ? "sfc-style-scoped" : "sfc-style" }))
      : f.endsWith(".css") ? [{ css: text, line: 1, kind: rel.startsWith("public") ? "public-css" : "stylesheet" }]
      : f.endsWith(".html") ? [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => ({ css: m[1], line: lineAt(text, m.index), kind: "index-html" })) : [];
    for (const b of cssBlocks) for (const r of cssRules(b.css, b.line)) if (subjectHas(r.prelude, cls)) for (const d of r.decls) if (sets(d, prop)) out.push({ file: rel, kind: b.kind, ctx: r.ctx.join(" "), prelude: r.prelude, prop: d.prop, value: d.value, important: d.important, line: d.line, varLed: d.prop !== prop && /^\s*var\(/.test(d.value) });
    if (f.endsWith(".vue")) {
      const b = sfc(text);
      if (b.template) for (const s of templateSites(b.template.text, cls, b.template.line)) if (s.prop === prop) out.push({ ctx: "", prelude: `<template .${cls}>`, ...s, file: rel }); // pass 7 (PROPOSED): `...s` carried `file: null` over the file
      for (const sc of b.scripts) for (const w of scriptWrites(sc.text, prop, sc.line)) out.push({ file: rel, ctx: "", prelude: "<script>", ...w });
    } else if (/\.(ts|tsx|js|mjs)$/.test(f)) for (const w of scriptWrites(text, prop)) out.push({ file: rel, ctx: "", prelude: "<script>", ...w });
  }
  return out;
}
/** Tokens: every `--x: v` declaration tree-wide (last wins per name; all kept in `all`). */
export function tokens(fe, { files, read, extra = [] } = {}) {
  const map = new Map(), all = []; const rd = read ?? ((f) => readFileSync(f, "utf8"));
  for (const f of [...(files ?? sources(fe)), ...extra]) {
    const text = rd(f);
    const blocks = f.endsWith(".vue") ? sfc(text).styles.map((b) => b.css) : f.endsWith(".css") ? [text] : [];
    for (const css of blocks) for (const r of cssRules(css)) for (const d of r.decls) if (d.prop.startsWith("--")) { map.set(d.prop, d.value); all.push({ file: relative(fe, f), prelude: r.prelude, ctx: r.ctx.join(" "), ...d }); }
  }
  return { map, all };
}
/** Resolve var() with fallbacks against a token map; `var(--stem-${x})` → every token under the stem. */
export function resolve(value, map, depth = 0) {
  if (depth > 8) return value;
  return value.replace(/var\(\s*(--[\w-]*(?:\$\{[^}]*\}[\w-]*)?)\s*(?:,\s*((?:[^()]|\([^()]*\))*))?\)/g, (m, name, fb) => {
    if (name.includes("${")) { const stem = name.slice(0, name.indexOf("${")); const hits = [...map.keys()].filter((k) => k.startsWith(stem)); return hits.length ? `{${hits.map((k) => resolve(map.get(k), map, depth + 1)).join("|")}}` : (fb != null ? resolve(fb, map, depth + 1) : m); }
    if (map.has(name)) return resolve(map.get(name), map, depth + 1);
    return fb != null ? resolve(fb.trim(), map, depth + 1) : m;
  });
}

// ------------------------------------------------------------------------------------------ colour
const NAMED = "aliceblue f0f8ff antiquewhite faebd7 aqua 00ffff aquamarine 7fffd4 azure f0ffff beige f5f5dc bisque ffe4c4 black 000000 blanchedalmond ffebcd blue 0000ff blueviolet 8a2be2 brown a52a2a burlywood deb887 cadetblue 5f9ea0 chartreuse 7fff00 chocolate d2691e coral ff7f50 cornflowerblue 6495ed cornsilk fff8dc crimson dc143c cyan 00ffff darkblue 00008b darkcyan 008b8b darkgoldenrod b8860b darkgray a9a9a9 darkgreen 006400 darkgrey a9a9a9 darkkhaki bdb76b darkmagenta 8b008b darkolivegreen 556b2f darkorange ff8c00 darkorchid 9932cc darkred 8b0000 darksalmon e9967a darkseagreen 8fbc8f darkslateblue 483d8b darkslategray 2f4f4f darkslategrey 2f4f4f darkturquoise 00ced1 darkviolet 9400d3 deeppink ff1493 deepskyblue 00bfff dimgray 696969 dimgrey 696969 dodgerblue 1e90ff firebrick b22222 floralwhite fffaf0 forestgreen 228b22 fuchsia ff00ff gainsboro dcdcdc ghostwhite f8f8ff gold ffd700 goldenrod daa520 gray 808080 green 008000 greenyellow adff2f grey 808080 honeydew f0fff0 hotpink ff69b4 indianred cd5c5c indigo 4b0082 ivory fffff0 khaki f0e68c lavender e6e6fa lavenderblush fff0f5 lawngreen 7cfc00 lemonchiffon fffacd lightblue add8e6 lightcoral f08080 lightcyan e0ffff lightgoldenrodyellow fafad2 lightgray d3d3d3 lightgreen 90ee90 lightgrey d3d3d3 lightpink ffb6c1 lightsalmon ffa07a lightseagreen 20b2aa lightskyblue 87cefa lightslategray 778899 lightslategrey 778899 lightsteelblue b0c4de lightyellow ffffe0 lime 00ff00 limegreen 32cd32 linen faf0e6 magenta ff00ff maroon 800000 mediumaquamarine 66cdaa mediumblue 0000cd mediumorchid ba55d3 mediumpurple 9370db mediumseagreen 3cb371 mediumslateblue 7b68ee mediumspringgreen 00fa9a mediumturquoise 48d1cc mediumvioletred c71585 midnightblue 191970 mintcream f5fffa mistyrose ffe4e1 moccasin ffe4b5 navajowhite ffdead navy 000080 oldlace fdf5e6 olive 808000 olivedrab 6b8e23 orange ffa500 orangered ff4500 orchid da70d6 palegoldenrod eee8aa palegreen 98fb98 paleturquoise afeeee palevioletred db7093 papayawhip ffefd5 peachpuff ffdab9 peru cd853f pink ffc0cb plum dda0dd powderblue b0e0e6 purple 800080 rebeccapurple 663399 red ff0000 rosybrown bc8f8f royalblue 4169e1 saddlebrown 8b4513 salmon fa8072 sandybrown f4a460 seagreen 2e8b57 seashell fff5ee sienna a0522d silver c0c0c0 skyblue 87ceeb slateblue 6a5acd slategray 708090 slategrey 708090 snow fffafa springgreen 00ff7f steelblue 4682b4 tan d2b48c teal 008080 thistle d8bfd8 tomato ff6347 turquoise 40e0d0 violet ee82ee wheat f5deb3 white ffffff whitesmoke f5f5f5 yellow ffff00 yellowgreen 9acd32".split(" ");
const NAMED_MAP = new Map(); for (let i = 0; i < NAMED.length; i += 2) NAMED_MAP.set(NAMED[i], NAMED[i + 1]);
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4), toGam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const clamp01 = (x) => Math.min(1, Math.max(0, x));
function oklabToSrgb(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b, m_ = L - 0.1055613458 * a - 0.0638541728 * b, s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s].map((v) => clamp01(toGam(v)));
}
export function srgbToOklab([r, g, b]) {
  const R = toLin(r), G = toLin(g), B = toLin(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function labToSrgb(L, a, b) { // CIE Lab (D50) → sRGB
  const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200, e = 216 / 24389, k = 24389 / 27;
  const X = 0.96422 * (fx ** 3 > e ? fx ** 3 : (116 * fx - 16) / k), Y = L > k * e ? fy ** 3 : L / k, Z = 0.82521 * (fz ** 3 > e ? fz ** 3 : (116 * fz - 16) / k);
  const Xd = 0.9554734527042182 * X - 0.023098536874261423 * Y + 0.0632593086610217 * Z, Yd = -0.028369706963208136 * X + 1.0099954580058226 * Y + 0.021041398966943008 * Z, Zd = 0.012314001688319899 * X - 0.020507696433157868 * Y + 1.3303659366080753 * Z;
  return [3.2404542 * Xd - 1.5371385 * Yd - 0.4985314 * Zd, -0.969266 * Xd + 1.8760108 * Yd + 0.041556 * Zd, 0.0556434 * Xd - 0.2040259 * Yd + 1.0572252 * Zd].map((v) => clamp01(toGam(v)));
}
const num = (t, pct = 1) => (t.endsWith("%") ? (parseFloat(t) / 100) * pct : parseFloat(t));
const hue = (t) => (t.endsWith("turn") ? parseFloat(t) * 360 : t.endsWith("grad") ? parseFloat(t) * 0.9 : t.endsWith("rad") ? (parseFloat(t) * 180) / Math.PI : parseFloat(t));
function hslToRgb(h, s, l) { h = ((h % 360) + 360) % 360; const f = (n) => { const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l); return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return [f(0), f(8), f(4)]; }
/** Any CSS <color> → {rgb: [0..1]×3, a} or null. `color-mix(in srgb|oklab, A p%, B)` is evaluated. */
export function parseColor(str) {
  const s = String(str).trim().toLowerCase();
  if (s === "transparent") return { rgb: [0, 0, 0], a: 0 };
  if (NAMED_MAP.has(s)) return parseColor("#" + NAMED_MAP.get(s));
  let m;
  if ((m = /^#([0-9a-f]{3,8})$/.exec(s))) { let h = m[1]; if (h.length <= 4) h = [...h].map((c) => c + c).join(""); if (h.length !== 6 && h.length !== 8) return null; const v = [0, 2, 4, 6].map((i) => parseInt(h.slice(i, i + 2) || "ff", 16) / 255); return { rgb: v.slice(0, 3), a: v[3] }; }
  if ((m = /^([a-z-]+)\((.*)\)$/.exec(s))) {
    const fn = m[1]; const inner = m[2];
    if (fn === "color-mix") {
      const parts = splitTop(inner, /,/); const space = /in\s+([\w-]+)/.exec(parts[0])?.[1] ?? "srgb";
      const arm = (p) => { const pm = /\s(\d*\.?\d+)%\s*$/.exec(p) ?? /^(\d*\.?\d+)%\s/.exec(p); return { c: parseColor(p.replace(/\s*\d*\.?\d+%\s*/, " ").trim()), p: pm ? parseFloat(pm[1]) / 100 : null }; };
      const A = arm(parts[1]), B = arm(parts[2]); if (!A.c || !B.c) return null;
      let pa = A.p ?? (B.p != null ? 1 - B.p : 0.5), pb = B.p ?? 1 - pa; const sum = pa + pb; const alphaMul = sum < 1 ? sum : 1; pa /= sum; pb /= sum;
      const a = A.c.a * pa + B.c.a * pb;
      const pre = (c) => (space === "oklab" || space === "oklch" ? srgbToOklab(c.rgb) : c.rgb).map((v) => v * c.a);
      const mix = pre(A.c).map((v, i) => (v * pa + pre(B.c)[i] * pb) / (a || 1));
      return { rgb: space === "oklab" || space === "oklch" ? oklabToSrgb(...mix) : mix, a: a * alphaMul };
    }
    const [body, alpha] = inner.split("/").map((x) => x?.trim());
    const t = body.split(/[\s,]+/).filter(Boolean); const a = alpha != null ? num(alpha) : t.length === 4 ? num(t[3]) : 1;
    if (fn === "rgb" || fn === "rgba") return { rgb: t.slice(0, 3).map((x) => num(x, 255) / 255), a };
    if (fn === "hsl" || fn === "hsla") return { rgb: hslToRgb(hue(t[0]), num(t[1].endsWith("%") ? t[1] : t[1] + "%"), num(t[2].endsWith("%") ? t[2] : t[2] + "%")), a };
    if (fn === "hwb") { const w = num(t[1]), b = num(t[2]); const base = hslToRgb(hue(t[0]), 1, 0.5); const k = w + b > 1 ? 1 / (w + b) : 1; return { rgb: base.map((v) => v * (1 - w * k - b * k) + w * k), a }; }
    if (fn === "oklab") return { rgb: oklabToSrgb(num(t[0]), num(t[1], 0.4), num(t[2], 0.4)), a };
    if (fn === "oklch") { const L = num(t[0]), C = num(t[1], 0.4), H = (hue(t[2]) * Math.PI) / 180; return { rgb: oklabToSrgb(L, C * Math.cos(H), C * Math.sin(H)), a }; }
    if (fn === "lab") return { rgb: labToSrgb(num(t[0], 100), num(t[1], 125), num(t[2], 125)), a };
    if (fn === "lch") { const C = num(t[1], 150), H = (hue(t[2]) * Math.PI) / 180; return { rgb: labToSrgb(num(t[0], 100), C * Math.cos(H), C * Math.sin(H)), a }; }
    if (fn === "color") { const sp = t[0]; const v = t.slice(1, 4).map((x) => num(x)); if (sp === "srgb") return { rgb: v, a }; if (sp === "srgb-linear") return { rgb: v.map(toGam), a }; if (sp === "display-p3") { const L = v.map(toLin); return { rgb: [1.2249 * L[0] - 0.2247 * L[1], -0.0420 * L[0] + 1.0419 * L[1], -0.0197 * L[0] - 0.0786 * L[1] + 1.0979 * L[2]].map((x) => clamp01(toGam(x))), a }; } }
  }
  return null;
}
/** ΔE in OKLab (×100, the usual scale: 2 ≈ just noticeable). */
export function deltaE(c1, c2) { const A = srgbToOklab(c1.rgb), B = srgbToOklab(c2.rgb); return 100 * Math.hypot(A[0] - B[0], A[1] - B[1], A[2] - B[2]); }
/** Every colour literal in a value, in any syntax. */
export function colorLiterals(value) {
  const out = []; const re = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\((?:[^()]|\([^()]*\))*\)|\b[a-zA-Z]+\b/g;
  for (const m of value.matchAll(re)) { if (/^[a-zA-Z]+$/.test(m[0]) && !NAMED_MAP.has(m[0].toLowerCase())) continue; const c = parseColor(m[0]); if (c) out.push({ text: m[0], ...c }); }
  return out;
}
