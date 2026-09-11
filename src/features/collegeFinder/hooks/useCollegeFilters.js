import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "#app";
import { useDebounce } from "@/composables/useDebounce";
import { FILTER_DEFAULTS } from "../constants/collegeFinderConstants";
import {
  applyCollegeFilters,
  buildCollegeQuery,
  buildFiltersFromRoute,
  getActiveFilterCount,
  normalizeRouteParam,
} from "../utils/filterUtils";
import { normalizeCourse } from "../utils/formatters";

export const useCollegeFilters = (colleges, options = {}) => {
  const route = useRoute();
  const router = useRouter();
  const filters = ref(buildFiltersFromRoute(route));
  const searchInput = ref(filters.value.search);
  const debouncedSearch = useDebounce(searchInput, 300);
  const syncingFromRoute = ref(false);
  const lastSyncedQuery = ref(JSON.stringify(route.query));

  const forcedCourse = computed(() =>
    normalizeCourse(normalizeRouteParam(route.params.course)),
  );
  const forcedState = computed(() => normalizeRouteParam(route.params.state));

  const filteredColleges = computed(() => {
    const items = colleges.value || [];
    if (options.serverSide) return items;

    return applyCollegeFilters(items, filters.value);
  });

  const activeFilterCount = computed(() =>
    getActiveFilterCount(filters.value, route),
  );

  const syncQuery = async () => {
    if (syncingFromRoute.value) return;

    const nextQuery = buildCollegeQuery(filters.value, route);
    const currentQuery = options.historyOnly && process.client
      ? lastSyncedQuery.value
      : JSON.stringify(route.query);
    const serializedNextQuery = JSON.stringify(nextQuery);

    if (currentQuery === serializedNextQuery) return;

    if (options.historyOnly && process.client) {
      const params = new URLSearchParams();

      Object.entries(nextQuery).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        }
      });

      const query = params.toString();
      window.history.replaceState(
        window.history.state,
        "",
        `${route.path}${query ? `?${query}` : ""}${route.hash || ""}`,
      );
      lastSyncedQuery.value = serializedNextQuery;
      return;
    }

    await router.replace({
      path: route.path,
      query: nextQuery,
      hash: route.hash,
    });
    lastSyncedQuery.value = serializedNextQuery;
  };

  const setFilter = (key, value) => {
    filters.value = {
      ...filters.value,
      [key]: value,
    };

    if (key === "search") {
      searchInput.value = value;
    }

    void syncQuery();
  };

  const toggleArrayFilter = (key, value) => {
    const currentValues = filters.value[key] || [];
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setFilter(key, nextValues);
  };

  const clearFilters = () => {
    const routeFilters = buildFiltersFromRoute(route);

    filters.value = {
      ...FILTER_DEFAULTS,
      courseTypes: forcedCourse.value ? routeFilters.courseTypes : [],
      states: forcedState.value ? routeFilters.states : [],
    };
    searchInput.value = "";
    void syncQuery();
  };

  watch(debouncedSearch, (value) => {
    setFilter("search", value);
  });

  watch(
    () => [route.params.course, route.params.state, route.query],
    () => {
      syncingFromRoute.value = true;
      filters.value = buildFiltersFromRoute(route);
      searchInput.value = filters.value.search;
      lastSyncedQuery.value = JSON.stringify(route.query);
      syncingFromRoute.value = false;
    },
    { deep: true },
  );

  return {
    filters,
    searchInput,
    filteredColleges,
    activeFilterCount,
    forcedCourse,
    forcedState,
    setFilter,
    toggleArrayFilter,
    clearFilters,
  };
};
