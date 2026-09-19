// C07b lab — which shape/timing of the bake's own `fetch` does an engine serve from CACHE?
// Monkeypatches window.fetch for the woff2 URL only, BEFORE any app code runs, so the product
// is untouched and every arm boots the same frozen dist. Reads transferSize off the page's own
// resource timing (the driver's stream cannot tell a cache hit from a 200).
// run: node fetch-shape-lab.mjs --port 4256 --engine webkit --variant v0 [--reps 3]
import { createRequire } from 'node:module'
const require_ = createRequire(
  '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json',
)
const pw = require_('playwright')
const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k)
  return i > 0 ? process.argv[i + 1] : d
}
const ENGINE = arg('engine', 'webkit')
const PORT = arg('port', '4256')
const VARIANT = arg('variant', 'v0')
const REPS = Number(arg('reps', '3'))

// Each variant returns the fetch OPTIONS, and optionally a gate awaited before the call.
const VARIANTS = {
  v0: { opts: `{credentials:'omit'}`, gate: 'null' }, // the product as built
  v1: { opts: `undefined`, gate: 'null' },
  v2: { opts: `{credentials:'omit',cache:'force-cache'}`, gate: 'null' },
  v3: { opts: `{cache:'force-cache'}`, gate: 'null' },
  v4: { opts: `{mode:'same-origin'}`, gate: 'null' },
  v5: { opts: `{credentials:'omit'}`, gate: 'document.fonts.ready' },
  v6: { opts: `{credentials:'omit',cache:'force-cache'}`, gate: 'document.fonts.ready' },
  v7: { opts: `{mode:'same-origin',cache:'force-cache'}`, gate: 'document.fonts.ready' },
  v8: { opts: `{mode:'same-origin'}`, gate: 'document.fonts.ready' },
}
const V = VARIANTS[VARIANT]
if (!V) throw new Error('unknown variant ' + VARIANT)

const INIT = `
(() => {
  const of = window.fetch.bind(window);
  window.fetch = function (u, o) {
    const s = typeof u === 'string' ? u : (u && u.url) || '';
    if (!s.includes('.woff2')) return of(u, o);
    const gate = ${V.gate};
    const call = () => of(s, ${V.opts});
    return gate ? Promise.resolve(gate).then(call) : call();
  };
})();
`

const b = await pw[ENGINE].launch()
const out = []
for (let i = 0; i < REPS; i++) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  await page.addInitScript(INIT)
  const driver = []
  page.on('request', (r) => {
    const u = r.url().split('/').pop()
    if (u.endsWith('.woff2')) driver.push(u.split('-')[0])
  })
  await page.goto(`http://127.0.0.1:${PORT}/?game=sudoku`, { waitUntil: 'load' })
  await page.waitForTimeout(3000)
  const rt = await page.evaluate(
    "performance.getEntriesByType('resource').filter(e=>e.name.endsWith('.woff2')).map(e=>({n:e.name.split('/').pop().split('-')[0],i:e.initiatorType,x:e.transferSize,s:Math.round(e.startTime)}))",
  )
  await ctx.close()
  const bake = rt.filter((r) => r.i === 'fetch')
  out.push({
    rep: i,
    driverCount: driver.length,
    bakeXfer: bake.map((r) => r.x),
    bakeStart: bake.map((r) => r.s),
    all: rt,
  })
}
await b.close()
console.log(
  JSON.stringify(
    { engine: ENGINE, port: PORT, variant: VARIANT, opts: V.opts, gate: V.gate, out },
    null,
    1,
  ),
)
