<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';
import { useScrollAnimation } from '~/composables/useScrollAnimation';

const videos = PORTFOLIO_DATA.videos;
const selectedVideoUrl = ref<string | null>(null);

const examItems = [
  { 
    name: 'CAT', 
    full: 'Common Admission Test', 
    target: 'IIMs, FMS, SPJIMR, MDI', 
    badge: 'NATIONAL TIER-1',
    desc: 'The benchmark national entrance test taken by ~3 lakh aspirants annually.' 
  },
  { 
    name: 'XAT', 
    full: 'Xavier Aptitude Test', 
    target: 'XLRI Jamshedpur, GIM, XIMB', 
    badge: 'DECISION MAKING Focus',
    desc: 'Known for its unique Decision Making section and essay component.' 
  },
  { 
    name: 'SNAP', 
    full: 'Symbiosis National Aptitude', 
    target: 'SIBM Pune, SCMHRD', 
    badge: '60 MIN SPEED TEST',
    desc: 'Speed-based 60-minute test for admission into Symbiosis Institutes.' 
  },
  { 
    name: 'NMAT', 
    full: 'NMAT by GMAC', 
    target: 'NMIMS Mumbai, KJS, TAPMI', 
    badge: 'ADAPTIVE 3 ATTEMPTS',
    desc: 'Computer-adaptive entrance test allowing up to 3 retake attempts.' 
  },
  { 
    name: 'CMAT', 
    full: 'Common Management Test', 
    target: 'JBIMS, SIMSREE, Great Lakes', 
    badge: 'NTA GOVT EXAM',
    desc: 'National exam conducted by NTA offering access to top government & AICTE B-schools.' 
  },
];

const sectionRef = ref<HTMLElement | null>(null);
const horizontalTrackRef = ref<HTMLElement | null>(null);

const { initGSAP, isReducedMotion } = useScrollAnimation();

onMounted(async () => {
  if (isReducedMotion()) return;

  const { gsap, ScrollTrigger } = await initGSAP();
  if (!gsap || !ScrollTrigger || !sectionRef.value || !horizontalTrackRef.value) return;

  const track = horizontalTrackRef.value;
  const totalScroll = track.scrollWidth - track.clientWidth;

  if (totalScroll > 0) {
    gsap.to(track, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top+=60',
        end: `+=${totalScroll * 1.2}`,
        pin: true,
        scrub: 1,
      },
    });
  }
});

