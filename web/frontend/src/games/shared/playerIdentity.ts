/**
 * Who a player is, and what colour they write in — both DERIVED, neither negotiated
 * (T6 mark 13).
 *
 * A slug is a pure function of the peer's own id, so a name costs no wire traffic and no
 * round trip: the roster row is drawn the instant the connection opens. Ink is the
 * golden-angle walk — `hue_i = i × 137.5°` at a lightness the theme bands — which spreads
 * ANY number of players as far apart around the circle as a sequence can, so there is no
 * palette to run out of and no player cap to enforce. The band is what makes the contrast
 * claim structural rather than a table of hand-checked hexes: `--peer-ink-l` is 0.5 on paper
 * and 0.8 at night, and at chroma 0.11 the whole walk clears AA on both grounds (worst
 * 5.26:1 light, 9.56:1 dark, measured over 40 indices).
 *
 * The crayon tiers are DIFFICULTY's vocabulary and stay there; this module mints no token
 * and touches no wax.
 */
import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";
import { hashBlob } from "./useUndoHistory";

/**
 * The pencil can only write what its cut holds. `patrickhand-subset.woff2` ships a–i, k–w,
 * y and z — no `j`, no `x` — so `jaguar` would come out half in the hand and half in the
 * system cursive, mid-word, on every roster row that drew it. The library supplies the
 * words; this takes the ones the page can actually draw. 345 of 355 animals and 1145 of
 * 1202 adjectives survive, which is 395,025 names for a room that will hold sixteen.
 */
const WRITEABLE = /^[a-ik-wyz]+$/;
const DICTIONARIES = [
  adjectives.filter((w) => WRITEABLE.test(w)),
  animals.filter((w) => WRITEABLE.test(w)),
];

/**
 * `adjective-animal` off the peer id. Deterministic, so every page in the room reads the same
 * name for the same peer with no round trip.
 *
 * THE SEED IS HASHED HERE, AND IT HAS TO BE — measured, not assumed. `uniqueNamesGenerator`
 * takes `number | string`, and its string path reaches **128 distinct names over 20,000
 * seeds**: its `getFromSeed` folds a string down to something like a character sum, so a peer
 * id (which is exactly a long random string) lands in a 128-wide space where sixteen players
 * collide better than half the time. Numeric seeds reach 18,776 of 20,000. So the peer id goes
 * through the estate's own FNV-1a first and the library is handed a number — the same library,
 * the same words, one honest line between them.
 *
 * Two ids can still land on one name, so a taken name RE-ROLLS off the next seed rather than
 * growing a numeric suffix: "brave-otter" and "brave-otter-2" are one name said twice, and the
 * whole point of a slug is that it is a word you can say out loud.
 */
export function slugFor(peerId: string, taken: ReadonlySet<string>): string {
  const seed = parseInt(hashBlob(peerId).slice(0, 8), 16);
  for (let salt = 0; ; salt++) {
    const slug = uniqueNamesGenerator({
      dictionaries: DICTIONARIES,
      separator: "-",
      length: 2,
      seed: seed + salt,
    });
    if (!taken.has(slug)) return slug;
  }
}

/**
 * The remote player's ink, as ONE formula and ONE binding: rebinding `--color-user-ink` is
 * the whole of the mechanism, because `HandwrittenGlyph` already strokes with that var
 * (`HandwrittenGlyph.vue:85`). The local player keeps the incumbent blue — nothing is bound
 * on their cells, so solo is byte-identical.
 */
export const inkFor = (index: number): Record<string, string> => ({
  "--color-user-ink": `oklch(var(--peer-ink-l) 0.11 ${((index * 137.5) % 360).toFixed(1)}deg)`,
});
