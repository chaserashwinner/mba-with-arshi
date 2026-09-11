<script setup>
import { ref, onMounted, nextTick } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { AdjustmentsHorizontalIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/vue/24/solid";
import CollegeBreadcrumbs from "@/src/features/collegeFinder/components/CollegeBreadcrumbs.vue";
import CollegeEmptyState from "@/src/features/collegeFinder/components/CollegeEmptyState.vue";
import CollegeSearchBar from "@/src/features/collegeFinder/components/CollegeSearchBar.vue";
import CollegeSkeleton from "@/src/features/collegeFinder/components/CollegeSkeleton.vue";
import AbroadCollegeCard from "../components/AbroadCollegeCard.vue";
import AbroadCourseSwitcher from "../components/AbroadCourseSwitcher.vue";
import AbroadFilters from "../components/AbroadFilters.vue";
import { useAbroadCollegeFilters } from "../hooks/useAbroadCollegeFilters";
import { medicineAbroadService } from "../services/medicineAbroadService";
import {
  normalizeAbroadCourse,
  titleFromSlug,
} from "../utils/formatters";
import { useCollegeSeo } from "@/src/features/collegeFinder/hooks/useCollegeSeo";

const { tr } = useAppI18n();
const route = useRoute();
const showMobileFilters = ref(false);
const PAGE_LIMIT = 12;

const colleges = shallowRef([]);
const filterOptions = shallowRef({
  countries: [],
  courses: [],
});
const pagination = ref({
  page: 1,
  limit: PAGE_LIMIT,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
});
const initialLoading = ref(true);
const filterLoading = ref(false);
const pageLoading = ref(false);
const loadError = ref(null);
const listingAbortController = shallowRef(null);
let listRequestVersion = 0;
let lastListingKey = "";

const routeCourse = computed(() => normalizeAbroadCourse(route.params.course));
const routeCountry = computed(() =>
  route.params.country ? titleFromSlug(route.params.country) : "",
);
const {
  filters,
  searchInput,
  filteredColleges,
  activeFilterCount,
  forcedCourse,
  forcedCountry,
  setFilter,
  toggleArrayFilter,
  clearFilters,
} = useAbroadCollegeFilters(colleges, { serverSide: true, historyOnly: true });

const listingQuery = computed(() => ({
  search: filters.value.search,
  courseType: filters.value.courseTypes,
  country: filters.value.countries,
  fee: filters.value.feeRange !== "any" ? filters.value.feeRange : undefined,
  hostel: filters.value.hostel,
  scholarship: filters.value.scholarship,
  ranking: filters.value.rankingRange !== "any" ? filters.value.rankingRange : undefined,
  sortBy: "ranking",
  sortOrder: "asc",
}));

const listingQueryKey = computed(() => JSON.stringify(listingQuery.value));
const totalResults = computed(() =>
  pagination.value.total || filteredColleges.value.length,
);
const currentPage = computed(() => pagination.value.page || 1);
const totalPages = computed(() => Math.max(pagination.value.totalPages || 1, 1));

const normalizePagination = (nextPagination, loadedCount, page) => {
  const total = Number(nextPagination?.total ?? loadedCount);
  const limit = Number(nextPagination?.limit ?? PAGE_LIMIT);
  const totalPages = Number(
    nextPagination?.totalPages ?? nextPagination?.pages ?? Math.ceil(total / Math.max(limit, 1)) ?? 1,
  );

  return {
    page: Number(nextPagination?.page ?? page),
    limit,
    total,
    totalPages,
    hasNextPage: Boolean(nextPagination?.hasNextPage ?? page < totalPages),
    hasPrevPage: Boolean(nextPagination?.hasPrevPage ?? nextPagination?.hasPreviousPage ?? page > 1),
  };
};

const getAbortOptions = () => {
  if (typeof AbortController === "undefined") return {};

  listingAbortController.value?.abort();
  listingAbortController.value = new AbortController();

  return { signal: listingAbortController.value.signal };
};

const fetchColleges = async ({ page = 1, reset = false } = {}) => {
  const requestVersion = ++listRequestVersion;

  if (reset) {
    filterLoading.value = !initialLoading.value;
  } else {
    pageLoading.value = true;
  }

  loadError.value = null;

  try {
    const response = await medicineAbroadService.getColleges(
      {
        ...listingQuery.value,
        page,
        limit: PAGE_LIMIT,
      },
      getAbortOptions(),
    );

    if (requestVersion !== listRequestVersion) return;

    colleges.value = response.data;
    pagination.value = normalizePagination(
      response.pagination,
      response.data.length,
      page,
    );
  } catch (error) {
    if (error?.name === "AbortError") return;
    loadError.value = error;
  } finally {
    if (requestVersion === listRequestVersion) {
      initialLoading.value = false;
      filterLoading.value = false;
      pageLoading.value = false;
    }
  }
};

const fetchFilterOptions = async () => {
  try {
    filterOptions.value = await medicineAbroadService.getFilterOptions({
      courseType: routeCourse.value || undefined,
    });
  } catch (error) {
    filterOptions.value = {
      countries: [],
      courses: [],
    };
  }
};

const refresh = async () => {
  lastListingKey = listingQueryKey.value;
  await fetchColleges({ page: 1, reset: true });
};

onMounted(() => {
  void Promise.all([
    refresh(),
    fetchFilterOptions(),
  ]);
});

watch(listingQueryKey, async (key) => {
  if (key === lastListingKey) return;
  lastListingKey = key;
  await fetchColleges({ page: 1, reset: true });
});

watch(routeCourse, fetchFilterOptions);

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  void fetchColleges({ page });
};

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});

