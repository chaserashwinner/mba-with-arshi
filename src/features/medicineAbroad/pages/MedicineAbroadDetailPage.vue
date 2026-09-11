<script setup>
import {
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
  BookmarkIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HomeModernIcon,
  MapPinIcon,
  PhoneIcon,
  ShareIcon,
  ShieldCheckIcon,
} from "@heroicons/vue/24/solid";
import CollegeBadge from "@/src/features/collegeFinder/components/CollegeBadge.vue";
import CollegeBreadcrumbs from "@/src/features/collegeFinder/components/CollegeBreadcrumbs.vue";
import CollegeDisclaimer from "@/src/features/collegeFinder/components/CollegeDisclaimer.jsx";
import CollegeEmptyState from "@/src/features/collegeFinder/components/CollegeEmptyState.vue";
import CollegeTabs from "@/src/features/collegeFinder/components/CollegeTabs.vue";
import AbroadQuickFacts from "../components/AbroadQuickFacts.vue";
import { ABROAD_DETAIL_TABS } from "../constants/medicineAbroadConstants";
import { medicineAbroadService } from "../services/medicineAbroadService";
import {
  formatCurrency,
  formatFeeRange,
  getCoursesLabel,
} from "../utils/formatters";
import { normalizeExternalUrl } from "@/src/features/collegeFinder/utils/normalizeExternalUrl";
import { useCollegeSeo } from "@/src/features/collegeFinder/hooks/useCollegeSeo";

const { tr } = useAppI18n();
const route = useRoute();
const college = ref(null);
const pending = ref(true);
const loadError = ref(false);
const activeTab = ref("overview");
const shareMessage = ref("");
const saved = ref(false);
const detailAbortController = shallowRef(null);
let detailRequestVersion = 0;

const CollegeGallery = defineAsyncComponent(() =>
  import("@/src/features/collegeFinder/components/CollegeGallery.vue").then(
    m => (m ? m.default || m : undefined),
  ),
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
    const nextCollege = await medicineAbroadService.getCollegeBySlugAndId(
      route.params.slug,
      route.params.id,
      getDetailAbortOptions(),
    );

    if (requestVersion === detailRequestVersion) college.value = nextCollege;
  } catch (error) {
    if (error?.name === "AbortError") return;

    try {
      const nextCollege = await medicineAbroadService.getCollegeById(
        route.params.id,
        getDetailAbortOptions(),
      );

      if (requestVersion === detailRequestVersion) college.value = nextCollege;
    } catch (idFallbackError) {
      if (idFallbackError?.name === "AbortError") return;

      try {
        const nextCollege = await medicineAbroadService.getCollegeBySlug(
          route.params.slug,
          getDetailAbortOptions(),
        );

        if (requestVersion === detailRequestVersion) college.value = nextCollege;
      } catch (fallbackError) {
        if (fallbackError?.name === "AbortError") return;
        college.value = null;
        loadError.value = true;
      }
    }
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
    label: tr("medicineAbroad.landing.title", "Medicine Abroad Finder"),
    to: "/medicine-abroad",
  },
  {
    label: tr("medicineAbroad.listing.title", "Find medicine abroad colleges"),
    to: "/medicine-abroad/colleges",
  },
  {
    label: college.value?.shortName || tr("loading", "Loading..."),
  },
]);

const seoTitle = computed(() =>
  college.value
    ? `${college.value.name} Fees, Hostel, Eligibility | StudentKhabri`
    : "Medicine Abroad College Details | StudentKhabri",
);
const seoDescription = computed(() =>
  college.value
    ? `${college.value.shortName} profile with fees, hostel, eligibility, recognition, facilities, Indian student support, contact, website, and gallery.`
    : "Medicine abroad university profile with fees, hostel, eligibility, recognition, facilities, Indian student support, contact, website, and gallery.",
);

useCollegeSeo({
  title: seoTitle,
  description: seoDescription,
  image: computed(() => college.value?.banner),
  url: computed(() => `https://studentkhabri.com${route.path}`),
});

const websiteUrl = computed(() => normalizeExternalUrl(college.value?.website));
const websiteLinks = computed(() => {
  if (!college.value) return [];

  const links = (college.value.websiteLinks || [])
    .map((link, index) => ({
      label: link.label || tr("medicineAbroad.detail.website", "Website"),
      url: normalizeExternalUrl(link.url),
      key: `${link.url || ""}-${index}`,
    }))
    .filter((link) => link.url);

  if (links.length || !websiteUrl.value) return links;

  return [
    {
      label: tr("medicineAbroad.detail.website", "Website"),
      url: websiteUrl.value,
      key: websiteUrl.value,
    },
  ];
});

