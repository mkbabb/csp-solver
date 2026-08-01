# Codex vault prompt ledger — r1 audit

Corpus: `/Users/mkbabb/.codex` (80G). Scanned 2026-08-01.

## Method + corpus facts (verifiable)

- `find sessions archived_sessions -name 'rollout-*.jsonl' | wc -l` → **5466** transcripts (`sessions` 15G, `archived_sessions` 48G, `du -sh`).
- `session_index.jsonl` (2959 lines) carries only `{id, thread_name, updated_at}` — **no cwd**. cwd lives in each rollout's line-1 `session_meta.payload.cwd`. Example: `archived_sessions/rollout-2026-04-30T12-04-15-019ddf22-38b5-7533-886c-4f27ba02da73.jsonl:1` → `"cwd":"/Users/mkbabb/Programming/glass-ui"`.
- `history.jsonl` is **102 lines**, span `2025-08-07T19:29:48` → `2026-03-04T16:21:55` (min/max of `ts`). It has **no cwd field** and stops in March 2026. It is therefore NOT a usable index for either task; the task's "cheap path" assumption does not hold for this vault. All results below come from parsing the rollouts directly.
- cwd extraction: `head -c 400` of all 5466 rollouts → 5442 headers with a cwd (24 files have no parseable `cwd` in the first 400 bytes — UNKNOWN, not audited further).
- Term scan: full-corpus parse of every `role == "user"` message across all 5466 rollouts (36s wall, 12-way parallel), 239,202 raw hits → 203,246 after dropping injected wrappers (`<codex_internal_context>`, `<codex_delegation>`, `# Context from my IDE setup:`, AGENTS.md injections).
- **Caveat, binding on TASK B**: in Codex rollouts the `user` role also carries orchestrator-authored subagent dispatch prompts and `<subagent_notification>` payloads. Rows below marked *(dispatch)* are model-authored, not owner-typed. Rows marked *(owner)* are typed or pasted by the owner. Where a term's earliest hit is dispatch-only, the owner-origin is UNKNOWN.

---

## TASK A — sessions whose cwd matches `csc411|CSC411|csp-solver|pencil-boil`