onBeforeRouteLeave((to, from, next) => {
  isMounted.value = false;
  nextTick(() => {
    next();
  });
});

onBeforeUnmount(() => {
  listingAbortController.value?.abort();
  isMounted.value = false;
});

const pageTitle = computed(() => {
  if (routeCourse.value && routeCountry.value) {
    return tr(
      "medicineAbroad.listing.courseCountryTitle",
      "{course} colleges in {country}",
      { course: routeCourse.value, country: routeCountry.value },
    );
  }

  if (routeCourse.value) {
    return tr("medicineAbroad.listing.courseTitle", "{course} abroad colleges", {
      course: routeCourse.value,
    });
  }

  if (routeCountry.value) {
    return tr("medicineAbroad.listing.countryTitle", "Medicine colleges in {country}", {
      country: routeCountry.value,
    });
  }

  return tr("medicineAbroad.listing.title", "Find medicine abroad colleges");
});

const pageDescription = computed(() =>
  tr(
    "medicineAbroad.listing.description",
    "Search and filter medicine abroad universities by country, course, fee range, hostel, scholarship, ranking, recognition, and student support.",
  ),
);

const breadcrumbItems = computed(() => [
  {
    label: tr("medicineAbroad.landing.title", "Medicine Abroad Finder"),
    to: "/medicine-abroad",
  },
  {
    label: pageTitle.value,
  },
]);

useCollegeSeo({
  title: computed(() => `${pageTitle.value} | StudentKhabri`),
  description: pageDescription,
  url: computed(() => `https://studentkhabri.com${route.path}`),
});
</script>

