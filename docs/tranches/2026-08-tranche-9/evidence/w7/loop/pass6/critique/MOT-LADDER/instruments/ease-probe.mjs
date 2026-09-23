import { chromium, webkit } from '@playwright/test';
for (const [name, eng] of [['chromium', chromium], ['webkit', webkit]]) {
  const b = await eng.launch();
  const p = await b.newPage();
  await p.setContent(`<style>
    :root { --e-a: EASE-IN; --e-b: linear(0, 1); --e-c: var(--e-nope, ease-in); --e-d: CUBIC-BEZIER(0.42, 0, 1, 1); }
    .a { transition: opacity 1s var(--e-a); } .b { transition: opacity 1s var(--e-b); }
    .c { transition: opacity 1s var(--e-c); } .d { transition: opacity 1s var(--e-d); }
    .e { transition: opacity 1s cubic-bezier(0.4,0,0.2,1); transition-timing-function: ease-in; }
  </style><div class=a></div><div class=b></div><div class=c></div><div class=d></div><div class=e></div>`);
  const r = await p.evaluate(() => ['a','b','c','d','e'].map(c => c + '=' + getComputedStyle(document.querySelector('.'+c)).transitionTimingFunction));
  console.log(name, r.join(' | '));
  await b.close();
}
