import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@playwright/test/index.mjs';

const URL = 'http://localhost:4241/?view=gallery&game=sudoku&size=3&difficulty=EASY';

async function measure(browserType, name) {
  const browser = await browserType.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(URL);
  await page.waitForSelector('.game-gallery', { timeout: 20000 });
  await page.waitForTimeout(900);

  const dom = await page.evaluate(() =>
    [...document.querySelectorAll('[role="option"]')].map((el) => ({
      id: el.id,
      label: el.getAttribute('aria-label'),
      selected: el.getAttribute('aria-selected'),
      rootInert: el.hasAttribute('inert') ? el.getAttribute('inert') : null,
      dealInert: (() => {
        const d = el.querySelector('.game-card-deal');
        return d ? (d.hasAttribute('inert') ? d.getAttribute('inert') : null) : 'NO .game-card-deal';
      })(),
      // focusable tab stops that a flank must never contribute
      tabbables: [...el.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')].filter(
        (n) => !n.closest('[inert]'),
      ).length,
      strippedBy: (() => {
        for (let n = el; n; n = n.parentElement) {
          if (n.hasAttribute('inert')) return 'inert';
          if (n.getAttribute('aria-hidden') === 'true') return 'aria-hidden';
          const cs = getComputedStyle(n);
          if (cs.display === 'none') return 'display:none';
          if (cs.visibility === 'hidden' || cs.visibility === 'collapse') return 'visibility';
        }
        return null;
      })(),
    })),
  );

  let ax = null;
  if (name === 'chromium') {
    const client = await page.context().newCDPSession(page);
    await client.send('Accessibility.enable');
    const { nodes } = await client.send('Accessibility.getFullAXTree');
    ax = {
      listboxes: nodes.filter((n) => !n.ignored && n.role?.value === 'listbox').length,
      options: nodes
        .filter((n) => !n.ignored && n.role?.value === 'option')
        .map((n) => n.name?.value ?? ''),
    };
    await client.detach();
  }

  const snapshot = await page.locator('.gallery-viewport').ariaSnapshot();
  await browser.close();
  return { engine: name, dom, ax, snapshot };
}

const out = [];
out.push(await measure(chromium, 'chromium'));
out.push(await measure(webkit, 'webkit'));
console.log(JSON.stringify(out, null, 1));
