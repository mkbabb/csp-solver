#!/usr/bin/env node
// T9-W8 C10 — the interleaved driver over `boot-freight.mjs` (this dir's byte-identical copy of
// attribution/A2/boot-freight.mjs, md5 d1317cafe9a6d22c52081fbafa005b25). It ADDS NOTHING to the
// instrument: it invokes it alternately against the two ports, b,c,b,c,…, one window per
// invocation so host drift falls between arms rather than inside one, and derives per window
// the two marks C10 owes — encoded BYTES before board-ready and REQUESTS before board-ready —
// from the same `resources` array the lane banked.
//
// run: node freight-run.mjs --base 4256 --cured 4257 --engine chromium --cpu 4 --net fast3g
//      --cache cold --vp desk --windows 5 --out readings.jsonl
import { execFileSync } from 'node:child_process'
import { appendFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const arg = (k, d) => {
  const i = process.argv.indexOf('--' + k)
  return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d
}
const BASE = arg('base', '4256')
const CURED = arg('cured', '4257')
const ENGINE = arg('engine', 'chromium')
const CPU = arg('cpu', '4')
const NET = arg('net', 'none')
const CACHE = arg('cache', 'cold')
const VP = arg('vp', 'desk')
const N = Number(arg('windows', '5'))
const OUT = arg('out', join(HERE, 'freight-readings.jsonl'))

const one = (port) => {
  const out = execFileSync(
    process.execPath,
    [join(HERE, 'boot-freight.mjs'), '--port', port, '--engine', ENGINE, '--cpu', CPU,
      '--net', NET, '--cache', CACHE, '--vp', VP, '--windows', '1'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 },
  )
  return JSON.parse(out.trim().split('\n').filter(Boolean).pop())
}

const derive = (r) => {
  const before = (r.resources || []).filter((x) => x.start <= r.ready)
  return {
    ready: r.ready,
    tainted: r.tainted,
    fcp: (r.paints || []).find((p) => p.n === 'first-contentful-paint')?.t ?? null,
    tbt: (r.longtasks || []).filter((t) => t.s <= r.ready).reduce((a, t) => a + Math.max(0, t.d - 50), 0),
    reqBefore: before.length,
    encBefore: before.reduce((a, x) => a + (x.enc || 0), 0),
    names: before.map((x) => x.name),
  }
}

writeFileSync(OUT, '')
const rows = []
for (let i = 0; i < N; i++) {
  for (const [arm, port] of [['base', BASE], ['cured', CURED]]) {
    const raw = one(port)
    const d = { arm, window: i, regime: { engine: ENGINE, cpu: Number(CPU), net: NET, cache: CACHE, vp: VP }, ...derive(raw) }
    rows.push(d)
    appendFileSync(OUT, JSON.stringify(d) + '\n')
    process.stderr.write(`${arm} w${i}: ready ${d.ready} enc ${d.encBefore} req ${d.reqBefore}\n`)
  }
}
const med = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2
}
for (const arm of ['base', 'cured']) {
  const a = rows.filter((r) => r.arm === arm && !r.tainted)
  console.log(JSON.stringify({
    arm, n: a.length,
    readyMed: med(a.map((r) => r.ready)),
    readyMin: Math.min(...a.map((r) => r.ready)), readyMax: Math.max(...a.map((r) => r.ready)),
    fcpMed: med(a.map((r) => r.fcp ?? 0)),
    tbtMed: med(a.map((r) => r.tbt)),
    encBeforeMed: med(a.map((r) => r.encBefore)),
    reqBeforeMed: med(a.map((r) => r.reqBefore)),
    regime: a[0]?.regime,
  }))
}
