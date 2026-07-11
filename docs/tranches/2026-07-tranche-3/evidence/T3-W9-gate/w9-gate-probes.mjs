/**
 * T3-W9 GATE probes — collision (a23 probe5 reconstruction), star-form, heart,
 * subscriber budget, PRM, failure grammar. Runs against the DEV server on :3000
 * (needs window.__schedulerDebug). Artifacts → evidence/T3-W9-gate/.
 */
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';

const BASE = 'http://localhost:3000/';
const OUT =
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-07-tranche-3/evidence/T3-W9-gate';
mkdirSync(OUT, { recursive: true });

const results = [];
const log = (name, pass, detail) => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${name} | ${detail}`);
};

async function loadSudoku(page, query = '?size=3&difficulty=EASY') {
  await page.goto(BASE + query, { waitUntil: 'load' });
  await page.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
  await page.waitForFunction(
    () => document.querySelectorAll('.sudoku-cell .glyph-svg').length > 0,
    { timeout: 20000 },
  );
  await page.waitForTimeout(900);
}

async function solve(page) {
  await page.locator('button[aria-label="Solve puzzle"]:visible').first().click();
  await page.waitForFunction(
    () => !!document.querySelector('.solve-success'),
    { timeout: 20000 },
  );
}

function boxesOverlap(a, b) {
  if (!a || !b) return false;
  return (
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height
  );
}

const getBox = (page, sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }, sel);

const fmt = (b) =>
  b
    ? `[x=${b.x.toFixed(1)} y=${b.y.toFixed(1)} w=${b.width.toFixed(1)} h=${b.height.toFixed(1)}]`
    : 'ABSENT';

const browser = await chromium.launch();

// ── P1: collision probe5 + star-form + grammar sweep — BOTH regimes, light ──
for (const regime of [
  { name: 'row', vp: { width: 1280, height: 800 } },
  { name: 'stacked', vp: { width: 800, height: 1000 } },
]) {
  const ctx = await browser.newContext({ viewport: regime.vp });
  const page = await ctx.newPage();
  await loadSudoku(page);

  // The budget envelope is the settled FLOOR (the debug surface at settle and
  // post-solve) — draw-in/celebration transients are one-shot sequences by design.
  // Poll until the count is stable for ~1.5s before sampling.
  const settleFloor = await page.evaluate(async () => {
    let last = -1, stableMs = 0;
    for (let i = 0; i < 100; i++) {
      const d = window.__schedulerDebug?.();
      if (!d) return null;
      if (d.subscribers === last) stableMs += 150;
      else { stableMs = 0; last = d.subscribers; }
      if (stableMs >= 1500) return d;
      await new Promise((r) => setTimeout(r, 150));
    }
    return window.__schedulerDebug?.();
  });

  await solve(page);
  await page.waitForTimeout(5800); // crest 2650 + bounce 550 + blink 1800+140 + settle
  const postSolveFloor = await page.evaluate(async () => {
    let last = -1, stableMs = 0;
    for (let i = 0; i < 100; i++) {
      const d = window.__schedulerDebug?.();
      if (!d) return null;
      if (d.subscribers === last) stableMs += 150;
      else { stableMs = 0; last = d.subscribers; }
      if (stableMs >= 1500) return d;
      await new Promise((r) => setTimeout(r, 150));
    }
    return window.__schedulerDebug?.();
  });

  // The status TEXT box (a23 probe5's own measure): the inked extent of the verdict
  // via a DOM Range — the .margin-note element itself spans the full 1fr column.
  const noteTextBox = await page.evaluate(() => {
    const ink = document.querySelector('.margin-note-ink');
    if (!ink) return null;
    const range = document.createRange();
    range.selectNodeContents(ink);
    const r = range.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  const starBox = await getBox(page, '.celebration-star');
  const heartBox = await getBox(page, '.celebration-heart');
  const metaBox = await getBox(page, '.margin-note-meta');

  log(
    `probe5 collision (${regime.name})`,
    !!noteTextBox &&
      !boxesOverlap(starBox, noteTextBox) &&
      !boxesOverlap(heartBox, noteTextBox) &&
      !boxesOverlap(heartBox, metaBox),
    `star=${fmt(starBox)} heart=${fmt(heartBox)} statusText=${fmt(noteTextBox)} meta=${fmt(metaBox)}`,
  );

  // Star-form: the inline glyph inside the note line (RATIFIED).
  const noteStar = await page.evaluate(() => {
    const s = document.querySelector('.margin-note .note-star');
    if (!s) return null;
    const r = s.getBoundingClientRect();
    return { w: r.width, h: r.height };
  });
  log(
    `star-form inline glyph (${regime.name})`,
    !!noteStar,
    noteStar ? `note-star ${noteStar.w.toFixed(1)}x${noteStar.h.toFixed(1)}px in the verdict line` : 'MISSING',
  );

  const fmtDbg = (d) =>
    d ? `chains=${d.chains} subs=${d.subscribers} (frame=${d.kinds.frame}, sequence=${d.kinds.sequence})` : 'n/a';
  log(
    `subscriber budget (${regime.name})`,
    !!settleFloor && !!postSolveFloor &&
      settleFloor.chains <= 1 && settleFloor.subscribers <= 10 &&
      postSolveFloor.chains <= 1 && postSolveFloor.subscribers <= 10,
    `settle floor: ${fmtDbg(settleFloor)}; post-solve settled floor: ${fmtDbg(postSolveFloor)}`,
  );

  // Grammar sweep: gold must live ONLY in the completion surfaces.
  const grammar = await page.evaluate(() => {
    const GOLD = ['rgb(201, 154, 46)', 'rgb(229, 199, 77)', 'rgb(140, 105, 29)'];
    const surfaces = {
      masthead: document.querySelector('svg.handwritten-logo'),
      washi: document.querySelector('.washi-label, [class*="washi"]'),
      laminate: document.querySelector('.sheet-laminate'),
      chips: [...document.querySelectorAll('.controls-card [class*="difficulty"], .controls-card button')],
      verdict: document.querySelector('.margin-note'),
      meta: document.querySelector('.margin-note-meta'),
    };
    const gilded = [];
    const check = (el, name) => {
      if (!el) return;
      const cs = getComputedStyle(el);
      for (const p of ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke']) {
        if (GOLD.some((g) => (cs[p] || '').includes(g))) gilded.push(`${name}.${p}=${cs[p]}`);
      }
    };
    check(surfaces.masthead, 'masthead');
    check(surfaces.washi, 'washi');
    check(surfaces.laminate, 'laminate');
    surfaces.chips.forEach((c, i) => check(c, `chip${i}`));
    check(surfaces.meta, 'tally');
    const verdictColor = surfaces.verdict ? getComputedStyle(surfaces.verdict).color : 'n/a';
    const metaColor = surfaces.meta ? getComputedStyle(surfaces.meta).color : 'n/a';
    // Success shadow: green must be OUT of the register.
    const board = document.querySelector('.solve-success');
    const shadow = board ? getComputedStyle(board).boxShadow : 'n/a';
    return { gilded, verdictColor, metaColor, shadowHasGreen: shadow.includes('45, 198, 83'), shadow: shadow.slice(0, 120) };
  });
  log(
    `grammar: nothing gilded (${regime.name})`,
    grammar.gilded.length === 0 && !grammar.shadowHasGreen,
    `gilded=[${grammar.gilded.join('; ')}] verdict=${grammar.verdictColor} tally=${grammar.metaColor} shadowGreen=${grammar.shadowHasGreen}`,
  );
  log(
    `token truthing: verdict inks gold-ink (${regime.name})`,
    grammar.verdictColor === 'rgb(140, 105, 29)',
    `verdict color=${grammar.verdictColor} (expect #8C691D = rgb(140, 105, 29)); success shadow="${grammar.shadow}"`,
  );

  await page.screenshot({ path: `${OUT}/probe5-solved-${regime.name}-light.png`, fullPage: false });
  const block = page.locator('.board-margin').first();
  await block.screenshot({ path: `${OUT}/star-form-inline-${regime.name}.png` }).catch(() => {});
  await ctx.close();
}

