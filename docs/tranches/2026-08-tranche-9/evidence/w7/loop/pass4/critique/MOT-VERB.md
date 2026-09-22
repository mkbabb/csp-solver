# MOT-VERB — pass 4 CRITIQUE (adversarial, non-author)

Subject: the merged §13 tree in `.claude/worktrees/wf_f72f3b5a-83a-59` (44 modified + 6 untracked,
+1000/−173 vs `74a2b5d9`), its README, instruments, readings and two banked frames under
`pass4/prototype/MOT-VERB/`. Base and π control `74a2b5d9` throughout. Chair's pass-4 rulings,
pass-3 rulings, LAWS and registry §2 read first.

Everything marked **(critic)** was measured by me, on my own servers: after
`index-DkuI4zTVEX9A.js` on **127.0.0.1:4243**, control `index-CubiZsMVSwTc.js` (the chair's
`w7-control`, never edited, built or git-touched) on **127.0.0.1:4244**, each verified by its own
entry hash over HTTP and never by a 200; chromium AND webkit headless; killed by recorded PID
(99734 / 99735), band 4230–4249 empty at return. The tree was returned byte-identical to what I
found it (`git diff --stat` 44 files, +1000/−173, zero plants surviving).

**CONVERGENCE: 78** (pass 3: 71). The flagship defect is genuinely dead and I proved it myself;
the wave gate this family owns is real, non-vacuous and in CI; the fold happened. Against that,
five holes I found that the return does not name — three of them on the pass's own headline
artifacts, including the ballot the owner is asked to dispose on.

---

## 1 · WHAT I RE-RAN, AND WHAT HELD

| reading | (critic) result |
| --- | --- |
| **THE DUSK**, all five ground selectors under `html.theme-turning`, after vs control | after `background-color, color \| 0.35s, 0.35s \| cubic-bezier(0.25, 0.1, 0.25, 1)` · control `… \| ease` — **all five, identical chromium and webkit**. `cubic-bezier(0.25,0.1,0.25,1)` IS CSS `ease`, so the paint is the control's. Pass 3's `all \| 0s \| ease` is gone. **The row is closed and it decided pass 3's number** |
| **computed-timing set-diff**, my own keying (every rendered element, transition + animation, `TAG[n]` path from `body`) | **87 shared · 0 on one side only · 31 moved · 28 curve / 1 length / 1 animation / 1 mixed** — the lane's numbers and classes reproduced EXACTLY, and identical in both engines |
| **the fixed-t arithmetic**, recomputed from the shipped control points with my own bisection solver | `glassGlide→lift` **0.8521 at t=0.40** · `standard→layDown` **0.5425 at t=0.25** · `ease-out→layDown` **0.4020** · `ease→layDown` **0.3706** · `drawOn→writeIn` **0.1875** · `noteWrite→layDown` **0.1313** · `accelIn→lift` **0.0323 at t=0.85** · `ease→dusk` **0.0000**. Every headline in `readings/curve-fixed-t.txt` is reproducible |
| **filterBudget**, `e2e/filter-census.spec.ts` on the BUILT dist under `playwright-throttle.config.ts` | **12 passed** (6 per engine): G3.1 census = `filterBudget.ts`, G3.2 no retained fill supplies a transform, G3.2 source `forwards\|both` = `FILL_ALLOWLIST`, G3.3 coarse below 1024, G3.5 no hover mints a filter, both regimes. **9 unmoved** |
| gates BARE, exit unpiped | `lint:verbs` **0** · `lint:theme-tokens` **0** · `lint:copy` **0** (M16) · `lint:motion` **0** · `lint:knip` **0** · `lint:lanes` **0** · `prettier --check` **0** · `vue-tsc -b --force` **0** · `vitest run src/pencil` **80 passed** · `lint:bands` **exit 1** (B8 = 5) bare, **0** with `MOTION_LADDER_B8_OWNED=1` |
| **the @property registrations, at runtime on the served dist** | all seven rungs read **registered=YES in both engines** (an invalid `<time>` handed to each is rejected at computed-value time; `--verb-layDown-ease`, unregistered, keeps the literal — the discriminator works). Control: 0 registered, 0 publisher nodes. After: exactly **1** `style[data-motion-rungs]` |
| **AA / colour** | `git diff -U0 74a2b5d9 -- src` filtered for `--color-*:`, hex, `oklch(`, `rgb(` returns **zero non-comment rows**. This delta moves no colour; AA is HEAD's and unaffected |
| dead names | `grep -rn "page rung\|breath rung" src/` → **0**. Closed |
| W2's landed mechanics, the decided history | no hunk reaches the sticky tag, the dock, the bottom tab or the tap-floor token; R6 rows are reported MOVED, not edited; nothing written under `r0/`, `pass1/`, `pass2/`, `pass3/` — confirmed |

