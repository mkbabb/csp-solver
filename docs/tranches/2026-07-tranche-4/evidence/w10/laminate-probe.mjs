// T4-W10 lane I1 — the laminate lay-down π/DELTA probe.
//
// The laminate arrive (`.answer-key-laminate.is-shown`) transitions scale 1.02→1.0 +
// opacity 0→1 over 280ms. This wave RE-POINTS its curve from the retired overshoot
// spring (0.34, 1.56, 0.64, 1) onto the audit-4 monotone glass curve (--ease-glassGlide).
// DELTA = velocity profile changes (overshoot → monotone); start/end pose + 280ms UNCHANGED.
//
// This probe reads the SHIPPED `--ease-glassGlide` token off the dist (:4488) and drives a
// WAAPI animation with BOTH curves (PRE = the retired spring, POST = the live glass token),
// seeking currentTime to sample scale(t). Overshoot = any frame where scale < 1.0 (the
// laminate dips under its 1.0 target then springs back). The glass curve is monotone → no
// such frame. Filmstrip = 3 probes seeked to 0/140/280ms (POST curve), light + dark.
//
// RUN (against the BUILT DIST only): cd web/frontend && npm run build &&
//   npx vite preview --port 4488 --strictPort, then
//   PLAYWRIGHT_BASE_URL=http://localhost:4488 node .../laminate-probe.mjs

import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4488';
const OUT = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(OUT, '../../../../../web/frontend/package.json'));
const { chromium } = require('@playwright/test');

const PRE = 'cubic-bezier(0.34, 1.56, 0.64, 1)'; // the retired overshoot spring (pre-wave laminate arrive)
const DUR = 280;
const STOPS = [0, 140, 280];

mkdirSync(OUT, { recursive: true });

