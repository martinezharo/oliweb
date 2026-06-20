// Minimal stateless auth: a signed cookie (HMAC-SHA256 over an expiry
// timestamp, keyed by ADMIN_PASSWORD). No external dependencies.

export const SESSION_COOKIE = 'admin_session';
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message));
  return base64url(new Uint8Array(sig));
}

/** Constant-time string comparison. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Create a signed session token valid for TTL_MS. */
export async function createSession(password: string): Promise<string> {
  const exp = String(Date.now() + TTL_MS);
  const sig = await hmac(password, exp);
  return `${exp}.${sig}`;
}

/** Verify a session token against the configured password. */
export async function verifySession(password: string, token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot === -1) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = await hmac(password, exp);
  return safeEqual(sig, expected);
}

/** Check the submitted password against the configured one. */
export function checkPassword(password: string, attempt: string): boolean {
  return password.length > 0 && safeEqual(password, attempt);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: Math.floor(TTL_MS / 1000),
};
