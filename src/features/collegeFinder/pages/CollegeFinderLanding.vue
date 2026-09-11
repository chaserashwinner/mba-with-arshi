<script setup>
import { computed, onBeforeUnmount, onMounted, shallowRef } from "vue";
import {
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  BanknotesIcon,
  ChartBarSquareIcon,
  FunnelIcon,
  ShieldCheckIcon,
} from "@heroicons/vue/24/solid";
import CollegeCard from "../components/CollegeCard.vue";
import CollegeStats from "../components/CollegeStats.vue";
import CourseSwitcher from "../components/CourseSwitcher.vue";
import StateGrid from "../components/StateGrid.vue";
import {
  LANDING_FEATURES,
  LANDING_STATS,
} from "../constants/collegeFinderConstants";
import { collegeService } from "../services/collegeService";
import { useCollegeSeo } from "../hooks/useCollegeSeo";
import { MEDICAL_COUNSELLOR_PROFILE_ANALYSIS_URL } from "@/constants/counsellor";

const { tr } = useAppI18n();
const route = useRoute();

const collegeStates = shallowRef([]);
const topMbbs = shallowRef([]);
const topBds = shallowRef([]);
const landingAbortController = shallowRef(null);
const isMounted = shallowRef(false);

const getAbortOptions = () => {
  if (typeof AbortController === "undefined") return {};
  landingAbortController.value?.abort();
  landingAbortController.value = new AbortController();
  return { signal: landingAbortController.value.signal };
};