async function traceCurve(page, curve) {
  return await page.evaluate(
    async ({ curve, DUR }) => {
      const el = document.createElement('div');
      el.style.cssText = 'position:fixed;top:-300px;left:0;width:120px;height:120px;';
      document.body.appendChild(el);
      const anim = el.animate(
        [
          { transform: 'scale(1.02)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        { duration: DUR, easing: curve, fill: 'both' }
      );
      anim.pause();
      const samples = [];
      for (let t = 0; t <= DUR; t += 5) {
        anim.currentTime = t;
        const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
        samples.push({
          t,
          scale: +m.a.toFixed(6),
          opacity: +(+getComputedStyle(el).opacity).toFixed(4),
        });
      }
      el.remove();
      return samples;
    },
    { curve, DUR }
  );
}

function analyze(samples) {
  const scales = samples.map((s) => s.scale);
  const min = Math.min(...scales);
  const overshootFrames = samples.filter((s) => s.scale < 1.0 - 1e-6);
  return {
    startScale: samples[0].scale,
    startOpacity: samples[0].opacity,
    endScale: samples[samples.length - 1].scale,
    endOpacity: samples[samples.length - 1].opacity,
    durationMs: samples[samples.length - 1].t,
    minScale: +min.toFixed(6),
    overshootPresent: overshootFrames.length > 0,
    overshootFrameCount: overshootFrames.length,
    overshootFrames: overshootFrames.map((s) => ({ t: s.t, scale: s.scale })),
  };
}

async function filmstrip(page, { theme, glassCurve }) {
  await page.evaluate(
    async ({ theme, glassCurve, DUR, STOPS }) => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-background') || '#fff';
      const fg = getComputedStyle(document.documentElement).getPropertyValue('--color-foreground') || '#000';
      document.body.innerHTML = '';
      document.body.style.cssText = `margin:0;background:${bg};color:${fg};font-family:monospace;`;
      const strip = document.createElement('div');
      strip.style.cssText = 'display:flex;gap:28px;padding:40px;align-items:center;justify-content:center;';
      document.body.appendChild(strip);
      const cards = [];
      for (const t of STOPS) {
        const cell = document.createElement('div');
        cell.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:12px;';
        const stage = document.createElement('div');
        stage.style.cssText =
          'width:180px;height:180px;display:flex;align-items:center;justify-content:center;border:1px dashed rgba(128,128,128,.4);border-radius:12px;';
        const card = document.createElement('div');
        card.style.cssText =
          'width:150px;height:150px;border-radius:12px;background:linear-gradient(165deg,hsl(0 0% 100%/.22),hsl(0 0% 100%/.1) 38%,hsl(0 0% 100%/.16));box-shadow:4px 6px 0 rgba(0,0,0,.08),0 6px 20px rgba(0,0,0,.14);border:1px solid rgba(128,128,128,.25);';
        stage.appendChild(card);
        const anim = card.animate(
          [
            { transform: 'scale(1.02)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 },
          ],
          { duration: DUR, easing: glassCurve, fill: 'both' }
        );
        anim.pause();
        anim.currentTime = t;
        const label = document.createElement('div');
        label.style.cssText = 'font-size:13px;text-align:center;line-height:1.5;';
        cell.appendChild(stage);
        cell.appendChild(label);
        strip.appendChild(cell);
        cards.push({ t, card, label });
      }
      // Second pass AFTER a style flush — read the frozen computed pose so the
      // numeric readout matches the rendered frame (synchronous read races recalc).
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      for (const { t, card, label } of cards) {
        const m = new DOMMatrixReadOnly(getComputedStyle(card).transform);
        const op = +getComputedStyle(card).opacity;
        label.innerHTML = `<b>${t}ms</b><br>scale ${m.a.toFixed(4)}<br>opacity ${op.toFixed(2)}`;
      }
      const title = document.createElement('div');
      title.style.cssText = 'text-align:center;font-size:14px;padding:8px 40px 0;opacity:.75;';
      title.textContent = `answer-key laminate lay-down — var(--ease-glassGlide) ${glassCurve.trim()} · 280ms · ${theme}`;
      document.body.insertBefore(title, strip);
    },
    { theme, glassCurve, DUR, STOPS }
  );
  const file = join(OUT, `laminate-open-filmstrip-${theme}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

const browser = await chromium.launch({ args: ['--force-color-profile=srgb'] });
const context = await browser.newContext({ viewport: { width: 900, height: 360 }, deviceScaleFactor: 2 });
const page = await context.newPage();
await page.goto(BASE);
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });

// The live shipped glass token (minified in dist — numerically identical control points).
const GLASS = (await page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue('--ease-glassGlide').trim()
)) || 'cubic-bezier(0.32, 0.72, 0, 1)';

const preTrace = await traceCurve(page, PRE);
const postTrace = await traceCurve(page, GLASS);
const pre = analyze(preTrace);
const post = analyze(postTrace);

const light = await filmstrip(page, { theme: 'light', glassCurve: GLASS });
const dark = await filmstrip(page, { theme: 'dark', glassCurve: GLASS });

const out = {
  surface: 'AnswerKeyLaminate .answer-key-laminate.is-shown (lay-down / arrive)',
  transition: 'transform 280ms <curve>, opacity 280ms <curve> — scale 1.02→1.0, opacity 0→1',
  base: 'HEAD 766aa068',
  preWave: {
    label: 'retired overshoot spring',
    curve: PRE,
    ...pre,
  },
  postWave: {
    label: 'audit-4 monotone glass curve (shipped --ease-glassGlide token, read off dist)',
    curve: GLASS,
    ...post,
  },
  delta: {
    overshootPresentPreWave: pre.overshootPresent,
    overshootAbsentPostWave: !post.overshootPresent,
    startPoseUnchanged: pre.startScale === post.startScale && pre.startOpacity === post.startOpacity,
    endPoseUnchanged: pre.endScale === post.endScale && pre.endOpacity === post.endOpacity,
    durationUnchanged: pre.durationMs === post.durationMs,
  },
  filmstrips: { light, dark },
  preTrace,
  postTrace,
};
writeFileSync(join(OUT, 'laminate-velocity-trace.json'), JSON.stringify(out, null, 2));

console.log('GLASS token (dist) =', GLASS);
console.log('PRE  (overshoot spring):', JSON.stringify(pre));
console.log('POST (glass glide)     :', JSON.stringify(post));
console.log('DELTA:', JSON.stringify(out.delta));
console.log('filmstrips:', light, dark);
await browser.close();
