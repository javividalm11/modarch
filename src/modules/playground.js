import { gsap, ScrollTrigger, reduced } from './motion.js';

const SPEED = [0.16, -0.1];

export function initPlayground(section) {
  if (!section) return;

  const cols = [...section.querySelectorAll('[data-play-col]')];
  if (!cols.length) return;

  if (reduced || !window.matchMedia('(min-width: 900px)').matches) return;

  const triggers = cols.map((col, n) => {
    const total = SPEED[n % SPEED.length] * 100;
    return gsap.fromTo(
      col,
      { yPercent: -total / 2 },
      {
        yPercent: total / 2,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  return triggers;
}
