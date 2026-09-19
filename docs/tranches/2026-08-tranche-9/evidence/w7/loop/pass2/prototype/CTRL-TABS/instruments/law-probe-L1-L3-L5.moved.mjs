#!/usr/bin/env node
/**
 * T9-W7 pass 2 · CTRL-TABS — R6 LAW PROBE, ROWS L1, L3 AND L5, PROPOSED **MOVED**.
 *
 * L5 is added by the PROTOTYPE (the research record proposed L1 and L3): §15's cure makes the
 * confirm's safe answer a BARE WORD, and r0's L5 asserts that the guard's verbs wear
 * `HandDrawnOutline` — which is now half-true by design and reds on a tree that honours the
 * law it states. The law itself does not move: a drawn frame is still `HandDrawnOutline` and
 * never a CSS border. What moves is the population the row reads it over.
 *
 * The r0 probe (`loop/r0/r6-idiom-history/law-probe.mjs`) is FROZEN and is not edited. This is
 * the proposal the chair's §7 asks for: the two rows whose SUBJECT this family moved, re-cut so
 * they still assert a LAW rather than a literal, and still able to FAIL.
 *
 *   FE=<tree>/web/frontend node law-probe-L1-L3.moved.mjs
 *
 * Defaults to the MAIN tree, so the same file reds at HEAD (L1: the tree still sums to 9 and
 * `FILTER_BUDGET_TOTAL` still reads 9 — green; run it against the pass-1 worktree and both rows
 * green there too, at 5). That is the point: neither row learns a number.
 *
 * ── L1, as it stands (r0 law-probe.mjs:51) ──────────────────────────────────────────────
 *     return { ok: total === 9, detail: `FILTER_BUDGET rows sum to ${total}` };
 * It pins the POPULATION to a literal. The law it stands for is two claims — the declared rows
 * and the declared total agree, and the budget NEVER GROWS — and the literal 9 is neither.
 * CTRL-TABS deletes the estate's one `BoilDivider` (its four Apple-frozen poses), which the
 * original row named as its own retirement trigger (a) in `filterBudget.ts`; the total goes to
 * 5. A row that reds on a RETIREMENT is a gate pointed the wrong way.
 *
 * ── L1, re-cut ──────────────────────────────────────────────────────────────────────────
 *   · the budget rows sum to `FILTER_BUDGET_TOTAL` (the two halves of one census agree), AND
 *   · the total is ≤ 9, the population the T4-P1 deletion cure left (it may fall, never rise).
 * Falsifiable both ways: a new live filter reds it, a constant edited without its rows reds it.
 * R6-census §2 law 9 ("EXACTLY 9") re-words in the same diff to "no more than the 9 the T4-P1
 * cure left, and exactly the declared total".
 *
 * ── L3, as it stands (r0 law-probe.mjs:82) ──────────────────────────────────────────────
 *     return { ok: admitted === 2, detail: `${admitted} ADMITTED entries standing (B1's two)` };
 * It counts the LEDGER, not the reader's surface. CTRL-TABS strikes the `candidates` row with
 * the copy it excused (`what fits` renders now), so the ledger holds 1 — and the row reds on a
 * cure that is exactly what M16 asks for.
 *
 * ── L3, re-cut ──────────────────────────────────────────────────────────────────────────
 *   · `check-copy-register.mjs` exits 0 with ZERO unadmitted hits (the law's own words), AND
 *   · every ADMITTED entry is still LIVE — so a ledger row cannot outlive the copy it excuses.
 *     That is the closed-both-ways half the literal was standing in for.
 *
 * THE STALENESS ARM'S CONTROL DID NOT FIRE, and it is reported rather than left green. The
 * control: strike `candidates` from `GameControlPanel.vue` (the copy cure) and leave its ledger
 * row standing — the arm should RED and did not, because a naive `src/**` grep finds
 * `candidates` as an IDENTIFIER in `usePencilMarks.ts` and its siblings. A staleness test has to
 * read the RENDERED corpus, which is exactly the corpus `check-copy-register.mjs` already
 * builds. The arm below is therefore marked UNPROVEN: the cure is to export that script's own
 * corpus builder and ask it, in the same commit that lands this row. L1′'s control DOES fire
 * (a synthetic `count: 6` row takes the sum to 15 and reds it).
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const FE =
  process.env.FE ||
  path.join(
    import.meta.dirname,
    "../../../../../../../../../web/frontend",
  );
const read = (rel) => fs.readFileSync(path.join(FE, rel), "utf8");
const rows = [];
const law = (id, statement, cite, fn) => {
  let ok = false;
  let detail = "";
  try {
    const r = fn();
    ok = r === true || (r && r.ok === true);
    detail = (r && r.detail) || "";
  } catch (e) {
    detail = `probe threw: ${e.message}`;
  }
  rows.push({ id, statement, cite, now: ok ? "GREEN" : "RED", detail });
};

law(
  "L1′",
  "the live-filter budget's rows and its total agree, and the population never grows past 9",
  "filterBudget.ts FILTER_BUDGET_TOTAL · T4-P1 filter-deletion cure · T9-W7 §10 divider retirement",
  () => {
    const src = read("src/pencil/config/filterBudget.ts");
    const budget = src.slice(0, src.indexOf("SECONDARY CENSUS"));
    const counts = [...budget.matchAll(/count:\s*(\d+)/g)].map((m) => +m[1]);
    const total = counts.reduce((a, b) => a + b, 0);
    // The total is DERIVED in the file (`FILTER_BUDGET.reduce(...)`), so the agreement to
    // assert is between the four budget groups and the rows the exported array actually holds —
    // the same slice, counted twice, which is what the literal 9 used to stand in for.
    const derived = /FILTER_BUDGET_TOTAL\s*=\s*FILTER_BUDGET\.reduce/.test(src);
    const declared = derived
      ? total
      : +(/FILTER_BUDGET_TOTAL[^=]*=\s*(\d+)/.exec(src)?.[1] ?? NaN);
    const HIGH_WATER = 9; // what the T4-P1 cure left; a ceiling, never a target
    return {
      ok: Number.isFinite(declared) && total === declared && total <= HIGH_WATER,
      detail: `rows sum to ${total} · FILTER_BUDGET_TOTAL ${declared} · high water ${HIGH_WATER}`,
    };
  },
);

law(
  "L3′",
  "no em dash and no unadmitted jargon reaches a reader, and no admission outlives its string",
  "check-copy-register.mjs · M16 (owner 2026-08-03)",
  () => {
    let out = "";
    let exit = 0;
    try {
      out = execFileSync("node", [path.join(FE, "scripts/check-copy-register.mjs")], {
        cwd: FE,
        encoding: "utf8",
      });
    } catch (e) {
      exit = e.status ?? 1;
      out = `${e.stdout ?? ""}${e.stderr ?? ""}`;
    }
    const unadmitted = +(/(\d+)\s+unadmitted/.exec(out)?.[1] ?? NaN);
    const dashes = +(/(\d+)\s+em dash/.exec(out)?.[1] ?? 0);

    // Every ADMITTED row's own string must still be somewhere under src/ — a ledger row that
    // outlives its copy is an excuse for a string nobody renders.
    const ledger = read("scripts/check-copy-register.mjs");
    const entries = [...ledger.matchAll(/text:\s*"([^"]+)"[\s\S]{0,1600}?since:\s*"/g)].map(
      (m) => m[1],
    );
    const walk = (dir) =>
      fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
        const p = path.join(dir, d.name);
        if (d.isDirectory()) return d.name === "node_modules" ? [] : walk(p);
        return /\.(vue|ts|tsx|css)$/.test(d.name) ? [p] : [];
      });
    const corpus = walk(path.join(FE, "src"))
      .map((p) => fs.readFileSync(p, "utf8"))
      .join("\n");
    // UNPROVEN ARM — see the header: this grep reads identifiers as well as copy, so it cannot
    // red on the one case it exists for. It stays visible (and its verdict is reported) rather
    // than deleted, because the row it replaces could not red on that case either.
    const stale = entries.filter((t) => !corpus.includes(t));

    return {
      ok: exit === 0 && unadmitted === 0 && dashes === 0 && stale.length === 0,
      detail:
        `exit ${exit} · ${unadmitted} unadmitted · ${dashes} em dashes · ` +
        `${entries.length} admitted, stale: ${stale.length ? stale.join(", ") : "none"}`,
    };
  },
);

law(
  "L5\u2032",
  "one box grammar: a drawn frame is HandDrawnOutline, never a CSS border on chrome — and the " +
    "confirm's two answers differ by BOX vs BARE, so the bare one wears nothing at all",
  "HandDrawnOutline.vue; T8-W1 M4; T9-W7 §15 (the 8% ground retires, the box becomes the cue)",
  () => {
    // ── L5, as it stands (r0 law-probe.mjs:103) ──────────────────────────────────────────
    //   `class="guard-btn guard-keep"` within 400 chars of `HandDrawnOutline`.
    //   It reads ONE of the two verbs, and it reads the one the cure deliberately unboxes, so
    //   it reds on the tree that keeps the law and greens on a tree that grounds both verbs in
    //   a colour nobody can see. The row was written when `keep` happened to carry a box.
    // ── L5\u2032, re-cut ──────────────────────────────────────────────────────────────────────
    //   the DESTRUCTIVE verb carries the drawn box in BOTH confirms · the SAFE verb carries no
    //   box in either · and no `.guard-*` rule in either file declares a CSS border. Three
    //   assertions, one law, and the population is the estate's two confirms rather than one
    //   button in one of them.
    const files = {
      gallery: read("src/pencil/chrome/GameGallery/GameGallery.vue"),
      card: read("src/games/shared/GameControlPanel.vue"),
    };
    const near = (s, cls) =>
      new RegExp(`class="guard-btn ${cls}"[\\s\\S]{0,500}?</button>`).exec(s)?.[0] ?? "";
    const bad = [];
    for (const [where, src] of Object.entries(files)) {
      const destructive = near(src, "guard-(?:go|leave)");
      const safe = near(src, "guard-keep");
      if (!/HandDrawnOutline/.test(destructive))
        bad.push(`${where}: the destructive verb has no drawn box`);
      if (/HandDrawnOutline/.test(safe)) bad.push(`${where}: the safe verb is boxed`);
      // The firing control: a CSS border on any guard rule is the thing the law forbids.
      const rules = [...src.matchAll(/\.guard-[\w-]*[^{]*\{([^}]*)\}/g)].map((m) => m[1]);
      // `border: none` / `border: 0` are the estate's way of UNDRESSING a <button>, not a
      // drawn edge, so the VALUE is read rather than the property's presence (a lookahead on
      // the property alone slides past its own space and passes everything).
      const declared = [
        ...rules
          .join("\n")
          .matchAll(/(?:^|[;\s])border(?:-(?:top|right|bottom|left|block|inline))?\s*:\s*([^;]+)/g),
      ].map((m) => m[1].trim());
      if (declared.some((v) => !/^(none|0|0px)$/.test(v)))
        bad.push(`${where}: a guard rule declares a CSS border (${declared.join(", ")})`);
    }
    return { ok: bad.length === 0, detail: bad.length ? bad.join(" · ") : "both confirms: destructive boxed, safe bare, no CSS border" };
  },
);

let red = 0;
for (const r of rows) {
  if (r.now === "RED") red += 1;
  console.log(`${r.now === "GREEN" ? "GREEN" : "RED  "}  ${r.id}  ${r.statement}`);
  console.log(`        ${r.detail}`);
  console.log(`        cite: ${r.cite}`);
}
console.log(`\n${rows.length - red} GREEN / ${red} RED`);
process.exit(red ? 1 : 0);
