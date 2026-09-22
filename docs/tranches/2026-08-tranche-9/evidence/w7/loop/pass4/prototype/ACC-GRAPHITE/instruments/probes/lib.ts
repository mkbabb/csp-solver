/**
 * ACC-GRAPHITE pass-4 instrument library. Boards are minted with the ESTATE's own encoder
 * (`e2e/wire.ts` -> `src/lib/base64url`), never a bare name (chair pass-4 addendum): the
 * payload is a valid pattern solution `((r*s + floor(r/s) + c) mod n) + 1` masked to givens.
 */
import { encodeSudoku } from "../e2e/wire";
import sharp from "sharp";

export const OUT_ROOT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/ACC-GRAPHITE";
export const SCRATCH =
  "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc-graphite";

export function solution(size: number, i: number): number {
  const n = size * size;
  const r = Math.floor(i / n);
  const c = i % n;
  return ((r * size + Math.floor(r / size) + c) % n) + 1;
}

/** givens chosen by a fixed multiplicative scatter: cell i is given iff (i*37) mod total < g. */
export function mintBoard(size: number, givens: number) {
  const n = size * size;
  const total = n * n;
  const cells: Record<number, number> = {};
  const given: number[] = [];
  for (let i = 0; i < total; i++)
    if ((i * 37) % total < givens) {
      cells[i] = solution(size, i);
      given.push(i);
    }
  return { enc: encodeSudoku(size, cells, total), given, total, n };
}

export const BOARD9 = mintBoard(3, 30); // 9x9, 30 givens, writable 51
export const BOARD4 = mintBoard(2, 4); // 4x4, 4 givens, writable 12
export const BOARD16 = mintBoard(4, 76); // 16x16, 76 givens, writable 180

export const RIGS = [
  { name: "desk", width: 1280, height: 800, dpr: 1, touch: false },
  { name: "phone", width: 393, height: 699, dpr: 3, touch: true },
] as const;

export type Img = { data: Buffer; w: number; h: number; ch: number };
export async function toImg(buf: Buffer): Promise<Img> {
  const s = sharp(buf);
  const { data, info } = await s.raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
}
export const L = (im: Img, x: number, y: number) => {
  const i = (y * im.w + x) * im.ch;
  return 0.2126 * im.data[i] + 0.7152 * im.data[i + 1] + 0.0722 * im.data[i + 2];
};
export const rgb = (im: Img, x: number, y: number) => {
  const i = (y * im.w + x) * im.ch;
  return [im.data[i], im.data[i + 1], im.data[i + 2]] as const;
};
const lin = (v: number) => {
  const c = v / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
export const relLum = (p: readonly number[]) =>
  0.2126 * lin(p[0]) + 0.7152 * lin(p[1]) + 0.0722 * lin(p[2]);
export const contrast = (a: readonly number[], b: readonly number[]) => {
  const x = relLum(a),
    y = relLum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

/** ink test: darker than thr in light, lighter than thr in dark */
export const isInk = (v: number, thr: number, dark: boolean) => (dark ? v > thr : v < thr);

export function runAt(
  line: number[],
  seed: number,
  thr: number,
  dark: boolean,
): { s: number; e: number } | null {
  if (seed < 0 || seed >= line.length || !isInk(line[seed], thr, dark)) return null;
  let s = seed,
    e = seed;
  while (s > 0 && isInk(line[s - 1], thr, dark)) s--;
  while (e < line.length - 1 && isInk(line[e + 1], thr, dark)) e++;
  return { s, e };
}

export const median = (a: number[]) => {
  if (!a.length) return NaN;
  const b = [...a].sort((x, y) => x - y);
  const m = b.length >> 1;
  return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
};
export const pct = (a: number[], p: number) => {
  if (!a.length) return NaN;
  const b = [...a].sort((x, y) => x - y);
  return b[Math.min(b.length - 1, Math.floor((p / 100) * b.length))];
};
export const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / (a.length || 1);
export const sd = (a: number[]) => {
  const m = mean(a);
  return Math.sqrt(mean(a.map((x) => (x - m) ** 2)));
};
export const r3 = (x: number) => Math.round(x * 1000) / 1000;