const formatFeeItemValue = (item = {}, fallbackCurrency = "USD") => {
  const amount = item.amount || item.value || item.fee || 0;
  const formattedAmount = amount
    ? formatCurrency(amount, item.currency || fallbackCurrency)
    : item.displayValue || "N/A";

  return item.period ? `${formattedAmount} / ${item.period}` : formattedAmount;
};

const getFeeIcon = (label = "") =>
  /hostel|accommodation|food/i.test(label) ? HomeModernIcon : BanknotesIcon;

const feeRows = computed(() => {
  if (!college.value) return [];
  const fees = college.value.fees || {};
  const feeItems = fees.items?.length
    ? fees.items
    : college.value.feeStructure?.items || [];

  if (feeItems.length) {
    return feeItems.map((item) => ({
      label: item.label,
      value: formatFeeItemValue(item, fees.currency),
      icon: getFeeIcon(item.label),
    }));
  }

  const rows = [];

  if (fees.totalMin || fees.totalMax || fees.annualMin || fees.annualMax) {
    rows.push({
      label: tr("medicineAbroad.detail.totalFees", "Total fees"),
      value: formatFeeRange(fees),
      icon: BanknotesIcon,
    });
  }

  if (fees.tuitionMin || fees.tuitionMax) {
    rows.push({
      label: tr("medicineAbroad.detail.tuitionFees", "Tuition fees"),
      value: fees.tuitionMin || fees.tuitionMax
        ? `${formatCurrency(fees.tuitionMin || fees.tuitionMax, fees.currency)}${fees.tuitionMax && fees.tuitionMax !== fees.tuitionMin ? ` - ${formatCurrency(fees.tuitionMax, fees.currency)}` : ""}`
        : "N/A",
      icon: BanknotesIcon,
    });
  }

  if (fees.hostelMin || fees.hostelMax) {
    rows.push({
      label: tr("medicineAbroad.detail.hostelFees", "Hostel fees"),
      value: fees.hostelMin || fees.hostelMax
        ? `${formatCurrency(fees.hostelMin || fees.hostelMax, fees.currency)}${fees.hostelMax && fees.hostelMax !== fees.hostelMin ? ` - ${formatCurrency(fees.hostelMax, fees.currency)}` : ""}`
        : "N/A",
      icon: HomeModernIcon,
    });
  }

  return rows;
});

const overviewFacts = computed(() => {
  if (!college.value) return [];

  return [
    {
      label: tr("medicineAbroad.detail.country", "Country"),
      value: college.value.country,
    },
    {
      label: tr("medicineAbroad.detail.city", "City"),
      value: college.value.city || "N/A",
    },
    {
      label: tr("medicineAbroad.detail.universityType", "University type"),
      value: college.value.universityType || "N/A",
    },
    {
      label: tr("medicineAbroad.detail.established", "Established"),
      value: college.value.established || "N/A",
    },
  ];
});

const hostelDetails = computed(() =>
  [
    college.value?.hostel?.details,
    college.value?.hostel?.accommodation,
    college.value?.hostel?.food,
    college.value?.hostel?.notes,
  ]
    .filter(Boolean)
    .join(" "),
);
const hostelStatusLabel = computed(() => {
  if (college.value?.hostel?.available === true) {
    return tr("medicineAbroad.detail.hostelAvailable", "Hostel available");
  }

  if (college.value?.hostel?.available === false) {
    return tr("medicineAbroad.detail.hostelUnavailable", "Hostel unavailable");
  }

  return "N/A";
});

const heroRecognitionLabel = computed(() =>
  college.value?.recognition?.slice(0, 2).join(", ") || "",
);

const galleryImages = computed(() =>
  college.value?.galleryItems?.length
    ? college.value.galleryItems
    : college.value?.gallery || [],
);

const disclaimerText = computed(() => college.value?.disclaimer || "");

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

const toggleSave = () => {
  saved.value = !saved.value;
};

const goToColleges = () => navigateTo("/medicine-abroad/colleges");
</script>

