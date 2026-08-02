# TRANCHE 6 — THE OWNER'S EYE (2026-08-02)

Seventeen marks from the owner's live audit plus one substantive feature, executed
process-lite and code-heavy: the seven adjudicated briefs under `research/` ARE the
specs — this file only sequences them, names the cross-lane rulings, and states the
verification bar. Parsimony law binds every lane: KISS-forward, fewer lines, library
over bespoke, visual verification on real surfaces as the standard of proof.

## The lanes (briefs are binding; deviations return to the chair)

| lane | brief | marks | shape |
|---|---|---|---|
| voice | `research/voice-brief.md` | 6, 10 | ~29 in-place rewrites (phases 1+2 together), net ~−40 LOC |
| debug | `research/debug-brief.md` | 16 | one ref, one gate, born-RED negative row |
| motion | `research/motion-brief.md` | 11, 14, 15 | sky bands + star bloom + outline flash; landed net −8 (−161 of JS tween machinery; the vocabulary block's keyframes cost what the marks cost) |
| gallery | `research/gallery-brief.md` | 2, 7 | drag + rearmSnap + masthead second-mover, ~+170/−40 |
| controls | `research/controls-brief.md` | 3, 4, 5, 8, 12 | one component + two CSS values, ~+95 |
| mobile | `research/mobile-brief.md` | 9 | margin-block auto + one published fold edge, ~+45/−15 |
| multiplayer | `research/multiplayer-brief.md` | 13 | trystero/Nostr op wire, MVP-cut phased |

## Batches (worktree per lane; the chair merges sequentially, gating each)

- **A (first, small, string-owning):** voice → debug → motion. Voice lands first so
  every later lane writes the post-register strings.
- **B (surface lanes):** gallery → controls → mobile. Merge order fixed to keep
  `index.css`/`GameBoard.vue` conflicts one-directional.
- **C (the feature):** multiplayer, its own phase after B stabilizes; MVP cut =
  2-player same-board sync + players section; cursors and polish ride the same
  brief's later slices.

## Cross-lane rulings (adjudicated at the write, so no lane re-litigates)

1. **`level` → `difficulty` rename is DEAD.** Gallery priced it in; voice killed it
   (five e2e pins for a synonym). Mark 7's ask is VISUAL consistency — hierarchy,
   icons, colors — which gallery's crayon hoist + accent alignment delivers without
   the label churn. Voice's ruling stands estate-wide.
2. **The trie is adjudicated to its intent, flagged for owner veto.** The owner's
   words were "trie-based CRUD"; the brief ships the robust op-ledger + undo/redo
   those words want (existing undo spine as per-player ledger, per-cell Lamport-LWW
   convergence) and documents the estate's prior trie rejection. Veto restores the
   literal trie at its priced cost.
3. **Transport stays swappable — and the swap has been taken (AMENDED at T6.1,
   2026-08-02, on the owner's order).** Nostr-signaled WebRTC is still the arm;
   what changed is whose relay carries it. The Cloudflare Durable-Object relay is
   no longer banked, it is SHIPPED (`web/relay/` — hibernating, free-plan,
   SQLite-backed, same vendor as Pages), and the public relay list is ABROGATED:
   nothing falls back to it, because 47–66 s to first contact is not a fallback.
   The seam's promise was paid literally — `relayConfig.urls`, one config word —
   and the seam remains the swap point for the NEXT arm, not this one. Measured on
   the local rig (`wrangler dev`, two separate browser contexts): socket open 5–7 ms
   after the invite, first contact 57–322 ms on four runs of five and 7.1 s on the
   fifth (trystero's own 5,333 ms announce interval is the ceiling, not the relay),
   digit sync 1–31 ms, peer prune 1–3 ms.
   **Scale bar (the owner's order, 2026-08-02): the code carries NO player cap and
   must handle 16+ within reason.** The mesh arm is honestly sized for it — board
   ops are bytes at human pace; its practical ceiling is connection setup at
   ~16–24 peers — and the DO relay is now also the scale arm beyond that (star
   topology, room size a mesh won't carry), reachable without a second decision.
4. **CSP `connect-src` gains `wss:` in the same commit as the transport** (the
   ruling-lands-with-its-config law; verified on the deployed edge at close).
5. **Color story is owned once** (AMENDED by the owner's 16+ order, 2026-08-02):
   you = `--color-user-ink`; remote players = ONE formula, a golden-angle hue walk
   in OKLCH (`hue_i = i × 137.5° mod 360`) at fixed lightness/chroma banded per
   theme so AA holds by construction for any N — no token table, no player cap.
   The crayon tiers return to difficulty's vocabulary alone, which retires the
   chip-vs-digit coincidence the audit flagged. The solved-state rainbow stays the
   SOLVED voice; no new color tokens anywhere.
6. **Voice's register binds every later lane's strings.** Any user-facing string a
   lane mints (controls' hint tapes and washi explications chief among them) is
   written to voice's rules — plain English, no meta terms, no first person,
   marking→checking — and the chair reviews the string table at that lane's merge.
   Controls owns the Fill washi's final text; voice's `:708` edit dies.
7. **WASM-only multiplayer is declined, with numbers.** Every CRDT wasm arm
   (automerge 2,127,414 B) detonates the 127,500 B lean band; the owner's serverless
   preference is honored by the no-server transport instead — and the DO relay
   (ruling 3) keeps it, since a hibernating object is serverless in the sense the
   owner meant: no host to run, no bill while nobody plays. The trie veto is
   DECLINED (T6.1) on the condition it was priced against — the op ledger proven at
   scale: 20,000 ops, 16 authors, adversarial interleave, six replicas byte-identical
   (`useSession.stress.test.ts`).

## Verification bar (per lane, per merge — nothing heavier)

- Build green; the affected e2e files green both engines locally; full suite rides CI.
- **Visual verification is the gate the owner ordered**: each lane ships
  before/after crops of its real surface (dist build, own port band 4230–4260);
  the chair LOOKS before merging. No golden frames the drawer chip — gallery's
  crayon hoist is proven by measured contrast ≥4.5:1 plus the crop look, not a
  phantom re-mint.
- Briefs' born-RED rows land with their lanes (mobile's two relational locks,
  debug's negative assertion, motion's FILL_ALLOWLIST true-up same-commit).
- **Line-cite law**: brief cites are formation-HEAD references — every lane
  re-greps before editing. Mobile re-derives its docGrowth/pageVh constants after
  controls lands; the brief's numbers are stale by construction.
- **Named cross-lane gate at mobile's merge**: gallery-view portrait — the
  `--fold-bottom` publisher still no-ops at fold height 0, and `.board-group`'s
  `margin-block: auto` looks right in gallery view.
- Each brief carries an **AUDIT RIDER** (appended 2026-08-02) that overrides its
  body where they conflict — `AUDIT.md` is the reconciliation record.

## Close

Deploy via the gated path on a pinned green run; production re-pass (identity +
routes + two edge smoke rows); the owner sees crops per mark. Standing T5 rows
(CH-62 park, CH-63 watch) carry unchanged; new flake instances book per the law.

Tranche net ≈ +550 LOC — the multiplayer feature rides atop mark lanes that are
net-negative (~−100). The fewer-lines law binds each lane's cut, not the feature's
existence.
