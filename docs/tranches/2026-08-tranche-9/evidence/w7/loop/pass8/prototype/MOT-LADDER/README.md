# MOT-LADDER · pass 8 prototype

Work tree `.claude/worktrees/wf_f72f3b5a-83a-59` (the one §13 tree, shared with MOT-VERB), base and π control `74a2b5d9`. This pass is gate-only: no file under `src/` moved. The dist is byte-identical (whole-directory `diff -r`, 44 files) to MOT-VERB's clean pass-7 identity, `index-BHJMbOny6cIs.js` / `index-DyUCrBvpPVyw.css`, with 49 served `@property`. It was rebuilt out of tree after the last edit with a private cacheDir. There are no frames and no lawful pairs, so the headroom spent is 0 B. The number is the critic's.

## Open: the tree against its bank

At open, the temp-index write-tree was **`e7cc2ae8`**. That is MOT-VERB's pass-7 bank (`pass7/prototype/MOT-VERB/BANKED.txt`), not LADDER's `cb17b5f3`. This is by design: the §13 tree is banked once under VERB, and LADDER's `pass7-ladder.diff` cut lies underneath it. The task text names `pass7/prototype/MOT-LADDER/pass7.diff`, but no such file exists; LADDER carries `pass7-ladder.diff` and `-delta.diff`. I declared this before touching a file and kept everything. `homes.diff` sha1 `a1d8adeb…` was verified and landed as the chair's bytes (7/7 `cmp`). It could not go through `git apply --3way`, because `scripts/shape-census.mjs` was an untracked file on this tree, so it would be an add over an existing file. Instead it was applied to a scratch copy of `74a2b5d9`'s `knip.json` and the seven files were copied, with the pass-7 copies kept in scratch as the seed. The real index was never staged.

## Gaps first (open at return)

1. **Row 8 (product half): OPEN.**
   - On this tree the draw-in path (`usePathAnimation.ts`, `bootHand.ts`, `HandDrawnGrid.vue`) carries 0 timing literals outside MOTION; a code-only scan found one fraction and no clocks.
   - The "multi-home" that remains is the grid tiers: each carries a `DRAW_IN_PRESETS.*.duration` beside its `MOTION.hand.serial` rung (`serial ? MOTION.rungs[…] : preset.duration`).
   - Collapsing that is VERB's draw-in design and moves served bytes. It was not attempted, and no product literal moved.
   - Row 19's tokens (`--storybook-*`, `--motion-hinge-*`, `--motion-beat`) do not exist on this tree (0 grep hits in `src/`). C1–C6 cannot run on them, so the row is OPEN on VERB's toggle.
2. **Row 9: HALF.** GC1 now runs at two poses (desk 1440×900 and phone 390×844). Tree: 4/4 green, both engines. Control: 4/4 red. Row 15's fallback as a LEDGER row is the chair's mint; text proposed below. No row was minted.
3. **Row 6: the knip entry, OPEN by the chair's ruling.** `homes.diff` made `shape-census.mjs` a 67-export entry "for its exports" (registry-v7 §2.4). Product consumers now import 14 distinct exports:
   - `check-motion-bands`: 12
   - `check-theme-tokens`: 2

   The remaining 53 are kept alive by the entry. A lane may not trim the ONE copy (LAWS P7 §I).
4. **Row 7: RATCHETED, not ledger-rowed.** The four `chair: null` twins are frozen by name, with ceilings on their shipped readers:

   | Twin | Ceiling |
   |---|---|
   | starTuck | 2 |
   | starFade | 1 |
   | prmLinear | 1 |
   | dusk | 2 |

   A fifth lane-admitted twin reds, and so does one more reader. The ledger row per twin is the chair's.
