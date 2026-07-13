# r1-chronic-ledger — the chronic + deferred census

Lens: mine every deferred/banked/HELD/booked/backlog/post-tranche/owner-action row
across tranche-2 + tranche-3 records and the memory ledgers; verify each against the
tree at HEAD `65425697`; propose a DECIDED disposition; flag anything ridden 2+ closes
as a DISEASE row.

Close references: T2-WGATE = `3b75eca2`; T3-WGATE re-close = `bbeb2b87` (post-W13, 2026-07-12).

---

## A. DISEASE rows (ridden 2+ closes, still unresolved) — the findings

### D1 — Dependabot: 9 phantom alerts against a manifest deleted at T2-W2 (P1)

**family_hint:** `phantom-alert-post-excision`

The single hardest lie in the census.

- **Booked** T2-W1 as "justified-hold — pip/web-api (9 alerts, stack untouched this wave)":
  `docs/tranches/2026-07-tranche-2/evidence/execution/T2-W1-currency-ledger.md:145-166`.
  All 9 "confined to `web/api/uv.lock`", held pending the W2 abrogation decision — "bumping
  now risks doing work that's discarded (if abrogated)."
- **W2 abrogated and deleted `web/api` wholesale** at `98fe2562` (2026-07-10 07:56):
  `git log -1 98fe2562` = "T2-W2: abrogation — the server, docker, and nginx go". The hold's
  own trigger fired; the correct disposition became *dismiss the 9 now-moot alerts*.
