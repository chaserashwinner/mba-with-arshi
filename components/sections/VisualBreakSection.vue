<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useScrollAnimation, MOTION_MEDIA } from '~/composables/useScrollAnimation';

const sectionRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);

const { initGSAP, isReducedMotion } = useScrollAnimation();
let gsapCtx: { revert: () => void } | null = null;

onMounted(async () => {
  if (isReducedMotion()) return;

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !sectionRef.value || !textRef.value) return;

  gsapCtx = gsap.context(() => {
    const mm = gsap.matchMedia();
    // Subtle depth: the statement drifts slightly slower than the page.
    mm.add(MOTION_MEDIA.tablet, () => {
      gsap.fromTo(
        textRef.value,
        { scale: 0.96, y: 40 },
        {
          scale: 1,
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );
    });
  }, sectionRef.value);
});

onBeforeUnmount(() => gsapCtx?.revert());
</script>

<template>
  <section ref="sectionRef" class="visual-break-section" aria-labelledby="principle-heading">
    <div class="glow-backdrop" aria-hidden="true"></div>

    <div class="break-container">
      <div ref="textRef" class="quote-text-block">
        <span v-reveal="'fade'" class="eyebrow">
          <span class="line"></span>
          <span>THE ADMISSION PRINCIPLE</span>
        </span>

        <h2 id="principle-heading" v-split-words="{ delay: 100 }">
          THE RIGHT MBA <br />
          STARTS WITH THE <br />
          <em class="serif-italic">RIGHT QUESTIONS.</em>
        </h2>

        <p v-reveal="{ variant: 'up', delay: 450 }" class="break-sub">
          Not marketing hype. Not unverified rank lists. Pure profile clarity.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.visual-break-section {
  position: relative;
  padding: clamp(100px, 14vw, 160px) max(5vw, 20px);
  background: var(--bg-dark);
  color: var(--ink-dark);
  text-align: center;
  overflow: hidden;
  isolation: isolate;
}

/* Soft radial glow — gradient only, no blur filter */
.glow-backdrop {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(900px, 140vw);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, rgba(124, 58, 237, 0.06) 40%, transparent 65%);
  pointer-events: none;
  z-index: 1;
}

.break-container {
  position: relative;
  z-index: 10;
  max-width: 960px;
  margin: 0 auto;
}

.quote-text-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quote-text-block .eyebrow {
  margin-bottom: 24px;
}

h2 {
  margin: 0;
  font-size: clamp(2.3rem, 6.5vw, 5.8rem);
  line-height: 0.98;
  letter-spacing: -0.05em;
  font-weight: 900;
  color: #ffffff;
}

h2 .serif-italic {
  font-weight: 500;
  letter-spacing: -0.03em;
}

.break-sub {
  margin: 30px 0 0;
  color: var(--ink-dark-muted);
  font-size: clamp(1rem, 1.8vw, 1.25rem);
  max-width: 520px;
}
</style>
