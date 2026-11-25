/**
 * IntroSequence.tsx (combined)
 * Cinematic intro overlay. Plays on EVERY page load (reload included).
 * Skipped only when prefers-reduced-motion is set.
 *
 * TIMING (seconds from mount)
 *  0.0 – 1.0    black
 *  1.0 – 2.0    white dot glows to 14 px
 *  2.0 – 3.0    dot stretches into a vertical bar, then disappears
 *  3.0 – 5.5    name assembles letter by letter
 *  5.5 – 6.5    name scatters
 *  4.9 – 8.5    subtitle characters rise + fade in (stagger 0.03 s)
 *  6.5 – 7.5    "PORTFOLIO" slides in with a 3D tilt
 *  7.5 – 8.5    PORTFOLIO + subtitle hold
 *  8.5 – 9.5    PORTFOLIO dissolves into particles
 *  9.5 – 10.0   particles morph into the portrait
 * 10.0          nav fades in
 * 10.0 – 10.8   single frosted-glass panel slides LEFT → RIGHT
 * 10.8 – 13.8   glass holds; page scroll locked; input ignored for first 3 s
 * 13.8+         waits for scroll intent (wheel / touch / keys / click)
 *               → glass splits and falls down, hero scrolled into view,
 *                 overlay removed, Stage 5 scroll reveals start
 * Escape or "Skip intro" finishes immediately at any time.
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { initScrollReveal } from '../lib/scrollReveal';

/* ─── Content ─────────────────────────────────────────────────────────────── */
const NAME_TEXT = 'VIBHEESHAN N K';
const TITLE_TEXT = 'PORTFOLIO';
const SUBTITLE_TEXT = 'Web Developer · AI Developer';
const PORTRAIT_URL = '/assets/portrait.png';
const FONT = '"General Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const SUBTITLE_FONT = `italic 14px ${FONT}`;
const SUBTITLE_COLOR = '#8A8A8A';
const SUBTITLE_LETTER_SPACING = 0.7; // 0.05em at 14px
const BG_COLOR = '#050505';

/* ─── Timing ──────────────────────────────────────────────────────────────── */
const SUBTITLE_START = 4.9;
const SUBTITLE_STAGGER = 0.03;
const SUBTITLE_CHAR_DUR = 0.28;
const SUBTITLE_END = 8.5;
const NAV_AT = 10.0;
const GLASS_START = 10.0;
const GLASS_SLIDE = 0.8;
const INPUT_DELAY = 3.0;      // seconds of hold before scroll intent is accepted
const FALL_DUR = 0.9;
const FALL_END = FALL_DUR + 0.05;
const SCROLL_KEYS = ['ArrowDown', 'PageDown', ' ', 'End', 'Enter'];

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface Particle {
  x: number; y: number;
  startX: number; startY: number;
  targetX: number; targetY: number;
  vx: number; vy: number;
  size: number; alpha: number; targetAlpha: number;
}

interface LetterInfo {
  char: string;
  targetX: number; targetY: number;
  startDelay: number; duration: number;
  startOffsetX: number; startOffsetY: number; startAngle: number;
  scatterDx: number; scatterDy: number; scatterAngle: number;
}

type PortraitPoint = { x: number; y: number; lum: number };
type Src = HTMLImageElement | HTMLCanvasElement;

