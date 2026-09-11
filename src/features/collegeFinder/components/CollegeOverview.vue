<script setup>
import { formatSeats } from "../utils/formatters";

const props = defineProps({
  college: {
    type: Object,
    required: true,
  },
});

const { tr } = useAppI18n();

const facts = computed(() => [
  {
    label: tr("collegeFinder.detail.established", "Established"),
    value: props.college.establishedYear,
  },
  {
    label: tr("collegeFinder.detail.university", "University"),
    value: props.college.university,
  },
  {
    label: tr("collegeFinder.detail.collegeType", "College type"),
    value: props.college.collegeType,
  },
  {
    label: tr("collegeFinder.detail.totalSeats", "Total seats"),
    value: formatSeats(props.college.seats),
  },
  {
    label: tr("collegeFinder.detail.hospitalBeds", "Hospital beds"),
    value: props.college.hospitalBeds || tr("collegeFinder.detail.notApplicable", "Not applicable"),
  },
  {
    label: tr("collegeFinder.detail.recognition", "Recognition"),
    value: props.college.recognition.join(", "),
  },
]);
</script>

<template>
  <section class="surface-panel rounded-2xl p-5 sm:p-6">
    <h2 class="text-2xl font-black text-[var(--color-text)]">
      {{ tr("collegeFinder.detail.overview", "Overview") }}
    </h2>
    <p class="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
      {{ college.description }}
    </p>

    <div class="mt-6 grid gap-3 sm:grid-cols-2">
      <div
        v-for="fact in facts"
        :key="fact.label"
        class="rounded-2xl bg-[var(--color-surface-soft)] p-4"
      >
        <p class="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
          {{ fact.label }}
        </p>
        <p class="mt-2 text-sm font-black leading-6 text-[var(--color-text)]">
          {{ fact.value }}
        </p>
      </div>
    </div>
  </section>
</template>
