#!/usr/bin/env node
/**
 * CTRL-COST · PASS 2 — THE BERTH, THE KEYBOARD WALK, THE FOLD'S RESERVE, AND THE GALLERY'S π.
 *
 *   G17  each note hovered ALONE, by the real pointer path, at scrollTop 0 and at
 *        scrollTop = scrollHeight: its box, its lines, its overhang past the head it berths in,
 *        how much of the head's own name it covers, how far it leaves the port, and how much of
 *        any control BELOW THE EXEMPT LINE it lies over.
 *   G14  the keyboard walk, every read timestamped: Enter arms and focus lands on `no`; a second
 *        Enter disarms and the board is unchanged; Shift-Tab + Enter deals; Escape disarms and
 *        the sheet STAYS; a second Escape closes it.
 *   G18  `--fold-tools-h` across a shrink-and-restore sequence, and the absence of a fallback.
 *   π    the gallery's rects at 390 and 1280, five readings, against HEAD's own tree.
 */
import fs from "node:fs";
import { chromium, webkit } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:4233";
const OUT = process.argv[2] || "./p2b.json";

async function load(page) {
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
  if (
    await page.evaluate(() =>
      document.documentElement.classList.contains("drawer-closed"),
    )
  ) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  await page.waitForTimeout(250);
}

const boardString = () =>
  Array.from(document.querySelectorAll(".cell-native-input"))
    .map((i) => i.value || "_")
    .join(",");

const SUBJECTS = [
  { key: "marks", sel: '.band-row-caption:text-is("marks")' },
  { key: "fits", sel: '.band-row-caption:text-is("what fits")' },
  { key: "checking", sel: '.band-row-caption:text-is("checking")' },
  { key: "fill", sel: 'button[aria-label^="Fill in every cell"]' },
  { key: "solve", sel: 'button[aria-label="Solve puzzle"]' },
  { key: "share", sel: "button.share-btn" },
];

/** Read the one note that is showing, against the head it berths in and the card's controls. */
const readNote = () => {
  const card = document.querySelector(".controls-card");
  const port = card.getBoundingClientRect();
  const pad = parseFloat(getComputedStyle(card).paddingTop) || 0;
  const exempt = port.top + pad;
  const shown = Array.from(card.querySelectorAll(".band-note")).filter(
    (n) => n.textContent.trim() !== "",
  );
  if (shown.length !== 1) return { shownCount: shown.length };
  const note = shown[0];
  const head = note.closest(".cost-band-head");
  const name = head.querySelector(".section-heading");
  const r = note.getBoundingClientRect();
  const hr = head.getBoundingClientRect();
  const nr = name.getBoundingClientRect();
  const cs = getComputedStyle(note);
  const over = (a, b) => {
    const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return (x * y) / Math.max(1, b.width * b.height);
  };
  let worst = 0;
  let worstWhat = null;
  for (const ctl of card.querySelectorAll("button, .ctrl-btn")) {
    const cr = ctl.getBoundingClientRect();
    if (cr.width < 1 || cr.top < exempt - 0.5) continue;
    const f = over(r, cr);
    if (f > worst) {
      worst = f;
      worstWhat = (ctl.getAttribute("aria-label") || ctl.textContent || "").trim().slice(0, 30);
    }
  }
  return {
    text: note.textContent.trim(),
    band: name.textContent.trim(),
    w: +r.width.toFixed(2),
    h: +r.height.toFixed(2),
    lines: +(r.height / parseFloat(cs.lineHeight)).toFixed(2),
    fontSize: cs.fontSize,
    headH: +hr.height.toFixed(2),
    overhangPastHead: +(r.bottom - hr.bottom).toFixed(2),
    airBelowHead: +(parseFloat(getComputedStyle(head).marginBottom) || 0).toFixed(2),
    nameOverlap: +(over(r, nr) * 100).toFixed(2),
    offPortAbove: +Math.max(0, port.top - r.top).toFixed(2),
    offPortBelow: +Math.max(0, r.bottom - port.bottom).toFixed(2),
    offPortRight: +Math.max(0, r.right - port.right).toFixed(2),
    worstCoverage: +(worst * 100).toFixed(2),
    worstWhat,
    ariaHidden: note.getAttribute("aria-hidden"),
    ariaLive: note.getAttribute("aria-live"),
  };
};

async function notes(page, label) {
  const out = {};
  for (const state of ["top", "foot"]) {
    await page.evaluate((s) => {
      const c = document.querySelector(".controls-card");
      c.scrollTop = s === "foot" ? c.scrollHeight : 0;
    }, state);
    await page.waitForTimeout(150);
    for (const s of SUBJECTS) {
      const loc = page.locator(s.sel).first();
      if (!(await loc.count())) {
        out[`${state}·${s.key}`] = { missing: true };
        continue;
      }
      try {
        // hover WITHOUT auto-scrolling the card (a scroll would re-park the band and the
        // reading would be of a state no reader is in — pass 1's banked trap, the other way up)
        const box = await loc.boundingBox();
        if (!box) {
          out[`${state}·${s.key}`] = { offscreen: true };
          continue;
        }
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(220);
        out[`${state}·${s.key}`] = await page.evaluate(readNote);
      } catch (e) {
        out[`${state}·${s.key}`] = { error: String(e).slice(0, 160) };
      }
      await page.mouse.move(2, 2);
      await page.waitForTimeout(120);
    }
  }
  return { [label]: out };
}

