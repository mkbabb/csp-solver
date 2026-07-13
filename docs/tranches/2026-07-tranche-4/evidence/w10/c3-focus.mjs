// GATE 2 focus + forced-colors, against LIVE dist :4486. Emits JSON + capture PNGs.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const BASE = 'http://localhost:4486';
const EV = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-07-tranche-4/evidence/w10';

function elDesc() {
  const el = document.activeElement;
  if (!el) return null;
  const s = getComputedStyle(el);
  const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString().split(' ').slice(0, 3).join('.');
  let fv = false; try { fv = el.matches(':focus-visible'); } catch {}
  return {
    tag: el.tagName.toLowerCase(), cls, ariaLabel: el.getAttribute('aria-label') || '',
    focusVisible: fv,
    outlineWidth: s.outlineWidth, outlineStyle: s.outlineStyle, outlineColor: s.outlineColor,
    boxShadow: s.boxShadow === 'none' ? 'none' : s.boxShadow.slice(0, 60),
    forcedColorAdjust: s.forcedColorAdjust,
  };
}

async function tabWalk(page, n) {
  const seen = [];
  await page.evaluate(() => document.body.focus());
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(60);
    const d = await page.evaluate(elDesc);
    if (d) seen.push(d);
  }
  return seen;
}

async function main() {
  const browser = await chromium.launch();
  const out = { generatedAt: new Date().toISOString(), findings: {} };

  // ── NORMAL (no forced-colors), light, sudoku desktop: tab-walk the interactive targets ──
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    out.findings['sudoku:light:normal:tabwalk'] = await tabWalk(page, 22);

    // cell focus (text input always matches :focus-visible) → SVG ghost ring
    const cellProbe = await page.evaluate(() => {
      const input = document.querySelector('.sudoku-cell input');
      if (!input) return null;
      input.focus();
      const cell = input.closest('.sudoku-cell');
      const ghost = cell.querySelector('.cell-ghost-path');
      const gs = ghost ? getComputedStyle(ghost) : null;
      const is = getComputedStyle(input);
      return {
        inputMatchesFV: input.matches(':focus-visible'),
        inputOutline: `${is.outlineWidth} ${is.outlineStyle} ${is.outlineColor}`,
        ghostStroke: gs ? gs.stroke : null, ghostStrokeWidth: gs ? gs.strokeWidth : null,
        ghostStrokeOpacity: gs ? gs.strokeOpacity : null, ghostForcedAdjust: gs ? gs.forcedColorAdjust : null,
      };
    });
    out.findings['sudoku:light:normal:cellFocus'] = cellProbe;
    // screenshot the focused cell region (normal)
    const cellBox = await page.evaluate(() => { const c = document.querySelector('.sudoku-cell'); const r = c.getBoundingClientRect(); return { x: r.x - 20, y: r.y - 20, width: 200, height: 200 }; });
    await page.screenshot({ path: `${EV}/focus-cell-normal-light.png`, clip: cellBox });
    await ctx.close();
  }

  // ── FORCED-COLORS active, sudoku desktop ──
  for (const scheme of ['light', 'dark']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: scheme, forcedColors: 'active' });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    // focus a cell input under forced-colors, read what survives
    const cellFC = await page.evaluate(() => {
      const input = document.querySelector('.sudoku-cell input');
      if (!input) return null;
      input.focus();
      const cell = input.closest('.sudoku-cell');
      const ghost = cell.querySelector('.cell-ghost-path');
      const gs = ghost ? getComputedStyle(ghost) : null;
      const is = getComputedStyle(input);
      return {
        inputMatchesFV: input.matches(':focus-visible'),
        inputOutlineStyle: is.outlineStyle, inputOutlineWidth: is.outlineWidth, inputOutlineColor: is.outlineColor,
        ghostStroke: gs ? gs.stroke : null, ghostStrokeOpacity: gs ? gs.strokeOpacity : null,
        ghostForcedAdjust: gs ? gs.forcedColorAdjust : null,
      };
    });
    out.findings[`sudoku:${scheme}:forcedColors:cellFocus`] = cellFC;
    const cellBox = await page.evaluate(() => { const c = document.querySelector('.sudoku-cell'); const r = c.getBoundingClientRect(); return { x: Math.max(0, r.x - 30), y: Math.max(0, r.y - 30), width: 220, height: 220 }; });
    await page.screenshot({ path: `${EV}/focus-cell-forcedcolors-${scheme}.png`, clip: cellBox });

    // Tab-walk under forced colors to see which controls get a ring
    out.findings[`sudoku:${scheme}:forcedColors:tabwalk`] = await tabWalk(page, 14);

    // Focus an icon-btn via keyboard-ish: find first icon-btn, focus it, screenshot control region
    const iconInfo = await page.evaluate(() => {
      const b = document.querySelector('.icon-btn');
      if (!b) return null;
      b.focus();
      const s = getComputedStyle(b);
      return { matchesFV: b.matches(':focus-visible'), outline: `${s.outlineWidth} ${s.outlineStyle} ${s.outlineColor}`, boxShadow: s.boxShadow.slice(0, 50) };
    });
    out.findings[`sudoku:${scheme}:forcedColors:iconBtnFocus(programmatic)`] = iconInfo;

    // full controls-card screenshot under forced colors (context)
    await page.screenshot({ path: `${EV}/forcedcolors-fullpage-${scheme}.png`, fullPage: false });
    await ctx.close();
  }

  // ── drawer-tab + difficulty-tally explicit outlines under forced-colors (do they survive?) ──
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light', forcedColors: 'active' });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const probes = await page.evaluate(() => {
      const res = {};
      for (const sel of ['.difficulty-tally', '.drawer-tab', '.ctrl-btn', '.mobile-heading-btn']) {
        const el = document.querySelector(sel);
        if (!el) { res[sel] = 'not-in-DOM(desktop)'; continue; }
        el.focus();
        const s = getComputedStyle(el);
        res[sel] = { matchesFV: el.matches(':focus-visible'), outline: `${s.outlineWidth} ${s.outlineStyle} ${s.outlineColor}`, forcedColorAdjust: s.forcedColorAdjust };
      }
      return res;
    });
    out.findings['forcedColors:explicitOutlineTargets(programmaticFocus)'] = probes;
    await ctx.close();
  }

  fs.writeFileSync(`${EV}/c3-focus-raw.json`, JSON.stringify(out, null, 2));
  console.log('=== NORMAL cell focus (light) ===');
  console.log(JSON.stringify(out.findings['sudoku:light:normal:cellFocus'], null, 2));
  console.log('\n=== NORMAL tabwalk (light) — visible ring? ===');
  for (const d of out.findings['sudoku:light:normal:tabwalk']) console.log(`  ${d.tag}.${d.cls}  FV=${d.focusVisible} outline=${d.outlineWidth}/${d.outlineStyle}/${d.outlineColor} shadow=${d.boxShadow}  [${d.ariaLabel}]`);
  console.log('\n=== FORCED-COLORS light cell focus ===');
  console.log(JSON.stringify(out.findings['sudoku:light:forcedColors:cellFocus'], null, 2));
  console.log('\n=== FORCED-COLORS light tabwalk ===');
  for (const d of out.findings['sudoku:light:forcedColors:tabwalk']) console.log(`  ${d.tag}.${d.cls}  FV=${d.focusVisible} outline=${d.outlineWidth}/${d.outlineStyle}/${d.outlineColor}  [${d.ariaLabel}]`);
  console.log('\n=== FORCED-COLORS explicit-outline targets ===');
  console.log(JSON.stringify(out.findings['forcedColors:explicitOutlineTargets(programmaticFocus)'], null, 2));
  console.log('\n=== FORCED-COLORS iconBtn (programmatic) ===');
  console.log(JSON.stringify(out.findings['sudoku:light:forcedColors:iconBtnFocus(programmatic)'], null, 2));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
