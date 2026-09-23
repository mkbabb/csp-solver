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

// COPY for the rung consumers (pass 5): point FE at your worktree's web/frontend.
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

/** The `<style>` blocks of a `.vue` file as [start, end) offsets; a `.css` file is one block. */
function styleRanges(file, text) {
  if (file.endsWith(".css")) return [[0, text.length]];
  const out = [];
  for (const m of text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) {
    const start = m.index + m[0].indexOf(">") + 1;
    out.push([start, start + m[1].length]);
  }
  return out;
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
  for (const f of files) {
    const raw = extra[f] ?? fs.readFileSync(f, "utf8");
    const masked = maskComments(raw);
    texts.set(f, masked);
    const mine = new Set();
    local.set(f, mine);
    const ranges = styleRanges(f, masked);
    const inStyle = (at) => ranges.find(([a, b]) => at >= a && at < b);
    for (const m of masked.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g)) {
      const r = inStyle(m.index);
      const sel = r
        ? enclosingSelector(masked.slice(r[0], r[1]), m.index - r[0])
        : null;
      (r && isGlobalRule(sel) ? global : mine).add(m[1]);
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
  return { declared: declared.size, global: global.size, timing, any, stale };
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
  for (const r of [...rev.timing, ...rev.any])
    console.log(`  ${r.file}:${r.line}  ${r.token}`);

  if (selfTest) {
    const dusk = path.join(ROOT, "src", "assets", "index.css");
    const duskText = fs.readFileSync(dusk, "utf8");
    // CONTROL 1 — the pass-3 defect, replanted: a bare var() on an undeclared token in a
    // duration slot. This is the row the whole census exists for and it must RED.
    const c1 = undefinedTokens({
      [dusk]: duskText.replace(
        "background-color var(--motion-dusk) var(--verb-dusk-ease)",
        "background-color var(--verb-dusk-ms) var(--verb-dusk-ease)",
      ),
    });
    const red1 = c1.timing.some((r) => r.token === "--verb-dusk-ms");
    // CONTROL 2 — a bare var() outside a timing slot must RED too (the law is not
    // timing-only; timing is only what is printed first).
    const c2 = undefinedTokens({
      [dusk]: duskText.replace(
        "    var(--color-foreground) 6%,",
        "    var(--no-such-ink) 6%,",
      ),
    });
    const red2 = c2.any.some((r) => r.token === "--no-such-ink");
    // CONTROL 3 — the HOOK form must stay GREEN, or the exemption is a hole rather than a
    // rule and every `var(--x, fallback)` in the estate would have to be re-litigated here.
    const c3 = undefinedTokens({
      [dusk]: duskText.replace(
        "    var(--color-foreground) 6%,",
        "    var(--no-such-ink, #000) 6%,",
      ),
    });
    const green3 = !c3.any.some((r) => r.token === "--no-such-ink");
    console.log(
      `\nreverse controls: ` +
        `1 undeclared token in a duration slot ${red1 ? "RED as required" : "FAILED"} · ` +
        `2 undeclared token elsewhere ${red2 ? "RED as required" : "FAILED"} · ` +
        `3 the hook form ${green3 ? "green as required" : "FAILED"}`,
    );
    // CONTROL 4 — PLANT B, the pass-4 critic's: the consumer's token is 'declared' only in
    // ANOTHER component's scoped style. SolverErrorNote is not a descendant of MarginNote, so
    // at runtime this is the pass-3 dusk verbatim; the flat declared-set read it green.
    const note = path.join(ROOT, "src", "games", "shared", "SolverErrorNote.vue");
    const margin = path.join(ROOT, "src", "pencil", "chrome", "MarginNote.vue");
    const noteText = fs.readFileSync(note, "utf8");
    const marginText = fs.readFileSync(margin, "utf8");
    // Keyed on the RULE's shape, not a site's bytes: the first rung read in the note's first
    // `animation:` declaration, whatever it spells today.
    const plantAt = /animation:\s*[\w-]+\s+var\((--motion-[a-z]+)\)/.exec(noteText);
    const plantB = (declSel) =>
      undefinedTokens({
        [note]: noteText.replace(
          plantAt[0],
          plantAt[0].replace(plantAt[1], "--critic-ghost-ms"),
        ),
        [declSel === ":root" ? dusk : margin]: (declSel === ":root"
          ? duskText
          : marginText
        ).replace(
          declSel === ":root" ? /^:root\s*\{/m : /<style[^>]*>/,
          (m) =>
            `${m}\n${declSel === ":root" ? "" : ".margin-note { "}--critic-ghost-ms: 250ms;${declSel === ":root" ? "" : " }"}\n`,
        ),
      });
    const red4 =
      !!plantAt &&
      plantB(".margin-note").timing.some((r) => r.token === "--critic-ghost-ms");
    // CONTROL 5 — its NEGATIVE-NEGATIVE: the same token declared at `:root` resolves, and must
    // stay green (the scope rule is a rule, not a blanket).
    const green5 =
      !!plantAt && !plantB(":root").timing.some((r) => r.token === "--critic-ghost-ms");
    // CONTROL 6 — the ledger is closed both ways: a row with no consumer is STALE, and a real
    // crossing with its row removed reds.
    const ghostRow = new Map([
      ...INHERITED,
      ["--no-such :: App.vue -> App.vue", "a ghost"],
    ]);
    const red6a = undefinedTokens({}, ghostRow).stale.includes(
      "--no-such :: App.vue -> App.vue",
    );
    const lessOne = new Map([...INHERITED].slice(1));
    const red6b =
      undefinedTokens({}, lessOne).any.length +
        undefinedTokens({}, lessOne).timing.length >
      0;
    console.log(
      `scope controls: 4 PLANT B (declared in another component's scoped style) ${red4 ? "RED as required" : "FAILED"} · ` +
        `5 the same token at :root ${green5 ? "green as required" : "FAILED"} · ` +
        `6a a ghost ledger row ${red6a ? "STALE as required" : "FAILED"} · ` +
        `6b a real crossing un-ledgered ${red6b ? "RED as required" : "FAILED"}`,
    );
    if (!red1 || !red2 || !green3 || !red4 || !green5 || !red6a || !red6b)
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
