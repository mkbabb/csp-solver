/**
 * PLR-COUNT pass-1 PROTOTYPE OVERLAY — the tally as a player mark, mounted over the LIVE head
 * with zero product edits. Injected by `page.evaluate` (the string below is the function body
 * the spec hands to the page); it imports the product's own geometry so the mark is drawn by
 * the hand that draws every other stroke in this product.
 *
 *   gridPaths.generateLineBoilFrames  — the wobble + the grain bake (DifficultyTally's own call)
 *   pencilConfig.FILTER_PRESETS/BOIL  — the grain field and the frame count
 *   playerIdentity.inkFor             — the room's ink formula, verbatim
 *
 * Objects: `stroke` (DifficultyTally's gate-five: uprights + the binding diagonal) and
 * `stub` (a short fat crayon nub, chunked by a gap instead of a strike).
 *
 * Nothing here is a product patch. The overlay is appended to <body> and removed by id.
 */
export const OVERLAY_SRC = String.raw`(async (opts) => {
  const { object, n, heightPx, threshold, left, top, floorPx, soloGraphite } = opts;
  document.getElementById('plr-proto')?.remove();

  const gp  = await import('/src/pencil/grid/gridPaths.ts');
  const cfg = await import('/src/pencil/config/pencilConfig.ts');
  const pid = await import('/src/games/shared/playerIdentity.ts');
  const grain = cfg.FILTER_PRESETS['grain-static']?.grain;
  const FC = Math.max(2, Math.floor(cfg.BOIL_CONFIG.frameCount));

  const line = (x1,y1,x2,y2,seed) =>
    gp.generateLineBoilFrames(x1,y1,x2,y2,
      { roughness: 0.95, segments: 4, seed, jagged: true }, 0.6, FC, grain);

  // ── geometry ────────────────────────────────────────────────────────────────────────────
  // stroke: DifficultyTally's own gate — uprights at pitch 13 from x=11, y 9..35; the fifth is
  // the binding diagonal (6,37)->(55,7). Group pitch 68 => 19u of gap against 13u of pitch.
  // stub:   a 16u nub at pitch 11, stroke-width 6.5; groups of five chunked by the same 19u gap.
  const H = 44;
  const G = { stroke: { pitch: 13, x0: 11, gpitch: 68, w: 3.2 },
              plain:  { pitch: 13, x0: 11, gpitch: 78, w: 3.2 },
              stub:   { pitch: 11, x0: 9,  gpitch: 63, w: 6.5 } }[object];

  const marks = [];   // {d, cx, seed, kind}
  let contentRight = 0;
  for (let i = 0; i < n; i++) {
    const g = Math.floor(i / 5), k = i % 5;
    const gx = g * G.gpitch;
    const seed = 11 + i * 13;
    if (object === 'stroke' && k === 4) {
      marks.push({ frames: line(gx+6, 37, gx+55, 7, seed), cx: gx + 30.5, kind: 'strike' });
      contentRight = Math.max(contentRight, gx + 55);
    } else if (object === 'stroke' || object === 'plain') {
      const x = gx + G.x0 + k * G.pitch;
      marks.push({ frames: line(x, 9, x, 35, seed), cx: x, kind: 'upright' });
      contentRight = Math.max(contentRight, x);
    } else {
      const x = gx + G.x0 + k * G.pitch;
      marks.push({ frames: line(x, 14, x, 30, seed), cx: x, kind: 'stub' });
      contentRight = Math.max(contentRight, x);
    }
  }
  const VW = Math.max(20, contentRight + 8);

  // ── ink ─────────────────────────────────────────────────────────────────────────────────
  // Solo is ONE graphite stroke (the mark is always present, always the same meaning).
  const inks = [];
  for (let i = 0; i < n; i++) {
    if (n === 1 && soloGraphite) { inks.push('var(--color-pencil-graphite, var(--grid-line-color))'); }
    else { inks.push(pid.inkFor(i)['--color-user-ink']); }
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + VW + ' ' + H);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', 'plr-marks');
  svg.style.height = heightPx + 'px';
  svg.style.width = 'auto';
  svg.style.overflow = 'visible';
  svg.style.flex = '0 0 auto';

  // Pose siblings, opacity-swapped — pose 0 active at rest (filterless, zero live filter).
  for (let f = 0; f < FC; f++) {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'plr-pose' + (f === 0 ? ' is-active' : ''));
    g.style.opacity = f === 0 ? '1' : '0';
    g.style.willChange = 'opacity';
    marks.forEach((m, i) => {
      const p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', m.frames[f % m.frames.length]);
      p.setAttribute('fill', 'none');
      p.setAttribute('stroke-linecap', 'round');
      p.setAttribute('stroke-linejoin', 'round');
      p.setAttribute('stroke', inks[i]);
      p.setAttribute('stroke-width', String(G.w));
      p.setAttribute('stroke-opacity', '0.95');
      p.setAttribute('data-mark', String(i));
      p.setAttribute('data-cx', String(m.cx));
      g.appendChild(p);
    });
    svg.appendChild(g);
  }

  // ── the trigger ─────────────────────────────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.id = 'plr-proto';
  wrap.style.cssText =
    'position:fixed;left:' + left + 'px;top:' + top + 'px;z-index:41;';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'plr-mark';
  const label = n === 1 ? '1 player on this board' : n + ' players on this board';
  btn.setAttribute('aria-label', label);
  btn.setAttribute('aria-expanded', 'false');
  btn.style.cssText =
    'display:inline-flex;align-items:center;justify-content:center;gap:0.25rem;' +
    'background:transparent;border:none;padding:0 0.5rem;cursor:pointer;' +
    'min-width:' + floorPx + 'px;min-height:' + floorPx + 'px;' +
    'font-family:var(--font-hand);font-size:var(--type-tag);color:var(--ink-press-quiet);';
  btn.appendChild(svg);

  let written = null;
  if (n > threshold) {
    written = document.createElement('span');
    written.id = 'plr-written';
    written.textContent = String(n);
    written.setAttribute('aria-hidden', 'true');
    btn.appendChild(written);
  }

  // ── the lobby (the attendance register, @mbabb card's pose) ─────────────────────────────
  const lobby = document.createElement('div');
  lobby.setAttribute('data-lobby', '');
  lobby.setAttribute('role', 'dialog');
  lobby.setAttribute('aria-label', 'who is on this board');
  lobby.style.cssText =
    'position:absolute;top:100%;left:0;margin-top:0;padding:1rem;width:256px;' +
    'background:color-mix(in srgb, var(--color-popover) 80%, transparent);' +
    'border:2px solid color-mix(in srgb, var(--color-border) 30%, transparent);' +
    'border-radius:1rem;display:none;font-family:var(--font-hand);' +
    'font-size:var(--type-tag);z-index:50;';
  const ul = document.createElement('ul');
  ul.style.cssText = 'list-style:none;margin:0;padding:0;';
  const SLUGS = ['tragic-mockingbird','brave-otter','quiet-heron','wild-marten','still-lynx',
                 'clever-wren','slow-badger','warm-finch','plain-vole','damp-newt',
                 'lone-stoat','round-teal','faint-pika','dim-ibis','soft-eland','low-tapir'];
  for (let i = 0; i < n; i++) {
    const li = document.createElement('li');
    li.className = 'plr-lobby-row';
    li.style.cssText = 'display:flex;align-items:baseline;gap:0.5rem;line-height:1.35;';
    const sw = document.createElementNS(svgNS, 'svg');
    sw.setAttribute('viewBox', '0 0 12 30');
    sw.setAttribute('aria-hidden', 'true');
    sw.style.cssText = 'height:0.95em;width:auto;flex:0 0 auto;overflow:visible;';
    const sp = document.createElementNS(svgNS, 'path');
    sp.setAttribute('d', line(6, 3, 6, 27, 31 + i * 7)[0]);
    sp.setAttribute('fill', 'none');
    sp.setAttribute('stroke', inks[i]);
    sp.setAttribute('stroke-width', '3.2');
    sp.setAttribute('stroke-opacity', '0.95');
    sp.setAttribute('stroke-linecap', 'round');
    sp.setAttribute('data-lobby-mark', String(i));
    sw.appendChild(sp);
    const nm = document.createElement('span');
    nm.className = 'plr-lobby-name';
    nm.textContent = SLUGS[i % SLUGS.length];
    nm.style.cssText = 'color:var(--color-foreground);flex:0 1 auto;';
    li.appendChild(sw); li.appendChild(nm);
    if (i === 0) {
      const you = document.createElement('span');
      you.className = 'plr-lobby-you';
      you.textContent = 'you';
      you.style.cssText = 'color:var(--ink-press-quiet);flex:0 0 auto;';
      li.appendChild(you);
    }
    ul.appendChild(li);
  }
  lobby.appendChild(ul);
  const foot = document.createElement('p');
  foot.className = 'plr-lobby-foot';
  foot.textContent = 'last heard from a moment ago';
  foot.style.cssText = 'margin:0.5rem 0 0;color:var(--ink-press-quiet);';
  lobby.appendChild(foot);

  btn.addEventListener('click', () => {
    const open = lobby.style.display === 'block';
    lobby.style.display = open ? 'none' : 'block';
    btn.setAttribute('aria-expanded', String(!open));
  });

  wrap.appendChild(btn);
  wrap.appendChild(lobby);
  document.body.appendChild(wrap);

  const bb = btn.getBoundingClientRect();
  const sb = svg.getBoundingClientRect();
  return {
    object, n, viewBoxW: VW, viewBoxH: H,
    label,
    pxPerUnit: sb.height / H,
    strokeUnits: G.w,
    strokePx: (sb.height / H) * G.w,
    svg: { w: +sb.width.toFixed(2), h: +sb.height.toFixed(2), x: +sb.x.toFixed(2), y: +sb.y.toFixed(2) },
    btn: { w: +bb.width.toFixed(2), h: +bb.height.toFixed(2), x: +bb.x.toFixed(2), y: +bb.y.toFixed(2) },
    written: written ? written.textContent : null,
    marks: marks.map((m, i) => ({ i, kind: m.kind, cx: m.cx, ink: inks[i] })),
  };
})
`;
