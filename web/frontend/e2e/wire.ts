/**
 * wire.ts — the permalink wire grammar, ONE copy for every spec.
 *
 * Byte-identical to the composables' `encodeBoard` (persistence.ts): base64url of
 * `CODEC_VERSION + "<size>.<base36 cells>[.<clue words>]"`. THE VERSION BYTE IS
 * MANDATORY (T5-W2 2.4d) — a payload that does not open with it fails closed, the
 * app strips the param at decode and deals fresh, and a spec that navigated with
 * such a link measures a random board while believing it pinned one.
 *
 * That is not a hypothetical: it is this module's birth certificate. The grammar
 * was hand-rolled per spec, and the copies forked. permalink.spec.ts and
 * visual-golden.spec.ts each rode the dead absent-tag-means-v0 ratchet until W2
 * measured its death; then affordances.spec.ts re-rolled an untagged body for its
 * pinned conflict board (T5-W4 pass 8) and its 72-given settle poll went red on
 * the runner — reds that read exactly like a permalink/auto-deal race and were
 * chased as one, until a replaceState ledger proved the strip was the W2 cure
 * doing its job on a link the spec itself had malformed. share-truth.spec.ts
 * carried the same untagged copy, green only because its assertions never looked
 * at the board. Four hand-rolled copies, two silently wrong: the wire grammar
 * lives here now, and a spec that needs a board on the wire imports it.
 *
 * `encodeUntagged` stays exported for exactly one purpose — asserting the refusal
 * from the other side (permalink.spec.ts, "an untagged ?board= body fails
 * closed"). Nothing else may use it.
 *
 * THE BASE64URL SPELLING IS THE APP'S (T7-W6). This module carried its own `b64url`
 * — a fifth copy of `+`→`-`, `/`→`_`, strip-padding — written over node's `Buffer`
 * while the app's went through `btoa`. Two implementations of the outer envelope
 * under a module whose entire reason for existing is that the wire has ONE spelling.
 * They agreed byte for byte over the full latin-1 range, which is precisely how a
 * dual path survives: it costs nothing until the day it doesn't. One import kills it,
 * and it kills the node-only symbol with it — `wire.ts` is now plain DOM-typed source,
 * which is what lets `src/games/sudoku/composables/wire-parity.test.ts` import this
 * file from inside the app's own tsconfig program and hold the two encoders to
 * byte-identity at unit speed.
 */
import { toBase64Url } from '../src/lib/base64url';

/** Module-private, like the codec's own (persistence.ts:139). Nothing imported it; the three
 *  encoders below are the only sanctioned way to spell a body, tagged. */
const CODEC_VERSION = String.fromCharCode(1);

export function encodeSudoku(size: number, cells: Record<number, number>, total: number): string {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  return toBase64Url(CODEC_VERSION + `${size}.${c}`);
}

// The clue section is the UNIVERSAL one (T5-W2 2.4): whatever `spec.clues.encode` produces,
// one base-36 word per element, `,`-joined. Futoshiki's encode flattens its pairs to
// `[greater, lesser, …]`, so what used to read `1-0,5-0` now reads `1,0,5,0`.
export function encodeFutoshiki(
  size: number,
  cells: Record<number, number>,
  total: number,
  ineqs: [number, number][],
): string {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  const iq = ineqs.flat().map((w) => w.toString(36)).join(',');
  return toBase64Url(CODEC_VERSION + `${size}.${c}.${iq}`);
}

/** The pre-T4-W3 wire: a body with no version byte at all. Nothing writes it; nothing reads
 *  it. REFUSAL-FIXTURE ONLY — it exists so the fail-closed arm can be asserted, never to
 *  put a board on the wire. */
export function encodeUntagged(size: number, cells: Record<number, number>, total: number): string {
  let c = '';
  for (let i = 0; i < total; i++) c += (cells[i] ?? 0).toString(36);
  return toBase64Url(`${size}.${c}`);
}
