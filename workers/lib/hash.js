/**
 * SHA-256 helpers. Output is lowercase hex, no separators.
 * Hash bytes BEFORE any processing — this is the chain-of-custody commitment.
 */

export async function sha256Hex(data) {
  const buf = typeof data === 'string'
    ? new TextEncoder().encode(data)
    : data instanceof ArrayBuffer ? data : await data.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function sha256HexFromResponse(response) {
  const buf = await response.arrayBuffer();
  const hash = await sha256Hex(buf);
  return { hash, buf };
}
