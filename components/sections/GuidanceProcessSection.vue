<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { ArrowRightIcon } from '@heroicons/vue/20/solid';
import { useScrollAnimation } from '~/composables/useScrollAnimation';

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
const timelineRef = ref<HTMLElement | null>(null);
const lineFillRef = ref<HTMLElement | null>(null);
const reachedIndex = ref(-1);

const { initGSAP, isReducedMotion } = useScrollAnimation();
let gsapCtx: { revert: () => void } | null = null;

onMounted(async () => {
  if (isReducedMotion()) {
    reachedIndex.value = guidanceSteps.length - 1;
    return;
  }

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !timelineRef.value || !lineFillRef.value) return;

  gsapCtx = gsap.context(() => {
    // The timeline line draws itself as the reader scrolls through the steps.
    gsap.fromTo(
      lineFillRef.value,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineRef.value,
          start: 'top 65%',
          end: 'bottom 65%',
          scrub: 0.5,
        },
      },
    );

    // Each node lights up once the line reaches it.
    const items = timelineRef.value!.querySelectorAll<HTMLElement>('.timeline-item');
    items.forEach((item, index) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 65%',
        onEnter: () => (reachedIndex.value = Math.max(reachedIndex.value, index)),
        onLeaveBack: () => (reachedIndex.value = index - 1),
      });
    });
  }, containerRef.value!);
});

onBeforeUnmount(() => gsapCtx?.revert());
</script>

<template>
  <section ref="containerRef" class="guidance-section" id="guidance" aria-labelledby="guidance-heading">
    <div class="guidance-container">
      <!-- Header -->
      <div v-reveal="{ stagger: true }" class="section-header">
        <div class="eyebrow">
          <span class="line"></span>
          <span>05 — ADMISSION GUIDANCE ROADMAP</span>
        </div>
        <h2 id="guidance-heading">A clear <span class="nowrap">4-step</span> path to your <em class="serif-italic">B-School.</em></h2>
        <p class="section-desc">
          Structured 1:1 guidance process from raw test score to final admission offer letter.
        </p>
      </div>

      <!-- Animated vertical timeline -->
      <ol ref="timelineRef" class="timeline">
        <li class="timeline-rail" aria-hidden="true">
          <span ref="lineFillRef" class="timeline-rail-fill"></span>
        </li>

        <li
          v-for="(step, i) in guidanceSteps"
          :key="step.num"
          class="timeline-item"
          :class="{ reached: i <= reachedIndex }"
        >
          <span class="timeline-node" aria-hidden="true">
            <span class="node-core"></span>
          </span>

          <article v-reveal="'up'" class="roadmap-list-item">
            <div class="item-left">
              <span class="step-large-num">{{ step.num }}</span>
              <span class="step-tag-pill">{{ step.tag }}</span>
            </div>

            <div class="item-content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.desc }}</p>
            </div>

            <div class="item-right">
              <a :href="step.link" class="step-arrow-link link-arrow">
                <span class="link-underline">Explore Step Details</span>
                <ArrowRightIcon class="btn-icon" aria-hidden="true" />
              </a>
            </div>
          </article>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.guidance-section {
  padding: clamp(80px, 11vw, 120px) max(5vw, 20px);
  background: var(--bg-light);
  color: var(--ink-light);
}

.guidance-container {
  max-width: 1340px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 56px;
}

.section-header h2 {
  margin: 12px 0 0;
  font-size: clamp(2.2rem, 4vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 850;
  text-wrap: balance;
}

.nowrap {
  white-space: nowrap;
}

.section-desc {
  max-width: 580px;
  color: var(--ink-light-muted);
  font-size: 1.05rem;
  margin-top: 14px;
}

/* ───── Timeline ───── */
.timeline {
  --rail-x: 23px;
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline-rail {
  position: absolute;
  left: var(--rail-x);
  top: 40px;
  bottom: 40px;
  width: 2px;
  border-radius: 2px;
  background: rgba(18, 14, 28, 0.08);
  overflow: hidden;
}

.timeline-rail-fill {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, var(--primary-bright), var(--primary));
  transform-origin: top center;
}

.timeline-item {
  position: relative;
  padding-left: 72px;
}

.timeline-node {
  position: absolute;
  left: calc(var(--rail-x) - 11px);
  top: 38px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-light);
  border: 2px solid rgba(18, 14, 28, 0.14);
  display: grid;
  place-items: center;
  transition: border-color var(--dur-med) ease, box-shadow var(--dur-med) ease;
}

.node-core {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  transform: scale(0);
  transition: transform var(--dur-med) var(--ease-out);
}

.timeline-item.reached .timeline-node {
  border-color: var(--primary);
  box-shadow: 0 0 0 5px rgba(124, 58, 237, 0.14);
}

.timeline-item.reached .node-core {
  transform: scale(1);
}

.roadmap-list-item {
  padding: clamp(22px, 3.5vw, 34px);
  border-radius: var(--radius-xl);
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
  display: grid;
  grid-template-columns: 180px 1fr auto;
  gap: 30px;
  align-items: center;
  transition:
    transform var(--dur-med) var(--ease-out),
    border-color var(--dur-med) ease,
    box-shadow var(--dur-med) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .roadmap-list-item:hover {
    transform: translate3d(0, -4px, 0);
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 22px 44px -22px rgba(76, 29, 149, 0.3);
  }
}

.item-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.step-large-num {
  font-size: clamp(2.4rem, 4vw, 3.5rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: rgba(18, 14, 28, 0.22);
  transition: color 600ms ease;
}

.timeline-item.reached .step-large-num {
  color: var(--primary);
}

.step-tag-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: #ede9fe;
  color: var(--primary-hover);
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
  white-space: nowrap;
  transition: color var(--dur-fast) ease;
}

.step-arrow-link:hover {
  color: var(--primary-hover);
}

@media (max-width: 960px) {
  .roadmap-list-item {
    grid-template-columns: 1fr;
    gap: 14px;
  }
  .item-left {
    flex-direction: row;
    align-items: center;
    gap: 14px;
  }
  .item-right {
    justify-content: flex-start;
  }
}

@media (max-width: 640px) {
  .timeline {
    --rail-x: 11px;
  }
  .timeline-item {
    padding-left: 36px;
  }
  .timeline-node {
    top: 30px;
    width: 22px;
    height: 22px;
    left: calc(var(--rail-x) - 10px);
  }
}
</style>
