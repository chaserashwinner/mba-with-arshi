<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { ArrowRightIcon, CheckIcon } from '@heroicons/vue/20/solid';
import { useScrollAnimation, MOTION_MEDIA } from '~/composables/useScrollAnimation';

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

const activeStep = computed(() => steps[currentStepIndex.value]);
const progress = computed(() => currentStepIndex.value / (steps.length - 1));

const { initGSAP, isReducedMotion } = useScrollAnimation();
let gsapCtx: { revert: () => void } | null = null;
let pinTrigger: { start: number; end: number } | null = null;

/** Selecting a step: while pinned, scroll to that step's position so scroll and state agree. */
function selectStep(i: number) {
  if (pinTrigger) {
    const span = pinTrigger.end - pinTrigger.start;
    const target = pinTrigger.start + span * ((i + 0.5) / steps.length);
    window.scrollTo({ top: target, behavior: isReducedMotion() ? 'auto' : 'smooth' });
  }
  currentStepIndex.value = i;
}

onMounted(async () => {
  if (isReducedMotion()) return;

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !sectionRef.value || !pinContainerRef.value) return;

  const totalSteps = steps.length;

  gsapCtx = gsap.context(() => {
    const mm = gsap.matchMedia();
    // Scroll-pinned storytelling only where there's room for it (≥900px).
    mm.add(MOTION_MEDIA.tablet, () => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.value,
        pin: pinContainerRef.value,
        start: 'top top',
        end: `+=${totalSteps * 70}%`,
        onUpdate: (self) => {
          const idx = Math.min(totalSteps - 1, Math.floor(self.progress * totalSteps));
          if (idx !== currentStepIndex.value) currentStepIndex.value = idx;
        },
      });
      pinTrigger = st;
      return () => {
        pinTrigger = null;
      };
    });
  }, sectionRef.value);
});

onBeforeUnmount(() => gsapCtx?.revert());
</script>

<template>
  <section
    ref="sectionRef"
    class="find-mba-story-section"
    id="find-mba-story"
    aria-labelledby="story-heading"
  >
    <div ref="pinContainerRef" class="pinned-stage">
      <div class="story-container">
        <!-- Story Top Header -->
        <div v-reveal="{ stagger: true }" class="story-header">
          <div class="eyebrow">
            <span class="line"></span>
            <span>02 — SCROLL STORYTELLING</span>
          </div>
          <h2 id="story-heading">Finding the right MBA is a process.</h2>
        </div>

        <div class="story-body">
          <!-- Step Selector Sequence Column -->
          <div v-reveal="'left'" class="step-sequence-col">
            <div class="connecting-line-track" aria-hidden="true">
              <div class="connecting-line-fill" :style="{ transform: `scaleY(${progress})` }"></div>
            </div>

            <ol class="steps-list" aria-label="Admission decision steps">
              <li v-for="(step, i) in steps" :key="step.num">
                <button
                  type="button"
                  class="step-item"
                  :class="{
                    active: i === currentStepIndex,
                    passed: i < currentStepIndex,
                  }"
                  :aria-pressed="i === currentStepIndex ? 'true' : 'false'"
                  @click="selectStep(i)"
                >
                  <span class="step-dot" aria-hidden="true">
                    <Transition name="swap" mode="out-in">
                      <CheckIcon v-if="i < currentStepIndex" key="check" class="check-mark" />
                      <span v-else key="num">{{ step.num }}</span>
                    </Transition>
                  </span>
                  <span class="step-name">{{ step.name }}</span>
                </button>
              </li>
            </ol>
          </div>

          <!-- Dynamic Active Step Detail Card -->
          <div v-reveal="{ variant: 'scale', delay: 120 }" class="step-card-col">
            <div
              class="active-card-shell"
              :style="{ '--step-accent': activeStep.accent }"
              aria-live="polite"
            >
              <div class="card-accent-glow" aria-hidden="true"></div>
              <Transition name="step-card" mode="out-in">
                <div :key="activeStep.num" class="card-inner">
                  <div class="card-meta">
                    <span
                      class="meta-badge"
                      :style="{ background: activeStep.accent, color: currentStepIndex === 4 ? '#111019' : '#ffffff' }"
                    >
                      STEP {{ activeStep.num }}
                    </span>
                    <span class="meta-detail">{{ activeStep.detail }}</span>
                  </div>

                  <h3 class="card-title">{{ activeStep.title }}</h3>
                  <p class="card-desc">{{ activeStep.desc }}</p>
                </div>
              </Transition>

              <div class="card-footer-row">
                <a href="#find-colleges" class="button button-primary card-cta">
                  Explore Matches for {{ activeStep.name }}
                  <ArrowRightIcon class="btn-icon" aria-hidden="true" />
                </a>
                <span class="step-counter" aria-hidden="true">
                  <strong>{{ activeStep.num }}</strong> / 0{{ steps.length }}
                </span>
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
  height: 100svh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: calc(var(--header-h) + 8px) max(5vw, 20px) 40px;
  box-sizing: border-box;
  background: var(--bg-light);
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
  font-size: clamp(2.1rem, 4.2vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 850;
  color: var(--ink-light);
  text-wrap: balance;
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
  padding-left: 0;
}

