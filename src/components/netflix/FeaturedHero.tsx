import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import pictureImg from '../../assets/portfolio/picture.png';

const developerRoles = [
  'FEATURE FILM // FULL-STACK ARCHITECT',
  'ORIGINAL SERIES // AI & ML SPECIALIST',
  'BLOCKBUSTER // DISTRIBUTED SYSTEMS',
  'ACCLAIMED // ALGORITHMIC PROBLEM SOLVER',
];

/**
 * "Now streaming" feature card from the Netflix portfolio:
 * cinematic entrance, scrolling marquee, holographic 3D tilt with glare and a mouse spotlight.
 */
export const FeaturedHero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const content = contentRef.current;
    const glare = glareRef.current;
    const spotlight = spotlightRef.current;
    if (!section || !card || !content || !glare || !spotlight) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .fromTo(
            content.querySelectorAll('.hero-anim-item'),
            { y: 50, opacity: 0, filter: 'blur(10px)' },
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, stagger: 0.12 }
          )
          .fromTo(
            card,
            { scale: 0.75, opacity: 0, rotationY: 35, rotationX: -15 },
            { scale: 1, opacity: 1, rotationY: 0, rotationX: 0, duration: 1.4, ease: 'back.out(1.2)' },
            '-=0.9'
          );
      }
    }, section);

    const xTilt = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power3.out' });
    const yTilt = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power3.out' });
    const glareX = gsap.quickTo(glare, 'x', { duration: 0.3, ease: 'power2.out' });
    const glareY = gsap.quickTo(glare, 'y', { duration: 0.3, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      if (reduce) return;
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      spotlight.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;

      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2 - rect.left;
      const cardCenterY = cardRect.top + cardRect.height / 2 - rect.top;

      xTilt(((x - cardCenterX) / (cardRect.width / 2)) * 16);
      yTilt(-((y - cardCenterY) / (cardRect.height / 2)) * 16);

      glareX(e.clientX - cardRect.left - cardRect.width / 2);
      glareY(e.clientY - cardRect.top - cardRect.height / 2);
    };

    const handleEnter = () => gsap.to(spotlight, { opacity: 1, duration: 0.3 });
    const handleLeave = () => {
      gsap.to(spotlight, { opacity: 0, duration: 0.3 });
      xTilt(0);
      yTilt(0);
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseenter', handleEnter);
    section.addEventListener('mouseleave', handleLeave);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseenter', handleEnter);
      section.removeEventListener('mouseleave', handleLeave);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="featured"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050505] overflow-hidden flex flex-col justify-between select-none"
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
      `}</style>

      {/* Background gradient & marquee */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/90 to-[#050505] z-0">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-10">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...developerRoles, ...developerRoles].map((role, idx) => (
              <span key={idx} className="text-[14vw] font-black text-red-600 mx-8 uppercase tracking-tighter">
                {role} &bull;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mouse-following spotlight */}
      <div
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-10 opacity-0 blur-[90px] transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(229,9,20,0.35) 0%, rgba(229,9,20,0.1) 40%, transparent 70%)',
        }}
      />

      <div
        ref={contentRef}
        className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-between pt-28 pb-12 min-h-screen"
      >
        {/* Top badge */}
        <div className="hero-anim-item flex items-center justify-between w-full">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded bg-black/80 backdrop-blur-2xl border border-red-600/40 text-xs font-mono uppercase tracking-widest text-white shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-red-500 font-bold tracking-wider">NETFLIX DEVELOPER SERIES</span>
            <span className="text-white/40">|</span>
            <span className="text-white/80">SEASONS 2024 - 2026</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-white/50 tracking-wider">
            <span className="px-2 py-0.5 border border-white/20 rounded bg-black/40">FULL-STACK 4K</span>
            <span className="px-2 py-0.5 border border-white/20 rounded bg-black/40">AI / ML CERTIFIED</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 my-auto">
          {/* Left: story */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-5 text-left">
            <div className="hero-anim-item flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-red-600 text-white font-black text-xs rounded tracking-widest shadow-[0_0_20px_rgba(229,9,20,0.8)] animate-pulse">
                TOP 1%
              </span>
              <span className="text-white/80 text-xs font-mono tracking-widest uppercase">Software Engineer &amp; Problem Solver</span>
            </div>

            <h2 className="hero-anim-item text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.95] drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
              VIBHEESHAN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-600 to-red-700 drop-shadow-[0_0_35px_rgba(220,38,38,0.5)]">
                N K
              </span>
            </h2>

            <div className="hero-anim-item flex flex-wrap items-center gap-3 text-xs font-mono text-red-400 font-bold">
              <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded text-red-500">99.9% Uptime</span>
              <span className="text-white/40">•</span>
              <span>React • Node.js • PostgreSQL</span>
              <span className="text-white/40">•</span>
              <span className="text-white/70">Docker &amp; Cloud</span>
            </div>

            <p className="hero-anim-item text-sm md:text-base text-white/80 font-light leading-relaxed max-w-md drop-shadow">
              Architecting robust full-stack systems, building scalable multi-tenant SaaS platforms, and engineering cutting-edge AI integrations.
            </p>

            <div className="hero-anim-item flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#projects"
                className="px-8 py-3.5 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_10px_35px_rgba(255,255,255,0.3)] flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                View Projects
              </a>
              <a
                href="#contact"
                className="px-8 py-3.5 bg-neutral-900/80 text-white border border-white/20 font-bold text-xs uppercase tracking-widest rounded hover:bg-neutral-800 transition-all duration-300 shadow-xl backdrop-blur-md flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Contact Me
              </a>
            </div>
          </div>

          {/* Centre: holographic tilt poster */}
          <div className="lg:col-span-4 flex justify-center perspective-[1200px]">
            <div ref={cardRef} className="relative group transform-gpu transition-transform duration-100 ease-out will-change-transform">
              <div className="absolute -inset-3 bg-gradient-to-r from-red-600/70 via-rose-600/40 to-purple-600/20 rounded-3xl blur-3xl opacity-90 group-hover:opacity-100 animate-pulse duration-1000"></div>

              <div className="relative w-[280px] md:w-[320px] p-3.5 bg-[#141414]/90 backdrop-blur-2xl rounded-2xl border border-red-600/40 shadow-[0_40px_80px_rgba(0,0,0,0.95)] overflow-hidden">
                <div
                  ref={glareRef}
                  className="absolute inset-[-50%] w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none transform-gpu z-40"
                ></div>

                <div className="absolute top-6 left-6 z-30 px-3 py-1 bg-red-600 text-white font-mono text-[10px] font-bold tracking-widest rounded shadow-xl">
                  FEATURED DEV
                </div>

                <img
                  src={pictureImg}
                  alt="Portrait of Sushmita Dasari"
                  className="w-full h-[330px] md:h-[390px] object-contain rounded-xl bg-gradient-to-b from-[#1b1b1b] to-[#0a0a0a] filter contrast-125 brightness-105 group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right: awards */}
          <div className="hero-anim-item lg:col-span-3 flex flex-col items-start lg:items-end space-y-4 text-left lg:text-right">
            <div className="p-5 bg-black/80 backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl max-w-xs">
              <h3 className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold mb-2">Core Stack &amp; Awards</h3>
              <p className="text-xs text-white/80 leading-relaxed font-light">
                Flipkart GRiD 7.0 Semi-Finalist, AlgoUniversity Tech Fellow, GitHub Foundations Certified.
              </p>
            </div>
          </div>
        </div>

        <div className="hero-anim-item flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono text-white/50 tracking-widest uppercase">
          <span>ENGINEERED FOR SCALABILITY</span>
          <span>[ PORTFOLIO RELEASE v2.6 ]</span>
        </div>
      </div>
    </section>
  );
};

export default FeaturedHero;
