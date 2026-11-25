/**
 * HeroIntroSection
 * ─────────────────
 * White-background, two-column hero layout with a staggered CSS-keyframe
 * entrance animation. Sits immediately below the existing Three.js glass-
 * shard Hero so the rest of the site is completely untouched.
 *
 * Animation stages (CSS keyframes, no JS timers):
 *   0.0 s – 0.4 s  : everything hidden
 *   0.4 s – 1.2 s  : name (SUSHMITA.) fades up
 *   1.0 s – 1.5 s  : "WEB DEVELOPER." fades up
 *   1.2 s – 1.7 s  : "AI DEVELOPER · FOUNDER OF SRI TECH." fades up
 *   1.5 s – 2.0 s  : both buttons fade in
 *
 * prefers-reduced-motion: all elements are shown immediately (animation: none).
 * No new dependencies – uses CSS keyframes defined in index.css (.hi-* classes).
 */
import React from 'react';

export const HeroIntroSection: React.FC = () => {
  return (
    <section
      id="hero-intro"
      aria-label="Hero introduction"
      style={{
        background: '#FDFDFD',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* ════════════ Left column ════════════ */}
      <div
        style={{
          flex: '0 0 55%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: 'clamp(2rem, 7vw, 7rem)',
          paddingRight: 'clamp(1rem, 3vw, 3rem)',
          paddingTop: '6rem',
          paddingBottom: '4rem',
          gap: 0,
        }}
      >
        {/* Hello label */}
        <span className="hi-item hi-delay-0" style={labelStyle}>
          Hello, I&apos;m
        </span>

        {/* ── SUSHMITA. ── */}
        <h1 className="hi-item hi-delay-1" style={nameStyle}>
          <span style={{ color: '#ED1B3E' }}>SUSHMITA.</span>
        </h1>

        {/* ── WEB DEVELOPER. ── */}
        <p className="hi-item hi-delay-2" style={roleStyle}>
          WEB DEVELOPER.
        </p>

        {/* ── AI DEVELOPER · FOUNDER OF SRI TECH. ── */}
        <p className="hi-item hi-delay-3" style={subroleStyle}>
          AI DEVELOPER · FOUNDER OF{' '}
          <span style={{ color: '#ED1B3E' }}>SRI TECH.</span>
        </p>

        {/* ── Buttons ── */}
        <div
          className="hi-item hi-delay-4"
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: 'clamp(2rem, 4vh, 3rem)',
            flexWrap: 'wrap',
          }}
        >
          {/* Filled black pill */}
          <a
            href="#projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.85rem 2.2rem',
              borderRadius: '9999px',
              background: '#111111',
              color: '#FDFDFD',
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'background 0.25s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ED1B3E'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#111111'; }}
          >
            View Work
          </a>

          {/* Outlined pill */}
          <a
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.85rem 2.2rem',
              borderRadius: '9999px',
              background: 'transparent',
              color: '#111111',
              border: '1.5px solid #111111',
              fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'border-color 0.25s ease, color 0.25s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#ED1B3E';
              (e.currentTarget as HTMLElement).style.color = '#ED1B3E';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = '#111111';
              (e.currentTarget as HTMLElement).style.color = '#111111';
            }}
          >
            Contact
          </a>
        </div>
      </div>

      {/* ════════════ Right column (guide lines + character slot) ════════════ */}
      <div
        style={{
          flex: '1 1 45%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Dashed vertical guide — left edge of right column */}
        <div className="hi-guide hi-guide-left" />

        {/* Dashed vertical guide — right edge of right column */}
        <div className="hi-guide hi-guide-right" />

        {/* Character image / video slot ─ neutral placeholder until asset exists */}
        <CharacterSlot />
      </div>

      {/* ════════════ Thin bottom border ════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'rgba(0,0,0,0.08)',
        }}
      />
    </section>
  );
};

/* ── Shared text styles ── */

const labelStyle: React.CSSProperties = {
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 400,
  fontSize: '11px',
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  color: '#8A8A8A',
  marginBottom: 'clamp(0.5rem, 1.5vh, 1rem)',
};

const nameStyle: React.CSSProperties = {
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 900,
  fontSize: 'clamp(3.5rem, 9vw, 8rem)',
  lineHeight: 0.92,
  letterSpacing: '-0.03em',
  textTransform: 'uppercase',
  margin: 0,
  marginBottom: 'clamp(0.75rem, 2vh, 1.5rem)',
};

const roleStyle: React.CSSProperties = {
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 700,
  fontSize: 'clamp(1rem, 2.2vw, 1.6rem)',
  letterSpacing: '-0.01em',
  textTransform: 'uppercase',
  color: '#111111',
  margin: 0,
  marginBottom: '0.3rem',
};

const subroleStyle: React.CSSProperties = {
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  fontWeight: 400,
  fontSize: 'clamp(0.75rem, 1.4vw, 1.1rem)',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#111111',
  margin: 0,
};

/* ─────────────────────────────────────────────────
   Character slot: shows portrait.png if it exists,
   otherwise a neutral dashed placeholder box.
───────────────────────────────────────────────── */
function CharacterSlot() {
  const [hasPoster, setHasPoster] = React.useState<boolean | null>(null);
  const POSTER = '/media/portrait.png';

  React.useEffect(() => {
    const img = new Image();
    img.onload  = () => setHasPoster(true);
    img.onerror = () => setHasPoster(false);
    img.src = POSTER;
  }, []);

  /* While checking, render nothing to avoid a flash */
  if (hasPoster === null) return null;

  if (hasPoster) {
    return (
      <img
        src={POSTER}
        alt="Sushmita Dasari"
        style={{
          position: 'absolute',
          bottom: 0,
          right: '5%',
          height: '90%',
          width: 'auto',
          objectFit: 'contain',
          objectPosition: 'bottom center',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />
    );
  }

  /* Neutral dashed placeholder */
  return (
    <div
      aria-hidden="true"
      style={{
        width: '60%',
        aspectRatio: '3/4',
        maxHeight: '70%',
        border: '1.5px dashed rgba(0,0,0,0.15)',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        color: '#C0C0C0',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        fontSize: '11px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      Character image
    </div>
  );
}

export default HeroIntroSection;
