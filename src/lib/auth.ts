const SECRET = process.env.ADMIN_SESSION_SECRET || "bhaya-india-standalone-secure-session-key-2026";

// Configurable session timeout: default 12 hours (720 minutes)
const timeoutMinutes = parseInt(process.env.ADMIN_SESSION_TIMEOUT_MINUTES || "720", 10);
const SESSION_MAX_AGE_MS = (isNaN(timeoutMinutes) ? 720 : timeoutMinutes) * 60 * 1000;

// Rate limiting state: key -> { attempts: number, lockUntil: number, windowStart: number }
const rateLimitMap = new Map<string, { attempts: number; lockUntil: number; windowStart: number }>();

// Blacklist of explicitly revoked session tokens (persisted in-memory per process lifecycle)
const revokedTokens = new Set<string>();

/**
 * Checks if a specific client IP is rate-limited for admin login.
 */
export function isLoginRateLimited(ip: string): { limited: boolean; retryAfterSeconds: number } {
  return checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
}

export function recordFailedLogin(ip: string) {
  recordRateLimitAttempt(`login:${ip}`, 5, 15 * 60 * 1000);
}

export function resetLoginAttempts(ip: string) {
  rateLimitMap.delete(`login:${ip}`);
}

/**
 * General purpose rate limiter for public forms (enquiries, order tracking).
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number
): { limited: boolean; retryAfterSeconds: number } {
  const record = rateLimitMap.get(key);
  if (!record) return { limited: false, retryAfterSeconds: 0 };

  const now = Date.now();
  if (record.lockUntil > now) {
    return { limited: true, retryAfterSeconds: Math.ceil((record.lockUntil - now) / 1000) };
  }

  // Window expired
  if (now - record.windowStart > windowMs) {
    rateLimitMap.delete(key);
    return { limited: false, retryAfterSeconds: 0 };
  }

  if (record.attempts >= maxAttempts) {
    record.lockUntil = now + windowMs;
    return { limited: true, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  return { limited: false, retryAfterSeconds: 0 };
}

export function recordRateLimitAttempt(key: string, maxAttempts: number, windowMs: number) {
  const now = Date.now();
  const current = rateLimitMap.get(key);

  if (!current || now - current.windowStart > windowMs) {
    rateLimitMap.set(key, { attempts: 1, lockUntil: 0, windowStart: now });
    return;
  }

  current.attempts += 1;
  if (current.attempts >= maxAttempts) {
    current.lockUntil = now + windowMs;
  }
}

async function computeHmacSha256Hex(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Creates a cryptographically signed session token for the admin using Web Crypto.
 */
export async function createAdminSessionToken(): Promise<string> {
  const timestamp = Date.now().toString();
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const nonce = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const payload = `${timestamp}:${nonce}`;
  const signature = await computeHmacSha256Hex(payload, SECRET);
  return `${payload}:${signature}`;
}

/**
 * Revokes a session token so it cannot be used again even if not expired.
 */
export function revokeSessionToken(token: string | undefined | null) {
  if (token && typeof token === "string") {
    revokedTokens.add(token.trim());
  }
}

/**
 * Verifies a cryptographically signed admin session token.
 */
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  const trimmedToken = token.trim();
  if (revokedTokens.has(trimmedToken)) {
    return false;
  }

  const parts = trimmedToken.split(":");
  if (parts.length !== 3) return false;

  const [timestampStr, nonce, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return false;

  // Check expiration
  if (Date.now() - timestamp > SESSION_MAX_AGE_MS) {
    return false;
  }

  const payload = `${timestampStr}:${nonce}`;
  const expectedSignature = await computeHmacSha256Hex(payload, SECRET);

  if (signature.length !== expectedSignature.length) return false;
  let diff = 0;
  for (let i = 0; i < signature.length; i++) {
    diff |= signature.charCodeAt(i) ^ expectedSignature.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verifies if an incoming Request has a valid admin session.
 * Checks both Authorization header (Bearer token) and Cookie (bhaya_admin_session).
 */
export async function verifyAdminRequest(request: Request): Promise<boolean> {
  // 1. Check Authorization Bearer header
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearer = authHeader.substring(7).trim();
    if (await verifyAdminSessionToken(bearer)) return true;
  }

  // 2. Check Cookie header
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)bhaya_admin_session=([^;]+)/);
  if (match && match[1]) {
    const token = decodeURIComponent(match[1].trim());
    if (await verifyAdminSessionToken(token)) return true;
  }

  return false;
}
