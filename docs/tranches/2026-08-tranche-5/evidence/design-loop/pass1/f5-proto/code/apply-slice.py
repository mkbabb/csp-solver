#!/usr/bin/env python3
"""F5 slice (D1+D2+D3) — copy the real files, apply the change, keep both.

READ-ONLY against the project tree: sources are read, never written. Every
output lands in this directory as `<name>.before` / `<name>.after`, and the
unified diff (`f5-slice.diff`) is generated from the pair with a/ b/ prefixes so
it applies with `git apply -p1` from web/frontend/ if the owner ever wants it.

Each replacement is an EXACT string match against the shipped bytes; a miss is a
hard failure (the spec's line numbers drifted), never a silent no-op.
"""
import pathlib
import subprocess
import sys

SRC = pathlib.Path(
    "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend"
)
OUT = pathlib.Path(__file__).parent

GRAPHITE = "var(--color-pencil-graphite, var(--grid-line-color))"

# ── D2 · the pressure ladder ────────────────────────────────────────────────
INK_TOKENS = f"""
  /* ── ink pressure (4) — F5/D2 · the graphite pressure ladder ─────────────
     Rank is carried by PRESSURE as well as by size. The mix is the idiom the
     panel already ships (`.heading-value`, GameControlPanel §UI-12) hoisted to
     tokens, so four rungs read as one ladder instead of four literals. Measured
     on --color-card (light #fdfdfc / dark hsl(24 6% 7%)) — all four AA both
     themes: full 14.78/12.03 · firm 9.19/8.90 · med 6.57/7.14 · light 5.23/6.06.
     Why graphite and not --color-muted-foreground: the muted token sits at
     4.65:1, 0.15 above the AA floor, so it cannot be lightened for a lower rung
     without failing — a one-stop ramp. Graphite ramps. */
  --ink-press-full: color-mix(in srgb, {GRAPHITE} 100%, transparent);
  --ink-press-firm: color-mix(in srgb, {GRAPHITE} 85%, transparent);
  --ink-press-med: color-mix(in srgb, {GRAPHITE} 75%, transparent);
  --ink-press-light: color-mix(in srgb, {GRAPHITE} 68%, transparent);
}}"""

REGISTERS = """
  /* F5/D2 — the heading's pressure rung. Replaces `text-muted-foreground` on
     every drawer heading: same graphite family as the rest of the ladder, one
     rung under the rank-1 label. Deliberately NOT folded into .section-heading
     — the difficulty heading still overrides the tone by crayon class, exactly
     as it does today. */
  .heading-ink {
    color: var(--ink-press-med);
  }

  /* F5/D3 — the rank-3 eyebrow: the PREFERENCE register. .section-heading is a
     rank-2 instrument (√φ heading rung, 800, caps); this is its caption-rung
     sibling — same display face and caps grammar, the smallest voice in the
     panel, at ambient pressure. It labels a control without heading it. */
  .eyebrow-caption {
    font-family: var(--font-display);
    font-size: var(--type-caption);
    line-height: var(--type-leading-caption);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: var(--type-tracking-caps);
    color: var(--ink-press-light);
  }
}"""

ASSIST_TEMPLATE_BEFORE = """<template>
  <div
    class="assist-settings flex flex-col gap-2"
    role="group"
    aria-label="Board assists"
  >
    <!-- Error-check mode (ROW 2): Off (train yourself) / Ask (check-anytime) / Live (as-you-go).
         Re-tapping Ask re-checks — OptionSelector emits on every click, so the on-demand snapshot
         needs no separate trigger. Default Ask, never a mistake-counter (§B3 design law). -->
    <div class="flex flex-col items-center gap-1 md:items-stretch">
      <h2 class="section-heading text-muted-foreground" aria-label="Check for errors">
        Check
      </h2>
      <OptionSelector
        :options="CHECK_OPTIONS"
        :selected="errorCheckMode"
        :boil-frame="0"
        :mobile="mobile"
        @change="onCheckChange"
      />
    </div>

    <!-- Persistent auto-candidates (ROW 3): the engine's surviving domains, un-gated from the
         held-peek behind a persistent, opt-in toggle. Default Off (the NYT clutter lesson). -->
    <div class="flex flex-col items-center gap-1 md:items-stretch">
      <h2
        class="section-heading text-muted-foreground"
        aria-label="Show candidate marks"
      >
        Candidates
      </h2>
      <OptionSelector
        :options="CANDIDATE_OPTIONS"
        :selected="candidatesPinned ? 'on' : 'off'"
        :boil-frame="0"
        :mobile="mobile"
        @change="onCandidatesChange"
      />
    </div>
  </div>
</template>
"""

