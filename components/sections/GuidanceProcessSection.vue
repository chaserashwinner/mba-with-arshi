<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';
import { useScrollAnimation } from '~/composables/useScrollAnimation';

const roadmap = PORTFOLIO_DATA.roadmap;

// Extend to 4 steps as requested in guidance process requirements
const guidanceSteps = [
  {
    num: '01',
    title: 'Understand your profile',
    desc: 'Evaluate past academic record, entrance test performance (CAT/XAT/CMAT/MAH CET), work experience, and personal budget.',
    tag: 'PROFILE AUDIT',
    link: '#find-colleges',
  },
  {
    num: '02',
    title: 'Shortlist colleges',
    desc: 'Categorize target business schools into Dream, Realistic Target, and Safe options based on cutoff percentiles and intake history.',
    tag: 'SHORTLISTING',
    link: '#find-colleges',
  },
  {
    num: '03',
    title: 'Compare options',
    desc: 'Analyze actual tuition fees, hostel costs, placement statistics, median salary trends, and campus location ROI.',
    tag: 'ROI ANALYSIS',
    link: '#videos',
  },
  {
    num: '04',
    title: 'Make your decision',
    desc: 'Finalize accepting offer letters with confidence after 1:1 guidance calls with Arshi Khan before paying confirmation fees.',
    tag: 'CONFIRMED ADMISSION',
    link: '#counselling',
  },
];

const containerRef = ref<HTMLElement | null>(null);
const { initGSAP, isReducedMotion } = useScrollAnimation();

onMounted(async () => {
  if (isReducedMotion()) return;

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !containerRef.value) return;

  const cards = containerRef.value.querySelectorAll('.roadmap-list-item');

  cards.forEach((card, index) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
});
</script>

<template>
  <section ref="containerRef" class="guidance-section" id="guidance">
    <div class="guidance-container">
      <!-- Header -->
      <div class="section-header">
        <div class="eyebrow">
          <span class="line"></span>
          <span>05 — ADMISSION GUIDANCE ROADMAP</span>
        </div>
        <h2>A clear 4-step path to your B-School.</h2>
        <p class="section-desc">
          Structured 1:1 guidance process from raw test score to final admission offer letter.
        </p>
      </div>

      <!-- Linear Step Sequence List -->
      <div class="roadmap-list">
        <article 
          v-for="step in guidanceSteps" 
          :key="step.num" 
          class="roadmap-list-item"
        >
          <div class="item-left">
            <span class="step-large-num">{{ step.num }}</span>
            <span class="step-tag-pill">{{ step.tag }}</span>
          </div>

          <div class="item-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>

          <div class="item-right">
            <a :href="step.link" class="step-arrow-link">
              Explore Step Details <span>→</span>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.guidance-section {
  padding: 100px max(5vw, 24px);
  background: var(--bg-light);
  color: var(--ink-light);
}

.guidance-container {
  max-width: 1340px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 55px;
}

.section-header h2 {
  margin: 12px 0 0;
  font-size: clamp(2.3rem, 4vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 850;
}

.section-desc {
  max-width: 580px;
  color: var(--ink-light-muted);
  font-size: 1.05rem;
  margin-top: 10px;
}

.roadmap-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.roadmap-list-item {
  padding: clamp(24px, 3.5vw, 36px);
  border-radius: var(--radius-xl);
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 30px;
  align-items: center;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.roadmap-list-item:hover {
  transform: translateY(-4px);
  border-color: var(--primary-bright);
  box-shadow: var(--shadow-md);
}

.item-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.step-large-num {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  font-weight: 900;
  color: var(--primary);
  line-height: 0.9;
  letter-spacing: -0.04em;
}

.step-tag-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--primary-light);
  color: var(--primary);
  font-size: 0.64rem;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.item-content h3 {
  margin: 0 0 8px;
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ink-light);
}

.item-content p {
  margin: 0;
  color: var(--ink-light-muted);
  font-size: 0.96rem;
  line-height: 1.6;
}

.item-right {
  display: flex;
  justify-content: flex-end;
}

.step-arrow-link {
  font-size: 0.86rem;
  font-weight: 750;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.2s ease;
}

.step-arrow-link:hover {
  gap: 10px;
  color: var(--primary-hover);
}

@media (max-width: 960px) {
  .roadmap-list-item {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .item-right {
    justify-content: flex-start;
  }
}
</style>
