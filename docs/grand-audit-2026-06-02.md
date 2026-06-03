# sudoku — constellation grand-audit fold (2026-06-02)

**Repo**: `csp-solver` / sudoku frontend (`web/frontend/`) · **Live**: sudoku.babb.dev · CSC411 coursework, archived. Monolithic git, **no tranche dir** — this is the focused audit doc, not a wave plan.

Consumes the constellation grand-audit ([MASTER-FINDINGS](../../../value.js/docs/tranches/K/audit/visual-evidence-2026-06-02/grand-audit/MASTER-FINDINGS.md) §A sudoku row · §B owner matrix · §E themes 5/7/8). W1 captured `grand-audit/sudoku-prod.png`; no file:line defects were raised that pass — this fold grounds the 5 mandates from code.

Severity: **P0** blocks-mandate · **P1** ship-named / owner-routed · **P2** ship-or-book. Disposition vocabulary mirrors MASTER-FINDINGS: SHIP / KILL / BOOK(trigger+owner).

> **Aesthetic guardrail (binding).** The hand-drawn pencil-boil skin is INTENTIONAL, not a defect — wobbly grid lines, SVG-filter grain/boil, Rough.js vines, hand-glyph digits, the orange-sun mascot, Yoshi's-Story crayon palette. The stack is reka-ui + custom decoratives by design. **Glass-ui adoption here would be CONTRIVED** — there is no glass surface, no aurora, no Configurator, no instrument chassis. Do NOT impose glass-ui primitives on this repo. The ONE cross-cutting glass-ui touchpoint is the shared mascot-skin *ownership* question (§4), and even that is a "does it want a home" question, not a "replace the local one" mandate. Every item below is LIGHT-touch.

---

## §A — Mandate ledger

| # | Mandate | Sev | Evidence (file:line / capture) | Disposition |
|---|---|---|---|---|
| **M1** | **Dep drift: keyframes.js 2.0.0 spec STALE** | P2 | `web/frontend/package.json:13` `@mkbabb/keyframes.js:^2.0.0`; symlink resolves **2.2.0** (`node_modules/@mkbabb/keyframes.js`→`../../../../../../keyframes.js`); `package-lock.json` pins **1.1.0** (3-major stale). Constellation standard is 2.2.0. | **SHIP** — bump spec `^2.0.0`→`^2.2.0`; refresh lock. |
| **M1b** | **Dep drift: value.js ^0.5.0 spec STALE** | P2 | `package.json:15` `@mkbabb/value.js:^0.5.0`; symlink resolves **0.10.0**; lock pins **0.4.0**. Dev runs against 0.10.0, spec+lock describe a fiction. | **SHIP** — bump spec `^0.5.0`→`^0.10.0`; refresh lock. |
| **M2** | **prefers-reduced-motion across the 4 hand-drawn loops** | P2 | grid boil `HandDrawnGrid.vue:33` · celestial `DarkModeToggle.vue:101-107` · dice `DiceIcon.vue:56,69` · glyph `glyphAnimations.ts:23`. See §M2 — coverage is GOOD; one residual. | **SHIP** the residual (reactive teardown); KILL the rest as already-covered. |
| **M3** | **Controls card RIGHT (SIZE/DIFFICULTY)** | — | `App.vue:48-101` board-then-sidebar flex (`app-layout:130`); capture confirms RIGHT. | **KILL** the constellation controls-LEFT reconsideration HERE — see §M3 (hand-drawn paper convention, NOT the Configurator pattern). |
| **M4** | **Shared pencil-boil + orange-sun mascot home** | P2 | `@mkbabb/pencil-boil@0.2.0` (skin lib, real npm pkg); orange-sun `DarkModeToggle.vue:21-34`. Recurs in bbnf/fourier. | **BOOK** — owner = `@mkbabb/pencil-boil`, NOT glass-ui. See §M4. |
| **M5** | **Deploy DNS-tuple `sudoku.babb.dev` + `api.csp-solver.babb.dev` UNVERIFIED** | P1 | README:7 claims `sudoku.babb.dev`; deploy artifacts carry NO `babb.dev` — `docker-compose.prod.yml:9` `CORS_ORIGINS=mbabb.fi.ncsu.edu`, `:46` `VITE_BASE_URL=/csp-solver/`, `scripts/deploy.sh:8` `DEPLOY_PATH=/var/www/csp-solver`, `nginx/sudoku.conf:12` `server_name _`. | **BOOK** → deploy tranche (W6); owner = deploy. See §M5. |

---

## §M1 — Dep drift (SHIP)

