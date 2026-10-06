<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount } from 'vue';
import { PlayIcon, XMarkIcon, ArrowUpRightIcon } from '@heroicons/vue/20/solid';
import { PORTFOLIO_DATA } from '~/data/portfolio';

const videos = PORTFOLIO_DATA.videos;
const personal = PORTFOLIO_DATA.personal;
const selectedVideoUrl = ref<string | null>(null);
const selectedVideoTitle = ref('');

const sectionRef = ref<HTMLElement | null>(null);
const closeBtnRef = ref<HTMLButtonElement | null>(null);

let lastFocused: HTMLElement | null = null;

function lockScroll(lock: boolean) {
  document.body.classList.toggle('is-scroll-locked', lock);
}

function onModalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeModal();
  } else if (e.key === 'Tab') {
    const modal = closeBtnRef.value?.closest('.video-modal-shell');
    const focusables = modal
      ? Array.from(modal.querySelectorAll<HTMLElement>('button, iframe'))
      : [];
    if (focusables.length < 2) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function openModal(url: string, title: string) {
  let embedUrl = url;
  if (url.includes('watch?v=')) {
    const id = url.split('v=')[1]?.split('&')[0];
    embedUrl = `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  lastFocused = document.activeElement as HTMLElement | null;
  selectedVideoTitle.value = title;
  selectedVideoUrl.value = embedUrl;
}

function closeModal() {
  selectedVideoUrl.value = null;
}

watch(selectedVideoUrl, async (url) => {
  if (url) {
    lockScroll(true);
    document.addEventListener('keydown', onModalKeydown);
    await nextTick();
    closeBtnRef.value?.focus();
  } else {
    lockScroll(false);
    document.removeEventListener('keydown', onModalKeydown);
    lastFocused?.focus?.({ preventScroll: true });
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onModalKeydown);
  lockScroll(false);
});
</script>

<template>
  <section ref="sectionRef" class="mba-exams-section" id="exams" aria-labelledby="videos-heading">
    <div class="section-inner" id="videos">
      <!-- Section Header -->
      <div v-reveal="{ stagger: true }" class="section-header">
        <div class="eyebrow">
          <span class="line"></span>
          <span>04 — FEATURED COUNSELLING GUIDES</span>
        </div>
        <h2 id="videos-heading">Featured Counselling <em class="serif-italic">Video Guides</em></h2>
        <p class="section-desc">
          Watch in-depth reviews on fees, ROI, cutoffs, and profile fit.
        </p>
      </div>

      <!-- Video Guides Grid -->
      <ul v-reveal="{ variant: 'scale', stagger: true }" class="videos-grid">
        <li v-for="video in videos" :key="video.id">
          <button
            type="button"
            class="video-card-dark"
            data-cursor="Play"
            :aria-label="`Play video: ${video.title}`"
            @click="openModal(video.videoUrl, video.title)"
          >
            <span class="thumb-frame">
              <img
                :src="video.thumbnail"
                alt=""
                class="thumb-img"
                width="480"
                height="360"
                loading="lazy"
                decoding="async"
              />
              <span class="play-overlay" aria-hidden="true">
                <span class="play-circle"><PlayIcon /></span>
              </span>
              <span class="cat-badge">{{ video.categoryLabel }}</span>
            </span>

            <span class="video-info">
              <span class="video-title">{{ video.title }}</span>
              <span class="video-desc">{{ video.shortDesc }}</span>
            </span>
          </button>
        </li>
      </ul>

      <div v-reveal="'fade'" class="channel-link-row">
        <a :href="personal.youtubeUrl" target="_blank" rel="noreferrer" class="link-arrow channel-link">
          <span class="link-underline">More reviews on {{ personal.youtubeChannel }}</span>
          <ArrowUpRightIcon class="btn-icon btn-icon--diag" aria-hidden="true" />
        </a>
      </div>
    </div>

    <!-- YouTube Video Modal Viewer -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedVideoUrl"
          class="video-modal-backdrop"
          @click.self="closeModal"
        >
          <div
            class="video-modal-shell"
            role="dialog"
            aria-modal="true"
            :aria-label="selectedVideoTitle || 'Video player'"
          >
            <button ref="closeBtnRef" type="button" class="modal-close-btn" aria-label="Close video" @click="closeModal">
              <XMarkIcon aria-hidden="true" />
            </button>
            <div class="iframe-aspect-ratio">
              <iframe
                :src="selectedVideoUrl"
                :title="selectedVideoTitle || 'Arshi Khan Counselling Video Guide'"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.mba-exams-section {
  padding: clamp(80px, 11vw, 120px) max(5vw, 20px);
  background: var(--bg-dark);
  color: var(--ink-dark);
  overflow: hidden;
  position: relative;
  isolation: isolate;
}

.mba-exams-section::before {
  content: '';
  position: absolute;
  z-index: -1;
  top: -200px;
  right: -200px;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.14), transparent 65%);
  pointer-events: none;
}

.section-inner {
  max-width: 1340px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 48px;
}

.section-header h2 {
  margin: 0;
  font-size: clamp(2.2rem, 4.2vw, 3.8rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
  font-weight: 850;
  color: #ffffff;
  text-wrap: balance;
}

.section-desc {
  color: var(--ink-dark-muted);
  font-size: 1.05rem;
  margin: 0;
}

/* Video Grid */
.videos-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
  gap: 22px;
}

.videos-grid > li {
  display: flex;
}

.video-card-dark {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  text-align: left;
  font: inherit;
  color: inherit;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface-dark-elevated);
  border: 1px solid var(--border-dark);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform var(--dur-med) var(--ease-out),
    border-color var(--dur-med) ease,
    box-shadow var(--dur-med) var(--ease-out);
}

.video-card-dark:focus-visible {
  outline: 2px solid var(--primary-soft);
  outline-offset: 3px;
  border-radius: var(--radius-lg);
}

.thumb-frame {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  background: #000000;
  overflow: hidden;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.01);
  transition: transform 700ms var(--ease-out), filter 700ms ease;
  filter: saturate(0.9);
}

.play-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: linear-gradient(180deg, rgba(7, 5, 13, 0.1), rgba(7, 5, 13, 0.55));
  transition: opacity var(--dur-med) ease;
}

.play-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary);
  color: #ffffff;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 24px rgba(124, 58, 237, 0.5);
  transition: transform var(--dur-med) var(--ease-out), background-color var(--dur-fast) ease;
}

.play-circle svg {
  width: 20px;
  height: 20px;
  margin-left: 2px;
}

.cat-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: rgba(7, 5, 13, 0.85);
  color: var(--accent-acid);
  font-size: 0.6rem;
  font-weight: 850;
  letter-spacing: 0.08em;
}

.video-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}

.video-title {
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.35;
  transition: color var(--dur-fast) ease;
}

.video-desc {
  color: var(--ink-dark-muted);
  font-size: 0.85rem;
  line-height: 1.5;
}

@media (hover: hover) and (pointer: fine) {
  .video-card-dark:hover {
    transform: translate3d(0, -6px, 0);
    border-color: var(--border-dark-hover);
    box-shadow: 0 24px 50px -24px rgba(124, 58, 237, 0.55);
  }
  .video-card-dark:hover .thumb-img {
    transform: scale(1.06);
    filter: saturate(1.05);
  }
  .video-card-dark:hover .play-circle {
    transform: scale(1.12);
  }
  .video-card-dark:hover .video-title {
    color: var(--primary-soft);
  }
}

.video-card-dark:focus-visible .play-circle {
  transform: scale(1.12);
}

.channel-link-row {
  margin-top: 36px;
  display: flex;
  justify-content: center;
}

.channel-link {
  color: var(--ink-dark-muted);
  font-size: 0.9rem;
  font-weight: 700;
  transition: color var(--dur-fast) ease;
}

.channel-link:hover,
.channel-link:focus-visible {
  color: #ffffff;
}

/* Modal */
.video-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 150;
  background: rgba(7, 5, 13, 0.88);
  display: grid;
  place-items: center;
  padding: 24px;
}

.video-modal-shell {
  width: min(900px, 100%);
  position: relative;
}

.modal-close-btn {
  position: absolute;
  top: -54px;
  right: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform var(--dur-med) var(--ease-out), background-color var(--dur-fast) ease;
}

.modal-close-btn svg {
  width: 22px;
  height: 22px;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.14);
  transform: rotate(90deg);
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
  display: block;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur-med) var(--ease-out);
}
.modal-enter-active .video-modal-shell,
.modal-leave-active .video-modal-shell {
  transition: transform var(--dur-med) var(--ease-out), opacity var(--dur-med) var(--ease-out);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .video-modal-shell,
.modal-leave-to .video-modal-shell {
  opacity: 0;
  transform: translate3d(0, 16px, 0) scale(0.97);
}
</style>
