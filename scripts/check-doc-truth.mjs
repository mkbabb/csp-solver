#!/usr/bin/env node
/**
 * check-doc-truth — the doc-canon gate.
 *
 * Ten rows, each of which RE-DERIVES its truth from the artifact at run time
 * and then asserts the docs say that. Nothing here is pinned: every expected
 * value comes off the tree — a byte count off the built `.wasm`, a version off
 * `Cargo.toml`/`package.json`, a test roster off the `#[test]` attributes, an
 * e2e total off `playwright test --list`. When the code moves, the gate moves
 * with it and the prose is what goes red.
 *
 * Zero dependencies, ESM, node-only. Runs identically on ubuntu and darwin.
 *
 * Exit 0 = all ten green. Exit 1 = one line per failing site: row id,
 * file:line, expected, got.
 *
 * ── Derivation notes (the toolchain-drift-tolerant choices) ────────────────
 *
 * Rust test count: counted statically — `#[test]` and `#[wasm_bindgen_test]`
 * attributes across `csp-solver/**`, comment lines elided — rather than through
 * `cargo test --list`, which wants a full workspace compile (17 GB of `target/`
 * here) and reports a total that shifts with the toolchain's doctest handling.
 * The static count is the NATIVE host roster: `csp-solver/src` + `csp-solver/
 * tests`. Doctests aren't statically countable, so a doc citing a `cargo test
 * --workspace` total passes when its own split reconciles — total minus the
 * doctests it declares must equal the derived attribute count — and when its
 * test-binary figure equals the derived one (lib targets + integration files).
 *
 * Lean wasm bytes: measured off whichever built artifact is on disk (`pkg/`,
 * a downloaded `lean-pkg/`, or the hashed `dist/` asset). darwin and the CI
 * runner disagree by ~2 KB on the same source — the known toolchain divergence —
 * so a doc site passes by carrying the LOCALLY derived figure. A site stamped
 * with both figures passes on both platforms, which is the shape the canon
 * wants. With no artifact anywhere the row degrades: it derives the runner
 * figure from the CI band comment, says so loudly in the output, and still
 * asserts.
 *
 * Two rows carry a clause their id doesn't name. `ofl-licenses-figures` asserts
 * the font figures at both sites that state them — the README paragraph and the
 * bundled `LICENSES.md`, whose per-family byte column sits inside a license-
 * compliance statement. `install-pin-0.5` also asserts that no published surface
 * links outward into `docs/precepts/`, a submodule of campaign substrate: the
 * pin and the leak are one wave row (T5-W0 0.5) and stay one gate row.
 *
 * The `ci.yml` band comment: hand-copied measurements inside comments are a
 * chronic class (CH-32). The gate asserts only the present-tense "yields A full
 * / B lean" sentence, since the lines below it are an explicitly dated log. The
 * cure is either restamping the lean literal to the derived figure or dropping
 * it — the run line already echoes the live `$RAW`, so absence passes.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const abs = (rel) => join(ROOT, rel);
const has = (rel) => existsSync(abs(rel));
const read = (rel) => (has(rel) ? readFileSync(abs(rel), "utf8") : null);
const bytes = (rel) => statSync(abs(rel)).size;
const fmt = (n) => n.toLocaleString("en-US");
const num = (s) => Number(String(s).replace(/,/g, ""));

/** Every line of `rel` matching `re`, 1-indexed, with the match. */
function grep(rel, re) {
    const text = read(rel);
    if (text === null) return [];
    const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
    return text.split("\n").flatMap((line, i) => {
        const m = [...line.matchAll(new RegExp(re.source, flags))];
        return m.length ? [{ file: rel, line: i + 1, text: line.trim(), m }] : [];
    });
}

