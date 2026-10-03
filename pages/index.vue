<script setup lang="ts">
import { ref } from 'vue';
import ScrollProgress from '~/components/animations/ScrollProgress.vue';
import CursorFollower from '~/components/animations/CursorFollower.vue';
import SiteHeader from '~/components/SiteHeader.vue';
import MobileDrawer from '~/components/MobileDrawer.vue';

import HeroSection from '~/components/sections/HeroSection.vue';
import FindMBAStorySection from '~/components/sections/FindMBAStorySection.vue';
import CollegeFinderSection from '~/components/sections/CollegeFinderSection.vue';
import ExamsHorizontalSection from '~/components/sections/ExamsHorizontalSection.vue';
import GuidanceProcessSection from '~/components/sections/GuidanceProcessSection.vue';
import VisualBreakSection from '~/components/sections/VisualBreakSection.vue';
import AboutArshiSection from '~/components/sections/AboutArshiSection.vue';
import CounsellingCTASection from '~/components/sections/CounsellingCTASection.vue';
import SiteFooter from '~/components/SiteFooter.vue';

const isDrawerOpen = ref(false);

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value;
}

function closeDrawer() {
  isDrawerOpen.value = false;
}
</script>

<template>
  <div class="mba-redesign-app">
    <a class="skip-link" href="#main-content">Skip to content</a>

    <!-- Thin scroll progress indicator -->
    <ScrollProgress />

    <!-- Desktop-only cursor companion (not rendered on touch / reduced motion) -->
    <CursorFollower />

    <main id="main-content" tabindex="-1">
      <!-- 01: Hero Section (staggered entrance + subtle scroll-away) -->
      <HeroSection />

      <!-- 02: Pinned Scroll-Driven Storytelling Section -->
      <FindMBAStorySection />

      <!-- 03: Interactive College Finder & Profile Shortlist Tool -->
      <CollegeFinderSection />

      <!-- 04: Horizontal Scroll Entrance Exams & Video Reviews -->
      <ExamsHorizontalSection />

      <!-- 05: 4-Step Admission Guidance Timeline -->
      <GuidanceProcessSection />

      <!-- 06: Editorial Visual Break Section -->
      <VisualBreakSection />

      <!-- 07: Editorial About Arshi Khan Profile Section -->
      <AboutArshiSection />

      <!-- 08: 1:1 Counselling CTA & Request Booking Form -->
      <CounsellingCTASection />
    </main>

    <!-- 09: Site Footer -->
    <SiteFooter />
  </div>
</template>

<style scoped>
.mba-redesign-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-dark);
  color: var(--ink-light);
  overflow-x: clip;
}

main {
  flex: 1;
}

main:focus {
  outline: none;
}
</style>
