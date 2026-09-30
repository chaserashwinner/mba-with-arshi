<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { ArrowRightIcon } from '@heroicons/vue/20/solid';
import { PORTFOLIO_DATA } from '~/data/portfolio';

const props = defineProps<{ menuOpen: boolean }>();
const emit = defineEmits<{ (e: 'toggle-menu'): void }>();

const personal = PORTFOLIO_DATA.personal;

const navItems = [
  { href: '#find-colleges', id: 'find-colleges', label: 'Find Colleges' },
  { href: '#exams', id: 'exams', label: 'MBA Exams' },
  { href: '#guidance', id: 'guidance', label: 'Guidance' },
  { href: '#about', id: 'about', label: 'About Arshi' },
];

const isScrolled = ref(false);
const activeId = ref<string | null>(null);
const navRef = ref<HTMLElement | null>(null);
const indicator = ref({ x: 0, w: 0, visible: false });

let scrollFrame = 0;
let sectionObserver: IntersectionObserver | null = null;

function checkScroll() {
  scrollFrame = 0;
  isScrolled.value = window.scrollY > 24;
}

function onScroll() {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(checkScroll);
}

function positionIndicator() {
  const nav = navRef.value;
  if (!nav) return;
  const link = activeId.value
    ? nav.querySelector<HTMLElement>(`[data-nav-id="${activeId.value}"]`)
    : null;
  if (!link) {
    indicator.value = { ...indicator.value, visible: false };
    return;
  }
  indicator.value = { x: link.offsetLeft, w: link.offsetWidth, visible: true };
}

watch(activeId, () => nextTick(positionIndicator));

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', positionIndicator, { passive: true });
  checkScroll();

  // Active-section tracking: a section is "active" while it crosses the viewport's middle band.
  const visible = new Map<string, boolean>();
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
      const current = navItems.find((item) => visible.get(item.id));
      activeId.value = current ? current.id : null;
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  );
  navItems.forEach((item) => {
    const el = document.getElementById(item.id);
    if (el) sectionObserver?.observe(el);
  });

  // Fonts can change link widths after first paint.
  document.fonts?.ready.then(positionIndicator).catch(() => {});
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', positionIndicator);
  sectionObserver?.disconnect();
  if (scrollFrame) cancelAnimationFrame(scrollFrame);
});
</script>

<template>
  <header
    class="site-header"
    :class="{ 'header-scrolled': isScrolled, 'header-menu-open': props.menuOpen }"
  >
    <div class="header-inner">
      <a class="brand" href="#top" aria-label="MBA With Arshi home">
        <span class="brand-logo-mark" aria-hidden="true">A</span>
        <span class="brand-text">
          <strong class="brand-name">{{ personal.brandName }}</strong>
          <small class="brand-tagline">{{ personal.tagline }}</small>
        </span>
      </a>

      <nav ref="navRef" class="desktop-nav" aria-label="Main navigation">
        <span
          class="nav-indicator"
          :class="{ visible: indicator.visible }"
          :style="{ transform: `translateX(${indicator.x}px)`, width: `${indicator.w}px` }"
          aria-hidden="true"
        ></span>
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="item.href"
          :data-nav-id="item.id"
          class="nav-link"
          :class="{ active: activeId === item.id }"
          :aria-current="activeId === item.id ? 'location' : undefined"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="header-actions">
        <a v-magnetic="{ strength: 5 }" class="button button-primary header-cta" href="#counselling">
          Get Counselling
          <ArrowRightIcon class="btn-icon" aria-hidden="true" />
        </a>

        <button
          id="menu-toggle"
          type="button"
          class="mobile-menu-btn"
          :class="{ 'is-open': props.menuOpen }"
          :aria-label="props.menuOpen ? 'Close navigation menu' : 'Open navigation menu'"
          :aria-expanded="props.menuOpen ? 'true' : 'false'"
          aria-controls="mobile-menu"
          @click="emit('toggle-menu')"
        >
          <span class="bar" aria-hidden="true"></span>
          <span class="bar" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-h);
  z-index: 50;
  border-bottom: 1px solid transparent;
  transition:
    background-color var(--dur-med) ease,
    border-color var(--dur-med) ease,
    box-shadow var(--dur-med) ease;
}

.header-scrolled {
  background: rgba(7, 5, 13, 0.86);
  -webkit-backdrop-filter: blur(14px) saturate(1.2);
  backdrop-filter: blur(14px) saturate(1.2);
  border-bottom-color: rgba(255, 255, 255, 0.07);
  box-shadow: 0 10px 30px -18px rgba(0, 0, 0, 0.6);
}

.header-menu-open {
  background: transparent;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
  border-bottom-color: transparent;
  box-shadow: none;
}

.header-inner {
  max-width: 1340px;
  height: 100%;
  margin: 0 auto;
  padding: 0 max(5vw, 20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  border-radius: 12px;
}

.brand-logo-mark {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  background: linear-gradient(145deg, var(--primary-bright), var(--primary-hover));
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 1.1rem;
  font-weight: 900;
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  transition: transform var(--dur-med) var(--ease-out);
}

.brand:hover .brand-logo-mark {
  transform: rotate(-8deg) scale(1.05);
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.brand-name {
  font-size: 0.98rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.brand-tagline {
  margin-top: 2px;
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-dark-muted);
}

/* Desktop nav with sliding active pill */
.desktop-nav {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-indicator {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 0;
  border-radius: var(--radius-full);
  background: rgba(139, 92, 246, 0.22);
  border: 1px solid rgba(167, 139, 250, 0.3);
  opacity: 0;
  transition:
    transform 500ms var(--ease-out),
    width 500ms var(--ease-out),
    opacity var(--dur-med) ease;
  pointer-events: none;
}

.nav-indicator.visible {
  opacity: 1;
}

.nav-link {
  position: relative;
  z-index: 1;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 0.86rem;
  font-weight: 600;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.72);
  transition: color var(--dur-fast) ease, background-color var(--dur-fast) ease;
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.active {
  color: #ffffff;
  background: transparent;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-cta {
  white-space: nowrap;
  min-height: 42px;
  padding: 0 20px;
  font-size: 0.84rem;
}

/* Animated menu icon: two bars morph into an X */
.mobile-menu-btn {
  display: none;
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color var(--dur-fast) ease, border-color var(--dur-fast) ease;
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.mobile-menu-btn .bar {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 18px;
  height: 2px;
  margin-left: -9px;
  border-radius: 2px;
  background: #ffffff;
  transition: transform var(--dur-med) var(--ease-out);
}

.mobile-menu-btn .bar:nth-child(1) { transform: translateY(-4px); }
.mobile-menu-btn .bar:nth-child(2) { transform: translateY(3px) scaleX(0.7); transform-origin: right center; }

.mobile-menu-btn.is-open {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
}
.mobile-menu-btn.is-open .bar:nth-child(1) { transform: translateY(0) rotate(45deg); }
.mobile-menu-btn.is-open .bar:nth-child(2) { transform: translateY(0) rotate(-45deg); transform-origin: center; }

@media (max-width: 1080px) {
  .desktop-nav {
    display: none;
  }
  .mobile-menu-btn {
    display: block;
  }
}

@media (max-width: 1240px) {
  .brand-tagline {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-cta {
    display: none;
  }
  .brand-tagline {
    display: none;
  }
}
</style>
