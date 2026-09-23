/** PLR-COUNT pass 6 — a COPY of PLR-SELF's pass-6 p6-pi.spec.ts (OUT/CTRL/MINE by env). ONE change (charter row 8):
 *  the leader's `div.attribution-disclosure` is not skipped silently; it is DECLARED — each instance is read as its own
 *  row (tag + the 25 paint props + rect) and asserted PAINT-NEUTRAL (no background, border, outline, shadow, filter,
 *  transform; opacity 1), and it stays transparent in its descendants' keys (semantic ancestry). Original header:
 *  PLR-SELF pass 6 — π, WHOLE-DOM, dist vs control dist, keyed by SEMANTIC ancestry (LAWS P5): every element under
 *  <body>, its key = the chain of its classed ancestors' first class (the new `.attribution-disclosure` wrapper
 *  and HeadSheet's own  root class transparent — the consumer's class names the sheet) + its own tag.class + an occurrence index; 25 computed paint properties + tag + rect (0.5 px).
 *  Three reads per cell (control, control again = noise, mine), shut and with the @mbabb card DRIVEN open by its
 *  own gesture. PRM `reduce` parks the boil. An in-run FLOOR: each read must see ≥ 400 elements. */
import { test, expect, type Page, type BrowserContextOptions } from '@playwright/test';
import fs from 'node:fs';
const OUT = process.env.OUT!;
const CTRL = process.env.CTRL ?? 'http://127.0.0.1:4230', MINE = process.env.MINE ?? 'http://127.0.0.1:4231';
async function settled(p: Page) { await p.waitForSelector('svg.handwritten-logo', { timeout: 60000 }); await expect.poll(() => p.locator('.sudoku-cell .glyph-svg').count(), { timeout: 60000 }).toBeGreaterThan(0); }
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll('.sudoku-cell input')].map((i) => /given clue (\d)/.exec(i.getAttribute('aria-label') ?? '')?.[1] ?? '0').join(''));
const b64 = (s: string) => Buffer.from(s, 'latin1').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const PROPS = ['display','visibility','opacity','color','backgroundColor','borderTopWidth','borderTopStyle','borderTopColor','borderLeftWidth','borderRadius','outlineStyle','fontFamily','fontSize','fontWeight','lineHeight','filter','boxShadow','paddingTop','paddingLeft','transform','fill','stroke','strokeWidth','textDecorationLine','zIndex'];
const census = (p: Page) => p.evaluate((PROPS) => {
  const TRANSPARENT = new Set(['attribution-disclosure', 'head-sheet', 'is-open']); // the new wrapper, and HeadSheet's own root class (the consumer's class names the sheet), and the open STATE class
  const first = (e: Element) => [...e.classList].find((c) => !TRANSPARENT.has(c) && !/^(data-v|md:|hidden$|flex$|items-center$|block$)/.test(c));
  const out: Record<string, any> = {}; const seen = new Map<string, number>();
  for (const el of document.body.querySelectorAll('*')) {
    if (el.classList.contains('attribution-disclosure')) {
      const cs = getComputedStyle(el) as any; const b = el.getBoundingClientRect();
      const k = seen.get('DECLARED') ?? 0; seen.set('DECLARED', k + 1);
      const rec: any = { tag: el.tagName, rect: [b.x, b.y, b.width, b.height].map((v) => Math.round(v * 2) / 2).join(',') };
      for (const q of PROPS) rec[q] = cs[q];
      out[`DECLARED attribution-disclosure#${k}`] = rec;
      continue;
    }
    const chain: string[] = []; let n: Element | null = el.parentElement;
    while (n && n !== document.body) { const f = first(n); if (f) chain.unshift(f); n = n.parentElement; }
    const own = first(el);
    const base = chain.slice(-4).join('>') + '>' + el.tagName.toLowerCase() + (own ? '.' + own : '');
    const k = seen.get(base) ?? 0; seen.set(base, k + 1);
    const b = el.getBoundingClientRect(); const cs = getComputedStyle(el) as any;
    const rec: any = { tag: el.tagName, rect: [b.x, b.y, b.width, b.height].map((v) => Math.round(v * 2) / 2).join(',') };
    for (const q of PROPS) rec[q] = cs[q];
    out[`${base}#${k}`] = rec;
  }
  return out;
}, PROPS);
function diff(a: any, b: any) {
  const rows: string[] = [];
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[k], y = b[k];
    if (!x || !y) { rows.push(`${x ? 'ONLY-CONTROL' : 'ONLY-MINE'} ${k}`); continue; }
    for (const q of Object.keys(x)) if (JSON.stringify(x[q]) !== JSON.stringify(y[q])) rows.push(`${k} :: ${q} ${JSON.stringify(x[q])} -> ${JSON.stringify(y[q])}`);
  }
  return rows;
}
const CELLS: { name: string; opts: BrowserContextOptions }[] = [
  { name: 'desk-fine', opts: { viewport: { width: 1280, height: 800 } } },
  { name: 'phone-coarse', opts: { viewport: { width: 390, height: 844 }, hasTouch: true } },
];
for (const cell of CELLS) for (const scheme of ['light', 'dark'] as const)
  test(`pi ${cell.name} ${scheme}`, async ({ browser }, info) => {
    const seedCtx = await browser.newContext({ ...cell.opts, colorScheme: scheme }); const sp = await seedCtx.newPage();
    await sp.goto(`${CTRL}/?size=3&difficulty=EASY`); await settled(sp); const g0 = await givens(sp); await seedCtx.close();
    const payload = b64('\x01' + '3.' + g0);
    const read = async (base: string, open: boolean) => {
      const ctx = await browser.newContext({ ...cell.opts, colorScheme: scheme, reducedMotion: 'reduce' });
      const p = await ctx.newPage(); await p.goto(`${base}/?size=3&difficulty=EASY&board=${payload}`); await settled(p);
      const coarse = await p.evaluate(() => matchMedia('(pointer: coarse)').matches);
      const g = await givens(p);
      if (open) {
        const t = p.locator('.attribution-trigger:visible').first();
        if (cell.opts.hasTouch) await t.tap(); else await t.hover();
        await expect.poll(() => p.locator('.hover-card:visible').first().evaluate((e) => getComputedStyle(e).opacity)).toBe('1');
      }
      let last = ''; await expect.poll(async () => { const v = JSON.stringify(await census(p)); const s = v === last; last = v; return s; }, { intervals: [300], timeout: 15000 }).toBe(true);
      const c = JSON.parse(last); await ctx.close();
      return { g, c, coarse };
    };
    const res: any = { engine: info.project.name, cell: cell.name, scheme, payload: payload.slice(0, 16) + '…' };
    for (const open of [false, true]) {
      const c1 = await read(CTRL, open), c2 = await read(CTRL, open), m = await read(MINE, open);
      const n = [c1, c2, m].map((r) => Object.keys(r.c).length);
      expect(Math.min(...n), 'in-run floor').toBeGreaterThanOrEqual(400);
      const declared = Object.entries(m.c).filter(([k]) => k.startsWith('DECLARED'));
      const neutral = declared.every(([, r]: any) => r.tag === 'DIV' && r.backgroundColor === 'rgba(0, 0, 0, 0)' && r.borderTopWidth === '0px' && r.borderLeftWidth === '0px' && r.outlineStyle === 'none' && r.boxShadow === 'none' && r.filter === 'none' && r.transform === 'none' && r.opacity === '1');
      expect(declared.length, 'the wrapper is present on the tree').toBeGreaterThan(0);
      expect(neutral, 'the declared wrapper is paint-neutral').toBe(true);
      res[open ? 'open' : 'shut'] = { declared: declared.map(([k, r]: any) => `${k} ${r.tag} display=${r.display} rect=${r.rect}`), neutral, coarse: [c1.coarse, m.coarse], givensSame: [c1.g === g0, c2.g === g0, m.g === g0], n, noise: diff(c1.c, c2.c), mine: diff(c1.c, m.c) };
    }
    fs.appendFileSync(OUT, JSON.stringify(res) + '\n');
    console.log('P6PI', info.project.name, cell.name, scheme, 'noise', res.shut.noise.length, res.open.noise.length, 'mine', res.shut.mine.length, res.open.mine.length);
  });