async function keyboardWalk(page) {
  const t0 = Date.now();
  const at = () => Date.now() - t0;
  const steps = [];
  const state = () =>
    page.evaluate(() => {
      const verb = document.querySelector(".deal-btn");
      const no = document.querySelector(".deal-face .act-answer");
      const caseEl = document.querySelector(".drawer-case");
      return {
        armed: verb?.getAttribute("aria-label")?.startsWith("Press again"),
        focus: (document.activeElement?.className?.toString?.() || document.activeElement?.tagName || "").slice(0, 30),
        focusIsNo: document.activeElement === no,
        sheetTop: caseEl ? +caseEl.getBoundingClientRect().top.toFixed(1) : null,
        board: Array.from(document.querySelectorAll(".cell-native-input"))
          .map((i) => i.value || "_")
          .join(","),
      };
    });

  await page.locator('button[aria-label^="Fill in every cell"]').click();
  await page.waitForTimeout(900);
  await page.locator(".deal-btn").focus();
  await page.waitForTimeout(150);
  steps.push({ step: "focus on deal", ms: at(), ...(await state()) });

  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);
  steps.push({ step: "Enter 1 → armed + focus", ms: at(), ...(await state()) });

  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  steps.push({ step: "Enter 2 (on `no`) → disarmed", ms: at(), ...(await state()) });

  // Shift-Tab back to the armed verb, then Enter there DEALS (the reader who means it)
  await page.locator(".deal-btn").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);
  steps.push({ step: "re-armed", ms: at(), ...(await state()) });
  await page.keyboard.press("Shift+Tab");
  await page.waitForTimeout(150);
  steps.push({ step: "Shift-Tab → the armed verb", ms: at(), ...(await state()) });
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1400);
  steps.push({ step: "Enter on the armed verb → dealt", ms: at(), ...(await state()) });

  // Escape: one disarms and the sheet stays; a second closes it.
  await page.locator('button[aria-label^="Fill in every cell"]').click();
  await page.waitForTimeout(900);
  await page.locator(".deal-btn").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(250);
  steps.push({ step: "armed again (for Escape)", ms: at(), ...(await state()) });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  steps.push({ step: "Escape 1 → disarmed, sheet stays", ms: at(), ...(await state()) });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(900);
  steps.push({ step: "Escape 2 → sheet closes", ms: at(), ...(await state()) });
  return steps;
}

async function foldReserve(page) {
  // THE RIBBON ONLY HOLDS THE VERBS WITH THE SHEET SHUT. With the sheet up the Teleport is
  // disabled and the row rides into the `writing` band — which is the whole amendment — so a
  // reserve read with the sheet open is a read of an empty band and the publisher is (rightly)
  // silent. Shut it first.
  await page.locator(".drawer-tab").click({ force: true });
  await page.waitForTimeout(950);
  const read = () =>
    page.evaluate(() => {
      const fold = document.querySelector(".fold-tools");
      const row = document.querySelector("#fold-tools .play-controls");
      return {
        published: fold?.style.getPropertyValue("--fold-tools-h") || null,
        foldH: fold ? +fold.getBoundingClientRect().height.toFixed(2) : null,
        rowH: row ? +row.getBoundingClientRect().height.toFixed(2) : null,
        minH: fold ? getComputedStyle(fold).minHeight : null,
      };
    });
  const out = { start: await read() };
  // SHRINK: take a verb out of the row and let the observers republish.
  await page.evaluate(() => {
    const row = document.querySelector("#fold-tools .play-controls");
    if (!row) return;
    window.__parked = Array.from(row.children).slice(0, 2);
    for (const el of window.__parked) el.style.display = "none";
  });
  await page.setViewportSize({ width: 391, height: 844 });
  await page.waitForTimeout(600);
  out.shrunk = await read();
  // RESTORE
  await page.evaluate(() => {
    for (const el of window.__parked || []) el.style.display = "";
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(600);
  out.restored = await read();
  return out;
}

async function galleryPi(page) {
  await page.keyboard.press("g");
  await page.waitForTimeout(1200);
  return page.evaluate(() => {
    const box = (s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return [+r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2)];
    };
    const label = document.querySelector(".staging-axis-label");
    return {
      slip: box(".staging-slip"),
      band: box(".staging-band"),
      axisLabel: label ? getComputedStyle(label).fontSize : null,
      guardFace: box(".guard-leave .act-face"),
      card: box(".game-card"),
    };
  });
}

const out = {};
for (const [engine, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch();
  out[engine] = {};

  for (const cell of [
    { name: "dock-390x844", w: 390, h: 844, touch: true },
    { name: "desk-1280x800", w: 1280, h: 800, touch: false },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.touch,
      isMobile: cell.touch,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    try {
      await load(page);
      Object.assign(out[engine], await notes(page, `notes·${cell.name}`));
      out[engine][`keyboard·${cell.name}`] = await keyboardWalk(page);
    } catch (e) {
      out[engine][`err·${cell.name}`] = String(e).slice(0, 300);
    }
    await ctx.close();
  }

  // the fold's reserve + the gallery's π, at the dock
  for (const [w, h, tag] of [
    [390, 844, "390"],
    [1280, 800, "1280"],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      hasTouch: w < 1024,
      isMobile: w < 1024,
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    try {
      await load(page);
      if (w === 390) out[engine].fold = await foldReserve(page);
      const reads = [];
      for (let i = 0; i < 5; i++) {
        reads.push(await galleryPi(page));
        await page.keyboard.press("Escape");
        await page.waitForTimeout(900);
      }
      out[engine][`gallery·${tag}`] = reads;
    } catch (e) {
      out[engine][`err·gallery·${tag}`] = String(e).slice(0, 300);
    }
    await ctx.close();
  }
  await browser.close();
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("banked", OUT);
