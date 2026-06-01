const COOKIE_NAME = '__af_auth';
const STATS_COOKIE_NAME = '__af_stats';
const CONSENT_COOKIE_NAME = '__af_consent';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// Simple hash function for password comparison (not crypto-grade, but password never leaves server)
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Pre-computed SHA-256 of the password — set via: echo -n "PASSWORD" | shasum -a 256
const PASSWORD_HASH = '41981d7b62b6b27ab401e18ddb39c81f647713ba29488a32a35570007e064dae';
const STATS_PASSWORD_HASH = 'a5ecd886ee15a49afea6d61e45074e80f5ec9ad903e40d454ced730e0e19581f';

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Required</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Space+Grotesk:wght@700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      color: #fff;
      font-family: 'IBM Plex Mono', monospace;
    }

    .gate {
      text-align: center;
      max-width: 380px;
      padding: 24px;
    }

    .gate__mark {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 48px;
      font-weight: 700;
      font-style: italic;
      letter-spacing: -0.03em;
      color: #c6ef4d;
      margin-bottom: 32px;
    }

    .gate__label {
      font-size: 13px;
      color: rgba(255,255,255,0.4);
      margin-bottom: 12px;
    }

    .gate__input {
      width: 100%;
      padding: 12px 16px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      color: #fff;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 15px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .gate__input:focus {
      border-color: #c6ef4d;
    }

    .gate__btn {
      margin-top: 16px;
      width: 100%;
      padding: 12px;
      background: #c6ef4d;
      color: #0a0a0a;
      border: none;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }

    .gate__btn:hover { opacity: 0.85; }

    .gate__error {
      margin-top: 12px;
      font-size: 13px;
      color: #f87171;
      display: none;
    }

    .gate__error--show { display: block; }
  </style>
</head>
<body>
  <form class="gate" method="POST">
    <div class="gate__mark">AF</div>
    <p class="gate__label">Enter password to continue</p>
    <input class="gate__input" type="password" name="password" placeholder="Password" autofocus autocomplete="current-password" />
    <button class="gate__btn" type="submit">Enter</button>
    <p class="gate__error" id="error">Incorrect password</p>
  </form>
  <script>
    const params = new URLSearchParams(window.location.search);
    if (params.get('error') === '1') {
      document.getElementById('error').classList.add('gate__error--show');
    }
  </script>
</body>
</html>`;

const STATS_LOGIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stats Access</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Space+Grotesk:wght@700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: #0a0e0c; font-family: 'IBM Plex Mono', monospace; color: #e0e0e0;
    }
    .gate { text-align: center; max-width: 320px; width: 90%; }
    .gate__mark { font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: #c6ef4d; margin-bottom: 8px; }
    .gate__sub { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 32px; }
    .gate__input {
      width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.15); color: #fff; font-family: inherit;
      font-size: 14px; outline: none; transition: border-color 0.2s;
    }
    .gate__input:focus { border-color: #c6ef4d; }
    .gate__btn {
      width: 100%; padding: 12px; margin-top: 12px; background: #c6ef4d;
      border: none; color: #00330f; font-family: inherit; font-size: 14px;
      font-weight: 500; cursor: pointer; transition: opacity 0.2s;
    }
    .gate__btn:hover { opacity: 0.9; }
    .gate__error { font-size: 12px; color: #ff6b6b; margin-top: 12px; display: none; }
    .gate__error--show { display: block; }
  </style>
</head>
<body>
  <form class="gate" method="POST" action="/stats">
    <div class="gate__mark">Analytics</div>
    <p class="gate__sub">Enter stats password</p>
    <input class="gate__input" type="password" name="password" placeholder="Password" autofocus autocomplete="off" />
    <button class="gate__btn" type="submit">View stats</button>
    <p class="gate__error" id="error">Incorrect password</p>
  </form>
</body>
</html>`;

// Known AI/scraper bot user-agent patterns
const BOT_PATTERNS = [
  'GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'anthropic-ai',
  'ClaudeBot', 'Bytespider', 'Applebot-Extended', 'cohere-ai',
  'PerplexityBot', 'Amazonbot', 'YouBot', 'Diffbot', 'Omgilibot',
  'Timpibot', 'Scrapy', 'wget', 'curl', 'python-requests',
];

// ── Rate limiting config (login only — general removed to save KV ops) ──
const RATE_LIMITS = {
  login:   { max: 5,  windowSec: 60 },   // 5 login attempts/min for main site
  loginStats: { max: 3, windowSec: 300 }, // 3 login attempts per 5 min for stats
};

