import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // --- Cinematic Stagger Entrance on Scroll ---
    gsap.fromTo(
      cardRefs.current,
      { y: 80, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // --- Interactive Magnetic Mouse Spotlight per Bento Card ---
    const cards = cardRefs.current;
    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    cards.forEach((card) => {
      if (!card) return;
      const listener = (e) => handleMouseMove(e, card);
      card.addEventListener('mousemove', listener);
      return () => card.removeEventListener('mousemove', listener);
    });

  }, []);

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-[#050505] text-white py-32 px-6 md:px-12 flex flex-col justify-center select-none overflow-hidden"
    >
      {/* Background Cinematic Red Ambient Glows */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col items-start space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-black/80 backdrop-blur-2xl border border-red-600/40 text-xs font-mono uppercase tracking-widest text-white shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span className="text-red-500 font-bold">EPISODE 01</span>
            <span className="text-white/40">|</span>
            <span>ABOUT THE ENGINEER</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
            EPISODE SYNOPSIS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-600 to-red-700 drop-shadow-[0_0_30px_rgba(229,9,20,0.4)]">
              ORIGIN & VISION.
            </span>
          </h2>
        </div>

        {/* Bento Grid Layout with Interactive Mouse Light Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Bio & Academic Core (Span 7) */}
          <div
            ref={addToRefs}
            className="md:col-span-7 p-8 md:p-12 bg-[#141414]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col justify-between relative group hover:border-red-600/60 transition-all duration-500 overflow-hidden"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(229,9,20,0.15), transparent 70%)'
              }}
            ></div>

            <div className="absolute top-0 right-0 p-8 text-white/5 font-mono text-7xl font-black pointer-events-none">
              01
            </div>
            
            <div className="space-y-5 relative z-10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">Cast & Background</h3>
              <p className="text-lg md:text-xl font-medium text-white/90 leading-relaxed">
                I am <span className="text-white font-bold drop-shadow">VIBHEESHAN NK</span>, an Electronics & Communication Engineering student at <span className="text-red-400 font-semibold">Knowledge Institute of Technology (KIOT)</span>, Salem.
              </p>
              <p className="text-sm md:text-base text-white/60 font-light leading-relaxed">
                Maintaining a <strong className="text-white">CGPA of 8.55 / 10</strong> (Graduating 2028), I specialize in Python backend engineering, real-time AI/ML pipelines, and embedded IoT architectures. Track record of <strong className="text-white">5+ national-level hackathons</strong> with award-winning presentations.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-mono text-white/70">
                <span className="px-3 py-1 rounded bg-white/5 border border-white/10">🎓 B.E. ECE @ KIOT (8.55 CGPA)</span>
                <span className="px-3 py-1 rounded bg-white/5 border border-white/10">🏫 HSC @ Sri Vinayaga Matric (85.17%)</span>
              </div>
            </div>
            
            <div className="pt-8 flex flex-wrap gap-2 relative z-10">
              <span className="px-3.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-white/80">Python Stack</span>
              <span className="px-3.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-white/80">AI / ML (20+ Models)</span>
              <span className="px-3.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-white/80">Embedded IoT & ESP32</span>
              <span className="px-3.5 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-white/80">VLSI & Verilog</span>
            </div>
          </div>

          {/* Card 2: Fellowships & Achievements (Span 5) */}
          <div
            ref={addToRefs}
            className="md:col-span-5 p-8 md:p-12 bg-[#141414]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col justify-between relative group hover:border-red-600/60 transition-all duration-500 overflow-hidden"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(229,9,20,0.15), transparent 70%)'
              }}
            ></div>

            <div className="absolute top-0 right-0 p-8 text-white/5 font-mono text-7xl font-black pointer-events-none">
              02
            </div>
            
            <div className="space-y-5 relative z-10">
              <h3 className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">Hackathons & Certifications</h3>
              <ul className="space-y-3 text-sm text-white/80 font-light">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">&#8250;</span>
                  <span>🏆 <strong className="text-white">Special Prize for Best Presentation/Pitch</strong> at iStart Hackathon for <i>HarvestLink</i>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">&#8250;</span>
                  <span>🏅 <strong className="text-white">Tekhora'26 MIT Chennai</strong> — Sentiment Analyzer (91.8% NLP Accuracy).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">&#8250;</span>
                  <span>📜 Certified <strong className="text-white">Google AI Agents Intensive</strong> & <strong className="text-white">NPTEL Elite (72%)</strong> in Microsensors.</span>
                </li>
              </ul>
            </div>
            
            <div className="pt-6 font-mono text-xs text-white/40 relative z-10">
              // 5+ HACKATHONS • 20+ ML MODELS
            </div>
          </div>

          {/* Card 3: Internships Grid (Span 12) */}
          <div
            ref={addToRefs}
            className="md:col-span-12 p-8 md:p-12 bg-[#141414]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col space-y-6 hover:border-red-600/60 transition-all duration-500 overflow-hidden relative group"
          >
            {/* Real-time mouse hover spotlight highlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(229,9,20,0.15), transparent 70%)'
              }}
            ></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1 text-left">
                <h3 className="text-xs font-mono uppercase tracking-widest text-red-500 font-bold">Work & Internship Experience</h3>
                <p className="text-lg md:text-xl font-bold text-white">Proven Track Record Across Top Organizations</p>
              </div>
              <span className="text-xs font-mono text-white/50 border border-white/10 px-3 py-1 rounded bg-black/40">3 INTERNSHIPS</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-2">
              
              {/* Internship 1 */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-red-500/40 transition-colors space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-red-500">INFOSYS</span>
                  <span className="text-[10px] font-mono text-white/40">NOV 2025 - FEB 2026</span>
                </div>
                <h4 className="text-base font-bold text-white">Software Development Intern</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Developed modular BankBot AI chatbot using Python, Flask, and Streamlit. Built NLP classification module achieving 95%+ query accuracy.
                </p>
                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-white/60">
                  <span className="px-2 py-0.5 rounded bg-white/5">Python</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">Flask</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">Streamlit</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">NLP</span>
                </div>
              </div>

              {/* Internship 2 */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-red-500/40 transition-colors space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-red-500">MARCELLOTECH</span>
                  <span className="text-[10px] font-mono text-white/40">JAN 2025 - FEB 2025</span>
                </div>
                <h4 className="text-base font-bold text-white">Embedded Systems & IoT Intern</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Engineered hardware-software IoT solutions using ESP32, Arduino Nano, and LoRa SX1278. Interfaced multi-sensor modules with WOWKI simulations.
                </p>
                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-white/60">
                  <span className="px-2 py-0.5 rounded bg-white/5">ESP32</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">LoRa</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">C/C++</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">MQTT</span>
                </div>
              </div>

              {/* Internship 3 */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-red-500/40 transition-colors space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono font-bold text-red-500">UNITED SOFT TECH</span>
                  <span className="text-[10px] font-mono text-white/40">JUN 2025 - JUL 2025</span>
                </div>
                <h4 className="text-base font-bold text-white">VLSI Design Intern</h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  Designed combinational and sequential RTL modules using Verilog HDL including multiplexers, flip-flops, counters, and digital logic circuits.
                </p>
                <div className="flex flex-wrap gap-1 text-[10px] font-mono text-white/60">
                  <span className="px-2 py-0.5 rounded bg-white/5">Verilog HDL</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">RTL Design</span>
                  <span className="px-2 py-0.5 rounded bg-white/5">Digital Circuits</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;