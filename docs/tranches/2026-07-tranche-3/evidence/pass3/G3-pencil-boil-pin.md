# PASS 3 — LANE G3: pencil-boil sibling pin + the `#storybook-texture` consumer contradiction

**Charter:** synthesis §4 open-question 14 + §2.4 A24-G3 row + A24 §G3 (`a24-completeness.md:53-67`,
`:241`). Two halves: (1) the pencil-boil sibling-repo relationship / version-pin posture — pin the
built-against rev, confirm the M4 sun-glyph supply side, record F6-decision durability across a
version bump; (2) settle the F4-vs-F7 `#storybook-texture` consumer contradiction with one grep.
Read-only; every claim below is command-cited.

---

## PART 1 — `#storybook-texture`: SETTLED. F4 is right, F7 is wrong. EXCISE.

The contradiction (§2.1 row "F4's `#storybook-texture` dead filter def", ADOPT-verify-then-kill):
F4 greps zero consumers and calls it dead; F7 §1.5 calls it "celestial-used." One grep settles it —
run three ways, all conclusive.

**Definition (single site):**
`web/frontend/src/pencil/chrome/SvgFilters.vue:164`
`<filter id="storybook-texture" …>` — a fractalNoise displacement filter, sitting in the
"Non-preset filters" block (comment "for organic moon/star rendering"). It is **not** in
`FILTER_PRESETS`, so `dev/FilterTuner.vue` (which iterates `Object.keys(FILTER_PRESETS)`,
`FilterTuner.vue:14,18`) never touches it either.

**Consumers — the complete `url(#…)` inventory of `src/`:**
`grep -rhno "url(#[a-z-]*)" src/` returns exactly: `grain-static`, `wobble-heart`,
`wobble-celestial`, `sparkle-rainbow`, `stroke-light`, `stroke-dark`, `wobble-logo`.
**`storybook-texture` appears in NONE of them.** No dynamic/computed reference either
(`grep -rin "storybooktexture\|storybook_texture\|'storybook'\|\"storybook\""` → only the def line;
the two other "storybook" hits are prose comments in `SolverErrorNote.vue:9` and `apiError.ts:41`
about "storybook dressing," unrelated to the filter).

**Never-consumed, entire git history (the decisive stroke):**
- `git log -S "url(#storybook-texture)" --all` → **empty** (no commit ever added that string, any path).
- `git log -S "storybookTexture" --all` → **empty**.
- The def was introduced in `3b83133c` ("Hand-drawn crayon UI: grid boil, SVG glyphs, decoratives")
  and has been dead since inception — born unused, never wired.

**Verdict.** F7 §1.5's "celestial-used" claim is false. Celestial rendering (the moon/star it names)
is filtered by `wobble-celestial` (present in the url() inventory, consumed at ≥5 sites incl.
`SvgFilters`/celestial paths), never by `storybook-texture`. F4's grep is concrete and correct.

**Disposition:** convert §2.1's "ADOPT (verify-then-kill)" to **KILL** — excise the
`storybook-texture` filter def (`SvgFilters.vue:164-167`, the `<filter>` element + its
`<!-- Storybook texture… -->` comment on `:163`). No design wave adopts it: F4's slight pass and
F5's set-and-rise both rewire celestial to `wobble-celestial`, not to a fractalNoise displacement.
Homes cleanly in **T3-W3** (dead-surface wave) alongside the other FE dead-def excisions, or in
**T3-W10** if a celestial sitting prefers to own its own filter cleanup — W3 is the lower-risk home
(mechanical, zero blast radius, grep-proven). No owner memo row needed; the verify condition F8/§2.1
attached is now discharged.

---

## PART 2 — pencil-boil sibling pin: the rev, the sun-glyph supply, F6 durability.

**The sibling repo:** `/Users/mkbabb/Programming/pencil-boil` exists locally, git-clean working tree.

### 2a. The pin — from the CSP repo's side, already cryptographically anchored; sibling-side gap is a missing tag.

