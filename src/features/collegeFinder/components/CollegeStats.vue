<script setup>
defineProps({
  stats: {
    type: Array,
    default: () => [],
  },
});

const { tr } = useAppI18n();
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <div
      v-for="stat in stats"
      :key="stat.labelKey || stat.fallback"
      class="sk-card rounded-2xl p-4"
    >
      <p class="text-3xl font-black text-[var(--color-text)]">
        {{ stat.value }}
      </p>
      <p class="mt-1 text-sm font-bold text-[var(--color-text-muted)]">
        {{ tr(stat.labelKey, stat.fallback) }}
      </p>
    </div>
  </div>
</template>
