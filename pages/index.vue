<script setup lang="ts">
import { ref } from 'vue';

const isDrawerOpen = ref(false);

function toggleDrawer() {
  isDrawerOpen.value = !isDrawerOpen.value;
}

function closeDrawer() {
  isDrawerOpen.value = false;
}
</script>

<template>
  <div class="portfolio-page">
    <AnnouncementBar />
    <SiteHeader @toggle-menu="toggleDrawer" />
    <MobileDrawer :isOpen="isDrawerOpen" @close="closeDrawer" />

    <main>
      <HeroSection />
      <DecisionStrip />
      <ProjectFinder />
      <FeaturedProjects />
      <ExperienceRoadmap />
      <AboutQuoteCard />
      <ContactSection />
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.portfolio-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--paper);
}

main {
  flex: 1;
}
</style>
