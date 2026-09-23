#!/usr/bin/env node
/**
 * L5b — a head disclosure's sheet wears a drawn edge and paints no CSS edge, keyed on EVERY
 * consumer site (T9-W7 pass 6, the chair's instruments lane; pass6/CHAIR-RULINGS §1.3; PLR-SELF's
 * pass-5 critic, critique/PLR-SELF.md gap 4 / R7).
 *
 * The pass-5 PROPOSED body keyed on "the rule that holds `top: 100%`"; after HeadSheet took the
 * hang, the only such rule was HeadSheet's own, so the pass-4 border planted back on a CONSUMER
 * (`AttributionCard.vue .hover-card`, plant A) or at its pass-4 site (`PlayerLobby.vue
 * .player-lobby`, plant B) read GREEN. This body keys on the SHAPE of the sheet, at every site:
 *
 *   SUBJECT SET — under src/pencil/chrome:
 *     (a) every scoped rule holding `top: 100%` (a sheet hung off the head, in any file);
 *     (b) HeadSheet's own root rule (`.head-sheet`, any compound on it);
 *     (c) in every file that renders `<HeadSheet …>`, every rule whose SUBJECT (last compound)
 *         names a hook passed on that tag: each class in `class="…"`, each `data-*` attribute
 *         (`[data-x]`), a static `id`; plus `:deep(.head-sheet)`.
 *     (d) the utility classes on the `<HeadSheet …>` tag itself (a Tailwind `border`, `ring`,
 *         `outline`, arbitrary `shadow-[…]`).
 *   EDGE SET — R3's third re-cut (pass6/CHAIR-RULINGS §1.3, CTRL-TAPE's critic): physical AND
 *     logical border longhands with a width > 0 or a painting style, `outline`, `box-shadow` with
 *     a non-zero length, a `background-image` gradient.
 *   DRAWN — the file that owns an (a) rule renders `<HandDrawnOutline` or `<HeadSheet`; HeadSheet
 *     renders `<HandDrawnOutline`; every (c) file renders `<HeadSheet` (so the edge reaches it).
 *
 * Comments (CSS and HTML) are stripped first. GREEN needs ≥ 1 subject and 0 breaches.
 *
 *   node l5b.mjs <web/frontend>            → prints GREEN|RED | detail; exit 0 GREEN, 1 RED
 *   export { l5b } for the r0 law-probe row (PROPOSED — the chair lands it, l5b.law-probe.PROPOSED.diff)
 */
import fs from "node:fs";
import path from "node:path";

const strip = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/<!--[\s\S]*?-->/g, "");

/** Edge-painting declarations in one rule body (R3's third-re-cut set, plus `*-style`). */
export function edgeDecls(body) {
  const out = [];
  for (const d of body.split(";")) {
    const m = /^\s*([a-z-]+)\s*:\s*([\s\S]*?)\s*$/.exec(d);
    if (!m) continue;
    const [, prop, v] = m;
    const val = v.replace(/!important/, "").trim();
    const len = /(^|[\s(,])(?!0(?:px|rem|em)?\b)(\d*\.?\d+)(px|rem|em)\b|\b(thin|medium|thick)\b/;
    const side = "(?:-(?:top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?";
    if (new RegExp(`^border${side}$`).test(prop) || new RegExp(`^outline$`).test(prop)) {
      if (/^(none|0|0px|hidden)\b/.test(val) || /\bnone\b/.test(val) && !len.test(val)) continue;
      // shorthand: a width, or a painting style with the initial `medium` width
      if (len.test(val) || /\b(solid|dashed|dotted|double|groove|ridge|inset|outset)\b/.test(val)) out.push(`${prop}: ${val}`);
    } else if (new RegExp(`^(?:border${side}|outline)-width$`).test(prop)) {
      if (len.test(val)) out.push(`${prop}: ${val}`);
    } else if (new RegExp(`^(?:border${side}|outline)-style$`).test(prop)) {
      if (/\b(solid|dashed|dotted|double|groove|ridge|inset|outset)\b/.test(val)) out.push(`${prop}: ${val}`);
    } else if (prop === "box-shadow") {
      if (!/^none$/.test(val) && /[1-9]/.test(val.replace(/color-mix\([^)]*\)|rgba?\([^)]*\)|hsla?\([^)]*\)|oklch\([^)]*\)|var\([^)]*\)/g, ""))) out.push(`${prop}: ${val}`);
    } else if (/^background(?:-image)?$/.test(prop) && /gradient\(/.test(val)) out.push(`${prop}: ${val}`);
  }
  return out;
}

