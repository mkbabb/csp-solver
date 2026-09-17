#!/usr/bin/env node
/**
 * THE LIVE-REGION POLICE (T9-W3 §3.4, the W5 rider) — a region that never speaks cannot ship.
 *
 * A live region announces MUTATIONS TO ITSELF. Born under a condition with its content already
 * inside it, it enters the document COMPLETE: there is no mutation, the region's whole office
 * goes unperformed, and the markup reads perfectly correct the entire time. That is why this
 * estate landed the same defect three times in three waves —
 *
 *   `players-status`  `v-if="!session.live"`, holding "connecting…"
 *   `players-alone`   `v-if="aloneInRoom"`,  holding its sentence
 *   `players-roster`  `role="log"` under `v-else`, holding rows — the 0→1 case, which T7-W2
 *                     missed while curing 1→2 four lines away
 *
 * — and why the third occurrence bought a mechanism (`src/composables/useLiveRegion.ts`) and
 * this gate rather than a third local patch. A cure with no instrument is advice, and advice
 * erodes (lessons §2: a ruling lands with its enforcing config, same commit).
 *
 * THE RULE, exactly. An element is RED when its OWN opening tag carries all three of:
 *   1  `aria-live=`, or `role="status" | "alert" | "log"`   — it claims to be a live region
 *   2  `v-if` / `v-else-if` / `v-else` / `v-show`           — it is born under a condition
 *   3  non-empty INITIAL content                            — it is born already speaking
 *
 * INITIAL content is literal text only: interpolations (`{{ … }}`) resolve after mount and
 * conditional children are not there at birth, so both are stripped before the question is
 * asked — as are comments. A region that lives UNCONDITIONALLY with conditional content inside
 * is the correct idiom and stays green; that is the whole shape the cure has.
 *
 * WHAT IT DOES NOT SEE, stated rather than implied: an ancestor's condition. The cured
 * `players-status` sits inside a well that is itself drawn conditionally, and a rule reading
 * ancestors would red the cure — while a region whose CONTENT is conditional and whose element
 * is not is exactly right wherever it sits. The ancestor case is the one this file cannot
 * decide; it is decided by the unit rows that assert node identity across the transition
 * (`GameControlPanel.liveRegions.test.ts`, `GameGallery.liveRegions.test.ts`).
 *
 * NO ALLOWLIST, by choice. The estate's live-region census is five sites and every one of them
 * holds the idiom; a carve-out mechanism here would be a doorway built before anyone asked for
 * one. The record instrument (`scripts/ledger-diff.mjs`, LIVE-REGION arm) carries the ADMITTED
 * ledger for a site a wave cannot reach — that is where an admission is written down, in full,
 * on every run, and it reds as SPENT the day the site stops violating.
 *
 * Run: `node scripts/check-live-regions.mjs [--root <dir>] [--self-test]`, cwd web/frontend.
 * `--self-test` runs the rule against a planted defect (must RED) and its conformant control
 * (must stay GREEN) before the real audit — a gate that cannot fail is not a gate. It does not
 * exit: control falls through to the audit on purpose.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const rootAt = args.indexOf("--root");
const ROOT = rootAt >= 0 ? args[rootAt + 1] : ".";
const SRC = join(ROOT, "src");

const LIVE_ATTR = /\baria-live\s*=/;
const LIVE_ROLE = /\brole\s*=\s*(["'])(?:status|alert|log)\1/;
const BIRTH_COND = /\bv-(?:if|else-if|else|show)\b/;
// A FACTORY, never a shared instance: `initialContent` walks inside `sitesIn`'s own walk, and
// one `g`-flagged regex driving two nested loops resets the outer `lastIndex` forever.
const openTags = () => /<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;

/** From `from` (just past `<tag …>`), that tag's inner slice and the index after its close. */
function blockFrom(src, tag, from) {
  const scan = new RegExp(`<${tag}\\b[^>]*?(/?)>|</${tag}\\s*>`, "g");
  scan.lastIndex = from;
  for (let depth = 1, m; (m = scan.exec(src));) {
    if (m[0].startsWith("</")) {
      if (--depth === 0)
        return { inner: src.slice(from, m.index), end: scan.lastIndex };
    } else if (m[1] !== "/") depth++;
  }
  return { inner: src.slice(from), end: src.length };
}

