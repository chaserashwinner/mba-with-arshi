<script setup>
import { MapPinIcon } from "@heroicons/vue/24/solid";
import { createSlug } from "../utils/formatters";

const props = defineProps({
  states: {
    type: Array,
    default: () => [],
  },
  course: {
    type: String,
    default: "",
  },
});

const { tr } = useAppI18n();

const stateLink = (state) => {
  const slug = createSlug(state.name || state);
  if (props.course) return `/colleges/course/${props.course.toLowerCase()}/state/${slug}`;
  return `/colleges/state/${slug}`;
};
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <NuxtLink
      v-for="state in states"
      :key="state.name || state"
      :to="stateLink(state)"
      class="sk-card sk-hover-lift flex items-center justify-between gap-4 rounded-2xl p-4"
    >
      <div class="min-w-0">
        <p class="truncate text-base font-black text-[var(--color-text)]">
          {{ state.name || state }}
        </p>
        <p
          v-if="state.count !== undefined"
          class="mt-1 text-xs font-bold text-[var(--color-text-soft)]"
        >
          {{ tr("collegeFinder.stateGrid.count", "{count} colleges", { count: state.count }) }}
        </p>
      </div>
      <div class="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-white" style="background-image: var(--gradient-primary);">
        <MapPinIcon class="h-5 w-5" />
      </div>
    </NuxtLink>
  </div>
</template>
