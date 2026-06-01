import { useState } from 'react';
import { getConsent, setConsent } from '../lib/consent';
import { startTracking, trackPage, recordConsent } from '../lib/analytics';

const BANNER_STYLE = {
  position: 'fixed',
  left: '16px',
  right: '16px',
  bottom: '16px',
  zIndex: 9999,
  maxWidth: '440px',
  margin: '0 auto',
  background: 'rgba(10, 14, 12, 0.92)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  padding: '20px',
  color: 'rgba(255,255,255,0.85)',
  fontFamily: "'IBM Plex Mono', 'SF Mono', Menlo, monospace",
  fontSize: '13px',
  lineHeight: 1.5,
  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
};

const ACTIONS_STYLE = {
  display: 'flex',
  gap: '8px',
  marginTop: '16px',
};

const BTN_BASE = {
  flex: 1,
  padding: '10px 12px',
  fontFamily: 'inherit',
  fontSize: '13px',
  fontWeight: 500,
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'opacity 150ms ease, background-color 150ms ease',
};

export default function CookieConsent({ currentPath = '/' }) {
  const [visible, setVisible] = useState(() => getConsent() === null);

  const choose = (choice) => {
    setConsent(choice);
    recordConsent(choice);
    if (choice === 'accept') {
      startTracking();
      trackPage(currentPath);
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside style={BANNER_STYLE} aria-label="Cookie consent">
      <strong style={{ display: 'block', fontWeight: 600, color: '#c6ef4d', marginBottom: '8px' }}>
        Privacy
      </strong>
      <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>
        I use privacy-friendly analytics to see which pages are read and for how long. No
        personal data, no ad tracking, no third parties. Approximate location is country-level
        only.
      </p>
      <div style={ACTIONS_STYLE}>
        <button
          type="button"
          onClick={() => choose('decline')}
          style={{
            ...BTN_BASE,
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose('accept')}
          style={{
            ...BTN_BASE,
            background: '#c6ef4d',
            color: '#00330f',
            border: '1px solid #c6ef4d',
          }}
        >
          Accept analytics
        </button>
      </div>
    </aside>
  );
}