### The gates, tried on a broken tree (six plants, each reverted)

| plant | result |
| --- | --- |
| **A** — bare `var(--critic-ghost-ms)` in SolverErrorNote's real `animation` slot | `lint:theme-tokens` **exit 1**, `src/games/shared/SolverErrorNote.vue:65 --critic-ghost-ms`, "TIMING slots: 1". **The census fires on a real product file, not only on its fixture** |
| **C** — `forwards` added to `note-in` (layDown fills `none`) | `lint:verbs` **exit 1**, "layDown fills none, and this declaration fills forwards" |
| **E** — `backwards` stripped from MarginNote's two `ink-write-in` rules | `lint:verbs` **exit 1** ×2, "writeIn fills backwards, and this declaration fills none". **Rule 9 is born-RED in both directions on real sites** |
| **F** — the ADMITTED site (`FillForcedIcon`) made to OBEY rule 9 | `lint:verbs` **exit 1**, "admissions in the ledger: 39, **stale 1**". The ledger is closed both ways |
| **H** — `@property --motion-critic` registered, not a rung | `lint:bands` **exit 1** at **B3**. See §2.6 — this is the row the return calls open |
| **B** — the scope hole | **exit 0**. See §2.4 |

The centre is real and it is enforced where it claims to be. The fold happened (one §13 worktree,
LADDER's ladder, VERB's grammar, the 57-line graft deleted, seven rungs including `rise`), the
line-count check enumerates all 74 absent VERB lines by name, and the two self-declared incidents
(LADDER's unbanked delta; the first ballot-frame cut that read `ease` on both arms) are exactly
the kind of thing that usually has to be dug out of a lane.

---

## 2 · THE OPEN ROWS — five of them are mine, not the return's

### 2.1 `?board=` PINS NOTHING. Every §13 pass-4 row that says "the same pinned board" is unpinned.

`src/games/shared/persistence.ts:216` — `decodeBoardParam` reads the `board` param, `fromBase64Url`s
it, and **fails closed** unless `payload.charCodeAt(0) === CODEC_VERSION` and the payload splits
into the right number of parts. `?board=ballot`, `?board=dusk-probe`, `?board=critic-motverb` are
all `{ status: "invalid" }`; the app falls through to the selector path and deals its own board.

**(critic)** proven on ONE arm, same URL, two fresh contexts: webkit `nodes=1216` then
`nodes=1142`. Across arms at the same instant: chromium after `1216` vs control `1140`. My paint-π
census over the same two arms reads **keysA 1123 vs keysC 1175, onlyA 14, onlyC 66, moved 3**, and
the three moved rows are the difficulty tally's `h2` and two buttons swapping colour and
font-weight — the two arms were sitting on **different difficulties**, not on a design delta.

Consequences: chair pass-4 §2 and registry §2.13 name this as LADDER/LEDGER's confound and require
the deal pinned; it is not met. The dusk row is immune (its subject is page chrome, and I
reproduced it identically). The timing set-diff's strongest sentence — "**0 keys on one side
only**" — is luck of the timing-bearing subset, not a pinned comparison, and it is quoted as π.
**Closable**: pin by a real encoded payload (the `?board=` codec, or `e2e/gallery-deal.spec.ts`'s
own deal helper), or drop the word "pinned" from every row.

### 2.2 THE TWO BALLOT FRAMES ARE NOT THE SAME BOARD, and the README says they are.

README §3: "**Frames, both from the same build, the same board, the same instant** … the only
difference in the two frames is the curve the arm ships." **(critic)** I looked at both PNGs:

- `frame-deckleave-t040-after-…png` — the sudoku card reads "**9×9 easy · dealt**", level **Easy**
  underlined, one set of givens.
- `frame-deckleave-t040-control-…png` — "**9×9 hard · dealt**", level **Hard** underlined, a
  different set of givens.

The curve claim itself SURVIVES: after is near-opaque and control is near-invisible, which is the
0.934 / 0.082 the two easings predict at t = 0.40, far larger than any deal could produce. But the
statement of fact in the return is false on the face of the evidence, and it is the same species
the lane self-declared one layer down (the first cut's four frames "showed nothing they cited") and
that the registry booked against another lane. The owner is asked to dispose on these two pictures.
**Closable**: re-shoot both arms on one encoded board, or state the uncontrolled variable in the
caption.

### 2.3 THE FIXED-t TABLE IS INCOMPLETE — the pass's own headline number is under-counted.

The table prices **29 sites** against **49 `var(--verb-*-ease)` occurrences** in `src/`, and the
grouping ("the card's four rows", "(x2)") does not reconcile: GameControlPanel has 6 occurrences
against one 4-way row, GameGallery 5 against 3+1, AnswerKeyLaminate 4 against one "(x2)". **(critic)**
three declarations carrying a verb curve are absent from the table entirely, each read against
`74a2b5d9`:

| site | control | after | Δ |
| --- | --- | --- | --- |
| `GameGallery.vue:1318` (control `:1320`) | `background-color 200ms var(--ease-standard)` | `var(--motion-leave) var(--verb-layDown-ease)` | **0.5425** — a top-bucket RE-CURVE |
| `GameControlPanel.vue:2099` (`.sparkle-icon`, control `:2089`) | `transition: all 200ms` (UA `ease`) | `filter`+`transform` on `var(--verb-layDown-ease)` | **0.3706** — a RE-CURVE |
| `AnswerKeyLaminate.vue:250` (control `:237`) | `280ms var(--ease-glassGlide)` | `280ms var(--verb-layDown-ease)` | 0.0000 — a re-name (and a **literal 280ms** in a timing slot) |

So the honest headline is at least **21 real re-curves of 32 sites**, not 19 of 29 — and pass 3's
critique estimated "~32 declarations", so the pass-4 table LOST rows relative to the estimate it
was built to replace. The ballot the owner disposes on is the set; the set is mis-stated.
**Closable**: generate the table from the diff rather than by hand, and print the reconciliation
(49 declarations → N priced rows → the grouping rule).

Two smaller things on the same table, in the lane's favour: the joint length×curve price it never
printed is NOT worse than the curve alone — **(critic)** `ease@500` vs `layDown@520` on one wall
clock is **0.3545** against the curve-only 0.3706, and `ease@240` vs `layDown@250` is **0.3537**
against 0.3706. One line closes that. And the six length rounds priced alone read **0.0233** and
**0.0243** on my recompute against the lane's 0.0281 / 0.0292 — same order, the lane's is the
conservative figure.

### 2.4 THE CENSUS IS SCOPE-BLIND, and the variant it misses is the pass-3 defect verbatim.

`undefinedTokens()` builds ONE flat declared-set as the union of every `--x:` in every file under
`src/**`. A token declared in component A's `<style scoped>` therefore counts as declared for a
consumer in component B, where it does not resolve.

**(critic) PLANT B**: `animation: note-in var(--critic-ghost-ms) …` in `SolverErrorNote.vue:65`
(the same plant that RED in plant A), plus `--critic-ghost-ms: 250ms;` in `MarginNote.vue`'s scoped
style. `npm run lint:theme-tokens` → **exit 0**, "TIMING slots: 0". SolverErrorNote is not a
descendant of MarginNote; at runtime the declaration is invalid at computed-value time and computes
`all | 0s | ease` — the pass-3 dusk, under a green gate, again.

The return concedes only the RUNTIME-declared variant ("a token declared only at runtime by
something other than the ladder's publisher"). This one is compile-time visible, it is one
predicate away, and it is the gate's own stated law. **Closable**: treat a declaration as GLOBAL
only when its selector is `:root` / `@theme` / `html` / `*`, and otherwise scope it to its own file.
No token in the tree moves today — the check is that the scan survives one, not that none exists.

### 2.5 THE LADDER'S `@property` BLOCK SHIPS TWICE IN SOURCE, and one copy is illegal nesting.

`src/assets/index.css` registers the rungs in two places:

- **398–425, file scope**: SIX registrations — whisper, leave, note, dusk, step, throw. **`rise` is
  absent.**
- **575–615, nested inside `:root { … }`**: SEVEN, including `rise`.

`@property` is not one of the at-rules CSS Nesting admits inside a style rule, so `--motion-rise`'s
only SOURCE registration is the illegal one. **(critic)** the shipped dist is fine — Tailwind/
lightningcss hoists and de-duplicates, `dist/assets/index-BvHZLsnmO23P.css` carries exactly seven at
top level, and all seven read `registered=YES` in both engines on the served dist. But: six tokens
are **double-minted** against registry §6.7/§6.8 ("one declaration each … a lane that registers a
token elsewhere has re-minted and the row is a gap"), the seventh rung depends on a bundler
transform for its registration, and B3 is a text scan that can see neither. **Closable**: delete one
block, keep seven at file scope, and add one line to B3 that reds on a `@property --motion-*`
appearing inside a brace.

### 2.6 GAP 7 IS MISREPORTED — B3's set equality IS written on this tree.

The return lists as OPEN: "B3 (the registered `@property` set == `MOTION.rungs`, closed both ways)
is NOT asserted on the merged tree … It is one comparison and I did not write it."

**(critic)** it is written, in the leader's gate this lane folded in —
`scripts/check-motion-bands.mjs:681-691`, `b3Mirror`, both directions, and `B3 ONE HOME, NO
FALLBACK` is in `CHECKS` and reads ✓ on this tree. **PLANT H** (a `@property --motion-critic` that
is not a rung) turns it **RED**, so the "registered and not a rung" arm is live and non-vacuous.

The arm I could NOT demonstrate is the other one: deleting `@property --motion-note` from the
file-scope block left B3 **green**, because the nested block at :592 still supplies it (§2.5). So
the row is *mostly* closed and the lane gave it away. A self-report that understates what shipped
is the mirror image of overclaiming; it cost this return a row it had already earned, and it left
the one arm that is actually weak un-named.

### 2.7 `lint:bands` bare is RED, and rule 9's first control is keyed to a source line's bytes.

`lint:bands` **exit 1** (B8 = 5) bare on its own tree; green only under `MOTION_LADDER_B8_OWNED=1`,
which `ci.yml` sets. The chair sanctions it (registry §2.7) and the retirement condition now carries
a number, so this is a reported red, not a hidden one — but "every gate runs BARE" is unmet for one
of the section's two gates, and the five residual bare UA keywords are un-cured.

**(critic) PLANT G**: changing SolverErrorNote.vue:65's token made rule 9's negative control #1
report **MISSED** and `lint:verbs` exit 1 — the control is keyed to that line's literal declaration
text. It fails loudly, which is right, but it is the **third** control this lane has had to re-aim
for being keyed on exact bytes (the publisher's `const RUNGS` comment control and the delay-fence
control were the other two, both self-declared). A control keyed on one site's spelling is a control
with a scheduled death.

Same plant, the other half: with an undefined token in a timing slot, `lint:verbs`' own census reads
**0 on every rule**. Registry §2.10 struck `lint:verbs` over an undefined token and the re-cut is
`check-theme-tokens`, which is in `ci.yml:988` — so the strike is satisfied by a DIFFERENT gate. Any
lane that runs `lint:verbs` alone is still blind to the class.

### 2.8 The rows the return names, which I confirm are open

- **T9-B10 / the ≥21 re-curves ship on the lane's own default.** Priced, not shrunk, and the owner's
  under U-10. Correctly identified as the biggest row; §2.2 and §2.3 mean it goes up mis-framed.
- **`ink-rub-out` still has no consumer** — `@keyframes ink-rub-out` at `index.css:1270`, referenced
  in two comments and nothing else. Unchanged from pass 3, held on NOTE-ERASE's co-landing.
- **The toggle beat table's live half** is still an after-equals-control equality on three sampled
  rules, not a per-beat read of eight.
- **Cost 50 files against ≤26** — conceded; the §13 section count is the fair frame, and it is over.
- **LADDER's delta was never banked before the merge**, so arm A of the line-count check has no
  `ours` column. The law the return writes ("bank the first lane's diff before the second lane
  touches the tree") is the right one and belongs in the registry.
- **Two crops, one engine, one pose**; the webkit pair deleted for the size cap. With §2.2, the
  frame evidence is the weakest part of the return.

---

## 3 · CHECKLIST

| item | reading |
| --- | --- |
| vacuous convergence | **clear** — six plants, five RED, one deliberately green to expose §2.4 |
| spec-cites-itself | clear — the dusk claim is now measured on the product's own selectors, both engines |
| gates that cannot fail | **HIT, narrowly**: `lint:theme-tokens` cannot fail on the cross-scope variant (§2.4); B3's "published but unregistered" arm cannot fire while the block is double-minted (§2.5/§2.6) |
| elegant-reduction trap | clear — the fold that pass 3 deferred was actually run, 53 hunks, scripted policy, graft deleted |
| legacy aliases | clear — `page rung` / `breath rung` 0; `--card-step-ms` and the three aliases dead |
| masked fallbacks | clear on the rungs (0 `var(--motion-*,` in src); the two surviving hooks (`--reveal-delay, 0ms`, `--draw-dur, 160ms`) are genuine inline-bound hooks and both names are in the declared set |
| unverified gestalt | **HIT** — the ballot frames carry an uncontrolled deal and a false "same board" sentence (§2.2) |
| consumer-less substrate | **HIT** — `ink-rub-out`, unchanged |
| the generic default | clear — no new surface minted |
| the pixel it did not declare (π) | **HIT** — the set-diff is right and reproduced, but it is unpinned (§2.1) and the source-side table under-counts by at least three declarations (§2.3) |
| the constraint it forgot | AA **clear** (zero colour rows); filterBudget **9, 12/12 both engines on the dist**; M16 **0**; W2 untouched; decided history reported not edited; **@property law — HIT on "one registration" (§2.5)**; undefined-token census — HIT (§2.4) |

## 4 · STRENGTHS

1. **The dusk.** The row that decided pass 3's number is dead, on the product's own five ground
   selectors, in both engines, with the paint byte-identical to the control — the family's §1.3
   claim is now true of the product instead of a probe. I re-ran it and got the lane's exact strings.
2. **The census is a real gate in CI.** It fires on a real product file, its hook exemption is a
   rule and not a hole, comments are masked, and it reads timing slots off the declaration rather
   than the printed line — which is precisely where the pass-3 defect lived.
3. **Rule 9 is born-RED in both directions on real sites**, and the admissions ledger reds on a
   stale licence. Half a primitive became a law.
4. **The fixed-t table is the right instrument** and its arithmetic reproduces exactly on an
   independent solver. The sentence "the family's own claim is FALSE for 19 sites" is the most
   valuable thing in the return, and the lane wrote it against itself.
5. **The fold is done**, with a declared scripted resolution policy and a line-count check that
   enumerates every one of the 74 absent lines.

## 5 · VERDICT

**ADVANCE.** The centre — a closed verb set, each verb a curve bound to a property set and a fill
arm, enforced at the declaration, with one typed WAAPI door and a ladder that publishes once — is
right, runs on both engines, and now carries the gate that catches the one failure it could not see.
Nothing here is a rewording; no bound constraint is violated (AA, M16, filterBudget 9, W2's
mechanics, the frozen record, the decided history all hold on my own re-runs).

Not 100, and not close, because the pass's own evidence has three faults its author did not find:
the board is not pinned on any arm, the two ballot frames are different boards under a sentence
that says they are the same, and the priced set that the owner's ballot rests on is short by at
least two real re-curves and one re-name. Add the census's scope hole and a double-minted
registration block, and five of the eleven charter rows are genuinely open — one of them (B3)
closed and mis-reported as open.

## 6 · CROSS-POLLINATION

1. **THE WHOLE WAVE — `?board=<name>` pins nothing** (§2.1). Every pass-4 lane that wrote "the same
   pinned board" measured two arms dealing independently. `decodeBoardParam` fails closed on a
   non-codec payload. This is a wave-level correction and LADDER/LEDGER's confound is still open.
2. **Every lane consuming a rung ← the undefined-token census, WITH §2.4's fix**: a declared-set
   scan must be keyed by scope (`:root`/`@theme`/`html`/`*` global, everything else file-local), or
   it green-lights the very defect it was cut for.
3. **MOT-LADDER, every lane that re-eases anything ← the per-site fixed-t table**: sample both
   curves at 21 fractions of each declaration's own duration and print the worst |Δprogress| and its
   t. It is the only π instrument that can see a re-curve, and it should be GENERATED from the diff
   (§2.3) so the row count reconciles with the declaration count.
4. **CTRL-FACE (§6.5's registration owner), MRK-LIVE ← §2.5**: `@property` inside a style rule is
   not legal nesting, and a bundler that hoists it hides the fact. Add "a `@property --x` inside a
   brace is RED" to any registration gate, and assert ONE block.
5. **Every admissions ledger ← PLANT F**: make the admitted site OBEY the rule and the ledger must
   red as STALE. It does here, and it is the cheapest way to prove a ledger is closed both ways.
6. **NOTE-ERASE, every `<Transition>` ← rule 9**: an animation term naming a verb carries that
   verb's own fill, `none` meaning no keyword — with the written admission that `forwards` outranks
   an inline author declaration where `none` does not (the two icons' inline `strokeDashoffset`).
7. **Every lane banking a frame ← §2.2**: a two-arm crop pair states its uncontrolled variables in
   the caption, or it is not evidence. Look at the picture before writing the sentence about it.

---

### Housekeeping

Servers killed by recorded PID (99734 after, 99735 control); band 4230–4249 read empty at return.
Scratch config, specs and cacheDir under `<worktree>/web/frontend/.critic-motverb/` deleted; the
worktree's `git status` at return is the lane's own 44 modified + 6 untracked, product files only,
`+1000/−173` vs `74a2b5d9`, with every plant reverted and verified absent by grep. Nothing was
written under `loop/r0/`, `pass1/`, `pass2/` or `pass3/`. No crop is banked by this critique — the
two frames it judges are the lane's own.
