import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { cellPage, invite, crowd, mark, lobby } from './lib';
const OUT = process.env.OUT!;
for (const [w, h, coarse] of [[1280, 800, false], [1032, 768, true]] as const) test(`settle ${w}x${h}`, async ({ browser }, info) => {
  const { ctx, page } = await cellPage(browser, w, h, coarse, 3);
  await invite(page);
  await crowd(page, 6, `st${w}`);
  await mark(page).click();
  await expect(lobby(page)).toHaveClass(/is-open/);
  const series = await page.evaluate(async () => {
    const out: string[] = [];
    const t0 = performance.now();
    while (performance.now() - t0 < 3000) {
      const el = [...document.querySelectorAll('[data-lobby]')].find((e) => e.getBoundingClientRect().width > 0)!;
      const s = el.getBoundingClientRect();
      const b = document.querySelector('.board-peek-host')!.getBoundingClientRect();
      const cells = [...document.querySelectorAll('.sudoku-cell')].map((c) => c.getBoundingClientRect()).filter((c) => c.width > 0);
      const lap = cells.filter((c) => c.left < s.right && c.right > s.left && c.top < s.bottom && c.bottom > s.top).length;
      const c0 = cells[0];
      const anims = document.getAnimations().filter((a) => a.playState === 'running').map((a: any) => a.animationName ?? a.transitionProperty ?? '?').slice(0, 4).join(',');
      out.push(`${Math.round(performance.now() - t0)} sheet ${s.width.toFixed(1)}x${s.height.toFixed(1)}@${s.left.toFixed(1)},${s.top.toFixed(1)} rows ${el.querySelectorAll('.pl-row').length} board ${b.left.toFixed(1)},${b.top.toFixed(1)} ${b.width.toFixed(1)} cell0 ${c0.left.toFixed(1)},${c0.top.toFixed(1)} ${c0.width.toFixed(1)} lap ${lap} anims[${anims}]`);
      await new Promise((r) => setTimeout(r, 100));
    }
    return out;
  });
  const dedup = series.filter((l, i) => i === 0 || l.replace(/^\d+ /, '') !== series[i - 1].replace(/^\d+ /, ''));
  fs.appendFileSync(OUT, JSON.stringify({ eng: info.project.name, cell: `${w}x${h}`, dedup }) + '\n');
  console.log(dedup.join('\n'));
  await ctx.close();
});
