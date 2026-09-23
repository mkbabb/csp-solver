import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import sharp from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs';
const PAYLOAD = 'ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw';
const ARMS = { proto: 'http://127.0.0.1:4232', ctl: 'http://127.0.0.1:4233' };
const which = process.argv[2];
const out = [];
const log = (o) => { out.push(o); console.log(JSON.stringify(o)); };
async function open(eng, base, vw, vh, touch, theme = 'light', extra) {
  const b = await eng.launch();
  const ctx = await b.newContext({ baseURL: base, viewport: { width: vw, height: vh }, hasTouch: touch, isMobile: false, colorScheme: theme, deviceScaleFactor: 2, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  if (extra) await extra(page, ctx);
  await page.goto('/?board=' + PAYLOAD);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 45000 });
  await page.waitForSelector('.controls-card', { state: 'attached', timeout: 45000 });
  await page.waitForTimeout(800);
  const givens = await page.evaluate(() => [...document.querySelectorAll('.board-wrapper input')].map((e, i) => (/given/.test(e.getAttribute('aria-label') || '') ? `${i}:${e.value}` : null)).filter(Boolean).join(','));
  return { b, page, givens };
}
async function openDock(page) {
  await page.locator('.drawer-tab').first().click();
  let last = null;
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(80); const t = await page.evaluate(() => document.querySelector('#controls-drawer')?.getBoundingClientRect().top ?? null); if (t !== null && last !== null && Math.abs(t - last) < 0.05) break; last = t; }
}
const footRead = (page) => page.evaluate(() => {
  const foot = document.querySelector('#card-foot'); const bar = document.querySelector('.action-bar');
  const lip = document.querySelector('.bar-frame'); const caseEl = document.querySelector('.drawer-case');
  const bars = [...(bar ? bar.querySelectorAll('*') : [])].concat(bar ? [bar] : []);
  let maxB = 0; for (const e of bars) { if (e.tagName === 'KBD') continue; const cs = getComputedStyle(e); for (const s of ['Top','Right','Bottom','Left']) if (cs['border'+s+'Style'] !== 'none') maxB = Math.max(maxB, parseFloat(cs['border'+s+'Width'])); }
  const r = (e) => e ? (({ top, bottom, left, right }) => ({ top: +top.toFixed(2), bottom: +bottom.toFixed(2), left: +left.toFixed(2), right: +right.toFixed(2) }))(e.getBoundingClientRect()) : null;
  return { vh: innerHeight, footPadB: foot ? getComputedStyle(foot).paddingBottom : null, footPos: foot ? getComputedStyle(foot).position + '/' + getComputedStyle(foot).zIndex : null,
    lipPaths: lip ? lip.querySelectorAll('path').length : 0, maxBorderInBar: maxB, barBg: bar ? getComputedStyle(bar).backgroundColor : null,
    foot: r(foot), bar: r(bar), case: r(caseEl), sheet: r(document.querySelector('#controls-drawer')) };
});
async function shotMask(page, clip, hideCss) {
  const grab = async () => { const buf = await page.screenshot({ clip, animations: 'allow', caret: 'hide' }); return sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); };
  const on = await grab(); const tag = await page.addStyleTag({ content: hideCss }); await page.waitForTimeout(150); const off = await grab(); await tag.evaluate((n) => n.remove()); await page.waitForTimeout(100);
  const w = on.info.width, h = on.info.height; const cols = new Array(w).fill(0);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; const d = Math.max(...[0,1,2].map((k) => Math.abs(on.data[o+k] - off.data[o+k]))); if (d > 24) cols[x] = 1; }
  return cols;
}
// top-side coverage of the lip: columns in [bar.left+10, bar.right-10] with ink change in the band bar.top-8 .. bar.top+1
async function topCoverage(page) {
  const b = await page.evaluate(() => { const r = document.querySelector('.action-bar').getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top }; });
  const clip = { x: Math.floor(b.l + 10), y: Math.floor(b.t - 8), width: Math.floor(b.r - b.l - 20), height: 10 };
  const cols = await shotMask(page, clip, '.bar-frame .outline-svg, .bar-frame svg { visibility: hidden !important }');
  return +(cols.reduce((a, c) => a + c, 0) / cols.length).toFixed(3);
}
const E = [['chromium', chromium], ['webkit', webkit]];
if (which === 'foot') {
  for (const [en, eng] of E) for (const [arm, base] of Object.entries(ARMS)) for (const theme of ['dark', 'light']) {
    const { b, page, givens } = await open(eng, base, 390, 844, true, theme);
    await openDock(page);
    const f = await footRead(page);
    let cov = null, neg = null;
    if (f.bar) { cov = await topCoverage(page); const t = await page.addStyleTag({ content: '.card-foot{position:static !important; z-index:auto !important}' }); await page.waitForTimeout(150); neg = await topCoverage(page); await t.evaluate((n) => n.remove()); }
    log({ probe: 'foot390', en, arm, theme, givens, ...f, topCov: cov, topCovNEG_unpositioned: neg });
    await b.close();
  }
}
if (which === 'inset') {
  // chromium only: a REAL env(safe-area-inset-bottom) through CDP, not a mirror
  for (const [arm, base] of Object.entries(ARMS)) for (const inset of [0, 34]) {
    const { b, page, givens } = await open(chromium, base, 390, 844, true, 'light', async (pg, ctx) => {
      if (!inset) return; const s = await ctx.newCDPSession(pg);
      try { await s.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 47, bottom: inset, left: 0, right: 0 } }); } catch (e) { console.log('CDP-ERR ' + e.message); }
    });
    await openDock(page);
    const f = await footRead(page);
    const envProbe = await page.evaluate(() => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;bottom:0;height:env(safe-area-inset-bottom,0px);width:1px'; document.body.append(d); const h = d.getBoundingClientRect().height; d.remove(); return h; });
    const verbs = await page.evaluate(() => [...document.querySelectorAll('.action-verbs .icon-btn')].map((e) => +e.getBoundingClientRect().bottom.toFixed(2)));
    log({ probe: 'inset', en: 'chromium', arm, inset, envProbe, givens, ...f, verbBottoms: verbs });
    await b.close();
  }
}
if (which === 'note') {
  for (const [en, eng] of E) for (const [arm, base] of Object.entries(ARMS).filter(([a]) => a === 'proto')) for (const [cell, vw, vh, touch] of [['fine1440', 1440, 900, false], ['coarse1280', 1280, 800, true], ['fine1024', 1024, 768, false]]) {
    const { b, page, givens } = await open(eng, base, vw, vh, touch);
    const regime = await page.evaluate(() => ({ coarse: matchMedia('(pointer: coarse)').matches, hover: matchMedia('(hover: hover)').matches, row: matchMedia('(min-width: 1024px)').matches }));
    await page.keyboard.press('Tab');
    const rows = [];
    for (const name of ['Clear the board', 'Fill in every cell that has only one possible number', 'Solve puzzle']) {
      const ok = await page.evaluate((n) => { const e = document.querySelector(`.action-verbs [aria-label="${n}"]`); if (!e) return false; e.focus(); return e.matches(':focus-visible'); }, name);
      await page.waitForTimeout(450);
      const r = await page.evaluate((n) => {
        const btn = document.querySelector(`.action-verbs [aria-label="${n}"]`); const note = btn?.querySelector('.washi-label');
        const foot = document.querySelector('#card-foot'); const bar = document.querySelector('.action-bar'); const cs = note ? getComputedStyle(note) : null;
        if (!note) return { note: null };
        const nr = note.getBoundingClientRect(); const fr = foot.getBoundingClientRect(); const br = bar.getBoundingClientRect();
        const caseSvg = document.querySelector('.drawer-case > .outline-svg'); const cr = (caseSvg || document.querySelector('.drawer-case')).getBoundingClientRect();
        const cx = (nr.left + nr.right) / 2, cy = (nr.top + nr.bottom) / 2; const hit = document.elementFromPoint(cx, Math.min(cy, innerHeight - 1));
        return { opacity: cs.opacity, noteTop: +nr.top.toFixed(2), noteBottom: +nr.bottom.toFixed(2), noteH: +nr.height.toFixed(2), barBottom: +br.bottom.toFixed(2),
          lipBottomStrokeY: +(br.bottom + 4).toFixed(2), footBottom: +fr.bottom.toFixed(2), caseBottom: +cr.bottom.toFixed(2), vh: innerHeight,
          spillPastFoot: +(nr.bottom - fr.bottom).toFixed(2), spillPastViewport: +(nr.bottom - innerHeight).toFixed(2), hitAtCentre: hit ? hit.tagName + '.' + (hit.className?.baseVal ?? hit.className).toString().split(' ')[0] : null };
      }, name);
      rows.push({ name: name.slice(0, 12), focusVisible: ok, ...r });
    }
    log({ probe: 'note', en, arm, cell, regime, givens, rows });
    await b.close();
  }
}
if (which === 'pi') {
  for (const [en, eng] of E) for (const [cell, vw, vh, touch] of [['rail1440', 1440, 900, false], ['dock390', 390, 844, true], ['land844', 844, 390, true]]) {
    const res = {};
    for (const [arm, base] of Object.entries(ARMS)) {
      const { b, page, givens } = await open(eng, base, vw, vh, touch);
      res[arm] = await page.evaluate(() => { const r = (s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); const cs = getComputedStyle(e); return [b.x, b.y, b.width, b.height].map((v) => +v.toFixed(2)).join(',') + ' ' + cs.color + ' ' + cs.backgroundColor; }; return { board: r('.board-wrapper'), logo: r('svg.handwritten-logo'), tab: r('.drawer-tab'), case: r('.drawer-case'), filtered: [...document.querySelectorAll('*')].filter((e) => getComputedStyle(e).filter !== 'none').length, svgFilters: document.querySelectorAll('filter').length }; });
      res[arm].givens = givens; await b.close();
    }
    log({ probe: 'pi', en, cell, same: Object.fromEntries(Object.keys(res.proto).map((k) => [k, res.proto[k] === res.ctl[k]])), proto: res.proto, ctl: res.ctl });
  }
}
