# T9-W5 §5.1 — the deploy estate's canaries

Seven rows, and every one of them shown RED on a planted defect before it was shown GREEN on
the tree. Every exit code below was read BARE (`cmd; echo $?`), never through a pipe — the
trap MEMORY carries. Tree at the readings: `4dd9ec9c`. No deploy act of any kind was
performed: the Pages project, the Worker and the CF dashboard are untouched, and the only
network traffic was plain GETs.

**Re-executed 2026-08-28**, whole, after a session wall interrupted the first pass. Nothing
here is inherited: every arm was fired again against the tree as it stands, and the figures
below are the second pass's. Three things the re-run changed, each written into the row it
belongs to:

- **The preflight arms were never the decider in the first pass.** Removing
  `web/relay/wrangler.toml` from a fixture makes the fixture DIRTY, so §7 answered and §8
  never spoke — the canary looked green while proving nothing about the arm it named. The
  plants are now COMMITTED, which leaves a clean tree genuinely missing half the pair, and
  §8 is graded on its own (row 3).
- **The fixtures moved into the script.** `deploy-gated.sh --self-test` now carries all
  eleven arms itself rather than living in a scratch harness, so the canary is re-runnable
  by anyone at any commit: `npm --prefix web/frontend run test:deploy-gate`.
- **The dirt count moved** (92 → 102 rows) because two more lanes have landed since. The
  ablation is unchanged in kind: same artifact, same tree, opposite answers.

---

## 1. Cleanliness refusal — `scripts/deploy-gated.sh`

**The hole (V5-C5).** Every refusal in the chain authenticates a NAME. The build reads the
working tree, and `--commit-dirty=true` told wrangler to stop noticing the difference.

**The ablation** (re-run 2026-08-28). One hand-written conclusion artifact pinning the
current HEAD, one dirty tree (102 rows — this repo, mid-tranche, with three lanes landing),
two gates, `--dry` both:

| gate | verdict | exit |
| --- | --- | --- |
| `git show HEAD:scripts/deploy-gated.sh` (pre-cure) | `[deploy-gated] gate PASSED` — printed the deploy line, `--commit-dirty=true` and all | 0 |
| `scripts/deploy-gated.sh` (cured) | `DEPLOY REFUSED — the tree is not the commit. 102 row(s) of dirt` | 1 |

Same artifact, same tree, opposite answers. The pre-cure gate would have shipped
`web/frontend/src/App.vue` as edited-but-uncommitted under a green sha's licence — and
`web/frontend/dist-w2-before/`, an untracked directory `git status` shrugs at, alongside it.

The pre-cure copy has to be run from inside `scripts/` to reproduce this: the script derives
its repo root from `BASH_SOURCE`, so a copy in `/tmp` reads `/tmp` as the repo and dies on
`not a git repository` before it can be graded.

**The arm's own canary** — `--check-tree`, which runs the cleanliness arms alone and reads
no artifact, touches no network, deploys nothing:

| tree | verdict | exit |
| --- | --- | --- |
| `--check-tree` (this repo, dirty) | `DEPLOY REFUSED … 102 row(s) of dirt` | 1 |
| `--check-tree --repo <clean fixture>` | `tree clean — no tracked modifications, no untracked files under web/frontend web/relay csp-solver` | 0 |

**The fixtures**, no network, no repo touched — four cleanliness arms and seven that walk
the whole chain (row 3):

```
$ scripts/deploy-gated.sh --self-test ; echo $?
[self-test] ok    clean — GREEN
[self-test] ok    tracked-edit — RED
[self-test] ok    untracked-shipped — RED
[self-test] ok    untracked-elsewhere — GREEN
[self-test] cleanliness arms: 4/4 (2 RED on a plant, 2 GREEN on a clean tree)
[self-test] ok    sound-pair — GREEN
[self-test] ok    no-relay-config — RED
[self-test] ok    no-relay-entry — RED
[self-test] ok    no-wrangler — RED
[self-test] ok    no-frontend — RED
[self-test] ok    no-ledger — RED
[self-test] ok    dirty-in-chain — RED
[self-test] pair arms: 7/7 (1 GREEN sound pair, 6 RED on a plant, none deployed)
[self-test] 11/11 — every refusal this script owns proved able to fire
0
```

