#!/usr/bin/env node
/**
 * CTRL-COST · PASS 2 — the berth re-read after the line cure, the FOLD'S RATCHET with its own
 * negative control, and the keyboard walk's second Escape.
 *
 * THE RATCHET TEST IS THE ONE PASS 1 COULD NOT HAVE. The defect is structural — the publisher
 * read the box CARRYING the `min-height` it writes, so the value fed itself and could only
 * grow. So the probe plants a large value, makes the observers republish, and reads what comes
 * back: a publisher that reads the ROW returns the row's own height; one that reads the FOLD
 * returns the planted number. The control is the plant itself (200px, a value nothing on the
 * page produces).
 */
import fs from "node:fs";
import { chromium, webkit } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:4233";
const OUT = process.argv[2] || "./p2d.json";

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

const SUBJECTS = [
  ['.band-row-caption:text-is("marks")', "marks"],
  ['.band-row-caption:text-is("what fits")', "fits"],
  ['.band-row-caption:text-is("checking")', "checking"],
  ['button[aria-label^="Fill in every cell"]', "fill"],
  ['button[aria-label="Solve puzzle"]', "solve"],
  ["button.share-btn", "share"],
];

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
  const over = (a, b) => {
    const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return (x * y) / Math.max(1, b.width * b.height);
  };
  let worst = 0;
  let what = null;
  for (const ctl of card.querySelectorAll("button, .ctrl-btn")) {
    const cr = ctl.getBoundingClientRect();
    if (cr.width < 1 || cr.top < exempt - 0.5) continue;
    const f = over(r, cr);
    if (f > worst) {
      worst = f;
      what = (ctl.getAttribute("aria-label") || ctl.textContent || "").trim().slice(0, 26);
    }
  }
  return {
    text: note.textContent.trim().slice(0, 44),
    h: +r.height.toFixed(2),
    headH: +hr.height.toFixed(2),
    budget: +(hr.height + (parseFloat(getComputedStyle(head).marginBottom) || 0)).toFixed(2),
    overhang: +(r.bottom - hr.bottom).toFixed(2),
    nameOverlap: +(over(r, name.getBoundingClientRect()) * 100).toFixed(2),
    offPort: +Math.max(0, port.top - r.top).toFixed(2),
    cover: +(worst * 100).toFixed(2),
    what,
  };
};

async function notes(page) {
  const out = {};
  for (const state of ["top", "foot"]) {
    await page.evaluate((s) => {
      const c = document.querySelector(".controls-card");
      c.scrollTop = s === "foot" ? c.scrollHeight : 0;
    }, state);
    await page.waitForTimeout(150);
    for (const [sel, key] of SUBJECTS) {
      const loc = page.locator(sel).first();
      if (!(await loc.count())) continue;
      const box = await loc.boundingBox();
      if (!box) {
        out[`${state}·${key}`] = { offscreen: true };
        continue;
      }
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(220);
      out[`${state}·${key}`] = await page.evaluate(readNote);
      await page.mouse.move(2, 2);
      await page.waitForTimeout(100);
    }
  }
  return out;
}

async function ratchet(page) {
  await page.locator(".drawer-tab").click({ force: true });
  await page.waitForTimeout(950);
  const read = () =>
    page.evaluate(() => {
      const fold = document.querySelector(".fold-tools");
      const row = document.querySelector("#fold-tools .play-controls");
      const cs = fold ? getComputedStyle(fold) : null;
      return {
        published: fold?.style.getPropertyValue("--fold-tools-h") || null,
        minH: cs?.minHeight ?? null,
        foldH: fold ? +fold.getBoundingClientRect().height.toFixed(2) : null,
        rowH: row ? +row.getBoundingClientRect().height.toFixed(2) : null,
      };
    });
  const out = { settled: await read() };
  // PLANT a value nothing on this page produces, then make the observers republish.
  await page.evaluate(() =>
    document.querySelector(".fold-tools")?.style.setProperty("--fold-tools-h", "200px"),
  );
  await page.waitForTimeout(200);
  out.planted = await read();
  await page.setViewportSize({ width: 391, height: 844 });
  await page.waitForTimeout(700);
  out.afterRepublish = await read();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(700);
  out.restored = await read();
  // the fallback's absence: strip the publisher's value and read the computed min-height
  await page.evaluate(() =>
    document.querySelector(".fold-tools")?.style.removeProperty("--fold-tools-h"),
  );
  await page.waitForTimeout(200);
  out.noPublisher = await read();
  return out;
}

async function escapeWalk(page) {
  const state = () =>
    page.evaluate(() => {
      const verb = document.querySelector(".deal-btn");
      const caseEl = document.querySelector(".drawer-case");
      return {
        armed: verb?.getAttribute("aria-label")?.startsWith("Press again"),
        focus: (
          document.activeElement?.className?.toString?.() ||
          document.activeElement?.tagName ||
          ""
        ).slice(0, 28),
        sheetTop: caseEl ? +caseEl.getBoundingClientRect().top.toFixed(1) : null,
      };
    });
  const steps = [];
  await page.locator('button[aria-label^="Fill in every cell"]').click();
  await page.waitForTimeout(900);
  await page.locator(".deal-btn").focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  steps.push({ step: "armed", ...(await state()) });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  steps.push({ step: "Escape 1", ...(await state()) });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1000);
  steps.push({ step: "Escape 2", ...(await state()) });
  return steps;
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
      out[engine][`notes·${cell.name}`] = await notes(page);
      out[engine][`escape·${cell.name}`] = await escapeWalk(page);
    } catch (e) {
      out[engine][`err·${cell.name}`] = String(e).slice(0, 300);
    }
    await ctx.close();
  }
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  try {
    await load(page);
    out[engine].ratchet = await ratchet(page);
  } catch (e) {
    out[engine].ratchetErr = String(e).slice(0, 300);
  }
  await ctx.close();
  await browser.close();
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("banked", OUT);
