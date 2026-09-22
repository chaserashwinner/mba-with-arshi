import { onMounted, onUnmounted } from 'vue';

export function useScrollAnimation() {
  let gsapInstance: any = null;
  let scrollTriggerInstance: any = null;

  async function initGSAP() {
    if (typeof window === 'undefined') return { gsap: null, ScrollTrigger: null };

    if (!gsapInstance) {
      const gsapModule = await import('gsap');
      const stModule = await import('gsap/ScrollTrigger');
      
      gsapInstance = gsapModule.default || gsapModule.gsap;
      scrollTriggerInstance = stModule.default || stModule.ScrollTrigger;

      gsapInstance.registerPlugin(scrollTriggerInstance);
    }

    return { gsap: gsapInstance, ScrollTrigger: scrollTriggerInstance };
  }

  function isReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  return {
    initGSAP,
    isReducedMotion,
  };
}
