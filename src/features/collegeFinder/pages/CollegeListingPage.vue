<script setup>
import { ref, onMounted, nextTick } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { AdjustmentsHorizontalIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/vue/24/solid";
import CollegeBreadcrumbs from "../components/CollegeBreadcrumbs.vue";
import CollegeCard from "../components/CollegeCard.vue";
import CollegeEmptyState from "../components/CollegeEmptyState.vue";
import CollegeFilters from "../components/CollegeFilters.vue";
import CollegeSearchBar from "../components/CollegeSearchBar.vue";
import CollegeSkeleton from "../components/CollegeSkeleton.vue";
import CourseSwitcher from "../components/CourseSwitcher.vue";
import { collegeService } from "../services/collegeService";
import { useCollegeFilters } from "../hooks/useCollegeFilters";
import { useCollegeSeo } from "../hooks/useCollegeSeo";
import { normalizeCourse, titleFromSlug } from "../utils/formatters";

const { tr } = useAppI18n();
const route = useRoute();
const showMobileFilters = ref(false);
const PAGE_LIMIT = 20;

const colleges = shallowRef([]);
const filterOptions = shallowRef({
  states: [],
  collegeTypes: [],
  counsellingTypes: [],
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

const routeCourse = computed(() => normalizeCourse(route.params.course));
const routeState = computed(() =>
  route.params.state ? titleFromSlug(route.params.state) : "",
);
const {
  filters,
  searchInput,
  filteredColleges,
  activeFilterCount,
  forcedCourse,
  forcedState,
  setFilter,
  toggleArrayFilter,
  clearFilters,
} = useCollegeFilters(colleges, { serverSide: true, historyOnly: true });

const listingQuery = computed(() => ({
  search: filters.value.search,
  courseType: filters.value.courseTypes,
  state: filters.value.states,
  collegeType: filters.value.collegeTypes,
  counsellingType: filters.value.counsellingTypes,
  fee: filters.value.feeRange !== "any" ? filters.value.feeRange : undefined,
  aiqEligible: filters.value.aiqEligible,
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
    nextPagination?.totalPages ?? nextPagination?.pages ?? Math.ceil(total / limit) ?? 0,
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

const mergeUniqueColleges = (current, incoming) => {
  const seen = new Set(current.map((college) => college.id));
  const next = [...current];

  incoming.forEach((college) => {
    if (!seen.has(college.id)) {
      seen.add(college.id);
      next.push(college);
    }
  });

  return next;
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
    const response = await collegeService.getCollegeList(
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
      colleges.value.length,
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
    filterOptions.value = await collegeService.getFilterOptions({
      courseType: routeCourse.value || undefined,
    });
  } catch (error) {
    filterOptions.value = {
      states: [],
      collegeTypes: [],
      counsellingTypes: [],
    };
  }
};

const refresh = async () => {
  lastListingKey = listingQueryKey.value;
  await fetchColleges({ page: 1, reset: true });
};

watch(listingQueryKey, async (key) => {
  if (key === lastListingKey) return;
  lastListingKey = key;
  await fetchColleges({ page: 1, reset: true });
});

watch(routeCourse, fetchFilterOptions);

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  void fetchColleges({ page });
  if (process.client) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const isMounted = ref(false);

onMounted(async () => {
  isMounted.value = true;
  await Promise.all([
    refresh(),
    fetchFilterOptions(),
  ]);
});

onBeforeUnmount(() => {
  listingAbortController.value?.abort();
  isMounted.value = false;
});

const pageTitle = computed(() => {
  if (routeCourse.value && routeState.value) {
    return tr(
      "collegeFinder.listing.courseStateTitle",
      "{course} colleges in {state}",
      { course: routeCourse.value, state: routeState.value },
    );
  }

  if (routeCourse.value) {
    return tr("collegeFinder.listing.courseTitle", "{course} colleges", {
      course: routeCourse.value,
    });
  }

  if (routeState.value) {
    return tr("collegeFinder.listing.stateTitle", "Colleges in {state}", {
      state: routeState.value,
    });
  }

  return tr("collegeFinder.listing.title", "Find medical colleges");
});

const pageDescription = computed(() =>
  tr(
    "collegeFinder.listing.description",
    "Search and filter MBBS and BDS colleges by state, ownership, counselling, fee range, AIQ eligibility, and seats.",
  ),
);

const breadcrumbItems = computed(() => [
  {
    label: tr("collegeFinder.landing.title", "College Finder"),
    to: "/college-finder",
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
              {{ tr("collegeFinder.listing.eyebrow", "College Finder") }}
            </p>
            <h1 class="mt-3 text-3xl font-black text-[var(--color-text)] sm:text-5xl">
              {{ pageTitle }}
            </h1>
            <p class="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-base">
              {{ pageDescription }}
            </p>
          </div>
          <CourseSwitcher :active-course="routeCourse" />
        </div>
        <div class="mt-8 flex flex-col gap-3 lg:flex-row">
          <CollegeSearchBar
            v-model="searchInput"
            :placeholder="tr('collegeFinder.filters.searchPlaceholder', 'Search by college name, city, state, quota...')"
          />
          <button
            type="button"
            class="sk-button-secondary justify-center lg:hidden"
            @click="showMobileFilters = true"
          >
            <AdjustmentsHorizontalIcon class="h-5 w-5" />
            {{ tr("collegeFinder.filters.title", "Filters") }}
            <span v-if="activeFilterCount">({{ activeFilterCount }})</span>
          </button>
        </div>
      </div>
    </section>

    <section class="sk-container py-8">
      <div class="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <div class="hidden lg:block">
          <CollegeFilters
            :model-value="filters"
            :options="filterOptions"
            :active-count="activeFilterCount"
            :result-count="totalResults"
            :forced-course="forcedCourse"
            :forced-state="forcedState"
            @set="setFilter"
            @toggle="toggleArrayFilter"
            @clear="clearFilters"
          />
        </div>

        <div class="min-w-0">
          <AdBanner placement="college-list" className="mb-4 !px-0" />
          <div class="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p class="text-sm font-bold text-[var(--color-text-muted)]">
              {{ tr("collegeFinder.listing.showing", "Showing {count} colleges", { count: totalResults }) }}
            </p>
            <button
              v-if="activeFilterCount"
              type="button"
              class="text-sm font-black text-[var(--color-primary)]"
              @click="clearFilters"
            >
              {{ tr("collegeFinder.filters.clearAll", "Clear filters") }}
            </button>
          </div>

          <CollegeSkeleton v-if="initialLoading || (filterLoading && !filteredColleges.length)" />

          <CollegeEmptyState
            v-else-if="loadError && !filteredColleges.length"
            :title="tr('collegeFinder.errors.loadTitle', 'Unable to load colleges')"
            :description="tr('collegeFinder.errors.loadDescription', 'Please retry once. If the issue continues, the college API may be temporarily unavailable.')"
            :action-label="tr('retry', 'Retry')"
            @action="refresh"
          />

          <CollegeEmptyState
            v-else-if="filteredColleges.length === 0"
            :action-label="tr('collegeFinder.filters.clearAll', 'Clear filters')"
            @action="clearFilters"
          />

          <div v-else class="grid gap-5 xl:grid-cols-2">
            <CollegeCard
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
          <CollegeSkeleton v-if="pageLoading" class="mt-5" :count="4" />
        </div>
      </div>
    </section>

    <Teleport v-if="isMounted" to="body">
      <Transition name="college-filter-drawer">
        <div
          v-if="showMobileFilters"
          class="fixed inset-0 z-[80] bg-slate-950/55 p-3 backdrop-blur-sm lg:hidden"
          @click.self="showMobileFilters = false"
        >
          <div class="ml-auto h-full max-w-md overflow-y-auto">
            <CollegeFilters
              class="relative top-0 max-h-none"
              :model-value="filters"
              :options="filterOptions"
              :active-count="activeFilterCount"
              :result-count="totalResults"
              :forced-course="forcedCourse"
              :forced-state="forcedState"
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
.college-filter-drawer-enter-active,
.college-filter-drawer-leave-active {
  transition: opacity 220ms ease-out;
}

.college-filter-drawer-enter-from,
.college-filter-drawer-leave-to {
  opacity: 0;
}
</style>
