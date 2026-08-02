# PASS-7 · LANE A — THE ESTATE RULING AND THE TWO PASS-4 CITATIONS

Work order: `pass6-registry.md` §"PASS-7 WORK ORDERS · Lane A" plus the chair's two additions,
verbatim. Settled ground inherited, never re-opened: `pass5-lead-adjudications.md`,
`pass5-adjudications-at-seal.md`, `pass6/A/A-report.md`.

Fence held: `docs/tranches/PRECEPTS.md`, the pass-4/5/6 A-dossier records, this evidence dir.
**No component edit, no spec edit, no script edit, no git state change, and no server started** —
this lane's whole executable is two zsh rigs that read the tree and the object store.

Base: `4b28f034` (T5-W4 pass-6 seal), tree clean at open. Host darwin · zsh 5.9 · node v26.0.0.
The shared tree carried other lanes' in-flight edits throughout; every number below is re-derived
against `HEAD` or against a banked file, never against a working-tree convenience.

| # | order | verdict |
|---|---|---|
| 1 | A6-G4 up as an ESTATE RULING in `PRECEPTS.md` §2, in the register of its siblings, citing the two banked bites | **LANDED** — §2, under the family-5 re-derivation row; both bites re-derived at citation, one reproduced with its own falsifier |
| 2 | the chair's KEEP on the third §3 row (assert-the-SPA tree-blind) | **RECORDED** — §2 below; `PRECEPTS.md` §3 is byte-untouched by this lane |
| 3 | A6-G1 — fix the pass-4 shots-A citation | **STAMPED at BOTH sites** — §1 and §12, testimony grammar; one line re-wrapped, **no word erased** |
| 4 | A6-G2 — restamp the built-dist attribution to its true evidence class | **RESTAMPED** — testimony, harness not banked; and the surviving substance priced at **3 of 36** |

---

## 1 · ORDER 1 — THE RULING, AND WHY IT IS A §2 LAW

**Landed text**, `PRECEPTS.md` §2, immediately under the family-5 re-derivation row it is the
companion to:

> **An unbanked `2>/dev/null` is how a false number is born.** No instrument discards a stream it
> didn't bank: a rig line that silences stderr banks the silenced stream beside its output, or the
> number it prints does not exist. MEASURE's "an unbanked gate does not exist" one stream down—a
> gate that never ran leaves a hole, a gate whose stderr was eaten leaves a number, and the second
> is worse.

**Placement is an argument, not a filing choice.** §3 is where an environment failure that bit gets
written so nobody rediscovers it; §2 is where an instrument's own discipline lives. The zsh colon
expansion is the first; *the class of number it produced* is the second. They sit one section apart
because a shell fix retires the trap and retires nothing about the law: any silenced stream feeding
any count has the same shape. The row's sibling clause is literal — MEASURE's discipline item 3
lives at `evidence/audit/r2/design-loop-open-rows.md:291` and is cited there rather than restated,
because it is not a §2 row and this lane does not promote another lane's rule.

**The two banked bites, re-derived at citation.**

**Bite 1 — the pass-6 zsh `git show` mangle, five refs.** Reproduced on this session's own shell
(`logs/A7-10-zsh-swallowed-stderr-bite.log`, `rig/swallowed-stderr-bite.zsh`), three arms per ref
over `.guard-note`'s padding rule — the constant the whole pass-6 reconciliation rests on:

```
ref 236d22fe   BITE(2>/dev/null) = 0   CURE(braced) = 1
ref 94ce993e   BITE(2>/dev/null) = 0   CURE(braced) = 1
ref c6eda619   BITE(2>/dev/null) = 0   CURE(braced) = 1
ref 3969f512   BITE(2>/dev/null) = 0   CURE(braced) = 1
ref abe533c4   BITE(2>/dev/null) = 0   CURE(braced) = 1
```

What the discard threw away, identical on all five and printed in the log rather than described:
`fatal: ambiguous argument 'b/frontend/src/pencil/chrome/GameGallery/GameGallery.vue'`. The
mechanism is legible in that one string — zsh reads `$c:we…` as the `:w` word modifier followed by
`e`, eats `<sha>:we`, and hands `git` a path that was never a path. **Five confident zeros against
a true count of one**, which is the estate's most expensive failure shape: not a hole a reader
notices, a number a reader quotes.

**The rig carries its own falsifier**, per standing law. The CURE arm is re-run against a path that
does not exist at each ref (`NoSuchFile.vue`) and must read **0**; it does, five for five. A cure
that read 1 there would be reporting the shell, not the tree. The rig exits non-zero unless BITE ≡ 0,
CURE ≡ 1 and ghost ≡ 0 on every ref — `EXIT=0` as banked.

