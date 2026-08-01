#!/usr/bin/env node
/**
 * pkg-exports — the resolution contract for `@mkbabb/csp-solver-wasm`.
 *
 * WHY THIS EXISTS (T5-W1 row 1.12, audit I3 NARROWED / N2).
 * `pkg/package.json` is gitignored and minted wholesale by `wasm-pack` on every
 * build. Five production workers import the raw binary by deep subpath —
 *
 *     import wasmUrl from "@mkbabb/csp-solver-wasm/csp_solver_wasm_bg.wasm?url";
 *
 * — and today that resolves only through Node's LEGACY no-`exports` fallback.
 * The moment any wasm-pack release starts emitting an `exports` map without a
 * `.wasm` row, all five workers fail with ERR_PACKAGE_PATH_NOT_EXPORTED: zero
 * source change, zero diff to review, a file no reviewer sees. The generator
 * owns the contract; nothing gated it.
 *
 * So the contract is declared HERE and stamped onto the artifact right after
 * wasm-pack runs. One file mints it and verifies it, so the gate can never
 * drift from the postprocess.
 *
 *   --write   postprocess: merge EXPORTS into pkg/package.json (idempotent).
 *             Invoked by `csp-solver/wasm/Makefile`'s `wasm` target and by CI's
 *             build-lean-wasm lane, immediately after `wasm-pack build`.
 *   --check   gate: the manifest carries EXACTLY this map (missing OR extra
 *             rows red), every target is a real file, every non-"." subpath
 *             resolves for a real consumer under exports semantics.
 *
 * The resolution probe is self-contained: it links the pkg into a throwaway
 * node_modules and asks Node to resolve, so it tests the shipped artifact and
 * not this repo's frontend install state.
 *
 * Options: --pkg <dir> (default ../pkg), --json (machine-readable --check).
 */

import { mkdtempSync, rmSync, mkdirSync, symlinkSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_NAME = "@mkbabb/csp-solver-wasm";

/**
 * The contract. Keys are the ONLY specifiers the package answers to.
 * `types` must precede `default` — condition order is resolution order.
 * `./package.json` is the conventional escape hatch tooling reads directly.
 */
const EXPORTS = {
    ".": {
        types: "./csp_solver_wasm.d.ts",
        default: "./csp_solver_wasm.js",
    },
    "./csp_solver_wasm_bg.wasm": "./csp_solver_wasm_bg.wasm",
    "./package.json": "./package.json",
};

const argv = process.argv.slice(2);
const mode = argv.find((a) => a === "--write" || a === "--check");
const pkgDir = resolve(argFor("--pkg") ?? join(HERE, "..", "pkg"));
const asJson = argv.includes("--json");

function argFor(flag) {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
}

if (!mode) {
    console.error("usage: pkg-exports.mjs (--write|--check) [--pkg <dir>] [--json]");
    process.exit(2);
}

const manifestPath = join(pkgDir, "package.json");
if (!existsSync(manifestPath)) {
    console.error(`pkg-exports: no manifest at ${manifestPath} — run \`make wasm\` first`);
    process.exit(2);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

/** Every filesystem target the map names, deduped. */
const targets = [
    ...new Set(
        Object.values(EXPORTS).flatMap((v) => (typeof v === "string" ? [v] : Object.values(v))),
    ),
];
/** Subpaths a consumer can import (the "." entry is exercised by the build itself). */
const subpaths = Object.keys(EXPORTS).filter((k) => k !== ".");

if (mode === "--write") {
    manifest.exports = EXPORTS;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    console.log(`pkg-exports: stamped ${Object.keys(EXPORTS).length} rows onto ${manifestPath}`);
    process.exit(0);
}

// ---------------------------------------------------------------- --check
const failures = [];

if (!manifest.exports) {
    failures.push(
        "manifest has NO `exports` field — the ./csp_solver_wasm_bg.wasm subpath rides Node's legacy " +
            "fallback and is one wasm-pack release away from ERR_PACKAGE_PATH_NOT_EXPORTED",
    );
} else {
    const got = JSON.stringify(manifest.exports, null, 2);
    const want = JSON.stringify(EXPORTS, null, 2);
    if (got !== want) {
        for (const k of Object.keys(EXPORTS)) {
            if (!(k in manifest.exports)) failures.push(`exports is MISSING the row "${k}"`);
        }
        for (const k of Object.keys(manifest.exports)) {
            if (!(k in EXPORTS)) failures.push(`exports carries an UNDECLARED row "${k}"`);
        }
        if (!failures.length) failures.push(`exports shape drifted:\n--- want\n${want}\n--- got\n${got}`);
    }
}

for (const t of targets) {
    if (!existsSync(join(pkgDir, t))) failures.push(`exports target "${t}" does not exist in ${pkgDir}`);
}

// Live resolution: link the real pkg into a throwaway tree and ask Node.
const sandbox = mkdtempSync(join(tmpdir(), "pkg-exports-"));
const probes = [];
try {
    mkdirSync(join(sandbox, "node_modules", "@mkbabb"), { recursive: true });
    symlinkSync(pkgDir, join(sandbox, "node_modules", PKG_NAME));
    for (const sub of subpaths) {
        const spec = `${PKG_NAME}/${sub.slice(2)}`;
        const src = `console.log(import.meta.resolve(${JSON.stringify(spec)}))`;
        try {
            const out = execFileSync(process.execPath, ["--input-type=module", "-e", src], {
                cwd: sandbox,
                encoding: "utf8",
                stdio: ["ignore", "pipe", "pipe"],
            }).trim();
            probes.push({ spec, ok: true, detail: out });
        } catch (e) {
            const why = String(e.stderr || e.message).match(/ERR_[A-Z_]+|Cannot find \S+/)?.[0] ?? "resolve failed";
            probes.push({ spec, ok: false, detail: why });
            failures.push(`subpath "${spec}" does NOT resolve: ${why}`);
        }
    }
} finally {
    rmSync(sandbox, { recursive: true, force: true });
}

const report = {
    pkg: pkgDir,
    version: manifest.version ?? null,
    exportsPresent: Boolean(manifest.exports),
    rows: manifest.exports ? Object.keys(manifest.exports) : [],
    probes,
    failures,
    verdict: failures.length ? "RED" : "GREEN",
};

if (asJson) {
    console.log(JSON.stringify(report, null, 2));
} else {
    console.log(`pkg-exports --check  ${PKG_NAME}@${report.version}`);
    console.log(`  pkg      ${pkgDir}`);
    console.log(`  exports  ${report.exportsPresent ? report.rows.join("  ") : "(absent)"}`);
    for (const p of probes) console.log(`  resolve  ${p.ok ? "OK  " : "FAIL"} ${p.spec} -> ${p.detail}`);
    for (const f of failures) console.log(`  ERROR    ${f}`);
    console.log(`  verdict  ${report.verdict}`);
}
process.exit(failures.length ? 1 : 0);