ASSIST_TEMPLATE_AFTER = """<template>
  <!-- F5/D3 — the two preference stanzas collapse to ONE caption-tier row under a
       hairline: an .eyebrow-caption label inline beside each selector. Both keep
       full .ctrl-btn buttons (never a switch, never inert) — re-tapping Ask IS the
       on-demand check, and that rides the same-value re-emit — so every click seam
       and the 44px coarse floor (index.css §R3) survive untouched. `mobile` is
       passed to BOTH selectors as OptionSelector's ROW-vs-column layout switch, not
       a regime claim: the desktop column form stacked three options vertically,
       which is where the reclaimed height was. aria-labels kept verbatim. -->
  <div class="assist-settings" role="group" aria-label="Board assists">
    <hr class="border-border/50 my-2 w-full" />
    <div
      class="flex flex-wrap items-baseline justify-center gap-y-1"
      :class="mobile ? 'gap-x-3' : 'gap-x-5'"
    >
      <div class="flex items-baseline gap-1.5">
        <h2 class="eyebrow-caption" aria-label="Check for errors">Check</h2>
        <OptionSelector
          :options="CHECK_OPTIONS"
          :selected="errorCheckMode"
          :boil-frame="0"
          mobile
          @change="onCheckChange"
        />
      </div>
      <div class="flex items-baseline gap-1.5">
        <h2 class="eyebrow-caption" aria-label="Show candidate marks">Cands</h2>
        <OptionSelector
          :options="CANDIDATE_OPTIONS"
          :selected="candidatesPinned ? 'on' : 'off'"
          :boil-frame="0"
          mobile
          @change="onCandidatesChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* THE demotion — and the whole reason OptionSelector's API gains nothing: an
   UNLAYERED scoped rule outranks the Tailwind `text-[1rem]` utility (layered
   declarations lose to unlayered), so the caption rung lands with no `size` prop,
   no --ctrl-size plumbing, no second component. Scoped here, so Size / Difficulty
   / Marks keep their rung — including the first .ctrl-btn on the page, which
   visual-regression.spec.ts:150-153 asserts at ≥19px. */
.assist-settings :deep(.ctrl-btn) {
  font-size: var(--type-caption);
  padding-inline: 0.5rem;
}

.assist-settings :deep(.options-row) {
  padding: 0;
  gap: 0.1rem;
}
</style>
"""

