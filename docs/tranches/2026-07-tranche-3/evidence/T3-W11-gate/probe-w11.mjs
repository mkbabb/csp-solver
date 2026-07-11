// T3-W11 GATE PROBE — re-runs the A23 §E reproductions against the hardened tree.
// Run from web/frontend (playwright resolves from its node_modules):
//   cd web/frontend && node ../../docs/tranches/2026-07-tranche-3/evidence/T3-W11-gate/probe-w11.mjs
// Target: the owner's dev server (:3001, working tree via HMR). Read-only contexts.
//
// Sections:
//   [FINE]   1440×900 no-touch — UI-4/5 hover grammar NOT regressed, UI-9 no collision,
//            UI-8 titles + one h1, UI-6 Tab walk (no focus into a closed card),
//            UI-11 futoshiki desktop voice, UI-13 hint-once + failed maroon beat,
//            digit pad ABSENT.
//   [COARSE] iPhone SE (isMobile+hasTouch → pointer:coarse) — UI-4 persistent washi +
//            measured ≥44px hold target, UI-5 sublabels, pad present + key boxes
//            measured, PRM digit-pad animation census.
import { createRequire } from 'node:module';
// Resolve playwright out of web/frontend regardless of where this file lives.
const require = createRequire(
  new URL('../../../../../web/frontend/package.json', import.meta.url),
);
const { chromium, devices } = require('@playwright/test');

const BASE = process.env.BASE || 'http://localhost:3001';
const OUT = new URL('.', import.meta.url).pathname;
const log = (k, v) => console.log(k.padEnd(34), '=', typeof v === 'string' ? v : JSON.stringify(v));

async function loadSudoku(page, q = '?size=3&difficulty=EASY') {
  await page.goto(BASE + '/' + q);
  await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
  await page.addStyleTag({ content: '.tuner-toggle { display: none !important; }' });
  await page.waitForFunction(
    () => document.querySelectorAll('.sudoku-cell .glyph-svg').length > 0,
    { timeout: 20000 },
  );
  await page.waitForTimeout(900);
}

const browser = await chromium.launch();

