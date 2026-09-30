import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

type GsapBundle = {
  gsap: typeof GsapType | null;
  ScrollTrigger: typeof ScrollTriggerType | null;
};

// Module-level cache so GSAP is imported (and the plugin registered) once,
// no matter how many sections ask for it.
let gsapPromise: Promise<GsapBundle> | null = null;

/** Media queries shared by every GSAP matchMedia() call. */
export const MOTION_MEDIA = {
  desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
  tablet: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  motionOk: '(prefers-reduced-motion: no-preference)',
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True for mouse / trackpad devices. Touch-first devices get no cursor effects. */
export function hasFinePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function useScrollAnimation() {
  function initGSAP(): Promise<GsapBundle> {
    if (typeof window === 'undefined') {
      return Promise.resolve({ gsap: null, ScrollTrigger: null });
    }

    if (!gsapPromise) {
      gsapPromise = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
        ([gsapModule, stModule]) => {
          const gsap = (gsapModule.default || gsapModule.gsap) as typeof GsapType;
          const ScrollTrigger = (stModule.default || stModule.ScrollTrigger) as typeof ScrollTriggerType;
          gsap.registerPlugin(ScrollTrigger);
          return { gsap, ScrollTrigger };
        },
      );
    }

    return gsapPromise;
  }

  return {
    initGSAP,
    isReducedMotion: prefersReducedMotion,
  };
}