- **Never dismissed.** They were folded into T2-WGATE as an owner reminder
  (`.../memory/t2-execution-progress.md:44`: "reminders folded into WGATE: … dependabot 9
  alerts") — and WGATE closed (`3b75eca2`) without touching them.
- **Dropped from the T3 census entirely.** T3's deferred disposition
  (`docs/tranches/2026-07-tranche-3/appendices/C-deferred-disposition.md`), A13
  (`.../audit32/A13-deferred-delineation.md`), and A14 (`.../A14-chronically-deferred.md`)
  make **zero** mention of dependabot. The reminder that WGATE claimed to carry vanished.
- **Current truth (HEAD):** exactly 9 open alerts remain, all against `web/api/uv.lock` — a
  path that has not existed in the tree since `98fe2562`. Two are **HIGH** severity (starlette
  form-limit DoS; starlette SSRF/NTLM via UNC in StaticFiles), five medium, two low. Same 9
  slots (starlette ×5, idna, python-dotenv, pytest, Pygments) the T2-W1 ledger enumerated.

Real security exposure is nil (the code is deleted, never deployed), but the record is lying
two ways: (a) the repo's dependabot dashboard shows "9 open" as if live debt, so a genuine
future alert hides in phantom noise; (b) an owner reminder was claimed carried through T2-WGATE,
then silently dropped from T3 — a re-booked chronic that rode **two** closes unactioned.

**Probe (rerunnable):**
```
gh api repos/mkbabb/csp-solver/dependabot/alerts --paginate \
  --jq '.[] | select(.state=="open") | {sev:.security_advisory.severity, pkg:.dependency.package.name, manifest:.dependency.manifest_path}'
# → 9 rows, every manifest == web/api/uv.lock
git ls-tree -r HEAD --name-only | grep -c web/api      # → 0
git ls-tree -r origin/master --name-only | grep -c web/api  # → 0
git log -1 --format='%ci %h' -- web/api                 # deletion at 98fe2562, 2026-07-10
```

**DECIDED disposition — RETIRE.** Bulk-dismiss all 9 in GitHub as `dismissed / no_longer_relevant`
(reason: manifest removed at 98fe2562). One owner action; empties the dashboard to its true
actionable count (0). Then the "dependabot" reminder can close for real.

---

### D2 — Prettier: no in-repo config, global shadow, bare `--write` lint (P2)

**family_hint:** `lint-gate-shadowed`

- **Standing warning** carried verbatim across both tranches:
  `.../memory/t2-execution-progress.md:20` ("repo lint = prettier --write with NO in-repo config
  (the machine's global ~/.prettierrc.json shadows — pin or re-point before trusting it)"), and
  the audit-context sheet itself bans `npm run lint` for this reason.
- **Current truth (HEAD):** `web/frontend/package.json:11` still `"lint": "prettier --write src/"`;
  **no** `.prettierrc*` / `prettier.config.*` anywhere in the repo (`find` → empty). The only
  config on the machine is `~/.prettierrc.json` (`{printWidth:88, useTabs:false, tabWidth:4}`).
  `web/frontend/package.json:37` declares `prettier-plugin-tailwindcss ^0.8.0` as a devDependency —
  but with no in-repo config to name it, the plugin never loads and class-sorting never runs; and
  formatting silently tracks whatever global file the running machine happens to have.
- Ridden: warned at T2 close and again at T3 close (`bbeb2b87`), never fixed. DISEASE row.

**Probe:**
```
grep -n '"lint"' web/frontend/package.json                      # → "prettier --write src/"
find . \( -name '.prettierrc*' -o -name 'prettier.config.*' \) -not -path '*/node_modules/*'  # → empty
cat ~/.prettierrc.json                                          # the shadow that formats the tree
```

**DECIDED disposition — FOLD (one commit).** Commit `web/frontend/.prettierrc.json` (printWidth 88,
tabWidth 4, `plugins:["prettier-plugin-tailwindcss"]`) so the format is repo-pinned and the declared
tailwind plugin actually runs; or drop the bare `lint` script and make `lint:eslint` the sole gate
(it already is the "true gate" per the ledger). Either kills the shadow.

---

## B. New unhomed deferrals minted by W13 (each carries no owner/trigger/wave)

The T3 close claimed "**Zero deferrals minted**" (`C-deferred-disposition.md:122`). W13 (which re-opened
and re-closed the tranche *after* that appendix was written) minted at least two banked residuals that
never got the owner+trigger treatment the appendix's own invariant demands.

### D3 — Murmur full-viewport paint-damage class (P2)

**family_hint:** `unpromoted-layer-damage`

`docs/tranches/2026-07-tranche-3/evidence/w13-impl/g1-perf.md:59-60`:
> "the murmuring glyph also damages the root full-viewport (un-promoted layer), **same class b1
> named, out of W13 scope**."

W13's entire §1 budget went to killing exactly this damage class for the idle/unsolved state (119.95→7.99
main frames/s, 47.6→0 recurring paints). The **solved** state still runs the classroom murmur
(`web/frontend/src/pencil/composables/celebration.ts:25-60`, `murmurWindowMs`/beat-3 grammar) and
re-introduces full-viewport root damage — explicitly declared out of scope and left live. Prod solved
BMTF measured 37.7/s (`g1-perf.md:56-58`). No owner, no trigger, no wave: an unhomed defect.

**Probe:** `sed -n '55,60p' docs/tranches/2026-07-tranche-3/evidence/w13-impl/g1-perf.md`;
live code `grep -n murmur web/frontend/src/pencil/composables/celebration.ts`.

**DECIDED disposition — BUILD or FILE.** Promote the murmuring glyph to its own compositor layer (the
b1-named containment shape) so the solved-state murmur stops damaging root, OR file it formally with
owner (pencil/FE) + trigger (solved-page perf becomes felt). Not silently banked.

### D4 — GPU single-tile RasterTask residue, ~8/s (P3)

**family_hint:** `cc-tile-eviction`

`docs/tranches/2026-07-tranche-3/evidence/w13-impl/c1.md:34-48`: the pose-flip re-rasters one small
tile per beat (~8/s, median 125ms). Attribution airtight (`display:none`→0). **Two fix shapes tested
and FALSIFIED by injection** (opacity floor 0.001; hoist onto unfiltered wrapper — cc evicts undrawn-layer
tiles regardless). The raster-quiet precedent (pose groups inside one svg) is unavailable — inner-g
reference filters resolve in viewBox units (200) vs CSS px (208), a ~4% field-scale shift that reopens F-2.
GPU-side, zero main-thread Paint; all gate lines pass. Disclosed, unhomed. This is the closest to
genuinely-blocked (both fixes proven infeasible), but it still lacks an owner+trigger row.

**Probe:** `sed -n '34,48p' docs/tranches/2026-07-tranche-3/evidence/w13-impl/c1.md`; experiment harness
`c1-raster-experiment.mjs` beside it.

**DECIDED disposition — RETIRE-with-record.** Accept as a permanent GPU-side residue (fixes falsified,
precedent shape reopens F-2); file the one-line KISS-ledger row with the "reopens F-2 at ~4% field scale"
as the do-not-reattempt rationale. Currently it reads as an open TODO; it should read as a closed accept.

---

## C. Orphaned / under-specified open items

### D5 — core 0.4.0 unpublished to crates.io (P2)

**family_hint:** `version-ahead-of-registry`

`csp-solver/Cargo.toml` and `csp-solver/wasm/Cargo.toml` both declare `version = "0.4.0"`. crates.io tip
is **0.3.0** (only 0.1.0/0.2.0/0.3.0 published; `default_version`/`max_version`/`newest_version` all 0.3.0).
The tree's declared version outruns the published registry by a full minor. The record books this as
"Core 0.4.0 (UNPUBLISHED to crates.io — 0.3.0 is the published tip; publication was never a T3 row; a
future release wave's call)" (`.../memory/t2-execution-progress.md:18`) — an open item with **no named
owner, trigger, or wave**, i.e. an orphan deferral that violates the tranche's own "every deferral has
owner + trigger, zero orphans" invariant (`C-deferred-foldin.md:127`). ×1 close ridden (T3); on track to
become chronic.

**Probe:**
```
grep -m1 '^version' csp-solver/Cargo.toml csp-solver/wasm/Cargo.toml   # → 0.4.0 both
curl -s -H 'User-Agent: audit' https://crates.io/api/v1/crates/csp-solver | python3 -c "import sys,json;print(json.load(sys.stdin)['crate']['max_version'])"  # → 0.3.0
```

**DECIDED disposition — DECIDE.** Either cut a release wave and publish 0.4.0 (the pyo3-abi3 wheel +
crate are already at 0.4.0 in-tree), or formally re-file with owner (repo owner) + trigger (next API-surface
change) so it stops being an orphan. Do not carry a bare version-ahead into a fourth close.

### D6 — mod.rs → self-named-file flip (post-tranche follow-up, undone) (P3)

**family_hint:** `deferred-hygiene-unfired`

Booked as a "post-tranche one-commit follow-up" with `clippy.self_named_module_files`, veto window
(fold into W4) **closed unexercised** at ratification round 2; WGATE-note only
(`docs/tranches/2026-07-tranche-3/waves/T3-WGATE-record-recert.md:42-44`;
`appendices/A-decisions-and-kills.md:205`; `README.md:127`). Current truth: all 10 `mod.rs` present, **no**
`clippy.toml`, no `self_named_module_files` lint anywhere — nothing enforces or tracks it. Rode T3-WGATE +
W13 re-close undone. Low stakes.

**Probe:** `find csp-solver/src -name mod.rs | wc -l` (→10); `find . -name clippy.toml` (→empty);
`grep -rn self_named_module_files csp-solver` (→empty).

**DECIDED disposition — FOLD or RETIRE.** Do the one-commit flip (10 `mod.rs`→named files + clippy lint to
lock it), or formally RETIRE the intent (accept `mod.rs`, record the decision) so it stops re-booking.

### D7 — W8 mount idle-chunking re-entry (re-deferred T2→T3) (P3)

**family_hint:** `perf-fix-retriggered`

The **marks** idle-chunk landed at T3-W8 (`web/frontend/src/games/sudoku/SudokuBoard/SudokuBoard.vue:87`
"Marks idle-chunk gate (T3-W8, G7 R-7)"). The **mount** idle-chunking half (256 `wobbleRect` + component
mounts, the ~100-150ms @4×-CPU worst-frame — G7 measured 99-103ms, the only >100ms gesture) was
**re-deferred** with a named re-entry criterion "mid-device above-band"
(`.../memory/t2-execution-progress.md:34`; opened T2-W8 at `C-deferred-foldin.md:105`). Trigger-bound-healthy
but ×2 (opened T2-W8, re-deferred T3-W8). This is the honest kind of deferral — named owner+trigger — noted
here for the census, not as a defect.

**Probe:** `grep -n 'idle-chunk\|G7 R-7' web/frontend/src/games/sudoku/SudokuBoard/SudokuBoard.vue`.

**DECIDED disposition — keep trigger-bound** (mid-device above-band), or DECIDE-and-close if T4 has no
mid-device evidence to fire it.

---

## D. Verified HEALTHY / genuinely CLOSED (census honesty — no action)

These seeds resolved correctly; recorded so the census can't be accused of only reporting rot:

| Item | Truth at HEAD | Anchor |
|---|---|---|
| `propagate_stratified` backlog | Removed from tree (grep empty); filed as scoped backlog with owner+trigger+byte-recovery | `C-deferred-disposition.md:124-137`; removed at `d78fef8e` |
| C12 gridPaths/mulberry32 straddle | **Resolved** — SudokuBoard imports `mulberry32` from `@mkbabb/pencil-boil`, `generateCellRects` from `@pencil/grid/gridPaths`; no local def | `SudokuBoard.vue:9-10`; `grep 'function mulberry32' src` → empty |
| keyframes.js re-adoption | CLOSED-REJECT covenant (would add a 2nd animation engine) | `web/frontend/src/App.vue:61-64` |
| N11/Timeout wall-clock | RESERVE landed — variant kept with `// reserved: no constructor until cancel-driver` | `csp-solver/src/error.rs:63-64`; `py/errors.rs:42-48` |
| pencil-boil v0.7.0 tag (owner action) | Done — tags `v0.7.0/v0.8.0/v0.8.1` all exist; sibling at 0.8.1; frontend pins `^0.8.1` | `/Users/mkbabb/Programming/pencil-boil` tags; `package.json:21` |
| C11 useCelestialSun (×3 oldest) | Healthily parked on documented failed gate; not in frontend tree | grep `useCelestialSun web/frontend/src` → empty |

---

## E. Full census table

| ID | Item | First booked | Closes ridden | Truth at HEAD | Disposition |
|---|---|---|---|---|---|
| D1 | Dependabot 9 alerts | T2-W1 | 2 (T2-WGATE, T3-WGATE) | 9 open, all vs deleted `web/api/uv.lock`; 2 HIGH; dropped from T3 census | **RETIRE** (bulk-dismiss) |
| D2 | Prettier pin-or-repoint | T2 (standing) | 2 | No repo config; global shadow; bare `--write`; tailwind plugin silently off | **FOLD** (commit .prettierrc) |
| D3 | Murmur full-viewport damage | T3-W13 | 1 (banked, "out of scope") | Live in solved state via celebration murmur | **BUILD/FILE** |
| D4 | GPU single-tile RasterTask | T3-W13 | 1 (banked) | ~8/s, 2 fixes falsified, precedent reopens F-2 | **RETIRE-with-record** |
| D5 | core 0.4.0 unpublished | T3 | 1 | Cargo 0.4.0 vs crates.io 0.3.0; orphan (no owner/trigger) | **DECIDE** (publish or file) |
| D6 | mod.rs self-named flip | T3 pass-2 | 1 (veto closed) | 10 mod.rs present, no lint | **FOLD/RETIRE** |
| D7 | W8 mount idle-chunking | T2-W8 | 2 (re-deferred T3-W8) | Marks landed; mount half re-deferred, named trigger | keep trigger-bound |
| — | propagate_stratified | T3-W3 | — | Removed + backlog-filed (owner+trigger+recovery) | HEALTHY |
| — | C12 straddle | T1→T2 | — | Resolved (pencil-boil import) | CLOSED |
| — | keyframes.js | T1(R8) | — | CLOSED-REJECT covenant | CLOSED |
| — | N11/Timeout | T1→T2 | — | RESERVE landed | CLOSED |
| — | pencil-boil v0.7.0 tag | T3-WGATE | — | Tagged | CLOSED |
| — | bbnf vendor cadence | standing | — | never-push, local sync gate — out-of-repo standing | n/a |

**Bottom line:** the T3 close's "zero deferrals minted / every deferral owner+trigger, zero orphans"
claim is **false at HEAD** — D1 (a carried reminder silently dropped), D3+D4 (W13 banked residuals with
no owner/trigger), and D5 (an orphan version-ahead) each contradict it. Two DISEASE rows (D1, D2) rode
two full closes unresolved.
