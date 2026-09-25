# NOTE-LEDGER · pass-7 prototype

The prototype runs. The work tree is `.claude/worktrees/wf_f72f3b5a-83a-46`. It's detached at `74a2b5d9`, which is also the π control, and it was advanced in place over the chair's bank `pass6/prototype/NOTE-LEDGER/pass6.diff`. The number is the critic's.

**Payload.** Every browser row uses one payload: the section's classic easy 9×9 with 30 givens (`?board=ATMuNTMwMDcw…MDc5`). Before any read, the given set is read back through two corpora: the input values, and the aria-label corpus (`Row r, column c, given clue X`). Row 6's 16×16 payload is minted with the same codec and read back the same way.

**Box load.** The 1-minute load was 23–45 throughout, with 123–129 sibling node/playwright/vitest processes. Every timing number below is a reading on a loaded box.

## Gaps first

1. **The reserve law ships in `lint:ink`, not in the unit lane.** It's a new row in `scripts/check-ink-pressure.mjs`, the host of the note's `gateNote`. The reason is the same one that file's header gives: the row must read every stylesheet in the tree, and `src/**` is typechecked without node types.
   - **Library copy.** The chair's library landed as `scripts/shape/{shape-census,reserve-law}.mjs`. Prettier expanded the 327-line library to 862 lines; the tags below bring it to 881.
   - **Changes beyond formatting.** Two eslint fixes that don't change behaviour (a needless `\[` escape, and one float literal written as its exact double). Twenty `/** @public */` tags so `knip` accepts the library's API. `import process` for the CLI. And one change in substance:
   - **R4 extended to a lower bound.** R4 now reads a `calc`/`clamp`/`min`/`max` value as a lower bound in line units. The chair's R4 reds the union as integrated: `calc(var(--type-body) * var(--type-leading-caption))` reads as 0. The extended R4 reads it as 1.3 lines at the clamp's floor.
   - Both deltas are banked as `instruments/landed-vs-chair.*.diff`.
   - **Equivalence.** The chair's own `shape-plants.mjs`, run against the landed copy, gives verdicts identical to the chair's copy: 19/19 plants RED, the negative-negative GREEN, self-test 24/24 (`logs/shape-plants-on-*.txt`).
   - **Still unread.** The shapes the chair declared unread (a `.json` table, `@import` chains, a component census) are still unread.
2. **The section as it ships carries NOTE-ERASE's swap regression, and my cure for it is only PROPOSED.**
   - **The regression.** On `union + ERASE7 (U1 + carry) + LEDGER7`, HOLD's push holds the displaced line for **163.5–166.5 ms** (chromium) and **166–171 ms** (WebKit). For 20–21 and 16–17 sampled frames, the sentence stands on BOTH lines.
   - **The cure.** `swap-fence.PROPOSED.diff` makes line one's hook write `0s` on `note-swap`. It brings the hold back to **14.1–17.9 ms / 14–21 ms** and 0–1 frames. The union as integrated reads 5.5–17.5 / 11–14 ms and 0–2 frames.
   - **Why it isn't landed.** It edits ERASE's `stopTheClock`, which doesn't exist on my tree. It's banked as a PROPOSED diff for ERASE and the fold. No gate ships with it: the SWAP leg of the drop-clock row is still owed.
3. **The T9-B-LEDGER frame is not the owner's retirement.** It pictures the union plus both families' pass-7 deltas, WITHOUT the fence. Its P4 +100 ms column shows AGE's sentence on both lines, which is gap 2's double paint. The owner disposes (LAWS P6 §H).
4. **On the section as ERASE ships it, two of my hunks don't apply.** On `union + ERASE7`, the `check-font-coverage.mjs` hunk and the `MarginNote.vue` hunk return `git apply --check` 1. ERASE's `union-carry.PROPOSED.diff` already carries the same substance: the same `MUST_CLOSE` text, and `white-space: nowrap`.
   - So I cut the union form, `instruments/pass7-on-erase.diff` (applies with exit 0). It is my delta without those two, plus the third-arm comment re-anchored.
   - On the bare union, the `package.json` hunk returns 1 because the union already carries `--self-test`. The reverse check returns 0.
