import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Netflix portfolio cursor: a red dot, a trailing ring and a soft red spotlight that follows the mouse.
 * Only active on fine pointers (mouse / trackpad) and skipped for reduced-motion users.
 */
export const NetflixCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const spot = spotRef.current;
    if (!dot || !ring || !spot) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const DOT = 12;
    const RING = 48;
    const SPOT = 350;

    gsap.set([dot, ring], { scale: 0.5, opacity: 0, transformOrigin: '50% 50%' });
    gsap.set(spot, { opacity: 0 });

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.05, ease: 'power2.out' });
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.05, ease: 'power2.out' });
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.15, ease: 'power3.out' });
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.15, ease: 'power3.out' });

    const handleMove = (e: MouseEvent) => {
      xDot(e.clientX - DOT / 2);
      yDot(e.clientY - DOT / 2);
      xRing(e.clientX - RING / 2);
      yRing(e.clientY - RING / 2);
      spot.style.transform = `translate3d(${e.clientX - SPOT}px, ${e.clientY - SPOT}px, 0)`;
    };
    const handleEnter = () => {
      gsap.to([dot, ring], { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(spot, { opacity: 1, duration: 0.3 });
    };
    const handleLeave = () => {
      gsap.to([dot, ring], { opacity: 0, scale: 0.5, duration: 0.3, ease: 'power2.inOut' });
      gsap.to(spot, { opacity: 0, duration: 0.3 });
    };

    window.addEventListener('mousemove', handleMove);
    document.documentElement.addEventListener('mouseenter', handleEnter);
    document.documentElement.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.documentElement.removeEventListener('mouseenter', handleEnter);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={spotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 w-[700px] h-[700px] rounded-full pointer-events-none z-[9998] blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(229,9,20,0.2) 0%, rgba(229,9,20,0.06) 45%, transparent 75%)' }}
      />
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-3 h-3 bg-red-600 rounded-full shadow-[0_0_15px_#E50914]"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none w-12 h-12 border border-red-600/60 rounded-full backdrop-blur-[1px]"
      />
    </>
  );
};

export default NetflixCursor;
