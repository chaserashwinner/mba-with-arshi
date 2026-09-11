<script setup lang="ts">
import { PORTFOLIO_DATA } from '~/data/portfolio';

const personal = PORTFOLIO_DATA.personal;
const emit = defineEmits(['toggle-menu']);

function handleOpenMenu() {
  emit('toggle-menu');
}
</script>

<template>
  <header class="site-header" id="top">
    <a class="brand" href="#top" aria-label="MBA With Arshi home">
      <span class="brand-mark">A</span>
      <span class="brand-copy">
        <strong>{{ personal.brandName }}</strong>
        <small>{{ personal.tagline }}</small>
      </span>
    </a>

    <nav class="desktop-nav" aria-label="Main navigation">
      <a href="#find-colleges">Find Colleges</a>
      <a href="#videos">Videos</a>
      <a href="#guides">Exam Guides</a>
      <a href="#about">About Arshi</a>
    </nav>

    <a class="header-cta" href="#counselling">
      Get Counselling
    </a>

    <button 
      class="menu-button" 
      aria-label="Open menu" 
      @click="handleOpenMenu"
    >
      <span></span>
      <span></span>
    </button>
  </header>
</template>

<style scoped>
.site-header {
  height: 82px;
  padding: 0 max(5vw, 24px);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 30px;
  border-bottom: 1px solid var(--line);
  background: rgba(247, 244, 255, 0.92);
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: 30;
}

.brand {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 11px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(145deg, var(--violet), var(--magenta));
  border-radius: 12px 12px 4px 12px;
  font-size: 1.35rem;
  font-weight: 900;
  box-shadow: 0 8px 24px rgba(98, 36, 233, 0.3);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  line-height: 1.06;
}

.brand-copy strong {
  font-size: 0.98rem;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.brand-copy small {
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 0.88rem;
  font-weight: 650;
  color: var(--ink);
}

.desktop-nav a {
  position: relative;
  transition: color 0.2s ease;
}

.desktop-nav a:hover {
  color: var(--violet);
}

.desktop-nav a::after {
  content: "";
  position: absolute;
  left: 0;
  right: 100%;
  bottom: -8px;
  height: 2px;
  background: var(--violet);
  transition: right 0.2s ease;
}

.desktop-nav a:hover::after {
  right: 0;
}

.header-cta {
  justify-self: end;
  padding: 11px 18px;
  border: 1px solid var(--ink);
  border-radius: 999px;
  font-size: 0.84rem;
  font-weight: 750;
  transition: all 0.2s ease;
  color: var(--ink);
}

.header-cta:hover {
  color: white;
  background: var(--ink);
  transform: translateY(-1px);
}

.menu-button {
  display: none;
  justify-self: end;
  width: 42px;
  height: 42px;
  border: 0;
  border-radius: 50%;
  background: var(--ink);
  cursor: pointer;
}

.menu-button span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 5px auto;
  background: white;
  border-radius: 1px;
}

@media (max-width: 1120px) {
  .site-header {
    grid-template-columns: 1fr auto;
  }
  .desktop-nav, .header-cta {
    display: none;
  }
  .menu-button {
    display: block;
  }
}

@media (max-width: 760px) {
  .site-header {
    height: 70px;
    padding-inline: 16px;
  }
  .brand-mark {
    width: 37px;
    height: 37px;
  }
}
</style>
