/* T9-W7 pass1 · CTRL-RULE — THE RULED PAGE, as a replayable overlay.
 *
 * Injected as a module <script> into the running dev server; touches no product file.
 * `window.__rp(opts)` rebuilds the controls card as a ruled page:
 *   · the compartment wells retire (their drawn frames and their washi tags hide);
 *   · every option group gets ONE drawn graphite rule above it, wobbled with the house's
 *     own `wobbleLine` primitive (pencil-boil), drawn on with `.pencil-draw-on`;
 *   · every group name is one voice at one rung — Fraunces / --type-heading / 800 / lowercase;
 *   · the mobile tabs die (size and level are two open groups);
 *   · acts take a pose-0 drawn outline at stroke 2 (the guard-ribbon face precedent);
 *   · the bar's border is one drawn TOP RULE and the last group ends above it by reserved
 *     padding.
 *
 * opts = { arm: "above" | "beside", rule: {roughness, segments}, drawOn: bool,
 *          confirm: "ribbon" | "inplace" | null, names: 7|6 }
 */
const PB = "/node_modules/.vite/deps/@mkbabb_pencil-boil.js";

const GROUP_NAMES = {
  size: "size",
  level: "level",
  deal: "new game",
  marks: "marks",
  candidates: "candidates",
  checking: "checking",
  players: "players",
};