**Bite 2 — pass-5's discarded `--strictPort` bind log.** `pass5/A/A-report.md` §5.3, in that lane's
own words: `vite --port 4231 --strictPort` failed to bind, "the shell backgrounded the failure",
and the run that followed **looked valid all the way through `assert-the-SPA`** because the port was
serving the app — just not that lane's build. "One log was banked and discarded on discovery." That
is the same law from the other side: the stream that would have named the failure was thrown away,
and what survived was a green suite measuring somebody else's tree.

**The enforcement line is honest, and it indicts this row.** It reads `convention`, because no
script greps a rig for a swallowed stream, and the fence forbade me from writing one. Family 2 says
a ruling that exists only in prose doesn't exist — so the row is booked against itself as **A7-G3**
and the mechanization is priced below rather than hand-waved.

**The census that prices it** (`logs/A7-13-swallowed-stream-census.log`, `git grep` over the tracked
tree): **34 lines across 10 tracked executables**, plus 9 prose mentions in `.md` (this ruling's own
text among them). **9 of the 34 are guarded on their own line** by `|| true` / `|| echo` — cleanup
kills and focus-restore probes, where a discarded stream costs nothing. Exactly **one** line has the
bite's shape — `2026-07-tranche-4/evidence/w11/cen-census.sh:47`, a silenced `cloc` feeding a count
through `awk` — and its failure mode prints an **empty field, not a confident zero**.
`bench-compare.sh:30-31` silences unguarded but rides `set -euo pipefail` (`:10`), so a failed
`git worktree add` aborts: the discard costs the diagnosis, never the number.

**So the tracked tree holds no live confident-zero instance, and the row is preventive.** That is
stated as the finding, not smoothed into a scare: the ruling's whole value is that it fires on the
line being written, before a number exists to correct. A grep-class gate over `2>/dev/null` in
rig/script surfaces is a ~10-line addition to an existing checker with 34 known lines to allowlist —
cheap, and nobody has ordered it.

---

## 2 · ORDER 2 — THE CHAIR'S KEEP, RECORDED

**RULING RECORDED: KEEP, on the third `PRECEPTS.md` §3 row — `assert-the-SPA is tree-blind`. No
edit was needed and none was made.** This lane wrote nothing in §3; its whole contribution to the
file is **one insertion, in §2**. The KEEP row is **byte-identical to `HEAD`** at close, verified
by an anchored compare (`logs/A7-15-precepts-state-at-close.log`) — anchored because the
unanchored grep matched two lines and printed a confident *CHANGED* for a row that had not moved.
Lane D was editing the same file concurrently, and its own §2 row cites this trap by name; §3's two
prettier rows are D's restamps, not this lane's.

Two things belong in the record beside it, because the ordinal has two readings and both land on
KEEP:

- **As the file reads**, §3's last three rows are `shared-tree HMR`, `zsh eats git show $sha:path`,
  `assert-the-SPA is tree-blind` — the chair's parenthetical names the third of those *by name*, so
  the naming governs and the row stays.
- **As pass 6 wrote it**, the "unordered third" was the **zsh** row, landed beyond its two ordered
  siblings and flagged for the lead to strike in a line. That row also stays, and this pass's order 1
  is why: its general form went **up** to §2, not across. The law and the trap are different
  registers — §2 states what an instrument owes, §3 states which shell ate which ref — and neither
  makes the other redundant. A future zsh that stops applying modifiers to `$c:web/…` retires the §3
  row and leaves the §2 law exactly where it is.

`assert-the-SPA is tree-blind` earns its keep on this pass's own evidence, unprompted: it is the row
that BC's pass-6 gap (`BC6-G5`, two lane ports LISTENING six hours after their lane declared them
dead) points at, and it is the row whose cure — hash-diff the served entry against your own build —
pass 6 dogfooded before its arm measured anything.

---

## 3 · ORDER 3 — A6-G1, THE SHOTS CITATION, STAMPED AT BOTH SITES

`pass4/A-report.md` cites `pass4/shots-A/` **twice** — §1's measurement paragraph and §12's file
list. Pass 6 noted the absence in its restamp block and left both citation lines live. Both now
carry the stamp, and neither original line is erased (the D5-G1 correction grammar: a note beside
the line, never an erasure).

Re-derived at citation (`logs/A7-11-pass4-citation-audit.log`, no discarded stream anywhere in it):

