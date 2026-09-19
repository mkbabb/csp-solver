/**
 * CTRL-FACE pass-1 CRITIC — the rows the prototype's own instruments did not carry, re-measured
 * on ITS worktree by a reader who did not write it. Four questions:
 *   1. PI on an unclaimed surface: `.washi-tag` is a SHARED class, and the gallery's staging
 *      band reads it (`StagingBand.vue:130`). Does the face law move pixels there?
 *   2. The two tightest contrast numbers, read from paint, LIGHT theme: the shut tab head and
 *      the shut value word.
 *   3. The tape's collision with the `candidates` caption, independently.
 *   4. ROW 1 / ROW 3 at 900x500 — the born-RED cell the family's whole claim rests on.
 *   BASE=http://127.0.0.1:4242/ node probe/critic.mjs
 */
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
const BASE = process.env.BASE || "http://127.0.0.1:4242/";

const lum = ([r, g, b]) => {
  const f = (v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};

async function inkAndGround(page, el, transparentCss) {
  const box = await el.boundingBox();
  if (!box || box.width < 2 || box.height < 2) return null;
  const clip = {
    x: Math.max(0, Math.round(box.x)),
    y: Math.max(0, Math.round(box.y)),
    width: Math.max(2, Math.round(box.width)),
    height: Math.max(2, Math.round(box.height)),
  };
  const shot = await page.screenshot({ clip });
  const handle = await el.elementHandle();
  await page.evaluate(
    ([node, css]) => {
      node.dataset.critPrev = node.style.color;
      node.style.setProperty("color", css, "important");
    },
    [handle, transparentCss],
  );
  await page.waitForTimeout(120);
  const blank = await page.screenshot({ clip });
  await page.evaluate((node) => {
    node.style.color = node.dataset.critPrev || "";
  }, handle);
  const a = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(blank).raw().toBuffer({ resolveWithObject: true });
  const ch = a.info.channels;
  // GROUND = the modal pixel with the ink transparent. INK = the pixel of the real shot
  // furthest from that ground (the glyph's own core).
  const tally = new Map();
  for (let i = 0; i < b.data.length; i += ch) {
    const k = `${b.data[i]},${b.data[i + 1]},${b.data[i + 2]}`;
    tally.set(k, (tally.get(k) || 0) + 1);
  }
  const ground = [...tally.entries()].sort((x, y) => y[1] - x[1])[0][0].split(",").map(Number);
  let ink = ground,
    far = -1;
  for (let i = 0; i < a.data.length; i += ch) {
    const px = [a.data[i], a.data[i + 1], a.data[i + 2]];
    const d = Math.abs(lum(px) - lum(ground));
    if (d > far) {
      far = d;
      ink = px;
    }
  }
  return { ground, ink, ratio: ratio(ink, ground) };
}

const out = { pi: [], contrast: [], overlap: [], voice: [] };

for (const [eng, L] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await L.launch();

  /* ── 1. PI: the gallery's staging band, a surface this family does not claim ── */
  for (const cell of [
    { name: "gallery-1280x800", w: 1280, h: 800, mobile: false },
    { name: "gallery-390x844", w: 390, h: 844, mobile: true },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && eng === "chromium",
      colorScheme: "dark",
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "?view=gallery&size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".game-gallery", { timeout: 60000 });
    await page.waitForSelector("#gallery-card-0", { timeout: 60000 });
    await page.waitForTimeout(1600);
    const read = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const tag = document.querySelector(".staging-band .washi-tag, .game-gallery .washi-tag") ?? document.querySelector(".washi-tag");
      if (!tag) return null;
      const cs = getComputedStyle(tag);
      const r = tag.getBoundingClientRect();
      const band = document.querySelector(".staging-band, .game-gallery");
      const br = band?.getBoundingClientRect();
      const card = document.querySelector("#gallery-card-0");
      const cr = card?.getBoundingClientRect();
      const n = (v) => +parseFloat(v).toFixed(2);
      return {
        family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
        fontSize: n(cs.fontSize),
        weight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        marginTop: n(cs.marginTop),
        tagBox: { w: +r.width.toFixed(2), h: +r.height.toFixed(2), y: +r.y.toFixed(2) },
        bandBox: br ? { h: +br.height.toFixed(2), y: +br.y.toFixed(2) } : null,
        cardBox: cr ? { h: +cr.height.toFixed(2), y: +cr.y.toFixed(2) } : null,
        tokens: {
          typeTag: root.getPropertyValue("--type-tag").trim(),
          typeGroupTitle: root.getPropertyValue("--type-group-title").trim(),
          typeCaption: root.getPropertyValue("--type-caption").trim(),
        },
      };
    });
    // HEAD's own declarations, restored in-page: the pi ablation.
    const ablated = await page.evaluate(() => {
      const style = document.createElement("style");
      style.textContent = `.washi-tag{font-family:var(--font-hand)!important;font-size:var(--type-tag)!important;font-weight:500!important;line-height:1.5!important;margin-top:calc(-1.5em - 0.04rem - var(--washi-tag-lift, 0px))!important;}`;
      document.head.appendChild(style);
      const tag = document.querySelector(".staging-band .washi-tag, .game-gallery .washi-tag") ?? document.querySelector(".washi-tag");
      const r = tag.getBoundingClientRect();
      const band = document.querySelector(".staging-band, .game-gallery");
      const br = band?.getBoundingClientRect();
      const card = document.querySelector("#gallery-card-0");
      const cr = card?.getBoundingClientRect();
      const cs = getComputedStyle(tag);
      return {
        family: cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
        fontSize: +parseFloat(cs.fontSize).toFixed(2),
        tagBox: { w: +r.width.toFixed(2), h: +r.height.toFixed(2), y: +r.y.toFixed(2) },
        bandBox: br ? { h: +br.height.toFixed(2), y: +br.y.toFixed(2) } : null,
        cardBox: cr ? { h: +cr.height.toFixed(2), y: +cr.y.toFixed(2) } : null,
      };
    });
    out.pi.push({ eng, cell: cell.name, asBuilt: read, headAblation: ablated });
    await ctx.close();
  }

  /* ── 2–4: the controls dock ── */
  for (const cell of [
    { name: "dock-390x844", w: 390, h: 844, mobile: true, theme: "light" },
    { name: "land-900x500", w: 900, h: 500, mobile: true, theme: "dark" },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.mobile,
      isMobile: cell.mobile && eng === "chromium",
      deviceScaleFactor: 2,
      colorScheme: cell.theme,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await page.waitForTimeout(1500);
    await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), cell.theme);
    await page.waitForTimeout(400);
    if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      await page.locator(".drawer-tab").click({ force: true });
      await page.waitForTimeout(1000); // the sheet SLIDES
    }

    /* voice census: every group name on screen + the chip rung */
    const voice = await page.evaluate(() => {
      const vis = (el) => {
        const r = el.getBoundingClientRect();
        return r.width > 1 && r.height > 1 && getComputedStyle(el).visibility !== "hidden";
      };
      const names = Array.from(
        document.querySelectorAll(".section-heading, .washi-tag, .zone-row-label"),
      ).filter(vis);
      const sig = (el) => {
        const cs = getComputedStyle(el);
        return `${cs.fontFamily.split(",")[0].replace(/["']/g, "").trim()} · ${(+parseFloat(cs.fontSize)).toFixed(2)} · ${cs.fontWeight} · ${cs.textTransform}`;
      };
      const chip = document.querySelector(".ctrl-btn");
      return {
        count: names.length,
        texts: names.map((n) => n.innerText.trim().slice(0, 14)),
        voices: [...new Set(names.map(sig))],
        optionPx: chip ? +parseFloat(getComputedStyle(chip).fontSize).toFixed(2) : null,
        chipFamily: chip
          ? getComputedStyle(chip).fontFamily.split(",")[0].replace(/["']/g, "").trim()
          : null,
        chipWeight: chip ? getComputedStyle(chip).fontWeight : null,
      };
    });
    voice.ratio = voice.optionPx
      ? +(parseFloat(voice.voices[0]?.split("·")[1]) / voice.optionPx).toFixed(4)
      : null;
    out.voice.push({ eng, cell: cell.name, ...voice });

    /* tape collisions, independently */
    const ov = await page.evaluate(() => {
      const rects = (sel) => Array.from(document.querySelectorAll(sel));
      const box = (e) => e.getBoundingClientRect();
      const area = (a, b) =>
        +(
          Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
          Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
        ).toFixed(1);
      const res = [];
      for (const t of rects(".tray-well > .washi-tag")) {
        for (const c of rects(".zone-row-label, .ctrl-btn, .mobile-heading-btn")) {
          const px2 = area(box(t), box(c));
          if (px2 > 0)
            res.push({
              tape: t.innerText.trim(),
              sel: c.className.split(" ")[0],
              text: c.innerText.replace(/\s+/g, " ").trim().slice(0, 14),
              px2,
              deep: +(box(t).bottom - box(c).top).toFixed(2),
            });
        }
      }
      return res;
    });
    out.overlap.push({ eng, cell: cell.name, theme: cell.theme, collisions: ov });

    /* contrast from paint on the two tightest nodes (light cell only) */
    if (cell.theme === "light") {
      for (const [label, sel] of [
        ["tab head SHUT", ".mobile-heading-btn[aria-expanded='false'] .section-heading"],
        ["shut value word", ".mobile-heading-btn[aria-expanded='false'] .heading-value"],
        ["chip UNSELECTED", ".ctrl-btn[aria-pressed='false'] .ctrl-word"],
        ["printed name on tape", ".tray-well > .washi-tag"],
        ["row caption printed", ".zone-row-label"],
      ]) {
        const loc = page.locator(sel).first();
        if (!(await loc.count())) continue;
        try {
          await loc.scrollIntoViewIfNeeded({ timeout: 4000 });
        } catch {}
        await page.waitForTimeout(150);
        const r = await inkAndGround(page, loc, "transparent");
        if (r) out.contrast.push({ eng, cell: cell.name, theme: cell.theme, label, ...r });
      }
    }
    await ctx.close();
  }
  await browser.close();
}

console.log(JSON.stringify(out, null, 1));
