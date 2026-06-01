// Consent-aware, batched page-engagement tracker.
//
// "Pages" on this site are client-side overlays, so navigations are invisible to
// the server. This module measures dwell time per virtual page (visible time
// only) and ships it to /api/track in batched beacons — at most one KV write per
// flush — and only ever runs after the visitor accepts analytics.

import { hasAnalyticsConsent } from './consent';

const ENDPOINT = '/api/track';
const FLUSH_EVERY = 5; // flush queued page events once this many accumulate
const MAX_DWELL_MS = 30 * 60 * 1000; // cap a single page at 30 min
const MIN_DWELL_MS = 1000; // ignore sub-second glances as noise

let started = false;
let sessionId = null;
let queue = [];

// Current-page dwell accounting (visible time only).
let currentPath = null;
let segmentStart = 0; // performance.now() when current visible segment began
let accumulatedMs = 0; // visible ms banked for the current page so far
let isVisible = true;

function now() {
  return performance.now();
}

function getSessionId() {
  try {
    let id = sessionStorage.getItem('__af_sid');
    if (!id) {
      id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      sessionStorage.setItem('__af_sid', id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

function post(payload) {
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, blob);
    } else {
      fetch(ENDPOINT, { method: 'POST', body: blob, keepalive: true }).catch(() => {});
    }
  } catch {
    // never let analytics throw into the app
  }
}

function send(payload) {
  if (!hasAnalyticsConsent()) return;
  post(payload);
}

function flush() {
  if (!queue.length || !hasAnalyticsConsent()) return;
  const events = queue;
  queue = [];
  send({ v: 1, type: 'batch', session: sessionId, events });
}

// Bank the visible time spent on the current page and reset the segment clock.
function bankCurrentSegment() {
  if (currentPath === null) return;
  if (isVisible) {
    accumulatedMs += now() - segmentStart;
    segmentStart = now();
  }
}

// Finalize the current page: queue its dwell, optionally flushing.
function closeCurrentPage(forceFlush) {
  if (currentPath === null) return;
  bankCurrentSegment();
  const dwellMs = Math.min(Math.round(accumulatedMs), MAX_DWELL_MS);
  if (dwellMs >= MIN_DWELL_MS) {
    queue.push({ path: currentPath, dwellMs });
  }
  accumulatedMs = 0;
  if (forceFlush || queue.length >= FLUSH_EVERY) flush();
}

function handleVisibility() {
  if (document.visibilityState === 'hidden') {
    bankCurrentSegment();
    isVisible = false;
    flush(); // ship what we have; page may not come back
  } else {
    isVisible = true;
    segmentStart = now();
  }
}

function handlePageHide() {
  closeCurrentPage(true);
}

// Record a navigation to `path`. Closes out the previous page first.
export function trackPage(path) {
  if (!hasAnalyticsConsent()) return;
  if (!started) startTracking();
  if (path === currentPath) return;
  closeCurrentPage(false);
  currentPath = path;
  accumulatedMs = 0;
  segmentStart = now();
  isVisible = document.visibilityState !== 'hidden';
}

// Begin tracking (idempotent). Call right after consent is accepted.
export function startTracking() {
  if (started) return;
  started = true;
  sessionId = getSessionId();
  isVisible = document.visibilityState !== 'hidden';
  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('pagehide', handlePageHide);
}

// Record the consent decision itself (no session, geo, or path — counts only).
export function recordConsent(choice) {
  post({ v: 1, type: 'consent', choice: choice === 'accept' ? 'accept' : 'decline' });
}
