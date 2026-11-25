/**
 * scrollReveal.ts
 * IntersectionObserver-based scroll reveal utility.
 * Watches [data-reveal] and [data-reveal-image] elements.
 * Call initScrollReveal() after the intro completes (or immediately if skipped).
 * Returns a cleanup function that disconnects the observer.
 */

type RevealType = 'row' | 'card' | 'card-last' | 'image';

function getThreshold(type: RevealType): number {
  switch (type) {
    case 'card':
    case 'card-last':
      return 0.12;
    case 'row':
      return 0.15;
    case 'image':
      return 0.1;
    default:
      return 0.1;
  }
}

export function initScrollReveal(): () => void {
  // Respect prefers-reduced-motion: immediately reveal everything, no animation
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document
      .querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-image]')
      .forEach((el) => {
        el.classList.add('is-visible');
      });
    return () => {};
  }

  const observed = new Set<Element>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add('is-visible');
          observer.unobserve(el);
          observed.delete(el);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -48px 0px',
    }
  );

  // Observe [data-reveal] elements with stagger support
  const revealEls = document.querySelectorAll<HTMLElement>('[data-reveal]');
  revealEls.forEach((el, i) => {
    const type = el.getAttribute('data-reveal') as RevealType;
    // Stagger by index within a group
    const group = el.closest('[data-reveal-group]');
    if (group) {
      const siblings = Array.from(group.querySelectorAll('[data-reveal]'));
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = `${idx * 0.08}s`;
    }
    observer.observe(el);
    observed.add(el);
  });

  // Observe [data-reveal-image] elements
  const imageEls = document.querySelectorAll<HTMLElement>('[data-reveal-image]');
  imageEls.forEach((el) => {
    el.style.transitionDelay = '0.3s';
    observer.observe(el);
    observed.add(el);
  });

  return () => {
    observer.disconnect();
    observed.clear();
  };
}
