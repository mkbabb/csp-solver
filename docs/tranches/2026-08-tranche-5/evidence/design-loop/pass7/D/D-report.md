# PASS-7 LANE D — INK / RECORD TRUTH

Orders: pass6-registry §"Lane D" (three), plus X-order 2's flake booking. Tree `4b28f034`,
concurrent lanes live in the same working tree throughout. No build was produced by this lane
and no number here rides one — every gate below is a static reader. Ports: `:4247` and `:4251`
opened and **verified dead**; `:4237` is a concurrent LAND lane's rig and was left alone.

---

## Order 1 · D6-G1 — DECIDED: FORMAT, both `scripts/`, gate widened same-commit

**The decision, stated as the order demands: BOTH `scripts/` are in format scope** —
`web/frontend/scripts/` **and** the repo-root `scripts/`. Neither is ruled out. Ten files were
unformatted and all ten are formatted.

**The scope, re-derived rather than inherited** (`logs/g1-BORN-RED-lint-gate.log`): 7 under
`web/frontend/scripts/` (`check-coverage-floor`, `check-golden-bytes`, `check-prod-shake`,
`check-pw-projects`, `check-theme-tokens`, `golden-magnitude`, `tdz-probe`) + 3 under the
repo-root (`check-doc-truth`, `check-evidence-policy`, `ledger-diff`) = **ten**, exit **1**.
The other six frontend scripts and the three root `.sh` were already clean or have no parser.

**The row's own figure was measured through a shadow, and that is the real finding**
(`logs/g1-config-shadow.log`). The repo has exactly ONE prettier config and it lives at
`web/frontend/.prettierrc.json`. Prettier resolves config **per file**, walking up from that
file's directory — so a bare reach at `../../scripts/` walks past a repo root with no config
and lands on `$HOME/.prettierrc.json`. Measured, not supposed:

```
$ npx prettier --find-config-path ../../scripts/ledger-diff.mjs
../../../../../.prettierrc.json          → $HOME, {printWidth 88, useTabs false, tabWidth 4}
$ npx prettier --find-config-path scripts/tdz-probe.mjs
.prettierrc.json                         → the estate's
```

That is the `prettier global-shadow` trap PRECEPTS §3 already carried, still live, one
directory outside where the row said it was closed. On this host the three root scripts are
judged at **tabWidth 4**; on a runner with no `$HOME` config they are judged at prettier's own
defaults. Two answers for one file is how a green gate lies. **So the gate line pins
`--config`**, and the ten in the born-RED are ten under the estate's config, instrument-
independent.

**The enforcement, same commit** (the lessons rule):

```diff
- "lint": "prettier --check src/",
+ "lint": "prettier --check --config .prettierrc.json src/ scripts/ ../../scripts/",
```

`ci.yml`'s prettier step already runs `npm run lint` at `working-directory: web/frontend`; its
comment block is restamped to name both directories and to say why the pin is load-bearing.
Born-RED is the natural pre-state — the exact gate line, run before the format, naming all ten
(`logs/g1-BORN-RED-lint-gate.log`); green after (`logs/g1-gate-green.log`).

**Behaviour identity, proven rather than assumed** (`logs/g1-gauntlet-frontend.log`). These
ten are the estate's own instruments, so each was run PRE and POST format and the streams
diffed: **all ten byte-identical on stdout and exit**, the only differences being two
timestamps the scripts print themselves.

| file | pre/post | exit |
|---|---|---|
| `check-coverage-floor` · `check-golden-bytes` · `check-prod-shake` · `check-pw-projects` · `check-theme-tokens` · `tdz-probe` | IDENTICAL | 0 |
| `golden-magnitude` | IDENTICAL | 1 both arms — pre-existing, it needs a `test:golden` run ahead of it and had none; **not caused here** |
| `check-doc-truth` · `ledger-diff` | identical modulo self-printed timestamp | 0 |
| `check-evidence-policy --self-test` | IDENTICAL | 0 |

**The cost that argued against formatting, weighed and dismissed.** Records cite line numbers
into these files (`check-doc-truth.mjs:599`, `check-golden-bytes.mjs:21`, `ledger-diff.mjs:268-276`,
others), and formatting moves lines — `check-doc-truth.mjs` grows 812→1151. But the cited
anchors are **already stale at HEAD, before any formatting**: `:599` is a bare `);` and the
`test-count-208-vs-204` row it names sits at `:603`; `check-golden-bytes.mjs:21` is a comment
line and the `GOLDENS_DIR` it names sits at `:48` with different contents. Line citations into
live source rot from ordinary code motion; formatting is not a new class of harm, and ruling
`scripts/` out would leave ten instruments ungoverned so the row could recur every audit.

---

## Order 2 · D6-G3 — `web/frontend/dist` gets a STAMP, and the stamp is an instrument