interface IntroSequenceProps {
  onComplete?: () => void;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const isMobile = (w: number) => w < 768;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const dimsOf = (s: Src) =>
  s instanceof HTMLImageElement ? { w: s.naturalWidth, h: s.naturalHeight } : { w: s.width, h: s.height };

function titleFontSize(W: number) {
  return isMobile(W) ? Math.min(W * 0.13, 52) : Math.min(W * 0.08, 92);
}
function nameFontSize(W: number) {
  return isMobile(W) ? Math.min(W * 0.075, 34) : Math.min(W * 0.065, 72);
}

/** Letter layout for the name: final positions plus deterministic random start/scatter. */
function initLetters(W: number, H: number): LetterInfo[] {
  const c = document.createElement('canvas').getContext('2d');
  if (!c) return [];
  c.font = `900 ${nameFontSize(W)}px ${FONT}`;

  const widths = Array.from(NAME_TEXT).map((ch) => c.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0);

  let cur = (W - total) / 2;
  const letters: LetterInfo[] = [];
  Array.from(NAME_TEXT).forEach((ch, i) => {
    const w = widths[i];
    const tx = cur + w / 2;
    cur += w;

    const s1 = Math.sin(i * 12.9898 + 78.233) * 43758.5453; const r1 = s1 - Math.floor(s1);
    const s2 = Math.cos(i * 45.123 + 23.456) * 23421.631;   const r2 = s2 - Math.floor(s2);
    const s3 = Math.sin(i * 89.412 + 11.897) * 98765.432;   const r3 = s3 - Math.floor(s3);

    letters.push({
      char: ch,
      targetX: tx,
      targetY: H / 2,
      startDelay: 3.0 + i * 0.12,
      duration: 0.6,
      startOffsetX: (r2 * 2 - 1) * (W * 0.35 + 80),
      startOffsetY: (r3 * 2 - 1) * (H * 0.3 + 60),
      startAngle: (r1 * 80 - 40) * (Math.PI / 180),
      scatterDx: (r1 * 2 - 1) * (W * 0.5 + 100),
      scatterDy: (r3 * 2 - 1) * (H * 0.4 + 80),
      scatterAngle: (r2 * 120 - 60) * (Math.PI / 180),
    });
  });
  return letters;
}

/** Pixel-sample PORTFOLIO into particles. Stride 3 desktop / 4 mobile, capped. */
function sampleTitle(W: number, H: number): Particle[] {
  const mob = isMobile(W);
  const step = mob ? 4 : 3;
  const cap = mob ? 6000 : 12000;

  const off = document.createElement('canvas');
  off.width = W;
  off.height = H;
  const g = off.getContext('2d', { willReadFrequently: true });
  if (!g) return [];

  g.font = `900 ${titleFontSize(W)}px ${FONT}`;
  g.fillStyle = '#FFFFFF';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(TITLE_TEXT, W / 2, H / 2 - 15);

  const { data } = g.getImageData(0, 0, W, H);
  const out: Particle[] = [];
  for (let y = 0; y < H && out.length < cap; y += step) {
    for (let x = 0; x < W && out.length < cap; x += step) {
      const a = data[(y * W + x) * 4 + 3];
      if (a > 120) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 0.5 + Math.random() * 2.5;
        out.push({
          x, y, startX: x, startY: y, targetX: x, targetY: y,
          vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
          size: 1.5, alpha: a / 255, targetAlpha: 1,
        });
      }
    }
  }
  return out;
}

/** Sample the portrait (or placeholder) into luminance dots. */
function samplePortraitPoints(src: Src, W: number, H: number): PortraitPoint[] {
  const mob = isMobile(W);
  const step = mob ? 5 : 4;
  const th = mob ? Math.min(H * 0.55, 420) : Math.min(H * 0.65, 520);
  const { w: sw, h: sh } = dimsOf(src);
  const tw = th * (sw / sh);
  const posX = mob ? (W - tw) / 2 : (W - tw) * 0.52;
  const posY = (H - th) / 2 + 10;

  const off = document.createElement('canvas');
  off.width = Math.round(tw);
  off.height = Math.round(th);
  const g = off.getContext('2d', { willReadFrequently: true });
  if (!g) return [];

  g.drawImage(src, 0, 0, off.width, off.height);
  const { data } = g.getImageData(0, 0, off.width, off.height);
  const pts: PortraitPoint[] = [];
  for (let y = 0; y < off.height; y += step) {
    for (let x = 0; x < off.width; x += step) {
      const i = (y * off.width + x) * 4;
      if (data[i + 3] > 50) {
        const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        if (lum > 0.25) pts.push({ x: posX + x, y: posY + y, lum });
      }
    }
  }
  return pts;
}

/** Grey gradient used when public/assets/portrait.png is missing. */
function makePlaceholder(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#4a4a4a');
  grad.addColorStop(1, '#a0a0a0');
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);
  return c;
}

