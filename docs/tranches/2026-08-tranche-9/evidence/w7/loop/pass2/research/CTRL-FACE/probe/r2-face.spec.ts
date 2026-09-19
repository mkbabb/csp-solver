import { test, expect, type Page } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/@playwright/test/index.js";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * CTRL-FACE pass-2 RESEARCH probe. Read-only on product files; every arm below is an
 * IN-PAGE ablation over the pass-1 prototype worktree (`wf_e58b4764-0fc-34`, the face law
 * as built), served at 127.0.0.1:4234 with a private vite cacheDir.
 *
 * Four questions, each a number a synthesizer can spend:
 *   A  the `lh` unit — is it live in both engines, and does `1lh` equal the USED leading?
 *   B  the gallery (`.washi-tag` is StagingBand's class too) — what does a SCOPED face
 *      restore, exactly, against an in-page HEAD control?
 *   C  the iPad seal's price menu — what does each candidate cost at 1280×800 coarse?
 *   D  the INK gate — the caption lane's descender depth, from font metrics, not pixels.
 */

const OUT = resolve(process.env.CTRL_FACE_OUT || "readings");
mkdirSync(OUT, { recursive: true });
const bank = (name: string, data: unknown) =>
  writeFileSync(resolve(OUT, name), JSON.stringify(data, null, 2) + "\n");

/* HEAD's `.washi-tag` declarations, verbatim from SheetWashiLabel.vue:164-181 at aab67b92. */
const HEAD_TAG = `.washi-tag{font-family:var(--font-hand)!important;font-size:var(--type-tag)!important;font-weight:500!important;line-height:1.5!important;margin-top:calc(-1.5em - 0.04rem - var(--washi-tag-lift, 0px))!important;}`;

/* The printed face, scoped to the CONTROLS' tapes only (the estate's own idiom: the
   GameControlPanel already reaches the tape at `.tray-well :deep(.washi-tag)`, :1523). */
const SCOPED_VAR = `.tray-well .washi-tag{font-family:var(--face-printed)!important;font-size:var(--type-group-title)!important;font-weight:var(--printed-weight)!important;line-height:var(--washi-tag-lh,1.5)!important;margin-top:calc(-1em * var(--washi-tag-lh, 1.5) - 0.04rem - var(--washi-tag-lift, 0px))!important;}`;

/* The same, with the pull DERIVED from the used leading (`lh`) instead of a variable. */
const SCOPED_LH = `.tray-well .washi-tag{font-family:var(--face-printed)!important;font-size:var(--type-group-title)!important;font-weight:var(--printed-weight)!important;line-height:var(--type-leading-heading)!important;margin-top:calc(-1lh - 0.04rem - var(--washi-tag-lift, 0px))!important;}`;

/* The pull derived from the used leading, applied GLOBALLY — the one-line repair that needs
   no consumer to set anything. Face untouched (still the built printed face everywhere). */
const GLOBAL_LH_PULL = `.washi-tag{margin-top:calc(-1lh - 0.04rem - var(--washi-tag-lift, 0px))!important;}`;

async function loadBoard(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES — settle before a box is read
  }
}

async function loadGallery(page: Page) {
  await page.goto("./?view=gallery");
  await page.waitForSelector(".staging-band .washi-tag", { timeout: 30000 });
  await page.waitForTimeout(1200);
}

const TAG_READ = `(sel) => {
  const t = document.querySelector(sel);
  if (!t) return null;
  const cs = getComputedStyle(t);
  const r = t.getBoundingClientRect();
  const n = (v) => +parseFloat(v).toFixed(2);
  return {
    text: t.textContent.trim(),
    family: cs.fontFamily.split(',')[0].replace(/["']/g,'').trim(),
    size: n(cs.fontSize), weight: cs.fontWeight, lineHeight: n(cs.lineHeight),
    marginTop: n(cs.marginTop), marginBottom: n(cs.marginBottom),
    offsetHeight: +t.offsetHeight.toFixed(2),
    netFlow: +(n(cs.marginTop) + t.offsetHeight + n(cs.marginBottom)).toFixed(2),
    paintW: +r.width.toFixed(2), paintH: +r.height.toFixed(2),
  };
}`;