onMounted(async () => {
  isMounted.value = true;
  const options = getAbortOptions();

  try {
    const [statesRes, mbbsRes, bdsRes] = await Promise.allSettled([
      collegeService.getCollegeStates({}, options),
      collegeService.getFeaturedColleges({ course: "MBBS", limit: 3 }, options),
      collegeService.getFeaturedColleges({ course: "BDS", limit: 3 }, options),
    ]);

    if (!isMounted.value) return;

    if (statesRes.status === "fulfilled" && statesRes.value) {
      collegeStates.value = statesRes.value;
    }
    if (mbbsRes.status === "fulfilled" && mbbsRes.value) {
      topMbbs.value = mbbsRes.value;
    }
    if (bdsRes.status === "fulfilled" && bdsRes.value) {
      topBds.value = bdsRes.value;
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
  }
});

onBeforeUnmount(() => {
  isMounted.value = false;
  landingAbortController.value?.abort();
});

const iconMap = {
  chart: ChartBarSquareIcon,
  currency: BanknotesIcon,
  filter: FunnelIcon,
};

const stateCards = computed(() => {
  return (collegeStates.value || []).slice(0, 8).map((state) => ({
    name: state.name,
    count: state.count,
  }));
});

useCollegeSeo({
  title: computed(() =>
    tr(
      "collegeFinder.meta.landingTitle",
      "College Finder for MBBS and BDS | StudentKhabri",
    ),
  ),
  description: computed(() =>
    tr(
      "collegeFinder.meta.landingDescription",
      "Explore MBBS and BDS colleges with filters for state, ownership, counselling, seats, fees, and cutoff context.",
    ),
  ),
  url: computed(() => `https://studentkhabri.com${route.path}`),
});
</script>

<template>
  <main class="min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
    <section class="relative isolate overflow-hidden" style="background: var(--gradient-hero);">
      <div class="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-[rgba(var(--color-primary-rgb),0.22)] blur-3xl"></div>
      <div class="sk-container grid min-h-[calc(100vh-5rem)] items-center gap-10 py-14 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <p class="sk-pill w-max">
            <ShieldCheckIcon class="h-4 w-4 text-[var(--color-primary)]" />
            {{ tr("collegeFinder.landing.eyebrow", "MBBS + BDS counselling research") }}
          </p>
          <h1 class="mt-6 max-w-4xl text-[2.65rem] font-black leading-[1.03] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
            {{ tr("collegeFinder.landing.heroTitle", "Find the right medical college before counselling pressure starts.") }}
          </h1>
          <p class="mt-5 max-w-2xl text-base font-semibold leading-8 text-[var(--color-text-muted)]">
            {{ tr("collegeFinder.landing.heroSubtitle", "Compare government, private, deemed, AIQ, state quota, seats, fees, and cutoff signals for MBBS and BDS colleges across India.") }}
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink to="/colleges" class="sk-button-primary">
              {{ tr("collegeFinder.landing.browseAll", "Browse colleges") }}
              <ArrowRightIcon class="h-4 w-4" />
            </NuxtLink>
            <NuxtLink to="/colleges/course/mbbs" class="sk-button-secondary">
              {{ tr("collegeFinder.landing.exploreMbbs", "Explore MBBS") }}
            </NuxtLink>
            <NuxtLink to="/colleges/course/bds" class="sk-button-secondary">
              {{ tr("collegeFinder.landing.exploreBds", "Explore BDS") }}
            </NuxtLink>
          </div>
          <div class="mt-7">
            <CourseSwitcher />
          </div>
        </div>

        <div class="surface-panel rounded-[1.75rem] p-4 sm:p-6">
          <div class="rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  {{ tr("collegeFinder.landing.smartFilters", "Smart filters") }}
                </p>
                <h2 class="mt-2 text-2xl font-black text-[var(--color-text)]">
                  {{ tr("collegeFinder.landing.filterShowcaseTitle", "Shortlist by what actually matters") }}
                </h2>
              </div>
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white" style="background-image: var(--gradient-primary);">
                <AdjustmentsHorizontalIcon class="h-6 w-6" />
              </div>
            </div>

            <div class="mt-5 grid gap-3">
              <div class="rounded-2xl bg-[var(--color-surface)] p-4">
                <div class="mb-3 flex items-center justify-between text-sm font-black">
                  <span>{{ tr("collegeFinder.filters.courseType", "Course type") }}</span>
                  <span class="text-[var(--color-primary)]">MBBS + BDS</span>
                </div>
                <div class="h-2 overflow-hidden rounded-full bg-[var(--color-surface-strong)]">
                  <div class="h-full w-4/5 rounded-full" style="background-image: var(--gradient-primary);"></div>
                </div>
              </div>
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl bg-[var(--color-surface)] p-4">
                  <p class="text-xs font-bold text-[var(--color-text-soft)]">
                    {{ tr("collegeFinder.filters.aiqEligibility", "AIQ eligibility") }}
                  </p>
                  <p class="mt-2 text-xl font-black text-[var(--color-text)]">
                    {{ tr("collegeFinder.filters.yes", "Yes") }}
                  </p>
                </div>
                <div class="rounded-2xl bg-[var(--color-surface)] p-4">
                  <p class="text-xs font-bold text-[var(--color-text-soft)]">
                    {{ tr("collegeFinder.filters.feeRange", "Fee range") }}
                  </p>
                  <p class="mt-2 text-xl font-black text-[var(--color-text)]">
                    {{ tr("collegeFinder.filters.underOneLakh", "Under 1 lakh") }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <CollegeStats :stats="LANDING_STATS" class="mt-4" />
        </div>
      </div>
    </section>

    <section class="sk-section" style="background: var(--gradient-section);">
      <div class="sk-container">
        <div class="max-w-3xl">
          <p class="sk-eyebrow">
            {{ tr("collegeFinder.landing.whyEyebrow", "Why use College Finder") }}
          </p>
          <h2 class="sk-heading mt-4">
            {{ tr("collegeFinder.landing.whyTitle", "A research layer made for medical counselling choices.") }}
          </h2>
        </div>
        <div class="mt-8 grid gap-5 md:grid-cols-3">
          <div
            v-for="feature in LANDING_FEATURES"
            :key="feature.titleKey"
            class="sk-card sk-hover-lift rounded-2xl p-5"
          >
            <div class="grid h-12 w-12 place-items-center rounded-2xl text-white" style="background-image: var(--gradient-primary);">
              <component :is="iconMap[feature.icon]" class="h-6 w-6" />
            </div>
            <h3 class="mt-5 text-xl font-black text-[var(--color-text)]">
              {{ tr(feature.titleKey, feature.title) }}
            </h3>
            <p class="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
              {{ tr(feature.textKey, feature.text) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="sk-section bg-[var(--color-bg)]">
      <div class="sk-container">
        <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p class="sk-eyebrow">
              {{ tr("collegeFinder.landing.exploreByState", "Explore by State") }}
            </p>
            <h2 class="sk-heading mt-4">
              {{ tr("collegeFinder.landing.stateTitle", "Start with the states you are eligible for.") }}
            </h2>
          </div>
          <NuxtLink to="/colleges" class="sk-button-secondary w-max">
            {{ tr("collegeFinder.landing.viewAllStates", "View all filters") }}
          </NuxtLink>
        </div>
        <StateGrid class="mt-8" :states="stateCards" />
      </div>
    </section>

    <section class="sk-section" style="background: var(--gradient-section);">
      <div class="sk-container space-y-12">
        <div>
          <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p class="sk-eyebrow">MBBS</p>
              <h2 class="sk-heading mt-4">
                {{ tr("collegeFinder.landing.topMbbs", "Top MBBS colleges") }}
              </h2>
            </div>
            <NuxtLink to="/colleges/course/mbbs" class="sk-button-secondary w-max">
              {{ tr("collegeFinder.landing.viewMbbs", "View MBBS colleges") }}
            </NuxtLink>
          </div>
          <div class="mt-8 grid gap-5 lg:grid-cols-3">
            <CollegeCard
              v-for="college in topMbbs || []"
              :key="college.id"
              :college="college"
              compact
            />
          </div>
        </div>

        <div>
          <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p class="sk-eyebrow">BDS</p>
              <h2 class="sk-heading mt-4">
                {{ tr("collegeFinder.landing.topBds", "Top BDS colleges") }}
              </h2>
            </div>
            <NuxtLink to="/colleges/course/bds" class="sk-button-secondary w-max">
              {{ tr("collegeFinder.landing.viewBds", "View BDS colleges") }}
            </NuxtLink>
          </div>
          <div class="mt-8 grid gap-5 lg:grid-cols-3">
            <CollegeCard
              v-for="college in topBds || []"
              :key="college.id"
              :college="college"
              compact
            />
          </div>
        </div>
      </div>
    </section>

    <section class="sk-section bg-[var(--color-bg)]">
      <div class="sk-container">
        <div class="sk-theme-dark-panel rounded-[1.75rem] p-6 text-center sm:p-10">
          <p class="text-xs font-black uppercase tracking-[0.24em] text-white/70">
            {{ tr("collegeFinder.landing.ctaEyebrow", "Ready to shortlist") }}
          </p>
          <h2 class="mx-auto mt-4 max-w-3xl text-3xl font-black text-white sm:text-5xl">
            {{ tr("collegeFinder.landing.ctaTitle", "Compare colleges, then move into predictors and preference planning.") }}
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            {{ tr("collegeFinder.landing.ctaText", "Use College Finder as the browsing layer before rank-based tools and expert counselling.") }}
          </p>
          <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <NuxtLink to="/colleges" class="sk-button-primary">
              {{ tr("collegeFinder.landing.browseAll", "Browse colleges") }}
            </NuxtLink>
            <a
              :href="MEDICAL_COUNSELLOR_PROFILE_ANALYSIS_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="sk-button-secondary border-white/15 bg-white/10 text-white"
            >
              {{ tr("home.finalCta.talkToCounsellor", "Talk to Counsellor") }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
