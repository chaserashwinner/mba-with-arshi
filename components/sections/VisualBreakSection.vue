<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useScrollAnimation } from '~/composables/useScrollAnimation';

const sectionRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);

const { initGSAP, isReducedMotion } = useScrollAnimation();

onMounted(async () => {
  if (isReducedMotion()) return;

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !sectionRef.value || !textRef.value) return;

  gsap.fromTo(
    textRef.value,
    { scale: 0.9, opacity: 0.3, y: 50 },
    {
      scale: 1,
      opacity: 1,
      y: -20,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top bottom-=50',
        end: 'bottom top+=50',
        scrub: 1,
      },
    }
  );
});
</script>

<template>
  <section ref="sectionRef" class="visual-break-section">
    <div class="glow-backdrop" aria-hidden="true"></div>

    <div class="break-container">
      <div ref="textRef" class="quote-text-block">
        <span class="eyebrow">
          <span class="line"></span>
          <span>THE ADMISSION PRINCIPLE</span>
        </span>

        <h2>
          THE RIGHT MBA <br />
          STARTS WITH THE <br />
          <em class="serif-italic">RIGHT QUESTIONS.</em>
        </h2>

        <p class="break-sub">
          Not marketing hype. Not unverified rank lists. Pure profile clarity.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.visual-break-section {
  position: relative;
  padding: 140px max(5vw, 24px);
  background: var(--bg-dark);
  color: var(--ink-dark);
  text-align: center;
  overflow: hidden;
  isolation: isolate;
}

.glow-backdrop {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.22) 0%, rgba(219, 46, 207, 0.1) 45%, transparent 70%);
  pointer-events: none;
  z-index: 1;
  filter: blur(60px);
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
  will-change: transform, opacity;
}

.quote-text-block .eyebrow {
  margin-bottom: 24px;
}

h2 {
  margin: 0;
  font-size: clamp(2.8rem, 6.5vw, 5.8rem);
  line-height: 0.94;
  letter-spacing: -0.05em;
  font-weight: 900;
  color: #ffffff;
}

.break-sub {
  margin-top: 30px;
  color: var(--ink-dark-muted);
  font-size: clamp(1rem, 1.8vw, 1.25rem);
  max-width: 520px;
}

@media (max-width: 640px) {
  .visual-break-section {
    padding: 90px 20px;
  }
}
</style>