/* ══ A · the `lh` unit ══════════════════════════════════════════════════════════ */
test("A — the lh unit is live and equals the used leading", async ({ page }, info) => {
  await page.goto("./");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  const r = await page.evaluate(() => {
    const supports = {
      lh: CSS.supports("margin-top", "calc(-1lh)"),
      rlh: CSS.supports("margin-top", "calc(-1rlh)"),
      has: CSS.supports("selector(:has(a))"),
    };
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;font-size:25.888px;line-height:1.2;";
    document.body.appendChild(probe);
    const one = document.createElement("div");
    one.style.cssText = "height:1lh;";
    probe.appendChild(one);
    const a = { leading: 1.2, usedLh: +getComputedStyle(probe).lineHeight.replace("px", ""), oneLh: one.getBoundingClientRect().height };
    probe.style.lineHeight = "1.5";
    const b = { leading: 1.5, usedLh: +getComputedStyle(probe).lineHeight.replace("px", ""), oneLh: one.getBoundingClientRect().height };
    probe.style.lineHeight = "normal"; // the case a variable CANNOT express
    const c = { leading: "normal", usedLh: +getComputedStyle(probe).lineHeight.replace("px", ""), oneLh: one.getBoundingClientRect().height };
    probe.remove();
    return { supports, arms: [a, b, c] };
  });
  bank(`A-lh-unit-${info.project.name}.json`, r);
  console.log("A", info.project.name, JSON.stringify(r));
  expect(r.supports.lh).toBe(true);
});

