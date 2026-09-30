<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const barRef = ref<HTMLElement | null>(null);
let frame = 0;

function update() {
  frame = 0;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  // Write directly to the style — no reactive re-render on every scroll event.
  if (barRef.value) barRef.value.style.transform = `scaleX(${progress})`;
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(update);
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onScroll);
  if (frame) cancelAnimationFrame(frame);
});
</script>

<template>
  <div class="scroll-progress-track" aria-hidden="true">
    <div ref="barRef" class="scroll-progress-bar"></div>
  </div>
</template>

<style scoped>
.scroll-progress-track {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 60;
  pointer-events: none;
}

.scroll-progress-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, var(--primary), var(--primary-soft) 70%, var(--accent-acid));
  transform: scaleX(0);
  transform-origin: left center;
  will-change: transform;
}
</style>
