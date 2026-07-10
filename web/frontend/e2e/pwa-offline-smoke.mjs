// T2-W6 PWA-minimal — Offline gate (Q4's SW strategy, verified end-to-end).
//
// NOT a Playwright `*.spec.ts`: the default `npm run test:e2e` webServer runs
// `npm run dev`, where `vite-plugin-pwa` is disabled (no SW in dev). This gate
// needs the PRODUCTION build served by `vite preview`, so it is a standalone
// node script that owns its own preview server. Run it via `npm run test:pwa`
// (which builds first). ESLint ignores `e2e/**`; Playwright's testMatch skips a
// non-`.spec`/`.test` filename — so this file is invisible to both default lanes.
//
// Proves the wave's Offline gate: load once online → block the network entirely
// (genuine offline, stricter than page-level route-abort — it also kills the
// SW's own fetches) → reload → the shell, all three self-hosted woff2 faces, AND
// the hashed wasm are every one served from Cache Storage, zero network.

import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { chromium } from '@playwright/test'

const PORT = 4183
const BASE = `http://localhost:${PORT}/`
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

let failed = 0
const assert = (c, m) => {
  console.log(`${c ? 'PASS' : 'FAIL'}: ${m}`)
  if (!c) failed++
}

async function waitForServer(url, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url)
      if (r.ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 200))
  }
  throw new Error(`preview server never came up at ${url}`)
}

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: ROOT,
  stdio: 'ignore',
})

let browser
try {
  await waitForServer(BASE)

  browser = await chromium.launch()
  const context = await browser.newContext({ serviceWorkers: 'allow' })
  const page = await context.newPage()

  // 1) Online load — register SW, populate precache.
  await page.goto(BASE, { waitUntil: 'load' })
  await page.evaluate(() => navigator.serviceWorker.ready)

  // Poll Cache Storage until precache install has landed wasm + 3 woff2 + shell.
  const cacheState = await page.waitForFunction(
    async () => {
      const urls = []
      for (const k of await caches.keys()) {
        const c = await caches.open(k)
        for (const req of await c.keys()) urls.push(new URL(req.url).pathname)
      }
      const has = (re) => urls.some((u) => re.test(u))
      const done =
        has(/\.wasm$/) &&
        urls.filter((u) => /\.woff2$/.test(u)).length >= 3 &&
        has(/favicon\.svg$/) &&
        has(/index\.html$|\/$/)
      return done ? urls : false
    },
    { timeout: 15000, polling: 300 }
  )
  const cachedUrls = await cacheState.jsonValue()
  const woff2 = cachedUrls.filter((u) => /\.woff2$/.test(u))
  const wasm = cachedUrls.filter((u) => /\.wasm$/.test(u))
  console.log('\n--- Cache Storage (online, post-install) ---')
  console.log(`  unique entries: ${cachedUrls.length}`)
  console.log(`  wasm:  ${wasm.join(', ')}`)
  console.log(`  woff2: ${woff2.join(', ')}\n`)

  assert(wasm.length >= 1, `wasm present in Cache Storage`)
  assert(woff2.length >= 3, `all three woff2 faces present in Cache Storage (${woff2.length})`)
  assert(
    cachedUrls.some((u) => /favicon\.svg$/.test(u)),
    'favicon.svg present in Cache Storage'
  )

  // 2) Go genuinely offline — kills network for page AND SW fetches.
  await context.setOffline(true)
  await page.route('**/*', (route) => route.abort())

  // 3) Reload offline.
  const resp = await page.reload({ waitUntil: 'load' })
  assert(resp !== null && resp.ok(), `offline reload served a 2xx document (status ${resp?.status()})`)
  assert(
    await page.evaluate(() => !!navigator.serviceWorker.controller),
    'reloaded page is SW-controlled'
  )

  // 4) Shell rendered offline.
  await page.waitForSelector('#app *', { timeout: 10000 })
  const gridVisible = await page
    .waitForSelector('[role="grid"]', { timeout: 10000, state: 'attached' })
    .then(() => true)
    .catch(() => false)
  assert(gridVisible, 'board grid rendered offline (shell served from cache)')

  // 5) wasm + fonts retrievable from Cache Storage while offline.
  const m = await page.evaluate(async () => {
    const grab = async (re) => {
      for (const k of await caches.keys()) {
        const c = await caches.open(k)
        for (const req of await c.keys()) {
          if (re.test(new URL(req.url).pathname)) {
            const r = await c.match(req)
            return { url: new URL(req.url).pathname, ok: !!r, type: r?.headers.get('content-type') }
          }
        }
      }
      return null
    }
    return {
      wasm: await grab(/\.wasm$/),
      firacode: await grab(/firacode.*\.woff2$/),
      patrickhand: await grab(/patrickhand.*\.woff2$/),
      fraunces: await grab(/fraunces.*\.woff2$/),
    }
  })
  console.log('\n--- Offline Cache Storage matches ---')
  console.log(JSON.stringify(m, null, 2))
  assert(m.wasm?.ok && m.wasm.type === 'application/wasm', `wasm served offline as application/wasm`)
  assert(m.firacode?.ok, 'firacode woff2 served from Cache Storage offline')
  assert(m.patrickhand?.ok, 'patrickhand woff2 served from Cache Storage offline')
  assert(m.fraunces?.ok, 'fraunces woff2 served from Cache Storage offline')
} finally {
  if (browser) await browser.close()
  preview.kill('SIGTERM')
}

console.log(`\n${failed === 0 ? 'ALL PASS' : failed + ' FAILURE(S)'}`)
process.exit(failed === 0 ? 0 : 1)
