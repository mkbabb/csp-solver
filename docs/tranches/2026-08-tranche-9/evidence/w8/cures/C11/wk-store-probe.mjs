// RUN: node wk-store-probe.mjs --engine webkit --persistent 1 --port 4252   (cwd: web/frontend)
//
// C11 spike, control instrument. Playwright's default context is ephemeral. This probe asks
// whether the three candidate stores survive ONE NAVIGATION, under an ephemeral context and
// under a real on-disk profile (`launchPersistentContext`), with a 256 KiB payload — so an
// engine fact can be told apart from an instrument artifact.
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
const req = createRequire(pathToFileURL(process.cwd() + "/"));
const { chromium, webkit } = req("playwright");

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`);
  return i >= 0 ? argv[i + 1] : d;
};
const ENGINE = arg("engine", "webkit");
const PERSISTENT = arg("persistent", "0") === "1";
const PORT = arg("port", "4252");
const BASE = `http://127.0.0.1:${PORT}/`;

const WRITE = async (payloadBytes) => {
  const bytes = new Uint8Array(payloadBytes).fill(7);
  const blob = new Blob([bytes], { type: "image/png" });
  const out = { idbBlob: null, idbBytes: null, cache: null };
  const open = (name) =>
    new Promise((res, rej) => {
      const r = indexedDB.open(name, 1);
      r.onupgradeneeded = () => r.result.createObjectStore("s");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  const put = async (name, value) => {
    const db = await open(name);
    return new Promise((res) => {
      const tx = db.transaction("s", "readwrite");
      tx.objectStore("s").put(value, "k");
      tx.oncomplete = () => res("ok");
      tx.onerror = () => res("error:" + String(tx.error && tx.error.name));
      tx.onabort = () => res("abort:" + String(tx.error && tx.error.message));
    });
  };
  out.idbBlob = await put("probe-blob", blob);
  out.idbBytes = await put("probe-bytes", bytes.buffer);
  try {
    const c = await caches.open("probe-cache");
    await c.put(new Request(location.origin + "/probe/k"), new Response(blob));
    out.cache = "ok:" + (await c.keys()).length;
  } catch (e) {
    out.cache = "throw:" + String(e && e.name);
  }
  return out;
};

const READ = async () => {
  const out = {};
  const open = (name) =>
    new Promise((res, rej) => {
      const r = indexedDB.open(name, 1);
      r.onupgradeneeded = () => r.result.createObjectStore("s");
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  const get = async (name) => {
    const db = await open(name);
    return new Promise((res) => {
      const tx = db.transaction("s", "readonly");
      const q = tx.objectStore("s").get("k");
      q.onsuccess = () => {
        const v = q.result;
        res(v ? (v.size !== undefined ? "blob:" + v.size : "buf:" + v.byteLength) : "MISS");
      };
      q.onerror = () => res("error:" + String(q.error && q.error.name));
    });
  };
  out.idbBlob = await get("probe-blob");
  out.idbBytes = await get("probe-bytes");
  try {
    const names = await caches.keys();
    const c = await caches.open("probe-cache");
    const keys = await c.keys();
    const hit = await c.match(location.origin + "/probe/k");
    out.cache = `names=${names.join(",")} entries=${keys.length} match=${hit ? (await hit.blob()).size : "MISS"}`;
  } catch (e) {
    out.cache = "throw:" + String(e && e.name);
  }
  return out;
};

const engine = ENGINE === "webkit" ? webkit : chromium;
let ctx;
let browser = null;
if (PERSISTENT) {
  ctx = await engine.launchPersistentContext(mkdtempSync(join(tmpdir(), "c11-")), {});
} else {
  browser = await engine.launch();
  ctx = await browser.newContext();
}
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: "load" });
const wrote = await page.evaluate(WRITE, 262144);
await page.waitForTimeout(2000);
await page.goto(BASE + "?probe=read", { waitUntil: "load" });
const read1 = await page.evaluate(READ);
await page.close();
const page2 = await ctx.newPage();
await page2.goto(BASE + "?probe=read2", { waitUntil: "load" });
const read2 = await page2.evaluate(READ);
console.log(
  JSON.stringify(
    { engine: ENGINE, persistent: PERSISTENT, wrote, afterNav: read1, afterNewPage: read2 },
    null,
    1,
  ),
);
await ctx.close();
if (browser) await browser.close();
