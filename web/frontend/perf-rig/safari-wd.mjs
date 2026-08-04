#!/usr/bin/env node
// safari-wd.mjs — drive REAL desktop Safari over the W3C WebDriver protocol, quietly.
//
// THE ABROGATION (T8-W5, the owner's order). Every earlier revision of this lane forced Safari
// FRONTMOST — `osascript … activate`, a PREV_APP capture to hand the desktop back, an
// `open -a Safari` fallback, and a re-assert loop that stole the front back every 2 s for the
// life of the run. That machinery seized the owner's screen and is DELETED, not bypassed.
//
// What replaces it. `safaridriver` hosts an ISOLATED automation Safari: its own window (orange
// field), private-like state, and a GLASS PANE over the content that makes the session immune to
// stray input — the user keeps typing in their own apps and cannot perturb the run. Navigation,
// script evaluation and screenshots need NO focus and NO frontmost. Apple allows ONE session at
// a time, so this driver is serial by construction, which is what the bench wanted anyway.
//
// The problem the frontmost-forcing was actually misdiagnosing: a FULLY OCCLUDED or MINIMISED
// WebKit window has rAF throttled to a crawl, so an fps probe in one flatlines. Focus was never
// the cure for that, and it was never the tell either. The cure is:
//   1. Set Window Rect to a SMALL CORNER window that is never minimised (--rect), and
//   2. VERIFY, in-page and immediately before the burst, that the page is actually painting:
//      document.visibilityState === 'visible' AND an rAF cadence sanity probe over N frames.
// A window failing that check yields OCCLUDED-INVALID for the row. It is NEVER cured by forcing
// focus, and this file contains no osascript, no `activate`, and no `open -a`.
//
// Usage:
//   node safari-wd.mjs --url <url> [--run <id> --port <probeServerPort>]
//                      [--driver-port 4285] [--rect x,y,w,h] [--timeout 120]
//                      [--shot out.png] [--keep-session]
// Exit: 0 done · 2 driver/session unavailable · 3 timeout · 5 OCCLUDED-INVALID

import process from 'node:process';
import { Buffer } from 'node:buffer';

const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) {
    const k = a.slice(2);
    const v = process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[++i] : '1';
    args.set(k, v);
  }
}
const DRIVER_PORT = Number(args.get('driver-port') || process.env.WD_PORT || 4285);
const BASE = `http://127.0.0.1:${DRIVER_PORT}`;
const URL_ = args.get('url');
const RUN_ID = args.get('run') || '';
const PROBE_PORT = Number(args.get('port') || process.env.PORT || 4244);
const TIMEOUT_S = Number(args.get('timeout') || 120);
const RECT = (args.get('rect') || process.env.WD_RECT || '').split(',').map(Number);
const SHOT = args.get('shot') || '';
// A banked session is kept BY DEFAULT — tearing it down between bursts would cost another
// window launch, and so another activation. `--end-session` closes it on the way out.
const KEEP = args.has('keep-session') || (args.has('session-file') && !args.has('end-session'));
// The cadence gate. A visible, unoccluded window on a 60 Hz panel serves rAF at ~16.7 ms; a
// fully occluded or minimised one collapses to ~1000 ms (WebKit's background clamp) or stops.
// The floor is deliberately generous — this is an OCCLUSION detector, not a perf gate; the perf
// gate is the bench itself, and a contended box must not be mistaken for a hidden window.
const CADENCE_FRAMES = Number(args.get('cadence-frames') || 30);
const CADENCE_MAX_MS = Number(args.get('cadence-max-ms') || 120);
// `--gate compute` for scenarios that measure WORK rather than FRAMES (the solver matrix). A
// hidden window still runs JS and workers at full speed — measured on this box, fixed integer
// work took 84/84/91 ms hidden — so gating a solve burst on paint would refuse a reading that
// is perfectly sound. Frame scenarios keep the paint gate; that is the whole split.
const GATE = args.get('gate') || 'paint';

if (!URL_) {
  console.error('usage: safari-wd.mjs --url <url> [--run <id>] [--rect x,y,w,h]');
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function wd(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`${method} ${path} → non-JSON ${res.status}: ${text.slice(0, 300)}`);
  }
  if (!res.ok || (json.value && json.value.error)) {
    const v = json.value || {};
    const err = new Error(`${method} ${path} → ${v.error || res.status}: ${(v.message || '').slice(0, 400)}`);
    err.wd = v;
    throw err;
  }
  return json.value;
}

