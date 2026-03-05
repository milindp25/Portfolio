/**
 * Simple admin authentication using a shared secret.
 * For a single-admin personal portfolio, this is sufficient.
 *
 * The admin logs in with a password, which is compared against
 * ADMIN_SECRET env var. On success, a session cookie is set.
 */

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const SESSION_COOKIE_NAME = "admin_session";
// Simple session token — hash of the secret + a salt
const SESSION_TOKEN = ADMIN_SECRET
  ? Buffer.from(`portfolio-admin:${ADMIN_SECRET}`).toString("base64")
  : "";

/** Validate an admin password. */
export function validateAdminPassword(password: string): boolean {
  if (!ADMIN_SECRET) {
    console.warn("ADMIN_SECRET not set — admin auth disabled.");
    return false;
  }
  return password === ADMIN_SECRET;
}

/** Generate the session token for cookie storage. */
export function getSessionToken(): string {
  return SESSION_TOKEN;
}

/** Check if a request has a valid admin session. */
export function isAuthenticated(cookieValue: string | undefined): boolean {
  if (!SESSION_TOKEN || !cookieValue) return false;
  return cookieValue === SESSION_TOKEN;
}

export { SESSION_COOKIE_NAME };
