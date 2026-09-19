/**
 * PLR-SELF pass-1 · THE STATIC OVERLAY.
 *
 * Mounts a player mark and its lobby over the LIVE head without touching a product file.
 * Every number it poses with is READ OFF the running AttributionCard (getComputedStyle on
 * `.attribution-trigger` and `.hover-card`), so the sheet is a clone of that shell rather
 * than a retyped table of pixels — if the card moves, the prototype moves with it.
 *
 * Injected with `page.evaluate(src)`; then `window.__plrSelf.mount(opts)`.
 *
 *   opts.form    "name" | "stub"        the family's first fork
 *   opts.roster  "mirror" | "move"      the family's second variable
 *   opts.people  [{slug, index|null, self, lastHeardMs}]   index null === solo graphite
 *   opts.show    how many rows before the compression line
 *
 * It draws NOTHING with a filter, mounts no live `url(#…)`, and adds no second BoilDivider.
 * The stub is a static path in the icon family's own idiom (`src/pencil/chrome/icons/*.vue`:
 * decorative, aria-hidden, currentColor, no filter).
 */
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const px = (v) => `${v}px`;

  const readPose = () => {
    // TWO INSTANCES, ONE VISIBLE (App.vue:802 desk `.corner-left`, :813 phone
    // `.mobile-attribution`, `v-show`-played). The hidden one measures 0×0, so the pose is
    // read off whichever one the viewport is actually painting.
    const trig = [...document.querySelectorAll(".attribution-trigger")].find(
      (e) => e.getBoundingClientRect().width > 0,
    );
    const card = trig.parentElement.querySelector(".hover-card");
    const t = getComputedStyle(trig);
    const c = getComputedStyle(card);
    return {
      trigBox: trig.getBoundingClientRect(),
      trigPad: [t.paddingTop, t.paddingRight, t.paddingBottom, t.paddingLeft],
      trigFont: `${t.fontSize} / ${t.fontFamily}`,
      sheet: {
        background: c.backgroundColor,
        border: `${c.borderTopWidth} ${c.borderTopStyle} ${c.borderTopColor}`,
        borderRadius: c.borderRadius,
        padding: c.padding,
        minWidth: c.minWidth,
        zIndex: c.zIndex,
        transition: c.transition,
      },
      wrapperTop: getComputedStyle(trig.parentElement).top,
    };
  };

  /** playerIdentity.ts:64-70, verbatim formula. */
  const inkFor = (i) => `oklch(var(--peer-ink-l) 0.11 ${((i * 137.5) % 360).toFixed(1)}deg)`;

  /** The crayon stub: one hand-cut rect, corners out of true, no filter. 24-unit viewBox,
   *  the icon family's own coordinate system. */
  const stubPath = () => {
    const p = document.createElementNS(NS, "path");
    // a stubby wax block seen flat on: four sides, none of them straight, one nicked corner
    p.setAttribute(
      "d",
      "M4.6,7.3 Q11.8,6.1 19.2,7.0 Q19.9,12.1 19.0,17.2 Q11.6,18.4 4.9,17.0 Q4.2,12.2 4.6,7.3 Z",
    );
    p.setAttribute("fill", "currentColor");
    return p;
  };

  const spell = (n) =>
    ["no one", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][n] ??
    String(n);

  /** THE FOOT, against the 45s expiry (useSession.ts:616,624). Never a connected dot. */
  const heard = (ms) => {
    if (ms == null) return "";
    const s = Math.round(ms / 1000);
    if (s < 20) return "last heard from a moment ago";
    if (s < 45) return `last heard from ${s} seconds ago`;
    return "last heard from over a minute ago";
  };

  const stateLine = (n) => (n <= 1 ? "only you" : `${n} on this board`);

  function mount(opts) {
    unmount();
    const o = Object.assign(
      { form: "stub", roster: "mirror", people: [], show: 9, open: false },
      opts,
    );
    const pose = readPose();
    const n = o.people.length;
    const me = o.people.find((p) => p.self) ?? o.people[0];
    const myInk = me && me.index != null ? inkFor(me.index) : "var(--color-pencil-graphite)";

    const wrap = document.createElement("div");
    wrap.id = "plr-self";
    Object.assign(wrap.style, {
      position: "fixed",
      top: pose.wrapperTop,
      left: px(Math.round(pose.trigBox.right)),
      zIndex: "40",
    });

    // ── the mark ──────────────────────────────────────────────────────────────────────
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "plr-mark";
    btn.setAttribute("data-player-mark", "");
    btn.setAttribute("aria-expanded", String(!!o.open));
    // THE ACCESSIBLE NAME IS THE STATE LINE (the charter's row 5). One literal, drawn and
    // spoken, per T5-W3 §3.2's one-name law.
    btn.setAttribute("aria-label", stateLine(n));
    Object.assign(btn.style, {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "2.75rem", // --tap-floor, both dimensions
      minHeight: "2.75rem",
      padding: "0 0.5rem",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: myInk,
      lineHeight: "1",
    });
    if (o.form === "name") {
      btn.textContent = me ? me.slug.split("-").pop() : "";
      Object.assign(btn.style, {
        fontFamily: "var(--font-hand)",
        fontSize: "var(--type-tag)",
      });
    } else {
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("width", "28");
      svg.setAttribute("height", "28");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.appendChild(stubPath());
      btn.appendChild(svg);
    }
    wrap.appendChild(btn);

    // ── the lobby ─────────────────────────────────────────────────────────────────────
    const sheet = document.createElement("div");
    sheet.setAttribute("data-lobby", "");
    Object.assign(sheet.style, {
      position: "absolute",
      top: "100%",
      left: "0",
      background: pose.sheet.background,
      border: pose.sheet.border,
      borderRadius: pose.sheet.borderRadius,
      padding: pose.sheet.padding,
      minWidth: pose.sheet.minWidth,
      zIndex: pose.sheet.zIndex,
      display: o.open ? "block" : "none",
      fontFamily: "var(--font-hand)",
      fontSize: "var(--type-tag)",
    });

    const state = document.createElement("p");
    state.className = "plr-state";
    state.textContent = stateLine(n);
    Object.assign(state.style, {
      margin: "0 0 0.35rem",
      color: "var(--ink-press-quiet)",
      lineHeight: "1.25",
    });
    sheet.appendChild(state);

    const list = document.createElement("ul");
    list.className = "plr-roster";
    // MIRROR: the well keeps `role="log"`, so this list is a plain list and says nothing.
    // MOVE: the log RIDES here — one region, moved, never a second one.
    if (o.roster === "move") {
      list.setAttribute("role", "log");
      list.setAttribute("aria-live", "polite");
      list.setAttribute("aria-label", "who's on this board");
      if (n) list.setAttribute("tabindex", "0");
    }
    Object.assign(list.style, {
      listStyle: "none",
      margin: "0",
      padding: "0",
      display: "flex",
      flexDirection: "column",
      gap: "0.1rem",
    });

    const shown = o.people.slice(0, o.show);
    for (const p of shown) {
      const li = document.createElement("li");
      li.className = "plr-row";
      Object.assign(li.style, {
        display: "flex",
        alignItems: "baseline",
        gap: "0.35rem",
        lineHeight: "1.35",
        color: p.index != null ? inkFor(p.index) : "var(--color-pencil-graphite)",
      });
      if (o.form === "stub") {
        const s = document.createElementNS(NS, "svg");
        s.setAttribute("aria-hidden", "true");
        s.setAttribute("width", "11");
        s.setAttribute("height", "11");
        s.setAttribute("viewBox", "0 0 24 24");
        s.style.flex = "0 0 auto";
        s.style.alignSelf = "center";
        s.appendChild(stubPath());
        li.appendChild(s);
      }
      const name = document.createElement("span");
      name.className = "plr-name";
      name.textContent = p.slug;
      li.appendChild(name);
      if (p.self) {
        const you = document.createElement("span");
        you.className = "plr-you";
        you.textContent = "you";
        you.style.color = "var(--ink-press-quiet)";
        li.appendChild(you);
      }
      list.appendChild(li);
    }
    if (n > o.show) {
      const more = document.createElement("li");
      more.className = "plr-more";
      const k = n - o.show;
      more.textContent = `and ${k < 10 ? spell(k) : k} more`;
      more.style.color = "var(--ink-press-quiet)";
      more.style.lineHeight = "1.35";
      list.appendChild(more);
    }
    sheet.appendChild(list);

    const foot = document.createElement("p");
    foot.className = "plr-foot";
    const oldest = o.people
      .filter((p) => !p.self && p.lastHeardMs != null)
      .sort((a, b) => b.lastHeardMs - a.lastHeardMs)[0];
    foot.textContent = oldest ? heard(oldest.lastHeardMs) : "";
    Object.assign(foot.style, {
      margin: "0.35rem 0 0",
      color: "var(--ink-press-quiet)",
      lineHeight: "1.25",
      display: foot.textContent ? "block" : "none",
    });
    sheet.appendChild(foot);

    // IDENTITY LOSS (I4/I5): one plain sentence, in the sheet, never a dialog.
    if (o.lost) {
      const lost = document.createElement("p");
      lost.className = "plr-lost";
      lost.textContent = o.lost;
      Object.assign(lost.style, {
        margin: "0.35rem 0 0",
        color: "var(--ink-press-quiet)",
        lineHeight: "1.25",
      });
      sheet.appendChild(lost);
    }

    wrap.appendChild(sheet);
    document.body.appendChild(wrap);

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = sheet.style.display === "none";
      sheet.style.display = open ? "block" : "none";
      btn.setAttribute("aria-expanded", String(open));
    });
    return true;
  }

  const unmount = () => document.getElementById("plr-self")?.remove();

  window.__plrSelf = { mount, unmount, inkFor, stateLine, heard };
})();
