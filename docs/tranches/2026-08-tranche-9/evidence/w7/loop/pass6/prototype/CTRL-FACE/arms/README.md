# CTRL-FACE pass 6 · the ballot arms as ONE injected rule each (framed on dist `index-DuV3ixM3UGGf.js`, payload `?size=3&difficulty=MEDIUM&board=ATMu…MDc5`)

Each alt arm is the one rule below, laid over the tree's default. To build one into source, add the
rule to `GameControlPanel.vue`'s scoped block (or `OptionSelector.vue` for B16/B19) under the arm's
const; the frames and numbers in `../readings/gates.log` were read with the rule injected in-page.

| ballot | default (the tree) | alt arm (one rule) |
|---|---|---|
| B-1 | A: `.controls-card { padding-top: calc(0.15rem + var(--pin-tape-h)) }` (scene.css) | none: `.controls-card { padding-top: 1.25rem }` (rail) / `0.375rem` (dock) · B (upper bound): none + `.tray-well .washi-tag { font-size: var(--type-tag) }` |
| B14 | `KEYS_ARM = "verb"` | `KEYS_ARM = "ring"` (source, one const; measured by flipping it on the dev server and restoring by sha) |
| B16 | ARM A: `LINE_SCOPE = "component"` | ARM B: `.tray-well:not(.new-game-zone) .options-line { flex-direction: column; flex-wrap: nowrap; align-items: stretch } … > .ctrl-btn { flex: none }` (≡ `LINE_SCOPE = "staged"`) |
| B17 | beside (the deal row's line) | under: `.new-game-zone .deal-row { flex-direction: column; align-items: center }` |
| B18 | line (marks on one line at every fine rung — the ballot's own condition strikes it) | kept column: `.zone-row .options-line { flex-direction: column; flex-wrap: nowrap; align-items: stretch }` |
| B19 | intrinsic (word + 24) | grown: `.options-line > .ctrl-btn { flex: 1 1 auto }` |
| B20 | (a) grown 2+1 (coarse) | (b) kept column: `.options-line:has(> .ctrl-btn:nth-child(3):last-child) { flex-direction: column; flex-wrap: nowrap }` |