`untracked-elsewhere` is the scope proof: an untracked file under `docs/` is not dirt,
because it cannot reach the bundle. Under `web/frontend/src/` it is.

**In the chain.** With the same artifact, `--dry` refuses at §7, which means §1–§6 (artifact
present, sha == HEAD, conclusion success, fresh, one run + one attempt, ledger current) all
PASSED and cleanliness is the sole refusal: `exit 1`. `dirty-in-chain` is that same reading
on a fixture, so the ordering is pinned by a test and not only by an observation.

## 2. `deploy:raw` retires; the knip appeasement moves to config

The line lived in `package.json` so knip could see the binary consumed. It was also an
ungated side door: `npm run deploy:raw` shipped `dist/` past every refusal above (V3-C6).
It now lives in `scripts/deploy-gated.sh` and nowhere else.

| act | exit |
| --- | --- |
| `npm run deploy:raw` (the side door) | 1 — `npm error Missing script: "deploy:raw"` |
| `npm run lint:knip` with `ignoreDependencies: ["wrangler"]` | 0 |
| `knip --config <the same file, that row struck>` | 1 — `Unused devDependencies (1) · wrangler  package.json:90:6` |

The middle row is the appeasement genuinely MOVED rather than dropped: knip still grades the
dependency, and the config names `scripts/deploy-gated.sh` as the consumer. `ignoreBinaries`
was tried first and is the wrong knob — it silences the binaries rule and leaves the
devDependency rule red.

Run the ablation with `./node_modules/.bin/knip`, not `npx knip`. The standing global-shadow
trap bit during this re-run from the other end: `npx prettier` and the pinned binary happen
to agree at 3.9.5 today, which makes the habit look safe right up until they don't.

## 3. The relay Worker joins the law

One gated act deploys Pages and the Worker or refuses both. The Worker goes FIRST (a Worker
without its shell is invisible; a shell without its Worker is a refused socket on a live
board), and it is stamped with the sha the gate authenticated:

```
$ scripts/deploy-gated.sh --conclusion-file <artifact> --dry
[deploy-gated]   $ cd web/relay && wrangler deploy --var RELAY_REVISION:<sha>
[deploy-gated]   $ cd web/frontend && npm run build
[deploy-gated]   $ cd web/frontend && wrangler pages deploy dist --project-name=sudoku --branch=master
```

Preflight refuses BOTH on a missing `web/relay/wrangler.toml`, a missing `relay.ts`, a
missing `web/frontend`, or an uninstalled wrangler — before anything is built or uploaded.

**And the preflight arms are graded on their own**, which the first pass did not do. A bare
`rm web/relay/wrangler.toml` in a fixture is a tracked deletion, so §7 answers `1 row(s) of
dirt` and §8 never gets a turn: the canary passes, the arm is untested, and a broken
preflight would have shipped behind a green self-test. The plant has to be COMMITTED — a
clean tree genuinely missing half the pair is the only state in which §8 speaks. All seven
walk the real chain via `--repo <fixture> --dry`, so the refusal that fires is the one the
row names:

| fixture | the refusal that fires | exit |
| --- | --- | --- |
| `sound-pair` | none — prints the Worker line, the build, the Pages line | 0 |
| `no-relay-config` | §8 `no web/relay/wrangler.toml … the pair's second half is missing` | 1 |
| `no-relay-entry` | §8 `no web/relay/relay.ts … the Worker has no entry` | 1 |
| `no-wrangler` | §8 `wrangler is not installed at …` | 1 |
| `no-frontend` | §8 `no web/frontend … nothing to build` | 1 |
| `no-ledger` | §6 `no scripts/ledger-diff.mjs … an arm that cannot run must never pass` | 1 |
| `dirty-in-chain` | §7 `the tree is not the commit` | 1 |

