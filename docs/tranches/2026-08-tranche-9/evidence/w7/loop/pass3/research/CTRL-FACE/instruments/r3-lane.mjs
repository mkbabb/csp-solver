/**
 * CTRL-FACE pass 3 RESEARCH — THE CAPTION LANE, measured properly.
 *
 * `r3-card.mjs` counted the caption's lines with `el.getClientRects().length`, which is WRONG
 * for `.zone-row-label`: it is a flex item of `.zone-row` and therefore BLOCKIFIED, so it
 * returns exactly one rect however many line boxes it holds. This probe counts line boxes the
 * only way that survives blockification — `Range.selectNodeContents(el).getClientRects()`, one
 * rect per line box of TEXT — and cross-checks against `height / line-height`.
 *
 * The subject is the fold's own word. `74a2b5d9` renamed the second caption
 * `candidates` → `what fits` (GameControlPanel.vue:987). `candidates` is ONE unbreakable word,
 * so its min-content width forced the lane open and the lane could not wrap. `what fits` has a
 * SPACE: its min-content is the longer of `what` / `fits`, the lane is free to sit at its
 * 3.75rem basis, and the caption can take a second line silently. Read at the rung it ships
 * with AND at the printed rung CTRL-FACE proposes, at five widths, both engines.
 *
 *   BASE=… OUT=… node r3-lane.mjs
 */
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { writeFileSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const OUT = process.env.OUT || "/tmp/r3-lane.jsonl";
const CELLS = (process.env.CELLS || "320x568,360x740,375x812,390x844,430x932,900x500,1280x800")
  .split(",")
  .map((n) => {
    const [w, h] = n.split("x").map(Number);
    return { name: n, w, h, mobile: w < 1024 };
  });

const rows = [];

function readLanes() {
  const card = document.querySelector(".controls-card");
  if (!card) return { error: "no card" };
  const nowrap = (el, text) => {
    const cs = getComputedStyle(el);
    const p = document.createElement("span");
    p.style.cssText =
      `position:absolute;visibility:hidden;white-space:pre;left:-9999px;top:0;` +
      `font-family:${cs.fontFamily};font-size:${cs.fontSize};font-weight:${cs.fontWeight};` +
      `letter-spacing:${cs.letterSpacing};text-transform:${cs.textTransform};`;
    p.textContent = text;
    document.body.appendChild(p);
    const w = +p.getBoundingClientRect().width.toFixed(2);
    p.remove();
    return w;
  };
  const read = () =>
    Array.from(card.querySelectorAll(".zone-row-label")).map((el) => {
      const cs = getComputedStyle(el);
      const row = el.closest(".zone-row");
      const opts = row?.querySelector(".options-row");
      const t = el.innerText.replace(/\s+/g, " ").trim();
      const words = t.split(" ");
      const longest = words.reduce((a, w) => (w.length > a.length ? w : a), "");
      const rg = document.createRange();
      rg.selectNodeContents(el);
      const lineRects = Array.from(rg.getClientRects()).filter((r) => r.height > 0);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      const box = el.getBoundingClientRect();
      return {
        text: t,
        words: words.length,
        face: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
        px: +parseFloat(cs.fontSize).toFixed(3),
        weight: cs.fontWeight,
        transform: cs.textTransform,
        lineBoxes: lineRects.length,
        linesByHeight: +(box.height / lh).toFixed(2),
        boxW: +box.width.toFixed(2),
        boxH: +box.height.toFixed(2),
        flexBasis: cs.flexBasis,
        minContent: nowrap(el, longest),
        wholeWidth: nowrap(el, t),
        rowW: row ? +row.getBoundingClientRect().width.toFixed(2) : null,
        rowWrap: row ? getComputedStyle(row).flexWrap : null,
        rowLines: row
          ? +(
              row.getBoundingClientRect().height /
              Math.max(
                ...Array.from(row.children).map((c) => c.getBoundingClientRect().height),
              )
            ).toFixed(2)
          : null,
        rowH: row ? +row.getBoundingClientRect().height.toFixed(2) : null,
        optsW: opts ? +opts.getBoundingClientRect().width.toFixed(2) : null,
        optsMinContent: opts
          ? (() => {
              const before = opts.style.width;
              opts.style.width = "min-content";
              const w = +opts.getBoundingClientRect().width.toFixed(2);
              opts.style.width = before;
              return w;
            })()
          : null,
        stacked: !!row?.classList.contains("zone-row-stacked"),
      };
    });

  const cardH = () => +card.scrollHeight.toFixed(2);
  const shipped = read();
  const shippedCardH = cardH();

  const arms = {};
  const apply = (name, css) => {
    const st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
    void card.offsetHeight;
    arms[name] = { lanes: read(), cardH: cardH() };
    st.remove();
    void card.offsetHeight;
  };
  // the rung CTRL-FACE proposes, with the caption's own leading
  apply(
    "printed-1.2",
    ".zone-row-label{font-family:var(--font-display)!important;font-size:var(--type-heading)!important;" +
      "font-weight:800!important;text-transform:lowercase!important;line-height:var(--type-leading-heading)!important;}",
  );
  // the same, with the fold's word forced back to the pass-2 subject
  apply(
    "printed-candidates",
    ".zone-row-label{font-family:var(--font-display)!important;font-size:var(--type-heading)!important;" +
      "font-weight:800!important;text-transform:lowercase!important;line-height:var(--type-leading-heading)!important;}",
  );
  // the lane held to its basis with NO automatic minimum — what a `min-width:0` would do
  apply(
    "printed-minwidth0",
    ".zone-row-label{font-family:var(--font-display)!important;font-size:var(--type-heading)!important;" +
      "font-weight:800!important;text-transform:lowercase!important;line-height:var(--type-leading-heading)!important;" +
      "min-width:0!important;}",
  );
  // the caption told never to wrap
  apply(
    "printed-nowrap",
    ".zone-row-label{font-family:var(--font-display)!important;font-size:var(--type-heading)!important;" +
      "font-weight:800!important;text-transform:lowercase!important;line-height:var(--type-leading-heading)!important;" +
      "white-space:nowrap!important;}",
  );
  // the row forbidden to wrap (the flex-wrap:wrap risk the critique named)
  apply("row-nowrap", ".zone-row{flex-wrap:nowrap!important;}");

  return { shipped, shippedCardH, arms };
}

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await L.launch();
  for (const cell of CELLS) {
    const ctx = await b.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && eng === "chromium",
      deviceScaleFactor: cell.mobile ? 3 : 1,
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
    // the pencils compartment is behind a tab on the phone: open it
    const tabs = p.locator(".mobile-heading-btn");
    if ((await tabs.count()) > 0) {
      for (let i = 0; i < (await tabs.count()); i++) {
        const label = (await tabs.nth(i).innerText()).toLowerCase();
        if (label.includes("pencil")) {
          await tabs.nth(i).click({ force: true });
          await p.waitForTimeout(700);
          break;
        }
      }
    }
    const r = await p.evaluate(readLanes);
    rows.push({ eng, cell: cell.name, ...r });
    const s = (r.shipped || []).map((x) => `${x.text}:${x.lineBoxes}L/${x.boxW}w`).join(" ");
    const pr = (r.arms?.["printed-1.2"]?.lanes || [])
      .map((x) => `${x.text}:${x.lineBoxes}L/${x.boxW}w/min${x.minContent}`)
      .join(" ");
    console.log(`${eng} ${cell.name}\n   shipped ${s}\n   printed ${pr}`);
    await ctx.close();
  }
  await b.close();
}
writeFileSync(OUT, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
console.log("wrote", OUT, rows.length);
