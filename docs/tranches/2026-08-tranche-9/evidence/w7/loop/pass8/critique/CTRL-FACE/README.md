# CTRL-FACE · pass 8 · CRITIQUE — 89 (from 88), ADVANCE

The adversarial critic for §10's leader. I didn't write the charter or the prototype. Tree
`.claude/worktrees/wf_f72f3b5a-83a-33` (HEAD `74a2b5d9`), served on :4234 (dist
`index-BVMs58yH2DcI.js`, identity checked from the served HTML). `w7-control` served on :4251 (`index-CubiZsMVSwTc.js`).
I ran no git in the control. Every plant ran on scratch copies under `<scratchpad>/crit-face8/`
and was restored with `cp -p` from the tree. Nothing was committed and the tree wasn't edited.

**Why 89 and not higher.** Pass 8 closed the pass-7 rows it named, on the real surface, and I reproduced them. The pass-7
plants all red now (16/16). The union block is ONE. The sideways range is gone in both engines.
The ring reads thickness.

But the class holes come back one level down:
- **The stamp.** It keys on `getModuleIds()`, and that list leaves out the two woff2 files CSS reaches by `url()`. Those
  are the Patrick Hand and Fira Code subsets, whose advances ARE the census's subject. The stamp also hashes binary
  files as UTF-8, so a changed Fraunces byte keeps the digest.
- **CHECK 7.** 4 of my 25 fresh shapes still exit 0. The gate is GREEN only on the lane's own extended home.
- **The forced-colours arm.** It counts pixels but not bands or thickness.
- **The fold's §10 card.** It carries two rings: solid on FACE's two sites, and s10's dashed generic
  `:deep(button:focus-visible)` on every other control.
- **Two instruments are hand-rolled beside their homes**, against LAWS §I.

## 0 · Gaps first (exact, each re-derived here unless marked *declared*)

1. **The stamp misses the build's CSS-url assets (row 4 not closed at its class).**
   - `.face-engine/dist-stamp.json` lists 129 files. The only font among them is `fraunces-subset.woff2`.
     `patrickhand-subset.woff2` and `firacode-subset.woff2` ship through `index.css`'s `url()`
     (`dist/assets/patrickhand-subset-BErGTS2qVUc8.woff2`, `firacode-subset-CbuNTc2aGjcY.woff2`), and
     `getModuleIds()` never names them.
   - Plants, mtime restored with `touch -r`, `node scripts/check-face-engine-identity.mjs --self-test` bare:
     - `patrickhand-subset.woff2` with one byte appended: **exit 0**
     - `firacode-subset.woff2` replaced whole by the Fraunces bytes: **exit 0**
   - The negative control in the same run was their `scene.css` letter-spacing plant: **exit 1**, reproduced. The
     cure covers the lane's plant and misses the assets.
   - This pass's own bank edits `patrickhand-subset.woff2`.
   - Readings: `readings/stamp-{clean,p1,p2,p3}.log`.
2. **The stamp hashes binary as UTF-8.**
   - Both `faceStamp()` (vite.config.ts) and `graphStamp()` read each file with `'utf8'`.
   - One byte of `fraunces-subset.woff2` flipped (offset 127, `0xfe` → `0xff`): `cmp` differs, the decoded strings
     are equal (`true`), and the gate reads **exit 0** (`readings/stamp-p4.log`). `avatar.png` is hashed the same way.
3. **CHECK 7: 4 of 25 fresh shapes exit 0.** The battery is `instruments/p8plants.py` and `run.sh`; the log is
   `readings/c7battery.log`.
   - **`style.setProperty("font", "16px Comic Sans MS")`**. The library reads `style.font` and
     `setProperty("font-family")`, but not the shorthand through `setProperty`. This one is in the charter's own class.
   - **`@font-face { font-family: "Patrick Hand"; src: local("Comic Sans MS") }`**.
   - **`document.fonts.add(new FontFace("Patrick Hand", "local('Comic Sans MS')"))`**. This and the one above are the
     same class: the voice resolves to the right NAME, and nothing reads which face that name is bound to. CHECK 7
     skips `@font-face` preludes outright, and the rendered row (`face-law.spec.ts` "the face law, rendered") reads
     computed `font-family`, which is blind to it too.
   - **The CSS-escaped property `font-famil\79: "Comic Sans MS"`**. LAWS P7 §F lists escapes as decoded before any
     id regex.
   - 21 red: the E1 shadow twin through a home-value hijack (A/A2 red via CHECK 6), nesting, `[font-family:…]`,
     `font-[family-name:…]`, `Object.assign`, bracket key, `v-bind()`, `:style` shorthand/array, `@layer`, `@supports`,
     h() style string, `cssText +=`, template-literal `setProperty` name, SVG inline style, a new `.css` file,
     `system-ui`, `font: caption`, and uppercase `FONT-FAMILY`. The CONTROL literal red, and the tree restored reads
     exit 0.
