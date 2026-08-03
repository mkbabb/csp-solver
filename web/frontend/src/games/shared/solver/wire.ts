/**
 * THE WIRE GUARD (T5-W2 2.2d) — one refusal, three length-prefixed clue codecs.
 *
 * Thermo, Killer and KenKen all pack their furniture as `[k, …k words]` groups concatenated
 * into one flat `Uint32Array`, and all three used to ABSORB a group that ran off the end of
 * the buffer: thermo by its `j < k && i < flat.length` loop bound, killer and kenken by a bare
 * `break` on the dangling count. A truncated frame therefore decoded to a SHORTER tube or a
 * cage the sender never wrote, and neither the solver client nor the permalink could tell that
 * from a legitimate one — the fail-explicit defect this wave names, on the one seam where the
 * caller is either a Worker response or an untrusted `?board=`.
 *
 * A malformed frame is not a short frame. It throws, here, in the codec that owns the shape,
 * so both consumers inherit the guard: `createSolverClient` surfaces it as a solver failure,
 * and `createPersistence` catches it and fails the link closed.
 */

/**
 * Demand `span` more words at `at`. Throws `RangeError` naming the codec and the shortfall —
 * the message is the diagnostic a silent `break` never gave anyone.
 */
export function demandGroup(
  buf: Uint32Array,
  at: number,
  span: number,
  what: string,
): void {
  if (at + span > buf.length) {
    throw new RangeError(
      `${what}: truncated group, ${span} word(s) claimed at offset ${at}, ` +
        `${Math.max(0, buf.length - at)} present`,
    );
  }
}
