import { ENGINES, CELLS, open } from "./p6-lib.mjs";
const [eng, L] = ENGINES[+(process.argv[3]||0)];
const br = await L.launch();
const { ctx, page } = await open(br, process.argv[2], CELLS.rail1440, { dpr: 1 });
const out = await page.evaluate(async () => {
  const c = document.querySelector('.controls-card'); const range = c.scrollHeight - c.clientHeight; const rows = [];
  for (const f of [0, 0.1, 0.25, 0.4, 0.5, 0.75]) { c.scrollTop = Math.round(range * f); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); await new Promise((r) => setTimeout(r, 30));
    const cb = c.getBoundingClientRect(); const clipTop = cb.top + c.clientTop; const pad = parseFloat(getComputedStyle(c).paddingTop);
    rows.push({ f, tapes: [...c.querySelectorAll('.washi-tag')].map((t) => { const cs = getComputedStyle(t); const r = t.getBoundingClientRect(); return { t: t.textContent.trim().slice(0, 8), pos: cs.position, rel: t.hasAttribute('data-released'), top: cs.top, tr: cs.translate, tf: cs.transform.slice(0, 30), dClip: +(r.top - clipTop).toFixed(2), dBand: +(r.top - clipTop - pad).toFixed(2) }; }) }); }
  return rows; });
for (const r of out) console.log(JSON.stringify(r));
await br.close();
