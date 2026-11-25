/**
 * IntroOverlay – white-screen loading stage + clip-path page reveal.
 *
 * Stage 1 (0 → ~2.6 s): full-screen #FDFDFD, centred name + progress bar.
 * Stage 2 (~2.6 → ~3.0 s): overlay wipes upward, uncovering the page.
 *
 * Rules:
 *  - Runs only once per browser session (sessionStorage flag).
 *  - Respects prefers-reduced-motion: skips immediately.
 *  - Uses GSAP (already in the project) – no new deps.
 *  - Calls `onDone()` when the reveal is finished so App can unmount it.
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const SESSION_KEY = 'sd_intro_done';

interface Props {
  onDone: () => void;
}

export default function IntroOverlay({ onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const bar  = barRef.current;
    if (!root || !bar) return;

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      sessionStorage.setItem(SESSION_KEY, '1');
      onDone();
    };

    /* Respect prefers-reduced-motion */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }

    /* Safety net: never block longer than 5 s */
    const safety = window.setTimeout(finish, 5000);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          /* Wipe the overlay upward to reveal the page underneath */
          gsap.to(root, {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.55,
            ease: 'power4.inOut',
            onComplete: finish,
          });
        },
      });

      /* Name characters slide up */
      tl.fromTo(
        '.io-char',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.035 }
      )
        /* Role line */
        .fromTo(
          '.io-role',
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5 },
          '-=0.15'
        )
        /* "INITIALIZING EXPERIENCE" label */
        .fromTo(
          '.io-label',
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          '<'
        )
        /* Progress bar fills left-to-right */
        .fromTo(
          bar,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.6, ease: 'power1.inOut' },
          '-=0.3'
        )
        /* Short pause at 100 % before wipe */
        .to({}, { duration: 0.25 });
    }, root);

    return () => {
      window.clearTimeout(safety);
      ctx.revert();
    };
  }, [onDone]);

  const NAME = 'SUSHMITA DASARI';

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FDFDFD',
        clipPath: 'inset(0% 0% 0% 0%)',
      }}
    >
      {/* ── Name ── */}
      <h1
        aria-label={NAME}
        style={{
          margin: 0,
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          letterSpacing: '-0.02em',
          color: '#111111',
          lineHeight: 1,
          textAlign: 'center',
        }}
      >
        {NAME.split('').map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="io-char"
            style={{ display: 'inline-block' }}
          >
            {ch === ' ' ? '\u00a0' : ch}
          </span>
        ))}
      </h1>

      {/* ── Role line ── */}
      <p
        className="io-role"
        style={{
          marginTop: '1rem',
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 400,
          fontSize: '11px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#8A8A8A',
        }}
      >
        Web Developer · AI Developer · Founder of Sri Tech
      </p>

      {/* ── Progress bar ── */}
      <div
        style={{
          marginTop: '3rem',
          width: '180px',
          height: '1px',
          background: '#E0E0E0',
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{
            width: '100%',
            height: '100%',
            background: '#ED1B3E',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
          }}
        />
      </div>

      {/* ── Label ── */}
      <p
        className="io-label"
        style={{
          marginTop: '0.75rem',
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 400,
          fontSize: '10px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: '#8A8A8A',
        }}
      >
        Initializing Experience
      </p>
    </div>
  );
}

/**
 * Returns `true` if the intro has already been shown this session,
 * meaning `IntroOverlay` should be skipped entirely.
 */
export function introAlreadyShown(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}
