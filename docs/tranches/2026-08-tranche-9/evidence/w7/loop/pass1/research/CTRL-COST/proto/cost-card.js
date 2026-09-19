/* ══════════════════════════════════════════════════════════════════════════════════════
   CTRL-COST · THE CONSEQUENCE LADDER — pass-1 DOM patch (the structural half).

   Run in the page with `page.evaluate(costCard)` after `cost-card.css` is injected. It
   RE-PARENTS the product's own control nodes; it mints no control and writes no product
   file. The buttons keep their Vue listeners, so a forwarded click is the real act.

   THE TAXONOMY IT APPLIES — what an act COSTS, not what it is about:

     looking        changes only what you see          marks · what fits · checking · size · level
     writing        changes the board, reversibly      hint · fill · solve · undo · redo
     starting over  throws the board away              deal · clear
     players        not a board act at all             play together · share · who is here · leave

   The fourth band is NOT a fourth tier: it is the residue the ladder proves exists. A cost
   ladder ranks acts by what they do to YOUR board, and inviting somebody costs the board
   nothing — it changes who may write on it. Forcing it into `looking` would be a lie of
   exactly the kind this family exists to delete.
   ══════════════════════════════════════════════════════════════════════════════════════ */
export const costCard = () => {
  const card = document.querySelector(".controls-card");
  const wrap = card && card.querySelector(".control-panel-wrap");
  if (!wrap) return { ok: false, why: "no .control-panel-wrap" };

  const wells = [...wrap.querySelectorAll(".tray-well")];
  const tagOf = (w) => (w.querySelector(":scope > .washi-tag")?.textContent || "").trim();
  const wellBy = (name) => wells.find((w) => tagOf(w) === name) || null;
  const newGame = wellBy("new game");
  const pencils = wellBy("pencils");
  const checking = wellBy("checking");
  const players = wellBy("players");
  const bar = wrap.querySelector(".action-bar");
  const barVerbs = [...(bar?.querySelectorAll(".action-verbs button") || [])];
  const byLabel = (n) =>
    barVerbs.find((b) => (b.querySelector(".icon-sublabel")?.textContent || "").trim() === n);
  const clearBtn = byLabel("Clear") || barVerbs[0];
  const fillBtn = byLabel("Fill") || barVerbs[1];
  const solveBtn = byLabel("Solve") || barVerbs[2];
  const shareBtn = byLabel("Share") || byLabel("share") || barVerbs[3];
  const infoBtn = bar?.querySelector(".info-btn") || null;
  const dealBtn = wrap.querySelector(".deal-row .deal-btn");
  const tally = wrap.querySelector(".deal-row .difficulty-tally");
  const play = document.querySelector(".play-controls");
  const playBtns = [...(play?.querySelectorAll("button") || [])];
  const undoBtn = playBtns[0] || null;
  const redoBtn = playBtns[1] || null;
  const hintBtn = playBtns[2] || null;
  const peekBtn = play?.querySelector(".peek-chip") || null;

  const el = (tag, cls, txt) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  };

  // ── the three bands + the residue ────────────────────────────────────────────────────
  // Each band name is a real `<h2>` carrying `.section-heading`, so it answers the §1
  // instrument's own selector as a document heading in the one voice.
  const band = (name, id) => {
    const b = el("section", "cost-band");
    b.setAttribute("role", "group");
    b.setAttribute("aria-labelledby", id);
    const h = el("h2", "cost-band-head");
    const s = el("span", "cost-band-name section-heading", name);
    s.id = id;
    h.appendChild(s);
    b.appendChild(h);
    const body = el("div", "cost-band-body");
    b.appendChild(body);
    b._body = body;
    return b;
  };
  const bLook = band("looking", "cost-band-looking");
  const bWrite = band("writing", "cost-band-writing");
  const bOver = band("starting over", "cost-band-over");

  // ── TIER 1 · the five rows ───────────────────────────────────────────────────────────
  // The old names become row CAPTIONS: they name a setting, not a compartment, so they
  // drop off the group-name census entirely (`.zone-row-label` and the wells' tapes are
  // the nodes the eight-name census counted).
  const row = (caption, node) => {
    const r = el("div", "cost-row");
    r.appendChild(el("span", "cost-row-caption", caption));
    if (node) r.appendChild(node);
    return r;
  };
  const sections = [...(newGame?.querySelectorAll(".staged-section") || [])];
  const stagedOptions = sections.length
    ? sections.map((s) => ({
        name: (s.querySelector(".section-heading")?.textContent || "").trim().toLowerCase(),
        node: s.querySelector(".ctrl-options"),
      }))
    : [...(newGame?.querySelectorAll(".control-panel-filtered > .ctrl-options") || [])].map(
        (n, i) => ({ name: i === 0 ? "size" : "level", node: n }),
      );
  const pencilRows = [...(pencils?.querySelectorAll(".zone-row") || [])].map((zr) => ({
    name: (zr.querySelector(".zone-row-label")?.textContent || "").trim(),
    node: zr.querySelector(".ctrl-options"),
  }));
  const checkOptions = checking?.querySelector(".ctrl-options") || null;

  // COST ORDER inside the band: the acts a reader changes mid-play first, the two that only
  // matter at the next deal last. That ordering is the whole of the desk rail's at-a-glance
  // read: every setting's state is above the fold because nothing destructive is in front
  // of it any more.
  for (const r of pencilRows)
    bLook._body.appendChild(row(r.name === "candidates" ? "what fits" : r.name, r.node));
  if (checkOptions) bLook._body.appendChild(row("checking", checkOptions));
  for (const s of stagedOptions) bLook._body.appendChild(row(s.name, s.node));

  // ── TIER 2 · the drawn face at stroke 2 ──────────────────────────────────────────────
  // THE BAND IS THE LAW; THE RIBBON IS ITS PROJECTION. `.play-controls` is `display: none`
  // at base and `flex` only under `(pointer: coarse)` (`GameControlPanel.vue:2359-2371`), and
  // it teleports to `#fold-tools` only on the PORTRAIT dock. So the three play tools are
  // drawn controls on a phone and keystrokes on the desk. The band takes them exactly where
  // nothing else draws them — the desk, and coarse landscape where the ribbon's berth is
  // `display: none` — and leaves the portrait ribbon alone, because an act at 0 taps must
  // not be pulled back to 2.
  const ribbonLive = !!play && getComputedStyle(play).display !== "none" && !!play.offsetParent;
  const acts2 = el("div", "cost-acts");
  const face2 = (btn) => {
    if (!btn) return;
    btn.classList.add("cost-face");
    acts2.appendChild(btn);
  };
  const tier2 = ribbonLive ? [fillBtn, solveBtn] : [hintBtn, fillBtn, solveBtn, undoBtn, redoBtn];
  for (const b of tier2) face2(b);
  bWrite._body.appendChild(acts2);

  // ── TIER 3 · laid out at the ARMED size ──────────────────────────────────────────────
  // The face holds BOTH words in one grid cell (so the cell is as wide as the wider word,
  // at rest and armed alike) and a second line that is present-but-hidden. Arming flips
  // `visibility`. The box cannot move because nothing about it changes.
  const acts3 = el("div", "cost-acts");
  const armed = new Map();
  const face3 = (btn, restWord) => {
    if (!btn) return null;
    btn.classList.add("cost-face", "cost-face-destructive");
    const sub = btn.querySelector(".icon-sublabel");
    if (sub) sub.style.display = "none";
    const stack = el("div", "cost-wordstack");
    const rest = el("span", "cost-word-rest", restWord);
    const ask = el("span", "cost-word-armed", "sure?");
    stack.append(rest, ask);
    const no = el("span", "cost-secondline", "no");
    btn.append(stack, no);
    acts3.appendChild(btn);
    armed.set(btn, false);
    return btn;
  };
  const dealFace = face3(dealBtn, "deal");
  const clearFace = face3(clearBtn, "clear");
  bOver._body.appendChild(acts3);
  if (tally) bOver._body.appendChild(tally);

  // The overlay's own arm — the family's rule, stated as code: EVERY tier-3 press asks,
  // on every pointer; the second press inside the window acts; any other tap, or 4s,
  // disarms. (The product's own arm is coarse-and-dirty gated and is measured unchanged
  // by I4; this one exists so the prototype can be armed at 1280 with a mouse.)
  let armTimer = null;
  const disarmAll = () => {
    for (const [b] of armed) {
      armed.set(b, false);
      b.classList.remove("is-armed");
    }
    if (armTimer) clearTimeout(armTimer);
    armTimer = null;
  };
  window.__costDisarm = disarmAll;
  window.__costArmed = () => [...armed.entries()].filter(([, v]) => v).length;
  for (const [btn] of armed) {
    btn.addEventListener(
      "click",
      (e) => {
        if (armed.get(btn)) return; // armed: let the real handler run
        e.stopPropagation();
        e.preventDefault();
        disarmAll();
        armed.set(btn, true);
        btn.classList.add("is-armed");
        armTimer = setTimeout(disarmAll, 4000);
      },
      true,
    );
  }
  document.addEventListener("click", (e) => {
    if (![...armed.keys()].some((b) => b.contains(e.target))) disarmAll();
  });

  // ── THE RESIDUE · players ────────────────────────────────────────────────────────────
  // `share` is not a board act. It moves beside the acts that are also about people, which
  // is the only reading under which the bar's deletion leaves no orphan.
  if (players && shareBtn) {
    shareBtn.classList.add("cost-face");
    const inviteBtn = players.querySelector(".invite-btn");
    (inviteBtn || players).insertAdjacentElement(inviteBtn ? "afterend" : "beforeend", shareBtn);
  }

  // THE RESIDUE TAKES THE SAME NAME TREATMENT, and this is the answer to "three tiers or
  // four": three COSTS and one residue, FOUR names, one voice. The tape is not replaced —
  // it is PROMOTED: the same node keeps its id (so the well's `aria-labelledby` still
  // resolves) and loses only its tape ground and its 14px rung. One voice, four names,
  // four document headings, zero new accessible names.
  if (players) {
    const tape = players.querySelector(":scope > .washi-tag");
    if (tape) {
      const h = el("h2", "cost-band-head");
      tape.replaceWith(h);
      // BOTH classes go. `.washi-tag` is the tape's ANCHOR; `.washi-label` is the tape itself
      // (absolute, opacity 0, `--type-small`, the torn `clip-path` inline) — leave it on and
      // the promoted name is still a tape wearing a heading's colour.
      tape.classList.remove("washi-tag", "washi-label");
      tape.removeAttribute("style");
      tape.classList.add("cost-band-name", "section-heading");
      h.appendChild(tape);
      players.prepend(h);
    }
    players.classList.add("cost-band", "cost-unwelled");
  }

  // ── assemble ─────────────────────────────────────────────────────────────────────────
  const anchor = newGame || wrap.firstElementChild;
  anchor.insertAdjacentElement("beforebegin", bLook);
  bLook.insertAdjacentElement("afterend", bWrite);
  bWrite.insertAdjacentElement("afterend", bOver);
  if (players) bOver.insertAdjacentElement("afterend", players);

  // the emptied wells stand down (their frames and tapes were the eight-name census)
  for (const w of [newGame, pencils, checking]) {
    if (!w) continue;
    w.classList.add("cost-unwelled");
    w.style.display = "none";
  }
  // the `i` crib keeps a home: beside the band it explains, not in a deleted bar
  if (infoBtn) bLook.querySelector(".cost-band-head").appendChild(infoBtn);
  if (bar) bar.style.display = "none";

  return {
    ok: true,
    moved: {
      tier1Rows: bLook._body.querySelectorAll(".cost-row").length,
      tier2Faces: acts2.querySelectorAll(":scope > .cost-face").length,
      ribbonLive,
      tier3Faces: acts3.querySelectorAll(":scope > .cost-face").length,
      shareRehomed: !!(players && shareBtn && players.contains(shareBtn)),
      peekStays: !!peekBtn,
    },
  };
};
