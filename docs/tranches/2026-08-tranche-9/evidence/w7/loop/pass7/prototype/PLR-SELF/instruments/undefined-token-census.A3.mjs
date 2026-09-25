#!/usr/bin/env node
/**
 * THE THEME-TOKEN CENSUS (T5-W2 2.3a) — every `@theme` custom property must have a consumer.
 *
 * A design token nobody reads is not a palette, it's a decoy: the next hand to pick a colour
 * reads `--color-primary` off the theme block, uses it, and inherits shadcn's default greys in
 * a crayon estate. This script asserts the `@theme` block's declared surface equals its
 * consumed surface — 0 unreferenced — and prints the unreferenced ones by name when it fails.
 *
 * WHAT COUNTS AS A REFERENCE (the corpus is `src/**` minus this file, `e2e/**`, `index.html`):
 *   1. `var(--tok)` / `var(--tok, fallback)` anywhere in the corpus.
 *   2. A Tailwind v4 utility minted from the token's NAMESPACE — `--color-X` mints `bg-X`,
 *      `text-X`, `border-X` and the rest of the colour utilities; `--font-X` mints `font-X`;
 *      `--ease-X` mints `ease-X`. Namespaces Tailwind does not read from (`--sheet-*`,
 *      `--ink-press-*`, `--paper-*`, `--grid-*`, bare `--radius`) mint nothing, so var() is
 *      their only form.
 *   3. TRANSITIVE, inside `index.css` itself: a token read by a LIVE token is live. This arm is
 *      stronger than the wave-open instrument (which counted the corpus alone) and exists so an
 *      alias chain — `--color-easy: var(--color-crayon-green)` — cannot kill its own base. Both
 *      figures are printed; they must agree, and where they do not the transitive one rules.
 *
 * THE REVERSE DIRECTION — THE UNDEFINED-TOKEN CENSUS (T9-W7 §13, registry §2.11; the gate
 * MOT-VERB owns and every rung consumer runs). The census above hunts DECLARED-but-unread. It
 * is one-directional, and the estate had nothing at all pointed the other way: a `var(--x)`
 * naming a token nobody declares is invalid at computed-value time, the declaration falls back
 * to its initial (`transition` → `all | 0s | ease`) and EVERY gate in the estate reads green
 * over it. That is how `--verb-dusk-ms` shipped through pass 3 with the theme turn not painting
 * in either engine under `lint:verbs` exit 0.
 *
 * THE LAW, in one sentence: a `var(--x)` written BARE must resolve against the declared set.
 * A `var(--x, fallback)` is a HOOK — it names its own failure value, so it cannot fail silently
 * — and is exempt; chair §6.5 strikes the fallback on every MEASURED token, which is the act
 * that moves a hook into this census. Timing slots are counted and printed FIRST, because a
 * length that resolves to nothing is the one failure the eye reads as "nothing happened".
 *
 * WHAT DECLARES A TOKEN: `--x:` anywhere in `src/**` (`@theme`, `:root`, a scoped rule, a style
 * attribute), `@property --x`, `el.style.setProperty("--x", …)`, and a `"--x":` key in a style
 * object. COMMENTS ARE MASKED before anything is read — prose about a token is not a reference
 * (four of the ten first reds were a docstring), and masking preserves offsets so nothing else
 * shifts.
 *
 * `--self-test` mints negative controls for BOTH directions: re-declaring a known-dead token
 * must turn the forward census RED; a bare `var()` on an unknown token in a timing slot, and
 * one outside a timing slot, must each turn the reverse census RED; and the HOOK form must
 * stay green, so the exemption is a rule and not a hole. A census that cannot be shown failing
 * is not a gate.
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

// THE ONE COPY (T9-W7 pass 6, the chair's instruments lane; pass6/CHAIR-RULINGS §1.3): every
// rung consumer runs THIS file with FE pointed at its tree's web/frontend —
//   FE=<work>/web/frontend node <this file> --self-test
// It is MOT-VERB's pass-5 `check-theme-tokens.mjs` (byte-identical to the §13 tree's script) CURED
// of the two scope holes MOT-VERB's pass-5 critic opened (critique/MOT-VERB.md §2.1, plants S1–S4):
//   · a root selector inside a `<style scoped>` block is NEVER global — Vue compiles `:root` to
//     `[data-v-x]:root` and `html` to `html[data-v-x]` (both match nothing: DEAD), `*` to
//     `[data-v-x]` (LOCAL to the file); only `:global(<root>)` escapes;
//   · a TAILED root (`html.theme-turning`, `:root.dark`) or a root inside a conditional at-rule
//     (`@media`, `@supports`, `@container`) is CONDITIONAL unless the same token is also declared
//     on the bare root — and a CONDITIONAL token consumed outside a rule carrying the same tail
//     (and inside the same at-rules) is RED. The at-rule arm is this lane's addition, the same
//     species (a declaration that exists only while a condition holds).
// Self-test controls 7–10 carry the plants (S1/S2 the critic's, S3/S4 its siblings, 8b/8c the
// negative-negatives, 9 the at-rule arm).
const ROOT = process.env.FE ?? path.join(import.meta.dirname, "..");
const INDEX_CSS = path.join(ROOT, "src", "assets", "index.css");

/** Tailwind v4 utility namespaces that mint class names off a token prefix. */
const UTILITY_NAMESPACES = {
  "--color-": [
    "bg",
    "text",
    "border",
    "ring",
    "inset-ring",
    "shadow",
    "inset-shadow",
    "from",
    "via",
    "to",
    "fill",
    "stroke",
    "outline",
    "decoration",
    "accent",
    "caret",
    "divide",
    "placeholder",
  ],
  "--font-": ["font"],
  "--ease-": ["ease"],
  "--radius-": ["rounded"],
  "--spacing-": ["p", "m", "gap", "w", "h", "size"],
  "--text-": ["text"],
  "--tracking-": ["tracking"],
  "--leading-": ["leading"],
  "--breakpoint-": [],
};

