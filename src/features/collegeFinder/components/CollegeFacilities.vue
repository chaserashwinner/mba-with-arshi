<script setup>
import { CheckCircleIcon } from "@heroicons/vue/24/solid";

defineProps({
  facilities: {
    type: Array,
    default: () => [],
  },
  recognition: {
    type: Array,
    default: () => [],
  },
});

const { tr } = useAppI18n();
</script>

<template>
  <section class="surface-panel rounded-2xl p-5 sm:p-6">
    <h2 class="text-2xl font-black text-[var(--color-text)]">
      {{ tr("collegeFinder.detail.facilities", "Facilities") }}
    </h2>
    <div class="mt-5 grid gap-3 sm:grid-cols-2">
      <div
        v-for="facility in facilities"
        :key="facility"
        class="flex items-center gap-3 rounded-2xl bg-[var(--color-surface-soft)] p-3 text-sm font-bold text-[var(--color-text-muted)]"
      >
        <CheckCircleIcon class="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
        <span>{{ facility }}</span>
      </div>
    </div>

    <h3 class="mt-6 text-lg font-black text-[var(--color-text)]">
      {{ tr("collegeFinder.detail.recognition", "Recognition") }}
    </h3>
    <div class="mt-3 flex flex-wrap gap-2">
      <span
        v-for="item in recognition"
        :key="item"
        class="sk-pill"
      >
        {{ item }}
      </span>
    </div>
  </section>
</template>