`dist/` is `.gitignore`d, carries no commit, and belongs to whoever last ran `npm run build`.
The cheapest cure named in the order is a build-identity line in every rig's AUDIT prepend; a
line that is retyped by hand is a line that rots, so it landed as one small script the prepend
calls.

**`web/frontend/scripts/dist-identity.mjs`** — prints the entry chunk (Vite content-hashes it,
so the name IS the identity), the `index.html` digest, and the payload's extent; with
`--served <baseURL>` it fetches the page and asserts the entry it references matches the one on
disk. `--self-test` **6/6**, and the mismatch arm reds against a **real socket** on `:4247`
rather than a fixture comparison (`logs/g3-dist-identity.log`):

```
AUDIT: build-identity — dist entry index-Cr-QIa0O4Gc3.js · index.html md5 82d4bd20543f6228612a3d24df342e9f · 39 files / 722.4 KB · newest mtime 2026-08-02T11:03:41.021Z
AUDIT: build-identity — http://localhost:4251/ serves the same entry (index-Cr-QIa0O4Gc3.js)
```

The `--served` arm subsumes PRECEPTS §3's `assert-the-SPA is tree-blind` trap: the SPA gate
proves the port serves THE app, this proves it serves YOUR app. Smoked end-to-end against the
real `perf-rig/probe-server.mjs` on an own-range port, exit 0, port killed and verified dead.

**Wired**: `perf-rig/run-safari.sh` and `run-sim.sh` call it immediately after the probe-server
ping and **exit 4** if identity will not derive — a rig that cannot say which tree it measured
does not print numbers. Both `bash -n` clean. `perf-rig/README.md`'s Banked-run-id discipline
row 2 changes from "the commit the dist was built at" (never derivable — a dist has no commit)
to the derivable thing, and the Files table gains the script.

**Law**: PRECEPTS §2 gains the row, with both its bites and its enforcement named.

**The class demonstrated itself mid-lane** (`logs/g3-caught-live.log`). At 11:00:00Z this lane
listed `dist/`: every file stamped 05:27. At 11:05:46Z the same directory read **newest mtime
11:03:41** with a different entry chunk — a concurrent lane rebuilt it between two readings
five minutes apart, while the row about it was being closed. This lane measured nothing against
it; the stamp exists so the next lane that does can say what it measured.

---

## Order 3 · D6-G4 — the "23" restamped in place

Re-derived independently by filesystem walk, not inherited (`logs/g4-dist-census.log`):
**29 banks / 25 hollow / 4 full**, confirming the pass-6 audit exactly. The instrument is
`find -name 'index-*.js' -print -quit`, **not** a shell glob: under zsh a non-matching glob is
an error, not an empty expansion, and the obvious silencer for the noise it makes is the
`2>/dev/null` PRECEPTS §2 forbids. The first draft hit exactly that; the stream was banked and
then the instrument was changed rather than the stream silenced.

What the flat integer concealed, and the reason the correction earns its ink: **all 25 hollow
banks are passes 2–4, all 4 full banks are pass 5.** A clean break at the pass-5 boundary, not
a scatter — the estate stopped losing payloads exactly when pass 5 began `.tar.gz`-ing them,
and the four survivors are the four that prove the policy already works. One of them is
`pass5/f3/dist-p5ablate`, which is the very ABLATE build D6-G3 is about.

Restamped in place in `pass5-adjudications-at-seal.md` §2, correction grammar, original struck
and visible — both occurrences (the opening "All 23" and the later "one of the 23 hollow dirs"
→ 25).

---

## X-order 2 · CH-63 booked · `ledger-diff --require-ledger` exit **0**

`LEDGER.md` §1 Open carries **CH-63 · WATCH · NO RETRY GRANTED**: the audit's bound verbatim
(≈43%/run, binomial 95% CI ≈16–75% printed as a bound, ≈0.15%/execution), the 5-instance
roster, owner = the W1.6 retries-policy row, triggers = same row twice · two reds in one run ·
the rate escaping the bound. The disposition is the audit's: no retry grant; the only legal
grant is a NAMED census row in `check-pw-retries.mjs` **plus** `failOnFlakyTests: true`, which
nobody has priced.

Both CI instances were checked from the field, not from the record
(`logs/ch63-roster-check.log`): run **30743614087** attempt 1 `failure` → attempt 2 `success`,
same sha `4b28f034`; run **30734036107** attempt 1 `failure` → attempt 2 `success`, same sha
`9061b8c1`.

**Three corrections ride the row, booked and NOT re-adjudicated** — the order was to book the
bound verbatim and grant no retry, so these go to the chair rather than into the arithmetic:

1. The signature's *"never the same row twice"* does not survive its own roster.
   `affordances.spec.ts:155` webkit is red in the pass-5 head sweep
   (`pass5/f3/logs/e2e-default-head.log:158`) **and** in the pass-6 LAND final
   (`pass6/land/LAND-report.md:212`). Two runs, two trees, one row — so CH-63's first trigger
   is arguably at the door on the day it is booked.