- `pass4/shots-A/` — **absent**. `find` under `pass4/` returns nothing for it.
- `git log --all --diff-filter=A -- '*shots-A*'` — **nothing, on any branch**. Never committed.
- **The hollow-dist mechanism does not explain this one.** `docs/tranches/.gitignore:5`'s
  `!**/*.png` re-includes every PNG under `docs/tranches/`; `git check-ignore -v` on a hypothetical
  `shots-A/x.png` returns that negation. The 25 hollow dists were committed-and-eaten by a
  `.gitignore` rule; these were **never committed at all**. Same family, different mechanism, and the
  stamp says so.

**The stamp is `testimony, artifact not banked`** — the hollow-dist grammar from
`pass5-adjudications-at-seal.md` §2, applied one artifact class further out — **plus the cite that
does exist**: `logs/A/ribbon-geom.{log,json}`, 36 cells, banked, arithmetic re-runnable. Anything the
shots were offered to illustrate is quoted from there or not quoted.

**Ranking unchanged: minor.** No pass-4 number rides those shots, which pass 6 said and this pass
re-confirms — the geometry is in the JSON, and it regenerated to the hundredth two waves later.

---

## 4 · ORDER 4 — A6-G2, THE BUILT-DIST ATTRIBUTION, RESTAMPED TO TESTIMONY

**The claim**, §1: *"36 cells = 2 engines × 2 themes × {1440, 375, 320} × 3 states, **built dist**,
DPR2"*. **The evidence class is testimony — harness not banked**, and the restamp says exactly that.

What the bank actually holds, re-derived:

