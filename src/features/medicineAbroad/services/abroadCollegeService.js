import { $api } from "@/composables/api";
import {
  ABROAD_COURSES,
  MEDICINE_ABROAD_ENDPOINTS,
} from "../constants/medicineAbroadConstants";
import {
  createSlug,
  normalizeAbroadCourse,
  normalizeImageUrl,
  normalizeOptionalImageUrl,
  parseBoolean,
  parseList,
  sortByRanking,
  toNumber,
} from "../utils/formatters";

let resolvedEndpoint = "";

const unwrapApiResponse = (response) => response?.obj ?? response;

const isAbortError = (error) =>
  error?.name === "AbortError" || error?.cause?.name === "AbortError";

const isNotFoundError = (error) =>
  error?.status === 404 ||
  error?.statusCode === 404 ||
  error?.response?.status === 404;

const requestAbroadApi = async (path = "", options = {}) => {
  const endpoints = resolvedEndpoint
    ? [
        resolvedEndpoint,
        ...MEDICINE_ABROAD_ENDPOINTS.filter((endpoint) => endpoint !== resolvedEndpoint),
      ]
    : MEDICINE_ABROAD_ENDPOINTS;

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await $api(`${endpoint}${path}`, options);
      resolvedEndpoint = endpoint;
      return response;
    } catch (error) {
      if (isAbortError(error)) throw error;
      lastError = error;
      if (!isNotFoundError(error)) throw error;
    }
  }

  throw lastError;
};

const getFirstValue = (raw, keys = []) => {
  for (const key of keys) {
    const value = key
      .split(".")
      .reduce((current, part) => current?.[part], raw);

    if (value !== undefined && value !== null && value !== "") return value;
  }

  return "";
};

const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

const cleanText = (value = "") => String(value || "").trim();

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
};

