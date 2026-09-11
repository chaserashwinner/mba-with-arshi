export const MEDICINE_ABROAD_ENDPOINTS = [
  "/medicine-abroad",
  "/abroad-college",
  "/abroad-colleges",
];

export const ABROAD_COLLEGE_ENDPOINTS = MEDICINE_ABROAD_ENDPOINTS;

export const ABROAD_COURSES = [
  {
    value: "MBBS",
    labelKey: "medicineAbroad.courses.mbbs",
    fallback: "MBBS",
    descriptionKey: "medicineAbroad.courses.mbbsDescription",
    description: "Medicine programs for Indian students studying overseas.",
  },
  {
    value: "BDS",
    labelKey: "medicineAbroad.courses.bds",
    fallback: "BDS",
    descriptionKey: "medicineAbroad.courses.bdsDescription",
    description: "Dental programs from abroad universities and institutes.",
  },
];

export const ABROAD_FEE_RANGES = [
  {
    value: "any",
    labelKey: "medicineAbroad.filters.anyFee",
    fallback: "Any fee",
    min: 0,
    max: Number.POSITIVE_INFINITY,
  },
  {
    value: "under-20-lakh",
    labelKey: "medicineAbroad.filters.underTwentyLakh",
    fallback: "Under 20 lakh",
    min: 0,
    max: 2000000,
  },
  {
    value: "20-35-lakh",
    labelKey: "medicineAbroad.filters.twentyToThirtyFiveLakh",
    fallback: "20 to 35 lakh",
    min: 2000000,
    max: 3500000,
  },
  {
    value: "35-50-lakh",
    labelKey: "medicineAbroad.filters.thirtyFiveToFiftyLakh",
    fallback: "35 to 50 lakh",
    min: 3500000,
    max: 5000000,
  },
  {
    value: "above-50-lakh",
    labelKey: "medicineAbroad.filters.aboveFiftyLakh",
    fallback: "Above 50 lakh",
    min: 5000000,
    max: Number.POSITIVE_INFINITY,
  },
];

export const ABROAD_RANKING_RANGES = [
  {
    value: "any",
    labelKey: "medicineAbroad.filters.anyRanking",
    fallback: "Any ranking",
    max: Number.POSITIVE_INFINITY,
  },
  {
    value: "top-1000",
    labelKey: "medicineAbroad.filters.topThousand",
    fallback: "Top 1000",
    max: 1000,
  },
  {
    value: "top-5000",
    labelKey: "medicineAbroad.filters.topFiveThousand",
    fallback: "Top 5000",
    max: 5000,
  },
  {
    value: "top-10000",
    labelKey: "medicineAbroad.filters.topTenThousand",
    fallback: "Top 10000",
    max: 10000,
  },
];

export const ABROAD_FILTER_DEFAULTS = {
  search: "",
  courseTypes: [],
  countries: [],
  feeRange: "any",
  hostel: null,
  scholarship: null,
  rankingRange: "any",
};

export const ABROAD_LANDING_STATS = [
  {
    value: "15+",
    labelKey: "medicineAbroad.landing.stats.countries",
    fallback: "countries",
  },
  {
    value: "2",
    labelKey: "medicineAbroad.landing.stats.courses",
    fallback: "course tracks",
  },
  {
    value: "6",
    labelKey: "medicineAbroad.landing.stats.checks",
    fallback: "decision checks",
  },
  {
    value: "24x7",
    labelKey: "medicineAbroad.landing.stats.support",
    fallback: "student support",
  },
];

export const ABROAD_LANDING_FEATURES = [
  {
    titleKey: "medicineAbroad.landing.features.recognitionTitle",
    title: "Recognition-first shortlisting",
    textKey: "medicineAbroad.landing.features.recognitionText",
    text: "Check NMC, WHO, ECFMG, and local licensing signals before comparing fee packages.",
    icon: "shield",
  },
  {
    titleKey: "medicineAbroad.landing.features.budgetTitle",
    title: "Budget clarity",
    textKey: "medicineAbroad.landing.features.budgetText",
    text: "Compare tuition, hostel, scholarship, and total-cost signals without mixing them.",
    icon: "currency",
  },
  {
    titleKey: "medicineAbroad.landing.features.supportTitle",
    title: "Indian student readiness",
    textKey: "medicineAbroad.landing.features.supportText",
    text: "Prioritize universities with hostel, food, documentation, visa, and student-support context.",
    icon: "users",
  },
];

export const ABROAD_HIGHLIGHTS = [
  {
    titleKey: "medicineAbroad.landing.highlights.durationTitle",
    title: "5 to 6 year programs",
    textKey: "medicineAbroad.landing.highlights.durationText",
    text: "Review program duration, internship rules, and language of instruction in one profile.",
  },
  {
    titleKey: "medicineAbroad.landing.highlights.eligibilityTitle",
    title: "NEET and eligibility checks",
    textKey: "medicineAbroad.landing.highlights.eligibilityText",
    text: "Keep NEET qualification, PCB marks, age, and documentation requirements visible.",
  },
  {
    titleKey: "medicineAbroad.landing.highlights.hostelTitle",
    title: "Hostel and safety context",
    textKey: "medicineAbroad.landing.highlights.hostelText",
    text: "Shortlist with accommodation, Indian food, campus support, and travel context.",
  },
];

export const ABROAD_DETAIL_TABS = [
  {
    value: "overview",
    labelKey: "medicineAbroad.detail.tabs.overview",
    fallback: "Overview",
  },
  {
    value: "fees",
    labelKey: "medicineAbroad.detail.tabs.fees",
    fallback: "Fees",
  },
  {
    value: "hostel",
    labelKey: "medicineAbroad.detail.tabs.hostel",
    fallback: "Hostel",
  },
  {
    value: "eligibility",
    labelKey: "medicineAbroad.detail.tabs.eligibility",
    fallback: "Eligibility",
  },
  {
    value: "recognition",
    labelKey: "medicineAbroad.detail.tabs.recognition",
    fallback: "Recognition",
  },
  {
    value: "facilities",
    labelKey: "medicineAbroad.detail.tabs.facilities",
    fallback: "Facilities",
  },
  {
    value: "gallery",
    labelKey: "medicineAbroad.detail.tabs.gallery",
    fallback: "Gallery",
  },
  {
    value: "contact",
    labelKey: "medicineAbroad.detail.tabs.contact",
    fallback: "Contact",
  },
];
