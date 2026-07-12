// T3-W13 GATE g1 — resident GPU delta of the P2/P3 pose stacks (<= 10 MB ceiling).
// memory-infra periodic dumps; arm A = page as-is, arm B = every pose-stack surface
// display:none (upper-bound delta: includes even the 1x base cost the old
// architecture paid). Usage: node g1-gpumem.mjs <arm> <url>
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
);
const { chromium } = require('playwright');

const arm = process.argv[2] ?? 'full';
const url = process.argv[3] ?? 'http://localhost:4517/';
const OUT =
  '/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tranche3/w13-impl/g1';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 806 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForSelector('svg.handwritten-logo', { timeout: 15000 });

if (arm === 'nostacks') {
  await page.addStyleTag({
    content: `
      .outline-svg, .boil-divider-wrap, .toggle-rest, svg.handwritten-logo {
        display: none !important;
      }`,
  });
}
await page.waitForTimeout(8000); // settle; stacks rastered

const tracePath = `${OUT}/gpumem-${arm}.trace.json`;
await browser.startTracing(page, {
  path: tracePath,
  categories: ['disabled-by-default-memory-infra'],
});
await page.waitForTimeout(6000);
await browser.stopTracing();
await browser.close();

const trace = JSON.parse(readFileSync(tracePath, 'utf8'));
const events = trace.traceEvents ?? trace;
const dumps = events.filter(
  (e) => e.name === 'periodic_interval' && e.args?.dumps?.allocators,
);
// last dump per pid
const lastByPid = {};
for (const e of dumps) lastByPid[e.pid] = e;
const pick = {};
for (const [pid, e] of Object.entries(lastByPid)) {
  const a = e.args.dumps.allocators;
  const grab = (prefix) => {
    let sum = 0;
    for (const [k, v] of Object.entries(a)) {
      if (k === prefix || k.startsWith(prefix + '/')) {
        // only count the top node to avoid double-count: exact match preferred
      }
    }
    const top = a[prefix];
    if (top?.attrs?.effective_size)
      sum = parseInt(top.attrs.effective_size.value, 16);
    else if (top?.attrs?.size) sum = parseInt(top.attrs.size.value, 16);
    return sum;
  };
  pick[pid] = {
    skiaGpuResources: grab('skia/gpu_resources'),
    cc: grab('cc'),
    gpu: grab('gpu'),
    malloc: grab('malloc'),
    keys: Object.keys(a).filter((k) => !k.includes('/')).sort(),
  };
}
console.log(JSON.stringify({ arm, url, dumpCount: dumps.length, pick }, null, 2));