- `ribbon-geom.json`'s per-cell keys are `engine, head, noteH, noteW, overflowX, overflowY, state,
  sub, subLines, subSlackL, subSlackR, textToActions, theme, viewport`. **No baseURL, no build id,
  no AUDIT prepend on either file.** 36 cells in the log, 36 in the JSON — they agree with each
  other and with nothing else.
- The **only** server log in `pass4/logs/A/` is `vite-5321.log`: a **vite DEV** server, 45
  HMR/reload lines, still reloading `dist-throttle/` and `playwright-report/` pages at its tail.
- The rig that would have served a dist — `rigA/serve.mjs` — is itself absent (§5, A7-G1). So the
  lane's own file list names a static server whose log was never banked.

**What survives, priced exactly.** The figure is not withdrawn and is not repaired by assertion:
**3 of the 36 cells have since been reproduced on a real built dist.** Pass 6's content-referent arm
(`abe533c4`, preview `:4252`, entry `index-BNMQu01IbxTY.js`, AUDIT prepend banked) reproduces all
three chromium/light/320 states to ±0.05px; pass 5's border-referent arm (preview `:4246`, AUDIT
prepend banked) reproduces the `both` cell at 45.33 = 31.73 + 13.60. **The other 33 — webkit, dark,
1440 and 375 — have never been re-measured on a built dist**, and the restamp forbids a claim that
says otherwise.

**Scope discipline, stated because I checked and did not book it.** §9's gate table reads *"e2e
built-dist 16 passed … preview :4188, verified free"*, and that one is **config-derivable and stays
untouched**: `playwright-throttle.config.ts:77` pins `PREVIEW_PORT = 4188`, and
`playwright.config.ts:22-24` routes `filter-census`, `wordmark-integrity` and `theme-bake-freshness`
out of the dev-server suite and onto that bundled-preview config. The banked
`gates-e2e-builtdist.log` shows Playwright's own `[WebServer]` lines and 16/16. **Only the ribbon
rig's harness is unbanked**, and the restamp is scoped to that parenthetical. A wider stamp would
have been the easier sentence and the wrong one.

---

## 5 · NEW GAPS

- **A7-G1 (mine) — the three pass-4 rigs are absent too, and §12 cites them as if present.**
  `rigA/{verb-ink.mjs, ribbon-shots.mjs, serve.mjs}`: none on disk, none ever added on any branch;
  `rigA/` holds a `node_modules` symlink and a 2-line `package.json`. Found while executing order 3,
  stamped in the same act at §12, booked here so the tally sees it. **It moves no number** — pass 6
  already classed the geometry REGENERABLE (and regenerated it) and the `verb-ink` mass/density
  absolutes **permanently corroborated-only** for precisely this reason. The one same-named file
  anywhere in `docs/` is `pass5/A/rig/verb-ink.mjs`, pass 5's re-authoring, and conflating the two
  would be the next pass's error.
- **A7-G2 — `doc-truth` is RED in the shared worktree, on another lane's in-flight bump, and it is
  the seal's problem.** Running the gate after my edits (`logs/A7-12-gates-after-edit.log`):
  **1 RED / 12 GREEN**, row `pencil-boil-0.9.2` — `web/frontend/package.json` reads `^0.12.0` while
  `README.md:131` and `web/frontend/README.md:11` still read `^0.11.0`. **Not this lane's**: at
  `HEAD` both sides read `^0.11.0` and the row reconciles; the worktree carries the 0.12.0 bump
  (owner-row 16's release election) ahead of its README restamp. Whoever seals pass 7 lands the
  restamp **in the same commit as the bump** — family 2, and `doc-truth` is a CI job, so an unstamped
  bump reds the lane. `check-evidence-policy.mjs` **PASSES** on the same run, this lane's new tree
  included.
- **A7-G3 (mine, and it is against my own ruling) — the §2 row ships as `convention`.** No gate
  bites a swallowed stream; the fence forbade writing one. The census in §1 is the price sheet:
  34 lines / 10 tracked executables, 9 already guarded, one line with the bite's shape and zero live
  confident-zero instances. **A grep-class row in an existing checker with a named allowlist is the
  whole mechanization**, and it needs an order.
- **Observation, not a gap** — A6-G1 was *booked and half-stamped in the same pass*: pass 6's §1
  restamp block names it in the header and item 3 while both citation lines stayed live and §12 was
  never touched. The registry's tally is honest (the row is carried as new-minor, not closed), but a
  gap that is partly cured at the site it is booked against reads as closed to a fast reader. This
  pass closed the remaining half.
- **A7-G4 (mine) — BC6-G5's class recurs, one lane over, and BC6-G5 itself is DISCHARGED.**
  `logs/A7-14-ports-verified.log`: `:4243` and `:4245` are both **DEAD** (lsof rc=1), so pass 6's
  kill order landed. But `:4237` is **LIVE** — `node …/pass6/land/rig/serve.mjs 4237
  …/scratchpad/dist-seal`, PID 81542, up since **07:00:11**, four hours after the LAND lane sealed,
  serving a scratchpad dist nobody is reading. Same hazard as D6-G3 and the same trap as
  `assert-the-SPA is tree-blind`: a stale server on a lane port with an old tree behind it.
  **Not killed here** — it is another lane's process and killing it is not in this fence. Routed to
  the lead with its PID.
- **Carried, unchanged** — CH-61 / mark 5's picker half stays **U-10 open**: nothing in this lane
  touches a surface, and nothing here may be read as closing a mark.

## 6 · FILES

```
rig/swallowed-stderr-bite.zsh          three arms × five refs + a ghost-path falsifier; EXIT=0
rig/pass4-citation-audit.zsh           the two citation rows re-derived; no 2>/dev/null in the file
logs/A7-10-zsh-swallowed-stderr-bite.log   BITE 0 / CURE 1 / ghost 0 on all five refs
logs/A7-11-pass4-citation-audit.log        absences, git history, the gitignore probe, the 3-of-36
logs/A7-12-gates-after-edit.log            doc-truth + evidence-policy after the edits, with attribution
logs/A7-13-swallowed-stream-census.log     34 lines / 10 executables, classed — A7-G3's price sheet
logs/A7-14-ports-verified.log              the band read in words, not blanks; BC6-G5 discharged
logs/A7-15-precepts-state-at-close.log     every changed line in PRECEPTS, this lane's share isolated
```

**Edits outside this dir, and the numstat that proves their scope.** `docs/tranches/PRECEPTS.md`
— **this lane's share is one line**, the §2 row; **nothing in §3**. The file reads **+4/−2**
against `HEAD` at close because Lane D landed concurrently in the same file (one §2
rig-build-identity row, two §3 prettier restamps); every changed line is enumerated in
`logs/A7-15`, attributed. `pass4/A-report.md` **+47/−1** — §1 gains a pass-7 restamp
block (items 4–6) and §12 a stamp under the file list; **the single deletion is a re-wrap**, and
the deleted line's words survive verbatim as the prefix of its replacement (the diff hunk is in
`logs/A7-12`'s companion `git diff`, and the two lines are one sentence apart).

**Servers: none, and the band is read rather than claimed.** This lane started no process and bound
no port. At close `4230-4260` holds exactly one listener and it is not mine (A7-G4); `:3000` is the
foreign squatter, LIVE and untouched; `:3001` is not listening and was not touched. **Git:
read-only throughout** (`show`, `log`, `grep`, `check-ignore`, `status`, `rev-parse`); no
state-changing command was run in the main tree.