<template>
  <main class="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
    <section class="border-b border-[var(--color-border)]" style="background: var(--gradient-hero);">
      <div class="sk-container py-10">
        <CollegeBreadcrumbs :items="breadcrumbItems" />
        <div class="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p class="sk-eyebrow">
              {{ tr("medicineAbroad.listing.eyebrow", "Medicine Abroad Finder") }}
            </p>
            <h1 class="mt-3 text-3xl font-black text-[var(--color-text)] sm:text-5xl">
              {{ pageTitle }}
            </h1>
            <p class="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
              {{ pageDescription }}
            </p>
          </div>
          <AbroadCourseSwitcher :active-course="routeCourse" />
        </div>
        <div class="mt-8 flex flex-col gap-3 lg:flex-row">
          <CollegeSearchBar
            v-model="searchInput"
            :placeholder="tr('medicineAbroad.filters.searchPlaceholder', 'Search by university, country, city, recognition...')"
          />
          <button
            type="button"
            class="sk-button-secondary justify-center lg:hidden"
            @click="showMobileFilters = true"
          >
            <AdjustmentsHorizontalIcon class="h-5 w-5" />
            {{ tr("medicineAbroad.filters.title", "Filters") }}
            <span v-if="activeFilterCount">({{ activeFilterCount }})</span>
          </button>
        </div>
      </div>
    </section>

    <section class="sk-container py-8">
      <div class="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <div class="hidden lg:block">
          <AbroadFilters
            :model-value="filters"
            :options="filterOptions"
            :active-count="activeFilterCount"
            :result-count="totalResults"
            :forced-course="forcedCourse"
            :forced-country="forcedCountry"
            @set="setFilter"
            @toggle="toggleArrayFilter"
            @clear="clearFilters"
          />
        </div>

        <div class="min-w-0">
          <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm font-bold text-[var(--color-text-muted)]">
              {{ tr("medicineAbroad.listing.showing", "Showing {count} colleges", { count: totalResults }) }}
            </p>
            <button
              v-if="activeFilterCount"
              type="button"
              class="text-sm font-black text-[var(--color-primary)]"
              @click="clearFilters"
            >
              {{ tr("medicineAbroad.filters.clearAll", "Clear filters") }}
            </button>
          </div>

          <CollegeSkeleton v-if="initialLoading || (filterLoading && !filteredColleges.length)" />

          <CollegeEmptyState
            v-else-if="loadError && !filteredColleges.length"
            :title="tr('medicineAbroad.errors.loadTitle', 'Unable to load abroad colleges')"
            :description="tr('medicineAbroad.errors.loadDescription', 'Please retry once. If the issue continues, the medicine abroad API may be temporarily unavailable.')"
            :action-label="tr('retry', 'Retry')"
            @action="refresh"
          />

          <CollegeEmptyState
            v-else-if="filteredColleges.length === 0"
            :title="tr('medicineAbroad.empty.title', 'No abroad colleges found')"
            :description="tr('medicineAbroad.empty.description', 'Try changing the course, country, fee, hostel, scholarship, or ranking filters.')"
            :action-label="tr('medicineAbroad.filters.clearAll', 'Clear filters')"
            @action="clearFilters"
          />

          <div v-else class="grid gap-5 xl:grid-cols-2">
            <AbroadCollegeCard
              v-for="college in filteredColleges"
              :key="college.id"
              v-memo="[college.id, college.updatedAt]"
              :college="college"
            />
          </div>

          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            :page-loading="pageLoading"
            :has-prev-page="pagination.hasPrevPage"
            :has-next-page="pagination.hasNextPage"
            @change="goToPage"
          />
          <CollegeSkeleton v-if="pageLoading" class="mt-5" :count="2" />
        </div>
      </div>
    </section>

    <Teleport v-if="isMounted" to="body">
      <Transition name="abroad-filter-drawer">
        <div
          v-if="showMobileFilters"
          class="fixed inset-0 z-[80] bg-slate-950/55 p-3 backdrop-blur-sm lg:hidden"
          @click.self="showMobileFilters = false"
        >
          <div class="ml-auto h-full max-w-md overflow-y-auto">
            <AbroadFilters
              class="relative top-0 max-h-none"
              :model-value="filters"
              :options="filterOptions"
              :active-count="activeFilterCount"
              :result-count="totalResults"
              :forced-course="forcedCourse"
              :forced-country="forcedCountry"
              show-close
              @set="setFilter"
              @toggle="toggleArrayFilter"
              @clear="clearFilters"
              @close="showMobileFilters = false"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<style scoped>
.abroad-filter-drawer-enter-active,
.abroad-filter-drawer-leave-active {
  transition: opacity 220ms ease-out;
}

.abroad-filter-drawer-enter-from,
.abroad-filter-drawer-leave-to {
  opacity: 0;
}
</style>