PATCHES = {
    "src/assets/typography.css": [
        ("  --type-tracking-caps: 0.1em;\n}", "  --type-tracking-caps: 0.1em;\n" + INK_TOKENS.lstrip("\n")),
        (
            """      text-align: left;
      padding-left: 0.75rem;
    }
  }
}""",
            """      text-align: left;
      padding-left: 0.75rem;
    }
  }
"""
            + REGISTERS.lstrip("\n"),
        ),
    ],
    "src/games/shared/GameControlPanel.vue": [
        # D1 — the die to the grain-static band ceiling (×2: mobile + desktop mounts)
        (
            '<DiceIcon :size="28" :playing="dealAnimating" />',
            '<DiceIcon :size="32" :playing="dealAnimating" />',
        ),
        # D2 — the heading rung, via the shared component class
        (
            'return cc ? ["transition-colors", "duration-250", cc] : ["text-muted-foreground"];',
            'return cc ? ["transition-colors", "duration-250", cc] : ["heading-ink"];',
        ),
        (
            """.new-game-heading {
  text-align: center;
  color: var(--color-muted-foreground);""",
            """.new-game-heading {
  text-align: center;
  /* F5/D2: the ladder's rank-2 rung, not the muted token (see typography.css). */
  color: var(--ink-press-med);""",
        ),
        # D1-a — the PRECONDITION the spec missed: `.deal-btn` (:757) and `.icon-btn`
        # (:804) are both single-class selectors, so the LATER one wins and the
        # shipped fine-pointer Deal button is a fixed 2.75rem box. Its column
        # content (die + sublabel) overflows and the only shrinkable item — the
        # inline SVG — absorbs it: the shipped desktop die renders 28×17.6, a 37%
        # vertical crush. D1's 32px die + 32.93px label overflow by 32.9px, which
        # collapses the die to height 0 (measured). Raising the selector's
        # specificity restores the rule's declared intent at zero new lines.
        (
            """.deal-btn {
  flex-direction: column;""",
            """.icon-btn.deal-btn {
  flex-direction: column;""",
        ),
        # D1 — the LABEL carries rank 1, not a bigger die
        (
            """.deal-btn .icon-sublabel {
  display: block;
}""",
            """/* F5/D1 — Deal's NAME carries rank 1, not a 48–56px die. The die stops at 32px:
   the documented ceiling of grain-static's 20–32px HOLD band (pencilConfig
   §grain-outline, "20–32px icons depend on its values"), where the rendered
   stroke is 1.8 × 32/24 = 2.40px — still under PENCIL.gridCell 2.5, so no
   strokeWidth prop and no new filter preset. The sublabel rises caption →
   --type-title (2.058rem = 32.93px = the 25.89px heading × √φ): the commit verb
   finally sits one rung ABOVE the option rows it commits, at firm pressure.
   Scoped to `.deal-btn` — Clear / Fill / Solve / Share / Undo stay at caption —
   and the CLASS NAME is untouched, which is what e2e mobile-affordances.spec.ts
   :352,:367 binds to. line-height stays the inherited 1: "Deal"/"sure?" carry no
   descender, so the rung costs its glyph height and nothing more. */
.deal-btn .icon-sublabel {
  display: block;
  font-size: var(--type-title);
  color: var(--ink-press-firm);
}""",
        ),
        # D2 — the third sub-AA hole: the armed rose on Deal itself
        (
            """/* The armed Clear asks in the teacher's rose — the one moment a sublabel raises its voice. */
.icon-sublabel.is-armed {
  color: var(--color-crayon-rose);""",
            """/* The armed Clear asks in the teacher's rose — the one moment a sublabel raises its
   voice. F5/D2: the raw wax reads 4.10:1 on --color-card (< AA 4.5), and D1 puts it at
   32.93px on Deal, so it takes the ink tier already minted for this hue (index.css
   --color-red-ink, 4.98:1) — the same wax→ink move the difficulty headings made. */
.icon-sublabel.is-armed {
  color: var(--color-red-ink);""",
        ),
        # D2 — canonize the 68% literal onto the token
        (
            """  /* T4-W10 gate 1: 60% graphite was 4.10:1 on --color-card (< AA 4.5); 68% clears it —
     5.23:1 light / 6.06:1 dark. Still the quiet closed-tab value, one pressure step firmer. */
  color: color-mix(
    in srgb,
    var(--color-pencil-graphite, var(--grid-line-color)) 68%,
    transparent
  );""",
            """  /* T4-W10 gate 1: 60% graphite was 4.10:1 on --color-card (< AA 4.5); 68% clears it —
     5.23:1 light / 6.06:1 dark. F5/D2: that 68% literal IS the ladder's ambient rung —
     it becomes the token, byte-for-byte the same color. */
  color: var(--ink-press-light);""",
        ),
    ],
    "src/games/shared/AssistSettings.vue": [(ASSIST_TEMPLATE_BEFORE, ASSIST_TEMPLATE_AFTER)],
    "src/games/shared/PencilModeToggle.vue": [
        (
            '<h2 class="section-heading text-muted-foreground" aria-label="Pencil marks">',
            '<h2 class="section-heading heading-ink" aria-label="Pencil marks">',
        )
    ],
    "src/pencil/chrome/KeyboardLegend.vue": [
        (
            """    font-family: var(--font-hand);
    color: color-mix(
      in srgb,
      var(--color-pencil-graphite, var(--grid-line-color)) 55%,
      transparent
    );""",
            """    font-family: var(--font-hand);
    /* F5/D2: 55% graphite was 3.53:1 on --color-card — under AA for text at
       caption scale. The ladder's ambient rung clears it (5.23 light / 6.06 dark)
       and keeps the legend the quietest text in the panel. */
    color: var(--ink-press-light);""",
        ),
        (
            """  border: 1.5px solid
    color-mix(
      in srgb,
      var(--color-pencil-graphite, var(--grid-line-color)) 40%,
      transparent
    );""",
            """  /* F5/D2: 40% was 2.36:1 — under the 3:1 non-text floor (WCAG 1.4.11) for a
     border that carries the key's meaning. 55% reads 3.53:1. Left a literal, not
     a token: the ink ladder governs TEXT rungs; a hairline is not a rung. */
  border: 1.5px solid
    color-mix(
      in srgb,
      var(--color-pencil-graphite, var(--grid-line-color)) 55%,
      transparent
    );""",
        ),
    ],
    "src/pencil/chrome/OptionSelector/OptionSelector.vue": [
        (
            """.ctrl-btn {
  font-family: "Fira Code", monospace;
}""",
            """.ctrl-btn {
  /* F5 hygiene (0 rendered delta): --font-mono resolves to this exact stack in
     index.css @theme. One home for the face, so a rebrand re-points it once. */
  font-family: var(--font-mono);
}""",
        )
    ],
}


