# r2-gaps-sweep — the uncovered ground (2026-07-12)

Lane charter: hunt what NO r1 lens touched. NEW findings only. Every claim anchored, every probe rerunnable.
Subject HEAD 65425697 on master. Repo root = /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion.

r1 coverage cross-check (skimmed all 20 r1 reports + registry FAM-1..12): none touched error/failure UX, worker
crash recovery, share-URL rejection UX, meta/OG/social tags, font-license truth, the Yoshi mark, the branch/tag
estate census, or the wrangler deploy-as-code contract. All findings below are net-new.

---

## G1 [P2] Solver worker never re-instantiated after a crash — the singleton poisons for the session
family_hint: worker-no-respawn

`ensureWorker()` caches a module-singleton `worker` and, on a worker-level `error`, rejects every in-flight
promise but **never nulls `worker`** — so no fresh worker is ever spun up.
- sudoku: web/frontend/src/games/sudoku/solver/useSolver.ts:63-83 (error handler 73-81, no `worker = null`)
- futoshiki: web/frontend/src/games/futoshiki/solver/useSolver.ts:44-64 (identical; symmetric)
- `call()` (sudoku useSolver.ts:115-119) registers the promise in `pending` and `postMessage`s with **no
  per-call timeout**. The header comment (useSolver.ts:7-8) explicitly asserts "the worker's own promise
  rejection is the only 'timeout' signal this composable needs."

Failure scenario: a wasm-instantiate failure (the exact case the comment on line 74 names) or any fatal worker
error fires the `error` handler once, draining `pending`. `worker` stays non-null. The next Generate/Solve calls
`ensureWorker()` → returns the **same crashed worker** → `postMessage` to it → if the worker is dead, no message
ever comes back, and with no timeout the promise **hangs forever**. The solver is bricked until a full page
reload. Recovery path (drop the worker, re-create on next call) does not exist. Both games identically affected —
parity holds on the *defect*.
Probe: read the two files; the absence of `worker = null` on the error branch and the absence of any
`setTimeout`/`AbortController` in `call()` is the whole proof (grep in probe file).

## G2 [P2] Share-centric app ships zero social/OG/meta — the permalink unfurls bare and sudoku-only
family_hint: meta-social-absent

The product's headline feature is shareable `?board=` permalinks (useUrlState.ts:74-88, writeBoardToUrl:220-224;
SudokuGame.vue:64 / FutoshikiGame.vue:63 copy the URL to clipboard on Share). Yet `web/frontend/index.html`
carries **only** charset, viewport, `<title>`, and one favicon link (index.html:1-14). Grep for
`og:|twitter:|theme-color|name="description"|apple-touch` across all of web/frontend returns **nothing**.
Consequences:
- A shared link previews with no description, no image, no card — just the static title.
- The static title is `Sudoku - CSP Solver` (index.html:6, ASCII hyphen). Runtime `document.title` is set to
  ``${g} — CSP Solver`` (App.vue:50, em-dash) but a link unfurler / crawler reads the **pre-JS** static title, so
  every shared link — including `?game=futoshiki` deep-links — unfurls as **"Sudoku"**, never Futoshiki, and with
  the wrong dash. Truth + parity gap in one.
- No `<meta name="theme-color">` (mobile browser chrome un-themed); no `apple-touch-icon`.
Probe: `grep -riE 'og:|twitter:|theme-color|name="description"' web/frontend/index.html` → empty; index.html:6 vs App.vue:50 dash mismatch.

## G3 [P2] The in-repo deploy doc describes a DIFFERENT project's infra; this app's deploy contract is documented nowhere
family_hint: deploy-doc-mismatch