export async function applyRuledPage(opts = {}) {
  const arm = opts.arm || "above";
  const rough = opts.rule?.roughness ?? 0.4;
  const segs = opts.rule?.segments ?? 8;
  const drawOn = opts.drawOn !== false;
  const { wobbleLine, wobbleRect, mulberry32 } = await import(PB);

  const card = document.querySelector(".controls-card");
  const wrap = document.querySelector(".control-panel-wrap");
  if (!card || !wrap) return { error: "no card" };
  if (wrap.dataset.ruledPage === "1") return { error: "already applied" };

  /* ── 1 · THE STYLESHEET ─────────────────────────────────────────────────── */
  const css = `
/* the compartment dies */
.tray-well > svg.outline-svg { display: none !important; }
.tray-well { padding: 0 !important; margin-block: 0 !important; gap: 0 !important; }
/* the CSS hairline dies with it */
.staged-section + .staged-section { border-top: none !important; margin-top: 0 !important; padding-top: 0 !important; }
.staged-section { gap: 0 !important; }
/* the mobile tabs die: both groups stay open */
.control-panel-filtered .ctrl-options { display: flex !important; }
/* the row is no longer a caption+field flex */
.zone-row { display: block !important; }
.zone-row .options-row { flex: none !important; }
/* the tape's remaining office: the hover explication, now hung off the NAME */
.rp-group > .zone-hint, .rp-group .rp-head > .zone-hint { top: 100%; left: 0; bottom: auto; margin-bottom: 0; }
.rp-group:has(.rp-name:hover) > .zone-hint,
.rp-group:has(.rp-name:focus-visible) > .zone-hint,
.rp-group:has(:focus-visible) > .zone-hint { opacity: 1; }

/* THE GROUP */
.rp-group { position: relative; padding-block: var(--rp-pad-top) var(--rp-pad-bot); }
:root { --rp-pad-top: 0.5rem; --rp-pad-bot: 0.35rem; }
.rp-rule { display: block; width: 100%; height: 5px; overflow: visible; pointer-events: none; }
.rp-rule path { fill: none; stroke: var(--ink-press-rule); stroke-width: 1.6; stroke-linecap: round; }
/* ONE VOICE, ONE RUNG — Fraunces / --type-heading (1.618rem, phi) / 800 / lowercase,
   at EVERY viewport. This is the 768 arm dropped: one right-hand side. */
.rp-name {
  font-family: var(--font-display);
  font-size: var(--type-heading);
  line-height: 1.2;
  font-weight: 800;
  text-transform: lowercase;
  font-optical-sizing: auto;
  color: var(--color-muted-foreground);
  margin: 0;
}
.rp-name.rp-crayon { color: var(--rp-crayon, var(--color-muted-foreground)); }

/* ARM (a) — the name ABOVE its content, sitting on its rule; sticky by the push law. */
.rp-above .rp-group { display: block; position: relative; }
.rp-above .rp-head { position: sticky; top: var(--rp-stick, 0px); z-index: 34; background: var(--color-card); }
/* ARM (a′) — THE RELEASE. A head that sticks to its whole group stays pinned until the group's
   LAST pixel, so it names a group that is 26% on screen (the census's I3 violation, unmoved by
   the push law). The head's sticky container is the group's TOP HALF instead: an absolutely
   positioned box inset 0 0 50% 0, the head sticky inside it, so the name un-pins exactly
   when its group is half gone. Layout-neutral (the box is out of flow; the head keeps its own
   in-flow twin for height). */
.rp-release .rp-head { position: static; }
.rp-release .rp-stick-box { position: absolute; inset: 0 0 50% 0; pointer-events: none; }
.rp-release .rp-stick-box > .rp-head-pin { position: sticky; top: var(--rp-stick, 0px); z-index: 34; background: var(--color-card); pointer-events: auto; }
.rp-release .rp-head { visibility: hidden; }
/* ARM (b) — the name BESIDE its content, in a left margin column. */
.rp-beside .rp-group { display: grid; grid-template-columns: clamp(88px, 22%, 132px) 1fr; column-gap: 0.5rem; align-items: start; }
.rp-beside .rp-rule { grid-column: 1 / -1; }
.rp-beside .rp-name { grid-column: 1; text-align: right; }
.rp-beside .rp-field { grid-column: 2; min-width: 0; }
.rp-above .rp-field { display: block; }

/* ACTS ARE THE ONLY BOXED THINGS — pose-0 outline at stroke 2 (guard-ribbon face precedent) */
.rp-act { position: relative; }
.rp-act > svg.rp-face { position: absolute; inset: -4px; width: calc(100% + 8px); height: calc(100% + 8px); overflow: visible; pointer-events: none; z-index: 0; }
.rp-act > svg.rp-face path { fill: none; stroke: var(--ink-press-rule); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.rp-act > * { position: relative; z-index: 1; }
/* the info whisper loses its border (the estate's last CSS control border) */
.info-glyph { border: none !important; }

/* THE BAR — one drawn TOP RULE, sticky in all three scrollports */
.rp-barsticky .action-bar { position: sticky; bottom: 0; z-index: 60; }
.rp-bar-rule { position: absolute; left: 0; right: 0; top: -2px; height: 5px; overflow: visible; pointer-events: none; }
.rp-bar-rule path { fill: none; stroke: var(--ink-press-rule); stroke-width: 1.8; stroke-linecap: round; }
/* the last group ends ABOVE the bar by reserved padding — the 89.6% overlap as a layout row */
.control-panel-wrap { padding-bottom: var(--rp-bar-reserve, 0px); }

/* THE CONFIRM — in-place face: the armed verb keeps its box and its band */
.rp-sure { color: var(--color-red-ink); font-weight: 600; }
.rp-no { font-family: var(--font-hand); font-size: var(--type-verb); background: none; border: none; padding: 0; cursor: pointer; color: var(--ink-press-quiet); }
/* THE CONFIRM — ribbon face, in the bar's note berth */
.rp-ribbon { position: absolute; top: 100%; left: 0; right: 0; margin-top: 0.1rem; display: grid; gap: 0.15rem; justify-items: center; z-index: 70; }
.rp-ribbon .rp-ribbon-line { font-family: var(--font-hand); font-size: var(--type-verb); color: var(--color-red-ink); }
.rp-ribbon .rp-ribbon-verbs { display: flex; gap: 1rem; }
.rp-ribbon button { font-family: var(--font-hand); font-size: var(--type-verb); background: none; border: none; padding: 0.25rem 0.5rem; min-height: 44px; cursor: pointer; }
`;
  const style = document.createElement("style");
  style.id = "rp-style";
  style.textContent = css;
  document.head.appendChild(style);

  /* ── 2 · THE RULE PRIMITIVE ─────────────────────────────────────────────── */
  const H = 5;
  function rulePath(widthPx, seed) {
    // the house's own wobble, at the rule's own length; y at the band's middle
    return wobbleLine(0, H / 2, widthPx, H / 2, {
      roughness: rough,
      segments: segs,
      seed,
      jagged: false,
    });
  }
  function ruleSvg(widthPx, seed, cls) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", cls);
    svg.setAttribute("viewBox", `0 0 ${widthPx.toFixed(2)} ${H}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", rulePath(widthPx, seed));
    p.setAttribute("pathLength", "1");
    if (drawOn) {
      p.setAttribute("class", "pencil-draw-on");
      p.style.setProperty("--draw-dur", "260ms");
      p.style.setProperty("--draw-delay", `${(seed % 7) * 22}ms`);
    }
    svg.appendChild(p);
    return svg;
  }
  function faceSvg(el, seed) {
    const ns = "http://www.w3.org/2000/svg";
    const b = el.getBoundingClientRect();
    const w = Math.max(8, b.width + 8), h = Math.max(8, b.height + 8);
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "rp-face");
    svg.setAttribute("viewBox", `0 0 ${w.toFixed(2)} ${h.toFixed(2)}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    const p = document.createElementNS(ns, "path");
    p.setAttribute("d", wobbleRect(2, 2, w - 4, h - 4, { roughness: 0.4, segments: 4, seed, jagged: true }));
    svg.appendChild(p);
    return svg;
  }

  /* ── 3 · THE GROUPS ─────────────────────────────────────────────────────── */
  wrap.classList.add(arm === "beside" ? "rp-beside" : "rp-above");
  if (opts.release) wrap.classList.add("rp-release");
  if (!opts.barOut) wrap.classList.add("rp-barsticky");
  wrap.dataset.ruledPage = "1";

  // THE OLD NAMES ARE REMOVED, NOT HIDDEN — a hidden node still answers a census, and the
  // cure deletes them. The wells stop being groups with them (their tape WAS the name).
  const removed = [];
  for (const sel of [".section-heading", ".zone-row-label", ".mobile-heading-row"]) {
    for (const el of [...wrap.querySelectorAll(sel)]) {
      removed.push(sel);
      const h = el.closest("h1,h2,h3,h4,h5,h6");
      (h && h.contains(el) && h.textContent.trim() === el.textContent.trim() ? h : el).remove();
    }
  }
  for (const w of wrap.querySelectorAll(".tray-well")) {
    const tag = w.querySelector(":scope > .washi-tag");
    if (tag) { tag.remove(); removed.push(".washi-tag"); }
    w.removeAttribute("role");
    w.removeAttribute("aria-labelledby");
  }
  for (const r of wrap.querySelectorAll(".zone-row")) {
    r.removeAttribute("role");
    r.removeAttribute("aria-labelledby");
  }

  // Every option group's content is its `.ctrl-options`; DOM order is
  // size · level · marks · candidates · checking. The deal row and the players
  // block are the two non-chip groups.
  const optionRows = [...wrap.querySelectorAll(".ctrl-options")];
  const keys = ["size", "level", "marks", "candidates", "checking"];
  const targets = [];
  optionRows.forEach((el, i) => keys[i] && targets.push({ key: keys[i], el }));

  const dealRow = wrap.querySelector(".deal-row");
  if (dealRow) targets.splice(2, 0, { key: "deal", el: dealRow });

  // players: everything left in the players well that is not a tape
  const playersWell = [...wrap.querySelectorAll(".tray-well")].pop();
  let playersField = null;
  if (playersWell) {
    playersField = document.createElement("div");
    playersField.className = "rp-players-field";
    const keep = [...playersWell.children].filter(
      (c) => !c.classList.contains("washi-label") && c.tagName !== "svg",
    );
    keep.forEach((c) => playersField.appendChild(c));
    playersWell.appendChild(playersField);
    targets.push({ key: "players", el: playersField });
  }

  const seeds = { size: 13, level: 29, deal: 17, marks: 31, candidates: 41, checking: 59, players: 67 };
  const made = [];
  for (const t of targets) {
    if (!t.el || !t.el.parentElement) continue;
    if (opts.names === 6 && t.key === "deal") continue; // the count fork: the verb is its own name
    const g = document.createElement("div");
    g.className = "rp-group";
    g.dataset.group = t.key;
    // the explication tape follows its group (its old hover seam was the caption that died)
    const hint = t.el.parentElement.querySelector(":scope > .zone-hint");
    t.el.parentElement.insertBefore(g, t.el);
    if (hint) g.appendChild(hint);

    const width = Math.max(40, (t.el.parentElement.clientWidth || wrap.clientWidth) - 2);
    const rule = ruleSvg(width, seeds[t.key] ?? 11, "rp-rule");

    const h = document.createElement("h2");
    h.className = "rp-name";
    h.textContent = GROUP_NAMES[t.key];
    h.id = `rp-name-${t.key}`;
    if (t.key === "level") {
      h.classList.add("rp-crayon");
      const sel = t.el.querySelector(".selected-item");
      if (sel) h.style.setProperty("--rp-crayon", getComputedStyle(sel).color);
    }

    const field = document.createElement("div");
    field.className = "rp-field";
    field.setAttribute("role", "group");
    field.setAttribute("aria-labelledby", h.id);

    if (arm === "above") {
      const head = document.createElement("div");
      head.className = "rp-head";
      head.appendChild(rule);
      head.appendChild(h);
      g.appendChild(head);
      if (opts.release) {
        // the pinned twin, in a box that ends at the group's midpoint
        const boxEl = document.createElement("div");
        boxEl.className = "rp-stick-box";
        boxEl.setAttribute("aria-hidden", "true");
        const pin = head.cloneNode(true);
        pin.className = "rp-head-pin";
        pin.querySelector("h2")?.setAttribute("aria-hidden", "true");
        boxEl.appendChild(pin);
        g.appendChild(boxEl);
      }
      g.appendChild(field);
    } else {
      g.appendChild(rule);
      g.appendChild(h);
      g.appendChild(field);
    }
    field.appendChild(t.el);
    made.push(t.key);
  }

  /* ── 4 · ACTS ARE THE ONLY BOXED THINGS ─────────────────────────────────── */
  const acts = [
    ...wrap.querySelectorAll(".deal-btn"),
    ...wrap.querySelectorAll(".action-verbs > button"),
    ...wrap.querySelectorAll(".invite-btn"),
  ];
  acts.forEach((a, i) => {
    a.classList.add("rp-act");
    a.insertBefore(faceSvg(a, 101 + i * 7), a.firstChild);
  });

  /* ── 5 · THE BAR'S ONE TOP RULE + THE RESERVED PADDING ──────────────────── */
  const bar = wrap.querySelector(".action-bar");
  if (bar) {
    const bw = bar.getBoundingClientRect().width;
    // `outline-svg` because this IS the bar's drawn edge, in the one box grammar's own class
    // (a one-sided HandDrawnOutline): the census's own-chrome predicate reads that name.
    const br = ruleSvg(bw, 83, "outline-svg rp-bar-rule");
    bar.appendChild(br);
    const reserve = Math.ceil(bar.getBoundingClientRect().height);
    wrap.style.setProperty("--rp-bar-reserve", `${reserve}px`);

    /* THE BAR LEAVES THE SCROLLPORT (opts.barOut). A sticky bottom bar inside an overflowing
       scrollport covers content at every offset by definition — the 89.6% is not a z-order
       accident, it is what `position: sticky; bottom: 0` MEANS. The layout row: the bar is the
       CASE's foot, outside the card's overflow box, and the scrollport is shortened by its
       height. Then it covers nothing by construction and its top rule is the page's foot. */
    if (opts.barOut) {
      const caseEl = card.parentElement;
      const h = Math.ceil(bar.getBoundingClientRect().height);
      caseEl.style.position = "relative";
      bar.style.setProperty("position", "absolute", "important");
      bar.style.setProperty("left", "0", "important");
      bar.style.setProperty("right", "0", "important");
      bar.style.setProperty("bottom", "0", "important");
      bar.style.setProperty("z-index", "60", "important");
      bar.style.setProperty("background", "var(--color-card)", "important");
      bar.style.paddingInline = getComputedStyle(card).paddingLeft;
      caseEl.appendChild(bar);
      const ch = card.getBoundingClientRect().height;
      card.style.maxHeight = `${Math.round(ch - h)}px`;
      card.style.height = `${Math.round(ch - h)}px`;
      wrap.style.setProperty("--rp-bar-reserve", "0px");
    }
  }
  // arm (a)'s sticky offset: the card's own scroll-padding-top
  const padTop = parseFloat(getComputedStyle(card).paddingTop) || 0;
  wrap.style.setProperty("--rp-stick", `0px`);

  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  return { arm, groups: made, reserve: wrap.style.getPropertyValue("--rp-bar-reserve"), padTop };
}

