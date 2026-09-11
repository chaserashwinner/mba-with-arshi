<script setup>
import { COLLEGE_COURSES } from "../constants/collegeFinderConstants";

defineProps({
  activeCourse: {
    type: String,
    default: "",
  },
});

const { tr } = useAppI18n();
</script>

<template>
  <div class="inline-flex rounded-full border p-1" style="border-color: var(--color-border); background: var(--color-surface);">
    <NuxtLink
      v-for="course in COLLEGE_COURSES"
      :key="course.value"
      :to="`/colleges/course/${course.value.toLowerCase()}`"
      class="sk-pressable rounded-full px-4 py-2 text-sm font-black"
      :class="activeCourse === course.value ? 'sk-chip-active' : 'text-[var(--color-text-muted)]'"
    >
      {{ tr(course.labelKey, course.fallback) }}
    </NuxtLink>
  </div>
</template>
