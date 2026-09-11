import { $api } from "@/composables/api";
import { createSlug, normalizeCourse, sortByRanking } from "../utils/formatters";

const unwrapApiResponse = (response) => response?.obj ?? response;

const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

const cleanText = (value = "") => String(value || "").trim();

const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
};

const getGalleryItemUrl = (item = {}) =>
  item.url ||
  item.src ||
  item.image ||
  item.imageUrl ||
  item.cdnUrl ||
  item.secureUrl ||
  item.secure_url ||
  item.fileUrl ||
  item.assetUrl ||
  item.location ||
  item.Location ||
  item.path ||
  "";

const normalizeOptionalImageUrl = (value = "") => {
  const source = isPlainObject(value) ? getGalleryItemUrl(value) : value;
  return cleanText(source);
};

const normalizeImageUrl = (value = "") =>
  normalizeOptionalImageUrl(value) || "/placeholder/college_thumbnail.jpg";

const uniqueBy = (items = [], getKey = (item) => item) => {
  const seen = new Set();

  return items.filter((item) => {
    const key = getKey(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const normalizeGalleryItem = (item) => {
  if (isPlainObject(item)) {
    const url = normalizeOptionalImageUrl(getGalleryItemUrl(item));
    if (!url) return null;

    return {
      ...item,
      url,
      alt: cleanText(item.alt || item.altText),
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

const normalizeGalleryItems = (raw = {}) =>
  uniqueBy(
    [
      ...toArray(raw.galleryItems),
      ...toArray(raw.galleryImages),
      ...toArray(raw.gallery),
      ...toArray(raw.images),
      ...toArray(raw.photos),
    ]
      .flatMap((item) => (Array.isArray(item) ? item : [item]))
      .map(normalizeGalleryItem)
      .filter(Boolean),
    (item) => item.url,
  );

const normalizeCollege = (raw = {}) => {
  if (!isPlainObject(raw)) return raw;

  const name = raw.name || raw.collegeName || raw.title || "Unnamed college";
  const thumbnail = normalizeImageUrl(
    raw.thumbnail ||
      raw.thumbnailUrl ||
      raw.image ||
      raw.imageUrl ||
      raw.logo ||
      raw.icon ||
      raw.banner ||
      raw.bannerUrl ||
      raw.coverImage,
  );
  const banner = normalizeImageUrl(
    raw.banner ||
      raw.bannerUrl ||
      raw.coverImage ||
      raw.heroImage ||
      raw.thumbnail ||
      raw.thumbnailUrl ||
      raw.image ||
      raw.imageUrl,
  );
  const galleryItems = normalizeGalleryItems(raw);

  return {
    ...raw,
    id: raw.id || raw._id || raw.collegeId || "",
    slug: raw.slug || createSlug(name),
    name,
    shortName: raw.shortName || raw.acronym || raw.abbreviation || name,
    thumbnail,
    banner,
    gallery: galleryItems.map((item) => item.url),
    galleryItems,
  };
};

const normalizeListResponse = (payload) => {
  const unwrapped = unwrapApiResponse(payload);

  if (Array.isArray(unwrapped)) {
    const data = unwrapped.map(normalizeCollege);

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

  const data = Array.isArray(unwrapped?.data)
    ? unwrapped.data
    : Array.isArray(unwrapped?.items)
      ? unwrapped.items
      : Array.isArray(unwrapped?.results)
        ? unwrapped.results
        : [];
  const normalizedData = data.map(normalizeCollege);

  return {
    success: unwrapped?.success !== false,
    data: normalizedData,
    items: normalizedData,
    pagination: unwrapped?.pagination || {
      page: 1,
      limit: normalizedData.length,
      total: normalizedData.length,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  };
};

const normalizeListPayload = (payload) =>
  normalizeListResponse(payload).data;

const normalizeCollegePayload = (payload) => {
  const unwrapped = unwrapApiResponse(payload);
  const college =
    unwrapped?.data ||
    unwrapped?.item ||
    unwrapped?.college ||
    unwrapped?.result ||
    unwrapped;

  return college ? normalizeCollege(college) : null;
};

const toParamValue = (value) =>
  Array.isArray(value) ? value.filter(Boolean).join(",") : value;

const buildListParams = (params = {}) => {
  const search = String(params.search || "").trim();

  return {
    limit: params.limit || 20,
    page: params.page || 1,
    ...(params.courseType ? { courseType: toParamValue(params.courseType) } : {}),
    ...(params.state ? { state: toParamValue(params.state) } : {}),
    ...(params.ownership ? { ownership: toParamValue(params.ownership) } : {}),
    ...(params.collegeType ? { collegeType: toParamValue(params.collegeType) } : {}),
    ...(params.counsellingType ? { counsellingType: toParamValue(params.counsellingType) } : {}),
    ...(params.fee || params.feeRange ? { fee: params.fee || params.feeRange } : {}),
    ...(params.aiqEligible !== undefined && params.aiqEligible !== null
      ? { aiqEligible: params.aiqEligible }
      : {}),
    ...(params.featured !== undefined ? { featured: params.featured } : {}),
    ...(search.length >= 2 ? { search } : {}),
    ...(params.sortBy ? { sortBy: params.sortBy } : {}),
    ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
  };
};

export const collegeService = {
  async getCollegeList(params = {}, options = {}) {
    const response = await $api("/college", {
      method: "GET",
      params: buildListParams(params),
      ...options,
    });

    return normalizeListResponse(response);
  },

  async getColleges(params = {}, options = {}) {
    const response = await this.getCollegeList(params, options);

    return sortByRanking(response.data);
  },

  async getCollegeById(id, options = {}) {
    if (!id) return null;

    const response = await $api(`/college/${id}`, {
      method: "GET",
      ...options,
    });

    return normalizeCollegePayload(response);
  },

  async getCollegeBySlug(slug, options = {}) {
    if (!slug) return null;

    const response = await $api(`/college/slug/${slug}`, {
      method: "GET",
      ...options,
    });

    return normalizeCollegePayload(response);
  },

  async getFeaturedColleges({ course, limit = 4 } = {}, options = {}) {
    const normalizedCourse = normalizeCourse(course);
    const response = await $api("/college/featured", {
      method: "GET",
      params: {
        limit,
        ...(normalizedCourse ? { courseType: normalizedCourse } : {}),
      },
      ...options,
    });

    return normalizeListPayload(response);
  },

  async getCollegesByCourse(course, options = {}) {
    const normalizedCourse = normalizeCourse(course);
    if (!normalizedCourse) return [];

    return this.getColleges({ courseType: normalizedCourse, limit: 50 }, options);
  },

  async getCollegesByState(state, options = {}) {
    const stateSlug = createSlug(state);
    const response = await this.getCollegeList({ state, limit: 50 }, options);

    return response.data.filter((college) => createSlug(college.state) === stateSlug);
  },

  async searchColleges(search, params = {}, options = {}) {
    const response = await $api("/college/search", {
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

  async getFilterOptions(params = {}, options = {}) {
    const response = await $api("/college/filter-options", {
      method: "GET",
      params: buildListParams({
        ...params,
        limit: 1,
      }),
      ...options,
    });

    return unwrapApiResponse(response) || {
      states: [],
      ownerships: [],
      collegeTypes: [],
      counsellingTypes: [],
    };
  },

  async getCollegeStates(params = {}, options = {}) {
    const response = await $api("/college/states", {
      method: "GET",
      params: buildListParams({
        ...params,
        limit: 1,
      }),
      ...options,
    });

    return unwrapApiResponse(response) || [];
  },
};
