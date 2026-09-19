#!/usr/bin/env node
/**
 * CTRL-FACE pass-2 RESEARCH · the SHARED-CLASS census, proposed as a one-grep gate.
 *
 * `<style scoped>` scopes the RULE to the component's own nodes; it does not fence the CLASS.
 * Every other component that RENDERS the owner inherits whatever the owner re-cuts — and the
 * consumers are found at the TAG, not at the class name. `.washi-tag` is the estate's live
 * example and the reason this file exists: `SheetWashiLabel` owns the rule, `GameControlPanel`
 * renders four tapes, and `StagingBand` renders a fifth ON THE GALLERY, a surface no §10
 * family claims. A census that greps the class name misses it entirely (StagingBand never
 * writes the string `washi-tag`), which is exactly how pass 1 shipped a 7.43px move on an
 * unclaimed surface.
 *
 * THE GATE: for each component under census, list every file that renders it and the prop
 * values at each call site (the props that MINT classes). Red when that set differs from the
 * allowlist banked beside the rule.
 *
 *   node shared-class-census.mjs                 # every SFC that owns scoped classes
 *   node shared-class-census.mjs SheetWashiLabel # one component, with its call sites
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import process from "node:process";

const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const SRC = resolve(FE, "src");

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(vue|css|ts)$/.test(e)) out.push(p);
  }
  return out;
};
const files = walk(SRC).map((f) => ({ rel: relative(FE, f), text: readFileSync(f, "utf8") }));

/** classes a component's own scoped block declares */
const scopedClasses = (text) => {
  const set = new Set();
  for (const s of text.matchAll(/<style[^>]*\bscoped\b[^>]*>([\s\S]*?)<\/style>/g))
    for (const rule of s[1].replace(/\/\*[\s\S]*?\*\//g, "").split("}")) {
      const head = rule.split("{")[0];
      if (!head || head.trim().startsWith("@")) continue;
      for (const c of head.matchAll(/\.([a-zA-Z][\w-]*)/g)) set.add(c[1]);
    }
  return [...set];
};

const only = process.argv[2];
const comps = files.filter((f) => f.rel.endsWith(".vue")).filter((f) => !only || basename(f.rel, ".vue") === only);

for (const c of comps) {
  const name = basename(c.rel, ".vue");
  const classes = scopedClasses(c.text);
  if (!classes.length) continue;
  const sites = files
    .filter((f) => f.rel !== c.rel && new RegExp(`<${name}[\\s/>]`).test(f.text))
    .map((f) => {
      const tags = [...f.text.matchAll(new RegExp(`<${name}\\b([\\s\\S]*?)/?>`, "g"))].map((m) =>
        m[1].replace(/\s+/g, " ").trim(),
      );
      return { file: f.rel, tags };
    });
  if (!sites.length) continue;
  if (only || sites.length > 1) {
    console.log(`\n${name} — ${classes.length} scoped classes, ${sites.length} render consumers`);
    if (only) console.log(`  classes: ${classes.join(" · ")}`);
    for (const s of sites) {
      console.log(`  ${s.file}  (${s.tags.length})`);
      if (only) for (const t of s.tags) console.log(`      <${name} ${t}>`);
    }
  }
}
