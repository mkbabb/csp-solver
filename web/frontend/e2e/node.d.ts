// The node runtime, as narrowly as `e2e/` uses it (T9-W6 §6.2).
//
// WHY THIS AND NOT `@types/node`. The package is not installed and adding it is not a free
// act: `tsconfig.json` declares no `types` field, so every `@types/*` on disk is ambient in
// the APP's typecheck too — `process`, `Buffer` and the whole node global surface would
// silently become available to `src/**`, which is browser code. Widening the app's ambient
// types is a ruling, and a ruling lands with the chair (handoff 6b-1 carries the seam).
//
// WHY NARROW IS NOT A COMPROMISE HERE. These declarations are the six functions and two
// globals the estate calls, in the exact shapes it calls them. A call this file cannot type
// is a RED, not a silent pass — which is the behaviour a gate wants. `readFileSync` without an
// encoding returns bytes in real node and a string under a loose shim; here it does not
// compile at all until someone declares what they meant.
//
// The same discipline `web/relay/relay.ts` keeps for the Cloudflare runtime, one directory
// over: declare what you touch, and let the compiler refuse the rest.

declare module 'node:fs' {
  /** `readFileSync(abs, 'utf8')` — the only form the estate calls. */
  export function readFileSync(path: string, encoding: 'utf8'): string
  export function readdirSync(path: string): string[]
  export function statSync(path: string): { isDirectory(): boolean }
}

declare module 'node:path' {
  export function join(...parts: string[]): string
  export function relative(from: string, to: string): string
  export function dirname(path: string): string
}

declare module 'node:url' {
  export function fileURLToPath(url: string | URL): string
}

/** `process.env.<NAME>` and `process.platform` — the two members the specs read. */
declare const process: {
  readonly env: Readonly<Record<string, string | undefined>>
  readonly platform: string
}

/** `Buffer.from(base64, 'base64')` — attached to a Playwright report as PNG bytes. */
declare const Buffer: {
  from(data: string, encoding: 'base64'): Uint8Array
}
