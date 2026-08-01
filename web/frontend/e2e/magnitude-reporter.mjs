// T5-W1.9 — THE CH-42 MAGNITUDE PROBE. Not a gate, and never to become one.
// Records the CONTINUOUS variable the golden gate thresholds at 0.017 and then discards:
// Playwright prints "N pixels (ratio R …)" only on failure, so 51 of the campaign's 67
// banked observations carry no magnitude (r3/goldens-estate §3.2). Run under
// GOLDEN_MAGNITUDE=1 (asserts at ratio 0 — strictly tighter than the gate, so it cannot
// manufacture a green) every capture is forced to report. One JSONL row per attempt.
// Protocol + decision rule, fixed before any run: evidence/w1/magnitude-rule.md.
// Usage: MAGNITUDE_OUT=<file> MAGNITUDE_ARM=<n> --reporter=./e2e/magnitude-reporter.mjs,list
import { appendFileSync, readFileSync } from 'node:fs';

const OUT = process.env.MAGNITUDE_OUT ?? 'magnitude.jsonl';
const ARM = process.env.MAGNITUDE_ARM ?? '?';
const GOLDENS = [['toggle crest', 'toggle-crest-dark'], ['logo wordmark', 'logo-light']];
const RATIO = /(\d[\d,]*) pixels \(ratio [\d.]+ of all image pixels\) are different/g;

/** Exact denominator from the baseline's own IHDR — width@16, height@20. Re-derived, never assumed. */
const geomPx = (key) => {
  const b = readFileSync(new URL(`./goldens/${key}-${process.platform}.png`, import.meta.url));
  return b.readUInt32BE(16) * b.readUInt32BE(20);
};

export default class MagnitudeReporter {
  onTestEnd(test, result) {
    const key = GOLDENS.find(([m]) => test.title.includes(m))?.[1];
    if (!key) return;
    const text = [...result.errors.map((e) => e.message ?? ''), ...result.stdout.map(String)].join('\n');
    const px = [...text.matchAll(RATIO)].map((m) => Number(m[1].replace(/,/g, '')));
    const px0 = geomPx(key);
    // A PASS under GOLDEN_MAGNITUDE=1 is asserted at maxDiffPixelRatio 0, so it means zero
    // differing pixels — a measured 0.000000, not a missing measurement. Without this the
    // quietest possible surface would read as instrument silence (rule §5.1 E-4). Pilot
    // amendment, made before either sample arm ran; see magnitude-rule.md §3.1.
    if (px.length === 0 && result.status === 'passed') px.push(0);
    appendFileSync(
      OUT,
      JSON.stringify({
        ts: new Date().toISOString(), arm: ARM, golden: key,
        repeat: test.repeatEachIndex, retry: result.retry, status: result.status,
        ms: result.duration, geomPx: px0, capturesPx: px,
        verdictPx: px[0] ?? null, verdictRatio: px.length ? px[0] / px0 : null,
        worstRatio: px.length ? Math.max(...px) / px0 : null,
      }) + '\n',
    );
  }
}
