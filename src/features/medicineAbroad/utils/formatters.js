const URL_PROTOCOL_PATTERN = /^https?:\/\//i;

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

export const normalizeAbroadCourse = (course = "") => {
  const normalized = normalizeToken(course).toUpperCase();
  if (normalized === "MBBS" || normalized === "BDS") return normalized;
  return "";
};

export const normalizeRouteParam = (value) =>
  Array.isArray(value) ? value[0] || "" : value || "";

export const parseList = (value) => {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => parseList(item))
      .filter(Boolean);
  }

  if (value === null || value === undefined) return [];

  if (typeof value === "object") {
    return parseList(
      value.name ||
        value.label ||
        value.title ||
        value.value ||
        value.text ||
        value.service ||
        "",
    );
  }

  return String(value)
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export const parseBoolean = (value) => {
  if (value === true || value === false) return value;
  if (value === null || value === undefined || value === "") return null;

  const normalized = normalizeToken(value);
  if (["yes", "true", "1", "available", "included"].includes(normalized)) {
    return true;
  }
  if (["no", "false", "0", "not-available", "unavailable"].includes(normalized)) {
    return false;
  }

  return null;
};

export const toNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;

  const normalized = String(value).replace(/[^0-9.]/g, "");
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (amount, currency = "INR") => {
  const numericAmount = toNumber(amount);
  if (!numericAmount) return "N/A";

  if (currency === "INR") {
    if (numericAmount >= 10000000) {
      return `Rs. ${(numericAmount / 10000000).toFixed(1)} Cr`;
    }

    if (numericAmount >= 100000) {
      return `Rs. ${(numericAmount / 100000).toFixed(1)} L`;
    }

    return `Rs. ${new Intl.NumberFormat("en-IN").format(numericAmount)}`;
  }

  return `${currency} ${new Intl.NumberFormat("en-IN").format(numericAmount)}`;
};

export const formatFeeRange = (fees = {}) => {
  const currency = fees.currency || "INR";
  const totalItem = (fees.items || []).find((item) =>
    /total|overall|estimated/i.test(item?.label || ""),
  );
  const itemTotal =
    toNumber(totalItem?.amount) ||
    (fees.items || []).reduce(
      (total, item) => total + toNumber(item?.amount),
      0,
    );
  const min = fees.totalMin || fees.annualMin || itemTotal || fees.tuitionMin || 0;
  const max = fees.totalMax || fees.annualMax || min;

  if (!min && !max) return "N/A";
  if (min === max || !max) return formatCurrency(min, currency);

  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
};

export const getComparableFee = (college = {}) =>
  college.fees?.totalMin ||
  college.fees?.annualMin ||
  toNumber(
    (college.fees?.items || []).find((item) =>
      /total|overall|estimated/i.test(item?.label || ""),
    )?.amount,
  ) ||
  (college.fees?.items || []).reduce(
    (total, item) => total + toNumber(item?.amount),
    0,
  ) ||
  college.fees?.tuitionMin ||
  college.fees?.hostelMin ||
  0;

export const getAbroadCollegeDetailRoute = (college = {}) =>
  `/medicine-abroad/college/${college.slug || createSlug(college.name)}/${college.id}`;

export const getCountryRoute = (country = "") =>
  `/medicine-abroad/colleges/country/${createSlug(country)}`;

export const getCourseRoute = (course = "") =>
  `/medicine-abroad/colleges/course/${normalizeAbroadCourse(course).toLowerCase()}`;

export const getCourseCountryRoute = (course = "", country = "") =>
  `/medicine-abroad/colleges/course/${normalizeAbroadCourse(course).toLowerCase()}/country/${createSlug(country)}`;

export const getPrimaryCourse = (college) => college?.courseTypes?.[0] || "";

export const getCoursesLabel = (college) =>
  (college?.courseTypes || []).join(", ") || "N/A";

export const getCountryLabel = (country = "") =>
  String(country || "").trim() || "N/A";

export const normalizeOptionalImageUrl = (value = "") => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("/") || URL_PROTOCOL_PATTERN.test(trimmed)) return trimmed;
  return trimmed;
};

export const normalizeImageUrl = (value = "") =>
  normalizeOptionalImageUrl(value) || "/placeholder/college_thumbnail.jpg";

export const getRankingValue = (college = {}) =>
  college.ranking?.world ||
  college.ranking?.country ||
  college.ranking?.studentKhabri ||
  college.ranking?.display ||
  0;

export const getRankingLabel = (college = {}) => {
  const rank = getRankingValue(college);
  return rank ? `#${rank}` : "N/A";
};

export const getAbroadCollegeSearchText = (college = {}) =>
  [
    college.name,
    college.shortName,
    college.country,
    college.city,
    college.universityType,
    college.medium,
    getCoursesLabel(college),
    ...(college.recognition || []),
    ...(college.facilities || []),
  ]
    .filter(Boolean)
    .join(" ");

export const sortByRanking = (colleges = []) =>
  [...colleges].sort((a, b) => {
    const rankA = getRankingValue(a) || 999999;
    const rankB = getRankingValue(b) || 999999;
    return rankA - rankB;
  });
