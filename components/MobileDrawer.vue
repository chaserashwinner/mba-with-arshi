<script setup lang="ts">
import { ref, watch, onUnmounted, nextTick } from 'vue';
import { ArrowRightIcon, EnvelopeIcon } from '@heroicons/vue/20/solid';
import SocialIcon from '~/components/ui/SocialIcon.vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const personal = PORTFOLIO_DATA.personal;
const panelRef = ref<HTMLElement | null>(null);

// Original menu items preserved. "Videos" and "Exam Guides" previously pointed to
// #videos / #guides; #guides never existed, so it now targets the exams section.
const links = [
  { href: '#find-colleges', label: 'Find Colleges' },
  { href: '#exams', label: 'Video Guides' },
  { href: '#counselling', label: 'Get Counselling' },
];

function closeMenu() {
  emit('close');
}

function focusables(): HTMLElement[] {
  const toggle = document.getElementById('menu-toggle');
  const inPanel = panelRef.value
    ? Array.from(panelRef.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
    : [];
  return toggle ? [toggle, ...inPanel] : inPanel;
}

function onKeydown(e: KeyboardEvent) {
  if (!props.isOpen) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    closeMenu();
    return;
  }
  if (e.key === 'Tab') {
    // Keep focus inside the menu (toggle button + panel links).
    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

function onResize() {
  if (props.isOpen && window.innerWidth > 1080) closeMenu();
}

watch(
  () => props.isOpen,
  async (open) => {
    document.body.classList.toggle('is-scroll-locked', open);
    if (open) {
      document.addEventListener('keydown', onKeydown);
      window.addEventListener('resize', onResize, { passive: true });
      await nextTick();
      panelRef.value?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
    } else {
      document.removeEventListener('keydown', onKeydown);
      window.removeEventListener('resize', onResize);
      const toggle = document.getElementById('menu-toggle');
      if (toggle && panelRef.value?.contains(document.activeElement)) toggle.focus();
    }
  },
);

onUnmounted(() => {
  document.body.classList.remove('is-scroll-locked');
  document.removeEventListener('keydown', onKeydown);
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <div
    id="mobile-menu"
    ref="panelRef"
    class="mobile-drawer"
    :class="{ open: isOpen }"
    role="dialog"
    aria-modal="true"
    aria-label="Site menu"
    :aria-hidden="isOpen ? undefined : 'true'"
    :inert="isOpen ? undefined : true"
  >
    <div class="drawer-glow" aria-hidden="true"></div>

    <nav class="drawer-nav" aria-label="Mobile navigation">
      <a
        v-for="(link, i) in links"
        :key="link.href"
        :href="link.href"
        class="drawer-link"
        :style="{ '--i': i }"
        @click="closeMenu"
      >
        <span class="drawer-index" aria-hidden="true">0{{ i + 1 }}</span>
        <span class="drawer-label">{{ link.label }}</span>
        <ArrowRightIcon class="drawer-arrow" aria-hidden="true" />
      </a>
    </nav>

    <div class="drawer-footer" :style="{ '--i': links.length }">
      <a :href="`mailto:${personal.email}`" class="drawer-social">
        <EnvelopeIcon aria-hidden="true" />
        <span>{{ personal.email }}</span>
      </a>
      <div class="drawer-social-row">
        <a :href="personal.youtubeUrl" target="_blank" rel="noreferrer" class="drawer-icon-link" aria-label="YouTube channel (opens in new tab)">
          <SocialIcon name="youtube" />
        </a>
        <a :href="personal.instagramUrl" target="_blank" rel="noreferrer" class="drawer-icon-link" aria-label="Instagram (opens in new tab)">
          <SocialIcon name="instagram" />
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-drawer {
  position: fixed;
  inset: 0;
  z-index: 45;
  padding: calc(var(--header-h) + 28px) max(5vw, 20px) 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  overflow-y: auto;
  color: #ffffff;
  background: var(--bg-dark);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--dur-med) var(--ease-out),
    visibility 0s linear var(--dur-med);
}

.mobile-drawer.open {
  opacity: 1;
  visibility: visible;
  transition: opacity var(--dur-med) var(--ease-out), visibility 0s;
}

.drawer-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(60% 40% at 100% 0%, rgba(124, 58, 237, 0.28), transparent 70%),
    radial-gradient(50% 35% at 0% 100%, rgba(124, 58, 237, 0.14), transparent 70%);
}

.drawer-nav {
  position: relative;
  display: flex;
  flex-direction: column;
}

.drawer-link,
.drawer-footer {
  opacity: 0;
  transform: translate3d(0, 18px, 0);
  transition:
    opacity 300ms var(--ease-out),
    transform 300ms var(--ease-out);
}

.open .drawer-link,
.open .drawer-footer {
  opacity: 1;
  transform: none;
  transition:
    opacity 480ms var(--ease-out) calc(80ms + var(--i) * 50ms),
    transform 480ms var(--ease-out) calc(80ms + var(--i) * 50ms);
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: clamp(1.5rem, 7vw, 2.1rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
}

.drawer-index {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--primary-soft);
  min-width: 22px;
}

.drawer-label {
  flex: 1;
  transition: color var(--dur-fast) ease, transform var(--dur-med) var(--ease-out);
}

.drawer-arrow {
  width: 22px;
  height: 22px;
  color: var(--ink-dark-muted);
  transition: transform var(--dur-med) var(--ease-out), color var(--dur-fast) ease;
}

.drawer-link:hover .drawer-label,
.drawer-link:focus-visible .drawer-label {
  color: var(--accent-acid);
  transform: translateX(4px);
}

.drawer-link:hover .drawer-arrow,
.drawer-link:focus-visible .drawer-arrow {
  color: var(--accent-acid);
  transform: translateX(4px);
}

.drawer-footer {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.drawer-social {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink-dark-muted);
  font-size: 0.9rem;
  font-weight: 600;
  word-break: break-all;
}

.drawer-social svg {
  width: 18px;
  height: 18px;
  flex: none;
}

.drawer-social-row {
  display: flex;
  gap: 10px;
}

.drawer-icon-link {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: #ffffff;
}

.drawer-icon-link svg {
  width: 18px;
  height: 18px;
}

@media (min-width: 1081px) {
  .mobile-drawer {
    display: none;
  }
}
</style>
