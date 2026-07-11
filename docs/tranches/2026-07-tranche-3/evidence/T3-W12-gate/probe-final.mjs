// T3-W12 gate: PRM vignette, drawer default-open, 10-flip stability.
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const { chromium } = require('@playwright/test');

const BASE = 'http://localhost:3001';
const browser = await chromium.launch();
const out = {};

// --- 1. Drawer default-open on FRESH storage + PRM solved vignette ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 806 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  out.freshDefaultOpen = await page.evaluate(() => {
    const rail = document.querySelector('.scene-controls');
    const card = document.querySelector('.controls-card');
    return {
      storageKey: window.localStorage.getItem('drawer-open') ?? window.localStorage.getItem('controls-drawer-open') ?? Object.keys(localStorage).filter(k => /drawer/i.test(k)).map(k => `${k}=${localStorage.getItem(k)}`).join(','),
      cardVisible: !!card && getComputedStyle(card).visibility !== 'hidden' && card.getBoundingClientRect().width > 0,
      railInert: rail?.inert ?? null,
    };
  });
  // PRM solve → vignette instant
  const t0 = Date.now();
  await page.locator('.controls-card button', { hasText: /solve/i }).first().click();
  await page.waitForSelector('.solve-success', { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(400); // PRM: presence should be immediate, no 3s crest needed
  out.prmSolved = await page.evaluate(() => {
    const star = document.querySelector('.completion-vignette svg, [class*=vignette] svg, .celebration-star');
    const r = star?.getBoundingClientRect();
    const anims = document.getAnimations().filter(a => a.playState === 'running' && !(a.effect?.getTiming?.().duration <= 250));
    return {
      starPresent: !!r && r.width > 50,
      starW: r ? +r.width.toFixed(1) : 0,
      scrollHeight: document.documentElement.scrollHeight,
      longRunningAnims: anims.length,
      animNames: [...new Set(anims.slice(0, 8).map(a => a.animationName || a.constructor.name))],
    };
  });
  out.prmSolvedElapsedMs = Date.now() - t0;
  await ctx.close();
}

// --- 2. Ten-flip toggle stability (no PRM) ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 806 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const toggle = page.locator('.sun-moon-toggle');
  for (let i = 0; i < 10; i++) {
    await toggle.click();
    await page.waitForTimeout(i % 3 === 0 ? 80 : i % 3 === 1 ? 400 : 1100); // mid-flight re-clicks + settled
  }
  await page.waitForTimeout(1500);
  out.tenFlip = await page.evaluate(() => {
    const html = document.documentElement;
    const icons = [...document.querySelectorAll('.toggle-icon')];
    return {
      dark: html.classList.contains('dark') || html.dataset.theme === 'dark' || html.className.includes('dark'),
      themeTurningStuck: html.classList.contains('theme-turning'),
      isTurningStuck: !!document.querySelector('.sun-moon-toggle.is-turning'),
      iconOpacities: icons.map(i => getComputedStyle(i).opacity),
      iconVisibilities: icons.map(i => getComputedStyle(i).visibility),
    };
  });
  await ctx.close();
}

console.log(JSON.stringify(out, null, 2));
await browser.close();
