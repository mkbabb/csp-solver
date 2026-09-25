# ACC-SIX · pass 7 prototype

Work tree `.claude/worktrees/wf_f72f3b5a-83a-45` (base `74a2b5d9`), advanced in place from the pass-6 bank. Nothing committed. The charter is `pass6/charters/ACC-SIX.md` (rows 1–7). Both engines ran every number below. The control is `.claude/worktrees/w7-control` on `74a2b5d9`, served on :4238 (never git'd, never built).

## Gaps first

1. **The 60 Hz WebKit floor and the tally flash come with FIVE's A.6 cure.** They were taken by sha, and FIVE's critic instruments read them on this tree:
   - gate60, whole ms, WebKit: synth 40.2/s, native 40.6/s. Chromium: 60/58.
   - tally-flash: tier-changing inks flash in 3/7 on Chromium and 1/7 on WebKit.

   Both are FIVE's rows. This tree does not re-cure them (`logs/tally-flash-inherited.log`, `instruments/gate60.COPY.mjs`).
2. **G10 battery 1 has two Chromium reds** (load 10–21), both from runs made while I was editing the lane's scripts. They are kept as witnesses and not waived:
   - gated3: "tally never re-cut", FIVE's tally flash.
   - gated5: 0 records at 0 Hz. The likely cause is a dev-server reload from those edits, but that is not verified.

   Battery 2 ran on a quiet tree and is the G10 of record.
3. **Check 8 FLOOR BAND is red on the tree and green on the control** (`check-pw-projects`, `test-e2e-projects`). filter-census is stamped at 6 but the live census is 8, which is pass 6's growth of the spec. The integrated tree `74a2b5d9+s13-s7-s3` already reds 5 FLOOR BAND rows of its own, so the chair restamps them all at once. This tree does not stamp.
4. **The voice wraps to 2 rows on its own at 393 and at 812** on a real hint. This is at press 3, where the strip reads 41.59 at 393 and 43.94 at 812 whether or not the count is shown. It is the note's height, not the count's. The yield row therefore measures the count by differential (with vs without), not against the rest height.
5. **Font census: four sinks are declared blind spots** (`UNRESOLVED_SINKS`), each with a reason:
   - App.vue `sceneFor(scene)`
   - BoardHost `spec.furniture.cell`
   - BoardHost `spec.clues.overlay`
   - GameCard `Poster`

   The overlay pin also declares an OPEN estate row. Kenken's `+` (U+002B) and `÷` (U+00F7) fall outside the hand's unicode-range. That is a subset re-cut for the chair, not SIX's.
6. **Law 20's T1 resolves a bound name heuristically** (a 160-char lookback to the wrapping attribute or style key, or the named variable's bindings). Any URL it cannot resolve reds; it never passes silently.
7. **The undefined-token census exits 1 on the tree and 1 on the control.** It is one declared STALE row and net green (A.1).
8. **A transient HARD blink appeared once, in strobe sample 1** (Chromium HARD:22g, w 1→0→0→1). It did not reproduce: 2 debug runs plus a 4-run repro (`logs/strobe-hard-repro-4runs.log`, pattern `.M......` ×4) show the count laid down once and gone after, with no return.

## Numbers

### Row 1: the yield's e2e row (`e2e/count-yield.spec.ts`, sha `bd15d767ff55`)

Cells 393×699 and 812×375 on the P16 widest pair (86 givens, 170 writable, "1 of 170 on the board"). The viewport is coarse with `hasTouch`, witnessed, and PRM is frozen. Tree dev :4237, `logs/yield-row-final-spec.log`, load 21.8.

| arm | chromium | webkit |
|---|---|---|
| tree | **exit 0** | **exit 0** |
| yieldoff (the `yielded` report deleted) | exit 1 | exit 1 |
| pass6 (report deleted, clip-path back) | exit 1 | exit 1 |
| unheight (report deleted, meta `height:0` undone) | exit 1 | exit 1 |

What each arm reads:
- **tree:** the strip holds 20.8 through rest, laid and widest at 393. The tab reads 508.73 in Chromium and 508.42 in WebKit. At 812 the strip goes 20.8 → 21.97 and the tab 159.09 → 159.67, the same with and without the count. The meta is `-` from widest on, with no ROW2.
- **yieldoff:** reds "the count yields" and "never paints on a second row".
- **pass6:** reds the same two clauses.
- **unheight:** reds the yield clause and "adds no height to the strip" (earlier run: 38.98 vs 20.8, 40.16 vs 21.97, tab ±9.1).

The negative moved: the rule deletion now IS the cure, so the negative is the deleted report. See MOVED below.

### Row 2: the strobe

393×699 coarse, DPR 2, PRM, 10 distinct deals: 9×9 EASY, MEDIUM and HARD ×3 each, plus P16 (`logs/strobe-sample2-*`).

