// C11 verify r1 — THE FLIP-BACK PROBE.
//
// bakeStore.ts:437 watches the LIBRARY's `urls` and, when a baked set lands, schedules an idle
// write under `identityOf(toValue(opts))` — the identity CURRENT AT THAT MOMENT, not the
// identity the set was baked under. While a lookup is pending (or a restored set is serving)
// the wrapper holds the library's box at zero, so the library does NOT supersede an in-flight
// bake on a theme flip: the older theme's set lands after the flip and is written under the
// NEW theme's key. The adopt gate (:294) only checks the intrinsic size, and a theme flip does
// not move the box, so it cannot catch this.
//
// RUN (cwd: the w8-bake worktree's web/frontend):
//   node <this> --port 4253 --flip 800 --out raw/theme-race.json
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const req = createRequire(pathToFileURL(process.cwd() + "/"));
const { chromium } = req("playwright");

const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i > 0 ? process.argv[i + 1] : d;
};
const PORT = arg("port", "4253");
const FLIP = Number(arg("flip", "800"));
const CPU = Number(arg("cpu", "4"));
const OUT = arg("out", "theme-race.json");
const BASE = `http://127.0.0.1:${PORT}/`;

const DUMP_STORE = async () => {
  const hex = (buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  let db;
  try {
    db = await new Promise((res, rej) => {
      const r = indexedDB.open("pencil-bake", 1);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  } catch {
    return [];
  }
  const rows = await new Promise((res, rej) => {
    const r = db.transaction("stacks", "readonly").objectStore("stacks").getAll();
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
  const out = [];
  for (const row of rows) {
    const blobs = row.blobs ?? (row.buffers || []).map((b) => new Blob([b]));
    const sha = [];
    for (const b of blobs)
      sha.push(hex(await crypto.subtle.digest("SHA-256", await b.arrayBuffer())));
    out.push({ key: row.key, at: row.at, bytes: row.bytes, sha });
  }
  return out;
};

// sha-256 of every mounted grid pose bitmap, in document order.
const MOUNTED_GRID = async () => {
  const hex = (buf) =>
    Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  const out = [];
  for (const el of document.querySelectorAll(".boil-frame-bitmap")) {
    const href = el.getAttribute("href") || el.src || "";
    if (href.indexOf("blob:") !== 0) continue;
    const buf = await (await fetch(href)).arrayBuffer();
    out.push(hex(await crypto.subtle.digest("SHA-256", buf)));
  }
  return { theme: document.documentElement.className, sha: out };
};

const profile = mkdtempSync(join(tmpdir(), "c11v-race-"));
const ctx = await chromium.launchPersistentContext(profile, {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  hasTouch: true,
  isMobile: true,
});
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
if (CPU > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: CPU });

const log = { port: PORT, flipMs: FLIP, cpu: CPU };

// 1. boot in light, let the boot bakes land and the idle writes go down
await page.goto(BASE, { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(14000);
log.storeAfterBoot = await page.evaluate(DUMP_STORE);
log.mountedLightBoot = await page.evaluate(MOUNTED_GRID);

// 2. flip to dark, then flip BACK while the dark grid bake is still in flight
await page.click("button.sun-moon-toggle");
await page.waitForTimeout(FLIP);
log.mountedAtFlipBack = await page.evaluate(MOUNTED_GRID);
await page.click("button.sun-moon-toggle");
await page.waitForTimeout(10000);
log.storeAfterFlipBack = await page.evaluate(DUMP_STORE);

// 3. reload in light and read what the store serves
await page.goto(BASE, { waitUntil: "load", timeout: 120000 });
await page.waitForTimeout(12000);
log.mountedAfterReload = await page.evaluate(MOUNTED_GRID);

await ctx.close();

const rowOf = (rows, frag) => rows.find((r) => r.key.includes(frag));
const lightBefore = rowOf(log.storeAfterBoot, "grid-") && rowOf(log.storeAfterBoot, "|grid-");
const findGrid = (rows, t) =>
  rows.find((r) => /\|grid-\d+-\d+-(l|d)\|/.test(r.key) && r.key.includes(`-${t}|`));
const gl0 = findGrid(log.storeAfterBoot, "l");
const gl1 = findGrid(log.storeAfterFlipBack, "l");
const gd1 = findGrid(log.storeAfterFlipBack, "d");
log.verdict = {
  lightGridRowKey: gl0?.key ?? null,
  lightRowChangedAcrossFlip:
    gl0 && gl1 ? JSON.stringify(gl0.sha) !== JSON.stringify(gl1.sha) : null,
  lightRowAfterFlipEqualsDarkRow:
    gl1 && gd1 ? JSON.stringify(gl1.sha) === JSON.stringify(gd1.sha) : null,
  reloadServedBootLightPixels:
    gl0 && log.mountedAfterReload
      ? JSON.stringify(log.mountedAfterReload.sha) === JSON.stringify(gl0.sha)
      : null,
  reloadThemeClass: log.mountedAfterReload?.theme ?? null,
};
writeFileSync(OUT, JSON.stringify(log, null, 1) + "\n");
console.log(JSON.stringify(log.verdict, null, 1));
console.log(
  "store keys after boot:",
  log.storeAfterBoot.map((r) => r.key),
);
console.log(
  "store keys after flip-back:",
  log.storeAfterFlipBack.map((r) => r.key),
);