Actual deploy (web/frontend/package.json:17):
`"deploy": "npm run build && wrangler pages deploy dist --project-name=sudoku --branch=master --commit-dirty=true"`
— a Cloudflare Pages static push. No preview-deploy script, no rollback script; `--commit-dirty=true` **publishes
the working tree even when it diverges from the committed SHA** (whatever is on disk ships, not what's in git).
The only deploy doc in the repo, `docs/precepts/infra/deploy.md`, describes the *fourier-analysis* project: an
EC2 `adnanh/webhook` receiver, HMAC-signed push events, a docker-compose stack, `/api/health` gating, and an
on-host `deploy-hook.sh` rollback (deploy.md:1-38). None of that exists for this Cloudflare-Pages SPA (`_redirects`
confirms "there is no API origin", public/_redirects:1-9). An operator reading the repo's deploy doc gets the wrong
infra entirely. The real contract (push master → CI green → manual `npm run deploy`) lives only in agent memory
("deploy ONLY via npm run deploy"), not in any product doc.
Probe: `grep -rn 'wrangler\|npm run deploy' --include='*.md' . | grep -v tranches` → only the mismatched precept + LESSONS-LEARNED.

## G4 [P2] Branch estate rot — 44 merged orphan `worktree-*` branches never pruned
family_hint: branch-estate-rot

`git branch` lists **50** local branches. `git worktree list` shows only `master` — every `worktree-wf_*` /
`worktree-agent-*` branch is an orphan (its worktree was removed, the branch left behind). **44 of them are already
merged into master** (`git branch --merged master | grep worktree | wc -l` → 44), i.e. pure dead weight; the oldest
dates to 2026-06-03 (`worktree-wf_34cf008e-c2c-1`). Only 5 branches are unmerged: `java` (the 2021 relic the owner
overruled deletion on — stays), `spike/iai-callgrind`, `pass3-composition`, and two stray worktrees
(`worktree-wf_34cf008e-c2c-17`, `worktree-wf_977ec162-15b-2`). None of the worktree branches are on origin (origin
carries only `java`, `master`, `spike/iai-callgrind`). Local-only estate hygiene, but 44 orphans is a census smell.
Probe: `git branch --merged master | grep -c worktree` → 44; `git worktree list` → master only.

## G5 [P2] Release tags stall at v0.2.0 — published 0.3.0 / core 0.4.0 carry no tag; `pre-morph-excision` is a dup
family_hint: release-tag-lapse

`git tag` yields exactly two: `v0.2.0` and `pre-morph-excision`, **both pointing at the same commit**
`4568dc7` (2026-07-06, "csp-solver 0.2.0"). Per the registry/memory, csp-solver is **published at 0.3.0** on
crates.io and core **0.4.0** is cut-but-unpublished — neither has a git tag. So the tag ledger lies by omission:
the tree's shipped version outruns its newest tag by two minor releases. `pre-morph-excision` still marks a real
historical point but is byte-identical to `v0.2.0`, so as a distinct marker it is redundant (its only job now is a
mnemonic alias for the same SHA). Release-tagging discipline lapsed after 0.2.0.
Probe: `git tag` → 2 tags; `git rev-list -n1 v0.2.0` == `git rev-list -n1 pre-morph-excision` == 4568dc7.

## G6 [P3] OFL fonts self-hosted with no license text — SIL OFL 1.1 requires it to accompany the files
family_hint: font-license-missing

Three self-hosted subsets ship in `dist/`: `fraunces-subset.woff2`, `firacode-subset.woff2`,
`patrickhand-subset.woff2` (web/frontend/src/assets/fonts/, wired at index.css:39-63). Fraunces, Fira Code, and
Patrick Hand are all SIL OFL 1.1 — whose license text (and Reserved Font Name notice) must accompany the font in
any distribution. Grep for `SIL Open Font|OFL|Reserved Font Name` across all of web/frontend (incl. dist) hits only
`package-lock.json` and two unrelated `useSolver.ts` substring false-positives — **no OFL.txt anywhere**. The
bundled woff2 travel without their license. (The de-CDN'ing that motivated self-hosting — index.html:7-11 — is what
created this obligation.)
Probe: `grep -rli 'SIL Open Font\|Reserved Font Name' web/frontend | grep -v node_modules` → empty.

## G7 [P3] "Yoshi's Story" (Nintendo mark) named as the aesthetic basis throughout source + docs, no disclaimer
family_hint: trademark-in-source

The palette identifier is literally `YOSHI_COLORS` (pencilConfig.ts:15-17), and "Yoshi's Story" is named as the
design source in code comments and product docs: CrayonHeart.vue:5 ("Yoshi's Story in OUR pencil grammar"),
DarkModeToggle.vue:55/419/583 ("Golden spiral — Yoshi's Story style", "the Yoshi beats"),
docs/tranches/2026-07-grand-uplift/README.md:74 and docs/tranches/grand-audit-2026-06-02.md:9
("Yoshi's-Story crayon palette", stated as a *non-negotiable aesthetic mandate*). This is a public, MIT-licensed
repo (origin github.com/mkbabb/csp-solver) naming a Nintendo IP as its basis with no nominative-use disclaimer.
Shipped-artifact mark risk is low (identifiers minify, comments strip in prod), but the **public source** is where
the exposure sits. Note also: the user-facing AttributionCard (AttributionCard.vue) credits neither the fonts nor
the Yoshi inspiration — so what's private-in-source is the only "attribution" that exists, and it names a mark.
Probe: `grep -rniE 'yoshi' web/frontend/src docs README.md | grep -v node_modules`.

## G8 [P3] AttributionCard user copy is sudoku-only, and it makes the app's sole third-party network hit
family_hint: attribution-parity-leak

Two sub-issues in the one component (AttributionCard.vue):
- Copy parity: the card's tagline reads "CSP-powered Sudoku solver" (AttributionCard.vue:65) — sudoku-only, though
  Futoshiki is a first-class game. Same sudoku-only framing as the static title (G2).
- The avatar `<img src="https://avatars.githubusercontent.com/u/2848617?v=4&s=64">` (AttributionCard.vue:41) is
  the **only external network request in the app** — every font was de-CDN'd (index.html:7-11) and there is no API
  origin, yet this GitHub-CDN hit remains (gated behind card-open; `referrerpolicy="no-referrer"`, but the visitor
  IP still reaches GitHub). A self-hosted avatar would honor the same self-hosted posture the fonts were moved for.
Probe: `grep -n 'avatars.githubusercontent\|Sudoku solver' web/frontend/src/pencil/chrome/AttributionCard/AttributionCard.vue`.

## G9 [P3] No telemetry/analytics anywhere — clean by design, but the intent is undocumented
family_hint: observability-undeclared

Grep for `analytics|telemetry|gtag|sentry|posthog|plausible|mixpanel|umami|beacon(` across web/frontend/src and
csp-solver/src returns **zero** real hits (the two `plausible` matches are the English word in useControlsDrawer.ts
comments). The app collects nothing — privacy-clean and consistent with the no-server, in-browser-solve posture.
This is a *positive* to bank, but it's nowhere stated as intentional; a future contributor has no signal that
"no analytics" is a decision rather than an omission. A one-line note (README or a PRIVACY marker) would seal it.
Probe: `grep -rniE 'analytics|telemetry|gtag|sentry|posthog|beacon\(' web/frontend/src csp-solver/src | grep -v node_modules`.

## G10 [P3] Corrupt share-link degrades silently — no signal the friend's puzzle failed to load
family_hint: share-fail-silent

`decodeBoardParam` fails **closed** on every malformed/oversized/size-mismatched `?board=` blob — returns null and
the app quietly falls through to the size/difficulty (or fresh) path (useUrlState.ts:93-142, 144-208). Security-wise
this is correct and deliberate (the DoS bound at :101-102, canonical-size guard at :112-116 are good). But the UX
truth: a user who opens a truncated or corrupted shared link sees a **generic default board with no indication** the
shared puzzle failed to decode — indistinguishable from a fresh visit. For a share-centric product a soft "this
link looks broken" toast would close the gap. Both games share the fail-closed codec (parity holds).
Probe: load `?board=zzzz` → app boots a default board, no error surfaced (decodeBoardParam returns null at :106-107).

---

## Parity ledger (futoshiki vs sudoku — spot-audit of W13 surfaces)
Symmetric (both present, at parity): worker error handling (G1, both broken identically), `solveState==='error'`
PaperNote + retry (SudokuBoard.vue:464/642-645 ≡ FutoshikiBoard.vue:410/590-592), `solve-failure` class
(SudokuBoard.vue:177 ≡ FutoshikiBoard.vue:109), "not quite — no solution from here" copy
(SudokuBoard.vue:373 ≡ FutoshikiBoard.vue:351), fail-closed URL codec (G10), MAX_BOARD_PARAM_LEN DoS bound.
Asymmetric / sudoku-biased: static `<title>` (G2), AttributionCard tagline (G8) — both name only Sudoku.
No W13-surface asymmetry found where one game got a feature the other lacks; the asymmetries are copy/meta only.

## Not-a-finding (checked, clean)
- Worker error UX exists and is at parity (both games render an error PaperNote with retry) — the *recovery* is
  what's broken (G1), not the *surfacing*.
- No dangling root package.json license issue: there is no root package.json (deploy unit is web/frontend, license MIT).