`--dry` is what makes this safe to keep in the tree: it reaches the deploy lines and prints
them. The `wrangler` in each fixture is a shell stub that echoes, and it is never invoked.

**The Worker answers with its revision.** `GET /revision` returns `RELAY_REVISION`;
`wrangler.toml` defaults it to `unknown`, so an ungated `wrangler deploy` is legible as
itself rather than as a gap. Proven in the relay estate (browserless, CI-run):

```
$ cd web/frontend && npx vitest run --root ../relay
Test Files  1 passed (1)
     Tests  24 passed (24)      # 21 before, +3: the stamped sha, `unknown`, and the 426 unbroken
```

**Born RED on the live edge**, since the mechanism is not deployed and this lane deploys
nothing:

```
$ node scripts/edge-probe.mjs --rows relay-revision ; echo $?          # re-read 2026-08-28
RED    relay-revision — GET https://sudoku-relay.mkbabb.workers.dev/revision answered 426 —
       the deployed Worker predates the revision endpoint, so which sha it runs cannot be read
1
```

It goes green at the chair's first gated deploy, and `--expect-sha` then reds a SPLIT pair.

## 4. The rollback recipe replaced — `scripts/rollback-to-seal.sh`

The precept's recipe (`docs/precepts/infra/deploy.md:43-53`) is
`git checkout <sha> -- web/frontend`, which never moves HEAD: the gate would authenticate
HEAD's conclusion and ship the OTHER commit's source. The cure is a scratch worktree whose
HEAD really is the target, built and shipped through the same gate via `--repo`.

All five refusals, `--dry-run`, no worktree created (re-run 2026-08-28):

