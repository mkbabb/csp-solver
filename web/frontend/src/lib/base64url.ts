// base64url codec — the URL-safe base64 variant both games' `?board=` permalink codecs
// share (`+`→`-`, `/`→`_`, padding stripped; reversed on decode). Pure, DOM-free but for
// the ambient `btoa`/`atob`; identical byte-for-byte to the defs it replaced in each
// game's persistence codec.
export function toBase64Url(s: string): string {
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function fromBase64Url(s: string): string {
  const rem = s.length % 4;
  const padded = rem ? s + "=".repeat(4 - rem) : s;
  return atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
}
