/**
 * NOTE-ERASE pass-3 CRITIQUE — the critic's own readings, not the prototype's.
 *
 * X1  the SETTLED exit, re-measured from scratch (G1 / G14 / G16 independently)
 * X2  the FRESH exit — the state the compound clock does NOT fence
 * X3  AA: painted ratios for fresh + settled ink, light AND dark, computed here
 * X4  the live region's trajectory across a REPLACEMENT (the spec's "no empty frame")
 * X5  the strip's own box at 390 and 1280, empty -> fresh -> settled (pi reading)
 */
import { test, expect } from "@playwright/test";
import { bank, boardReady, armHint, readNote, ratio, say } from "./lib";

type Sample = {
  t: number;
  present: boolean;
  clip: string;
  opacity: string;
  anim: string;
  leaving: boolean;
  age: string | null;
  trans: string;
};

function trace(page: import("@playwright/test").Page, ms = 900) {
  return page.evaluate((ms) => {
    return new Promise<{
      medianRafMs: number;
      samples: Sample[];
      leaveSeen: boolean;
      leaveAnim: string | null;
      leaveTrans: string | null;
      leaveAge: string | null;
      absentAt: number | null;
      reappeared: boolean;
    }>((res) => {
      const t0 = performance.now();
      const samples: Sample[] = [];
      const ticks: number[] = [];
      let last = t0;
      let leaveSeen = false;
      let leaveAnim: string | null = null;
      let leaveTrans: string | null = null;
      let leaveAge: string | null = null;
      let absentAt: number | null = null;
      let reappeared = false;
      const tick = () => {
        const now = performance.now();
        ticks.push(now - last);
        last = now;
        const t = Math.round((now - t0) * 10) / 10;
        const el = document.querySelector<HTMLElement>(".margin-note-ink");
        if (el) {
          if (absentAt !== null) reappeared = true;
          const cs = getComputedStyle(el);
          const leaving = el.classList.contains("note-leave-active");
          if (leaving && !leaveSeen) {
            leaveSeen = true;
            leaveAnim = cs.animationName;
            leaveTrans = cs.transitionDuration;
            leaveAge = el.getAttribute("data-note-age");
          }
          samples.push({
            t,
            present: true,
            clip: cs.clipPath,
            opacity: cs.opacity,
            anim: cs.animationName,
            leaving,
            age: el.getAttribute("data-note-age"),
            trans: cs.transitionDuration,
          });
        } else {
          if (absentAt === null) absentAt = t;
          samples.push({
            t,
            present: false,
            clip: "",
            opacity: "",
            anim: "",
            leaving: false,
            age: null,
            trans: "",
          });
        }
        if (now - t0 < ms) requestAnimationFrame(tick);
        else {
          const s = ticks.slice(1).sort((a, b) => a - b);
          res({
            medianRafMs: Math.round(s[Math.floor(s.length / 2)] * 10) / 10,
            samples,
            leaveSeen,
            leaveAnim,
            leaveTrans,
            leaveAge,
            absentAt,
            reappeared,
          });
        }
      };
      requestAnimationFrame(tick);
    });
  }, ms);
}

/** Type a digit into the first EMPTY cell — "your write", which retracts the hint record. */
async function writeAnEmptyCell(page: import("@playwright/test").Page, digit = "1") {
  const idx = await page.evaluate(
    () =>
      [...document.querySelectorAll(".game-cell input")].findIndex(
        (i) => !(i as HTMLInputElement).value,
      ),
  );
  await page.locator(".game-cell input").nth(idx).focus();
  await page.keyboard.press(digit);
  return idx;
}

function digest(r: Awaited<ReturnType<typeof trace>>) {
  const present = r.samples.filter((s) => s.present);
  const leaveIdx = r.samples.findIndex((s) => s.leaving);
  const post = leaveIdx < 0 ? [] : r.samples.slice(leaveIdx).filter((s) => s.present);
  const restored = post.filter(
    (s) => s.clip === "none" && Number(s.opacity) > 0.9,
  ).length;
  const clipStates = new Set(post.map((s) => s.clip)).size;
  const noneAfterVerb = post.filter((s) => s.clip === "none").length;
  return {
    medianRafMs: r.medianRafMs,
    leaveSeen: r.leaveSeen,
    leaveAnimationName: r.leaveAnim,
    leaveTransitionDuration: r.leaveTrans,
    leaveAgeAttr: r.leaveAge,
    absentAtMs: r.absentAt,
    reappearedAfterAbsent: r.reappeared,
    restoredInkFrames: restored,
    postVerbClipNoneFrames: noneAfterVerb,
    distinctClipStates: clipStates,
    lastPresent: present.length
      ? {
          t: present[present.length - 1].t,
          clip: present[present.length - 1].clip,
          opacity: present[present.length - 1].opacity,
        }
      : null,
  };
}

