// Lightweight GDPR consent helper.
// Choice is persisted in a first-party cookie so the server middleware can read
// it too (server-side visit logging is gated on the same signal).

export const CONSENT_COOKIE = '__af_consent';
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export function getConsent() {
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  if (!match) return null;
  const value = match.slice(CONSENT_COOKIE.length + 1);
  return value === 'accept' || value === 'decline' ? value : null;
}

export function setConsent(choice) {
  const value = choice === 'accept' ? 'accept' : 'decline';
  document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`;
  return value;
}

export function hasAnalyticsConsent() {
  return getConsent() === 'accept';
}