5. **@property clause 1 and C4 still breach on THIS tree.** The breaches are the 4 bare timing `var()`s and `motionRungs.ts:26`. I declare them DEAD-BY-FOLD, not re-cut. On the union they read cured: census exit 0 (TIMING 0, stale 0) and `check-property-block` source GREEN. A static block on this tree would be a second mint. So the tree's own `check-property-block` (1) and census (1, TIMING 4) stay red, and the control reads 0 and 1 (its 1 is the declared STALE row).
6. **The berth through the tab isn't booked, so it isn't built.** Neither `pass7/CHAIR-RULINGS.md` nor registry-v6 books §6.2. The row stays the chair's.
7. **`lint:bands` and `lint:verbs` don't exist at `74a2b5d9` or on this tree.** Both read exit 1 on both (npm's missing-script error).
8. **These weren't re-run this pass:**
   - the whole-DOM π and the filter census. This pass's only served CSS delta is ONE declaration, `white-space: nowrap`, on the 1×1 clipped line two under `(max-width: 1023.98px) and (orientation: landscape)`. The built CSS, normalised for scope hashes, equals pass 6's HOLD dist except for that one rule.
   - `font-census.spec.ts` (untouched this pass).
   - the R3 censuses (R3-d and R3-g stay MOVED on pass 5's PROPOSED diff).
9. **The 16×16 join timing doesn't match pass 6's.** It reads 0.006–0.009 ms per 256-value join, against pass 6's 0.066–0.068. That's a different expression: `inputs.map(value).join` in page, where pass 6 used `Object.values` of the reactive store. It's a reading, not a like-for-like re-time.
10. **No non-author has read any of this.**

## Numbers, the charter's eight rows

### Row 1 · THE RESERVE SHAPE LAW, landed through the chair's library

**The row.** `check-ink-pressure.mjs` runs `gateReserve()`, which is `shape/reserve-law.mjs` on `shape/shape-census.mjs`. It reads:
- every `<style>` of every SFC, every stylesheet, `public/**` and `index.html`;
- template `style`/`:style`, Tailwind candidates and script writes;
- keyed on the subject compound, with every declaration in source order, `!important` read, and the value resolved at the consumer.

`--self-test` carries seven plants as in-memory overlays on the SFC's own bytes. A plant whose anchor is gone reds as vacuous. The hand-rolled `reserveLaw()` and its describe are deleted from `MarginNote.test.ts` (+6 −94).

**The seven plants.** Overlay reads, `logs/reserve-plants-overlay.txt`:

| plant | tree | union (as integrated) | control `74a2b5d9` |
|---|---|---|---|
| clean | **GREEN** | **GREEN** | **RED R1 (0 voice sites)** (born-RED) |
| seat deleted | RED R1 0 sites | RED R1 | anchor missing |
| E1 a shadowing `min-height: 0` after `inherit` | RED R1 2 sites | RED | anchor missing |
| E2 a second `<style scoped>` | RED R1 2 sites | RED | RED R2 |
| E2b `.margin-note-block > .margin-note { min-height: 0 }` | RED R1 2 sites | RED | RED R2 |
| E3 the block's reserve at 1px | RED R4 | RED R4 | RED R1 |
| E4 `min-height: 0 !important` in the landscape block | RED R1 2 sites | RED | anchor missing |
| half-line (`calc(1lh / 2)`) | RED R4 | RED R4 | RED R1 |
| (critic's residual) `:deep(.margin-note)` from `GameBoard.vue`, ± `!important` | RED R1 2 sites ×2 | — | — |

**The law on four trees** (`logs/reserve-law-final.txt`):

| tree | exit | reading |
|---|---|---|
| this tree | 0 | block `1.3em` |
| control | 1 | R1 |
| union | 0 | block `calc(…)` = 1.3 lines at the floor. The chair's unextended R4 reads 1 (gap 1) |
| `union + ERASE7 + LEDGER7` | 0 | block `1lh` |

**On disk, final sha1** (`logs/breaks-final.txt`). The replica is `git archive 74a2b5d9` + the final full diff. Every plant was restored by copy, and the sha1 before equals the sha1 after:

| sha1 read on | MarginNote.vue | check-ink-pressure.mjs | check-font-coverage.mjs | reserve-law.mjs | shape-census.mjs |
|---|---|---|---|---|---|
| the final sha1s | `15a9c6a4e31c` | `a92599d60129` | `f2daa32f5ddc` | `57d4a9e0dfb9` | `1b43f7af8abc` |

| plant | gate, bare | exit |
|---|---|---|
| clean | `lint:ink` `--self-test` | 0 |
| clean | `font-coverage` `--self-test` | 0 |
| E1 | `check-ink-pressure.mjs` | 1 |
| E2 | `check-ink-pressure.mjs` | 1 |
| E2b | `check-ink-pressure.mjs` | 1 |
| E3 | `check-ink-pressure.mjs` | 1 |
| E4 | `check-ink-pressure.mjs` | 1 |
| seat deleted | `check-ink-pressure.mjs` | 1 |
| the gate sabotaged (`gateReserve` returns `[]`) | `--self-test` | **1** (vacuous) |

**Behavioural half** (`logs/probe-tree.log`, `reserve`, tree DEV vs control dist, both engines). The empty voice's computed `min-height` against the block's:

| cell | tree: voice / block | control: voice |
|---|---|---|
| 390×844 coarse | 20.8 / 20.8 px (WebKit 20.799999) | `auto`, 0 px tall |
| 844×390 coarse | 20.8 / 20.8 px | `auto`, 0 px tall |
| 1280 fine | `auto`, 0 px (the desk takes no voice reserve, by design) | `auto`, 0 px |

### Row 2 · T9-B-LEDGER re-shot on the integrated tree WITH ERASE (sequential, after ERASE's return)

**The base.** `74a2b5d9 + s13-s7-s3.diff + ERASE pass7-delta.U1 + ERASE union-carry + pass7-on-erase.diff`. ERASE's `MarginNote.vue` sha1 `0dcf60ab…` reproduces.

**The arms.** One token (`LEDGER_FULFILLED`) is flipped per arm. Each dist was built after the last edit and served by vite preview on :4249, verified by asset hash:

| arm | dist |
|---|---|
| HOLD | `index-BftXARS89UkJ.js` |
| AGE | `index-BHq_6U3lZ9r4.js` |
| STEP | `index-CO9n2NTkJFfB.js` |
| TINT | `index-DBzrp_NNrqMn.js` |
| HOLD + fence | `index-BY9K6d0U8MrK.js` |
| union-as-integrated HOLD | `index-C4rwyft5SG8y.js` (= the integrator's identity) |

**HOLD reaches α 0.68 at eight beats, read post-paint.** The read is rAF → MessageChannel on line one's ink, 390×844 coarse DPR 2, both engines, both themes. The proof comes at ask + 917–971 ms.

| arm | ask → first α ≤ 0.69 | proof → quiet | α at proof +100 ms | α at rest |
|---|---|---|---|---|
| **HOLD** | **1207.9–1210 ms** | 271–290 ms | 0.928–0.983 | 0.68 |
| STEP | 1205.9–1210 ms | 286–290.5 ms | 0.950–0.982 | 0.68 |
| **TINT** | 926.7–934 ms | **5–12.1 ms** | **0.68** | 0.68 |
| AGE | — | — | line one empties; the record seats on line two at α 0.68 | — |

**TINT's cost, whole glyph population** (the chair's `glyph-pop.mjs`, 1280 fine DPR 1 light, P1, line one):

| arm | read at | chromium: pop · median · fraction < 4.5 | WebKit: pop · median · fraction |
|---|---|---|---|
| HOLD | proof +500 ms and +2600 ms | 650 · **2.563** · 0.675 | 641 · **2.866** · 0.691 |
| TINT | same two reads | 650 · **2.563** · 0.675 | 641 · **2.866** · 0.691 |

- **HOLD = TINT to the thousandth.** The answer came 0.92 s after the ask, and HOLD is already quiet 290 ms later.
- **The glyph-text statistic's 4.357** (WebKit DPR 1 light) and its fraction **0.110–0.515 against the control's 0.015–0.154**: TINT's and HOLD's alike. These are cited from ERASE's re-measure and its critic's reproduction to the thousandth. I did not re-run them.
- **Stated for the ballot.** On the shipping section, HOLD and TINT paint different bytes only when the answer lands less than 1.21 s after the sentence arrives. After that they are the same pixels.

**Frame (one crop): `T9-B-LEDGER-union+ERASE7+LEDGER7-HOLD-AGE-STEP-TINT-P4-cr+wk-light+dark-390x844-coarse-dpr2-at-0.5+1280x800-fine-dpr1.png`** (40,170 B, pngquant 60–90).
- **Layout.** Rows are HOLD/AGE/STEP/TINT. The top block is 390×844 **coarse** (hasTouch, `(pointer: coarse)` witnessed), DPR 2 shown at 0.5, with 6 columns: chromium light P4 +100 ms · chromium light P4 rest · chromium dark P4 rest, then WebKit likewise. The bottom block is 1280×800 **fine** DPR 1 at 1: chromium light P4 rest · WebKit light P4 rest.
- **Retires** both pass-6 crops: `pass6/prototype/NOTE-LEDGER/B-LEDGER-390x844-coarse-light+dark-four-arms-P1-P2-P4-chromium.png` (67,390 B) and `…-webkit.png` (71,333 B). That credits 138,723 B against the 40,170 banked. `check-evidence-policy` PASS.
- **What it shows**, each arm framed where it differs:
  - P4 rest: HOLD = STEP = TINT (two lines, both α 0.68, both engines, both themes; line one reads `/ 0.68` in the computed colour).
  - AGE: one caption under an empty line (the lost thesis pose), both cells.
  - +100 ms: HOLD's line one at α 0.894 (chromium) / 0.747 (WebKit) and STEP's at 0.863 / 0.725, against TINT's already-quiet 0.68.
  - AGE at +100 ms: the sentence on both lines (gap 2's double paint).
  - The 1280 fine panel is re-shot (ERASE's gap).
- **Caption carries:**
  - HOLD at α 0.68 at ask + 1.21 s
  - TINT's (and HOLD's) cost of 4.357
  - the settle-curve paint move (`--ease-standard` → `--verb-layDown-ease`, chair §2)
  - the swap's 160 ms double paint on this base (gap 2)
- **Declared variables:**
  - the desk panels are cut at the fold (the strip sits at y 764 of 800)
  - the +100 ms column is a photograph mid-transition, so a few ms of box jitter move its α

### Row 3 · `check-font-coverage.mjs --self-test` for `closed: true`

**What changed:**
- `MUST_CLOSE = ["marginRecordCopy"]`. A group deriving it without `closed` is a PROBLEM on every run (text identical to ERASE's carry).
- `--self-test` carries two plants: the flag deleted must red, and the flags as they stand must not.
- `package.json` `test:font-coverage` now passes `--self-test` (the union's own line).
- The `:326` comment now reads `closed` (**above**).

**Final sha1 exits:**

| case | exit |
|---|---|
| clean | 0 |
| **`closed: true` deleted + a call site re-worded** | **1** (pass 6: 0) |
| the flag deleted alone | 1 |
| the self-test's own plant sabotaged (`MUST_CLOSE = []`) | 1 |

### Row 4 · The landscape clip gains `white-space: nowrap`; the third arm is named

The rule and its comment now say this is a THIRD arm of the depth ballot, not a default. Tree DEV, coarse DPR 3, P3, both engines (`logs/probe-tree.log`):

| cell | line two | a11y | strip bytes vs `display: none` | scrollHeight |
|---|---|---|---|---|
| 844×390 | `clip-path inset(50%)`, **`white-space nowrap`**, absolute, 1×1 | one line, `- paragraph: only 5 fits here` | **0** / 4,833 (chromium) · 0 / 6,444 (WebKit) px | 410 |
| 812×375 | same | same | 0 / 4,631 · 0 / 6,174 px | 395 |

### Row 5 · The berth through the tab

Cited, not built: see gap 6.

### Row 6 · Row 10's 16×16 payload, read back

**The payload.** `?board=ATQuMDIwMDAwMDA5MGJjMGVm…` (346 chars, rawSize 4). It is a pattern-solved 16×16 with a deterministic 40 % of the cells given: 104 givens.

**Read-back.** 256 inputs. The aria-label corpus reads **104 of 104 givens, 0 mismatched, 0 extra**, with glyphs `1…9 A…G` (for example `Row 1, column 11, given clue B`). This holds in chromium and WebKit, on the tree AND on the control. So the app dealt the payload, not its own board.

**Join timing.** In page, 1,000 reps × 7: 0.0062–0.0074 ms (chromium) and 0.007 ms (WebKit) median per 256-value join. See gap 9.

### Row 7 · @property / C4

| tree | census | `check-property-block` (source) |
|---|---|---|
| union (`74a2b5d9 + s13-s7-s3.diff`) | exit **0** (TIMING 0, other 0, stale 0) | **GREEN** (served clause unread: no dist, said so) |
| this tree | 1 (TIMING 4 at `MarginNote.vue:299/313/314/518`) | 1 (C4 `motionRungs.ts:26`) |
| control | 1 (the declared STALE row) | 0 |

This tree's copy (`motionRungs.ts`, `publishMotionRungs` at `main.ts:14/16`) is **declared dead-by-fold**. The union doesn't add it (integrator STEP 2).

### Row 8 · Apply checks (`logs/apply-checks.txt`, fresh archives)

| patch | on | exit |
|---|---|---|
| full diff (15 files +2723/−72, 155,269 B, sha1 `f180e9da…`) | fresh `74a2b5d9` | **0** |
| pass-7 delta −U3 (7 files +1106/−98, sha1 `98995b5c…`) / −U1 (`39c4c12c…`) | `74a2b5d9 + pass6.diff` | **0 / 0** |
| pass-7 delta −U3 | the union | **1**: `package.json` only |
| the same, `package.json` reversed | the union | 0 (already carried) |
| pass-7 delta −U3 / −U1, minus `package.json` | the union | **0 / 0** |
| pass-7 delta −U3, minus `package.json` | union + ERASE7 | 1: `check-font-coverage.mjs` and `MarginNote.vue` (ERASE's carry holds the same substance; gap 4) |
| `pass7-on-erase.diff` (the union form, sha1 `829c82a7…`) | union + ERASE7 | **0** |
| `swap-fence.PROPOSED.diff` (`c922f85a…`) | union + ERASE7 | 0 |

## Pre-return battery (bare; tree vs a `git archive 74a2b5d9` control with `.github`; `logs/battery-final.log`)

| gate | tree | control |
|---|---|---|
| lint:lanes · lint:theme-tokens · lint:sleep | 0 · 0 · 0 | 0 · 0 · 0 |
| lint:bands · lint:verbs | 1 · 1 (no such script) | 1 · 1 (same) |
| test:e2e:projects · check-pw-projects | 0 · 0 | 0 · 0 |
| lint:ink (with the reserve row + 7 plants) · test:font-coverage (`--self-test`) | 0 · 0 | 0 · 0 |
| lint:copy · check-copy-register (bare; no new product strings) | 0 · 0 | 0 · 0 |
| lint:motion · lint:live-regions · lint:boundary · **lint:knip** | 0 · 0 · 0 · 0 (knip read 1 on the first battery, 20 unused library exports; cured with `@public` tags) | 0 · 0 · 0 · 0 |
| `eslint .` · `npm run lint` (`prettier --check … src/ scripts/ ../../scripts/ ../relay/`) | 0 · 0 | 0 · 0 |
| `check-property-block` source (pass6 copy) | **1** (C4, gap 5) | 0 |
| undefined-token census (pass6 copy) | **1** (TIMING 4, gap 5) | 1 (declared STALE) |
| `vue-tsc --noEmit -p tsconfig.json` on a `git archive` + final diff | 0 | 0 |
| vitest, chunked by directory, then whole | whole **0 · 69 files / 849 tests** (pass 6: 851; −2, the deleted reserve describe). The `src/lib` chunk exits 1 on "no test files" | — |
| vitest `src/pencil` + `src/games/shared` on union + ERASE7 + LEDGER7 | 0 · 49 files / 573 (ERASE's critic: 575 on union + ERASE7; −2, the same describe) | — |
| `check-evidence-policy` (main) | PASS | — |

## Ballot rows for the owner (U-10; nothing fires before the eye)

**T9-B-LEDGER.** HOLD (the default) · AGE · STEP · TINT, on the integrated section. The frame is above.
- **HOLD:** quiets at the sentence's arrival + 1.21 s. It pays T9-R8's 4.357 at rest, like TINT. Its push double-paints for ~165 ms on this base unless the fence lands.
- **TINT:** quiets at the proof, within 12 ms. Otherwise it equals HOLD at rest.
- **STEP:** equals HOLD at P4. It steps a proof down at the next write by any hand (pass 6).
- **AGE:** loses the thesis pose (one caption).
- **The default's loss:** the same painted statistic as TINT's. The control clears 4.5 where HOLD reads 2.563 / 2.866 whole-population at DPR 1 light. That's the estate row T9-R8.

**The landscape depth.** Three arms: clip (+nowrap; this tree) · `display: none` (pass 5) · in flow (+17 / +16 px). The first two paint the same bytes (0 px), so there's no crop.

**The hand's cut** (R6 law 30): unchanged, 46 → 54 codepoints, ≈ +750 B.

## r0 / R6 rows

- MOVED: R3-d and R3-g, unchanged from pass 5's PROPOSED diff. Nothing moved their subject.
- NOT moved: R3-a, R3-a2, the heading voice, board covisibility, law 27, L17.

## Replay route

**In place.** At open, `git diff --shortstat` read 10 files +1519/−71 (tracked only). BANKED.txt's 12 files +1714/−71 includes the 2 untracked files, and 161 + 34 = 195 lines accounts for the difference exactly. With them added, the tree read 12 files +1714/−71, equal to BANKED. Every one of the 12 files `cmp`-equals `74a2b5d9 + pass6.diff`, applied fresh.

The pass-7 delta is 7 files +1106/−98:

| file | change |
|---|---|
| `scripts/shape/shape-census.mjs` | +881, new |
| `scripts/shape/reserve-law.mjs` | +112, new |
| `check-ink-pressure.mjs` | +57 |
| `check-font-coverage.mjs` | +44 −1 |
| `MarginNote.test.ts` | +6 −94 |
| `MarginNote.vue` | +5 −2 |
| `package.json` | +1 −1 |

## Incidents (self-declared)

1. **I touched the work tree's REAL index.** At open I ran `git add -N .`, which marked the two untracked files intent-to-add. I meant to cut through a temporary index. It moved no content. At return I undid it with `git reset -q -- <the two paths>`, so `git status` shows them `??` again, as at open. Every later cut went through a temporary `GIT_INDEX_FILE`.
2. **My first fence build failed.** I cut the patch with `a/a/web` paths, and `patch -p3` wrote `Oops.rej` into the SCRATCH union tree. I moved the file to `<scratchpad>/trash-ledger7-1/`, re-cut the paths, and applied with `git apply`.
3. **One apply-check line read 129.** My wrapper passed `-R --include=…` as ONE argument. I re-ran it with split args: 0. Both lines are in the log.
4. **The probe file changed during the arm run.** I re-cut `settle` to time from the ASK after the smoke run, and I added the `reserve` mode while the arm run was going. The full arm run used the re-cut `settle` from its first invocation, and nothing else in the file changed under a running mode. The smoke log is not banked.
5. **The first battery read `lint:knip` 1** (20 unused library exports). I added `@public` tags, and the final battery reads 0. After the tags, the chair's plant battery re-ran against the landed copy with identical verdicts.
6. **`/tmp/knip.<pid>`: one write outside the scratchpad** (a knip log).
7. **Cleanup:**
   - **Servers.** Each server was killed by its recorded listener and wrapper PIDs, and :4248 and :4249 read free at return. The arm previews on :4249 were listener 3159 and its successors, logged in `probe-arms.log`. The tree DEV server was 30035 (wrapper 29972) and the control preview 30033 (wrapper 29973).
   - **Scratch configs.** They were `.mts` in `<work>/web/frontend/.note-ledger7/`, with cacheDirs outside the root, and were moved to `<scratchpad>/trash-ledger7-1/`.
   - **Scratch dirs and rm.** No `rm` of any form. Scratch lives under `<scratchpad>/ledger7-*`.
   - **Git scope.** No git ran in the control tree.

## Files

**Product** (work tree, uncommitted): the 12 pass-6 files, plus this pass:
- `scripts/shape/shape-census.mjs` (new)
- `scripts/shape/reserve-law.mjs` (new)
- `scripts/check-ink-pressure.mjs`
- `scripts/check-font-coverage.mjs`
- `package.json`
- `src/pencil/chrome/MarginNote.vue`
- `src/pencil/chrome/MarginNote.test.ts`

**Evidence** (this dir):
- **The crop.** One crop (40,170 B).
- **`probe/`:** `ledger7.mjs`, `composite7.mjs`.
- **`instruments/`:**
  - the pass-7 deltas: `pass7-delta.U3.diff`, `pass7-delta.U1.diff`, `pass7-on-erase.diff`
  - the PROPOSED fence: `swap-fence.PROPOSED.diff`
  - the landed-vs-chair diffs: `landed-vs-chair.{shape-census,reserve-law}.diff`
  - the shell scripts: `cut.sh`, `delta.sh`, `breaks.sh`, `build-arms.sh`, `run-arms.sh`, `run-tree.sh`, `battery.sh`, `vitest.sh`
  - the plant readers: `plants-dump.mjs`, `deep-plant.mjs`
- **`logs/`:** the classified rows. There is no raw JSON.
