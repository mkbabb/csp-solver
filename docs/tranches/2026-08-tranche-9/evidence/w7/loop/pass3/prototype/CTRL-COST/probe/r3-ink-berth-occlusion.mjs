#!/usr/bin/env node
// T9-W7 pass 3 · CTRL-COST — THE INK, THE BERTH AND THE PIN (G9' · G21 · G22 · G16').
//
//   PAINTED CONTRAST  the asked word `sure?` and the answer `no`, in FOUR states: bare card,
//                     hovered (the accent ground the face takes at rest), armed, and ARMED AND
//                     HOVERED — which is the state the second press happens in and the state
//                     pass 2's gate could not reach. The fence is `.act-face[data-armed]`
//                     dropping the ground; without it `sure?` reads 4.693 and the gate is a
//                     gate that cannot fail.
//   THE BERTH (G22)   a note is summoned through the card's delegated listener, settled, and
//                     the tape's INK box (a Range over its text) is measured against its own
//                     LABEL box. Ink outside paper is the defect; the head's height is read in
//                     the same breath so a cure that moved the pin band would show.
//   THE PIN (G16')    `elementFromPoint` at the centre of every control in the pinned head's
//                     own band, at the dock's two scroll offsets and the desk's sweep, must
//                     never return the head. `belowExemptBand` excuses the reserved strip the
//                     fold sentinel paints — a head inside its own reserve covers paper.
//
// Usage: node r3-ink-berth-occlusion.mjs <base-url> <engine> <viewport> <theme> <out.json>
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const base = process.argv[2] ?? "http://127.0.0.1:4233";
const engine = process.argv[3] ?? "chromium";
const vp = (process.argv[4] ?? "1280x800").split("x").map(Number);
const theme = process.argv[5] ?? "light";
const out = process.argv[6] ?? "/tmp/r3.json";
const touch = vp[0] < 1024;

const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: vp[0], height: vp[1] },
  hasTouch: touch,
  deviceScaleFactor: 2,
  colorScheme: theme === "dark" ? "dark" : "light",
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
await page.goto(`${base}/`);
await page.waitForSelector(".controls-card", { timeout: 25000, state: "attached" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
if (theme === "dark")
  await page.evaluate(() => document.documentElement.classList.add("dark"));
if (touch) {
  const tab = await page.$(".drawer-tab, .drawer-handle, [aria-controls='controls-drawer']");
  if (tab) await tab.click({ force: true }).catch(() => {});
  await page.waitForTimeout(900);
}
await page.evaluate(() => {
  const free = [...document.querySelectorAll("input.cell-native-input")].find(
    (i) => !i.readOnly && !i.disabled && !i.value,
  );
  free?.focus();
});
await page.keyboard.press("5");
await page.waitForTimeout(400);

// ── The contrast reader. The GROUND is whatever actually paints under the word, walked up
//    the ancestor chain until an opaque background is found, so a transparent face reports the
//    card and not a guess.
const contrastIn = () =>
  page.evaluate(() => {
    const parse = (c) => {
      const m = /rgba?\(([^)]+)\)/.exec(c);
      if (!m) return null;
      const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
      return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
    };
    const lin = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const L = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    const over = (fg, bg) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    });
    const ground = (el) => {
      let bg = { r: 255, g: 255, b: 255, a: 1 };
      const stack = [];
      for (let n = el; n; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c && c.a > 0) stack.unshift(c);
        if (c && c.a === 1) {
          bg = c;
          break;
        }
      }
      return stack.reduce((acc, c) => over(c, acc), bg);
    };
    const ratio = (el) => {
      if (!el) return null;
      const fg = parse(getComputedStyle(el).color);
      const bg = ground(el);
      const painted = over(fg, bg);
      const a = L(painted) + 0.05;
      const b = L(bg) + 0.05;
      return {
        ink: getComputedStyle(el).color,
        ground: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
        ratio: +(Math.max(a, b) / Math.min(a, b)).toFixed(3),
      };
    };
    const asked = [...document.querySelectorAll(".deal-face .act-word.is-armed")].find(
      (e) => getComputedStyle(e).visibility === "visible",
    );
    return {
      asked: ratio(asked ?? document.querySelector(".deal-face .act-word.is-armed")),
      no: ratio(document.querySelector(".deal-face .act-answer")),
      restWord: ratio(document.querySelector(".deal-face .act-word:not(.is-armed)")),
      faceBg: getComputedStyle(document.querySelector(".deal-face")).backgroundColor,
      armed: !!document.querySelector(".deal-face[data-armed]"),
    };
  });

const verb = ".deal-face .act-verb";
await page.$eval(verb, (el) => el.scrollIntoView({ block: "center" }));
await page.waitForTimeout(250);

