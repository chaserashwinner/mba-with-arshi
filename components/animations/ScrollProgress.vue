<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const progress = ref(0);

function updateScrollProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight > 0) {
    progress.value = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress);
});
</script>

<template>
  <div class="scroll-progress-track" aria-hidden="true">
    <div 
      class="scroll-progress-bar" 
      :style="{ transform: `scaleX(${progress / 100})` }"
    ></div>
  </div>
</template>

<style scoped>
.scroll-progress-track {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 100;
  pointer-events: none;
  background: transparent;
}

.scroll-progress-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-bright), var(--accent-acid));
  transform-origin: left center;
  transition: transform 0.05s linear;
  will-change: transform;
}
</style>
