# T9-W5 §5.3 — THE DIST LANE

The estate had seventeen lanes and none of them built the product. Everything upstream
of the bundle was gated hard — types, lint, boundaries, knip, unit counts, coverage,
wasm bytes, instruction counts, deal latency — and the bundle itself was ungoverned.
This lane is the eighteenth job, and it is the first one in the file that runs
`vite build`.

Transcript of record: `dist-lane-canaries.txt` (every exit code in it read BARE, no
pipe anywhere near a verdict). Measured 2026-08-28 on darwin arm64, node v26.0.0,
npm 11.12.1, at `4dd9ec9c` plus this lane's edits.

## 1 · What landed

`.github/workflows/ci.yml` job `dist` — 14 steps, `needs: [build-lean-wasm]`,
browserless in the strict O-12 sense (no browser bundle installed, no Playwright
executed; a bundler, one `fetch`, and node reading bytes off a disk).

| step | subject | what it would catch |
| --- | --- | --- |
| `dist-identity --self-test` | the instrument | six arms, both colours, a real socket on 4247 |
| `golden-bytes` | `e2e/goldens` | per-image cap, estate band, decode, pairing, count pin, wiped estate |
| `npx vite build` | the tree | a build that does not build |
| `dist-identity --dist dist` | the artifact on disk | a husk; a stale second entry chunk |
| `prod-shake -- dist` | the artifact's contents | five dev-only symbols leaked past their fence |
| `dist-identity --served` | the artifact as SERVED | PRECEPTS §3's tree-blind trap, on a live socket |
| NEGATIVE CONTROL | **the census itself** | the FORBIDDEN list gone vacuous |
| `deploy-gate` self-test | §5.1's refusals | the deploy gate stopping to refuse anything |

