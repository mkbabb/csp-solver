// THE §2.6 SETTLE'S NEGATIVE CONTROLS (the chair's instruments lane, pass 6). Each plant spec is the
// settled viewport-law.spec.ts with ONE block inserted in `boot()` right after
// `await page.addInitScript(installVisFrac);`. All three RED under the settle, both engines, both
// cells (README §6): nosticky and pub300 on the tag's visibility, pub30 on the lag ceiling alone.

// ── PLANT nosticky ──
  // PLANT nosticky (the settle's negative control): the sticky pose deleted — every tag back to absolute.
  await page.addInitScript(() => {
    const put = () => { const st = document.createElement('style'); st.textContent = '.washi-tag { position: absolute !important; }'; document.head.appendChild(st); };
    if (document.head) put(); else document.addEventListener('DOMContentLoaded', put, { once: true });
  });

// ── PLANT pub300 ──
  // PLANT pub300 (the settle's negative control): the release pose published 300 ms late. The
  // publisher is a `scroll` listener that re-reads the wells in a rAF (GameControlPanel publishFold);
  // every `scroll` listener is delivered after a 300 ms timer here, as a slow publisher would be.
  await page.addInitScript(() => {
    const add = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type: string, fn: any, opts?: any) {
      if (type !== 'scroll' || typeof fn !== 'function') return add.call(this, type, fn, opts);
      return add.call(this, type, function (this: unknown, ev: Event) { setTimeout(() => fn.call(this, ev), 300); }, opts);
    } as typeof EventTarget.prototype.addEventListener;
  });

// ── PLANT pub30 ──
  // PLANT pub30 (the settle's negative control): the release pose published 30 ms late. The
  // publisher is a `scroll` listener that re-reads the wells in a rAF (GameControlPanel publishFold);
  // every `scroll` listener is delivered after a 30 ms timer here, as a slow publisher would be.
  await page.addInitScript(() => {
    const add = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type: string, fn: any, opts?: any) {
      if (type !== 'scroll' || typeof fn !== 'function') return add.call(this, type, fn, opts);
      return add.call(this, type, function (this: unknown, ev: Event) { setTimeout(() => fn.call(this, ev), 30); }, opts);
    } as typeof EventTarget.prototype.addEventListener;
  });
