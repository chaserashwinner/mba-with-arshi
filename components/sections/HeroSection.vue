<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';
import { useScrollAnimation } from '~/composables/useScrollAnimation';

const personal = PORTFOLIO_DATA.personal;

const heroContainerRef = ref<HTMLElement | null>(null);
const eyebrowRef = ref<HTMLElement | null>(null);
const headlineLine1Ref = ref<HTMLElement | null>(null);
const headlineLine2Ref = ref<HTMLElement | null>(null);
const bioRef = ref<HTMLElement | null>(null);
const actionsRef = ref<HTMLElement | null>(null);
const visualShellRef = ref<HTMLElement | null>(null);

const { initGSAP, isReducedMotion } = useScrollAnimation();

onMounted(async () => {
  if (isReducedMotion()) return;

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !heroContainerRef.value) return;

  // 1. Initial Load Entrance Animation Timeline
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo(
    eyebrowRef.value,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.6 }
  )
    .fromTo(
      headlineLine1Ref.value,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.3'
    )
    .fromTo(
      headlineLine2Ref.value,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.8 },
      '-=0.6'
    )
    .fromTo(
      bioRef.value,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.4'
    )
    .fromTo(
      actionsRef.value,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo(
      visualShellRef.value,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9 },
      '-=0.7'
    );

  // 2. Hero -> Intro Scroll Parallax Effect
  gsap.to(heroContainerRef.value.querySelector('.hero-content-stage'), {
    scrollTrigger: {
      trigger: heroContainerRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
    y: -80,
    scale: 0.97,
    opacity: 0.3,
  });
});
</script>

<template>
  <section ref="heroContainerRef" class="hero-section" id="top">
    <!-- Subtle Background Ambient Geometry -->
    <div class="hero-bg-grid" aria-hidden="true"></div>
    <div class="hero-glow-orb glow-top-left" aria-hidden="true"></div>
    <div class="hero-glow-orb glow-bottom-right" aria-hidden="true"></div>

    <div class="hero-content-stage">
      <div class="hero-grid">
        <!-- Hero Editorial Text Column -->
        <div class="hero-text-col">
          <div ref="eyebrowRef" class="eyebrow">
            <span class="line"></span>
            <span>{{ personal.eyebrow }}</span>
          </div>

          <h1 class="hero-headline">
            <span ref="headlineLine1Ref" class="headline-line">{{ personal.headline }}</span>
            <span ref="headlineLine2Ref" class="headline-line">
              <em class="serif-italic">{{ personal.headlineItalic }}</em>
            </span>
          </h1>

          <p ref="bioRef" class="hero-bio">
            {{ personal.bio }}
          </p>

          <div ref="actionsRef" class="hero-actions">
            <a class="button button-primary" href="#find-colleges">
              {{ personal.primaryCtaText }} <span aria-hidden="true">→</span>
            </a>
            <a 
              class="button button-ghost-dark" 
              :href="personal.youtubeUrl" 
              target="_blank" 
              rel="noreferrer"
            >
              <span>▶</span> {{ personal.secondaryCtaText }}
            </a>
          </div>

          <!-- Proof Metrics Pills -->
          <div class="hero-trust-bar">
            <div class="trust-pill">
              <span class="trust-dot"></span>
              <strong>10+ Years</strong> Counselling Experience
            </div>
            <div class="trust-pill">
              <strong>100% Honest</strong> Reviews & Fees
            </div>
          </div>
        </div>

        <!-- Clean Abstract Graphic & Mentor Badge -->
        <div ref="visualShellRef" class="hero-visual-col">
          <div class="clean-visual-card">
            <div class="counselor-portrait-frame">
              <img 
                src="/mentors/arshi-800.png" 
                alt="Arshi Khan — Senior MBA Counselor"
                class="counselor-portrait"
              />
              <div class="portrait-overlay-gradient"></div>
            </div>

            <!-- Verification Float Badge -->
            <div class="live-status-badge">
              <span class="status-pulse"></span>
              <div>
                <strong>ARSHI KHAN</strong>
                <small>Senior MBA Counselor</small>
              </div>
            </div>

            <!-- Abstract Floating Accent Card -->
            <div class="floating-accent-card">
              <span class="accent-number">01</span>
              <div>
                <p class="accent-title">FACT-BASED SHORTLISTING</p>
                <small class="accent-sub">Fees • Percentile • City ROI</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Down Guidance Indicator -->
    <a href="#find-mba-story" class="scroll-down-hint" aria-label="Scroll to discover">
      <span class="mouse-icon">
        <span class="mouse-wheel"></span>
      </span>
      <span>SCROLL TO EXPLORE</span>
    </a>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100dvh;
  width: 100%;
  padding: 130px max(5vw, 24px) 60px;
  background: var(--bg-dark);
  color: var(--ink-dark);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;
}