5. **Row 11 (from VERB): not in this delta.** Per the charter, it is taken by sha after VERB banks.
6. **Residual doors, declared.**
   - (a) The consumer roster's floor is the STAMP. The ladder does not exist at `74a2b5d9`, so there is no base to re-derive it from. A swap plus `--bank` plus a re-stamped `BANK_SHA256` exits 0. It is the same door as rungs, and it is a script edit in review.
   - (b) B6's subject clause cannot see Vue SCOPING. L7b (`.cell.cell-reveal-animated`) and L7e (`.game-cell.cell-reveal-animated`) in `scene.css` both red lint:bands, but paint shows 0.3 s in both engines (`scene.css` is `<style scoped src>`, `[data-v-95909331]`, which never reaches DigitCell's element). This is an over-red, not an under-red. The pass-7 critic's "L7b ships whisper" is refuted in paint: two builds, both engines.
   - (c) The subject clause keys on class sets. It does not resolve elements (TAPE's `elementSites` is not wired). A new rule on a class the reveal's element co-carries (`.game-cell { animation-duration: 50ms }`) is a subject the clause does not reach, unless it is a class-less subject.
   - (d) The bank now also holds VERB's `hand.stepMs` 17 and `hand.bakeCeilingMs` 1200 as TS clocks, which were unbanked since pass 7. A VERB change to `stepMs`'s shape (the rate cap, LAWS P7 §F) needs a DELETED/MOVED/RETUNE row.
7. **Inherited red: `lint:knip` exits 1 on the tree.** The finding is `cubicBezier` in `src/pencil/config/pencilConfig.ts:489`, an unused export. It is identical on a `git archive e7cc2ae8` (exit 1, same line), so it came from VERB's pass-7 tree. The control reads 0. It is VERB's file and was not cured here.

## Numbers

**Plants through CI's exact invocations.** Each plant ran on a fresh copy of the final tree in a one-commit repo that fetched `74a2b5d9` by SHA (`instruments/plant-battery.sh`). Each column is a bare exit. The p7 column is the same plant through the pass-7 gate, bank and library (`e7cc2ae8`'s bytes, `instruments/bornred7.sh`): that is the born-RED.

| plant | what ships | bands | verbs | motion | tokens | propblock | p7 bands |
|---|---|---|---|---|---|---|---|
| none | — | 0 | 0 | 0 | 0 | 0 | 0 |
| L7a `html .cell-reveal-animated` @whisper (index.css) | **0.15 s both engines** | **1** | 0 | 0 | 0 | 0 | 0 |
| L7f `.game-cell.cell-reveal-animated` @whisper (index.css) | **0.15 s both engines** | **1** | 0 | 0 | 0 | 0 | 0 |
| L7b `.cell.cell-reveal-animated` (scene.css, scoped) | 0.3 s (does not reach) | 1 | 0 | 0 | 0 | 0 | — |
| L7e `.game-cell.cell-reveal-animated` (scene.css, scoped) | 0.3 s (does not reach) | 1 | 0 | 0 | 0 | 0 | — |
| L7c `:is(.board, .cell-reveal-animated)` @whisper | — | **1** | 0 | 0 | 0 | 0 | 0 |
| L7d `* { animation-duration: 50ms }` | — | **1** | 1 | 0 | 0 | 0 | 1 |
| L4 index.html `<style>` 50 ms | **0.05 s both engines** (with L7b) | **1** | 0 | 0 | 0 | 0 | 0 |
| L4p `public/plant-l4p.css` 50 ms | — | **1** | 0 | 0 | 0 | 0 | 0 |
| L1 longhand in the banked rule | — | **1** | 1 | 0 | 0 | 0 | 0 |
| L2 longhand in scene.css | — | **1** | 1 | 0 | 0 | 0 | 0 |
| L3 semicolon-less `animation-duration: 50ms }` | — | **1** | 1 | 0 | 0 | 0 | 0 |
| L5 `LIFT_MS = MOTION.rungs.whisper` | — | **1** | 0 | 0 | 0 | 0 | 0 |
| L6 App.vue beat 0 → whisper | — | **1** | 0 | 0 | 0 | 0 | 0 |
| M1 `Math.min(MOTION.rungs.whisper, 40)` | — | **1** | 0 | 0 | 0 | 0 | 0 |
| M2 `MOTION.rungs["whisper"] / 3` | — | **1** | 0 | 0 | 0 | 0 | 0 |
| M3 `MOTION.rungs.whisper >> 2` | — | **1** | 0 | 0 | 0 | 0 | 0 |
| E1 main.ts `setProperty("--ease-anticipatePop","ease-in")` | **ease-in on the reveal and the toggle's star, both engines** | **1** | 0 | 0 | 0 | 0 | 0 |
| F1 `.live-face-fit { --live-fit: 0.99 }` (the base rule) | **GC1 RED 665×665 both engines** | **1** | 0 | 0 | 0 | 0 | 0 |
| NN1 a compound at dusk (350 ≥ 300) | — | 0 | 0 | 0 | 0 | 0 | — |