// ────────────────────────── [FINE] ──────────────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await loadSudoku(page);
  console.log('\n=== FINE 1440×900 (hover grammar + UI-6/8/11/13) ===');

  // UI-8: per-game title + exactly one h1
  log('title (sudoku URL load)', await page.title());
  log('h1 count / text', await page.evaluate(() => {
    const h = [...document.querySelectorAll('h1')];
    return { count: h.length, text: h.map((e) => e.textContent.trim().replace(/\s+/g, ' ')) };
  }));

  // UI-4 fine: washi hidden at rest, revealed on hover (the grammar W11 must NOT delete)
  const peek = page.locator('.peek-hold-surface:visible').first();
  const washi = peek.locator('.washi-label').first();
  const restOp = await washi.evaluate((el) => getComputedStyle(el).opacity);
  await peek.hover();
  await page.waitForTimeout(400);
  const hoverOp = await washi.evaluate((el) => getComputedStyle(el).opacity);
  log('peek washi opacity rest→hover', `${restOp} → ${hoverOp}`);

  // UI-9: hovered washi chip must not intersect the "Hard" option row
  const chipBox = await washi.boundingBox();
  const hardBox = await page
    .locator('button.ctrl-btn:visible')
    .filter({ hasText: /^Hard$/i })
    .first()
    .boundingBox()
    .catch(() => null);
  const intersects =
    chipBox && hardBox
      ? !(
          chipBox.x + chipBox.width < hardBox.x ||
          hardBox.x + hardBox.width < chipBox.x ||
          chipBox.y + chipBox.height < hardBox.y ||
          hardBox.y + hardBox.height < chipBox.y
        )
      : 'n/a';
  log('UI-9 washi∩Hard boxes', { chipBox, hardBox, intersects });
  await page.mouse.move(10, 10);

  // UI-5 fine: icon washi still hover-only; coarse sublabels absent
  log('icon washi opacities at rest', await page.evaluate(() =>
    ['Randomize board', 'Clear board', 'Solve puzzle']
      .map((l) => {
        const els = [...document.querySelectorAll(`[aria-label="${l}"] .washi-label`)];
        const vis = els.find((e) => e.closest('button')?.offsetParent !== null) ?? els[0];
        return vis ? `${l}: ${getComputedStyle(vis).opacity}` : `${l}: none`;
      }),
  ));
  log('.icon-sublabel visible count (fine)', await page.locator('.icon-sublabel:visible').count());

  // digit pad absent on fine pointers (v-if="padActive" — coarse && stacked)
  log('digit-pad DOM count (fine)', await page.locator('.digit-pad').count());

  // UI-6: Tab walk — no focus into a closed card; quote the card style chain
  await page.evaluate(() => document.body.focus());
  const walk = [];
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(120);
    walk.push(
      await page.evaluate(() => {
        const a = document.activeElement;
        const card = a?.closest('.hover-card');
        const anyCard = document.querySelector('.hover-card');
        const cs = anyCard ? getComputedStyle(anyCard) : null;
        return {
          el: `${a?.tagName}${a?.className ? '.' + String(a.className).split(' ')[0] : ''}${a?.textContent?.trim() ? ` "${a.textContent.trim().slice(0, 24)}"` : ''}`,
          inCard: !!card,
          cardStyle: cs ? `${cs.opacity}/${cs.visibility}` : 'none',
        };
      }),
    );
  }
  console.log('UI-6 Tab walk:');
  for (const [i, s] of walk.entries())
    console.log(`   ${i + 1}. ${s.el}  inCard=${s.inCard}  card(op/vis)=${s.cardStyle}`);
  const badStop = walk.find((s) => s.inCard && !s.cardStyle.endsWith('visible'));
  log('focus inside a CLOSED card?', badStop ?? 'none');

  // Closed-card resting chain (the old probe6 quoted 1,1,1,0 with visibility visible)
  log('closed card opacity/visibility', await page.evaluate(() => {
    document.activeElement?.blur();
    const c = document.querySelector('.hover-card');
    const cs = getComputedStyle(c);
    return { opacity: cs.opacity, visibility: cs.visibility, pointerEvents: cs.pointerEvents };
  }));

  // UI-13: hint fires ONCE on the first pre-Solve duplicate; grading stays post-Solve
  await loadSudoku(page); // fresh board re-arms
  await page.evaluate(() => {
    window.__hintCount = 0;
    const mo = new MutationObserver(() => {
      if (document.body.innerText.includes("mark it and I'll grade")) {
        if (!window.__hintVisible) { window.__hintCount++; window.__hintVisible = true; }
      } else window.__hintVisible = false;
    });
    mo.observe(document.body, { subtree: true, childList: true, characterData: true });
  });
  const setCell = (idx, val) =>
    page.evaluate(
      ([i, v]) => {
        const input = document.querySelectorAll('.sudoku-cell input')[i];
        const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
        set.call(input, v);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      },
      [idx, val],
    );
  // First row with ≥2 empties — row 0 alone isn't guaranteed to have two.
  const empties = await page.evaluate(() => {
    const inputs = document.querySelectorAll('.sudoku-cell input');
    for (let r = 0; r < 9; r++) {
      const out = [];
      for (let c = 0; c < 9; c++) if (inputs[r * 9 + c].value === '') out.push(r * 9 + c);
      if (out.length >= 2) return out.slice(0, 2);
    }
    return [];
  });
  log('same-row empty cell pair', empties);
  await setCell(empties[0], '1');
  await setCell(empties[1], '1'); // first duplicate → the hint
  await page.waitForTimeout(500);
  log('margin after 1st duplicate', await page.evaluate(() =>
    [...document.querySelectorAll('[aria-live]')].map((e) => e.textContent.trim()).filter(Boolean),
  ));
  log('aria-invalid count (pre-Solve)', await page.locator('[aria-invalid="true"]').count());
  log('hint fire count after dup #1', await page.evaluate(() => window.__hintCount));
  await setCell(empties[0], '');
  await setCell(empties[1], '');
  await page.waitForTimeout(300);
  await setCell(empties[0], '2');
  await setCell(empties[1], '2'); // second duplicate — must NOT re-fire
  await page.waitForTimeout(500);
  log('hint fire count after dup #2', await page.evaluate(() => window.__hintCount));

  // Drive the failed state (the protected maroon beat)
  await page.locator('button[aria-label="Solve puzzle"]:visible').first().click();
  await page.waitForFunction(
    () => document.querySelector('.board-wrapper')?.className.match(/solve-(failure|success)/),
    { timeout: 20000 },
  );
  log('board class after Solve', await page.evaluate(() =>
    document.querySelector('.board-wrapper').className,
  ));
  log('aria-invalid count (post-Solve)', await page.locator('[aria-invalid="true"]').count());
  log('margin after failed Solve', await page.evaluate(() =>
    [...document.querySelectorAll('[aria-live]')].map((e) => e.textContent.trim()).filter(Boolean),
  ));
  await page.screenshot({ path: OUT + 'gate-failed-maroon-beat.png' });

  // UI-8 in-app switch + UI-11 futoshiki desktop voice
  await page.goto(BASE + '/?game=futoshiki');
  await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
  await page.waitForFunction(
    () => document.querySelectorAll('.futoshiki-cell').length > 0,
    { timeout: 20000 },
  );
  await page.waitForTimeout(1200);
  log('title (futoshiki URL load)', await page.title());
  log('h1 count (futoshiki)', await page.locator('h1').count());
  log('UI-11 live region (desktop futo)', await page.evaluate(() =>
    [...document.querySelectorAll('[aria-live]')].map((e) => e.textContent.trim()).filter(Boolean),
  ));
  await page.screenshot({ path: OUT + 'gate-desk-futoshiki-voice.png' });

  // In-app switch back → title follows
  await page.locator('h1 button, .masthead button').first().click();
  await page.waitForTimeout(300);
  await page.getByRole('option', { name: /sudoku/i }).first().click()
    .catch(async () => { await page.keyboard.press('ArrowUp'); await page.keyboard.press('Enter'); });
  await page.waitForTimeout(800);
  log('title (in-app switch → sudoku)', await page.title());
  await ctx.close();
}

