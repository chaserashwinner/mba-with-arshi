<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';
import { useScrollAnimation } from '~/composables/useScrollAnimation';

const personal = PORTFOLIO_DATA.personal;

const sectionRef = ref<HTMLElement | null>(null);
const imageRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);

const { initGSAP, isReducedMotion } = useScrollAnimation();

onMounted(async () => {
  if (isReducedMotion()) return;

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !sectionRef.value || !imageRef.value) return;

  // Image scale down reveal (1.08 -> 1)
  gsap.fromTo(
    imageRef.value,
    { scale: 1.12 },
    {
      scale: 1,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top bottom-=100',
        toggleActions: 'play none none reverse',
      },
    }
  );

  // Content fade & stagger
  if (contentRef.value) {
    gsap.fromTo(
      contentRef.value.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.value,
          start: 'top bottom-=80',
        },
      }
    );
  }
});
</script>

<template>
  <section ref="sectionRef" class="about-arshi-section" id="about">
    <div class="about-container">
      <div class="about-grid">
        <!-- Portrait Image Frame -->
        <div class="portrait-frame">
          <div class="image-wrapper">
            <img 
              ref="imageRef"
              src="/mentors/arshi-800.png" 
              alt="Arshi Khan — Senior MBA Counselor" 
              class="portrait-img"
            />
            <div class="portrait-overlay"></div>
          </div>

          <div class="portrait-badge">
            <span class="badge-dot"></span>
            <div>
              <strong>ARSHI KHAN</strong>
              <small>10+ Yrs Counselling Experience</small>
            </div>
          </div>
        </div>

        <!-- Editorial Content Column -->
        <div ref="contentRef" class="content-col">
          <div class="eyebrow">
            <span class="line"></span>
            <span>06 — ABOUT THE COUNSELOR</span>
          </div>

          <h2>
            Honest MBA guidance, <br />
            <em class="serif-italic">backed by facts.</em>
          </h2>

          <p class="lead-bio">
            For over <strong>{{ personal.experienceYears }}</strong>, Arshi Khan has mentored thousands of MBA aspirants across India—cutting through marketing claims to deliver realistic college shortlists based on entrance percentile, budget, and career placement outcomes.
          </p>

          <p class="sub-bio">
            Whether you are preparing for CAT, XAT, CMAT, SNAP or MAH CET, get transparent advice on actual tuition fees, hostel expenses, average salary packages, and campus reality.
          </p>

          <!-- Key Metrics Pills -->
          <div class="stats-row">
            <div class="stat-pill">
              <strong>10+ Yrs</strong>
              <small>COUNSELLING EXP.</small>
            </div>
            <div class="stat-pill">
              <strong>100%</strong>
              <small>FACT-BASED REVIEWS</small>
            </div>
            <div class="stat-pill">
              <strong>8+</strong>
              <small>TARGET CITIES</small>
            </div>
          </div>

          <div class="action-row">
            <a 
              :href="personal.youtubeUrl" 
              target="_blank" 
              rel="noreferrer" 
              class="button button-secondary"
            >
              <span>▶</span> Watch YouTube Channel
            </a>
            <a href="#counselling" class="button button-primary">
              Book 1:1 Guidance Session →
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-arshi-section {
  padding: 110px max(5vw, 24px);
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
}

.image-wrapper {
  position: relative;
  aspect-ratio: 0.88;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-lg);
  background: linear-gradient(135deg, #180d32, #3b1675);
}

.portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  filter: contrast(1.04);
  will-change: transform;
}

.portrait-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(18, 14, 28, 0.4) 100%);
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
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  box-shadow: var(--shadow-md);
}

.badge-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
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
  margin: 14px 0 20px;
  font-size: clamp(2.4rem, 4.5vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  font-weight: 850;
  color: var(--ink-light);
}

.lead-bio {
  color: var(--ink-light);
  font-size: clamp(1.05rem, 1.8vw, 1.2rem);
  line-height: 1.65;
  margin-bottom: 16px;
}

.sub-bio {
  color: var(--ink-light-muted);
  font-size: 0.98rem;
  line-height: 1.65;
  margin-bottom: 28px;
}

.stats-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 36px;
}

.stat-pill {
  padding: 14px 20px;
  border-radius: var(--radius-md);
  background: var(--bg-light);
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
}

.stat-pill strong {
  font-size: 1.35rem;
  font-weight: 900;
  color: var(--primary);
  line-height: 1;
}

.stat-pill small {
  margin-top: 4px;
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

@media (max-width: 1024px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
}
</style>