async function driverReady() {
  try {
    const v = await wd('GET', '/status');
    return !!(v && v.ready);
  } catch {
    return false;
  }
}

// ONE ACTIVATION FOR THE WHOLE BENCH. Creating a session launches the automation Safari, and
// that launch raises its window once — the single activation the owner allowed. A matrix of 20
// bursts must not spend 20 of them, so the session id is banked in a file and reused while it
// is still alive; only the last burst tears it down (--end-session).
const SESSION_FILE = args.get('session-file') || '';
async function sessionAlive(id) {
  try {
    await wd('GET', `/session/${id}/url`);
    return true;
  } catch {
    return false;
  }
}

let sessionId = null;
async function endSession() {
  if (sessionId && !KEEP) {
    try {
      await wd('DELETE', `/session/${sessionId}`);
    } catch { /* the session may already be gone; never fail a run on teardown */ }
    if (SESSION_FILE) {
      try {
        (await import('node:fs')).rmSync(SESSION_FILE, { force: true });
      } catch { /* the bank is a convenience, not a record */ }
    }
    sessionId = null;
  }
}
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, async () => {
    await endSession();
    process.exit(3);
  });
}

/** Is this window actually PAINTING? visibility + a real rAF cadence, read from inside the page.
 *  Returns {visible, hidden, ms, frames, ok}. No focus is consulted and none is taken. */
const CADENCE_JS = `
const [n, budget] = arguments;
const done = arguments[arguments.length - 1];
if (document.visibilityState !== 'visible') {
  done({ ok: false, why: 'visibilityState=' + document.visibilityState, visibility: document.visibilityState });
} else {
  const ts = [];
  let last = performance.now();
  const tick = () => {
    const t = performance.now();
    ts.push(t - last);
    last = t;
    if (ts.length < n) requestAnimationFrame(tick);
    else {
      const sorted = ts.slice().sort((a, b) => a - b);
      const p50 = sorted[Math.floor(sorted.length / 2)];
      done({
        ok: p50 <= budget,
        why: p50 <= budget ? '' : 'rAF p50 ' + p50.toFixed(1) + 'ms > ' + budget + 'ms — occluded or minimised',
        p50: Number(p50.toFixed(2)),
        worst: Number(sorted[sorted.length - 1].toFixed(2)),
        frames: ts.length,
        visibility: document.visibilityState,
        hasFocus: document.hasFocus(),
      });
    }
  };
  requestAnimationFrame(tick);
}
`;

async function paintGate() {
  return wd('POST', `/session/${sessionId}/execute/async`, {
    script: CADENCE_JS,
    args: [CADENCE_FRAMES, CADENCE_MAX_MS],
  });
}