Twenty plants red lint:bands; the two NEGATIVEs read 0. On the pass-7 gate, 15 of the 16 shared plants exit 0. L7d reds there only incidentally, through B1.

**Behavioural rows (`instruments/ladder8-behave.spec.mjs`).** These drive the product. A fresh deal arms the givens' reveal, and the read happens in the same task that finds the armed cell. The toggle is then pressed. Settings: 1440×900, fine pointer. Rows are in `logs/behave.jsonl`.

| arm | js | reveal (chromium / webkit) | `--ease-anticipatePop` | the toggle star's curve |
|---|---|---|---|---|
| control :4250 | `index-CubiZsMVSwTc.js` | 0.3 s / 0.3 s, cubic-bezier(0.68,−0.55,0.265,1.55) | the house bezier | bezier, ease-out |
| tree :4246 | `index-BHJMbOny6cIs.js` | 0.3 s / 0.3 s | the house bezier | bezier, cubic-bezier(0,0,0.58,1) |
| L7a+E1+F1 | `index-jMXKgcZcF4in.js` | **0.15 s ease-in / 0.15 s ease-in** | **ease-in** | **ease-in**, … |
| L7f | `index-BfmXKlkGnHxw.js` | **0.15 s / 0.15 s** | house | house |
| L7b+L4 | `index-Bd1B7yIYVsfl.js` | **0.05 s / 0.05 s** | house | house |
| L7b | (the same dist name) | 0.3 s / 0.3 s | house | house |
| L7e | `index-Dj83eg3Skqmt.js` | 0.3 s / 0.3 s | house | house |

GC1 on the L7a+E1+F1 dist is **RED in both engines, `[665, 665]` for `[0, 0]`**. Two earlier reads were rejected:

- The first F1 build planted into `.game-card.is-folding .live-face-fit`, the first match of its anchor, and GC1 read green. That read was not cited.
- The first WebKit reveal read raced the disarm (`n 0`). It was re-read with `waitForFunction`, in the same task.

**The gate's clause-sabotage battery** (`node scripts/check-motion-bands.mjs --sabotage-battery` runs each clause off in a child process, `MOTION_SABOTAGE=<id>`). Each clause is required to red the self-test. Result: **16/16 RED**.

| clause | the plant that reds |
|---|---|
| subject-reach | L7a (8 cases) |
| collect-sources | the index.html NN |
| lib-decls | L3 (2) |
| longhand-term | L2t |
| consumer-roster | L5 (4) |
| arith-lib | M1 (5) |
| curve-publishers | E1 (3) |
| fit-one-writer | F1 (3) |
| knobs | `BASE_REF: HEAD` (2) |
| twin-ratchet | the fifth twin (2) |
| rung-ratchet | `throw` 520 → 500 |
| site-ratchet | a banked site shortened (2) |
| orphan | the two-step (2) |
| ts-ratchet | INTAKE-23 row 18 |
| floor-digest | a bank raised, not re-stamped (new; floor-digest was GREEN on the first run, cured with its plant) |
| floor-derive | A2c |