/* ── THE CONFIRM, both faces, by DOM patch (W1 §1.5 owns the arming; this is the face) ── */
export function armConfirm(face, verbIndex = 0) {
  const bar = document.querySelector(".action-bar");
  const btn = document.querySelectorAll(".action-bar .action-verbs > button")[verbIndex];
  if (!btn || !bar) return { error: "no verb" };
  const before = btn.getBoundingClientRect();
  const barBefore = bar.getBoundingClientRect();
  const wrapBefore = document.querySelector(".control-panel-wrap").getBoundingClientRect();

  if (face === "inplace") {
    const lbl = btn.querySelector(".icon-sublabel");
    lbl.dataset.rpWas = lbl.textContent;
    lbl.textContent = "sure?";
    lbl.classList.add("rp-sure");
    const no = document.createElement("button");
    no.className = "rp-no";
    no.textContent = "no";
    no.setAttribute("aria-label", "keep the board");
    btn.parentElement.insertBefore(no, btn.nextSibling);
  } else {
    const rib = document.createElement("div");
    rib.className = "rp-ribbon";
    rib.setAttribute("role", "alertdialog");
    rib.setAttribute("aria-modal", "false");
    rib.innerHTML =
      '<span class="rp-ribbon-line">clear this board?</span>' +
      '<span class="rp-ribbon-verbs"><button type="button">keep</button><button type="button">clear</button></span>';
    bar.appendChild(rib);
  }
  const after = btn.getBoundingClientRect();
  const barAfter = bar.getBoundingClientRect();
  const wrapAfter = document.querySelector(".control-panel-wrap").getBoundingClientRect();
  const d = (a, b) => ({
    top: +(b.top - a.top).toFixed(2),
    right: +(b.right - a.right).toFixed(2),
    bottom: +(b.bottom - a.bottom).toFixed(2),
    left: +(b.left - a.left).toFixed(2),
  });
  return { face, verb: d(before, after), bar: d(barBefore, barAfter), wrap: d(wrapBefore, wrapAfter) };
}

window.__rp = applyRuledPage;
window.__rpConfirm = armConfirm;
