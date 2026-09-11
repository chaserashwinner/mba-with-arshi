<script setup>
import {
  ArrowRightIcon,
  BanknotesIcon,
  GlobeAsiaAustraliaIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/solid";
import CollegeBreadcrumbs from "@/src/features/collegeFinder/components/CollegeBreadcrumbs.vue";
import CollegeStats from "@/src/features/collegeFinder/components/CollegeStats.vue";
import AbroadCollegeCard from "../components/AbroadCollegeCard.vue";
import AbroadCountryGrid from "../components/AbroadCountryGrid.vue";
import AbroadCourseSwitcher from "../components/AbroadCourseSwitcher.vue";
import {
  ABROAD_HIGHLIGHTS,
  ABROAD_LANDING_FEATURES,
  ABROAD_LANDING_STATS,
} from "../constants/medicineAbroadConstants";
import { medicineAbroadService } from "../services/medicineAbroadService";
import { useCollegeSeo } from "@/src/features/collegeFinder/hooks/useCollegeSeo";
import { MEDICAL_COUNSELLOR_PROFILE_ANALYSIS_URL } from "@/constants/counsellor";

const { tr } = useAppI18n();
const route = useRoute();

const countries = shallowRef([]);
const topMbbs = shallowRef([]);
const topBds = shallowRef([]);

onMounted(async () => {
  const [countryResult, mbbsResult, bdsResult] = await Promise.allSettled([
    medicineAbroadService.getCountries(),
    medicineAbroadService.getFeaturedColleges({ course: "MBBS", limit: 3 }),
    medicineAbroadService.getFeaturedColleges({ course: "BDS", limit: 3 }),
  ]);

  if (countryResult.status === "fulfilled") countries.value = countryResult.value;
  if (mbbsResult.status === "fulfilled") topMbbs.value = mbbsResult.value;
  if (bdsResult.status === "fulfilled") topBds.value = bdsResult.value;
});

const iconMap = {
  shield: ShieldCheckIcon,
  currency: BanknotesIcon,
  users: UserGroupIcon,
};

const countryCards = computed(() => (countries.value || []).slice(0, 8));
const breadcrumbItems = computed(() => [
  {
    label: tr("medicineAbroad.landing.title", "Medicine Abroad Finder"),
  },
]);

useCollegeSeo({
  title: computed(() =>
    tr(
      "medicineAbroad.meta.landingTitle",
      "Medicine Abroad Finder for MBBS and BDS | StudentKhabri",
    ),
  ),
  description: computed(() =>
    tr(
      "medicineAbroad.meta.landingDescription",
      "Explore medicine abroad universities with filters for country, course, fees, hostel, scholarship, ranking, recognition, and Indian student support.",
    ),
  ),
  url: computed(() => `https://studentkhabri.com${route.path}`),
});
</script>

<template>
  <main class="min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
    <section class="border-b border-[var(--color-border)]" style="background: var(--gradient-hero);">
      <div class="sk-container py-8">
        <CollegeBreadcrumbs :items="breadcrumbItems" />
      </div>
      <div class="sk-container grid min-h-[calc(100vh-5rem)] items-center gap-10 pb-14 lg:grid-cols-[1.02fr_0.98fr]">
        <div>
          <p class="sk-pill w-max">
            <GlobeAsiaAustraliaIcon class="h-4 w-4 text-[var(--color-primary)]" />
            {{ tr("medicineAbroad.landing.eyebrow", "MBBS + BDS abroad research") }}
          </p>
          <h1 class="mt-6 max-w-4xl text-[2.55rem] font-black leading-[1.04] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
            {{ tr("medicineAbroad.landing.heroTitle", "Find trusted medicine universities abroad with the checks that matter.") }}
          </h1>
          <p class="mt-5 max-w-2xl text-base font-semibold leading-8 text-[var(--color-text-muted)]">
            {{ tr("medicineAbroad.landing.heroSubtitle", "Compare countries, courses, total fees, hostel support, scholarships, ranking, recognition, and Indian student readiness before shortlisting.") }}
          </p>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <NuxtLink to="/medicine-abroad/colleges" class="sk-button-primary">
              {{ tr("medicineAbroad.landing.browseAll", "Browse universities") }}
              <ArrowRightIcon class="h-4 w-4" />
            </NuxtLink>
            <NuxtLink to="/medicine-abroad/colleges/course/mbbs" class="sk-button-secondary">
              {{ tr("medicineAbroad.landing.exploreMbbs", "Explore MBBS abroad") }}
            </NuxtLink>
            <NuxtLink to="/medicine-abroad/colleges/course/bds" class="sk-button-secondary">
              {{ tr("medicineAbroad.landing.exploreBds", "Explore BDS abroad") }}
            </NuxtLink>
          </div>
          <div class="mt-7">
            <AbroadCourseSwitcher />
          </div>
        </div>

        <div class="surface-panel rounded-[1.75rem] p-4 sm:p-6">
          <div class="overflow-hidden rounded-[1.4rem] border border-[var(--color-border)] bg-[var(--color-surface-soft)]">
            <AssetRenderer
              src="/home/medical.png"
              :alt="tr('medicineAbroad.landing.heroImageAlt', 'Medical students')"
              type="banner"
              class="h-56 w-full object-cover sm:h-72"
              fetchpriority="high"
              priority
            />
            <div class="p-5">
              <p class="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-primary)]">
                {{ tr("medicineAbroad.landing.decisionPanelEyebrow", "Abroad decision stack") }}
              </p>
              <h2 class="mt-2 text-2xl font-black text-[var(--color-text)]">
                {{ tr("medicineAbroad.landing.decisionPanelTitle", "Compare recognition, cost, hostel, and support together.") }}
              </h2>
              <CollegeStats :stats="ABROAD_LANDING_STATS" class="mt-5" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="sk-section" style="background: var(--gradient-section);">
      <div class="sk-container">
        <div class="max-w-3xl">
          <p class="sk-eyebrow">
            {{ tr("medicineAbroad.landing.whyEyebrow", "Why use Medicine Abroad Finder") }}
          </p>
          <h2 class="sk-heading mt-4">
            {{ tr("medicineAbroad.landing.whyTitle", "A medical-abroad research layer built for Indian counselling decisions.") }}
          </h2>
        </div>
        <div class="mt-8 grid gap-5 md:grid-cols-3">
          <div
            v-for="feature in ABROAD_LANDING_FEATURES"
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
              {{ tr("medicineAbroad.landing.featuredCountries", "Featured countries") }}
            </p>
            <h2 class="sk-heading mt-4">
              {{ tr("medicineAbroad.landing.countryTitle", "Start with the countries that fit your budget and comfort.") }}
            </h2>
          </div>
          <NuxtLink to="/medicine-abroad/colleges" class="sk-button-secondary w-max">
            {{ tr("medicineAbroad.landing.viewAllCountries", "View all filters") }}
          </NuxtLink>
        </div>
        <AbroadCountryGrid class="mt-8" :countries="countryCards" />
      </div>
    </section>

    <section class="sk-section" style="background: var(--gradient-section);">
      <div class="sk-container">
        <div class="max-w-3xl">
          <p class="sk-eyebrow">
            {{ tr("medicineAbroad.landing.mbbsHighlights", "MBBS abroad highlights") }}
          </p>
          <h2 class="sk-heading mt-4">
            {{ tr("medicineAbroad.landing.highlightsTitle", "Keep eligibility, duration, hostel, and recognition visible.") }}
          </h2>
        </div>
        <div class="mt-8 grid gap-5 md:grid-cols-3">
          <div
            v-for="highlight in ABROAD_HIGHLIGHTS"
            :key="highlight.titleKey"
            class="sk-card rounded-2xl p-5"
          >
            <h3 class="text-xl font-black text-[var(--color-text)]">
              {{ tr(highlight.titleKey, highlight.title) }}
            </h3>
            <p class="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
              {{ tr(highlight.textKey, highlight.text) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="sk-section bg-[var(--color-bg)]">
      <div class="sk-container space-y-12">
        <div>
          <div class="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p class="sk-eyebrow">MBBS</p>
              <h2 class="sk-heading mt-4">
                {{ tr("medicineAbroad.landing.topMbbs", "Top MBBS abroad universities") }}
              </h2>
            </div>
            <NuxtLink to="/medicine-abroad/colleges/course/mbbs" class="sk-button-secondary w-max">
              {{ tr("medicineAbroad.landing.viewMbbs", "View MBBS abroad") }}
            </NuxtLink>
          </div>
          <div class="mt-8 grid gap-5 lg:grid-cols-3">
            <AbroadCollegeCard
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
                {{ tr("medicineAbroad.landing.topBds", "Top BDS abroad universities") }}
              </h2>
            </div>
            <NuxtLink to="/medicine-abroad/colleges/course/bds" class="sk-button-secondary w-max">
              {{ tr("medicineAbroad.landing.viewBds", "View BDS abroad") }}
            </NuxtLink>
          </div>
          <div class="mt-8 grid gap-5 lg:grid-cols-3">
            <AbroadCollegeCard
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
            {{ tr("medicineAbroad.landing.ctaEyebrow", "Ready to compare") }}
          </p>
          <h2 class="mx-auto mt-4 max-w-3xl text-3xl font-black text-white sm:text-5xl">
            {{ tr("medicineAbroad.landing.ctaTitle", "Shortlist abroad universities, then discuss the safer route with a counsellor.") }}
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
            {{ tr("medicineAbroad.landing.ctaText", "Use Medicine Abroad Finder for discovery, then validate recognition, documentation, budget, and travel fit before applying.") }}
          </p>
          <div class="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <NuxtLink to="/medicine-abroad/colleges" class="sk-button-primary">
              {{ tr("medicineAbroad.landing.browseAll", "Browse universities") }}
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