def main() -> int:
    diffs = []
    for rel, subs in PATCHES.items():
        src = SRC / rel
        text = src.read_text()
        after = text
        for old, new in subs:
            if old not in after:
                print(f"MISS in {rel}: {old[:70]!r}", file=sys.stderr)
                return 1
            after = after.replace(old, new)
        name = pathlib.Path(rel).name
        (OUT / f"{name}.before").write_text(text)
        (OUT / f"{name}.after").write_text(after)
        d = subprocess.run(
            [
                "diff", "-u",
                "--label", f"a/{rel}", "--label", f"b/{rel}",
                str(OUT / f"{name}.before"), str(OUT / f"{name}.after"),
            ],
            capture_output=True, text=True,
        ).stdout
        diffs.append(d)
        print(f"{rel:52s} {fmt(d)}")
    (OUT / "f5-slice.diff").write_text("".join(diffs))
    print(f"{'TOTAL (' + str(len(PATCHES)) + ' files)':52s} {fmt(''.join(diffs))}")
    return 0


def code_lines(lines: list[str]) -> list[str]:
    """Lines that carry a declaration or markup. Block-comment BODIES count as
    comment even though this estate writes bare continuation lines (no leading
    `*`), so the state machine, not a prefix test, decides. Counted separately
    because the register puts a rationale over every rule: a raw net-LOC gate
    measures prose, and the parsimony question is about code."""
    out, in_css, in_html = [], False, False
    for line in lines:
        s = line.strip()
        opened = False
        if not in_css and not in_html:
            if s.startswith("/*"):
                in_css, opened = True, True
            elif s.startswith("<!--"):
                in_html, opened = True, True
        if in_css and "*/" in s:
            in_css = False
            opened = True
        if in_html and "-->" in s:
            in_html = False
            opened = True
        if in_css or in_html or opened or not s or s.startswith("//"):
            continue
        out.append(line)
    return out


def fmt(d: str) -> str:
    add = [l[1:] for l in d.splitlines() if l.startswith("+") and not l.startswith("+++")]
    rem = [l[1:] for l in d.splitlines() if l.startswith("-") and not l.startswith("---")]
    ca, cr = code_lines(add), code_lines(rem)
    return (
        f"raw +{len(add):3d} -{len(rem):3d} = {len(add) - len(rem):+4d}"
        f"   |   code-only +{len(ca):3d} -{len(cr):3d} = {len(ca) - len(cr):+4d}"
    )


if __name__ == "__main__":
    sys.exit(main())
