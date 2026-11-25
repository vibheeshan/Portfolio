import { useEffect, useState, useCallback } from 'react';
import { IntroSequence } from './components/IntroSequence';
import { initScrollReveal } from './lib/scrollReveal';
import { Contact } from './components/Contact';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Skills } from './components/Skills';
import { Projects as FeaturedWork } from './components/Projects';
import { VideoModal } from './components/VideoModal';
import { ParticleField } from './components/ParticleField';
import { SparkCursor } from './components/SparkCursor';
import { NetflixCursor } from './components/NetflixCursor';
import { Experience } from './components/Experience';
import NetflixAbout from './components/netflix/About';
import NetflixExpertise from './components/netflix/Expertise';
import NetflixSkills from './components/netflix/Skills';
import NetflixProjects from './components/netflix/Projects';
import NetflixFooter from './components/netflix/Footer';
import CustomCursor from './components/netflix/CustomCursor';
import { PORTFOLIO_PROJECTS, SITE } from './data/portfolioData';
import type { Project } from './data/portfolioData';
import FeaturedHero from './components/netflix/FeaturedHero';

export function App() {
  useEffect(() => {
    document.title = SITE.pageTitle;
  }, []);

  // If reduced-motion is set, intro doesn't mount — start reveals + show nav immediately
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const nav = document.querySelector<HTMLElement>('[data-intro-nav]');
      if (nav) nav.classList.add('nav-visible');
      const cleanup = initScrollReveal();
      return cleanup;
    }
  }, []);

  const handleIntroComplete = useCallback(() => {
    const cleanup = initScrollReveal();
    return cleanup;
  }, []);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = (direction: 1 | -1) => {
    if (!selectedProject) return;
    const idx = PORTFOLIO_PROJECTS.findIndex((p) => p.id === selectedProject.id);
    if (idx === -1) return;
    const nextIdx = (idx + direction + PORTFOLIO_PROJECTS.length) % PORTFOLIO_PROJECTS.length;
    setSelectedProject(PORTFOLIO_PROJECTS[nextIdx]);
  };

  const handleInquire = () => {
    setIsModalOpen(false);
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative isolate min-h-screen text-gray-100 flex flex-col font-sans selection:bg-[#a31515] selection:text-white bg-[#07070a]">
      {/* 3D WebGL starfield with forward scroll travel and click shockwaves */}
      <ParticleField />

      {/* Ambient red glow orbs behind the glass */}
      <div className="ambient" aria-hidden="true">
        <i className="o1" />
        <i className="o3" />
      </div>

      {/* Interactive 2D spark & lightning cursor */}
      <SparkCursor />

      {/* Netflix dot, ring and red spotlight cursor */}
      <NetflixCursor />

      {/* Netflix red dot, ring and spotlight cursor */}
      <CustomCursor />

      {/* Navbar with blur on scroll */}
      <Navbar />

      <main className="relative z-10 w-full flex-1">
        <IntroSequence onComplete={handleIntroComplete} />
        <Hero />
        <FeaturedHero/>
        <About />
        <NetflixAbout />
        <NetflixExpertise />
        <Services />
        <Skills />
        <NetflixSkills />
        <FeaturedWork onSelectProject={handleSelectProject} />
        <NetflixProjects />
        <Experience />
        <Contact />
      
      </main>

      <div className="relative z-10">
        <NetflixFooter />
      </div>

      <VideoModal
        project={isModalOpen ? selectedProject : null}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
        onInquire={handleInquire}
      />
    </div>
  );
}

export default App;
