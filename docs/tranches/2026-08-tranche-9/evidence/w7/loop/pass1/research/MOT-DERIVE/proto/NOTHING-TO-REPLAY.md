# Nothing to replay

The charter gates the runnable half explicitly: "THE RUNNABLE HALF (only if the arithmetic
lands)". It did not land. See `../README.md` §0 and §2.

So this directory holds no overlay, no `.diff`, no evaluate script and no frame trace. Nothing
was built, nothing was served past the geometry probe (`../probe/p2-deck-and-boxes.mjs` on
:4248), and no product file was modified.

If a later pass wants to replay the reasoning rather than the prototype, the four probes under
`../probe/` are the whole lane and they are runnable today: p1, p3 and p4 need no server at all,
and p2 needs any dev server on `--port 4248 --strictPort`.

Had the arithmetic landed, the overlay would have been a `page.evaluate` hook wrapping
`Element.prototype.animate` to rewrite `options.duration` from the keyframe's own translate
before delegating — no source patch, no worktree. It is written here for the record and not as
a recommendation:

```js
// NOT SHIPPED. The family died on arithmetic; this is what would have proved it if it had not.
const orig = Element.prototype.animate;
Element.prototype.animate = function (kf, opts) {
  const from = Array.isArray(kf) ? kf[0]?.transform : null;
  const m = from && /translate(?:X)?\(\s*(-?[\d.]+)px(?:\s*,\s*(-?[\d.]+)px)?\s*\)/.exec(from);
  if (m && opts && typeof opts.duration === "number") {
    const travel = Math.hypot(Number(m[1]), Number(m[2] ?? 0));
    opts = { ...opts, duration: Math.round(BASE_MS + travel / PAPER_SPEED) };
  }
  return orig.call(this, kf, opts);
};
```

The one thing worth noticing about it: it can only reach the WAAPI layer. The card step's three
cards transition on `--card-step-ms` in CSS (`GameGallery.vue:930` → `GameCard.vue:410`), which
this hook never touches — so even the prototype would have shown the track and the cards
disagreeing.