// ────────────────────────── [COARSE] ──────────────────────────
{
  const ctx = await browser.newContext({ ...devices['iPhone SE'] });
  const page = await ctx.newPage();
  await loadSudoku(page);
  console.log('\n=== COARSE iPhone SE 375 (UI-4/5 + digit pad + tap targets) ===');
  log('matchMedia(pointer: coarse)', await page.evaluate(() => matchMedia('(pointer: coarse)').matches));

  const panel = page.locator('.mobile-control-panel');
  const peek = panel.locator('.peek-hold-surface');
  const washi = peek.locator('.washi-label').first();
  log('peek washi visible at rest', await washi.isVisible());
  log('peek washi text', (await washi.textContent())?.trim());
  log('peek washi computed opacity', await washi.evaluate((el) => getComputedStyle(el).opacity));
  const peekBox = await peek.boundingBox();
  log('peek hold-surface box (≥44?)', peekBox);

  log('icon sublabels (coarse)', await page.evaluate(() =>
    [...document.querySelectorAll('.mobile-control-panel .icon-sublabel')]
      .map((e) => ({ t: e.textContent.trim(), vis: getComputedStyle(e).visibility, op: getComputedStyle(e).opacity })),
  ));

  // Digit pad present; every key box ≥44px both axes
  log('digit-pad present (coarse+stacked)', await page.locator('.digit-pad').count());
  const keyBoxes = await page.evaluate(() =>
    [...document.querySelectorAll('.pad-key')].map((k) => {
      const b = k.getBoundingClientRect();
      return [Math.round(b.width * 10) / 10, Math.round(b.height * 10) / 10];
    }),
  );
  const minW = Math.min(...keyBoxes.map((b) => b[0]));
  const minH = Math.min(...keyBoxes.map((b) => b[1]));
  log('pad key count / min w×h', { keys: keyBoxes.length, minW, minH, all: keyBoxes });

  // Action buttons (the sublabeled surfaces) still clear the floor
  log('action button boxes (coarse)', await page.evaluate(() =>
    [...document.querySelectorAll('.mobile-control-panel button')]
      .filter((b) => /randomize|clear|solve|share/i.test(b.getAttribute('aria-label') || ''))
      .map((b) => {
        const r = b.getBoundingClientRect();
        return { label: b.getAttribute('aria-label'), w: Math.round(r.width), h: Math.round(r.height) };
      }),
  ));
  await ctx.close();
}

// ────────────────────────── [PRM, coarse] ──────────────────────────
{
  const ctx = await browser.newContext({ ...devices['iPhone SE'], reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await loadSudoku(page);
  console.log('\n=== PRM (reduce) — digit pad animation census ===');
  log('animations inside .digit-pad', await page.evaluate(() => {
    const pad = document.querySelector('.digit-pad');
    if (!pad) return 'NO PAD';
    return document
      .getAnimations()
      .filter((a) => {
        const t = a.effect?.target;
        return t && pad.contains(t);
      })
      .map((a) => ({ dur: a.effect?.getTiming().duration, iter: a.effect?.getTiming().iterations }));
  }));
  // The global RM kill: sample any running animation durations page-wide
  log('page-wide animation durations (RM)', await page.evaluate(() =>
    [...new Set(document.getAnimations().map((a) => a.effect?.getTiming().duration))].slice(0, 5),
  ));
  await ctx.close();
}

await browser.close();
console.log('\nprobe-w11 complete.');