| plant | refusal | exit |
| --- | --- | --- |
| HEAD's artifact handed to a rollback (the old recipe's own mistake) | `the artifact pins 4dd9ec9c… / the rollback target is c917f9a7…` | 1 |
| `--sha HEAD` | `Rolling back to what is already checked out is a deploy` | 1 |
| no `--conclusion-file` | `the rollback needs the TARGET's CI conclusion` | 1 |
| `--sha 193cb897` — the java branch head, off this history | `not an ancestor of HEAD` | 1 |
| `--sha deadbeef…` — resolves to nothing | `does not resolve to a commit in <repo>` | 1 |
| the sound plan (`--sha HEAD~3` + that sha's artifact) | prints the four commands, creates nothing | 0 |

`git worktree list` is unchanged across all six and no `$TMPDIR/rollback-*` directory
exists afterwards. The sound plan's third printed command is
`deploy-gated.sh --repo <worktree> --conclusion-file <the target's artifact>`, and that
`--repo` arm is the one the gate's own `sound-pair` fixture grades — the rollback and the
deploy walk the same eight refusals, over a different tree.

## 5. The SPA fallback — DECIDED: retired, and stated

**The decision.** The fallback is RETIRED rather than restored, and `_redirects` now says so:
`/*  /404.html  404` in place of `/*  /index.html  200`.

Why retirement is the tree's reality, not a shrug: the app carries no router and mints no
path-shaped link — `?game=`, `?view=`, `?board=` and `?s=` are query strings on `/`, and the
URL grammar touches `searchParams` alone (README:118, W0's measured cut). Only a hand-typed
path ever reaches the rule. Restoring the fallback would have meant renaming `404.html` out
of the slot Pages reserves, and then proving the interaction on the edge — a live behaviour
change, bought with a deploy this lane may not perform and could not verify. Retiring
changes nothing the edge does (measured: `evidence/w5/edge-measurements.txt`); what changes
is that the file stops claiming otherwise, and that the not-found answer is now DECLARED
instead of inherited from a Cloudflare precedence rule nobody wrote down.

The `/assets/*` rule stays first and stays named even though the general rule now says the
same thing for every other path: it carries the 2026-07-15 cache-poisoning cure, and a later
change to the general rule must not quietly take it away.

**The probe** is `scripts/edge-probe.mjs --rows spa-fallback-contract` (a script, not an e2e
spec). It derives the answer from the artifacts, measures the edge, and reds on disagreement
— and reds on the contradiction ALONE, offline, because a `200` rule under a shipped
`404.html` is a lie whatever any particular edge does with it.

All four re-measured 2026-08-28, the plant restored to HEAD's `_redirects` byte-for-byte via
`git show HEAD:` and put back afterwards:

| artifacts | surface | verdict | exit |
| --- | --- | --- | --- |
| HEAD's (`/* /index.html 200` + 404.html) | live edge | RED — `declares a 200 rewrite, and public/404.html ships` | 1 |
| HEAD's | local preview | RED — same sentence | 1 |
| cured (`/* /404.html 404`) | live edge | GREEN — `/ 200 shell · /no-such-path-edge-probe 404 · /kenken 404` | 0 |
| cured | local preview | GREEN — the 404 body is 134 B, the cured asset | 0 |

The two live rows are the born-RED the wave rule asks for: the RED is measured against
production as it stands, not against a fixture, and the GREEN is the same probe over the
same edge once the artifacts stop claiming a fallback that cannot fire.

The local preview is a Pages emulator inside the probe (`--local`), serving
`web/frontend/public` layered over `web/frontend/dist` the way `vite build` layers them, and
resolving requests in the order measured on the live edge: asset, then `/` → index.html, then
the 404 asset, THEN `_redirects`. That order is the whole point — an emulator that resolved
redirects first would let the cure pass locally and fail live, which is the T7 trap
re-enacted in a test harness.

`--self-test` decides the same derivations offline, on fixtures, including the branch this
tranche did NOT take (`a splat with NO 404 asset is a real fallback → 200/true`): 14/14,
exit 0.

## 6. `ledger-diff` corpus law — newest TRACKED tranche

**The plant**: `mkdir docs/tranches/2026-08-tranche-99` — an empty, untracked scaffold, which
is what a formation lane creates on its first day. It happened for real on 2026-08-10
(`evidence/formation/recap-matrix.md:124`, lane note e).

Both resolvers run with the plant in place, same flags
(`--require-ledger --assert-state --verify-cites`), re-run 2026-08-28:

| resolver | with the plant | exit |
| --- | --- | --- |
| `git show HEAD:scripts/ledger-diff.mjs` (pre-cure) | FATAL — `docs/tranches/2026-08-tranche-99 carries none of the audited row-set shapes … A tranche with no row set has nothing to diff` | 2 |
| cured (`git ls-files` decides membership) | GREEN — corpus 14 files, estate 8 tranches, 5 audited rows, `exit 0` | 0 |

The pre-cure exit 2 is not academic: `scripts/deploy-gated.sh` §6 reads it as "the living
ledger is not current" and refuses the deploy. A `mkdir` in `docs/` could stop a release.
That composition has its own fixture now — the gate's `no-ledger` arm proves §6 refuses on a
ledger-diff that cannot answer, rather than degrading to a green.

The pre-cure copy must be run from `scripts/`: like the gate, ledger-diff derives its repo
root from its own path, so a copy elsewhere grades the wrong tree.

Plant removed; `ledger-diff --self-test` and the full
`--require-ledger --assert-state --verify-cites` both exit 0 on the tree.

## 7. B2 PREPARED, not fired

The ballot's firing is a Cloudflare Pages SETTING, and CF was not touched. What lands here is
the probe that grades it and the runbook line that fires it (`runbook.md`).

Born RED on the live edge today, with the browser's own sentence:

```
$ node scripts/edge-probe.mjs --rows console-clean ; echo $?          # re-read 2026-08-28
       script-src 'self' 'wasm-unsafe-eval' · 1 cross-origin script(s) in the served HTML
RED    console-clean — Refused to load the script
       'https://static.cloudflareinsights.com/beacon.min.js/v3d52b47920f24c319d37e2661827c42b1787588026925'
       because it violates the following Content Security Policy directive:
       "script-src 'self' 'wasm-unsafe-eval'".
1
```

The beacon's version token moved between the two readings
(`v4513226cdae…` on 2026-08-25, `v3d52b479…` on 2026-08-28) — Cloudflare rotates it, which
is exactly why the row parses the injected `<script src>` out of the served HTML instead of
matching a literal URL. The refusal is unchanged: the origin is cross-origin and
`script-src` is `'self' 'wasm-unsafe-eval'`.

The row is browserless on purpose. The beacon is injected at the edge for BROWSER-SHAPED
requests only — a plain `curl` gets zero occurrences, a `curl` with an HTML `Accept` and a
Chrome UA gets the script tag — which is how a hard console error survived campaigns of
curl-based verification. Grading the injected origins against the served CSP is the whole of
what a browser does before it refuses, so no browser is needed to decide it.

Both of the ballot's branches are proven in `--self-test`: the shipped CSP refuses the
beacon; adding `https://static.cloudflareinsights.com` to `script-src` admits it; dropping
the injection leaves nothing to refuse.

---

## The battery, at the close (2026-08-28, exit codes read bare)

| act | exit |
| --- | --- |
| `scripts/deploy-gated.sh --self-test` (11 arms) | 0 |
| `node scripts/edge-probe.mjs --self-test` (14 arms, offline) | 0 |
| `node scripts/edge-probe.mjs --local` (the artifacts through a Pages emulator) | 0 |
| `node scripts/edge-probe.mjs` (the live edge, 4 rows) | 1 — 2 RED by design, see below |
| `node scripts/ledger-diff.mjs --require-ledger --assert-state --verify-cites` | 0 |
| `npx vitest run --root ../relay` (the Worker's rows) | 0 — 1 file, 24 tests |
| `npx vitest run` (the unit suite) | 0 — **57 test files, 735 tests** |
| `npm run lint:knip` · `lint:lanes` · `lint:copy` | 0 · 0 · 0 |
| `npm run test:deploy-gate` · `test:edge-probe` (the two new offline arms) | 0 · 0 |
| `shellcheck -S warning` over both shell scripts | 0 |
| prettier over this lane's files | 0 |

The live probe's two REDs are the wave's deliberate residue, and both are cured by acts this
lane may not perform: `relay-revision` by the chair's first gated deploy (the endpoint is not
on the live Worker yet), `console-clean` by B2's firing at WGATE. Neither is a defect in the
mechanism; each is the mechanism reporting a state that is still true.

## Seams this lane could not close

Three claims elsewhere in the repo are now false or stale because of the rows above, and all
three live outside this fence:

1. **`docs/precepts/infra/deploy.md`** — the wave brief says the precept was re-cut at W0. It
   was not, and could not have been: `docs/precepts` is a git SUBMODULE (gitlink
   `8781ebb0`, untouched since 2026-07-12), so it sits outside this repo's tracked walk and
   outside every gate that reads `docs/`. It still documents `--commit-dirty=true`, still
   calls `_redirects` "the `/* /index.html 200` SPA fallback", and its §Rollback is still the
   `git checkout <sha> -- web/frontend` recipe this wave replaced.
2. **`README.md:41`, `:116`, `:118`** — all three describe a live SPA fallback ("two rules
   (/assets/* 404, SPA fallback — inert at the edge)"; "and the SPA fallback"; "the `/*` →
   `/index.html` line is never reached"). The rule they describe no longer exists.
   `check-doc-truth`'s `redirects-rule-count` row does not catch this: it counts rules (still
   2) and polices "only" claims, so the prose can go stale without a gate noticing.
3. **`npm run lint` is RED at HEAD**, on `scripts/check-doc-truth.mjs` and nothing else — a
   7-line divergence at `check-doc-truth.mjs:1770`, present in HEAD's own blob, not
   introduced by any working-tree edit. In the working tree the same file is now ~8,000 lines
   divergent (re-indented to 4 spaces against a 2-space config). Neither is this lane's file.