const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, "");

/** The `@theme` block's body, brace-balanced. */
function themeBody(css) {
  const open = css.indexOf("@theme");
  if (open < 0) throw new Error("check-theme-tokens: no @theme block in index.css");
  let i = css.indexOf("{", open);
  let depth = 0;
  const start = i + 1;
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(start, i);
    }
  }
  throw new Error("check-theme-tokens: unbalanced @theme block");
}

/** Declaration names at the block's own depth — `--tok:` with no enclosing brace. */
function declaredIn(body) {
  const names = [];
  let depth = 0;
  for (const m of body.matchAll(/\{|\}|(--[a-zA-Z0-9-]+)\s*:/g)) {
    if (m[0] === "{") depth++;
    else if (m[0] === "}") depth--;
    else if (depth === 0) names.push(m[1]);
  }
  return [...new Set(names)];
}

function corpusFiles() {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (["node_modules", "dist", "coverage"].includes(entry.name)) continue;
        walk(full);
      } else if (full !== INDEX_CSS) {
        files.push(full);
      }
    }
  };
  walk(path.join(ROOT, "src"));
  const e2e = path.join(ROOT, "e2e");
  if (fs.existsSync(e2e)) walk(e2e);
  const html = path.join(ROOT, "index.html");
  if (fs.existsSync(html)) files.push(html);
  return files;
}

/** `bg-primary` matches; `text-muted-foreground` must NOT match `muted`. */
const utilityForms = (token) => {
  const forms = [];
  for (const [prefix, utils] of Object.entries(UTILITY_NAMESPACES)) {
    if (!token.startsWith(prefix)) continue;
    const stem = token.slice(prefix.length);
    for (const util of utils) forms.push(`${util}-${stem}`);
  }
  return forms;
};

const referencedBy = (text, token) => {
  if (text.includes(`var(${token})`) || text.includes(`var(${token},`)) return true;
  // The quoted form — `getPropertyValue("--color-crayon-green")`, the e2e contrast probes.
  if (text.includes(`"${token}"`) || text.includes(`'${token}'`)) return true;
  for (const form of utilityForms(token)) {
    const re = new RegExp(`(^|[^\\w-])${form}(?![\\w-])`);
    if (re.test(text)) return true;
  }
  return false;
};

