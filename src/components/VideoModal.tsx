import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { Project } from '../data/portfolioData';

interface VideoModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
  onInquire: (project: Project) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ project, onClose, onNavigate, onInquire }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = project !== null;

  // Lock scroll, trap focus, handle keys, and return focus to the card that opened the modal
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate(1);
      if (e.key === 'ArrowLeft') onNavigate(-1);
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, a[href], video[controls], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-2xl"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25 }}
            className="glass glass-strong relative z-10 flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-[#ff334b]/35 shadow-2xl shadow-red-950/50"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-5 py-3.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="glass-chip-red shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white">{project.category}</span>
                <h3 className="truncate text-base font-bold text-white">{project.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate(-1)}
                  aria-label="Previous project"
                  className="glass-chip rounded-full p-2 text-gray-100 hover:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate(1)}
                  aria-label="Next project"
                  className="glass-chip rounded-full p-2 text-gray-100 hover:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close project"
                  className="glass-chip rounded-full p-2 text-gray-200 hover:bg-red-600/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="relative flex aspect-video w-full items-center justify-center bg-black">
              {project.embedUrl ? (
                <iframe
                  key={project.id}
                  // YouTube links: append autoplay=1&mute=0 — Drive preview URLs pass through unchanged
                  src={
                    project.embedUrl.includes('youtube.com/embed')
                      ? `${project.embedUrl}?autoplay=1&rel=0&modestbranding=1`
                      : project.embedUrl
                  }
                  title={project.title}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : project.videoUrl ? (
                <video
                  key={project.id}
                  src={project.videoUrl}
                  poster={project.poster}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : project.poster ? (
                <img
                  key={project.id}
                  src={project.poster}
                  alt={`${project.title} preview`}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              ) : (
                <p className="px-6 text-center text-sm text-gray-300">
                  Preview unavailable.
                </p>
              )}
            </div>

            <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm leading-relaxed text-gray-100 sm:text-base">{project.description ?? `${project.title}, ${project.subtitle}`}</p>
                {project.tags && project.tags.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((t) => (
                      <li key={t} className="glass-chip rounded-full px-3 py-1 text-xs font-medium text-gray-100">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-chip inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-xs font-bold text-gray-200 hover:text-white"
                  >
                    <span>View Live</span>
                    <ExternalLink className="h-3.5 w-3.5 text-red-400" />
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-chip inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-xs font-bold text-gray-200 hover:text-white"
                  >
                    <span>View Code</span>
                    <ExternalLink className="h-3.5 w-3.5 text-red-400" />
                  </a>
                )}
                {project.driveUrl && (
                  <a
                    href={project.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-chip inline-flex items-center gap-1.5 rounded-full px-4 py-3 text-xs font-bold text-gray-200 hover:text-white"
                  >
                    <span>Watch in Drive</span>
                    <ExternalLink className="h-3.5 w-3.5 text-red-400" />
                  </a>
                )}
                <a
                  href="#contact"
                  onClick={() => onInquire(project)}
                  className="glass-red rounded-full px-5 py-3 text-xs font-bold uppercase tracking-wider text-white"
                >
                  {project.kind === 'software' ? 'Discuss Project' : 'Request Project'}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