Three scripts lost their `NOT-A-LANE:` declarations in the same commit as the steps
that void them — `check-prod-shake.mjs` and `check-golden-bytes.mjs` were the two
(`dist-identity.mjs` never carried one; it is a helper, deliberately outside
`check-lane-membership.mjs`'s corpus forms). V5-C3's adjustment is the reason the note
in each file says what it says: those carve-outs were **deliberate**, dated and cited,
written by a hand that had just been ordered to take the browser lanes out and would not
pretend the orphaned guards were still enforcing. Deliberate and wrong are not exclusive.
The cure for a carve-out note is never a better note; it is the lane, and then the note
dies. `check-lane-membership.mjs` check 2 is the mechanism that keeps this honest in
both directions: a file claiming NOT-A-LANE while a lane runs it is a RED.

`check-pw-projects.mjs` and `check-pw-retries.mjs` keep theirs. They police Playwright's
project matrix and retry policy, which is the browser estate's own configuration; §5.2's
floors lane restamped the first and left it a local instrument, and nothing in §5.3
voids either declaration.

## 2 · A6 — the cite that pointed at a check which never looked

`rasterPose.ts:187` has said this since T7-W3, about `__bakeAdmission`:

> Proof: `npm run test:prod-shake` discipline, re-run per build

`FORBIDDEN` did not contain the symbol. The cite named a gate; the gate was not looking.
That is the whole of A6, and it is a species this campaign keeps finding: not a missing
gate, a gate whose stated subject and actual subject had drifted apart with a cite
holding the door open.

Reproduced rather than asserted (transcript §1a–1b): `npx vite build --mode ch62-probe`
produces a bundle that carries `__bakeAdmission` by construction — the instrument's fence
is `import.meta.env.DEV || MODE === "ch62-probe" || MODE === "ch62-ablate"`, and the mode
match keeps the live arm. HEAD's four-symbol census **passes that bundle, exit 0**. The
five-symbol census fails it, exit 1, naming the symbol and its chunk. The shipped bundle
is clean either way — 25 chunks, exit 0 — which is precisely why nobody noticed.

The symbol qualifies on the rule the file already states for adding one: it must be
something minification is *obliged* to keep. `window.__bakeAdmission ??= …` is a property
written on `window`; renaming it would break the read. That is the same argument that put
`__schedulerDebug` in the list and kept `schedulerDebugInfo` out.

## 3 · The negative control is a STEP, not a story

The canary law asks each gate to prove it can fail. This lane does better than a
one-time proof in a commit message: the failure proof is a step that runs on every push.
The lane builds the ch62-probe bundle and asserts `prod-shake` **reds** on it. If that
ever passes — a renamed symbol, a changed fence, a minifier that started eating the
string — the lane says so in those words and fails, rather than printing a green nobody
can distinguish from a working gate.

The step body was itself canaried (transcript §1e): run against HEAD's vacuous
four-symbol census, the step exits 1. The control controls.

This is the `tdz-probe.mjs` pattern — its reproduction arm runs on every invocation, not
only under `--self-test` — applied to the artifact.

## 4 · One arm is narrower in CI than at a bench, and the lane says so

`golden-bytes` check 3 hunts FOSSILS: auto-written baselines under `e2e/` outside
`e2e/goldens/`. `.gitignore:53` is a blanket `*.png` and the eight goldens are
force-added, so a runner's checkout contains no untracked PNG **by construction** and the
arm cannot fire on the mechanism that mints them (a Playwright run auto-writing a
baseline). What it polices in CI is a force-added stray — the only route a fossil takes
into a checkout. The other seven checks are fully live there.

That is not a guess. The bench tree at this wave carried eight fossils —
`e2e/visual-golden.spec.ts-snapshots/`, 49.1 KB, file mtimes 2026-08-28 10:38–10:40,
minted by a concurrent lane's golden run — and the gate red on them at the bench
(transcript §3g: estate total 145,034 B over a 112,640 B band, plus the fossil row).
The same gate over a tracked-only tree, built with `git archive HEAD`, is green
(§3a, §3f). Both readings are in the transcript. The fossils are gitignored, untracked,
and belong to another lane's run; they are not this lane's to delete, and they are named
in §8 below.

The five planted defects that DO fire in a checkout: a ninth golden (count pin), a
golden past the 150 KB per-image ceiling (which trips the estate band with it), a
force-added fossil, a wiped estate that specs still assert, and — the green control
either side of all four — the tracked tree itself.

## 5 · What this replaces in `ch62-probe.yml`

`ch62-probe.yml` is **not touched here**. W6 executes its kill; this lane only names what
of it survives elsewhere.

Its one function that outlives its verdict is the pair of steps at
`ch62-probe.yml:186–203`: the `NODE_ENV=production npx vite build --mode <arm>` and the
"Vacuity guard — the instrument is IN this bundle" grep for `__bakeAdmission`. Both live
in the standing workflow now, on every push, with the polarity a shipped bundle needs
(absent) plus the probe's own polarity kept as the control (present). The remainder of
that file — twelve dispatch-only matrix arms, browser installs, a quarantine stub, and a
verdict job for a chronic that is RETIRED — is W6's to delete, and nothing in `ci.yml`
depends on it.

## 6 · The floors handoff, executed

§5.2 closed the unit-floor provenance split two-thirds and booked the remainder against
`ci.yml`, which sat outside that lane's fence. It is inside this one, and it is done.

Two comment sites carried dead figures that nothing executable read — a lying comment
rather than a second enforcement path, which is still exactly the shape the audit found
three of:

- the lane-map header's `12. FE unit estate` row said `>=300 executed count floor`;
- the `fe-unit` step comment said `300 was ~10% under 332 at the T5-W1 wave base; live is
  477 today, so the floor carries 59% of slack`.

Floor is 661 and live is 735. Neither line now carries a number: both point at
`web/frontend/scripts/census.stamp.json`, which the gate reads and the WGATE restamps,
and each says in plain words that it used to be the third home of a split. A figure about
that gate belongs in one file, dated, with the census it was cut from.

## 7 · Verification

Every exit code read bare.

| | |
| --- | --- |
| `yamllint` over `ci.yml` (relaxed line-length/indent) | 0 |
| YAML parse + structural walk (runs-on, steps, dangling `needs:`) | 18 jobs, 0 defects |
| `dist` job shape | `needs: [build-lean-wasm]`, 14 steps |
| full lane rehearsal, step bodies verbatim | 7/7 arms as expected |
| `npx vitest run` | 57 files / 735 tests passed, exit 0 |
| `npm run lint:lanes` (lane-membership, self-tested) | 0 |
| `npm run lint:eslint` | 0 |
| `npm run lint:knip` | 0 |
| `npm run lint:copy` (M16) | 0 |
| `prettier --check` over this lane's three scripts | 0 |
| `npm run test:deploy-gate` | 0 (11/11 arms) |

`actionlint` is not installed on this host. Said rather than claimed: the workflow is
proven whole by a YAML parse, a structural walk over every job and step, and yamllint —
not by actionlint.

`check-doc-truth.mjs` moves from 2 RED to 3 RED, and the third is this lane's, by design
— see §8.

## 8 · Handoffs

1. **`README.md:112` — "seventeen lanes" → "eighteen"** (BLOCKING doc-truth). The
   `ci-lane-count` row re-derives from the workflow's job keys and now demands
   `eighteen (18)`. `README.md:124` carries "the seventeen CI lanes install no browser
   bundle" in prose the regex does not reach; it is the same word and the same fact, and
   the browserless claim stays true — this lane installs no browser bundle. README is not
   this lane's fence. The other two REDs (`root-readme-e2e-counts`,
   `e2e-total-arithmetic`, both at `README.md:96`/`:99`) predate this lane and belong to
   the concurrent viewport wave's spec landing; they were RED at entry.
