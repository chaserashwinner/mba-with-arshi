<script setup>
import { ChevronRightIcon, HomeIcon } from "@heroicons/vue/24/solid";

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const { tr } = useAppI18n();
</script>

<template>
  <nav class="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--color-text-soft)]">
    <NuxtLink to="/" class="inline-flex items-center gap-1 hover:text-[var(--color-primary)]">
      <HomeIcon class="h-4 w-4" />
      {{ tr("nav.home", "Home") }}
    </NuxtLink>
    <template v-for="item in items" :key="item.label">
      <ChevronRightIcon class="h-3.5 w-3.5 opacity-60" />
      <NuxtLink
        v-if="item.to"
        :to="item.to"
        class="hover:text-[var(--color-primary)]"
      >
        {{ item.label }}
      </NuxtLink>
      <span v-else class="text-[var(--color-text)]">
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>