function openModal(url: string) {
  // Convert standard watch URL to embed format if necessary
  let embedUrl = url;
  if (url.includes('watch?v=')) {
    const id = url.split('v=')[1]?.split('&')[0];
    embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  selectedVideoUrl.value = embedUrl;
}

function closeModal() {
  selectedVideoUrl.value = null;
}
</script>

<template>
  <section ref="sectionRef" class="mba-exams-section" id="exams">
    <div class="section-inner">
      <!-- Section Header -->
      <div class="section-header">
        <div class="eyebrow">
          <span class="line"></span>
          <span>04 — ENTRANCE EXAMS & GUIDES</span>
        </div>
        <h2>Master your MBA exam strategy.</h2>
        <p class="section-desc">
          Compare entrance exam formats and watch verified video reviews by Arshi Khan.
        </p>
      </div>

      <!-- Horizontal Scrollable Track -->
      <div class="horizontal-wrapper">
        <div ref="horizontalTrackRef" class="horizontal-track">
          <div 
            v-for="exam in examItems" 
            :key="exam.name"
            class="exam-card-dark"
          >
            <div class="card-top">
              <span class="exam-name-large">{{ exam.name }}</span>
              <span class="exam-badge-dark">{{ exam.badge }}</span>
            </div>

            <h4 class="exam-full-name">{{ exam.full }}</h4>
            <p class="exam-desc">{{ exam.desc }}</p>

            <div class="card-bottom">
              <small>TARGET B-SCHOOLS</small>
              <strong>{{ exam.target }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Video Guides Grid Header -->
      <div class="video-grid-header" id="videos">
        <h3>Featured Counselling Video Guides</h3>
        <p>Watch in-depth reviews on fees, ROI, cutoffs, and profile fit.</p>
      </div>

      <!-- Video Guides Grid -->
      <div class="videos-grid">
        <div 
          v-for="video in videos" 
          :key="video.id"
          class="video-card-dark"
          @click="openModal(video.videoUrl)"
        >
          <div class="thumb-frame">
            <img :src="video.thumbnail" :alt="video.title" class="thumb-img" />
            <div class="play-overlay">
              <span class="play-circle">▶</span>
            </div>
            <span class="cat-badge">{{ video.categoryLabel }}</span>
          </div>

          <div class="video-info">
            <h4>{{ video.title }}</h4>
            <p>{{ video.shortDesc }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- YouTube Video Modal Viewer -->
    <div 
      v-if="selectedVideoUrl" 
      class="video-modal-backdrop"
      @click.self="closeModal"
    >
      <div class="video-modal-shell">
        <button class="modal-close-btn" @click="closeModal">×</button>
        <div class="iframe-aspect-ratio">
          <iframe 
            :src="selectedVideoUrl" 
            title="Arshi Khan Counselling Video Guide" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mba-exams-section {
  padding: 110px max(5vw, 24px);
  background: var(--bg-dark);
  color: var(--ink-dark);
  overflow: hidden;
}

.section-inner {
  max-width: 1340px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 40px;
}

.section-header h2 {
  margin: 12px 0 0;
  font-size: clamp(2.3rem, 4.2vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 850;
  color: #ffffff;
}

.section-desc {
  color: var(--ink-dark-muted);
  font-size: 1.05rem;
  margin-top: 10px;
}

/* Horizontal Track Wrapper */
.horizontal-wrapper {
  overflow-x: hidden;
  margin-bottom: 70px;
  padding-block: 10px;
}

.horizontal-track {
  display: flex;
  gap: 24px;
  width: max-content;
  will-change: transform;
}

.exam-card-dark {
  width: 320px;
  flex: none;
  padding: 28px;
  border-radius: var(--radius-xl);
  background: var(--surface-dark-elevated);
  border: 1px solid var(--border-dark);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.exam-card-dark:hover {
  transform: translateY(-4px);
  border-color: var(--border-dark-hover);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.exam-name-large {
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  color: var(--primary-bright);
}

.exam-badge-dark {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.08);
  color: var(--accent-acid);
  font-size: 0.6rem;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.exam-full-name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
}

.exam-desc {
  margin: 0;
  color: var(--ink-dark-muted);
  font-size: 0.86rem;
  line-height: 1.55;
}

.card-bottom {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.card-bottom small {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--ink-dark-muted);
}

.card-bottom strong {
  display: block;
  font-size: 0.88rem;
  color: #ffffff;
  margin-top: 2px;
}

/* Video Grid */
.video-grid-header {
  margin-bottom: 30px;
}

.video-grid-header h3 {
  margin: 0 0 6px;
  font-size: 1.8rem;
  font-weight: 850;
  color: #ffffff;
}

.video-grid-header p {
  margin: 0;
  color: var(--ink-dark-muted);
}

.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.video-card-dark {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface-dark-elevated);
  border: 1px solid var(--border-dark);
  cursor: pointer;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.video-card-dark:hover {
  transform: translateY(-4px);
  border-color: var(--border-dark-hover);
}

.thumb-frame {
  position: relative;
  aspect-ratio: 1.6;
  background: #000000;
  overflow: hidden;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.video-card-dark:hover .thumb-img {
  transform: scale(1.05);
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(7, 5, 13, 0.35);
  transition: background-color 0.2s ease;
}

.video-card-dark:hover .play-overlay {
  background: rgba(7, 5, 13, 0.15);
}

.play-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 0.95rem;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.5);
  transition: transform 0.2s ease;
}

.video-card-dark:hover .play-circle {
  transform: scale(1.1);
}

.cat-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(7, 5, 13, 0.85);
  color: var(--accent-acid);
  font-size: 0.62rem;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.video-info {
  padding: 20px;
}

.video-info h4 {
  margin: 0 0 8px;
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.35;
}

.video-info p {
  margin: 0;
  color: var(--ink-dark-muted);
  font-size: 0.84rem;
  line-height: 1.5;
}

/* Modal */
.video-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(7, 5, 13, 0.85);
  backdrop-filter: blur(12px);
  display: grid;
  place-items: center;
  padding: 24px;
}

.video-modal-shell {
  width: min(840px, 100%);
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: -44px;
  right: 0;
  border: 0;
  background: none;
  color: #ffffff;
  font-size: 2.2rem;
  cursor: pointer;
}

.iframe-aspect-ratio {
  aspect-ratio: 16 / 9;
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #000000;
  box-shadow: var(--shadow-dark);
}

.iframe-aspect-ratio iframe {
  width: 100%;
  height: 100%;
}
</style>