/** Recursive file walk, `skip` matched against each directory name. */
function walk(rel, ext, skip = /^(target|node_modules|\.venv|\.git|pkg|dist)$/) {
    const out = [];
    const rec = (dir) => {
        for (const e of readdirSync(abs(dir), { withFileTypes: true })) {
            if (e.isDirectory()) {
                if (!skip.test(e.name)) rec(join(dir, e.name));
            } else if (e.name.endsWith(ext)) out.push(join(dir, e.name));
        }
    };
    if (has(rel)) rec(rel);
    return out;
}

const DOCS = [
    "README.md",
    ...(has("docs") ? readdirSync(abs("docs")).filter((f) => f.endsWith(".md")).map((f) => `docs/${f}`) : []),
    "csp-solver/README.md",
    "csp-solver/wasm/README.md",
    "csp-solver/wasm/pkg/README.md",
    "web/frontend/README.md",
].filter(has);

// ── derivations ────────────────────────────────────────────────────────────

/** The lean ship artifact's raw size, and where it was measured. */
function deriveLeanWasm() {
    const fixed = [
        "csp-solver/wasm/pkg/csp_solver_wasm_bg.wasm",
        "lean-pkg/csp_solver_wasm_bg.wasm",
    ].find(has);
    if (fixed) return { size: bytes(fixed), source: fixed, degraded: false };

    const distDir = "web/frontend/dist/assets";
    const hashed = has(distDir) && readdirSync(abs(distDir)).find((f) => /^csp_solver_wasm_bg-.*\.wasm$/.test(f));
    if (hashed) return { size: bytes(join(distDir, hashed)), source: join(distDir, hashed), degraded: false };

    const band = grep(".github/workflows/ci.yml", /runner measures ([\d,]+) B/);
    if (band.length) {
        return {
            size: num(band[0].m[0][1]),
            source: `${band[0].file}:${band[0].line} (CI band config — NO artifact on disk)`,
            degraded: true,
        };
    }
    return { size: null, source: "unmeasurable — no artifact, no band config", degraded: true };
}

/** `playwright test --list` totals for a config. */
function pwList(configArgs = []) {
    const cwd = abs("web/frontend");
    const local = join(cwd, "node_modules/.bin/playwright");
    const [bin, head] = existsSync(local) ? [local, []] : ["npx", ["playwright"]];
    try {
        const out = execFileSync(bin, [...head, "test", "--list", ...configArgs], {
            cwd,
            encoding: "utf8",
            timeout: 180_000,
            maxBuffer: 64 * 1024 * 1024,
            stdio: ["ignore", "pipe", "pipe"],
        });
        const m = out.match(/Total:\s+(\d+)\s+tests?\s+in\s+(\d+)\s+files?/);
        return m ? { tests: Number(m[1]), files: Number(m[2]) } : { error: "no Total: line in --list output" };
    } catch (e) {
        const m = String(e.stdout ?? "").match(/Total:\s+(\d+)\s+tests?\s+in\s+(\d+)\s+files?/);
        return m ? { tests: Number(m[1]), files: Number(m[2]) } : { error: (e.message ?? String(e)).split("\n")[0] };
    }
}