/** What is inside a region AT BIRTH: literal text only. */
function initialContent(inner) {
  let html = inner.replace(/<!--[\s\S]*?-->/g, " ").replace(/\{\{[\s\S]*?\}\}/g, " ");
  for (let guard = 0; guard < 64; guard++) {
    const tag = openTags();
    let hit = null;
    for (let m; (m = tag.exec(html));)
      if (BIRTH_COND.test(m[2])) {
        hit = m;
        break;
      }
    if (!hit) break;
    const past = hit.index + hit[0].length;
    const end = hit[3] === "/" ? past : blockFrom(html, hit[1], past).end;
    html = html.slice(0, hit.index) + html.slice(end);
  }
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every violating region in ONE SFC's template. Not exported: the self-test is IN this file,
 *  so an export would be a seam with no consumer (knip's `exports: error` says so too). */
function sitesIn(file, src) {
  const from = src.indexOf("<template");
  const last = src.lastIndexOf("</template>");
  if (from < 0 || last <= from) return [];
  const tpl = src.slice(from, last);
  const found = [];
  const tag = openTags();
  for (let m; (m = tag.exec(tpl));) {
    const attrs = m[2];
    if (m[3] === "/") continue;
    if (!LIVE_ATTR.test(attrs) && !LIVE_ROLE.test(attrs)) continue;
    if (!BIRTH_COND.test(attrs)) continue;
    const content = initialContent(blockFrom(tpl, m[1], m.index + m[0].length).inner);
    if (!content) continue;
    found.push({
      file,
      line: src.slice(0, from + m.index).split("\n").length,
      attrs: attrs.replace(/\s+/g, " ").trim().slice(0, 96),
      content: content.slice(0, 64),
    });
  }
  return found;
}

/** Every `.vue` under a tree, in a stable order. */
function vueFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...vueFiles(path));
    else if (name.endsWith(".vue")) out.push(path);
  }
  return out;
}

/** The census the verdict is read off. */
function scan() {
  const files = vueFiles(SRC);
  const regions = [];
  const offences = [];
  for (const path of files) {
    const src = readFileSync(path, "utf8");
    const rel = relative(ROOT, path);
    const from = src.indexOf("<template");
    if (from >= 0) {
      const tag = openTags();
      const tpl = src.slice(from, Math.max(from, src.lastIndexOf("</template>")));
      for (let m; (m = tag.exec(tpl));)
        if (LIVE_ATTR.test(m[2]) || LIVE_ROLE.test(m[2]))
          regions.push(`${rel}:${src.slice(0, from + m.index).split("\n").length}`);
    }
    offences.push(...sitesIn(rel, src));
  }
  return { files, regions, offences };
}

// ── the canaries ────────────────────────────────────────────────────────────────────────────

const DEFECT = `<template>
  <p v-if="!live" class="players-status" aria-live="polite">
    connecting…
  </p>
</template>`;

const CURE = `<template>
  <p class="players-status" :class="{ 'sr-only': !line }" aria-live="polite">
    {{ line }}
  </p>
  <ul role="log" aria-live="polite">
    <li v-for="p in rows" :key="p.id">{{ p.slug }}</li>
  </ul>
  <p v-if="shown" class="not-a-region">a conditional line that claims nothing</p>
</template>`;

function selfTest() {
  const cases = [
    ["a region born under v-if with its sentence already inside", DEFECT, 1],
    ["the cured idiom: unconditional region, conditional content", CURE, 0],
  ];
  let ok = true;
  for (const [what, src, want] of cases) {
    const got = sitesIn("fixture.vue", src).length;
    const pass = got === want;
    ok &&= pass;
    console.log(
      `  ${want ? "violation" : "control  "} · ${what}  →  ${got} finding(s), ` +
        `${pass ? (want ? "RED as required" : "GREEN as required") : "FAILED"}`,
    );
  }
  return ok;
}

// ── the audit ───────────────────────────────────────────────────────────────────────────────

const { files, regions, offences } = scan();
console.log(`live-region police scanned ${files.length} SFCs under ${SRC}`);
console.log(`regions declared: ${regions.length} — ${regions.join(", ")}`);

if (args.includes("--self-test")) {
  console.log("\nself-test — the rule against a planted defect and its cure");
  if (!selfTest()) {
    console.error("\ncheck-live-regions: the rule itself is broken; audit not run.");
    process.exit(2);
  }
  console.log("");
}

if (offences.length) {
  console.error(`check-live-regions: ${offences.length} region(s) that never speak:`);
  for (const o of offences)
    console.error(
      `  • ${o.file}:${o.line}  <${o.attrs}> is born under a condition with "${o.content}" ` +
        `already inside it. The region enters the document complete, so there is no mutation ` +
        `to announce and it never speaks. Let the REGION live unconditionally and make its ` +
        `CONTENT the conditional half — src/composables/useLiveRegion.ts is the idiom.`,
    );
  process.exit(1);
}
console.log(
  `check-live-regions: 0 regions born speaking — every declared region takes its content ` +
    `as a mutation`,
);