Two specs describe a version that hasn't been installed in months; one lockfile is 3 majors behind what runs. The symlinked dev tree (workspace-local `keyframes.js@2.2.0`, `value.js@0.10.0`) is the source of truth — spec + lock are the lie.

| Pkg | `package.json` spec | symlink-installed | `package-lock.json` | Ask |
|---|---|---|---|---|
| `@mkbabb/keyframes.js` | `^2.0.0` | **2.2.0** | **1.1.0** | spec→`^2.2.0`, regen lock |
| `@mkbabb/value.js` | `^0.5.0` | **0.10.0** | **0.4.0** | spec→`^0.10.0`, regen lock |
| `@mkbabb/pencil-boil` | `^0.2.0` | 0.2.0 (real pkg) | 0.2.0 | **in sync** — no ask (but see §M4 for the version-roadmap book) |

**Idiomatic remediation** — `npm i @mkbabb/keyframes.js@^2.2.0 @mkbabb/value.js@^0.10.0` to align spec+lock to the running symlinks. NO code change: keyframes.js draw-in (`glyphAnimations.ts`, `usePathAnimation.ts`) and value.js consumers already exercise the newer APIs via the symlink. This is a manifest-hygiene fix, not a migration. Verify with `npm run build` (vue-tsc green) after.

> Why it matters: a fresh `npm ci` on CI/a new machine installs the LOCK (1.1.0 / 0.4.0), not the symlink — so CI builds against 3-major-old keyframes.js while dev builds against 2.2.0. The drift is a latent CI-vs-dev divergence.

---

## §M2 — prefers-reduced-motion coverage (SHIP residual · KILL covered)

The repo's PRM posture is **strong** — far better than the constellation P0 offenders (bbnf-buddy ZERO PRM across 4 loops; keyframes.js heavy engines ungated; fourier epicycle ungated). The global CSS carve (`index.css:211-216`) collapses every CSS `animation-duration→0.01ms`, and the JS loops route through `pencil-boil/useLineBoil` which gates at the source (`vue.ts:118 if (prefersReducedMotion()) return`) and pauses on tab-hidden (`vue.ts:70-71`).

Per the 4 named loops:

| Loop | Mechanism | PRM gate | Verdict |
|---|---|---|---|
| **Grid boil ~6.7fps** | `useLineBoil` JS frame-counter, `HandDrawnGrid.vue:33-37` | source-gated `pencil-boil/vue.ts:118` (boil never starts under PRM) | **covered** |
| **Glyph draw-in** | stroke-dashoffset via keyframes.js, `glyphAnimations.ts:23` | `if (reducedMotion.value)` → snaps to final, `:64` wiggle returns null | **covered** |
| **Dice tumble** | CSS `diceRoll`/`pipPop` keyframes, `DiceIcon.vue:56,69` | global CSS carve `index.css:211` collapses to 0.01ms | **covered** |
| **Celestial toggle** | `useLineBoil` star/sun/ray boil, `DarkModeToggle.vue:101-107` + CSS `:239-260` | source-gated + scoped CSS `transform:none!important`, `sun-rays/sun-breathe/twinkle-star animation:none` | **covered** |

**Residual (the one real gap)** — `useLineBoil` checks PRM only at `start()` (mount-time, `vue.ts:117-122`); it has no reactive watcher. The app's own `useReducedMotion` (`useReducedMotion.ts:14-16`) DOES listen for `change`, but nothing pipes that into the already-running boil scheduler. A user who flips `prefers-reduced-motion: reduce` ON *mid-session* keeps the grid boil and celestial boil ticking until reload. The CSS carve catches dice (CSS) but not the two `useLineBoil` JS loops.

- **Disposition: SHIP** (P2, owner = `@mkbabb/pencil-boil`, NOT local). The fix belongs at the source: `useLineBoil` should `watchEffect`/`matchMedia('change')` and `stop()` the subscriber when PRM goes true mid-run (symmetric with its existing tab-hidden pause at `vue.ts:70`). This is one composable in the shared skin lib — do NOT hand-roll a local watcher in `HandDrawnGrid.vue`/`DarkModeToggle.vue` (that would re-introduce per-consumer PRM plumbing the lib exists to own). Couples to the M4 pencil-boil version-roadmap book.
- **KILL** any further sudoku-local PRM work — the 4 loops are covered; the residual is a lib concern.

---

## §M3 — Controls card RIGHT (KILL the controls-LEFT reconsideration)

