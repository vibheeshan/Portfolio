import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Verified details from the source portfolios only. */
const timeline = [
  {
    period: 'Present',
    role: 'B.Tech · Artificial Intelligence & Machine Learning',
    org: 'Aditya Engineering College',
    detail: 'Building a foundation in algorithms, machine learning and full-stack engineering.',
  },
  {
    period: 'Competition',
    role: 'National Semi-Finalist',
    org: 'Flipkart GRiD 7.0',
    detail: 'Recognised at a national software engineering competition.',
  },
  {
    period: 'Fellowship',
    role: 'Tech Fellow',
    org: 'AlgoUniversity',
    detail: 'Member of the Tech Fellowship focused on advanced data structures and algorithms.',
  },
  {
    period: 'Certifications',
    role: 'GitHub Foundations · AWS Certified AI Practitioner',
    org: 'Certified',
    detail: 'Validated skills in version control, collaboration and applied AI on AWS.',
  },
];

const roles = ['Web Developer', 'AI Developer', 'Founder of Sri Tech'];

/**
 * Scroll-reveal timeline (from the Sri Tech portfolio's `.reveal` system),
 * with the Sri Tech founder card.
 */
export const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.exp-reveal').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="relative w-full bg-[#050505] text-white py-28 px-6 md:px-16 lg:px-24 overflow-hidden border-t border-white/5">
      <div className="absolute -top-40 right-0 w-[520px] h-[520px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="exp-reveal mb-16">
          <span className="text-[#a31515] font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mb-2 block">
            Journey &amp; Recognition
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">
            Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-600 to-red-700">&amp; Achievements</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Timeline */}
          <ol className="lg:col-span-8 relative border-l border-white/10 ml-2 space-y-10">
            {timeline.map((item) => (
              <li key={item.role} className="exp-reveal relative pl-8">
                <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_12px_#E50914]" />
                <p className="text-[11px] font-mono uppercase tracking-widest text-red-500">{item.period}</p>
                <h3 className="text-xl md:text-2xl font-bold mt-1">{item.role}</h3>
                <p className="text-sm text-white/60 mt-1">{item.org}</p>
                <p className="text-sm text-white/70 font-light mt-2 max-w-xl leading-relaxed">{item.detail}</p>
              </li>
            ))}
          </ol>

          {/* Sri Tech founder card */}
          <aside className="exp-reveal lg:col-span-4">
            <div className="p-8 rounded-3xl bg-[#141414]/90 border border-white/10 hover:border-red-600/50 transition-colors duration-500 shadow-2xl">
              <p className="text-[11px] font-mono uppercase tracking-widest text-red-500">Sri Tech</p>
              <h3 className="text-2xl font-black mt-2">Founder</h3>
              <ul className="mt-6 space-y-3">
                {roles.map((r) => (
                  <li key={r} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Experience;