/** Native `#[test]` roster, wasm-only roster, and the test-binary count. */
function deriveRustTests() {
    const isComment = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);
    let native = 0;
    let wasm = 0;
    for (const f of walk("csp-solver", ".rs")) {
        const wasmCrate = f.includes("csp-solver/wasm/");
        for (const line of readFileSync(abs(f), "utf8").split("\n")) {
            if (isComment(line)) continue;
            const t = (line.match(/#\[test\]/g) ?? []).length;
            const w = (line.match(/#\[wasm_bindgen_test\]/g) ?? []).length;
            if (wasmCrate) wasm += t + w;
            else native += t + w;
        }
    }
    const members = (read("Cargo.toml")?.match(/members\s*=\s*\[([^\]]*)\]/)?.[1] ?? "")
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    const binaries = members.reduce((n, m) => {
        const lib = has(join(m, "src/lib.rs")) ? 1 : 0;
        const its = has(join(m, "tests")) ? readdirSync(abs(join(m, "tests"))).filter((f) => f.endsWith(".rs")).length : 0;
        return n + lib + its;
    }, 0);
    return { native, wasm, binaries, members };
}

/** Font subsets and their OFL texts. */
function deriveFonts() {
    const dir = "web/frontend/src/assets/fonts";
    if (!has(dir)) return { subsets: [], total: 0, ofl: [], paired: false, dir };
    const files = readdirSync(abs(dir));
    const subsets = files.filter((f) => f.endsWith(".woff2")).sort();
    const ofl = files.filter((f) => /^OFL-.*\.txt$/i.test(f)).sort();
    const family = (f) => f.replace(/^OFL-|-subset\.woff2$|\.txt$/gi, "").toLowerCase();
    const paired =
        subsets.length === ofl.length &&
        subsets.every((s) => ofl.some((o) => family(o) === family(s)));
    return {
        dir,
        subsets,
        ofl,
        paired,
        total: subsets.reduce((n, f) => n + bytes(join(dir, f)), 0),
    };
}

/** Byte figures the docs themselves declare stale. */
function deriveStaleFigures() {
    return DOCS.flatMap((rel) =>
        grep(rel, /\bstale\b/i)
            .flatMap((h) => [...h.text.matchAll(/(\d{2,3},\d{3})\s*B\b/g)].map((m) => ({ site: `${h.file}:${h.line}`, value: num(m[1]) }))),
    );
}

/** Enforced twiggy bands, read out of the workflow's own guards. */
function deriveBands() {
    const text = read(".github/workflows/ci.yml") ?? "";
    const lines = text.split("\n");
    const after = (anchor) => {
        const i = lines.findIndex((l) => anchor.test(l));
        if (i < 0) return [];
        return lines
            .slice(i, i + 25)
            .flatMap((l) => [...l.matchAll(/-gt\s+(\d+)/g)].map((m) => Number(m[1])));
    };
    const [fullFail, fullWarn] = after(/twiggy top \+ raw-size budget/);
    const [leanFail] = after(/lean raw-size budget/);
    return { fullFail, fullWarn, leanFail };
}

const D = {
    lean: deriveLeanWasm(),
    fonts: deriveFonts(),
    rust: deriveRustTests(),
    bands: deriveBands(),
    staleFigures: deriveStaleFigures(),
    crate: read("csp-solver/Cargo.toml")?.match(/^version\s*=\s*"(\d+)\.(\d+)\.(\d+)"/m) ?? null,
    pencil: JSON.parse(read("web/frontend/package.json") ?? "{}")?.dependencies?.["@mkbabb/pencil-boil"] ?? null,
    lint: JSON.parse(read("web/frontend/package.json") ?? "{}")?.scripts?.lint ?? null,
    games: grep("web/frontend/src/games/registry.ts", /^\s*id:\s*"([a-z]+)"/).map((h) => h.m[0][1]),
    projects: grep("web/frontend/playwright.config.ts", /name:\s*"([a-z]+)"/).map((h) => h.m[0][1]),
    specs: walk("web/frontend/e2e", ".spec.ts").length,
    e2e: pwList(),
    golden: pwList(["-c", "playwright-golden.config.ts"]),
    throttle: pwList(["-c", "playwright-throttle.config.ts"]),
};
D.pin = D.crate ? `${D.crate[1]}.${D.crate[2]}` : null;

// ── rows ───────────────────────────────────────────────────────────────────

const fail = (site, expected, got) => ({ site, expected, got });

const ROWS = [
    {
        id: "frontend-readme-two-games",
        derived: () =>
            `${D.games.length} games registered (${D.games.join(", ")}) · pencil-boil ${D.pencil} · lint script ${JSON.stringify(D.lint)}`,
        run: () =>
            !has("web/frontend/README.md")
                ? [fail("web/frontend/README.md", "the frontend reference", "file absent")]
                : grep("web/frontend/README.md", /two games|0\.7\.0|prettier --write/i).map((h) =>
                fail(
                    `${h.file}:${h.line}`,
                    `no match for /two games|0\\.7\\.0|prettier --write/i — the app registers ${D.games.length} games, depends on pencil-boil ${D.pencil}, and lints with ${JSON.stringify(D.lint)}`,
                    h.text,
                ),
            ),
    },
    {
        id: "root-readme-e2e-counts",
        derived: () =>
            D.e2e.error
                ? `UNDERIVED: playwright test --list failed (${D.e2e.error})`
                : `${D.e2e.tests} tests in ${D.e2e.files} files (default) · ${D.specs} .spec.ts on disk · golden ${D.golden.tests ?? "?"}/${D.golden.files ?? "?"} · throttle ${D.throttle.tests ?? "?"}/${D.throttle.files ?? "?"}`,
        run: () => {
            if (D.e2e.error)
                return [fail("web/frontend", "playwright test --list to enumerate the suite", `it failed: ${D.e2e.error} — run npm ci in web/frontend`)];
            const out = [];
            for (const h of grep("README.md", /(\d[\d,]*)\s+Playwright tests?/)) {
                const got = num(h.m[0][1]);
                if (got !== D.e2e.tests)
                    out.push(fail(`${h.file}:${h.line}`, `${D.e2e.tests} Playwright tests (playwright test --list)`, `${fmt(got)} — ${h.text}`));
            }
            for (const h of grep("README.md", /(\d[\d,]*)\s+spec files?/)) {
                const got = num(h.m[0][1]);
                if (got !== D.e2e.files && got !== D.specs)
                    out.push(fail(`${h.file}:${h.line}`, `${D.e2e.files} (--list) or ${D.specs} (on disk) spec files`, `${fmt(got)} — ${h.text}`));
            }
            if (!grep("README.md", /(\d[\d,]*)\s+Playwright tests?/).length)
                out.push(fail("README.md", `an e2e count citing ${D.e2e.tests} Playwright tests`, "no e2e count in the file at all"));
            return out;
        },
    },
    {
        id: "chromium-alone-claim",
        derived: () => `playwright projects: ${D.projects.join(" + ") || "none parsed"} · ci installs: ${grep(".github/workflows/ci.yml", /playwright install[^\n]*/).map((h) => h.m[0][0]).join("; ") || "none"}`,
        run: () => {
            if (!D.projects.length)
                return [fail("web/frontend/playwright.config.ts", "a parseable project list to derive the browser posture from", "no projects parsed")];
            if (D.projects.length < 2) return [];
            return grep("README.md", /chromium alone|known-broken|Safari is known/i).map((h) =>
                fail(
                    `${h.file}:${h.line}`,
                    `no single-browser CI claim — playwright.config.ts declares ${D.projects.length} projects (${D.projects.join(", ")}) and CI installs them`,
                    h.text,
                ),
            );
        },
    },
    {
        id: "lean-wasm-4-sites",
        derived: () =>
            D.lean.size === null
                ? "UNDERIVED: no lean wasm artifact and no band config"
                : `${fmt(D.lean.size)} B ← ${D.lean.source}${D.lean.degraded ? "  [DEGRADED: derived from the band config, not an artifact]" : ""}`,
        run: () => {
            if (D.lean.size === null)
                return [fail("csp-solver/wasm/pkg", "a built lean artifact to measure", "none found — run `make -C csp-solver/wasm wasm`")];
            const sites = [
                "docs/benchmarks.md",
                "csp-solver/wasm/README.md",
                "csp-solver/wasm/pkg/README.md",
                ".github/workflows/ci.yml",
            ];
            const want = fmt(D.lean.size);
            return sites.flatMap((s) => {
                // In degraded mode the figure comes OUT of ci.yml, so checking
                // ci.yml against it proves nothing. Say so rather than pass.
                if (D.lean.degraded && s === ".github/workflows/ci.yml")
                    return [fail(s, `a lean-artifact figure re-derived from a built artifact`, "UNVERIFIABLE — the fallback figure was read from this same file; build the lean wasm or download the lean-wasm-pkg artifact")];
                const text = read(s);
                if (text === null) return [fail(s, `a lean-artifact figure of ${want} B`, "file absent")];
                if (text.includes(want) || text.includes(String(D.lean.size))) return [];
                const cited = grep(s, /(\d{2,3},\d{3})\s*B/).filter((h) => /lean|measures|artifact/i.test(h.text));
                const where = cited.length ? cited.map((h) => `${h.file}:${h.line} cites ${h.m.map((x) => x[1]).join(", ")} B`).join(" · ") : `${s}: no byte figure found`;
                return [fail(s, `${want} B (measured now at ${D.lean.source})`, where)];
            });
        },
    },
    {
        id: "ci-band-comment-406",
        derived: () =>
            `enforced bands — full fail >${fmt(D.bands.fullFail ?? 0)} B / warn >${fmt(D.bands.fullWarn ?? 0)} B · lean fail >${fmt(D.bands.leanFail ?? 0)} B; lean artifact ${D.lean.size === null ? "unmeasured" : fmt(D.lean.size) + " B"}; canon-declared stale: ${D.staleFigures.map((s) => `${fmt(s.value)} B (${s.site})`).join(", ") || "none"}`,
        run: () => {
            const rel = ".github/workflows/ci.yml";
            const lines = (read(rel) ?? "").split("\n");
            const start = lines.findIndex((l) => /--profile wasm-release is REQUIRED/.test(l));
            if (start < 0) return [fail(rel, "the wasm-release band comment", "anchor comment not found")];
            let end = start;
            while (end + 1 < lines.length && /^\s*#/.test(lines[end + 1])) end++;
            const block = lines.slice(start, end + 1);
            const joined = block.map((l) => l.replace(/^\s*#\s?/, "")).join(" ");
            const yields = joined.match(/yields\s+([\d,]+)\s*B\s+full\s*\/\s*([\d,]+)\s*B\s+lean/);
            if (!yields) return [];
            const out = [];
            const leanLit = num(yields[2]);
            const fullLit = num(yields[1]);
            const at = (lit) => {
                const i = block.findIndex((l) => l.includes(lit));
                return `${rel}:${start + (i < 0 ? 0 : i) + 1}`;
            };
            if (D.lean.size !== null && leanLit !== D.lean.size)
                out.push(
                    fail(
                        at(yields[2]),
                        `${fmt(D.lean.size)} B lean (measured at ${D.lean.source}) — or drop the literal, the run line already echoes the live $RAW`,
                        `${fmt(leanLit)} B lean, hand-copied and ${fmt(Math.abs(D.lean.size - leanLit))} B off the artifact`,
                    ),
                );
            if (D.bands.fullWarn && fullLit > D.bands.fullWarn)
                out.push(fail(at(yields[1]), `a full-module figure under the enforced warn band (${fmt(D.bands.fullWarn)} B)`, `${fmt(fullLit)} B`));
            // The full module isn't measurable without a default-feature build,
            // so it's cross-checked instead: a figure the canon itself declares
            // stale can't stand as the workflow's current yield.
            for (const s of D.staleFigures)
                if ([leanLit, fullLit].includes(s.value))
                    out.push(
                        fail(
                            at(fmt(s.value)),
                            `no figure the canon declares stale — ${s.site} says ${fmt(s.value)} B is stale, "do not quote it as current"`,
                            `${fmt(s.value)} B quoted as what wasm-release yields`,
                        ),
                    );
            return out;
        },
    },
    {
        id: "sudoku-md-sections",
        derived: () => `games registered: ${D.games.join(", ")} — each owed a section in docs/sudoku.md`,
        run: () => {
            const rel = "docs/sudoku.md";
            const text = read(rel);
            if (text === null) return [fail(rel, "the puzzle-family reference", "file absent")];
            const present = (text.match(/^## .*/gm) ?? []).map((h) => h.trim());
            return [/^## Thermo/m, /^## Killer/m, /^## KenKen/m]
                .filter((re) => !re.test(text))
                .map((re) => fail(rel, `a section matching ${re}`, `headings stop at: ${present.slice(-1)[0] ?? "none"}`));
        },
    },
    {
        id: "ofl-licenses-figures",
        derived: () =>
            `${D.fonts.subsets.length} woff2 subsets, ${fmt(D.fonts.total)} B total (${D.fonts.subsets.map((f) => `${f} ${fmt(bytes(join(D.fonts.dir, f)))} B`).join(", ")}) · OFL texts: ${D.fonts.ofl.join(", ") || "none"} · paired ${D.fonts.paired}`,
        run: () => {
            const out = [];
            if (!D.fonts.subsets.length) return [fail(D.fonts.dir, "the self-hosted woff2 subsets and their OFL texts", "directory absent or empty")];
            if (!D.fonts.paired)
                out.push(fail(D.fonts.dir, `one OFL text per subset (${D.fonts.subsets.length})`, `${D.fonts.ofl.length} OFL texts: ${D.fonts.ofl.join(", ") || "none"}`));
            const words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
            const n = D.fonts.subsets.length;
            const manifest = `${D.fonts.dir}/LICENSES.md`;
            for (const rel of ["README.md", manifest].filter(has)) {
                const sites = grep(rel, /woff2 subsets/i);
                if (!sites.length) {
                    out.push(fail(rel, `a font claim citing ${n} subsets, ${fmt(D.fonts.total)} B total`, "no woff2 claim in the file"));
                    continue;
                }
                for (const h of sites) {
                    const cited = h.text.match(/([\d,]+)\s*B total/);
                    if (!cited || num(cited[1]) !== D.fonts.total)
                        out.push(fail(`${h.file}:${h.line}`, `${fmt(D.fonts.total)} B total (wc -c ${D.fonts.dir}/*.woff2)`, cited ? `${cited[1]} B total` : "no byte total cited"));
                    if (!new RegExp(`\\b(${n}|${words[n] ?? "\\0"})\\b`, "i").test(h.text))
                        out.push(fail(`${h.file}:${h.line}`, `a subset count of ${n} (${words[n]})`, h.text));
                }
            }
            // The manifest's per-family rows are a license-compliance statement: each
            // subset's byte figure is asserted against the file it names.
            for (const f of has(manifest) ? D.fonts.subsets : []) {
                const want = bytes(join(D.fonts.dir, f));
                for (const h of grep(manifest, new RegExp(`\`${f.replace(/\./g, "\\.")}\``))) {
                    const cited = h.text.match(/\|\s*([\d,]+)\s*\|/);
                    if (!cited || num(cited[1]) !== want)
                        out.push(fail(`${h.file}:${h.line}`, `${fmt(want)} B for ${f}`, cited ? `${cited[1]} B` : "no byte figure in the row"));
                }
            }
            return out;
        },
    },
    {
        id: "install-pin-0.5",
        derived: () =>
            `csp-solver crate version ${D.crate ? D.crate[0].match(/"(.*)"/)[1] : "?"} → Install pin "${D.pin}" · consumer surfaces carry no outbound link into docs/precepts/`,
        run: () => {
            if (!D.pin) return [fail("csp-solver/Cargo.toml", "a parseable [package] version", "none")];
            const pin = grep("csp-solver/README.md", /^\s*csp-solver\s*=\s*"([^"]+)"/)
                .filter((h) => h.m[0][1] !== D.pin)
                .map((h) => fail(`${h.file}:${h.line}`, `csp-solver = "${D.pin}"`, h.text));
            const leak = DOCS.flatMap((rel) =>
                grep(rel, /\]\([^)]*docs\/precepts\//).map((h) =>
                    fail(`${h.file}:${h.line}`, "no link into docs/precepts/ — a published surface stays campaign-clean", h.text),
                ),
            );
            return [...pin, ...leak];
        },
    },
    {
        id: "pencil-boil-0.9.2",
        derived: () => `web/frontend/package.json dependencies["@mkbabb/pencil-boil"] = ${D.pencil}`,
        run: () => {
            if (!D.pencil) return [fail("web/frontend/package.json", "a pencil-boil dependency", "none declared")];
            const want = D.pencil.replace(/^\^/, "");
            return DOCS.flatMap((rel) =>
                grep(rel, /pencil-boil/i)
                    .flatMap((h) => [...h.text.matchAll(/\^?(\d+\.\d+\.\d+)/g)].map((v) => ({ h, v })))
                    .filter(({ v }) => v[1] !== want)
                    .map(({ h, v }) => fail(`${h.file}:${h.line}`, `pencil-boil ${D.pencil}`, `${v[0]} — ${h.text}`)),
            );
        },
    },
    {
        id: "test-count-208-vs-204",
        derived: () =>
            `${D.rust.native} native #[test] attributes (csp-solver/src + csp-solver/tests, comments elided) · ${D.rust.wasm} #[wasm_bindgen_test] in the wasm crate (cfg'd to wasm32, not host-run) · ${D.rust.binaries} test binaries (${D.rust.members.join(" + ")} lib targets + integration files)`,
        run: () =>
            !D.rust.native
                ? [fail("csp-solver", "a #[test] roster to count", "no test attributes found — nothing to derive from")]
                : DOCS.flatMap((rel) =>
                grep(rel, /(\d[\d,]*)\s+passed,\s*\d+\s+failed/).flatMap((h) => {
                    const total = num(h.m[0][1]);
                    const bin = h.text.match(/(\d+)\s+test binaries/);
                    const doc = h.text.match(/(\d+)\s+doctests?/);
                    const out = [];
                    const declaredDoctests = doc ? Number(doc[1]) : 0;
                    if (total - declaredDoctests !== D.rust.native)
                        out.push(
                            fail(
                                `${h.file}:${h.line}`,
                                `a total reconciling to ${D.rust.native} #[test] attributes${doc ? ` + ${declaredDoctests} doctests = ${D.rust.native + declaredDoctests}` : " (declare the doctest split)"}`,
                                `${fmt(total)} passed${doc ? ` with ${declaredDoctests} doctests → ${fmt(total - declaredDoctests)} attributes` : ", no doctest split declared"} — ${h.text}`,
                            ),
                        );
                    if (bin && Number(bin[1]) !== D.rust.binaries)
                        out.push(fail(`${h.file}:${h.line}`, `${D.rust.binaries} test binaries`, `${bin[1]} test binaries — ${h.text}`));
                    return out;
                }),
            ),
    },
];

// ── report ─────────────────────────────────────────────────────────────────

const head = (() => {
    try {
        return execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim();
    } catch {
        return "unknown";
    }
})();

const lines = [];
const say = (s = "") => lines.push(s);

say("doc-truth — 10 rows, every figure re-derived at run time");
say(`repo  ${ROOT}`);
say(`head  ${head}`);
say(`node  ${process.version} ${process.platform}/${process.arch}`);
say(`when  ${new Date().toISOString()}`);
say();

let red = 0;
const results = [];
for (const row of ROWS) {
    const failures = row.run();
    if (failures.length) red++;
    results.push({ id: row.id, failures });
    say(`${failures.length ? "RED  " : "GREEN"}  ${row.id}`);
    say(`        derived: ${row.derived()}`);
    for (const f of failures) {
        say(`        ${f.site}`);
        say(`          expected: ${f.expected}`);
        say(`          got:      ${f.got}`);
    }
    say();
}

say(`${red} RED / ${ROWS.length - red} GREEN — ${red ? "doc canon disagrees with the tree" : "canon holds"}`);

process.stdout.write(lines.join("\n") + "\n");
process.exitCode = red ? 1 : 0;
