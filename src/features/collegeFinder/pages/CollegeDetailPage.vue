<script setup>
import { ArrowTopRightOnSquareIcon, CheckCircleIcon, ClipboardDocumentListIcon } from "@heroicons/vue/24/solid";
import CollegeBreadcrumbs from "../components/CollegeBreadcrumbs.vue";
import CollegeCutoffCard from "../components/CollegeCutoffCard.vue";
import CollegeCutoffSummary from "../components/CollegeCutoffSummary.vue";
import CollegeDisclaimer from "../components/CollegeDisclaimer.jsx";
import CollegeEmptyState from "../components/CollegeEmptyState.vue";
import CollegeFacilities from "../components/CollegeFacilities.vue";
import CollegeFeeCard from "../components/CollegeFeeCard.vue";
import CollegeHero from "../components/CollegeHero.vue";
import CollegeOverview from "../components/CollegeOverview.vue";
import CollegeTabs from "../components/CollegeTabs.vue";
import { DETAIL_TABS } from "../constants/collegeFinderConstants";
import { collegeService } from "../services/collegeService";
import { useCollegeSeo } from "../hooks/useCollegeSeo";
import { formatSeats, getCoursesLabel } from "../utils/formatters";
import { normalizeExternalUrl } from "../utils/normalizeExternalUrl";
import { MEDICAL_COUNSELLOR_PROFILE_ANALYSIS_URL } from "@/constants/counsellor";
import { useCounsellorQueryStore } from "@/stores/useCounsellorQueryStore";
import { MEDICAL_COURSE_ID } from "@/utils/courseMeta";

const { tr } = useAppI18n();
const counsellorQueryStore = useCounsellorQueryStore();
const authStore = useAuthStore();

const trackEvent = (name, params) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  } else {
    console.debug(`[Analytics Event Debug] ${name}:`, params);
  }
};

const handleTalkToCounsellor = () => {
  trackEvent("talk_to_counsellor_clicked", {
    entity_id: college.value?.id || college.value?._id || "",
    entity_name: college.value?.name || "",
    entity_type: "college",
    course: "medical",
    source: "Talk To Counsellor",
  });

  const metadata = {
    entityId: college.value?.id || college.value?._id || "",
    entityName: college.value?.name || "",
    entityType: "college",
    courseId: MEDICAL_COURSE_ID,
    courseName: "medical",
    source: "college_finder",
  };

  counsellorQueryStore.metadata = metadata;
  counsellorQueryStore.setPendingAction(true);

  if (!authStore.loggedIn) {
    authStore.handleForm(true);
  }
};
const route = useRoute();
const college = ref(null);
const pending = ref(true);
const loadError = ref(false);
const activeTab = ref("overview");
const shareMessage = ref("");
const detailAbortController = shallowRef(null);
let detailRequestVersion = 0;

const CollegeGallery = defineAsyncComponent(() =>
  import("../components/CollegeGallery.vue").then(m => (m ? m.default || m : undefined)),
);

const getDetailAbortOptions = () => {
  if (typeof AbortController === "undefined") return {};

  detailAbortController.value?.abort();
  detailAbortController.value = new AbortController();

  return { signal: detailAbortController.value.signal };
};

const loadCollege = async () => {
  const requestVersion = ++detailRequestVersion;
  pending.value = true;
  loadError.value = false;

  try {
    const nextCollege = await collegeService.getCollegeById(
      route.params.id,
      getDetailAbortOptions(),
    );

    if (requestVersion === detailRequestVersion) college.value = nextCollege;
  } catch (error) {
    if (error?.name === "AbortError") return;
    college.value = null;
    loadError.value = true;
  } finally {
    if (requestVersion === detailRequestVersion) pending.value = false;
  }
};

watch(() => route.params.id, loadCollege, { immediate: true });
onBeforeUnmount(() => {
  detailAbortController.value?.abort();
});

const breadcrumbItems = computed(() => [
  {
    label: tr("collegeFinder.landing.title", "College Finder"),
    to: "/college-finder",
  },
  {
    label: tr("collegeFinder.listing.title", "Find medical colleges"),
    to: "/colleges",
  },
  {
    label: college.value?.shortName || tr("loading", "Loading..."),
  },
]);

const seoTitle = computed(() =>
  college.value
    ? `${college.value.name} Fees, Seats, Cutoff | StudentKhabri`
    : "College Details | StudentKhabri",
);
const seoDescription = computed(() =>
  college.value
    ? `${college.value.shortName} profile with courses, fee structure, seats, cutoff summary, facilities, recognition, counselling eligibility, and contact details.`
    : "College profile with courses, fee structure, seats, cutoffs, facilities, and counselling eligibility.",
);

