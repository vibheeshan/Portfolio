import React, { useRef, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES_PRICING } from '../data/portfolioData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const Services: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(titleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
        .fromTo(
          '.service-item',
          { y: 25, opacity: 0, x: -10 },
          { y: 0, opacity: 1, x: 0, duration: 0.45, stagger: 0.07, ease: 'back.out(1.4)' },
          '-=0.2'
        );


    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full text-gray-100 py-20 px-6 md:px-16 lg:px-24 flex flex-col items-center justify-center overflow-hidden border-t border-white/5"
    >
      {/* Section Title */}
      <div ref={titleRef} className="flex flex-col items-center text-center mb-12 z-10">
        <span className="text-[#a31515] font-bold uppercase text-[10px] md:text-xs tracking-[0.2em] mb-2 flex items-center gap-1.5">
          <img src="/assets/icon.svg" alt="" aria-hidden="true" className="w-4 h-4 object-contain" />
          What I Do
        </span>
        <h2
          className="text-3xl md:text-5xl font-black tracking-tight uppercase text-white"
        >
          SERVICES.
        </h2>
        <div className="w-12 h-1 bg-[#a31515] mt-2 rounded-full" />
      </div>

      {/* Service cards: glass rows, service on the left, price chip + action on the right */}
      <ul ref={listRef} className="grid-blur relative list-none p-0 m-0 w-full max-w-4xl grid grid-cols-2 gap-3 md:flex md:flex-col md:gap-4 z-10">
        {SERVICES_PRICING.map((service, i) => {
          const featured = 'featured' in service && service.featured;
          return (
            <li key={service.id} className="service-item">
              <a
                href="#contact"
                className="glass glass-grid-card group relative flex h-full flex-col items-start gap-3 p-4 md:flex-row md:items-center md:gap-6 md:p-5 rounded-3xl outline-none"
              >
                {/* Index */}
                <span className="glass-chip shrink-0 w-7 h-7 md:w-11 md:h-11 rounded-full flex items-center justify-center text-[10px] md:text-sm font-black tabular-nums text-gray-200 group-hover:text-white">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Name + price */}
                <div className="flex-1 min-w-0 flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-6">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm md:text-xl text-gray-100 group-hover:text-[#ff334b] transition-colors">
                      {service.title}
                    </h3>
                    {featured && (
                      <span className="glass-chip-red inline-block mt-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white">
                        Specialty
                      </span>
                    )}
                  </div>

                  {service.price && (
                    <div className="md:text-right shrink-0">
                      <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1">
                        {service.priceLabel}
                      </span>
                      <span className="glass-chip inline-block text-xs md:text-base font-black tabular-nums px-3 py-1 md:px-3.5 rounded-full text-gray-100 group-hover:text-white">
                        {service.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <span
                  aria-hidden="true"
                  className="glass-chip shrink-0 absolute right-3 top-3 w-8 h-8 md:static md:w-11 md:h-11 rounded-full flex items-center justify-center text-gray-300
                    group-hover:[background-image:linear-gradient(145deg,rgba(255,51,75,0.6),rgba(163,21,21,0.45))]
                    group-hover:border-[rgba(255,130,148,0.45)] group-hover:text-white"
                >
                  <ArrowUpRight
                    className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
