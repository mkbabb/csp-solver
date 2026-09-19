/**
 * CTRL-FACE pass 3 RESEARCH — three things pass 2 argued instead of measuring.
 *
 *   A. LAW 14 ON A POINTER THAT CAN HOVER. `r3-card.mjs` read the tab heads at 390×844 with
 *      `hasTouch`, where `(hover: hover)` resolves FALSE and no head moves — the rule doing its
 *      job on a thumb, not the rule under test. The estate's own comment
 *      (GameControlPanel.vue:2437-2449) names 820×1000 as the mobile arm on a hoverable
 *      pointer. Read there: every affordance the OPEN head and the SHUT head take, at rest and
 *      hovered, and again with pass 2's two edits applied in-page (`.is-active` underline
 *      deleted, the lift fenced to `[aria-expanded="false"]`).
 *   B. THE OVERRUN'S BASIS UNDER A PROPORTIONAL FACE. At HEAD the mark is `${len+1}ch` on a
 *      MONOSPACE face, so mark ÷ advance is exactly (n+1)/n — arithmetic, not a measurement.
 *      Re-read under Patrick Hand at 20px (what this family proposes), where `ch` is the
 *      advance of `0` and the word's advance is its own: only there can the ratio move.
 *   C. THE DECK'S TWO PINS. `StagingBand.vue:291` (`.staging-axis :deep(.ctrl-btn){font-size:1rem}`)
 *      and `:315-317` (`.staging-axis-label` pins face AND `--type-small`) are the whole reason
 *      a `--type-option` / `--type-group-title` re-cut cannot reach the gallery. Ablate each pin
 *      under the re-cut and read what moves — the number a gate would name.
 *
 *   BASE=… OUT=… node r3-pins.mjs
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const OUT = process.env.OUT || "/tmp/r3-pins.jsonl";
const rows = [];

const RECUT =
  ":root{--type-group-title:var(--type-heading)!important;--type-option:1.25rem!important;}";

function headState() {
  return Array.from(document.querySelectorAll(".mobile-heading-btn")).map((b) => {
    const h = b.querySelector(".section-heading");
    const cs = getComputedStyle(h);
    const bcs = getComputedStyle(b);
    return {
      text: h.innerText.trim(),
      expanded: b.getAttribute("aria-expanded"),
      ariaDisabled: b.getAttribute("aria-disabled"),
      color: cs.color,
      decoration: cs.textDecorationLine,
      thickness: cs.textDecorationThickness,
      offset: cs.textUnderlineOffset,
      bg: bcs.backgroundColor,
      transform: bcs.transform,
      opacity: bcs.opacity,
      outline: cs.outline,
    };
  });
}

function chipBasis() {
  const card = document.querySelector(".controls-card");
  const out = [];
  for (const b of card.querySelectorAll(".ctrl-btn")) {
    const r = b.getBoundingClientRect();
    if (r.width === 0) continue; // a chip behind a shut tab measures nothing
    const cs = getComputedStyle(b);
    const cv = document.createElement("canvas").getContext("2d");
    cv.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const t = b.innerText.replace(/\s+/g, " ").trim();
    const m = cv.measureText(t);
    const zero = cv.measureText("0").width;
    const bs = cs.backgroundSize;
    let markW = null;
    const first = bs.split(" ")[0];
    const contentW = r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    if (first.endsWith("%")) markW = (parseFloat(first) / 100) * contentW;
    else if (first.endsWith("px")) markW = parseFloat(first);
    const ink = (m.actualBoundingBoxLeft ?? 0) + (m.actualBoundingBoxRight ?? 0);
    return_row: out.push({
      text: t,
      pressed: b.getAttribute("aria-pressed"),
      face: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px: +parseFloat(cs.fontSize).toFixed(2),
      weight: cs.fontWeight,
      transform: cs.textTransform,
      chars: t.length,
      chPx: +zero.toFixed(3),
      declaredCh: cs.getPropertyValue("--scribble-width").trim() || cs.getPropertyValue("--ghost-width").trim(),
      markW: markW === null ? null : +markW.toFixed(3),
      contentW: +contentW.toFixed(3),
      advance: +m.width.toFixed(3),
      glyphInk: +ink.toFixed(3),
      overrun_box: markW ? +(markW / contentW).toFixed(4) : null,
      overrun_advance: markW ? +(markW / m.width).toFixed(4) : null,
      overrun_glyphink: markW ? +(markW / ink).toFixed(4) : null,
      boxW: +r.width.toFixed(2),
      boxH: +r.height.toFixed(2),
    });
  }
  return out;
}

function deckRead() {
  const labels = Array.from(document.querySelectorAll(".staging-axis-label")).map((el) => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      text: el.innerText.trim(),
      face: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px: +parseFloat(cs.fontSize).toFixed(2),
      weight: cs.fontWeight,
      transform: cs.textTransform,
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      y: +r.top.toFixed(2),
    };
  });
  const chips = Array.from(document.querySelectorAll(".staging-axis .ctrl-btn")).map((b) => {
    const cs = getComputedStyle(b);
    const r = b.getBoundingClientRect();
    return {
      text: b.innerText.trim(),
      pressed: b.getAttribute("aria-pressed"),
      face: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      px: +parseFloat(cs.fontSize).toFixed(2),
      weight: cs.fontWeight,
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      y: +r.top.toFixed(2),
    };
  });
  const band = document.querySelector(".staging-axis")?.closest("section,div");
  const first = document.querySelector(".game-card, .staging-card");
  return {
    labels,
    chips,
    bandH: band ? +band.getBoundingClientRect().height.toFixed(2) : null,
    firstCardY: first ? +first.getBoundingClientRect().top.toFixed(2) : null,
    docH: +document.documentElement.scrollHeight.toFixed(2),
  };
}

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();

  // ── A + B: the card, at a <1024 cell WITH a hoverable pointer ───────────────────────────
  {
    const ctx = await b.newContext({
      viewport: { width: 820, height: 1000 },
      colorScheme: "light",
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await p.waitForSelector(".controls-card", { state: "attached", timeout: 60000 });
    await p.waitForTimeout(1400);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await p.locator(".drawer-tab").click({ force: true });
      await p.waitForTimeout(950);
    }
    const hoverable = await p.evaluate(() => matchMedia("(hover: hover)").matches);
    const heads = p.locator(".mobile-heading-btn");
    const n = await heads.count();

    const sample = async (label, css) => {
      let handle = null;
      if (css)
        handle = await p.evaluate((c) => {
          const st = document.createElement("style");
          st.id = "r3-arm";
          st.textContent = c;
          document.head.appendChild(st);
          return true;
        }, css);
      const rest = await p.evaluate(headState);
      const hov = [];
      for (let i = 0; i < n; i++) {
        await heads.nth(i).hover({ force: true });
        await p.waitForTimeout(260);
        hov.push((await p.evaluate(headState))[i]);
      }
      await p.mouse.move(2, 2);
      await p.waitForTimeout(200);
      if (css) await p.evaluate(() => document.getElementById("r3-arm")?.remove());
      return {
        arm: label,
        rest,
        hovered: hov,
        moved: rest.map((r, i) => ({
          text: r.text,
          expanded: r.expanded,
          keys: Object.keys(r).filter(
            (k) => !["text", "expanded", "ariaDisabled"].includes(k) && r[k] !== hov[i][k],
          ),
        })),
      };
    };

    const law14 = {
      cell: "820x1000",
      hoverable,
      heads: n,
      head: await sample("HEAD", null),
      pass2: await sample(
        "pass2 (underline deleted + lift fenced to shut)",
        ".mobile-heading-btn .section-heading.is-active{text-decoration:none!important;}" +
          "@media (hover:hover){.mobile-heading-btn:hover .section-heading{color:inherit!important;}" +
          '.mobile-heading-btn[aria-expanded="false"]:hover .section-heading{color:var(--color-foreground)!important;}}',
      ),
    };

    const chipHead = await p.evaluate(chipBasis);
    const chipHand = await p.evaluate(
      (css) => {
        const st = document.createElement("style");
        st.textContent = css;
        document.head.appendChild(st);
        void document.body.offsetHeight;
        const r = (() => {
          const fn = window.__chipBasis;
          return fn();
        })();
        st.remove();
        return r;
      },
      ".tray-well :deep(.ctrl-btn), .tray-well .ctrl-btn{font-family:var(--font-hand)!important;" +
        "font-weight:400!important;text-transform:lowercase!important;font-size:1.25rem!important;}",
    ).catch(() => null);

    rows.push({ eng, kind: "card-820", law14, chipHead });
    console.log(
      `${eng} 820x1000 hoverable=${hoverable} heads=${n}\n` +
        `  HEAD  moved: ${JSON.stringify(law14.head.moved)}\n` +
        `  pass2 moved: ${JSON.stringify(law14.pass2.moved)}`,
    );
    await ctx.close();
  }

  // ── B (proper): the chip basis under the hand, by re-facing in page ─────────────────────
  {
    const ctx = await b.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: eng === "chromium",
      deviceScaleFactor: 3,
      colorScheme: "light",
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await p.waitForSelector(".controls-card", { state: "attached", timeout: 60000 });
    await p.waitForTimeout(1400);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await p.locator(".drawer-tab").click({ force: true });
      await p.waitForTimeout(950);
    }
    await p.addScriptTag({ content: `window.__chipBasis = ${chipBasis.toString()}` });
    const head = await p.evaluate(() => window.__chipBasis());
    const hand = await p.evaluate(() => {
      const st = document.createElement("style");
      st.textContent =
        ".controls-card .ctrl-btn{font-family:var(--font-hand)!important;font-weight:400!important;" +
        "text-transform:lowercase!important;font-size:1.25rem!important;}";
      document.head.appendChild(st);
      void document.body.offsetHeight;
      const r = window.__chipBasis();
      st.remove();
      return r;
    });
    rows.push({ eng, kind: "chip-basis", head, hand });
    const f = (a) =>
      a
        .map((c) => `${c.text}:${c.face.slice(0, 4)}/adv${c.advance}/ink${c.glyphInk}/OA${c.overrun_advance}/OI${c.overrun_glyphink}`)
        .join("  ");
    console.log(`${eng} CHIP HEAD ${f(head)}`);
    console.log(`${eng} CHIP HAND ${f(hand)}`);
    await ctx.close();
  }

  // ── C: the deck's two pins under the re-cut ────────────────────────────────────────────
  {
    const ctx = await b.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: eng === "chromium",
      deviceScaleFactor: 3,
      colorScheme: "light",
    });
    const p = await ctx.newPage();
    await p.goto(BASE + "?view=gallery&size=3&difficulty=MEDIUM", {
      waitUntil: "domcontentloaded",
    });
    await p.waitForSelector(".staging-axis", { timeout: 60000 });
    await p.waitForTimeout(1100);
    const arm = async (label, css) =>
      p.evaluate(
        ([l, c]) => {
          let st = null;
          if (c) {
            st = document.createElement("style");
            st.textContent = c;
            document.head.appendChild(st);
            void document.body.offsetHeight;
          }
          const r = window.__deckRead();
          if (st) st.remove();
          return { arm: l, ...r };
        },
        [label, css],
      );
    await p.addScriptTag({ content: `window.__deckRead = ${deckRead.toString()}` });
    const arms = [];
    arms.push(await arm("shipped", null));
    arms.push(await arm("recut only", RECUT));
    arms.push(
      await arm(
        "recut + chip pin removed",
        RECUT + ".staging-axis .ctrl-btn{font-size:var(--type-option)!important;}",
      ),
    );
    arms.push(
      await arm(
        "recut + label pin removed",
        RECUT +
          ".staging-axis-label{font-size:var(--type-group-title)!important;font-family:var(--font-display)!important;}",
      ),
    );
    arms.push(
      await arm(
        "recut + BOTH pins removed",
        RECUT +
          ".staging-axis .ctrl-btn{font-size:var(--type-option)!important;}" +
          ".staging-axis-label{font-size:var(--type-group-title)!important;font-family:var(--font-display)!important;}",
      ),
    );
    rows.push({ eng, kind: "deck-pins", arms });
    for (const a of arms)
      console.log(
        `${eng} DECK ${a.arm}: labels=${a.labels
          .map((l) => `${l.text}/${l.face.slice(0, 4)}/${l.px}/${l.weight}`)
          .join(",")} chipPx=${[...new Set(a.chips.map((c) => c.px))].join("/")} ` +
          `bandH=${a.bandH} firstCardY=${a.firstCardY} docH=${a.docH} bold=${a.chips
            .filter((c) => +c.weight >= 700)
            .map((c) => c.text)
            .join(",")}`,
      );
    await ctx.close();
  }

  await b.close();
}
writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log("wrote", OUT, rows.length);