<template>
  <main class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
    <div class="sk-container py-8">
      <CollegeBreadcrumbs :items="breadcrumbItems" />

      <CollegeEmptyState
        v-if="!pending && loadError"
        class="mt-6"
        :title="tr('medicineAbroad.errors.loadTitle', 'Unable to load abroad colleges')"
        :description="tr('medicineAbroad.errors.loadDescription', 'Please retry once. If the issue continues, the medicine abroad API may be temporarily unavailable.')"
        :action-label="tr('retry', 'Retry')"
        @action="loadCollege"
      />

      <CollegeEmptyState
        v-else-if="!pending && !college"
        class="mt-6"
        :title="tr('medicineAbroad.detail.notFoundTitle', 'College not found')"
        :description="tr('medicineAbroad.detail.notFoundDescription', 'This abroad college profile is not available in the current dataset.')"
        :action-label="tr('medicineAbroad.landing.browseAll', 'Browse universities')"
        @action="goToColleges"
      />

      <div v-else-if="college" class="mt-6 space-y-6">
        <section class="medicine-abroad-hero">
          <AssetRenderer
            :src="college.banner"
            :alt="college.name"
            type="banner"
            fallback="/placeholder/college_thumbnail.jpg"
            class="medicine-abroad-hero__image"
            fetchpriority="high"
            priority
          />
          <div class="medicine-abroad-hero__content">
            <div>
              <div class="flex flex-wrap gap-2">
                <CollegeBadge
                  v-for="course in college.courseTypes"
                  :key="course"
                  :label="course"
                  tone="primary"
                />
                <CollegeBadge :label="college.country" tone="success" />
                <CollegeBadge v-if="college.medium" :label="college.medium" tone="neutral" />
              </div>
              <p class="medicine-abroad-hero__eyebrow text-sm font-black uppercase tracking-[0.18em] text-white/70">
                {{ college.shortName }}
              </p>
              <h1 class="medicine-abroad-hero__title max-w-4xl font-black">
                {{ college.name }}
              </h1>
              <div class="medicine-abroad-hero__meta flex flex-wrap items-center gap-4 text-sm font-bold text-white/80">
                <span class="inline-flex items-center gap-2">
                  <MapPinIcon class="h-5 w-5 text-[var(--color-primary)]" />
                  {{ [college.city, college.country].filter(Boolean).join(", ") }}
                </span>
                <span v-if="heroRecognitionLabel" class="inline-flex items-center gap-2">
                  <ShieldCheckIcon class="h-5 w-5 text-[var(--color-primary)]" />
                  {{ heroRecognitionLabel }}
                </span>
              </div>
            </div>

            <div class="medicine-abroad-hero__actions flex gap-2">
              <button type="button" class="sk-button-secondary border-white/15 bg-white/10 text-white" @click="shareCollege">
                <ShareIcon class="h-4 w-4" />
                {{ tr("share", "Share") }}
              </button>
              <button type="button" class="sk-button-primary" @click="toggleSave">
                <BookmarkIcon class="h-4 w-4" />
                {{ saved ? tr("medicineAbroad.card.saved", "Saved") : tr("medicineAbroad.card.save", "Save") }}
              </button>
            </div>
          </div>
        </section>

        <p v-if="shareMessage" class="rounded-2xl bg-[var(--color-success-soft)] px-4 py-3 text-sm font-bold text-[var(--color-success)]">
          {{ shareMessage }}
        </p>

        <div class="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
          <div class="min-w-0 space-y-6">
            <div class="lg:hidden">
              <CollegeTabs v-model="activeTab" :tabs="ABROAD_DETAIL_TABS" />
            </div>

            <section
              class="surface-panel rounded-2xl p-5 sm:p-6"
              :class="activeTab === 'overview' ? '' : 'hidden lg:block'"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("medicineAbroad.detail.overview", "Overview") }}
              </h2>
              <p class="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                {{ college.description || college.summary || "N/A" }}
              </p>
              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <div
                  v-for="fact in overviewFacts"
                  :key="fact.label"
                  class="rounded-2xl bg-[var(--color-surface-soft)] p-4"
                >
                  <p class="text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    {{ fact.label }}
                  </p>
                  <p class="mt-1 font-black text-[var(--color-text)]">
                    {{ fact.value }}
                  </p>
                </div>
              </div>
            </section>

            <section
              class="surface-panel rounded-2xl p-5 sm:p-6"
              :class="activeTab === 'fees' ? '' : 'hidden lg:block'"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("medicineAbroad.detail.feeStructure", "Fee structure") }}
              </h2>
              <div v-if="feeRows.length" class="mt-5 grid gap-3 md:grid-cols-3">
                <div
                  v-for="row in feeRows"
                  :key="row.label"
                  class="rounded-2xl bg-[var(--color-surface-soft)] p-4"
                >
                  <component :is="row.icon" class="h-5 w-5 text-[var(--color-primary)]" />
                  <p class="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    {{ row.label }}
                  </p>
                  <p class="mt-1 text-lg font-black text-[var(--color-text)]">
                    {{ row.value }}
                  </p>
                </div>
              </div>
              <p v-else class="mt-5 rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm font-bold leading-7 text-[var(--color-text-muted)]">
                N/A
              </p>
              <p v-if="college.fees?.summary" class="mt-4 text-sm font-bold leading-7 text-[var(--color-text-muted)]">
                {{ college.fees.summary }}
              </p>
              <p v-if="college.fees?.notes" class="mt-4 text-sm font-bold leading-7 text-[var(--color-text-muted)]">
                {{ college.fees.notes }}
              </p>
            </section>

            <section
              class="surface-panel rounded-2xl p-5 sm:p-6"
              :class="activeTab === 'hostel' ? '' : 'hidden lg:block'"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("medicineAbroad.detail.hostel", "Hostel") }}
              </h2>
              <div class="mt-5 rounded-2xl bg-[var(--color-surface-soft)] p-4">
                <p class="inline-flex items-center gap-2 text-lg font-black text-[var(--color-text)]">
                  <CheckCircleIcon class="h-5 w-5" :class="college.hostel?.available ? 'text-[var(--color-success)]' : 'text-[var(--color-text-soft)]'" />
                  {{ hostelStatusLabel }}
                </p>
                <p class="mt-3 text-sm font-bold leading-7 text-[var(--color-text-muted)]">
                  {{ hostelDetails || "N/A" }}
                </p>
              </div>
            </section>

            <section
              class="surface-panel rounded-2xl p-5 sm:p-6"
              :class="activeTab === 'eligibility' ? '' : 'hidden lg:block'"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("medicineAbroad.detail.eligibility", "Eligibility") }}
              </h2>
              <div class="mt-5 grid gap-3">
                <p
                  v-for="item in college.eligibility"
                  :key="item"
                  class="rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm font-bold leading-7 text-[var(--color-text-muted)]"
                >
                  {{ item }}
                </p>
                <p
                  v-if="!college.eligibility?.length"
                  class="rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm font-bold leading-7 text-[var(--color-text-muted)]"
                >
                  N/A
                </p>
              </div>
            </section>

            <section
              class="surface-panel rounded-2xl p-5 sm:p-6"
              :class="activeTab === 'recognition' ? '' : 'hidden lg:block'"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("medicineAbroad.detail.recognition", "Recognition") }}
              </h2>
              <div class="mt-5 flex flex-wrap gap-2">
                <CollegeBadge
                  v-for="item in college.recognition"
                  :key="item"
                  :label="item"
                  tone="success"
                />
                <p v-if="!college.recognition?.length" class="text-sm font-bold text-[var(--color-text-muted)]">
                  N/A
                </p>
              </div>
            </section>

            <section
              class="surface-panel rounded-2xl p-5 sm:p-6"
              :class="activeTab === 'facilities' ? '' : 'hidden lg:block'"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("medicineAbroad.detail.facilities", "Facilities") }}
              </h2>
              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <p
                  v-for="facility in college.facilities"
                  :key="facility"
                  class="rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm font-black text-[var(--color-text)]"
                >
                  {{ facility }}
                </p>
                <p v-if="!college.facilities?.length" class="text-sm font-bold text-[var(--color-text-muted)]">
                  N/A
                </p>
              </div>

              <h3 class="mt-8 text-xl font-black text-[var(--color-text)]">
                {{ tr("medicineAbroad.detail.indianStudentSupport", "Indian student support") }}
              </h3>
              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <p
                  v-for="support in college.indianStudentSupport"
                  :key="support"
                  class="rounded-2xl bg-[var(--color-surface-soft)] p-4 text-sm font-bold leading-7 text-[var(--color-text-muted)]"
                >
                  {{ support }}
                </p>
                <p v-if="!college.indianStudentSupport?.length" class="text-sm font-bold text-[var(--color-text-muted)]">
                  N/A
                </p>
              </div>
            </section>

            <section
              class="surface-panel rounded-2xl p-5 sm:p-6"
              :class="activeTab === 'gallery' ? '' : 'hidden lg:block'"
            >
              <h2 class="mb-5 text-2xl font-black text-[var(--color-text)]">
                {{ tr("medicineAbroad.detail.gallery", "Gallery") }}
              </h2>
              <CollegeGallery :images="galleryImages" :alt="college.name" />
            </section>

            <section
              class="surface-panel rounded-2xl p-5 sm:p-6"
              :class="activeTab === 'contact' ? '' : 'hidden lg:block'"
            >
              <h2 class="text-2xl font-black text-[var(--color-text)]">
                {{ tr("medicineAbroad.detail.contactInfo", "Contact info") }}
              </h2>
              <div class="mt-5 grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl bg-[var(--color-surface-soft)] p-4">
                  <p class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    <MapPinIcon class="h-4 w-4" />
                    {{ tr("medicineAbroad.detail.address", "Address") }}
                  </p>
                  <p class="mt-2 text-sm font-bold leading-6">{{ college.contact?.address || "N/A" }}</p>
                </div>
                <div class="rounded-2xl bg-[var(--color-surface-soft)] p-4">
                  <p class="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    <PhoneIcon class="h-4 w-4" />
                    {{ tr("medicineAbroad.detail.contact", "Contact") }}
                  </p>
                  <p class="mt-2 text-sm font-bold leading-6">{{ college.contact?.phone || "N/A" }}</p>
                  <p class="inline-flex items-center gap-2 text-sm font-bold leading-6">
                    <EnvelopeIcon class="h-4 w-4 text-[var(--color-primary)]" />
                    {{ college.contact?.email || "N/A" }}
                  </p>
                </div>
              </div>
              <div v-if="websiteLinks.length" class="mt-5 flex flex-wrap gap-3">
                <a
                  v-for="link in websiteLinks"
                  :key="link.key"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="sk-button-secondary w-max"
                >
                  <GlobeAltIcon class="h-4 w-4" />
                  {{ link.label }}
                  <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                </a>
              </div>
            </section>
          </div>

          <div class="sidebar-sticky-scroll">
            <AbroadQuickFacts :college="college" />
          </div>
        </div>

        <CollegeDisclaimer
          v-if="disclaimerText"
          class="mt-6"
          :description="disclaimerText"
        />
      </div>
    </div>
  </main>