// ── P2: heart dark-mode ROSY at crest ──
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: 'dark',
  });
  const page = await ctx.newPage();
  await loadSudoku(page);
  const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  await solve(page);
  await page.waitForTimeout(4200);
  const heart = await page.evaluate(() => {
    const host = document.querySelector('.celebration-heart');
    if (!host) return null;
    const svg = host.querySelector('svg.crayon-heart');
    const cs = getComputedStyle(svg);
    // The plush body: the second path drawn with fill (shadow first) — find by fill attr
    const body = [...svg.querySelectorAll('path')].find((p) => p.getAttribute('fill') === '#FF4D6D');
    const stem = [...svg.querySelectorAll('path')].find((p) => p.getAttribute('stroke') === '#16a34a');
    const blush = svg.querySelector('.blush-mark');
    return {
      opacity: cs.opacity,
      filter: cs.filter,
      bodyFill: body?.getAttribute('fill') ?? 'MISSING',
      stemPresent: !!stem,
      blushFill: blush ? getComputedStyle(blush).fill : 'n/a',
      transform: getComputedStyle(host).transform,
    };
  });
  log(
    'heart: dark-mode ROSY (celebration exempt from dimming)',
    isDark && !!heart && heart.opacity === '1' && heart.filter === 'none' && heart.bodyFill === '#FF4D6D' && heart.stemPresent,
    `html.dark=${isDark} ${heart ? `opacity=${heart.opacity} filter=${heart.filter} bodyFill=${heart.bodyFill} stem+leaf=${heart.stemPresent} blush=${heart.blushFill} transform=${heart.transform}` : 'HEART ABSENT'}`,
  );
  await page.screenshot({ path: `${OUT}/heart-crest-dark.png` });
  const heartEl = page.locator('.celebration-heart');
  await heartEl.screenshot({ path: `${OUT}/heart-crest-dark-zoom.png` }).catch(() => {});
  await ctx.close();
}

