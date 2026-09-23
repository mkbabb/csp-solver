(() => {
  const D = (window.__DI = { f: [], lt: [], loaf: [], ev: [], bake: [], mut: [] });
  const now = () => performance.now();
  const ev = (k, x) => D.ev.push([Math.round(now() * 10) / 10, k, x ?? null]);
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) D.lt.push([Math.round(e.startTime), Math.round(e.duration)]); }).observe({ type: 'longtask', buffered: true }); } catch (e) {}
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) D.loaf.push({ s: Math.round(e.startTime), d: Math.round(e.duration), b: Math.round(e.blockingDuration || 0), r: Math.round((e.renderStart || 0) - e.startTime), st: Math.round((e.styleAndLayoutStart || 0) - e.startTime), sc: (e.scripts || []).slice().sort((a, b) => b.duration - a.duration).slice(0, 3).map((s) => [Math.round(s.duration), s.invoker, (s.sourceFunctionName || ''), (s.sourceURL || '').split('/').pop() + ':' + (s.sourceCharPosition ?? '')]) }); }).observe({ type: 'long-animation-frame', buffered: true }); } catch (e) {}
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) ev('paint', e.name + '@' + Math.round(e.startTime)); }).observe({ type: 'paint', buffered: true }); } catch (e) {}
  // bakes
  const di = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function (...a) { const t = now(); const r = di.apply(this, a); D.bake.push(['draw', Math.round(t), Math.round((now() - t) * 10) / 10, this.canvas.width]); return r; };
  const tb = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, ...a) { const t = now(); const w = this.width; const s = tb.call(this, (b) => { D.bake.push(['blob', Math.round(t), Math.round((now() - t) * 10) / 10, w]); cb(b); }, ...a); D.bake.push(['blobcall', Math.round(t), Math.round((now() - t) * 10) / 10, w]); return s; };
  document.addEventListener('DOMContentLoaded', () => { ev('dcl');
    try { document.fonts.addEventListener('loadingdone', (e) => ev('fontdone', e.fontfaces.map((f) => f.family + ' ' + f.weight).join('|'))); document.fonts.ready.then(() => ev('fontsready')); } catch (e) {}
    const mo = new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) { if (n.nodeType !== 1) continue; if (n.matches?.('path.grid-line') || n.querySelector?.('path.grid-line')) D.mut.push(['grid+', Math.round(now() * 10) / 10]); if (n.matches?.('image.boil-frame-bitmap') || n.querySelector?.('image.boil-frame-bitmap')) D.mut.push(['gridbmp+', Math.round(now() * 10) / 10]); if (n.querySelector?.('.handwritten-logo') || n.matches?.('.handwritten-logo')) D.mut.push(['logo+', Math.round(now() * 10) / 10]); if (n.querySelector?.('.glyph-svg')) D.mut.push(['glyph+', Math.round(now() * 10) / 10]); } });
    mo.observe(document.documentElement, { childList: true, subtree: true });
  });
  window.addEventListener('load', () => ev('load'));
  const P = (x) => Math.round(x * 1000) / 1000;
  function sample(ts) {
    const r = { t: Math.round(ts * 10) / 10 };
    const tl = document.querySelectorAll('svg.hand-drawn-grid > g:not(.boil-frame-layer) path.grid-line');
    if (tl.length) {
      const g = { frame: [], sub: [], cell: [] }; let whole = 0, part = 0, zero = 0;
      for (const p of tl) { const da = p.style.strokeDasharray; const off = parseFloat(p.style.strokeDashoffset);
        let pr; if (!da || da === 'none') { pr = 1; if (!da) whole++; } else { const L = parseFloat(da); pr = L ? 1 - off / L : 1; }
        if (pr > 0.001 && pr < 0.999) part++; if (pr <= 0.001) zero++;
        (p.classList.contains('frame-line') ? g.frame : p.classList.contains('subgrid-line') ? g.sub : g.cell).push(pr); }
      const m = (a) => (a.length ? P(a.reduce((x, y) => x + y, 0) / a.length) : null);
      r.g = [m(g.frame), m(g.sub), m(g.cell), m([...g.frame, ...g.sub, ...g.cell])]; r.pl = [...g.frame, ...g.sub, ...g.cell].map(P); r.gn = tl.length; r.gw = whole; r.gp = part; r.gz = zero;
    }
    r.sb = document.querySelectorAll('image.boil-frame-bitmap').length; r.sl = document.querySelectorAll('g.boil-frame-layer:not(.baked-hidden)').length;
    const lg = document.querySelector('.handwritten-logo');
    if (lg) { const cp = getComputedStyle(lg).clipPath; const mm = /inset\(\S+ ([\d.]+)%/.exec(cp); r.lc = mm ? P(1 - parseFloat(mm[1]) / 100) : (cp === 'none' ? 1 : cp.startsWith('inset(0px)') || cp === 'inset(0px 0% 0px 0px)' ? 1 : cp); r.lb = document.querySelectorAll('image.logo-pose-bmp').length; }
    const sc = document.querySelector('.scene-controls'); if (sc) r.co = P(parseFloat(getComputedStyle(sc).opacity));
    const ts2 = document.querySelectorAll('.dt-pose:first-child .dt-stroke.inked'); if (ts2.length) { let a = 0; for (const x of ts2) a += 1 - (parseFloat(x.style.strokeDashoffset) || 0) / 100; r.ty = P(a / ts2.length); r.tyn = ts2.length; }
    const pt = document.querySelector('.progress-trace path'); if (pt) r.pt = pt.style.strokeDashoffset;
    const gps = document.querySelectorAll('.board-cells .glyph-svg path'); if (gps.length) { let a = 0, part = 0, zero = 0; for (const x of gps) { const da = x.style.strokeDasharray; let pr = 1; if (da && da !== 'none') { const L = parseFloat(da); pr = L ? 1 - (parseFloat(x.style.strokeDashoffset) || 0) / L : 1; } a += pr; if (pr > 0.001 && pr < 0.999) part++; if (pr <= 0.001) zero++; } r.gv = [P(a / gps.length), part, zero, gps.length]; }
    r.gl = document.querySelectorAll('.glyph-svg path').length; r.ld = document.querySelectorAll('.scene-loading').length;
    r.tb = document.querySelectorAll('.sun-moon-toggle image').length;
    D.f.push(r);
  }
  // Post-rAF, pre-paint sampling: a ResizeObserver on a 1px probe fires after every rAF callback
  // and layout of the SAME frame, so the sample is the state the frame PAINTS, not the one it inherited.
  let curTs = 0, flip = false, probe = null;
  const ro = new ResizeObserver(() => { try { sample(curTs); } catch (e) { D.err = String(e); } });
  function ensureProbe() { if (probe || !document.body) return; probe = document.createElement('div'); probe.setAttribute('aria-hidden', 'true'); probe.style.cssText = 'position:fixed;left:0;top:0;height:1px;width:1px;opacity:0;pointer-events:none;contain:strict'; document.body.appendChild(probe); ro.observe(probe); }
  function loop(ts) { curTs = ts; ensureProbe(); if (probe) { flip = !flip; probe.style.width = flip ? '2px' : '1px'; } else { try { sample(ts); } catch (e) { D.err = String(e); } } if (ts < 6000) requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
})();
