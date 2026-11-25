import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide glass backdrop: soft gradient light, floating glass orbs and slow cinematic
 * background text (outlined, very low contrast) that drifts with scroll. Purely decorative.
 */
export const GlassBackdrop: React.FC = () => {
  const rowA = useRef<HTMLDivElement>(null);
  const rowB = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Continuous drift in opposite directions
      gsap.to(rowA.current, { xPercent: -50, duration: 60, ease: 'none', repeat: -1 });
      gsap.fromTo(rowB.current, { xPercent: -50 }, { xPercent: 0, duration: 75, ease: 'none', repeat: -1 });

      // Scroll-linked push so the text moves with the page
      gsap.to(rowA.current, {
        x: -220,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });
      gsap.to(rowB.current, {
        x: 220,
        ease: 'none',
        scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 },
      });

      // Glass orbs float gently
      gsap.utils.toArray<HTMLElement>('.glass-orb').forEach((orb, i) => {
        gsap.to(orb, { y: i % 2 ? 40 : -40, x: i % 2 ? -30 : 30, duration: 9 + i * 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      });
    });

    return () => ctx.revert();
  }, []);

  const line = 'SUSHMITA DASARI · WEB · AI · SRI TECH · ';

  return (
    <div aria-hidden="true" className="glass-backdrop fixed inset-0 z-[1] pointer-events-none overflow-hidden select-none">
      <div className="absolute inset-0 glass-light" />
      <div className="glass-orb absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full" />
      <div className="glass-orb absolute top-[45%] -right-32 h-[520px] w-[520px] rounded-full" />
      <div className="glass-orb absolute bottom-[-10%] left-[30%] h-[360px] w-[360px] rounded-full" />

      <div className="absolute inset-x-0 top-[18%] overflow-hidden">
        <div ref={rowA} className="flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <span key={k} className="cine-text pr-10">{line.repeat(3)}</span>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 top-[62%] overflow-hidden">
        <div ref={rowB} className="flex w-max whitespace-nowrap">
          {[0, 1].map((k) => (
            <span key={k} className="cine-text cine-text--alt pr-10">{line.repeat(3)}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GlassBackdrop;
