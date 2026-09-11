<script setup>
import { FunnelIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import {
  ABROAD_COURSES,
  ABROAD_FEE_RANGES,
  ABROAD_RANKING_RANGES,
} from "../constants/medicineAbroadConstants";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  options: {
    type: Object,
    default: () => ({
      countries: [],
      courses: [],
    }),
  },
  activeCount: {
    type: Number,
    default: 0,
  },
  resultCount: {
    type: Number,
    default: 0,
  },
  forcedCourse: {
    type: String,
    default: "",
  },
  forcedCountry: {
    type: String,
    default: "",
  },
  showClose: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["set", "toggle", "clear", "close"]);
const { tr } = useAppI18n();

const isChecked = (key, value) => (props.modelValue[key] || []).includes(value);
const countryValues = computed(() =>
  (props.options.countries || []).map((country) =>
    typeof country === "string"
      ? { value: country, label: country }
      : { value: country.name || country.country, label: country.name || country.country },
  ).filter((country) => country.value),
);

const filterSections = computed(() => [
  {
    key: "courseTypes",
    title: tr("medicineAbroad.filters.courseType", "Course type"),
    values: ABROAD_COURSES.map((course) => ({
      value: course.value,
      label: tr(course.labelKey, course.fallback),
    })),
    hidden: Boolean(props.forcedCourse),
  },
  {
    key: "countries",
    title: tr("medicineAbroad.filters.country", "Country"),
    values: countryValues.value,
    hidden: Boolean(props.forcedCountry),
  },
]);
</script>

<template>
  <aside class="surface-panel sticky top-24 flex max-h-[calc(100vh-7.5rem)] flex-col overflow-hidden rounded-2xl">
    <div class="flex-shrink-0 flex items-center justify-between gap-3 border-b border-[var(--color-border)] p-4">
      <div>
        <div class="flex items-center gap-2">
          <FunnelIcon class="h-5 w-5 text-[var(--color-primary)]" />
          <h2 class="text-lg font-black text-[var(--color-text)]">
            {{ tr("medicineAbroad.filters.title", "Filters") }}
          </h2>
        </div>
        <p class="mt-1 text-xs font-bold text-[var(--color-text-soft)]">
          {{ tr("medicineAbroad.filters.resultCount", "{count} results", { count: resultCount }) }}
        </p>
      </div>
      <button
        v-if="showClose"
        type="button"
        class="grid h-9 w-9 place-items-center rounded-xl text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)]"
        :aria-label="tr('close', 'Close')"
        @click="emit('close')"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>

    <div class="flex-grow space-y-6 overflow-y-auto p-4 pb-6">
      <section
        v-for="section in filterSections.filter((item) => !item.hidden)"
        :key="section.key"
      >
        <h3 class="text-sm font-black text-[var(--color-text)]">
          {{ section.title }}
        </h3>
        <div class="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
          <label
            v-for="item in section.values"
            :key="item.value"
            class="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-1.5 text-sm font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)]"
          >
            <input
              type="checkbox"
              class="mt-0.5 h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
              :checked="isChecked(section.key, item.value)"
              @change="emit('toggle', section.key, item.value)"
            />
            <span>{{ item.label }}</span>
          </label>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-black text-[var(--color-text)]">
          {{ tr("medicineAbroad.filters.feeRange", "Fee range") }}
        </h3>
        <div class="mt-3 grid gap-2">
          <label
            v-for="range in ABROAD_FEE_RANGES"
            :key="range.value"
            class="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)]"
          >
            <input
              type="radio"
              name="abroad-fee-range"
              class="h-4 w-4 accent-[var(--color-primary)]"
              :checked="modelValue.feeRange === range.value"
              @change="emit('set', 'feeRange', range.value)"
            />
            <span>{{ tr(range.labelKey, range.fallback) }}</span>
          </label>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-black text-[var(--color-text)]">
          {{ tr("medicineAbroad.filters.ranking", "Ranking") }}
        </h3>
        <div class="mt-3 grid gap-2">
          <label
            v-for="range in ABROAD_RANKING_RANGES"
            :key="range.value"
            class="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-1.5 text-sm font-bold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)]"
          >
            <input
              type="radio"
              name="abroad-ranking-range"
              class="h-4 w-4 accent-[var(--color-primary)]"
              :checked="modelValue.rankingRange === range.value"
              @change="emit('set', 'rankingRange', range.value)"
            />
            <span>{{ tr(range.labelKey, range.fallback) }}</span>
          </label>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-black text-[var(--color-text)]">
          {{ tr("medicineAbroad.filters.hostel", "Hostel") }}
        </h3>
        <div class="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            class="rounded-xl border px-3 py-2 text-xs font-black"
            :class="modelValue.hostel === null ? 'sk-chip-active border-transparent' : 'text-[var(--color-text-muted)]'"
            @click="emit('set', 'hostel', null)"
          >
            {{ tr("medicineAbroad.filters.all", "All") }}
          </button>
          <button
            type="button"
            class="rounded-xl border px-3 py-2 text-xs font-black"
            :class="modelValue.hostel === true ? 'sk-chip-active border-transparent' : 'text-[var(--color-text-muted)]'"
            @click="emit('set', 'hostel', true)"
          >
            {{ tr("medicineAbroad.filters.yes", "Yes") }}
          </button>
          <button
            type="button"
            class="rounded-xl border px-3 py-2 text-xs font-black"
            :class="modelValue.hostel === false ? 'sk-chip-active border-transparent' : 'text-[var(--color-text-muted)]'"
            @click="emit('set', 'hostel', false)"
          >
            {{ tr("medicineAbroad.filters.no", "No") }}
          </button>
        </div>
      </section>

      <section>
        <h3 class="text-sm font-black text-[var(--color-text)]">
          {{ tr("medicineAbroad.filters.scholarship", "Scholarship") }}
        </h3>
        <div class="mt-3 grid grid-cols-3 gap-2">
          <button
            type="button"
            class="rounded-xl border px-3 py-2 text-xs font-black"
            :class="modelValue.scholarship === null ? 'sk-chip-active border-transparent' : 'text-[var(--color-text-muted)]'"
            @click="emit('set', 'scholarship', null)"
          >
            {{ tr("medicineAbroad.filters.all", "All") }}
          </button>
          <button
            type="button"
            class="rounded-xl border px-3 py-2 text-xs font-black"
            :class="modelValue.scholarship === true ? 'sk-chip-active border-transparent' : 'text-[var(--color-text-muted)]'"
            @click="emit('set', 'scholarship', true)"
          >
            {{ tr("medicineAbroad.filters.yes", "Yes") }}
          </button>
          <button
            type="button"
            class="rounded-xl border px-3 py-2 text-xs font-black"
            :class="modelValue.scholarship === false ? 'sk-chip-active border-transparent' : 'text-[var(--color-text-muted)]'"
            @click="emit('set', 'scholarship', false)"
          >
            {{ tr("medicineAbroad.filters.no", "No") }}
          </button>
        </div>
      </section>
    </div>

    <div class="flex-shrink-0 border-t border-[var(--color-border)] p-4">
      <button type="button" class="sk-button-secondary w-full rounded-2xl" @click="emit('clear')">
        {{ tr("medicineAbroad.filters.clearAll", "Clear filters") }}
        <span v-if="activeCount">({{ activeCount }})</span>
      </button>
    </div>
  </aside>
</template>