**The gate's self-test.** 119 RED as they must, 28 HELD, 0 vacuous, 0 crashed. Pass 7 had 91/18.

**The ONE library.**

- **Self-test:** 95/95.
- **Clauses:** 43/43 planted.
- **`--sabotage-battery`:** 43/43.
- **Born-RED against the chair's homes copy:** 91/95. The four fails are exactly this pass's extensions:
  - `clock-arith`: `||` is not `|`, and `op` is returned
  - `custom-case`: a custom property is never kebab-cased
  - `value-parens`: a `setProperty` value keeps its parentheses
  - `clock-alias`: a bare alias is a clock read
- **Library bugs this pass found and cured, each by a plant:**
  - `custom-case`: `scriptWrites` kebab-cased `--ease-anticipatePop` to `--ease-anticipate-pop`, so no camelCase custom property's script write was ever found.
  - `value-parens`: a `cubic-bezier(…)` value was cut at its first `)`.
  - `clock-arith`: `props.noiseDelay || DRAW_IN_PRESETS.glyph.baseDelay` read as bitwise arithmetic.

**Row 10.**

- `git fetch --no-tags --depth=1 origin 74a2b5d9317e…` against `https://github.com/mkbabb/csp-solver.git`, in a scratch repo: exit 0. `74a2b5d9^{commit}` resolves, and `index.css` reads 56,695 B (`logs/https-fetch.log`).
- The gate now asks git for the whole 40-hex SHA. `BASE_REF` and `ROOT` are pinned, and an env override is a B6 finding (`knobFindings`, with plants).
- The `ci.yml` comment is re-cut (+2 lines).

**Union** (`74a2b5d9 + s13-s7-s3.diff + homes.on-s13-s7-s3.diff` = `1f8a729a`, plus the on-union delta = `caa4898a`, in a one-commit scratch repo):

| Gate | Exit |
|---|---|
| lint:bands (self-test) | 0 |
| lint:theme-tokens | 0 |
| lint:ink | 0 |
| lint:verbs | 0 |
| lint:motion | 0 |
| lint:lanes | 0 |
| test:font-coverage | 0 |
| shape-census `--self-test` | 0 |
| shape-census `--tree` (anchor PRESENT, 28/28) | 0 |

The library is byte-identical on the tree and the union.

**Pre-return battery, bare, tree | control** (control = `git archive 74a2b5d9` of web/frontend, .github, scripts and web/relay; served control :4250 `index-CubiZsMVSwTc.js`).

| Gate | Tree | Control |
|---|---|---|
| lint:lanes | 0 | 0 |
| lint:theme-tokens | 0 | 0 |
| lint:sleep | 0 | 0 |
| lint:bands | 0 | 1 (absent) |
| lint:verbs | 0 | 1 (absent) |
| lint:motion | 0 | 0 |
| lint:copy (M16) | 0 | 0 |
| test:e2e:projects | 0 | 0 |
| check-pw-projects | 0 | 0 |
| check-property-block, source | 0 | 0 |
| check-property-block, served | 0 | 0 |
| shape-census `--self-test` | 0 | 1 (absent) |
| npm run lint | 0 | 0 |
| eslint . `--max-warnings 0` | 0 | 0 |
| lint:knip | **1** (inherited; gap 7) | 0 |
| vue-tsc -b (on an rsync copy) | 0 | — |
| vitest, by directory | 70 files, 842 tests, 0 failed | — |
| `ladder-prm` ×4 + GC1 ×2 poses, both engines | 12/12 green | 12/12 RED |
| check-evidence-policy | PASS | — |

- **π:** 0 served bytes moved against the pass-7 clean build.
- **AA:** no painted byte moved.
- **filterBudget:** unmoved (no `src/` byte).
- **M16:** `lint:copy` reads 0. This pass adds no UI strings.

**Box load (1-min):** 31.5 at open, then 36–57 through the batteries. Other workflows were live, and no timing row is cited.

