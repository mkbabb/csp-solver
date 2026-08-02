/**
 * loc-strip.mjs — THE STRIPPER, named and committed beside the ledger it produces.
 *
 * Pass 4's LOC ledger asserted "same stripper both sides" and never named it, so the ledger was
 * unreproducible by construction and the audit's re-count disagreed on three of five rows
 * (BC-m3). This is that script. It is deliberately dull, and its rules are printed rather than
 * implied:
 *
 *   · a CODE line is a line that is non-empty after stripping comments and trimming;
 *   · `//` line comments and `/* … *\/` block comments are stripped (both `.ts` and `.vue`
 *     `<script>`/`<style>` bodies use them; CSS uses only the block form);
 *   · `<!-- … -->` HTML comments are stripped (`.vue` templates);
 *   · nothing else is removed — no import folding, no brace-only elision, no prettier.
 *
 * A string literal containing `//` would be over-stripped; that is a known and accepted
 * imprecision, stated here rather than discovered by the next auditor. It applies identically
 * to both sides of every diff, which is the only property a ledger needs from it.
 *
 * usage: node loc-strip.mjs <baseRef> [-- path ...]      (read-only; uses `git show`)
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const strip = (src) =>
  src
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^[ \t]*\/\/.*$/gm, "")
    .split("\n")
    .filter((l) => l.trim().length > 0).length;

const base = process.argv[2];
if (!base) {
  console.error("usage: node loc-strip.mjs <baseRef> [-- path ...]");
  process.exit(2);
}
const paths = process.argv.slice(3).filter((a) => a !== "--");

const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 1 << 28 });
const at = (ref, f) => {
  try {
    return ref === "WORKTREE" ? readFileSync(f, "utf8") : git("show", `${ref}:${f}`);
  } catch {
    return null;
  }
};

const changed = git("diff", "--name-only", base, "--", ...paths)
  .split("\n")
  .filter(Boolean)
  .filter((f) => /\.(ts|vue|css|mjs|js)$/.test(f));

let net = 0;
const rows = [];
for (const f of changed) {
  const b = at(base, f);
  const h = at("WORKTREE", f);
  const before = b === null ? 0 : strip(b);
  const after = h === null ? 0 : strip(h);
  net += after - before;
  rows.push({ f, before, after, net: after - before });
}
rows.sort((x, y) => Math.abs(y.net) - Math.abs(x.net));
const w = Math.max(...rows.map((r) => r.f.length), 4);
console.log(`stripper: loc-strip.mjs · base ${base} · code lines (comments + blanks removed)\n`);
for (const r of rows)
  console.log(
    `${r.f.padEnd(w)}  ${String(r.before).padStart(6)} → ${String(r.after).padStart(6)}  ${
      r.net >= 0 ? "+" : ""
    }${r.net}`,
  );
console.log(`${"".padEnd(w)}  ${"".padStart(6)}   ${"".padStart(6)}  NET ${net >= 0 ? "+" : ""}${net}`);
