export const COLLEGE_COURSES = [
  {
    value: "MBBS",
    labelKey: "collegeFinder.courses.mbbs",
    fallback: "MBBS",
    descriptionKey: "collegeFinder.courses.mbbsDescription",
    description: "Medical colleges offering undergraduate MBBS seats.",
  },
  {
    value: "BDS",
    labelKey: "collegeFinder.courses.bds",
    fallback: "BDS",
    descriptionKey: "collegeFinder.courses.bdsDescription",
    description: "Dental colleges offering undergraduate BDS seats.",
  },
];

export const FEE_RANGES = [
  {
    value: "any",
    labelKey: "collegeFinder.filters.anyFee",
    fallback: "Any fee",
    min: 0,
    max: Number.POSITIVE_INFINITY,
  },
  {
    value: "under-1-lakh",
    labelKey: "collegeFinder.filters.underOneLakh",
    fallback: "Under 1 lakh",
    min: 0,
    max: 100000,
  },
  {
    value: "1-5-lakh",
    labelKey: "collegeFinder.filters.oneToFiveLakh",
    fallback: "1 to 5 lakh",
    min: 100000,
    max: 500000,
  },
  {
    value: "5-10-lakh",
    labelKey: "collegeFinder.filters.fiveToTenLakh",
    fallback: "5 to 10 lakh",
    min: 500000,
    max: 1000000,
  },
  {
    value: "above-10-lakh",
    labelKey: "collegeFinder.filters.aboveTenLakh",
    fallback: "Above 10 lakh",
    min: 1000000,
    max: Number.POSITIVE_INFINITY,
  },
];

export const FILTER_DEFAULTS = {
  search: "",
  courseTypes: [],
  states: [],
  collegeTypes: [],
  counsellingTypes: [],
  feeRange: "any",
  aiqEligible: null,
};

export const LANDING_STATS = [
  {
    value: "13+",
    labelKey: "collegeFinder.landing.stats.colleges",
    fallback: "sample colleges",
  },
  {
    value: "2",
    labelKey: "collegeFinder.landing.stats.courses",
    fallback: "course tracks",
  },
  {
    value: "9",
    labelKey: "collegeFinder.landing.stats.states",
    fallback: "states covered",
  },
  {
    value: "7",
    labelKey: "collegeFinder.landing.stats.filters",
    fallback: "smart filters",
  },
];

export const LANDING_FEATURES = [
  {
    titleKey: "collegeFinder.landing.features.cutoffTitle",
    title: "Cutoff-backed shortlisting",
    textKey: "collegeFinder.landing.features.cutoffText",
    text: "Compare colleges with NEET counselling, quota, and recent closing-rank context.",
    icon: "chart",
  },
  {
    titleKey: "collegeFinder.landing.features.feesTitle",
    title: "Fee and quota clarity",
    textKey: "collegeFinder.landing.features.feesText",
    text: "Separate government, private, deemed, management, NRI, and AIQ signals quickly.",
    icon: "currency",
  },
  {
    titleKey: "collegeFinder.landing.features.profileTitle",
    title: "Built for counselling decisions",
    textKey: "collegeFinder.landing.features.profileText",
    text: "Move from broad discovery to a focused college profile without changing tools.",
    icon: "filter",
  },
];

export const DETAIL_TABS = [
  {
    value: "overview",
    labelKey: "collegeFinder.detail.tabs.overview",
    fallback: "Overview",
  },
  {
    value: "courses",
    labelKey: "collegeFinder.detail.tabs.courses",
    fallback: "Courses",
  },
  {
    value: "fees",
    labelKey: "collegeFinder.detail.tabs.fees",
    fallback: "Fees",
  },
  {
    value: "cutoff",
    labelKey: "collegeFinder.detail.tabs.cutoff",
    fallback: "Cutoff",
  },
  {
    value: "facilities",
    labelKey: "collegeFinder.detail.tabs.facilities",
    fallback: "Facilities",
  },
  {
    value: "gallery",
    labelKey: "collegeFinder.detail.tabs.gallery",
    fallback: "Gallery",
  },
  {
    value: "contact",
    labelKey: "collegeFinder.detail.tabs.contact",
    fallback: "Contact",
  },
];