.connecting-line-track {
  position: absolute;
  left: 11px;
  top: 14px;
  bottom: 14px;
  width: 2px;
  background: var(--border-light);
  border-radius: 2px;
  overflow: hidden;
}

.connecting-line-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #10b981, var(--primary));
  transform-origin: top center;
  transition: transform 600ms var(--ease-out);
}

.steps-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 4px 0;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
  color: inherit;
  opacity: 0.42;
  -webkit-tap-highlight-color: transparent;
  transition: opacity var(--dur-med) ease, transform var(--dur-med) var(--ease-out);
}

.step-item:hover {
  opacity: 0.8;
}

.step-item.active {
  opacity: 1;
  transform: translateX(8px);
}

.step-item.passed {
  opacity: 0.7;
}

.step-dot {
  position: relative;
  z-index: 2;
  width: 24px;
  height: 24px;
  flex: none;
  border-radius: 50%;
  background: var(--surface-light);
  border: 2px solid rgba(18, 14, 28, 0.14);
  display: grid;
  place-items: center;
  font-size: 0.62rem;
  font-weight: 900;
  color: var(--ink-light-muted);
  transition:
    background-color var(--dur-med) ease,
    border-color var(--dur-med) ease,
    color var(--dur-med) ease,
    box-shadow var(--dur-med) ease,
    transform var(--dur-med) var(--ease-out);
}

.check-mark {
  width: 14px;
  height: 14px;
}

.step-item.active .step-dot {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 0 0 5px rgba(124, 58, 237, 0.18);
  transform: scale(1.1);
}

.step-item.passed .step-dot {
  background: #10b981;
  border-color: #10b981;
  color: #ffffff;
}

.step-name {
  font-size: clamp(1.35rem, 2.5vw, 2.2rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--ink-light);
  transition: color var(--dur-med) ease;
}

.step-item.active .step-name {
  color: var(--primary);
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 180ms ease, transform 180ms var(--ease-out);
}
.swap-enter-from,
.swap-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

/* Card Column */
.active-card-shell {
  --step-accent: var(--primary);
  position: relative;
  overflow: hidden;
  padding: clamp(26px, 4vw, 44px);
  border-radius: var(--radius-xl);
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 18px;
  isolation: isolate;
}

/* Accent bar + soft glow tinted with the active step's colour */
.active-card-shell::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 4px;
  background: var(--step-accent);
  transition: background-color 500ms ease;
}

.card-accent-glow {
  position: absolute;
  z-index: -1;
  top: -40%;
  right: -20%;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, var(--step-accent), transparent 65%);
  opacity: 0.1;
  transition: background 500ms ease;
}

.card-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 180px;
}

.step-card-enter-active,
.step-card-leave-active {
  transition: opacity 280ms var(--ease-out), transform 280ms var(--ease-out);
}
.step-card-enter-from {
  opacity: 0;
  transform: translate3d(0, 14px, 0);
}
.step-card-leave-to {
  opacity: 0;
  transform: translate3d(0, -10px, 0);
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
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

.card-footer-row {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.card-cta {
  font-size: 0.86rem;
}

.step-counter {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--ink-light-muted);
  font-variant-numeric: tabular-nums;
}

.step-counter strong {
  color: var(--ink-light);
  font-size: 1.1rem;
}

@media (max-width: 899px) {
  .pinned-stage {
    height: auto;
    min-height: 0;
    padding-block: 88px;
  }
  .story-body {
    grid-template-columns: 1fr;
  }
  .card-inner {
    min-height: 0;
  }
}

@media (max-width: 480px) {
  .card-cta {
    width: 100%;
    white-space: normal;
    text-align: center;
    padding-block: 12px;
  }
}
</style>
