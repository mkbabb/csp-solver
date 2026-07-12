// T3-W13 GATE g1 — resident GPU delta via CDP Tracing + memory-infra periodic
// detailed dumps. Arms: full | nostacks. Usage: node g1-gpumem2.mjs <arm> <url>
import { createRequire } from 'node:module';
const require = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
);
const { chromium } = require('playwright');

const arm = process.argv[2] ?? 'full';
const url = process.argv[3] ?? 'http://localhost:4517/';

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
    content: `.outline-svg, .boil-divider-wrap, .toggle-rest, svg.handwritten-logo { display: none !important; }`,
  });
}
if (arm === 'onepose') {
  // keep exactly one pose resident per W13 stack — the delta vs 'full' is the
  // added residency of the inactive poses (the P2/P3 memory price). Grid untouched.
  await page.addStyleTag({
    content: `
      .outline-svg .boil-pose:not(.is-active),
      svg.handwritten-logo .logo-pose:not(.is-active),
      .toggle-rest .rest-pose:not(.is-pose-active),
      .boil-divider-wrap .boil-frame-layer:not(.is-active) { display: none !important; }`,
  });
}
await page.waitForTimeout(8000);

const cdp = await ctx.newCDPSession(page);
const events = [];
cdp.on('Tracing.dataCollected', (d) => events.push(...(d.value ?? [])));
const done = new Promise((res) => cdp.on('Tracing.tracingComplete', res));
await cdp.send('Tracing.start', {
  transferMode: 'ReportEvents',
  traceConfig: {
    includedCategories: ['disabled-by-default-memory-infra'],
    memoryDumpConfig: {
      triggers: [{ mode: 'detailed', periodic_interval_ms: 1500 }],
    },
  },
});
await page.waitForTimeout(6500);
await cdp.send('Tracing.end');
await done;
await browser.close();

const dumps = events.filter((e) => e.args?.dumps?.allocators);
const lastByPid = {};
for (const e of dumps) lastByPid[e.pid] = e;
const asMB = (hex) => (hex ? parseInt(hex, 16) / 1048576 : 0);
const report = {};
let totals = { skiaGpu: 0, cc: 0, gpuMappedMem: 0 };
for (const [pid, e] of Object.entries(lastByPid)) {
  const a = e.args.dumps.allocators;
  const top = (k) =>
    asMB(a[k]?.attrs?.effective_size?.value ?? a[k]?.attrs?.size?.value);
  const r = {
    'skia/gpu_resources': top('skia/gpu_resources'),
    cc: top('cc'),
    gpu: top('gpu'),
    malloc: top('malloc'),
  };
  report[pid] = Object.fromEntries(
    Object.entries(r).map(([k, v]) => [k, +v.toFixed(2)]),
  );
  totals.skiaGpu += r['skia/gpu_resources'];
  totals.cc += r.cc;
  totals.gpuMappedMem += r.gpu;
}
console.log(
  JSON.stringify(
    {
      arm,
      url,
      dumpCount: dumps.length,
      pids: Object.keys(lastByPid).length,
      perPid: report,
      totalsMB: Object.fromEntries(
        Object.entries(totals).map(([k, v]) => [k, +v.toFixed(2)]),
      ),
    },
    null,
    2,
  ),
);