4. **ADMITTED_COMPUTED is keyed by file + key name, not by site.**
   - `function plantFace3(el, name) { el.style.setProperty(name, "Comic Sans MS") }` in `GameControlPanel.vue`
     exits **0**. It's admitted as `?name` beside the one real site at :679.
   - The same plant with a `const name = "font-family"` reds, because const-carried values are resolved.
   - The admission needs a count pin: exactly one site, at its line or by its value source.
   - Reading: `readings/check7-admitted-computed-plant.log`.
5. **CHECK 7 is GREEN only on the lane's extended home, and the return doesn't say so.**
   - With `scripts/shape-census.mjs` swapped for the chair's banked home (homes.diff `a1d8adeb`, tree `bd437751`),
     `test:font-coverage` exits **1**. Four of its own plants go GREEN (`style.font`, TS style object, SVG
     `font-family=`, Tailwind `font-(--x)`), and it reds a lawful form (`family-name:var(--face-written)`)
     (`readings/check7-on-chair-home.log`).
   - The row passes only after the chair folds `homes.PROPOSED.diff` (`eb94f37f`).
   - That diff does apply on both homes: `git apply --check` 0 on `74a2b5d9+homes` and on the §13 union home
     `1f8a729a`, which I checked.
   - The README's "test:font-coverage 0 bare" is true of the tree only.
6. **The forced-colours arm counts pixels, not bands or thickness** (LAWS P7 §E ii binds EVERY ring gate). Chromium,
   the product's own count (ON vs `outline-style: none`, ≥ 24/channel, floor `(w+h)·dpr`):
   - The ring itself: 422 px / floor 87 at 1280, and 3748 / 278 on the 390×844 chip. This reproduces the lane's
     numbers exactly.
   - `clip-path: inset(0)`: 0 px, RED, reproduced.
   - **Bottom band only** (`clip-path: inset(0 0 -8px 0)`): **109 / 87 GREEN** at 1280, **924 / 278 and 942 / 294
     GREEN** at 390×844.
   - **A 1 px ring**: **218 / 87 and 1918 / 278 GREEN**.
   - WebKit gives the same verdicts: §3.
7. **The fold's §10 ring is not ONE.**
   - On `74a2b5d9 + s10.diff + pass8.on-s10.withhomes.diff` (I applied it to a scratch copy), the leader's two sites
     are `2px solid` at GCP:3053/3058. But s10's generic
     `:deep(button:focus-visible), :deep([role="tab"]:focus-visible), :deep([tabindex="0"]:focus-visible) { outline:
     2px dashed var(--ring-ink) }` at GCP:2602 still rings every other card control dashed. The station-1 ruling
     calls that a ring with holes: B4 0.28–0.32 per band in the lane's own dashed reading.
   - `DrawerTab.vue:248` is `2px dashed currentColor` on the fold, on the tree (:152) and on the control.
   - face-law's ring row reads only `.mobile-heading-btn` and `.tray-well .ctrl-btn`, so the fold's other rings are
     unread.
   - *Source-read, not photographed.* A build of the merged tree was not affordable at load 200+.