export function census(cssText) {
  const css = stripComments(cssText);
  const declared = declaredIn(themeBody(css));
  const corpus = corpusFiles()
    .map((f) => fs.readFileSync(f, "utf8"))
    .join("\n");

  // index.css's OWN rules are corpus too — `body { background-image: var(--paper-clean-texture) }`
  // is a consumer. Its custom-property DECLARATIONS are not: a dead token's value must not keep
  // its base alive, so every `--tok: …;` is stripped before the file joins the corpus.
  const internal = css.replace(/--[a-zA-Z0-9-]+\s*:[\s\S]*?;/g, " ");
  const directLive = new Set(
    declared.filter((t) => referencedBy(corpus, t) || referencedBy(internal, t)),
  );

  // Transitive arm: a token read by a LIVE token's value is itself live. Iterate to a fixed
  // point so an alias chain — `--color-easy: var(--color-crayon-green)` — resolves whole.
  const live = new Set(directLive);
  const declBodies = (token) =>
    [...css.matchAll(new RegExp(`${token}\\s*:([\\s\\S]*?);`, "g"))]
      .map((m) => m[1])
      .join(" ");
  for (let changed = true; changed;) {
    changed = false;
    for (const token of [...live]) {
      const body = declBodies(token);
      for (const other of declared) {
        if (live.has(other)) continue;
        if (body.includes(`var(${other})`) || body.includes(`var(${other},`)) {
          live.add(other);
          changed = true;
        }
      }
    }
  }

  return {
    declared,
    directDead: declared.filter((t) => !directLive.has(t)),
    dead: declared.filter((t) => !live.has(t)),
  };
}

// ── THE REVERSE DIRECTION: the undefined-token census ────────────────────────────────────

/** Blank every comment, preserving length and newlines, so prose about a token is never read
 *  as a reference and every offset downstream still points where it did (MOT-LADDER's parser,
 *  cited: `pass4/prototype/MOT-LADDER` row 1). Covers `/* … *\/` and a line comment that is not
 *  part of a URL. */
export function maskComments(text) {
  const keep = (m) => m.replace(/[^\n]/g, " ");
  return text
    .replace(/\/\*[\s\S]*?\*\//g, keep)
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (m, pre) => pre + keep(m.slice(pre.length)));
}

/** A timing slot: a `transition` / `animation` shorthand, or any property whose name ends in
 *  `-duration` or `-delay`. Read off the DECLARATION, never off the line — a multi-line
 *  shorthand puts its terms on lines that carry no property name at all, which is exactly where
 *  the dusk defect lived. */
const TIMING_PROP = /^(?:transition|animation)$|-(?:duration|delay)$/;

function tokenFiles(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) {
        if (["node_modules", "dist", "coverage"].includes(e.name)) continue;
        walk(full);
      } else if (/\.(vue|css|ts|html)$/.test(e.name)) out.push(full);
    }
  };
  walk(dir);
  return out;
}

/** THE SCOPE OF A DECLARATION (pass 5, MOT-VERB's critic's PLANT B). A custom property
 *  resolves only on the element that declares it and that element's descendants, so a
 *  flat union of every `--x:` in `src/**` counted a token declared in component A's scoped
 *  style as declared for a consumer in component B — the pass-3 dusk defect, under a green
 *  gate. The census is keyed by SCOPE instead:
 *    GLOBAL — a `--x:` in `@theme`, or in a rule whose EVERY selector is the root (`:root`,
 *             `html`, `*`, each with an optional compound tail like `:root.dark` or
 *             `html.theme-turning`); `@property --x` (a registered property always resolves:
 *             its initial value); `document.documentElement.style.setProperty("--x")`.
 *    LOCAL  — everything else (a scoped rule, a template's inline style, a style object, an
 *             element's own `setProperty`) declares the token for ITS OWN FILE only.
 *  A consumer resolves against GLOBAL ∪ its file's LOCAL set. A token that genuinely inherits
 *  across a component boundary (declared on an ancestor in one file, read by a descendant in
 *  another) is an INHERITED row below, keyed on the token AND both files — closed both ways:
 *  a row whose token no longer crosses (now global, or no longer read there, or no longer
 *  declared in its `from`) reds STALE, so an admission cannot outlive its reason. */
