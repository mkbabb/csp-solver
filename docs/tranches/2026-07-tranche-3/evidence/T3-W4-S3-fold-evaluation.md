# T3-W4 — S3 unified-Constraint-trait FOLD-EVALUATE (L25-04)

**Date:** 2026-07-10 · **Wave:** T3-W4 (lane K2) · **Disposition:** RECORD — the fold **folds**, does not land.
**Anchor:** merged HEAD `d78fef8e`+ · `constraint/traits.rs:43-51` (the cfg-gated `ThreadSafe` marker) · `constraint/dispatch.rs` (`ConstraintEnum`).

The wave rule (reconciliation R-3, A§2.6): land the unification *only if* it is clean through both
cfg branches **and** the bbnf ThreadSafe/sync-gate tripwire logic survives; otherwise record what was
tried and why it holds/folds, and do not force it. It folds.

## What the fold is

Tranche-1 S3 → L25-04: collapse the constraint dispatch **duality** into one surface. Today there are
two:

- `ConstraintEnum<D>` (`dispatch.rs:19`) — a closed, devirtualized enum (`NotEqual`, `AllDifferent`,
  `AllDifferentExcept`, `Custom(Box<dyn Constraint<D>>)`). The solver calls its **inherent**
  `scope`/`check`/`revise` (no vtable) on the hot path.
- `Constraint<D>` (`traits.rs:53`) — the open trait, `Debug + ThreadSafe` supertrait, the escape hatch
  the `Custom` variant boxes.

Two collapse directions were assessed.

## Direction (a) — everything becomes `dyn Constraint` (drop the enum)

**Folds on performance.** `ConstraintEnum` exists precisely to avoid vtable indirection for the
built-in constraints (its own doc: "Avoids vtable indirection for built-in types"). Routing
`NotEqual`/`AllDifferent`/`AllDifferentExcept` through `dyn Constraint` re-virtualizes the measured
propagation hot path — a regression, and an *encapsulation/perf* regression inside an encapsulation
tranche. The enum's `check`/`revise` dispatch to the devirtualized `*_impl` inherents by design; a
single dyn surface deletes exactly that win.

## Direction (b) — everything becomes enum variants (drop the trait / the `Custom` box)

**Folds on the open world.** The `Custom(Box<dyn Constraint<D>>)` arm is load-bearing for the
out-of-repo consumer: bbnf-lang supplies arbitrary external `Constraint` impls (`RefConstraint` plus
11+ `Custom` types) that cannot be in-crate enum variants. Removing the boxed-trait arm breaks the
exact downstream the tripwire was built to protect.

Even short of dropping the trait — merely adding `impl<D> Constraint<D> for ConstraintEnum<D>` to make
the enum a first-class trait object — carries the enum's own bounds up into the impl: its `check`
needs `D::Value: PartialEq` and its `revise` needs `D::Value: PartialEq + 'static`
(`dispatch.rs:38-39,63-64`), neither of which `Constraint<D>` carries. Either the trait acquires those
bounds (a widening that reaches every bbnf lattice `Value`) or the impl cannot be written for all `D`.
That is added surface, not a fold.

## The tripwire survives — but it is not the blocker

The `ThreadSafe` mechanism is **not** what stops this. It holds through both branches:

- `--features py`: `trait Constraint: … + ThreadSafe` with `ThreadSafe: Send + Sync`; because the
  supertrait chain terminates in the auto traits, `dyn Constraint<D>: Send + Sync`, so
  `Box<dyn Constraint<D>>`, `ConstraintEnum<D>`, and `Csp<D>` are all `Send` — `allow_threads`
  compiles. Confirmed green this wave: `cargo check --features py` → `Finished`, 0 errors.
- default (bbnf) build: `ThreadSafe` is vacuous (`impl<T> ThreadSafe for T`); `!Send` `RefConstraint`
  and the lattice/reference constraints compile unchanged.

So A13's reading holds verbatim: the sync gate is the **guardrail, not the blocker**. The fold is
blocked one level up — by the closed-fast-path / open-escape-hatch dichotomy that the enum+trait split
exists to serve. Both collapse directions destroy one half of that dichotomy (perf on the closed side,
extensibility on the open side); neither is clean.

## Disposition

**RECORD — do not land.** The duality is essential complexity, not accidental: `ConstraintEnum` is the
devirtualized closed set, `Box<dyn Constraint>` the open extension point bbnf requires. L25-04 is
hereby resolved (not re-deferred): the unification does not land, the tripwire is intact and re-proved
green, and the two-surface design is the recorded terminal disposition. Should a future need re-open
it, the wire point is the same guarded seam — through `ThreadSafe`, never around it.
