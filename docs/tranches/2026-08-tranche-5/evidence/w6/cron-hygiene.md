# T5-W6.4 — CRON HYGIENE

A resume-cron is a frozen sentence fired by a scheduler. The sentence ages; the campaign moves; the
scheduler does not notice. This row documents the 52-replay loop the audit found, quotes the current
campaign's heartbeat as the cure's shape, and states the standing rule.

**Source of record** `evidence/audit/r1/cc-prompt-ledger.md` §2 (the standing-edicts table) with §0's
collapse note and §5's reading. Every count below was re-derived from that file at this lane, not
quoted forward.

---

## 1. The 52-replay loop

**The order that made it.** Row 46, `2026-07-10T06:48:51.394Z`, verbatim:

> "Ensure robustness: create a cron in light of any session limits. Note and mark your progress
> thereupon, with this exact command: Continue. Re-deploy all workflows and agents thereof--no
> exceptions. Use batches of three agents in parallel to avoid rate limit walls. The limit has been
> fully reset. Pick up where they left off with another workflow."

The owner typed the string once. A scheduler replayed it.

**The arithmetic, re-derived.** `grep -oE "CRON-REPEAT ×[0-9]+"` over the ledger sums to **51 replays
across 13 collapsed run-rows** — `×16` (2026-07-10T07:45→18:13), `×13` (07-11T04:57→15:58), `×8`
(07-10T19:11→22:43), `×4` (07-11T00:58→03:58), `×2`, and eight singletons. Adding the authoring turn
gives 52 occurrences of one sentence across 14 rows, which is exactly what §5 states: "he authored the
string once (row 46) and a scheduler replayed it 51 further times." §0's headline calls the 52
"repeats"; 51 of them are, and the 52nd is the authorship. Noted so a later reader who re-runs the
grep doesn't read a defect where there's a loose noun.

**Three replays predate the order.** Rows 12, 14, 16 are stamped 2026-07-06, four days before row 46.
They belong to an earlier authoring-cron, killed at the T2 gate — `CronDelete efaae137`, recorded at
`docs/tranches/2026-07-tranche-3/appendices/B-prompt-recap.md:121`. The pattern is therefore not a
single incident: this is the second cron in the campaign to outlive the state it was written against.

**What the loop cost, and what it hid.** Each firing was answered by `resumeFromRunId`, so no wave was
lost — the ledger's own disposition column reads YES on every replay row. The damage is elsewhere:

- The string names **no campaign and no live-state file**. It says "pick up where they left off",
  which is only meaningful to a session that already knows what "they" is. Fired after a campaign
  close, it points at nothing and invites a re-execution of finished work.
- 52 byte-identical turns inflate any "what did the owner ask for" statistic by 37% of the 140-turn
  corpus unless they're collapsed — the ledger collapses them for exactly this reason (§0), and every
  recap that doesn't is reading scheduler noise as intent.
- The owner's own hygiene order, **"Kill all crons, too."** (2026-07-12, U-07), was answered by
  enumeration at T4-W0 and closed at `429e7983` — a close deleted the crons, which is the behavior
  this row makes a rule instead of an accident.

---

## 2. The current campaign's heartbeat — the cure's shape

Enumerated in this lane, not inherited. `CronList` returns exactly one job:

```
1bc8d5b2 — 17,52 * * * * (recurring) [session-only]: T5 EXECUTION HEARTBEAT (auto, non-duplicative — the only cron)
```

Its prompt text, verbatim:

```
> T5 EXECUTION HEARTBEAT (auto, non-duplicative — the only cron). You are mid-execution of Tranche 5 under the owner's 2026-08-01 start order (full autonomy to WGATE; ballots default-fire; no relinquishing control). If wave work is actively in flight this turn, do nothing beyond a one-line ack. If idle or stalled (lost notification, crashed workflow, session resumed): read memory/t5-execution-live.md and memory/t5-formulation-2026-08-01.md §EXECUTION PREP, run TaskList (#81–#88), check `gh run list --limit 3`, inspect any banked workflow run IDs via their journal.jsonl, and resume the current wave — workflows via Workflow({scriptPath, resumeFromRunId}) per the limit-wall protocol. If T5-WGATE is sealed, CronDelete this job.

(Schedule `17,52 * * * *`, session-scoped, id `1bc8d5b2`, created at the T5 execution open 2026-08-01. Its shape is the cure: it names the CURRENT campaign's live-state file, self-acks when work is in flight — no replay spam — and carries its own deletion clause at the campaign close.)
```

Three properties are the cure, and they are what a future resume-cron copies:

1. **Session-only scope.** It cannot outlive the session that made it, so it cannot outlive the
   campaign — the 2026-07-06 and 2026-07-10 crons could and did.
2. **It names the campaign and points at live state.** T5 by name, resolved through the tranche's own
   live-state file rather than through "where they left off".
3. **Non-duplicative and sole.** One job, declared as the only one, so the enumeration at close is a
   one-line check rather than an archeology.

**Repo-side, re-derived at this lane.** `grep -rniE "cron|schedule:" .github/` → **5 hits in 1 file**,
all `security-audit.yml`: the daily advisory oracle at `:70` (`cron: '17 13 * * *'`) plus its four
comment lines. That workflow landed at T5-W1 and is a CI schedule, not a resume-cron; it carries its
own two disclosed limits (GitHub disables scheduled workflows after 60 days of repo inactivity;
`schedule:` fires on the default branch only). W0's record of this same grep reads **0** because the
file did not exist yet — the number moved between waves, which is why it is re-derived here.

---

## 3. The rule

> **Any standing resume-cron must point at the CURRENT campaign's live-state file, and a campaign
> close deletes it or repoints it.**

Its three obligations, in the order a close executes them:

1. **Enumerate.** `CronList` plus `grep -rniE "cron|schedule:" .github/` at every close. The count and
   the job ids go in the close record; a cron nobody enumerated is a cron nobody owns.
2. **Delete or repoint.** A resume-cron whose campaign has closed is deleted (`CronDelete <id>`). A
   cron that survives a close is repointed at the successor campaign's live-state file in the same act
   that seals the close — never left to be corrected by the next session that trips it.
3. **Write it, don't freeze it.** The prompt names the campaign and cites the live-state file; it never
   says "pick up where they left off". Prefer session-only scope, one job, declared as the only one.

Provenance: rows 46 and 75 of `cc-prompt-ledger.md` §1 (the cron order, then "proper facilities…
robustly handle ratelimit walls and resume work thereupon"), the standing edict
**session-durability — lose no progress to walls** (§2, born 2026-07-10, re-uttered 3×), U-07's
kill-all-crons order, and `memory/limit-wall-protocol.md`, which this rule extends: the wall protocol
says how to resume, and this says what the thing that fires the resume is allowed to point at.
