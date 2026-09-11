<script setup>
import { ABROAD_COURSES } from "../constants/medicineAbroadConstants";
import { getCourseRoute, normalizeAbroadCourse } from "../utils/formatters";

const props = defineProps({
  activeCourse: {
    type: String,
    default: "",
  },
});

const { tr } = useAppI18n();
const active = computed(() => normalizeAbroadCourse(props.activeCourse));
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <NuxtLink
      to="/medicine-abroad/colleges"
      class="rounded-2xl border px-4 py-2 text-sm font-black transition"
      :class="!active ? 'sk-chip-active' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]'"
    >
      {{ tr("medicineAbroad.courses.all", "All") }}
    </NuxtLink>
    <NuxtLink
      v-for="course in ABROAD_COURSES"
      :key="course.value"
      :to="getCourseRoute(course.value)"
      class="rounded-2xl border px-4 py-2 text-sm font-black transition"
      :class="active === course.value ? 'sk-chip-active' : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]'"
    >
      {{ tr(course.labelKey, course.fallback) }}
    </NuxtLink>
  </div>
</template>
