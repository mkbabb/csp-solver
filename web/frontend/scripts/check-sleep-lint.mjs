#!/usr/bin/env node
// T7-W3 cross-cutting gate 1 — THE SLEEP LINT.
//
// CH-63's ten roster rows were half discipline defects, and the discipline defect has one
// shape: a FIXED-DURATION WAIT standing in for a settle, then a ONE-SHOT read off a surface
// that is still moving, then a non-retrying `expect` on that read. The suite passes whenever
// the machine is fast and reds whenever it isn't; nothing in the estate ever watched for it,
// so each occurrence was answered with a per-row harden and the class walked 43%→59%.
//
// The narrow wording ("no sleep before a geometry or pixel read") misses the headline row.
// `a11y.spec.ts:305` sleeps 2000ms and then reads `userEntries(page)` — a COUNT, not a pixel,
// and the very guard the test races can still change it. So the rule this gate enforces is:
//
//   No fixed-duration wait may precede an assertion on a value read from a live or
//   animating surface — geometry, pixel, OR a count a still-running guard can mutate.
//
// Two waits are fixed-duration, and the gate reads both:
//
//   W1  `page.waitForTimeout(N)` — the literal sleep. Window: the next 10 code lines,
//       never crossing into the next test.
//   W2  a literal-ms DEADLINE inside a `page.evaluate` sampling window — `if (t < 900)
//       requestAnimationFrame(tick)`, `setTimeout(res, 700)`. Window: the rest of the
//       enclosing test. `drawer.spec.ts`'s 900ms rAF window is exactly this: no
//       `waitForTimeout` appears anywhere near it, yet `:154`'s one-shot `boardBox` inherits
//       the whole unsettledness of the window that preceded it, 40 lines up. A gate that
//       only greps `waitForTimeout` calls that row green, which is how it survived.
//
// A read is LIVE if it touches a moving surface — `boundingBox`, `screenshot`, `count`,
// `textContent`, or an `evaluate` whose body reads `getBoundingClientRect`/`getComputedStyle`/
// `getAnimations`/`offsetWidth`/`scrollLeft`/`classList.contains`. Helpers resolve: a
// module-scope function whose body contains a live read IS a live read at its call sites.
// Both born-RED targets need this — `userEntries` wraps a `.count()`, `boardBox` wraps a
// `getBoundingClientRect` — and without it the gate is vacuous on the two rows it exists for.
//
// An assertion counts only if it CANNOT retry: `expect(x)` on an already-read value. Anything
// that re-reads until it agrees — `expect.poll(…)`, `.toPass(…)`, `await expect(locator)…` —
// is the cure, not the disease, and is never flagged.
//
// TWO ESCAPES, both deliberate and both cited:
//   • EXEMPT (below) — four load-bearing sites where the sleep IS the measurement window.
//     Entries re-locate by CONTENT, not by line, so a reformat can't silently widen them;
//     an entry that no longer resolves reds as stale.
//   • an inline `sleep-ok: <reason>` tag on the wait line, its trailing comment, or the two
//     lines above it. A reason under 12 characters is not a reason and reds.
//
// Run: `node scripts/check-sleep-lint.mjs` (npm run lint:sleep), cwd web/frontend.
//      `--self-test` runs the analyzer over RED and GREEN fixtures and fails if a red fixture
//      passes or a green fixture flags — the canary. In-memory, no disk residue.
//      `--census` prints every fixed-duration wait site on disk with its verdict.
//
// CENSUS AT BIRTH, re-derived rather than quoted (2026-08-03, tracked tree at `af508288`):
// 39 `waitForTimeout` sites across 12 spec files + 1 fixed in-page sampling window — the wave's
// "39 / 12" CONFIRMED. A working tree carrying sibling waves' new specs reads higher (42 / 13
// with W2's `access.spec.ts` and W3-gate-4's `prm-void-audition.spec.ts` on disk); the census
// line re-derives on every run, so the number is never quoted from a document again.
//
// Of the 39: 4 exempt (below), 15 flagged at birth, the rest clean; the sampling window makes
// 16 findings. One known residue this gate deliberately does NOT rule on:
// `wordmark-integrity.spec.ts:183` polls, so it reads clean here — but it polls "has ink" while
// asserting ink-box EDGES, which is the wave's separate wrong-invariant order, not a sleep.

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const E2E = join(ROOT, "e2e");

