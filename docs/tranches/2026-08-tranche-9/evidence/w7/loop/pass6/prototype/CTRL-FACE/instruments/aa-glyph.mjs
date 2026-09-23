// T9-W7 pass 6 · CTRL-FACE · INTAKE row 16 — AA on TEXT as the GLYPH-TEXT statistic (LAWS P5,
// registry-v5 §2.11): photograph the subject as painted and with `color: transparent`; every
// changed pixel is glyph; its coverage is keyed on the subject's COMPUTED ink (|L(px) − L(ground)|
// / |L(ink) − L(ground)|), never on the crop's own maximum; the core = coverage ≥ 0.5. Reports the
// core median contrast and the fraction of core pixels under 4.5, DPR 2, both themes; the 40 %
// ink plant (`opacity: 0.4` on the subject) must drop the core median under 4.5.
//   node aa-glyph.mjs <engine> <base> <label>
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright'); const sharp = require('sharp');
const [engine, base, label] = process.argv.slice(2);
const P = '?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const SUBJ = {
  'unselected chip': '.new-game-zone .ctrl-btn[aria-pressed="false"]',
  'selected level chip': '.new-game-zone .staged-section:last-of-type .ctrl-btn[aria-pressed="true"]',
  'level h2': '.new-game-zone .staged-section:last-of-type h2',
  'deal sublabel': '.new-game-zone .deal-btn .icon-sublabel',
  dealt: '.new-game-zone .dt-label',
  'keys sublabel': '.info-btn .icon-sublabel',
};
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r, g, b) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const CR = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const br = await pw[engine].launch();
for (const theme of ['light', 'dark']) {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: theme, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(base + '/' + P); await p.waitForSelector('.sudoku-cell .glyph-svg', { timeout: 30000 }); await p.waitForTimeout(1200);
  for (const [name, sel] of Object.entries(SUBJ)) {
    const scope = `.controls-card:not([aria-hidden]) ${sel}`;
    const info = await p.evaluate((sel) => {
      const el = [...document.querySelectorAll(sel)].find((e) => e.getClientRects().length); if (!el) return null;
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect(); const col = getComputedStyle(el).color;
      // `color(srgb r g b / a)` (a color-mix with transparent) carries 0–1 channels; rgb() 0–255
      const n = col.match(/[\d.]+/g).map(Number); const srgb = col.startsWith('color(');
      const ink = srgb ? [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1] : [n[0], n[1], n[2], n[3] ?? 1];
      return { box: { x: r.x - 2, y: r.y - 2, width: r.width + 4, height: r.height + 4 }, ink };
    }, sel);
    if (!info) { console.log(JSON.stringify({ engine, label, theme, name, absent: true })); continue; }
    const read = async (extra) => {
      const hs = extra ? await p.addStyleTag({ content: extra }) : null;
      await p.waitForTimeout(80);
      const A = await sharp(await p.screenshot({ clip: info.box })).raw().toBuffer({ resolveWithObject: true });
      const hT = await p.addStyleTag({ content: `${sel}, ${sel} * { color: transparent !important; -webkit-text-fill-color: transparent !important }` });
      await p.waitForTimeout(80);
      const B = await sharp(await p.screenshot({ clip: info.box })).raw().toBuffer({ resolveWithObject: true });
      await hT.evaluate((n) => n.remove()); if (hs) await hs.evaluate((n) => n.remove());
      const [ir, ig, ib, ia] = info.ink; const out = [];
      const ch = A.info.channels;
      for (let i = 0; i < A.data.length; i += ch) {
        const la = L(A.data[i], A.data[i + 1], A.data[i + 2]), lb = L(B.data[i], B.data[i + 1], B.data[i + 2]);
        if (Math.abs(la - lb) < 1e-4) continue;
        // the ink a fully covered pixel paints: the declared colour at its alpha over THIS ground
        const Li = L(ia * ir + (1 - ia) * B.data[i], ia * ig + (1 - ia) * B.data[i + 1], ia * ib + (1 - ia) * B.data[i + 2]);
        const cov = Math.abs(la - lb) / Math.max(1e-6, Math.abs(Li - lb));
        if (cov >= 0.5) out.push(CR(la, lb));
      }
      out.sort((a, b) => a - b);
      return out.length ? { n: out.length, median: +out[Math.floor(out.length / 2)].toFixed(3), under45: +(out.filter((x) => x < 4.5).length / out.length).toFixed(3) } : { n: 0 };
    };
    const clean = await read(null);
    const clean2 = await read(null);
    const plant = await read(`${sel} { opacity: 0.4 !important }`);
    console.log(JSON.stringify({ engine, label, theme, name, ink: info.ink.join(','), clean, second: { median: clean2.median, under45: clean2.under45 }, plant40: plant, plantReds: !plant.n || plant.median < 4.5 }));
  }
  await ctx.close();
}
await br.close();