const RATE_LIMIT_HTML = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rate Limited</title>
<style>
  body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#fff;font-family:'IBM Plex Mono',monospace;text-align:center;padding:24px}
  h1{font-size:48px;color:#c6ef4d;margin-bottom:16px}
  p{color:rgba(255,255,255,0.5);font-size:14px}
</style></head>
<body><div><h1>429</h1><p>Too many requests. Please wait a moment and try again.</p></div></body></html>`;

async function checkRateLimit(kv, ip, bucket, limit) {
  if (!kv) return { allowed: true };
  const key = `rl:${bucket}:${ip}`;
  const current = parseInt(await kv.get(key) || '0');
  if (current >= limit.max) {
    return { allowed: false, remaining: 0 };
  }
  // Increment — use short TTL matching the window
  await kv.put(key, String(current + 1), { expirationTtl: limit.windowSec });
  return { allowed: true, remaining: limit.max - current - 1 };
}

export async function onRequest(context) {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Block known AI scrapers / bots
  const ua = request.headers.get('User-Agent') || '';
  if (BOT_PATTERNS.some(bot => ua.toLowerCase().includes(bot.toLowerCase()))) {
    return new Response('Forbidden', { status: 403 });
  }

  // Analytics beacon endpoint — handled before login rate-limiting so batched
  // POST beacons from authed visitors are never throttled as login attempts.
  if ((url.pathname === '/api/track' || url.pathname === '/api/track/') && request.method === 'POST') {
    return handleTrack(env, request, url);
  }

  // Get client IP for rate limiting
  const clientIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'unknown';

  // Rate limit login attempts only (POST to / or /stats) — saves KV ops
  if (request.method === 'POST') {
    const isStats = url.pathname === '/stats' || url.pathname === '/stats/';
    const bucket = isStats ? 'login-stats' : 'login-main';
    const limit = isStats ? RATE_LIMITS.loginStats : RATE_LIMITS.login;
    const rl = await checkRateLimit(env.VISITS, clientIP, bucket, limit);
    if (!rl.allowed) {
      return new Response(RATE_LIMIT_HTML, {
        status: 429,
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Retry-After': String(limit.windowSec),
        },
      });
    }
  }

  // Use env variable if set, fall back to embedded hash
  const expectedHash = (env.PASSWORD_HASH || PASSWORD_HASH).trim();

  // Check for auth cookie
  const cookie = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookie.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );

  const isAuthed = cookies[COOKIE_NAME] === expectedHash;
  const isStatsAuthed = cookies[STATS_COOKIE_NAME] === STATS_PASSWORD_HASH;

  // Stats dashboard — separate password
  if (url.pathname === '/stats' || url.pathname === '/stats/') {
    if (!isAuthed) {
      return new Response(LOGIN_HTML, { status: 401, headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
    }
    if (isStatsAuthed && env.VISITS) {
      return handleStats(env.VISITS);
    }
    // Stats login POST
    if (request.method === 'POST') {
      const formData = await request.formData();
      const password = formData.get('password') || '';
      const hash = await sha256(password);
      if (hash === STATS_PASSWORD_HASH) {
        return new Response(null, {
          status: 302,
          headers: {
            Location: '/stats',
            'Set-Cookie': `${STATS_COOKIE_NAME}=${hash}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
          },
        });
      }
      return new Response(STATS_LOGIN_HTML.replace('id="error"', 'id="error" class="gate__error--show"'), {
        status: 401, headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }
    return new Response(STATS_LOGIN_HTML, {
      status: 401, headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }

  if (isAuthed) {
    // Track page visit (non-blocking) — only with analytics consent (GDPR)
    if (env.VISITS && request.method === 'GET' && cookies[CONSENT_COOKIE_NAME] === 'accept' &&
        !url.pathname.match(/\.(js|css|png|jpg|svg|ico|woff2?)$/)) {
      context.waitUntil(trackVisit(env.VISITS, request));
    }
    const response = await next();
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex');
    return newResponse;
  }

  // Handle POST (login attempt)
  if (request.method === 'POST') {
    const formData = await request.formData();
    const password = formData.get('password') || '';
    const hash = await sha256(password);

    if (hash === expectedHash) {
      // Set cookie and redirect to requested page
      const response = new Response(null, {
        status: 302,
        headers: {
          Location: url.pathname + url.search,
          'Set-Cookie': `${COOKIE_NAME}=${hash}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`,
        },
      });
      return response;
    }

    // Wrong password — show login with error
    return new Response(LOGIN_HTML.replace('?error=1', '').replace('id="error"', 'id="error" class="gate__error--show"'), {
      status: 401,
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }

  // Show login page
  return new Response(LOGIN_HTML, {
    status: 401,
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}

// ── Analytics beacon handler (batched client events: dwell per virtual page) ──
function invKey() {
  // Inverted timestamp so kv.list() returns newest entries first.
  return String(1e15 - Date.now()).padStart(16, '0') + ':' + Math.random().toString(36).slice(2, 6);
}

async function handleTrack(env, request, url) {
  const kv = env.VISITS;

  // Same-origin only — cheap CSRF guard for the cookie-authed endpoint.
  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) {
    return new Response(null, { status: 403 });
  }

  // Require the site auth cookie (the whole site is gated).
  const cookieHeader = request.headers.get('Cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const [k, ...v] = c.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const expectedHash = (env.PASSWORD_HASH || PASSWORD_HASH).trim();
  if (cookies[COOKIE_NAME] !== expectedHash) {
    return new Response(null, { status: 401 });
  }

  // Bounded body, then parse.
  const text = await request.text();
  if (text.length > 4096) return new Response(null, { status: 413 });
  let data;
  try { data = JSON.parse(text); } catch { return new Response(null, { status: 400 }); }
  if (!data || typeof data !== 'object') return new Response(null, { status: 400 });

  if (!kv) return new Response(null, { status: 204 });
  const time = new Date().toISOString();

  // Consent decisions: a non-identifying count only (no session, geo, or path).
  if (data.type === 'consent') {
    const choice = data.choice === 'accept' ? 'accept' : 'decline';
    await kv.put(`event:${invKey()}`, JSON.stringify({ v: 1, type: 'consent', choice, time }),
      { expirationTtl: 60 * 60 * 24 * 90 });
    return new Response(null, { status: 204 });
  }

  // Batched page-engagement events → a single KV write.
  if (data.type === 'batch' && Array.isArray(data.events)) {
    const MAX_DWELL = 30 * 60 * 1000;
    const events = data.events.slice(0, 20).map(e => ({
      path: String(e && e.path || '/').slice(0, 120),
      dwellMs: Math.max(0, Math.min(Number(e && e.dwellMs) || 0, MAX_DWELL)),
    })).filter(e => e.dwellMs > 0);
    if (!events.length) return new Response(null, { status: 204 });
    const country = request.headers.get('CF-IPCountry') || '??';
    const region = (request.cf && request.cf.region) ? String(request.cf.region).slice(0, 60) : '';
    await kv.put(`event:${invKey()}`, JSON.stringify({
      v: 1, type: 'batch', session: String(data.session || '').slice(0, 40),
      time, country, region, events,
    }), { expirationTtl: 60 * 60 * 24 * 90 });
    return new Response(null, { status: 204 });
  }

  return new Response(null, { status: 400 });
}

// ── Visit tracking (optimized: single KV write per visit) ──
async function trackVisit(kv, request) {
  const now = new Date();
  const dateKey = now.toISOString().slice(0, 10); // YYYY-MM-DD
  const ua = request.headers.get('User-Agent') || 'unknown';
  const country = request.headers.get('CF-IPCountry') || '??';
  const path = new URL(request.url).pathname;
  const referer = request.headers.get('Referer') || '';

  // Store only the visit log entry — counters are computed on-read from visit logs
  const visitId = `visit:${now.toISOString()}:${Math.random().toString(36).slice(2, 6)}`;
  await kv.put(visitId, JSON.stringify({
    time: now.toISOString(),
    date: dateKey,
    path,
    country,
    ua: ua.slice(0, 200),
    referer: referer.slice(0, 200),
  }), { expirationTtl: 60 * 60 * 24 * 90 }); // 90 days
}

// ── Stats dashboard ──
async function handleStats(kv) {
  const now = new Date();
  const days = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  // Fetch ALL visit logs in one list call (single KV op) and compute everything from them
  const visitList = await kv.list({ prefix: 'visit:', limit: 1000 });
  const allVisits = [];
  // Batch-read visit values (each is 1 KV read, but we limit to 200 to stay efficient)
  const keysToRead = visitList.keys.slice(0, 200);
  const visitPromises = keysToRead.map(key => kv.get(key.name));
  const visitValues = await Promise.all(visitPromises);
  for (const val of visitValues) {
    if (val) {
      try { allVisits.push(JSON.parse(val)); } catch(e) {}
    }
  }
  allVisits.sort((a, b) => b.time.localeCompare(a.time));

  // Compute daily counts from visit logs
  const dailyCountMap = {};
  const countryTotals = {};
  const pathTotals = {};
  for (const v of allVisits) {
    const d = v.date || v.time?.slice(0, 10);
    if (d) dailyCountMap[d] = (dailyCountMap[d] || 0) + 1;
    if (v.country && v.country !== '??') {
      countryTotals[v.country] = (countryTotals[v.country] || 0) + 1;
    }
    if (v.path) {
      pathTotals[v.path] = (pathTotals[v.path] || 0) + 1;
    }
  }

  // Also read legacy counter keys for historical data (parallel reads)
  const legacyCountPromises = days.map(day => kv.get(`count:${day}`));
  const legacyCounts = await Promise.all(legacyCountPromises);

  const dailyCounts = days.map((day, i) => ({
    date: day,
    count: (dailyCountMap[day] || 0) + parseInt(legacyCounts[i] || '0'),
  }));

  const sortedPaths = Object.entries(pathTotals).sort((a,b) => b[1] - a[1]);
  const recentVisits = allVisits.slice(0, 50);

  // ── Engagement events (client beacons: dwell per virtual page, consent) ──
  // Inverted keys → list returns newest first, so the capped sample is recent.
  const eventList = await kv.list({ prefix: 'event:', limit: 1000 });
  const eventValues = await Promise.all(eventList.keys.slice(0, 200).map(k => kv.get(k.name)));
  const pageDwell = {};        // path → { totalMs, views }
  const sessionDwell = {};     // session → total visible ms
  const regionTotals = {};     // "Region, CC" → count
  const consentCounts = { accept: 0, decline: 0 };
  let trackedPageviews = 0;
  for (const val of eventValues) {
    if (!val) continue;
    let ev; try { ev = JSON.parse(val); } catch { continue; }
    if (ev.type === 'consent') {
      if (ev.choice === 'accept' || ev.choice === 'decline') consentCounts[ev.choice]++;
      continue;
    }
    if (ev.type === 'batch' && Array.isArray(ev.events)) {
      if (ev.region && ev.country && ev.country !== '??') {
        const label = `${ev.region}, ${ev.country}`;
        regionTotals[label] = (regionTotals[label] || 0) + 1;
      }
      for (const e of ev.events) {
        if (!e || !e.path) continue;
        trackedPageviews++;
        const d = pageDwell[e.path] || { totalMs: 0, views: 0 };
        d.totalMs += e.dwellMs || 0;
        d.views++;
        pageDwell[e.path] = d;
        if (ev.session) sessionDwell[ev.session] = (sessionDwell[ev.session] || 0) + (e.dwellMs || 0);
      }
    }
  }
  const sessionDurations = Object.values(sessionDwell);
  const avgSessionMs = sessionDurations.length
    ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length : 0;
  const allDwellMs = Object.values(pageDwell).reduce((a, d) => a + d.totalMs, 0);
  const avgPageMs = trackedPageviews ? allDwellMs / trackedPageviews : 0;
  const topDwellPages = Object.entries(pageDwell)
    .sort((a, b) => (b[1].totalMs / b[1].views) - (a[1].totalMs / a[1].views));
  const sortedRegions = Object.entries(regionTotals).sort((a, b) => b[1] - a[1]);
  const totalConsent = consentCounts.accept + consentCounts.decline;

  // ms → "1m 20s" / "45s"
  function fmtDur(ms) {
    const s = Math.round(ms / 1000);
    if (s < 60) return s + 's';
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return rem ? `${m}m ${rem}s` : `${m}m`;
  }

  // Compute stats
  const totalLast30 = dailyCounts.reduce((sum, d) => sum + d.count, 0);
  const totalToday = dailyCounts[0]?.count || 0;
  const totalLast7 = dailyCounts.slice(0, 7).reduce((sum, d) => sum + d.count, 0);
  const totalPrev7 = dailyCounts.slice(7, 14).reduce((sum, d) => sum + d.count, 0);
  const uniqueCountries = Object.keys(countryTotals).length;
  const avgPerDay = totalLast30 > 0 ? (totalLast30 / 30).toFixed(1) : '0';
  const peakDay = dailyCounts.reduce((best, d) => d.count > best.count ? d : best, { date: '-', count: 0 });
  const trend7 = totalPrev7 > 0 ? (((totalLast7 - totalPrev7) / totalPrev7) * 100).toFixed(0) : (totalLast7 > 0 ? '+100' : '0');
  const trendSign = Number(trend7) >= 0 ? '+' : '';

  // Device breakdown from recent visits
  const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
  recentVisits.forEach(v => {
    if (v.ua.includes('Tablet') || v.ua.includes('iPad')) devices.Tablet++;
    else if (v.ua.includes('Mobile') || v.ua.includes('Android')) devices.Mobile++;
    else devices.Desktop++;
  });
  const totalDevices = Math.max(Object.values(devices).reduce((a,b) => a + b, 0), 1);

  const maxCount = Math.max(...dailyCounts.map(d => d.count), 1);

  // Country names
  const countryNames = {
    US:'United States',CA:'Canada',MX:'Mexico',BR:'Brazil',AR:'Argentina',
    GB:'United Kingdom',FR:'France',DE:'Germany',NL:'Netherlands',BE:'Belgium',
    ES:'Spain',IT:'Italy',PT:'Portugal',CH:'Switzerland',AT:'Austria',
    SE:'Sweden',NO:'Norway',DK:'Denmark',FI:'Finland',PL:'Poland',
    CZ:'Czechia',IE:'Ireland',RO:'Romania',HU:'Hungary',GR:'Greece',
    UA:'Ukraine',RU:'Russia',TR:'Turkey',IL:'Israel',AE:'UAE',
    SA:'Saudi Arabia',QA:'Qatar',KW:'Kuwait',BH:'Bahrain',OM:'Oman',
    IN:'India',PK:'Pakistan',BD:'Bangladesh',LK:'Sri Lanka',NP:'Nepal',
    CN:'China',JP:'Japan',KR:'South Korea',TW:'Taiwan',HK:'Hong Kong',
    SG:'Singapore',MY:'Malaysia',TH:'Thailand',VN:'Vietnam',ID:'Indonesia',
    PH:'Philippines',AU:'Australia',NZ:'New Zealand',
    ZA:'South Africa',NG:'Nigeria',KE:'Kenya',EG:'Egypt',GH:'Ghana',
    MA:'Morocco',ET:'Ethiopia',TZ:'Tanzania',UG:'Uganda',CI:"Ivory Coast",
    SN:'Senegal',CO:'Colombia',CL:'Chile',PE:'Peru',VE:'Venezuela',
    EC:'Ecuador',BO:'Bolivia',PY:'Paraguay',UY:'Uruguay',
    TT:'Trinidad',JM:'Jamaica',PR:'Puerto Rico',DO:'Dominican Rep.',
    LT:'Lithuania',LV:'Latvia',EE:'Estonia',BG:'Bulgaria',HR:'Croatia',
    RS:'Serbia',SK:'Slovakia',SI:'Slovenia',
    GE:'Georgia',AZ:'Azerbaijan',AM:'Armenia',KZ:'Kazakhstan',UZ:'Uzbekistan',
  };

  // Country coords for Leaflet
  const countryCoords = {
    US:[39.8,-98.6],CA:[56.1,-106.3],MX:[23.6,-102.6],BR:[-14.2,-51.9],AR:[-38.4,-63.6],
    GB:[55.4,-3.4],FR:[46.2,2.2],DE:[51.2,10.4],NL:[52.1,5.3],BE:[50.5,4.5],
    ES:[40.5,-3.7],IT:[41.9,12.5],PT:[39.4,-8.2],CH:[46.8,8.2],AT:[47.5,13.4],
    SE:[60.1,18.6],NO:[60.5,8.5],DK:[56.3,9.5],FI:[61.9,25.7],PL:[51.9,19.1],
    CZ:[49.8,15.5],IE:[53.1,-7.7],RO:[45.9,25.0],HU:[47.2,19.5],GR:[39.1,21.8],
    UA:[48.4,31.2],RU:[61.5,105.3],TR:[39.9,32.9],IL:[31.0,34.9],AE:[23.4,53.8],
    SA:[23.9,45.1],QA:[25.4,51.2],KW:[29.3,47.5],BH:[26.1,50.6],OM:[21.5,55.9],
    IN:[20.6,79.0],PK:[30.4,69.3],BD:[23.7,90.4],LK:[7.9,80.8],NP:[28.4,84.1],
    CN:[35.9,104.2],JP:[36.2,138.3],KR:[35.9,127.8],TW:[23.7,121.0],HK:[22.3,114.2],
    SG:[1.4,103.8],MY:[4.2,101.9],TH:[15.9,100.9],VN:[14.1,108.3],ID:[-0.8,113.9],
    PH:[12.9,121.8],AU:[-25.3,133.8],NZ:[-40.9,174.9],
    ZA:[-30.6,22.9],NG:[9.1,8.7],KE:[-0.0,37.9],EG:[26.8,30.8],GH:[7.9,-1.0],
    MA:[31.8,-7.1],ET:[9.1,40.5],TZ:[-6.4,34.9],UG:[1.4,32.3],CI:[7.5,-5.5],
    SN:[14.5,-14.5],CO:[4.6,-74.3],CL:[-35.7,-71.5],PE:[-9.2,-75.0],VE:[6.4,-66.6],
    EC:[-1.8,-78.2],BO:[-16.3,-63.6],PY:[-23.4,-58.4],UY:[-32.5,-55.8],
    TT:[10.7,-61.2],JM:[18.1,-77.3],PR:[18.2,-66.6],DO:[18.7,-70.2],
    LT:[55.2,24.0],LV:[56.9,24.1],EE:[58.6,25.0],BG:[42.7,25.5],HR:[45.1,15.2],
    RS:[44.0,21.0],SK:[48.7,19.7],SI:[46.2,14.8],
    GE:[42.3,43.4],AZ:[40.1,47.6],AM:[40.1,45.0],
    KZ:[48.0,68.0],UZ:[41.4,64.6],
  };

  const sortedCountries = Object.entries(countryTotals).sort((a,b) => b[1] - a[1]);
  const maxCountryVisits = sortedCountries.length > 0 ? sortedCountries[0][1] : 1;

  const mapMarkers = sortedCountries
    .filter(([cc]) => countryCoords[cc])
    .map(([cc, count]) => ({
      lat: countryCoords[cc][0],
      lng: countryCoords[cc][1],
      cc,
      name: countryNames[cc] || cc,
      count,
      r: Math.max(6, Math.min(20, (count / maxCountryVisits) * 20)),
    }));

  // Relative time helper
  function relTime(iso) {
    const diff = (now - new Date(iso)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analytics — theakwasi.com</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'IBM Plex Mono', monospace;
      background: #080b09;
      color: #d4d4d4;
      min-height: 100vh;
    }

    a { color: #c6ef4d; text-decoration: none; }
    a:hover { text-decoration: underline; }

    /* ── Top bar ── */
    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 32px;
      border-bottom: none;
      background: rgba(255,255,255,0.02);
    }
    .topbar__brand {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700; font-size: 18px; color: #c6ef4d;
      font-style: italic; letter-spacing: -0.02em;
    }
    .topbar__meta { font-size: 12px; color: rgba(255,255,255,0.35); }
    .topbar__back {
      font-size: 13px; color: rgba(255,255,255,0.4);
      transition: color 0.15s;
    }
    .topbar__back:hover { color: #c6ef4d; text-decoration: none; }

    /* ── Main layout ── */
    .dashboard { max-width: 1400px; margin: 0 auto; padding: 32px; }

    /* ── KPI row ── */
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 12px;
      margin-bottom: 32px;
    }
    .kpi {
      background: rgba(255,255,255,0.03);
      border: none;
      border-radius: 8px;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    .kpi--accent {
      background: rgba(198,239,77,0.06);
    }
    .kpi__value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px; font-weight: 700; color: #fff;
      line-height: 1.1;
    }
    .kpi__label {
      font-size: 11px; color: rgba(255,255,255,0.4);
      margin-top: 6px; text-transform: uppercase; letter-spacing: 0.05em;
    }
    .kpi__trend {
      display: inline-block; font-size: 12px; font-weight: 600;
      padding: 2px 8px; border-radius: 4px; margin-top: 8px;
    }
    .kpi__trend--up { background: rgba(52,211,153,0.15); color: #34d399; }
    .kpi__trend--down { background: rgba(251,113,133,0.15); color: #fb7185; }
    .kpi__trend--flat { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.5); }
    .kpi__sub { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 4px; }

    /* ── Section titles ── */
    .section-head {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.8);
      margin-bottom: 16px;
      display: flex; align-items: center; gap: 8px;
    }
    .section-head__dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: #c6ef4d; flex-shrink: 0;
    }

    /* ── Panels ── */
    .panel {
      background: rgba(255,255,255,0.03);
      border: none;
      border-radius: 8px;
      padding: 24px;
      margin-bottom: 24px;
    }

    /* ── Two-column grid ── */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    /* ── Three-column grid ── */
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    /* ── Bar chart ── */
    .chart__bars {
      display: flex; align-items: flex-end; gap: 3px; height: 140px;
      padding-bottom: 24px; position: relative;
    }
    .chart__bar {
      flex: 1; background: #c6ef4d; border-radius: 3px 3px 0 0;
      min-width: 3px; position: relative; transition: background 0.15s;
      cursor: crosshair;
    }
    .chart__bar:hover { background: #d4f57e; }
    .chart__bar:hover::after {
      content: attr(data-tip); position: absolute;
      bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
      background: #1a1a1a; color: #fff; font-size: 11px;
      padding: 6px 10px; white-space: nowrap; border-radius: 6px;
      z-index: 5;
      pointer-events: none;
    }
    .chart__labels {
      display: flex; justify-content: space-between;
      font-size: 10px; color: rgba(255,255,255,0.25);
      margin-top: 4px;
    }

    /* ── Leaflet map ── */
    #visitor-map {
      height: 400px;
      background: #0d1117;
      border-radius: 6px;
      border: none;
    }
    .leaflet-container { background: #0d1117; }
    .leaflet-tile-pane { filter: brightness(0.65) contrast(1.1) saturate(0.25); }
    .leaflet-control-attribution { display: none !important; }
    .leaflet-popup-content-wrapper {
      background: #1a1a1a; color: #fff; border-radius: 6px;
      border: none;
      font-family: 'IBM Plex Mono', monospace; font-size: 12px;
    }
    .leaflet-popup-tip { background: #1a1a1a; }

    /* ── Country list ── */
    .country-list { list-style: none; }
    .country-list li {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 13px;
    }
    .country-list li:last-child { border-bottom: none; }
    .country-list__bar-wrap {
      flex: 1; height: 4px; background: rgba(255,255,255,0.06);
      border-radius: 2px; overflow: hidden;
    }
    .country-list__bar {
      height: 100%; background: #c6ef4d; border-radius: 2px;
    }
    .country-list__name { width: 140px; color: rgba(255,255,255,0.7); flex-shrink: 0; }
    .country-list__count {
      width: 40px; text-align: right; color: #fff;
      font-weight: 600; flex-shrink: 0;
    }

    /* ── Path list ── */
    .path-list { list-style: none; }
    .path-list li {
      display: flex; align-items: center; justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 13px;
    }
    .path-list li:last-child { border-bottom: none; }
    .path-list__path {
      color: rgba(255,255,255,0.6);
      font-family: 'IBM Plex Mono', monospace;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .path-list__count { color: #fff; font-weight: 600; flex-shrink: 0; margin-left: 12px; }

    /* ── Device bars ── */
    .device-row {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      font-size: 13px;
    }
    .device-row:last-child { border-bottom: none; }
    .device-row__label { width: 80px; color: rgba(255,255,255,0.6); flex-shrink: 0; }
    .device-row__bar-wrap {
      flex: 1; height: 8px; background: rgba(255,255,255,0.06);
      border-radius: 4px; overflow: hidden;
    }
    .device-row__bar {
      height: 100%; border-radius: 4px;
      transition: width 0.3s ease;
    }
    .device-row__pct { width: 48px; text-align: right; color: #fff; font-weight: 600; flex-shrink: 0; }

    /* ── Visit feed ── */
    .feed { list-style: none; }
    .feed__item {
      display: grid;
      grid-template-columns: 80px 1fr auto;
      gap: 16px; padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      align-items: center;
      font-size: 13px;
    }
    .feed__item:last-child { border-bottom: none; }
    .feed__time { color: rgba(255,255,255,0.3); font-size: 12px; }
    .feed__detail { color: rgba(255,255,255,0.7); }
    .feed__detail strong { color: #fff; font-weight: 500; }
    .feed__badge {
      font-size: 11px; padding: 3px 8px; border-radius: 4px;
      font-weight: 500; white-space: nowrap;
    }
    .feed__badge--desktop { background: rgba(99,102,241,0.15); color: #818cf8; }
    .feed__badge--mobile { background: rgba(52,211,153,0.15); color: #34d399; }
    .feed__badge--tablet { background: rgba(251,191,36,0.15); color: #fbbf24; }

    .empty-state {
      text-align: center; padding: 40px 20px;
      color: rgba(255,255,255,0.25); font-size: 13px;
    }

    /* ── Live dot pulse ── */
    .live-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: #34d399; display: inline-block;
      animation: pulse 2s ease infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52,211,153,0.5); }
      50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(52,211,153,0); }
    }

    /* ── Responsive ── */
    @media (max-width: 1024px) {
      .kpi-row { grid-template-columns: repeat(3, 1fr); }
      .grid-3 { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .grid-2 { grid-template-columns: 1fr; }
      .kpi-row { grid-template-columns: repeat(2, 1fr); }
      .topbar { padding: 12px 16px; }
      .dashboard { padding: 20px 16px; }
      #visitor-map { height: 260px; }
      .kpi__value { font-size: 26px; }
      .feed__item { grid-template-columns: 60px 1fr; gap: 8px; }
      .feed__badge { display: none; }
    }
    @media (max-width: 480px) {
      .kpi-row { grid-template-columns: 1fr 1fr; gap: 8px; }
      .kpi { padding: 14px; }
      .kpi__value { font-size: 22px; }
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div style="display:flex;align-items:center;gap:16px;">
      <a href="/" class="topbar__back">&larr; Back</a>
      <span class="topbar__brand">Analytics</span>
    </div>
    <div class="topbar__meta">
      <span class="live-dot"></span>&ensp;Live &middot; theakwasi.com &middot; Last 30 days
    </div>
  </div>

  <div class="dashboard">
    <!-- KPIs -->
    <div class="kpi-row">
      <div class="kpi kpi--accent">
        <div class="kpi__value">${totalToday}</div>
        <div class="kpi__label">Today</div>
      </div>
      <div class="kpi">
        <div class="kpi__value">${totalLast7}</div>
        <div class="kpi__label">Last 7 days</div>
        <div class="kpi__trend kpi__trend--${Number(trend7) > 0 ? 'up' : Number(trend7) < 0 ? 'down' : 'flat'}">${trendSign}${trend7}% vs prev 7d</div>
      </div>
      <div class="kpi">
        <div class="kpi__value">${totalLast30}</div>
        <div class="kpi__label">Last 30 days</div>
      </div>
      <div class="kpi">
        <div class="kpi__value">${avgPerDay}</div>
        <div class="kpi__label">Avg / day</div>
      </div>
      <div class="kpi">
        <div class="kpi__value">${peakDay.count}</div>
        <div class="kpi__label">Peak day</div>
        <div class="kpi__sub">${peakDay.date}</div>
      </div>
      <div class="kpi">
        <div class="kpi__value">${uniqueCountries}</div>
        <div class="kpi__label">Countries</div>
      </div>
    </div>

    <!-- Traffic chart (full width) -->
    <div class="panel">
      <div class="section-head"><span class="section-head__dot"></span>Traffic — 30 days</div>
      <div class="chart__bars">
        ${dailyCounts.slice().reverse().map(d =>
          `<div class="chart__bar" style="height:${Math.max((d.count / maxCount) * 100, 2)}%" data-tip="${d.date.slice(5)}: ${d.count} visits"></div>`
        ).join('')}
      </div>
      <div class="chart__labels">
        <span>${dailyCounts[dailyCounts.length - 1]?.date.slice(5) || ''}</span>
        <span>${dailyCounts[Math.floor(dailyCounts.length / 2)]?.date.slice(5) || ''}</span>
        <span>${dailyCounts[0]?.date.slice(5) || ''}</span>
      </div>
    </div>

    <!-- Map + Countries side by side -->
    <div class="grid-2">
      <div class="panel" style="padding-bottom:12px">
        <div class="section-head"><span class="section-head__dot"></span>Visitor map</div>
        <div id="visitor-map"></div>
      </div>
      <div class="panel">
        <div class="section-head"><span class="section-head__dot"></span>Top countries</div>
        ${sortedCountries.length > 0 ? `
        <ul class="country-list">
          ${sortedCountries.slice(0, 12).map(([cc, count]) => `
          <li>
            <span class="country-list__name">${countryNames[cc] || cc}</span>
            <div class="country-list__bar-wrap"><div class="country-list__bar" style="width:${(count / maxCountryVisits * 100).toFixed(0)}%"></div></div>
            <span class="country-list__count">${count}</span>
          </li>`).join('')}
        </ul>` : '<div class="empty-state">No visitor data yet</div>'}
      </div>
    </div>

    <!-- Pages + Devices + Live Feed -->
    <div class="grid-3">
      <div class="panel">
        <div class="section-head"><span class="section-head__dot"></span>Top pages</div>
        ${sortedPaths.length > 0 ? `
        <ul class="path-list">
          ${sortedPaths.slice(0, 10).map(([path, count]) => `
          <li>
            <span class="path-list__path">${path}</span>
            <span class="path-list__count">${count}</span>
          </li>`).join('')}
        </ul>` : '<div class="empty-state">No page data yet</div>'}
      </div>
      <div class="panel">
        <div class="section-head"><span class="section-head__dot"></span>Devices</div>
        ${['Desktop', 'Mobile', 'Tablet'].map((type, i) => {
          const pct = ((devices[type] / totalDevices) * 100).toFixed(0);
          const colors = ['#818cf8', '#34d399', '#fbbf24'];
          return `
          <div class="device-row">
            <span class="device-row__label">${type}</span>
            <div class="device-row__bar-wrap"><div class="device-row__bar" style="width:${pct}%;background:${colors[i]}"></div></div>
            <span class="device-row__pct">${pct}%</span>
          </div>`;
        }).join('')}
        <div style="margin-top:16px;font-size:11px;color:rgba(255,255,255,0.25)">Based on last ${recentVisits.length} visits</div>
      </div>
      <div class="panel">
        <div class="section-head"><span class="section-head__dot"></span>Referrers</div>
        ${(() => {
          const refs = {};
          recentVisits.forEach(v => {
            let host = 'Direct';
            try { if (v.referer) host = new URL(v.referer).hostname; } catch(e) {}
            refs[host] = (refs[host] || 0) + 1;
          });
          const sorted = Object.entries(refs).sort((a,b) => b[1] - a[1]);
          return sorted.length > 0 ? `<ul class="path-list">${sorted.slice(0, 8).map(([host, count]) => `
          <li>
            <span class="path-list__path">${host}</span>
            <span class="path-list__count">${count}</span>
          </li>`).join('')}</ul>` : '<div class="empty-state">No referrer data</div>';
        })()}
      </div>
    </div>

    <!-- Engagement (client-side dwell tracking, consent-based) -->
    <div class="panel">
      <div class="section-head"><span class="section-head__dot"></span>Engagement &middot; how long people stay</div>
      ${trackedPageviews > 0 ? `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
        <div class="kpi kpi--accent">
          <div class="kpi__value">${fmtDur(avgSessionMs)}</div>
          <div class="kpi__label">Avg time on site</div>
          <div class="kpi__sub">${sessionDurations.length} session${sessionDurations.length !== 1 ? 's' : ''}</div>
        </div>
        <div class="kpi">
          <div class="kpi__value">${fmtDur(avgPageMs)}</div>
          <div class="kpi__label">Avg time / page</div>
        </div>
        <div class="kpi">
          <div class="kpi__value">${trackedPageviews}</div>
          <div class="kpi__label">Tracked page views</div>
        </div>
      </div>
      <div style="font-family:'Space Grotesk',sans-serif;font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:10px">Time on page — which pages hold attention</div>
      <ul class="path-list">
        ${topDwellPages.slice(0, 10).map(([path, d]) => `
        <li>
          <span class="path-list__path">${path}</span>
          <span class="path-list__count">${fmtDur(d.totalMs / d.views)}<span style="color:rgba(255,255,255,0.3);font-weight:400;margin-left:8px">${d.views} view${d.views !== 1 ? 's' : ''}</span></span>
        </li>`).join('')}
      </ul>` : '<div class="empty-state">No engagement data yet — visitors who accept analytics will appear here.</div>'}
    </div>

    <!-- Approximate location + Consent -->
    <div class="grid-2">
      <div class="panel">
        <div class="section-head"><span class="section-head__dot"></span>Approximate location</div>
        ${sortedRegions.length > 0 ? `
        <ul class="path-list">
          ${sortedRegions.slice(0, 12).map(([label, count]) => `
          <li>
            <span class="path-list__path">${label}</span>
            <span class="path-list__count">${count}</span>
          </li>`).join('')}
        </ul>
        <div style="margin-top:12px;font-size:11px;color:rgba(255,255,255,0.25)">Region-level only, never street/IP. Aggregate, non-identifiable.</div>`
        : '<div class="empty-state">No location data yet</div>'}
      </div>
      <div class="panel">
        <div class="section-head"><span class="section-head__dot"></span>Cookie consent (GDPR)</div>
        ${totalConsent > 0 ? `
        ${[['Accepted', consentCounts.accept, '#34d399'], ['Declined', consentCounts.decline, '#fb7185']].map(([label, n, color]) => {
          const pct = ((n / totalConsent) * 100).toFixed(0);
          return `
          <div class="device-row">
            <span class="device-row__label">${label}</span>
            <div class="device-row__bar-wrap"><div class="device-row__bar" style="width:${pct}%;background:${color}"></div></div>
            <span class="device-row__pct">${pct}%</span>
          </div>`;
        }).join('')}
        <div style="margin-top:16px;font-size:11px;color:rgba(255,255,255,0.25)">${totalConsent} decision${totalConsent !== 1 ? 's' : ''} recorded (recent sample). Analytics only runs after Accept.</div>`
        : '<div class="empty-state">No consent decisions recorded yet</div>'}
      </div>
    </div>

    <!-- Live visit feed -->
    <div class="panel">
      <div class="section-head"><span class="section-head__dot"></span>Recent activity</div>
      ${recentVisits.length > 0 ? `
      <ul class="feed">
        ${recentVisits.slice(0, 25).map(v => {
          const device = v.ua.includes('Tablet') || v.ua.includes('iPad') ? 'tablet' :
                         v.ua.includes('Mobile') || v.ua.includes('Android') ? 'mobile' : 'desktop';
          const country = countryNames[v.country] || v.country;
          return `
          <li class="feed__item">
            <span class="feed__time">${relTime(v.time)}</span>
            <span class="feed__detail"><strong>${v.path}</strong> from ${country}</span>
            <span class="feed__badge feed__badge--${device}">${device}</span>
          </li>`;
        }).join('')}
      </ul>` : '<div class="empty-state">No visits recorded yet</div>'}
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    (function() {
      var markers = ${JSON.stringify(mapMarkers)};
      var map = L.map('visitor-map', {
        center: [20, 10], zoom: 2, minZoom: 2, maxZoom: 6,
        zoomControl: true, attributionControl: false, scrollWheelZoom: true,
      });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd', maxZoom: 19,
      }).addTo(map);
      markers.forEach(function(m) {
        L.circleMarker([m.lat, m.lng], {
          radius: m.r, fillColor: '#c6ef4d', color: '#c6ef4d',
          weight: 1, opacity: 0.8, fillOpacity: 0.45,
        }).addTo(map).bindPopup(
          '<div style="font-size:13px"><strong>' + m.name + '</strong><br>' + m.count + ' visit' + (m.count !== 1 ? 's' : '') + '</div>'
        );
      });
      if (markers.length > 0) {
        var bounds = L.latLngBounds(markers.map(function(m) { return [m.lat, m.lng]; }));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 5 });
      }
    })();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  });
}
