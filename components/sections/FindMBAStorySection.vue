<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useScrollAnimation } from '~/composables/useScrollAnimation';

const sectionRef = ref<HTMLElement | null>(null);
const pinContainerRef = ref<HTMLElement | null>(null);
const currentStepIndex = ref(0);

const steps = [
  {
    num: '01',
    name: 'EXAM',
    title: 'Entrance Exam Strategy',
    desc: 'CAT, XAT, CMAT, MAH CET or NMAT? Select entrance exams aligned with your target colleges.',
    accent: '#7c3aed',
    detail: 'Target percentiles & cutoffs',
  },
  {
    num: '02',
    name: 'PERCENTILE',
    title: 'Profile & Cutoff Match',
    desc: 'Evaluate your raw score or expected percentile range against realistic college cutoff history.',
    accent: '#8b5cf6',
    detail: 'Dream vs Target vs Safe list',
  },
  {
    num: '03',
    name: 'BUDGET',
    title: 'Tuition & Living Cost',
    desc: 'Filter colleges under ₹10L, ₹10-20L, or ₹20L+ to avoid unexpected financial burden.',
    accent: '#db2ecf',
    detail: 'No hidden cost surprises',
  },
  {
    num: '04',
    name: 'CITY',
    title: 'Campus & Metro Location',
    desc: 'Choose Mumbai, Pune, Delhi NCR, Bangalore or regional hubs for industry exposure.',
    accent: '#10b981',
    detail: 'Corporate networking access',
  },
  {
    num: '05',
    name: 'SHORTLIST',
    title: 'Final Action Shortlist',
    desc: 'Receive a personalized list with clear next steps and direct 1:1 guidance from Arshi Khan.',
    accent: '#d9ff57',
    detail: 'Fact-based decisions',
  },
];

const { initGSAP, isReducedMotion } = useScrollAnimation();

onMounted(async () => {
  if (isReducedMotion()) return;

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !sectionRef.value || !pinContainerRef.value) return;

  const totalSteps = steps.length;

  ScrollTrigger.create({
    trigger: sectionRef.value,
    pin: pinContainerRef.value,
    start: 'top top',
    end: `+=${totalSteps * 80}%`,
    scrub: 0.5,
    onUpdate: (self) => {
      const idx = Math.min(
        totalSteps - 1,
        Math.floor(self.progress * totalSteps)
      );
      currentStepIndex.value = idx;
    },
  });
});
</script>

<template>
  <section 
    ref="sectionRef" 
    class="find-mba-story-section" 
    id="find-mba-story"
  >
    <div ref="pinContainerRef" class="pinned-stage">
      <div class="story-container">
        <!-- Story Top Header -->
        <div class="story-header">
          <div class="eyebrow">
            <span class="line"></span>
            <span>02 — SCROLL STORYTELLING</span>
          </div>
          <h2>Finding the right MBA is a process.</h2>
        </div>

        <div class="story-body">
          <!-- Step Selector Sequence Column -->
          <div class="step-sequence-col">
            <div class="connecting-line-track">
              <div 
                class="connecting-line-fill"
                :style="{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }"
              ></div>
            </div>

            <div class="steps-list">
              <div 
                v-for="(step, i) in steps" 
                :key="step.num"
                class="step-item"
                :class="{ 
                  active: i === currentStepIndex,
                  passed: i < currentStepIndex
                }"
                @click="currentStepIndex = i"
              >
                <span class="step-dot">
                  <span v-if="i < currentStepIndex" class="check-mark">✓</span>
                  <span v-else>{{ step.num }}</span>
                </span>
                <span class="step-name">{{ step.name }}</span>
              </div>
            </div>
          </div>

          <!-- Dynamic Active Step Detail Card -->
          <div class="step-card-col">
            <div 
              class="active-card-shell"
              :style="{ borderColor: steps[currentStepIndex].accent }"
            >
              <div class="card-meta">
                <span 
                  class="meta-badge"
                  :style="{ background: steps[currentStepIndex].accent, color: currentStepIndex === 4 ? '#111019' : '#ffffff' }"
                >
                  STEP {{ steps[currentStepIndex].num }}
                </span>
                <span class="meta-detail">{{ steps[currentStepIndex].detail }}</span>
              </div>

              <h3 class="card-title">{{ steps[currentStepIndex].title }}</h3>
              <p class="card-desc">{{ steps[currentStepIndex].desc }}</p>

              <div class="card-action">
                <a href="#find-colleges" class="button button-primary card-cta">
                  Explore Matches for {{ steps[currentStepIndex].name }} →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.find-mba-story-section {
  position: relative;
  background: var(--bg-light);
  color: var(--ink-light);
}

.pinned-stage {
  height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px max(5vw, 24px);
  box-sizing: border-box;
}

.story-container {
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
}

.story-header {
  margin-bottom: 40px;
}

.story-header h2 {
  margin: 12px 0 0;
  font-size: clamp(2.2rem, 4.2vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 850;
  color: var(--ink-light);
}

.story-body {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: clamp(30px, 5vw, 60px);
  align-items: center;
}

/* Steps Sequence List */
.step-sequence-col {
  position: relative;
  padding-left: 28px;
}

.connecting-line-track {
  position: absolute;
  left: 11px;
  top: 14px;
  bottom: 14px;
  width: 2px;
  background: var(--border-light);
}

.connecting-line-fill {
  width: 100%;
  background: var(--primary);
  transition: height 0.4s ease;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  opacity: 0.45;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.step-item:hover {
  opacity: 0.8;
}

.step-item.active {
  opacity: 1;
  transform: translateX(6px);
}

.step-item.passed {
  opacity: 0.7;
}

.step-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--surface-light);
  border: 2px solid var(--border-light);
  display: grid;
  place-items: center;
  font-size: 0.65rem;
  font-weight: 900;
  color: var(--ink-light-muted);
  z-index: 2;
  transition: all 0.3s ease;
}

.step-item.active .step-dot {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.2);
}

.step-item.passed .step-dot {
  background: #10b981;
  border-color: #10b981;
  color: #ffffff;
}

.step-name {
  font-size: clamp(1.4rem, 2.5vw, 2.2rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--ink-light);
}

.step-item.active .step-name {
  color: var(--primary);
}

/* Card Column */
.active-card-shell {
  padding: clamp(28px, 4vw, 44px);
  border-radius: var(--radius-xl);
  background: var(--surface-light);
  border: 2px solid var(--primary);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 18px;
  transition: border-color 0.4s ease;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.meta-badge {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0.1em;
}

.meta-detail {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--ink-light-muted);
}

.card-title {
  margin: 0;
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  font-weight: 850;
  letter-spacing: -0.03em;
  color: var(--ink-light);
}

.card-desc {
  margin: 0;
  color: var(--ink-light-muted);
  font-size: 1.02rem;
  line-height: 1.65;
}

.card-action {
  margin-top: 10px;
}

.card-cta {
  font-size: 0.86rem;
}

@media (max-width: 900px) {
  .pinned-stage {
    height: auto;
    min-height: 100dvh;
    padding-block: 60px;
  }
  .story-body {
    grid-template-columns: 1fr;
  }
}
</style>