- App pins `"@mkbabb/pencil-boil": "^0.7.0"` (`web/frontend/package.json:20`).
- Lockfile resolves the published tarball with an integrity hash — **this is the effective pin**:
  `package-lock.json:2351-2354` → `version 0.7.0`,
  `resolved …/pencil-boil-0.7.0.tgz`,
  `integrity sha512-Tr1Xyp9ONMMXewDCyMg3T2s6H2zjM43cKB35cZwGZEhtUmEJdvFnxjmnQHi0fFbadkt2yp8K/Oy1UFLz8HbkoA==`.
  The caret + committed lockfile sha512 pins the exact bytes the app builds against; no CSP-repo
  action is required for reproducibility.
- **The built-against rev:** local pencil-boil HEAD is `106a5a26184f8a0b1d42a992880588662955b8b7`
  = commit "feat: 0.7.0 — useBoilCache, boil frame prebake, createStrokeDrawIn", `package.json`
  `version 0.7.0`, **working tree clean** → the local source *is* the 0.7.0 published state, not
  ahead of it. No unreleased 0.8 work exists locally (HEAD is the release commit itself).
- **Provenance gap (sibling-side, owner action):** there is **no `v0.7.0` git tag**. `git tag`
  stops at `v0.5.0 / v0.5.1 / v0.6.0` — the 0.7.0 release was published to npm without tagging its
  commit. The exact rev is knowable (`106a5a2`, clean tree, version match) but not tag-anchored.
  **Recommendation:** the owner tag `v0.7.0` at `106a5a2` in the pencil-boil repo so the
  published-to-commit link is durable. This is a pencil-boil-repo hygiene item, **not** CSP-repo
  tranche work — record it as a sibling-repo owner reminder (kin to the R5 worktree purge and OD-4
  CNAME carried forward, §1.2/§1.4). The CSP lockfile integrity already covers reproducibility;
  the tag closes the human-auditable provenance.

### 2b. The M4 sun-glyph supply side — CONFIRMED as A14 C11 described: primitives shipped, composable deliberately parked.

The A14 chronic-fold C11 / M4 lift is gated on a ≥2-consumer trigger; A24-G3 asked whether the
*supply* side exists. It does, split exactly as the fold assumed:

- **Sun/celestial primitives — EXPORTED and consumed.** pencil-boil `src/index.ts:17` exports
  `wobbleDiamond, wobbleStarPolygon, generateSunRays` (`generateSunRays` defined `celestial.ts:45`),
  all proof-covered since 0.6.0 (point-count/determinism/seed-stability locks,
  `CHANGELOG.md:34-40`). The app already consumes all three in
  `web/frontend/src/pencil/celestial/DarkModeToggle.vue:96-98,129,135-146`.
- **`useCelestialSun()` — deliberately NOT exported, "parked."** pencil-boil `CHANGELOG.md:42-46`:
  *"`useCelestialSun()` stays parked — its second live consumer never materialized (both candidate
  repos standardized their dark-mode chrome elsewhere), so shipping a one-consumer composable would
  be speculative surface. The primitives it would compose are all exported and now proof-covered;
  the composable lands when a real second consumer does."* The app's own note corroborates the
  parked prerequisite (`pencilConfig.ts:85`, "Prerequisite for the M4 `useCelestialSun()` lift").

**Verdict:** the supply confirms the synthesis §2.6 (L25-02/03/05/07) disposition verbatim — "M4's
lift itself stays healthily parked on its ≥2-consumer gate … but the in-app celestial palette
rewire lands via F5/F7 regardless." The rewire uses the *primitives* (already wired in
`DarkModeToggle.vue`), never the parked composable. **No action, no owner row** — the gate is
correctly unfired on both sides (app has one consumer; upstream withholds the composable until a
second exists). This closes A24-G3's "does the supply side exist?" question: yes for primitives, and
intentionally-absent for the composable, which is the healthy state.

### 2c. F6-decision durability across a version bump — durable across additive bumps; no 0.8 exists to threaten it.

F6 §3 and A19 §3 decided AGAINST re-adopting keyframes.js (§2.4 CLOSED-REJECT), leaning on
pencil-boil's `sequence` + `resolveEasing` sufficiency for the page-turn's two fades + two sequences.
A24-G3 flagged that neither verified the claim against pencil-boil's *source*. Now verified:

- The API F6 leans on is present and core-scheduler: `sequence` kind at `vue.ts:74,373`;
  `resolveEasing` at `easings.ts:26`, re-exported `index.ts:25`. The app consumes both
  (`usePathAnimation.ts:5,57` resolveEasing; `sequence` subscribers across the animation surface).
