import { encodeSudoku } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend/e2e/wire.ts";
// The pinned board: the estate's own codec (CODEC_VERSION 1 + "3.<81 base-36 cells>"), the same
// 71 givens MOT-LADDER's pass-5 π used, so the §13 tree's two lanes read ONE payload.
// prettier-ignore
const SOLVED_9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const BLANKS = new Set([0, 4, 10, 22, 36, 40, 55, 61, 73, 80]);
export const PAYLOAD = encodeSudoku(3, Object.fromEntries(SOLVED_9.map((v, i) => [i, BLANKS.has(i) ? 0 : v])), 81);
export const ARMS = { after: "http://127.0.0.1:4247", control: "http://127.0.0.1:4248", main: "http://127.0.0.1:4249" } as const;
export const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-VERB/readings";
// THE READBACK. `.board-cells`' innerText is EMPTY on this DOM (every digit is an SVG glyph), so
// a text readback compares "" with "" and passes by vacuity. The native input under each cell
// carries the value and its aria-label says "given clue N": the given-set is read off those.
export const givens = (p: import("@playwright/test").Page) =>
  p.evaluate(() =>
    [...document.querySelectorAll<HTMLInputElement>(".board-cells input")]
      .map((i) => (/given/.test(i.getAttribute("aria-label") ?? "") ? i.value : "."))
      .join(""),
  );