/* ─── Component ───────────────────────────────────────────────────────────── */
export const IntroSequence: React.FC<IntroSequenceProps> = ({ onComplete }) => {
  // Only reduced motion skips the intro. It plays on every load.
  const [mounted] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Stable handles so the effect never restarts because of parent re-renders.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* ── state ─────────────────────────────────────────────────────────── */
    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let letters: LetterInfo[] = [];
    let particles: Particle[] = [];
    let portraitPts: PortraitPoint[] = [];
    let portraitSrc: Src | null = null;

    let morphed = false;
    let navDone = false;
    let glassPanel: HTMLDivElement | null = null;
    let halfL: HTMLDivElement | null = null;
    let halfR: HTMLDivElement | null = null;
    let glassSlideDone = false;
    let holdStart = 0;
    let inputReady = false;
    let triggered = false;
    let triggerTime = 0;
    let elapsed = 0;

    let finished = false;
    let raf = 0;
    let resizeTimer: number | null = null;
    const start = performance.now();
    let pausedAt: number | null = null;
    let pausedTotal = 0;

    /* ── nav: hidden until NAV_AT ──────────────────────────────────────── */
    const nav = document.querySelector<HTMLElement>('nav');
    if (nav) {
      nav.style.opacity = '0';
      nav.style.pointerEvents = 'none';
    }

    /* ── glass helpers ─────────────────────────────────────────────────── */
    const GLASS_CSS =
      'backdrop-filter:blur(24px) saturate(140%);' +
      '-webkit-backdrop-filter:blur(24px) saturate(140%);' +
      'background:rgba(255,255,255,0.08);';

    function ensureGlassPanel() {
      if (glassPanel) return;
      const el = document.createElement('div');
      el.setAttribute('data-glass-panel', '');
      el.style.cssText = [
        'position:fixed', 'top:0', 'left:0', 'width:100vw', 'height:100vh',
        'z-index:210', 'pointer-events:auto', 'will-change:transform',
        'transform:translateX(-100%)', // starts off-screen LEFT
        GLASS_CSS,
        'border-right:1px solid rgba(255,255,255,0.35)',
        'box-shadow:inset -4px 0 24px rgba(255,255,255,0.06)',
      ].join(';');
      el.addEventListener('click', onPanelClick);
      container!.appendChild(el);
      glassPanel = el;
    }

    function makeHalf(side: 'left' | 'right') {
      const el = document.createElement('div');
      el.style.cssText = [
        'position:fixed', 'top:0',
        side === 'left' ? 'left:0' : 'left:50vw',
        'width:50vw', 'height:100vh',
        'z-index:210', 'pointer-events:none', 'will-change:transform',
        'transform:translateY(0) rotate(0deg)',
        `transform-origin:${side === 'left' ? 'bottom left' : 'bottom right'}`,
        'transition:transform 0.9s cubic-bezier(0.55, 0, 1, 0.45)',
        GLASS_CSS,
        side === 'left'
          ? 'border-right:1px solid rgba(255,255,255,0.35);box-shadow:inset -4px 0 24px rgba(255,255,255,0.06)'
          : 'border-left:1px solid rgba(255,255,255,0.35);box-shadow:inset 4px 0 24px rgba(255,255,255,0.06)',
      ].join(';');
      container!.appendChild(el);
      return el;
    }

    function removeGlass() {
      glassPanel?.remove();
      halfL?.remove();
      halfR?.remove();
      glassPanel = null;
      halfL = null;
      halfR = null;
    }

    /* ── scroll-intent split: glass falls and hero is revealed ─────────── */
    function trigger(at: number) {
      if (triggered) return;
      triggered = true;
      triggerTime = at;

      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';

      if (glassPanel) glassPanel.style.display = 'none';
      halfL = makeHalf('left');
      halfR = makeHalf('right');

      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (halfL) halfL.style.transform = 'translateY(110%) rotate(-4deg)';
        if (halfR) halfR.style.transform = 'translateY(110%) rotate(4deg)';
      }));

      // Scroll the hero into view while the glass falls.
      setTimeout(() => {
        const hero = document.getElementById('hero');
        if (hero) hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }

    /* ── finish: single cleanup path (skip, Escape, or after fall) ─────── */
    function teardown() {
      cancelAnimationFrame(raf);
      raf = 0;
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    }

    function finish() {
      if (finished) return;
      finished = true;
      teardown();

      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
      removeGlass();

      const n = document.querySelector<HTMLElement>('nav');
      if (n) {
        n.style.opacity = '';
        n.style.transition = '';
        n.style.pointerEvents = '';
        n.classList.add('nav-visible');
      }

      // Leftover cleanup from the old section reveal code.
      const aboutH = document.querySelector<HTMLElement>('#about h2');
      const aboutP = document.querySelector<HTMLElement>('#about p');
      if (aboutH) aboutH.style.cssText = '';
      if (aboutP) aboutP.style.cssText = '';

      // Don't reset scroll after a split: that would undo the hero scroll.
      if (!triggered) window.scrollTo({ top: 0, behavior: 'auto' });

      container!.style.display = 'none';
      initScrollReveal(); // Stage 5 starts only now
      setTimeout(() => onCompleteRef.current?.(), 50);
    }
    finishRef.current = finish;

    /* ── input listeners ───────────────────────────────────────────────── */
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        finish();
        return;
      }
      if (!inputReady || triggered) return;
      if (SCROLL_KEYS.includes(e.key)) {
        e.preventDefault();
        trigger(elapsed);
      }
    }

    function onWheel(e: WheelEvent) {
      if (!inputReady || triggered) return;
      e.preventDefault();
      trigger(elapsed);
    }

    function onTouchMove(e: TouchEvent) {
      if (!inputReady || triggered) return;
      e.preventDefault();
      trigger(elapsed);
    }

    function onPanelClick() {
      if (!inputReady || triggered) return;
      trigger(elapsed);
    }

    function onVisibility() {
      if (document.hidden) {
        if (pausedAt === null) pausedAt = performance.now();
      } else if (pausedAt !== null) {
        pausedTotal += performance.now() - pausedAt;
        pausedAt = null;
        if (!raf && !finished) raf = requestAnimationFrame(loop);
      }
    }

    /* ── setup: sizes, letters, title particles, portrait ──────────────── */
    function setup() {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;

      letters = initLetters(W, H);
      particles = sampleTitle(W, H);
      if (portraitSrc) portraitPts = samplePortraitPoints(portraitSrc, W, H);
    }

    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setup();
        morphed = false; // re-morph into the resampled portrait
      }, 200);
    }

    setup();

    // Portrait: load it, or fall back to a placeholder with a warning.
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (finished) return;
      portraitSrc = img;
      portraitPts = samplePortraitPoints(img, W, H);
    };
    img.onerror = () => {
      if (finished) return;
      console.warn(`[intro] ${PORTRAIT_URL} not found; using placeholder gradient.`);
      portraitSrc = makePlaceholder();
      portraitPts = samplePortraitPoints(portraitSrc, W, H);
    };
    img.src = PORTRAIT_URL;

    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    /* ── main loop ─────────────────────────────────────────────────────── */
    function drawIntro(t: number, mob: boolean) {
      const tsz = titleFontSize(W);

      // S1: dot glows, 1.0–2.0
      if (t >= 1.0 && t < 2.0) {
        const p = t - 1.0;
        const r = 7 * p; // 14 px diameter at the end
        const cx = W / 2;
        const cy = H / 2;
        const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r * 4);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.3, 'rgba(255,255,255,0.7)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx!.fillStyle = g;
        ctx!.beginPath(); ctx!.arc(cx, cy, r * 4, 0, Math.PI * 2); ctx!.fill();
        ctx!.fillStyle = '#FFF';
        ctx!.beginPath(); ctx!.arc(cx, cy, r, 0, Math.PI * 2); ctx!.fill();
      }
      // S2: dot stretches into a bar and fades, 2.0–3.0
      else if (t >= 2.0 && t < 3.0) {
        const p = t - 2.0;
        const barH = 14 + (Math.min(H * 0.65, 280) - 14) * Math.min(1, p * 1.8);
        const alpha = p > 0.65 ? Math.max(0, 1 - (p - 0.65) / 0.35) : 1;
        ctx!.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx!.fillRect(W / 2 - 1, H / 2 - barH / 2, 2, barH);
      }
      // S3: name assembles, 3.0–5.5
      else if (t >= 3.0 && t < 5.5) {
        ctx!.font = `900 ${nameFontSize(W)}px ${FONT}`;
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        for (const item of letters) {
          if (t < item.startDelay) continue;
          const prog = Math.min(1, (t - item.startDelay) / item.duration);
          const ease = easeOutCubic(prog);
          const blur = 12 * (1 - ease);
          ctx!.save();
          if (blur > 0.6) ctx!.filter = `blur(${blur.toFixed(1)}px)`;
          ctx!.globalAlpha = Math.min(1, prog * 2.5);
          ctx!.fillStyle = '#FFF';
          ctx!.translate(item.targetX + item.startOffsetX * (1 - ease),
                         item.targetY + item.startOffsetY * (1 - ease));
          ctx!.rotate(item.startAngle * (1 - ease));
          ctx!.fillText(item.char, 0, 0);
          ctx!.restore();
        }
      }
      // S4: name scatters, 5.5–6.5
      else if (t >= 5.5 && t < 6.5) {
        const p = t - 5.5;
        const e2 = p * p;
        ctx!.font = `900 ${nameFontSize(W)}px ${FONT}`;
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        for (const item of letters) {
          ctx!.save();
          const blur = 12 * p;
          if (blur > 0.6) ctx!.filter = `blur(${blur.toFixed(1)}px)`;
          ctx!.globalAlpha = Math.max(0, 1 - p);
          ctx!.fillStyle = '#FFF';
          ctx!.translate(item.targetX + item.scatterDx * e2, item.targetY + item.scatterDy * e2);
          ctx!.rotate(item.scatterAngle * e2);
          ctx!.fillText(item.char, 0, 0);
          ctx!.restore();
        }
      }
      // S5/S6: PORTFOLIO slides in with tilt (6.5–7.5), then holds (7.5–8.5)
      else if (t >= 6.5 && t < SUBTITLE_END) {
        const isSlide = t < 7.5;
        const p = isSlide ? t - 6.5 : 1;
        const ease = easeOutCubic(p);
        const slideY = isSlide ? (1 - ease) * 45 : 0;
        const tilt = isSlide ? 0.65 + 0.35 * ease : 1;
        ctx!.save();
        ctx!.translate(W / 2, H / 2 - 15 + slideY);
        ctx!.scale(1, tilt);
        ctx!.globalAlpha = isSlide ? Math.min(1, p * 2) : 1;
        ctx!.font = `900 ${tsz}px ${FONT}`;
        ctx!.fillStyle = '#FFF';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        ctx!.fillText(TITLE_TEXT, 0, 0);
        ctx!.restore();
      }
      // S7: PORTFOLIO dissolves into particles, 8.5–9.5
      else if (t >= SUBTITLE_END && t < 9.5) {
        const dp = t - SUBTITLE_END;
        for (const pt of particles) {
          pt.x = pt.startX + pt.vx * dp * 35;
          pt.y = pt.startY + pt.vy * dp * 35;
          const a = pt.alpha * Math.max(0, 1 - dp);
          if (a > 0.02) {
            ctx!.fillStyle = `rgba(255,255,255,${a})`;
            ctx!.beginPath(); ctx!.arc(pt.x, pt.y, pt.size / 2, 0, Math.PI * 2); ctx!.fill();
          }
        }
      }
      // S8: particles morph into the portrait, 9.5+ (never draws the title)
      else if (t >= 9.5) {
        if (!morphed && portraitPts.length > 0) {
          morphed = true;
          while (particles.length < portraitPts.length) {
            const rx = W / 2 + (Math.random() - 0.5) * 200;
            const ry = H / 2 + (Math.random() - 0.5) * 100;
            particles.push({
              x: rx, y: ry, startX: rx, startY: ry, targetX: rx, targetY: ry,
              vx: 0, vy: 0, size: 1.5, alpha: 0, targetAlpha: 1,
            });
          }
          for (let i = 0; i < particles.length; i++) {
            const pt = particles[i];
            pt.startX = pt.x;
            pt.startY = pt.y;
            if (i < portraitPts.length) {
              pt.targetX = portraitPts[i].x;
              pt.targetY = portraitPts[i].y;
              pt.targetAlpha = Math.min(1, portraitPts[i].lum * 1.15);
            } else {
              pt.targetAlpha = 0;
            }
          }
        }

        if (morphed) {
          const tN = clamp01((t - 9.5) / 0.5);
          const ease = easeInOutCubic(tN);
          let alphaScale = 1;
          if (triggered) alphaScale = Math.max(0, 1 - (t - triggerTime) / FALL_DUR);
          for (const pt of particles) {
            const a = (pt.alpha + (pt.targetAlpha - pt.alpha) * ease) * alphaScale;
            if (a > 0.05) {
              ctx!.fillStyle = `rgba(255,255,255,${a})`;
              ctx!.beginPath();
              ctx!.arc(pt.startX + (pt.targetX - pt.startX) * ease,
                       pt.startY + (pt.targetY - pt.startY) * ease,
                       0.75, 0, Math.PI * 2);
              ctx!.fill();
            }
          }
        }
      }

      // Subtitle: per-character rise + fade, 4.9–8.5
      if (t >= SUBTITLE_START && t < SUBTITLE_END) {
        ctx!.save();
        ctx!.font = SUBTITLE_FONT;
        ctx!.textAlign = 'left';
        ctx!.textBaseline = 'middle';
        ctx!.fillStyle = SUBTITLE_COLOR;
        const chars = Array.from(SUBTITLE_TEXT);
        const widths = chars.map((c) => ctx!.measureText(c).width + SUBTITLE_LETTER_SPACING);
        const total = widths.reduce((a, b) => a + b, 0) - SUBTITLE_LETTER_SPACING;
        const baseY = H / 2 - 15 + tsz * 0.58 + 10;
        let x = W / 2 - total / 2;
        chars.forEach((ch, i) => {
          const p = clamp01((t - (SUBTITLE_START + i * SUBTITLE_STAGGER)) / SUBTITLE_CHAR_DUR);
          if (p > 0) {
            const e = easeOutCubic(p);
            ctx!.globalAlpha = e;
            ctx!.fillText(ch, x, baseY + 12 * (1 - e));
          }
          x += widths[i];
        });
        ctx!.restore();
      }
    }

    function loop(now: number) {
      raf = 0;
      if (finished || pausedAt !== null) return;

      elapsed = (now - start - pausedTotal) / 1000;
      const mob = isMobile(W);

      ctx!.save();
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, W, H);
      drawIntro(elapsed, mob);
      ctx!.restore();

      // Nav fades in at 10.0 s
      if (elapsed >= NAV_AT && !navDone) {
        navDone = true;
        const n = document.querySelector<HTMLElement>('nav');
        if (n) {
          n.style.transition = 'opacity 0.6s ease';
          n.style.opacity = '1';
          n.style.pointerEvents = 'auto';
          n.classList.add('nav-visible');
        }
      }

      // Glass: slide in LEFT → RIGHT, then hold
      if (elapsed >= GLASS_START && !triggered) {
        ensureGlassPanel();
        if (glassPanel) {
          if (elapsed < GLASS_START + GLASS_SLIDE) {
            const p = clamp01((elapsed - GLASS_START) / GLASS_SLIDE);
            glassPanel.style.transform = `translateX(${(-1 + easeOutCubic(p)) * 100}%)`;
          } else {
            glassPanel.style.transform = 'translateX(0%)';
            if (!glassSlideDone) {
              glassSlideDone = true;
              holdStart = elapsed;
              document.body.style.overflow = 'hidden';
              document.body.style.overscrollBehavior = 'none';
            }
          }
        }
      }

      // Accept scroll intent only after the 3 s hold
      if (glassSlideDone && !triggered && !inputReady && elapsed - holdStart >= INPUT_DELAY) {
        inputReady = true;
      }

      // Overlay fades out as the glass falls
      if (triggered) {
        const fallT = elapsed - triggerTime;
        container!.style.backgroundColor = `rgba(5,5,5,${Math.max(0, 1 - fallT / FALL_DUR)})`;
        if (fallT >= FALL_END) {
          finish();
          return;
        }
      }

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      teardown();
      document.removeEventListener('visibilitychange', onVisibility);
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      id="intro-sequence"
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{ zIndex: 200, backgroundColor: BG_COLOR }}
      aria-label="Portfolio Introduction"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ width: '100vw', height: '100vh' }}
      />

      <button
        type="button"
        onClick={() => finishRef.current()}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 220,
          backgroundColor: '#000',
          color: '#FFF',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          padding: '7px 14px',
          border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'monospace, sans-serif',
          fontWeight: 600,
          pointerEvents: 'auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          transition: 'background-color 0.2s ease, border-color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1a1a1a';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#000';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
        }}
      >
        Skip intro
      </button>
    </div>
  );
};

export default IntroSequence;