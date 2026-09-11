import { FEE_RANGES, FILTER_DEFAULTS } from "../constants/collegeFinderConstants";
import {
  createSlug,
  getCollegeSearchText,
  normalizeCourse,
  normalizeToken,
  titleFromSlug,
} from "./formatters";

const normalizeList = (values = []) =>
  values
    .filter(Boolean)
    .map((value) => String(value))
    .filter(Boolean);

export const normalizeRouteParam = (value) =>
  Array.isArray(value) ? value[0] || "" : value || "";

export const buildFiltersFromRoute = (route) => {
  const routeCourse = normalizeCourse(normalizeRouteParam(route.params.course));
  const routeStateSlug = normalizeRouteParam(route.params.state);
  const query = route.query || {};

  const queryCourseTypes = routeCourse
    ? [routeCourse]
    : normalizeList(String(query.courseType || "").split(","))
        .map(normalizeCourse)
        .filter(Boolean);

  const states = routeStateSlug
    ? [titleFromSlug(routeStateSlug)]
    : normalizeList(String(query.state || "").split(","));

  return {
    ...FILTER_DEFAULTS,
    search: normalizeRouteParam(query.q),
    courseTypes: queryCourseTypes,
    states,
    collegeTypes: normalizeList(String(query.collegeType || "").split(",")),
    counsellingTypes: normalizeList(String(query.counselling || "").split(",")),
    feeRange: normalizeRouteParam(query.fee) || "any",
    aiqEligible:
      query.aiq === "yes" ? true : query.aiq === "no" ? false : null,
  };
};

export const buildCollegeQuery = (filters, route) => {
  const routeCourse = normalizeCourse(normalizeRouteParam(route.params.course));
  const routeStateSlug = normalizeRouteParam(route.params.state);
  const nextQuery = { ...route.query };

  delete nextQuery.q;
  delete nextQuery.courseType;
  delete nextQuery.state;
  delete nextQuery.collegeType;
  delete nextQuery.counselling;
  delete nextQuery.fee;
  delete nextQuery.aiq;

  if (filters.search) nextQuery.q = filters.search;
  if (!routeCourse && filters.courseTypes.length) {
    nextQuery.courseType = filters.courseTypes.join(",");
  }
  if (!routeStateSlug && filters.states.length) {
    nextQuery.state = filters.states.join(",");
  }
  if (filters.collegeTypes.length) {
    nextQuery.collegeType = filters.collegeTypes.join(",");
  }
  if (filters.counsellingTypes.length) {
    nextQuery.counselling = filters.counsellingTypes.join(",");
  }
  if (filters.feeRange && filters.feeRange !== "any") {
    nextQuery.fee = filters.feeRange;
  }
  if (filters.aiqEligible !== null) {
    nextQuery.aiq = filters.aiqEligible ? "yes" : "no";
  }

  return nextQuery;
};

export const applyCollegeFilters = (colleges = [], filters = FILTER_DEFAULTS) => {
  const searchTerm = normalizeToken(filters.search);
  const feeRange =
    FEE_RANGES.find((range) => range.value === filters.feeRange) ||
    FEE_RANGES[0];

  return colleges.filter((college) => {
    if (
      searchTerm &&
      !normalizeToken(getCollegeSearchText(college)).includes(searchTerm)
    ) {
      return false;
    }

    if (
      filters.courseTypes.length &&
      !filters.courseTypes.some((course) => college.courseTypes.includes(course))
    ) {
      return false;
    }

    if (
      filters.states.length &&
      !filters.states.some((state) => createSlug(state) === createSlug(college.state))
    ) {
      return false;
    }



    if (
      filters.collegeTypes.length &&
      !filters.collegeTypes.includes(college.collegeType)
    ) {
      return false;
    }

    if (
      filters.counsellingTypes.length &&
      !filters.counsellingTypes.includes(college.counsellingType)
    ) {
      return false;
    }

    if (filters.aiqEligible !== null && college.aiqEligible !== filters.aiqEligible) {
      return false;
    }

    if (feeRange.value !== "any") {
      const minFee = college.fees?.annualMin || 0;
      if (minFee < feeRange.min || minFee > feeRange.max) return false;
    }

    return true;
  });
};

export const deriveCollegeFilterOptions = (colleges = []) => {
  const collect = (key) =>
    [...new Set(colleges.map((college) => college[key]).filter(Boolean))].sort();

  return {
    states: collect("state"),
    collegeTypes: collect("collegeType"),
    counsellingTypes: collect("counsellingType"),
  };
};

export const getActiveFilterCount = (filters, route) => {
  const routeCourse = normalizeCourse(normalizeRouteParam(route.params.course));
  const routeStateSlug = normalizeRouteParam(route.params.state);

  return [
    filters.search,
    !routeCourse && filters.courseTypes.length,
    !routeStateSlug && filters.states.length,
    filters.collegeTypes.length,
    filters.counsellingTypes.length,
    filters.feeRange !== "any",
    filters.aiqEligible !== null,
  ].filter(Boolean).length;
};
