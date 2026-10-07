/** PLR-PLACE pass 8 (copied from PLR-SELF's pass-6 p6-pi via PLACE's pass-7 p7c-pi; OUT by env; + a ROOM arm) — π, WHOLE-DOM, dist vs control dist, keyed by SEMANTIC ancestry (LAWS P5): every element under
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
    if (el.classList.contains('attribution-disclosure')) continue;
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

// π ON A ROOM (pass 8): both arms DEV (a room forms only behind DEV, T9-R1), A hosts on the banked
// payload, B joins under a pinned id, A's id pinned by the seeded identity stream. Read on A: shut,
// then (mine only has one) with the head's card open. Control twice (noise), mine once.
const PAY = JSON.parse(fs.readFileSync(new URL('./payload.json', import.meta.url), 'utf8'));
async function roomOn(browser: any, base: string, opts: BrowserContextOptions, scheme: 'light' | 'dark') {
  const ctx = await browser.newContext({ ...opts, colorScheme: scheme, reducedMotion: 'reduce' });
  await ctx.addInitScript(() => { let s = 0x0b0b0b, t = 0x0a0a0a; Math.random = () => (/playerIdentity|useSession/.test(new Error().stack ?? '') ? (t = (t * 16807) % 2147483647) / 2147483647 : (s = (s * 16807) % 2147483647) / 2147483647); });
  const a = await ctx.newPage(); await a.goto(`${base}/?size=3&difficulty=EASY&wire=local&board=${PAY.payload}`); await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]');
  const docked = !(await verb.isVisible());
  if (docked) { await a.locator('.drawer-tab').first().click(); await expect(verb).toBeVisible(); await a.waitForTimeout(700); }
  await verb.click();
  await expect.poll(() => a.locator('.players-roster .player-row').count()).toBe(1);
  if (docked) { await a.locator('.drawer-tab').first().click(); await expect(a.locator('#controls-drawer .drawer-case')).toBeHidden(); }
  const link = a.url(); const rm = new URL(link).searchParams.get('s')!;
  const b = await ctx.newPage();
  await b.addInitScript((r: string) => sessionStorage.setItem('session-identity-v1', JSON.stringify({ [r]: 'p-0000000b0b0b' })), rm);
  await b.goto(link); await settled(b);
  await a.bringToFront();
  await expect.poll(() => a.locator('.players-roster .player-row').count(), { timeout: 20000 }).toBe(2);
  let last = ''; await expect.poll(async () => { const v = JSON.stringify(await census(a)); const s = v === last; last = v; return s; }, { intervals: [300], timeout: 15000 }).toBe(true);
  const c = JSON.parse(last); const g = await givens(a); await ctx.close();
  return { c, g };
}
if (process.env.P8_PI === 'room') for (const cell of [{ name: 'desk-fine', opts: { viewport: { width: 1280, height: 800 } } }, { name: 'phone-coarse', opts: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } }]) for (const scheme of ['light', 'dark'] as const)
  test(`pi room ${cell.name} ${scheme}`, async ({ browser }, info) => {
    test.slow();
    const c1 = await roomOn(browser, CTRL, cell.opts, scheme), c2 = await roomOn(browser, CTRL, cell.opts, scheme), m = await roomOn(browser, MINE, cell.opts, scheme);
    const n = [c1, c2, m].map((r) => Object.keys(r.c).length);
    expect(Math.min(...n), 'in-run floor').toBeGreaterThanOrEqual(400);
    const res = { engine: info.project.name, cell: cell.name, scheme, room: true, payload: PAY.payload.slice(0, 14) + '…', ids: 'A seeded, B p-0000000b0b0b', n, givensSame: [c1.g, c2.g, m.g].map((x) => x === c1.g), noise: diff(c1.c, c2.c), mine: diff(c1.c, m.c) };
    fs.appendFileSync(OUT, JSON.stringify(res) + '\n');
    console.log('P8PIROOM', info.project.name, cell.name, scheme, 'noise', res.noise.length, 'mine', res.mine.length);
  });
if (process.env.P8_PI !== 'room') {
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
      res[open ? 'open' : 'shut'] = { coarse: [c1.coarse, m.coarse], givensSame: [c1.g === g0, c2.g === g0, m.g === g0], n, noise: diff(c1.c, c2.c), mine: diff(c1.c, m.c) };
    }
    fs.appendFileSync(OUT, JSON.stringify(res) + '\n');
    console.log('P6PI', info.project.name, cell.name, scheme, 'noise', res.shut.noise.length, res.open.noise.length, 'mine', res.shut.mine.length, res.open.mine.length);
  });
}