const ROOT_SELECTOR = /^(?::root|html|\*)(?:[.:#[][^\s>+~,]*)?$/;

/** `token :: from-file -> to-file` — the cross-file inheritances the product relies on. Each
 *  row names its ancestor (the declaring element) so a reader can check the DOM claim. */
export const INHERITED = new Map([
  [
    "--refuse-dur :: games/shared/GameBoard.vue -> assets/index.css",
    "the board host binds MOTION.characters.refuse inline; `.solve-failure` is its descendant",
  ],
  [
    "--board-col :: games/shared/scene.css -> games/shared/DrawerTab.vue",
    "declared on `.app-layout` below 1024px; the drawer tab lives inside that subtree",
  ],
  [
    "--tap-floor :: App.vue -> pencil/chrome/PlayerMark/PlayerMark.vue",
    "declared on `.page-root`; both head corners (and the mark in them) are its fixed descendants",
  ],
  [
    "--washi-tilt :: pencil/sheet/SheetWashiLabel.vue -> games/shared/GameControlPanel.vue",
    "the label's root span carries it inline; `.zone-hint` is a fallthrough class on that root",
  ],
]);

/** For a declaration at `at` inside CSS `text`, the selector of its innermost enclosing rule
 *  (`@theme` counts as a selector), or null when the offset is not inside any rule. */
function enclosingSelector(text, at) {
  let depth = 0;
  for (let i = at - 1; i >= 0; i--) {
    const c = text[i];
    if (c === "}") depth++;
    else if (c === "{") {
      if (depth === 0) {
        let j = i - 1;
        while (j >= 0 && !"{};".includes(text[j])) j--;
        return text.slice(j + 1, i).trim();
      }
      depth--;
    }
  }
  return null;
}

/** The `<style>` blocks of a `.vue` file as [start, end, scoped] (a `.css` file is one unscoped
 *  block). `scoped` is read off the opening tag — pass 6's cure keys every root rule on it. */
function styleRanges(file, text) {
  if (file.endsWith(".css")) return [[0, text.length, false]];
  const out = [];
  for (const m of text.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/g)) {
    const start = m.index + m[0].indexOf(">") + 1;
    out.push([start, start + m[2].length, /\bscoped\b/.test(m[1])]);
  }
  return out;
}

/** Every enclosing prelude of offset `at`, innermost first (`@theme` and at-rules included). */
function enclosingChain(text, at) {
  const chain = [];
  let depth = 0;
  for (let i = at - 1; i >= 0; i--) {
    const c = text[i];
    if (c === "}") depth++;
    else if (c === "{") {
      if (depth === 0) {
        let j = i - 1;
        while (j >= 0 && !"{};".includes(text[j])) j--;
        chain.push(text.slice(j + 1, i).trim());
      } else depth--;
    }
  }
  return chain;
}

/** At-rules that make a declaration CONDITIONAL (`@layer`/`@theme` do not). */
const CONDITIONAL_AT = /^@(media|supports|container|scope|document|starting-style)\b/;
const BARE_ROOT = /^(?::root|html|\*)$/;

/** Classify one declaration by its chain and its block's scoping.
 *  → { kind: "global" } | { kind: "local" } | { kind: "dead" } | { kind: "cond", tails, ats } */
function classify(chain, scoped) {
  const sel = chain.find((p) => !p.startsWith("@") || /^@theme\b/.test(p));
  if (sel == null) return { kind: "local" };
  if (/^@theme\b/.test(sel)) return { kind: "global" };
  const ats = chain.filter((p) => CONDITIONAL_AT.test(p));
  const parts = sel.split(",").map((s) => s.trim());
  const unwrapped = parts.map((p) => /^:global\(\s*(.*?)\s*\)$/.exec(p)?.[1] ?? null);
  if (scoped) {
    // Only `:global(<root>)` escapes a scoped block; every other root compiles to a local or dead
    // selector (`*` → `[data-v-x]`, LOCAL; `:root`/`html` → match nothing, DEAD).
    if (unwrapped.every((u) => u != null && ROOT_SELECTOR.test(u))) return rootKind(unwrapped, ats);
    if (parts.every((p) => ROOT_SELECTOR.test(p)))
      return parts.every((p) => /^\*/.test(p)) ? { kind: "local" } : { kind: "dead" };
    return { kind: "local" };
  }
  if (parts.every((p) => ROOT_SELECTOR.test(p))) return rootKind(parts, ats);
  return { kind: "local" };
}
function rootKind(parts, ats) {
  if (!ats.length && parts.some((p) => BARE_ROOT.test(p))) return { kind: "global" };
  const tails = parts.map((p) => p.replace(/^(?::root|html|\*)/, "")).filter(Boolean);
  return { kind: "cond", tails, ats };
}

function isGlobalRule(selector) {
  if (selector == null) return false;
  if (/^@theme\b/.test(selector)) return true;
  if (selector.startsWith("@")) return false;
  return selector.split(",").every((s) => ROOT_SELECTOR.test(s.trim()));
}

/** The census. `extra` is a map {file: text} that REPLACES the file's own bytes — the
 *  self-test's plants, so a control runs against the real corpus and not a fixture.
 *  `inherited` defaults to the ledger above; a control passes its own. */
export function undefinedTokens(extra = {}, inherited = INHERITED) {
  const files = tokenFiles(path.join(ROOT, "src"));
  const global = new Set();
  const local = new Map(); // file -> Set
  const texts = new Map();
  const ranges_ = new Map(); // file -> style ranges
  const conditional = new Map(); // token -> [{ tails, ats, file }]
  const deadDecl = []; // declarations a scoped root selector kills
  for (const f of files) {
    const raw = extra[f] ?? fs.readFileSync(f, "utf8");
    const masked = maskComments(raw);
    texts.set(f, masked);
    const mine = new Set();
    local.set(f, mine);
    const ranges = styleRanges(f, masked);
    ranges_.set(f, ranges);
    const inStyle = (at) => ranges.find(([a, b]) => at >= a && at < b);
    for (const m of masked.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)) {
      const r = inStyle(m.index);
      const k = r
        ? classify(enclosingChain(masked.slice(r[0], r[1]), m.index - r[0]), r[2])
        : { kind: "local" };
      if (k.kind === "global") global.add(m[1]);
      else if (k.kind === "local") mine.add(m[1]);
      else if (k.kind === "cond")
        (conditional.get(m[1]) ?? conditional.set(m[1], []).get(m[1])).push({ ...k, file: f });
      else deadDecl.push({ token: m[1], file: f });
    }
    for (const m of masked.matchAll(/@property\s+(--[a-zA-Z0-9_-]+)/g))
      global.add(m[1]);
    for (const m of masked.matchAll(
      /(documentElement\s*\.\s*)?style\s*\.\s*setProperty\(\s*["'`](--[a-zA-Z0-9_-]+)/g,
    ))
      (m[1] ? global : mine).add(m[2]);
    for (const m of masked.matchAll(/["'`](--[a-zA-Z0-9_-]+)["'`]\s*(?:[:,)]|\]\s*=)/g))
      mine.add(m[1]);
  }

  const rel = (f) => path.relative(path.join(ROOT, "src"), f);
  const used = new Set();
  const timing = [];
  const any = [];
  for (const [f, masked] of texts) {
    const lineAt = (at) => masked.slice(0, at).split("\n").length;
    for (const d of masked.matchAll(
      /(?:^|[;{}])\s*(-{0,2}[a-zA-Z][\w-]*)\s*:\s*([^;{}]*)/g,
    )) {
      const [, prop, value] = d;
      const at = d.index + d[0].indexOf(value);
      for (const m of value.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)\s*(,?)/g)) {
        const [, name, comma] = m;
        if (comma) continue; // a HOOK names its own failure value
        if (name.endsWith("-")) continue; // `var(--ease-${x})` — a template stem, not a name
        if (global.has(name) || local.get(f).has(name)) continue;
        // CONDITIONAL (pass 6): satisfied only inside a rule carrying the same tail and the same
        // conditional at-rules; anywhere else the token is undefined at rest.
        const conds = conditional.get(name);
        if (conds) {
          const at0 = at + m.index;
          const r = (ranges_.get(f) ?? []).find(([a, b]) => at0 >= a && at0 < b);
          const chain = r ? enclosingChain(masked.slice(r[0], r[1]), at0 - r[0]) : [];
          const sels = chain.filter((p) => !p.startsWith("@")).join(" ");
          const ok = conds.some(
            (c) =>
              c.ats.every((a) => chain.includes(a)) &&
              (c.tails.length === 0 || c.tails.some((t) => sels.includes(t))),
          );
          if (ok) continue;
        }
        const crossing = [...inherited.keys()].find(
          (k) => k.startsWith(`${name} :: `) && k.endsWith(`-> ${rel(f)}`),
        );
        if (crossing) {
          used.add(crossing);
          continue;
        }
        const row = {
          file: path.relative(ROOT, f),
          line: lineAt(at + m.index),
          token: name,
          prop,
          elsewhere: [...local]
            .filter(([g, s]) => g !== f && s.has(name))
            .map(([g]) => rel(g)),
          conditional: conds
            ? conds.map((c) => `${rel(c.file)} ${[...c.ats, ...c.tails].join(" ")}`)
            : undefined,
          dead: deadDecl.filter((d) => d.token === name).map((d) => rel(d.file)),
        };
        (TIMING_PROP.test(prop) ? timing : any).push(row);
      }
    }
  }
  // CLOSED BOTH WAYS: a ledger row nothing consumes, or whose token is global now, or whose
  // `from` file no longer declares it, is STALE.
  const stale = [];
  for (const k of inherited.keys()) {
    const [, token, from] = /^(--[\w-]+) :: (.+?) -> /.exec(k) ?? [];
    const fromFile = files.find((f) => rel(f) === from);
    if (
      !used.has(k) ||
      global.has(token) ||
      !fromFile ||
      !local.get(fromFile).has(token)
    )
      stale.push(k);
  }
  const declared = new Set(global);
  for (const s of local.values()) for (const t of s) declared.add(t);
  return {
    declared: declared.size,
    global: global.size,
    conditional: [...conditional.keys()].filter((t) => !global.has(t)).length,
    conditionalNames: [...conditional.keys()].filter((t) => !global.has(t)),
    dead: deadDecl.length,
    timing,
    any,
    stale,
  };
}

function main() {
  const selfTest = process.argv.includes("--self-test");
  const cssText = fs.readFileSync(INDEX_CSS, "utf8");
  const { declared, directDead, dead } = census(cssText);

  console.log(`@theme declared: ${declared.length}`);
  console.log(`unreferenced (corpus only):     ${directDead.length}`);
  console.log(`unreferenced (transitive rule): ${dead.length}`);
  if (dead.length) {
    console.log("\nDEAD TOKENS:");
    for (const t of dead) console.log(`  ${t}`);
  }
  const strays = directDead.filter((t) => !dead.includes(t));
  if (strays.length) {
    console.log("\nALIAS-ONLY (live through a live token, kept):");
    for (const t of strays) console.log(`  ${t}`);
  }

  if (selfTest) {
    // NEGATIVE CONTROL: re-add a known shadcn default and the census must go RED.
    const patched = cssText.replace(
      /(@theme\s*\{)/,
      "$1\n  --color-input: hsl(48 5% 89.8%);",
    );
    const probe = census(patched);
    const caught = probe.dead.includes("--color-input");
    console.log(
      `\nnegative control (re-add --color-input): ${caught ? "RED as required" : "FAILED — the census did not catch it"}`,
    );
    if (!caught) process.exit(2);
  }

  // ── the reverse direction, on the same corpus ─────────────────────────────────────────
  const rev = undefinedTokens();
  console.log(
    `\ncustom properties declared in src: ${rev.declared} (${rev.global} global; the rest file-local)`,
  );
  console.log(
    `cross-file inheritances ledgered: ${INHERITED.size} · stale: ${rev.stale.length}`,
  );
  for (const k of rev.stale) console.log(`  STALE  ${k}`);
  console.log(`bare var() naming no declaration — TIMING slots: ${rev.timing.length}`);
  console.log(`bare var() naming no declaration — any other slot: ${rev.any.length}`);
  console.log(
    `conditional tokens (tailed root / conditional at-rule, no bare-root twin): ${rev.conditional}${rev.conditional ? ` (${rev.conditionalNames.join(" ")})` : ""} · scoped-root declarations (dead): ${rev.dead}`,
  );
  for (const r of [...rev.timing, ...rev.any])
    console.log(
      `  ${r.file}:${r.line}  ${r.token}` +
        (r.conditional ? `  (declared only under: ${r.conditional.join("; ")})` : "") +
        (r.dead?.length ? `  (declared by a scoped root in: ${r.dead.join(", ")} — dead)` : ""),
    );

  if (selfTest) {
    // TREE-AGNOSTIC PLANTS (pass 6). The pass-5 controls anchored on §13's own bytes (the dusk
    // shorthand, the note's rung) and FAILED on any tree without them — i.e. on most lanes'
    // trees and on the 74a2b5d9 control. Every plant now keys on the rule's SHAPE: when the note
    // carries a rung in its first `animation:` (a §13 tree), that real slot is the consumer;
    // otherwise a consumer rule is seated in the note's own scoped block. Declarations are
    // appended to real files (index.css, MarginNote.vue), never to a fixture.
    const dusk = path.join(ROOT, "src", "assets", "index.css");
    const duskText = fs.readFileSync(dusk, "utf8");
    const note = path.join(ROOT, "src", "games", "shared", "SolverErrorNote.vue");
    const margin = path.join(ROOT, "src", "pencil", "chrome", "MarginNote.vue");
    const noteText = fs.readFileSync(note, "utf8");
    const marginText = fs.readFileSync(margin, "utf8");
    const scopedOpen = (t) => /<style\b[^>]*\bscoped\b[^>]*>/.exec(t);
    const intoStyle = (t, body) => {
      const m = /<style\b[^>]*>/.exec(t);
      return t.slice(0, m.index + m[0].length) + `\n${body}\n` + t.slice(m.index + m[0].length);
    };
    const plantAt = /animation:\s*[\w-]+\s+var\((--motion-[a-z]+)\)/.exec(noteText);
    const consume = (tok) =>
      plantAt
        ? noteText.replace(plantAt[0], plantAt[0].replace(plantAt[1], tok))
        : intoStyle(noteText, `.critic-consumer { animation: critic-k var(${tok}) linear; }`);
    console.log(
      `\nself-test consumer: ${plantAt ? `the note's real slot (${plantAt[1]} → the ghost)` : "a consumer rule seated in SolverErrorNote's scoped block (no §13 rung on this tree)"}`,
    );
    const t = (res, tok) => res.timing.some((r) => r.token === tok);
    const a = (res, tok) => res.any.some((r) => r.token === tok);
    // CONTROL 1 — the pass-3 defect: a bare var() on an undeclared token in a duration slot.
    const red1 = t(
      undefinedTokens({ [dusk]: duskText + "\n.critic-c1 { transition: background-color var(--verb-dusk-ms) linear; }\n" }),
      "--verb-dusk-ms",
    );
    // CONTROL 2 — outside a timing slot it reds too (timing is only what prints first).
    const red2 = a(undefinedTokens({ [dusk]: duskText + "\n.critic-c2 { color: var(--no-such-ink); }\n" }), "--no-such-ink");
    // CONTROL 3 — the HOOK form stays green (the exemption is a rule, not a hole).
    const green3 = !a(undefinedTokens({ [dusk]: duskText + "\n.critic-c3 { color: var(--no-such-ink, #000); }\n" }), "--no-such-ink");
    console.log(
      `reverse controls: ` +
        `1 undeclared token in a duration slot ${red1 ? "RED as required" : "FAILED"} · ` +
        `2 undeclared token elsewhere ${red2 ? "RED as required" : "FAILED"} · ` +
        `3 the hook form ${green3 ? "green as required" : "FAILED"}`,
    );
    const G = "--critic-ghost-ms";
    const ghost = (over) => t(undefinedTokens({ [note]: consume(G), ...over }), G);
    // CONTROL 4 — PLANT B (pass 4's critic): declared only in ANOTHER component's scoped rule.
    const red4 = ghost({ [margin]: intoStyle(marginText, `.margin-note { ${G}: 250ms; }`) });
    // CONTROL 5 — its negative-negative: the same token at the bare :root resolves.
    const green5 = !ghost({ [dusk]: duskText.replace(/^:root\s*\{/m, (m) => `${m}\n  ${G}: 250ms;`) });
    // CONTROL 6 — the ledger closed both ways: a ghost row is STALE; a LIVE crossing un-ledgered
    // reds (n/a, printed, when this tree has no live crossing — the rows are §13's).
    const ghostRow = new Map([...INHERITED, ["--no-such :: App.vue -> App.vue", "a ghost"]]);
    const red6a = undefinedTokens({}, ghostRow).stale.includes("--no-such :: App.vue -> App.vue");
    const staleNow = new Set(undefinedTokens().stale);
    const live = [...INHERITED.keys()].find((k) => !staleNow.has(k));
    let red6b = null;
    if (live) {
      const lessOne = new Map([...INHERITED].filter(([k]) => k !== live));
      const r = undefinedTokens({}, lessOne);
      red6b = r.any.length + r.timing.length > 0;
    }
    console.log(
      `scope controls: 4 PLANT B (declared in another component's scoped style) ${red4 ? "RED as required" : "FAILED"} · ` +
        `5 the same token at :root ${green5 ? "green as required" : "FAILED"} · ` +
        `6a a ghost ledger row ${red6a ? "STALE as required" : "FAILED"} · ` +
        `6b a live crossing un-ledgered ${red6b === null ? "n/a (no live crossing on this tree)" : red6b ? "RED as required" : "FAILED"}`,
    );
    // ── CONTROLS 7–10 (pass 6, the scope holes; MOT-VERB's pass-5 critic, §2.1) ────────────
    const inScoped = (body) => {
      const m = scopedOpen(marginText);
      return marginText.slice(0, m.index + m[0].length) + `\n${body}\n` + marginText.slice(m.index + m[0].length);
    };
    const turning = duskText + `\nhtml.theme-turning { ${G}: 250ms; }\n`;
    const ctl = {
      // 7 · S1: `:root {}` INSIDE MarginNote's <style scoped> — compiles to [data-v-x]:root, dead.
      s1: ghost({ [margin]: inScoped(`:root { ${G}: 250ms; }`) }),
      // 7b · S4: `html {}` inside the scoped block (html[data-v-x], dead).
      s4: ghost({ [margin]: inScoped(`html { ${G}: 250ms; }`) }),
      // 7c · S3: `*.margin-note {}` inside the scoped block (LOCAL to MarginNote at best).
      s3: ghost({ [margin]: inScoped(`*.margin-note { ${G}: 250ms; }`) }),
      // 7d · negative-negative: `:global(:root)` inside the scoped block IS global.
      g7: !ghost({ [margin]: inScoped(`:global(:root) { ${G}: 250ms; }`) }),
      // 8 · S2: declared ONLY on `html.theme-turning` in index.css — undefined at rest.
      s2: ghost({ [dusk]: turning }),
      // 8b · negative-negative: consumed ONLY inside a same-class rule (no note consumer).
      g8b: !t(
        undefinedTokens({ [dusk]: turning + `html.theme-turning .critic-x { transition: opacity var(${G}) linear; }\n` }),
        G,
      ),
      // 8c · negative-negative: the tail AND the bare root both declare it — global.
      g8c: !ghost({ [dusk]: turning.replace(/^:root\s*\{/m, (m) => `${m}\n  ${G}: 250ms;`) }),
      // 9 · the at-rule arm (this lane's): a bare root declared only inside @media — conditional.
      s9: ghost({ [dusk]: duskText + `\n@media (prefers-reduced-motion: no-preference) { :root { ${G}: 250ms; } }\n` }),
    };
    const scopedOk = !!scopedOpen(marginText);
    if (!scopedOk) {
      console.log("scope-hole controls: MarginNote.vue has no <style scoped> on this tree — 7/7b/7c/7d cannot be planted (FAILED)");
      ctl.s1 = ctl.s4 = ctl.s3 = ctl.g7 = false;
    }
    console.log(
      `scope-hole controls (pass 6): ` +
        `7 S1 scoped :root ${ctl.s1 ? "RED as required" : "FAILED"} · ` +
        `7b S4 scoped html ${ctl.s4 ? "RED as required" : "FAILED"} · ` +
        `7c S3 scoped *.margin-note ${ctl.s3 ? "RED as required" : "FAILED"} · ` +
        `7d :global(:root) ${ctl.g7 ? "green as required" : "FAILED"} · ` +
        `8 S2 html.theme-turning only ${ctl.s2 ? "RED as required" : "FAILED"} · ` +
        `8b same-class consumer ${ctl.g8b ? "green as required" : "FAILED"} · ` +
        `8c tail + bare root ${ctl.g8c ? "green as required" : "FAILED"} · ` +
        `9 @media-only root ${ctl.s9 ? "RED as required" : "FAILED"}`,
    );
    if (!red1 || !red2 || !green3 || !red4 || !green5 || !red6a || red6b === false || Object.values(ctl).some((v) => !v))
      process.exit(2);
  }

  if (dead.length) {
    console.error(`\ncheck-theme-tokens: ${dead.length} unreferenced @theme tokens`);
    process.exit(1);
  }
  if (rev.timing.length || rev.any.length || rev.stale.length) {
    console.error(
      `\ncheck-theme-tokens: ${rev.timing.length + rev.any.length} bare var() naming no declaration in scope, ${rev.stale.length} stale inheritance rows`,
    );
    process.exit(1);
  }
  console.log(
    "\ncheck-theme-tokens: 0 unreferenced @theme tokens, 0 undefined references",
  );
}

main();
