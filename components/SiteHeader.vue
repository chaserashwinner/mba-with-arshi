<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { PORTFOLIO_DATA } from '~/data/portfolio';

const personal = PORTFOLIO_DATA.personal;
const emit = defineEmits(['toggle-menu']);

const isScrolled = ref(false);

function checkScroll() {
  isScrolled.value = window.scrollY > 30;
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<template>
  <header 
    class="site-header"
    :class="{ 'header-scrolled': isScrolled }"
  >
    <div class="header-inner">
      <a class="brand" href="#top" aria-label="MBA With Arshi home">
        <span class="brand-logo-mark">A</span>
        <span class="brand-text">
          <strong class="brand-name">{{ personal.brandName }}</strong>
          <small class="brand-tagline">{{ personal.tagline }}</small>
        </span>
      </a>

      <nav class="desktop-nav" aria-label="Main navigation">
        <a href="#find-colleges" class="nav-link">Find Colleges</a>
        <a href="#exams" class="nav-link">MBA Exams</a>
        <a href="#guidance" class="nav-link">Guidance</a>
        <a href="#about" class="nav-link">About Arshi</a>
      </nav>

      <div class="header-actions">
        <a class="button button-primary header-cta" href="#counselling">
          Get Counselling <span aria-hidden="true">→</span>
        </a>

        <button 
          class="mobile-menu-btn" 
          aria-label="Toggle navigation menu"
          @click="emit('toggle-menu')"
        >
          <span></span>
          <span></span>
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
  height: 80px;
  z-index: 50;
  transition: background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, height 0.3s ease;
  border-bottom: 1px solid transparent;
}

.header-scrolled {
  height: 72px;
  background: rgba(7, 5, 13, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.header-inner {
  max-width: 1340px;
  height: 100%;
  margin: 0 auto;
  padding: 0 max(5vw, 24px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo-mark {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--primary);
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 1.15rem;
  font-weight: 900;
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35);
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

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 6px 20px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-link {
  font-size: 0.86rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  position: relative;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--primary-bright);
  transform: scaleX(0);
  transition: transform 0.25s ease;
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-cta {
  min-height: 42px;
  padding: 0 20px;
  font-size: 0.84rem;
}

.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.mobile-menu-btn span {
  width: 18px;
  height: 2px;
  background: #ffffff;
  border-radius: 1px;
}

@media (max-width: 960px) {
  .desktop-nav {
    display: none;
  }
  .mobile-menu-btn {
    display: flex;
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
