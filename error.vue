<script lang="ts" setup>
useHead({
  title: "404 - Page Not Found | Arshi Khan Portfolio",
});

const props = defineProps({
  error: {
    type: Object,
    default: null,
  },
});

function handleGoHome() {
  clearError({ redirect: '/' });
}
</script>

<template>
  <div class="error-container">
    <div class="error-card">
      <span class="error-badge">404</span>
      <h1>Page Not Found</h1>
      <p>The portfolio section or page you are looking for does not exist or has been moved.</p>
      <button type="button" class="button button-primary" @click="handleGoHome">
        Back to Home →
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--paper);
  color: var(--ink);
  font-family: 'Inter', sans-serif;
}

.error-card {
  max-width: 480px;
  text-align: center;
  padding: 48px 36px;
  border-radius: 24px;
  background: white;
  border: 1px solid rgba(17, 16, 25, 0.12);
  box-shadow: 0 20px 60px rgba(32, 17, 70, 0.12);
}

.error-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  background: #eee7ff;
  color: var(--violet);
  font-size: 0.88rem;
  font-weight: 900;
  margin-bottom: 20px;
}

.error-card h1 {
  margin: 0 0 12px;
  font-size: 2rem;
  letter-spacing: -0.03em;
}

.error-card p {
  color: #6d6977;
  font-size: 0.95rem;
  margin-bottom: 28px;
  line-height: 1.6;
}

.button-primary {
  color: white;
  background: var(--violet);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 800;
  border: 0;
  cursor: pointer;
}
</style>
