<script setup lang="ts">
import { ref, computed } from 'vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';

const activeFilter = ref<string>('all');
const videos = PORTFOLIO_DATA.videos;

const filteredVideos = computed(() => {
  if (activeFilter.value === 'all') return videos;
  return videos.filter(v => v.category === activeFilter.value);
});
</script>

<template>
  <section class="video-section section" id="videos">
    <div class="section-heading light-heading">
      <div>
        <span class="kicker">Watch before you decide</span>
        <h2>Popular MBA guides</h2>
      </div>
      <a 
        class="text-link" 
        href="https://www.youtube.com/@mbawitharshikhan/videos" 
        target="_blank" 
        rel="noreferrer"
      >
        View all videos <span>↗</span>
      </a>
    </div>

    <div class="topic-tabs" role="tablist" aria-label="Video categories">
      <button 
        :class="{ active: activeFilter === 'all' }" 
        @click="activeFilter = 'all'"
        role="tab"
      >
        All videos
      </button>
      <button 
        :class="{ active: activeFilter === 'colleges' }" 
        @click="activeFilter = 'colleges'"
        role="tab"
      >
        College lists
      </button>
      <button 
        :class="{ active: activeFilter === 'exam' }" 
        @click="activeFilter = 'exam'"
        role="tab"
      >
        Exam strategy
      </button>
      <button 
        :class="{ active: activeFilter === 'roi' }" 
        @click="activeFilter = 'roi'"
        role="tab"
      >
        Fees & ROI
      </button>
    </div>

    <div class="video-grid" id="video-grid">
      <article 
        v-for="video in filteredVideos" 
        :key="video.id" 
        class="video-card"
        :data-category="video.category"
      >
        <a :href="video.videoUrl" target="_blank" rel="noreferrer">
          <div class="thumb">
            <img :src="video.thumbnail" :alt="video.title" />
            <span aria-hidden="true">▶</span>
          </div>
          <div class="card-copy">
            <small>{{ video.categoryLabel }}</small>
            <h3>{{ video.title }}</h3>
            <p>{{ video.shortDesc }}</p>
          </div>
        </a>
      </article>
    </div>
  </section>
</template>

<style scoped>
.video-section {
  background: var(--violet-dark);
  color: white;
}

.section {
  padding: 110px max(5vw, 24px);
}

.section-heading {
  max-width: 1340px;
  margin: 0 auto 45px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 35px;
}

.section-heading h2 {
  margin: 10px 0 0;
  font-size: clamp(2.3rem, 4vw, 4.25rem);
  line-height: 1.02;
  letter-spacing: -0.055em;
  color: white;
}

.light-heading .kicker {
  color: var(--acid);
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding-bottom: 5px;
  border-bottom: 1px solid currentColor;
  font-size: 0.8rem;
  font-weight: 750;
  color: white;
  transition: color 0.2s ease;
}

.text-link:hover {
  color: var(--acid);
}

.topic-tabs {
  max-width: 1340px;
  margin: 0 auto 28px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
}

.topic-tabs button {
  flex: none;
  padding: 9px 15px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  color: #d6cde6;
  background: transparent;
  font-size: 0.73rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.topic-tabs button:hover {
  color: white;
  border-color: rgba(255, 255, 255, 0.4);
}

.topic-tabs button.active {
  color: var(--ink);
  border-color: var(--acid);
  background: var(--acid);
}

.video-grid {
  max-width: 1340px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.video-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  transition: transform 0.2s ease, background 0.2s ease;
}

.video-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
}

.thumb {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  position: relative;
  background: #16072e;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s ease;
}

.video-card:hover .thumb img {
  transform: scale(1.035);
}

.thumb::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, rgba(16, 6, 32, 0.65));
}

.thumb span {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  position: absolute;
  right: 13px;
  bottom: 13px;
  z-index: 2;
  border-radius: 50%;
  color: var(--violet);
  background: white;
  font-size: 0.65rem;
}

.card-copy {
  padding: 19px;
}

.card-copy small {
  color: var(--acid);
  font-size: 0.62rem;
  font-weight: 850;
  letter-spacing: 0.1em;
}

.card-copy h3 {
  margin: 8px 0;
  font-size: 1rem;
  line-height: 1.35;
  letter-spacing: -0.02em;
  color: white;
}

.card-copy p {
  margin: 0;
  color: #b9b0c9;
  font-size: 0.72rem;
  line-height: 1.5;
}

@media (max-width: 1120px) {
  .video-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
  .section-heading {
    display: block;
    margin-bottom: 30px;
  }
}
</style>