- **The maintainer's own stability covenant** (pencil-boil `CHANGELOG.md`, 0.7.0 note): *"The
  scheduler is untouched — one rAF chain, the `chains=1`/floor-`subscribers` invariant, reactive-PRM
  teardown, and every existing signature carry forward unchanged."* The last three releases
  (0.5.0→0.5.1→0.6.0→0.7.0) were **all additive** (useBoilFrames, celestial proofs, useBoilCache /
  frame-prebake / createStrokeDrawIn) with **zero signature churn** on the `sequence`/`resolveEasing`
  surface F6 depends on.
- **No 0.8 exists** (local HEAD is the 0.7.0 commit; nothing ahead), so "durability across 0.7→0.8"
  is prospective. The evidence says: F6's decision is durable across additive bumps by the covenant,
  and the *real* re-entry trigger is a capability gap (§2.4's recorded criterion: "a future feature
  needing numeric path morphing / spring physics — not a 1s page-turn"), **not** a version number. A
  0.8 that stays additive does not disturb F6; only a new capability need does.

**Verdict:** F6 CLOSED-REJECT stands, now source-verified. Durability is a function of capability
gaps, not release cadence; record the covenant as the evidence and keep the recorded re-entry
criterion. No owner row.

### 2d. Adjacent supply-side note (not core G3, flagged for W7/W8).

pencil-boil 0.5.1/0.7.0 now ship `useBoilFrames` / `useBoilCache` (memoizing frame caches,
`index.ts:43`), explicitly promoting the "ad-hoc frame-cache discipline hand-rolled in the sudoku
consumer's `gridPaths.ts`" into the library (`CHANGELOG.md` 0.5.1 note). The app does **not** yet
consume them (`grep useBoilFrames\|useBoilCache\|createStrokeDrawIn src/` → zero hits); its
frame-cache/`mulberry32` discipline is still hand-rolled across board components. This is the
supply-side confirmation for the **L25-19 gridPaths straddle re-point** (§2.6, rides the FE
structure wave): the library replacement now exists at the pinned 0.7.0. Not a G3 deliverable —
handed to W7/W8.

---

## SUMMARY — G3 dispositions

| # | Item | Verdict | Home |
|---|---|---|---|
| G3-1 | `#storybook-texture` F4-vs-F7 contradiction | **F4 right / F7 wrong — KILL.** Zero consumers in all git history; born dead `3b83133c`; celestial uses `wobble-celestial`. Excise `SvgFilters.vue:163-167`. | T3-W3 (dead surface) |
| G3-2 | pencil-boil built-against rev / pin | CSP side already pinned by lockfile integrity `sha512-Tr1Xyp9…` at 0.7.0. Rev = `106a5a2` (clean, version-matched, not ahead). **Gap: no `v0.7.0` git tag** — sibling-repo owner action to tag `106a5a2`. | owner reminder (sibling repo), not CSP tranche work |
| G3-3 | M4 sun-glyph supply side | **Confirmed as C11 assumed:** primitives (`generateSunRays`/`wobbleDiamond`/`wobbleStarPolygon`) exported + consumed; `useCelestialSun()` deliberately parked (one-consumer). Gate correctly unfired both sides. F5/F7 rewire uses primitives, already wired. | no action |
| G3-4 | F6 keyframes-vs-pencil-boil durability | **CLOSED-REJECT stands, source-verified.** `sequence`+`resolveEasing` present + core-scheduler; maintainer covenant = signatures carry forward, last 3 releases additive; no 0.8 exists. Re-entry = capability gap, not version. | no action; record covenant |
| G3-5 | (adjacent) `useBoilFrames`/`useBoilCache` supply for L25-19 gridPaths straddle | Library replacement now shipped at 0.7.0; app hasn't adopted. | hand to W7/W8 |

**Net new owner/record items G3 produces:** exactly one — tag `v0.7.0` at pencil-boil `106a5a2`
(sibling-repo provenance hygiene, owner-side, mirrors the standing R5/OD-4 carry-forwards). Nothing
else in G3 mints an owner memo row; the two design-adjacent claims (M4 park, F6 reject) are
confirmed as already-decided, and `#storybook-texture` collapses from an OWNER-adjacent hold to a
mechanical W3 kill.