| engine | tree | pass-6 arm |
|---|---|---|
| chromium | laid 10, yielded 5, **blinks 0** | laid 10, yielded 5, **blinks 4** (P16 1829 → 0r2 → 1852 → 0r2) |
| webkit | laid 10, yielded 5, **blinks 0** | laid 10, yielded 5, **blinks 4** |

Once the count yields it stays hidden (HOLD). B-YIELD is answered by the hold, so no ballot is needed.

### Row 3: G10 with FIVE's A.6 cure taken by sha

The shas: gridPaths `e7b17bf7a28a` (FIVE's `8cfe6cb23b46` minus two comment words), spec `27172a6c463e`, DifficultyTally `6edac563e47f`, pencilConfig `7a8bcfabd31d`, poseFronts test `bedda191872e`. HandDrawnGrid was merged by hand.

Battery 2 (`logs/g10-battery-2*`), box load 9.39–17.12 while gated, siblings 23–77:

| | chromium | webkit |
|---|---|---|
| gated runs | 6/6 exit 0, **0 red** | 6/6 exit 0, **0 red** |
| clock | 128.2–129.9 Hz | 125.0 Hz |
| min gap (DOM) | **16.0 ms (15.8)** | **17.0 ms (16.0)** |
| worst gauge / tally / join | 50.0–53.5 / 45.9–48.8 / 47.1–50.6 per s | 45.8–48.5 / 43.2–46.2 / 43.3–45.9 per s |
| ablated (the gate removed, :4244) | exit 1, 126.0/s | exit 1, 125.5/s |
| clock60 (negative precondition) | exit 1, 59.9 Hz | exit 1, 58.8 Hz |

Battery 1 is gap 2.

### Row 4: law 20 and the font census re-keyed on SHAPE

The chair's library is vendored byte-identical at `scripts/lib/shape-census.mjs` (sha `3ba7738ee8d4`). It parses per language with `stripCss`, `stripJs`, `stripHtml` and `sfc`. Current shas: `check-theme-tokens.mjs` `4e986f901533`, `check-font-coverage.mjs` `bc6216683278`.

Results (`logs/gate-plants-final.log`):
- The pass-5 doors (font ×6, law20 ×4) and the pass-6 doors (T1–T4, F1–F4) all exit 1.
- In-script self-test: 58 rows as required, 0 FAILED.
- The clean mirror is 0/0.

Negative control (`logs/gate-plants-pass6-scripts.log`): the pass-6 scripts pass T1–T4 and F1–F4 at exit 0, so the holes were real and are now closed.

New law-20 plants:
- T1 and T1′: a dynamic url bound by name
- T2 and T2′: concatenation
- T3: a gradient href by name
- T4 and T4′: a `/*` inside a string
- T5: an unresolved dynamic url
- 2 controls

New font plants:
- F1: `<component :is>`
- F2: `defineAsyncComponent`
- F3: named-default alias
- F4: `h()`
- an async `:is`
- 2 unresolved-sink plants
- 3 controls

### Row 5: the crayon-heart born-RED

`logs/filter-census-spec-3dists.log` and `logs/filter-count-boot-rest.log`:

| dist | spec (8 tests) | light boot / rest | dark boot / rest |
|---|---|---|---|
| control `74a2b5d9` | red G3.1d / G3.3d, both engines | 25 / 9 | **27 / 11** (crayon-heart 2) |
| tree (`index-Dx4v3BgsblSf.js`) | red G3.1d / G3.3d, both engines | 25 / 9 | 27 / 11 |
| integrated `74a2b5d9+s13-s7-s3` (`index-C4rwyft5SG8y.js`) | **8/8, both engines** | 25 / 9 | **25 / 9** |

The dark red clears where the chair's ratified deletion lives. filterBudget 9 is held at rest on the integrated tree.

### Row 6: the one lawful pair

`c2p7-T9-B-ACC6-2-heart-without-vs-with-dark-saturate-desk-dark-chromium-fine.png` (2,762 B, pngquant). The setup: integrated dist, P1 payload, dark, desk 1280×800, DPR 2, fine pointer, card opened by focus, heart clip 80×56.

`saturate(0.85)` changes:
- Chromium: 1,461 of 17,920 px, mean |Δ| RGB 1.11 / 0.31 / 0.07.
- WebKit: 1,538 px, 1.27 / 0.27 / 0.03 (`logs/heart-pair.log`).

It retires pass 6's `c2-T9-B-ACC6-2-arc-deep-vs-best-any-byte-desk-dark-chromium-fine.png` (deleted at the §2.18 sweep).

### Row 7: apply checks

Checked from fresh `git archive`s. Every diff is `--binary`, product paths only.

| diff | sha1 | bytes | shortstat | applies on | `--check` |
|---|---|---|---|---|---|
| `pass7.cum.diff` | `2d83be22cb82` | 243,779 | 27 files +4061 −152 | `74a2b5d9` | **0** |
| `pass7.delta.diff` | `ba8cef7873c7` | 121,257 | 17 files +1632 −155 | the pass-6 bank's tree | **0** |
| `pass7.delta.on-s13-s7-s3.diff` | `22e1956e5776` | 123,184 | 17 files +1633 −158 | `74a2b5d9 + s13-s7-s3.diff` | **0** |

The raw cumulative diff does not apply on the integrated tree, because the integrated tree already carries FIVE's front-rate/rate-clock/package.json and SIX's pass-6. The rebased delta is the integration's file.

On the rebase, MarginNote was resolved by hand:
- it reads `liveEl` for the note;
- one `defineEmits<{ left: []; yielded: [] }>()`;
- `readYield` fires only while `metaYields && meta && previous` (§7's line two), and the watch also reads `previous`.

## The design

- **MarginNote.** A ResizeObserver on the block and the voice, plus a post-flush watch on meta and text, reads whether the meta line wrapped below the voice's mid-line and emits `yielded`.
- **GameBoard.** `endCountLesson` hides the count, clears its timer and sets `taught = true`, so the count never returns within the deal. A new deal re-teaches.
- **The clip-path rule is deleted.** This also cures the 2–3 px trim of the voice's own ink. The meta keeps `height:0`, so the block never resizes and the observer cannot loop.
- **Unit row.** `GameBoard.count.test.ts` has "a YIELD ends the lesson". With the listener ablated, it reds.

## Replay route

1. The work tree is **in place**: it is pass 6's tree advanced.
2. FIVE's A.6 files: `git apply --include` of `pass7/prototype/ACC-FIVE/pass7.delta.diff` for front-rate.spec, DifficultyTally, pencilConfig, poseFronts.test and gridPaths. gridPaths is FIVE's with two comment words dropped. HandDrawnGrid was merged by hand.
3. The integrated check tree is a `cp -R` of `74a2b5d9 + s13-s7-s3.diff` into scratch (`acc6p7-integ3`). The delta was rebased there and re-cut after the late edits (btoa, knip).
4. Line-count check: the cumulative diff's 27 files equal the tree's `git status` (27 product paths).

## Battery (tree · control)

`logs/battery-tree-vs-control.txt`.

**Green on both (tree 0, control 0):**
- check-copy-register, lint-copy
- check-theme-tokens and its self-test
- check-font-coverage and its self-test
- lint-lanes, lint-sleep, lint-motion, lint-ink, lint-live-regions, lint-theme-selectors
- check-property-block, source and dist
- eslint (re-run bare after the scratch configs left: exit 0), npm run lint

**Differs from the control:**
- test-e2e-projects: tree 1, control 0 (gap 3)
- check-pw-projects: tree 1, control 0 (gap 3)
- undefined-token census: 1 · 1 (gap 7)
- knip: 0 on the tree after the library entry

**Typecheck** on a git archive of the final state: vue-tsc -b 0, typecheck:e2e 0, typecheck:node 0. Integrated tree after the late diff: vue-tsc -b 0, typecheck:e2e 0, knip 0.

**Units, chunked:** pencil 9/91, composables 3/16, games 58/752. That is 70 files and 859 tests, 0 failed.

**Dist:** the rebuild after the last source edit is identical (`index-Dx4v3BgsblSf.js` / `index-dSDbKN3CCoP9.css`, 37 files).

π on the tree dist against the control's, 4 cells, both engines:
- The column moves 0 and the floor is 0.
- Paint moves only at the declared tape seed (washi-label), progress-trace and user ink (claimed), and sparkle-icon serialization.
- `clip-path` joins the census and reads no row.

## MOVED (proposed, not applied)

- **The yield row's negative:** pass 6's charter named "the rule deletion" as the negative. The deletion is now the cure, so the negative moves to "the `yielded` report deleted" (plants `yieldoff`, `pass6`, `unheight`, all served in memory by `instruments/plant.mts`).
- **r0 hue-census rows:** the PROPOSED diffs carried from pass 6, unchanged.

## Incidents

1. **An `rm` ran from the pass-6 critic's copied plant script.** `c5-gate-plants.COPY.sh` ends with an `rm` of its own backups under another lane's scratch (`acc6crit6/p5plant/*`). I ran it once. The paths did not exist, so nothing was deleted, but it corrupted my mirror.

   Re-run: `instruments/c5-gate-plants.P7.sh` keeps its backups in `acc6p7-p5plant`, has no `rm`, and ran on a fresh mirror.
2. **I ran `git status` (read-only) once in FIVE's work tree** while locating its A.6 files. Nothing was written there.
3. **Possible dev-server reloads during G10 battery 1** from my concurrent edits to the lane's scripts (gap 2). Battery 2 is the record.
4. **Port 4242 was held by a sibling lane** (PID 86974). I left it alone, dropped my stale pid line, and served on 4243.

Every server was killed by recorded PID: 4237 27065, 4238 27067, 4239 83892 (plants 88438/89694/90849), 4241 83918, 4243 7369, 4244 46907. All six ports are free.

The scratch configs moved to `<scratchpad>/trash-acc6p7-1/`; copies are in `instruments/`.