2. *"never two in one run"* holds for the settled head artifact only. The pass-5 BASE control
   arm red **three** rows in one run (`gallery-deal:72` both engines + `font-census:193`
   webkit). The audit set that arm aside explicitly as a different pre-T′ dist, which is
   defensible; the clause as stated is unconditional and reads wider than its evidence.
3. The **3/7** numerator reconciles only if pass-5's head sweep is OUTSIDE the denominator
   (5 pass-6 sweeps + 2 W3 CI attempts = 7; reds = LAND final, audit sweep 2, W3 attempt 1).
   The audit's prose — *"Adding pass 5's head sweep"* — reads as inside, and inside it is 4/8.
   With the new P6 instance it is 4/9 ≈ 44%. **The bound survives every reading** (all inside
   16–75%); the arithmetic wants one sentence naming its denominator.

`node scripts/ledger-diff.mjs --require-ledger` → **GREEN, 220 rows present-or-cited, 0 orphan,
exit 0** (`logs/ledger-diff-require.log`), run after CH-63 landed and after `ledger-diff.mjs`
itself was reformatted.

---

## Cross-lane, booked not fixed (`logs/cross-lane-findings.log`)

Three reds surfaced in the closing gates. **None is this lane's**, and each is left for its
owner:

- **CH-62's trigger has FIRED, the cure is landing, and the ledger row hasn't moved.** A
  concurrent lane bumped `@mkbabb/pencil-boil` `^0.11.0` → `^0.12.0` **and** deleted the
  170-line `e2e/linux-webkit-bake-quarantine.ts`. CH-62's own text reads *"triggers = W4b's rig
  verdict OR `@mkbabb/pencil-boil >=0.12.0` (the quarantine module THROWS itself out)"* — so
  that lane is executing the row's stated disposition exactly, and cleanly: the two specs that
  still carry the string reference an evidence `.md`, not the deleted module, so nothing
  imports a missing file. **The gap is the record, not the work** — CH-62 still reads KEEP-PARK
  while its trigger is satisfied and its cure sits in the tree. Not restamped here: the row is
  another lane's, mid-flight, and the restamp is the chair's.
- **`check-doc-truth.mjs` reds 1/13** (`pencil-boil-0.9.2`): the same bump moved
  `package.json` and left `README.md:131` and `web/frontend/README.md:11` at `^0.11.0`. The
  gate is doing its job — a ruling that did not land with its record, caught by an instrument.
  Outside this lane's fence.
- **`npm run lint` reds 3 files, all in `src/`** — `GameControlPanel.vue`,
  `GameControlPanel.test.ts`, `HandwrittenLogo.vue`, all `M` in another lane's hands. `src/`
  has been in the gate since T4-W4, so the widening neither caused this nor masks it. This
  lane's own scope — **both `scripts/` roots — exits 0**.
- **`check-evidence-policy.mjs` reds** on the per-wave cap and two `pass7/F3/shots/*.png` over
  the per-image cap. F3's shots are 396 KB of the design-loop directory's 408 KB pass-7
  footprint. **This lane banks 48 KB, text-only, zero images.**

---

## New gaps

| id | row |
|---|---|
| **D7-G1** | CH-62's `>=0.12.0` trigger is satisfied on the working tree and its cure is landing (bump + quarantine module deleted), while the row still reads KEEP-PARK. Record gap, not a work gap |
| **D7-G2** | `check-doc-truth` RED — the pencil-boil bump left both READMEs at `^0.11.0` |
| **D7-G3** | CH-63's signature clause *"never the same row twice"* is contradicted by its own roster (`affordances:155` twice); trigger 1 may already be fired |
| **D7-G4** | CH-63's 3/7 has no stated denominator; 3/7, 4/8 and 4/9 are all defensible readings of the audit's own prose |
| **D7-G5** | `golden-magnitude.mjs` exits 1 standalone (both pre- and post-format) — it reads magnitudes a `test:golden` run must produce first, and nothing in its own output says so |
| **D7-G6** | `probe-server.mjs`'s `/__ping` answers with the whole `index.html` rather than a ping payload; harmless to the rig's use, but it means "ping OK" proves less than it reads |
| **D7-G7** | evidence-policy per-wave cap breached at `pass7/` by F3's shots (396 of 408 KB) |
| **D7-G8** | the 4230-4260 own-server range has no registrar — four concurrent servers in it this session (`:4237`, `:4238` LAND rig; `:4251` re-bound by another lane 5 min after this one released it). Collisions are avoided by timing luck. `--strictPort` turns a collision into a silent background failure (PRECEPTS §3 already banks one) |
| **D7-G9** | a concurrent lane is running `vite preview --outDir dist` on `:4251` against the shared unowned `dist` — D6-G3's hazard live in the tree, and the first real customer for `dist-identity.mjs --served` |
