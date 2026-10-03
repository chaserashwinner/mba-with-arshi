<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ArrowRightIcon, PlayIcon } from '@heroicons/vue/20/solid';
import { PORTFOLIO_DATA } from '~/data/portfolio';
import { useScrollAnimation, MOTION_MEDIA } from '~/composables/useScrollAnimation';

const personal = PORTFOLIO_DATA.personal;

const sectionRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLElement | null>(null);

const { initGSAP, isReducedMotion } = useScrollAnimation();
let gsapCtx: { revert: () => void } | null = null;

onMounted(async () => {
  if (isReducedMotion()) return;

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !sectionRef.value || !imageRef.value) return;

  gsapCtx = gsap.context(() => {
    const mm = gsap.matchMedia();
    // Slight parallax inside the (masked) portrait frame.
    mm.add(MOTION_MEDIA.tablet, () => {
      gsap.fromTo(
        imageRef.value,
        { yPercent: -4, scale: 1.1 },
        {
          yPercent: 4,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        },
      );
    });
  }, sectionRef.value);
});

onBeforeUnmount(() => gsapCtx?.revert());
</script>

<template>
  <section ref="sectionRef" class="about-arshi-section" id="about" aria-labelledby="about-heading">
    <div class="about-container">
      <div class="about-grid">
        <!-- Portrait Image Frame (clip-path mask reveal) -->
        <div class="portrait-frame">
          <div v-reveal="'mask'" class="image-wrapper" data-cursor="Arshi">
            <picture>
              <source srcset="/mentors/arshi-800.avif" type="image/avif" />
              <source srcset="/mentors/arshi-800.webp" type="image/webp" />
              <img
                ref="imageRef"
                src="/mentors/arshi-800.png"
                alt="Arshi Khan — Senior MBA Counselor"
                class="portrait-img"
                width="800"
                height="450"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div class="portrait-overlay" aria-hidden="true"></div>
          </div>

          <div v-reveal="{ variant: 'up', delay: 500 }" class="portrait-badge">
            <span class="badge-dot" aria-hidden="true"></span>
            <div>
              <strong>ARSHI KHAN</strong>
              <small>10+ Yrs Counselling Experience</small>
            </div>
          </div>
        </div>

        <!-- Editorial Content Column -->
        <div v-reveal="{ stagger: 90 }" class="content-col">
          <div class="eyebrow">
            <span class="line"></span>
            <span>05 — ABOUT THE COUNSELOR</span>
          </div>

          <h2 id="about-heading">
            Honest MBA guidance, <br />
            <em class="serif-italic">backed by facts.</em>
          </h2>

          <p class="lead-bio">
            For over <strong>{{ personal.experienceYears }}</strong>, Arshi Khan has mentored thousands of MBA aspirants across India—cutting through marketing claims to deliver realistic college shortlists based on entrance percentile, budget, and career placement outcomes.
          </p>

          <p class="sub-bio">
            Whether you are preparing for CAT, XAT, CMAT, SNAP or MAH CET, get transparent advice on actual tuition fees, hostel expenses, average salary packages, and campus reality.
          </p>

          <!-- Key Metrics -->
          <ul class="stats-row">
            <li class="stat-pill">
              <strong>10+ Yrs</strong>
              <small>COUNSELLING EXP.</small>
            </li>
            <li class="stat-pill">
              <strong>100%</strong>
              <small>FACT-BASED REVIEWS</small>
            </li>
            <li class="stat-pill">
              <strong>8+</strong>
              <small>TARGET CITIES</small>
            </li>
          </ul>

          <div class="action-row">
            <a
              :href="personal.youtubeUrl"
              target="_blank"
              rel="noreferrer"
              class="button button-secondary"
            >
              <PlayIcon class="btn-icon btn-icon--static yt-icon" aria-hidden="true" />
              Watch YouTube Channel
            </a>
            <a v-magnetic href="#counselling" class="button button-primary">
              Book 1:1 Guidance Session
              <ArrowRightIcon class="btn-icon" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-arshi-section {
  padding: clamp(80px, 11vw, 120px) max(5vw, 20px);
  background: var(--surface-light);
  color: var(--ink-light);
  overflow: hidden;
}

.about-container {
  max-width: 1340px;
  margin: 0 auto;
}

.about-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: clamp(40px, 6vw, 80px);
  align-items: center;
}

/* Portrait Frame */
.portrait-frame {
  position: relative;
  width: 100%;
  max-width: 560px;
}

.image-wrapper {
  position: relative;
  aspect-ratio: 0.88;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-lg);
  background: #000;
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  filter: contrast(1.04);
  transform: scale(1.1);
  transition: filter 600ms ease;
}

.portrait-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, transparent 55%, rgba(18, 14, 28, 0.45) 100%),
    radial-gradient(100% 60% at 50% 0%, rgba(124, 58, 237, 0.2), transparent 60%);
}

.portrait-badge {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--shadow-md);
}

.badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.portrait-badge strong {
  display: block;
  font-size: 0.86rem;
  color: var(--ink-light);
  line-height: 1.1;
}

.portrait-badge small {
  color: var(--primary);
  font-size: 0.65rem;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Content Column */
.content-col h2 {
  text-wrap: balance;
  margin: 14px 0 20px;
  font-size: clamp(2.2rem, 4.5vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 850;
  color: var(--ink-light);
}

.lead-bio {
  color: var(--ink-light);
  font-size: clamp(1.05rem, 1.8vw, 1.2rem);
  line-height: 1.65;
  margin: 0 0 16px;
}

.sub-bio {
  color: var(--ink-light-muted);
  font-size: 0.98rem;
  line-height: 1.65;
  margin: 0 0 28px;
}

.stats-row {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin: 0 0 36px;
}

.stat-pill {
  position: relative;
  padding: 16px 22px;
  border-radius: var(--radius-md);
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition:
    transform var(--dur-med) var(--ease-out),
    border-color var(--dur-med) ease,
    box-shadow var(--dur-med) var(--ease-out);
}

.stat-pill::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: var(--primary);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--dur-med) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .stat-pill:hover {
    transform: translate3d(0, -4px, 0);
    border-color: rgba(139, 92, 246, 0.35);
    box-shadow: var(--shadow-md);
  }
  .stat-pill:hover::after {
    transform: scaleX(1);
  }
}

.stat-pill strong {
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--primary);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-pill small {
  margin-top: 6px;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: var(--ink-light-muted);
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.yt-icon {
  color: #ff0033;
}

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
  .portrait-frame {
    max-width: 480px;
  }
}

@media (max-width: 640px) {
  .image-wrapper {
    aspect-ratio: 1;
  }
  .stat-pill {
    flex: 1 1 calc(50% - 14px);
    padding: 14px 16px;
  }
  .action-row .button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .portrait-img {
    transform: none;
  }
}
</style>
