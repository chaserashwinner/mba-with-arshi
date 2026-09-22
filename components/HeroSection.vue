<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';

const personal = PORTFOLIO_DATA.personal;

const heroRef = ref<HTMLElement | null>(null);
const tiltStyle = ref({
  transform: 'none',
});

let rAF: number | null = null;

function handleMouseMove(e: MouseEvent) {
  if (!heroRef.value || window.innerWidth < 1024) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const rect = heroRef.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const percentX = (e.clientX - centerX) / (rect.width / 2);
  const percentY = (e.clientY - centerY) / (rect.height / 2);

  if (rAF) cancelAnimationFrame(rAF);

  rAF = requestAnimationFrame(() => {
    const rotateX = (-percentY * 4).toFixed(2);
    const rotateY = (percentX * 4).toFixed(2);
    const translateX = (percentX * 6).toFixed(2);
    const translateY = (percentY * 6).toFixed(2);

    tiltStyle.value = {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0px)`,
    };
  });
}

function handleMouseLeave() {
  tiltStyle.value = {
    transform: 'none',
  };
}

onUnmounted(() => {
  if (rAF) cancelAnimationFrame(rAF);
});
</script>

<template>
  <section 
    class="hero" 
    id="hero" 
    ref="heroRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div class="hero-glow"></div>
    <div class="hero-orbit orbit-one"></div>
    <div class="hero-orbit orbit-two"></div>

    <div class="hero-copy">
      <div class="eyebrow">
        <span class="dot"></span>
        <span>{{ personal.eyebrow }}</span>
      </div>

      <h1>
        {{ personal.headline }}<br />
        <em class="serif-italic">{{ personal.headlineItalic }}</em>
      </h1>

      <p>{{ personal.bio }}</p>

      <div class="hero-actions">
        <a class="button button-primary" :href="personal.primaryCtaLink">
          {{ personal.primaryCtaText }} <span aria-hidden="true">→</span>
        </a>
        <a 
          class="button button-ghost" 
          :href="personal.secondaryCtaLink" 
          target="_blank" 
          rel="noreferrer"
        >
          <span class="play-icon" aria-hidden="true">▶</span>
          {{ personal.secondaryCtaText }}
        </a>
      </div>

      <div class="trust-row">
        <div class="avatars" aria-hidden="true">
          <span v-for="(initial, idx) in personal.avatarInitials" :key="idx">
            {{ initial }}
          </span>
        </div>
        <p>
          <strong>{{ personal.experienceYears }}</strong><br />
          {{ personal.trustSubtitle }}
        </p>
      </div>
    </div>

    <!-- Right Side: MotionSites LTX Video Inspired Cinematic Character Visual -->
    <div class="hero-visual" aria-label="MBA Counselor Cinematic Video Visual">
      <HeroCinematicVisual :tiltStyle="tiltStyle" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 680px;
  padding: 80px max(5vw, 24px) 92px;
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  align-items: center;
  gap: clamp(48px, 7vw, 110px);
  overflow: hidden;
  position: relative;
  isolation: isolate;
}

h1 {
  margin: 22px 0 25px;
  font-size: clamp(3.3rem, 6vw, 6.5rem);
  line-height: 0.91;
  letter-spacing: -0.07em;
  font-weight: 860;
  color: var(--ink);
}

.hero-copy > p {
  max-width: 630px;
  margin-bottom: 30px;
  color: #575261;
  font-size: 1.13rem;
  line-height: 1.7;
}

.eyebrow .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--violet);
  display: inline-block;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.play-icon {
  width: 27px;
  height: 27px;
  display: grid;
  place-items: center;
  color: white;
  background: var(--ink);
  border-radius: 50%;
  font-size: 0.6rem;
}

.trust-row {
  margin-top: 36px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatars {
  display: flex;
}

.avatars span {
  width: 38px;
  height: 38px;
  margin-left: -8px;
  display: grid;
  place-items: center;
  border: 3px solid var(--paper);
  border-radius: 50%;
  color: white;
  background: var(--violet-dark);
  font-size: 0.52rem;
  font-weight: 850;
}

.avatars span:first-child {
  margin-left: 0;
  background: var(--magenta);
}

.avatars span:last-child {
  background: var(--violet);
}

.trust-row p {
  margin: 0;
  color: var(--muted);
  font-size: 0.75rem;
  line-height: 1.35;
}

.trust-row strong {
  color: var(--ink);
  font-size: 0.85rem;
}

.hero-visual {
  min-height: 440px;
  display: grid;
  place-items: center;
  position: relative;
}

@media (max-width: 1120px) {
  .hero {
    grid-template-columns: 1fr;
    padding-top: 65px;
  }
  .hero-copy {
    max-width: 760px;
  }
  .hero-visual {
    width: min(760px, 100%);
    justify-self: center;
  }
}

@media (max-width: 760px) {
  .hero {
    min-height: auto;
    padding: 52px 20px 70px;
    gap: 45px;
  }
  h1 {
    font-size: clamp(3rem, 15vw, 4.7rem);
  }
  .hero-copy > p {
    font-size: 1rem;
  }
  .hero-actions .button {
    width: 100%;
  }
  .hero-visual {
    min-height: 290px;
  }
}
</style>
