/**
 * LOBBY_COPY — every word the seating chart puts in front of a reader, in one place
 * (T9-W7 PLR-PLACE §4).
 *
 * Two gates read this file and neither can read a template literal spread across three
 * components: `check-font-coverage`'s `lobbyStrings` derive proves the woff2 subset carries
 * every codepoint drawn here, and `check-copy-register`'s `COPY_SOURCES` reads it as rendered
 * copy (no em dash, no first person, the cut). A string that is not here is a string no gate saw.
 *
 * The count is a DIGIT, not a word: `3 other players`, never `three other players` — the cut
 * carries 0-9 and the register is the estate's own (`2 players`, the well's status line).
 */
export const LOBBY_COPY = {
  none: "no other players",
  one: "1 other player",
  you: "you",
  more: "and N more",
  quiet: "N seconds ago",
} as const;

/** The state line: the count of OTHERS, said as a count. */
export function stateLine(others: number): string {
  if (others === 0) return LOBBY_COPY.none;
  if (others === 1) return LOBBY_COPY.one;
  return `${others} other players`;
}

/** `and N more` — the remainder past the last row slot. */
export function moreLine(n: number): string {
  return LOBBY_COPY.more.replace("N", String(n));
}

/** How long a peer has been silent, said in whole seconds. */
export function quietLine(ms: number): string {
  return LOBBY_COPY.quiet.replace("N", String(Math.round(ms / 1000)));
}