async function main() {
  if (!(await driverReady())) {
    console.error(`safaridriver is not answering on ${BASE}.`);
    console.error('  start it:  safaridriver -p ' + DRIVER_PORT);
    console.error('  if it refuses, Remote Automation is off — the owner must enable it ONCE:');
    console.error('    Safari ▸ Settings ▸ Advanced ▸ "Show features for web developers",');
    console.error('    then Develop ▸ "Allow Remote Automation"   (or: safaridriver --enable)');
    process.exit(2);
  }

  const fsm = await import('node:fs');
  if (SESSION_FILE && fsm.existsSync(SESSION_FILE)) {
    const banked = fsm.readFileSync(SESSION_FILE, 'utf8').trim();
    if (banked && (await sessionAlive(banked))) {
      sessionId = banked;
      console.log(`AUDIT: safari-wd — REUSING session ${sessionId} (no new window, no activation)`);
    }
  }

  try {
    if (!sessionId) {
      const v = await wd('POST', '/session', {
        capabilities: {
          alwaysMatch: {
            browserName: 'Safari',
            // No automatic-inspection/-profiling: both raise a window and steal attention.
            'safari:automaticInspection': false,
            'safari:automaticProfiling': false,
          },
        },
      });
      sessionId = v.sessionId;
      if (SESSION_FILE) fsm.writeFileSync(SESSION_FILE, sessionId);
      console.log(`AUDIT: safari-wd — session ${sessionId} · Safari ${v.capabilities?.browserVersion || '?'} · automation window (isolated, glass-paned) · ONE activation, here`);
    }
  } catch (e) {
    console.error('session refused: ' + e.message);
    if (/not allowed|Remote Automation|prohibited/i.test(e.message)) {
      console.error('  → OWNER ACTION: Safari ▸ Develop ▸ "Allow Remote Automation" (one click, once).');
    }
    process.exit(2);
  }

  try {
    // A SMALL CORNER window, never minimised. Not frontmost — never asked to be.
    if (RECT.length === 4 && RECT.every((n) => Number.isFinite(n))) {
      const [x, y, width, height] = RECT;
      const got = await wd('POST', `/session/${sessionId}/window/rect`, { x, y, width, height });
      console.log(`AUDIT: window rect ${got.width}×${got.height} @ ${got.x},${got.y} (corner window; NOT frontmost, NOT minimised)`);
    }

    await wd('POST', `/session/${sessionId}/url`, { url: URL_ });

    // The gate, immediately before the burst — and the burst is the probe, which the page
    // drives itself and posts to the probe server. Nothing here needs focus.
    const gate = GATE === 'compute'
      ? { ok: true, mode: 'compute', note: 'frames not measured here; a hidden window computes at full speed' }
      : await paintGate();
    if (GATE === 'compute') {
      console.log('AUDIT: compute gate — this burst measures work, not frames; no visibility required');
    } else {
      console.log(`AUDIT: paint gate — visibility=${gate.visibility} rAF p50=${gate.p50 ?? '—'}ms worst=${gate.worst ?? '—'}ms over ${gate.frames ?? 0} frames · hasFocus=${gate.hasFocus} · ${gate.ok ? 'PAINTING' : 'OCCLUDED-INVALID'}`);
    }
    if (!gate.ok) {
      console.error(`OCCLUDED-INVALID: ${gate.why}`);
      console.error('  the row is invalid; it is NOT cured by forcing focus. Move or unminimise nothing —');
      console.error('  rerun with a --rect that lands on a visible corner of the display.');
      if (RUN_ID) {
        console.log(JSON.stringify({ runId: RUN_ID, kind: 'paintGate', ...gate, verdict: 'OCCLUDED-INVALID' }));
      }
      await endSession();
      process.exit(5);
    }
    if (RUN_ID) {
      console.log(JSON.stringify({ runId: RUN_ID, kind: 'paintGate', ...gate, verdict: 'PAINTING' }));
    }

    // Poll the probe server for the run's own completion line. The page posts every scenario;
    // this driver never reaches in to read them.
    let status = 3;
    if (RUN_ID) {
      const deadline = Date.now() + TIMEOUT_S * 1000;
      while (Date.now() < deadline) {
        try {
          const r = await fetch(`http://localhost:${PROBE_PORT}/__runs/${RUN_ID}`);
          if (r.ok && (await r.text()).includes('"done":true')) {
            status = 0;
            break;
          }
        } catch { /* the server is a sibling process; a blip is not a verdict */ }
        await sleep(2000);
      }
      console.log(status === 0 ? `run ${RUN_ID} complete` : `run ${RUN_ID} TIMED OUT after ${TIMEOUT_S}s (partial lines kept)`);
    } else {
      status = 0;
    }

    // A closing gate: if the window went dark mid-run the numbers are about occlusion.
    const after = GATE === 'compute'
      ? { ok: true, mode: 'compute' }
      : await paintGate().catch((e) => ({ ok: false, why: e.message }));
    if (!after.ok) {
      console.error(`OCCLUDED-INVALID (closing gate): ${after.why} — the window stopped painting DURING the run`);
      if (RUN_ID) console.log(JSON.stringify({ runId: RUN_ID, kind: 'paintGateClose', ...after, verdict: 'OCCLUDED-INVALID' }));
      status = status === 0 ? 5 : status;
    } else if (RUN_ID) {
      console.log(JSON.stringify({ runId: RUN_ID, kind: 'paintGateClose', ...after, verdict: 'PAINTING' }));
    }

    if (SHOT) {
      const b64 = await wd('GET', `/session/${sessionId}/screenshot`);
      const fs = await import('node:fs');
      fs.writeFileSync(SHOT, Buffer.from(b64, 'base64'));
      console.log(`AUDIT: screenshot → ${SHOT}`);
    }

    await endSession();
    process.exit(status);
  } catch (e) {
    console.error('driver error: ' + e.message);
    await endSession();
    process.exit(2);
  }
}

main();