Layout (`App.vue:48-101`): `.app-layout` is a plain `display:flex; align-items:flex-start; gap:2rem` (`:130-134`) with the board first in DOM and the desktop ControlPanel sidebar second → **board LEFT, controls RIGHT** on `md:` (`:84 hidden md:flex`), stacked board-then-controls on mobile (`:142-147 flex-direction:column`). Confirmed by `sudoku-prod.png` (SIZE 4×4/9×9/16×16 + DIFFICULTY Easy/Medium/Hard with the `crayon-green` accent `ControlPanel.vue:61`).

The constellation's controls-side reconsideration is the glass-ui **Configurator `asideSide` keystone** (MASTER-FINDINGS §E.1) — it resolves fourier (RIGHT→LEFT mandate), muster, speedtest, value.js, all of which run a `<Configurator>` with a hardcoded stage-left/aside-right grid. **sudoku is not in that family** — it has no Configurator, no `:deep` grid override to delete, no aside-track token. The controls card here is a hand-drawn paper "answer key" pinned to the right of the puzzle — the right-side placement IS the paper convention (puzzle on the left, the SIZE/DIFFICULTY scratch-notes on the right margin, mascot sun in the top-right corner). Moving it left would fight the aesthetic, not serve it.

- **Disposition: KILL** — sudoku does NOT join the controls-LEFT reconsideration. The hand-drawn skin makes it deliberately different; record it as exempt so it isn't re-raised each tranche. (Mobile already stacks controls below the board, `App.vue:65-82` — the responsive answer is vertical, not a side-flip.)

---

## §M4 — Shared pencil-boil + orange-sun mascot (BOOK → @mkbabb/pencil-boil)

The skin already HAS a shared home for its primitives: `@mkbabb/pencil-boil@0.2.0` (real npm pkg, not a symlink) owns `mulberry32`, wobble-path generation, celestial-wobble helpers, and `useLineBoil` (`ANIMATION.md` "Generic boil primitives … are imported from @mkbabb/pencil-boil"). sudoku consumes them in `HandDrawnGrid.vue:3`, `DarkModeToggle.vue:95`. What is NOT shared:

