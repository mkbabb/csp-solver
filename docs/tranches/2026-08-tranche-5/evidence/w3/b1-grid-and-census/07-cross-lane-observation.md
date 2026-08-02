# Two reds in `gallery-deal.spec.ts` that are not this lane's

Recorded because a sweep run from this lane surfaced them, and a red seen and unbanked is a red
that gets rediscovered at the gate.

The wave's lanes share one working tree. At the time of this lane's sweep the tree also held
another lane's in-flight edits to `src/pencil/chrome/GameGallery/GameGallery.vue`,
`GameCard.vue`, and two new gallery unit tests. Their guard copy has changed, and the existing
e2e still asserts the old string:

```
[chromium] gallery-deal.spec.ts:197  guard: a deal onto ANOTHER game with work on it arms the ribbon
[chromium] gallery-deal.spec.ts:318  guard: a cross-game deal ABANDONS the mounted board …
    expect(locator('.gallery-guard')).toHaveAttribute(…)
    Expected: "Deal a new board?"
    Received: "deal over this puzzle?"
```

Both reproduce on a dev server and on a built dist, on the tree as it stood — nothing in this
lane's estate is named by either. This is the guard-naming row landing (W3 3.2 / the loop's
one-string principle); the row that renames the guard owns this spec's expectation with it.

A third failure, `gallery-deal.spec.ts:432 (a same-game deal issued BEFORE the scene mounts)`,
appeared ONLY against the built preview: the test holds `page.route(/futoshiki\/spec/)`, and a
built dist serves that module as `assets/spec-<hash>.js`, which the pattern cannot match. It is
green on the dev server. A harness artifact of running a dev-shaped spec against a dist — not a
defect, and not a reason to touch the spec.
