<script setup>
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BanknotesIcon,
  BookmarkIcon,
  MapPinIcon,
  StarIcon,
  TrophyIcon,
} from "@heroicons/vue/24/solid";
import CollegeBadge from "./CollegeBadge.vue";
import {
  formatFeeRange,
  formatSeats,
  getCollegeDetailRoute,
  getCoursesLabel,
  getPrimaryCourse,
} from "../utils/formatters";

const props = defineProps({
  college: {
    type: Object,
    required: true,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

const { tr } = useAppI18n();

const detailRoute = computed(() => getCollegeDetailRoute(props.college));
const primaryCourse = computed(() => getPrimaryCourse(props.college));
const totalSeats = computed(() =>
  formatSeats(props.college.seats, primaryCourse.value),
);
const ownershipTone = computed(() =>
  props.college.ownership === "Government" ? "success" : "warning",
);
const rankLabel = computed(
  () => props.college.ranking?.studentKhabri || props.college.ranking?.nirf || "N/A",
);
</script>

<template>
  <article class="sk-card group overflow-hidden rounded-2xl">
    <NuxtLink :to="detailRoute" class="block">
      <div class="relative h-44 overflow-hidden">
        <AssetRenderer
          :src="college.thumbnail"
          :alt="college.name"
          type="thumbnail"
          class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          fetchpriority="low"
          sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent"></div>
        <div class="absolute left-4 top-4 flex flex-wrap gap-2">
          <CollegeBadge
            v-for="course in college.courseTypes"
            :key="course"
            :label="course"
            tone="primary"
          />
        </div>
        <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 text-white">
          <div class="min-w-0">
            <p class="truncate text-xs font-bold text-white/75">
              {{ college.shortName }}
            </p>
            <h3 class="line-clamp-2 text-lg font-black leading-tight">
              {{ college.name }}
            </h3>
          </div>
          <div class="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-sm font-black backdrop-blur">
            <StarIcon class="h-4 w-4 text-amber-300" />
            {{ college.rating }}
          </div>
        </div>
      </div>
    </NuxtLink>

    <div class="space-y-4 p-4 sm:p-5">
      <div class="flex flex-wrap items-center gap-2">
        <CollegeBadge :label="college.ownership" :tone="ownershipTone" />
        <CollegeBadge
          v-if="college.aiqEligible"
          :label="tr('collegeFinder.card.aiq', 'AIQ')"
          tone="success"
        />
      </div>

      <p class="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)]">
        <MapPinIcon class="h-4 w-4 text-[var(--color-primary)]" />
        {{ college.city }}, {{ college.state }}
      </p>

      <div class="grid grid-cols-3 gap-2">
        <div class="rounded-2xl bg-[var(--color-surface-soft)] p-3">
          <AcademicCapIcon class="h-4 w-4 text-[var(--color-primary)]" />
          <p class="mt-2 text-xs font-bold text-[var(--color-text-soft)]">
            {{ tr("collegeFinder.card.seats", "Seats") }}
          </p>
          <p class="text-sm font-black text-[var(--color-text)]">
            {{ totalSeats }}
          </p>
        </div>
        <div class="rounded-2xl bg-[var(--color-surface-soft)] p-3">
          <BanknotesIcon class="h-4 w-4 text-[var(--color-primary)]" />
          <p class="mt-2 text-xs font-bold text-[var(--color-text-soft)]">
            {{ tr("collegeFinder.card.fees", "Fees") }}
          </p>
          <p class="truncate text-sm font-black text-[var(--color-text)]">
            {{ formatFeeRange(college.fees) }}
          </p>
        </div>
        <div class="rounded-2xl bg-[var(--color-surface-soft)] p-3">
          <TrophyIcon class="h-4 w-4 text-[var(--color-primary)]" />
          <p class="mt-2 text-xs font-bold text-[var(--color-text-soft)]">
            {{ tr("collegeFinder.card.rank", "Rank") }}
          </p>
          <p class="text-sm font-black text-[var(--color-text)]">
            {{ rankLabel === "N/A" ? rankLabel : `#${rankLabel}` }}
          </p>
        </div>
      </div>

      <p v-if="!compact" class="line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
        {{ college.description || college.summary }}
      </p>

      <div class="flex flex-col gap-2 sm:flex-row">
        <NuxtLink :to="detailRoute" class="sk-button-primary flex-1 rounded-2xl">
          {{ tr("collegeFinder.card.viewDetails", "View details") }}
          <ArrowRightIcon class="h-4 w-4" />
        </NuxtLink>
        <button
          type="button"
          class="sk-button-secondary rounded-2xl px-4"
          :title="tr('collegeFinder.card.savePlaceholder', 'Save college')"
        >
          <BookmarkIcon class="h-4 w-4" />
          <span class="sm:hidden">
            {{ tr("collegeFinder.card.save", "Save") }}
          </span>
        </button>
      </div>

      <p class="text-xs font-bold text-[var(--color-text-soft)]">
        {{ tr("collegeFinder.card.courses", "Courses") }}:
        <span class="text-[var(--color-text)]">{{ getCoursesLabel(college) }}</span>
      </p>
    </div>
  </article>
</template>