/* ══ B · the gallery, four arms ═════════════════════════════════════════════════ */
for (const cell of [
  { name: "gallery-1280x800", w: 1280, h: 800, mobile: false },
  { name: "gallery-390x844", w: 390, h: 844, mobile: true },
]) {
  test(`B — gallery pi at ${cell.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile,
      baseURL: info.project.use.baseURL,
    });
    const page = await ctx.newPage();
    const out: Record<string, unknown> = { cell: cell.name, engine: info.project.name };
    try {
      await loadGallery(page);
      const read = async () => ({
        tape: await page.evaluate((sel: string) => {
          const t = document.querySelector(sel) as HTMLElement | null;
          if (!t) return null;
          const cs = getComputedStyle(t);
          const r = t.getBoundingClientRect();
          const n = (v: string) => +parseFloat(v).toFixed(2);
          return {
            text: t.textContent!.trim(),
            family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
            size: n(cs.fontSize),
            weight: cs.fontWeight,
            lineHeight: n(cs.lineHeight),
            marginTop: n(cs.marginTop),
            marginBottom: n(cs.marginBottom),
            offsetHeight: +t.offsetHeight.toFixed(2),
            netFlow: +(n(cs.marginTop) + t.offsetHeight + n(cs.marginBottom)).toFixed(2),
            paintW: +r.width.toFixed(2),
            paintH: +r.height.toFixed(2),
          };
        }, ".staging-band .washi-tag"),
        band: await page.evaluate(() => {
          const b = document.querySelector(".staging-band")?.getBoundingClientRect();
          return b ? { y: +b.y.toFixed(2), h: +b.height.toFixed(2) } : null;
        }),
        card0: await page.evaluate(() => {
          const c = document.querySelector("#gallery-card-0")?.getBoundingClientRect();
          return c ? { y: +c.y.toFixed(2), h: +c.height.toFixed(2) } : null;
        }),
        axisLabel: await page.evaluate(() => {
          const l = document.querySelector(".staging-axis-label");
          if (!l) return null;
          const cs = getComputedStyle(l);
          return {
            family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
            size: +parseFloat(cs.fontSize).toFixed(2),
            weight: cs.fontWeight,
            color: cs.color,
          };
        }),
      });
      out.built = await read();
      const add = async (css: string) => {
        await page.addStyleTag({ content: css });
        await page.waitForTimeout(220);
      };
      // ARM 2 — HEAD's declarations restored in-page: the control.
      await add(HEAD_TAG);
      out.headControl = await read();
      // ARM 3 — the printed face scoped to `.tray-well` (absent on this surface).
      await add(SCOPED_VAR);
      out.scopedVar = await read();
      // ARM 4 — the same scope with an `lh`-derived pull.
      await add(SCOPED_LH);
      out.scopedLh = await read();
      // ARM 5 — built face everywhere + the GLOBAL lh-derived pull (no variable at all).
      await page.evaluate(() => document.querySelectorAll("style[data-r2]").forEach((s) => s.remove()));
      await page.reload();
      await page.waitForSelector(".staging-band .washi-tag", { timeout: 30000 });
      await page.waitForTimeout(1200);
      await add(GLOBAL_LH_PULL);
      out.builtPlusGlobalLhPull = await read();
    } finally {
      bank(`B-gallery-${cell.name}-${info.project.name}.json`, out);
      console.log("B", cell.name, info.project.name, JSON.stringify(out));
      await ctx.close();
    }
  });
}

/* ══ C · the controls side of the same scope, + the iPad price menu ═════════════ */
const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true },
  { name: "ipad-1280x800", w: 1280, h: 800, mobile: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false },
];

for (const cell of CELLS) {
  test(`C — controls at ${cell.name}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile,
      baseURL: info.project.use.baseURL,
    });
    const page = await ctx.newPage();
    const out: Record<string, unknown> = { cell: cell.name, engine: info.project.name };
    try {
      await loadBoard(page);
      const panelH = () =>
        page.evaluate(() => {
          const p = document.querySelector(".controls-card .control-panel-wrap");
          const c = document.querySelector(".controls-card");
          return {
            panel: p ? +p.getBoundingClientRect().height.toFixed(2) : null,
            cardScroll: c ? +(c as HTMLElement).scrollHeight.toFixed(2) : null,
          };
        });
      const tapes = () =>
        page.evaluate(() =>
          Array.from(document.querySelectorAll(".tray-well > .washi-tag")).map((t) => {
            const cs = getComputedStyle(t);
            const n = (v: string) => +parseFloat(v).toFixed(2);
            return {
              text: (t as HTMLElement).textContent!.trim(),
              family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
              size: n(cs.fontSize),
              weight: cs.fontWeight,
              lineHeight: n(cs.lineHeight),
              netFlow: +(n(cs.marginTop) + (t as HTMLElement).offsetHeight + n(cs.marginBottom)).toFixed(2),
            };
          }),
        );
      const chips = () =>
        page.evaluate(() =>
          Array.from(document.querySelectorAll(".ctrl-btn")).slice(0, 6).map((b) => {
            const r = b.getBoundingClientRect();
            const cs = getComputedStyle(b);
            return {
              text: (b as HTMLElement).innerText.trim().slice(0, 8),
              w: +r.width.toFixed(2),
              h: +r.height.toFixed(2),
              size: +parseFloat(cs.fontSize).toFixed(2),
            };
          }),
        );
      out.built = { ...(await panelH()), tapes: await tapes(), chips: await chips() };

      const add = async (css: string) => {
        await page.addStyleTag({ content: css });
        await page.waitForTimeout(200);
      };
      // The scoped arms must leave the CONTROLS exactly as built.
      await add(HEAD_TAG);
      out.headTagOnly = { ...(await panelH()), tapes: await tapes() };
      await add(SCOPED_VAR);
      out.scopedVar = { ...(await panelH()), tapes: await tapes() };
      await add(SCOPED_LH);
      out.scopedLh = { ...(await panelH()), tapes: await tapes() };

      if (cell.name === "ipad-1280x800") {
        // THE PRICE MENU. Each arm is measured from the SAME built page, cumulative-free:
        // reload between arms so nothing stacks.
        const menu: Record<string, unknown> = {};
        const arms: [string, string][] = [
          ["as-built", ""],
          ["firstWell-0.35rem", `.tray-well:first-child{margin-top:0.35rem!important}`],
          ["firstWell-0.5rem", `.tray-well:first-child{margin-top:0.5rem!important}`],
          ["firstWell-1.2rem", `.tray-well:first-child{margin-top:1.2rem!important}`],
          ["captions-hand-rung", `.zone-row-label{font-size:var(--type-tag)!important}`],
          ["captions-small-rung", `.zone-row-label{font-size:var(--type-small)!important}`],
          ["captions-subheading", `.zone-row-label{font-size:var(--type-subheading)!important}`],
          ["captions-hand-face", `.zone-row-label{font-family:var(--font-hand)!important;font-size:var(--type-tag)!important}`],
          [
            "captions-printed-1lh",
            `.zone-row-label{line-height:1!important}`,
          ],
          [
            "captions-lane-own-line",
            `.zone-row-label{flex:0 0 100%!important;text-align:left!important}`,
          ],
          [
            "firstWell-1.2 + captions-small",
            `.tray-well:first-child{margin-top:1.2rem!important}.zone-row-label{font-size:var(--type-small)!important}`,
          ],
          [
            "firstWell-0.5 + captions-hand-rung",
            `.tray-well:first-child{margin-top:0.5rem!important}.zone-row-label{font-size:var(--type-tag)!important}`,
          ],
        ];
        for (const [name, css] of arms) {
          await page.reload();
          await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
          await page.waitForTimeout(1200);
          if (css) await add(css);
          menu[name] = {
            ...(await panelH()),
            firstTapeGapY: await page.evaluate(() => {
              const t = document.querySelector(".tray-well > .washi-tag");
              const head = document.querySelector(".mobile-heading-btn, .section-heading");
              if (!t || !head) return null;
              const a = t.getBoundingClientRect();
              const b = head.getBoundingClientRect();
              return +(b.top - a.bottom).toFixed(2);
            }),
            captionBox: await page.evaluate(() => {
              const l = document.querySelector(".zone-row-label");
              if (!l) return null;
              const r = l.getBoundingClientRect();
              const cs = getComputedStyle(l);
              return {
                w: +r.width.toFixed(2),
                h: +r.height.toFixed(2),
                size: +parseFloat(cs.fontSize).toFixed(2),
                lh: +parseFloat(cs.lineHeight).toFixed(2),
              };
            }),
          };
        }
        out.priceMenu = menu;
        out.SEAL = 1227.5;
      }
    } finally {
      bank(`C-controls-${cell.name}-${info.project.name}.json`, out);
      console.log("C", cell.name, info.project.name, JSON.stringify(out));
      await ctx.close();
    }
  });
}