const uniqueBy = (items = [], getKey = (item) => item) => {
  const seen = new Set();

  return items.filter((item) => {
    const key = getKey(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const normalizeCourses = (raw) => {
  const values = [
    ...parseList(raw.courseTypes),
    ...parseList(raw.courses),
    ...parseList(raw.course),
    ...parseList(raw.programs),
    ...parseList(raw.program),
  ]
    .map((course) => normalizeAbroadCourse(course?.name || course))
    .filter(Boolean);

  return [...new Set(values)];
};

const normalizeFeeItem = (item, fallbackCurrency = "USD") => {
  if (!isPlainObject(item)) {
    const label = cleanText(item);
    return label
      ? {
          label,
          amount: 0,
          period: "",
          currency: fallbackCurrency,
        }
      : null;
  }

  const label = cleanText(item.label || item.name || item.title);
  if (!label) return null;

  return {
    label,
    amount: toNumber(item.amount ?? item.fee ?? item.value ?? item.cost),
    period: cleanText(item.period || item.duration || item.type || ""),
    currency: cleanText(item.currency || fallbackCurrency).toUpperCase(),
  };
};

const normalizeFeeItems = (value, fallbackCurrency = "USD") =>
  toArray(value)
    .flatMap((item) => (Array.isArray(item) ? item : [item]))
    .map((item) => normalizeFeeItem(item, fallbackCurrency))
    .filter(Boolean);

const getFeeItemsTotal = (items = []) => {
  const totalItem = items.find((item) =>
    /total|overall|estimated/i.test(item.label || ""),
  );

  if (totalItem?.amount) return totalItem.amount;

  return items.reduce((total, item) => total + toNumber(item.amount), 0);
};

const normalizeFees = (raw) => {
  const fees = raw.fees || raw.fee || {};
  const feeStructure = raw.feeStructure || {};
  const currency =
    feeStructure.currency ||
    fees.currency ||
    raw.currency ||
    raw.feeCurrency ||
    raw.totalFeeCurrency ||
    "USD";

  const feeItems = normalizeFeeItems(
    toArray(feeStructure.items).length ? feeStructure.items : fees.items,
    currency,
  );
  const feeItemsTotal = getFeeItemsTotal(feeItems);

  const annualMin =
    toNumber(fees.annualMin) ||
    toNumber(fees.annualFees) ||
    toNumber(fees.annual) ||
    toNumber(fees.yearly) ||
    toNumber(raw.annualFees) ||
    toNumber(raw.annualFee) ||
    toNumber(raw.yearlyFees);
  const annualMax =
    toNumber(fees.annualMax) ||
    toNumber(fees.annualFeesMax) ||
    toNumber(raw.annualFeeMax) ||
    annualMin;
  const tuitionMin =
    toNumber(fees.tuitionMin) ||
    toNumber(fees.tuitionFees) ||
    toNumber(fees.tuition) ||
    toNumber(raw.tuitionFees) ||
    toNumber(raw.tuitionFee) ||
    toNumber(raw.tuitionFees);
  const tuitionMax =
    toNumber(fees.tuitionMax) ||
    toNumber(fees.tuitionFeesMax) ||
    toNumber(raw.tuitionFeeMax) ||
    tuitionMin;
  const hostelMin =
    toNumber(fees.hostelMin) ||
    toNumber(fees.hostelFees) ||
    toNumber(fees.hostel) ||
    toNumber(raw.hostelFees) ||
    toNumber(raw.hostelFee) ||
    toNumber(raw.hostelFees);
  const hostelMax =
    toNumber(fees.hostelMax) ||
    toNumber(fees.hostelFeesMax) ||
    toNumber(raw.hostelFeeMax) ||
    hostelMin;
  const totalMin =
    toNumber(fees.totalMin) ||
    toNumber(fees.totalFees) ||
    toNumber(fees.total) ||
    toNumber(raw.totalFees) ||
    toNumber(raw.totalFee) ||
    toNumber(raw.totalFees);
  const totalMax =
    toNumber(fees.totalMax) ||
    toNumber(fees.totalFeesMax) ||
    toNumber(raw.totalFeeMax) ||
    totalMin;

  return {
    currency,
    annualMin,
    annualMax,
    tuitionMin,
    tuitionMax,
    hostelMin,
    hostelMax,
    totalMin: totalMin || annualMin || feeItemsTotal || tuitionMin,
    totalMax:
      totalMax ||
      annualMax ||
      totalMin ||
      annualMin ||
      feeItemsTotal ||
      tuitionMax ||
      tuitionMin,
    summary: feeStructure.summary || fees.summary || "",
    notes: feeStructure.notes || fees.notes || raw.feeNotes || raw.feesNote || "",
    items: feeItems,
  };
};

const normalizeRanking = (raw) => {
  const ranking = raw.ranking || raw.rank || {};
  const world =
    toNumber(ranking.world) ||
    toNumber(ranking.global) ||
    toNumber(raw.worldRanking) ||
    toNumber(raw.globalRanking);
  const country =
    toNumber(ranking.country) ||
    toNumber(ranking.national) ||
    toNumber(raw.countryRanking) ||
    toNumber(raw.nationalRanking);
  const studentKhabri =
    toNumber(ranking.studentKhabri) ||
    toNumber(raw.studentKhabriRanking) ||
    toNumber(raw.skRanking);
  const display =
    toNumber(ranking.display) ||
    toNumber(ranking.value) ||
    toNumber(raw.ranking) ||
    world ||
    country ||
    studentKhabri;

  return {
    world,
    country,
    studentKhabri,
    display,
    source: ranking.source || raw.rankingSource || "",
  };
};

const normalizeContact = (raw) => {
  const contact = raw.contact || {};
  const contactInfo = raw.contactInfo || {};

  return {
    phone: contactInfo.phone || contact.phone || raw.phone || raw.contactPhone || "",
    email: contactInfo.email || contact.email || raw.email || raw.contactEmail || "",
    whatsapp: contactInfo.whatsapp || contact.whatsapp || raw.whatsapp || "",
    address:
      contactInfo.address ||
      contact.address ||
      raw.address ||
      "",
  };
};

const normalizeHostel = (raw, fees) => {
  const hostel = raw.hostel || raw.accommodation || {};
  const available =
    parseBoolean(hostel.available) ??
    parseBoolean(raw.hostelAvailable) ??
    parseBoolean(raw.hostel);

  return {
    available: available ?? null,
    feeMin: toNumber(hostel.feeMin) || toNumber(hostel.fees) || fees.hostelMin,
    feeMax: toNumber(hostel.feeMax) || toNumber(hostel.fees) || fees.hostelMax,
    details:
      hostel.details ||
      hostel.accommodation ||
      raw.hostelDetails ||
      raw.accommodationDetails ||
      "",
    accommodation: hostel.accommodation || "",
    food: hostel.food || "",
    notes: hostel.notes || "",
  };
};

const normalizeTextItems = (...values) =>
  values
    .flatMap((value) => {
      if (Array.isArray(value)) return value.flatMap((item) => normalizeTextItems(item));
      if (value === undefined || value === null || value === "") return [];
      if (isPlainObject(value)) {
        return normalizeTextItems(
          value.details,
          value.description,
          value.text,
          value.summary,
          value.counselorSupport,
          value.community,
          value.services,
        );
      }

      return String(value)
        .split(/\n|;|\|/)
        .map((item) => item.trim())
        .filter(Boolean);
    })
    .filter(Boolean);

const normalizeWebsiteLinks = (raw) => {
  const links = toArray(raw.websiteLinks)
    .map((item, index) => {
      if (isPlainObject(item)) {
        return {
          label: cleanText(item.label || item.name || item.title || `Link ${index + 1}`),
          url: cleanText(item.url || item.href || item.link),
        };
      }

      const url = cleanText(item);
      return url ? { label: "Website", url } : null;
    })
    .filter((item) => item?.url);

  const website = cleanText(raw.website || raw.officialWebsite || raw.url);
  if (website && !links.some((link) => link.url === website)) {
    links.unshift({ label: "Website", url: website });
  }

  return links;
};

const normalizeGalleryItem = (item) => {
  if (isPlainObject(item)) {
    const url = normalizeOptionalImageUrl(item.url || item.src || item.image || item.path);
    if (!url) return null;

    return {
      url,
      alt: cleanText(item.alt),
      title: cleanText(item.title),
      caption: cleanText(item.caption),
    };
  }

  const url = normalizeOptionalImageUrl(item);
  return url
    ? {
        url,
        alt: "",
        title: "",
        caption: "",
      }
    : null;
};

const normalizeGalleryItems = (raw) =>
  uniqueBy(
    [
      ...toArray(raw.galleryItems),
      ...toArray(raw.gallery),
      ...toArray(raw.images),
      ...toArray(raw.photos),
    ]
      .flatMap((item) => (Array.isArray(item) ? item : [item]))
      .map(normalizeGalleryItem)
      .filter(Boolean),
    (item) => item.url,
  );

export const normalizeAbroadCollege = (raw = {}) => {
  const id = raw.id || raw._id || raw.collegeId || raw.uuid || "";
  const name = raw.name || raw.collegeName || raw.universityName || "Unnamed university";
  const country =
    getFirstValue(raw, ["country", "location.country", "nation"]) || "N/A";
  const city = getFirstValue(raw, ["city", "location.city"]) || "";
  const courseTypes = normalizeCourses(raw);
  const fees = normalizeFees(raw);
  const hostel = normalizeHostel(raw, fees);
  const scholarship =
    parseBoolean(raw.scholarshipAvailable) ??
    parseBoolean(raw.scholarship) ??
    parseBoolean(raw.hasScholarship);
  const thumbnail = normalizeImageUrl(
    raw.thumbnail ||
      raw.image ||
      raw.logo ||
      raw.icon ||
      raw.banner ||
      raw.coverImage,
  );
  const banner = normalizeImageUrl(
    raw.banner || raw.coverImage || raw.thumbnail || raw.image,
  );
  const rawGalleryItems = normalizeGalleryItems(raw);
  const DEFAULT_PLACEHOLDERS = [
    "/home/medical.png",
    "/home/college.png",
    "/home/choice-tool-medical.png",
    "/placeholder/college_thumbnail.jpg",
  ];
  let galleryItems = rawGalleryItems.filter(
    (item) => item.url && item.url !== thumbnail && item.url !== banner
  );
  const hasCustomImages = galleryItems.some(
    (item) => !DEFAULT_PLACEHOLDERS.includes(item.url)
  );
  if (hasCustomImages) {
    galleryItems = galleryItems.filter(
      (item) => !DEFAULT_PLACEHOLDERS.includes(item.url)
    );
  }
  const websiteLinks = normalizeWebsiteLinks(raw);

  return {
    ...raw,
    id,
    slug: raw.slug || createSlug(name),
    name,
    shortName: raw.shortName || raw.acronym || name,
    country,
    city,
    courseTypes,
    universityType: raw.universityType || raw.ownership || raw.type || "",
    medium:
      raw.medium ||
      raw.language ||
      raw.coursesOffered?.find?.((course) => course?.medium)?.medium ||
      "",
    duration: raw.duration || raw.courseDuration || "",
    established: raw.established || raw.establishedYear || "",
    rating: raw.rating || raw.score || "",
    fees,
    hostel,
    scholarshipAvailable: scholarship ?? false,
    scholarshipText: raw.scholarshipText || raw.scholarshipDetails || "",
    ranking: normalizeRanking(raw),
    recognition: parseList(raw.recognition || raw.recognitions || raw.accreditation),
    facilities: parseList(raw.facilities || raw.campusFacilities),
    eligibility: normalizeTextItems(raw.eligibility, raw.eligibilityCriteria, raw.eligibilityDetails),
    indianStudentSupport: normalizeTextItems(
      raw.indianStudentSupport ||
        raw.indianSupport ||
        raw.studentSupport ||
        raw.support,
    ),
    contact: normalizeContact(raw),
    website: raw.website || raw.officialWebsite || raw.url || "",
    websiteLinks,
    thumbnail,
    banner,
    gallery: galleryItems.map((item) => item.url),
    galleryItems,
    summary: raw.summary || raw.description || raw.overview || "",
    description: raw.overview || raw.description || raw.summary || "",
    disclaimer: raw.disclaimer || raw.disclaimerText || raw.metadata?.disclaimer || "",
    updatedAt: raw.updatedAt || raw.updated || raw.createdAt || raw.created || "",
  };
};

const normalizePagination = (payload, data) => {
  const pagination = payload?.pagination || payload?.meta || {};
  const page = Number(pagination.page || payload?.page || 1);
  const limit = Number(pagination.limit || payload?.limit || data.length || 20);
  const total = Number(
    pagination.total ||
      pagination.totalItems ||
      payload?.total ||
      payload?.count ||
      data.length,
  );
  const totalPages = Number(
    pagination.totalPages ||
      pagination.pages ||
      payload?.totalPages ||
      Math.ceil(total / Math.max(limit, 1)) ||
      1,
  );

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: Boolean(
      pagination.hasNextPage ??
        pagination.hasNext ??
        payload?.hasNextPage ??
        page < totalPages,
    ),
    hasPrevPage: Boolean(
      pagination.hasPrevPage ??
        pagination.hasPreviousPage ??
        pagination.hasPrev ??
        payload?.hasPrevPage ??
        page > 1,
    ),
  };
};

const normalizeListResponse = (payload) => {
  const unwrapped = unwrapApiResponse(payload);

  if (Array.isArray(unwrapped)) {
    const data = unwrapped.map(normalizeAbroadCollege);

    return {
      success: true,
      data,
      items: data,
      pagination: {
        page: 1,
        limit: data.length,
        total: data.length,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  const rawData = Array.isArray(unwrapped?.data)
    ? unwrapped.data
    : Array.isArray(unwrapped?.items)
      ? unwrapped.items
      : Array.isArray(unwrapped?.results)
        ? unwrapped.results
        : Array.isArray(unwrapped?.colleges)
          ? unwrapped.colleges
          : Array.isArray(unwrapped?.docs)
            ? unwrapped.docs
            : [];
  const data = rawData.map(normalizeAbroadCollege);

  return {
    success: unwrapped?.success !== false,
    data,
    items: data,
    pagination: normalizePagination(unwrapped, data),
  };
};

const normalizeCollegePayload = (payload) => {
  const unwrapped = unwrapApiResponse(payload);
  const college =
    unwrapped?.data ||
    unwrapped?.item ||
    unwrapped?.college ||
    unwrapped?.result ||
    unwrapped;

  return college ? normalizeAbroadCollege(college) : null;
};

const toParamValue = (value) =>
  Array.isArray(value) ? value.filter(Boolean).join(",") : value;

const buildListParams = (params = {}) => {
  const search = String(params.search || "").trim();
  const courseType = params.courseType || params.course;

  return {
    limit: params.limit || 20,
    page: params.page || 1,
    ...(courseType ? { courseType: toParamValue(courseType) } : {}),
    ...(params.country ? { country: toParamValue(params.country) } : {}),
    ...(params.fee || params.feeRange ? { fee: params.fee || params.feeRange } : {}),
    ...(params.hostel !== undefined && params.hostel !== null
      ? { hostel: params.hostel }
      : {}),
    ...(params.scholarship !== undefined && params.scholarship !== null
      ? { scholarship: params.scholarship }
      : {}),
    ...(params.ranking || params.rankingRange
      ? { ranking: params.ranking || params.rankingRange }
      : {}),
    ...(params.featured !== undefined ? { featured: params.featured } : {}),
    ...(search.length >= 2 ? { search } : {}),
    ...(params.sortBy ? { sortBy: params.sortBy } : {}),
    ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
  };
};

const normalizeCountriesPayload = (payload) => {
  const unwrapped = unwrapApiResponse(payload);
  const items = Array.isArray(unwrapped)
    ? unwrapped
    : Array.isArray(unwrapped?.data)
      ? unwrapped.data
      : Array.isArray(unwrapped?.items)
        ? unwrapped.items
        : Array.isArray(unwrapped?.countries)
          ? unwrapped.countries
          : [];

  return items
    .map((item) => {
      if (typeof item === "string") {
        return {
          name: item,
          slug: createSlug(item),
          count: 0,
        };
      }

      const name = item.name || item.country || item.label || "";

      return {
        ...item,
        name,
        slug: item.slug || createSlug(name),
        count: Number(item.count || item.total || item.colleges || 0),
      };
    })
    .filter((item) => item.name);
};

const normalizeCoursesPayload = (payload) => {
  const unwrapped = unwrapApiResponse(payload);
  const items = Array.isArray(unwrapped)
    ? unwrapped
    : Array.isArray(unwrapped?.data)
      ? unwrapped.data
      : Array.isArray(unwrapped?.items)
        ? unwrapped.items
        : Array.isArray(unwrapped?.courses)
          ? unwrapped.courses
          : [];
  const courses = items
    .map((item) => {
      const value = typeof item === "string"
        ? item
        : item.name || item.course || item.value || item.label;

      return normalizeAbroadCourse(value);
    })
    .filter(Boolean);

  return [...new Set(courses)];
};

export const medicineAbroadService = {
  async getColleges(params = {}, options = {}) {
    const response = await requestAbroadApi("", {
      method: "GET",
      params: buildListParams(params),
      ...options,
    });

    return normalizeListResponse(response);
  },

  async getCollegeList(params = {}, options = {}) {
    return this.getColleges(params, options);
  },

  async getCollegeById(id, options = {}) {
    if (!id) return null;

    const response = await requestAbroadApi(`/${id}`, {
      method: "GET",
      ...options,
    });

    return normalizeCollegePayload(response);
  },

  async getCollegeBySlug(slug, options = {}) {
    if (!slug) return null;

    const response = await requestAbroadApi(`/slug/${slug}`, {
      method: "GET",
      ...options,
    });

    return normalizeCollegePayload(response);
  },

  async getCollegeBySlugAndId(slug, id, options = {}) {
    if (!slug || !id) return null;

    const response = await requestAbroadApi(`/college/${slug}/${id}`, {
      method: "GET",
      ...options,
    });

    return normalizeCollegePayload(response);
  },

  async getFeaturedColleges({ course, country, limit = 4 } = {}, options = {}) {
    const normalizedCourse = normalizeAbroadCourse(course);
    const response = await requestAbroadApi("/featured", {
      method: "GET",
      params: buildListParams({
        limit,
        featured: true,
        courseType: normalizedCourse || undefined,
        country,
      }),
      ...options,
    });

    return sortByRanking(normalizeListResponse(response).data);
  },

  async searchColleges(search, params = {}, options = {}) {
    const response = await requestAbroadApi("/search", {
      method: "GET",
      params: buildListParams({
        ...params,
        search,
        limit: params.limit || 20,
      }),
      ...options,
    });

    return normalizeListResponse(response);
  },

  async getCountries(params = {}, options = {}) {
    const response = await requestAbroadApi("/countries", {
      method: "GET",
      params: buildListParams({
        ...params,
        limit: 1,
      }),
      ...options,
    });

    return normalizeCountriesPayload(response);
  },

  async getCourses(params = {}, options = {}) {
    const response = await requestAbroadApi("/courses", {
      method: "GET",
      params: buildListParams({
        ...params,
        limit: 1,
      }),
      ...options,
    });

    return normalizeCoursesPayload(response);
  },

  async getFilterOptions(params = {}, options = {}) {
    const [countries, courses] = await Promise.all([
      this.getCountries(params, options).catch((error) => {
        if (isAbortError(error)) throw error;
        return [];
      }),
      this.getCourses(params, options).catch((error) => {
        if (isAbortError(error)) throw error;
        return [];
      }),
    ]);

    return {
      countries,
      courses: courses.length ? courses : ABROAD_COURSES.map((course) => course.value),
    };
  },
};

export const abroadCollegeService = medicineAbroadService;