8. **LAWS §I, two hand-rolled instruments beside their homes.**
   - (a) `visual-regression.spec.ts`'s `PANEL_H_AT_REST` is a new rest reader landed in pass 8, after batch 0. The home
     `e2e/lib/rest-probes.mjs` exports `atRest(page)`, and the extension belonged there as a PROPOSED diff with its
     plant.
   - It ships no plant for its own axis. A layout that lands after the 10-frame window would be read early, so the
     race cure (0/40 vs pass 7's 5/≈45) is empirical and not proven.
   - `handRung` and `reverted` don't assert `rested`.
   - (b) `keys-crib.spec.ts:81` keeps its own `MessageChannel` post-paint sampler beside `e2e/lib/postpaint.mjs`'s
     `installSampler` (*declared*, gap 4).
9. **B-FACE-RING is an unframed ballot.** Zero frames. The default (a) moves the fold's shipped ring (s10: dashed)
   to solid, and LAWS K wants the pair framed on one payload with every variable it carries named. The arm's
   numbers are in text only.
10. ***Declared, carried*** (the lane's own gaps; not re-derived here unless noted):
    - the sublabel rung (T9-R9, cited, row 8)
    - 727's WebKit mechanism unnamed (row 6)
    - G6 unmeasured (row 7)
    - `--motion-whisper` +1 (§13's, row 9)
    - `underTheStrip` has no subject on s10 and row 9's settle is unreachable (row 12)
    - check 8 RED 270/268 vs 214/212, the fold's (row 13; `test:e2e:projects` tree **1** / control **0**, re-run
      here bare)

## 1 · The pass-7 plants, run FIRST (LAWS P5 §F)

| pass-7 plant | pass 7 | pass 8 (this tree) |
|---|---|---|
| CHECK 7 shapes, the pass-7 critic's `check7-shape-plants.py` (CONTROL + 15) | 11 of 15 exit 0 | **16/16 exit 1** (`readings/c7battery.log` §1) |
| stamp: `scene.css` `.controls-card{letter-spacing:.02em}`, mtime restored | exit 0 | **exit 1** |
| ring: `outline-width: 1px` | 4.289 GREEN | **RED d1** on every band, both themes, 3 sites (chromium; WebKit §3) |
| union `@property` block | RED C2, 2 blocks | **16 in ONE** on the naive union (I re-counted it) |

I checked the naive union for honesty. `git merge-file` of s10's and s13's `index.css` over `74a2b5d9` gives 2
conflicts, both outside the `@property` run (a ring-ink comment and `--color-progress-ink`). So the two-block RED
is genuine, not a product of the lane's resolution.

## 2 · Re-derived measurements (numbers first)

- **Row 11, the sideways range**, re-derived with my own probe (`instruments/sideways.mjs`), payload M17 9×9. I swept
  1024 / 1100 / 1280 / 1366 / 1440 / 1920 × fine/touch, both engines, tree vs control:
  - Tree: the card is **218/218** at every coarse width (221/221 at 1920) and matches its width at fine, with 0 px
    overhang and **no page-wide sideways scroller**.
  - Control: **282/218** (282/221 at 1920), overhang **63.58 px** (60.58 at 1920) by `span.washi-label`, identical
    in chromium and WebKit.
  - The lane's 218/218 vs 282/218 is reproduced to the pixel in both engines.
  - Not reproduced: the control's 21–42 px hover shift. A real-mouse hover left `scrollLeft` at 0 on both arms, so
    the lane's number came from its `scrollIntoView` path, which I didn't re-run.
- **Row 5, the ring**, through the ONE home `e2e/lib/edge-bands.mjs` (`instruments/ring.mjs`). Chromium, light and
  dark, 1280 fine + 390×844 coarse (iPhone 13 DPR 3), 3 sites:
  - The ring: **4.289 light / 4.286 dark, depth 2, holes 0** on all four bands at every site, matching the lane.
  - Their THIN 1px (d1) and DASH (holes 0.28–0.37, left 1.73) red.
  - My five fresh plants all red: dotted, 1.5 px (d1), the right half clipped (right band empty), ink 55 % (2.07),
    and offset −3 px.
  - Forced colours: gap 6.
- **Row 3**, `check-property-block` (pass-6 instrument, copied):
  - The tree: 6 in source, 48 served (dist `index-BuzJYPcDzysw.css`).
  - s10: 10. s10+FACE: 8.
  - All GREEN C1–C5.
  - Readers/writers on s10+FACE: `--masthead-foot` 1/0, `--case-offset` 1/1, `--pin-band` 7/1. `--fold-tools-h`,
    `--strip-len` and `--card-foot-h` are unregistered with 0 readers.
- **The bank.** `pass8.diff` replays on `74a2b5d9` to write-tree **`774ed9b6`** exactly. The live tree through
  `GIT_INDEX_FILE` gives `e7641658` = the bank minus the two `.gitignore` lines (a root file I didn't add).
  Every other claim checks:
  - The six diffs' sha1s match BANKED.txt.
  - `pass8.on-s10.withhomes.diff` applies --check 0 on `74a2b5d9 + s10.diff`.
  - `homes.diff` applies --check 0 on s10.
  - The tree's seven homes plus three `.d.mts` are byte-equal to `homes.diff + homes.PROPOSED.diff`.
  - Instrument imports are relative, product (`./lib/edge-bands.mjs`, `./lib/paint-lib.mjs`, `./shape-census.mjs`,
    `./scripts/shape-census.mjs`). There are 0 `docs/` imports in e2e/ or scripts/, on the tree and on s10+FACE.
- **Clause sabotage**, re-run bare:
  - CHECK 7 `--sabotage` **4/4** (V1, V2, C1, K1).
  - `shape-census --self-test` **96/96**, clauses planted 44/44.
  - `--sabotage-battery` **44/44**.
  - `--print-7` exit 0.
- **Battery subset, bare, tree / control**:

  | gate | tree | control |
  |---|---|---|
  | `lint:copy` (M16) | 0 | 0 |
  | `test:font-coverage` | 0 | 0 |
  | `lint:face-engine` | 0 | 1 (absent) |
  | `test:e2e:projects` | **1** | 0 |
  | `lint:theme-tokens` | 0 | 0 |

**Not re-derived:**
- π (the lane reads paintΔ 0 on 855/877 nodes)
- the seal 20/20 on s10
- the sublabel glyph-pop
- the trades
- 727 27/27
- vitest 833
- vue-tsc
- filter-census 20/20. The delta touches no filter; filterBudget 9 is unchanged by source read.

## 3 · WebKit (the ring)

WebKit, the same probe and cells, run at load 231 (`readings/ring-webkit.log`):
- **The ring: 4.289 light / 4.286 dark, depth 2, holes 0** on all four bands at every site.
- Every plant reds, theirs and my five. WebKit reads 1.5 px as d1.33 at DPR 3, which is still under 1.8.
- Forced colours: the ring paints **412 / 87** at 1280 and **3740 / 278** on the 390×844 chip, which reproduces the
  lane's 412 and 3740 exactly. `clip-path: inset(0)`: 0 px, RED.
- **Bottom band only**: **108 / 87 GREEN** at 1280, **912–936 / 278–294 GREEN** at 390×844.
- **A 1 px ring**: **226 / 87 and 1868–2010 / 278–294 GREEN**.

Gap 6 therefore holds in both engines.

## 4 · The number

**89** (from 88). Rows 1, 2, 3 (leader duty), 5 (normal regime), 11 and 14 are closed on the real surface and
reproduced. Row 6 is closed on its reading but not on its instrument (gap 8a).

Row 4 is not closed at its class (gaps 1–2). This is the fourth re-cut of the stamp:
- pass 5: a digest
- pass 6: mtime
- pass 7: a hand list
- pass 8: the module graph, without the CSS-url assets and hashed lossily

CHECK 7 went from 4/15 fresh shapes red to 21/25, but it stays GREEN only on an unfolded extension (gaps 3–5). The
leader's "one ring" doesn't hold on the fold (gap 7).

None of these is "the hard part deferred", and each has a one-line cure:
- hash `bundle` assets plus `readFileSync` without an encoding
- read `setProperty('font')` and `@font-face`/`FontFace` family bindings
- pin admitted computed sites by count
- band-read the forced-colours arm
- strike or re-cut s10's generic dashed ring
- import `atRest`

So it's ADVANCE, not BANK.

## 5 · Incidents (mine)

- **The tree server on :4234 (PID 93452, mine) and my chained ring script died mid-run** during a load spike: 1-min
  load 213–266 from foreign Playwright runs, including `fourier-analysis`. I didn't kill either. I re-bound :4234
  after `lsof` showed it free and re-checked the served identity before the WebKit run.
- **The control ring run was dropped.** The control has no ring rule at FACE's sites.
- **Box load**: 46–58 through the CHECK 7, sideways and chromium ring batteries, and 213–266 through the WebKit ring.
- No `rm`. A planted `.css` was `mv`'d into `<scratchpad>/crit-face8/probe/`, and a partial scratch tree went to
  `<scratchpad>/crit-face8/trash-critface8/`. No git ran in `w7-control`. In the prototype's tree git ran only
  through `GIT_INDEX_FILE` temp indexes.
- **Frames**: 0, 0 B of headroom spent.

## 6 · Replay

1. `rsync` the tree's `web/frontend` (no node_modules) to scratch.
2. `bash instruments/run.sh`, which runs the pass-7 plants, then the 25 fresh shapes, then the restore.
3. Stamp plants: copy with `dist/` and `.face-engine/`, append a byte to `src/assets/fonts/patrickhand-subset.woff2`,
   `touch -r` the original, then `node scripts/check-face-engine-identity.mjs --self-test`.
4. `node instruments/sideways.mjs <engine> <url> <tag>` and `node instruments/ring.mjs <engine> <url> <tag>` against
   `vite preview` of the tree and control.
