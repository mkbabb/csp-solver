import { chromium, type FullConfig } from '@playwright/test';

/**
 * Assert-the-SPA gate (R-11b/K46, G10 §0/§6).
 *
 * `:3000` is ambiguous by construction: it's both `server.port` (the app) AND
 * `hmr.port` (Vite's HMR websocket). If the app is moved (`vite --port <n>`) the
 * HMR socket stays on :3000 and answers a plain GET with `426 Upgrade Required`.
 * Playwright's `baseURL` + `reuseExistingServer` will then silently latch onto
 * that socket and every spec navigates into a 426 — the observed 0/33 sweep.
 *
 * This runs once before the suite: it navigates `baseURL` and requires the SPA
 * to actually load (title + `#app` mount). If it got the HMR socket (or any
 * non-app server) instead, it throws here with a pointed message — a fast, loud
 * failure rather than 33 opaque ones. baseURL must target the *app* port.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL =
    config.projects[0]?.use?.baseURL ??
    process.env.PLAYWRIGHT_BASE_URL ??
    'http://localhost:3000';

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    const res = await page.goto(String(baseURL), { waitUntil: 'domcontentloaded' });
    const status = res?.status();
    if (status === 426 || (status !== undefined && status >= 400)) {
      throw new Error(
        `[e2e assert-the-SPA] ${baseURL} answered ${status} — that's not the app.\n` +
          `A 426 means baseURL is pointed at Vite's HMR websocket (hmr.port:3000), not the SPA.\n` +
          `The app's server.port desyncs from a --port override by construction (K46): ` +
          `point PLAYWRIGHT_BASE_URL at the running app port (check \`lsof -i -P | grep LISTEN\`).`,
      );
    }
    // The SPA mounts into #app and titles itself; a bare socket/404 has neither.
    await page.waitForSelector('#app', { timeout: 10000 });
    const title = await page.title();
    if (!/sudoku/i.test(title)) {
      throw new Error(
        `[e2e assert-the-SPA] ${baseURL} loaded but its <title> ("${title}") isn't the app's — ` +
          `baseURL may be pointed at the wrong server.`,
      );
    }
  } finally {
    await browser.close();
  }
}