2. **`scripts/check-doc-truth.mjs` is prettier-nonconformant** — `npm run lint` reds on
   that one file and nothing else in `src/`, `scripts/`, `../../scripts/`. It is the
   doc-truth lane's file. `npx prettier --write --config web/frontend/.prettierrc.json
   scripts/check-doc-truth.mjs` is the whole of it.
3. **`scripts/edge-probe.mjs`'s offline `--self-test` is CI-eligible and NOT wired.**
   The W5 runbook names it and `test:deploy-gate` together as this lane's to wire; the
   second is wired, the first is not, because `edge-probe.mjs:4` carries a one-line
   `NOT-A-LANE:` declaration whose reason is the LIVE arm ("it reads the LIVE deploy over
   the network"). A lane may not name a file that declares itself laneless. The seam:
   re-cut that header to separate the live-edge arm from the offline `--self-test` arm,
   then add one step beside the deploy-gate step. 14 arms, offline, ~1s. Not this lane's
   file.
4. **Eight fossil PNGs on the bench** — `web/frontend/e2e/visual-golden.spec.ts-snapshots/`,
   49.1 KB, minted 2026-08-28 10:38–10:40 by a concurrent lane's Playwright golden run.
   Gitignored and untracked, so CI never sees them and this lane is green there; at a
   bench `npm run test:golden:bytes` reds until they are removed. `rm -rf` is the cure the
   gate itself prescribes. Left in place: another lane's run may still be reading them.
5. **`check-pw-projects.mjs` is a restamped count floor that no lane executes.** §5.2 cut
   its floors against a live census and left it a local instrument under its O-12
   declaration. It parses config and spec files and needs no browser binary to do it, so
   it is a candidate for this lane's next step — but it is the floors lane's file and its
   declaration is theirs to retire, not this lane's to contradict.
6. **Two ordinals are stale, and both are outside this fence.** `gates.json`'s `distLane`
   key and `waves/T9-W5-gates.md` §5.3 both call this "a seventeenth CI lane". They were
   written when the workflow carried sixteen jobs; T9-W4 landed `gen-latency` as the
   seventeenth, so this one is the **eighteenth job**, numbered **lane 20** in the
   workflow's own map (the map's numbering has never been the job count — the `rust` job
   carries lanes 2 and 3, and lanes 9 and 14 died with the browser estate). Nothing about
   the substance moves. The count that a gate reads — doc-truth's `ci-lane-count`,
   derived from the job keys — says 18.