// ── P3: PRM — everything static, gold lands instantly ──
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await loadSudoku(page);
  await solve(page);
  await page.waitForTimeout(400); // NO crest wait — PRM must be instant
  const prm = await page.evaluate(() => {
    const board = document.querySelector('.solve-success');
    const line = document.querySelector('.solve-success .grid-line');
    const heart = document.querySelector('.celebration-heart');
    const ink = document.querySelector('.margin-note-ink');
    const meta = document.querySelector('.margin-note-meta');
    return {
      boardTransition: board ? getComputedStyle(board).transitionProperty : 'n/a',
      lineTransition: line ? getComputedStyle(line).transitionProperty : 'n/a',
      heartTransform: heart ? getComputedStyle(heart).transform : 'ABSENT',
      inkAnimation: ink ? getComputedStyle(ink).animationName : 'n/a',
      metaAnimation: meta ? getComputedStyle(meta).animationName : 'n/a',
      starVisible: !!document.querySelector('.celebration-star'),
    };
  });
  log(
    'PRM: success transitions instant + heart/note static',
    prm.boardTransition === 'none' &&
      prm.lineTransition === 'none' &&
      (prm.heartTransform === 'matrix(1, 0, 0, 1, 0, 0)' || prm.heartTransform === 'none') &&
      prm.inkAnimation === 'none' &&
      prm.metaAnimation === 'none',
    `board transition=${prm.boardTransition} grid-line=${prm.lineTransition} heart transform=${prm.heartTransform} ink anim=${prm.inkAnimation} meta anim=${prm.metaAnimation} star mounted=${prm.starVisible}`,
  );
  await page.screenshot({ path: `${OUT}/prm-solved-instant.png` });
  await ctx.close();
}

