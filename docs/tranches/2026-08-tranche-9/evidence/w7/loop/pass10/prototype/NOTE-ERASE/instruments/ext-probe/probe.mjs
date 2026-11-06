// NOTE-ERASE pass 10 row 4: can the default headless shell load an extension (user-origin insertCSS)?
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('@playwright/test');
const D = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE/bin/ext-probe';
const ext = `${D}/ext`, port = process.argv[2] ?? '4240';
const log = (...a) => console.log(new Date().toISOString().slice(11, 23), ...a);
log('executable', chromium.executablePath());
const ctx = await chromium.launchPersistentContext(`${D}/profile-${Date.now()}`, {
  headless: true,
  args: [`--disable-extensions-except=${ext}`, `--load-extension=${ext}`],
});
try {
  log('browser', ctx.browser()?.version() ?? '(persistent: no Browser handle)');
  let sw = ctx.serviceWorkers();
  log('service workers at launch', sw.length);
  if (!sw.length) {
    const w = await ctx.waitForEvent('serviceworker', { timeout: 10000 }).catch((e) => (log('waitForEvent serviceworker:', String(e).split('\n')[0]), null));
    if (w) sw = [w];
  }
  log('service workers after 10 s', sw.length, sw.map((w) => w.url()).join(' '));
  const page = await ctx.newPage();
  try {
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const r = await page.evaluate(() => ({
      cs: document.documentElement.dataset.erase10cs ?? null,
      user: getComputedStyle(document.documentElement).getPropertyValue('--erase10-user').trim() || null,
    }));
    log('content script ran:', r.cs, '| USER-origin insertCSS applied:', r.user);
    log(r.cs || r.user ? 'VERDICT: the shell admits the extension' : 'VERDICT: UNPLANTABLE in the default headless shell (no service worker, no content script, no user sheet)');
  } finally { await page.close(); }
} finally { await ctx.close(); }