const states = {};
states.rest = await contrastIn();
await page.hover(verb);
await page.waitForTimeout(260);
states.restHovered = await contrastIn();
await page.mouse.move(0, 0);
await page.waitForTimeout(200);
await page.click(verb); // arm
await page.waitForTimeout(300);
states.armed = await contrastIn();
await page.hover(verb);
await page.waitForTimeout(300);
states.armedHovered = await contrastIn(); // THE STATE THE SECOND PRESS HAPPENS IN
await page.keyboard.press("Escape");
await page.mouse.move(0, 0);
await page.waitForTimeout(400);

// ── THE BERTH. Summon a note through the real listener, settle, then Range the ink.
await page.hover("[data-note='fill']").catch(() => {});
await page.waitForTimeout(450);
const berth = await page.evaluate(() => {
  const r2 = (n) => +n.toFixed(2);
  const label = [...document.querySelectorAll(".cost-band-head .washi-label")].find(
    (l) => (l.textContent ?? "").trim().length > 0 && getComputedStyle(l).opacity !== "0",
  );
  if (!label) return { found: false };
  const range = document.createRange();
  range.selectNodeContents(label);
  const ink = range.getBoundingClientRect();
  const lab = label.getBoundingClientRect();
  const cs = getComputedStyle(label);
  const head = label.closest(".cost-band-head");
  return {
    found: true,
    text: label.textContent.trim(),
    label: { w: r2(lab.width), h: r2(lab.height) },
    ink: { w: r2(ink.width), h: r2(ink.height) },
    inkTopOver: r2(lab.top - ink.top),
    inkBottomOver: r2(ink.bottom - lab.bottom),
    paddingTop: cs.paddingTop,
    paddingBottom: cs.paddingBottom,
    lineHeight: cs.lineHeight,
    headH: head ? r2(head.getBoundingClientRect().height) : null,
    overhangBelowHead: head
      ? r2(lab.bottom - head.getBoundingClientRect().bottom)
      : null,
  };
});
await page.mouse.move(0, 0);
await page.waitForTimeout(300);

// ── THE PIN. Sweep the card's scroll and ask elementFromPoint at every control's centre.
const occlusion = await page.evaluate(() => {
  const card = document.querySelector(".controls-card");
  if (!card) return { cells: [] };
  const cs = getComputedStyle(card);
  const band = parseFloat(cs.paddingTop) || 0;
  const offsets = card.scrollHeight > card.clientHeight ? [0, 58, 116, 200, 350] : [0];
  const cells = [];
  for (const off of offsets) {
    card.scrollTop = off;
    const actual = card.scrollTop;
    const cardTop = card.getBoundingClientRect().top;
    // A control INSIDE a head is not a control the head covers — the `looking` head's own
    // info button hit-tests to its own ancestor and would report as occluded forever. The
    // subject of §2.5 is a control the head lies ON TOP OF, which is a control in the band.
    const controls = [
      ...card.querySelectorAll("button, input, [role='button'], .option-chip"),
    ].filter(
      (c) => c.getBoundingClientRect().width > 0 && !c.closest(".cost-band-head"),
    );
    let covered = 0;
    let exempt = 0;
    const who = [];
    for (const c of controls) {
      const r = c.getBoundingClientRect();
      const cx = r.x + r.width / 2;
      const cy = r.y + r.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      const byHead = hit?.closest?.(".cost-band-head");
      // `belowExemptBand` — the pin band is the strip the fold sentinel paints solid card over.
      // A head INSIDE its own reserve covers paper; only a head reaching past it covers control.
      const belowExemptBand = cy > cardTop + band;
      if (byHead && belowExemptBand) {
        covered += 1;
        who.push({
          control: c.className,
          cy: +cy.toFixed(2),
          exemptLine: +(cardTop + band).toFixed(2),
          head: byHead.textContent?.trim().slice(0, 24),
        });
      } else if (byHead) exempt += 1;
    }
    cells.push({ offset: off, actual, controls: controls.length, covered, exempt, who });
  }
  card.scrollTop = 0;
  return { band: +band.toFixed(2), cells };
});

const res = { engine, viewport: `${vp[0]}x${vp[1]}`, theme, base, states, berth, occlusion };
writeFileSync(out, JSON.stringify(res, null, 2));
console.log(
  `${engine} ${vp[0]}x${vp[1]} ${theme}  ` +
    `asked rest/armed/armed+hover ${states.rest.asked?.ratio}/${states.armed.asked?.ratio}/${states.armedHovered.asked?.ratio}  ` +
    `armedFaceBg ${states.armedHovered.faceBg}  no ${states.armedHovered.no?.ratio}  ` +
    `berth ink over top ${berth.inkTopOver} bot ${berth.inkBottomOver} head ${berth.headH}  ` +
    `occlusion ${occlusion.cells.map((c) => `${c.offset}:${c.covered}/${c.controls}`).join(" ")}`,
);
await browser.close();