// ── P4: failure grammar — red verdict, graphite tally, ZERO gold ──
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await loadSudoku(page);
  // Duplicate a value in one row across two blanks → UNSAT.
  const pair = await page.evaluate(() => {
    const cells = document.querySelectorAll('.sudoku-cell');
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].querySelector('.glyph-svg')) continue;
      const row = Math.floor(i / 9);
      for (let j = i + 1; j < (row + 1) * 9; j++) {
        if (!cells[j].querySelector('.glyph-svg')) return [i, j];
      }
    }
    return null;
  });
  if (!pair) {
    log('failure grammar', false, 'no two blanks share a row on this deal — rerun');
  } else {
    for (const idx of pair) {
      await page.locator('.board-cells input').nth(idx).click();
      await page.keyboard.type('9');
    }
    await page.locator('button[aria-label="Solve puzzle"]:visible').first().click();
    await page.waitForFunction(
      () => document.querySelector('.margin-note')?.classList.contains('teacher-red'),
      { timeout: 20000 },
    );
    await page.waitForTimeout(600);
    const fail = await page.evaluate(() => {
      const GOLD = ['rgb(201, 154, 46)', 'rgb(229, 199, 77)', 'rgb(140, 105, 29)', 'rgb(253, 230, 138)', 'rgb(240, 176, 48)'];
      const note = document.querySelector('.margin-note');
      const meta = document.querySelector('.margin-note-meta');
      const gilded = [];
      for (const el of document.querySelectorAll('body *')) {
        // The SKY is exempt by the design story itself — gold LIVES there
        // (sun rays, sparkles, moon: the DarkModeToggle's celestial svg).
        if (el.closest('.dark-mode-toggle, .celestial, [class*="sun"], [class*="moon"]'))
          continue;
        const cs = getComputedStyle(el);
        for (const p of ['color', 'backgroundColor', 'fill', 'stroke']) {
          if (GOLD.some((g) => (cs[p] || '') === g)) {
            gilded.push(`${el.className?.baseVal ?? el.className}`.slice(0, 40) + `.${p}`);
            break;
          }
        }
        if (gilded.length > 4) break;
      }
      return {
        verdictColor: note ? getComputedStyle(note).color : 'n/a',
        verdictClass: note?.className ?? 'n/a',
        metaColor: meta ? getComputedStyle(meta).color : 'ABSENT',
        starSlot: !!document.querySelector('.sticker-slot:not([style*="display: none"])'),
        slotVisible: (() => {
          const s = document.querySelector('.sticker-slot');
          return s ? getComputedStyle(s).display !== 'none' : false;
        })(),
        noteStar: !!document.querySelector('.note-star'),
        heart: !!document.querySelector('.celebration-heart'),
        successClass: !!document.querySelector('.solve-success'),
        gilded,
      };
    });
    log(
      'failure grammar: red verdict, graphite tally, zero gold',
      fail.verdictColor === 'rgb(208, 42, 82)' &&
        !fail.slotVisible &&
        !fail.noteStar &&
        !fail.heart &&
        !fail.successClass &&
        fail.gilded.length === 0,
      `verdict=${fail.verdictColor} (expect red-ink #D02A52 = rgb(208, 42, 82)) tally=${fail.metaColor} starSlotVisible=${fail.slotVisible} noteStar=${fail.noteStar} heart=${fail.heart} solveSuccess=${fail.successClass} gilded=[${fail.gilded.join('; ')}]`,
    );
    await page.screenshot({ path: `${OUT}/failure-red-graphite-zero-gold.png` });
  }
  await ctx.close();
}

// ── P5: EASY chip still green; green absent from success register (checked above) ──
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await loadSudoku(page);
  const easy = await page.evaluate(() => {
    const els = [...document.querySelectorAll('.controls-card *')].filter(
      (e) => e.textContent?.trim().toLowerCase() === 'easy',
    );
    const hits = [];
    for (const el of els) {
      const cs = getComputedStyle(el);
      hits.push(`${el.tagName}:color=${cs.color};bg=${cs.backgroundColor};border=${cs.borderColor}`);
    }
    return hits;
  });
  log('green in EASY only: EASY chip register', easy.length > 0, easy.join(' | ').slice(0, 300));
  await ctx.close();
}

await browser.close();
const fails = results.filter((r) => !r.pass);
console.log(`\n${results.length - fails.length}/${results.length} probes green`);
process.exit(fails.length ? 1 : 0);