/* ── the exemption table ───────────────────────────────────────────────────────
 * Four sites, all in `gallery.spec.ts`, where the sleep is not a settle proxy — it IS the
 * measurement window. Each is located by an `anchor` (the wait line) plus a `near` regex that
 * must match within ±4 lines, so the entry survives a reformat and dies if the site does.
 * Adding one is a deliberate edit that has to say WHY the elapsed time is the subject.
 */
const EXEMPT = [
  {
    file: "gallery.spec.ts",
    anchor: /waitForTimeout\(50\)/,
    near: /page\.mouse\.move\(c\.x \+ \(dx \* i\) \/ steps/,
    why:
      "The 50ms is the drag's own cadence, not a settle: it paces a synthesized pointer " +
      "stream so the deck sees a human-speed drag rather than a teleport. Deleting it " +
      "changes the gesture under test, not the wait for it. (born at gallery.spec.ts:72)",
  },
  {
    file: "gallery.spec.ts",
    anchor: /waitForTimeout\(700\)/,
    near: /flank1 = await activeIndexOf\('#gallery-card-1'\)/,
    why:
      "The 700ms IS the assertion: 'the flank never advanced across several ~8Hz beats'. " +
      "There is no settle to poll for — the claim is that nothing happens for a duration, " +
      "and a poll on 'nothing' is a tautology. (born at gallery.spec.ts:233)",
  },
  {
    file: "gallery.spec.ts",
    anchor: /waitForTimeout\(100\)/,
    near: /press\('ArrowRight'\)/,
    why:
      "The 100ms places the grab MID-FLIGHT inside a 440ms glass-curve step — the test's " +
      "whole subject is interrupting a running glide. Waiting for settle would delete the " +
      "condition under test. (born at gallery.spec.ts:322)",
  },
  {
    file: "gallery.spec.ts",
    anchor: /waitForTimeout\(30\)/,
    near: /const b = await drawn\(\)/,
    why:
      "The 30ms is the interval between two deliberate samples: the claim is that the drawn " +
      "position does not JUMP across the grab, which needs two reads separated in time. The " +
      "elapsed time is the independent variable. (born at gallery.spec.ts:336)",
  },
];

/* ── liveness vocabulary ───────────────────────────────────────────────────── */

/** Reads that touch a moving surface directly. */
const LIVE_CALL =
  /\.(boundingBox|screenshot|count|textContent|innerText|allTextContents|inputValue|elementHandles)\s*\(/;

/** Inside an `evaluate` body, the tokens that mean "this reads the live document". */
const LIVE_IN_EVALUATE =
  /getBoundingClientRect|getComputedStyle|getAnimations|offset(Width|Height|Top|Left)|scroll(Left|Top|Width|Height)|client(Width|Height)|classList\.contains|\.matches\(|getPropertyValue|\.length\b/;

/** Retrying assertions — the cure. Never a finding. */
const RETRYING = /expect\s*\.\s*poll|\.toPass\s*\(|await\s+expect\s*\(/;

/** A fixed-duration sleep. */
const SLEEP = /\.waitForTimeout\s*\(\s*(\d+)\s*\)/;

/** The escape tag. */
const SLEEP_OK = /sleep-ok:\s*(.+?)\s*(?:\*\/)?\s*$/;

/* ── source utilities ──────────────────────────────────────────────────────── */

/** Strip line comments and string bodies for depth counting; keep length roughly sane. */
const decomment = (line) =>
  line
    .replace(/\/\/.*$/, "")
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, "``");

/** A line that continues its expression onto the next one (arrow heads, operators, commas). */
const CONTINUES = /(=>|=|,|\|\||&&|\+|\?|:)\s*$/;

/**
 * End index (inclusive) of the block opened on `start`. A one-line arrow head
 * (`const boardBox = (page: Page) =>`) balances its parens ON the declaration line, so
 * naive depth counting would call the block one line long and read no body at all — which is
 * exactly how `boardBox` and `userEntries` would escape liveness resolution, and the gate
 * would go vacuous on both born-RED targets.
 */
function blockEnd(lines, start) {
  let depth = 0;
  for (let i = start; i < lines.length; i++) {
    for (const ch of decomment(lines[i])) {
      if (ch === "(" || ch === "{" || ch === "[") depth++;
      else if (ch === ")" || ch === "}" || ch === "]") depth--;
    }
    if (depth > 0) continue;
    if (i === start && CONTINUES.test(decomment(lines[i]).trimEnd())) {
      depth = 0;
      continue;
    }
    return i;
  }
  return lines.length - 1;
}

/** Every top-level-ish construct that owns a body: tests, describes, functions, arrow consts. */
const BLOCK_HEAD =
  /^\s*(?:export\s+)?(?:async\s+)?(?:function\s+[A-Za-z_$][\w$]*|const|let|var|test(?:\.(?:only|skip|fixme|describe))?\s*\()/;
const TEST_HEAD = /^\s*test(?:\.(?:only|skip|fixme))?\s*\(/;

/**
 * The innermost block STRICTLY containing line `i`: [start, end, isTest]. Strictly, because a
 * sampling window opens on a `const samples = await page.evaluate(` line, which is itself a
 * block head — scoping the site to its own declaration would give it an empty window and a
 * free green, which is precisely how drawer.spec.ts's 900ms window reads clean.
 */
function scopeOf(lines, i) {
  let best = null;
  for (let j = 0; j < i; j++) {
    if (!BLOCK_HEAD.test(lines[j])) continue;
    const end = blockEnd(lines, j);
    if (end >= i && (!best || j > best[0])) best = [j, end, TEST_HEAD.test(lines[j])];
  }
  return best ?? [0, lines.length - 1, false];
}

/**
 * Module-scope helpers that are themselves live reads. `boardBox` is a one-line arrow around
 * `getBoundingClientRect`; `userEntries` is a one-line arrow around `.count()`. Resolved to a
 * fixpoint so a helper calling a live helper is live too.
 */
function liveHelpers(lines) {
  const decls = [];
  lines.forEach((l, i) => {
    // Indented decls count: `gallery.spec.ts` declares `activeIndexOf` and `drawn` INSIDE the
    // test bodies whose sleeps they bracket, and a module-scope-only scan reads both green.
    const m =
      /^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/.exec(l) ||
      /^\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(?:async\s*)?\(/.exec(
        l,
      );
    if (m) decls.push({ name: m[1], start: i, end: blockEnd(lines, i) });
  });
  const live = new Set();
  for (let pass = 0; pass < 4; pass++) {
    let grew = false;
    for (const d of decls) {
      if (live.has(d.name)) continue;
      const body = lines.slice(d.start, d.end + 1).join("\n");
      const direct =
        LIVE_CALL.test(body) ||
        (/\.evaluate/.test(body) && LIVE_IN_EVALUATE.test(body));
      const viaHelper = [...live].some((n) => new RegExp(`\\b${n}\\s*\\(`).test(body));
      if (direct || viaHelper) {
        live.add(d.name);
        grew = true;
      }
    }
    if (!grew) break;
  }
  return live;
}

/** Does line `i` read a live surface? Returns the bound variable name, or "" for an inline read. */
function liveReadAt(lines, i, helpers) {
  const line = lines[i];
  if (!/await\b|=>/.test(line) && !LIVE_CALL.test(line)) return null;
  let live = LIVE_CALL.test(line);
  if (!live && /\.evaluate(Handle)?\s*\(/.test(line)) {
    const body = lines.slice(i, blockEnd(lines, i) + 1).join("\n");
    live = LIVE_IN_EVALUATE.test(body);
  }
  if (!live) {
    for (const h of helpers) {
      if (new RegExp(`\\b${h}\\s*\\(`).test(line)) {
        live = true;
        break;
      }
    }
  }
  if (!live) return null;
  const bind =
    /(?:const|let|var)\s+(?:\{[^}]*\}|\[[^\]]*\]|([A-Za-z_$][\w$]*))\s*=/.exec(line);
  return { name: bind?.[1] ?? "", line: i };
}

/** A NON-retrying assertion on `name` (or on an inline read) inside [from, to]. */
function oneShotAssertOn(lines, from, to, name) {
  for (let i = from; i <= Math.min(to, lines.length - 1); i++) {
    const l = lines[i];
    if (!/\bexpect\s*\(/.test(l)) continue;
    if (RETRYING.test(l)) continue;
    if (!name) {
      if (LIVE_CALL.test(l) || /\.evaluate/.test(l)) return i;
      continue;
    }
    // The subject may span a wrapped `expect(` call — read the whole span.
    const span = lines.slice(i, Math.min(blockEnd(lines, i), i + 8) + 1).join("\n");
    if (new RegExp(`\\b${name}\\b`).test(span)) return i;
  }
  return null;
}

/* ── the two wait detectors ────────────────────────────────────────────────── */

/** W1 — literal `waitForTimeout`. */
function sleepSites(lines) {
  const out = [];
  lines.forEach((l, i) => {
    const m = SLEEP.exec(l);
    if (m) out.push({ kind: "sleep", line: i, ms: Number(m[1]) });
  });
  return out;
}

/**
 * W2 — a literal-ms deadline governing an in-page sampling window. The tell is a
 * `page.evaluate` span that both drives frames (`requestAnimationFrame`/`setTimeout`) and
 * stops on a millisecond literal. This is drawer.spec.ts's `if (t < 900)`.
 */
function windowSites(lines) {
  const out = [];
  lines.forEach((l, i) => {
    if (!/\.evaluate(Handle)?\s*\(/.test(l)) return;
    const end = blockEnd(lines, i);
    const body = lines.slice(i, end + 1).join("\n");
    if (!/requestAnimationFrame|setTimeout/.test(body)) return;
    const dl =
      /setTimeout\s*\([^,]+,\s*(\d{2,})\s*\)/.exec(body) ||
      /[<>]=?\s*(\d{2,})\s*\)/.exec(body);
    if (!dl) return;
    out.push({ kind: "window", line: i, ms: Number(dl[1]), end });
  });
  return out;
}

/* ── analysis ──────────────────────────────────────────────────────────────── */

/** Resolve every EXEMPT entry against a file's lines. Returns {lines:Set, stale:[]}. */
function resolveExemptions(file, lines) {
  const hit = new Set();
  const stale = [];
  for (const e of EXEMPT.filter((x) => x.file === file)) {
    if (!e.why || e.why.length < 40) {
      stale.push(`EXEMPT[${file} /${e.anchor.source}/] carries no usable reason.`);
      continue;
    }
    const found = [];
    lines.forEach((l, i) => {
      if (!e.anchor.test(l)) return;
      const ctx = lines.slice(Math.max(0, i - 4), i + 5).join("\n");
      if (e.near.test(ctx)) found.push(i);
    });
    if (found.length === 0)
      stale.push(
        `EXEMPT[${file} /${e.anchor.source}/ near /${e.near.source}/] resolves to NO site. ` +
          `The exemption outlived its sleep — delete it in the commit that removed the site, ` +
          `so a four-entry escape hatch cannot quietly become a five-entry one.`,
      );
    else if (found.length > 1)
      stale.push(
        `EXEMPT[${file} /${e.anchor.source}/] resolves to ${found.length} sites ` +
          `(lines ${found.map((n) => n + 1).join(", ")}). An exemption must name exactly one.`,
      );
    for (const f of found) hit.add(f);
  }
  return { lines: hit, stale };
}

/** The tag, read off the wait line, its trailing comment, or the two lines above. */
function sleepOkAt(lines, i) {
  for (let k = Math.max(0, i - 2); k <= i; k++) {
    const m = SLEEP_OK.exec(lines[k]);
    if (m) return m[1];
  }
  return null;
}

const WINDOW_LINES = 10;

function analyze(file, src) {
  const lines = src.split("\n");
  const helpers = liveHelpers(lines);
  const { lines: exemptLines, stale } = resolveExemptions(file, lines);
  const findings = [
    ...stale.map((s) => ({ file, line: 0, kind: "stale-exemption", why: s })),
  ];
  const census = [];

  const sites = [...sleepSites(lines), ...windowSites(lines)].sort(
    (a, b) => a.line - b.line,
  );

  for (const site of sites) {
    const [sStart, sEnd, isTest] = scopeOf(lines, site.line);
    const from = site.kind === "sleep" ? site.line + 1 : site.end + 1;
    // A sleep gets ten lines; a sampling window gets the rest of its scope, because the
    // window's whole job is to stand in for a settle and everything after it inherits that.
    const to = site.kind === "sleep" ? Math.min(site.line + WINDOW_LINES, sEnd) : sEnd;

    let verdict = "clean";
    let detail = null;
    for (let i = from; i <= Math.min(to, lines.length - 1); i++) {
      const read = liveReadAt(lines, i, helpers);
      if (!read) continue;
      const at = oneShotAssertOn(lines, i, to, read.name);
      if (at === null) continue;
      detail = { readLine: i, assertLine: at, name: read.name };
      verdict = "FLAG";
      break;
    }

    // The helper hole, closed. A fixed wait buried in a module-scope helper that is ITSELF a
    // live read has no assertion of its own to link to — and moving a flagged sleep into a
    // helper would otherwise green the gate for free. Every call site inherits the wait, so
    // the wait is flagged where it lives.
    const owner = isTest
      ? null
      : /(?:function\s+|const\s+|let\s+|var\s+)([A-Za-z_$][\w$]*)/.exec(
          lines[sStart],
        )?.[1];
    if (verdict === "clean" && owner && helpers.has(owner)) {
      verdict = "FLAG";
      detail = { helper: owner };
    }

    const exempt = exemptLines.has(site.line);
    const tag = site.kind === "sleep" ? sleepOkAt(lines, site.line) : null;
    // A cited site the heuristic would not have caught anyway is reported `exempt·inert` —
    // the table is deliberately a superset, and saying so keeps it from rotting unread.
    if (exempt) verdict = verdict === "FLAG" ? "exempt" : "exempt·inert";
    else if (verdict === "FLAG" && tag) {
      verdict = tag.length >= 12 ? "sleep-ok" : "FLAG";
      if (verdict === "FLAG")
        detail = { ...detail, thin: `sleep-ok reason too thin: "${tag}"` };
    }

    census.push({ file, ...site, verdict, detail });
    if (verdict === "FLAG")
      findings.push({
        file,
        line: site.line + 1,
        kind: site.kind,
        why:
          (site.kind === "sleep"
            ? `a fixed ${site.ms}ms sleep`
            : `a fixed ${site.ms}ms in-page sampling window`) +
          (detail.helper
            ? ` sits inside \`${detail.helper}()\`, itself a live read — every call site ` +
              `inherits it, so the wait is a settle proxy for assertions it never names.`
            : ` precedes a ONE-SHOT read off a live surface at :${detail.readLine + 1}` +
              (detail.name ? ` (\`${detail.name}\`)` : "") +
              `, asserted non-retrying at :${detail.assertLine + 1}.`) +
          (detail.thin ? ` ${detail.thin}.` : "") +
          ` Poll the invariant the assertion actually names (expect.poll / toPass / a settle` +
          ` predicate), or tag the site \`sleep-ok: <reason>\` if the elapsed time IS the` +
          ` subject.`,
      });
  }
  return { findings, census };
}

/* ── self-test: red and green fixtures ─────────────────────────────────────── */

const FIXTURES = [
  {
    name: "RED — sleep → boundingBox → one-shot expect (the plain disease)",
    file: "fixture.spec.ts",
    expect: "flag",
    src: `// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto
test('grows', async ({ page }) => {
  await page.click('.tab');
  await page.waitForTimeout(700);
  const box = await page.locator('.board').boundingBox();
  expect(box.width).toBeGreaterThan(400);
});
`,
  },
  {
    name: "RED — sleep → helper-wrapped .count() → one-shot expect (a11y:305's shape)",
    file: "fixture.spec.ts",
    expect: "flag",
    src: `// PRM: live, because the guard's own timing is the subject
function userEntries(page) {
  return page.locator('input[aria-label*="your entry"]').count();
}
test('guard', async ({ page }) => {
  const before = await userEntries(page);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2000);
  const after = await userEntries(page);
  expect(after === before).toBe(true);
});
`,
  },
  {
    name: "RED — fixed rAF deadline → distant one-shot geometry (drawer:154's shape)",
    file: "fixture.spec.ts",
    expect: "flag",
    src: `// PRM: live, because it asserts running animations
const boardBox = (page) =>
  page.evaluate(() => {
    const r = document.querySelector('.board')!.getBoundingClientRect();
    return { w: r.width };
  });
test('close glides', async ({ page }) => {
  const before = await boardBox(page);
  const samples = await page.evaluate(
    () =>
      new Promise((res) => {
        const t0 = performance.now();
        function tick() {
          const t = performance.now() - t0;
          if (t < 900) requestAnimationFrame(tick);
          else res([]);
        }
        requestAnimationFrame(tick);
      }),
  );
  expect(samples.length).toBeGreaterThanOrEqual(0);
  // …thirty lines of glide contract…
  const after = await boardBox(page);
  expect(after.w - before.w).toBeGreaterThanOrEqual(24);
});
`,
  },
  {
    name: "RED — sleep-ok tag present but the reason is a shrug",
    file: "fixture.spec.ts",
    expect: "flag",
    src: `// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto
test('grows', async ({ page }) => {
  await page.waitForTimeout(700); // sleep-ok: idk
  const box = await page.locator('.board').boundingBox();
  expect(box.width).toBeGreaterThan(400);
});
`,
  },
  {
    name: "GREEN — the cure: expect.poll over the same surface, no sleep at all",
    file: "fixture.spec.ts",
    expect: "clean",
    src: `// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto
test('grows', async ({ page }) => {
  await page.click('.tab');
  await expect
    .poll(async () => (await page.locator('.board').boundingBox()).width)
    .toBeGreaterThan(400);
});
`,
  },
  {
    name: "GREEN — sleep with a cited sleep-ok: the elapsed time is the subject",
    file: "fixture.spec.ts",
    expect: "clean",
    src: `// PRM: live, because the claim is that nothing moves for a duration
test('frozen flank', async ({ page }) => {
  const a = await page.locator('.flank').textContent();
  // sleep-ok: the 700ms IS the assertion — 'nothing advances across several 8Hz beats',
  // and a poll on 'nothing' is a tautology.
  await page.waitForTimeout(700);
  const b = await page.locator('.flank').textContent();
  expect(a).toBe(b);
});
`,
  },
  {
    name: "GREEN — a sleep before a retrying assertion (auto-waiting locator matcher)",
    file: "fixture.spec.ts",
    expect: "clean",
    src: `// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto
test('visible', async ({ page }) => {
  await page.waitForTimeout(300);
  await expect(page.locator('.board')).toBeVisible();
});
`,
  },
  {
    name: "GREEN — a sleep before a read that feeds NO assertion in the window",
    file: "fixture.spec.ts",
    expect: "clean",
    src: `// PRM: frozen — emulateMedia({reducedMotion:'reduce'}) before goto
test('logs', async ({ page }) => {
  await page.waitForTimeout(300);
  await page.mouse.move(10, 10);
  await page.keyboard.press('Enter');
});
`,
  },
];

/** A green fixture that must go RED once its exemption goes stale. */
const STALE_FIXTURE = {
  name: "RED — an EXEMPT entry that no longer resolves to a site",
  file: "gallery.spec.ts",
  src: `// PRM: live, because the drag cadence is the subject
test('nothing here', async ({ page }) => {
  await page.click('.x');
});
`,
};

function selfTest() {
  const bad = [];
  for (const f of FIXTURES) {
    const { findings } = analyze(f.file, f.src);
    const flagged = findings.filter((x) => x.kind !== "stale-exemption");
    const ok = f.expect === "flag" ? flagged.length > 0 : flagged.length === 0;
    console.log(
      `  ${ok ? "✓" : "✗"} ${f.name}\n      → ${flagged.length} flag(s), expected ${f.expect}`,
    );
    if (!ok)
      bad.push(
        f.expect === "flag"
          ? `fixture "${f.name}" stayed GREEN. The gate cannot fail for the defect it names.`
          : `fixture "${f.name}" FLAGGED. The gate reds on the cure, which makes it unusable.`,
      );
  }
  const { findings } = analyze(STALE_FIXTURE.file, STALE_FIXTURE.src);
  const stales = findings.filter((x) => x.kind === "stale-exemption");
  const ok =
    stales.length === EXEMPT.filter((e) => e.file === "gallery.spec.ts").length;
  console.log(
    `  ${ok ? "✓" : "✗"} ${STALE_FIXTURE.name}\n      → ${stales.length} stale`,
  );
  if (!ok)
    bad.push(
      `the stale-exemption check stayed silent on a file with none of its sites.`,
    );
  return bad;
}

/* ── main ──────────────────────────────────────────────────────────────────── */

const argv = process.argv.slice(2);
const wantSelfTest = argv.includes("--self-test");
const wantCensus = argv.includes("--census");

// Recursive on purpose (the motion contract lost this hole at T7-W3 residue; this gate
// loses it symmetrically): a spec under e2e/<family>/ must not escape the lint.
const walkSpecs = (dir, prefix = "") =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory())
      return e.name.startsWith(".") || e.name === "node_modules"
        ? []
        : walkSpecs(join(dir, e.name), `${prefix}${e.name}/`);
    return e.name.endsWith(".spec.ts") ? [`${prefix}${e.name}`] : [];
  });
const specs = walkSpecs(E2E).sort();

const failures = [];
const census = [];
for (const spec of specs) {
  const { findings, census: c } = analyze(spec, readFileSync(join(E2E, spec), "utf8"));
  failures.push(...findings);
  census.push(...c);
}

const sleeps = census.filter((c) => c.kind === "sleep");
const windows = census.filter((c) => c.kind === "window");
console.log(
  `SLEEP LINT — ${specs.length} specs · ${sleeps.length} waitForTimeout sites in ` +
    `${new Set(sleeps.map((s) => s.file)).size} files · ${windows.length} fixed in-page ` +
    `sampling window${windows.length === 1 ? "" : "s"} · ${EXEMPT.length} cited exemptions · ` +
    `${census.filter((c) => c.verdict === "sleep-ok").length} sleep-ok tags`,
);

if (wantCensus)
  for (const c of census)
    console.log(
      `  ${c.verdict === "FLAG" ? "✗" : "·"} ${c.file}:${c.line + 1} ${c.kind} ${c.ms}ms — ${c.verdict}`,
    );

if (wantSelfTest) {
  console.log("\nSELF-TEST — red fixtures must flag, green fixtures must not:");
  failures.push(
    ...selfTest().map((v) => ({ file: "--self-test", line: 0, kind: "self", why: v })),
  );
}

if (failures.length) {
  console.error(`\n${failures.length} failure(s):\n`);
  for (const f of failures)
    console.error(`  • ${f.file}${f.line ? `:${f.line}` : ""} — ${f.why}\n`);
  process.exit(1);
}

console.log(
  `\nOK — no fixed-duration wait precedes a one-shot assertion on a live surface across ` +
    `${specs.length} specs.`,
);