useCollegeSeo({
  title: seoTitle,
  description: seoDescription,
  image: computed(() => college.value?.banner),
  url: computed(() => `https://studentkhabri.com${route.path}`),
});

const quickFacts = computed(() => {
  if (!college.value) return [];

  return [
    {
      label: tr("collegeFinder.detail.coursesOffered", "Courses offered"),
      value: getCoursesLabel(college.value),
    },
    {
      label: tr("collegeFinder.detail.totalSeats", "Total seats"),
      value: formatSeats(college.value.seats),
    },
    {
      label: tr("collegeFinder.detail.ownership", "Ownership"),
      value: college.value.ownership,
    },
  ];
});

const counsellingItems = computed(() => {
  if (!college.value) return [];

  return [
    {
      label: tr("collegeFinder.detail.aiqQuota", "AIQ"),
      available: college.value.aiqEligible,
    },
    {
      label: tr("collegeFinder.detail.stateQuota", "State quota"),
      available: college.value.stateQuota,
    },
    {
      label: tr("collegeFinder.detail.managementQuota", "Management quota"),
      available: college.value.managementQuota,
    },
    {
      label: tr("collegeFinder.detail.nriQuota", "NRI quota"),
      available: college.value.nriQuota,
    },
  ];
});

const websiteUrl = computed(() => normalizeExternalUrl(college.value?.website));

const generatedCutoffSummaryKeys = [
  "allIndia",
  "all_india",
  "allIndiaQuota",
  "aiq",
  "state",
  "stateQuota",
  "state_quota",
];

const hasGeneratedCutoffSummary = computed(() => {
  const summary = college.value?.cutoffSummary;

  return Boolean(
    summary &&
      !Array.isArray(summary) &&
      typeof summary === "object" &&
      generatedCutoffSummaryKeys.some((key) => summary?.[key] !== undefined),
  );
});

const legacyCutoffSummary = computed(() =>
  Array.isArray(college.value?.cutoffSummary) ? college.value?.cutoffSummary : [],
);

const galleryImages = computed(() =>
  college.value?.galleryItems?.length
    ? college.value.galleryItems
    : college.value?.gallery || [],
);

watch(
  () => college.value?.cutoffSummary,
  (cutoffSummary) => {
    if (!import.meta.dev || !cutoffSummary || Array.isArray(cutoffSummary)) return;

    console.debug("[collegeFinder.cutoffSummary]", {
      collegeId: college.value?.id || college.value?._id,
      allIndia2025Open: cutoffSummary?.allIndia?.["2025"]?.OPEN || cutoffSummary?.allIndia?.OPEN,
      state2025Open: cutoffSummary?.state?.["2025"]?.OPEN || cutoffSummary?.state?.OPEN,
      hasGeneratedCutoffSummary: hasGeneratedCutoffSummary.value,
    });
  },
  { flush: "post" },
);

const shareCollege = async () => {
  if (!process.client || !college.value) return;

  const shareData = {
    title: college.value.name,
    text: seoDescription.value,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
    shareMessage.value = tr("link_copied", "Link copied to clipboard!");
    window.setTimeout(() => {
      shareMessage.value = "";
    }, 1800);
  } catch (error) {
    shareMessage.value = "";
  }
};

const goToColleges = () => navigateTo("/colleges");
</script>