/** Utility classes that paint an edge (Tailwind v4): widths, rings, outlines, arbitrary shadows. */
const EDGE_UTIL = /^(?:border(?:-[xytrblse]|-[bi][se]?)?(?:-(?:\d+|\[[^\]]+\]))?|ring(?:-(?:\d+|\[[^\]]+\]))?|outline(?:-(?:\d+|\[[^\]]+\]))?|shadow-\[[^\]]*\d+px[^\]]*\])$/;

function vueFiles(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (f.endsWith(".vue")) out.push(f);
    }
  };
  walk(dir);
  return out;
}

const rules = (style) => [...style.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim(), body: m[2] }));
const subjects = (sel) => sel.split(",").map((s) => s.trim().split(/\s+|>|\+|~/).filter(Boolean).pop() ?? "");

export function l5b(FE, over = {}) {
  const dir = path.join(FE, "src/pencil/chrome");
  const files = vueFiles(dir);
  const read = (f) => strip(over[f] ?? fs.readFileSync(f, "utf8"));
  const bad = [];
  const sites = [];
  for (const f of files) {
    const src = read(f);
    const name = path.relative(dir, f);
    const style = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
    const isSheet = path.basename(f) === "HeadSheet.vue";
    const tags = [...src.matchAll(/<HeadSheet\b([^>]*)>/g)].map((m) => m[1]);
    const drawn = /<HandDrawnOutline\b/.test(src);
    // hooks passed on each <HeadSheet …> tag
    const hooks = new Set();
    for (const t of tags) {
      for (const c of (/(?:^|\s)class="([^"]*)"/.exec(t)?.[1] ?? "").split(/\s+/).filter(Boolean)) {
        hooks.add(`.${c}`);
        if (EDGE_UTIL.test(c)) bad.push(`${name} <HeadSheet class="…${c}…"> paints an edge by utility`);
      }
      for (const a of t.matchAll(/(?:^|\s)(data-[\w-]+)/g)) hooks.add(`[${a[1]}`);
      const id = /(?:^|\s)id="([^"]+)"/.exec(t)?.[1];
      if (id) hooks.add(`#${id}`);
    }
    if (tags.length) hooks.add(".head-sheet");
    if (isSheet) hooks.add(".head-sheet");
    for (const r of rules(style)) {
      const hung = /(^|;|\s)top:\s*100%/.test(r.body);
      // the sheet's own file: every rule is the sheet; a consumer: a rule whose subject carries a
      // passed hook as a whole token (`.player-lobby`, `.player-lobby.is-open`, `.hover-card::before`)
      const hooked =
        isSheet ||
        subjects(r.sel).some((s) =>
          [...hooks].some((h) => new RegExp(`${h.replace(/[.[\]#]/g, (c) => `\\${c}`)}(?![\\w-])`).test(s)),
        );
      if (!hung && !hooked) continue;
      sites.push(`${name} ${r.sel}`);
      const edges = edgeDecls(r.body);
      if (edges.length) bad.push(`${name} ${r.sel} paints a CSS edge (${edges.join("; ")})`);
      if (hung && !drawn && !tags.length && !isSheet) bad.push(`${name} ${r.sel} hangs a sheet that draws no HandDrawnOutline and is not a HeadSheet`);
    }
    if (isSheet && !drawn) bad.push(`${name} renders no <HandDrawnOutline> — the sheet's edge is gone`);
  }
  const sheet = files.find((f) => path.basename(f) === "HeadSheet.vue");
  if (sheet && !sites.some((s) => s.startsWith(path.relative(dir, sheet)))) bad.push("HeadSheet.vue exists but its root rule was not read");
  const ok = sites.length > 0 && bad.length === 0;
  return { ok, detail: bad.length ? bad.join("; ") : `${sites.length} sheet site(s) read (${sites.join(" | ")}), each drawn, none edged` };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const FE = path.resolve(process.argv[2] ?? ".");
  const r = l5b(FE);
  console.log(r.ok ? "GREEN" : "RED", "|", r.detail);
  process.exit(r.ok ? 0 : 1);
}