test("X1 the SETTLED exit, the critic's own reading", async ({ page }, info) => {
  await boardReady(page);
  const armed = await armHint(page);
  expect(armed?.text, "the hint record must be on the strip").toBeTruthy();
  // past 8 beats (1000ms) + a frame
  await page.waitForTimeout(1300);
  const settled = await readNote(page);
  expect(settled?.age, "data-note-age must read settled").toBe("settled");
  const t = trace(page, 900);
  await writeAnEmptyCell(page);
  const raw = await t;
  const d = digest(raw);
  say(`X1-${info.project.name}`, d);
  bank(`x1-settled-${info.project.name}.json`, { settled, ...d });
  expect(d.leaveSeen).toBe(true);
  expect(d.leaveAgeAttr).toBe("settled");
});

test("X2 the FRESH exit — the state the clock fence does not cover", async ({
  page,
}, info) => {
  await boardReady(page);
  const armed = await armHint(page);
  expect(armed?.text).toBeTruthy();
  await page.waitForTimeout(150);
  const t = trace(page, 900);
  await writeAnEmptyCell(page);
  const raw = await t;
  const d = digest(raw);
  say(`X2-${info.project.name}`, d);
  bank(`x2-fresh-${info.project.name}.json`, d);
  expect(d.leaveSeen).toBe(true);
});

test("X3 AA — painted ratios both themes, computed here", async ({ page }, info) => {
  const out: Record<string, unknown> = {};
  for (const theme of ["light", "dark"] as const) {
    await boardReady(page);
    await page.evaluate((t) => {
      document.documentElement.setAttribute("data-theme", t);
    }, theme);
    await page.waitForTimeout(400);
    const armed = await armHint(page);
    expect(armed?.text).toBeTruthy();
    const fresh = await page.evaluate(() => {
      const ink = document.querySelector<HTMLElement>(".margin-note-ink")!;
      let bg = "rgba(0, 0, 0, 0)";
      for (let n: HTMLElement | null = ink; n; n = n.parentElement) {
        const c = getComputedStyle(n).backgroundColor;
        if (c && !/rgba?\(0, 0, 0, 0\)|transparent/.test(c)) {
          bg = c;
          break;
        }
      }
      return { color: getComputedStyle(ink).color, bg };
    });
    await page.waitForTimeout(1400);
    const set = await page.evaluate(() => {
      const ink = document.querySelector<HTMLElement>(".margin-note-ink")!;
      let bg = "rgba(0, 0, 0, 0)";
      for (let n: HTMLElement | null = ink; n; n = n.parentElement) {
        const c = getComputedStyle(n).backgroundColor;
        if (c && !/rgba?\(0, 0, 0, 0\)|transparent/.test(c)) {
          bg = c;
          break;
        }
      }
      return {
        color: getComputedStyle(ink).color,
        bg,
        age: ink.getAttribute("data-note-age"),
      };
    });
    const px = (css: string, over: number[]): number[] | null => {
      const m = css.match(/rgba?\(([^)]+)\)/);
      if (m) {
        const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
        const a = p.length > 3 ? p[3] : 1;
        return [0, 1, 2].map((i) => a * p[i] + (1 - a) * over[i]);
      }
      const s = css.match(
        /color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/,
      );
      if (s) {
        const a = s[4] === undefined ? 1 : Number(s[4]);
        return [1, 2, 3].map((k, i) => a * Number(s[k]) * 255 + (1 - a) * over[i]);
      }
      return null;
    };
    const paper = px(set.bg, [255, 255, 255]) ?? [255, 255, 255];
    const freshInk = px(fresh.color, paper);
    const setInk = px(set.color, paper);
    out[theme] = {
      paper: set.bg,
      freshColor: fresh.color,
      settledColor: set.color,
      settledAge: set.age,
      freshRatio: freshInk ? ratio(freshInk, paper) : null,
      settledRatio: setInk ? ratio(setInk, paper) : null,
    };
  }
  say(`X3-${info.project.name}`, out);
  bank(`x3-aa-${info.project.name}.json`, out);
});

