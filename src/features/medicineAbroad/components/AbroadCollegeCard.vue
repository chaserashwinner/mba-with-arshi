<script setup>
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BanknotesIcon,
  BookmarkIcon,
  BuildingLibraryIcon,
  GlobeAltIcon,
  HomeModernIcon,
  MapPinIcon,
  TrophyIcon,
} from "@heroicons/vue/24/solid";
import CollegeBadge from "@/src/features/collegeFinder/components/CollegeBadge.vue";
import {
  formatFeeRange,
  getAbroadCollegeDetailRoute,
  getCoursesLabel,
  getRankingLabel,
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

const detailRoute = computed(() => getAbroadCollegeDetailRoute(props.college));
const universityTone = computed(() =>
  props.college.universityType?.toLowerCase().includes("government") ? "success" : "neutral",
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
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/78 via-slate-950/16 to-transparent"></div>
        <div class="absolute left-4 top-4 flex flex-wrap gap-2">
          <CollegeBadge
            v-for="course in college.courseTypes"
            :key="course"
            :label="course"
            tone="primary"
          />
          <CollegeBadge
            v-if="college.scholarshipAvailable"
            :label="tr('medicineAbroad.card.scholarship', 'Scholarship')"
            tone="success"
          />
        </div>
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <p class="truncate text-xs font-bold text-white/75">
            {{ college.shortName }}
          </p>
          <h3 class="line-clamp-2 text-lg font-black leading-tight">
            {{ college.name }}
          </h3>
        </div>
      </div>
    </NuxtLink>

    <div class="space-y-4 p-4 sm:p-5">
      <div class="flex flex-wrap items-center gap-2">
        <CollegeBadge :label="college.country" tone="primary" />
        <CollegeBadge
          v-if="college.universityType"
          :label="college.universityType"
          :tone="universityTone"
        />
        <CollegeBadge
          v-if="college.medium"
          :label="college.medium"
          tone="neutral"
        />
      </div>

      <p class="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)]">
        <MapPinIcon class="h-4 w-4 text-[var(--color-primary)]" />
        <span>{{ [college.city, college.country].filter(Boolean).join(", ") }}</span>
      </p>

      <div class="grid grid-cols-3 gap-2">
        <div class="rounded-2xl bg-[var(--color-surface-soft)] p-3">
          <BanknotesIcon class="h-4 w-4 text-[var(--color-primary)]" />
          <p class="mt-2 text-xs font-bold text-[var(--color-text-soft)]">
            {{ tr("medicineAbroad.card.fees", "Fees") }}
          </p>
          <p class="truncate text-sm font-black text-[var(--color-text)]">
            {{ formatFeeRange(college.fees) }}
          </p>
        </div>
        <div class="rounded-2xl bg-[var(--color-surface-soft)] p-3">
          <HomeModernIcon class="h-4 w-4 text-[var(--color-primary)]" />
          <p class="mt-2 text-xs font-bold text-[var(--color-text-soft)]">
            {{ tr("medicineAbroad.card.hostel", "Hostel") }}
          </p>
          <p class="text-sm font-black text-[var(--color-text)]">
            {{ college.hostel?.available ? tr("medicineAbroad.filters.yes", "Yes") : tr("medicineAbroad.filters.no", "No") }}
          </p>
        </div>
        <div class="rounded-2xl bg-[var(--color-surface-soft)] p-3">
          <TrophyIcon class="h-4 w-4 text-[var(--color-primary)]" />
          <p class="mt-2 text-xs font-bold text-[var(--color-text-soft)]">
            {{ tr("medicineAbroad.card.rank", "Rank") }}
          </p>
          <p class="text-sm font-black text-[var(--color-text)]">
            {{ getRankingLabel(college) }}
          </p>
        </div>
      </div>

      <p v-if="!compact" class="line-clamp-2 text-sm leading-6 text-[var(--color-text-muted)]">
        {{ college.description || college.summary }}
      </p>

      <div class="grid gap-2 text-xs font-bold text-[var(--color-text-soft)] sm:grid-cols-2">
        <p class="inline-flex items-center gap-1.5">
          <AcademicCapIcon class="h-4 w-4 text-[var(--color-primary)]" />
          <span class="truncate">{{ getCoursesLabel(college) }}</span>
        </p>
        <p class="inline-flex items-center gap-1.5">
          <BuildingLibraryIcon class="h-4 w-4 text-[var(--color-primary)]" />
          <span class="truncate">{{ college.duration || tr("medicineAbroad.card.durationNA", "Duration N/A") }}</span>
        </p>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row">
        <NuxtLink :to="detailRoute" class="sk-button-primary flex-1 rounded-2xl">
          {{ tr("medicineAbroad.card.viewDetails", "View details") }}
          <ArrowRightIcon class="h-4 w-4" />
        </NuxtLink>
        <button
          type="button"
          class="sk-button-secondary rounded-2xl px-4"
          :title="tr('medicineAbroad.card.savePlaceholder', 'Save university')"
        >
          <BookmarkIcon class="h-4 w-4" />
          <span class="sm:hidden">
            {{ tr("medicineAbroad.card.save", "Save") }}
          </span>
        </button>
      </div>

      <p class="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-soft)]">
        <GlobeAltIcon class="h-4 w-4 text-[var(--color-primary)]" />
        <span>{{ tr("medicineAbroad.card.recognition", "Recognition") }}:</span>
        <span class="truncate text-[var(--color-text)]">
          {{ college.recognition?.slice(0, 2).join(", ") || "N/A" }}
        </span>
      </p>
    </div>
  </article>
</template>