**Exactly 2 of 5442 sessions match.** Both cwd `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. No session ever ran with cwd inside `csp-solver/` or a `pencil-boil` checkout.

- S1 = `sessions/2026/03/04/rollout-2026-03-04T01-14-09-019cb77b-7df6-70c2-b5fc-56d7be024cd2.jsonl` (2,068,784 B, 1323 lines)
- S2 = `sessions/2026/03/04/rollout-2026-03-04T12-06-11-019cb9d0-72b3-7303-b0d0-00c828a755b0.jsonl` (3,764,608 B, 1418 lines)

29 owner prompts total (12 in S1, 17 in S2). The AGENTS.md injection at line 7/3 of each is excluded as not-an-ask.

`addressed-in-corpus` = the session produced assistant work (tool calls / messages) against the ask before the next prompt; `acts` is that count. Repo corroboration where it exists is cited in Notes.

| stamp (UTC) | ask verbatim (trimmed >400) | class | addressed |
|---|---|---|---|
| 2026-03-04T06:16:47Z `S1:7` | Let's extract out the pencil boil animation facility, and handdrawn facilities--all animation code related to it, into a micro library, that we'll make into a github repo with the CLI, appurtenant documentation (pithy, no pretense, and in total style congruence to the input repo), located within ~/Programming. Thereupon, this repo shall import that component/utility library for usage. Therein, thi… | extraction/architecture | YES (22 acts; commits `b8340a5e` "Extract pencil-boil imports and stabilize e2e", `36cce821` "Point pencil-boil dep to GitHub") |
| 2026-03-04T06:24:25Z `S1:214` | Things like:\n\n0 +/**\n     41 + * Generate all SVG paths for a Sudoku grid.\n     42 + */\n     43 +export function generateGridPaths(\n\nAre specific to this library, the sudoku one, and should NOT be abstracted out. | scope correction | YES (18 acts) |
| 2026-03-04T06:28:29Z `S1:332` | …same block… Did you ensure this? And NO strange backwards compat exports, like prng--that's superfluous, just use the utility directly. Run our tests, and validate with Playwright and chrome. | scope correction + no-legacy edict + verification demand | YES (47 acts) |
| 2026-03-04T06:38:12Z `S1:622` | redress, and update the documentation with proper hyperlinking, too, of our new repo that's in github. Ensure proper and full documentation therein, too--animation.md should likely be transposed and placed into the new repo | documentation | YES (23 acts) |
| 2026-03-04T06:45:13Z `S1:792` | ANIMATION.md should be folded into the readme in those docs. Completely re-do that readme to ensure the language and style and content matches the current repo and the following:\n\nanalyze your above documentation with the following precepts, and all modified documentation:\n\nwith all documents, abrogate any unsubstantiated claims, editorializing, comparison sentiments like "it's not just x, but y". | **style edict** | YES (7 acts) |
| 2026-03-04T06:48:46Z `S1:853` | remove superfluity like:\n\nRepo: <https://github.com/mkbabb/pencil-boil>  \nPrimary consumer: <https://github.com/mkbabb/csp-solver> | style edict (superfluity) | YES (4 acts) |
| 2026-03-04T06:51:03Z `S1:876` | let's commit in both repos with pithy commits that match the extant commiting style. give me the commands to publish this to npm, and then update the deps herein such that we point to THAT. I have to execute npm login & c | release/ops | YES (15 acts; owner reserves npm login — same split as today's "deploy ONLY via npm run deploy, owner-authorized") |
| 2026-03-04T06:53:13Z `S1:932` | The readme for pencil boil needs to read more prose like and be entirely restructured from first principles, adhering to my style guildine and precepts herein.\n\nI've published the repo, so you switch it over | documentation rewrite | YES (25 acts) |
| 2026-03-04T06:56:54Z `S1:1045` | This sort of bullshit should be abrogated. Make no mention of "the host app" anywhere; and NEVER employ phrases like, "it's not x, it's y" or "if you want x do this, if you want y, do that":\n\nIf you want the line to feel re-traced, this package gives you the primitives. If you need domain structure, keep that in the host app. | **style edict (abrogation)** | YES (4 acts) |
| 2026-03-04T06:57:33Z `S1:1065` | and flip it--and GENERALLY apply the above docs and all docs herein. Ensure language congruence to the style guidline. | style edict (generalize) | YES (15 acts) |
| 2026-03-04T07:00:14Z `S1:1144` | This sort of thing is nonsense as well. ADHERE to our style guide. But do NOT overfit on it:\n\nanalyze your above documentation with the following precepts, and all modified documentation:\n\nwith all documents, abrogate any unsubstantiated claims, editorializing, comparison sentiments like "it's not just x, but y". limit usage of em dashes, and when including them typically have no space between, et… | **style edict, verbatim re-issue (3rd time this session)** | YES (22 acts) |
| 2026-03-04T16:21:55Z `S1:1277` | The README for the boil library needs to contain our prose-like ANIMATION.md's original content, though perturbed slightly to be entirely relevant and repo-specific.\n\nThis should explain and include the boil, wobble--the entire animation process, compositing, etc | documentation | YES (7 acts; commit `cefcc76a` "docs: tighten frontend and project documentation", 2026-03-04 16:31) |
| 2026-03-04T17:11:02Z `S2:7` | The recent frontend changes have the board not properly centred in the screen—it now overflows on the top and bottom. Using playwright, reddress this | layout defect + real-surface verification | YES (52 acts) |
| 2026-03-04T17:18:24Z `S2:271` | idiomatic tailwind and usage thereof. no workarounds or hacks | **no-hacks edict** | YES (24 acts) |
| 2026-03-04T17:23:10Z `S2:384` | Add a bit of a margin, consistent with the mbabb left margin, to the top and bottom of the main view. Ensure this is valid for easy, medium, and hard | layout | YES (17 acts) |
| 2026-03-04T17:25:49Z `S2:483` | The sun's z index (including rays) should be higher than the controls bar, too | layout/z-order | YES (13 acts) |
| 2026-03-04T17:28:27Z `S2:543` | top and bottom need that added margin to the main app container | layout re-issue (2nd) | YES (9 acts) |
| 2026-03-04T17:30:42Z `S2:598` | The margin's not there on safari for some reason | **Safari-specific defect** | YES (10 acts) |
| 2026-03-04T17:39:51Z `S2:656` | continue | continuation | YES (12 acts) |
| 2026-03-04T17:45:10Z `S2:718` | Let's create a prompt, pithy, to audit for non-idiomatic usage of tailwind styles, monolithic stylesheets (lack of colocation or encapsulation), usage of deprecated or archaic styling, and fragile rules like in the above | **colocation edict, birth** | YES (1 act — prompt authored inline; no follow-through audit ran in this session) |
| 2026-03-04T17:48:00Z `S2:729` | The dev.sh doesn't connect to the backend:\n\n12:47:15 PM [vite] http proxy error: /api/v1/board/random/3/HARD\nError: read ECONNRESET\n    at TCP.onStreamRead (node:internal/stream_base_commons:216:20)… | infra defect | YES (25 acts; commit `95894d8b` "Fix dev proxy backend port wiring") |
| 2026-03-04T17:50:43Z `S2:836` | commit and deploy to the ssh remote with deploy.sh—commits for all changes herein | release/ops | YES (21 acts; commits `95894d8b`, `37fc1403` at 12:51:31/12:51:36 local) |
| 2026-03-04T20:58:31Z `S2:946` | I still get this when running dev.sh—the backend is not connecting?\n\n$ ./scripts/dev.sh \nFrontend → http://localhost:3000\n\n  VITE v6.4.1  ready in 304 ms… ECONNRESET… | **defect re-issue — prior fix did not hold** | YES (14 acts) |
| 2026-03-04T21:01:31Z `S2:1001` | the board numbers are all shifted down and to the right—redress this to align the underlying grid robustly. this should generalize and scale properly\n<image></image> | rendering defect (owner screenshot) + generality edict | YES (19 acts) |
| 2026-03-04T21:08:32Z `S2:1098` | the board should be a bit smaller on mobile (just a bit), such that the sudoku header is about 1rem or so from the mbabb logo and toggle darkmode bar—test in a mobile safari playwright env | mobile layout + **mobile-Safari verification** | YES (12 acts) |
| 2026-03-04T21:11:33Z `S2:1172` | when we scroll all the way to the bottom, that margin is fine on mobile—remove the added padding | mobile layout | YES (4 acts) |
| 2026-03-04T21:21:13Z `S2:1195` | actually, a bit of a padding amount. match the padding top of the mbabb darkmode ribbon—also, on mobile, the padding left and right for that ribbon should match the sudoku header, such that the sudoku header is left aligned with the mbabb icon. validate with playwright. | mobile layout reversal + verification | YES (8 acts) |
| 2026-03-04T21:25:41Z `S2:1238` | just a bit more, such that the moon/sun doesn't occlude the board at all | mobile layout | YES (10 acts) |
| 2026-03-04T21:29:35Z `S2:1289` | commit and deploy | release/ops | YES (32 acts; commits `bf1bd8fc` "Improve mobile board alignment and dev startup resilience" + `cefcc76a`, 2026-03-04 16:30/16:31 local) |

**Standing corroboration**: `web/frontend/package.json:36` → `"@mkbabb/pencil-boil": "^0.10.1"` — the S1 extraction ask is still the live dependency spine 5 months on.

---

## TASK B — edict origin trace

Earliest **owner-authored** occurrence per phrase across the whole vault (all projects), plus how widely it recurs. "occurrences" counts distinct `role=user` messages containing the term after wrapper filtering; it includes model-authored dispatch prompts, so read it as *pressure of the phrase in the corpus*, not owner keystrokes.

| edict | earliest owner occurrence | project cwd | evidence pointer | occ. | top recurrence projects |
|---|---|---|---|---|---|
| **abrogation** | 2026-03-04T06:45:13Z | **csc411/CSC411_HW2_ProgrammingQuestion** | `sessions/2026/03/04/rollout-2026-03-04T01-14-09-019cb77b-…cd2.jsonl:792` — "…with all documents, abrogate any unsubstantiated claims, editorializing, comparison sentiments like \"it's not just x, but y\". limit usage of em dashes…" | 1047 | sci-report 482, glass-ui 418, keyframes.js 58, value.js 53, bbnf-lang 30, **csc411 3** |
| **colocation** | 2026-03-04T17:45:10Z | **csc411/CSC411_HW2_ProgrammingQuestion** | `sessions/2026/03/04/rollout-2026-03-04T12-06-11-019cb9d0-…5b0.jsonl:718` — "…monolithic stylesheets (lack of colocation or encapsulation), usage of deprecated or archaic styling, and fragile rules…" | 17 | glass-ui 6, sci-report 4, value.js 4, dns-analysis 2, **csc411 1** |
| **"no legacy"** | 2026-03-04T06:08:56Z | `/Users/mkbabb/Programming/words` | `archived_sessions/rollout-2026-03-04T00-56-38-019cb76b-…ce2.jsonl:491` — "NO legacy code or backwords compatibility: the migration is superfluous… Absolutely NO workarounds, temp fixes or hacks." | 665 | glass-ui 226, sci-report 199, value.js 128, /Volumes/config 36, keyframes.js 30, bbnf-lang 29 |
| **apotheosis** | 2025-12-12T02:23:17Z | `/Users/mkbabb/Programming/gaggle` | `sessions/2025/12/11/rollout-2025-12-11T21-22-54-019b105e-…db8.jsonl:3` — "…The apotheosis of task: does the data have high diversity, high verisimilitude?…" | 13 | value.js 12, gaggle 1 |
| **shadcn** | 2026-03-10T17:48:48Z | `/Users/mkbabb/Programming/bbnf-lang` | `sessions/2026/03/10/rollout-2026-03-10T13-45-38-019cd8da-…928.jsonl:7` (playground controls-bar / resizable-editor ask) | 55 | value.js 53, bbnf-lang 1, speedtest 1 |
| **contrived** | 2026-04-30T02:12:14Z *(dispatch)* | `/Users/mkbabb/Programming/bbnf-lang` | `sessions/2026/04/29/rollout-2026-04-29T18-13-49-019ddb4e-…267.jsonl:755` — "…a non-contrived grammar-general design… Avoid any patch that special-cases EBNF." | 1153 | sci-report 544, glass-ui 453, value.js 95, bbnf-lang 56 |
| **distill** | 2026-05-20T00:51:26Z *(dispatch)*; earliest clearly owner-typed 2026-07-18T21:38:55Z | bbnf-lang; then value.js | dispatch: `sessions/2026/05/19/rollout-2026-05-19T20-51-21-019e42dd-…007.jsonl:4394`. Owner: `archived_sessions/rollout-2026-07-18T01-00-39-019f7399-…604.jsonl:8131` — "Deletions are fine, so long as they're in an effort of distillation, clarity, and perfection." | 49 | value.js 38, sci-report 9, bbnf-lang 2 |
| **tranche** | 2026-04-03T04:49:52Z | `/Users/mkbabb/Programming/bbnf-lang` | `sessions/2026/04/02/rollout-2026-04-02T16-10-56-019d4fd2-…81d.jsonl:2726` ("PLEASE IMPLEMENT THIS PLAN: # Cohesion + Code-Size Refactor Plan") | 8120 | bbnf-lang 2488, sci-report 2373, glass-ui 1619, value.js 973, keyframes.js 302, /Volumes/config 233 |
| **thrice** | 2026-07-18T05:00:40Z | `/Users/mkbabb/Programming/value.js` | `archived_sessions/rollout-2026-07-18T01-00-39-019f7399-…604.jsonl:9` — the mega-tranche kickoff carrying the pasted "Design and iteration: the convergent multiagent design loop" | 105 | value.js 105 (sole project) |
| **born-RED** | 2026-07-18T18:37:46Z | `/Users/mkbabb/Programming/bbnf-lang` | `sessions/2026/07/18/rollout-2026-07-18T14-37-45-019f7685-…961.jsonl:9` — the sk-v25 HANDOFF packet paste | 72 | bbnf-lang 72 (sole project) |
| "born red" (spaced) | — | — | zero owner-message occurrences corpus-wide | 0 | — |

Reading of the trace:

1. **Two edicts were born in THIS repo**: abrogation (2026-03-04T06:45) and colocation (2026-03-04T17:45). Both on the same day, hours apart, in the two csc411 sessions. Everything else was imported from words / gaggle / bbnf-lang / value.js.
2. Abrogation was issued **three times inside S1 alone** (06:45, 06:56, 07:00), the third a verbatim re-paste of the first precept block — the phrasing "again and again" is literal, and it began within 15 minutes of first issue.
3. The vocabulary's centre of gravity moved off this repo entirely: abrogation now lives in sci-report/glass-ui (900 of 1047), tranche in bbnf-lang/sci-report (4861 of 8120). csc411 contributes 3 abrogation and 1 colocation rows and nothing else.
4. `thrice` and `born-RED` are **July-2026 vocabulary, not March**: both appear first on 2026-07-18, in value.js and bbnf-lang respectively, and have never been typed in a csc411-cwd session.

---

## TASK C — `/Users/mkbabb/.codex/campaign-evidence/`

Holds **nothing for this repo**. `find campaign-evidence -maxdepth 2 -type d` → a single project tree:

```
campaign-evidence/bbnf-lang/sk-v25/p31/{CURRENT,objects,refs,subjects,tools}
```

- 1.3G, 30,677 files (`du -sh`, `find -type f | wc -l`); directory created 2026-07-19 18:26, last touched 2026-07-19 22:07 (`ls -la`).
- `p31/CURRENT` (65 B, 2026-07-19 18:30): `30a823bc6834a66ae06eefd41471de0946d0e4d2daef3413945f9ccd36822ad5`.
- `p31/refs/epochs/` holds 2 epoch refs: `p31-postrepair-failed-suite-budget`, `p31-profile-fixed-failed-exporter-wall-run-a`.
- `p31/tools/`: `ingest_campaign_v2.py`, `ingest_pre_repair_baseline.py`, `ingest_exporter_wall_failure_v3.py` (+ a cpython-314 pycache).
- Content-addressed stores under `objects/sha256/` and `subjects/sha256/`. Bulk mtimes cluster on 2026-07-19 (16,563 files), 2026-07-10 (98), 2026-07-18 (62), 2026-04-30 (146); a long tail of 2020–2022 mtimes are ingested fixtures, not campaign events.
- No `csc411`, `csp-solver`, `pencil-boil`, or sudoku path exists anywhere under `campaign-evidence/`.

---

## Gaps / UNKNOWN

- 24 of 5466 rollouts have no `cwd` in their first 400 bytes; they were not classified. Whether any is a csc411 session: UNKNOWN.
- `history.jsonl` covers only 102 prompts ending 2026-03-04 and carries no cwd — it cannot corroborate anything after March 2026.
- Owner-vs-orchestrator authorship for TASK B rows marked *(dispatch)* is inferred from message shape, not from a provenance field the format supplies. Codex does not distinguish them in the `role` enum.
- Zero Codex sessions exist for this repo after 2026-03-04. Everything from Tranche II onward (2026-07-06 →) lives outside this vault.

ROW-COMPLETE