/* Background Atmosphere */
.hero-bg-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 32px 32px;
  opacity: 0.4;
  pointer-events: none;
  z-index: 1;
}

.hero-glow-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  filter: blur(80px);
}

.glow-top-left {
  top: -100px;
  left: -100px;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.25), transparent 70%);
}

.glow-bottom-right {
  bottom: -100px;
  right: -100px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(219, 46, 207, 0.15), transparent 70%);
}

.hero-content-stage {
  position: relative;
  z-index: 10;
  max-width: 1340px;
  margin: 0 auto;
  width: 100%;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: clamp(40px, 6vw, 80px);
  align-items: center;
}

/* Hero Typography */
.hero-headline {
  margin: 20px 0 24px;
  font-size: clamp(3rem, 5.8vw, 5.6rem);
  line-height: 0.94;
  letter-spacing: -0.05em;
  font-weight: 850;
  color: #ffffff;
}

.headline-line {
  display: block;
}

.hero-bio {
  max-width: 580px;
  margin-bottom: 32px;
  color: var(--ink-dark-muted);
  font-size: clamp(1.05rem, 1.8vw, 1.25rem);
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 40px;
}

/* Trust Bar */
.hero-trust-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.trust-pill {
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.76rem;
  color: var(--ink-dark-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.trust-pill strong {
  color: #ffffff;
}

.trust-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

/* Right Visual Column */
.clean-visual-card {
  position: relative;
  width: min(440px, 100%);
  margin: 0 auto;
}

.counselor-portrait-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 0.85;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: linear-gradient(135deg, #140b28, #2a1058);
  box-shadow: var(--shadow-dark);
}

.counselor-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  filter: contrast(1.04);
}

.portrait-overlay-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 50%, rgba(7, 5, 13, 0.9) 100%);
}

.live-status-badge {
  position: absolute;
  top: -16px;
  right: -16px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: var(--radius-full);
  background: rgba(18, 12, 34, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.status-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25);
}

.live-status-badge strong {
  display: block;
  font-size: 0.82rem;
  color: #ffffff;
  line-height: 1.1;
}

.live-status-badge small {
  color: var(--primary-bright);
  font-size: 0.64rem;
  font-weight: 800;
  text-transform: uppercase;
}

.floating-accent-card {
  position: absolute;
  bottom: -20px;
  left: -20px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  border-radius: var(--radius-lg);
  background: rgba(18, 12, 34, 0.9);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
}

.accent-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 0.8rem;
  font-weight: 900;
}

.accent-title {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  color: var(--accent-acid);
}

.accent-sub {
  color: var(--ink-dark-muted);
  font-size: 0.68rem;
}

/* Scroll Down Hint */
.scroll-down-hint {
  margin-top: 40px;
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--ink-dark-muted);
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  transition: color 0.2s ease;
}

.scroll-down-hint:hover {
  color: #ffffff;
}

.mouse-icon {
  width: 20px;
  height: 32px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}

.mouse-wheel {
  width: 3px;
  height: 6px;
  border-radius: 2px;
  background: var(--primary-bright);
  animation: mouseAnim 1.8s infinite ease-in-out;
}

@keyframes mouseAnim {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(10px); opacity: 0; }
}

@media (max-width: 1024px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
  .hero-visual-col {
    display: none;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding-top: 110px;
  }
  .hero-actions .button {
    width: 100%;
  }
}
</style>
