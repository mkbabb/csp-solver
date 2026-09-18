// REFUTER instrument — the visual-regression.spec.ts:790 seal, measured directly on BOTH arms.
// Repeats the row's own arithmetic (shipped panel height, then the negative control's reverted
// height) N times per arm per engine, so a red at 1227.06 can be read as a distribution rather
// than an anecdote. Read-only: it drives the two preview servers already running.
import { chromium, webkit } from 'playwright';

const SEAL = 1227.5;
const N = Number(process.env.N || 3);
const ARMS = [
  ['cured', 'http://127.0.0.1:4254'],
  ['base', 'http://127.0.0.1:4255'],
];

const PANEL_H = () => {
  const panel = document.querySelector('.controls-card .control-panel-wrap');
  return panel ? +panel.getBoundingClientRect().height.toFixed(2) : null;
};

const REVERT = `.ctrl-options.options-pair { flex-direction: column !important }
                .ctrl-options.options-pair > .ctrl-btn { flex: 0 0 auto !important }
                .peek-hold-surface { margin-block: 0.5rem !important }`;

for (const [engineName, engine] of [
  ['chromium', chromium],
  ['webkit', webkit],
]) {
  const browser = await engine.launch();
  for (const [arm, base] of ARMS) {
    for (let i = 0; i < N; i++) {
      const ctx = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        hasTouch: true,
        isMobile: true,
        baseURL: base,
      });
      const p = await ctx.newPage();
      try {
        await p.goto('./');
        await p.waitForSelector('svg.handwritten-logo', { timeout: 15000 });
        await p.waitForSelector('.ctrl-btn', { timeout: 15000 });
        const regime = await p.evaluate(() => ({
          coarse: matchMedia('(pointer: coarse)').matches,
          row: matchMedia('(min-width: 1024px)').matches,
          rail: !!document.querySelector('.controls-card .control-panel-wrap'),
        }));
        const fonts = await p.evaluate(() => document.fonts.status);
        const shipped = await p.evaluate(PANEL_H);
        await p.addStyleTag({ content: REVERT });
        await p.waitForTimeout(120);
        const reverted = await p.evaluate(PANEL_H);
        console.log(
          [
            engineName,
            arm,
            `run${i + 1}`,
            `regime=${regime.coarse}/${regime.row}/${regime.rail}`,
            `fonts=${fonts}`,
            `shipped=${shipped}`,
            `reverted=${reverted}`,
            `delta=${(reverted - shipped).toFixed(2)}`,
            `shipped<=SEAL:${shipped <= SEAL}`,
            `reverted>SEAL:${reverted > SEAL}`,
          ].join('  '),
        );
      } catch (e) {
        console.log(`${engineName}  ${arm}  run${i + 1}  ERROR ${e.message.split('\n')[0]}`);
      } finally {
        await ctx.close();
      }
    }
  }
  await browser.close();
}