<template>
  <main class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
    <div class="sk-container py-8">
      <CollegeBreadcrumbs :items="breadcrumbItems" />

      <CollegeEmptyState
        v-if="!pending && loadError"
        class="mt-6"
        :title="tr('collegeFinder.errors.loadTitle', 'Unable to load colleges')"
        :description="tr('collegeFinder.errors.loadDescription', 'Please retry once. If the issue continues, the college API may be temporarily unavailable.')"
        :action-label="tr('retry', 'Retry')"
        @action="loadCollege"
      />

      <CollegeEmptyState
        v-else-if="!pending && !college"
        class="mt-6"
        :title="tr('collegeFinder.detail.notFoundTitle', 'College not found')"
        :description="tr('collegeFinder.detail.notFoundDescription', 'This college profile is not available in the current dataset.')"
        :action-label="tr('collegeFinder.landing.browseAll', 'Browse colleges')"
        @action="goToColleges"
      />

      <div v-else-if="college" class="mt-6 space-y-6">
        <CollegeHero :college="college" @share="shareCollege" />

        <p v-if="shareMessage" class="rounded-2xl bg-[var(--color-success-soft)] px-4 py-3 text-sm font-bold text-[var(--color-success)]">
          {{ shareMessage }}
        </p>

        <div class="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div class="min-w-0 space-y-6">
            <div class="lg:hidden">
              <CollegeTabs v-model="activeTab" :tabs="DETAIL_TABS" />
            </div>

            <CollegeOverview
              v-show="activeTab === 'overview' || true"
              class="hidden lg:block"
              :college="college"
            />
            <CollegeOverview
              v-if="activeTab === 'overview'"
              class="lg:hidden"
              :college="college"
            />

            <section
              v-show="activeTab === 'courses' || true"
              class="surface-panel hidden rounded-2xl p-5 sm:p-6 lg:block"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("collegeFinder.detail.coursesOffered", "Courses offered") }}
              </h2>
              <div class="mt-5 grid gap-3">
                <div
                  v-for="course in college.courses"
                  :key="course.name"
                  class="grid gap-3 rounded-2xl bg-[var(--color-surface-soft)] p-4 sm:grid-cols-4"
                >
                  <div>
                    <p class="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                      {{ tr("collegeFinder.detail.course", "Course") }}
                    </p>
                    <p class="mt-1 font-black">{{ course.name }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                      {{ tr("collegeFinder.detail.duration", "Duration") }}
                    </p>
                    <p class="mt-1 font-black">{{ course.duration }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                      {{ tr("collegeFinder.card.seats", "Seats") }}
                    </p>
                    <p class="mt-1 font-black">{{ course.seats }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                      {{ tr("collegeFinder.detail.mode", "Mode") }}
                    </p>
                    <p class="mt-1 font-black">{{ course.mode }}</p>
                  </div>
                </div>
              </div>
            </section>

            <section
              v-if="activeTab === 'courses'"
              class="surface-panel rounded-2xl p-5 sm:p-6 lg:hidden"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("collegeFinder.detail.coursesOffered", "Courses offered") }}
              </h2>
              <div class="mt-5 grid gap-3">
                <div
                  v-for="course in college.courses"
                  :key="course.name"
                  class="rounded-2xl bg-[var(--color-surface-soft)] p-4"
                >
                  <p class="font-black">{{ course.name }}</p>
                  <p class="mt-1 text-sm font-bold text-[var(--color-text-muted)]">
                    {{ course.duration }} · {{ course.seats }} {{ tr("collegeFinder.card.seats", "Seats") }}
                  </p>
                </div>
              </div>
            </section>

            <CollegeFeeCard
              v-show="activeTab === 'fees' || true"
              class="hidden lg:block"
              :fees="college.fees"
            />
            <CollegeFeeCard
              v-if="activeTab === 'fees'"
              class="lg:hidden"
              :fees="college.fees"
            />

            <section
              v-show="activeTab === 'cutoff' || true"
              class="surface-panel hidden rounded-2xl p-5 sm:p-6 lg:block"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("collegeFinder.detail.cutoffSummary", "Cutoff summary") }}
              </h2>
              <div class="mt-5 grid gap-3">
                <CollegeCutoffSummary
                  v-if="hasGeneratedCutoffSummary"
                  :summary="college?.cutoffSummary"
                />
                <template v-else>
                  <CollegeCutoffCard
                    v-for="cutoff in legacyCutoffSummary"
                    :key="`${cutoff?.course}-${cutoff?.category}-${cutoff?.round}`"
                    :cutoff="cutoff"
                  />
                </template>
              </div>
            </section>

            <section
              v-if="activeTab === 'cutoff'"
              class="surface-panel rounded-2xl p-5 sm:p-6 lg:hidden"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("collegeFinder.detail.cutoffSummary", "Cutoff summary") }}
              </h2>
              <div class="mt-5 grid gap-3">
                <CollegeCutoffSummary
                  v-if="hasGeneratedCutoffSummary"
                  :summary="college?.cutoffSummary"
                />
                <template v-else>
                  <CollegeCutoffCard
                    v-for="cutoff in legacyCutoffSummary"
                    :key="`${cutoff?.course}-${cutoff?.category}-${cutoff?.round}`"
                    :cutoff="cutoff"
                  />
                </template>
              </div>
            </section>

            <CollegeFacilities
              v-show="activeTab === 'facilities' || true"
              class="hidden lg:block"
              :facilities="college.facilities"
              :recognition="college.recognition"
            />
            <CollegeFacilities
              v-if="activeTab === 'facilities'"
              class="lg:hidden"
              :facilities="college.facilities"
              :recognition="college.recognition"
            />

            <section
              v-show="activeTab === 'gallery' || true"
              class="surface-panel hidden rounded-2xl p-5 sm:p-6 lg:block"
            >
              <h2 class="mb-5 text-2xl font-black text-[var(--color-text)]">
                {{ tr("collegeFinder.detail.gallery", "Gallery") }}
              </h2>
              <CollegeGallery :images="galleryImages" :alt="college.name" />
            </section>

            <section
              v-if="activeTab === 'gallery'"
              class="surface-panel rounded-2xl p-5 sm:p-6 lg:hidden"
            >
              <h2 class="mb-5 text-2xl font-black text-[var(--color-text)]">
                {{ tr("collegeFinder.detail.gallery", "Gallery") }}
              </h2>
              <CollegeGallery :images="galleryImages" :alt="college.name" />
            </section>

            <section
              v-show="activeTab === 'contact' || true"
              class="surface-panel hidden rounded-2xl p-5 sm:p-6 lg:block"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("collegeFinder.detail.contactInfo", "Contact info") }}
              </h2>
              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl bg-[var(--color-surface-soft)] p-4">
                  <p class="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    {{ tr("collegeFinder.detail.address", "Address") }}
                  </p>
                  <p class="mt-2 text-sm font-bold leading-6">{{ college.address }}</p>
                </div>
                <div class="rounded-2xl bg-[var(--color-surface-soft)] p-4">
                  <p class="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    {{ tr("collegeFinder.detail.contact", "Contact") }}
                  </p>
                  <p class="mt-2 text-sm font-bold leading-6">{{ college.contact.phone }}</p>
                  <p class="text-sm font-bold leading-6">{{ college.contact.email }}</p>
                </div>
              </div>
              <a v-if="websiteUrl" :href="websiteUrl" target="_blank" rel="noopener noreferrer" class="sk-button-secondary mt-5 w-max">
                {{ tr("collegeFinder.detail.website", "Website") }}
                <ArrowTopRightOnSquareIcon class="h-4 w-4" />
              </a>
            </section>

            <section
              v-if="activeTab === 'contact'"
              class="surface-panel rounded-2xl p-5 sm:p-6 lg:hidden"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("collegeFinder.detail.contactInfo", "Contact info") }}
              </h2>
              <p class="mt-3 text-sm font-bold leading-7 text-[var(--color-text-muted)]">
                {{ college.address }}
              </p>
              <p class="mt-3 text-sm font-bold leading-7 text-[var(--color-text-muted)]">
                {{ college.contact.phone }} · {{ college.contact.email }}
              </p>
              <a v-if="websiteUrl" :href="websiteUrl" target="_blank" rel="noopener noreferrer" class="sk-button-secondary mt-5 w-max">
                {{ tr("collegeFinder.detail.website", "Website") }}
                <ArrowTopRightOnSquareIcon class="h-4 w-4" />
              </a>
            </section>
          </div>

          <aside class="sticky top-24 space-y-4">
            <div class="surface-panel rounded-2xl p-5">
              <div class="flex items-center gap-3">
                <div class="grid h-11 w-11 place-items-center rounded-2xl text-white" style="background-image: var(--gradient-primary);">
                  <ClipboardDocumentListIcon class="h-5 w-5" />
                </div>
                <div>
                  <h2 class="text-lg font-black text-[var(--color-text)]">
                    {{ tr("collegeFinder.detail.quickFacts", "Quick facts") }}
                  </h2>
                  <p class="text-xs font-bold text-[var(--color-text-soft)]">
                    {{ college.city }}, {{ college.state }}
                  </p>
                </div>
              </div>

              <div class="mt-5 divide-y divide-[var(--color-border)]">
                <div
                  v-for="fact in quickFacts"
                  :key="fact.label"
                  class="flex justify-between gap-4 py-3 text-sm"
                >
                  <span class="font-bold text-[var(--color-text-soft)]">{{ fact.label }}</span>
                  <span class="text-right font-black text-[var(--color-text)]">{{ fact.value }}</span>
                </div>
              </div>
            </div>

            <div class="surface-panel rounded-2xl p-5">
              <h3 class="text-lg font-black text-[var(--color-text)]">
                {{ tr("collegeFinder.detail.counsellingEligibility", "Counselling eligibility") }}
              </h3>
              <div class="mt-4 space-y-3">
                <p
                  v-for="item in counsellingItems"
                  :key="item.label"
                  class="flex items-center justify-between gap-3 text-sm font-bold text-[var(--color-text-muted)]"
                >
                  <span>{{ item.label }}</span>
                  <span class="inline-flex items-center gap-1" :class="item.available ? 'text-[var(--color-success)]' : 'text-[var(--color-text-soft)]'">
                    <CheckCircleIcon v-if="item.available" class="h-4 w-4" />
                    {{ item.available ? tr("collegeFinder.filters.yes", "Yes") : tr("collegeFinder.filters.no", "No") }}
                  </span>
                </p>
              </div>
            </div>

            <button
              class="sk-button-primary w-full"
              @click.prevent="handleTalkToCounsellor"
            >
              {{ tr("home.finalCta.talkToCounsellor", "Talk to Counsellor") }}
            </button>
          </aside>
        </div>

        <CollegeDisclaimer class="mt-6" />
      </div>
    </div>
  </main>
</template>
