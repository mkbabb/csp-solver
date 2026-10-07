import { test } from '@playwright/test';
import fs from 'node:fs';
import { cellPage, invite, crowd, readSheet } from './lib';
const OUT = process.env.OUT!;
type C = [number, number, boolean, number];
const CELLS: C[] = (process.env.CELLS
  ? JSON.parse(process.env.CELLS)
  : [
      ...[680, 692, 700, 704, 708, 712, 716, 720, 724, 730, 736, 748, 760, 768, 780, 800, 820, 844, 900].map((w) => [w, 800, true, 3] as C),
      [1024, 768, true, 3], [1180, 820, true, 3], [768, 1024, true, 3], [820, 1180, true, 3], [744, 1133, true, 3], [700, 1024, true, 3],
      [844, 390, true, 3], [812, 375, true, 3], [844, 390, true, 4], [812, 375, true, 4],
      [1280, 800, false, 3], [1280, 720, false, 3], [900, 640, false, 3], [800, 700, false, 3], [1024, 768, false, 3], [1280, 800, false, 4],
      [390, 664, true, 3], [390, 800, true, 3], [390, 844, true, 3], [390, 664, true, 4], [390, 844, true, 4], [430, 932, true, 4],
    ]) as C[];
test('sweep', async ({ browser }, info) => {
  const load = () => fs.readFileSync('/dev/null', 'utf8');
  for (const [w, h, coarse, size] of CELLS) {
    let ctx: any, page: any;
    try {
      ({ ctx, page } = await cellPage(browser, w, h, coarse, size));
      const r = await Promise.race([
        (async () => { await invite(page); await crowd(page, 6, `sw${w}x${h}`); return readSheet(page); })(),
        new Promise<never>((_, no) => setTimeout(() => no(new Error('cell guard 90s')), 90000)),
      ]);
      const l = JSON.stringify({ ...r, eng: info.project.name, cell: `${w}x${h}`, ptr: coarse ? 'coarse' : 'fine', size });
      fs.appendFileSync(OUT, l + '\n'); console.log(l);
    } catch (e) {
      fs.appendFileSync(OUT, JSON.stringify({ eng: info.project.name, cell: `${w}x${h}`, size, err: String(e).slice(0, 200) }) + '\n');
    }
    await ctx?.close().catch(() => {});
  }
});
