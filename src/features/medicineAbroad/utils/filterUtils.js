import {
  ABROAD_FEE_RANGES,
  ABROAD_FILTER_DEFAULTS,
  ABROAD_RANKING_RANGES,
} from "../constants/medicineAbroadConstants";
import {
  createSlug,
  getAbroadCollegeSearchText,
  getComparableFee,
  getRankingValue,
  normalizeAbroadCourse,
  normalizeRouteParam,
  normalizeToken,
  titleFromSlug,
} from "./formatters";

const normalizeList = (values = []) =>
  values
    .filter(Boolean)
    .map((value) => String(value))
    .filter(Boolean);

const boolFromQuery = (value) =>
  value === "yes" ? true : value === "no" ? false : null;

export const buildFiltersFromRoute = (route) => {
  const routeCourse = normalizeAbroadCourse(normalizeRouteParam(route.params.course));
  const routeCountrySlug = normalizeRouteParam(route.params.country);
  const query = route.query || {};

  const queryCourseTypes = routeCourse
    ? [routeCourse]
    : normalizeList(String(query.courseType || "").split(","))
        .map(normalizeAbroadCourse)
        .filter(Boolean);

  const countries = routeCountrySlug
    ? [titleFromSlug(routeCountrySlug)]
    : normalizeList(String(query.country || "").split(","));

  return {
    ...ABROAD_FILTER_DEFAULTS,
    search: normalizeRouteParam(query.q),
    courseTypes: queryCourseTypes,
    countries,
    feeRange: normalizeRouteParam(query.fee) || "any",
    hostel: boolFromQuery(query.hostel),
    scholarship: boolFromQuery(query.scholarship),
    rankingRange: normalizeRouteParam(query.ranking) || "any",
  };
};

export const buildAbroadCollegeQuery = (filters, route) => {
  const routeCourse = normalizeAbroadCourse(normalizeRouteParam(route.params.course));
  const routeCountrySlug = normalizeRouteParam(route.params.country);
  const nextQuery = { ...route.query };

  delete nextQuery.q;
  delete nextQuery.courseType;
  delete nextQuery.country;
  delete nextQuery.fee;
  delete nextQuery.hostel;
  delete nextQuery.scholarship;
  delete nextQuery.ranking;

  if (filters.search) nextQuery.q = filters.search;
  if (!routeCourse && filters.courseTypes.length) {
    nextQuery.courseType = filters.courseTypes.join(",");
  }
  if (!routeCountrySlug && filters.countries.length) {
    nextQuery.country = filters.countries.join(",");
  }
  if (filters.feeRange && filters.feeRange !== "any") {
    nextQuery.fee = filters.feeRange;
  }
  if (filters.hostel !== null) {
    nextQuery.hostel = filters.hostel ? "yes" : "no";
  }
  if (filters.scholarship !== null) {
    nextQuery.scholarship = filters.scholarship ? "yes" : "no";
  }
  if (filters.rankingRange && filters.rankingRange !== "any") {
    nextQuery.ranking = filters.rankingRange;
  }

  return nextQuery;
};

export const applyAbroadCollegeFilters = (
  colleges = [],
  filters = ABROAD_FILTER_DEFAULTS,
) => {
  const searchTerm = normalizeToken(filters.search);
  const feeRange =
    ABROAD_FEE_RANGES.find((range) => range.value === filters.feeRange) ||
    ABROAD_FEE_RANGES[0];
  const rankingRange =
    ABROAD_RANKING_RANGES.find((range) => range.value === filters.rankingRange) ||
    ABROAD_RANKING_RANGES[0];

  return colleges.filter((college) => {
    if (
      searchTerm &&
      !normalizeToken(getAbroadCollegeSearchText(college)).includes(searchTerm)
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
      filters.countries.length &&
      !filters.countries.some((country) => createSlug(country) === createSlug(college.country))
    ) {
      return false;
    }

    if (filters.hostel !== null && college.hostel?.available !== filters.hostel) {
      return false;
    }

    if (
      filters.scholarship !== null &&
      college.scholarshipAvailable !== filters.scholarship
    ) {
      return false;
    }

    if (feeRange.value !== "any") {
      const fee = getComparableFee(college);
      if (!fee || fee < feeRange.min || fee > feeRange.max) return false;
    }

    if (rankingRange.value !== "any") {
      const ranking = getRankingValue(college);
      if (!ranking || ranking > rankingRange.max) return false;
    }

    return true;
  });
};

export const getActiveFilterCount = (filters, route) => {
  const routeCourse = normalizeAbroadCourse(normalizeRouteParam(route.params.course));
  const routeCountrySlug = normalizeRouteParam(route.params.country);

  return [
    filters.search,
    !routeCourse && filters.courseTypes.length,
    !routeCountrySlug && filters.countries.length,
    filters.feeRange !== "any",
    filters.hostel !== null,
    filters.scholarship !== null,
    filters.rankingRange !== "any",
  ].filter(Boolean).length;
};
