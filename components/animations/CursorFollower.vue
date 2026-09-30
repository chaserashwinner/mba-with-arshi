<script setup lang="ts">
/**
 * Subtle cursor companion for mouse/trackpad users.
 * - The native cursor is never hidden; this ring only trails it.
 * - Not rendered at all on touch devices or with reduced motion.
 * - The rAF loop sleeps as soon as the ring catches up (no idle CPU).
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { hasFinePointer, prefersReducedMotion } from '~/composables/useScrollAnimation';

const enabled = ref(false);
const ringRef = ref<HTMLElement | null>(null);
const state = ref<'default' | 'link' | 'media' | 'hidden'>('hidden');
const label = ref('');
const pressed = ref(false);

const target = { x: -100, y: -100 };
const pos = { x: -100, y: -100 };
let frame = 0;
let hasMoved = false;

const INTERACTIVE = 'a, button, [role="button"], label, select, summary, input[type="range"]';
const TEXT_INPUT = 'input:not([type="range"]), textarea, iframe, [contenteditable="true"]';

function tick() {
  pos.x += (target.x - pos.x) * 0.22;
  pos.y += (target.y - pos.y) * 0.22;
  if (ringRef.value) {
    ringRef.value.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
  }
  if (Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) {
    frame = requestAnimationFrame(tick);
  } else {
    frame = 0;
  }
}

function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return;
  target.x = e.clientX;
  target.y = e.clientY;
  if (!hasMoved) {
    hasMoved = true;
    pos.x = target.x;
    pos.y = target.y;
    onOver(e);
  }
  if (state.value === 'hidden' && !(e.target instanceof Element && e.target.closest(TEXT_INPUT))) {
    // Jump into place on first appearance instead of flying in from a corner.
    pos.x = target.x;
    pos.y = target.y;
    state.value = 'default';
  }
  if (!frame) frame = requestAnimationFrame(tick);
}

function onOver(e: PointerEvent) {
  if (!hasMoved) return;
  const el = e.target as Element | null;
  if (!el || !(el instanceof Element)) return;

  if (el.closest(TEXT_INPUT)) {
    state.value = 'hidden';
    return;
  }
  const media = el.closest<HTMLElement>('[data-cursor]');
  if (media) {
    state.value = 'media';
    label.value = media.dataset.cursor || '';
    return;
  }
  label.value = '';
  state.value = el.closest(INTERACTIVE) ? 'link' : 'default';
}

function onLeaveWindow() {
  state.value = 'hidden';
}
const onDown = () => (pressed.value = true);
const onUp = () => (pressed.value = false);

onMounted(() => {
  if (!hasFinePointer() || prefersReducedMotion()) return;
  enabled.value = true;
  window.addEventListener('pointermove', onMove, { passive: true });
  document.addEventListener('pointerover', onOver, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeaveWindow);
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
});

onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame);
  window.removeEventListener('pointermove', onMove);
  document.removeEventListener('pointerover', onOver);
  document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
  window.removeEventListener('pointerdown', onDown);
  window.removeEventListener('pointerup', onUp);
});
</script>

<template>
  <div v-if="enabled" ref="ringRef" class="cursor-follower" aria-hidden="true">
    <span class="cursor-ring" :class="[`is-${state}`, { 'is-pressed': pressed }]">
      <span v-if="state === 'media' && label" class="cursor-label">{{ label }}</span>
    </span>
  </div>
</template>

<style scoped>
.cursor-follower {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 120;
  pointer-events: none;
  will-change: transform;
}

.cursor-ring {
  position: absolute;
  top: -18px;
  left: -18px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid rgba(167, 139, 250, 0.55);
  display: grid;
  place-items: center;
  transition:
    transform var(--dur-med) var(--ease-out),
    opacity var(--dur-fast) ease,
    background-color var(--dur-med) ease,
    border-color var(--dur-med) ease;
}

.cursor-ring.is-hidden {
  opacity: 0;
  transform: scale(0.4);
}

.cursor-ring.is-link {
  transform: scale(1.45);
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(167, 139, 250, 0.8);
}

.cursor-ring.is-media {
  transform: scale(2.1);
  background: rgba(124, 58, 237, 0.85);
  border-color: transparent;
}

.cursor-ring.is-pressed {
  transform: scale(0.85);
}

.cursor-ring.is-link.is-pressed {
  transform: scale(1.2);
}

.cursor-label {
  font-size: 0.34rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ffffff;
}
</style>