1. **The orange-sun mascot itself** — `DarkModeToggle.vue:16-34` hand-authors the sun (disc `#F09855`, golden Yoshi's-Story spiral `#F0B030`, rays `#E88845`/`#D16A32`) inline as SVG. The same orange-sun + pencil-boil skin recurs in fourier and bbnf-buddy (MASTER-FINDINGS §B row "Mascot / monogram-pose primitive"; §E.7).

**The owner question.** MASTER-FINDINGS §B/§C floats a **glass-ui** mascot/monogram-pose primitive over the glyph-face family (net-new, serial after bbnf 2.0→3.1.1 bump). **For sudoku, glass-ui is the WRONG owner.** sudoku does not depend on glass-ui at all (`package.json` — no `@mkbabb/glass-ui`), and pulling glass-ui in *just* for a mascot would violate the aesthetic guardrail (it would drag the whole glass design system into a paper-and-pencil app). The shared *skin* (boil primitives + the sun's procedural ray/spiral generation) already lives in **`@mkbabb/pencil-boil`** — that is the natural home for the orange-sun mascot too:

- **Disposition: BOOK** — the orange-sun mascot + pencil-boil skin home = **`@mkbabb/pencil-boil`**, NOT glass-ui. **Trigger**: a 2nd real consumer wanting the sun (fourier or bbnf already share the boil; if either also wants the *sun glyph*, that's the ≥2-consumer gate). **Owner**: pencil-boil maintainer. **Asks** (when triggered): (a) lift the sun's procedural ray/spiral/sparkle generator from `DarkModeToggle.vue:16-34` into a `pencil-boil` `useCelestialSun`/`<PencilSun>` export beside the existing `generateSunRays`/`wobbleDiamond`/`wobbleStarPolygon` (already exported, `DarkModeToggle.vue:95`); (b) ship the M2 reactive-PRM-teardown fix in the same release; (c) **publish a version roadmap** — pencil-boil is at 0.2.0 while keyframes.js/value.js moved to 2.2.0/0.10.0; the skin lib is the laggard. Until triggered, the inline sun STAYS — it is not contrived locally, it is one app's expression of a shared skin.
- **For the glass-ui owner matrix**: record that sudoku's mascot routes to **pencil-boil, not glass-ui** — so the glass-ui mascot primitive (§C) lists bbnf/fourier as consumers but sudoku as a *pencil-boil-native* sibling, not a glass-ui adopter. This narrows the glass-ui ask.

---

## §M5 — Deploy: DNS-tuple verification (BOOK → deploy tranche)

The README advertises `sudoku.babb.dev` (`README.md:7`) and the deploy dossier (MASTER-FINDINGS §A deploy / §E.8) flagged the `sudoku.babb.dev` + `api.csp-solver.babb.dev` DNS tuple **UNVERIFIED**. Grounding from the repo confirms the gap: **no deploy artifact references either babb.dev hostname.**

| Artifact | What it actually says | Expected (per README/dossier) |
|---|---|---|
| `docker-compose.prod.yml:9` | `CORS_ORIGINS=${CORS_ORIGINS:-https://mbabb.fi.ncsu.edu}` | should allow `https://sudoku.babb.dev` |
| `docker-compose.prod.yml:46` | `VITE_BASE_URL=${VITE_BASE_URL:-/csp-solver/}` | apex-host serve → `/` (sudoku.babb.dev), not a sub-path |
| `scripts/deploy.sh:8` | `DEPLOY_PATH=/var/www/csp-solver` | NCSU-host path, not a babb.dev render-hook target |
| `web/nginx/sudoku.conf:12` | `server_name _` (catch-all); `/api/`→`backend:8000` same-host | no `api.csp-solver.babb.dev` vhost; the API is same-origin `/api/`, not a separate `api.` host |

Two distinct issues surface: (1) the defaults are tuned for the legacy **`mbabb.fi.ncsu.edu/csp-solver/`** NCSU deployment, and the babb.dev tuple is supplied (if at all) only via uncommitted env overrides — so the DNS tuple is **un-versioned and un-verifiable from the repo**; (2) the nginx config treats the API as a same-origin `/api/` path, which **contradicts** the dossier's separate `api.csp-solver.babb.dev` host — either the dossier expects a split-host topology the repo doesn't implement, or `api.csp-solver.babb.dev` is a CNAME that lands on the same nginx and the split is cosmetic.

- **Disposition: BOOK** → **deploy tranche (W6)**, owner = deploy (MASTER-FINDINGS §B "CSP/security-header + dev.sh/deploy standard"). **Trigger**: the deploy tranche's DNS-tuple verification pass. **Asks**: (a) verify `sudoku.babb.dev` A/CNAME + `api.csp-solver.babb.dev` A/CNAME resolve and TLS-terminate (the `cf/dns-cf-sync.sh` check named in the dossier); (b) **reconcile the topology** — decide whether `api.csp-solver.babb.dev` is a real split host (needs an nginx `server_name api.csp-solver.babb.dev` vhost + the frontend pointing `VITE_API_URL` at it + CORS allowing it) or a same-origin alias (then drop it from the advertised tuple and keep `/api/`); (c) commit the babb.dev `CORS_ORIGINS`/`VITE_BASE_URL` as the prod default (or a checked-in `.env.prod`) so the tuple is version-controlled, not ambient. sudoku also inherits the constellation deploy standard (CSP/security headers — sudoku has none today; `nginx/sudoku.conf` ships gzip but no CSP/HSTS/X-Frame).

> Not blocking this pass — sudoku is archived coursework; the deploy reconciliation is owned by the deploy tranche, and this fold hands it the grounded artifact list.

---

## §B — Disposition summary

| Item | Sev | Disposition | Owner / trigger |
|---|---|---|---|
| M1 keyframes.js spec→2.2.0 + lock | P2 | **SHIP** | sudoku (manifest hygiene) |
| M1b value.js spec→0.10.0 + lock | P2 | **SHIP** | sudoku (manifest hygiene) |
| M2 boil reactive-PRM-teardown | P2 | **SHIP** | `@mkbabb/pencil-boil` (lib fix, w/ M4) |
| M2 the 4 loops (already gated) | — | **KILL** (covered) | — |
| M3 controls-LEFT reconsideration | — | **KILL** (hand-drawn exempt) | — |
| M4 orange-sun mascot home | P2 | **BOOK** → `@mkbabb/pencil-boil` (NOT glass-ui) | pencil-boil maintainer / 2nd sun consumer |
| M4b pencil-boil version roadmap (0.2.0 laggard) | P2 | **BOOK** | pencil-boil maintainer |
| M5 babb.dev DNS-tuple verify + topology reconcile | P1 | **BOOK** → deploy W6 | deploy / DNS-tuple pass |
| M5b sudoku CSP/security headers (none today) | P2 | **BOOK** → deploy W6 | deploy (constellation standard) |

**Net glass-ui adoption asks from sudoku: ZERO.** The repo is glass-ui-free by design and stays that way. The only shared-primitive movement routes to `@mkbabb/pencil-boil` (M2 + M4), the only cross-repo ask is the deploy DNS-tuple (M5). The hand-drawn pencil-boil aesthetic is preserved untouched.
