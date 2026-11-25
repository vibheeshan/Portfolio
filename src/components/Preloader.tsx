import { useEffect, useRef } from "react";
import gsap from "gsap";

const NAME = "SUSHMITA DASARI";
/** Honest fallback: the preloader never blocks the page longer than this. */
const TIMEOUT_MS = 3500;

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      onDone();
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(finish, TIMEOUT_MS);

    const ctx = gsap.context(() => {
      if (reduce) {
        finish();
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // Mask reveal: the preloader lifts upward to uncover the hero.
          gsap.to(root.current, {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.9,
            ease: "power4.inOut",
            onComplete: finish,
          });
        },
      });

      tl.fromTo(".pl-char", { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.04 })
        .fromTo(".pl-role", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.2")
        .fromTo(".pl-label", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "<")
        .fromTo(".pl-bar", { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power2.inOut" }, "-=0.4")
        .to({}, { duration: 0.3 });
    }, root);

    return () => {
      window.clearTimeout(timeout);
      ctx.revert();
    };
  }, [onDone]);

  return (
    <div
      ref={root}
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] px-6"
    >
      <h1 aria-label={NAME} className="text-center text-[clamp(1.75rem,6vw,4.5rem)] font-black tracking-tight text-white">
        {NAME.split("").map((c, i) => (
          <span key={i} aria-hidden="true" className="pl-char inline-block">
            {c === " " ? " " : c}
          </span>
        ))}
      </h1>
      <p className="pl-role mt-4 text-xs tracking-[0.3em] text-white/60 md:text-sm">
        WEB DEVELOPER · AI DEVELOPER · FOUNDER OF SRI TECH
      </p>
      <div className="mt-12 w-56 overflow-hidden bg-white/10 md:w-80" style={{ height: 2 }}>
        <div className="pl-bar h-full origin-left bg-red-600" style={{ transform: "scaleX(0)" }} />
      </div>
      <p className="pl-label mt-4 text-[10px] tracking-[0.3em] text-white/60">INITIALIZING EXPERIENCE</p>
    </div>
  );
}