## Rows (the charter's numbering)

1. **CLOSED on the plants.** B6 keys on the SUBJECT COMPOUND through the library's `subjectCompound` / `compoundClasses` / `splitTop`. A NEW key whose subject carries every class of a banked subject cannot ship below it:
   - Scope: the same family, and the same term unless it is an animation or a longhand.
   - Class-less subjects reach everything.
   - The escape is a RETUNE on the new key.
   - L7a, L7f, L7c and L7d red, with their computed reveal read in both engines. Scoping is gap 6b.
2. **CLOSED.** `collect()` walks `sources(ROOT)` (index.html, public/**, every CSS language, `@import` chains) beside the src/ walk. The library's own reading is the census of record: a declaration it reads that the positional scan missed is collected. That gives the semicolon-less declaration; it adds 0 on the lawful tree. A longhand is keyed by its property. L4, L4p, L1, L2 and L3 red.
3. **CLOSED.** The consumer roster is banked in `motion-bank.json` (`consumers`, 55 reads) and ratcheted:
   - A read that leaves with a SHORTER read gained in its file reds (L5, L6, and the destructure).
   - A read that leaves with nothing gained needs a DELETED/MOVED row.
   - B13 detects through the library's `clockReads`: `Math.*`, a bracket into a numeric group, and every operator but `+` (M1, M2, M3, a bare alias, a computed bracket).
   - Two computed reads are ADMITTED by name.
4. **CLOSED.** B8's `curveTokens` reads script publishers through `scriptWrites`. A non-literal value or computed name is UNRESOLVED and reds. E1 reds, and its computed curve was read in both engines.
5. **CLOSED.** `fitOneWriter`: every `--live-fit` site the library's `tokenSites` reads is either the registration or App.vue's one publisher, else RED. F1, a `:style` key and a second `setProperty` each red. GC1 reds F1 in paint.
6. **CLOSED for the gate, OPEN for knip** (gap 3). Everything runs through the ONE library at its product home, with four extensions landed there with plants and the sabotage battery above.
7. See gap 4.
8. See gap 1.
9. See gap 2.
10. CLOSED (above).
11. See gap 5.
12. **INTAKE-23 §4:**
    - **Row 17 PARTIAL.** Arm 1: 0 timing literals on the draw-in path. Arm 2: `check-motion-contract` bare 0. Arm 3: GameGallery's reveal has the same values, `gridFrame.duration` 350, base 218, stagger 90, but it is not byte-identical: `MOTION.boardFoldMs * 0.42` became `MOTION.rungs.throw * (…0.42)` and `90` became `MOTION.dealStaggerMs`, both prior passes'. The multi-home remains (gap 1).
    - **Row 18 CLOSED.** The self-test's T4/T4ok/T4n rows (red / held / red) ran in this pass's 119/28 self-test, and `ts-ratchet`'s sabotage reds on it.
    - **Row 19 OPEN.** C1–C6 cannot run on tokens that do not exist on this tree. lint:verbs and lint:bands are bare 0.

## B-RATCHET (§2.16; numbers only)

- There is no pair: 0 served bytes moved.
- **The default's LOSS:** the ratchet over-reds a compound that Vue scoping keeps from reaching its element (L7b and L7e, 0.3 s painted). It asks a RETUNE or a re-spelling of a rule that is not a shortening.
- **The default's residual door:** the consumer roster's floor is the stamp (gap 6a).

## Proposed LEDGER row (row 9, the chair's to mint)

> `--live-fit` is registered `<number>` at initial 0. It has one writer, App.vue's `mount.style.setProperty`, and it is read bare as `scale(var(--live-fit))`. Any fallback, declared default or second writer reds lint:bands B3. GC1 reads the ablation at desk 1440×900 and phone 390×844, in both engines.

## Replay route

Advanced in place: no replay. The route:

1. `git read-tree e7cc2ae8` into a temp index, then the seven homes files → `5ccf0a6e`.
2. Apply `pass8.delta.own.diff` → `547b50d5`.

Equivalently, `pass8.diff` on `74a2b5d9` (temp index) → `547b50d5`. For the union, `pass8.delta.on-s13-s7-s3.diff` on `1f8a729a` → `caa4898a`. The instruments to re-run are in `instruments/`:

- `plant8.py <fe> <plant>`
- `plant-battery.sh`
- `bornred7.sh`
- `prereturn.sh <fe> <url> <label> <dist>`
- `ladder8-behave.spec.mjs` with `pw-behave.config.mjs` (`L8_ARM`, `L8_OUT`, `PLAYWRIGHT_BASE_URL`)
- `pw-tree.config.mjs` for the tree's two specs

## Bank line

**Tree `547b50d5`.**

| Diff | Bytes | sha1 | Shortstat |
|---|---|---|---|
| `pass8.diff` | 865,797 B | `ec7a362f` | 69 files +17136/−340 |
| `pass8-ladder-delta.diff` | 372,299 B | `21e270ff` | 11 files +7264/−322 (homes plus this pass) |
| `pass8.delta.own.diff` | 76,854 B | `631bf490` | 5 files +1249/−47 |
| `pass8.delta.on-s13-s7-s3.diff` | 76,890 B | `3d2cfea0` | — |

`apply --check` readings:

- `pass8.diff` on `74a2b5d9`: **0**.
- `pass8-ladder-delta.diff` on `e7cc2ae8`: **0**.
- `pass8.delta.own.diff` on the union: **1**, at `check-motion-bands.mjs:2247`, the union's S1 rows. It was rebased by `git merge-file` with both row sets kept.
- `pass8.delta.on-s13-s7-s3.diff` on `1f8a729a`: **0**.

Details are in BANKED.txt.

**Imports, relative only:** `scripts/check-motion-bands.mjs → ./shape-census.mjs`; `scripts/check-theme-tokens.mjs → ./shape-census.mjs`. There are no `docs/` imports in `e2e/` or `scripts/`. The e2e/lib homes are landed but not yet imported by this family's specs, since no paint instrument row was needed.

## Incidents (self-declared)

1. **Stray file on main.** One early gate run wrote its log to `../../../../../scratch-dummy`, a relative path that resolved to the MAIN repo root. It was moved to scratch (`mv`, no `rm`) within the minute; main's `git status` now shows only the loop's docs dirs and the owner's `.owner/`.
2. **Plant restoration.** The plant copies were restored between plants with `rsync --delete` into my own scratch. No `rm` was invoked anywhere, and no deletion reached a worktree or main.
3. **Edits during the first plant battery.** The first plant battery (run 1) ran while I edited the gate (a lint fix in the sabotage CLI, the twin ratchet and the digest plant). It was stopped by PID 40589, re-synced, and re-run in full on the final bytes; only run 2 is cited. The first gate sabotage battery found `floor-digest` GREEN. It was cured with its plant and re-run: 16/16.
4. **Two rejected behavioural reads.** The first F1 plant anchored on the folding rule, and the first WebKit read raced the disarm. Both were rejected and re-read (see above).
5. **Servers.** Every server was started by me and killed by recorded PID after a cwd check:
   - tree :4246 PIDs 21499/21404 and 37610/37544
   - plants :4246 PIDs 24674, pb2, pb3, pb4 and pb5, each verified by cwd under `ladder8/`
   - control :4250 PIDs 21492/21402

   Both ports read free at return. No git ran in the control tree, which was only served and read by path.
6. **Vite temp file.** Vite wrote its temp config under main's `node_modules/.vite-temp` through the symlink and removed it itself. The directory reads empty.
7. **Tree state at return.** The worktree's `git status` shows product files only: 65 entries, which are the 64 of pass 7 plus `e2e/lib/`. All scratch lived in the session scratchpad. Nothing was committed.