</template>

<style scoped>
.medicine-abroad-hero {
  position: relative;
  display: grid;
  height: clamp(180px, 52vw, 220px);
  overflow: hidden;
  border-radius: 1.75rem;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.78)),
    var(--color-surface-soft);
}

.medicine-abroad-hero::before,
.medicine-abroad-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.medicine-abroad-hero::before {
  background: rgba(15, 23, 42, 0.48);
}

.medicine-abroad-hero::after {
  background:
    radial-gradient(circle at 12% 0%, rgba(34, 197, 94, 0.18), transparent 34%),
    linear-gradient(to top, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54) 52%, rgba(15, 23, 42, 0.18));
}

.medicine-abroad-hero__image {
  position: absolute;
  inset: 0;
  z-index: 0;
  height: 100%;
  width: 100%;
}

.medicine-abroad-hero__image :deep(.sk-asset-renderer__media) {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center;
}

.medicine-abroad-hero__content {
  position: relative;
  z-index: 2;
  display: grid;
  height: 100%;
  align-content: end;
  gap: 0.75rem;
  padding: 1rem;
  color: #fff;
}

.medicine-abroad-hero__eyebrow {
  margin-top: 0.75rem;
}

.medicine-abroad-hero__title {
  display: -webkit-box;
  margin-top: 0.35rem;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-size: clamp(1.35rem, 5.6vw, 1.85rem);
  line-height: 1.08;
}

.medicine-abroad-hero__meta {
  margin-top: 0.5rem;
}

.medicine-abroad-hero__actions {
  flex-wrap: wrap;
}

@media (min-width: 640px) {
  .medicine-abroad-hero {
    height: clamp(220px, 30vw, 320px);
  }

  .medicine-abroad-hero__content {
    gap: 1rem;
    padding: 1.5rem;
  }

  .medicine-abroad-hero__title {
    -webkit-line-clamp: 2;
    font-size: clamp(2rem, 4vw, 2.75rem);
  }

  .medicine-abroad-hero__meta {
    margin-top: 0.75rem;
  }
}

@media (min-width: 1024px) {
  .medicine-abroad-hero {
    height: clamp(260px, 32vw, 420px);
  }

  .medicine-abroad-hero__content {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 1.5rem;
    padding: 2rem;
  }

  .medicine-abroad-hero__title {
    font-size: clamp(2rem, 3vw, 3rem);
  }
}
</style>
