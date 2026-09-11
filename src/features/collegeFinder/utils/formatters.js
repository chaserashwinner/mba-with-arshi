export const normalizeToken = (value = "") =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export const createSlug = (value = "") =>
  normalizeToken(value)
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const titleFromSlug = (slug = "") =>
  String(slug)
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const normalizeCourse = (course = "") => {
  const normalized = normalizeToken(course).toUpperCase();
  if (normalized === "MBBS" || normalized === "BDS") return normalized;
  return "";
};

export const getCollegeDetailRoute = (college) =>
  `/college/${college.slug}/${college.id}`;

export const formatCurrency = (amount) => {
  const numericAmount = Number(amount || 0);

  if (!numericAmount) return "N/A";

  if (numericAmount >= 10000000) {
    return `Rs. ${(numericAmount / 10000000).toFixed(1)} Cr`;
  }

  if (numericAmount >= 100000) {
    return `Rs. ${(numericAmount / 100000).toFixed(1)} L`;
  }

  return `Rs. ${new Intl.NumberFormat("en-IN").format(numericAmount)}`;
};

export const formatFeeRange = (fees) => {
  if (!fees) return "N/A";

  if (fees.annualMin === fees.annualMax) {
    return formatCurrency(fees.annualMin);
  }

  return `${formatCurrency(fees.annualMin)} - ${formatCurrency(fees.annualMax)}`;
};

export const formatSeats = (seats, course = "") => {
  if (!seats) return 0;

  if (typeof seats === "number") return seats;

  const courseKey = normalizeCourse(course);
  if (courseKey && seats[courseKey]) return seats[courseKey];

  return seats.total || 0;
};

export const getPrimaryCourse = (college) => college?.courseTypes?.[0] || "";

export const getCoursesLabel = (college) =>
  (college?.courseTypes || []).join(", ");

export const getCollegeSearchText = (college) =>
  [
    college.name,
    college.shortName,
    college.state,
    college.city,
    college.ownership,
    college.collegeType,
    college.counsellingType,
    getCoursesLabel(college),
  ]
    .filter(Boolean)
    .join(" ");

export const uniqueBy = (items, getKey) => {
  const seen = new Set();

  return items.filter((item) => {
    const key = typeof getKey === "function" ? getKey(item) : item[getKey];
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const sortByRanking = (colleges) =>
  [...colleges].sort((a, b) => {
    const rankA = a.ranking?.studentKhabri || a.ranking?.nirf || 9999;
    const rankB = b.ranking?.studentKhabri || b.ranking?.nirf || 9999;
    return rankA - rankB;
  });