/* ══ D · the INK gate: descender depth from font metrics ════════════════════════ */
test("D — the caption lane's ink, measured from font metrics", async ({ browser }, info) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    baseURL: info.project.use.baseURL,
  });
  const page = await ctx.newPage();
  try {
    await loadBoard(page);
    const r = await page.evaluate(() => {
      const cv = document.createElement("canvas");
      const g = cv.getContext("2d")!;
      const out: Record<string, unknown> = {};
      const measure = (el: Element, probe: string) => {
        const cs = getComputedStyle(el);
        g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} / ${cs.lineHeight} ${cs.fontFamily}`;
        const own = g.measureText((el as HTMLElement).textContent!.trim());
        const worst = g.measureText(probe);
        const r = el.getBoundingClientRect();
        const fs = parseFloat(cs.fontSize);
        const lh = parseFloat(cs.lineHeight) || fs * 1.2;
        return {
          font: g.font,
          fontSize: +fs.toFixed(2),
          usedLh: +lh.toFixed(2),
          halfLeading: +((lh - (own.fontBoundingBoxAscent + own.fontBoundingBoxDescent)) / 2).toFixed(2),
          ownDescent: +own.actualBoundingBoxDescent.toFixed(2),
          worstDescent: +worst.actualBoundingBoxDescent.toFixed(2),
          fontDescent: +own.fontBoundingBoxDescent.toFixed(2),
          boxBottom: +r.bottom.toFixed(2),
          // the ink's own bottom edge = baseline + descent; baseline = box top + halfLeading + ascent
          inkBottom: +(
            r.top +
            (lh - (own.fontBoundingBoxAscent + own.fontBoundingBoxDescent)) / 2 +
            own.fontBoundingBoxAscent +
            own.actualBoundingBoxDescent
          ).toFixed(2),
        };
      };
      const caps = Array.from(document.querySelectorAll(".zone-row-label"));
      out.captions = caps.map((c) => ({ text: c.textContent!.trim(), ...measure(c, "pgjqy") }));
      const tapes = Array.from(document.querySelectorAll(".tray-well > .washi-tag"));
      out.tapes = tapes.map((t) => {
        const r = t.getBoundingClientRect();
        return { text: t.textContent!.trim(), top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), ...measure(t, "pgjqy") };
      });
      // every tape × every caption: paper-top minus ink-bottom (the CLEARANCE the gate holds)
      out.pairs = [];
      for (const t of tapes) {
        const tr = t.getBoundingClientRect();
        for (const c of caps) {
          const m = measure(c, "pgjqy");
          const cr = c.getBoundingClientRect();
          const overlapBox =
            Math.max(0, Math.min(tr.right, cr.right) - Math.max(tr.left, cr.left)) *
            Math.max(0, Math.min(tr.bottom, cr.bottom) - Math.max(tr.top, cr.top));
          if (overlapBox <= 0) continue;
          (out.pairs as unknown[]).push({
            tape: t.textContent!.trim(),
            caption: c.textContent!.trim(),
            boxOverlapPx2: +overlapBox.toFixed(1),
            clearanceOwnInk: +(tr.top - m.inkBottom).toFixed(2),
            clearanceWorstInk: +(
              tr.top -
              (cr.top + m.halfLeading + (m.usedLh - m.halfLeading * 2 - m.fontDescent) + m.worstDescent)
            ).toFixed(2),
          });
        }
      }
      return out;
    });
    bank(`D-ink-390x844-${info.project.name}.json`, r);
    console.log("D", info.project.name, JSON.stringify(r));
  } finally {
    await ctx.close();
  }
});