test("X4 the region's trajectory across a REPLACEMENT", async ({ page }, info) => {
  await boardReady(page);
  const armed = await armHint(page);
  expect(armed?.text).toBeTruthy();
  const trail = page.evaluate(() => {
    return new Promise<{ t: number; text: string }[]>((res) => {
      const region = document.querySelector<HTMLElement>(".margin-note")!;
      const t0 = performance.now();
      const seen: { t: number; text: string }[] = [
        { t: 0, text: (region.textContent || "").trim() },
      ];
      const mo = new MutationObserver(() => {
        const txt = (region.textContent || "").trim();
        if (seen[seen.length - 1].text !== txt)
          seen.push({ t: Math.round((performance.now() - t0) * 10) / 10, text: txt });
      });
      mo.observe(region, { childList: true, subtree: true, characterData: true });
      setTimeout(() => {
        mo.disconnect();
        res(seen);
      }, 1400);
    });
  });
  // a DIFFERENT sentence: refuse a given (teacher-red reply) while the record stands
  const idx = await page.evaluate(
    () =>
      [...document.querySelectorAll(".game-cell input")].findIndex(
        (i) => !!(i as HTMLInputElement).value,
      ),
  );
  await page.locator(".game-cell input").nth(idx).click();
  await page.keyboard.press("5");
  const t = await trail;
  say(`X4-${info.project.name}`, t);
  bank(`x4-replace-${info.project.name}.json`, t);
});

test("X5 the strip's box, 390 and 1280", async ({ page }, info) => {
  const out: Record<string, unknown> = {};
  for (const [w, h] of [
    [390, 844],
    [1280, 800],
  ] as const) {
    await page.setViewportSize({ width: w, height: h });
    await boardReady(page);
    const empty = await page.evaluate(() => {
      const b = document.querySelector<HTMLElement>(".margin-note-block");
      const g = document.querySelector<HTMLElement>('[role="grid"]');
      const r1 = (x: number) => Math.round(x * 100) / 100;
      return {
        strip: b ? { h: r1(b.getBoundingClientRect().height) } : null,
        grid: g
          ? {
              w: r1(g.getBoundingClientRect().width),
              h: r1(g.getBoundingClientRect().height),
              y: r1(g.getBoundingClientRect().top),
            }
          : null,
        docH: document.documentElement.scrollHeight,
      };
    });
    await armHint(page);
    const fresh = await page.evaluate(() => {
      const b = document.querySelector<HTMLElement>(".margin-note-block");
      const g = document.querySelector<HTMLElement>('[role="grid"]');
      const r1 = (x: number) => Math.round(x * 100) / 100;
      return {
        strip: b ? { h: r1(b.getBoundingClientRect().height) } : null,
        grid: g
          ? {
              w: r1(g.getBoundingClientRect().width),
              h: r1(g.getBoundingClientRect().height),
              y: r1(g.getBoundingClientRect().top),
            }
          : null,
        docH: document.documentElement.scrollHeight,
      };
    });
    out[`${w}x${h}`] = { empty, fresh };
  }
  say(`X5-${info.project.name}`, out);
  bank(`x5-box-${info.project.name}.json`, out);
});

test("X6 AA in DARK, via colour-scheme emulation (X3's data-theme arm was vacuous)", async ({
  page,
}, info) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await boardReady(page);
  const armed = await armHint(page);
  expect(armed?.text).toBeTruthy();
  const read = async () =>
    page.evaluate(() => {
      const ink = document.querySelector<HTMLElement>(".margin-note-ink")!;
      let bg = "rgba(0, 0, 0, 0)";
      for (let n: HTMLElement | null = ink; n; n = n.parentElement) {
        const c = getComputedStyle(n).backgroundColor;
        if (c && !/rgba?\(0, 0, 0, 0\)|transparent/.test(c)) {
          bg = c;
          break;
        }
      }
      return {
        color: getComputedStyle(ink).color,
        bg,
        age: ink.getAttribute("data-note-age"),
        theme: document.documentElement.getAttribute("data-theme"),
      };
    });
  const fresh = await read();
  await page.waitForTimeout(1400);
  const settledRead = await read();
  const px = (css: string, over: number[]): number[] | null => {
    const m = css.match(/rgba?\(([^)]+)\)/);
    if (m) {
      const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
      const a = p.length > 3 ? p[3] : 1;
      return [0, 1, 2].map((i) => a * p[i] + (1 - a) * over[i]);
    }
    const s = css.match(
      /color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?/,
    );
    if (s) {
      const a = s[4] === undefined ? 1 : Number(s[4]);
      return [1, 2, 3].map((k, i) => a * Number(s[k]) * 255 + (1 - a) * over[i]);
    }
    return null;
  };
  const paper = px(settledRead.bg, [0, 0, 0]) ?? [0, 0, 0];
  const f = px(fresh.color, paper);
  const s2 = px(settledRead.color, paper);
  const out = {
    theme: settledRead.theme,
    paper: settledRead.bg,
    freshColor: fresh.color,
    settledColor: settledRead.color,
    settledAge: settledRead.age,
    freshRatio: f ? ratio(f, paper) : null,
    settledRatio: s2 ? ratio(s2, paper) : null,
  };
  say(`X6-${info.project.name}`, out);
  bank(`x6-aa-dark-${info.project.name}.json`, out);
});
